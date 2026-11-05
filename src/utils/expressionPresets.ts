import { FaceConfig } from '../types/robot';

export const DEFAULT_CONFIG: FaceConfig = {
  eyeSize: 52,            // Polished digital eye radius
  eyeSpacing: 216,        // Balanced interocular distance
  eyeOffsetY: -24,        // Balanced eye level in the screen
  mouthWidth: 46,         // Small, elegant smile
  mouthOffsetY: 72,       // Proportional position below eyes
  mouthCurve: 13,         // Smooth, subtle upward curve
  glowIntensity: 0.8,     // Restrained, clean glow without neon effect
  primaryColor: '#FFFFFF', // Crisp White digital eyes for high-contrast visibility
  accentColor: '#C49A45',  // Subtle Gold specular gleam
  errorColor: '#B42318',   // Official KIOSK Error Red
  blinkIntervalMin: 3.2,
  blinkIntervalMax: 5.5,
  enableGazeTracking: true,
  ambientMovement: true
};

export const COLOR_THEMES = [
  { name: 'Pure White (Default)', primary: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.35)' },
  { name: 'Soft Grey', primary: '#E9EDF2', glow: 'rgba(233, 237, 242, 0.35)' },
  { name: 'Gold Highlight', primary: '#C49A45', glow: 'rgba(196, 154, 69, 0.35)' },
  { name: 'Sky Navy Blue', primary: '#5C82A6', glow: 'rgba(92, 130, 166, 0.35)' },
  { name: 'Cyan Reference', primary: '#00D4E0', glow: 'rgba(0, 212, 224, 0.35)' },
];
