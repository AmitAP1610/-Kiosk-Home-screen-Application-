import { FaceConfig } from '../types/robot';

export const DEFAULT_CONFIG: FaceConfig = {
  eyeSize: 52,            // Polished digital eye radius
  eyeSpacing: 216,        // Balanced interocular distance
  eyeOffsetY: -24,        // Balanced eye level in the screen
  mouthWidth: 46,         // Small, elegant smile
  mouthOffsetY: 72,       // Proportional position below eyes
  mouthCurve: 13,         // Smooth, subtle upward curve
  glowIntensity: 1.0,     // Restrained, clean glow
  primaryColor: '#174D3A', // Official KIOSK Forest Green
  accentColor: '#ffffff',  // Crisp white specular gleam
  errorColor: '#B42318',   // Official KIOSK Error Red
  blinkIntervalMin: 3.2,
  blinkIntervalMax: 5.5,
  enableGazeTracking: true,
  ambientMovement: true
};

export const COLOR_THEMES = [
  { name: 'KIOSK Forest Green', primary: '#174D3A', glow: 'rgba(23, 77, 58, 0.5)' },
  { name: 'Emerald Bright', primary: '#1FA369', glow: 'rgba(31, 163, 105, 0.5)' },
  { name: 'Reference Cyan', primary: '#00f3ff', glow: 'rgba(0, 243, 255, 0.5)' },
  { name: 'Electric Blue', primary: '#00a6ff', glow: 'rgba(0, 166, 255, 0.5)' },
  { name: 'Pure White', primary: '#f0f6fc', glow: 'rgba(240, 246, 252, 0.5)' },
];
