import React, { useState } from 'react';
import { Navigation, MapPin, StopCircle, Play, CheckCircle2 } from 'lucide-react';

interface NavScreenProps {
  onStopNav?: () => void;
  isNavigating?: boolean;
}

export const NavScreen: React.FC<NavScreenProps> = ({
  onStopNav,
  isNavigating = false
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string>('Charging Dock');
  const [navActive, setNavActive] = useState<boolean>(isNavigating);

  const waypoints = [
    { id: 'dock', name: 'Charging Dock', coords: 'x: 0.0m, y: 0.0m' },
    { id: 'desk', name: 'Work Desk', coords: 'x: 3.4m, y: 1.2m' },
    { id: 'door', name: 'Main Entrance', coords: 'x: 6.8m, y: -0.5m' },
    { id: 'kitchen', name: 'Kitchen Counter', coords: 'x: 2.1m, y: -4.3m' },
  ];

  const handleStartNav = () => {
    setNavActive(true);
  };

  const handleStopNav = () => {
    setNavActive(false);
    if (onStopNav) onStopNav();
  };

  return (
    <div className="w-full h-full bg-black text-slate-100 flex flex-col pt-14 pb-4 px-3 sm:px-6 md:px-10 font-sans select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">AUTONOMOUS NAVIGATION</h1>
            <p className="text-xs text-slate-400 font-mono">Jetson Nav2 Path Planner & Obstacle Avoidance</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold ${
            navActive
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            {navActive ? 'NAVIGATING...' : 'READY'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 py-4 min-h-0">
        {/* Navigation Map Visualizer Area */}
        <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full max-w-md p-6 rounded-2xl bg-black/60 border border-slate-800/80 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Current Destination:</span>
              <span className="font-bold text-cyan-300">{selectedTarget}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Path Status:</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Optimal Clear Route
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Obstacle Distance (LiDAR):</span>
              <span className="text-slate-200 font-semibold">2.4 meters (Safe)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">ETA:</span>
              <span className="text-white font-bold">{navActive ? '18 seconds' : '--'}</span>
            </div>
          </div>
        </div>

        {/* Destination Waypoint Selector Sidebar */}
        <div className="w-full md:w-80 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs">
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider mb-2">Saved Waypoints</h3>
            <div className="space-y-2">
              {waypoints.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => setSelectedTarget(wp.name)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedTarget === wp.name
                      ? 'border-cyan-400 bg-cyan-950/25 text-cyan-200 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${selectedTarget === wp.name ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="font-semibold">{wp.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{wp.coords}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-2 pt-2 border-t border-slate-800">
            {navActive ? (
              <button
                onClick={handleStopNav}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <StopCircle className="w-5 h-5" />
                CANCEL NAVIGATION
              </button>
            ) : (
              <button
                onClick={handleStartNav}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Play className="w-5 h-5 fill-current" />
                START NAVIGATION
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
