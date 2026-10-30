import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types/robot';
import {
  Volume2,
  Sparkles,
  BookOpen,
  Building,
  MessageSquare,
  ArrowRight,
  Play
} from 'lucide-react';

interface SSUWelcomeScreenProps {
  onSelectScreen: (screen: AppScreen) => void;
  onSpeakText: (text: string) => void;
  isSpeaking: boolean;
  onInterruptSpeech: () => void;
}

export const SSUWelcomeScreen: React.FC<SSUWelcomeScreenProps> = ({
  onSelectScreen,
  onSpeakText,
  isSpeaking,
  onInterruptSpeech
}) => {
  const [greetingMode, setGreetingMode] = useState<'auto' | 'interaction' | 'manual'>(() => {
    return (localStorage.getItem('ssu_greeting_mode') as 'auto' | 'interaction' | 'manual') || 'interaction';
  });
  const [hasInteracted, setHasInteracted] = useState(false);

  const welcomeText =
    "Hello! Welcome to Sri Sri University. I am your AI campus assistant. Sri Sri University brings together modern innovation and traditional values to create a holistic learning experience. How can I help you today?";

  const handleModeChange = (mode: 'auto' | 'interaction' | 'manual') => {
    setGreetingMode(mode);
    localStorage.setItem('ssu_greeting_mode', mode);
  };

  const handlePlayWelcome = () => {
    if (isSpeaking) {
      onInterruptSpeech();
    } else {
      onSpeakText(welcomeText);
    }
  };

  // Handle auto or interaction greeting on mount
  useEffect(() => {
    if (greetingMode === 'auto') {
      const timer = setTimeout(() => {
        onSpeakText(welcomeText);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [greetingMode]);

  // First tap interaction listener if mode is 'interaction'
  const handleContainerClick = () => {
    if (greetingMode === 'interaction' && !hasInteracted && !isSpeaking) {
      setHasInteracted(true);
      onSpeakText(welcomeText);
    }
  };

  const quickPrompts = [
    { label: "About Sri Sri University", query: "Tell me about Sri Sri University." },
    { label: "Vision & Mission", query: "Tell me about the university's vision and mission." },
    { label: "Faculties & Courses", query: "What courses and faculties are available?" },
    { label: "Central Library", query: "Where is the Central Library?" },
    { label: "Ayurveda Hospital", query: "Tell me about the on-campus Ayurveda Hospital." },
    { label: "Meaning of Learn, Lead, Serve", query: "What is the meaning of Learn, Lead, Serve?" },
    { label: "Admissions Contact", query: "How can I contact admissions?" }
  ];

  return (
    <div
      onClick={handleContainerClick}
      className="w-full h-full bg-black text-white flex flex-col pt-14 pb-4 px-4 sm:px-8 md:px-12 font-sans select-none overflow-y-auto"
    >
      {/* Top University Branding Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-ssu-maroonDark via-ssu-maroon to-[#2d0f07] border border-ssu-gold/40 p-6 shadow-2xl mb-6 overflow-hidden">
        {/* Subtle decorative gold glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-ssu-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Official University Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2.5 shadow-xl flex items-center justify-center flex-shrink-0 border-2 border-ssu-gold">
              <img
                src="/assets/ssu-logo.png"
                alt="Sri Sri University Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to text emblem if image is loading
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ssu-gold/20 border border-ssu-gold/50 text-ssu-gold text-xs font-semibold tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Official AI Campus Assistant</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                SRI SRI UNIVERSITY
              </h1>
              <p className="text-xs sm:text-sm font-medium text-ssu-goldLight italic mt-0.5">
                "Learn, Lead, Serve" • Cuttack, Odisha
              </p>
              <p className="text-xs text-slate-300 max-w-xl mt-1.5 leading-relaxed">
                Founded by Poojya Gurudev Sri Sri Ravi Shankar. Blending the best of the East and modern innovation on a scenic 188-acre green campus.
              </p>
            </div>
          </div>

          {/* Welcome Speech Action Button */}
          <div className="flex flex-col items-center sm:items-end gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlayWelcome();
              }}
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-lg active:scale-95 ${
                isSpeaking
                  ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                  : 'bg-ssu-gold hover:bg-ssu-goldLight text-black'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span>Stop Welcome Speech</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Welcome Speech</span>
                </>
              )}
            </button>

            {/* Greeting mode selector */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-black/60 border border-ssu-gold/30 rounded-lg p-1 text-[11px] font-mono text-slate-300"
            >
              <span className="text-slate-400 px-1.5">Greeting:</span>
              <button
                onClick={() => handleModeChange('interaction')}
                className={`px-2 py-0.5 rounded ${
                  greetingMode === 'interaction' ? 'bg-ssu-gold text-black font-bold' : 'hover:text-white'
                }`}
                title="Greets on first screen tap"
              >
                On Tap
              </button>
              <button
                onClick={() => handleModeChange('auto')}
                className={`px-2 py-0.5 rounded ${
                  greetingMode === 'auto' ? 'bg-ssu-gold text-black font-bold' : 'hover:text-white'
                }`}
                title="Plays automatically on startup"
              >
                Auto
              </button>
              <button
                onClick={() => handleModeChange('manual')}
                className={`px-2 py-0.5 rounded ${
                  greetingMode === 'manual' ? 'bg-ssu-gold text-black font-bold' : 'hover:text-white'
                }`}
                title="Only plays when you tap the button"
              >
                Manual
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Card 1: AI Assistant */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectScreen('assistant');
          }}
          className="group p-5 rounded-2xl bg-ssu-card border border-ssu-border hover:border-ssu-gold/60 transition-all cursor-pointer shadow-lg hover:shadow-ssu-gold/10"
        >
          <div className="w-12 h-12 rounded-xl bg-ssu-maroon/40 border border-ssu-gold/40 flex items-center justify-center text-ssu-gold mb-3 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white flex items-center justify-between">
            <span>AI Campus Assistant</span>
            <ArrowRight className="w-4 h-4 text-ssu-gold group-hover:translate-x-1 transition-transform" />
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Speak in English or Hindi to inquire about courses, facilities, admissions, or get campus directions.
          </p>
        </div>

        {/* Card 2: University Information */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectScreen('university-info');
          }}
          className="group p-5 rounded-2xl bg-ssu-card border border-ssu-border hover:border-ssu-gold/60 transition-all cursor-pointer shadow-lg hover:shadow-ssu-gold/10"
        >
          <div className="w-12 h-12 rounded-xl bg-ssu-maroon/40 border border-ssu-gold/40 flex items-center justify-center text-ssu-gold mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white flex items-center justify-between">
            <span>University Information</span>
            <ArrowRight className="w-4 h-4 text-ssu-gold group-hover:translate-x-1 transition-transform" />
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Explore our 11 academic faculties, B.Tech, MBA, BAMS, Agriculture programmes, and history.
          </p>
        </div>

        {/* Card 3: Facilities & Guidance */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectScreen('facilities');
          }}
          className="group p-5 rounded-2xl bg-ssu-card border border-ssu-border hover:border-ssu-gold/60 transition-all cursor-pointer shadow-lg hover:shadow-ssu-gold/10"
        >
          <div className="w-12 h-12 rounded-xl bg-ssu-maroon/40 border border-ssu-gold/40 flex items-center justify-center text-ssu-gold mb-3 group-hover:scale-105 transition-transform">
            <Building className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white flex items-center justify-between">
            <span>Campus Facilities</span>
            <ArrowRight className="w-4 h-4 text-ssu-gold group-hover:translate-x-1 transition-transform" />
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Central Library (Shruti), 100+ Bed Ayurveda Hospital, hostels, sports arena, and Annapurna mess.
          </p>
        </div>
      </div>

      {/* Quick Visitor Query Chips */}
      <div className="p-5 rounded-2xl bg-ssu-surface border border-ssu-border mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-ssu-gold" />
          <span className="text-xs font-bold text-ssu-gold uppercase tracking-wider">
            Popular Visitor Questions (Tap to Ask)
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                onSelectScreen('assistant');
                onSpeakText(item.query);
              }}
              className="px-3.5 py-2 rounded-xl bg-ssu-card hover:bg-ssu-maroon border border-ssu-border hover:border-ssu-gold/50 text-xs text-slate-200 hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>{item.label}</span>
              <ArrowRight className="w-3 h-3 text-ssu-gold opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Campus Quick Facts Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl bg-ssu-card/70 border border-ssu-border">
          <div className="text-lg font-extrabold text-ssu-gold">188 Acres</div>
          <div className="text-[11px] text-slate-400">Green Hilltop Campus</div>
        </div>
        <div className="p-3 rounded-xl bg-ssu-card/70 border border-ssu-border">
          <div className="text-lg font-extrabold text-ssu-gold">11 Faculties</div>
          <div className="text-[11px] text-slate-400">Interdisciplinary Study</div>
        </div>
        <div className="p-3 rounded-xl bg-ssu-card/70 border border-ssu-border">
          <div className="text-lg font-extrabold text-ssu-gold">100+ Beds</div>
          <div className="text-[11px] text-slate-400">Ayurveda Hospital</div>
        </div>
        <div className="p-3 rounded-xl bg-ssu-card/70 border border-ssu-border">
          <div className="text-lg font-extrabold text-ssu-gold">100% Vegetarian</div>
          <div className="text-[11px] text-slate-400">Sattvic Healthy Living</div>
        </div>
      </div>
    </div>
  );
};
