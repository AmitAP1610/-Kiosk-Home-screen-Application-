import React, { useRef } from 'react';
import { FaceConfig, FaceExpression, GazeTarget, StereoGaze } from '../../types/robot';
import { RobotEyes } from './RobotEyes';
import { RobotMouth } from './RobotMouth';
import { useBlink } from '../../hooks/useBlink';
import { useGazeTracking } from '../../hooks/useGazeTracking';
import { useBreathing } from '../../hooks/useBreathing';

interface RobotFaceProps {
  config: FaceConfig;
  expression: FaceExpression;
  onWakeupComplete?: () => void;
  visemeLevel?: number;
  audioPulseLevel?: number;
  manualGaze?: GazeTarget | StereoGaze | null;
}

export const RobotFace: React.FC<RobotFaceProps> = ({
  config,
  expression,
  onWakeupComplete,
  visemeLevel = 0,
  audioPulseLevel = 0,
  manualGaze = null
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Fixed blink sequence controller (handles 80ms close, 40ms closed, 100ms open, 200ms recovery, double blinks & wakeup)
  const eyelidProgress = useBlink({
    expression,
    onWakeupComplete
  });

  // Interactive Eye Gaze Tracking (smooth pointer/touch follow & click-target locking)
  const autoGaze = useGazeTracking({
    expression,
    enabled: config.enableGazeTracking,
    ambient: config.ambientMovement,
    eyeSpacing: config.eyeSpacing,
    eyeOffsetY: config.eyeOffsetY,
    eyeSize: config.eyeSize,
    svgRef
  });

  const effectiveGaze = manualGaze || autoGaze;

  // Gentle idle breathing glow
  const breathFactor = useBreathing({
    expression,
    enabled: config.ambientMovement
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#202124] overflow-hidden select-none touch-none">
      {/* SVG Canvas for precision vector rendering (Zero clipping filters, zero rectangular borders) */}
      <svg
        ref={svgRef}
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full max-w-full max-h-full"
      >
        <defs>
          {/* Circular Glow Radial Gradient with Smooth Falloff */}
          <radialGradient id="eyeGlowRadial" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor={config.primaryColor} stopOpacity="0.28" />
            <stop offset="75%" stopColor={config.primaryColor} stopOpacity="0.14" />
            <stop offset="90%" stopColor={config.primaryColor} stopOpacity="0.05" />
            <stop offset="100%" stopColor={config.primaryColor} stopOpacity="0" />
          </radialGradient>

          {/* Forest Green Iris with Realistic Digital Depth */}
          <radialGradient id="darkTealIris" cx="44%" cy="40%" r="58%">
            <stop offset="0%" stopColor="#174D3A" />
            <stop offset="60%" stopColor="#0E3326" />
            <stop offset="100%" stopColor="#071A13" />
          </radialGradient>
        </defs>

        {/* Near Black Screen Canvas */}
        <rect width="800" height="500" fill="#202124" />

        {/* Polished Robot Eyes with Interactive Pointer Tracking and Eyelid Mask */}
        <RobotEyes
          config={config}
          expression={expression}
          eyelidProgress={eyelidProgress}
          gaze={effectiveGaze}
          breathFactor={breathFactor}
          audioPulseLevel={audioPulseLevel}
        />

        {/* Small Elegant Robot Mouth */}
        <RobotMouth
          config={config}
          expression={expression}
          visemeLevel={visemeLevel}
          breathFactor={breathFactor}
        />
      </svg>
    </div>
  );
};

