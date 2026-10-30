import React, { useRef, useEffect } from 'react';
import { Radar, Save } from 'lucide-react';

interface MappingScreenProps {
  lidarConnected?: boolean;
}

export const MappingScreen: React.FC<MappingScreenProps> = ({
  lidarConnected = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw futuristic polar radar grid on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    let animId: number;
    let sweepAngle = 0;

    const render = () => {
      ctx.fillStyle = '#020609';
      ctx.fillRect(0, 0, width, height);

      // Radar Concentric Circles
      ctx.strokeStyle = '#0b2633';
      ctx.lineWidth = 1;

      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 4) * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.stroke();

      // Range Labels
      ctx.fillStyle = '#00f3ff';
      ctx.font = '10px monospace';
      ctx.fillText('1.0m', centerX + (radius / 4) - 10, centerY - 4);
      ctx.fillText('2.0m', centerX + (radius / 2) - 10, centerY - 4);
      ctx.fillText('3.0m', centerX + (radius * 0.75) - 10, centerY - 4);
      ctx.fillText('4.0m', centerX + radius - 15, centerY - 4);

      if (lidarConnected) {
        // Radar Sweep beam
        sweepAngle = (sweepAngle + 0.04) % (Math.PI * 2);
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(0, 243, 255, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 243, 255, 0.0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, sweepAngle - 0.4, sweepAngle);
        ctx.closePath();
        ctx.fill();

        // Sample LiDAR points
        ctx.fillStyle = '#00f3ff';
        for (let i = 0; i < 360; i += 6) {
          const a = (i * Math.PI) / 180;
          const dist = (radius * 0.4) + Math.sin(a * 4) * (radius * 0.2) + Math.cos(a * 7) * 15;
          const px = centerX + Math.cos(a) * dist;
          const py = centerY + Math.sin(a) * dist;

          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Robot Icon in Center
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Heading arrow
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX, centerY - 14);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [lidarConnected]);

  return (
    <div className="w-full h-full bg-black text-slate-100 flex flex-col pt-14 pb-4 px-3 sm:px-6 md:px-10 font-sans select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <Radar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">LiDAR & MAPPING</h1>
            <p className="text-xs text-slate-400 font-mono">Telemetry streamed from Jetson ROS 2 SLAM Toolbox</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold ${
            lidarConnected
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            {lidarConnected ? 'LIDAR STREAM ACTIVE' : 'LIDAR STANDBY'}
          </span>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 py-4 min-h-0">
        {/* Canvas Display */}
        <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={460}
            className="w-full h-full max-w-[600px] max-h-[460px] object-contain rounded-xl"
          />
        </div>

        {/* Map Management Sidebar */}
        <div className="w-full md:w-72 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs">
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider mb-2">Saved Maps</h3>
            <div className="space-y-1.5">
              <button className="w-full p-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/20 text-cyan-200 text-left flex items-center justify-between">
                <span>Living Room & Hall</span>
                <span className="text-[10px] text-cyan-400">Active</span>
              </button>
              <button className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 text-left hover:border-slate-700">
                <span>Office Floor 1</span>
              </button>
              <button className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 text-left hover:border-slate-700">
                <span>Lab Test Arena</span>
              </button>
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <button className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:border-cyan-500/40 text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition-colors">
              <Save className="w-4 h-4 text-cyan-400" />
              <span>SAVE CURRENT MAP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
