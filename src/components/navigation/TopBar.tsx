import React from 'react';
import { AppScreen, SystemStatus } from '../../types/robot';
import { Menu, Home, Cpu, Wifi, BatteryCharging, Battery, Maximize, Minimize, Sparkles } from 'lucide-react';

interface TopBarProps {
  currentScreen: AppScreen;
  onSelectScreen: (screen: AppScreen) => void;
  onOpenMenu: () => void;
  systemStatus: SystemStatus;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  visible?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentScreen,
  onSelectScreen,
  onOpenMenu,
  systemStatus,
  isFullscreen,
  onToggleFullscreen,
  visible = true
}) => {
  if (!visible) return null;

  const getScreenName = (s: AppScreen) => {
    switch (s) {
      case 'face': return 'Robot Face';
      case 'hub': return 'Campus Robot Hub';
      case 'gallery': return 'Explore Our Campus Gallery';
      case 'map-info': return 'Campus Highlights & Facilities';
      case 'sessions-agenda': return 'Sessions & Agenda';
      case 'robo-info': return 'Robot Information';
      case 'welcome': return 'Sri Sri University Welcome';
      case 'assistant': return 'AI Campus Assistant';
      case 'university-info': return 'University Information';
      case 'facilities': return 'Campus Facilities';
      case 'camera': return 'Tablet Computer Vision';
      case 'control': return 'Robot Teleoperation';
      case 'mapping': return 'LiDAR Mapping';
      case 'navigation': return 'Autonomous Nav';
      case 'monitor': return 'System Monitor';
      case 'diagnostics': return 'Voice Diagnostics';
      case 'settings': return 'System Settings';
    }
  };

  const getScreenCategory = (s: AppScreen): string => {
    switch (s) {
      case 'welcome':
      case 'hub':
      case 'gallery':
        return 'HOME';
      case 'university-info':
      case 'map-info':
      case 'facilities':
      case 'sessions-agenda':
      case 'robo-info':
        return 'UNIVERSITY';
      case 'navigation':
        return 'CAMPUS';
      case 'face':
      case 'camera':
      case 'control':
      case 'mapping':
      case 'monitor':
        return 'ROBOT';
      case 'assistant':
      case 'diagnostics':
        return 'ASSISTANT';
      case 'settings':
        return 'SETTINGS';
      default:
        return 'KIOSK';
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 h-11 z-30 flex items-center justify-between px-3 md:px-5 bg-[#263746] text-white border-b border-white/10 pointer-events-auto select-none font-mono text-xs shadow-sm">
      {/* Left: Menu & Screen Title */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          onClick={onOpenMenu}
          title="Open Application Menu"
          className="px-2.5 py-1 rounded bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-colors flex items-center gap-1.5"
        >
          <Menu className="w-3.5 h-3.5 text-[#C49A45]" />
          <span className="font-semibold text-[11px] hidden sm:inline">MENU</span>
        </button>

        {currentScreen !== 'face' && (
          <button
            onClick={() => onSelectScreen('face')}
            title="Return to Robot Face (Home)"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-colors font-medium text-[11px]"
          >
            <Home className="w-3.5 h-3.5 text-[#E9EDF2]" />
            <span className="hidden md:inline">FACE</span>
          </button>
        )}

        {currentScreen !== 'welcome' && (
          <button
            onClick={() => onSelectScreen('welcome')}
            title="Sri Sri University Welcome Experience"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#30343B] hover:bg-[#202124] border border-white/10 text-[#E9EDF2]/70 hover:text-white transition-colors font-medium text-[11px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" />
            <span className="hidden md:inline">WELCOME</span>
          </button>
        )}

        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-white/10">
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#C49A45] text-white font-bold uppercase tracking-wider">
            {getScreenCategory(currentScreen)}
          </span>
          <span className="font-bold text-white tracking-wide text-xs">{getScreenName(currentScreen)}</span>
        </div>
      </div>

      {/* Right: Architecture Hardware Indicators & Kiosk Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Jetson Robotics Status */}
        <div
          title={systemStatus.jetsonConnected ? 'Jetson Robotics: Connected' : 'Jetson Robotics: Disconnected'}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#30343B] border border-white/10 text-[11px]"
        >
          <Cpu className="w-3 h-3 text-[#C49A45]" />
          <span className="hidden md:inline text-[#E9EDF2]/70">JETSON:</span>
          <span className={systemStatus.jetsonConnected ? 'text-white font-bold' : 'text-[#E9EDF2]/60'}>
            {systemStatus.jetsonConnected ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* Arduino Motor Status */}
        <div
          title={systemStatus.arduinoConnected ? 'Arduino Motors: Ready' : 'Arduino Motors: Offline'}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#30343B] border border-white/10 text-[11px]"
        >
          <Wifi className="w-3 h-3 text-[#C49A45]" />
          <span className="hidden md:inline text-[#E9EDF2]/70">ARDUINO:</span>
          <span className={systemStatus.arduinoConnected ? 'text-white font-bold' : 'text-[#E9EDF2]/60'}>
            {systemStatus.arduinoConnected ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* Tablet Battery Status */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#30343B] border border-white/10 text-[11px] text-white">
          {systemStatus.isTabletCharging ? (
            <BatteryCharging className="w-3 h-3 text-[#C49A45]" />
          ) : (
            <Battery className="w-3 h-3 text-[#E9EDF2]" />
          )}
          <span>{systemStatus.tabletBattery}%</span>
        </div>

        {/* Tablet Fullscreen Kiosk Mode Toggle */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Kiosk Fullscreen'}
          className="p-1 rounded bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-colors"
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5 text-[#E9EDF2]" />}
        </button>
      </div>
    </header>
  );
};
