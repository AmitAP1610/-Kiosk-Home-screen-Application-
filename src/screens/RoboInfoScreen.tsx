import React, { useState } from 'react';
import { AppScreen } from '../types/robot';
import { ROBOT_INFO, TeamMember, HardwareTier } from '../data/robotInfoData';
import {
  ArrowLeft,
  Volume2,
  CheckCircle2,
  Award,
  Sparkles,
  Bot,
  Cpu,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface RoboInfoScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onSpeakText?: (text: string) => void;
  isSpeaking?: boolean;
}

export const RoboInfoScreen: React.FC<RoboInfoScreenProps> = ({
  onNavigate,
  onSpeakText,
  isSpeaking = false
}) => {
  const [activeTab, setActiveTab] = useState<'club-story' | 'how-made' | 'who-made' | 'specs'>('club-story');
  const [isGiantFont, setIsGiantFont] = useState<boolean>(true); // Giant font enabled by default for kiosk tablet viewing

  const handleSpeakStory = () => {
    if (onSpeakText) {
      onSpeakText(ROBOT_INFO.audioStory);
    }
  };

  const handleSpeakClubInfo = () => {
    if (onSpeakText) {
      onSpeakText(
        "Kiosk was engineered and built with passion by the student innovators of the Sri Sri University Robotics Club. Our club unites aspiring roboticists, software architects, and makers to turn advanced AI and robotics into real autonomous machines. Explore our story and team members below!"
      );
    }
  };

  return (
    <div className={`w-full h-full bg-gradient-to-br from-black via-[#0a0d14] to-[#04060a] text-white flex flex-col p-4 sm:p-6 md:p-8 font-sans select-none overflow-hidden ${
      isGiantFont ? 'kiosk-giant-font' : ''
    }`}>
      {/* HEADER: Back Button to Hub + Title + Club Logo Pill + Audio + Zoom */}
      <header className="flex items-center justify-between border-b-2 border-[#C8A451]/40 pb-4 mb-4">
        {/* Back Button */}
        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Returning to robot hub.");
            onNavigate('hub');
          }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/85 hover:bg-[#702815] border-2 border-[#C8A451]/60 text-slate-100 hover:text-white transition-all shadow-xl active:scale-95 text-base sm:text-lg font-black"
        >
          <ArrowLeft className="w-6 h-6 text-[#C8A451]" />
          <span>Back to Hub</span>
        </button>

        {/* Center: Robotics Club Branding */}
        <div className="flex items-center gap-3 text-center">
          <img
            src="/robotics-club-logo.jpg"
            alt="Robotics Club SSU"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#C8A451] shadow-[0_0_20px_rgba(200,164,81,0.5)] object-cover"
          />
          <div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-wide">
                SRI SRI ROBOTICS CLUB
              </span>
              <span className="text-xs sm:text-sm font-mono px-3 py-1 rounded-full bg-[#702815] border border-[#C8A451] text-[#C8A451] font-black">
                KIOSK ROBOT
              </span>
            </div>
            <p className="text-xs sm:text-base text-[#C8A451] font-mono font-bold mt-0.5">
              Sri Sri University • "Learn, Lead, Serve" • Cuttack, Odisha
            </p>
          </div>
        </div>

        {/* Right Actions: Font Zoom + Story Audio */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Font Size Toggle for Tablet Kiosk Distance */}
          <button
            onClick={() => setIsGiantFont(!isGiantFont)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 transition-all text-xs sm:text-sm font-black shadow-lg ${
              isGiantFont
                ? 'bg-[#C8A451] text-black border-white'
                : 'bg-black/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle Giant Kiosk Font Mode for Tablet Viewing"
          >
            {isGiantFont ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            <span className="hidden sm:inline">{isGiantFont ? 'Text: Huge' : 'Text: Normal'}</span>
          </button>

          <button
            onClick={activeTab === 'club-story' ? handleSpeakClubInfo : handleSpeakStory}
            className={`p-3.5 rounded-2xl border-2 transition-all shadow-xl ${
              isSpeaking
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 animate-pulse'
                : 'bg-black/80 border-[#C8A451]/60 text-[#C8A451] hover:text-white'
            }`}
            title="Listen to Story Aloud"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* TOP NAVIGATION TABS (Enlarged for Tablet Touch) */}
      <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-2xl bg-black/80 border-2 border-slate-800 mb-4 overflow-x-auto">
        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Showing Sri Sri University Robotics Club story and college background.");
            setActiveTab('club-story');
          }}
          className={`flex-1 py-3 px-4 rounded-xl transition-all font-black text-sm sm:text-lg flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'club-story'
              ? 'bg-gradient-to-r from-[#702815] to-[#C8A451] text-white shadow-xl scale-102 border border-white/40'
              : 'text-slate-300 hover:text-white bg-black/40'
          }`}
        >
          <Sparkles className="w-5 h-5 text-[#C8A451]" />
          <span>Club Story & College Info</span>
        </button>

        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Showing our core robotics club team members and creators.");
            setActiveTab('who-made');
          }}
          className={`flex-1 py-3 px-4 rounded-xl transition-all font-black text-sm sm:text-lg flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'who-made'
              ? 'bg-[#C8A451] text-black shadow-xl scale-102 border border-white/40'
              : 'text-slate-300 hover:text-white bg-black/40'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span>Who Made (Members)</span>
        </button>

        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Showing how I was engineered across three tiers.");
            setActiveTab('how-made');
          }}
          className={`flex-1 py-3 px-4 rounded-xl transition-all font-black text-sm sm:text-lg flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'how-made'
              ? 'bg-[#00f3ff] text-black shadow-xl scale-102 border border-white/40'
              : 'text-slate-300 hover:text-white bg-black/40'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>How Made (3 Tiers)</span>
        </button>

        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Showing robot hardware specifications and live telemetry.");
            setActiveTab('specs');
          }}
          className={`flex-1 py-3 px-4 rounded-xl transition-all font-black text-sm sm:text-lg flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'specs'
              ? 'bg-indigo-500 text-white shadow-xl scale-102 border border-white/40'
              : 'text-slate-300 hover:text-white bg-black/40'
          }`}
        >
          <Cpu className="w-5 h-5" />
          <span>Specs & Telemetry</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ROBOTICS CLUB STORY & BASIC COLLEGE INFO           */}
      {/* ======================================================== */}
      {activeTab === 'club-story' && (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-1">
          {/* Main Hero Card featuring the Official Club Logo */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2a0e07] via-black to-[#081219] border-2 border-[#C8A451] shadow-2xl flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            {/* The Official Club Logo (User Uploaded) */}
            <div className="relative flex-shrink-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-[#C8A451] via-[#e5c158] to-[#702815] shadow-[0_0_40px_rgba(200,164,81,0.6)]">
                <img
                  src="/robotics-club-logo.jpg"
                  alt="Sri Sri University Robotics Club Official Logo"
                  className="w-full h-full object-cover rounded-full border-2 border-black"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black/90 border border-[#C8A451] text-[11px] sm:text-xs font-mono text-[#C8A451] font-black uppercase whitespace-nowrap shadow-lg">
                Official Club Emblem
              </div>
            </div>

            {/* Club Headline & Mission */}
            <div className="space-y-3 text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#702815] border border-[#C8A451] text-[#C8A451] text-xs sm:text-sm font-mono uppercase tracking-widest font-black">
                <Sparkles className="w-4 h-4" />
                <span>Made by Sri Sri Robotics Club</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                Sri Sri University Robotics Club
              </h2>
              <p className="text-base sm:text-xl text-slate-100 font-medium leading-relaxed">
                Kiosk was designed, assembled, and programmed by the passionate student engineers and tech innovators of the <strong className="text-[#C8A451]">Sri Sri University Robotics Club</strong>. We are a community of student creators bringing mobile robots, autonomous AI, and embedded hardware to life.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={handleSpeakClubInfo}
                  className="px-6 py-3.5 rounded-2xl bg-[#C8A451] hover:bg-[#d6b464] text-black font-black text-sm sm:text-base flex items-center gap-2.5 shadow-xl transition-all active:scale-95"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Hear Club Story Aloud</span>
                </button>
                <div className="px-5 py-3 rounded-2xl bg-black/80 border border-[#C8A451]/50 text-xs sm:text-sm font-mono text-[#C8A451] font-bold">
                  SSU Maker Space • Cuttack, Odisha
                </div>
              </div>
            </div>
          </div>

          {/* Club Pillars & What We Build */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div
              onClick={() => {
                if (onSpeakText) onSpeakText("Autonomous Mobile Robotics: Designing rovers and humanoids with differential drive motors, LiDAR SLAM, and ROS 2 obstacle avoidance.");
              }}
              className="p-6 rounded-3xl bg-slate-950/90 border-2 border-slate-800 hover:border-[#C8A451] transition-all shadow-xl space-y-3 cursor-pointer active:scale-98"
              title="Tap to listen"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#702815] text-[#C8A451] flex items-center justify-center font-black">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Autonomous Mobile Robotics</h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                Designing rovers and humanoids with differential drive motors, LiDAR SLAM, real-time ROS 2 obstacle avoidance, and camera vision.
              </p>
            </div>

            <div
              onClick={() => {
                if (onSpeakText) onSpeakText("Embedded Systems and AI: Programming Arduino microcontrollers, NVIDIA Jetson edge computers, and browser voice interfaces with natural intelligence.");
              }}
              className="p-6 rounded-3xl bg-slate-950/90 border-2 border-slate-800 hover:border-[#00f3ff] transition-all shadow-xl space-y-3 cursor-pointer active:scale-98"
              title="Tap to listen"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-[#00f3ff] flex items-center justify-center font-black">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Embedded Systems & AI</h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                Programming Arduino microcontrollers, NVIDIA Jetson edge computers, and browser voice interfaces with natural language intelligence.
              </p>
            </div>

            <div
              onClick={() => {
                if (onSpeakText) onSpeakText("Student Competitions and Demos: Representing Sri Sri University at national robotics championships, hackathons, and live campus exhibitions.");
              }}
              className="p-6 rounded-3xl bg-slate-950/90 border-2 border-slate-800 hover:border-emerald-500 transition-all shadow-xl space-y-3 cursor-pointer active:scale-98"
              title="Tap to listen"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-300 flex items-center justify-center font-black">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Student Competitions & Demos</h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                Representing Sri Sri University at national robotics championships, hackathons, technical symposiums, and live campus exhibitions.
              </p>
            </div>
          </div>

          {/* Basic College Information Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-black/85 border-2 border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span className="text-[#C8A451]">🏛️</span>
                <span>Basic College Information • Sri Sri University</span>
              </h3>
              <span className="text-xs sm:text-sm font-mono text-[#C8A451] font-bold">
                EST. 2009 • CUTTACK, ODISHA
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase block font-bold">Founder</span>
                <span className="text-base sm:text-lg font-black text-white">Gurudev Sri Sri Ravi Shankar</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase block font-bold">University Motto</span>
                <span className="text-base sm:text-lg font-black text-[#C8A451]">"Learn, Lead, Serve"</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase block font-bold">Campus Location</span>
                <span className="text-base sm:text-lg font-black text-white">Godi Sahi, Cuttack, Odisha</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase block font-bold">Official Website</span>
                <a
                  href="https://srisriuniversity.edu.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-base sm:text-lg font-black text-[#00f3ff] hover:underline block truncate"
                >
                  srisriuniversity.edu.in
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: WHO MADE KIOSK • ROBOTICS CLUB MEMBERS             */}
      {/* ======================================================== */}
      {activeTab === 'who-made' && (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-1">
          {/* Header Banner with Club Emblem */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#702815]/60 via-black to-slate-950 border-2 border-[#C8A451] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-5">
              <img
                src="/robotics-club-logo.jpg"
                alt="SSU Robotics Club"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#C8A451] shadow-xl flex-shrink-0"
              />
              <div className="space-y-1">
                <span className="text-xs sm:text-sm font-mono text-[#C8A451] uppercase font-black tracking-widest">
                  Sri Sri University Robotics Club
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  Meet the Creators of Kiosk
                </h2>
                <p className="text-sm sm:text-base text-slate-200 font-medium">
                  Designed, wired, coded, and tested by our core club engineers.
                </p>
              </div>
            </div>

            <div className="px-5 py-2.5 rounded-2xl bg-black/80 border-2 border-[#C8A451] text-xs sm:text-sm font-mono text-[#C8A451] font-black whitespace-nowrap shadow-xl">
              SSU Robotics Club Cohort
            </div>
          </div>

          {/* Members Cards Grid (Extra Large Fonts for Easy Reading) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ROBOT_INFO.teamMembers.map((member: TeamMember) => (
              <div
                key={member.id}
                onClick={() => {
                  if (onSpeakText) onSpeakText(`${member.name}, ${member.role}. Key contributions include: ${member.contributions.join(', ')}`);
                }}
                className="p-6 sm:p-7 rounded-3xl bg-slate-950/95 border-2 border-slate-800 hover:border-[#C8A451] transition-all shadow-2xl space-y-4 cursor-pointer active:scale-98"
                title="Tap to hear member contributions"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#702815] to-[#C8A451] text-black font-black text-xl flex items-center justify-center shadow-xl border-2 border-[#C8A451]">
                      {member.avatarInitial}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">{member.name}</h3>
                      <p className="text-sm sm:text-base text-[#C8A451] font-mono font-black">{member.role}</p>
                      <p className="text-xs sm:text-sm text-slate-300 font-semibold">{member.department}</p>
                    </div>
                  </div>

                  {member.badge && (
                    <span className="text-xs sm:text-sm font-mono px-3 py-1.5 rounded-full bg-[#702815] border border-[#C8A451] text-[#C8A451] font-black">
                      {member.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <span className="text-xs sm:text-sm font-mono text-slate-400 uppercase tracking-wider block font-bold">
                    Key Contributions & Engineering:
                  </span>
                  <ul className="space-y-2 text-sm sm:text-base text-slate-200 font-medium">
                    {member.contributions.map((c, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#C8A451] flex-shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Faculty Mentor & Institutional Support */}
          <div className="p-6 rounded-3xl bg-black/85 border-2 border-slate-800 space-y-4 shadow-xl">
            <h4 className="text-base sm:text-lg font-black text-[#C8A451] uppercase tracking-wider font-mono">
              Robotics Club Advisors & Mentorship
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
              {ROBOT_INFO.institutionalSupport.advisors.map((adv, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 font-bold flex items-center gap-3">
                  <Award className="w-5 h-5 text-[#C8A451] flex-shrink-0" />
                  <span>{adv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: HOW MADE (3-TIER ARCHITECTURE)                     */}
      {/* ======================================================== */}
      {activeTab === 'how-made' && (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-1">
          {/* Engineering Blueprint Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-black to-slate-950 border-2 border-[#00f3ff]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-mono text-[#00f3ff] uppercase font-black tracking-widest">
                Club Engineering Blueprint
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                3-Tier Hardware & Software Architecture
              </h2>
              <p className="text-base sm:text-xl text-slate-200 max-w-3xl leading-relaxed font-medium">
                The Sri Sri Robotics Club engineered Kiosk with three distinct processing tiers for zero-latency UI response, robust ROS 2 navigation, and failsafe motor protection.
              </p>
            </div>

            <button
              onClick={handleSpeakStory}
              className="px-6 py-4 rounded-2xl bg-[#00f3ff] hover:bg-cyan-300 text-black font-black text-base sm:text-lg flex items-center gap-2.5 shadow-xl transition-all active:scale-95 whitespace-nowrap"
            >
              <Volume2 className="w-6 h-6" />
              <span>Hear Architecture Story</span>
            </button>
          </div>

          {/* The 3 Tiers Detailed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ROBOT_INFO.architectureTiers.map((tier: HardwareTier) => (
              <div
                key={tier.tierNumber}
                onClick={() => {
                  if (onSpeakText) onSpeakText(`Tier ${tier.tierNumber}: ${tier.name}, running on ${tier.hardware}. Responsibilities include: ${tier.responsibilities.join(', ')}`);
                }}
                className="p-6 sm:p-7 rounded-3xl bg-slate-950/95 border-2 border-slate-800 hover:border-[#00f3ff] transition-all flex flex-col justify-between shadow-2xl space-y-4 cursor-pointer active:scale-98"
                title="Tap to hear tier responsibilities"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs sm:text-sm font-mono px-3.5 py-1.5 rounded-full bg-cyan-950 text-[#00f3ff] font-black border border-[#00f3ff]/50">
                      TIER {tier.tierNumber}
                    </span>
                    <span className="text-xs sm:text-sm font-mono px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-black">
                      {tier.status}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5">{tier.name}</h3>
                  <div className="text-sm sm:text-base font-mono text-[#C8A451] font-bold mb-4">{tier.hardware}</div>

                  <div className="space-y-2">
                    <span className="text-xs sm:text-sm font-mono text-slate-400 uppercase tracking-wider block font-bold">
                      Core Responsibilities:
                    </span>
                    <ul className="space-y-2 text-sm sm:text-base text-slate-200 font-medium">
                      {tier.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#00f3ff] flex-shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/80 border border-slate-800 text-xs sm:text-sm font-mono text-slate-300">
                  <span className="text-[#00f3ff] font-bold block mb-1">Specifications:</span>
                  <span>{tier.specs}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Safety Watchdog Protocol */}
          <div className="p-6 rounded-3xl bg-black/80 border-2 border-slate-800 space-y-3 shadow-xl">
            <h4 className="text-base sm:text-lg font-black text-[#C8A451] uppercase tracking-wider font-mono">
              Failsafe Safety Watchdog Protocol
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-mono">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-xs font-bold uppercase mb-1">Heartbeat Timer</span>
                <span className="text-[#00f3ff] font-black text-lg">300ms Watchdog</span>
                <p className="text-xs text-slate-300 mt-1 font-sans">Arduino halts PWM output if serial packet drops for &gt;300ms.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-xs font-bold uppercase mb-1">Obstacle Sensor</span>
                <span className="text-emerald-400 font-black text-lg">12m 2D LiDAR</span>
                <p className="text-xs text-slate-300 mt-1 font-sans">Real-time 10Hz costmap updates with dynamic obstacle deceleration.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-xs font-bold uppercase mb-1">Physical Hardware</span>
                <span className="text-red-400 font-black text-lg">E-Stop Relay</span>
                <p className="text-xs text-slate-300 mt-1 font-sans">Hardware power cut switch breaking motor battery supply instantly.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: SPECS & TELEMETRY                                  */}
      {/* ======================================================== */}
      {activeTab === 'specs' && (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-1">
          {/* Telemetry Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-black/85 border-2 border-slate-800 text-center font-mono shadow-2xl">
              <span className="text-xs sm:text-sm text-slate-400 block uppercase font-bold mb-1">Network IP</span>
              <span className="text-2xl sm:text-3xl font-black text-[#00f3ff]">{ROBOT_INFO.networkIp}</span>
            </div>
            <div className="p-5 sm:p-6 rounded-3xl bg-black/85 border-2 border-slate-800 text-center font-mono shadow-2xl">
              <span className="text-xs sm:text-sm text-slate-400 block uppercase font-bold mb-1">Battery Status</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">{ROBOT_INFO.batteryLevel}% (LiFePO4)</span>
            </div>
            <div className="p-5 sm:p-6 rounded-3xl bg-black/85 border-2 border-slate-800 text-center font-mono shadow-2xl">
              <span className="text-xs sm:text-sm text-slate-400 block uppercase font-bold mb-1">Continuous Uptime</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400">{ROBOT_INFO.uptimeHours} Hours</span>
            </div>
            <div className="p-5 sm:p-6 rounded-3xl bg-black/85 border-2 border-slate-800 text-center font-mono shadow-2xl">
              <span className="text-xs sm:text-sm text-slate-400 block uppercase font-bold mb-1">Robot Health</span>
              <span className="text-2xl sm:text-3xl font-black text-[#C8A451]">{ROBOT_INFO.status}</span>
            </div>
          </div>

          {/* Full Specifications Table */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/95 border-2 border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-mono">
              Complete Hardware & Mechanical Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              {ROBOT_INFO.specifications.map((spec, i) => (
                <div key={i} className="p-4 sm:p-5 rounded-2xl bg-black/75 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs sm:text-sm font-mono text-slate-400 uppercase block font-bold mb-0.5">{spec.label}</span>
                    <span className="font-black text-white text-base sm:text-lg">{spec.value}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-mono text-[#00f3ff] font-bold text-right max-w-[200px] truncate">
                    {spec.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
