import React from 'react';
import { AppScreen } from '../types/robot';
import {
  ArrowLeft,
  Bot,
  Compass,
  Calendar,
  Mic,
  Volume2,
  Settings,
  ArrowRight,
  Images,
  Menu,
  Building2,
  Navigation,
  Activity,
  Sliders,
  Maximize,
  Minimize
} from 'lucide-react';

interface HubScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenVoiceAssistant: () => void;
  onOpenMenu?: () => void;
  onSpeakGreeting?: (text: string) => void;
  isSpeaking?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const HubScreen: React.FC<HubScreenProps> = ({
  onNavigate,
  onOpenVoiceAssistant,
  onOpenMenu,
  onSpeakGreeting,
  isSpeaking = false,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const handleHearOverview = () => {
    if (onSpeakGreeting) {
      onSpeakGreeting(
        "Welcome to Sri Sri University. Touch circle 1 for Robot Info, circle 2 for Campus Highlights, or circle 3 for Agenda."
      );
    }
  };

  return (
    <div className="w-full h-full text-white flex flex-col justify-between p-3 sm:p-4 lg:p-5 font-sans select-none overflow-hidden relative">
      {/* ======================================================== */}
      {/* 1. SRI SRI UNIVERSITY SHRUTI BUILDING BACKGROUND         */}
      {/* ======================================================== */}
      <img
        src="/images/gallery/academic-shruti-complex.jpg"
        alt="Sri Sri University Shruti Building"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Android Dark Scrim Overlay: showcases Shruti architecture with crisp UI contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/80 via-[#1E293B]/60 to-[#0F172A]/85 backdrop-blur-[1px] pointer-events-none" />

      {/* ======================================================== */}
      {/* 2. ANDROID TOP APP BAR: Navy Blue (#263746)               */}
      {/* ======================================================== */}
      <header className="relative z-10 flex items-center justify-between bg-[#263746]/95 backdrop-blur-md text-white px-3 sm:px-5 py-2 rounded-2xl border border-white/15 shadow-lg shrink-0">
        {/* Left: Back to Face & Menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Returning to robot face.");
              onNavigate('face');
            }}
            className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-white transition-all shadow-xs"
            title="Return to Robot Face"
          >
            <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
            <Bot className="w-4 h-4 text-[#E9EDF2]" />
            <span className="text-xs font-semibold hidden sm:inline">Face</span>
          </button>

          {onOpenMenu && (
            <button
              onClick={onOpenMenu}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-white transition-all shadow-xs"
              title="Menu"
            >
              <Menu className="w-4 h-4 text-[#C49A45]" />
              <span className="text-xs font-semibold hidden md:inline">Menu</span>
            </button>
          )}
        </div>

        {/* Center: University Branding (Minimal) */}
        <div className="flex items-center gap-2.5">
          <img
            src="/robotics-club-logo.jpg"
            alt="Robotics Club SSU"
            className="w-8 h-8 rounded-full border border-white/30 object-cover shadow-sm"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold tracking-tight text-white">
              Sri Sri University
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C49A45] text-white font-bold uppercase tracking-wider">
              KIOSK
            </span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio Overview */}
          <button
            onClick={handleHearOverview}
            className={`p-2.5 min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
              isSpeaking
                ? 'bg-[#C49A45] border-[#C49A45] text-white'
                : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
            }`}
            title="Audio Overview"
          >
            <Volume2 className="w-4 h-4 text-[#E9EDF2]" />
          </button>

          {/* Fullscreen Kiosk Mode */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-white flex items-center justify-center transition-all"
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Kiosk'}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 text-[#C49A45]" />
              ) : (
                <Maximize className="w-4 h-4 text-[#C49A45]" />
              )}
            </button>
          )}

          {/* Settings */}
          <button
            onClick={() => onNavigate('settings')}
            className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-white flex items-center justify-center transition-all"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-[#E9EDF2]" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 3. MAIN BODY: Clean, Visual, Minimal Text                */}
      {/* ======================================================== */}
      <main className="relative z-10 flex-1 w-full flex flex-col justify-between items-center py-2 min-h-0">
        {/* Minimal Title */}
        <div className="text-center shrink-0 my-0.5">
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wide drop-shadow-md">
            How May I Assist You?
          </h1>
        </div>

        {/* ======================================================== */}
        {/* CAMPUS PHOTO GALLERY BAR (MINIMAL)                       */}
        {/* ======================================================== */}
        <button
          onClick={() => {
            if (onSpeakGreeting) onSpeakGreeting("Opening Sri Sri University photo gallery.");
            onNavigate('gallery');
          }}
          className="group relative w-full max-w-2xl rounded-2xl overflow-hidden border border-white/25 hover:border-[#C49A45] transition-all shadow-md active:scale-98 flex items-center justify-between px-4 sm:px-6 py-2 bg-black/40 backdrop-blur-md shrink-0 my-1 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0 group-hover:border-[#C49A45] transition-colors">
              <Images className="w-5 h-5 text-[#C49A45]" />
            </div>
            <div className="text-left">
              <span className="text-sm sm:text-base font-bold text-white block leading-tight">
                Explore Campus Gallery
              </span>
              <span className="text-[11px] text-[#E9EDF2]/80">
                21 Authentic Campus Photos
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 group-hover:bg-[#C49A45] px-3.5 py-1.5 rounded-full border border-white/20 transition-all">
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C49A45] group-hover:text-white transition-colors" />
          </div>
        </button>

        {/* ======================================================== */}
        {/* THE 3 ROUND (CIRCULAR) TOUCH BUTTONS — MINIMAL TEXT      */}
        {/* ======================================================== */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-10 lg:gap-12 w-full flex-1 min-h-0 py-2">
          {/* ======================================================== */}
          {/* ROUND BUTTON 1: ROBO INFO                                */}
          {/* ======================================================== */}
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening Robot Info.");
              onNavigate('robo-info');
            }}
            className="group relative flex flex-col items-center justify-center w-40 sm:w-52 md:w-56 lg:w-64 aspect-square rounded-full bg-white text-[#30343B] border-4 border-white/90 hover:border-[#C49A45] transition-all duration-300 hover:shadow-2xl active:scale-95 text-center shadow-xl p-3 shrink-0 cursor-pointer"
            title="Robo Info"
          >
            {/* Number 1 Badge */}
            <div className="absolute -top-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#263746] group-hover:bg-[#C49A45] text-white font-bold font-mono text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-md transition-colors">
              1
            </div>

            {/* Circular Icon Pod */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#E9EDF2] border border-[#D8DFE8] flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-[#263746] transition-all duration-300">
              <Bot className="w-7 h-7 sm:w-9 sm:h-9 text-[#263746] group-hover:text-white transition-colors" strokeWidth={1.75} />
            </div>

            {/* Title (Minimal) */}
            <h3 className="text-base sm:text-lg font-bold text-[#30343B] group-hover:text-[#263746] transition-colors leading-tight">
              Robo Info
            </h3>

            {/* Round Action Pill */}
            <span className="mt-2 px-3.5 py-1 rounded-full bg-[#263746] group-hover:bg-[#C49A45] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-xs">
              <span>Explore</span>
              <ArrowRight className="w-3 h-3 text-white" />
            </span>
          </button>

          {/* ======================================================== */}
          {/* ROUND BUTTON 2: CAMPUS HIGHLIGHTS                        */}
          {/* ======================================================== */}
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening Campus Highlights.");
              onNavigate('map-info');
            }}
            className="group relative flex flex-col items-center justify-center w-40 sm:w-52 md:w-56 lg:w-64 aspect-square rounded-full bg-white text-[#30343B] border-4 border-white/90 hover:border-[#C49A45] transition-all duration-300 hover:shadow-2xl active:scale-95 text-center shadow-xl p-3 shrink-0 cursor-pointer"
            title="Campus Highlights"
          >
            {/* Number 2 Badge */}
            <div className="absolute -top-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#263746] group-hover:bg-[#C49A45] text-white font-bold font-mono text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-md transition-colors">
              2
            </div>

            {/* Circular Icon Pod */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#E9EDF2] border border-[#D8DFE8] flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-[#263746] transition-all duration-300">
              <Compass className="w-7 h-7 sm:w-9 sm:h-9 text-[#263746] group-hover:text-white transition-colors" strokeWidth={1.75} />
            </div>

            {/* Title (Minimal) */}
            <h3 className="text-base sm:text-lg font-bold text-[#30343B] group-hover:text-[#263746] transition-colors leading-tight">
              Campus
            </h3>

            {/* Round Action Pill */}
            <span className="mt-2 px-3.5 py-1 rounded-full bg-[#263746] group-hover:bg-[#C49A45] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-xs">
              <span>Highlights</span>
              <ArrowRight className="w-3 h-3 text-white" />
            </span>
          </button>

          {/* ======================================================== */}
          {/* ROUND BUTTON 3: SESSIONS & AGENDA                        */}
          {/* ======================================================== */}
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening Sessions and Agenda.");
              onNavigate('sessions-agenda');
            }}
            className="group relative flex flex-col items-center justify-center w-40 sm:w-52 md:w-56 lg:w-64 aspect-square rounded-full bg-white text-[#30343B] border-4 border-white/90 hover:border-[#C49A45] transition-all duration-300 hover:shadow-2xl active:scale-95 text-center shadow-xl p-3 shrink-0 cursor-pointer"
            title="Sessions & Agenda"
          >
            {/* Number 3 Badge */}
            <div className="absolute -top-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#263746] group-hover:bg-[#C49A45] text-white font-bold font-mono text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-md transition-colors">
              3
            </div>

            {/* Circular Icon Pod */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#E9EDF2] border border-[#D8DFE8] flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-[#263746] transition-all duration-300">
              <Calendar className="w-7 h-7 sm:w-9 sm:h-9 text-[#263746] group-hover:text-white transition-colors" strokeWidth={1.75} />
            </div>

            {/* Title (Minimal) */}
            <h3 className="text-base sm:text-lg font-bold text-[#30343B] group-hover:text-[#263746] transition-colors leading-tight">
              Agenda
            </h3>

            {/* Round Action Pill */}
            <span className="mt-2 px-3.5 py-1 rounded-full bg-[#263746] group-hover:bg-[#C49A45] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-xs">
              <span>Sessions</span>
              <ArrowRight className="w-3 h-3 text-white" />
            </span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* QUICK SECONDARY NAVIGATION CHIPS (MINIMAL)               */}
        {/* ======================================================== */}
        <div className="flex items-center justify-center gap-2 shrink-0 flex-wrap px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/15 shadow-sm">
          <button
            onClick={() => onNavigate('facilities')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-all active:scale-95"
          >
            <Building2 className="w-3.5 h-3.5 text-[#C49A45]" />
            <span>Facilities</span>
          </button>

          <button
            onClick={() => onNavigate('navigation')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-all active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5 text-[#C49A45]" />
            <span>Navigate</span>
          </button>

          <button
            onClick={() => onNavigate('control')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-all active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5 text-[#C49A45]" />
            <span>Control</span>
          </button>

          <button
            onClick={() => onNavigate('monitor')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-all active:scale-95"
          >
            <Activity className="w-3.5 h-3.5 text-[#C49A45]" />
            <span>Monitor</span>
          </button>
        </div>
      </main>

      {/* ======================================================== */}
      {/* 4. ANDROID BOTTOM APP BAR                                */}
      {/* ======================================================== */}
      <footer className="relative z-10 bg-[#263746]/95 backdrop-blur-md text-white px-3 sm:px-5 py-2 rounded-2xl border border-white/15 shadow-lg flex items-center justify-between shrink-0">
        <button
          onClick={() => {
            if (onSpeakGreeting) onSpeakGreeting("Opening voice assistant.");
            onOpenVoiceAssistant();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all shadow-xs active:scale-95"
        >
          <div className="p-1 rounded-full bg-[#C49A45] text-white">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-xs sm:text-sm">Voice Assistant</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#E9EDF2]/90">
          <img
            src="/robotics-club-logo.jpg"
            alt="Robotics Club"
            className="w-5 h-5 rounded-full border border-white/30 object-cover"
          />
          <span className="text-white font-medium">SSU Robotics Club</span>
        </div>
      </footer>
    </div>
  );
};
