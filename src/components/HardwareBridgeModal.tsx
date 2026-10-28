import React, { useState } from 'react';
import { HardwareMessage } from '../types/robot';
import { Cpu, Wifi, Send, CheckCircle2, AlertCircle, Copy, Terminal, X } from 'lucide-react';

interface HardwareBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  wsUrl: string;
  setWsUrl: (url: string) => void;
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'idle';
  onConnect: () => void;
  onDisconnect: () => void;
  onSimulateCommand: (msg: HardwareMessage) => void;
  logMessages: string[];
}

export const HardwareBridgeModal: React.FC<HardwareBridgeModalProps> = ({
  isOpen,
  onClose,
  wsUrl,
  setWsUrl,
  connectionStatus,
  onConnect,
  onDisconnect,
  onSimulateCommand,
  logMessages
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [customText, setCustomText] = useState('Greetings, all robot systems are operational.');

  if (!isOpen) return null;

  const pythonSnippet = `# Python ROS 2 / Raspberry Pi Hardware Controller Example
import asyncio
import websockets
import json

async def send_robot_command():
    uri = "${wsUrl}"
    async with websockets.connect(uri) as ws:
        # 1. Change face expression
        await ws.send(json.dumps({
            "command": "set_expression",
            "expression": "happy"
        }))
        
        # 2. Trigger speech with mouth animation
        await ws.send(json.dumps({
            "command": "speak",
            "text": "Hello, I am ready to assist you!"
        }))

asyncio.run(send_robot_command())`;

  const copyCode = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col text-slate-200 overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold tracking-wide text-white">Robot Hardware & IPC Integration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto space-y-5 py-4 pr-1">
          {/* WebSocket Server Connection */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">WebSocket / Serial Daemon URL:</span>
              <div className="flex items-center gap-1.5">
                {connectionStatus === 'connected' ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ONLINE
                  </span>
                ) : connectionStatus === 'connecting' ? (
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Wifi className="w-3.5 h-3.5 animate-pulse" /> CONNECTING...
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-500 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" /> STANDALONE
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                placeholder="ws://localhost:8080/robot-face"
                className="flex-1 bg-black/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
              />
              {connectionStatus === 'connected' ? (
                <button
                  onClick={onDisconnect}
                  className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={onConnect}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Tip: The UI can also be embedded in an electron/webview or iframe and controlled via standard <code className="text-cyan-300">window.postMessage()</code>.
            </p>
          </div>

          {/* Test IPC Commands Simulation */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Simulate Hardware Commands:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => onSimulateCommand({ command: 'set_expression', expression: 'happy' })}
                className="p-2 rounded-xl border border-slate-800 bg-black/40 hover:border-cyan-500/50 hover:text-cyan-300"
              >
                Cmd: Happy
              </button>
              <button
                onClick={() => onSimulateCommand({ command: 'set_expression', expression: 'thinking' })}
                className="p-2 rounded-xl border border-slate-800 bg-black/40 hover:border-cyan-500/50 hover:text-cyan-300"
              >
                Cmd: Thinking
              </button>
              <button
                onClick={() => onSimulateCommand({ command: 'set_expression', expression: 'error' })}
                className="p-2 rounded-xl border border-slate-800 bg-black/40 hover:border-red-500/50 hover:text-red-300"
              >
                Cmd: Fault
              </button>
              <button
                onClick={() => onSimulateCommand({ command: 'set_expression', expression: 'wakeup' })}
                className="p-2 rounded-xl border border-slate-800 bg-black/40 hover:border-cyan-500/50 hover:text-cyan-300"
              >
                Cmd: Wake-up
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type robot speech..."
                className="flex-1 bg-black/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => onSimulateCommand({ command: 'speak', text: customText })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30 font-semibold"
              >
                <Send className="w-3.5 h-3.5" /> Speak
              </button>
            </div>
          </div>

          {/* Python ROS 2 / Pi Integration Code Sample */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Integration Protocol (Python / ROS 2):</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
              >
                <Copy className="w-3 h-3" /> {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-black/80 border border-slate-900 text-slate-300 text-[11px] overflow-x-auto leading-relaxed">
              {pythonSnippet}
            </pre>
          </div>

          {/* Event Stream Log */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="font-semibold text-slate-300">Live Hardware Message Log:</span>
            <div className="h-28 overflow-y-auto bg-black/80 border border-slate-900 rounded-xl p-2.5 text-[11px] text-slate-400 space-y-1">
              {logMessages.length === 0 ? (
                <div className="text-slate-600 italic">No events logged yet. Trigger a command above.</div>
              ) : (
                logMessages.map((msg, i) => (
                  <div key={i} className="text-cyan-300/90 font-mono">{msg}</div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

