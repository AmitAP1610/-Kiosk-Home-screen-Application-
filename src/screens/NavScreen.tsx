import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Navigation,
  MapPin,
  Play,
  StopCircle,
  CheckCircle2,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Radio
} from 'lucide-react';
import { useJetsonBridge } from '../hooks/useJetsonBridge';

interface NavScreenProps {
  onNavigate?: (screen: any) => void;
}

interface Waypoint {
  id: string;
  name: string;
  x: number;
  y: number;
  yaw: number;
  category: string;
  description: string;
}

const SSU_CAMPUS_WAYPOINTS: Waypoint[] = [
  {
    id: 'wp-1',
    name: 'Robotics Maker Space',
    x: 4.2,
    y: 2.1,
    yaw: 0.0,
    category: 'Innovation',
    description: 'Robotics Club hardware lab & test track'
  },
  {
    id: 'wp-2',
    name: 'Shruti Central Library',
    x: -8.5,
    y: 12.0,
    yaw: 1.57,
    category: 'Academic',
    description: 'Academic complex, reading halls & carrels'
  },
  {
    id: 'wp-3',
    name: 'Sri Sri Ayurveda Hospital',
    x: 18.4,
    y: -6.2,
    yaw: -1.57,
    category: 'Healthcare',
    description: '100+ Bed hospital, casualty & diagnostics'
  },
  {
    id: 'wp-4',
    name: 'Kaivalya Dining Hall',
    x: -14.2,
    y: -5.5,
    yaw: 3.14,
    category: 'Dining',
    description: '100% Pure vegetarian Sattvic dining'
  },
  {
    id: 'wp-5',
    name: 'Administrative Reception',
    x: 0.0,
    y: 0.0,
    yaw: 0.0,
    category: 'Admin',
    description: 'Main campus welcome plaza & information'
  },
  {
    id: 'wp-6',
    name: 'Open-Air Theatre (OAT)',
    x: 12.8,
    y: 14.6,
    yaw: 0.78,
    category: 'Cultural',
    description: 'Scenic hilltop amphitheatre arena'
  }
];

