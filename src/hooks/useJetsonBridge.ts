import { useState, useEffect, useCallback } from 'react';
import {
  jetsonBridge,
  JetsonBridgeState,
  OccupancyGrid,
  NavPathPoint
} from '../services/jetsonBridge';

export function useJetsonBridge() {
  const [bridgeState, setBridgeState] = useState<JetsonBridgeState>(() => jetsonBridge.getState());
  const [mapGrid, setMapGrid] = useState<OccupancyGrid | null>(null);
  const [laserScanPoints, setLaserScanPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [navPath, setNavPath] = useState<NavPathPoint[]>([]);

  useEffect(() => {
    // Auto-connect to Jetson on mount if not already connected
    jetsonBridge.connect();

    const unsubState = jetsonBridge.subscribeState((newState) => {
      setBridgeState(newState);
    });

    const unsubMap = jetsonBridge.subscribeMap((grid) => {
      setMapGrid(grid);
    });

    const unsubScan = jetsonBridge.subscribeScan((points) => {
      setLaserScanPoints(points);
    });

    const unsubPath = jetsonBridge.subscribePath((path) => {
      setNavPath(path);
    });

    return () => {
      unsubState();
      unsubMap();
      unsubScan();
      unsubPath();
    };
  }, []);

  const setUrl = useCallback((url: string) => {
    jetsonBridge.setUrl(url);
  }, []);

  const connect = useCallback((url?: string) => {
    jetsonBridge.connect(url);
  }, []);

  const disconnect = useCallback(() => {
    jetsonBridge.disconnect();
  }, []);

  const reconnect = useCallback(() => {
    jetsonBridge.reconnect();
  }, []);

  const startTeleop = useCallback((linear: number, angular: number) => {
    jetsonBridge.startTeleop(linear, angular);
  }, []);

  const updateVelocity = useCallback((linear: number, angular: number) => {
    jetsonBridge.updateVelocity(linear, angular);
  }, []);

  const stopTeleop = useCallback(() => {
    jetsonBridge.stopTeleop();
  }, []);

  const emergencyStop = useCallback(() => {
    jetsonBridge.emergencyStop();
  }, []);

  const sendNavGoal = useCallback((x: number, y: number, yaw?: number, label?: string) => {
    jetsonBridge.sendNavGoal(x, y, yaw ?? 0, label);
  }, []);

  const cancelNavGoal = useCallback(() => {
    jetsonBridge.cancelNavGoal();
  }, []);

  return {
    ...bridgeState,
    mapGrid,
    laserScanPoints,
    navPath,
    setUrl,
    connect,
    disconnect,
    reconnect,
    startTeleop,
    updateVelocity,
    stopTeleop,
    emergencyStop,
    sendNavGoal,
    cancelNavGoal
  };
}

