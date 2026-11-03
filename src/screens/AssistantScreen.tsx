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
    <div className="w-full h-full bg-[#F2F2EF] text-[#30343B] flex flex-col p-3 sm:p-5 md:p-6 font-sans select-none overflow-hidden">
      {/* Top Header Bar with Back Button: Industrial Primary Bar */}
      <header className="relative z-10 flex items-center justify-between bg-[#30343B] text-white px-4 sm:px-6 py-2.5 rounded-xl border border-[#B0B4B8]/30 shadow-sm mb-3">
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => {
                if (onInterrupt) onInterrupt();
                onNavigate('hub');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#202124] hover:bg-[#17191C] border border-[#B0B4B8]/40 text-white transition-all shadow-sm active:scale-98 text-xs font-bold"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#D49A36]" />
              <span>Back to Hub</span>
            </button>
          )}

          <div className="p-1.5 rounded-md bg-[#202124] border border-[#B0B4B8]/30 text-[#D49A36] hidden sm:block">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
              SRI SRI UNIVERSITY AI CAMPUS ASSISTANT
            </h1>
            <p className="text-[11px] text-[#B0B4B8] font-mono">
              Kiosk Speech Engine • Sri Sri University Robotics Club
            </p>
          </div>
        </div>

        {/* Language selector & State badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#202124] border border-[#B0B4B8]/30 text-white">
            <Languages className="w-3.5 h-3.5 text-[#D49A36]" />
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
            className={`px-2.5 py-1 rounded font-bold text-[10px] tracking-wider uppercase ${
              state === 'LISTENING' || state === 'SPEAKING'
                ? 'bg-[#D49A36] text-[#202124]'
                : 'bg-[#202124] text-[#B0B4B8] border border-[#B0B4B8]/30'
            }`}
          >
            {state}
          </span>
        </div>
      </header>

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="mb-2 p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D49A36] flex items-center justify-between text-xs text-[#30343B] font-mono shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D49A36] flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#D49A36] hover:bg-[#C0882B] text-[#202124] font-bold transition-colors text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Browser STT Compatibility Warning */}
      {!isSTTSupported && (
        <div className="mb-2 p-2.5 rounded-lg bg-[#FFFFFF] border border-[#B0B4B8]/60 text-[#5F666D] text-xs font-mono flex items-center gap-2 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-[#D49A36] flex-shrink-0" />
          <span>Web Speech API not detected. You can type queries below or use Google Chrome on your tablet.</span>
        </div>
      )}

      {/* Conversation Chat History Area */}
      <div
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto py-3 space-y-2.5 font-sans pr-1 scroll-smooth"
      >
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#5F666D]">
            <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#B0B4B8]/60 shadow-sm flex items-center justify-center mb-2.5 text-[#D49A36]">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#30343B] mb-1">Sri Sri University Campus Assistant</h3>
            <p className="text-xs max-w-sm text-[#5F666D] mb-3">
              Ask any question about courses, admissions, library, hospital, or facilities. Supports {getLanguageLabel(selectedLanguage)}.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 max-w-md">
              {quickSuggestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(q)}
                  className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#F2F2EF] border border-[#B0B4B8]/60 text-xs text-[#30343B] font-medium transition-all text-left shadow-sm hover:border-[#D49A36]"
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
                    : 'bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono mb-1">
                  <span className={`font-bold ${msg.role === 'user' ? 'text-white' : 'text-[#30343B]'}`}>
                    {msg.role === 'user' ? 'You' : 'SSU Assistant'}
                  </span>
                  <span className={msg.role === 'user' ? 'text-white/60' : 'text-[#5F666D]'}>•</span>
                  <span className={msg.role === 'user' ? 'text-white/70' : 'text-[#5F666D]'}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'assistant' && (
                    <span className="flex items-center gap-1 text-[#5F666D] text-[9px] pl-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-[#D49A36]" /> Verified SSU Data
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))
        )}

        {/* Live Interim Transcription Stream */}
        {isListening && (interimTranscript || transcript) && (
          <div className="flex justify-end">
            <div className="max-w-[85%] sm:max-w-[70%] p-3 rounded-xl bg-[#FFFFFF] border border-[#D49A36] text-[#30343B] text-xs italic shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-[10px] font-mono not-italic text-[#5F666D]">
                <span className="w-2 h-2 rounded-full bg-[#D49A36] animate-pulse" />
                <span>Listening live ({getLanguageLabel(selectedLanguage)})...</span>
              </div>
              <p>"{interimTranscript || transcript}"</p>
            </div>
          </div>
        )}

        {/* Live Speaking Indicator */}
        {isSpeaking && (
          <div className="flex justify-start">
            <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#B0B4B8]/60 text-[#30343B] text-xs font-mono flex items-center gap-2.5 shadow-sm">
              <span className="text-[#30343B] font-semibold">Speaking response...</span>
              <button
                onClick={onInterrupt}
                className="px-2.5 py-1 rounded bg-[#30343B] hover:bg-[#202124] text-white flex items-center gap-1 font-bold text-xs transition-colors"
              >
                <Square className="w-3 h-3 fill-current text-[#D49A36]" />
                <span>Interrupt</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control & Input Bar */}
      <div className="pt-2.5 border-t border-[#B0B4B8]/40 flex items-center gap-2">
        {/* Microphone Action Button */}
        {isSpeaking ? (
          <button
            onClick={onInterrupt}
            title="Interrupt and stop speaking"
            className="h-11 px-4 rounded-lg bg-[#30343B] hover:bg-[#202124] text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98 border border-[#B0B4B8]/40"
          >
            <Square className="w-3.5 h-3.5 fill-current text-[#D49A36]" />
            <span className="hidden sm:inline">STOP</span>
          </button>
        ) : isListening ? (
          <button
            onClick={onStopListening}
            title="Stop listening"
            className="h-11 px-4 rounded-lg bg-[#D49A36] hover:bg-[#C0882B] text-[#202124] font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98 border border-[#D49A36]"
          >
            <MicOff className="w-4 h-4" />
            <span className="hidden sm:inline">STOP MIC</span>
          </button>
        ) : (
          <button
            onClick={onStartListening}
            title="Start speech recognition"
            className="h-11 px-4 rounded-lg bg-[#D49A36] hover:bg-[#C0882B] text-[#202124] font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98 border border-[#D49A36]"
          >
            <Mic className="w-4 h-4" />
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
            className="flex-1 h-11 bg-[#FFFFFF] border border-[#B0B4B8]/60 rounded-lg px-3.5 text-xs sm:text-sm text-[#30343B] placeholder-[#5F666D] focus:outline-none focus:border-[#D49A36] transition-colors shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="h-11 px-4 rounded-lg bg-[#30343B] hover:bg-[#202124] disabled:opacity-40 text-white font-bold flex items-center justify-center transition-colors shadow-sm border border-[#30343B]"
          >
            <Send className="w-3.5 h-3.5 text-[#D49A36]" />
          </button>
        </form>
      </div>
    </div>
  );
};
