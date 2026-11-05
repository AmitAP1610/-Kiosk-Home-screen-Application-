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
      {/* Robot Face Display Viewport (Near Black #202124) */}
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
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#30343B] border border-[#E9EDF2]/20 text-sm font-mono shadow-sm cursor-pointer hover:border-[#C49A45] transition-all"
          title="Internal Bus Static IP"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C49A45] animate-pulse" />
            <Wifi className="w-4 h-4 text-[#E9EDF2]" />
          </div>
          <span className="text-[#E9EDF2]/70 font-semibold text-xs uppercase">IP:</span>
          <span className="text-white font-bold tracking-wider text-sm">172.17.0.1</span>
        </div>
      </div>

      {/* TOP RIGHT: Voice prompt notice if not speaking */}
      {!isSpeaking && (
        <div className="absolute top-0 right-0 z-30 p-4 sm:p-6 pointer-events-auto">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#30343B] border border-[#E9EDF2]/20 text-white font-mono text-xs shadow-sm">
            <Volume2 className="w-3.5 h-3.5 text-[#C49A45]" />
            <span className="text-[#E9EDF2]">Tap screen for voice guide</span>
          </div>
        </div>
      )}

      {/* BOTTOM OVERLAY: Clean Engineering Navigation Control */}
      <div className="absolute bottom-6 left-0 right-0 z-30 px-4 sm:px-8 flex flex-col items-center justify-center space-y-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSkipOrExplore}
            className="min-h-[48px] px-8 py-3 rounded-xl bg-[#263746] hover:bg-[#1D2B37] text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-sm transition-all active:scale-98 border border-[#263746]"
          >
            <span>{isSpeaking ? 'Skip Intro & Enter Hub' : 'Enter Campus Hub'}</span>
            <ArrowRight className="w-4 h-4 text-[#C49A45]" />
          </button>

          {!isSpeaking && !hasStartedIntro && (
            <button
              onClick={startIntro}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#30343B] hover:bg-[#202124] border border-[#E9EDF2]/30 text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-sm active:scale-98"
            >
              <Volume2 className="w-4 h-4 text-[#E9EDF2]" />
              <span>Hear Intro Speech</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
