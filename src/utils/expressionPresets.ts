import { FaceConfig } from '../types/robot';

export const DEFAULT_CONFIG: FaceConfig = {
  eyeSize: 52,            // Polished digital eye radius
  eyeSpacing: 216,        // Balanced interocular distance
  eyeOffsetY: -24,        // Balanced eye level in the screen
  mouthWidth: 46,         // Small, elegant smile
  mouthOffsetY: 72,       // Proportional position below eyes
  mouthCurve: 13,         // Smooth, subtle upward curve
  glowIntensity: 1.0,     // Restrained, clean neon glow
  primaryColor: '#00f3ff', // Clean vibrant cyan
  accentColor: '#ffffff',  // Crisp white specular gleam
  errorColor: '#ff334b',   // Warning amber/red
  blinkIntervalMin: 3.2,
  blinkIntervalMax: 5.5,
  enableGazeTracking: true,
  ambientMovement: true
};

export const COLOR_THEMES = [
  { name: 'Reference Cyan', primary: '#00f3ff', glow: 'rgba(0, 243, 255, 0.5)' },
  { name: 'Electric Blue', primary: '#00a6ff', glow: 'rgba(0, 166, 255, 0.5)' },
  { name: 'Emerald Mint', primary: '#00ffaa', glow: 'rgba(0, 255, 170, 0.5)' },
  { name: 'Cyber Amber', primary: '#ffaa00', glow: 'rgba(255, 170, 0, 0.5)' },
  { name: 'Soft Lilac', primary: '#bb86fc', glow: 'rgba(187, 134, 252, 0.5)' },
  { name: 'Pure White', primary: '#f0f6fc', glow: 'rgba(240, 246, 252, 0.5)' },
];
