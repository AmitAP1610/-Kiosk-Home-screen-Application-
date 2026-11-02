import React from 'react';
import { AppScreen } from '../types/robot';
import {
  ArrowLeft,
  Bot,
  MapPin,
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
        "Welcome to the Sri Sri University Campus Hub, engineered by the Sri Sri Robotics Club. Please choose an option: Select button 1 for Robot Info, button 2 for our Campus Map and basic university information, or button 3 for today's sessions and agenda."
      );
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-black via-[#100603] to-[#04080c] text-white flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans select-none overflow-hidden relative">
      {/* TOP BAR: Back Button + SSU Brand & Club Logo + IP: 172.17.0.1 (Crisp & Sharp, No Blur) */}
      <header className="relative z-10 flex items-center justify-between border-b-2 border-[#C8A451]/60 pb-4 sm:pb-5 bg-black/90 px-2 rounded-2xl shadow-xl">
        {/* Back Button to Face (Matches sketch: "Back Botten" -> top left) */}
        <button
          onClick={() => {
            if (onSpeakGreeting) onSpeakGreeting("Returning to face view.");
            onNavigate('face');
          }}
          className="group flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-black/85 hover:bg-[#702815] border-2 border-[#C8A451]/70 text-slate-100 hover:text-white transition-all shadow-2xl active:scale-95"
          title="Return to Robot Face"
        >
          <div className="p-2 rounded-xl bg-[#702815] text-[#C8A451] group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-xs font-mono text-[#C8A451] block uppercase tracking-wider font-black">
              Back To
            </span>
            <span className="text-base sm:text-lg font-black flex items-center gap-2 text-white">
              <Bot className="w-5 h-5 text-[#00f3ff]" />
              <span>Robot Face</span>
            </span>
          </div>
        </button>

        {/* Center: University Title & Robotics Club Identity */}
        <div className="flex items-center gap-3.5 text-center">
          <img
            src="/robotics-club-logo.jpg"
            alt="Robotics Club SSU"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#C8A451] shadow-[0_0_20px_rgba(200,164,81,0.5)] object-cover hidden sm:block"
          />
          <div>
            <div className="flex items-center justify-center gap-2.5">
              <span className="text-xl sm:text-3xl md:text-4xl font-black tracking-wide text-white">
                SRI SRI UNIVERSITY
              </span>
              <span className="text-xs sm:text-sm font-mono px-3.5 py-1 rounded-full bg-[#702815] border border-[#C8A451] text-[#C8A451] font-black">
                KIOSK ROBOT HUB
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#C8A451] font-mono font-bold mt-1">
              "Learn, Lead, Serve" • Made by Sri Sri University Robotics Club
            </p>
          </div>
        </div>

        {/* Right Status: 172.17.0.1 (From sketch) + Battery + Voice */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="px-5 py-2.5 rounded-2xl bg-black/85 border-2 border-slate-800 text-right font-mono text-sm sm:text-base hidden sm:block shadow-xl">
            <div className="text-xs text-slate-400 font-bold uppercase">NETWORK IP</div>
            <div className="text-[#00f3ff] font-black flex items-center gap-1.5 justify-end text-base">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <span>172.17.0.1</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-black/85 border-2 border-slate-800 text-base sm:text-lg font-mono text-emerald-400 font-black shadow-xl">
            <Battery className="w-5 h-5" />
            <span>94%</span>
          </div>

          <button
            onClick={handleHearOverview}
            className={`p-3.5 rounded-2xl border-2 transition-all shadow-xl ${
              isSpeaking
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 animate-pulse'
                : 'bg-black/85 border-[#C8A451]/60 text-[#C8A451] hover:text-white'
            }`}
            title="Read Hub Overview Aloud"
          >
            <Volume2 className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening system settings.");
              onNavigate('settings');
            }}
            className="p-3.5 rounded-2xl bg-black/85 hover:bg-[#702815] border-2 border-[#C8A451]/60 text-[#C8A451] hover:text-white transition-all shadow-xl active:scale-95"
            title="Open System Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* MAIN BODY: 3 Circular Touch Buttons (Matches Notebook Sketch Box 2) */}
      <main className="relative z-10 my-auto py-4 sm:py-6 flex flex-col items-center justify-center">
        <div className="text-center max-w-3xl mb-6 sm:mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#702815] border-2 border-[#C8A451] text-[#C8A451] text-xs sm:text-sm font-mono uppercase tracking-widest font-black shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>Select a Service Below</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-wide">
            How May I Assist You Today?
          </h2>
          <p className="text-base sm:text-xl text-slate-100 font-medium">
            Tap any of the 3 large circular modules below to explore the campus or learn about this robot.
          </p>
        </div>

        {/* THE 3 CIRCULAR BUTTONS (1, 2, 3 as drawn in user's notebook sketch) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl w-full px-2">
          {/* BUTTON 1: ROBO INFO (Arrow 1 in sketch) */}
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening Robot Info. Here you can see our Robotics Club story, team members, and how I was made.");
              onNavigate('robo-info');
            }}
            className="group relative flex flex-col items-center justify-center p-7 sm:p-10 rounded-3xl bg-gradient-to-b from-[#1c1f26]/95 to-black/95 border-2 border-slate-700/80 hover:border-[#00f3ff] transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,243,255,0.4)] hover:-translate-y-2 active:scale-95 text-center"
          >
            {/* Circular badge with number 1 */}
            <div className="absolute -top-6 w-14 h-14 rounded-full bg-[#00f3ff] text-black font-black font-mono text-xl flex items-center justify-center shadow-2xl border-4 border-white group-hover:scale-110 transition-transform">
              1
            </div>

            {/* Icon circle */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-cyan-950 via-[#0a232b] to-[#123640] border-2 border-[#00f3ff]/70 flex items-center justify-center mb-6 group-hover:border-[#00f3ff] group-hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all">
              <Bot className="w-16 h-16 sm:w-20 sm:h-20 text-[#00f3ff] group-hover:scale-110 transition-transform" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#00f3ff] transition-colors mb-2">
              Robo Info
            </h3>
            <p className="text-base sm:text-lg text-[#00f3ff] font-mono font-black mb-2">
              Robotics Club & Creators
            </p>
            <p className="text-sm sm:text-base text-slate-200 line-clamp-2 leading-relaxed font-medium">
              Explore the Sri Sri Robotics Club story, 3-tier architecture, hardware specs, and creators.
            </p>

            <span className="mt-6 px-6 py-2.5 rounded-full bg-black/85 border-2 border-[#00f3ff]/50 text-sm sm:text-base font-mono text-[#00f3ff] group-hover:bg-[#00f3ff] group-hover:text-black font-black transition-all shadow-xl">
              View Club & Specs ➜
            </span>
          </button>

          {/* BUTTON 2: MAP & SSU INFO (Arrow 2 in sketch: "Map & ssu location / info") */}
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening Real Campus Map. Here you can explore our campus with live satellite view.");
              onNavigate('map-info');
            }}
            className="group relative flex flex-col items-center justify-center p-7 sm:p-10 rounded-3xl bg-gradient-to-b from-[#2a130c]/95 to-black/95 border-2 border-[#C8A451]/70 hover:border-[#C8A451] transition-all duration-300 hover:shadow-[0_0_50px_rgba(200,164,81,0.5)] hover:-translate-y-2 active:scale-95 text-center"
          >
            {/* Circular badge with number 2 */}
            <div className="absolute -top-6 w-14 h-14 rounded-full bg-[#C8A451] text-black font-black font-mono text-xl flex items-center justify-center shadow-2xl border-4 border-white group-hover:scale-110 transition-transform">
              2
            </div>

            {/* Icon circle */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[#3a1309] via-[#4d190b] to-[#702815] border-2 border-[#C8A451]/70 flex items-center justify-center mb-6 group-hover:border-[#C8A451] group-hover:shadow-[0_0_30px_rgba(200,164,81,0.7)] transition-all">
              <MapPin className="w-16 h-16 sm:w-20 sm:h-20 text-[#C8A451] group-hover:scale-110 transition-transform" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#C8A451] transition-colors mb-2">
              Map & SSU Info
            </h3>
            <p className="text-base sm:text-lg text-[#C8A451] font-mono font-black mb-2">
              Real GPS Satellite Map
            </p>
            <p className="text-sm sm:text-base text-slate-200 line-clamp-2 leading-relaxed font-medium">
              Find Shruti Complex, Kaivalya, 100-bed Hospital, Hostels, and the Maker Lab.
            </p>

            <span className="mt-6 px-6 py-2.5 rounded-full bg-black/85 border-2 border-[#C8A451]/60 text-sm sm:text-base font-mono text-[#C8A451] group-hover:bg-[#C8A451] group-hover:text-black font-black transition-all shadow-xl">
              Open Satellite Map ➜
            </span>
          </button>

          {/* BUTTON 3: SESSIONS / AGENDA (Arrow 3 in sketch: "Sessions / Agand") */}
          <button
            onClick={() => {
              if (onSpeakGreeting) onSpeakGreeting("Opening Sessions and Agenda. Here is today's university schedule and robotics demos.");
              onNavigate('sessions-agenda');
            }}
            className="group relative flex flex-col items-center justify-center p-7 sm:p-10 rounded-3xl bg-gradient-to-b from-[#181a29]/95 to-black/95 border-2 border-indigo-900/80 hover:border-indigo-400 transition-all duration-300 hover:shadow-[0_0_50px_rgba(99,102,241,0.4)] hover:-translate-y-2 active:scale-95 text-center"
          >
            {/* Circular badge with number 3 */}
            <div className="absolute -top-6 w-14 h-14 rounded-full bg-indigo-500 text-white font-black font-mono text-xl flex items-center justify-center shadow-2xl border-4 border-white group-hover:scale-110 transition-transform">
              3
            </div>

            {/* Icon circle */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-indigo-950 via-[#191938] to-[#252554] border-2 border-indigo-500/70 flex items-center justify-center mb-6 group-hover:border-indigo-400 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all">
              <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-indigo-400 transition-colors mb-2">
              Sessions / Agenda
            </h3>
            <p className="text-base sm:text-lg text-indigo-400 font-mono font-black mb-2">
              Conferences, Classes & Times
            </p>
            <p className="text-sm sm:text-base text-slate-200 line-clamp-2 leading-relaxed font-medium">
              View today’s academic schedule, robotics demos, meditation sessions, and guest talks.
            </p>

            <span className="mt-6 px-6 py-2.5 rounded-full bg-black/85 border-2 border-indigo-500/50 text-sm sm:text-base font-mono text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white font-black transition-all shadow-xl">
              View Today's Agenda ➜
            </span>
          </button>
        </div>
      </main>

      {/* FOOTER: Quick Assistant Mic + Robotics Club Branding */}
      <footer className="relative z-10 border-t-2 border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Quick Voice Assistant Mic bar */}
        <button
          onClick={() => {
            if (onSpeakGreeting) onSpeakGreeting("Opening voice assistant. You can speak to me or ask any question.");
            onOpenVoiceAssistant();
          }}
          className="flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-black/85 hover:bg-[#702815] border-2 border-[#C8A451]/70 text-white shadow-xl transition-all active:scale-95"
        >
          <div className="p-2.5 rounded-full bg-[#00f3ff] text-black">
            <Mic className="w-5 h-5" />
          </div>
          <span className="font-black text-base sm:text-lg">Tap to Speak with Kiosk Voice Assistant</span>
          <span className="text-xs sm:text-sm font-mono text-[#C8A451] hidden md:inline">"Where is library?"</span>
        </button>

        {/* Club Emblem & College info */}
        <div className="flex items-center gap-3 font-mono text-sm sm:text-base text-slate-200 font-bold">
          <img
            src="/robotics-club-logo.jpg"
            alt="Robotics Club"
            className="w-8 h-8 rounded-full border border-[#C8A451]"
          />
          <span className="text-[#C8A451]">Sri Sri University Robotics Club</span>
          <span>•</span>
          <span>Cuttack, Odisha</span>
        </div>
      </footer>
    </div>
  );
};
