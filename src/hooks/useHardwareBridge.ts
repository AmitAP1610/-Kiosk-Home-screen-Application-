import { useState, useEffect, useRef, useCallback } from 'react';
import { FaceExpression, FaceConfig, HardwareMessage } from '../types/robot';

interface HardwareBridgeProps {
  onExpressionChange: (expression: FaceExpression) => void;
  onSpeak?: (text: string) => void;
  onGazeChange?: (gaze: { x: number; y: number }) => void;
  onConfigChange?: (config: Partial<FaceConfig>) => void;
}

export function useHardwareBridge({
  onExpressionChange,
  onSpeak,
  onGazeChange,
  onConfigChange
}: HardwareBridgeProps) {
  const [wsUrl, setWsUrl] = useState('ws://localhost:8080/robot-face');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'idle'>('idle');
  const [lastMessage, setLastMessage] = useState<HardwareMessage | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogMessages(prev => [ `[${time}] ${msg}`, ...prev.slice(0, 30) ]);
  }, []);

  const handleIncomingPayload = useCallback((raw: string) => {
    try {
      const data: HardwareMessage = JSON.parse(raw);
      setLastMessage(data);

      if (data.command === 'set_expression' && data.expression) {
        onExpressionChange(data.expression);
        addLog(`Command set_expression: ${data.expression}`);
      } else if (data.command === 'speak' && data.text) {
        if (onSpeak) onSpeak(data.text);
        addLog(`Command speak: "${data.text}"`);
      } else if (data.command === 'set_gaze' && data.gaze) {
        if (onGazeChange) onGazeChange(data.gaze);
        addLog(`Command set_gaze: (${data.gaze.x}, ${data.gaze.y})`);
      } else if (data.command === 'configure' && data.config) {
        if (onConfigChange) onConfigChange(data.config);
        addLog(`Command configure updated`);
      } else if (data.command === 'ping') {
        addLog(`Ping received`);
      }
    } catch {
      addLog(`Failed to parse incoming payload: ${raw}`);
    }
  }, [onExpressionChange, onSpeak, onGazeChange, onConfigChange, addLog]);

  // Connect WebSocket
  const connect = useCallback((url = wsUrl) => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    setConnectionStatus('connecting');
    addLog(`Attempting connection to ${url}...`);

    try {
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        addLog(`Connected to Robot IPC server: ${url}`);
      };

      ws.onmessage = (event) => {
        handleIncomingPayload(event.data);
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        addLog('WebSocket connection closed.');
      };

      ws.onerror = () => {
        setConnectionStatus('disconnected');
        addLog(`WebSocket connection error to ${url}`);
      };
    } catch (e: any) {
      setConnectionStatus('disconnected');
      addLog(`Failed to create WebSocket: ${e.message}`);
    }
  }, [wsUrl, handleIncomingPayload, addLog]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setConnectionStatus('idle');
    addLog('Disconnected by user.');
  }, [addLog]);

  // Also listen for window postMessage events (e.g. from ROS webview or parent iframe)
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      if (typeof event.data === 'string' && event.data.startsWith('{')) {
        handleIncomingPayload(event.data);
      } else if (typeof event.data === 'object' && event.data && event.data.command) {
        handleIncomingPayload(JSON.stringify(event.data));
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [handleIncomingPayload]);

  // Simulated hardware packet sender for testing without external daemon
  const simulateHardwareCommand = useCallback((msg: HardwareMessage) => {
    handleIncomingPayload(JSON.stringify(msg));
  }, [handleIncomingPayload]);

  return {
    wsUrl,
    setWsUrl,
    connectionStatus,
    lastMessage,
    logMessages,
    connect,
    disconnect,
    simulateHardwareCommand
  };
}

