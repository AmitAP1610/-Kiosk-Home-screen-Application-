import React, { useState } from 'react';
import { FaceConfig } from '../types/robot';
import { ArrowLeft, Settings, Save, Sliders, Key, Server, Volume2, Mic, Languages, Sparkles } from 'lucide-react';

interface SettingsScreenProps {
  onNavigate?: (screen: any) => void;
  onSpeakText?: (text: string) => void;
  config: FaceConfig;
  onUpdateConfig?: (newConfig: FaceConfig) => void;
  onOpenFaceSettingsModal: () => void;
  wsUrl: string;
  onUpdateWsUrl: (url: string) => void;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: string;
  onSelectVoice: (voiceURI: string) => void;
  speechRate: number;
  onUpdateSpeechRate: (rate: number) => void;
  speechPitch: number;
  onUpdateSpeechPitch: (pitch: number) => void;
  speechVolume: number;
  onUpdateSpeechVolume: (volume: number) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigate,
  onSpeakText,
  config,
  onUpdateConfig: _onUpdateConfig,
  onOpenFaceSettingsModal,
  wsUrl,
  onUpdateWsUrl,
  availableVoices,
  selectedVoice,
  onSelectVoice,
  speechRate,
  onUpdateSpeechRate,
  speechPitch,
  onUpdateSpeechPitch,
  speechVolume,
  onUpdateSpeechVolume,
  selectedLanguage,
  onSelectLanguage
}) => {
  const [robotName, setRobotName] = useState(() => localStorage.getItem('kiosk_robot_name') || localStorage.getItem('kairo_robot_name') || 'Kiosk - Sri Sri University AI Assistant');
  const [aiApiKey, setAiApiKey] = useState(() => localStorage.getItem('kiosk_ai_api_key') || localStorage.getItem('kairo_ai_api_key') || '');
  const [aiProvider, setAiProvider] = useState(() => localStorage.getItem('kiosk_ai_provider') || localStorage.getItem('kairo_ai_provider') || 'mock');
  const [saveAlert, setSaveAlert] = useState(false);

  const handleSave = () => {
    localStorage.setItem('kiosk_robot_name', robotName);
    localStorage.setItem('kiosk_ai_api_key', aiApiKey);
    localStorage.setItem('kiosk_ai_provider', aiProvider);
    setSaveAlert(true);
    if (onSpeakText) onSpeakText("Settings saved successfully.");
    setTimeout(() => setSaveAlert(false), 2500);
  };

  return (
    <div className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-4 sm:p-5 md:p-6 font-sans select-none overflow-y-auto">
      {/* Header: Navy Blue Structural Bar (#263746) */}
      <header className="relative z-10 flex items-center justify-between bg-[#263746] text-white px-4 sm:px-6 py-3 rounded-xl border border-white/10 shadow-sm mb-4">
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => {
                if (onSpeakText) onSpeakText("Returning to robot hub.");
                onNavigate('hub');
              }}
              className="flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all shadow-sm active:scale-98 text-xs sm:text-sm font-semibold"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
              <span>Back to Hub</span>
            </button>
          )}

          <div className="p-1.5 rounded-md bg-[#30343B] border border-white/10 text-[#C49A45] hidden sm:block">
            <Settings className="w-4 h-4 text-[#C49A45]" />
          </div>
          <div>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight">System Settings</h1>
            <p className="text-[12px] text-[#E9EDF2]/80 font-mono">
              Configuration for Kiosk Assistant, Voice, AI Providers & Hardware IPC
            </p>
          </div>
        </div>

        {saveAlert && (
          <span className="text-xs font-mono text-white px-3 py-1 rounded bg-[#C49A45] font-semibold shadow-sm">
            Saved Successfully
          </span>
        )}
      </header>

      <div className="max-w-2xl space-y-4 font-mono text-xs">
        {/* Robot & University Identity: White Card */}
        <div className="p-4 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 text-[#30343B] font-bold text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-[#C49A45]" />
            <span>Assistant Persona Identity</span>
          </div>
          <div>
            <label className="block text-[#606B76] mb-1 font-semibold">Campus Assistant Display Name</label>
            <input
              type="text"
              value={robotName}
              onChange={(e) => setRobotName(e.target.value)}
              className="w-full bg-white border border-[#E9EDF2] rounded-lg px-3 py-2 text-[#30343B] focus:outline-none focus:border-[#263746]"
            />
          </div>
        </div>

        {/* Speech Recognition (STT) Settings: White Card */}
        <div className="p-4 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 text-[#30343B] font-bold text-xs sm:text-sm">
            <Mic className="w-4 h-4 text-[#263746]" strokeWidth={1.75} />
            <span>Speech Recognition (STT) Settings</span>
          </div>
          <div>
            <label className="block text-[#606B76] mb-1 font-semibold">Default Recognition Language</label>
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-[#C49A45]" />
              <select
                value={selectedLanguage}
                onChange={(e) => onSelectLanguage(e.target.value)}
                className="w-full bg-white border border-[#E9EDF2] rounded-lg px-3 py-2 text-[#30343B] focus:outline-none focus:border-[#263746] cursor-pointer"
              >
                <option value="en-IN">English (India) - en-IN</option>
                <option value="hi-IN">हिंदी (India) - hi-IN</option>
                <option value="en-US">English (US) - en-US</option>
              </select>
            </div>
          </div>
        </div>

        {/* Text-to-Speech (TTS) Voice Settings: White Card */}
        <div className="p-4 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#30343B] font-bold text-xs sm:text-sm">
            <Volume2 className="w-4 h-4 text-[#263746]" strokeWidth={1.75} />
            <span>Text-to-Speech (TTS) Voice Settings</span>
          </div>

          {/* Reference Audio Player */}
          <div className="p-3 rounded-lg bg-[#E9EDF2]/40 border border-[#D8DFE8] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#30343B] font-semibold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" /> Target Voice Reference (Uploaded Baritone Sample)
              </span>
              <span className="text-[10px] font-mono text-white px-1.5 py-0.5 rounded bg-[#263746] font-semibold">ACTIVE SAMPLE</span>
            </div>
            <p className="text-[12px] text-[#606B76] italic font-sans">
              "I fear darkness hunts us. Use what you've learned, and stay the course."
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const audio = new Audio('/voice-sample.mp3');
                  audio.play();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#30343B] hover:bg-[#202124] text-white text-xs font-medium font-mono flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>▶ Play Audio Sample</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateSpeechPitch(0.75);
                  onUpdateSpeechRate(0.85);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white text-xs font-medium font-mono flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>✓ Match Reference Tone (Pitch: 0.75, Rate: 0.85)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[#606B76] mb-1 font-semibold">Speech Voice</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={selectedVoice}
                onChange={(e) => onSelectVoice(e.target.value)}
                className="flex-1 bg-white border border-[#E9EDF2] rounded-lg px-3 py-2 text-[#30343B] focus:outline-none focus:border-[#263746] cursor-pointer text-xs"
              >
                <option value="">Default Baritone Voice (Auto-selected deep male matching sample)</option>
                {availableVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang}) {v.default ? '— Default' : ''}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const u = new SpeechSynthesisUtterance("Namaste! I am Kiosk, created by the Sri Sri University Robotics Club.");
                    if (selectedVoice) {
                      const found = availableVoices.find(v => v.voiceURI === selectedVoice);
                      if (found) u.voice = found;
                    }
                    u.rate = speechRate;
                    u.pitch = speechPitch;
                    u.volume = speechVolume;
                    window.speechSynthesis.speak(u);
                  }
                }}
                className="px-3.5 py-2 rounded-lg bg-[#30343B] hover:bg-[#202124] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#C49A45]" />
                <span>Test Voice</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="flex justify-between text-[#606B76] mb-1">
                <span>Speech Rate</span>
                <span className="font-bold text-[#30343B]">{speechRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.6"
                step="0.05"
                value={speechRate}
                onChange={(e) => onUpdateSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-[#263746] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#606B76] mb-1">
                <span>Voice Pitch</span>
                <span className="font-bold text-[#30343B]">{speechPitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={speechPitch}
                onChange={(e) => onUpdateSpeechPitch(parseFloat(e.target.value))}
                className="w-full accent-[#263746] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#606B76] mb-1">
                <span>Volume</span>
                <span className="font-bold text-[#30343B]">{Math.round(speechVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={speechVolume}
                onChange={(e) => onUpdateSpeechVolume(parseFloat(e.target.value))}
                className="w-full accent-[#263746] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* AI Provider Configuration: White Card */}
        <div className="p-4 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 text-[#30343B] font-bold text-xs sm:text-sm">
            <Key className="w-4 h-4 text-[#263746]" strokeWidth={1.75} />
            <span>AI Provider & API Configuration</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#606B76] mb-1 font-semibold">Provider Engine</label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                className="w-full bg-white border border-[#E9EDF2] rounded-lg px-3 py-2 text-[#30343B] focus:outline-none focus:border-[#263746] cursor-pointer"
              >
                <option value="mock">Verified SSU On-Device Knowledge (Offline / Zero Key)</option>
                <option value="gemini">Google Gemini 1.5 Flash (Online API)</option>
                <option value="openai">OpenAI GPT-4o-mini (Online API)</option>
                <option value="anthropic">Anthropic Claude 3 (Online API)</option>
                <option value="local">Local LAN LLM (Ollama endpoint)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#606B76] mb-1 font-semibold">API Key (Stored on Tablet Only)</label>
              <input
                type="password"
                value={aiApiKey}
                onChange={(e) => setAiApiKey(e.target.value)}
                placeholder={aiProvider === 'mock' ? 'Not needed for on-device SSU knowledge' : 'Enter API Key...'}
                disabled={aiProvider === 'mock'}
                className="w-full bg-white border border-[#E9EDF2] rounded-lg px-3 py-2 text-[#30343B] focus:outline-none focus:border-[#263746] disabled:opacity-40"
              />
            </div>
          </div>
          <p className="text-[11px] text-[#606B76]">
            *Keys are stored solely in your tablet browser's private local storage.
          </p>
        </div>

        {/* Jetson & Hardware IP: White Card */}
        <div className="p-4 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 text-[#30343B] font-bold text-xs sm:text-sm">
            <Server className="w-4 h-4 text-[#263746]" strokeWidth={1.75} />
            <span>NVIDIA Jetson Robotics IPC Connection</span>
          </div>
          <div>
            <label className="block text-[#606B76] mb-1 font-semibold">WebSocket Bridge URL</label>
            <input
              type="text"
              value={wsUrl}
              onChange={(e) => onUpdateWsUrl(e.target.value)}
              placeholder="ws://localhost:8080/robot-face"
              className="w-full bg-white border border-[#E9EDF2] rounded-lg px-3 py-2 text-[#30343B] focus:outline-none focus:border-[#263746]"
            />
          </div>
        </div>

        {/* Face UI Proportions Shortcut: White Card */}
        <div className="p-4 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-[#30343B] block">Robot Face Settings</span>
              <span className="text-[12px] text-[#606B76]">Face Vector Customizer ({config.primaryColor})</span>
            </div>
            <button
              onClick={onOpenFaceSettingsModal}
              className="px-3.5 py-1.5 rounded-lg border border-[#E9EDF2] bg-white text-[#30343B] hover:border-[#263746] flex items-center gap-1.5 transition-colors font-medium text-xs shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 text-[#263746]" />
              <span>Customize</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-1">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 min-h-[44px] rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white font-medium flex items-center gap-2 transition-colors shadow-sm active:scale-98"
          >
            <Save className="w-4 h-4 text-[#C49A45]" />
            <span>SAVE CONFIGURATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
