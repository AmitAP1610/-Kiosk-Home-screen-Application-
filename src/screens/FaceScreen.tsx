import React, { useEffect, useRef } from 'react';
import { FaceConfig, FaceExpression, GazeTarget, StereoGaze } from '../types/robot';
import { RobotFace } from '../components/face/RobotFace';
import { textToSpeech } from '../services/textToSpeech';
import { speechToText } from '../services/speechToText';
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
  const hasTriggeredShiftRef = useRef(false);

  // Trigger Intro Speech with audio pipeline unlock & microphone authorization
  const startIntro = async () => {
    // 1. Immediately unlock speech synthesis engine
    textToSpeech.unlockAudioEngine();

    // 2. Request microphone permission upfront for the session
    speechToText.requestMicrophonePermission().catch(() => {});

    // 3. Play the introductory speech
    if (onSpeakIntro) {
      onSpeakIntro(INTRO_SPEECH, () => {
        if (!hasTriggeredShiftRef.current) {
          hasTriggeredShiftRef.current = true;
          setTimeout(() => {
            if (onIntroComplete) onIntroComplete();
          }, 800);
        }
      });
    }
  };

  // Attempt auto-intro on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      startIntro();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleFaceTap = () => {
    if (onInterruptSpeech) onInterruptSpeech();
    if (!hasTriggeredShiftRef.current && onIntroComplete) {
      hasTriggeredShiftRef.current = true;
      onIntroComplete();
    }
  };

  const handleSkipOrExplore = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handleFaceTap();
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              startIntro();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#263746] border border-[#C49A45] text-white font-mono text-xs shadow-lg animate-pulse hover:bg-[#30343B] transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-[#C49A45]" />
            <span className="text-[#E9EDF2] font-semibold">Tap to Activate Voice</span>
          </button>
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

          {!isSpeaking && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startIntro();
              }}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#C49A45] hover:bg-[#B38734] text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-white" />
              <span>Hear Robot Voice</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
