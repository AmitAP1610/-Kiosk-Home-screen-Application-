import React from 'react';
import { FaceConfig, FaceExpression, GazeTarget, StereoGaze } from '../types/robot';
import { RobotFace } from '../components/face/RobotFace';

interface FaceScreenProps {
  config: FaceConfig;
  expression: FaceExpression;
  onWakeupComplete?: () => void;
  visemeLevel?: number;
  audioPulseLevel?: number;
  manualGaze?: GazeTarget | StereoGaze | null;
}

export const FaceScreen: React.FC<FaceScreenProps> = ({
  config,
  expression,
  onWakeupComplete,
  visemeLevel = 0,
  audioPulseLevel = 0,
  manualGaze = null
}) => {
  return (
    <div className="w-full h-full bg-black select-none touch-none overflow-hidden relative">
      <RobotFace
        config={config}
        expression={expression}
        onWakeupComplete={onWakeupComplete}
        visemeLevel={visemeLevel}
        audioPulseLevel={audioPulseLevel}
        manualGaze={manualGaze}
      />
    </div>
  );
};

