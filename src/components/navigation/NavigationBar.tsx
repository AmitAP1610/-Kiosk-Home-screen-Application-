import React, { useState } from 'react';
import { AppScreen, SystemStatus } from '../../types/robot';
import {
  Smile,
  Sparkles,
  MessageSquare,
  Building2,
  Camera,
  Compass,
  Radar,
  Navigation,
  Activity,
  Wrench,
  Settings,
  X,
  LayoutGrid,
  Bot,
  Calendar,
  Images,
  GraduationCap,
  Sliders,
  ChevronRight
} from 'lucide-react';

export type NavGroup = 'ALL' | 'HOME' | 'UNIVERSITY' | 'CAMPUS' | 'ROBOT' | 'ASSISTANT' | 'SETTINGS';

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
  const [selectedGroup, setSelectedGroup] = useState<NavGroup>('ALL');

  interface ScreenItem {
    id: AppScreen;
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    group: 'HOME' | 'UNIVERSITY' | 'CAMPUS' | 'ROBOT' | 'ASSISTANT' | 'SETTINGS';
    badge?: string;
  }

  const screens: ScreenItem[] = [
    // ================= 1. HOME =================
    {
      id: 'hub',
      title: 'Campus Robot Hub',
      description: 'Central tablet dashboard & service modules',
      icon: LayoutGrid,
      group: 'HOME',
      badge: 'Main'
    },
    {
      id: 'gallery',
      title: 'University Photo Gallery',
      description: '21 authentic campus photographs & slideshow',
      icon: Images,
      group: 'HOME',
      badge: 'Photos'
    },
    {
      id: 'welcome',
      title: 'SSU Welcome Portal',
      description: 'University motto, greeting & audio introduction',
      icon: Sparkles,
      group: 'HOME',
      badge: 'SSU'
    },

    // ================= 2. UNIVERSITY =================
    {
      id: 'university-info',
      title: 'University Information',
      description: '11 Academic faculties, vision, mission & admissions',
      icon: GraduationCap,
      group: 'UNIVERSITY',
      badge: '11 Faculties'
    },
    {
      id: 'map-info',
      title: 'Campus Highlights',
      description: 'Shruti Library, Hospital, Dining & Maker Lab photo guides',
      icon: Compass,
      group: 'UNIVERSITY',
      badge: 'Destinations'
    },
    {
      id: 'facilities',
      title: 'Campus Facilities & Guidance',
      description: 'Academic blocks, 100-bed hospital, hostels & amenities',
      icon: Building2,
      group: 'UNIVERSITY'
    },
    {
      id: 'sessions-agenda',
      title: 'Sessions & Events Agenda',
      description: 'Daily timetables, convocations & robotics workshops',
      icon: Calendar,
      group: 'UNIVERSITY',
      badge: 'Timetables'
    },
    {
      id: 'robo-info',
      title: 'Robo Info & Club Story',
      description: 'Sri Sri Robotics Club story, Maker Space & 3-tier tech',
      icon: Bot,
      group: 'UNIVERSITY',
      badge: 'Engineering'
    },

    // ================= 3. CAMPUS =================
    {
      id: 'navigation',
      title: 'Autonomous Navigation',
      description: 'Interactive campus map, waypoints & path planning (Nav2)',
      icon: Navigation,
      group: 'CAMPUS',
      badge: 'Waypoints'
    },

    // ================= 4. ROBOT =================
    {
      id: 'face',
      title: 'Robot Face (Digital Eyes)',
      description: 'Interactive procedural eyes & expressions',
      icon: Smile,
      group: 'ROBOT',
      badge: 'Face'
    },
    {
      id: 'camera',
      title: 'Tablet Computer Vision',
      description: 'Front & rear camera feed with person detection',
      icon: Camera,
      group: 'ROBOT',
      badge: 'Vision'
    },
    {
      id: 'control',
      title: 'Robot Teleoperation',
      description: 'Manual drive virtual D-pad & Emergency Stop',
      icon: Sliders,
      group: 'ROBOT',
      badge: 'Motors'
    },
    {
      id: 'mapping',
      title: 'LiDAR 2D Mapping',
      description: 'Real-time 2D laser sweep & distance rings',
      icon: Radar,
      group: 'ROBOT',
      badge: systemStatus.lidarConnected ? 'Online' : 'Offline'
    },
    {
      id: 'monitor',
      title: 'System Telemetry & Health',
      description: 'Jetson, Arduino, BMS battery & hardware diagnostics',
      icon: Activity,
      group: 'ROBOT',
      badge: systemStatus.jetsonConnected ? 'Connected' : 'Standalone'
    },

    // ================= 5. ASSISTANT =================
    {
      id: 'assistant',
      title: 'AI Voice & Chat Assistant',
      description: 'Voice speech-to-text, baritone TTS & campus Q&A',
      icon: MessageSquare,
      group: 'ASSISTANT',
      badge: 'Voice AI'
    },
    {
      id: 'diagnostics',
      title: 'Voice & Speech Diagnostics',
      description: 'Microphone permissions, STT testing & synthesis audit',
      icon: Wrench,
      group: 'ASSISTANT',
      badge: 'Audit'
    },

    // ================= 6. SETTINGS =================
    {
      id: 'settings',
      title: 'System Configuration',
      description: 'Voice selection, AI keys & hardware WebSocket IP',
      icon: Settings,
      group: 'SETTINGS'
    }
  ];

  const groupTabs: Array<{ id: NavGroup; label: string }> = [
    { id: 'ALL', label: 'All' },
    { id: 'HOME', label: 'Home' },
    { id: 'UNIVERSITY', label: 'University' },
    { id: 'CAMPUS', label: 'Campus' },
    { id: 'ROBOT', label: 'Robot' },
    { id: 'ASSISTANT', label: 'Assistant' },
    { id: 'SETTINGS', label: 'Settings' }
  ];

  const filteredScreens = selectedGroup === 'ALL'
    ? screens
    : screens.filter((s) => s.group === selectedGroup);

  return (
    <>
      {/* Dimmed backdrop when drawer is open */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-out Drawer: Navy Blue Structural Drawer (#263746) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 sm:w-[420px] bg-[#263746] text-white border-r border-white/10 z-50 transform transition-transform duration-200 ease-in-out flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* ======================================================== */}
        {/* DRAWER HEADER: Charcoal (#30343B)                       */}
        {/* ======================================================== */}
        <div className="p-4 border-b border-white/10 bg-[#30343B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/robotics-club-logo.jpg"
              alt="SSU Robotics Club Emblem"
              className="w-10 h-10 rounded-full border border-white/20 object-cover"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Sri Sri University
                </h2>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#C49A45] text-white font-semibold uppercase">
                  KIOSK
                </span>
              </div>
              <p className="text-[11px] text-[#E9EDF2]/70 font-mono">
                Complete Campus Application Navigation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-[#263746] hover:bg-[#202124] text-[#E9EDF2] hover:text-white flex items-center justify-center transition-colors border border-white/10"
            title="Close Navigation Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* CATEGORY FILTER TABS                                     */}
        {/* ======================================================== */}
        <div className="px-3 py-2 bg-[#202124] border-b border-white/10 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
          {groupTabs.map((tab) => {
            const isSelected = selectedGroup === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedGroup(tab.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#C49A45] text-white shadow-xs font-bold'
                    : 'bg-[#30343B] text-[#E9EDF2]/70 hover:text-white hover:bg-[#30343B]/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* NAVIGATION LIST (Grouped by Category)                   */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredScreens.map((screen) => {
            const Icon = screen.icon;
            const isCurrent = currentScreen === screen.id;

            return (
              <button
                key={screen.id}
                onClick={() => {
                  onSelectScreen(screen.id);
                  onClose();
                }}
                className={`w-full p-3 min-h-[52px] rounded-xl text-left transition-all flex items-center justify-between border active:scale-98 ${
                  isCurrent
                    ? 'bg-[#30343B] border-[#C49A45] text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-[#E9EDF2]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      isCurrent
                        ? 'bg-[#C49A45] text-white border-[#C49A45]'
                        : 'bg-[#30343B] text-[#E9EDF2] border-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate text-white">
                        {screen.title}
                      </span>
                      {screen.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                            isCurrent
                              ? 'bg-[#C49A45] text-white'
                              : 'bg-white/10 text-[#E9EDF2]/80'
                          }`}
                        >
                          {screen.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#E9EDF2]/70 truncate mt-0.5 font-normal">
                      {screen.description}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 ml-2 ${
                    isCurrent ? 'text-[#C49A45]' : 'text-white/30'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* DRAWER FOOTER                                            */}
        {/* ======================================================== */}
        <div className="p-3 bg-[#202124] border-t border-white/10 flex items-center justify-between text-xs text-[#E9EDF2]/70 font-mono shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C49A45] animate-pulse" />
            <span>Sri Sri Robotics Club</span>
          </div>
          <span>Active: {currentScreen}</span>
        </div>
      </aside>
    </>
  );
};
