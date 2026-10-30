import React, { useState, useRef, useEffect } from 'react';
import { VoiceAssistantState } from '../types/robot';
import { ChatMessage } from '../services/aiService';
import {
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
    <div className="w-full h-full bg-black text-white flex flex-col pt-14 pb-4 px-3 sm:px-6 md:px-10 font-sans select-none overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-ssu-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-ssu-maroon/60 border border-ssu-gold/50 text-ssu-gold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">
              SRI SRI UNIVERSITY AI CAMPUS ASSISTANT
            </h1>
            <p className="text-xs text-ssu-gold font-mono">
              Realme Audio Engine • Bilingual SSU Campus Intelligence
            </p>
          </div>
        </div>

        {/* Language selector & State badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-ssu-card border border-ssu-border text-slate-200">
            <Languages className="w-3.5 h-3.5 text-ssu-gold" />
            <select
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="en-IN" className="bg-ssu-card text-white">English (India)</option>
              <option value="hi-IN" className="bg-ssu-card text-white">हिंदी (India)</option>
              <option value="en-US" className="bg-ssu-card text-white">English (US)</option>
            </select>
          </div>

          <span
            className={`px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider ${
              state === 'LISTENING'
                ? 'bg-ssu-gold/20 border-ssu-gold text-ssu-gold animate-pulse'
                : state === 'SPEAKING'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : state === 'THINKING' || state === 'PROCESSING'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                : state === 'ERROR'
                ? 'bg-red-500/20 border-red-400 text-red-300'
                : 'bg-ssu-card border-ssu-border text-slate-400'
            }`}
          >
            {state}
          </span>
        </div>
      </div>

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="mt-2 p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-between text-xs text-red-200 font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 text-white font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Browser STT Compatibility Warning */}
      {!isSTTSupported && (
        <div className="mt-2 p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Web Speech API not detected. You can type queries below or use Google Chrome on your tablet.</span>
        </div>
      )}

      {/* Conversation Chat History Area */}
      <div
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto py-4 space-y-3 font-sans pr-1 scroll-smooth"
      >
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <div className="w-16 h-16 rounded-full bg-ssu-maroon/40 border border-ssu-gold/40 flex items-center justify-center mb-3 text-ssu-gold">
              <Mic className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Sri Sri University Campus Assistant</h3>
            <p className="text-xs max-w-sm text-slate-400 mb-4">
              Ask any question about courses, admissions, library, hospital, or facilities. Supports {getLanguageLabel(selectedLanguage)}.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {quickSuggestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(q)}
                  className="px-3 py-1.5 rounded-lg bg-ssu-card hover:bg-ssu-maroon border border-ssu-border hover:border-ssu-gold/50 text-xs text-slate-300 hover:text-white transition-all text-left"
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
                className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-ssu-maroon border border-ssu-gold/50 text-white rounded-br-sm shadow-md'
                    : 'bg-ssu-card border border-ssu-border text-slate-100 rounded-bl-sm shadow-md'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mb-1">
                  <span className={`font-bold ${msg.role === 'user' ? 'text-ssu-gold' : 'text-white'}`}>
                    {msg.role === 'user' ? 'You' : 'SSU Assistant'}
                  </span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.role === 'assistant' && (
                    <span className="flex items-center gap-1 text-ssu-gold text-[9px] pl-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-ssu-gold" /> Verified SSU Data
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
            <div className="max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl bg-ssu-maroon/40 border border-ssu-gold text-ssu-gold text-xs italic shadow-lg">
              <div className="flex items-center gap-2 mb-1 text-[10px] font-mono not-italic text-white">
                <span className="w-2 h-2 rounded-full bg-ssu-gold animate-ping" />
                <span>Listening live ({getLanguageLabel(selectedLanguage)})...</span>
              </div>
              <p>"{interimTranscript || transcript}"</p>
            </div>
          </div>
        )}

        {/* Live Speaking Indicator with Animated Waveform */}
        {isSpeaking && (
          <div className="flex justify-start">
            <div className="p-3 rounded-2xl bg-ssu-card border border-ssu-gold/50 text-ssu-gold text-xs font-mono flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-1 h-3 bg-ssu-gold animate-pulse" />
                <span className="w-1 h-5 bg-ssu-gold animate-pulse delay-75" />
                <span className="w-1 h-2 bg-ssu-gold animate-pulse delay-150" />
                <span className="w-1 h-4 bg-ssu-gold animate-pulse delay-100" />
              </div>
              <span className="text-white">Speaking response...</span>
              <button
                onClick={onInterrupt}
                className="ml-2 px-2.5 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white flex items-center gap-1 font-bold transition-colors"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Interrupt</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control & Input Bar */}
      <div className="pt-2 border-t border-ssu-border flex items-center gap-2">
        {/* Large Touch-Friendly Microphone Action Button */}
        {isSpeaking ? (
          <button
            onClick={onInterrupt}
            title="Interrupt and stop speaking"
            className="h-12 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Square className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">STOP SPEECH</span>
          </button>
        ) : isListening ? (
          <button
            onClick={onStopListening}
            title="Stop listening"
            className="h-12 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg animate-pulse transition-all active:scale-95"
          >
            <MicOff className="w-5 h-5" />
            <span className="hidden sm:inline">STOP MIC</span>
          </button>
        ) : (
          <button
            onClick={onStartListening}
            title="Start speech recognition"
            className="h-12 px-5 rounded-xl bg-ssu-gold hover:bg-ssu-goldLight text-black font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Mic className="w-5 h-5" />
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
            className="flex-1 h-12 bg-ssu-card border border-ssu-border rounded-xl px-4 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-ssu-gold transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="h-12 px-5 rounded-xl bg-ssu-gold hover:bg-ssu-goldLight disabled:opacity-30 text-black font-semibold flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
