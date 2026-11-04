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

  const pythonSnippet = `# Python ROS 2 / Jetson / Arduino Hardware Controller
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#30343B] border border-[#B0B4B8]/30 rounded-2xl p-6 shadow-xl flex flex-col text-white overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#B0B4B8]/30">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-[#DCE8E1]" />
            <h2 className="text-base font-bold tracking-wide text-white">Robot Hardware & IPC Integration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#B0B4B8] hover:text-white hover:bg-[#202124] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto space-y-5 py-4 pr-1">
          {/* WebSocket Server Connection */}
          <div className="p-3.5 rounded-xl bg-[#202124] border border-[#B0B4B8]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">WebSocket / Serial Daemon URL:</span>
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
                  <span className="flex items-center gap-1 text-[#B0B4B8] font-bold">
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
                placeholder="ws://172.17.0.1:8080/robot-face"
                className="flex-1 bg-[#17191C] border border-[#B0B4B8]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#174D3A]"
              />
              {connectionStatus === 'connected' ? (
                <button
                  onClick={onDisconnect}
                  className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold transition-colors shadow-sm"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={onConnect}
                  className="px-4 py-2 rounded-lg bg-[#174D3A] hover:bg-[#134232] text-white font-bold transition-colors shadow-sm"
                >
                  Connect
                </button>
              )}
            </div>
            <p className="text-[11px] text-[#B0B4B8]">
              Tip: The UI can also be embedded in an electron/webview or iframe and controlled via standard <code className="text-white">window.postMessage()</code>.
            </p>
          </div>

          {/* Test IPC Commands Simulation */}
          <div className="p-3.5 rounded-xl bg-[#202124] border border-[#B0B4B8]/30 space-y-3">
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <Terminal className="w-4 h-4 text-[#DCE8E1]" />
              <span>Simulate Hardware Commands:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => onSimulateCommand({ command: 'set_expression', expression: 'happy' })}
                className="p-2 rounded-lg border border-[#B0B4B8]/30 bg-[#30343B] hover:border-[#174D3A] hover:text-white transition-colors"
              >
                Cmd: Happy
              </button>
              <button
                onClick={() => onSimulateCommand({ command: 'set_expression', expression: 'thinking' })}
                className="p-2 rounded-lg border border-[#B0B4B8]/30 bg-[#30343B] hover:border-[#174D3A] hover:text-white transition-colors"
              >
                Cmd: Thinking
              </button>
              <button
                onClick={() => onSimulateCommand({ command: 'set_expression', expression: 'error' })}
                className="p-2 rounded-lg border border-[#B0B4B8]/30 bg-[#30343B] hover:border-red-500 hover:text-red-300 transition-colors"
              >
                Cmd: Fault
              </button>
              <button
                onClick={() => onSimulateCommand({ command: 'set_expression', expression: 'wakeup' })}
                className="p-2 rounded-lg border border-[#B0B4B8]/30 bg-[#30343B] hover:border-[#174D3A] hover:text-white transition-colors"
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
                className="flex-1 bg-[#17191C] border border-[#B0B4B8]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#174D3A]"
              />
              <button
                onClick={() => onSimulateCommand({ command: 'speak', text: customText })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#174D3A] hover:bg-[#134232] text-white font-bold transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Speak
              </button>
            </div>
          </div>

          {/* Python ROS 2 / Pi Integration Code Sample */}
          <div className="p-3.5 rounded-xl bg-[#202124] border border-[#B0B4B8]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Integration Protocol (Python / ROS 2):</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-[11px] text-[#DCE8E1] hover:underline font-bold"
              >
                <Copy className="w-3 h-3 text-[#DCE8E1]" /> {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-[#17191C] border border-[#B0B4B8]/20 text-[#B0B4B8] text-[11px] overflow-x-auto leading-relaxed">
              {pythonSnippet}
            </pre>
          </div>

          {/* Event Stream Log */}
          <div className="p-3.5 rounded-xl bg-[#202124] border border-[#B0B4B8]/30 space-y-2">
            <span className="font-semibold text-white">Live Hardware Message Log:</span>
            <div className="h-28 overflow-y-auto bg-[#17191C] border border-[#B0B4B8]/20 rounded-lg p-2.5 text-[11px] text-[#B0B4B8] space-y-1">
              {logMessages.length === 0 ? (
                <div className="text-[#B0B4B8]/60 italic">No events logged yet. Trigger a command above.</div>
              ) : (
                logMessages.map((msg, i) => (
                  <div key={i} className="text-white font-mono">{msg}</div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#B0B4B8]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#174D3A] hover:bg-[#134232] text-white font-bold transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
