import React, { useRef, useState, useEffect } from 'react';
import { Camera, ShieldCheck, SwitchCamera, AlertTriangle, Play, Square, ArrowLeft } from 'lucide-react';

interface CameraScreenProps {
  onNavigate?: (screen: any) => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ onNavigate }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [detectPersons, setDetectPersons] = useState(true);
  const [detectObjects, setDetectObjects] = useState(false);

  const startCamera = async (facing: 'user' | 'environment' = facingMode) => {
    try {
      setErrorMsg(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(newStream);
      setIsActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.error('Camera stream access failed:', err);
      setErrorMsg(
        err.name === 'NotAllowedError'
          ? 'Permission denied. Please allow camera permissions on the Realme tablet.'
          : 'Unable to start camera stream. Verify video device connectivity.'
      );
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsActive(false);
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (isActive) {
      startCamera(nextMode);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-4 sm:p-5 md:p-6 font-sans select-none overflow-hidden">
      {/* Header: Navy Blue Structural Bar (#263746) */}
      <div className="flex items-center justify-between pb-3 bg-[#263746] text-white p-3.5 rounded-xl mb-4 border border-white/10 shadow-sm">
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
            <Camera className="w-5 h-5 text-[#C49A45]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight">Camera & Vision</h1>
            <p className="text-[12px] text-[#E9EDF2]/80 font-mono">Realme Tablet Camera • On-Device Visual Understanding</p>
          </div>
        </div>

        {/* Privacy & Camera facing */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 bg-[#30343B] text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Local Processing</span>
          </div>

          <button
            onClick={toggleCameraFacing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 bg-[#30343B] hover:bg-[#202124] text-white transition-colors"
          >
            <SwitchCamera className="w-3.5 h-3.5 text-[#C49A45]" />
            <span className="text-[11px] capitalize">{facingMode === 'user' ? 'Front' : 'Rear'}</span>
          </button>
        </div>
      </div>

      {/* Main Viewport & Video Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 py-2 min-h-0">
        {/* Live Camera Box: Dark Component #202124 */}
        <div className="flex-1 relative bg-[#202124] rounded-xl border border-[#30343B] overflow-hidden flex items-center justify-center shadow-sm">
          {errorMsg ? (
            <div className="p-6 text-center max-w-sm">
              <AlertTriangle className="w-8 h-8 text-[#C49A45] mx-auto mb-2" />
              <p className="text-xs text-[#E9EDF2]/80 font-mono mb-3">{errorMsg}</p>
              <button
                onClick={() => startCamera()}
                className="px-4 py-2 rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white font-medium text-xs transition-colors shadow-sm"
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
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none font-mono text-[10px]">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 border border-emerald-500/50 text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>FEED ACTIVE ({facingMode === 'user' ? 'FRONT' : 'REAR'})</span>
                </div>
                {detectPersons && (
                  <div className="px-2 py-0.5 rounded bg-black/70 border border-white/20 text-white">
                    PERSON DETECTION: ARMED
                  </div>
                )}
                {detectObjects && (
                  <div className="px-2 py-0.5 rounded bg-black/70 border border-white/20 text-white">
                    OBJECT CLASSIFIER: ARMED
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center p-6 text-[#E9EDF2]/80">
              <div className="w-16 h-16 rounded-xl bg-[#30343B] border border-white/10 flex items-center justify-center mx-auto mb-3">
                <Camera className="w-8 h-8 text-[#E9EDF2]" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Camera Stream Standby</h3>
              <p className="text-xs text-[#E9EDF2]/70 max-w-xs mb-4">
                Access the tablet's RGB camera for person detection, tracking and visual interaction.
              </p>
              <button
                onClick={() => startCamera()}
                className="px-5 py-2.5 rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white font-medium text-xs transition-colors flex items-center gap-2 mx-auto shadow-sm"
              >
                <Play className="w-4 h-4 fill-current text-white" />
                START CAMERA
              </button>
            </div>
          )}
        </div>

        {/* Vision Controls Sidebar: White Card */}
        <div className="w-full md:w-72 bg-white text-[#30343B] border border-[#E9EDF2] rounded-xl p-4 flex flex-col gap-4 text-xs font-mono shadow-sm">
          <div>
            <h3 className="font-bold text-[#30343B] uppercase tracking-wider mb-2 text-xs">Vision Controls</h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#E9EDF2] bg-white cursor-pointer">
                <span className="text-[#30343B] font-semibold">Person Detection</span>
                <input
                  type="checkbox"
                  checked={detectPersons}
                  onChange={(e) => setDetectPersons(e.target.checked)}
                  className="accent-[#263746]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#E9EDF2] bg-white cursor-pointer">
                <span className="text-[#30343B] font-semibold">Object Detection</span>
                <input
                  type="checkbox"
                  checked={detectObjects}
                  onChange={(e) => setDetectObjects(e.target.checked)}
                  className="accent-[#263746]"
                />
              </label>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-[#E9EDF2] bg-[#E9EDF2]/40 text-[11px] text-[#606B76] space-y-1">
            <span className="text-[#30343B] font-semibold block mb-1">Architectural Notice</span>
            <p>Tablet camera runs on Realme tablet hardware (MediaPipe / TFLite).</p>
            <p>Distance measurements are strictly handled by LiDAR on NVIDIA Jetson.</p>
          </div>

          <div className="mt-auto pt-2 border-t border-[#E9EDF2] flex gap-2">
            {isActive ? (
              <button
                onClick={stopCamera}
                className="w-full min-h-[44px] py-2.5 rounded-lg bg-[#B42318] hover:bg-red-800 text-white font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                STOP CAMERA
              </button>
            ) : (
              <button
                onClick={() => startCamera()}
                className="w-full min-h-[44px] py-2.5 rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current text-white" />
                START CAMERA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
