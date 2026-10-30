import React, { useState, useEffect } from 'react';
import { speechToText, STTErrorType } from '../services/speechToText';
import { textToSpeech } from '../services/textToSpeech';
import { VoiceAssistantState } from '../types/robot';
import {
  Wrench,
  Mic,
  Volume2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Play,
  Square,
  ShieldAlert,
  Terminal
} from 'lucide-react';

interface VoiceDiagnosticsScreenProps {
  assistantState: VoiceAssistantState;
}

export const VoiceDiagnosticsScreen: React.FC<VoiceDiagnosticsScreenProps> = ({
  assistantState
}) => {
  const [userAgent, setUserAgent] = useState('');
  const [isSecureContext, setIsSecureContext] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [micPermission, setMicPermission] = useState<string>('checking...');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedTestVoice, setSelectedTestVoice] = useState<string>('');
  const [testSpeechText, setTestSpeechText] = useState('Welcome to Sri Sri University. All diagnostic systems are functioning normally.');
  const [sttTestActive, setSttTestActive] = useState(false);
  const [sttLiveTranscript, setSttLiveTranscript] = useState('');
  const [sttTestError, setSttTestError] = useState<string | null>(null);
  const [isSpeakingTest, setIsSpeakingTest] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 30)]);
  };

  const runDiagnostics = async () => {
    addLog('Initiating hardware & browser capability audit...');
    if (typeof window !== 'undefined') {
      setUserAgent(navigator.userAgent);
      setIsSecureContext(window.isSecureContext);
      setSttSupported(speechToText.isSupported());
      setTtsSupported(textToSpeech.isSupported());

      // Check mic permission
      const perm = await speechToText.checkMicrophonePermission();
      setMicPermission(perm);
      addLog(`Microphone permission state: ${perm}`);

      // Voices
      const loadedVoices = textToSpeech.getVoices();
      setVoices(loadedVoices);
      if (loadedVoices.length > 0 && !selectedTestVoice) {
        setSelectedTestVoice(loadedVoices[0].voiceURI);
      }
      addLog(`Loaded ${loadedVoices.length} SpeechSynthesis voices.`);
    }
  };

  useEffect(() => {
    runDiagnostics();
    const timer = setInterval(() => {
      if (voices.length === 0) {
        setVoices(textToSpeech.getVoices());
      }
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const handleRequestMic = async () => {
    addLog('Requesting microphone access via getUserMedia...');
    const granted = await speechToText.requestMicrophonePermission();
    if (granted) {
      setMicPermission('granted');
      addLog('Microphone permission GRANTED successfully.');
    } else {
      setMicPermission('denied');
      addLog('Microphone permission DENIED or dismissed.');
    }
  };

  const handleStartSTTTest = () => {
    setSttTestActive(true);
    setSttLiveTranscript('');
    setSttTestError(null);
    addLog('Starting Speech Recognition diagnostic test...');

    speechToText.setCallbacks({
      onStart: () => {
        addLog('STT Test: onstart fired - audio capture active.');
      },
      onResult: (text: string, isFinal: boolean) => {
        setSttLiveTranscript(text);
        addLog(`STT Test: onresult (${isFinal ? 'FINAL' : 'interim'}): "${text}"`);
      },
      onError: (errMsg: string, code: STTErrorType) => {
        setSttTestActive(false);
        setSttTestError(`[${code}] ${errMsg}`);
        addLog(`STT Test ERROR [${code}]: ${errMsg}`);
      },
      onEnd: () => {
        setSttTestActive(false);
        addLog('STT Test: onend event dispatched.');
      }
    });

    const success = speechToText.start('en-IN');
    if (!success) {
      setSttTestActive(false);
      setSttTestError('Failed to start speech recognition session.');
      addLog('STT Test: Failed to start session.');
    }
  };

  const handleStopSTTTest = () => {
    speechToText.stop();
    setSttTestActive(false);
    addLog('STT Test: Manually stopped.');
  };

  const handleTestTTS = async () => {
    if (!textToSpeech.isSupported()) {
      addLog('TTS Error: SpeechSynthesis is unsupported.');
      return;
    }
    setIsSpeakingTest(true);
    addLog(`TTS Test: Speaking "${testSpeechText}"...`);

    try {
      await textToSpeech.speak(
        testSpeechText,
        { voiceURI: selectedTestVoice || undefined },
        {
          onStart: () => addLog('TTS Test: onstart triggered.'),
          onEnd: () => {
            setIsSpeakingTest(false);
            addLog('TTS Test: onend finished successfully.');
          },
          onError: (err) => {
            setIsSpeakingTest(false);
            addLog(`TTS Test error: ${err.message || 'playback error'}`);
          }
        }
      );
    } catch (e: any) {
      setIsSpeakingTest(false);
      addLog(`TTS exception: ${e.message}`);
    }
  };

  const handleStopTTS = () => {
    textToSpeech.stop();
    setIsSpeakingTest(false);
    addLog('TTS Test: Stopped immediately.');
  };

  return (
    <div className="w-full h-full bg-black text-white flex flex-col pt-14 pb-4 px-4 sm:px-8 md:px-12 font-sans select-none overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-ssu-border mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-ssu-maroon/50 border border-ssu-gold/40 text-ssu-gold">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
              VOICE & SPEECH DIAGNOSTICS
            </h1>
            <p className="text-xs text-ssu-gold font-mono">
              Realme Android Tablet Audio Engine & Browser Capability Audit
            </p>
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          className="px-4 py-2 rounded-xl bg-ssu-card hover:bg-ssu-surface border border-ssu-border text-xs font-mono text-ssu-gold flex items-center gap-2 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Re-run Audit</span>
        </button>
      </div>

      {/* Security Context Notice (Crucial for Chrome on Android) */}
      {!isSecureContext && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 mb-6 flex items-start gap-3 text-xs text-red-200">
          <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block">Insecure Origin Detected (HTTP on LAN IP)</span>
            <p>
              Google Chrome strictly restricts the <strong>Web Speech API</strong> and microphone capture on insecure origins. When testing via tablet IP over Wi-Fi, Chrome treats plain HTTP as insecure.
            </p>
            <div className="p-2.5 rounded-lg bg-black/60 font-mono text-[11px] text-amber-300 mt-2">
              Fix: Open Chrome on your tablet, go to <span className="text-white">chrome://flags/#unsafely-treat-insecure-origin-as-secure</span>, enable it, add your computer's IP (e.g. <span className="text-white">http://192.168.1.X:5173</span>), and relaunch Chrome.
            </div>
          </div>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Web Speech API */}
        <div className="p-4 rounded-xl bg-ssu-card border border-ssu-border flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">STT API Availability</span>
            <span className="text-sm font-bold text-white">
              {sttSupported ? 'SpeechRecognition Ready' : 'Unavailable'}
            </span>
          </div>
          {sttSupported ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <XCircle className="w-6 h-6 text-red-400" />
          )}
        </div>

        {/* Card 2: Speech Synthesis */}
        <div className="p-4 rounded-xl bg-ssu-card border border-ssu-border flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">TTS API Availability</span>
            <span className="text-sm font-bold text-white">
              {ttsSupported ? 'SpeechSynthesis Ready' : 'Unavailable'}
            </span>
          </div>
          {ttsSupported ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <XCircle className="w-6 h-6 text-red-400" />
          )}
        </div>

        {/* Card 3: Mic Permission */}
        <div className="p-4 rounded-xl bg-ssu-card border border-ssu-border flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Microphone Access</span>
            <span className={`text-sm font-bold capitalize ${
              micPermission === 'granted' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {micPermission}
            </span>
          </div>
          {micPermission === 'granted' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <button
              onClick={handleRequestMic}
              className="px-2.5 py-1 rounded-lg bg-ssu-gold text-black font-bold text-[10px]"
            >
              Request
            </button>
          )}
        </div>

        {/* Card 4: Voice Assistant State */}
        <div className="p-4 rounded-xl bg-ssu-card border border-ssu-border flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Controller State</span>
            <span className="text-sm font-bold text-ssu-gold font-mono">{assistantState}</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-ssu-gold animate-ping" />
        </div>
      </div>

      {/* Browser Environment Info */}
      <div className="p-3.5 rounded-xl bg-ssu-surface border border-ssu-border text-xs text-slate-400 font-mono mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span className="truncate max-w-xl text-[11px]">
          <span className="text-ssu-gold font-bold">Browser Environment: </span>
          {userAgent || 'Detecting...'}
        </span>
        <span className="px-2 py-0.5 rounded bg-black/60 border border-ssu-border text-slate-300 text-[10px]">
          Secure Context: {isSecureContext ? 'YES (https/local)' : 'NO (insecure origin)'}
        </span>
      </div>

      {/* Interactive Testing Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left: STT Live Test */}
        <div className="p-5 rounded-2xl bg-ssu-card border border-ssu-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-ssu-gold" />
              <h2 className="text-sm font-bold text-white">Speech Recognition (STT) Test</h2>
            </div>
            {sttTestActive ? (
              <button
                onClick={handleStopSTTTest}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 animate-pulse"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Listening</span>
              </button>
            ) : (
              <button
                onClick={handleStartSTTTest}
                className="px-4 py-1.5 rounded-lg bg-ssu-gold hover:bg-ssu-goldLight text-black font-bold text-xs flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Microphone</span>
              </button>
            )}
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-ssu-border min-h-[90px] flex flex-col justify-center">
            {sttTestActive ? (
              <div className="space-y-1">
                <span className="text-[10px] text-ssu-gold font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-ssu-gold animate-ping" />
                  Listening live in English (India)...
                </span>
                <p className="text-xs text-white italic">
                  {sttLiveTranscript || 'Speak something into the microphone...'}
                </p>
              </div>
            ) : sttLiveTranscript ? (
              <div>
                <span className="text-[10px] text-slate-400 font-mono block mb-1">Captured Transcript:</span>
                <p className="text-xs text-emerald-400 font-medium">"{sttLiveTranscript}"</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center">
                Tap 'Test Microphone' and speak into your tablet microphone.
              </p>
            )}
          </div>

          {sttTestError && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-300 font-mono">
              {sttTestError}
            </div>
          )}
        </div>

        {/* Right: TTS Speech Test */}
        <div className="p-5 rounded-2xl bg-ssu-card border border-ssu-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-ssu-gold" />
              <h2 className="text-sm font-bold text-white">Text-to-Speech (TTS) Test</h2>
            </div>
            {isSpeakingTest ? (
              <button
                onClick={handleStopTTS}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 animate-pulse"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Audio</span>
              </button>
            ) : (
              <button
                onClick={handleTestTTS}
                className="px-4 py-1.5 rounded-lg bg-ssu-gold hover:bg-ssu-goldLight text-black font-bold text-xs flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Speaker</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={testSpeechText}
              onChange={(e) => setTestSpeechText(e.target.value)}
              className="w-full bg-black/60 border border-ssu-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ssu-gold"
              placeholder="Enter phrase to speak..."
            />

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap">Voice:</span>
              <select
                value={selectedTestVoice}
                onChange={(e) => setSelectedTestVoice(e.target.value)}
                className="w-full bg-black/60 border border-ssu-border rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-ssu-gold font-mono"
              >
                <option value="">Default System Voice</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics Event Log */}
      <div className="p-5 rounded-2xl bg-black border border-ssu-border font-mono text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-ssu-border">
          <div className="flex items-center gap-2 text-ssu-gold">
            <Terminal className="w-4 h-4" />
            <span className="font-bold">Real-Time Audio Diagnostics Console</span>
          </div>
          <button
            onClick={() => setLogs([])}
            className="text-[11px] text-slate-500 hover:text-slate-300"
          >
            Clear Log
          </button>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-1 text-[11px] text-slate-300 pr-1">
          {logs.length === 0 ? (
            <span className="text-slate-600 italic">No events logged yet.</span>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="leading-snug">{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