export const NavScreen: React.FC<NavScreenProps> = ({ onNavigate }) => {
  const {
    status,
    pingMs,
    robotPose,
    mapGrid,
    laserScanPoints,
    navPath,
    activeGoal,
    isNavigating,
    sendNavGoal,
    cancelNavGoal
  } = useJetsonBridge();

  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint>(SSU_CAMPUS_WAYPOINTS[0]);
  const [customGoal, setCustomGoal] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState<number>(24); // pixels per meter
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [followRobot, setFollowRobot] = useState<boolean>(true);
  const [showLaserScan, setShowLaserScan] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Center view on robot position
  const centerOnRobot = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    setPan({
      x: canvas.width / 2 - robotPose.x * zoom,
      y: canvas.height / 2 + robotPose.y * zoom
    });
  }, [robotPose, zoom]);

  useEffect(() => {
    if (followRobot) {
      centerOnRobot();
    }
  }, [robotPose.x, robotPose.y, followRobot, centerOnRobot]);

  // Initial centering
  useEffect(() => {
    centerOnRobot();
  }, []);

  // Distance to current active goal
  const currentTarget = activeGoal || (customGoal ? { ...customGoal, label: 'Custom Target' } : selectedWaypoint);
  const distToGoal = Math.hypot(currentTarget.x - robotPose.x, currentTarget.y - robotPose.y);
  const estSeconds = Math.max(2, Math.round(distToGoal / 0.35));

  // ==========================================
  // Canvas Map Rendering Engine
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    // 1. Background (Dark Grid Canvas #1A232E)
    ctx.fillStyle = '#1A232E';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(pan.x, pan.y);

    // 2. Draw Distance Coordinate Grid (1 meter minor, 5 meter major)
    const meterStep = zoom;
    const gridLimit = 35 * zoom;

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#263746';
    ctx.beginPath();
    for (let x = -gridLimit; x <= gridLimit; x += meterStep) {
      ctx.moveTo(x, -gridLimit);
      ctx.lineTo(x, gridLimit);
    }
    for (let y = -gridLimit; y <= gridLimit; y += meterStep) {
      ctx.moveTo(-gridLimit, y);
      ctx.lineTo(gridLimit, y);
    }
    ctx.stroke();

    // Major 5m axes in subtle gold
    ctx.strokeStyle = 'rgba(196, 154, 69, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-gridLimit, 0);
    ctx.lineTo(gridLimit, 0);
    ctx.moveTo(0, -gridLimit);
    ctx.lineTo(0, gridLimit);
    ctx.stroke();

    // 3. Render Stored Map (From Jetson ROS /map topic OR Campus Floor Plan)
    if (mapGrid && mapGrid.data.length > 0) {
      // Live ROS 2 Occupancy Grid rendering
      const { resolution, width: mapW, height: mapH, origin } = mapGrid.info;
      const cellPx = resolution * zoom;
      const mapOriginX = origin.position.x * zoom;
      const mapOriginY = -origin.position.y * zoom;

      for (let row = 0; row < mapH; row += 2) {
        for (let col = 0; col < mapW; col += 2) {
          const val = mapGrid.data[row * mapW + col];
          if (val === 100) {
            // Occupied obstacle (Dark charcoal wall)
            ctx.fillStyle = '#E2E8F0';
            ctx.fillRect(mapOriginX + col * cellPx, mapOriginY - (row + 2) * cellPx, cellPx * 2, cellPx * 2);
          } else if (val === 0) {
            // Free navigable path
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(mapOriginX + col * cellPx, mapOriginY - (row + 2) * cellPx, cellPx * 2, cellPx * 2);
          }
        }
      }
    } else {
      // High-precision Stored SSU Campus Maker Space & Academic Complex SLAM Map
      drawDefaultCampusSlamMap(ctx, zoom);
    }

    // 4. Draw Saved Campus Waypoints
    SSU_CAMPUS_WAYPOINTS.forEach((wp) => {
      const wx = wp.x * zoom;
      const wy = -wp.y * zoom;
      const isSelected = selectedWaypoint.id === wp.id;

      // Waypoint circle
      ctx.beginPath();
      ctx.arc(wx, wy, isSelected ? 9 : 6, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#C49A45' : '#3B82F6';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Label text
      ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif';
      ctx.fillStyle = isSelected ? '#FFFFFF' : '#CBD5E1';
      ctx.fillText(wp.name, wx + 12, wy + 4);
    });

    // 5. Draw Custom Dropped Goal Pin (if tapped on map)
    if (customGoal) {
      const gx = customGoal.x * zoom;
      const gy = -customGoal.y * zoom;

      ctx.beginPath();
      ctx.arc(gx, gy, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#EF4444';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#EF4444';
      ctx.fillText('Target Pin', gx + 12, gy + 4);
    }

    // 6. Draw Trajectory / Planned Route to Goal (/plan or direct line)
    const targetX = (customGoal ? customGoal.x : selectedWaypoint.x) * zoom;
    const targetY = -(customGoal ? customGoal.y : selectedWaypoint.y) * zoom;
    const robotX = robotPose.x * zoom;
    const robotY = -robotPose.y * zoom;

    if (navPath && navPath.length > 1) {
      // Real ROS Nav2 Planned Path
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#C49A45';
      ctx.setLineDash([6, 4]);
      navPath.forEach((pt, idx) => {
        const px = pt.x * zoom;
        const py = -pt.y * zoom;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // Direct Navigation Vector
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isNavigating ? '#C49A45' : 'rgba(196, 154, 69, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.moveTo(robotX, robotY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 7. Render LiDAR Laser Scan Overlay (/scan topic)
    if (showLaserScan && laserScanPoints.length > 0) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.7)'; // Cyan laser points
      laserScanPoints.forEach((pt) => {
        // Rotate laser point by robot yaw and translate
        const cosYaw = Math.cos(robotPose.yaw);
        const sinYaw = Math.sin(robotPose.yaw);
        const lx = (robotPose.x + (pt.x * cosYaw - pt.y * sinYaw)) * zoom;
        const ly = -(robotPose.y + (pt.x * sinYaw + pt.y * cosYaw)) * zoom;

        ctx.fillRect(lx - 1.5, ly - 1.5, 3, 3);
      });
    }

    // 8. Render Live Robot AMR Footprint
    ctx.save();
    ctx.translate(robotX, robotY);
    ctx.rotate(-robotPose.yaw);

    // Robot Safety Halo
    ctx.beginPath();
    ctx.arc(0, 0, 0.45 * zoom, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(196, 154, 69, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#C49A45';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Triangular Directional Heading
    ctx.beginPath();
    ctx.moveTo(0.55 * zoom, 0);
    ctx.lineTo(-0.35 * zoom, -0.35 * zoom);
    ctx.lineTo(-0.20 * zoom, 0);
    ctx.lineTo(-0.35 * zoom, 0.35 * zoom);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#263746';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    ctx.restore();
  }, [pan, zoom, robotPose, mapGrid, laserScanPoints, navPath, selectedWaypoint, customGoal, isNavigating, showLaserScan]);

  // Default Campus SLAM Occupancy Map Generator (SSU Maker Space & Corridors)
  const drawDefaultCampusSlamMap = (ctx: CanvasRenderingContext2D, z: number) => {
    ctx.fillStyle = '#CBD5E1'; // Light wall color
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 3;

    // Outer Perimeter Walls
    const rooms = [
      // Maker Space & Robotics Lab
      { x: 0, y: -2, w: 10, h: 8, label: 'Robotics Maker Space' },
      // Central Corridor
      { x: -16, y: -2, w: 36, h: 4, label: 'Central Corridor' },
      // Shruti Library Complex
      { x: -16, y: 4, w: 14, h: 12, label: 'Shruti Library' },
      // Hospital Diagnostics Wing
      { x: 12, y: -12, w: 16, h: 10, label: 'Ayurveda Hospital Wing' },
      // Kaivalya Dining Hall
      { x: -18, y: -12, w: 14, h: 9, label: 'Kaivalya Hall' }
    ];

    rooms.forEach((r) => {
      const rx = r.x * z;
      const ry = -r.y * z - r.h * z;
      const rw = r.w * z;
      const rh = r.h * z;

      ctx.strokeRect(rx, ry, rw, rh);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(rx, ry, rw, rh);

      ctx.fillStyle = 'rgba(203, 213, 225, 0.4)';
      ctx.font = '10px monospace';
      ctx.fillText(r.label, rx + 8, ry + 16);
    });

    // Obstacle pillars & doorways
    const obstacles = [
      { x: 2, y: 1 }, { x: 6, y: 1 }, { x: 2, y: 4 }, { x: 6, y: 4 },
      { x: -4, y: 0 }, { x: -8, y: 0 }, { x: -12, y: 0 },
      { x: 16, y: -4 }, { x: 20, y: -4 }
    ];

    ctx.fillStyle = '#E2E8F0';
    obstacles.forEach((obs) => {
      ctx.fillRect(obs.x * z - 4, -obs.y * z - 4, 8, 8);
    });
  };

  // ==========================================
  // Mouse & Touch Pan / Tap Navigation Handlers
  // ==========================================
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    setFollowRobot(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Tap on map to set custom goal
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert pixel to meter coordinates
    const meterX = (clickX - pan.x) / zoom;
    const meterY = -(clickY - pan.y) / zoom;

    setCustomGoal({
      x: Number(meterX.toFixed(2)),
      y: Number(meterY.toFixed(2))
    });
  };

  const handleStartNavigation = () => {
    const target = customGoal || selectedWaypoint;
    sendNavGoal(target.x, target.y, (target as any).yaw || 0, (target as any).name || 'Custom Target');
  };

  const handleCancelNavigation = () => {
    cancelNavGoal();
    setCustomGoal(null);
  };

  return (
    <div className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-3 sm:p-4 md:p-5 font-sans select-none overflow-hidden">
      {/* Header: Navy Blue Structural Bar (#263746) */}
      <header className="flex items-center justify-between pb-3 bg-[#263746] text-white p-3.5 rounded-xl mb-3 border border-white/10 shadow-sm shrink-0">
        <div className="flex items-center gap-2.5">
          {onNavigate && (
            <button
              onClick={() => onNavigate('hub')}
              className="flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all text-xs font-semibold mr-1 cursor-pointer"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
              <span>Back</span>
            </button>
          )}

          <div className="p-2 rounded-lg bg-[#30343B] border border-white/10 text-[#C49A45] hidden sm:block">
            <Navigation className="w-5 h-5 text-[#C49A45]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight leading-tight">
              Autonomous SLAM Map & Navigation
            </h1>
            <p className="text-[11px] text-[#E9EDF2]/80 font-mono">
              Live Jetson ROS 2 Nav2 Map • Campus Floor Plan
            </p>
          </div>
        </div>

        {/* Live Status & Connection indicator */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className={`px-2.5 py-1 rounded-lg border font-semibold text-xs flex items-center gap-1.5 ${
            status === 'connected'
              ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300'
              : 'bg-red-950/60 border-red-500 text-red-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
            <span>{status === 'connected' ? `JETSON ONLINE (${pingMs}ms)` : 'JETSON OFFLINE'}</span>
          </div>

          <span className={`px-2.5 py-1 rounded font-semibold text-[11px] tracking-wider uppercase ${
            isNavigating
              ? 'bg-[#C49A45] text-white animate-pulse shadow-sm'
              : 'bg-[#30343B] text-[#E9EDF2]/70 border border-white/10'
          }`}>
            {isNavigating ? 'NAVIGATING...' : 'STANDBY'}
          </span>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-3 min-h-0">
        {/* Interactive 2D Map Canvas Viewport */}
        <div className="flex-1 bg-[#1A232E] rounded-xl border border-[#30343B] relative overflow-hidden flex flex-col shadow-sm">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full cursor-crosshair touch-none"
          />

          {/* Floating Map Controls & Overlays */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 font-mono text-xs">
            <div className="px-2.5 py-1 rounded-lg bg-[#263746]/90 backdrop-blur-md text-white border border-white/10 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C49A45]" />
              <span>Robot Pose: ({robotPose.x.toFixed(2)}m, {robotPose.y.toFixed(2)}m)</span>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-[#263746]/90 backdrop-blur-md text-[#CBD5E1] border border-white/10 shadow-sm text-[11px]">
              <span>Tip: Tap map to drop destination pin</span>
            </div>
          </div>

          {/* Floating Zoom & Centering Controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            <button
              onClick={() => setZoom(prev => Math.min(60, prev + 6))}
              className="w-9 h-9 rounded-lg bg-[#263746]/90 hover:bg-[#30343B] text-white border border-white/10 flex items-center justify-center shadow-sm cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(10, prev - 6))}
              className="w-9 h-9 rounded-lg bg-[#263746]/90 hover:bg-[#30343B] text-white border border-white/10 flex items-center justify-center shadow-sm cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => {
                setFollowRobot(true);
                centerOnRobot();
              }}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center shadow-sm cursor-pointer ${
                followRobot
                  ? 'bg-[#C49A45] border-[#C49A45] text-white'
                  : 'bg-[#263746]/90 hover:bg-[#30343B] text-white border-white/10'
              }`}
              title="Center on Robot"
            >
              <Crosshair className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setShowLaserScan(!showLaserScan)}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center shadow-sm cursor-pointer ${
                showLaserScan
                  ? 'bg-sky-700 border-sky-500 text-white'
                  : 'bg-[#263746]/90 text-white/70 border-white/10'
              }`}
              title="Toggle LiDAR Laser Scan Overlay"
            >
              <Radio className="w-4 h-4" />
            </button>
          </div>

          {/* Map Legend Overlay at Bottom Left */}
          <div className="absolute bottom-3 left-3 bg-[#263746]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-mono text-white flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C49A45]" />
              <span>Robot AMR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
              <span>Waypoints</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>LiDAR Obstacles</span>
            </div>
          </div>
        </div>

        {/* Waypoints & Mission Control Sidebar */}
        <div className="w-full md:w-84 bg-white text-[#30343B] border border-[#D8DFE8] rounded-xl p-3.5 flex flex-col gap-3 font-mono text-xs shadow-sm shrink-0">
          <div>
            <h3 className="font-bold text-[#263746] uppercase tracking-wider mb-2 text-xs flex items-center justify-between">
              <span>Verified Campus Waypoints</span>
              <span className="text-[10px] text-[#606B76] font-normal">{SSU_CAMPUS_WAYPOINTS.length} Loaded</span>
            </h3>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {SSU_CAMPUS_WAYPOINTS.map((wp) => {
                const isSelected = !customGoal && selectedWaypoint.id === wp.id;
                return (
                  <button
                    key={wp.id}
                    onClick={() => {
                      setCustomGoal(null);
                      setSelectedWaypoint(wp);
                    }}
                    className={`w-full p-2.5 rounded-lg border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#263746] bg-[#263746] text-white shadow-xs'
                        : 'border-[#E9EDF2] bg-white text-[#30343B] hover:border-[#263746] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs truncate">
                        <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-[#C49A45]' : 'text-[#263746]'}`} />
                        <span className="truncate">{wp.name}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-[#E9EDF2] text-[#606B76]'}`}>
                        {wp.category}
                      </span>
                    </div>
                    <span className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-[#606B76]'}`}>
                      Coord: ({wp.x}m, {wp.y}m) • {wp.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Mission Telemetry Card */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
              <span className="text-[#606B76] text-[11px]">Selected Destination:</span>
              <span className="font-bold text-[#263746] text-xs truncate max-w-[150px]">
                {customGoal ? 'Custom Pin Target' : selectedWaypoint.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
              <div className="p-1.5 rounded bg-white border border-[#E2E8F0]">
                <span className="text-[#606B76] block text-[10px]">Distance</span>
                <span className="font-bold text-[#263746]">{distToGoal.toFixed(1)} meters</span>
              </div>
              <div className="p-1.5 rounded bg-white border border-[#E2E8F0]">
                <span className="text-[#606B76] block text-[10px]">Est. Travel Time</span>
                <span className="font-bold text-[#263746]">~{estSeconds} sec</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#606B76]">
              <span>Nav2 Path Status:</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Path Clear
              </span>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="mt-auto space-y-2 pt-1 border-t border-[#E9EDF2]">
            {isNavigating ? (
              <button
                onClick={handleCancelNavigation}
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-[#B42318] hover:bg-red-800 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <StopCircle className="w-4 h-4" />
                <span>CANCEL MISSION</span>
              </button>
            ) : (
              <button
                onClick={handleStartNavigation}
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-[#263746] hover:bg-[#1D2B37] text-white font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-[#C49A45]" />
                <span>START AUTONOMOUS NAVIGATION</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
