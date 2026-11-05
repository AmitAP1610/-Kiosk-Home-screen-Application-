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
  GraduationCap
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
    <div className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-4 sm:p-5 md:p-6 font-sans select-none overflow-hidden">
      {/* Top Header Bar with Back Button: Navy Blue Bar (#263746) */}
      <header className="relative z-10 flex items-center justify-between bg-[#263746] text-white px-4 sm:px-6 py-2.5 rounded-xl border border-white/10 shadow-sm mb-3">
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => {
                if (onInterrupt) onInterrupt();
                onNavigate('hub');
              }}
              className="flex items-center gap-2 px-3 py-1.5 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all shadow-sm active:scale-98 text-xs font-semibold"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
              <span>Back to Hub</span>
            </button>
          )}

          <div className="p-1.5 rounded-md bg-[#30343B] border border-white/10 text-[#C49A45] hidden sm:block">
            <GraduationCap className="w-4 h-4 text-[#C49A45]" />
          </div>
          <div>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight">
              AI Campus Assistant
            </h1>
            <p className="text-[12px] text-[#E9EDF2]/80 font-mono">
              Kiosk Speech Engine • Sri Sri University Robotics Club
            </p>
          </div>
        </div>

        {/* Language selector & State badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#30343B] border border-white/10 text-white">
            <Languages className="w-3.5 h-3.5 text-[#C49A45]" />
            <select
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="en-IN" className="bg-[#202124] text-white">English (India)</option>
              <option value="hi-IN" className="bg-[#202124] text-white">हिंदी (India)</option>
              <option value="en-US" className="bg-[#202124] text-white">English (US)</option>
            </select>
          </div>

          <span
            className={`px-2.5 py-1 rounded font-semibold text-[11px] tracking-wider uppercase ${
              state === 'LISTENING' || state === 'SPEAKING'
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
        <div className="mb-2 p-2.5 rounded-lg bg-white border border-red-400 flex items-center justify-between text-xs text-[#30343B] font-mono shadow-sm">
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

      {/* Browser STT Compatibility Warning */}
      {!isSTTSupported && (
        <div className="mb-2 p-2.5 rounded-lg bg-white border border-[#E9EDF2] text-[#606B76] text-xs font-mono flex items-center gap-2 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-[#C49A45] flex-shrink-0" />
          <span>Web Speech API not detected. You can type queries below or use Google Chrome on your tablet.</span>
        </div>
      )}

      {/* Conversation Chat History Area */}
      <div
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto py-3 space-y-2.5 font-sans pr-1 scroll-smooth"
      >
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#606B76]">
            <div className="w-12 h-12 rounded-full bg-white border border-[#E9EDF2] shadow-sm flex items-center justify-center mb-2.5 text-[#263746]">
              <Mic className="w-6 h-6 text-[#263746]" strokeWidth={1.75} />
            </div>
            <h3 className="text-[20px] font-semibold text-[#30343B] mb-1">Sri Sri University Campus Assistant</h3>
            <p className="text-[14px] max-w-sm text-[#606B76] mb-3">
              Ask any question about courses, admissions, library, hospital, or facilities. Supports {getLanguageLabel(selectedLanguage)}.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 max-w-md">
              {quickSuggestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(q)}
                  className="px-3 py-1.5 min-h-[38px] rounded-lg bg-white hover:bg-[#E9EDF2] border border-[#E9EDF2] text-xs text-[#30343B] font-medium transition-all text-left shadow-sm hover:border-[#263746]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed shadow-sm ${
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
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C49A45]" strokeWidth={2} /> Verified SSU Data
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))
        )}

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
              <span className="text-[#30343B] font-semibold">Speaking response...</span>
              <button
                onClick={onInterrupt}
                className="px-2.5 py-1 rounded bg-[#30343B] hover:bg-[#202124] text-white flex items-center gap-1 font-semibold text-xs transition-colors"
              >
                <Square className="w-3 h-3 fill-current text-[#C49A45]" />
                <span>Interrupt</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control & Input Bar */}
      <div className="pt-2.5 border-t border-[#E9EDF2] flex items-center gap-2">
        {/* Microphone Action Button: Navy Blue #263746 */}
        {isSpeaking ? (
          <button
            onClick={onInterrupt}
            title="Interrupt and stop speaking"
            className="h-11 px-4 rounded-lg bg-[#30343B] hover:bg-[#202124] text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98 border border-white/10"
          >
            <Square className="w-3.5 h-3.5 fill-current text-[#C49A45]" />
            <span className="hidden sm:inline">STOP</span>
          </button>
        ) : isListening ? (
          <button
            onClick={onStopListening}
            title="Stop listening"
            className="h-11 px-4 rounded-lg bg-[#B42318] hover:bg-red-800 text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98 border border-red-600 animate-pulse"
          >
            <MicOff className="w-4 h-4" />
            <span className="hidden sm:inline">STOP MIC</span>
          </button>
        ) : (
          <button
            onClick={onStartListening}
            title="Start speech recognition"
            className="h-11 px-4 rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98 border border-[#263746]"
          >
            <Mic className="w-4 h-4 text-white" strokeWidth={1.75} />
            <span className="hidden sm:inline">SPEAK</span>
          </button>
        )}

        {/* Text Form Input */}
        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask about Sri Sri University in ${getLanguageLabel(selectedLanguage)}...`}
            className="flex-1 h-11 bg-white border border-[#E9EDF2] rounded-lg px-3.5 text-xs sm:text-sm text-[#30343B] placeholder-[#606B76] focus:outline-none focus:border-[#263746] transition-colors shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="h-11 px-4 rounded-lg bg-[#263746] hover:bg-[#1D2B37] disabled:opacity-40 text-white font-semibold flex items-center justify-center transition-colors shadow-sm border border-[#263746]"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};
