import React, { useState, useEffect } from 'react';
import { AppScreen, FaceExpression, FaceConfig, HardwareMessage, SystemStatus } from './types/robot';
import { DEFAULT_CONFIG } from './utils/expressionPresets';
import { TopBar } from './components/navigation/TopBar';
import { NavigationBar } from './components/navigation/NavigationBar';
import { SettingsModal } from './components/SettingsModal';
import { HardwareBridgeModal } from './components/HardwareBridgeModal';

// Screens
import { FaceScreen } from './screens/FaceScreen';
import { HubScreen } from './screens/HubScreen';
import { PhotoGalleryScreen } from './screens/PhotoGalleryScreen';
import { MapInfoScreen } from './screens/MapInfoScreen';
import { SessionsAgendaScreen } from './screens/SessionsAgendaScreen';
import { RoboInfoScreen } from './screens/RoboInfoScreen';
import { SSUWelcomeScreen } from './screens/SSUWelcomeScreen';
import { AssistantScreen } from './screens/AssistantScreen';
import { UniversityInfoScreen } from './screens/UniversityInfoScreen';
import { CampusFacilitiesScreen } from './screens/CampusFacilitiesScreen';
import { CameraScreen } from './screens/CameraScreen';
import { ControlScreen } from './screens/ControlScreen';
import { MappingScreen } from './screens/MappingScreen';
import { NavScreen } from './screens/NavScreen';
import { GuidedTourScreen } from './screens/GuidedTourScreen';
import { MonitorScreen } from './screens/MonitorScreen';
import { VoiceDiagnosticsScreen } from './screens/VoiceDiagnosticsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

// Hooks
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { useAudioReactive } from './hooks/useAudioReactive';
import { useHardwareBridge } from './hooks/useHardwareBridge';
import { jetsonBridge } from './services/jetsonBridge';

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

  // Language state (Persisted in localStorage)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    return localStorage.getItem('kiosk_stt_lang') || localStorage.getItem('kairo_stt_lang') || 'en-IN';
  });

  const handleSelectLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem('kiosk_stt_lang', lang);
  };

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
    speakDirect,
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
    onMovementCommand: (cmd) => {
      // Forward real movement velocity command to Jetson safety layer & Arduino motors
      jetsonBridge.startTeleop(cmd.linear, cmd.angular);
      setTimeout(() => {
        jetsonBridge.stopTeleop();
      }, 1500);
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

  // Fullscreen toggle with Android landscape orientation lock
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        try {
          if ('orientation' in screen && 'lock' in (screen.orientation as any)) {
            (screen.orientation as any).lock('landscape').catch(() => {});
          }
        } catch {}
      }).catch(() => {});
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

  // Screen Wake Lock API for Android Tablet Kiosk mode (keeps tablet screen awake)
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch {}
    };
    requestWakeLock();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (wakeLock) {
        try { wakeLock.release(); } catch {}
      }
    };
  }, []);

  // Prevent default context menu on Android tablet long-press
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Wakeup completion handler
  const handleWakeupDone = () => {
    setExpression('idle');
  };

  // On custom tablet flow screens (Face, Hub, Gallery, Map, Sessions, Robo-info), keep clean immersion
  const isCustomTabletScreen =
    currentScreen === 'face' ||
    currentScreen === 'hub' ||
    currentScreen === 'gallery' ||
    currentScreen === 'map-info' ||
    currentScreen === 'sessions-agenda' ||
    currentScreen === 'robo-info';

  const isTopBarActive = !isCustomTabletScreen && (isSettingsOpen || isHardwareOpen);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none touch-none m-0 p-0 font-sans">
      {/* Top Application Bar (Disabled on kiosk screens) */}
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
            onIntroComplete={() => setCurrentScreen('hub')}
            onSpeakIntro={(text, onEnd) => speakDirect(text, onEnd)}
            isSpeaking={isSpeaking}
            onInterruptSpeech={interrupt}
          />
        )}

        {currentScreen === 'hub' && (
          <HubScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            onOpenVoiceAssistant={() => setCurrentScreen('assistant')}
            onOpenMenu={() => setIsMenuOpen(true)}
            onSpeakGreeting={(text) => speakDirect(text)}
            isSpeaking={isSpeaking}
          />
        )}

        {currentScreen === 'gallery' && (
          <PhotoGalleryScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            onOpenMenu={() => setIsMenuOpen(true)}
            onSpeakText={(text) => speakDirect(text)}
          />
        )}

        {currentScreen === 'map-info' && (
          <MapInfoScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            onSpeakText={(text) => speakDirect(text)}
            isSpeaking={isSpeaking}
          />
        )}

        {currentScreen === 'sessions-agenda' && (
          <SessionsAgendaScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            onSpeakText={(text) => speakDirect(text)}
            isSpeaking={isSpeaking}
          />
        )}

        {currentScreen === 'robo-info' && (
          <RoboInfoScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            onSpeakText={(text) => speakDirect(text)}
            isSpeaking={isSpeaking}
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
            onNavigate={(scr) => setCurrentScreen(scr)}
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
          <UniversityInfoScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            onSpeakText={(text) => speakDirect(text)}
          />
        )}

        {currentScreen === 'facilities' && (
          <CampusFacilitiesScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            onSpeakText={(text) => speakDirect(text)}
          />
        )}

        {currentScreen === 'diagnostics' && (
          <VoiceDiagnosticsScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            assistantState={voiceState}
          />
        )}

        {currentScreen === 'camera' && (
          <CameraScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
          />
        )}

        {currentScreen === 'control' && (
          <ControlScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            isJetsonConnected={connectionStatus === 'connected'}
            isArduinoConnected={connectionStatus === 'connected'}
            onEmergencyStop={() => {
              interrupt();
              setExpression('error');
            }}
          />
        )}

        {currentScreen === 'mapping' && (
          <MappingScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            lidarConnected={connectionStatus === 'connected'}
          />
        )}

        {currentScreen === 'navigation' && (
          <NavScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
          />
        )}

        {currentScreen === 'guided-tour' && (
          <GuidedTourScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            onSpeakText={(text, onEnd) => speakDirect(text, onEnd)}
            isSpeaking={isSpeaking}
          />
        )}

        {currentScreen === 'monitor' && (
          <MonitorScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            systemStatus={systemStatus}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            onSpeakText={(text) => speakDirect(text)}
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

      {/* Complete Application Navigation Drawer */}
      <NavigationBar
        currentScreen={currentScreen}
        onSelectScreen={(screen) => {
          setCurrentScreen(screen);
          setIsMenuOpen(false);
        }}
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
