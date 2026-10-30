import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppScreen, FaceExpression, FaceConfig, HardwareMessage, SystemStatus } from './types/robot';
import { DEFAULT_CONFIG } from './utils/expressionPresets';
import { TopBar } from './components/navigation/TopBar';
import { NavigationBar } from './components/navigation/NavigationBar';
import { FaceAnimationController } from './components/face/FaceAnimationController';
import { SettingsModal } from './components/SettingsModal';
import { HardwareBridgeModal } from './components/HardwareBridgeModal';

// Screens
import { FaceScreen } from './screens/FaceScreen';
import { SSUWelcomeScreen } from './screens/SSUWelcomeScreen';
import { AssistantScreen } from './screens/AssistantScreen';
import { UniversityInfoScreen } from './screens/UniversityInfoScreen';
import { CampusFacilitiesScreen } from './screens/CampusFacilitiesScreen';
import { CameraScreen } from './screens/CameraScreen';
import { ControlScreen } from './screens/ControlScreen';
import { MappingScreen } from './screens/MappingScreen';
import { NavScreen } from './screens/NavScreen';
import { MonitorScreen } from './screens/MonitorScreen';
import { VoiceDiagnosticsScreen } from './screens/VoiceDiagnosticsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

// Hooks
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { useAudioReactive } from './hooks/useAudioReactive';
import { useHardwareBridge } from './hooks/useHardwareBridge';

