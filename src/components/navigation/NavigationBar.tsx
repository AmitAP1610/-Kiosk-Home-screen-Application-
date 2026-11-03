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
      description: 'Animated procedural eyes with voice intro',
      icon: Smile,
      category: 'SSU Campus',
      badge: 'Screen 1'
    },
    {
      id: 'hub',
      title: '2. Campus Robot Hub',
      description: 'Main kiosk menu with 3 service modules',
      icon: LayoutGrid,
      category: 'SSU Campus',
      badge: 'Screen 2'
    },
    {
      id: 'robo-info',
      title: 'Robo Info (Club Story & Tech)',
      description: 'Robotics Club story, projects & 3-tier tech',
      icon: Bot,
      category: 'SSU Campus',
      badge: 'Module 1'
    },
    {
      id: 'map-info',
      title: 'Campus Highlights & Facilities',
      description: 'Library, Hospital, Dining & Maker Lab photo guides',
      icon: Compass,
      category: 'SSU Campus',
      badge: 'Module 2'
    },
    {
      id: 'sessions-agenda',
      title: 'Sessions / Agenda',
      description: 'Timetable, photos & conference schedules',
      icon: Calendar,
      category: 'SSU Campus',
      badge: 'Module 3'
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
      category: 'Robotics & Hardware'
    },
    {
      id: 'control',
      title: 'Robot Teleoperation',
      description: 'Virtual joystick & motion safety',
      icon: Compass,
      category: 'Robotics & Hardware'
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
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-out Drawer: Charcoal Body (#30343B) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 sm:w-96 bg-[#30343B] text-white border-r border-[#B0B4B8]/30 z-50 transform transition-transform duration-200 ease-in-out flex flex-col shadow-modal ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header: Rubber Black (#202124) */}
        <div className="p-4 border-b border-[#B0B4B8]/30 bg-[#202124] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/robotics-club-logo.jpg"
              alt="SSU Robotics Club Emblem"
              className="w-9 h-9 rounded-full border border-[#B0B4B8]/40 object-cover"
            />
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-wide">
                SRI SRI UNIVERSITY
              </h2>
              <p className="text-[11px] text-[#B0B4B8] font-mono">
                AI Campus Navigator • Kiosk Robot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md bg-[#30343B] hover:bg-[#202124] text-[#B0B4B8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Screen List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
          {/* Section 1: SSU Campus */}
          <div>
            <span className="px-2 text-[10px] font-mono text-[#D49A36] uppercase tracking-wider font-bold block mb-1">
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
                    className={`w-full p-2.5 rounded-lg text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-[#D49A36] text-[#202124] shadow-sm font-bold'
                        : 'hover:bg-[#202124] text-white/90 hover:text-white border border-transparent'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-md ${
                        isSelected ? 'bg-[#202124] text-[#D49A36]' : 'bg-[#202124] text-[#B0B4B8]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{screen.title}</span>
                        {screen.badge && (
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                            isSelected ? 'bg-[#202124] text-[#D49A36]' : 'bg-[#202124] text-[#B0B4B8] border border-[#B0B4B8]/30'
                          }`}>
                            {screen.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-[#202124]/80' : 'text-[#B0B4B8]'}`}>
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
            <span className="px-2 text-[10px] font-mono text-[#D49A36] uppercase tracking-wider font-bold block mb-1">
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
                    className={`w-full p-2.5 rounded-lg text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-[#D49A36] text-[#202124] shadow-sm font-bold'
                        : 'hover:bg-[#202124] text-white/90 hover:text-white border border-transparent'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-md ${
                        isSelected ? 'bg-[#202124] text-[#D49A36]' : 'bg-[#202124] text-[#B0B4B8]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{screen.title}</span>
                        {screen.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#202124] text-[#B0B4B8] border border-[#B0B4B8]/30">
                            {screen.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-[#202124]/80' : 'text-[#B0B4B8]'}`}>
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
        <div className="p-3.5 border-t border-[#B0B4B8]/30 bg-[#202124] font-mono text-[11px] text-[#B0B4B8] space-y-1.5">
          <div className="flex items-center justify-between">
            <span>Tablet Audio Engine:</span>
            <span className="text-white font-bold">Online</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Jetson Robotics Link:</span>
            <span className={systemStatus.jetsonConnected ? 'text-white font-bold' : 'text-[#B0B4B8]'}>
              {systemStatus.jetsonConnected ? 'Connected' : 'Standalone'}
            </span>
          </div>
          <div className="pt-1 text-center">
            <a
              href="https://srisriuniversity.edu.in"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-[#D49A36] text-[10px] inline-flex items-center gap-1 transition-colors"
            >
              <span>srisriuniversity.edu.in</span>
              <ExternalLink className="w-2.5 h-2.5 text-[#D49A36]" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
