import React, { useState, useEffect, useRef } from 'react';
import { FaceConfig, FaceExpression, GazeTarget, StereoGaze } from '../types/robot';
import { RobotFace } from '../components/face/RobotFace';
import {
  Wifi,
  Volume2,
  ArrowRight,
  Sparkles
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
  const [showSubtitle, setShowSubtitle] = useState(false);
  const hasTriggeredShiftRef = useRef(false);

  // Trigger Intro Speech
  const startIntro = () => {
    setHasStartedIntro(true);
    setShowSubtitle(true);

    if (onSpeakIntro) {
      onSpeakIntro(INTRO_SPEECH, () => {
        // "after the intro the screen will shift to the next"
        if (!hasTriggeredShiftRef.current) {
          hasTriggeredShiftRef.current = true;
          setTimeout(() => {
            if (onIntroComplete) onIntroComplete();
          }, 800);
        }
      });
    } else {
      // Fallback timer if speech is unsupported
      setTimeout(() => {
        if (!hasTriggeredShiftRef.current && onIntroComplete) {
          hasTriggeredShiftRef.current = true;
          onIntroComplete();
        }
      }, 6000);
    }
  };

  // Auto-attempt voice intro on mount (within gesture limitations)
  useEffect(() => {
    const timer = setTimeout(() => {
      startIntro();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle tap anywhere on face to ensure browser speech gesture unlock
  const handleFaceTap = () => {
    if (!isSpeaking) {
      startIntro();
    }
  };

  // Immediate manual transition
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
      className="w-full h-full bg-black select-none overflow-hidden relative cursor-pointer"
    >
      {/* Robot Face Visuals */}
      <RobotFace
        config={config}
        expression={expression}
        onWakeupComplete={onWakeupComplete}
        visemeLevel={visemeLevel}
        audioPulseLevel={audioPulseLevel}
        manualGaze={manualGaze}
      />

      {/* TOP: Clean IP: 172.17.0.1 (Strictly matches user's Notebook Sketch Box 1, Crisp & Sharp) */}
      <div className="absolute top-0 left-0 z-30 p-4 sm:p-6 pointer-events-auto">
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onSpeakIntro) onSpeakIntro("Hardware network static IP is 172.17.0.1 on the internal robot communication bus.");
          }}
          className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-black border-2 border-[#00f3ff]/60 text-sm sm:text-base font-mono shadow-2xl cursor-pointer hover:border-[#00f3ff] transition-colors"
          title="Robot Static IP"
        >
          <Wifi className="w-5 h-5 text-[#00f3ff] animate-pulse" />
          <span className="text-slate-300 font-bold">IP:</span>
          <span className="text-[#00f3ff] font-black tracking-wider text-base sm:text-lg">172.17.0.1</span>
        </div>
      </div>

      {/* TOP RIGHT: Voice prompt notice if not speaking */}
      {!isSpeaking && (
        <div className="absolute top-0 right-0 z-30 p-4 sm:p-6 pointer-events-auto">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/85 border border-[#C8A451]/70 text-[#C8A451] font-mono text-xs sm:text-sm animate-pulse shadow-xl">
            <Volume2 className="w-4 h-4 text-[#C8A451]" />
            <span>Tap face to hear voice guide</span>
          </div>
        </div>
      )}

      {/* BOTTOM OVERLAY: Subtitles & Screen Shift Transition Trigger */}
      <div className="absolute bottom-6 left-0 right-0 z-30 px-4 sm:px-8 flex flex-col items-center justify-center space-y-4 pointer-events-auto">
        {/* Voice Subtitles / Speech Bubble */}
        {showSubtitle && (
          <div className="max-w-3xl w-full p-6 rounded-3xl bg-black border-2 border-[#00f3ff] shadow-[0_0_40px_rgba(0,243,255,0.35)] text-center space-y-3 transition-all animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-mono text-[#00f3ff] uppercase font-black tracking-widest">
              <Sparkles className="w-5 h-5" />
              <span>Kiosk Spoken Introduction</span>
            </div>
            <p className="text-lg sm:text-2xl text-white font-medium leading-relaxed font-sans">
              "{INTRO_SPEECH}"
            </p>
            {isSpeaking && (
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="w-2.5 h-5 bg-[#00f3ff] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2.5 h-8 bg-[#C8A451] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2.5 h-5 bg-[#00f3ff] rounded-full animate-bounce" />
              </div>
            )}
          </div>
        )}

        {/* Transition Buttons ("after the intro the screen will shift to the next") */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSkipOrExplore}
            className="group px-9 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#702815] to-[#C8A451] hover:brightness-110 text-white font-black text-base sm:text-lg flex items-center gap-3 shadow-[0_0_35px_rgba(200,164,81,0.6)] transition-all active:scale-95 border-2 border-white/40"
          >
            <span>{isSpeaking ? 'Skip Intro & Enter Hub' : 'Enter Campus Hub'}</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
          </button>

          {!isSpeaking && !hasStartedIntro && (
            <button
              onClick={startIntro}
              className="px-8 py-4 sm:py-5 rounded-2xl bg-black/90 hover:bg-black border-2 border-[#00f3ff]/60 text-[#00f3ff] font-black text-base sm:text-lg flex items-center gap-2.5 transition-all shadow-xl"
            >
              <Volume2 className="w-6 h-6" />
              <span>Hear Intro Speech</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