export const App: React.FC = () => {
  // Navigation Screen State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('face');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
  const [isBarsVisible, setIsBarsVisible] = useState(false); // Clean display on Face screen by default

  // Language state (Persisted in localStorage)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    return localStorage.getItem('kairo_stt_lang') || 'en-IN';
  });

  const handleSelectLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem('kairo_stt_lang', lang);
  };

  // Auto-hiding bars timeout ref
  const barsTimeoutRef = useRef<number | null>(null);

  // Central Tablet Voice Assistant Hook
  const {
    state: voiceState,
    isListening: isAssistantListening,
    isSpeaking,
    visemeLevel,
    transcript,
    interimTranscript,
    chatHistory,
    errorMessage: voiceErrorMessage,
    isSTTSupported,
    startListening,
    stopListening,
    interrupt,
    sendMessage,
    retry: retryVoice,
    availableVoices,
    selectedVoice,
    rate: speechRate,
    pitch: speechPitch,
    volume: speechVolume,
    setRate: setSpeechRate,
    setPitch: setSpeechPitch,
    setVolume: setSpeechVolume,
    setSelectedVoice
  } = useVoiceAssistant({
    language: selectedLanguage,
    onExpressionChange: (exp) => setExpression(exp),
    onMovementCommand: (_cmd) => {
      // Forward to Jetson safety layer via hardware bridge if connected
    }
  });

  // Audio Reactive (Microphone level analyser for attentive eye pulse)
  const {
    isListening: micAnalyserActive,
    audioLevel: micAudioLevel
  } = useAudioReactive();

  // Hardware Bridge (WebSocket / Serial / Jetson IPC) Hook
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
    onSpeak: (text) => sendMessage(text),
    onConfigChange: (partial) => handleUpdateConfig({ ...config, ...partial })
  });

  // System status object
  const systemStatus: SystemStatus = {
    tabletBattery: 92,
    isTabletCharging: false,
    jetsonConnected: connectionStatus === 'connected',
    arduinoConnected: connectionStatus === 'connected',
    lidarConnected: connectionStatus === 'connected',
    cameraActive: currentScreen === 'camera',
    motorEStop: false
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

  // Show UI controls temporarily when hovering near screen edges or interacting
  const triggerBarsTemporarily = useCallback(() => {
    setIsBarsVisible(true);
    if (barsTimeoutRef.current) clearTimeout(barsTimeoutRef.current);
    barsTimeoutRef.current = window.setTimeout(() => {
      if (!isSettingsOpen && !isHardwareOpen && !isMenuOpen) {
        setIsBarsVisible(false);
      }
    }, 3500);
  }, [isSettingsOpen, isHardwareOpen, isMenuOpen]);

  // Wakeup completion handler
  const handleWakeupDone = () => {
    setExpression('idle');
  };

  // On non-face screens, top bar should always be visible
  const isTopBarActive = currentScreen !== 'face' || isBarsVisible || isMenuOpen || isSettingsOpen || isHardwareOpen;

  return (
    <div
      className="relative w-screen h-screen bg-black overflow-hidden select-none touch-none m-0 p-0 font-sans"
      onPointerMove={(e) => {
        // If on face screen, reveal bars when pointer moves near top 12% or bottom 12%
        if (currentScreen === 'face') {
          if (e.clientY < window.innerHeight * 0.12 || e.clientY > window.innerHeight * 0.88) {
            triggerBarsTemporarily();
          }
        }
      }}
      onPointerDown={(e) => {
        if (currentScreen === 'face') {
          if (e.clientY < window.innerHeight * 0.12 || e.clientY > window.innerHeight * 0.88) {
            triggerBarsTemporarily();
          }
        }
      }}
    >
      {/* Top Application Bar */}
      <TopBar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        onOpenMenu={() => setIsMenuOpen(true)}
        systemStatus={systemStatus}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        visible={isTopBarActive}
      />

      {/* Main Screen Switcher */}
      <main className="w-full h-full relative">
        {currentScreen === 'face' && (
          <FaceScreen
            config={config}
            expression={expression}
            onWakeupComplete={handleWakeupDone}
            visemeLevel={visemeLevel}
            audioPulseLevel={isAssistantListening || micAnalyserActive ? (micAudioLevel || 0.6) : 0}
          />
        )}

        {currentScreen === 'welcome' && (
          <SSUWelcomeScreen
            onSelectScreen={setCurrentScreen}
            onSpeakText={(text) => sendMessage(text)}
            isSpeaking={isSpeaking}
            onInterruptSpeech={interrupt}
          />
        )}

        {currentScreen === 'assistant' && (
          <AssistantScreen
            state={voiceState}
            transcript={transcript}
            interimTranscript={interimTranscript}
            chatHistory={chatHistory}
            isListening={isAssistantListening}
            isSpeaking={isSpeaking}
            onStartListening={startListening}
            onStopListening={stopListening}
            onInterrupt={interrupt}
            onSendMessage={sendMessage}
            onRetry={retryVoice}
            errorMessage={voiceErrorMessage}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleSelectLanguage}
            isSTTSupported={isSTTSupported}
          />
        )}

        {currentScreen === 'university-info' && (
          <UniversityInfoScreen />
        )}

        {currentScreen === 'facilities' && (
          <CampusFacilitiesScreen />
        )}

        {currentScreen === 'diagnostics' && (
          <VoiceDiagnosticsScreen assistantState={voiceState} />
        )}

        {currentScreen === 'camera' && (
          <CameraScreen />
        )}

        {currentScreen === 'control' && (
          <ControlScreen
            isJetsonConnected={connectionStatus === 'connected'}
            isArduinoConnected={connectionStatus === 'connected'}
            onEmergencyStop={() => {
              interrupt();
              setExpression('error');
            }}
          />
        )}

        {currentScreen === 'mapping' && (
          <MappingScreen lidarConnected={connectionStatus === 'connected'} />
        )}

        {currentScreen === 'navigation' && (
          <NavScreen />
        )}

        {currentScreen === 'monitor' && (
          <MonitorScreen systemStatus={systemStatus} />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            config={config}
            onUpdateConfig={handleUpdateConfig}
            onOpenFaceSettingsModal={() => setIsSettingsOpen(true)}
            wsUrl={wsUrl}
            onUpdateWsUrl={setWsUrl}
            availableVoices={availableVoices}
            selectedVoice={selectedVoice}
            onSelectVoice={setSelectedVoice}
            speechRate={speechRate}
            onUpdateSpeechRate={setSpeechRate}
            speechPitch={speechPitch}
            onUpdateSpeechPitch={setSpeechPitch}
            speechVolume={speechVolume}
            onUpdateSpeechVolume={setSpeechVolume}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleSelectLanguage}
          />
        )}
      </main>

      {/* Floating Face Expression Controller (Only on Face screen, auto-hides) */}
      {currentScreen === 'face' && (
        <div
          className={`transition-all duration-300 ${
            isBarsVisible || isSettingsOpen || isHardwareOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <FaceAnimationController
            currentExpression={expression}
            onSelectExpression={(exp) => {
              setExpression(exp);
              triggerBarsTemporarily();
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenHardware={() => setIsHardwareOpen(true)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            audioReactiveActive={isAssistantListening || micAnalyserActive}
            onToggleAudioReactive={() => {
              if (isAssistantListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            speechRecognitionActive={isAssistantListening}
            onToggleSpeechRecognition={() => {
              if (isAssistantListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            onSpeakDemo={() => {
              sendMessage("I am KAIRO, your intelligent robot companion. All systems nominal.");
            }}
            gazeTrackingActive={config.enableGazeTracking}
            onToggleGazeTracking={() =>
              handleUpdateConfig({ ...config, enableGazeTracking: !config.enableGazeTracking })
            }
            onToggleHud={() => setIsBarsVisible(!isBarsVisible)}
          />
        </div>
      )}

      {/* Slide-over Screen Navigation Drawer */}
      <NavigationBar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        systemStatus={systemStatus}
      />

      {/* Face Customization Modal */}
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
