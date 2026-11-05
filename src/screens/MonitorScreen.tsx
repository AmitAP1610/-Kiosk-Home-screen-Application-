import React from 'react';
import { Activity, Cpu, ShieldCheck, Wifi, Battery, AlertTriangle, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { SystemStatus } from '../types/robot';

interface MonitorScreenProps {
  onNavigate?: (screen: any) => void;
  systemStatus: SystemStatus;
}

export const MonitorScreen: React.FC<MonitorScreenProps> = ({ onNavigate, systemStatus }) => {
  const metrics = [
    {
      title: 'Jetson Orin Nano (ROS 2)',
      icon: Cpu,
      status: systemStatus.jetsonConnected ? 'CONNECTED' : 'DISCONNECTED',
      isOk: systemStatus.jetsonConnected,
      details: 'WebSocket Bridge port 9090 • ROS 2 Humble'
    },
    {
      title: 'Arduino Motor Subsystem',
      icon: ShieldCheck,
      status: systemStatus.arduinoConnected ? 'OPERATIONAL' : 'DISCONNECTED',
      isOk: systemStatus.arduinoConnected,
      details: 'MDD10A H-bridge • 300ms Safety Watchdog Armed'
    },
    {
      title: 'LiDAR Telemetry Stream',
      icon: Activity,
      status: systemStatus.lidarConnected ? 'STREAMING (10Hz)' : 'STANDBY',
      isOk: systemStatus.lidarConnected,
      details: 'UART 115200 baud • 360-degree scan envelope'
    },
    {
      title: 'Internal Robot Static IP',
      icon: Wifi,
      status: '172.17.0.1 (STATIC)',
      isOk: true,
      details: 'Isolated Robot Subnet • Strict Tablet-Jetson Bridge'
    },
    {
      title: 'Battery Pack Telemetry',
      icon: Battery,
      status: `${systemStatus.tabletBattery ?? 92}% (NOMINAL)`,
      isOk: (systemStatus.tabletBattery ?? 92) > 20,
      details: '24V LiFePO4 battery pack • BQ40Z50 BMS'
    },
    {
      title: 'E-Stop Interlock Status',
      icon: AlertTriangle,
      status: systemStatus.motorEStop ? 'ENGAGED' : 'CLEARED',
      isOk: !systemStatus.motorEStop,
      details: systemStatus.motorEStop ? 'Motors inhibited by safety lock' : 'Motion enabled'
    }
  ];

  return (
    <div className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-4 sm:p-5 md:p-6 font-sans select-none overflow-y-auto">
      {/* Header: Navy Blue Structural Bar (#263746) */}
      <div className="flex items-center justify-between pb-3 bg-[#263746] text-white p-3.5 rounded-xl mb-5 border border-white/10 shadow-sm">
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
            <Activity className="w-5 h-5 text-[#C49A45]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight">System Monitor & Telemetry</h1>
            <p className="text-[12px] text-[#E9EDF2]/80 font-mono">Confirmed Hardware & Layer Status Matrix</p>
          </div>
        </div>
      </div>

      {/* Grid of hardware metrics: White Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border bg-white text-[#30343B] space-y-2 transition-all shadow-sm ${
                m.isOk
                  ? 'border-[#E9EDF2] hover:border-[#263746]'
                  : 'border-red-400 bg-red-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#E9EDF2] text-[#263746] border border-[#D8DFE8]">
                    <Icon className="w-4 h-4 text-[#263746]" strokeWidth={1.75} />
                  </div>
                  <span className="font-semibold text-[#30343B] text-[15px] font-sans">{m.title}</span>
                </div>
                {m.isOk ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-[#C49A45]" />
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[#606B76]">Status:</span>
                <span className={`font-semibold ${m.isOk ? 'text-emerald-700' : 'text-[#C49A45]'}`}>
                  {m.status}
                </span>
              </div>

              <p className="text-[12px] text-[#606B76] border-t border-[#E9EDF2] pt-2 font-sans">
                {m.details}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
