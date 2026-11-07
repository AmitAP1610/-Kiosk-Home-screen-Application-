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
  Settings,
  ArrowRight,
  Images,
  Menu,
  GraduationCap,
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
        "Welcome to the Sri Sri University Campus Hub. Please choose an option: Touch circular button 1 for Robot Info, circular button 2 for Campus Highlights and facilities, or circular button 3 for today's sessions and agenda. You can also explore our authentic campus photo gallery."
      );
    }
  };

  return (
    <div className="w-full h-full text-[#30343B] flex flex-col justify-between p-3 sm:p-4 lg:p-5 font-sans select-none overflow-hidden relative">
      {/* ======================================================== */}
      {/* 1. AUTHENTIC CAMPUS BACKGROUND & SUBTLE OVERLAY          */}
      {/* ======================================================== */}
      <img
        src="/images/gallery/campus-aerial-overview.jpg"
        alt="Sri Sri University 188-Acre Campus"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {/* Subtle translucent overlay: reveals campus scenery while guaranteeing 100% text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E9EDF2]/95 via-[#E9EDF2]/90 to-[#E9EDF2]/96 backdrop-blur-[2px] pointer-events-none" />

      {/* ======================================================== */}
      {/* 2. TOP HEADER: Navy Blue Bar (#263746)                   */}
      {/* ======================================================== */}
      <header className="relative z-10 flex items-center justify-between bg-[#263746] text-white px-3 sm:px-5 py-2.5 rounded-xl border border-white/10 shadow-sm shrink-0">
        {/* Left: Back to Face & Navigation Menu Button */}
        <div className="flex items-center gap-2">
          {/* Back Button to Robot Face */}
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Returning to robot face.");
              onNavigate('face');
            }}
            className="group flex items-center gap-2 px-3 py-1.5 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all shadow-sm active:scale-98"
            title="Return to Robot Face"
          >
            <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
            <div className="text-left hidden sm:block">
              <span className="text-[10px] font-mono text-[#E9EDF2]/70 block uppercase tracking-wider">
                Screen 1
              </span>
              <span className="text-xs font-semibold flex items-center gap-1.5 text-white">
                <Bot className="w-3.5 h-3.5 text-[#E9EDF2]" />
                <span>Robot Face</span>
              </span>
            </div>
          </button>

          {/* Application Navigation Drawer Menu */}
          {onOpenMenu && (
            <button
              onClick={onOpenMenu}
              className="flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all shadow-sm active:scale-98"
              title="Open Complete Navigation Menu"
            >
              <Menu className="w-4 h-4 text-[#C49A45]" />
              <span className="text-xs font-semibold hidden md:inline">Menu</span>
            </button>
          )}
        </div>

        {/* Center: University Title & Robotics Club Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-center">
          <img
            src="/robotics-club-logo.jpg"
            alt="Robotics Club SSU"
            className="w-9 h-9 rounded-full border border-white/20 object-cover hidden sm:block"
          />
          <div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                Sri Sri University
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C49A45] text-white font-semibold uppercase tracking-wider">
                KIOSK AMR
              </span>
            </div>
            <p className="text-[12px] text-[#E9EDF2]/80 mt-0.5 hidden sm:block">
              Learn, Lead, Serve • Robotics Club • Cuttack, Odisha
            </p>
          </div>
        </div>

        {/* Right Status: Static IP + Battery + Audio Overview + Fullscreen Kiosk + Settings */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 min-h-[44px] rounded-lg bg-[#30343B] border border-white/10 text-right font-mono text-xs hidden lg:flex flex-col justify-center">
            <div className="text-[9px] text-[#E9EDF2]/70 font-medium">STATIC IP</div>
            <div className="text-white font-bold flex items-center gap-1.5 justify-end text-xs">
              <Wifi className="w-3 h-3 text-[#C49A45]" />
              <span>172.17.0.1</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[44px] rounded-lg bg-[#30343B] border border-white/10 text-xs font-mono text-white font-medium">
            <Battery className="w-4 h-4 text-[#C49A45]" />
            <span>94%</span>
          </div>

          <button
            onClick={handleHearOverview}
            className={`p-2 min-h-[44px] min-w-[44px] rounded-lg border flex items-center justify-center transition-all shadow-sm ${
              isSpeaking
                ? 'bg-[#C49A45] border-[#C49A45] text-white'
                : 'bg-[#30343B] border-white/10 text-white hover:bg-[#202124]'
            }`}
            title="Read Hub Overview Aloud"
          >
            <Volume2 className="w-4 h-4 text-[#E9EDF2]" />
          </button>

          {/* Android Tablet Fullscreen Kiosk Mode Toggle */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-2 min-h-[44px] min-w-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white flex items-center justify-center transition-all shadow-sm active:scale-98"
              title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen (Android Kiosk)'}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 text-[#C49A45]" />
              ) : (
                <Maximize className="w-4 h-4 text-[#C49A45]" />
              )}
            </button>
          )}

          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening system settings.");
              onNavigate('settings');
            }}
            className="p-2 min-h-[44px] min-w-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white flex items-center justify-center transition-all shadow-sm active:scale-98"
            title="Open System Settings"
          >
            <Settings className="w-4 h-4 text-[#E9EDF2]" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 3. MAIN BODY: Hero Gallery Card + 3 Round Modules        */}
      {/* ======================================================== */}
      <main className="relative z-10 flex-1 w-full flex flex-col justify-between py-1 sm:py-2 min-h-0">
        {/* Minimal Headline with Exact Typography Rules */}
        <div className="text-center space-y-0.5 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/95 text-[#263746] text-[11px] sm:text-[12px] font-semibold border border-[#D8DFE8] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" />
            <span>Sri Sri University Campus Assistant</span>
          </div>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-[#30343B] tracking-tight">
            How May I Assist You Today?
          </h1>
          <p className="text-[12px] sm:text-[13px] text-[#606B76] font-normal max-w-2xl mx-auto">
            Touch a circular service module below to inspect robot technology, explore campus highlights, or review daily event timetables.
          </p>
        </div>

        {/* ======================================================== */}
        {/* DEDICATED PROMINENT ENTRY: EXPLORE OUR CAMPUS GALLERY   */}
        {/* ======================================================== */}
        <button
          onClick={() => {
            if (onSpeakGreeting) onSpeakGreeting("Opening Sri Sri University photo gallery. Explore our authentic campus photographs.");
            onNavigate('gallery');
          }}
          className="group relative w-full rounded-xl overflow-hidden border border-[#D8DFE8] hover:border-[#263746] transition-all shadow-xs active:scale-99 text-left cursor-pointer flex items-center justify-between min-h-[56px] sm:min-h-[64px] shrink-0 my-1"
        >
          {/* Authentic Campus Photograph Background */}
          <img
            src="/images/gallery/campus-aerial-panoramic.jpg"
            alt="Sri Sri University Campus Panoramic"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          />

          {/* Subtle Dark Overlay for Visual Clarity */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/92 via-[#263746]/85 to-[#17191C]/92 group-hover:via-[#263746]/80 transition-colors" />

          {/* Card Content */}
          <div className="relative z-10 flex items-center gap-3 px-4 sm:px-6 py-1.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 group-hover:border-[#C49A45] transition-colors">
              <Images className="w-5 h-5 text-[#C49A45]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Explore Our Campus
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#C49A45] text-white font-semibold uppercase tracking-wider hidden sm:inline-block">
                  Photo Gallery
                </span>
              </div>
              <p className="text-[11px] sm:text-[12px] text-[#E9EDF2]/90 font-normal">
                Authentic photographs of aerial views, academic blocks, labs, library, and campus life
              </p>
            </div>
          </div>

          {/* Action Badge on Right */}
          <div className="relative z-10 pr-4 sm:pr-6 hidden sm:flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all group-hover:border-[#C49A45]">
              <span>View 21 Photos</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C49A45] group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </button>

        {/* ======================================================== */}
        {/* THE 3 ROUND (CIRCULAR) TOUCH MODULES                     */}
        {/* ======================================================== */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 lg:gap-10 w-full flex-1 items-center min-h-0 py-1 sm:py-2">
          {/* ======================================================== */}
          {/* ROUND MODULE 1: ROBO INFO                                */}
          {/* ======================================================== */}
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening Robot Info. Learn about Sri Sri Robotics Club and how I was engineered.");
              onNavigate('robo-info');
            }}
            className="group relative flex flex-col items-center justify-center w-40 sm:w-52 md:w-56 lg:w-64 aspect-square rounded-full bg-white text-[#30343B] border-3 sm:border-4 border-[#D8DFE8] hover:border-[#C49A45] transition-all duration-300 hover:shadow-xl active:scale-95 text-center shadow-md p-2.5 sm:p-4 shrink-0"
            title="Module 1: Robo Info"
          >
            {/* Circular badge with number 1 */}
            <div className="absolute -top-3 sm:-top-3.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#263746] group-hover:bg-[#C49A45] text-white font-bold font-mono text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-md transition-colors">
              1
            </div>

            {/* Circular Icon Container */}
            <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#E9EDF2] border border-[#D8DFE8] flex items-center justify-center mb-1 group-hover:scale-110 group-hover:bg-[#263746] transition-all duration-300">
              <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-[#263746] group-hover:text-white transition-colors" strokeWidth={1.75} />
            </div>

            {/* Title & Category */}
            <div className="space-y-0.5 px-2">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#30343B] group-hover:text-[#263746] transition-colors leading-tight">
                Robo Info
              </h3>
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#C49A45] leading-tight">
                Club & Engineering
              </p>
              <p className="text-[10px] sm:text-[11px] text-[#606B76] line-clamp-2 leading-tight max-w-[170px] hidden sm:block mt-0.5">
                Maker Space & 3-Tier Autonomous Tech
              </p>
            </div>

            {/* Round Action Pill */}
            <span className="mt-1 sm:mt-1.5 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#263746] group-hover:bg-[#C49A45] text-white text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-xs">
              <span>Explore</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            </span>
          </button>

          {/* ======================================================== */}
          {/* ROUND MODULE 2: CAMPUS HIGHLIGHTS                        */}
          {/* ======================================================== */}
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening Campus Highlights. Explore our library, hospital, dining halls, and student facilities.");
              onNavigate('map-info');
            }}
            className="group relative flex flex-col items-center justify-center w-40 sm:w-52 md:w-56 lg:w-64 aspect-square rounded-full bg-white text-[#30343B] border-3 sm:border-4 border-[#D8DFE8] hover:border-[#C49A45] transition-all duration-300 hover:shadow-xl active:scale-95 text-center shadow-md p-2.5 sm:p-4 shrink-0"
            title="Module 2: Campus Highlights"
          >
            {/* Circular badge with number 2 */}
            <div className="absolute -top-3 sm:-top-3.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#263746] group-hover:bg-[#C49A45] text-white font-bold font-mono text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-md transition-colors">
              2
            </div>

            {/* Circular Icon Container */}
            <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#E9EDF2] border border-[#D8DFE8] flex items-center justify-center mb-1 group-hover:scale-110 group-hover:bg-[#263746] transition-all duration-300">
              <Compass className="w-6 h-6 sm:w-8 sm:h-8 text-[#263746] group-hover:text-white transition-colors" strokeWidth={1.75} />
            </div>

            {/* Title & Category */}
            <div className="space-y-0.5 px-2">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#30343B] group-hover:text-[#263746] transition-colors leading-tight">
                Campus Highlights
              </h3>
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#C49A45] leading-tight">
                Facilities & Library
              </p>
              <p className="text-[10px] sm:text-[11px] text-[#606B76] line-clamp-2 leading-tight max-w-[170px] hidden sm:block mt-0.5">
                Central Library, 100-bed Hospital & Dining
              </p>
            </div>

            {/* Round Action Pill */}
            <span className="mt-1 sm:mt-1.5 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#263746] group-hover:bg-[#C49A45] text-white text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-xs">
              <span>Facilities</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            </span>
          </button>

          {/* ======================================================== */}
          {/* ROUND MODULE 3: SESSIONS & AGENDA                        */}
          {/* ======================================================== */}
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening Sessions and Agenda. Here is today's university schedule, conferences, and robotics demos.");
              onNavigate('sessions-agenda');
            }}
            className="group relative flex flex-col items-center justify-center w-40 sm:w-52 md:w-56 lg:w-64 aspect-square rounded-full bg-white text-[#30343B] border-3 sm:border-4 border-[#D8DFE8] hover:border-[#C49A45] transition-all duration-300 hover:shadow-xl active:scale-95 text-center shadow-md p-2.5 sm:p-4 shrink-0"
            title="Module 3: Sessions & Agenda"
          >
            {/* Circular badge with number 3 */}
            <div className="absolute -top-3 sm:-top-3.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#263746] group-hover:bg-[#C49A45] text-white font-bold font-mono text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-md transition-colors">
              3
            </div>

            {/* Circular Icon Container */}
            <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#E9EDF2] border border-[#D8DFE8] flex items-center justify-center mb-1 group-hover:scale-110 group-hover:bg-[#263746] transition-all duration-300">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-[#263746] group-hover:text-white transition-colors" strokeWidth={1.75} />
            </div>

            {/* Title & Category */}
            <div className="space-y-0.5 px-2">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#30343B] group-hover:text-[#263746] transition-colors leading-tight">
                Sessions & Agenda
              </h3>
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#C49A45] leading-tight">
                Timetables & Events
              </p>
              <p className="text-[10px] sm:text-[11px] text-[#606B76] line-clamp-2 leading-tight max-w-[170px] hidden sm:block mt-0.5">
                Robotics Demos, Academic Lectures & Fests
              </p>
            </div>

            {/* Round Action Pill */}
            <span className="mt-1 sm:mt-1.5 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#263746] group-hover:bg-[#C49A45] text-white text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-xs">
              <span>View Agenda</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            </span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* QUICK SECONDARY NAVIGATION ROW                           */}
        {/* ======================================================== */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => onNavigate('university-info')}
            className="flex items-center gap-1 px-2.5 py-1 min-h-[34px] rounded-lg bg-white/95 hover:bg-white text-[#30343B] text-[11px] sm:text-xs font-semibold border border-[#D8DFE8] shadow-xs active:scale-95"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#263746]" />
            <span>11 Faculties</span>
          </button>

          <button
            onClick={() => onNavigate('facilities')}
            className="flex items-center gap-1 px-2.5 py-1 min-h-[34px] rounded-lg bg-white/95 hover:bg-white text-[#30343B] text-[11px] sm:text-xs font-semibold border border-[#D8DFE8] shadow-xs active:scale-95"
          >
            <Building2 className="w-3.5 h-3.5 text-[#263746]" />
            <span>Facilities Guide</span>
          </button>

          <button
            onClick={() => onNavigate('navigation')}
            className="flex items-center gap-1 px-2.5 py-1 min-h-[34px] rounded-lg bg-white/95 hover:bg-white text-[#30343B] text-[11px] sm:text-xs font-semibold border border-[#D8DFE8] shadow-xs active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5 text-[#263746]" />
            <span>Campus Routes</span>
          </button>

          <button
            onClick={() => onNavigate('control')}
            className="flex items-center gap-1 px-2.5 py-1 min-h-[34px] rounded-lg bg-white/95 hover:bg-white text-[#30343B] text-[11px] sm:text-xs font-semibold border border-[#D8DFE8] shadow-xs active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5 text-[#263746]" />
            <span>Robot Control</span>
          </button>

          <button
            onClick={() => onNavigate('monitor')}
            className="flex items-center gap-1 px-2.5 py-1 min-h-[34px] rounded-lg bg-white/95 hover:bg-white text-[#30343B] text-[11px] sm:text-xs font-semibold border border-[#D8DFE8] shadow-xs active:scale-95"
          >
            <Activity className="w-3.5 h-3.5 text-[#263746]" />
            <span>Telemetry</span>
          </button>
        </div>
      </main>

      {/* ======================================================== */}
      {/* 4. FOOTER: Navy Blue Bar with Assistant Mic + SSU Motto */}
      {/* ======================================================== */}
      <footer className="relative z-10 bg-[#263746] text-white px-3 sm:px-5 py-2 rounded-xl border border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
        <button
          onClick={() => {
            if (onSpeakGreeting) onSpeakGreeting("Opening voice assistant. You can speak to me or ask any question.");
            onOpenVoiceAssistant();
          }}
          className="flex items-center gap-2 px-3 py-1.5 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all shadow-sm active:scale-98"
        >
          <div className="p-1 rounded bg-[#C49A45] text-white">
            <Mic className="w-4 h-4" />
          </div>
          <span className="font-semibold text-xs sm:text-sm">Voice Assistant</span>
          <span className="text-[11px] font-mono text-[#E9EDF2]/70 hidden md:inline">
            "Where is the library?"
          </span>
        </button>

        <div className="flex items-center gap-2 text-[12px] text-[#E9EDF2]/80">
          <img
            src="/robotics-club-logo.jpg"
            alt="Robotics Club"
            className="w-5 h-5 rounded-full border border-white/20 object-cover"
          />
          <span className="text-white font-medium">Sri Sri University Robotics Club</span>
          <span>•</span>
          <span>Cuttack, Odisha</span>
        </div>
      </footer>
    </div>
  );
};
