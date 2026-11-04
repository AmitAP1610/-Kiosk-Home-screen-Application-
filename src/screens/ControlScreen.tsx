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
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">ROBOT TELEOPERATION</h1>
            <p className="text-[11px] text-[#B0B4B8] font-mono">Tablet → Jetson Safety Validator → Arduino Motors</p>
          </div>
        </div>

        {/* Mode & Link Status */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px]">
            <span className={`px-2 py-0.5 rounded border ${isJetsonConnected ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300' : 'border-[#B0B4B8]/30 bg-[#202124] text-[#B0B4B8]'}`}>
              JETSON: {isJetsonConnected ? 'ONLINE' : 'OFFLINE'}
            </span>
            <span className={`px-2 py-0.5 rounded border ${isArduinoConnected ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300' : 'border-[#B0B4B8]/30 bg-[#202124] text-[#B0B4B8]'}`}>
              ARDUINO: {isArduinoConnected ? 'READY' : 'OFFLINE'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#202124] p-1 rounded-lg border border-[#B0B4B8]/30 font-mono text-xs">
            <button
              onClick={() => setControlMode('manual')}
              className={`px-3 py-1.5 rounded-md transition-colors font-semibold text-xs ${
                controlMode === 'manual'
                  ? 'bg-[#174D3A] text-white'
                  : 'text-[#B0B4B8] hover:text-white'
              }`}
            >
              MANUAL
            </button>
            <button
              onClick={() => setControlMode('autonomous')}
              className={`px-3 py-1.5 rounded-md transition-colors font-semibold text-xs ${
                controlMode === 'autonomous'
                  ? 'bg-[#174D3A] text-white'
                  : 'text-[#B0B4B8] hover:text-white'
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
                ? 'bg-[#174D3A] text-white border-[#174D3A]'
                : 'bg-[#FFFFFF] border-[#B0B4B8]/60 text-[#30343B] hover:border-[#174D3A]'
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
              className={`w-20 h-20 rounded-xl border flex items-center justify-center text-xl transition-all active:scale-95 shadow-sm ${
                activeDirection === 'left'
                  ? 'bg-[#174D3A] text-white border-[#174D3A]'
                : 'bg-[#FFFFFF] border-[#B0B4B8]/60 text-[#30343B] hover:border-[#174D3A]'
              }`}
            >
              <ArrowLeft className="w-8 h-8" />
            </button>

            <button
              onClick={stopMove}
              className="w-20 h-20 rounded-xl bg-[#202124] border border-[#B0B4B8]/40 text-[#DCE8E1] hover:border-[#174D3A] flex flex-col items-center justify-center gap-1 font-mono text-[11px] font-bold active:scale-95 shadow-sm"
            >
              <Square className="w-6 h-6 fill-current" />
              <span>STOP</span>
            </button>

            <button
              onPointerDown={() => sendMove(0, -1, 'right')}
              onPointerUp={stopMove}
              onPointerLeave={stopMove}
              className={`w-20 h-20 rounded-xl border flex items-center justify-center text-xl transition-all active:scale-95 shadow-sm ${
                activeDirection === 'right'
                  ? 'bg-[#174D3A] text-white border-[#174D3A]'
                : 'bg-[#FFFFFF] border-[#B0B4B8]/60 text-[#30343B] hover:border-[#174D3A]'
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
            className={`w-20 h-20 rounded-xl border flex items-center justify-center text-xl transition-all active:scale-95 shadow-sm ${
              activeDirection === 'backward'
                ? 'bg-[#174D3A] text-white border-[#174D3A]'
                : 'bg-[#FFFFFF] border-[#B0B4B8]/60 text-[#30343B] hover:border-[#174D3A]'
            }`}
          >
            <ArrowDown className="w-8 h-8" />
          </button>
        </div>

        {/* Speed & Emergency Stop Panel */}
        <div className="w-full max-w-sm flex flex-col gap-4 font-mono text-xs">
          {/* Speed Selector: Crisp White Card */}
          <div className="p-4 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 space-y-2 shadow-sm">
            <span className="text-[#30343B] font-bold block mb-2 text-xs">MAX VELOCITY PRESET</span>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'normal', 'fast'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSpeedLevel(lvl)}
                  className={`py-2 rounded-lg border font-bold capitalize transition-all text-xs ${
                    speedLevel === lvl
                      ? 'bg-[#174D3A] border-[#174D3A] text-white'
                      : 'border-[#B0B4B8]/40 bg-[#FFFFFF] text-[#30343B] hover:bg-[#DCE8E1]/30'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#5F666D] mt-1">
              Linear Limit: {getSpeedMultiplier()} m/s • Guarded by Jetson Nav2 Safety
            </p>
          </div>

          {/* Safety Watchdog Notice: Crisp White Card */}
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 text-[11px] space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#30343B] font-semibold">
              <ShieldAlert className="w-4 h-4 text-[#174D3A]" />
              <span>Mandatory Safety Layers</span>
            </div>
            <p className="text-[#5F666D]">
              Arduino watchdog stops motors if no valid command packet is received within 300ms.
            </p>
          </div>

          {/* Prominent Emergency Stop Button */}
          <button
            onClick={() => {
              if (onEmergencyStop) onEmergencyStop();
              stopMove();
            }}
            className="w-full py-3.5 rounded-xl bg-red-700 hover:bg-red-800 active:scale-95 text-white font-extrabold tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm border border-red-500 transition-all"
          >
            <AlertOctagon className="w-5 h-5" />
            <span>EMERGENCY STOP (E-STOP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
