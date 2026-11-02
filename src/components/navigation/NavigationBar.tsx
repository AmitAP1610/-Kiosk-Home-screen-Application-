import React from 'react';
import { AppScreen, SystemStatus } from '../../types/robot';
import {
  Smile,
  Sparkles,
  MessageSquare,
  BookOpen,
  Building2,
  Camera,
  Compass,
  Radar,
  Navigation,
  Activity,
  Wrench,
  Settings,
  X,
  ExternalLink,
  LayoutGrid,
  Bot,
  MapPin,
  Calendar
} from 'lucide-react';

interface NavigationBarProps {
  currentScreen: AppScreen;
  onSelectScreen: (screen: AppScreen) => void;
  isOpen: boolean;
  onClose: () => void;
  systemStatus: SystemStatus;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentScreen,
  onSelectScreen,
  isOpen,
  onClose,
  systemStatus
}) => {
  const screens: Array<{
    id: AppScreen;
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    category: 'SSU Campus' | 'Robotics & Hardware';
    badge?: string;
  }> = [
    {
      id: 'face',
      title: '1. Robot Face (Home)',
      description: 'Animated cyan eyes with voice intro',
      icon: Smile,
      category: 'SSU Campus',
      badge: 'Box 1'
    },
    {
      id: 'hub',
      title: '2. Campus Robot Hub',
      description: 'Tablet main menu with 3 circular modules',
      icon: LayoutGrid,
      category: 'SSU Campus',
      badge: 'Box 2'
    },
    {
      id: 'robo-info',
      title: 'Robo Info (How & Who Made)',
      description: 'Architecture, specs & team members',
      icon: Bot,
      category: 'SSU Campus',
      badge: 'Circle 1'
    },
    {
      id: 'map-info',
      title: 'Map & SSU Info',
      description: '188-acre campus map & basic information',
      icon: MapPin,
      category: 'SSU Campus',
      badge: 'Circle 2'
    },
    {
      id: 'sessions-agenda',
      title: 'Sessions / Agenda',
      description: 'Conferences, workshops & campus events',
      icon: Calendar,
      category: 'SSU Campus',
      badge: 'Circle 3'
    },
    {
      id: 'welcome',
      title: 'SSU Welcome Experience',
      description: 'Campus motto, official logo & greeting',
      icon: Sparkles,
      category: 'SSU Campus',
      badge: 'SSU'
    },
    {
      id: 'assistant',
      title: 'AI Campus Assistant',
      description: 'Bilingual voice Q&A, speech-to-text & TTS',
      icon: MessageSquare,
      category: 'SSU Campus',
      badge: 'Voice AI'
    },
    {
      id: 'university-info',
      title: 'University Information',
      description: '11 Faculties, programmes, vision & history',
      icon: BookOpen,
      category: 'SSU Campus'
    },
    {
      id: 'facilities',
      title: 'Campus Facilities & Guidance',
      description: 'Library, 100+ Bed Hospital, Hostels & Mess',
      icon: Building2,
      category: 'SSU Campus'
    },
    {
      id: 'diagnostics',
      title: 'Voice & Speech Diagnostics',
      description: 'STT & TTS hardware audit & mic tests',
      icon: Wrench,
      category: 'SSU Campus',
      badge: 'Audit'
    },
    {
      id: 'camera',
      title: 'Tablet Computer Vision',
      description: 'Live camera & person/object detection',
      icon: Camera,
      category: 'Robotics & Hardware',
      badge: systemStatus.cameraActive ? 'Active' : undefined
    },
    {
      id: 'control',
      title: 'Robot Teleoperation',
      description: 'Virtual joystick & motion safety',
      icon: Compass,
      category: 'Robotics & Hardware',
      badge: systemStatus.motorEStop ? 'E-STOP' : undefined
    },
    {
      id: 'mapping',
      title: 'LiDAR & 2D Mapping',
      description: 'Live scan & occupancy grid (Jetson)',
      icon: Radar,
      category: 'Robotics & Hardware',
      badge: systemStatus.lidarConnected ? 'Online' : 'Offline'
    },
    {
      id: 'navigation',
      title: 'Autonomous Navigation',
      description: 'Waypoint goals & path planning (Nav2)',
      icon: Navigation,
      category: 'Robotics & Hardware'
    },
    {
      id: 'monitor',
      title: 'System Telemetry',
      description: 'Tablet, Jetson & Arduino telemetry',
      icon: Activity,
      category: 'Robotics & Hardware',
      badge: systemStatus.jetsonConnected ? 'Connected' : 'Standalone'
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Audio voices, AI API keys & hardware IP',
      icon: Settings,
      category: 'Robotics & Hardware'
    }
  ];

  return (
    <>
      {/* Dimmed backdrop when open */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-out Drawer from Left */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 sm:w-96 bg-ssu-surface border-r border-ssu-border z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-ssu-border bg-gradient-to-r from-ssu-maroonDark to-ssu-maroon flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-ssu-gold shadow flex items-center justify-center">
              <img
                src="/assets/ssu-logo.png"
                alt="SSU Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-wide">
                SRI SRI UNIVERSITY
              </h2>
              <p className="text-[11px] text-ssu-gold font-mono">
                AI Campus Navigator • 12 Screens
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Screen List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Section 1: SSU Campus */}
          <div>
            <span className="px-3 text-[10px] font-mono text-ssu-gold uppercase tracking-wider font-bold block mb-1.5">
              Sri Sri University Services
            </span>
            <div className="space-y-1">
              {screens.filter(s => s.category === 'SSU Campus').map((screen) => {
                const Icon = screen.icon;
                const isSelected = currentScreen === screen.id;
                return (
                  <button
                    key={screen.id}
                    onClick={() => {
                      onSelectScreen(screen.id);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-ssu-maroon border border-ssu-gold text-white shadow-md'
                        : 'hover:bg-ssu-card text-slate-300 hover:text-white border border-transparent'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-ssu-gold text-black' : 'bg-black/40 text-ssu-gold'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{screen.title}</span>
                        {screen.badge && (
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                            isSelected ? 'bg-ssu-gold text-black' : 'bg-ssu-maroon/50 text-ssu-gold border border-ssu-gold/30'
                          }`}>
                            {screen.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {screen.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Robotics & Hardware */}
          <div>
            <span className="px-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block mb-1.5">
              Robotics, Jetson & Arduino
            </span>
            <div className="space-y-1">
              {screens.filter(s => s.category === 'Robotics & Hardware').map((screen) => {
                const Icon = screen.icon;
                const isSelected = currentScreen === screen.id;
                return (
                  <button
                    key={screen.id}
                    onClick={() => {
                      onSelectScreen(screen.id);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-ssu-maroon border border-ssu-gold text-white shadow-md'
                        : 'hover:bg-ssu-card text-slate-300 hover:text-white border border-transparent'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-ssu-gold text-black' : 'bg-black/40 text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{screen.title}</span>
                        {screen.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-slate-300 border border-slate-700">
                            {screen.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {screen.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer with Hardware Telemetry */}
        <div className="p-4 border-t border-ssu-border bg-black/60 font-mono text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span>Tablet Audio Engine:</span>
            <span className="text-emerald-400 font-bold">Online</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Jetson Robotics Link:</span>
            <span className={systemStatus.jetsonConnected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              {systemStatus.jetsonConnected ? 'Connected' : 'Standalone'}
            </span>
          </div>
          <div className="pt-1 text-center">
            <a
              href="https://srisriuniversity.edu.in"
              target="_blank"
              rel="noreferrer"
              className="text-ssu-gold hover:underline text-[10px] inline-flex items-center gap-1"
            >
              <span>srisriuniversity.edu.in</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
