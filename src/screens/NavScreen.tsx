import React, { useState } from 'react';
import { Navigation, MapPin, Play, StopCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

interface NavScreenProps {
  onNavigate?: (screen: any) => void;
}

export const NavScreen: React.FC<NavScreenProps> = ({ onNavigate }) => {
  const [selectedTarget, setSelectedTarget] = useState<string>('Robotics Lab');
  const [navActive, setNavActive] = useState<boolean>(false);

  const waypoints = [
    { id: '1', name: 'Robotics Lab', coords: 'x: 3.4m, y: 1.2m' },
    { id: '2', name: 'Central Library', coords: 'x: -8.1m, y: 14.5m' },
    { id: '3', name: 'Ayurveda Hospital', coords: 'x: 22.0m, y: -4.3m' },
    { id: '4', name: 'Annapurna Mess', coords: 'x: -12.4m, y: -6.8m' }
  ];

  const handleStartNav = () => {
    setNavActive(true);
  };

  const handleStopNav = () => {
    setNavActive(false);
  };

  return (
    <div className="w-full h-full bg-[#FFFFFF] text-[#30343B] flex flex-col p-4 sm:p-6 font-sans select-none overflow-hidden">
      {/* Header: Industrial Primary Bar */}
      <div className="flex items-center justify-between pb-3 bg-[#30343B] text-white p-3.5 rounded-xl mb-4 border border-[#B0B4B8]/30 shadow-sm">
        <div className="flex items-center gap-2.5">
          {onNavigate && (
            <button
              onClick={() => onNavigate('hub')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#202124] hover:bg-[#17191C] border border-[#B0B4B8]/40 text-white transition-all text-xs font-bold mr-1"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#DCE8E1]" />
              <span>Back to Hub</span>
            </button>
          )}

          <div className="p-2 rounded-lg bg-[#202124] border border-[#B0B4B8]/30 text-[#DCE8E1]">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">AUTONOMOUS NAVIGATION</h1>
            <p className="text-[11px] text-[#B0B4B8] font-mono">Jetson Nav2 Path Planner & Obstacle Avoidance</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className={`px-2.5 py-1 rounded-md border text-[11px] font-bold ${
            navActive
              ? 'bg-[#174D3A] border-[#174D3A] text-white'
              : 'bg-[#202124] border-[#B0B4B8]/30 text-[#B0B4B8]'
          }`}>
            {navActive ? 'NAVIGATING...' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 py-2 min-h-0">
        {/* Navigation Map Visualizer Area: Dark Component #202124 */}
        <div className="flex-1 bg-[#202124] rounded-xl border border-[#B0B4B8]/40 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
          <div className="w-full max-w-md p-6 rounded-xl bg-[#FFFFFF] border border-[#B0B4B8]/60 font-mono text-xs space-y-4 shadow-sm text-[#30343B]">
            <div className="flex items-center justify-between border-b border-[#B0B4B8]/30 pb-3">
              <span className="text-[#5F666D]">Current Destination:</span>
              <span className="font-bold text-[#30343B] text-sm">{selectedTarget}</span>
            </div>

            <div className="flex items-center justify-between border-b border-[#B0B4B8]/30 pb-3">
              <span className="text-[#5F666D]">Path Status:</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Optimal Clear Route
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#B0B4B8]/30 pb-3">
              <span className="text-[#5F666D]">Obstacle Distance (LiDAR):</span>
              <span className="text-[#30343B] font-semibold">2.4 meters (Safe)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5F666D]">ETA:</span>
              <span className="text-[#30343B] font-bold">{navActive ? '18 seconds' : '--'}</span>
            </div>
          </div>
        </div>

        {/* Destination Waypoint Selector Sidebar: Crisp White Card */}
        <div className="w-full md:w-80 bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 rounded-xl p-4 flex flex-col gap-4 font-mono text-xs shadow-sm">
          <div>
            <h3 className="font-bold text-[#30343B] uppercase tracking-wider mb-2 text-xs">Saved Waypoints</h3>
            <div className="space-y-2">
              {waypoints.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => setSelectedTarget(wp.name)}
                  className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                    selectedTarget === wp.name
                      ? 'border-[#174D3A] bg-[#174D3A] text-white font-bold shadow-sm'
                      : 'border-[#B0B4B8]/40 bg-[#FFFFFF] text-[#30343B] hover:border-[#174D3A]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${selectedTarget === wp.name ? 'text-white' : 'text-[#174D3A]'}`} />
                    <span className="font-semibold">{wp.name}</span>
                  </div>
                  <span className={`text-[10px] ${selectedTarget === wp.name ? 'text-emerald-200 font-bold' : 'text-[#5F666D]'}`}>
                    {wp.coords}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-2 pt-2 border-t border-[#B0B4B8]/30">
            {navActive ? (
              <button
                onClick={handleStopNav}
                className="w-full py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <StopCircle className="w-4 h-4" />
                CANCEL NAVIGATION
              </button>
            ) : (
              <button
                onClick={handleStartNav}
                className="w-full py-2.5 rounded-lg bg-[#174D3A] hover:bg-[#134232] text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Play className="w-4 h-4 fill-current text-white" />
                START NAVIGATION
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
