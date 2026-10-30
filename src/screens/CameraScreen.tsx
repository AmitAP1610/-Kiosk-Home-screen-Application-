import React, { useState, useRef, useEffect } from 'react';
import { Camera, SwitchCamera, Play, Square, ShieldCheck, AlertTriangle } from 'lucide-react';

export const CameraScreen: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [detectPersons, setDetectPersons] = useState(true);
  const [detectObjects, setDetectObjects] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async (facing = facingMode) => {
    try {
      setErrorMsg(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setErrorMsg(err.message || 'Unable to access tablet camera. Please check permissions.');
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    if (isActive) {
      startCamera(nextFacing);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="w-full h-full bg-black text-slate-100 flex flex-col pt-14 pb-4 px-3 sm:px-6 md:px-10 font-sans select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">CAMERA & COMPUTER VISION</h1>
            <p className="text-xs text-slate-400 font-mono">Realme Tablet Camera • On-Device Visual Understanding</p>
          </div>
        </div>

        {/* Privacy & Camera facing */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-800 bg-slate-900 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Local Processing</span>
          </div>

          <button
            onClick={toggleCameraFacing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900 hover:border-cyan-500/40 text-slate-200 transition-colors"
          >
            <SwitchCamera className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] capitalize">{facingMode === 'user' ? 'Front' : 'Rear'}</span>
          </button>
        </div>
      </div>

      {/* Main Viewport & Video Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 py-4 min-h-0">
        {/* Live Camera Box */}
        <div className="flex-1 relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
          {errorMsg ? (
            <div className="p-6 text-center max-w-sm">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-xs text-slate-300 font-mono mb-3">{errorMsg}</p>
              <button
                onClick={() => startCamera()}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold text-xs"
              >
                Retry Camera
              </button>
            </div>
          ) : isActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
              />
              {/* Simulated Detection Overlays (Ready for MediaPipe / TFLite in Phase 3) */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none font-mono text-[10px]">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-emerald-500/50 text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>FEED ACTIVE ({facingMode === 'user' ? 'FRONT' : 'REAR'})</span>
                </div>
                {detectPersons && (
                  <div className="px-2 py-0.5 rounded bg-black/60 border border-cyan-500/40 text-cyan-300">
                    PERSON DETECTION: ARMED
                  </div>
                )}
                {detectObjects && (
                  <div className="px-2 py-0.5 rounded bg-black/60 border border-cyan-500/40 text-cyan-300">
                    OBJECT CLASSIFIER: ARMED
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center p-6 text-slate-500">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-3">
                <Camera className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300 mb-1">Camera Stream Standby</h3>
              <p className="text-xs text-slate-500 max-w-xs mb-4">
                Access the tablet's RGB camera for person detection, tracking and visual interaction.
              </p>
              <button
                onClick={() => startCamera()}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors flex items-center gap-2 mx-auto"
              >
                <Play className="w-4 h-4 fill-current" />
                START CAMERA
              </button>
            </div>
          )}
        </div>

        {/* Vision Controls Sidebar */}
        <div className="w-full md:w-72 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 text-xs font-mono">
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider mb-2">Vision Controls</h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 cursor-pointer">
                <span>Person Detection</span>
                <input
                  type="checkbox"
                  checked={detectPersons}
                  onChange={(e) => setDetectPersons(e.target.checked)}
                  className="accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 cursor-pointer">
                <span>Object Detection</span>
                <input
                  type="checkbox"
                  checked={detectObjects}
                  onChange={(e) => setDetectObjects(e.target.checked)}
                  className="accent-cyan-400"
                />
              </label>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-800/80 bg-black/40 text-[11px] text-slate-400 space-y-1">
            <span className="text-cyan-300 font-semibold block mb-1">Architectural Notice</span>
            <p>Tablet camera runs on Realme tablet hardware (MediaPipe / TFLite).</p>
            <p className="text-slate-500">Distance measurements are strictly handled by LiDAR on NVIDIA Jetson.</p>
          </div>

          <div className="mt-auto pt-2 border-t border-slate-800 flex gap-2">
            {isActive ? (
              <button
                onClick={stopCamera}
                className="w-full py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-semibold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-1.5"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                STOP CAMERA
              </button>
            ) : (
              <button
                onClick={() => startCamera()}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                START CAMERA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
