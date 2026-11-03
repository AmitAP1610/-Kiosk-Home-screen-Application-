import React from 'react';
import { AppScreen } from '../types/robot';
import {
  ArrowLeft,
  Bot,
  Compass,
  Calendar,
  Sparkles,
  Mic,
  Wifi,
  Battery,
  Volume2,
  Settings
} from 'lucide-react';

interface HubScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenVoiceAssistant: () => void;
  onSpeakGreeting?: (text: string) => void;
  isSpeaking?: boolean;
}

export const HubScreen: React.FC<HubScreenProps> = ({
  onNavigate,
  onOpenVoiceAssistant,
  onSpeakGreeting,
  isSpeaking = false
}) => {
  const handleHearOverview = () => {
    if (onSpeakGreeting) {
      onSpeakGreeting(
        "Welcome to the Sri Sri University Campus Hub, engineered by the Sri Sri Robotics Club. Please choose an option: Touch button 1 for Robot Info, button 2 for Campus Highlights and facilities, or button 3 for today's sessions and agenda."
      );
    }
  };

  return (
    <div className="w-full h-full bg-[#F2F2EF] text-[#30343B] flex flex-col justify-between p-4 sm:p-6 lg:p-7 font-sans select-none overflow-hidden relative">
      {/* TOP HEADER: Sidebar & Primary Elements (#30343B) */}
      <header className="relative z-10 flex items-center justify-between bg-[#30343B] text-white px-4 sm:px-6 py-3 rounded-xl border border-[#B0B4B8]/30 shadow-subtle">
        {/* Back Button to Face */}
        <button
          onClick={() => {
            if (onSpeakGreeting) onSpeakGreeting("Returning to robot face.");
            onNavigate('face');
          }}
          className="group flex items-center gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#202124] hover:bg-[#1A1B1D] border border-[#B0B4B8]/40 text-white transition-all shadow-sm active:scale-98"
          title="Return to Robot Face"
        >
          <div className="p-1.5 rounded-md bg-[#30343B] text-[#D49A36]">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-[10px] font-mono text-[#B0B4B8] block uppercase tracking-wider font-semibold">
              Screen 1
            </span>
            <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-white">
              <Bot className="w-3.5 h-3.5 text-[#D49A36]" />
              <span>Robot Face</span>
            </span>
          </div>
        </button>

        {/* Center: University Title & Robotics Club Identity */}
        <div className="flex items-center gap-3 text-center">
          <img
            src="/robotics-club-logo.jpg"
            alt="Robotics Club SSU"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#B0B4B8]/40 object-cover hidden sm:block"
          />
          <div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-base sm:text-xl md:text-2xl font-extrabold tracking-wide text-white">
                SRI SRI UNIVERSITY
              </span>
              <span className="text-[10px] sm:text-xs font-mono px-2.5 py-0.5 rounded bg-[#D49A36] text-[#202124] font-bold uppercase">
                KIOSK ROBOT
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#B0B4B8] font-mono mt-0.5">
              "Learn, Lead, Serve" • Sri Sri University Robotics Club
            </p>
          </div>
        </div>

        {/* Right Status: Static IP + Battery + Audio Overview + Settings */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="px-3 py-1.5 rounded-lg bg-[#202124] border border-[#B0B4B8]/40 text-right font-mono text-xs hidden md:block">
            <div className="text-[9px] text-[#B0B4B8] font-bold uppercase">STATIC IP</div>
            <div className="text-white font-bold flex items-center gap-1.5 justify-end text-xs">
              <Wifi className="w-3 h-3 text-[#D49A36]" />
              <span>172.17.0.1</span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#202124] border border-[#B0B4B8]/40 text-xs font-mono text-white font-semibold">
            <Battery className="w-3.5 h-3.5 text-[#B0B4B8]" />
            <span>94%</span>
          </div>

          <button
            onClick={handleHearOverview}
            className={`p-2 rounded-lg border transition-all ${
              isSpeaking
                ? 'bg-[#D49A36] border-[#D49A36] text-[#202124]'
                : 'bg-[#202124] border-[#B0B4B8]/40 text-white hover:bg-[#1A1B1D]'
            }`}
            title="Read Hub Overview Aloud"
          >
            <Volume2 className="w-4 h-4 text-[#D49A36]" />
          </button>

          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening system settings.");
              onNavigate('settings');
            }}
            className="p-2 rounded-lg bg-[#202124] hover:bg-[#1A1B1D] border border-[#B0B4B8]/40 text-white transition-all shadow-sm active:scale-98"
            title="Open System Settings"
          >
            <Settings className="w-4 h-4 text-[#B0B4B8]" />
          </button>
        </div>
      </header>

      {/* MAIN BODY: The 3 Expansive Navigation Modules */}
      <main className="relative z-10 flex-1 w-full flex flex-col justify-between py-4 sm:py-5">
        {/* Minimal Headline */}
        <div className="text-center space-y-1 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#30343B] text-white text-xs font-mono uppercase tracking-wider font-semibold border border-[#B0B4B8]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#D49A36]" />
            <span>Campus Interactive Navigation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#30343B] tracking-tight">
            How May I Assist You Today?
          </h2>
          <p className="text-xs sm:text-sm text-[#5F666D] font-medium max-w-2xl mx-auto">
            Select an operational service module below to inspect robot engineering, explore campus landmarks, or review event timetables.
          </p>
        </div>

        {/* THE 3 EXPANSIVE TOUCH MODULES: Crisp White Cards (#FFFFFF) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full flex-1 items-stretch my-auto">
          {/* ======================================================== */}
          {/* MODULE 1: ROBO INFO                                      */}
          {/* ======================================================== */}
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening Robot Info. Learn about Sri Sri Robotics Club and how I was engineered.");
              onNavigate('robo-info');
            }}
            className="group relative flex-1 h-full min-h-[340px] sm:min-h-[380px] flex flex-col items-center justify-between p-6 sm:p-7 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 hover:border-[#D49A36] transition-all duration-200 active:scale-98 text-center shadow-card"
          >
            {/* Number 1 Badge (Warning/Accent #D49A36) */}
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-[#D49A36] text-[#202124] font-extrabold font-mono text-base flex items-center justify-center border-2 border-[#FFFFFF] shadow-sm">
              1
            </div>

            {/* Icon Container */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#F2F2EF] border border-[#B0B4B8]/40 flex items-center justify-center my-3 transition-colors group-hover:border-[#D49A36]">
              <Bot className="w-12 h-12 sm:w-14 sm:h-14 text-[#30343B] group-hover:text-[#D49A36] transition-colors" />
            </div>

            {/* Text Information */}
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#30343B]">
                Robo Info
              </h3>
              <p className="text-xs font-mono text-[#D49A36] font-bold uppercase tracking-wider">
                Robotics Club & Engineering
              </p>
              <p className="text-xs sm:text-sm text-[#5F666D] line-clamp-3 leading-relaxed max-w-xs">
                Explore the Sri Sri University Robotics Club history, Maker Space facilities, and our 3-tier architecture.
              </p>
            </div>

            {/* Bottom Action Pill: Dark Element with subtle border */}
            <span className="mt-4 w-full py-2.5 px-4 rounded-lg bg-[#30343B] group-hover:bg-[#202124] text-white text-xs sm:text-sm font-mono font-bold transition-colors">
              Explore Robot & Club ➜
            </span>
          </button>

          {/* ======================================================== */}
          {/* MODULE 2: CAMPUS HIGHLIGHTS                              */}
          {/* ======================================================== */}
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening Campus Highlights. Explore our library, hospital, dining halls, and student facilities.");
              onNavigate('map-info');
            }}
            className="group relative flex-1 h-full min-h-[340px] sm:min-h-[380px] flex flex-col items-center justify-between p-6 sm:p-7 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 hover:border-[#D49A36] transition-all duration-200 active:scale-98 text-center shadow-card"
          >
            {/* Number 2 Badge (Warning/Accent #D49A36) */}
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-[#D49A36] text-[#202124] font-extrabold font-mono text-base flex items-center justify-center border-2 border-[#FFFFFF] shadow-sm">
              2
            </div>

            {/* Icon Container */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#F2F2EF] border border-[#B0B4B8]/40 flex items-center justify-center my-3 transition-colors group-hover:border-[#D49A36]">
              <Compass className="w-12 h-12 sm:w-14 sm:h-14 text-[#30343B] group-hover:text-[#D49A36] transition-colors" />
            </div>

            {/* Text Information */}
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#30343B]">
                Campus Highlights
              </h3>
              <p className="text-xs font-mono text-[#D49A36] font-bold uppercase tracking-wider">
                Facilities, Hospital & Library
              </p>
              <p className="text-xs sm:text-sm text-[#5F666D] line-clamp-3 leading-relaxed max-w-xs">
                Photo guides and audio tours of Shruti Central Library, 100-bed Hospital, Kaivalya Dining, and Maker Space.
              </p>
            </div>

            {/* Bottom Action Pill */}
            <span className="mt-4 w-full py-2.5 px-4 rounded-lg bg-[#30343B] group-hover:bg-[#202124] text-white text-xs sm:text-sm font-mono font-bold transition-colors">
              Explore Facilities ➜
            </span>
          </button>

          {/* ======================================================== */}
          {/* MODULE 3: SESSIONS / AGENDA                              */}
          {/* ======================================================== */}
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening Sessions and Agenda. Here is today's university schedule, conferences, and robotics demos.");
              onNavigate('sessions-agenda');
            }}
            className="group relative flex-1 h-full min-h-[340px] sm:min-h-[380px] flex flex-col items-center justify-between p-6 sm:p-7 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 hover:border-[#D49A36] transition-all duration-200 active:scale-98 text-center shadow-card"
          >
            {/* Number 3 Badge (Warning/Accent #D49A36) */}
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-[#D49A36] text-[#202124] font-extrabold font-mono text-base flex items-center justify-center border-2 border-[#FFFFFF] shadow-sm">
              3
            </div>

            {/* Icon Container */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#F2F2EF] border border-[#B0B4B8]/40 flex items-center justify-center my-3 transition-colors group-hover:border-[#D49A36]">
              <Calendar className="w-12 h-12 sm:w-14 sm:h-14 text-[#30343B] group-hover:text-[#D49A36] transition-colors" />
            </div>

            {/* Text Information */}
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#30343B]">
                Sessions / Agenda
              </h3>
              <p className="text-xs font-mono text-[#D49A36] font-bold uppercase tracking-wider">
                Timetable & Live Events
              </p>
              <p className="text-xs sm:text-sm text-[#5F666D] line-clamp-3 leading-relaxed max-w-xs">
                Photographic cards, key takeaways, and schedules for robotics demos, academic lectures, and symposiums.
              </p>
            </div>

            {/* Bottom Action Pill */}
            <span className="mt-4 w-full py-2.5 px-4 rounded-lg bg-[#30343B] group-hover:bg-[#202124] text-white text-xs sm:text-sm font-mono font-bold transition-colors">
              View Today's Agenda ➜
            </span>
          </button>
        </div>
      </main>

      {/* FOOTER: Charcoal Structural Bar with Assistant Mic + Robotics Club Branding */}
      <footer className="relative z-10 bg-[#30343B] text-white px-4 sm:px-6 py-2.5 rounded-xl border border-[#B0B4B8]/30 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Quick Voice Assistant Mic bar */}
        <button
          onClick={() => {
            if (onSpeakGreeting) onSpeakGreeting("Opening voice assistant. You can speak to me or ask any question.");
            onOpenVoiceAssistant();
          }}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#202124] hover:bg-[#1A1B1D] border border-[#B0B4B8]/40 text-white transition-all shadow-sm active:scale-98"
        >
          <div className="p-1 rounded-md bg-[#D49A36] text-[#202124]">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-xs sm:text-sm">Voice Assistant</span>
          <span className="text-[11px] font-mono text-[#B0B4B8] hidden md:inline">"Where is the library?"</span>
        </button>

        {/* Club Emblem & College info */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#B0B4B8]">
          <img
            src="/robotics-club-logo.jpg"
            alt="Robotics Club"
            className="w-5 h-5 rounded-full border border-[#B0B4B8]/50"
          />
          <span className="text-white font-semibold">Sri Sri University Robotics Club</span>
          <span>•</span>
          <span>Cuttack, Odisha</span>
        </div>
      </footer>
    </div>
  );
};
