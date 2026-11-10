/**
 * Jetson Nano / Orin & ROS 2 Hardware Bridge Service
 * Handles real bidirectional communication with the robot's onboard Jetson computer
 * via ROSBridge WebSocket (ws://172.17.0.1:9090 or user configured IP:port).
 *
 * Implements:
 * 1. Real /cmd_vel teleoperation publishing (geometry_msgs/Twist) at 10Hz continuous rate
 * 2. Real E-STOP (Emergency Stop) command transmission
 * 3. /map (nav_msgs/OccupancyGrid) subscription and rendering
 * 4. /odom or /amcl_pose (geometry_msgs/PoseWithCovarianceStamped) subscription for live robot localization
 * 5. /goal_pose or /move_base_simple/goal (geometry_msgs/PoseStamped) for Nav2 autonomous navigation
 * 6. Telemetry logging and connection health monitoring (ping, packet counters)
 */

export interface RobotPose {
  x: number;       // meters
  y: number;       // meters
  yaw: number;     // radians
}

export interface OccupancyGrid {
  info: {
    resolution: number; // meters per pixel (e.g. 0.05)
    width: number;      // cells
    height: number;     // cells
    origin: {
      position: { x: number; y: number; z: number };
      orientation: { x: number; y: number; z: number; w: number };
    };
  };
  data: number[];       // 1D array of width * height values (-1: unknown, 0: free, 100: occupied)
}

export interface NavPathPoint {
  x: number;
  y: number;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export interface JetsonBridgeState {
  status: ConnectionStatus;
  wsUrl: string;
  pingMs: number;
  packetsSent: number;
  packetsReceived: number;
  lastError: string | null;
  robotPose: RobotPose;
  currentLinearSpeed: number;
  currentAngularSpeed: number;
  activeGoal: { x: number; y: number; label?: string } | null;
  isNavigating: boolean;
}

export type StateListener = (state: JetsonBridgeState) => void;
export type MapListener = (grid: OccupancyGrid) => void;
export type LaserScanListener = (points: Array<{ x: number; y: number }>) => void;
export type PathListener = (path: NavPathPoint[]) => void;

class JetsonBridgeService {
  private ws: WebSocket | null = null;
  private wsUrl: string = 'ws://172.17.0.1:9090';
  private reconnectTimer: any = null;
  private pingIntervalTimer: any = null;
  private teleopIntervalTimer: any = null;
  private autoReconnect: boolean = true;

  // Active teleop velocity state for continuous 10Hz loop
  private activeLinear: number = 0;
  private activeAngular: number = 0;
  private isTeleopActive: boolean = false;

  // Current State
  private state: JetsonBridgeState = {
    status: 'disconnected',
    wsUrl: 'ws://172.17.0.1:9090',
    pingMs: 0,
    packetsSent: 0,
    packetsReceived: 0,
    lastError: null,
    robotPose: { x: 0, y: 0, yaw: 0 },
    currentLinearSpeed: 0,
    currentAngularSpeed: 0,
    activeGoal: null,
    isNavigating: false
  };

