export type FaceExpression =
  | 'idle'
  | 'attentive'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'happy'
  | 'curious'
  | 'confused'
  | 'sleepy'
  | 'sleep'
  | 'surprised'
  | 'error'
  | 'wakeup';

export type AppScreen =
  | 'face'            // Screen 1: Home / Pure Robot Face (Intro voice -> auto-shifts to hub)
  | 'hub'             // Screen 2: Tablet Main Hub (Back button + 3 circular buttons)
  | 'gallery'         // Dedicated Full-Screen Sri Sri University Photo Gallery
  | 'map-info'        // Screen 3: SSU Campus Map & Basic Info
  | 'sessions-agenda' // Screen 4: Sessions & Agenda
  | 'robo-info'       // Screen 5: Robo Info (How made, who made, Mention Members)
  | 'welcome'         // Sri Sri University Welcome
  | 'assistant'       // AI Campus Assistant & Chat
  | 'university-info' // University Information, Faculties & Vision
  | 'facilities'      // Campus Facilities & Guidance
  | 'camera'          // Camera & Computer Vision
  | 'control'         // Robot Teleoperation & E-Stop
  | 'mapping'         // LiDAR Scan & 2D Map Visualization
  | 'navigation'      // Autonomous Navigation & Routes
  | 'guided-tour'     // Autonomous Guest Escort: Point A -> Point B with introduction & arrival briefing
  | 'monitor'         // System Monitor & Telemetry
  | 'diagnostics'     // Dedicated Voice & Audio Diagnostics
  | 'settings';       // System Configuration

export type VoiceAssistantState =
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'THINKING'
  | 'SPEAKING'
  | 'INTERRUPTED'
  | 'ERROR';

export interface FaceConfig {
  eyeSize: number;          // Eye radius in SVG units (e.g. 52)
  eyeSpacing: number;       // Distance between eye centers (e.g. 216)
  eyeOffsetY: number;       // Vertical center offset for eyes (e.g. -24)
  mouthWidth: number;       // Mouth width in SVG units (e.g. 46)
  mouthOffsetY: number;     // Vertical center offset for mouth (e.g. 72)
  mouthCurve: number;       // Curve depth of smile (e.g. 13)
  glowIntensity: number;    // Multiplier for glow drop-shadow (0.5 to 2.0)
  primaryColor: string;     // Primary neon color (e.g. '#00f3ff')
  accentColor: string;      // Accent/specular highlight color (e.g. '#ffffff')
  errorColor: string;       // Error state color (e.g. '#ff3b30')
  blinkIntervalMin: number; // Seconds (e.g. 3.7)
  blinkIntervalMax: number; // Seconds (e.g. 4.3)
  enableGazeTracking: boolean; // Track mouse/touch cursor
  ambientMovement: boolean; // Gentle breathing and micro-saccades
}

export interface GazeTarget {
  x: number; // Pixel offset X
  y: number; // Pixel offset Y
}

export interface StereoGaze {
  left: GazeTarget;
  right: GazeTarget;
}

export interface SystemStatus {
  tabletBattery?: number;
  isTabletCharging?: boolean;
  jetsonConnected: boolean;
  arduinoConnected: boolean;
  lidarConnected: boolean;
  cameraActive: boolean;
  networkLatencyMs?: number;
  motorEStop: boolean;
}

export interface HardwareMessage {
  command: 'set_expression' | 'speak' | 'set_gaze' | 'ping' | 'configure' | 'drive' | 'estop';
  expression?: FaceExpression;
  text?: string;
  gaze?: { x: number; y: number };
  drive?: { linear: number; angular: number };
  config?: Partial<FaceConfig>;
  timestamp?: number;
}
