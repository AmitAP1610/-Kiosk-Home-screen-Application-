import React, { useState, useEffect } from 'react';
import { speechToText, STTErrorType } from '../services/speechToText';
import { textToSpeech } from '../services/textToSpeech';
import { VoiceAssistantState } from '../types/robot';
import {
  ArrowLeft,
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
  onNavigate?: (screen: any) => void;
  assistantState: VoiceAssistantState;
}

export const VoiceDiagnosticsScreen: React.FC<VoiceDiagnosticsScreenProps> = ({
  onNavigate,
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
    <div className="w-full h-full bg-[#F2F2EF] text-[#30343B] flex flex-col p-4 sm:p-6 font-sans select-none overflow-y-auto">
      {/* Header: Industrial Primary Bar */}
      <div className="flex items-center justify-between pb-3 bg-[#30343B] text-white p-3.5 rounded-xl mb-6 border border-[#B0B4B8]/30 shadow-sm">
        <div className="flex items-center gap-2.5">
          {onNavigate && (
            <button
              onClick={() => onNavigate('hub')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#202124] hover:bg-[#17191C] border border-[#B0B4B8]/40 text-white transition-all text-xs font-bold mr-1"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#D49A36]" />
              <span>Back to Hub</span>
            </button>
          )}

          <div className="p-2 rounded-lg bg-[#202124] border border-[#B0B4B8]/30 text-[#D49A36]">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">VOICE & HARDWARE DIAGNOSTICS</h1>
            <p className="text-[11px] text-[#B0B4B8] font-mono">Real-time Web Speech API & Microphone Hardware Audit</p>
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#202124] hover:bg-[#17191C] border border-[#B0B4B8]/30 text-white hover:border-[#D49A36] text-xs font-mono transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-[#D49A36]" />
          <span>Re-run Audit</span>
        </button>
      </div>

      {/* Security Context Notice (Crucial for Chrome on Android) */}
      {!isSecureContext && (
        <div className="p-4 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-red-500/50 mb-6 flex items-start gap-3 text-xs shadow-sm">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#30343B] block">Insecure Origin Detected (HTTP on LAN IP)</span>
            <p className="text-[#5F666D]">
              Google Chrome strictly restricts the <strong>Web Speech API</strong> and microphone capture on insecure origins. When testing via tablet IP over Wi-Fi, Chrome treats plain HTTP as insecure.
            </p>
            <div className="p-2.5 rounded-lg bg-[#F2F2EF] font-mono text-[11px] text-[#30343B] mt-2 border border-[#B0B4B8]/50">
              Fix: Open Chrome on your tablet, go to <span className="font-bold text-[#D49A36]">chrome://flags/#unsafely-treat-insecure-origin-as-secure</span>, enable it, add your computer's IP (e.g. <span className="font-bold text-[#30343B]">http://192.168.1.X:5173</span>), and relaunch Chrome.
            </div>
          </div>
        </div>
      )}

      {/* Status Cards: Crisp White Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Web Speech API */}
        <div className="p-4 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#5F666D] block mb-1">STT API Availability</span>
            <span className="text-sm font-bold text-[#30343B]">
              {sttSupported ? 'SpeechRecognition Ready' : 'Unavailable'}
            </span>
          </div>
          {sttSupported ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
        </div>

        {/* Card 2: Speech Synthesis */}
        <div className="p-4 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#5F666D] block mb-1">TTS API Availability</span>
            <span className="text-sm font-bold text-[#30343B]">
              {ttsSupported ? 'SpeechSynthesis Ready' : 'Unavailable'}
            </span>
          </div>
          {ttsSupported ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
        </div>

        {/* Card 3: Mic Permission */}
        <div className="p-4 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#5F666D] block mb-1">Microphone Access</span>
            <span className={`text-sm font-bold capitalize ${
              micPermission === 'granted' ? 'text-emerald-700' : 'text-amber-600'
            }`}>
              {micPermission}
            </span>
          </div>
          {micPermission === 'granted' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          ) : (
            <button
              onClick={handleRequestMic}
              className="px-2.5 py-1 rounded-md bg-[#D49A36] hover:bg-[#C0882B] text-[#202124] font-bold text-[10px]"
            >
              Request
            </button>
          )}
        </div>

        {/* Card 4: Voice Assistant State */}
        <div className="p-4 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#5F666D] block mb-1">Controller State</span>
            <span className="text-sm font-bold text-[#30343B] font-mono">{assistantState}</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-[#D49A36] animate-pulse" />
        </div>
      </div>

      {/* Browser Environment Info: Crisp White Card */}
      <div className="p-3.5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 text-xs font-mono mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
        <span className="truncate max-w-xl text-[11px] text-[#5F666D]">
          <span className="text-[#30343B] font-bold">Browser Environment: </span>
          {userAgent || 'Detecting...'}
        </span>
        <span className="px-2 py-0.5 rounded bg-[#F2F2EF] border border-[#B0B4B8]/50 text-[#30343B] text-[10px]">
          Secure Context: {isSecureContext ? 'YES (https/local)' : 'NO (insecure origin)'}
        </span>
      </div>

      {/* Interactive Testing Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left: STT Live Test */}
        <div className="p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#D49A36]" />
              <h2 className="text-sm font-bold text-[#30343B]">Speech Recognition (STT) Test</h2>
            </div>
            {sttTestActive ? (
              <button
                onClick={handleStopSTTTest}
                className="px-3 py-1.5 rounded-lg bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 animate-pulse"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Listening</span>
              </button>
            ) : (
              <button
                onClick={handleStartSTTTest}
                className="px-4 py-1.5 rounded-lg bg-[#D49A36] hover:bg-[#C0882B] text-[#202124] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#202124]" />
                <span>Test Microphone</span>
              </button>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#F2F2EF] border border-[#B0B4B8]/50 min-h-[90px] flex flex-col justify-center">
            {sttTestActive ? (
              <div className="space-y-1">
                <span className="text-[10px] text-[#D49A36] font-mono flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#D49A36] animate-pulse" />
                  Listening live in English (India)...
                </span>
                <p className="text-xs text-[#30343B] italic">
                  {sttLiveTranscript || 'Speak something into the microphone...'}
                </p>
              </div>
            ) : sttLiveTranscript ? (
              <div>
                <span className="text-[10px] text-[#5F666D] font-mono block mb-1">Captured Transcript:</span>
                <p className="text-xs text-emerald-700 font-bold">"{sttLiveTranscript}"</p>
              </div>
            ) : (
              <p className="text-xs text-[#5F666D] text-center">
                Tap 'Test Microphone' and speak into your tablet microphone.
              </p>
            )}
          </div>

          {sttTestError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-500/40 text-xs text-red-700 font-mono">
              {sttTestError}
            </div>
          )}
        </div>

        {/* Right: TTS Speech Test */}
        <div className="p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#D49A36]" />
              <h2 className="text-sm font-bold text-[#30343B]">Text-to-Speech (TTS) Test</h2>
            </div>
            {isSpeakingTest ? (
              <button
                onClick={handleStopTTS}
                className="px-3 py-1.5 rounded-lg bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 animate-pulse"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Audio</span>
              </button>
            ) : (
              <button
                onClick={handleTestTTS}
                className="px-4 py-1.5 rounded-lg bg-[#D49A36] hover:bg-[#C0882B] text-[#202124] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#202124]" />
                <span>Test Speaker</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={testSpeechText}
              onChange={(e) => setTestSpeechText(e.target.value)}
              className="w-full bg-[#F2F2EF] border border-[#B0B4B8]/50 rounded-lg px-3 py-2 text-xs text-[#30343B] focus:outline-none focus:border-[#D49A36]"
              placeholder="Enter phrase to speak..."
            />

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5F666D] font-mono text-[11px] whitespace-nowrap">Voice:</span>
              <select
                value={selectedTestVoice}
                onChange={(e) => setSelectedTestVoice(e.target.value)}
                className="w-full bg-[#F2F2EF] border border-[#B0B4B8]/50 rounded-lg px-2 py-1.5 text-xs text-[#30343B] focus:outline-none focus:border-[#D49A36] font-mono"
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

      {/* Diagnostics Event Log: Dark Component #202124 */}
      <div className="p-5 rounded-xl bg-[#202124] text-white border border-[#B0B4B8]/40 font-mono text-xs shadow-sm">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#B0B4B8]/20">
          <div className="flex items-center gap-2 text-[#D49A36]">
            <Terminal className="w-4 h-4" />
            <span className="font-bold text-white">Real-Time Audio Diagnostics Console</span>
          </div>
          <button
            onClick={() => setLogs([])}
            className="text-[11px] text-[#B0B4B8] hover:text-white transition-colors"
          >
            Clear Log
          </button>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-1 text-[11px] text-[#B0B4B8] pr-1">
          {logs.length === 0 ? (
            <span className="text-[#B0B4B8]/60 italic">No events logged yet.</span>
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
