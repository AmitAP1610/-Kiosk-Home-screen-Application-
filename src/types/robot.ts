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

export interface HardwareMessage {
  command: 'set_expression' | 'speak' | 'set_gaze' | 'ping' | 'configure';
  expression?: FaceExpression;
  text?: string;
  gaze?: { x: number; y: number };
  config?: Partial<FaceConfig>;
  timestamp?: number;
}
