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
            <Compass className="w-5 h-5 text-[#C49A45]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight">Robot Teleoperation</h1>
            <p className="text-[12px] text-[#E9EDF2]/80 font-mono">Tablet → Jetson Safety Validator → Arduino Motors</p>
          </div>
        </div>

        {/* Mode & Link Status */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px]">
            <span className={`px-2.5 py-1 rounded-md border font-semibold ${isJetsonConnected ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300' : 'border-white/10 bg-[#30343B] text-[#E9EDF2]/70'}`}>
              JETSON: {isJetsonConnected ? 'ONLINE' : 'OFFLINE'}
            </span>
            <span className={`px-2.5 py-1 rounded-md border font-semibold ${isArduinoConnected ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300' : 'border-white/10 bg-[#30343B] text-[#E9EDF2]/70'}`}>
              ARDUINO: {isArduinoConnected ? 'READY' : 'OFFLINE'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#30343B] p-1 rounded-lg border border-white/10 font-mono text-xs">
            <button
              onClick={() => setControlMode('manual')}
              className={`px-3 py-1.5 rounded-md transition-colors font-semibold text-xs ${
                controlMode === 'manual'
                  ? 'bg-[#263746] text-white shadow-sm'
                  : 'text-[#E9EDF2]/70 hover:text-white'
              }`}
            >
              MANUAL
            </button>
            <button
              onClick={() => setControlMode('autonomous')}
              className={`px-3 py-1.5 rounded-md transition-colors font-semibold text-xs ${
                controlMode === 'autonomous'
                  ? 'bg-[#263746] text-white shadow-sm'
                  : 'text-[#E9EDF2]/70 hover:text-white'
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
            className={`w-20 h-20 rounded-xl border flex items-center justify-center text-xl transition-all active:scale-95 shadow-sm ${
              activeDirection === 'forward'
                ? 'bg-[#263746] text-white border-[#263746]'
                : 'bg-white border-[#E9EDF2] text-[#30343B] hover:border-[#263746]'
            }`}
          >
            <ArrowUp className="w-8 h-8" strokeWidth={2} />
          </button>

          {/* Left / Stop / Right */}
          <div className="flex items-center gap-3">
            <button
              onPointerDown={() => sendMove(0, 1, 'left')}
              onPointerUp={stopMove}
              onPointerLeave={stopMove}
              className={`w-20 h-20 rounded-xl border flex items-center justify-center text-xl transition-all active:scale-95 shadow-sm ${
                activeDirection === 'left'
                  ? 'bg-[#263746] text-white border-[#263746]'
                  : 'bg-white border-[#E9EDF2] text-[#30343B] hover:border-[#263746]'
              }`}
            >
              <ArrowLeft className="w-8 h-8" strokeWidth={2} />
            </button>

            <button
              onClick={stopMove}
              className="w-20 h-20 rounded-xl bg-[#30343B] border border-white/10 text-white hover:bg-[#202124] flex flex-col items-center justify-center gap-1 font-mono text-[11px] font-bold active:scale-95 shadow-sm"
            >
              <Square className="w-6 h-6 fill-current text-[#C49A45]" />
              <span>STOP</span>
            </button>

            <button
              onPointerDown={() => sendMove(0, -1, 'right')}
              onPointerUp={stopMove}
              onPointerLeave={stopMove}
              className={`w-20 h-20 rounded-xl border flex items-center justify-center text-xl transition-all active:scale-95 shadow-sm ${
                activeDirection === 'right'
                  ? 'bg-[#263746] text-white border-[#263746]'
                  : 'bg-white border-[#E9EDF2] text-[#30343B] hover:border-[#263746]'
              }`}
            >
              <ArrowRight className="w-8 h-8" strokeWidth={2} />
            </button>
          </div>

          {/* Reverse */}
          <button
            onPointerDown={() => sendMove(-1, 0, 'backward')}
            onPointerUp={stopMove}
            onPointerLeave={stopMove}
            className={`w-20 h-20 rounded-xl border flex items-center justify-center text-xl transition-all active:scale-95 shadow-sm ${
              activeDirection === 'backward'
                ? 'bg-[#263746] text-white border-[#263746]'
                : 'bg-white border-[#E9EDF2] text-[#30343B] hover:border-[#263746]'
            }`}
          >
            <ArrowDown className="w-8 h-8" strokeWidth={2} />
          </button>
        </div>

        {/* Speed & Emergency Stop Panel */}
        <div className="w-full max-w-sm flex flex-col gap-4 font-mono text-xs">
          {/* Speed Selector: White Card */}
          <div className="p-4 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] space-y-2 shadow-sm">
            <span className="text-[#30343B] font-bold block mb-2 text-xs">MAX VELOCITY PRESET</span>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'normal', 'fast'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSpeedLevel(lvl)}
                  className={`py-2 rounded-lg border font-semibold capitalize transition-all text-xs ${
                    speedLevel === lvl
                      ? 'bg-[#263746] border-[#263746] text-white'
                      : 'border-[#E9EDF2] bg-white text-[#30343B] hover:bg-[#E9EDF2]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#606B76] mt-1 font-sans">
              Linear Limit: {getSpeedMultiplier()} m/s • Guarded by Jetson Nav2 Safety
            </p>
          </div>

          {/* Safety Watchdog Notice: White Card */}
          <div className="p-3.5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] text-[12px] space-y-1 shadow-sm font-sans">
            <div className="flex items-center gap-1.5 text-[#30343B] font-semibold">
              <ShieldAlert className="w-4 h-4 text-[#263746]" strokeWidth={1.75} />
              <span>Mandatory Safety Layers</span>
            </div>
            <p className="text-[#606B76]">
              Arduino watchdog stops motors if no valid command packet is received within 300ms.
            </p>
          </div>

          {/* Prominent Emergency Stop Button: Retains Error Red (#B42318) */}
          <button
            onClick={() => {
              if (onEmergencyStop) onEmergencyStop();
              stopMove();
            }}
            className="w-full min-h-[48px] py-3.5 rounded-xl bg-[#B42318] hover:bg-red-800 active:scale-95 text-white font-extrabold tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm border border-red-600 transition-all"
          >
            <AlertOctagon className="w-5 h-5" />
            <span>EMERGENCY STOP (E-STOP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
