import React, { useState } from 'react';
import { FaceConfig } from '../types/robot';
import { Settings, Save, Sliders, Key, Server, Volume2, Mic, Languages, Sparkles } from 'lucide-react';

interface SettingsScreenProps {
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
  const [robotName, setRobotName] = useState(() => localStorage.getItem('kairo_robot_name') || 'Sri Sri University AI Assistant');
  const [aiApiKey, setAiApiKey] = useState(() => localStorage.getItem('kairo_ai_api_key') || '');
  const [aiProvider, setAiProvider] = useState(() => localStorage.getItem('kairo_ai_provider') || 'mock');
  const [saveAlert, setSaveAlert] = useState(false);

  const handleSave = () => {
    localStorage.setItem('kairo_robot_name', robotName);
    localStorage.setItem('kairo_ai_api_key', aiApiKey);
    localStorage.setItem('kairo_ai_provider', aiProvider);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2500);
  };

  return (
    <div className="w-full h-full bg-black text-white flex flex-col pt-14 pb-4 px-3 sm:px-6 md:px-10 font-sans select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-ssu-border mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-ssu-maroon/60 border border-ssu-gold/40 text-ssu-gold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">SYSTEM SETTINGS</h1>
            <p className="text-xs text-ssu-gold font-mono">
              Configuration for SSU Assistant, Voice, AI Providers & Hardware IPC
            </p>
          </div>
        </div>

        {saveAlert && (
          <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/20 animate-pulse">
            Settings Saved Successfully
          </span>
        )}
      </div>

      <div className="max-w-2xl space-y-6 font-mono text-xs">
        {/* Robot & University Identity */}
        <div className="p-4 rounded-2xl bg-ssu-card border border-ssu-border space-y-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Sparkles className="w-4 h-4 text-ssu-gold" />
            <span>Assistant Persona Identity</span>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Campus Assistant Display Name</label>
            <input
              type="text"
              value={robotName}
              onChange={(e) => setRobotName(e.target.value)}
              className="w-full bg-black border border-ssu-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ssu-gold"
            />
          </div>
        </div>

        {/* Speech Recognition (STT) Settings */}
        <div className="p-4 rounded-2xl bg-ssu-card border border-ssu-border space-y-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Mic className="w-4 h-4 text-ssu-gold" />
            <span>Speech Recognition (STT) Settings</span>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Default Recognition Language</label>
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-ssu-gold" />
              <select
                value={selectedLanguage}
                onChange={(e) => onSelectLanguage(e.target.value)}
                className="w-full bg-black border border-ssu-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ssu-gold cursor-pointer"
              >
                <option value="en-IN">English (India) - en-IN</option>
                <option value="hi-IN">हिंदी (India) - hi-IN</option>
                <option value="en-US">English (US) - en-US</option>
              </select>
            </div>
          </div>
        </div>

        {/* Text-to-Speech (TTS) Engine Parameters */}
        <div className="p-4 rounded-2xl bg-ssu-card border border-ssu-border space-y-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Volume2 className="w-4 h-4 text-ssu-gold" />
            <span>Text-to-Speech (TTS) Voice Settings</span>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Speech Voice</label>
            <select
              value={selectedVoice}
              onChange={(e) => onSelectVoice(e.target.value)}
              className="w-full bg-black border border-ssu-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ssu-gold cursor-pointer text-xs"
            >
              <option value="">Default System Voice (Auto-detect English / Hindi)</option>
              {availableVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang}) {v.default ? '— Default' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Speech Rate</span>
                <span>{speechRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.6"
                step="0.05"
                value={speechRate}
                onChange={(e) => onUpdateSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-ssu-gold cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Voice Pitch</span>
                <span>{speechPitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={speechPitch}
                onChange={(e) => onUpdateSpeechPitch(parseFloat(e.target.value))}
                className="w-full accent-ssu-gold cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Volume</span>
                <span>{Math.round(speechVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={speechVolume}
                onChange={(e) => onUpdateSpeechVolume(parseFloat(e.target.value))}
                className="w-full accent-ssu-gold cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* AI Provider Configuration (Securely stored in localStorage) */}
        <div className="p-4 rounded-2xl bg-ssu-card border border-ssu-border space-y-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Key className="w-4 h-4 text-ssu-gold" />
            <span>AI Provider & API Configuration</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Provider Engine</label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                className="w-full bg-black border border-ssu-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ssu-gold cursor-pointer"
              >
                <option value="mock">Verified SSU On-Device Knowledge (Offline / Zero Key)</option>
                <option value="gemini">Google Gemini 1.5 Flash (Online API)</option>
                <option value="openai">OpenAI GPT-4o-mini (Online API)</option>
                <option value="anthropic">Anthropic Claude 3 (Online API)</option>
                <option value="local">Local LAN LLM (Ollama endpoint)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">API Key (Stored on Tablet Only)</label>
              <input
                type="password"
                value={aiApiKey}
                onChange={(e) => setAiApiKey(e.target.value)}
                placeholder={aiProvider === 'mock' ? 'Not needed for on-device SSU knowledge' : 'Enter API Key...'}
                disabled={aiProvider === 'mock'}
                className="w-full bg-black border border-ssu-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ssu-gold disabled:opacity-40"
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            *Keys are stored solely in your tablet browser's private local storage. They are never sent to external servers or committed to Git.
          </p>
        </div>

        {/* Jetson & Hardware IP */}
        <div className="p-4 rounded-2xl bg-ssu-card border border-ssu-border space-y-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Server className="w-4 h-4 text-ssu-gold" />
            <span>NVIDIA Jetson Robotics IPC Connection</span>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">WebSocket Bridge URL</label>
            <input
              type="text"
              value={wsUrl}
              onChange={(e) => onUpdateWsUrl(e.target.value)}
              placeholder="ws://localhost:8080/robot-face"
              className="w-full bg-black border border-ssu-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ssu-gold"
            />
          </div>
        </div>

        {/* Face UI Proportions Shortcut */}
        <div className="p-4 rounded-2xl bg-ssu-card border border-ssu-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Robot Face Settings</span>
              <span className="text-[11px] text-slate-400">Cyan Glow Eyes ({config.primaryColor})</span>
            </div>
            <button
              onClick={onOpenFaceSettingsModal}
              className="px-3.5 py-2 rounded-xl border border-ssu-border bg-ssu-surface text-ssu-gold hover:border-ssu-gold/60 flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-4 h-4" />
              <span>Customize</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-ssu-gold hover:bg-ssu-goldLight text-black font-bold flex items-center gap-2 transition-colors shadow-lg active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>SAVE CONFIGURATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
