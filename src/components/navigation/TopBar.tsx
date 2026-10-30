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

  return (
    <header className="absolute top-0 left-0 right-0 h-12 z-30 flex items-center justify-between px-3 md:px-5 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-sm pointer-events-auto select-none font-mono text-xs text-slate-300">
      {/* Left: Menu & Screen Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenMenu}
          title="Open Application Menu"
          className="p-1.5 rounded-lg bg-ssu-card/90 border border-ssu-border hover:border-ssu-gold/60 text-slate-200 hover:text-ssu-gold transition-colors flex items-center gap-1.5 shadow"
        >
          <Menu className="w-4 h-4 text-ssu-gold" />
          <span className="font-semibold text-xs text-white hidden sm:inline">MENU</span>
        </button>

        {currentScreen !== 'face' && (
          <button
            onClick={() => onSelectScreen('face')}
            title="Return to Robot Face (Home)"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/25 transition-colors font-medium text-xs shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden md:inline">FACE</span>
          </button>
        )}

        {currentScreen !== 'welcome' && (
          <button
            onClick={() => onSelectScreen('welcome')}
            title="Sri Sri University Welcome Experience"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ssu-maroon/60 border border-ssu-gold/50 text-ssu-gold hover:bg-ssu-maroon transition-colors font-medium text-xs shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">SSU WELCOME</span>
          </button>
        )}

        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-ssu-border">
          <span className="font-bold text-white tracking-wide">{getScreenName(currentScreen)}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-ssu-maroon/40 border border-ssu-gold/30 text-ssu-gold font-bold">
            SRI SRI UNIVERSITY
          </span>
        </div>
      </div>

      {/* Right: Architecture Hardware Indicators & Kiosk Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Jetson Robotics Status */}
        <div
          title={systemStatus.jetsonConnected ? 'Jetson Robotics: Connected' : 'Jetson Robotics: Disconnected'}
          className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] ${
            systemStatus.jetsonConnected
              ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30'
              : 'border-slate-800 text-slate-500 bg-black/40'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden md:inline">JETSON:</span>
          <span>{systemStatus.jetsonConnected ? 'ON' : 'OFF'}</span>
        </div>

        {/* Arduino Motor Status */}
        <div
          title={systemStatus.arduinoConnected ? 'Arduino Motors: Ready' : 'Arduino Motors: Offline'}
          className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] ${
            systemStatus.arduinoConnected
              ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30'
              : 'border-slate-800 text-slate-500 bg-black/40'
          }`}
        >
          <Wifi className="w-3.5 h-3.5" />
          <span className="hidden md:inline">ARDUINO:</span>
          <span>{systemStatus.arduinoConnected ? 'ON' : 'OFF'}</span>
        </div>

        {/* Tablet Battery Status */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-md border border-slate-800 text-slate-300 bg-black/40 text-[11px]">
          {systemStatus.isTabletCharging ? (
            <BatteryCharging className="w-3.5 h-3.5 text-ssu-gold" />
          ) : (
            <Battery className="w-3.5 h-3.5 text-slate-300" />
          )}
          <span>{systemStatus.tabletBattery}%</span>
        </div>

        {/* Tablet Fullscreen Kiosk Mode Toggle */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Kiosk Fullscreen'}
          className="p-1.5 rounded-lg bg-ssu-card/90 border border-ssu-border hover:border-ssu-gold/60 text-slate-300 hover:text-white transition-colors"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
