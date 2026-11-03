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
    <div className={`w-full h-full bg-[#F2F2EF] text-[#30343B] flex flex-col p-3 sm:p-5 md:p-6 font-sans select-none overflow-hidden relative ${
      isGiantFont ? 'kiosk-giant-font' : ''
    }`}>
      {/* HEADER: Sidebar & Primary Elements (#30343B) */}
      <header className="relative z-10 flex items-center justify-between bg-[#30343B] text-white px-4 sm:px-6 py-3 rounded-xl border border-[#B0B4B8]/30 shadow-subtle mb-3">
        {/* Back Button to Hub */}
        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Returning to robot hub.");
            onNavigate('hub');
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#202124] hover:bg-[#1A1B1D] border border-[#B0B4B8]/40 text-white transition-all shadow-sm active:scale-98 text-xs sm:text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-[#D49A36]" />
          <span>Back to Hub</span>
        </button>

        {/* Center: Robotics Club Branding */}
        <div className="flex items-center gap-3 text-center">
          <img
            src="/robotics-club-logo.jpg"
            alt="Robotics Club SSU"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#B0B4B8]/50 object-cover"
          />
          <div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm sm:text-lg md:text-xl font-extrabold text-white tracking-wide">
                SRI SRI ROBOTICS CLUB
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D49A36] text-[#202124] font-bold uppercase">
                KIOSK ROBOT
              </span>
            </div>
            <p className="text-[11px] text-[#B0B4B8] font-mono mt-0.5">
              Sri Sri University • "Learn, Lead, Serve" • Cuttack, Odisha
            </p>
          </div>
        </div>

        {/* Right Actions: Font Zoom + Story Audio */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGiantFont(!isGiantFont)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold ${
              isGiantFont
                ? 'bg-[#D49A36] text-[#202124] border-[#D49A36]'
                : 'bg-[#202124] border-[#B0B4B8]/40 text-[#B0B4B8] hover:text-white'
            }`}
            title="Toggle Font Size Mode"
          >
            {isGiantFont ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isGiantFont ? 'Large Text' : 'Standard'}</span>
          </button>

          <button
            onClick={activeTab === 'club-story' ? handleSpeakClubInfo : handleSpeakStory}
            className={`p-2 rounded-lg border transition-all ${
              isSpeaking
                ? 'bg-[#D49A36] border-white text-[#202124]'
                : 'bg-[#202124] border-[#B0B4B8]/40 text-white hover:bg-[#1A1B1D]'
            }`}
            title="Listen to Description Aloud"
          >
            <Volume2 className="w-4 h-4 text-[#D49A36]" />
          </button>
        </div>
      </header>

      {/* TOP NAVIGATION TABS */}
      <div className="relative z-10 flex items-center gap-2.5 p-1 rounded-xl bg-[#30343B] border border-[#B0B4B8]/30 mb-3">
        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Showing Sri Sri University Robotics Club story and college background.");
            setActiveTab('club-story');
          }}
          className={`flex-1 py-2.5 px-3 rounded-lg transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-2 ${
            activeTab === 'club-story'
              ? 'bg-[#D49A36] text-[#202124] shadow-sm'
              : 'text-[#B0B4B8] hover:text-white bg-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Club Story & College Information</span>
        </button>

        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Showing how Kiosk was engineered across three tiers.");
            setActiveTab('how-made');
          }}
          className={`flex-1 py-2.5 px-3 rounded-lg transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-2 ${
            activeTab === 'how-made'
              ? 'bg-[#D49A36] text-[#202124] shadow-sm'
              : 'text-[#B0B4B8] hover:text-white bg-transparent'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>How Kiosk Was Engineered (3 Tiers)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ROBOTICS CLUB STORY & BASIC COLLEGE INFO           */}
      {/* ======================================================== */}
      {activeTab === 'club-story' && (
        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-1">
          {/* Main Hero Card: White (#FFFFFF) Card with Dark Text */}
          <div className="p-6 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 shadow-card flex flex-col md:flex-row items-center gap-6">
            {/* The Official Club Logo */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-[#F2F2EF] border border-[#B0B4B8]/50">
                <img
                  src="/robotics-club-logo.jpg"
                  alt="Sri Sri University Robotics Club Official Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-[#D49A36] text-[10px] font-mono text-[#202124] font-extrabold uppercase whitespace-nowrap shadow-sm">
                Club Emblem
              </div>
            </div>

            {/* Club Headline & Mission */}
            <div className="space-y-2.5 text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#F2F2EF] border border-[#B0B4B8]/50 text-[#30343B] text-xs font-mono uppercase font-bold">
                <Sparkles className="w-3 h-3 text-[#D49A36]" />
                <span>Made by Sri Sri Robotics Club</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#30343B] leading-tight">
                Sri Sri University Robotics Club
              </h2>
              <p className="text-xs sm:text-sm text-[#5F666D] font-medium leading-relaxed">
                Kiosk was designed, assembled, and programmed by the passionate student engineers and makers of the <strong className="text-[#30343B]">Sri Sri University Robotics Club</strong>. We are a community of student creators bringing mobile robots, autonomous AI, and embedded hardware to life.
              </p>
              <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <button
                  onClick={handleSpeakClubInfo}
                  className="px-4 py-2 rounded-lg bg-[#30343B] hover:bg-[#202124] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm active:scale-98"
                >
                  <Volume2 className="w-4 h-4 text-[#D49A36]" />
                  <span>Hear Club Story Aloud</span>
                </button>
                <div className="px-3.5 py-2 rounded-lg bg-[#F2F2EF] border border-[#B0B4B8]/40 text-xs font-mono text-[#5F666D]">
                  SSU Maker Space • Cuttack, Odisha
                </div>
              </div>
            </div>
          </div>

          {/* Club Pillars & What We Build: White Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div
              onClick={() => {
                if (onSpeakText) onSpeakText("Autonomous Mobile Robotics: Designing rovers and humanoids with differential drive motors, LiDAR SLAM, and ROS 2 obstacle avoidance.");
              }}
              className="p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 hover:border-[#D49A36] transition-all cursor-pointer active:scale-98 space-y-2 shadow-subtle"
              title="Tap to listen"
            >
              <div className="w-10 h-10 rounded-lg bg-[#F2F2EF] text-[#30343B] border border-[#B0B4B8]/40 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-[#D49A36]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#30343B]">Autonomous Mobile Robotics</h3>
              <p className="text-xs sm:text-sm text-[#5F666D] leading-relaxed">
                Designing rovers and humanoids with differential drive motors, LiDAR SLAM, real-time ROS 2 obstacle avoidance, and camera vision.
              </p>
            </div>

            <div
              onClick={() => {
                if (onSpeakText) onSpeakText("Embedded Systems and AI: Programming Arduino microcontrollers, NVIDIA Jetson edge computers, and browser voice interfaces with natural intelligence.");
              }}
              className="p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 hover:border-[#D49A36] transition-all cursor-pointer active:scale-98 space-y-2 shadow-subtle"
              title="Tap to listen"
            >
              <div className="w-10 h-10 rounded-lg bg-[#F2F2EF] text-[#30343B] border border-[#B0B4B8]/40 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5 text-[#D49A36]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#30343B]">Embedded Systems & AI</h3>
              <p className="text-xs sm:text-sm text-[#5F666D] leading-relaxed">
                Programming Arduino microcontrollers, NVIDIA Jetson edge computers, and browser voice interfaces with natural language intelligence.
              </p>
            </div>

            <div
              onClick={() => {
                if (onSpeakText) onSpeakText("Student Competitions and Demos: Representing Sri Sri University at national robotics championships, hackathons, and live campus exhibitions.");
              }}
              className="p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 hover:border-[#D49A36] transition-all cursor-pointer active:scale-98 space-y-2 shadow-subtle"
              title="Tap to listen"
            >
              <div className="w-10 h-10 rounded-lg bg-[#F2F2EF] text-[#30343B] border border-[#B0B4B8]/40 flex items-center justify-center font-bold">
                <Award className="w-5 h-5 text-[#D49A36]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#30343B]">Student Competitions & Demos</h3>
              <p className="text-xs sm:text-sm text-[#5F666D] leading-relaxed">
                Representing Sri Sri University at national robotics championships, hackathons, technical symposiums, and live campus exhibitions.
              </p>
            </div>
          </div>

          {/* Basic College Information Card: White Card */}
          <div className="p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 space-y-3 shadow-subtle">
            <div className="flex items-center justify-between border-b border-[#B0B4B8]/30 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-[#30343B] flex items-center gap-2">
                <span>Basic College Information • Sri Sri University</span>
              </h3>
              <span className="text-xs font-mono text-[#5F666D]">
                EST. 2009 • CUTTACK, ODISHA
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#F2F2EF] border border-[#B0B4B8]/40">
                <span className="text-[10px] font-mono text-[#5F666D] uppercase block font-semibold">Founder</span>
                <span className="text-xs sm:text-sm font-bold text-[#30343B]">Gurudev Sri Sri Ravi Shankar</span>
              </div>
              <div className="p-3 rounded-lg bg-[#F2F2EF] border border-[#B0B4B8]/40">
                <span className="text-[10px] font-mono text-[#5F666D] uppercase block font-semibold">University Motto</span>
                <span className="text-xs sm:text-sm font-bold text-[#D49A36]">"Learn, Lead, Serve"</span>
              </div>
              <div className="p-3 rounded-lg bg-[#F2F2EF] border border-[#B0B4B8]/40">
                <span className="text-[10px] font-mono text-[#5F666D] uppercase block font-semibold">Campus Location</span>
                <span className="text-xs sm:text-sm font-bold text-[#30343B]">Godi Sahi, Cuttack, Odisha</span>
              </div>
              <div className="p-3 rounded-lg bg-[#F2F2EF] border border-[#B0B4B8]/40">
                <span className="text-[10px] font-mono text-[#5F666D] uppercase block font-semibold">Official Website</span>
                <a
                  href="https://srisriuniversity.edu.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm font-bold text-[#30343B] hover:text-[#D49A36] block truncate"
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
          <div className="p-5 sm:p-6 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-card">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#D49A36] uppercase font-bold tracking-wider">
                Engineering Blueprint
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#30343B]">
                3-Tier Hardware & Software Architecture
              </h2>
              <p className="text-xs sm:text-sm text-[#5F666D] max-w-3xl leading-relaxed">
                The Sri Sri Robotics Club engineered Kiosk with three distinct processing tiers for zero-latency UI response, robust ROS 2 navigation, and failsafe motor protection.
              </p>
            </div>

            <button
              onClick={handleSpeakStory}
              className="px-5 py-2.5 rounded-lg bg-[#30343B] hover:bg-[#202124] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-98 whitespace-nowrap"
            >
              <Volume2 className="w-4 h-4 text-[#D49A36]" />
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
                className="p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 hover:border-[#D49A36] transition-all flex flex-col justify-between shadow-subtle space-y-3.5 cursor-pointer active:scale-98"
                title="Tap to hear tier responsibilities"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D49A36] text-[#202124] font-bold">
                      TIER {tier.tierNumber}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2F2EF] text-[#30343B] border border-[#B0B4B8]/40 font-semibold">
                      {tier.status}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#30343B] mb-1">{tier.name}</h3>
                  <div className="text-xs font-mono text-[#5F666D] mb-3">{tier.hardware}</div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-[#30343B] uppercase tracking-wider block font-bold">
                      Core Responsibilities:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#5F666D]">
                      {tier.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D49A36] flex-shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Dark Component for Hardware Specs */}
                <div className="p-3 rounded-lg bg-[#202124] border border-[#B0B4B8]/30 text-xs font-mono text-[#B0B4B8]">
                  <span className="text-white font-semibold block mb-0.5">Specifications:</span>
                  <span>{tier.specs}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Safety Watchdog Protocol: White Card */}
          <div className="p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 space-y-3 shadow-subtle">
            <h4 className="text-xs sm:text-sm font-bold text-[#30343B] uppercase tracking-wider font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D49A36]" />
              <span>Failsafe Safety Watchdog Protocol</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#202124] border border-[#B0B4B8]/30">
                <span className="text-[#B0B4B8] block text-[10px] font-semibold uppercase mb-0.5">Heartbeat Timer</span>
                <span className="text-white font-bold text-sm">300ms Watchdog</span>
                <p className="text-[11px] text-[#B0B4B8] mt-0.5 font-sans">Arduino halts PWM output if serial packet drops for &gt;300ms.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#202124] border border-[#B0B4B8]/30">
                <span className="text-[#B0B4B8] block text-[10px] font-semibold uppercase mb-0.5">Obstacle Sensor</span>
                <span className="text-white font-bold text-sm">12m 2D LiDAR</span>
                <p className="text-[11px] text-[#B0B4B8] mt-0.5 font-sans">Real-time 10Hz costmap updates with dynamic obstacle deceleration.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#202124] border border-[#B0B4B8]/30">
                <span className="text-[#B0B4B8] block text-[10px] font-semibold uppercase mb-0.5">Physical Hardware</span>
                <span className="text-[#D49A36] font-bold text-sm">E-Stop Relay</span>
                <p className="text-[11px] text-[#B0B4B8] mt-0.5 font-sans">Hardware power cut switch breaking motor battery supply instantly.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
