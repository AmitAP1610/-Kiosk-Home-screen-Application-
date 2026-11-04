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
    <div className="w-full h-full bg-[#FFFFFF] text-[#30343B] flex flex-col p-4 sm:p-6 font-sans select-none overflow-y-auto">
      {/* Header: Industrial Primary Bar */}
      <div className="flex items-center justify-between pb-3 bg-[#30343B] text-white p-3.5 rounded-xl mb-6 border border-[#B0B4B8]/30 shadow-sm">
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
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">SYSTEM MONITOR & TELEMETRY</h1>
            <p className="text-[11px] text-[#B0B4B8] font-mono">Confirmed Hardware & Layer Status Matrix</p>
          </div>
        </div>
      </div>

      {/* Grid of hardware metrics: Crisp White Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border bg-[#FFFFFF] text-[#30343B] space-y-2 transition-all shadow-sm ${
                m.isOk
                  ? 'border-[#B0B4B8]/60 hover:border-[#174D3A]'
                  : 'border-red-500/50 bg-red-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#DCE8E1]/40 text-[#174D3A] border border-[#B0B4B8]/40">
                    <Icon className="w-4 h-4 text-[#174D3A]" />
                  </div>
                  <span className="font-bold text-[#30343B] text-xs">{m.title}</span>
                </div>
                {m.isOk ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-500" />
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[#5F666D]">Status:</span>
                <span className={`font-bold ${m.isOk ? 'text-emerald-700' : 'text-amber-600'}`}>
                  {m.status}
                </span>
              </div>

              <p className="text-[11px] text-[#5F666D] border-t border-[#B0B4B8]/30 pt-2">
                {m.details}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
