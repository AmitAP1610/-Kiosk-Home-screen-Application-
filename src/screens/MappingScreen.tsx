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

      // Range Labels in Silver Grey (#B0B4B8)
      ctx.fillStyle = '#B0B4B8';
      ctx.font = '10px monospace';
      ctx.fillText('1.0m', centerX + (radius / 4) - 10, centerY - 4);
      ctx.fillText('2.0m', centerX + (radius / 2) - 10, centerY - 4);
      ctx.fillText('3.0m', centerX + (radius * 0.75) - 10, centerY - 4);
      ctx.fillText('4.0m', centerX + radius - 15, centerY - 4);

      if (lidarConnected) {
        // Radar Sweep beam in Industrial Amber (#D49A36)
        sweepAngle = (sweepAngle + 0.04) % (Math.PI * 2);
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(212, 154, 54, 0.45)');
        gradient.addColorStop(1, 'rgba(212, 154, 54, 0.0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, sweepAngle - 0.4, sweepAngle);
        ctx.closePath();
        ctx.fill();

        // Sample LiDAR points in White / Silver
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

      // Heading arrow in Industrial Amber (#D49A36)
      ctx.strokeStyle = '#D49A36';
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
    <div className="w-full h-full bg-[#F2F2EF] text-[#30343B] flex flex-col p-4 sm:p-6 font-sans select-none overflow-hidden">
      {/* Header: Industrial Primary Bar */}
      <div className="flex items-center justify-between pb-3 bg-[#30343B] text-white p-3.5 rounded-xl mb-4 border border-[#B0B4B8]/30 shadow-sm">
        <div className="flex items-center gap-2.5">
          {onNavigate && (
            <button
              onClick={() => onNavigate('hub')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#202124] hover:bg-[#17191C] border border-[#B0B4B8]/40 text-white transition-all text-xs font-bold mr-1"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#D49A36]" />
              <span>Back to Hub</span>
            </button>
          )}

          <div className="p-2 rounded-lg bg-[#202124] border border-[#B0B4B8]/30 text-[#D49A36]">
            <Radar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">LiDAR & MAPPING</h1>
            <p className="text-[11px] text-[#B0B4B8] font-mono">Telemetry streamed from Jetson ROS 2 SLAM Toolbox</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold ${
            lidarConnected
              ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300'
              : 'bg-[#202124] border-[#B0B4B8]/30 text-[#B0B4B8]'
          }`}>
            {lidarConnected ? 'LIDAR STREAM ACTIVE' : 'LIDAR STANDBY'}
          </span>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 py-2 min-h-0">
        {/* Canvas Display: Dark Component #202124 */}
        <div className="flex-1 bg-[#202124] rounded-xl border border-[#B0B4B8]/40 flex items-center justify-center p-2 relative overflow-hidden shadow-sm">
          <canvas
            ref={canvasRef}
            width={600}
            height={460}
            className="w-full h-full max-w-[600px] max-h-[460px] object-contain rounded-lg"
          />
        </div>

        {/* Map Management Sidebar: Crisp White Card */}
        <div className="w-full md:w-72 bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 rounded-xl p-4 flex flex-col gap-4 font-mono text-xs shadow-sm">
          <div>
            <h3 className="font-bold text-[#30343B] uppercase tracking-wider mb-2 text-xs">Saved Maps</h3>
            <div className="space-y-1.5">
              <button className="w-full p-2.5 rounded-lg border border-[#D49A36] bg-[#D49A36] text-[#202124] font-bold text-left flex items-center justify-between shadow-sm">
                <span>Living Room & Hall</span>
                <span className="text-[10px] text-[#202124] uppercase font-bold">Active</span>
              </button>
              <button className="w-full p-2.5 rounded-lg border border-[#B0B4B8]/40 bg-[#F2F2EF] text-[#30343B] text-left hover:border-[#D49A36] transition-colors">
                <span>Office Floor 1</span>
              </button>
              <button className="w-full p-2.5 rounded-lg border border-[#B0B4B8]/40 bg-[#F2F2EF] text-[#30343B] text-left hover:border-[#D49A36] transition-colors">
                <span>Lab Test Arena</span>
              </button>
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <button className="w-full py-2.5 rounded-lg border border-[#30343B] bg-[#30343B] hover:bg-[#202124] text-white font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm">
              <Save className="w-4 h-4 text-[#D49A36]" />
              <span>SAVE CURRENT MAP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
