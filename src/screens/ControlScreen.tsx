import React, { useState } from 'react';
import { Compass, AlertOctagon, ShieldAlert, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Square } from 'lucide-react';

interface ControlScreenProps {
  onNavigate?: (screen: any) => void;
  onSendCommand?: (cmd: { linear: number; angular: number }) => void;
  onEmergencyStop?: () => void;
  isJetsonConnected?: boolean;
  isArduinoConnected?: boolean;
}

export const ControlScreen: React.FC<ControlScreenProps> = ({
  onNavigate,
  onSendCommand,
  onEmergencyStop,
  isJetsonConnected = false,
  isArduinoConnected = false
}) => {
  const [speedLevel, setSpeedLevel] = useState<'low' | 'normal' | 'fast'>('normal');
  const [controlMode, setControlMode] = useState<'manual' | 'autonomous'>('manual');
  const [activeDirection, setActiveDirection] = useState<string | null>(null);

  const getSpeedMultiplier = () => {
    switch (speedLevel) {
      case 'low': return 0.15; // m/s
      case 'normal': return 0.35;
      case 'fast': return 0.60;
    }
  };

  const sendMove = (linear: number, angular: number, dir: string) => {
    setActiveDirection(dir);
    const speed = getSpeedMultiplier();
    if (onSendCommand) {
      onSendCommand({ linear: linear * speed, angular: angular * 0.8 });
    }
  };

  const stopMove = () => {
    setActiveDirection(null);
    if (onSendCommand) {
      onSendCommand({ linear: 0, angular: 0 });
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-black via-[#0d0705] to-[#04080c] text-slate-100 flex flex-col p-4 sm:p-6 font-sans select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 bg-black/80 p-3 rounded-2xl mb-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          {onNavigate && (
            <button
              onClick={() => onNavigate('hub')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black hover:bg-[#702815] border border-[#C8A451]/60 text-slate-100 hover:text-white transition-all text-xs font-bold mr-1"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#C8A451]" />
              <span>Back to Hub</span>
            </button>
          )}

          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">ROBOT TELEOPERATION</h1>
            <p className="text-xs text-[#00f3ff] font-mono">Tablet → Jetson Safety Validator → Arduino Motors</p>
          </div>
        </div>

        {/* Mode & Link Status */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px]">
            <span className={`px-2 py-0.5 rounded border ${isJetsonConnected ? 'border-emerald-500/40 text-emerald-300' : 'border-slate-800 text-slate-500'}`}>
              JETSON: {isJetsonConnected ? 'ONLINE' : 'OFFLINE'}
            </span>
            <span className={`px-2 py-0.5 rounded border ${isArduinoConnected ? 'border-emerald-500/40 text-emerald-300' : 'border-slate-800 text-slate-500'}`}>
              ARDUINO: {isArduinoConnected ? 'READY' : 'OFFLINE'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setControlMode('manual')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                controlMode === 'manual'
                  ? 'bg-cyan-500 text-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MANUAL
            </button>
            <button
              onClick={() => setControlMode('autonomous')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                controlMode === 'autonomous'
                  ? 'bg-emerald-500 text-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AUTONOMOUS
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 py-4 items-center justify-center min-h-0">
        {/* Virtual Directional Pad */}
        <div className="flex flex-col items-center justify-center gap-3">
          {/* Forward */}
          <button
            onPointerDown={() => sendMove(1, 0, 'forward')}
            onPointerUp={stopMove}
            onPointerLeave={stopMove}
            className={`w-20 h-20 rounded-2xl border flex items-center justify-center text-xl transition-all active:scale-95 shadow-lg ${
              activeDirection === 'forward'
                ? 'bg-cyan-400 text-black border-cyan-300 shadow-[0_0_20px_rgba(0,243,255,0.5)]'
                : 'bg-slate-900 border-slate-800 text-cyan-300 hover:border-cyan-500/50'
            }`}
          >
            <ArrowUp className="w-8 h-8" />
          </button>

          {/* Left / Stop / Right */}
          <div className="flex items-center gap-3">
            <button
              onPointerDown={() => sendMove(0, 1, 'left')}
              onPointerUp={stopMove}
              onPointerLeave={stopMove}
              className={`w-20 h-20 rounded-2xl border flex items-center justify-center text-xl transition-all active:scale-95 shadow-lg ${
                activeDirection === 'left'
                  ? 'bg-cyan-400 text-black border-cyan-300 shadow-[0_0_20px_rgba(0,243,255,0.5)]'
                  : 'bg-slate-900 border-slate-800 text-cyan-300 hover:border-cyan-500/50'
              }`}
            >
              <ArrowLeft className="w-8 h-8" />
            </button>

            <button
              onClick={stopMove}
              className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 text-amber-400 hover:border-amber-400/50 flex flex-col items-center justify-center gap-1 font-mono text-[11px] font-bold active:scale-95 shadow-lg"
            >
              <Square className="w-6 h-6 fill-current" />
              <span>STOP</span>
            </button>

            <button
              onPointerDown={() => sendMove(0, -1, 'right')}
              onPointerUp={stopMove}
              onPointerLeave={stopMove}
              className={`w-20 h-20 rounded-2xl border flex items-center justify-center text-xl transition-all active:scale-95 shadow-lg ${
                activeDirection === 'right'
                  ? 'bg-cyan-400 text-black border-cyan-300 shadow-[0_0_20px_rgba(0,243,255,0.5)]'
                  : 'bg-slate-900 border-slate-800 text-cyan-300 hover:border-cyan-500/50'
              }`}
            >
              <ArrowRight className="w-8 h-8" />
            </button>
          </div>

          {/* Reverse */}
          <button
            onPointerDown={() => sendMove(-1, 0, 'backward')}
            onPointerUp={stopMove}
            onPointerLeave={stopMove}
            className={`w-20 h-20 rounded-2xl border flex items-center justify-center text-xl transition-all active:scale-95 shadow-lg ${
              activeDirection === 'backward'
                ? 'bg-cyan-400 text-black border-cyan-300 shadow-[0_0_20px_rgba(0,243,255,0.5)]'
                : 'bg-slate-900 border-slate-800 text-cyan-300 hover:border-cyan-500/50'
            }`}
          >
            <ArrowDown className="w-8 h-8" />
          </button>
        </div>

        {/* Speed & Emergency Stop Panel */}
        <div className="w-full max-w-sm flex flex-col gap-4 font-mono text-xs">
          {/* Speed Selector */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400 font-semibold block mb-2">MAX VELOCITY PRESET</span>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'normal', 'fast'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSpeedLevel(lvl)}
                  className={`py-2 rounded-xl border font-bold capitalize transition-all ${
                    speedLevel === lvl
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Linear Limit: {getSpeedMultiplier()} m/s • Guarded by Jetson Nav2 Safety
            </p>
          </div>

          {/* Safety Watchdog Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-[11px] space-y-1 text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Mandatory Safety Layers</span>
            </div>
            <p className="text-slate-500">
              Arduino watchdog stops motors if no valid command packet is received within 300ms.
            </p>
          </div>

          {/* Prominent Emergency Stop Button */}
          <button
            onClick={() => {
              if (onEmergencyStop) onEmergencyStop();
              stopMove();
            }}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-extrabold tracking-widest text-sm flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(239,68,68,0.5)] border border-red-400 transition-all"
          >
            <AlertOctagon className="w-6 h-6" />
            <span>EMERGENCY STOP (E-STOP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
