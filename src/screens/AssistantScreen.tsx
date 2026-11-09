import React, { useState, useRef, useEffect } from 'react';
import { VoiceAssistantState } from '../types/robot';
import { ChatMessage } from '../services/aiService';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Send,
  Square,
  AlertTriangle,
  RotateCcw,
  Languages,
  CheckCircle2,
  GraduationCap,
  Volume2,
  Wrench,
  Sparkles
} from 'lucide-react';

interface AssistantScreenProps {
  onNavigate?: (screen: any) => void;
  state: VoiceAssistantState;
  transcript: string;
  interimTranscript: string;
  chatHistory: ChatMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onInterrupt: () => void;
  onSendMessage: (text: string) => void;
  onRetry: () => void;
  errorMessage: string | null;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  isSTTSupported: boolean;
}

export const AssistantScreen: React.FC<AssistantScreenProps> = ({
  onNavigate,
  state,
  transcript,
  interimTranscript,
  chatHistory,
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  onInterrupt,
  onSendMessage,
  onRetry,
  errorMessage,
  selectedLanguage,
  onSelectLanguage,
  isSTTSupported
}) => {
  const [inputText, setInputText] = useState('');
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, transcript, interimTranscript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'hi-IN': return 'हिंदी (Hindi)';
      case 'en-IN': return 'English (India)';
      case 'en-US': return 'English (US)';
      default: return lang;
    }
  };

  const quickSuggestions = [
    "Tell me about Sri Sri University",
    "Where is the Central Library?",
    "What faculties and courses are available?",
    "Tell me about the Ayurveda Hospital",
    "How can I contact Admissions?",
    "What is the meaning of Learn, Lead, Serve?"
  ];

  return (
    <div className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-3 sm:p-4 md:p-5 font-sans select-none overflow-hidden">
      {/* Top Header Bar with Back Button: Navy Blue Bar (#263746) */}
      <header className="relative z-10 flex items-center justify-between bg-[#263746] text-white px-3 sm:px-5 py-2 rounded-xl border border-white/10 shadow-sm mb-2 shrink-0">
        <div className="flex items-center gap-2.5">
          {onNavigate && (
            <button
              onClick={() => {
                if (onInterrupt) onInterrupt();
                onNavigate('hub');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all shadow-sm active:scale-98 text-xs font-semibold"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
              <span>Back</span>
            </button>
          )}

          <div className="p-1.5 rounded-md bg-[#30343B] border border-white/10 text-[#C49A45] hidden sm:block">
            <GraduationCap className="w-4 h-4 text-[#C49A45]" />
          </div>
          <div>
            <h1 className="text-[16px] sm:text-[18px] font-bold text-white tracking-tight leading-tight">
              AI Campus Assistant
            </h1>
            <p className="text-[11px] text-[#E9EDF2]/80 font-mono">
              Sri Sri University Robotics Club
            </p>
          </div>
        </div>

        {/* Right Action Tools: Language, Diagnostics & State */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Voice Diagnostics Screen Shortcut */}
          {onNavigate && (
            <button
              onClick={() => {
                if (onInterrupt) onInterrupt();
                onNavigate('diagnostics');
              }}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all text-xs"
              title="Open Voice Diagnostics & Audio Test"
            >
              <Wrench className="w-3.5 h-3.5 text-[#C49A45]" />
              <span className="hidden md:inline">Diagnostics</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#30343B] border border-white/10 text-white">
            <Languages className="w-3.5 h-3.5 text-[#C49A45]" />
            <select
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="en-IN" className="bg-[#202124] text-white">English (IN)</option>
              <option value="hi-IN" className="bg-[#202124] text-white">हिंदी (IN)</option>
              <option value="en-US" className="bg-[#202124] text-white">English (US)</option>
            </select>
          </div>

          {/* State Badge */}
          <span
            className={`px-2.5 py-1 rounded font-semibold text-[11px] tracking-wider uppercase ${
              state === 'LISTENING'
                ? 'bg-red-600 text-white animate-pulse shadow-sm'
                : state === 'SPEAKING'
                ? 'bg-[#C49A45] text-white shadow-sm'
                : 'bg-[#30343B] text-[#E9EDF2]/70 border border-white/10'
            }`}
          >
            {state}
          </span>
        </div>
      </header>

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="mb-2 p-2.5 rounded-lg bg-white border border-red-400 flex items-center justify-between text-xs text-[#30343B] font-mono shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#263746] hover:bg-[#1D2B37] text-white font-semibold transition-colors text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Speech Recognition Not Supported Warning */}
      {!isSTTSupported && (
        <div className="mb-2 p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono flex items-center gap-2 shadow-xs shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Speech recognition engine not detected. You can type queries below or install the official APK.</span>
        </div>
      )}

      {/* Conversation Chat History Area */}
      <div
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto py-2 space-y-2.5 font-sans pr-1 scroll-smooth"
      >
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[75%] p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-[#30343B] text-white border border-[#30343B]'
                  : 'bg-white text-[#30343B] border border-[#E9EDF2]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-mono mb-1">
                <span className={`font-semibold ${msg.role === 'user' ? 'text-white' : 'text-[#30343B]'}`}>
                  {msg.role === 'user' ? 'You' : 'SSU Assistant'}
                </span>
                <span className={msg.role === 'user' ? 'text-white/60' : 'text-[#606B76]'}>•</span>
                <span className={msg.role === 'user' ? 'text-white/70' : 'text-[#606B76]'}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.role === 'assistant' && (
                  <span className="flex items-center gap-1 text-[#263746] text-[10px] pl-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C49A45]" strokeWidth={2} /> Verified SSU
                  </span>
                )}
              </div>
              <p className="whitespace-pre-wrap text-[14px] sm:text-[15px] leading-relaxed">{msg.text}</p>
            </div>

            {/* If this is the welcome message and no subsequent questions asked yet, show starter prompt cards */}
            {i === 0 && chatHistory.length === 1 && (
              <div className="mt-3 w-full max-w-2xl bg-white/70 backdrop-blur-xs p-3 rounded-xl border border-[#D8DFE8] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#263746] mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" />
                  <span>Tap any question below or tap "SPEAK TO ROBOT" to ask:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickSuggestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(q)}
                      className="px-3 py-2 rounded-lg bg-white hover:bg-[#F3F4F6] border border-[#263746]/15 text-xs text-[#30343B] font-medium transition-all text-left shadow-xs hover:border-[#C49A45] active:scale-98 flex items-center gap-2 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#C49A45] flex-shrink-0" />
                      <span className="truncate">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Live Interim Transcription Stream */}
        {isListening && (interimTranscript || transcript) && (
          <div className="flex justify-end">
            <div className="max-w-[85%] sm:max-w-[70%] p-3 rounded-xl bg-white border border-[#263746] text-[#263746] text-xs italic shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-[11px] font-mono not-italic text-[#263746]">
                <span className="w-2 h-2 rounded-full bg-[#C49A45] animate-pulse" />
                <span>Listening live ({getLanguageLabel(selectedLanguage)})...</span>
              </div>
              <p className="text-[14px]">"{interimTranscript || transcript}"</p>
            </div>
          </div>
        )}

        {/* Live Speaking Indicator */}
        {isSpeaking && (
          <div className="flex justify-start">
            <div className="p-2.5 rounded-xl bg-white border border-[#E9EDF2] text-[#30343B] text-xs font-mono flex items-center gap-2.5 shadow-sm">
              <span className="text-[#30343B] font-semibold">Speaking response aloud...</span>
              <button
                onClick={onInterrupt}
                className="px-2.5 py-1 rounded bg-[#30343B] hover:bg-[#202124] text-white flex items-center gap-1 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current text-[#C49A45]" />
                <span>Stop</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Horizontal Quick Question Chips (Always Accessible) */}
      <div className="py-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-mono text-[#606B76] whitespace-nowrap hidden sm:inline">
          Suggestions:
        </span>
        {quickSuggestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(q)}
            className="px-3 py-1 rounded-full bg-white hover:bg-[#F3F4F6] border border-[#263746]/15 text-xs text-[#30343B] font-medium whitespace-nowrap transition-all shadow-xs hover:border-[#C49A45] active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Volume2 className="w-3 h-3 text-[#C49A45]" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Bottom Control & Input Bar */}
      <div className="pt-2 border-t border-[#E9EDF2] flex items-center gap-2 shrink-0">
        {/* Microphone Action Button */}
        {isSpeaking ? (
          <button
            onClick={onInterrupt}
            title="Interrupt and stop speaking"
            className="h-12 px-5 rounded-xl bg-[#30343B] hover:bg-[#202124] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 border border-white/10 cursor-pointer"
          >
            <Square className="w-4 h-4 fill-current text-[#C49A45]" />
            <span>STOP</span>
          </button>
        ) : isListening ? (
          <button
            onClick={onStopListening}
            title="Stop listening"
            className="h-12 px-5 rounded-xl bg-[#B42318] hover:bg-red-800 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 border border-red-600 animate-pulse cursor-pointer"
          >
            <MicOff className="w-4 h-4" />
            <span>LISTENING... (TAP TO SEND)</span>
          </button>
        ) : (
          <button
            onClick={onStartListening}
            title="Start speech recognition"
            className="h-12 px-5 sm:px-6 rounded-xl bg-[#C49A45] hover:bg-[#B38734] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 border border-[#C49A45] cursor-pointer"
          >
            <Mic className="w-4 h-4 text-white" strokeWidth={2} />
            <span>SPEAK TO ROBOT</span>
          </button>
        )}

        {/* Text Form Input */}
        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask about Sri Sri University in ${getLanguageLabel(selectedLanguage)}...`}
            className="flex-1 h-12 bg-white border border-[#E9EDF2] rounded-xl px-3.5 text-xs sm:text-sm text-[#30343B] placeholder-[#606B76] focus:outline-none focus:border-[#263746] transition-colors shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="h-12 px-4 rounded-xl bg-[#263746] hover:bg-[#1D2B37] disabled:opacity-40 text-white font-semibold flex items-center justify-center transition-colors shadow-sm border border-[#263746] cursor-pointer"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};
