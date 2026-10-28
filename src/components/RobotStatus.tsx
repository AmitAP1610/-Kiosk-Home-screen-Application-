import React from 'react';
import { FaceExpression } from '../types/robot';
import { Wifi, Mic, Volume2, Cpu, AlertTriangle, Moon, Sparkles } from 'lucide-react';

interface RobotStatusProps {
  expression: FaceExpression;
  isListening: boolean;
  isSpeaking: boolean;
  hardwareStatus: 'connected' | 'disconnected' | 'connecting' | 'idle';
  visible?: boolean;
}

export const RobotStatus: React.FC<RobotStatusProps> = ({
  expression,
  isListening,
  isSpeaking,
  hardwareStatus,
  visible = true
}) => {
  if (!visible) return null;

  const getStatusBadge = () => {
    switch (expression) {
      case 'listening':
        return { label: 'LISTENING', icon: Mic, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40' };
      case 'thinking':
        return { label: 'PROCESSING', icon: Cpu, color: 'text-sky-300 border-sky-500/40 bg-sky-950/40' };
      case 'speaking':
        return { label: 'SYNTHESIZING', icon: Volume2, color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40' };
      case 'happy':
        return { label: 'HAPPY', icon: Sparkles, color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40' };
      case 'confused':
        return { label: 'QUERY', icon: Cpu, color: 'text-amber-300 border-amber-500/40 bg-amber-950/40' };
      case 'sleep':
        return { label: 'STANDBY', icon: Moon, color: 'text-slate-400 border-slate-700 bg-slate-900/40' };
      case 'error':
        return { label: 'FAULT DIAGNOSTIC', icon: AlertTriangle, color: 'text-red-400 border-red-500/40 bg-red-950/40' };
      case 'wakeup':
        return { label: 'INITIALIZING', icon: Sparkles, color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40' };
      default:
        return { label: 'READY', icon: Cpu, color: 'text-slate-400 border-slate-800 bg-black/60' };
    }
  };

  const badge = getStatusBadge();
  const IconComponent = badge.icon;

  return (
    <div className="absolute top-4 left-5 right-5 flex items-center justify-between pointer-events-none z-10 opacity-70 hover:opacity-100 transition-opacity duration-300">
      {/* Left: Current State Indicator */}
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono tracking-wider backdrop-blur-md transition-colors ${badge.color}`}>
        <span className="relative flex h-2 w-2">
          {expression === 'listening' || expression === 'thinking' ? (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          ) : null}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${expression === 'error' ? 'bg-red-500' : 'bg-cyan-400'}`}></span>
        </span>
        <IconComponent className="w-3.5 h-3.5" />
        <span>{badge.label}</span>
      </div>

      {/* Right: Hardware IPC & Audio Indicators */}
      <div className="flex items-center gap-2">
        {isListening && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono">
            <Mic className="w-3 h-3 animate-pulse text-cyan-400" />
            <span>MIC ACTIVE</span>
          </div>
        )}

        {isSpeaking && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono">
            <Volume2 className="w-3 h-3 text-cyan-400" />
            <span>TTS</span>
          </div>
        )}

        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-mono ${
          hardwareStatus === 'connected'
            ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
            : hardwareStatus === 'connecting'
            ? 'border-amber-500/40 text-amber-400 bg-amber-950/30'
            : 'border-slate-800 text-slate-500 bg-black/40'
        }`}>
          <Wifi className="w-3 h-3" />
          <span>{hardwareStatus === 'connected' ? 'IPC: ON' : hardwareStatus === 'connecting' ? 'IPC...' : 'IPC: OFF'}</span>
        </div>
      </div>
    </div>
  );
};

