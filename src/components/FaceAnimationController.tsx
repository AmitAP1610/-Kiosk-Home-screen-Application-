import React, { useEffect } from 'react';
import { FaceExpression } from '../types/robot';
import { robotAudio } from '../utils/soundEffects';
import {
  Smile,
  Mic,
  Cpu,
  Volume2,
  Sparkles,
  HelpCircle,
  Moon,
  AlertOctagon,
  Zap,
  Sunrise,
  Sliders,
  Maximize,
  Minimize,
  Radio,
  Eye
} from 'lucide-react';

interface FaceAnimationControllerProps {
  currentExpression: FaceExpression;
  onSelectExpression: (exp: FaceExpression) => void;
  onOpenSettings: () => void;
  onOpenHardware: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  audioReactiveActive: boolean;
  onToggleAudioReactive: () => void;
  speechRecognitionActive: boolean;
  onToggleSpeechRecognition: () => void;
  onSpeakDemo: () => void;
  gazeTrackingActive: boolean;
  onToggleGazeTracking: () => void;
  onToggleHud: () => void;
}

export const FaceAnimationController: React.FC<FaceAnimationControllerProps> = ({
  currentExpression,
  onSelectExpression,
  onOpenSettings,
  onOpenHardware,
  isFullscreen,
  onToggleFullscreen,
  audioReactiveActive,
  onToggleAudioReactive,
  speechRecognitionActive,
  onToggleSpeechRecognition,
  onSpeakDemo,
  gazeTrackingActive,
  onToggleGazeTracking,
  onToggleHud
}) => {
  // Key bindings 1-9 and F, H
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '1':
          onSelectExpression('idle');
          break;
        case '2':
          robotAudio.playListening();
          onSelectExpression('attentive');
          break;
        case '3':
          onSelectExpression('thinking');
          break;
        case '4':
          onSpeakDemo();
          break;
        case '5':
          robotAudio.playHappy();
          onSelectExpression('happy');
          break;
        case '6':
          robotAudio.playConfused();
          onSelectExpression('curious');
          break;
        case '7':
          robotAudio.playSleep();
          onSelectExpression('sleepy');
          break;
        case '8':
          onSelectExpression('surprised');
          break;
        case '9':
          robotAudio.playError();
          onSelectExpression('error');
          break;
        case 'w':
        case 'W':
        case '0':
          robotAudio.playWakeUp();
          onSelectExpression('wakeup');
          break;
        case 'f':
        case 'F':
          onToggleFullscreen();
          break;
        case 'h':
        case 'H':
          onToggleHud();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onSelectExpression,
    onSpeakDemo,
    onToggleFullscreen,
    onToggleHud
  ]);

  const expressions: Array<{ id: FaceExpression; label: string; icon: React.FC<{ className?: string }>; sound?: () => void }> = [
    { id: 'idle', label: 'Idle (1)', icon: Smile },
    { id: 'attentive', label: 'Attentive (2)', icon: Mic, sound: () => robotAudio.playListening() },
    { id: 'thinking', label: 'Thinking (3)', icon: Cpu },
    { id: 'speaking', label: 'Speaking (4)', icon: Volume2, sound: onSpeakDemo },
    { id: 'happy', label: 'Happy (5)', icon: Sparkles, sound: () => robotAudio.playHappy() },
    { id: 'curious', label: 'Curious (6)', icon: HelpCircle, sound: () => robotAudio.playConfused() },
    { id: 'sleepy', label: 'Sleepy (7)', icon: Moon, sound: () => robotAudio.playSleep() },
    { id: 'surprised', label: 'Surprised (8)', icon: Zap },
    { id: 'error', label: 'Error (9)', icon: AlertOctagon, sound: () => robotAudio.playError() },
    { id: 'wakeup', label: 'Wake Up (W)', icon: Sunrise, sound: () => robotAudio.playWakeUp() },
  ];

  const handleExpressionClick = (item: typeof expressions[0]) => {
    if (item.sound) item.sound();
    onSelectExpression(item.id);
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[95vw] z-30 transition-all duration-300">
      <div className="bg-[#30343B] border border-[#B0B4B8]/40 rounded-xl p-1.5 px-2.5 shadow-sm flex flex-wrap items-center justify-center gap-1.5">
        {/* Expression Switcher Buttons */}
        <div className="flex items-center gap-1 bg-[#202124] p-1 rounded-lg">
          {expressions.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentExpression === item.id ||
              (item.id === 'attentive' && currentExpression === 'listening') ||
              (item.id === 'curious' && currentExpression === 'confused') ||
              (item.id === 'sleepy' && currentExpression === 'sleep');

            return (
              <button
                key={item.id}
                onClick={() => handleExpressionClick(item)}
                title={`Switch to ${item.label}`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isActive
                    ? item.id === 'error'
                      ? 'bg-red-700 text-white border border-red-500'
                      : 'bg-[#D49A36] text-[#202124] font-bold border border-[#D49A36]'
                    : 'text-[#B0B4B8] hover:text-white hover:bg-[#30343B]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#B0B4B8]'}`} />
                <span className="hidden lg:inline">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="hidden sm:block h-4 w-px bg-[#B0B4B8]/30" />

        {/* Interactive Toggles */}
        <div className="flex items-center gap-1">
          {/* Live Mic Listening */}
          <button
            onClick={onToggleAudioReactive}
            title={audioReactiveActive ? 'Disable Microphone Voice Reactivity' : 'Enable Live Mic Reactivity'}
            className={`p-2 rounded-lg text-xs border font-mono transition-all ${
              audioReactiveActive
                ? 'bg-[#D49A36] text-[#202124] font-bold border-[#D49A36]'
                : 'bg-[#202124] text-[#B0B4B8] border-transparent hover:text-white'
            }`}
          >
            <Mic className={`w-3.5 h-3.5 ${audioReactiveActive ? 'text-white' : ''}`} />
          </button>

          {/* Voice Command Recognition */}
          <button
            onClick={onToggleSpeechRecognition}
            title={speechRecognitionActive ? 'Disable Voice Commands' : 'Enable Voice Command Recognition ("happy", "sleep", "wake up", etc.)'}
            className={`p-2 rounded-lg text-xs border font-mono transition-all ${
              speechRecognitionActive
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-[#202124] text-[#B0B4B8] border-transparent hover:text-white'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${speechRecognitionActive ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* Gaze Tracking Toggle */}
          <button
            onClick={onToggleGazeTracking}
            title={gazeTrackingActive ? 'Gaze Tracking: Cursor Active' : 'Gaze Tracking: Locked to Center'}
            className={`p-2 rounded-lg text-xs border font-mono transition-all ${
              gazeTrackingActive
                ? 'bg-[#D49A36] text-[#202124] font-bold border-[#D49A36]'
                : 'bg-[#202124] text-[#B0B4B8] border-transparent hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Hardware IPC Modal */}
          <button
            onClick={onOpenHardware}
            title="Robot Hardware / WebSocket IPC Bridge"
            className="p-2 rounded-lg text-xs bg-[#202124] text-[#B0B4B8] hover:text-white hover:bg-[#17191C] transition-all font-mono"
          >
            <Cpu className="w-3.5 h-3.5 text-[#D49A36]" />
          </button>

          {/* Settings Customizer */}
          <button
            onClick={onOpenSettings}
            title="Face Configuration"
            className="p-2 rounded-lg text-xs bg-[#202124] text-[#B0B4B8] hover:text-white hover:bg-[#17191C] transition-all font-mono"
          >
            <Sliders className="w-3.5 h-3.5 text-[#D49A36]" />
          </button>

          {/* Fullscreen / Kiosk Mode */}
          <button
            onClick={onToggleFullscreen}
            title="Toggle Kiosk Fullscreen (F)"
            className="p-2 rounded-lg text-xs bg-[#202124] text-[#B0B4B8] hover:text-white hover:bg-[#17191C] transition-all font-mono"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
