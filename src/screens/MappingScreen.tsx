import React, { useRef, useEffect } from 'react';
import { Radar, Save, ArrowLeft } from 'lucide-react';

interface MappingScreenProps {
  onNavigate?: (screen: any) => void;
  lidarConnected?: boolean;
}

export const MappingScreen: React.FC<MappingScreenProps> = ({ onNavigate, lidarConnected = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let sweepAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 30;

      // Concentric Distance Rings in Charcoal (#30343B)
      ctx.strokeStyle = '#30343B';
      ctx.lineWidth = 1;

      for (let r = radius / 4; r <= radius; r += radius / 4) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs in Charcoal (#30343B)
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.stroke();

      // Range Labels in Soft Grey (#E9EDF2)
      ctx.fillStyle = '#85909B';
      ctx.font = '10px monospace';
      ctx.fillText('1.0m', centerX + (radius / 4) - 10, centerY - 4);
      ctx.fillText('2.0m', centerX + (radius / 2) - 10, centerY - 4);
      ctx.fillText('3.0m', centerX + (radius * 0.75) - 10, centerY - 4);
      ctx.fillText('4.0m', centerX + radius - 15, centerY - 4);

      if (lidarConnected) {
        // Radar Sweep beam in Navy Blue (#263746) with Gold tint
        sweepAngle = (sweepAngle + 0.04) % (Math.PI * 2);
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(196, 154, 69, 0.45)');
        gradient.addColorStop(1, 'rgba(38, 55, 70, 0.0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, sweepAngle - 0.4, sweepAngle);
        ctx.closePath();
        ctx.fill();

        // Sample LiDAR points in White
        ctx.fillStyle = '#FFFFFF';
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
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Heading arrow in Gold (#C49A45)
      ctx.strokeStyle = '#C49A45';
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
            <Radar className="w-5 h-5 text-[#C49A45]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight">LiDAR & Mapping</h1>
            <p className="text-[12px] text-[#E9EDF2]/80 font-mono">Telemetry streamed from Jetson ROS 2 SLAM Toolbox</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold ${
            lidarConnected
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
              : 'bg-[#30343B] border-white/10 text-[#E9EDF2]/70'
          }`}>
            {lidarConnected ? 'LIDAR STREAM ACTIVE' : 'LIDAR STANDBY'}
          </span>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 py-2 min-h-0">
        {/* Canvas Display: Dark Component #202124 */}
        <div className="flex-1 bg-[#202124] rounded-xl border border-[#30343B] flex items-center justify-center p-2 relative overflow-hidden shadow-sm">
          <canvas
            ref={canvasRef}
            width={600}
            height={460}
            className="w-full h-full max-w-[600px] max-h-[460px] object-contain rounded-lg"
          />
        </div>

        {/* Map Management Sidebar: White Card */}
        <div className="w-full md:w-72 bg-white text-[#30343B] border border-[#E9EDF2] rounded-xl p-4 flex flex-col gap-4 font-mono text-xs shadow-sm">
          <div>
            <h3 className="font-bold text-[#30343B] uppercase tracking-wider mb-2 text-xs">Saved Maps</h3>
            <div className="space-y-1.5">
              <button className="w-full p-2.5 min-h-[44px] rounded-lg border border-[#263746] bg-[#263746] text-white font-semibold text-left flex items-center justify-between shadow-sm">
                <span>Living Room & Hall</span>
                <span className="text-[10px] text-[#C49A45] uppercase font-bold">Active</span>
              </button>
              <button className="w-full p-2.5 min-h-[44px] rounded-lg border border-[#E9EDF2] bg-white text-[#30343B] text-left hover:border-[#263746] transition-colors">
                <span>Office Floor 1</span>
              </button>
              <button className="w-full p-2.5 min-h-[44px] rounded-lg border border-[#E9EDF2] bg-white text-[#30343B] text-left hover:border-[#263746] transition-colors">
                <span>Lab Test Arena</span>
              </button>
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <button className="w-full min-h-[44px] py-2.5 rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm">
              <Save className="w-4 h-4 text-[#C49A45]" strokeWidth={1.75} />
              <span>SAVE CURRENT MAP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
