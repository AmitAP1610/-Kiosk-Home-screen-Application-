import React from 'react';
import { SystemStatus } from '../types/robot';
import { ArrowLeft, Activity, Cpu, Wifi, Radar, Camera, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface MonitorScreenProps {
  onNavigate?: (screen: any) => void;
  systemStatus: SystemStatus;
}

export const MonitorScreen: React.FC<MonitorScreenProps> = ({ onNavigate, systemStatus }) => {
  const metrics = [
    {
      title: 'Realme Tablet (AI & UI)',
      icon: Sparkles,
      status: 'ONLINE',
      isOk: true,
      details: 'Face animations, STT, TTS, camera vision active'
    },
    {
      title: 'NVIDIA Jetson (Robotics)',
      icon: Cpu,
      status: systemStatus.jetsonConnected ? 'CONNECTED' : 'DISCONNECTED',
      isOk: systemStatus.jetsonConnected,
      details: systemStatus.jetsonConnected ? 'WebSocket IPC active on local network' : 'Offline / Standalone mode'
    },
    {
      title: 'Arduino (Motor Control)',
      icon: Wifi,
      status: systemStatus.arduinoConnected ? 'READY' : 'OFFLINE',
      isOk: systemStatus.arduinoConnected,
      details: systemStatus.arduinoConnected ? 'USB Serial link verified • Watchdog 300ms' : 'No serial heartbeat detected'
    },
    {
      title: 'LiDAR Sensor',
      icon: Radar,
      status: systemStatus.lidarConnected ? 'STREAMING' : 'STANDBY',
      isOk: systemStatus.lidarConnected,
      details: systemStatus.lidarConnected ? '360° scan active' : 'Waiting for Jetson ROS 2 bringup'
    },
    {
      title: 'Tablet Camera',
      icon: Camera,
      status: systemStatus.cameraActive ? 'CAPTURING' : 'STANDBY',
      isOk: systemStatus.cameraActive,
      details: systemStatus.cameraActive ? 'MediaDevices stream open' : 'Standby / Privacy mode'
    },
    {
      title: 'Motor Emergency Stop',
      icon: Activity,
      status: systemStatus.motorEStop ? 'ENGAGED' : 'CLEARED',
      isOk: !systemStatus.motorEStop,
      details: systemStatus.motorEStop ? 'Motors inhibited by safety lock' : 'Motion enabled'
    }
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-black via-[#0d0705] to-[#04080c] text-slate-100 flex flex-col p-4 sm:p-6 font-sans select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 bg-black/80 p-3 rounded-2xl mb-6 shadow-xl">
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
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">SYSTEM MONITOR & TELEMETRY</h1>
            <p className="text-xs text-[#00f3ff] font-mono">Confirmed Hardware & Layer Status Matrix</p>
          </div>
        </div>
      </div>

      {/* Grid of hardware metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-2xl border bg-slate-950/80 space-y-2 transition-all ${
                m.isOk
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-red-500/30 bg-red-950/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${m.isOk ? 'bg-cyan-500/10 text-cyan-400' : 'bg-red-500/10 text-red-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white">{m.title}</span>
                </div>
                {m.isOk ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-400" />
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">Status:</span>
                <span className={`font-bold ${m.isOk ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {m.status}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 border-t border-slate-900 pt-2">
                {m.details}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
