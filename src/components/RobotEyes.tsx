import React from 'react';
import { FaceConfig, FaceExpression, GazeTarget, StereoGaze } from '../types/robot';

interface RobotEyesProps {
  config: FaceConfig;
  expression: FaceExpression;
  eyelidProgress: number; // 0 = fully open, 1 = fully closed
  gaze: StereoGaze | GazeTarget;
  breathFactor?: number;
  audioPulseLevel?: number;
}

export const RobotEyes: React.FC<RobotEyesProps> = ({
  config,
  expression,
  eyelidProgress,
  gaze,
  breathFactor = 1,
  audioPulseLevel = 0
}) => {
  const {
    eyeSize,
    eyeSpacing,
    eyeOffsetY,
    primaryColor,
    accentColor,
    errorColor
  } = config;

  // Active state flags
  const isError = expression === 'error';
  const isSleep = expression === 'sleep' || expression === 'sleepy';
  const isHappy = expression === 'happy';
  const isThinking = expression === 'thinking';
  const isListening = expression === 'listening' || expression === 'attentive' || audioPulseLevel > 0.05;
  const isSurprised = expression === 'surprised';

  const activeColor = isError ? errorColor : primaryColor;

  // Dynamic glow factor: modulated by idle breathing and mic pulse
  const listeningPulse = isListening ? audioPulseLevel * 0.4 : 0;
  const effectiveGlow = Math.max(0.2, (breathFactor + listeningPulse) * (isThinking ? 0.78 : isHappy ? 1.15 : 1));

  // Symmetrical Eye centers in SVG viewBox (800 x 500)
  const leftEyeX = 400 - eyeSpacing / 2;
  const rightEyeX = 400 + eyeSpacing / 2;
  const eyeY = 250 + eyeOffsetY;

  // Overall opacity (dimmed when sleeping)
  const eyeOpacity = isSleep ? 0.28 : 1;

  // Render Polished Eye with Eyelid Mask
  const renderDigitalEye = (baseX: number, side: 'left' | 'right') => {
    const cx = baseX;
    const cy = eyeY;
    const currentRadius = eyeSize * (isSurprised ? 1.07 : 1);

    // Extract side-specific gaze offset
    const offset = 'left' in gaze
      ? (side === 'left' ? gaze.left : gaze.right)
      : gaze;

    // Pupil and highlights move smoothly together in direction of cursor/click
    const pupilX = cx + offset.x;
    const pupilY = cy + offset.y;
    const pupilRadius = currentRadius * (isSurprised ? 0.38 : isListening ? 0.45 : 0.42);

    // Specular highlight: clean, polished white-cyan reflection at ~10:30 relative to pupil
    const hlOffsetX = -pupilRadius * 0.42;
    const hlOffsetY = -pupilRadius * 0.42;
    const hlRadius = pupilRadius * (isHappy ? 0.36 : 0.32);

    const maskId = `eyelid-mask-${side}`;

    // Opacity of the closed eyelid seam
    const closedSeamOpacity = Math.min(1, Math.max(0, (eyelidProgress - 0.7) / 0.3));

    return (
      <g key={side}>
        {/* SVG Mask Definition for Top-to-Bottom Eyelid Closure */}
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={cx - currentRadius - 20}
            y={cy - currentRadius - 20}
            width={(currentRadius + 20) * 2}
            height={(currentRadius + 20) * 2}
          >
            {/* Background: Black (hidden) */}
            <rect
              x={cx - currentRadius - 20}
              y={cy - currentRadius - 20}
              width={(currentRadius + 20) * 2}
              height={(currentRadius + 20) * 2}
              fill="#000000"
            />
            {/* Circular eye interior: White (revealed) */}
            <circle cx={cx} cy={cy} r={currentRadius} fill="#ffffff" />
            {/* Eyelid Curtain: Black rectangle descending from top edge downward */}
            <rect
              x={cx - currentRadius - 10}
              y={cy - currentRadius - 10}
              width={(currentRadius + 10) * 2}
              height={eyelidProgress * (currentRadius * 2 + 15)}
              fill="#000000"
            />
          </mask>
        </defs>

        {/* 1. Subtle Cyan Outer Glow with Smooth Natural Falloff (Never scaled, fixed position) */}
        <circle
          cx={cx}
          cy={cy}
          r={currentRadius * 1.34}
          fill="url(#eyeGlowRadial)"
          pointerEvents="none"
          opacity={effectiveGlow}
        />

        {/* 2. Listening Sync Pulse Ring */}
        {isListening && (
          <circle
            cx={cx}
            cy={cy}
            r={currentRadius * (1.14 + listeningPulse * 0.1)}
            fill="none"
            stroke={activeColor}
            strokeWidth={1.5}
            strokeOpacity={0.3 + listeningPulse * 0.4}
            className="transition-all duration-150"
          />
        )}

        {/* 3. Eye Interior masked by the downward-closing Eyelid */}
        <g mask={`url(#${maskId})`}>
          {/* Dark Teal Iris (Realistic digital depth, fixed position) */}
          <circle
            cx={cx}
            cy={cy}
            r={currentRadius}
            fill="url(#darkTealIris)"
          />

          {/* Soft Inner Cyan Ring Glow */}
          <circle
            cx={cx}
            cy={cy}
            r={currentRadius - 1}
            fill="none"
            stroke={activeColor}
            strokeWidth={7.5}
            strokeOpacity={0.24 * effectiveGlow}
          />

          {/* Circular Dark Pupil (Moves with gaze tracking) */}
          <circle
            cx={pupilX}
            cy={pupilY}
            r={pupilRadius}
            fill="#000609"
          />
          <circle
            cx={pupilX}
            cy={pupilY}
            r={pupilRadius}
            fill="none"
            stroke={activeColor}
            strokeWidth={1.2}
            strokeOpacity={0.35}
          />

          {/* Primary Specular Highlight Dot (Moves together with pupil) */}
          <circle
            cx={pupilX + hlOffsetX}
            cy={pupilY + hlOffsetY}
            r={hlRadius * 1.6}
            fill={activeColor}
            opacity={0.36 * effectiveGlow}
          />
          <circle
            cx={pupilX + hlOffsetX}
            cy={pupilY + hlOffsetY}
            r={hlRadius}
            fill={accentColor}
            opacity={isHappy ? 1.0 : 0.95}
          />

          {/* Polished secondary micro-reflection */}
          <circle
            cx={pupilX - hlOffsetX * 0.8}
            cy={pupilY - hlOffsetY * 0.8}
            r={hlRadius * 0.42}
            fill={accentColor}
            opacity={isHappy ? 0.6 : 0.45}
          />
        </g>

        {/* 4. Bright Cyan Iris Ring (Fixed dimensions, preserved during blinking) */}
        <circle
          cx={cx}
          cy={cy}
          r={currentRadius}
          fill="none"
          stroke={activeColor}
          strokeWidth={5}
          strokeOpacity={0.96}
        />

        {/* 5. Precision White Accent Line inside the Ring (Fixed) */}
        <circle
          cx={cx}
          cy={cy}
          r={currentRadius - 1.8}
          fill="none"
          stroke="#ffffff"
          strokeWidth={1.2}
          strokeOpacity={0.45 * effectiveGlow}
        />

        {/* 6. Smooth Closed Eyelid Seam (Appears smoothly when fully closed/sleeping) */}
        <path
          d={`M ${cx - currentRadius + 3},${cy} C ${cx - currentRadius * 0.35},${cy + 3} ${cx + currentRadius * 0.35},${cy + 3} ${cx + currentRadius - 3},${cy}`}
          fill="none"
          stroke={activeColor}
          strokeWidth={3.8}
          strokeLinecap="round"
          strokeOpacity={closedSeamOpacity * 0.9}
        />
      </g>
    );
  };

  return (
    <g id="robot-eyes" opacity={eyeOpacity}>
      {/* Left Eye */}
      {renderDigitalEye(leftEyeX, 'left')}

      {/* Right Eye */}
      {renderDigitalEye(rightEyeX, 'right')}
    </g>
  );
};