  private stateListeners: Set<StateListener> = new Set();
  private mapListeners: Set<MapListener> = new Set();
  private scanListeners: Set<LaserScanListener> = new Set();
  private pathListeners: Set<PathListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem('jetson_ws_url') || localStorage.getItem('robot_ws_url');
      if (savedUrl) {
        this.wsUrl = savedUrl;
        this.state.wsUrl = savedUrl;
      }
    }
  }

  // ==========================================
  // Connection Lifecycle
  // ==========================================

  public setUrl(url: string) {
    if (!url || url === this.wsUrl) return;
    this.wsUrl = url.trim();
    this.state.wsUrl = this.wsUrl;
    if (typeof window !== 'undefined') {
      localStorage.setItem('jetson_ws_url', this.wsUrl);
    }
    this.notifyState();
    if (this.state.status === 'connected' || this.state.status === 'connecting') {
      this.reconnect();
    }
  }

  public getUrl(): string {
    return this.wsUrl;
  }

  public getState(): JetsonBridgeState {
    return { ...this.state };
  }

  public connect(url?: string) {
    if (url) {
      this.setUrl(url);
    }

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.cleanupSocket();
    this.updateStatus('connecting');

    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        this.updateStatus('connected');
        this.state.lastError = null;
        this.startPingLoop();
        this.subscribeEssentialTopics();
        this.notifyState();
      };

      this.ws.onmessage = (event) => {
        this.state.packetsReceived++;
        this.handleMessage(event.data);
      };

      this.ws.onerror = (_e) => {
        this.state.lastError = `Connection to Jetson at ${this.wsUrl} failed. Ensure ROSbridge is running (ros2 launch rosbridge_server rosbridge_websocket_launch.xml).`;
        this.updateStatus('error');
      };

      this.ws.onclose = () => {
        this.cleanupSocket();
        this.updateStatus('disconnected');
        if (this.autoReconnect) {
          this.scheduleReconnect();
        }
      };
    } catch (err: any) {
      this.state.lastError = err?.message || 'WebSocket creation error';
      this.updateStatus('error');
      if (this.autoReconnect) {
        this.scheduleReconnect();
      }
    }
  }

  public disconnect() {
    this.autoReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.stopTeleop();
    this.stopPingLoop();
    this.cleanupSocket();
    this.updateStatus('disconnected');
  }

  public reconnect() {
    this.disconnect();
    this.autoReconnect = true;
    setTimeout(() => this.connect(), 200);
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      if (this.autoReconnect && this.state.status !== 'connected') {
        this.connect();
      }
    }, 4000);
  }

  private cleanupSocket() {
    if (this.ws) {
      try {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onerror = null;
        this.ws.onclose = null;
        if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
          this.ws.close();
        }
      } catch {}
      this.ws = null;
    }
  }

  private updateStatus(status: ConnectionStatus) {
    this.state.status = status;
    this.notifyState();
  }

  // ==========================================
  // ROS Topic Subscriptions
  // ==========================================

  private subscribeEssentialTopics() {
    // 1. Subscribe to /map (nav_msgs/OccupancyGrid)
    this.sendRaw({
      op: 'subscribe',
      topic: '/map',
      throttle_rate: 1000,
      queue_length: 1
    });

    // 2. Subscribe to /amcl_pose or /odom for robot live localization
    this.sendRaw({
      op: 'subscribe',
      topic: '/amcl_pose',
      throttle_rate: 100
    });

    this.sendRaw({
      op: 'subscribe',
      topic: '/odom',
      throttle_rate: 100
    });

    // 3. Subscribe to Nav trajectory /plan
    this.sendRaw({
      op: 'subscribe',
      topic: '/plan',
      throttle_rate: 200
    });

    // 4. Subscribe to LiDAR 2D laser scan
    this.sendRaw({
      op: 'subscribe',
      topic: '/scan',
      throttle_rate: 200
    });
  }

  private handleMessage(raw: string) {
    try {
      const msg = JSON.parse(raw);

      // Standard ROSBridge protocol
      if (msg.op === 'publish' && msg.topic) {
        if (msg.topic === '/map' && msg.msg) {
          this.handleOccupancyGrid(msg.msg);
        } else if (msg.topic === '/amcl_pose' && msg.msg?.pose?.pose) {
          this.handlePoseMessage(msg.msg.pose.pose);
        } else if (msg.topic === '/odom' && msg.msg?.pose?.pose) {
          this.handlePoseMessage(msg.msg.pose.pose);
        } else if (msg.topic === '/plan' && msg.msg?.poses) {
          this.handlePathMessage(msg.msg.poses);
        } else if (msg.topic === '/scan' && msg.msg) {
          this.handleLaserScan(msg.msg);
        }
      }

      // Ping pong acknowledgment
      if (msg.op === 'pong' || msg.command === 'pong') {
        const pingEnd = performance.now();
        if (msg.timestamp) {
          this.state.pingMs = Math.max(1, Math.round(pingEnd - msg.timestamp));
        }
        this.notifyState();
      }
    } catch {}
  }

  private handleOccupancyGrid(data: any) {
    if (!data.info || !data.data) return;
    const grid: OccupancyGrid = {
      info: {
        resolution: data.info.resolution || 0.05,
        width: data.info.width || 0,
        height: data.info.height || 0,
        origin: data.info.origin || {
          position: { x: 0, y: 0, z: 0 },
          orientation: { x: 0, y: 0, z: 0, w: 1 }
        }
      },
      data: data.data
    };

    this.mapListeners.forEach(listener => listener(grid));
  }

  private handlePoseMessage(pose: any) {
    const x = pose.position?.x ?? 0;
    const y = pose.position?.y ?? 0;
    const q = pose.orientation || { x: 0, y: 0, z: 0, w: 1 };

    // Quaternion to yaw angle in radians
    const siny_cosp = 2 * (q.w * q.z + q.x * q.y);
    const cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
    const yaw = Math.atan2(siny_cosp, cosy_cosp);

    this.state.robotPose = { x, y, yaw };
    this.notifyState();
  }

  private handlePathMessage(poses: any[]) {
    const path: NavPathPoint[] = poses
      .map(p => ({
        x: p.pose?.position?.x ?? 0,
        y: p.pose?.position?.y ?? 0
      }))
      .filter(p => !isNaN(p.x) && !isNaN(p.y));

    this.pathListeners.forEach(listener => listener(path));
  }

  private handleLaserScan(scan: any) {
    const ranges: number[] = scan.ranges || [];
    const angleMin = scan.angle_min || -Math.PI;
    const angleIncrement = scan.angle_increment || 0.01;
    const rangeMax = scan.range_max || 12.0;

    const points: Array<{ x: number; y: number }> = [];

    // Sub-sample rays for efficient UI canvas rendering
    const step = Math.max(1, Math.floor(ranges.length / 180));
    for (let i = 0; i < ranges.length; i += step) {
      const r = ranges[i];
      if (r > 0.05 && r < rangeMax && !isNaN(r)) {
        const angle = angleMin + i * angleIncrement;
        points.push({
          x: r * Math.cos(angle),
          y: r * Math.sin(angle)
        });
      }
    }

    this.scanListeners.forEach(listener => listener(points));
  }

  private startPingLoop() {
    this.stopPingLoop();
    this.pingIntervalTimer = setInterval(() => {
      if (this.state.status === 'connected') {
        const pingTime = performance.now();
        this.sendRaw({
          op: 'ping',
          timestamp: pingTime
        });
      }
    }, 3000);
  }

  private stopPingLoop() {
    if (this.pingIntervalTimer) {
      clearInterval(this.pingIntervalTimer);
      this.pingIntervalTimer = null;
    }
  }

  // ==========================================
  // REAL TELEOPERATION CONTROL LOOP (10Hz)
  // ==========================================

  /**
   * Starts continuous velocity command stream at 10Hz (100ms interval).
   * Crucial for ROS and Arduino motor controllers that implement a 200-300ms watchdog.
   */
  public startTeleop(linear: number, angular: number) {
    this.activeLinear = linear;
    this.activeAngular = angular;
    this.isTeleopActive = true;
    this.state.currentLinearSpeed = linear;
    this.state.currentAngularSpeed = angular;
    this.notifyState();

    // Send first packet immediately
    this.publishTwist(linear, angular);

    // Continuous 10Hz transmission loop
    if (!this.teleopIntervalTimer) {
      this.teleopIntervalTimer = setInterval(() => {
        if (this.isTeleopActive) {
          this.publishTwist(this.activeLinear, this.activeAngular);
        }
      }, 100);
    }
  }

  /**
   * Updates target velocity while teleop is actively running
   */
  public updateVelocity(linear: number, angular: number) {
    this.activeLinear = linear;
    this.activeAngular = angular;
    this.state.currentLinearSpeed = linear;
    this.state.currentAngularSpeed = angular;
    this.notifyState();
    this.publishTwist(linear, angular);
  }

  /**
   * Stops teleoperation and immediately fires burst of 0-velocity packets
   */
  public stopTeleop() {
    this.isTeleopActive = false;
    this.activeLinear = 0;
    this.activeAngular = 0;
    this.state.currentLinearSpeed = 0;
    this.state.currentAngularSpeed = 0;

    if (this.teleopIntervalTimer) {
      clearInterval(this.teleopIntervalTimer);
      this.teleopIntervalTimer = null;
    }

    // Fire 3 zero-velocity packets in rapid succession to ensure hardware halt
    this.publishTwist(0, 0);
    setTimeout(() => this.publishTwist(0, 0), 40);
    setTimeout(() => this.publishTwist(0, 0), 100);

    this.notifyState();
  }

  /**
   * Immediate Emergency Stop (E-STOP)
   * Sends zero velocity burst + hardware estop command
   */
  public emergencyStop() {
    this.stopTeleop();
    this.cancelNavGoal();

    // 1. Zero velocity burst
    this.publishTwist(0, 0);

    // 2. Publish to dedicated ROS emergency topics
    this.sendRaw({
      op: 'publish',
      topic: '/e_stop',
      msg: { data: true }
    });

    this.sendRaw({
      op: 'publish',
      topic: '/cmd_vel',
      msg: {
        linear: { x: 0.0, y: 0.0, z: 0.0 },
        angular: { x: 0.0, y: 0.0, z: 0.0 }
      }
    });

    // 3. Custom direct hardware packet
    this.sendRaw({
      command: 'e_stop',
      reason: 'User triggered hardware emergency stop'
    });

    this.notifyState();
  }

  /**
   * Publishes geometry_msgs/Twist to /cmd_vel over ROSBridge WebSocket
   * Also transmits custom payload for Python/Arduino daemons
   */
  private publishTwist(linear: number, angular: number) {
    // 1. ROSBridge v2.0 Standard Publish packet (omitting type allows ROS 1 & ROS 2 auto-resolution)
    const rosPacket = {
      op: 'publish',
      topic: '/cmd_vel',
      msg: {
        linear: { x: Number(linear.toFixed(3)), y: 0.0, z: 0.0 },
        angular: { x: 0.0, y: 0.0, z: Number(angular.toFixed(3)) }
      }
    };
    this.sendRaw(rosPacket);

    // 2. Custom JSON command for lightweight Arduino/Serial bridges
    const directPacket = {
      command: 'cmd_vel',
      linear: Number(linear.toFixed(3)),
      angular: Number(angular.toFixed(3)),
      timestamp: Date.now()
    };
    this.sendRaw(directPacket);
  }

  // ==========================================
  // AUTONOMOUS NAVIGATION GOALS (Nav2)
  // ==========================================

  /**
   * Dispatches 2D Navigation Goal to ROS 2 Nav2 stack (/goal_pose or /move_base_simple/goal)
   */
  public sendNavGoal(x: number, y: number, yaw: number = 0, label?: string) {
    // Convert yaw to quaternion
    const qz = Math.sin(yaw / 2);
    const qw = Math.cos(yaw / 2);

    const goalPacket = {
      op: 'publish',
      topic: '/goal_pose',
      type: 'geometry_msgs/msg/PoseStamped',
      msg: {
        header: {
          stamp: { sec: Math.floor(Date.now() / 1000), nanosec: 0 },
          frame_id: 'map'
        },
        pose: {
          position: { x, y, z: 0.0 },
          orientation: { x: 0.0, y: 0.0, z: qz, w: qw }
        }
      }
    };

    // Also publish fallback ROS 1 topic
    const fallbackMoveBase = {
      op: 'publish',
      topic: '/move_base_simple/goal',
      type: 'geometry_msgs/PoseStamped',
      msg: goalPacket.msg
    };

    // Also publish to /Goal (rblemi unity_to_nav.py action client)
    const unityGoal = {
      op: 'publish',
      topic: '/Goal',
      type: 'geometry_msgs/Pose',
      msg: {
        position: { x, y, z: 0.0 },
        orientation: { x: 0.0, y: 0.0, z: qz, w: qw }
      }
    };

    this.sendRaw(goalPacket);
    this.sendRaw(fallbackMoveBase);
    this.sendRaw(unityGoal);

    // Custom payload for Jetson python agent
    this.sendRaw({
      command: 'nav_goal',
      target: { x, y, yaw, label }
    });

    this.state.activeGoal = { x, y, label };
    this.state.isNavigating = true;
    this.notifyState();
  }

  /**
   * Cancels active Nav2 navigation mission
   */
  public cancelNavGoal() {
    this.sendRaw({
      op: 'publish',
      topic: '/navigate_to_pose/_action/cancel_goal',
      type: 'action_msgs/msg/GoalInfo',
      msg: {}
    });

    this.sendRaw({
      command: 'cancel_navigation'
    });

    this.state.activeGoal = null;
    this.state.isNavigating = false;
    this.notifyState();
  }

  // ==========================================
  // Low-level socket transmission & listeners
  // ==========================================

  public sendRaw(payload: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }
    try {
      this.ws.send(JSON.stringify(payload));
      this.state.packetsSent++;
      return true;
    } catch (e: any) {
      console.warn('JetsonBridge send error:', e);
      return false;
    }
  }

  public subscribeState(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.getState());
    return () => this.stateListeners.delete(listener);
  }

  public subscribeMap(listener: MapListener): () => void {
    this.mapListeners.add(listener);
    return () => this.mapListeners.delete(listener);
  }

  public subscribeScan(listener: LaserScanListener): () => void {
    this.scanListeners.add(listener);
    return () => this.scanListeners.delete(listener);
  }

  public subscribePath(listener: PathListener): () => void {
    this.pathListeners.add(listener);
    return () => this.pathListeners.delete(listener);
  }

  private notifyState() {
    const s = this.getState();
    this.stateListeners.forEach(listener => {
      try {
        listener(s);
      } catch {}
    });
  }
}

export const jetsonBridge = new JetsonBridgeService();

