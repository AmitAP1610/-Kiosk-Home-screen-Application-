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
    <div className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-4 sm:p-5 md:p-6 font-sans select-none overflow-hidden">
      {/* Header: Navy Blue Structural Bar (#263746) */}
      <div className="flex items-center justify-between pb-3 bg-[#263746] text-white p-3.5 rounded-xl mb-4 border border-white/10 shadow-sm">
        <div className="flex items-center gap-2.5">
          {onNavigate && (
            <button
              onClick={() => onNavigate('hub')}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all text-xs font-semibold mr-1"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
              <span>Back to Hub</span>
            </button>
          )}

          <div className="p-2 rounded-lg bg-[#30343B] border border-white/10 text-[#C49A45]">
            <Navigation className="w-5 h-5 text-[#C49A45]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight">Autonomous Navigation</h1>
            <p className="text-[12px] text-[#E9EDF2]/80 font-mono">Jetson Nav2 Path Planner & Obstacle Avoidance</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold ${
            navActive
              ? 'bg-[#C49A45] border-[#C49A45] text-white'
              : 'bg-[#30343B] border-white/10 text-[#E9EDF2]/70'
          }`}>
            {navActive ? 'NAVIGATING...' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 py-2 min-h-0">
        {/* Navigation Map Visualizer Area: Dark Component #202124 */}
        <div className="flex-1 bg-[#202124] rounded-xl border border-[#30343B] p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
          <div className="w-full max-w-md p-6 rounded-xl bg-white border border-[#E9EDF2] font-mono text-xs space-y-4 shadow-sm text-[#30343B]">
            <div className="flex items-center justify-between border-b border-[#E9EDF2] pb-3">
              <span className="text-[#606B76]">Current Destination:</span>
              <span className="font-bold text-[#30343B] text-sm">{selectedTarget}</span>
            </div>

            <div className="flex items-center justify-between border-b border-[#E9EDF2] pb-3">
              <span className="text-[#606B76]">Path Status:</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Optimal Clear Route
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#E9EDF2] pb-3">
              <span className="text-[#606B76]">Obstacle Distance (LiDAR):</span>
              <span className="text-[#30343B] font-semibold">2.4 meters (Safe)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#606B76]">ETA:</span>
              <span className="text-[#30343B] font-bold">{navActive ? '18 seconds' : '--'}</span>
            </div>
          </div>
        </div>

        {/* Destination Waypoint Selector Sidebar: White Card */}
        <div className="w-full md:w-80 bg-white text-[#30343B] border border-[#E9EDF2] rounded-xl p-4 flex flex-col gap-4 font-mono text-xs shadow-sm">
          <div>
            <h3 className="font-bold text-[#30343B] uppercase tracking-wider mb-2 text-xs">Saved Waypoints</h3>
            <div className="space-y-2">
              {waypoints.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => setSelectedTarget(wp.name)}
                  className={`w-full p-3 min-h-[44px] rounded-lg border text-left flex items-center justify-between transition-all ${
                    selectedTarget === wp.name
                      ? 'border-[#263746] bg-[#263746] text-white font-semibold shadow-sm'
                      : 'border-[#E9EDF2] bg-white text-[#30343B] hover:border-[#263746]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${selectedTarget === wp.name ? 'text-[#C49A45]' : 'text-[#263746]'}`} strokeWidth={1.75} />
                    <span className="font-medium">{wp.name}</span>
                  </div>
                  <span className={`text-[11px] ${selectedTarget === wp.name ? 'text-white/80' : 'text-[#606B76]'}`}>
                    {wp.coords}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-2 pt-2 border-t border-[#E9EDF2]">
            {navActive ? (
              <button
                onClick={handleStopNav}
                className="w-full min-h-[44px] py-2.5 rounded-lg bg-[#B42318] hover:bg-red-800 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <StopCircle className="w-4 h-4" />
                CANCEL NAVIGATION
              </button>
            ) : (
              <button
                onClick={handleStartNav}
                className="w-full min-h-[44px] py-2.5 rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
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
