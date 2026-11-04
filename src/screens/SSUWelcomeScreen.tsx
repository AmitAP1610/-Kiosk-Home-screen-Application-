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
      className="w-full h-full bg-[#FFFFFF] text-[#30343B] flex flex-col p-4 sm:p-6 md:p-8 font-sans select-none overflow-y-auto"
    >
      {/* Back to Hub Header Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectScreen('hub');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#30343B] hover:bg-[#202124] border border-[#B0B4B8]/40 text-white transition-all shadow-sm active:scale-95 text-xs sm:text-sm font-bold"
          title="Return to Robot Hub"
        >
          <ArrowLeft className="w-4 h-4 text-[#DCE8E1]" />
          <span>Back to Hub</span>
        </button>

        <span className="text-xs font-mono text-[#30343B] font-bold tracking-wider">
          SSU WELCOME PORTAL
        </span>
      </div>

      {/* Top University Branding Banner */}
      <div className="rounded-xl bg-[#30343B] text-white border border-[#B0B4B8]/30 p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Official University Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-[#FFFFFF] p-2.5 shadow-sm flex items-center justify-center flex-shrink-0 border border-[#B0B4B8]/40">
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#202124] border border-[#B0B4B8]/30 text-[#B0B4B8] text-xs font-semibold tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#DCE8E1]" />
                <span className="text-white">Official AI Campus Assistant</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                SRI SRI UNIVERSITY
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#B0B4B8] italic mt-0.5">
                "Learn, Lead, Serve" • Cuttack, Odisha
              </p>
              <p className="text-xs text-[#B0B4B8] max-w-xl mt-1.5 leading-relaxed">
                Founded by Poojya Gurudev Sri Sri Ravi Shankar. Blending the best of the East and modern innovation on a scenic 188-acre green campus.
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
              className={`px-5 py-3 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-sm active:scale-95 border ${
                isSpeaking
                  ? 'bg-[#202124] text-[#DCE8E1] border-[#174D3A]'
                  : 'bg-[#174D3A] hover:bg-[#134232] text-white border-[#174D3A]'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#DCE8E1]" />
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
              className="flex items-center gap-1 bg-[#202124] border border-[#B0B4B8]/30 rounded-lg p-1 text-[11px] font-mono text-white"
            >
              <span className="text-[#B0B4B8] px-1.5">Greeting:</span>
              <button
                onClick={() => handleModeChange('interaction')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  greetingMode === 'interaction' ? 'bg-[#174D3A] text-white font-bold' : 'text-[#B0B4B8] hover:text-white'
                }`}
                title="Greets on first screen tap"
              >
                On Tap
              </button>
              <button
                onClick={() => handleModeChange('auto')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  greetingMode === 'auto' ? 'bg-[#174D3A] text-white font-bold' : 'text-[#B0B4B8] hover:text-white'
                }`}
                title="Plays automatically on startup"
              >
                Auto
              </button>
              <button
                onClick={() => handleModeChange('manual')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  greetingMode === 'manual' ? 'bg-[#174D3A] text-white font-bold' : 'text-[#B0B4B8] hover:text-white'
                }`}
                title="Only plays when you tap the button"
              >
                Manual
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Cards - Crisp White Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Card 1: AI Assistant */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectScreen('assistant');
          }}
          className="group p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 hover:border-[#174D3A] transition-all cursor-pointer shadow-sm hover:shadow"
        >
          <div className="w-11 h-11 rounded-lg bg-[#DCE8E1]/40 border border-[#B0B4B8]/50 flex items-center justify-center text-[#174D3A] mb-3">
            <MessageSquare className="w-5 h-5 text-[#174D3A]" />
          </div>
          <h2 className="text-base font-bold text-[#30343B] flex items-center justify-between">
            <span>AI Campus Assistant</span>
            <ArrowRight className="w-4 h-4 text-[#174D3A] group-hover:translate-x-1 transition-transform" />
          </h2>
          <p className="text-xs text-[#5F666D] mt-1.5 leading-relaxed">
            Speak in English or Hindi to inquire about courses, facilities, admissions, or get campus directions.
          </p>
        </div>

        {/* Card 2: University Information */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectScreen('university-info');
          }}
          className="group p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 hover:border-[#174D3A] transition-all cursor-pointer shadow-sm hover:shadow"
        >
          <div className="w-11 h-11 rounded-lg bg-[#DCE8E1]/40 border border-[#B0B4B8]/50 flex items-center justify-center text-[#174D3A] mb-3">
            <BookOpen className="w-5 h-5 text-[#174D3A]" />
          </div>
          <h2 className="text-base font-bold text-[#30343B] flex items-center justify-between">
            <span>University Information</span>
            <ArrowRight className="w-4 h-4 text-[#174D3A] group-hover:translate-x-1 transition-transform" />
          </h2>
          <p className="text-xs text-[#5F666D] mt-1.5 leading-relaxed">
            Explore our 11 academic faculties, B.Tech, MBA, BAMS, Agriculture programmes, and history.
          </p>
        </div>

        {/* Card 3: Facilities & Guidance */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectScreen('facilities');
          }}
          className="group p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 hover:border-[#174D3A] transition-all cursor-pointer shadow-sm hover:shadow"
        >
          <div className="w-11 h-11 rounded-lg bg-[#DCE8E1]/40 border border-[#B0B4B8]/50 flex items-center justify-center text-[#174D3A] mb-3">
            <Building className="w-5 h-5 text-[#174D3A]" />
          </div>
          <h2 className="text-base font-bold text-[#30343B] flex items-center justify-between">
            <span>Campus Facilities</span>
            <ArrowRight className="w-4 h-4 text-[#174D3A] group-hover:translate-x-1 transition-transform" />
          </h2>
          <p className="text-xs text-[#5F666D] mt-1.5 leading-relaxed">
            Central Library (Shruti), 100+ Bed Ayurveda Hospital, hostels, sports arena, and Annapurna mess.
          </p>
        </div>
      </div>

      {/* Quick Visitor Query Chips - Crisp White Card */}
      <div className="p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#174D3A]" />
          <span className="text-xs font-bold text-[#30343B] uppercase tracking-wider">
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
              className="px-3.5 py-2 rounded-lg bg-[#FFFFFF] hover:bg-[#DCE8E1]/30 border border-[#B0B4B8]/50 hover:border-[#174D3A] text-xs text-[#30343B] font-medium transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>{item.label}</span>
              <ArrowRight className="w-3 h-3 text-[#174D3A]" />
            </button>
          ))}
        </div>
      </div>

      {/* Campus Quick Facts Bar - Crisp White Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#B0B4B8]/60 text-[#30343B] shadow-sm">
          <div className="text-xl font-extrabold text-[#174D3A]">188 Acres</div>
          <div className="text-[11px] text-[#5F666D] mt-0.5 font-medium">Green Hilltop Campus</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#B0B4B8]/60 text-[#30343B] shadow-sm">
          <div className="text-xl font-extrabold text-[#174D3A]">11 Faculties</div>
          <div className="text-[11px] text-[#5F666D] mt-0.5 font-medium">Interdisciplinary Study</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#B0B4B8]/60 text-[#30343B] shadow-sm">
          <div className="text-xl font-extrabold text-[#174D3A]">100+ Beds</div>
          <div className="text-[11px] text-[#5F666D] mt-0.5 font-medium">Ayurveda Hospital</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#B0B4B8]/60 text-[#30343B] shadow-sm">
          <div className="text-xl font-extrabold text-[#174D3A]">100% Vegetarian</div>
          <div className="text-[11px] text-[#5F666D] mt-0.5 font-medium">Sattvic Healthy Living</div>
        </div>
      </div>
    </div>
  );
};
