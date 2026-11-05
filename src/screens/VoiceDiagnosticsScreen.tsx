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
      onResult: (transcript: string, isFinal: boolean) => {
        setSttLiveTranscript(transcript);
        if (isFinal) {
          addLog(`STT Final Recognized: "${transcript}"`);
        }
      },
      onError: (message: string, code: STTErrorType) => {
        setSttTestError(message);
        addLog(`STT Error: [${code}] ${message}`);
        setSttTestActive(false);
      },
      onEnd: () => {
        setSttTestActive(false);
        addLog('STT Test: onend fired.');
      }
    });

    speechToText.start('en-IN');
  };

  const handleStopSTTTest = () => {
    speechToText.stop();
    setSttTestActive(false);
    addLog('STT Test: Stopped by user.');
  };

  const handleTestTTS = async () => {
    if (!testSpeechText.trim()) return;
    setIsSpeakingTest(true);
    addLog(`TTS Test: Speaking phrase "${testSpeechText.slice(0, 30)}..."`);

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
    <div className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-4 sm:p-5 md:p-6 font-sans select-none overflow-y-auto">
      {/* Header: Navy Blue Structural Bar (#263746) */}
      <div className="flex items-center justify-between pb-3 bg-[#263746] text-white p-3.5 rounded-xl mb-6 border border-white/10 shadow-sm">
        <div className="flex items-center gap-2.5">
          {onNavigate && (
            <button
              onClick={() => onNavigate('hub')}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all text-xs font-semibold mr-1"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
              <span>Back to Hub</span>
            </button>
          )}

          <div className="p-2 rounded-lg bg-[#30343B] border border-white/10 text-[#C49A45]">
            <Wrench className="w-5 h-5 text-[#C49A45]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight">Voice & Hardware Diagnostics</h1>
            <p className="text-[12px] text-[#E9EDF2]/80 font-mono">Real-time Web Speech API & Microphone Hardware Audit</p>
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white text-xs font-mono transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-[#C49A45]" />
          <span>Re-run Audit</span>
        </button>
      </div>

      {/* Security Context Notice */}
      {!isSecureContext && (
        <div className="p-4 rounded-xl bg-white text-[#30343B] border border-red-300 mb-6 flex items-start gap-3 text-xs shadow-sm">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#30343B] block text-sm">Insecure Origin Detected (HTTP on LAN IP)</span>
            <p className="text-[#606B76]">
              Google Chrome strictly restricts the <strong>Web Speech API</strong> and microphone capture on insecure origins. When testing via tablet IP over Wi-Fi, Chrome treats plain HTTP as insecure.
            </p>
            <div className="p-2.5 rounded-lg bg-[#E9EDF2] font-mono text-[11px] text-[#30343B] mt-2 border border-[#D8DFE8]">
              Fix: Open Chrome on your tablet, go to <span className="font-bold text-[#263746]">chrome://flags/#unsafely-treat-insecure-origin-as-secure</span>, enable it, add your computer's IP (e.g. <span className="font-bold text-[#30343B]">http://192.168.1.X:5173</span>), and relaunch Chrome.
            </div>
          </div>
        </div>
      )}

      {/* Status Cards: White Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Web Speech API */}
        <div className="p-4 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#606B76] block mb-1">STT API Availability</span>
            <span className="text-[15px] font-semibold text-[#30343B]">
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
        <div className="p-4 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#606B76] block mb-1">TTS API Availability</span>
            <span className="text-[15px] font-semibold text-[#30343B]">
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
        <div className="p-4 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#606B76] block mb-1">Microphone Access</span>
            <span className={`text-[15px] font-semibold capitalize ${
              micPermission === 'granted' ? 'text-emerald-700' : 'text-[#C49A45]'
            }`}>
              {micPermission}
            </span>
          </div>
          {micPermission === 'granted' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          ) : (
            <button
              onClick={handleRequestMic}
              className="px-2.5 py-1 rounded-md bg-[#263746] hover:bg-[#1D2B37] text-white font-medium text-xs"
            >
              Request
            </button>
          )}
        </div>

        {/* Card 4: Voice Assistant State */}
        <div className="p-4 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#606B76] block mb-1">Controller State</span>
            <span className="text-[15px] font-semibold text-[#30343B] font-mono">{assistantState}</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-[#C49A45] animate-pulse" />
        </div>
      </div>

      {/* Browser Environment Info: White Card */}
      <div className="p-3.5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] text-xs font-mono mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
        <span className="truncate max-w-xl text-[12px] text-[#606B76]">
          <span className="text-[#30343B] font-semibold">Browser Environment: </span>
          {userAgent || 'Detecting...'}
        </span>
        <span className="px-2 py-0.5 rounded bg-[#E9EDF2] text-[#30343B] text-[11px]">
          Secure Context: {isSecureContext ? 'YES (https/local)' : 'NO (insecure origin)'}
        </span>
      </div>

      {/* Interactive Testing Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left: STT Live Test */}
        <div className="p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#263746]" strokeWidth={1.75} />
              <h2 className="text-[16px] font-semibold text-[#30343B]">Speech Recognition (STT) Test</h2>
            </div>
            {sttTestActive ? (
              <button
                onClick={handleStopSTTTest}
                className="px-3 py-1.5 min-h-[44px] rounded-lg bg-[#B42318] text-white font-semibold text-xs flex items-center gap-1.5 animate-pulse"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Listening</span>
              </button>
            ) : (
              <button
                onClick={handleStartSTTTest}
                className="px-4 py-1.5 min-h-[44px] rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current text-white" />
                <span>Test Microphone</span>
              </button>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#E9EDF2]/40 border border-[#D8DFE8] min-h-[90px] flex flex-col justify-center">
            {sttTestActive ? (
              <div className="space-y-1">
                <span className="text-[11px] text-[#263746] font-mono flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#C49A45] animate-pulse" />
                  Listening live in English (India)...
                </span>
                <p className="text-[14px] text-[#30343B] italic">
                  {sttLiveTranscript || 'Speak something into the microphone...'}
                </p>
              </div>
            ) : sttLiveTranscript ? (
              <div>
                <span className="text-[11px] text-[#606B76] font-mono block mb-1">Captured Transcript:</span>
                <p className="text-[14px] text-emerald-700 font-bold">"{sttLiveTranscript}"</p>
              </div>
            ) : (
              <p className="text-[13px] text-[#606B76] text-center">
                Tap 'Test Microphone' and speak into your tablet microphone.
              </p>
            )}
          </div>

          {sttTestError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-xs text-red-700 font-mono">
              {sttTestError}
            </div>
          )}
        </div>

        {/* Right: TTS Speech Test */}
        <div className="p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#263746]" strokeWidth={1.75} />
              <h2 className="text-[16px] font-semibold text-[#30343B]">Text-to-Speech (TTS) Test</h2>
            </div>
            {isSpeakingTest ? (
              <button
                onClick={handleStopTTS}
                className="px-3 py-1.5 min-h-[44px] rounded-lg bg-[#B42318] text-white font-semibold text-xs flex items-center gap-1.5 animate-pulse"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Audio</span>
              </button>
            ) : (
              <button
                onClick={handleTestTTS}
                className="px-4 py-1.5 min-h-[44px] rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current text-white" />
                <span>Test Speaker</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={testSpeechText}
              onChange={(e) => setTestSpeechText(e.target.value)}
              className="w-full bg-white border border-[#E9EDF2] rounded-lg px-3 py-2 text-xs text-[#30343B] focus:outline-none focus:border-[#263746]"
              placeholder="Enter phrase to speak..."
            />

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#606B76] font-mono text-[11px] whitespace-nowrap">Voice:</span>
              <select
                value={selectedTestVoice}
                onChange={(e) => setSelectedTestVoice(e.target.value)}
                className="w-full bg-white border border-[#E9EDF2] rounded-lg px-2 py-1.5 text-xs text-[#30343B] focus:outline-none focus:border-[#263746] font-mono"
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
      <div className="p-5 rounded-xl bg-[#202124] text-white border border-[#30343B] font-mono text-xs shadow-sm">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-[#E9EDF2]">
            <Terminal className="w-4 h-4 text-[#C49A45]" />
            <span className="font-semibold text-white">Real-Time Audio Diagnostics Console</span>
          </div>
          <button
            onClick={() => setLogs([])}
            className="text-[11px] text-[#E9EDF2]/70 hover:text-white transition-colors"
          >
            Clear Log
          </button>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-1 text-[11px] text-[#E9EDF2]/80 pr-1">
          {logs.length === 0 ? (
            <span className="text-[#E9EDF2]/50 italic">No events logged yet.</span>
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
