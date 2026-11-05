import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types/robot';
import {
  ArrowLeft,
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
      className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-4 sm:p-6 md:p-8 font-sans select-none overflow-y-auto"
    >
      {/* Back to Hub Header Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectScreen('hub');
          }}
          className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all shadow-sm active:scale-95 text-xs sm:text-sm font-semibold"
          title="Return to Robot Hub"
        >
          <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
          <span>Back to Hub</span>
        </button>

        <span className="text-xs font-mono text-[#606B76] font-semibold tracking-wider">
          SSU WELCOME PORTAL
        </span>
      </div>

      {/* Top University Branding Banner: Authentic Campus Photo + Dark Overlay */}
      <div className="relative rounded-xl overflow-hidden text-white border border-white/10 p-6 shadow-sm mb-6">
        <img
          src="/images/gallery/academic-shruti-complex.jpg"
          alt="Sri Sri University Campus"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/95 via-[#263746]/90 to-[#17191C]/92" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Official University Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-white p-2.5 shadow-sm flex items-center justify-center flex-shrink-0 border border-[#E9EDF2]">
              <img
                src="/assets/ssu-logo.png"
                alt="Sri Sri University Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#30343B] border border-white/10 text-[#E9EDF2] text-xs font-semibold tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" />
                <span className="text-white">Official AI Campus Assistant</span>
              </div>
              <h1 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight">
                Sri Sri University
              </h1>
              <p className="text-[14px] font-medium text-[#E9EDF2]/90 mt-0.5">
                "Learn, Lead, Serve" • Cuttack, Odisha
              </p>
              <p className="text-[14px] text-[#E9EDF2]/80 max-w-xl mt-1.5 leading-relaxed">
                Founded by Poojya Gurudev Sri Sri Ravi Shankar. Blending holistic Indian heritage with modern technological innovation on a 188-acre green hilltop campus.
              </p>
            </div>
          </div>

          {/* Welcome Speech Action Button & Mode Selector */}
          <div className="flex flex-col items-center sm:items-end gap-2.5 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlayWelcome();
              }}
              className={`px-5 py-3 min-h-[44px] rounded-lg font-medium text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-sm active:scale-95 border ${
                isSpeaking
                  ? 'bg-[#30343B] text-white border-white/20'
                  : 'bg-[#C49A45] hover:bg-[#b0883b] text-white border-[#C49A45]'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Volume2 className="w-4 h-4 text-white" />
                  <span>Stop Welcome Speech</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-white" />
                  <span>Play Welcome Speech</span>
                </>
              )}
            </button>

            {/* Greeting mode selector */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-[#30343B] border border-white/10 rounded-lg p-1 text-[11px] font-mono text-white"
            >
              <span className="text-[#E9EDF2]/70 px-1.5">Greeting:</span>
              <button
                onClick={() => handleModeChange('interaction')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  greetingMode === 'interaction' ? 'bg-[#263746] text-white font-semibold' : 'text-[#E9EDF2]/70 hover:text-white'
                }`}
                title="Greets on first screen tap"
              >
                On Tap
              </button>
              <button
                onClick={() => handleModeChange('auto')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  greetingMode === 'auto' ? 'bg-[#263746] text-white font-semibold' : 'text-[#E9EDF2]/70 hover:text-white'
                }`}
                title="Plays automatically on startup"
              >
                Auto
              </button>
              <button
                onClick={() => handleModeChange('manual')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  greetingMode === 'manual' ? 'bg-[#263746] text-white font-semibold' : 'text-[#E9EDF2]/70 hover:text-white'
                }`}
                title="Only plays when you tap the button"
              >
                Manual
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Cards - White Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Card 1: AI Assistant */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectScreen('assistant');
          }}
          className="group p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] hover:border-[#263746] transition-all cursor-pointer shadow-sm"
        >
          <div className="w-11 h-11 rounded-lg bg-[#E9EDF2] border border-[#D8DFE8] flex items-center justify-center text-[#263746] mb-3">
            <MessageSquare className="w-5 h-5 text-[#263746]" strokeWidth={1.75} />
          </div>
          <h2 className="text-[18px] font-semibold text-[#30343B] flex items-center justify-between">
            <span>AI Campus Assistant</span>
            <ArrowRight className="w-4 h-4 text-[#C49A45] group-hover:translate-x-1 transition-transform" />
          </h2>
          <p className="text-[14px] text-[#606B76] mt-1.5 leading-relaxed">
            Speak in English or Hindi to inquire about courses, facilities, admissions, or get campus directions.
          </p>
        </div>

        {/* Card 2: University Information */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectScreen('university-info');
          }}
          className="group p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] hover:border-[#263746] transition-all cursor-pointer shadow-sm"
        >
          <div className="w-11 h-11 rounded-lg bg-[#E9EDF2] border border-[#D8DFE8] flex items-center justify-center text-[#263746] mb-3">
            <BookOpen className="w-5 h-5 text-[#263746]" strokeWidth={1.75} />
          </div>
          <h2 className="text-[18px] font-semibold text-[#30343B] flex items-center justify-between">
            <span>University Information</span>
            <ArrowRight className="w-4 h-4 text-[#C49A45] group-hover:translate-x-1 transition-transform" />
          </h2>
          <p className="text-[14px] text-[#606B76] mt-1.5 leading-relaxed">
            Explore our 11 academic faculties, B.Tech, MBA, BAMS, Agriculture programmes, and history.
          </p>
        </div>

        {/* Card 3: Facilities & Guidance */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectScreen('facilities');
          }}
          className="group p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] hover:border-[#263746] transition-all cursor-pointer shadow-sm"
        >
          <div className="w-11 h-11 rounded-lg bg-[#E9EDF2] border border-[#D8DFE8] flex items-center justify-center text-[#263746] mb-3">
            <Building className="w-5 h-5 text-[#263746]" strokeWidth={1.75} />
          </div>
          <h2 className="text-[18px] font-semibold text-[#30343B] flex items-center justify-between">
            <span>Campus Facilities</span>
            <ArrowRight className="w-4 h-4 text-[#C49A45] group-hover:translate-x-1 transition-transform" />
          </h2>
          <p className="text-[14px] text-[#606B76] mt-1.5 leading-relaxed">
            Central Library (Shruti), 100+ Bed Ayurveda Hospital, hostels, sports arena, and Annapurna mess.
          </p>
        </div>
      </div>

      {/* Quick Visitor Query Chips - White Card */}
      <div className="p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#C49A45]" />
          <span className="text-[13px] font-semibold text-[#30343B] uppercase tracking-wider">
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
              className="px-3.5 py-2 min-h-[40px] rounded-lg bg-white hover:bg-[#E9EDF2] border border-[#E9EDF2] hover:border-[#263746] text-xs text-[#30343B] font-medium transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>{item.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#263746]" />
            </button>
          ))}
        </div>
      </div>

      {/* Campus Quick Facts Bar - White Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3.5 rounded-xl bg-white border border-[#E9EDF2] text-[#30343B] shadow-sm">
          <div className="text-[22px] font-bold text-[#263746]">188 Acres</div>
          <div className="text-[13px] text-[#606B76] mt-0.5">Green Hilltop Campus</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-[#E9EDF2] text-[#30343B] shadow-sm">
          <div className="text-[22px] font-bold text-[#263746]">11 Faculties</div>
          <div className="text-[13px] text-[#606B76] mt-0.5">Interdisciplinary Study</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-[#E9EDF2] text-[#30343B] shadow-sm">
          <div className="text-[22px] font-bold text-[#263746]">100+ Beds</div>
          <div className="text-[13px] text-[#606B76] mt-0.5">Ayurveda Hospital</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-[#E9EDF2] text-[#30343B] shadow-sm">
          <div className="text-[22px] font-bold text-[#263746]">100% Vegetarian</div>
          <div className="text-[13px] text-[#606B76] mt-0.5">Sattvic Healthy Living</div>
        </div>
      </div>
    </div>
  );
};
