import React, { useState } from 'react';
import { AppScreen } from '../types/robot';
import { ROBOT_INFO, HardwareTier } from '../data/robotInfoData';
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
  ZoomOut,
  ShieldCheck
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
  const [activeTab, setActiveTab] = useState<'club-story' | 'how-made'>('club-story');
  const [isGiantFont, setIsGiantFont] = useState<boolean>(true);

  const handleSpeakStory = () => {
    if (onSpeakText) {
      onSpeakText(ROBOT_INFO.audioStory);
    }
  };

  const handleSpeakClubInfo = () => {
    if (onSpeakText) {
      onSpeakText(
        "Kiosk was engineered and built with passion by the student innovators of the Sri Sri University Robotics Club. Our club unites student roboticists, software architects, and makers to turn advanced AI into real autonomous mobile machines. Learn about our club story and 3-tier architecture below!"
      );
    }
  };

  return (
    <div className={`w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-4 sm:p-5 md:p-6 font-sans select-none overflow-hidden relative ${
      isGiantFont ? 'kiosk-giant-font' : ''
    }`}>
      {/* HEADER: Navy Blue Header Bar (#263746) */}
      <header className="relative z-10 flex items-center justify-between bg-[#263746] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-white/10 shadow-sm mb-3">
        {/* Back Button to Hub */}
        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Returning to robot hub.");
            onNavigate('hub');
          }}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all shadow-sm active:scale-98 text-xs sm:text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
          <span>Back to Hub</span>
        </button>

        {/* Center: Robotics Club Branding */}
        <div className="flex items-center gap-3 text-center">
          <img
            src="/robotics-club-logo.jpg"
            alt="Robotics Club SSU"
            className="w-10 h-10 rounded-full border border-white/20 object-cover"
          />
          <div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                Sri Sri Robotics Club
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#C49A45] text-white font-semibold uppercase tracking-wider">
                KIOSK TECH
              </span>
            </div>
            <p className="text-[12px] text-[#E9EDF2]/80 mt-0.5">
              Sri Sri University • Learn, Lead, Serve • Cuttack, Odisha
            </p>
          </div>
        </div>

        {/* Right Actions: Font Zoom + Story Audio */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGiantFont(!isGiantFont)}
            className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-lg border transition-all text-xs font-semibold ${
              isGiantFont
                ? 'bg-[#C49A45] text-white border-[#C49A45]'
                : 'bg-[#30343B] border-white/10 text-[#E9EDF2] hover:text-white'
            }`}
            title="Toggle Font Size Mode"
          >
            {isGiantFont ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isGiantFont ? 'Large Text' : 'Standard'}</span>
          </button>

          <button
            onClick={activeTab === 'club-story' ? handleSpeakClubInfo : handleSpeakStory}
            className={`p-2.5 min-h-[44px] min-w-[44px] rounded-lg border flex items-center justify-center transition-all ${
              isSpeaking
                ? 'bg-[#C49A45] border-[#C49A45] text-white'
                : 'bg-[#30343B] border-white/10 text-white hover:bg-[#202124]'
            }`}
            title="Listen to Description Aloud"
          >
            <Volume2 className="w-4 h-4 text-[#E9EDF2]" />
          </button>
        </div>
      </header>

      {/* TOP NAVIGATION TABS */}
      <div className="relative z-10 flex items-center gap-2 p-1 rounded-xl bg-white border border-[#E9EDF2] shadow-sm mb-3">
        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Showing Sri Sri University Robotics Club story and college background.");
            setActiveTab('club-story');
          }}
          className={`flex-1 py-2 px-3 min-h-[44px] rounded-lg transition-all font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 ${
            activeTab === 'club-story'
              ? 'bg-[#263746] text-white shadow-sm'
              : 'text-[#606B76] hover:text-[#30343B] bg-transparent'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${activeTab === 'club-story' ? 'text-[#C49A45]' : 'text-[#606B76]'}`} />
          <span>Club Story & College Information</span>
        </button>

        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Showing how Kiosk was engineered across three tiers.");
            setActiveTab('how-made');
          }}
          className={`flex-1 py-2 px-3 min-h-[44px] rounded-lg transition-all font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 ${
            activeTab === 'how-made'
              ? 'bg-[#263746] text-white shadow-sm'
              : 'text-[#606B76] hover:text-[#30343B] bg-transparent'
          }`}
        >
          <Layers className={`w-4 h-4 ${activeTab === 'how-made' ? 'text-[#C49A45]' : 'text-[#606B76]'}`} />
          <span>How Kiosk Was Engineered (3 Tiers)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ROBOTICS CLUB STORY & BASIC COLLEGE INFO           */}
      {/* ======================================================== */}
      {activeTab === 'club-story' && (
        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-1">
          {/* Main Hero Card: White (#FFFFFF) Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] shadow-sm flex flex-col md:flex-row items-center gap-6">
            {/* The Official Club Logo */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-[#E9EDF2] border border-[#D8DFE8]">
                <img
                  src="/robotics-club-logo.jpg"
                  alt="Sri Sri University Robotics Club Official Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-[#263746] text-[10px] font-mono text-white font-bold uppercase whitespace-nowrap shadow-sm">
                Club Emblem
              </div>
            </div>

            {/* Club Headline & Mission */}
            <div className="space-y-1.5 text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E9EDF2] text-[#263746] text-xs font-medium">
                <Sparkles className="w-3 h-3 text-[#C49A45]" />
                <span>Made by Sri Sri Robotics Club</span>
              </div>
              <h1 className="text-[26px] sm:text-[30px] font-bold text-[#30343B] leading-tight">
                Sri Sri University Robotics Club
              </h1>
              <p className="text-[15px] text-[#606B76] font-normal leading-relaxed">
                Kiosk was designed, assembled, and programmed by the passionate student engineers and makers of the <strong className="text-[#30343B] font-semibold">Sri Sri University Robotics Club</strong>. We are a community of student creators bringing mobile robots, autonomous AI, and embedded hardware to life.
              </p>
              <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <button
                  onClick={handleSpeakClubInfo}
                  className="px-4 py-2 min-h-[44px] rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm active:scale-98"
                >
                  <Volume2 className="w-4 h-4 text-[#C49A45]" />
                  <span>Hear Club Story Aloud</span>
                </button>
                <div className="px-3.5 py-2 min-h-[44px] rounded-lg bg-[#E9EDF2] text-xs font-medium text-[#606B76] flex items-center">
                  SSU Maker Space • Cuttack, Odisha
                </div>
              </div>
            </div>
          </div>

          {/* Authentic Campus Maker Space Photo Banner */}
          <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden border border-[#D8DFE8] shadow-sm">
            <img
              src="/images/gallery/laboratory-practical-3.jpg"
              alt="Robotics Club Laboratory & Maker Space"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
              <div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#C49A45] text-white font-bold uppercase tracking-wider inline-block mb-1">
                  Research & Prototyping Lab
                </span>
                <h3 className="text-white text-base sm:text-lg font-bold">
                  SSU Robotics Club Innovation & Prototyping Facility
                </h3>
              </div>
            </div>
          </div>

          {/* Club Pillars & What We Build: White Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div
              onClick={() => {
                if (onSpeakText) onSpeakText("Autonomous Mobile Robotics: Designing rovers and humanoids with differential drive motors, LiDAR SLAM, and ROS 2 obstacle avoidance.");
              }}
              className="p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] hover:border-[#263746] transition-all cursor-pointer active:scale-98 space-y-2 shadow-sm"
              title="Tap to listen"
            >
              <div className="w-10 h-10 rounded-lg bg-[#E9EDF2] text-[#263746] border border-[#D8DFE8] flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-[#263746]" strokeWidth={1.75} />
              </div>
              <h3 className="text-[18px] font-semibold text-[#30343B]">Autonomous Mobile Robotics</h3>
              <p className="text-[14px] text-[#606B76] leading-relaxed">
                Designing rovers and mobile kiosks with differential drive motors, LiDAR SLAM, real-time ROS 2 obstacle avoidance, and camera vision.
              </p>
            </div>

            <div
              onClick={() => {
                if (onSpeakText) onSpeakText("Embedded Systems and AI: Programming Arduino microcontrollers, NVIDIA Jetson edge computers, and browser voice interfaces with natural intelligence.");
              }}
              className="p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] hover:border-[#263746] transition-all cursor-pointer active:scale-98 space-y-2 shadow-sm"
              title="Tap to listen"
            >
              <div className="w-10 h-10 rounded-lg bg-[#E9EDF2] text-[#263746] border border-[#D8DFE8] flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5 text-[#263746]" strokeWidth={1.75} />
              </div>
              <h3 className="text-[18px] font-semibold text-[#30343B]">Embedded Systems & AI</h3>
              <p className="text-[14px] text-[#606B76] leading-relaxed">
                Programming Arduino microcontrollers, NVIDIA Jetson edge computers, and browser voice interfaces with natural language intelligence.
              </p>
            </div>

            <div
              onClick={() => {
                if (onSpeakText) onSpeakText("Student Competitions and Demos: Representing Sri Sri University at national robotics championships, hackathons, and live campus exhibitions.");
              }}
              className="p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] hover:border-[#263746] transition-all cursor-pointer active:scale-98 space-y-2 shadow-sm"
              title="Tap to listen"
            >
              <div className="w-10 h-10 rounded-lg bg-[#E9EDF2] text-[#263746] border border-[#D8DFE8] flex items-center justify-center font-bold">
                <Award className="w-5 h-5 text-[#263746]" strokeWidth={1.75} />
              </div>
              <h3 className="text-[18px] font-semibold text-[#30343B]">Student Competitions & Demos</h3>
              <p className="text-[14px] text-[#606B76] leading-relaxed">
                Representing Sri Sri University at national robotics championships, hackathons, technical symposiums, and live campus exhibitions.
              </p>
            </div>
          </div>

          {/* Basic College Information Card: White Card */}
          <div className="p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E9EDF2] pb-2">
              <h2 className="text-[20px] font-semibold text-[#30343B] flex items-center gap-2">
                <span>College Information • Sri Sri University</span>
              </h2>
              <span className="text-[13px] font-mono text-[#606B76]">
                EST. 2009 • CUTTACK, ODISHA
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#E9EDF2]/60 border border-[#D8DFE8]">
                <span className="text-[12px] text-[#606B76] uppercase block font-semibold">Founder</span>
                <span className="text-[15px] font-medium text-[#30343B]">Gurudev Sri Sri Ravi Shankar</span>
              </div>
              <div className="p-3 rounded-lg bg-[#E9EDF2]/60 border border-[#D8DFE8]">
                <span className="text-[12px] text-[#606B76] uppercase block font-semibold">University Motto</span>
                <span className="text-[15px] font-medium text-[#263746]">"Learn, Lead, Serve"</span>
              </div>
              <div className="p-3 rounded-lg bg-[#E9EDF2]/60 border border-[#D8DFE8]">
                <span className="text-[12px] text-[#606B76] uppercase block font-semibold">Campus Location</span>
                <span className="text-[15px] font-medium text-[#30343B]">Godi Sahi, Cuttack, Odisha</span>
              </div>
              <div className="p-3 rounded-lg bg-[#E9EDF2]/60 border border-[#D8DFE8]">
                <span className="text-[12px] text-[#606B76] uppercase block font-semibold">Official Website</span>
                <a
                  href="https://srisriuniversity.edu.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[15px] font-medium text-[#263746] hover:underline block truncate"
                >
                  srisriuniversity.edu.in
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: HOW MADE (3-TIER ARCHITECTURE)                     */}
      {/* ======================================================== */}
      {activeTab === 'how-made' && (
        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-1">
          {/* Engineering Blueprint Banner: White Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[12px] font-mono text-[#C49A45] uppercase font-semibold tracking-wider">
                Engineering Blueprint
              </span>
              <h2 className="text-[22px] font-semibold text-[#30343B]">
                3-Tier Hardware & Software Architecture
              </h2>
              <p className="text-[14px] text-[#606B76] max-w-3xl leading-relaxed">
                The Sri Sri Robotics Club engineered Kiosk with three distinct processing tiers for zero-latency UI response, robust ROS 2 navigation, and failsafe motor protection.
              </p>
            </div>

            <button
              onClick={handleSpeakStory}
              className="px-5 py-2.5 min-h-[44px] rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-98 whitespace-nowrap"
            >
              <Volume2 className="w-4 h-4 text-[#C49A45]" />
              <span>Hear Architecture Story</span>
            </button>
          </div>

          {/* The 3 Tiers Detailed Cards: White Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {ROBOT_INFO.architectureTiers.map((tier: HardwareTier) => (
              <div
                key={tier.tierNumber}
                onClick={() => {
                  if (onSpeakText) onSpeakText(`Tier ${tier.tierNumber}: ${tier.name}, running on ${tier.hardware}. Responsibilities include: ${tier.responsibilities.join(', ')}`);
                }}
                className="p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] hover:border-[#263746] transition-all flex flex-col justify-between shadow-sm space-y-3.5 cursor-pointer active:scale-98"
                title="Tap to hear tier responsibilities"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#263746] text-white font-semibold">
                      TIER {tier.tierNumber}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#E9EDF2] text-[#263746] font-medium">
                      {tier.status}
                    </span>
                  </div>

                  <h3 className="text-[18px] font-semibold text-[#30343B] mb-0.5">{tier.name}</h3>
                  <div className="text-[13px] text-[#606B76] mb-3">{tier.hardware}</div>

                  <div className="space-y-1.5">
                    <span className="text-[12px] text-[#30343B] uppercase tracking-wider block font-semibold">
                      Core Responsibilities:
                    </span>
                    <ul className="space-y-1.5 text-[14px] text-[#606B76]">
                      {tier.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#C49A45] flex-shrink-0 mt-0.5" strokeWidth={2} />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Dark Component for Hardware Specs */}
                <div className="p-3 rounded-lg bg-[#30343B] border border-white/10 text-[13px] font-mono text-[#E9EDF2]/90">
                  <span className="text-white font-semibold block mb-0.5">Specifications:</span>
                  <span>{tier.specs}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Safety Watchdog Protocol: White Card */}
          <div className="p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] space-y-3 shadow-sm">
            <h3 className="text-[18px] font-semibold text-[#30343B] flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-[#263746]" strokeWidth={1.75} />
              <span>Failsafe Safety Watchdog Protocol</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-lg bg-[#30343B] border border-white/10">
                <span className="text-[#E9EDF2]/70 block text-[11px] font-medium uppercase mb-0.5">Heartbeat Timer</span>
                <span className="text-white font-bold text-sm">300ms Watchdog</span>
                <p className="text-[12px] text-[#E9EDF2]/80 mt-1 font-sans">Arduino halts PWM output if serial packet drops for &gt;300ms.</p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#30343B] border border-white/10">
                <span className="text-[#E9EDF2]/70 block text-[11px] font-medium uppercase mb-0.5">Obstacle Sensor</span>
                <span className="text-white font-bold text-sm">12m 2D LiDAR</span>
                <p className="text-[12px] text-[#E9EDF2]/80 mt-1 font-sans">Real-time 10Hz costmap updates with dynamic obstacle deceleration.</p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#30343B] border border-white/10">
                <span className="text-[#E9EDF2]/70 block text-[11px] font-medium uppercase mb-0.5">Physical Hardware</span>
                <span className="text-[#C49A45] font-bold text-sm">E-Stop Relay</span>
                <p className="text-[12px] text-[#E9EDF2]/80 mt-1 font-sans">Hardware power cut switch breaking motor battery supply instantly.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
