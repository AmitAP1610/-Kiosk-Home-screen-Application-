import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaceExpression, FaceConfig, HardwareMessage } from './types/robot';
import { DEFAULT_CONFIG } from './utils/expressionPresets';
import { RobotFace } from './components/RobotFace';
import { FaceAnimationController } from './components/FaceAnimationController';
import { SettingsModal } from './components/SettingsModal';
import { HardwareBridgeModal } from './components/HardwareBridgeModal';
import { useAudioReactive } from './hooks/useAudioReactive';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useHardwareBridge } from './hooks/useHardwareBridge';
import { robotAudio } from './utils/soundEffects';

export const App: React.FC = () => {
  // Configuration with local storage cache
  const [config, setConfig] = useState<FaceConfig>(() => {
    try {
      const saved = localStorage.getItem('robot_face_config_v3');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const handleUpdateConfig = (newConfig: FaceConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('robot_face_config_v3', JSON.stringify(newConfig));
    } catch {}
  };

  // Face Expression State
  const [expression, setExpression] = useState<FaceExpression>('idle');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHardwareOpen, setIsHardwareOpen] = useState(false);
  const [isHudVisible, setIsHudVisible] = useState(false); // Clean display by default

  // Auto-hiding HUD timeout ref
  const hudTimeoutRef = useRef<number | null>(null);

  // Speech Synthesis Hook
  const {
    isSpeaking,
    visemeLevel: ttsVisemeLevel,
    speak,
    stop: stopSpeaking
  } = useSpeechSynthesis({
    onStart: () => setExpression('speaking'),
    onEnd: () => setExpression('idle')
  });

  // Audio Reactive (Microphone) Hook
  const {
    isListening: micListening,
    audioLevel: micAudioLevel,
    toggleListening: toggleMicListening
  } = useAudioReactive();

  // Speech Recognition (Voice Commands) Hook
  const handleVoiceCommand = useCallback((_cmd: string, exp?: FaceExpression) => {
    if (exp) {
      if (exp === 'happy') robotAudio.playHappy();
      else if (exp === 'curious' || exp === 'confused') robotAudio.playConfused();
      else if (exp === 'sleep' || exp === 'sleepy') robotAudio.playSleep();
      else if (exp === 'error') robotAudio.playError();
      else if (exp === 'wakeup') robotAudio.playWakeUp();
      else if (exp === 'attentive' || exp === 'listening') robotAudio.playListening();

      setExpression(exp);
    }
  }, []);

  const {
    isRecognizing,
    toggleRecognition
  } = useSpeechRecognition({
    onCommand: handleVoiceCommand
  });

  // Hardware Bridge (WebSocket / Serial / IPC) Hook
  const {
    wsUrl,
    setWsUrl,
    connectionStatus,
    connect: connectHardware,
    disconnect: disconnectHardware,
    simulateHardwareCommand,
    logMessages
  } = useHardwareBridge({
    onExpressionChange: (newExp) => setExpression(newExp),
    onSpeak: (text) => speak(text),
    onConfigChange: (partial) => handleUpdateConfig({ ...config, ...partial })
  });

  // Viseme mouth level
  const effectiveVisemeLevel = isSpeaking
    ? ttsVisemeLevel
    : micListening && micAudioLevel > 0.1
    ? micAudioLevel * 0.95
    : 0;

  // React to mic speaking
  useEffect(() => {
    if (micListening && !isSpeaking) {
      if (micAudioLevel > 0.15 && expression !== 'speaking') {
        setExpression('speaking');
      } else if (micAudioLevel <= 0.15 && expression === 'speaking') {
        setExpression('attentive');
      }
    }
  }, [micListening, micAudioLevel, isSpeaking, expression]);

  // Demo speak phrases
  const demoPhrases = [
    "Hello there. All systems are nominal and ready.",
    "I am your clean, friendly robotic assistant.",
    "Visual and audio telemetry active.",
    "Have a pleasant day!"
  ];
  const demoPhraseIndex = useRef(0);

  const handleSpeakDemo = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const phrase = demoPhrases[demoPhraseIndex.current % demoPhrases.length];
      demoPhraseIndex.current += 1;
      speak(phrase);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Show HUD briefly when hovering near bottom or on user activity
  const triggerHudTemporarily = useCallback(() => {
    setIsHudVisible(true);
    if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    hudTimeoutRef.current = window.setTimeout(() => {
      if (!isSettingsOpen && !isHardwareOpen) {
        setIsHudVisible(false);
      }
    }, 3200);
  }, [isSettingsOpen, isHardwareOpen]);

  // Wakeup completion handler
  const handleWakeupDone = () => {
    setExpression('idle');
  };

  return (
    <div
      className="relative w-screen h-screen bg-black overflow-hidden select-none touch-none m-0 p-0 font-sans"
      onPointerMove={(e) => {
        // Reveal HUD only if hovering in bottom 10% of screen
        if (e.clientY > window.innerHeight * 0.90) {
          triggerHudTemporarily();
        }
      }}
      onPointerDown={(e) => {
        // Only trigger HUD if clicked directly in bottom 10% bar area
        if (e.clientY > window.innerHeight * 0.90) {
          triggerHudTemporarily();
        }
      }}
    >
      {/* Primary Scalable Face UI on Pure Black Canvas (No status labels, no panels) */}
      <RobotFace
        config={config}
        expression={expression}
        onWakeupComplete={handleWakeupDone}
        visemeLevel={effectiveVisemeLevel}
        audioPulseLevel={micListening ? micAudioLevel : 0}
      />

      {/* Floating Controller HUD (Appears only on bottom hover/click or shortcut, auto-hides) */}
      <div
        className={`transition-all duration-300 ${
          isHudVisible || isSettingsOpen || isHardwareOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <FaceAnimationController
          currentExpression={expression}
          onSelectExpression={(exp) => {
            setExpression(exp);
            triggerHudTemporarily();
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHardware={() => setIsHardwareOpen(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          audioReactiveActive={micListening}
          onToggleAudioReactive={toggleMicListening}
          speechRecognitionActive={isRecognizing}
          onToggleSpeechRecognition={toggleRecognition}
          onSpeakDemo={handleSpeakDemo}
          gazeTrackingActive={config.enableGazeTracking}
          onToggleGazeTracking={() =>
            handleUpdateConfig({ ...config, enableGazeTracking: !config.enableGazeTracking })
          }
          onToggleHud={() => setIsHudVisible(!isHudVisible)}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onChangeConfig={handleUpdateConfig}
      />

      {/* Hardware Bridge Modal */}
      <HardwareBridgeModal
        isOpen={isHardwareOpen}
        onClose={() => setIsHardwareOpen(false)}
        wsUrl={wsUrl}
        setWsUrl={setWsUrl}
        connectionStatus={connectionStatus}
        onConnect={() => connectHardware(wsUrl)}
        onDisconnect={disconnectHardware}
        onSimulateCommand={(msg: HardwareMessage) => simulateHardwareCommand(msg)}
        logMessages={logMessages}
      />
    </div>
  );
};

export default App;
