import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  AlertOctagon,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Square,
  Gauge
} from 'lucide-react';
import { useJetsonBridge } from '../hooks/useJetsonBridge';

interface ControlScreenProps {
  onNavigate?: (screen: any) => void;
  onSendCommand?: (cmd: { linear: number; angular: number }) => void;
  onEmergencyStop?: () => void;
  isJetsonConnected?: boolean;
  isArduinoConnected?: boolean;
}

export const ControlScreen: React.FC<ControlScreenProps> = ({
  onNavigate,
  onEmergencyStop
}) => {
  const {
    status,
    wsUrl,
    pingMs,
    packetsSent,
    packetsReceived,
    currentLinearSpeed,
    currentAngularSpeed,
    robotPose,
    setUrl,
    connect,
    disconnect,
    startTeleop,
    stopTeleop,
    emergencyStop
  } = useJetsonBridge();

  const [speedLevel, setSpeedLevel] = useState<'low' | 'normal' | 'fast'>('normal');
  const [controlMode, setControlMode] = useState<'manual' | 'autonomous'>('manual');
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [inputUrl, setInputUrl] = useState(wsUrl);

  const activeDirectionRef = useRef<string | null>(null);
  activeDirectionRef.current = activeDirection;

  useEffect(() => {
    setInputUrl(wsUrl);
  }, [wsUrl]);

  // Speed values in meters/second
  const getLinearSpeed = () => {
    switch (speedLevel) {
      case 'low': return 0.15;
      case 'normal': return 0.35;
      case 'fast': return 0.65;
    }
  };

  const getAngularSpeed = () => {
    switch (speedLevel) {
      case 'low': return 0.45;
      case 'normal': return 0.75;
      case 'fast': return 1.10;
    }
  };

  // Dispatch continuous movement
  const handleStartMove = (linearDir: number, angularDir: number, dirLabel: string) => {
    setActiveDirection(dirLabel);
    const lin = linearDir * getLinearSpeed();
    const ang = angularDir * getAngularSpeed();
    startTeleop(lin, ang);
  };

  const handleStopMove = () => {
    setActiveDirection(null);
    stopTeleop();
  };

  const handleEStop = () => {
    handleStopMove();
    emergencyStop();
    if (onEmergencyStop) onEmergencyStop();
  };

  // Keyboard controls for convenient tablet docks / USB keyboards (WASD & Arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || document.activeElement?.tagName === 'INPUT') return;
      if (controlMode !== 'manual') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleStartMove(1, 0, 'forward');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleStartMove(-1, 0, 'backward');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleStartMove(0, 1, 'left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleStartMove(0, -1, 'right');
          break;
        case ' ':
          e.preventDefault();
          handleEStop();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 's', 'S', 'a', 'A', 'd', 'D'].includes(e.key)) {
        handleStopMove();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [speedLevel, controlMode]);

  const isConnected = status === 'connected';

  return (
    <div className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-3 sm:p-4 md:p-5 font-sans select-none overflow-hidden">
      {/* Header: Navy Blue Structural Bar (#263746) */}
      <header className="flex items-center justify-between pb-3 bg-[#263746] text-white p-3.5 rounded-xl mb-3 border border-white/10 shadow-sm shrink-0">
        <div className="flex items-center gap-2.5">
          {onNavigate && (
            <button
              onClick={() => {
                handleStopMove();
                onNavigate('hub');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all text-xs font-semibold mr-1 cursor-pointer"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
              <span>Back</span>
            </button>
          )}

          <div className="p-2 rounded-lg bg-[#30343B] border border-white/10 text-[#C49A45] hidden sm:block">
            <Compass className="w-5 h-5 text-[#C49A45]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight leading-tight">
              Robot Teleoperation & Motor Control
            </h1>
            <p className="text-[11px] text-[#E9EDF2]/80 font-mono">
              Live ROS 2 /cmd_vel Stream • NVIDIA Jetson & Arduino
            </p>
          </div>
        </div>

        {/* Link Status & Config Toggle */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Connection Status Badge */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold text-xs cursor-pointer transition-all ${
              isConnected
                ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300'
                : status === 'connecting'
                ? 'bg-amber-950/60 border-amber-500 text-amber-300 animate-pulse'
                : 'bg-red-950/60 border-red-500 text-red-300'
            }`}
            title="Click to configure Jetson IP & WebSocket parameters"
          >
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
            <span>JETSON: {status.toUpperCase()}</span>
            {isConnected && <span className="text-[10px] opacity-80">({pingMs}ms)</span>}
          </button>

          {/* Manual / Autonomous Toggle */}
          <div className="flex items-center gap-1 bg-[#30343B] p-1 rounded-lg border border-white/10 font-mono text-xs">
            <button
              onClick={() => setControlMode('manual')}
              className={`px-3 py-1 rounded-md transition-colors font-semibold text-xs ${
                controlMode === 'manual'
                  ? 'bg-[#263746] text-white shadow-sm'
                  : 'text-[#E9EDF2]/70 hover:text-white'
              }`}
            >
              MANUAL
            </button>
            <button
              onClick={() => setControlMode('autonomous')}
              className={`px-3 py-1 rounded-md transition-colors font-semibold text-xs ${
                controlMode === 'autonomous'
                  ? 'bg-[#263746] text-white shadow-sm'
                  : 'text-[#E9EDF2]/70 hover:text-white'
              }`}
            >
              AUTONOMOUS
            </button>
          </div>
        </div>
      </header>

      {/* Jetson IP & Connection Configuration Bar (Collapsible) */}
      {showConfig && (
        <div className="mb-3 p-3 bg-white rounded-xl border border-[#263746]/20 shadow-sm flex flex-wrap items-center justify-between gap-3 font-mono text-xs shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <span className="font-bold text-[#30343B]">Jetson ROSBridge WebSocket:</span>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="ws://172.17.0.1:9090"
              className="flex-1 bg-[#F3F4F6] border border-[#D8DFE8] rounded-lg px-2.5 py-1 text-xs text-[#30343B] focus:outline-none focus:border-[#263746]"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setUrl(inputUrl);
                connect(inputUrl);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white font-semibold text-xs cursor-pointer shadow-xs"
            >
              Connect
            </button>
            {isConnected && (
              <button
                onClick={disconnect}
                className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold text-xs cursor-pointer shadow-xs"
              >
                Disconnect
              </button>
            )}
            <button
              onClick={() => setShowConfig(false)}
              className="px-2.5 py-1.5 rounded-lg bg-[#E9EDF2] text-[#30343B] hover:bg-[#D8DFE8] text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 items-center justify-center min-h-0">
        {/* Virtual Directional Pad Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center mb-3 font-mono text-xs text-[#606B76]">
            <span>Press & hold to drive robot • Continuous 10Hz ROS loop • Auto-stop on release</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 p-4 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#D8DFE8] shadow-sm">
            {/* Row 1: Forward-Left / Forward / Forward-Right */}
            <button
              onPointerDown={(e) => { e.preventDefault(); handleStartMove(0.7, 0.5, 'fwd-left'); }}
              onPointerUp={handleStopMove}
              onPointerLeave={handleStopMove}
              onPointerCancel={handleStopMove}
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer ${
                activeDirection === 'fwd-left'
                  ? 'bg-[#263746] text-white border-[#263746]'
                  : 'bg-white border-[#D8DFE8] text-[#30343B] hover:border-[#263746]'
              }`}
            >
              <ArrowUp className="w-6 h-6 -rotate-45" strokeWidth={2} />
              <span className="text-[10px] font-mono font-bold">ARC L</span>
            </button>

            <button
              onPointerDown={(e) => { e.preventDefault(); handleStartMove(1, 0, 'forward'); }}
              onPointerUp={handleStopMove}
              onPointerLeave={handleStopMove}
              onPointerCancel={handleStopMove}
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer ${
                activeDirection === 'forward'
                  ? 'bg-[#263746] text-white border-[#263746]'
                  : 'bg-white border-[#D8DFE8] text-[#30343B] hover:border-[#263746]'
              }`}
            >
              <ArrowUp className="w-8 h-8 text-[#C49A45]" strokeWidth={2.5} />
              <span className="text-[11px] font-mono font-bold">FORWARD</span>
            </button>

            <button
              onPointerDown={(e) => { e.preventDefault(); handleStartMove(0.7, -0.5, 'fwd-right'); }}
              onPointerUp={handleStopMove}
              onPointerLeave={handleStopMove}
              onPointerCancel={handleStopMove}
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer ${
                activeDirection === 'fwd-right'
                  ? 'bg-[#263746] text-white border-[#263746]'
                  : 'bg-white border-[#D8DFE8] text-[#30343B] hover:border-[#263746]'
              }`}
            >
              <ArrowUp className="w-6 h-6 rotate-45" strokeWidth={2} />
              <span className="text-[10px] font-mono font-bold">ARC R</span>
            </button>

            {/* Row 2: Turn Left / Center STOP / Turn Right */}
            <button
              onPointerDown={(e) => { e.preventDefault(); handleStartMove(0, 1, 'left'); }}
              onPointerUp={handleStopMove}
              onPointerLeave={handleStopMove}
              onPointerCancel={handleStopMove}
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer ${
                activeDirection === 'left'
                  ? 'bg-[#263746] text-white border-[#263746]'
                  : 'bg-white border-[#D8DFE8] text-[#30343B] hover:border-[#263746]'
              }`}
            >
              <ArrowLeft className="w-8 h-8 text-[#263746]" strokeWidth={2.5} />
              <span className="text-[11px] font-mono font-bold">LEFT</span>
            </button>

            <button
              onClick={handleStopMove}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-[#30343B] border border-white/10 text-white hover:bg-[#202124] flex flex-col items-center justify-center gap-1 font-mono text-[11px] font-bold active:scale-95 shadow-sm cursor-pointer"
            >
              <Square className="w-6 h-6 fill-current text-[#C49A45]" />
              <span>STOP</span>
            </button>

            <button
              onPointerDown={(e) => { e.preventDefault(); handleStartMove(0, -1, 'right'); }}
              onPointerUp={handleStopMove}
              onPointerLeave={handleStopMove}
              onPointerCancel={handleStopMove}
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer ${
                activeDirection === 'right'
                  ? 'bg-[#263746] text-white border-[#263746]'
                  : 'bg-white border-[#D8DFE8] text-[#30343B] hover:border-[#263746]'
              }`}
            >
              <ArrowRight className="w-8 h-8 text-[#263746]" strokeWidth={2.5} />
              <span className="text-[11px] font-mono font-bold">RIGHT</span>
            </button>

            {/* Row 3: Blank / Reverse / Blank */}
            <div />

            <button
              onPointerDown={(e) => { e.preventDefault(); handleStartMove(-1, 0, 'backward'); }}
              onPointerUp={handleStopMove}
              onPointerLeave={handleStopMove}
              onPointerCancel={handleStopMove}
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer ${
                activeDirection === 'backward'
                  ? 'bg-[#263746] text-white border-[#263746]'
                  : 'bg-white border-[#D8DFE8] text-[#30343B] hover:border-[#263746]'
              }`}
            >
              <ArrowDown className="w-8 h-8 text-[#263746]" strokeWidth={2.5} />
              <span className="text-[11px] font-mono font-bold">REVERSE</span>
            </button>

            <div />
          </div>
        </div>

        {/* Speed, Real Telemetry & Emergency Stop Panel */}
        <div className="w-full max-w-sm flex flex-col gap-3 font-mono text-xs">
          {/* Live Robot Speed Telemetry Card */}
          <div className="p-3.5 rounded-xl bg-white text-[#30343B] border border-[#D8DFE8] shadow-sm space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#E9EDF2] pb-2">
              <span className="font-bold text-[#263746] flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-[#C49A45]" />
                <span>LIVE VELOCITY TELEMETRY</span>
              </span>
              <span className="text-[10px] text-[#606B76]">ROS topic /cmd_vel</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#606B76] block">Linear Speed</span>
                <span className="text-base font-bold text-[#263746]">
                  {currentLinearSpeed.toFixed(2)} <span className="text-[10px] font-normal">m/s</span>
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#606B76] block">Angular Speed</span>
                <span className="text-base font-bold text-[#263746]">
                  {currentAngularSpeed.toFixed(2)} <span className="text-[10px] font-normal">rad/s</span>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#606B76] pt-1">
              <span>Packets: TX {packetsSent} • RX {packetsReceived}</span>
              <span>Pose: ({robotPose.x.toFixed(1)}m, {robotPose.y.toFixed(1)}m)</span>
            </div>
          </div>

          {/* Speed Preset Selector */}
          <div className="p-3.5 rounded-xl bg-white text-[#30343B] border border-[#D8DFE8] shadow-sm space-y-2">
            <span className="text-[#30343B] font-bold block text-xs">MAX VELOCITY PRESET</span>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'normal', 'fast'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSpeedLevel(lvl)}
                  className={`py-2 rounded-lg border font-semibold capitalize transition-all text-xs cursor-pointer ${
                    speedLevel === lvl
                      ? 'bg-[#263746] border-[#263746] text-white shadow-xs'
                      : 'border-[#E9EDF2] bg-white text-[#30343B] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#606B76] mt-1 font-sans">
              Limit: {getLinearSpeed()} m/s linear • {getAngularSpeed()} rad/s angular
            </p>
          </div>

          {/* Watchdog Notice */}
          <div className="p-2.5 rounded-xl bg-white text-[#30343B] border border-[#D8DFE8] text-[11px] shadow-sm font-sans flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#C49A45] flex-shrink-0" />
            <span>Auto-watchdog: Motors halt if no command arrives within 250ms.</span>
          </div>

          {/* Prominent Emergency Stop Button (E-STOP) */}
          <button
            onClick={handleEStop}
            className="w-full min-h-[48px] py-3.5 rounded-xl bg-[#B42318] hover:bg-red-800 active:scale-95 text-white font-extrabold tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md border border-red-600 transition-all cursor-pointer"
          >
            <AlertOctagon className="w-5 h-5" />
            <span>EMERGENCY STOP (E-STOP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
