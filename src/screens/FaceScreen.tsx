import React, { useState, useEffect, useRef } from 'react';
import { FaceConfig, FaceExpression, GazeTarget, StereoGaze } from '../types/robot';
import { RobotFace } from '../components/face/RobotFace';
import {
  Wifi,
  Volume2,
  ArrowRight
} from 'lucide-react';

interface FaceScreenProps {
  config: FaceConfig;
  expression: FaceExpression;
  onWakeupComplete?: () => void;
  visemeLevel?: number;
  audioPulseLevel?: number;
  manualGaze?: GazeTarget | StereoGaze | null;
  onIntroComplete?: () => void;
  onSpeakIntro?: (text: string, onEnd?: () => void) => void;
  isSpeaking?: boolean;
  onInterruptSpeech?: () => void;
}

const INTRO_SPEECH =
  "Namaste! Welcome to Sri Sri University. I am Kiosk, created by the Sri Sri University Robotics Club. I am here to guide you across our campus, show you today's academic sessions and agenda, and share our robotics story. Let's explore together!";

export const FaceScreen: React.FC<FaceScreenProps> = ({
  config,
  expression,
  onWakeupComplete,
  visemeLevel = 0,
  audioPulseLevel = 0,
  manualGaze = null,
  onIntroComplete,
  onSpeakIntro,
  isSpeaking = false,
  onInterruptSpeech
}) => {
  const [hasStartedIntro, setHasStartedIntro] = useState(false);
  const hasTriggeredShiftRef = useRef(false);

  // Trigger Intro Speech
  const startIntro = () => {
    setHasStartedIntro(true);

    if (onSpeakIntro) {
      onSpeakIntro(INTRO_SPEECH, () => {
        if (!hasTriggeredShiftRef.current) {
          hasTriggeredShiftRef.current = true;
          setTimeout(() => {
            if (onIntroComplete) onIntroComplete();
          }, 800);
        }
      });
    } else {
      setTimeout(() => {
        if (!hasTriggeredShiftRef.current && onIntroComplete) {
          hasTriggeredShiftRef.current = true;
          onIntroComplete();
        }
      }, 6000);
    }
  };

  // Auto-attempt voice intro on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      startIntro();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleFaceTap = () => {
    if (!isSpeaking) {
      startIntro();
    }
  };

  const handleSkipOrExplore = () => {
    if (onInterruptSpeech) onInterruptSpeech();
    if (!hasTriggeredShiftRef.current && onIntroComplete) {
      hasTriggeredShiftRef.current = true;
      onIntroComplete();
    }
  };

  return (
    <div
      onClick={handleFaceTap}
      className="w-full h-full bg-[#202124] select-none overflow-hidden relative cursor-pointer"
    >
      {/* Robot Face Display Viewport */}
      <RobotFace
        config={config}
        expression={expression}
        onWakeupComplete={onWakeupComplete}
        visemeLevel={visemeLevel}
        audioPulseLevel={audioPulseLevel}
        manualGaze={manualGaze}
      />

      {/* TOP LEFT: Static IP 172.17.0.1 (AMR Industrial Badge) */}
      <div className="absolute top-0 left-0 z-30 p-4 sm:p-6 pointer-events-auto">
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onSpeakIntro) onSpeakIntro("Hardware network static IP is 172.17.0.1 on the internal robot communication bus.");
          }}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#30343B] border border-[#B0B4B8]/40 text-sm font-mono shadow-sm cursor-pointer hover:border-[#D49A36] transition-colors"
          title="Internal Bus Static IP"
        >
          <Wifi className="w-4 h-4 text-[#D49A36]" />
          <span className="text-[#B0B4B8] font-semibold text-xs uppercase">IP:</span>
          <span className="text-white font-bold tracking-wider text-sm">172.17.0.1</span>
        </div>
      </div>

      {/* TOP RIGHT: Voice prompt notice if not speaking */}
      {!isSpeaking && (
        <div className="absolute top-0 right-0 z-30 p-4 sm:p-6 pointer-events-auto">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#30343B] border border-[#B0B4B8]/40 text-white font-mono text-xs shadow-sm">
            <Volume2 className="w-3.5 h-3.5 text-[#D49A36]" />
            <span className="text-[#B0B4B8]">Tap screen for voice guide</span>
          </div>
        </div>
      )}

      {/* BOTTOM OVERLAY: Clean Engineering Navigation Control */}
      <div className="absolute bottom-6 left-0 right-0 z-30 px-4 sm:px-8 flex flex-col items-center justify-center space-y-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSkipOrExplore}
            className="px-7 py-3.5 rounded-lg bg-[#D49A36] hover:bg-[#C0882B] text-[#202124] font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-sm transition-all active:scale-98 border border-[#D49A36]"
          >
            <span>{isSpeaking ? 'Skip Intro & Enter Hub' : 'Enter Campus Hub'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!isSpeaking && !hasStartedIntro && (
            <button
              onClick={startIntro}
              className="px-6 py-3.5 rounded-lg bg-[#30343B] hover:bg-[#202124] border border-[#B0B4B8]/40 text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-sm"
            >
              <Volume2 className="w-4 h-4 text-[#D49A36]" />
              <span>Hear Intro Speech</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
