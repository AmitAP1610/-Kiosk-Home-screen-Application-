import React from 'react';

interface RobotChassisFrameProps {
  children: React.ReactNode;
  enabled: boolean;
}

/**
 * Photorealistic reference chassis framing.
 * Exactly matches the white/silver polygon-shaped head enclosure with beveled edges,
 * top handle bar, and black glossy screen bezel from the reference image.
 */
export const RobotChassisFrame: React.FC<RobotChassisFrameProps> = ({ children, enabled }) => {
  if (!enabled) {
    return <div className="w-full h-full bg-black flex items-center justify-center">{children}</div>;
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#8f969e] to-[#6a727c] flex items-center justify-center p-3 sm:p-6 md:p-10 select-none overflow-hidden">
      {/* Outer Head Enclosure (Polygonal white/silver casing with beveled edges) */}
      <div className="relative w-full max-w-4xl aspect-[1.32/1] flex items-center justify-center">
        {/* Physical Head SVG Container */}
        <svg
          viewBox="0 0 1000 750"
          className="absolute inset-0 w-full h-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
        >
          <defs>
            {/* White/Silver Chassis Gradient */}
            <linearGradient id="chassisGrad" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#f4f6f9" />
              <stop offset="85%" stopColor="#dde2e8" />
              <stop offset="100%" stopColor="#c2c9d2" />
            </linearGradient>

            {/* Beveled Edge Highlight */}
            <linearGradient id="bevelLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#c5ced8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8c97a5" stopOpacity="0.4" />
            </linearGradient>

            {/* Inner Display Bezel Dark Gradient */}
            <linearGradient id="innerBezelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e2129" />
              <stop offset="40%" stopColor="#111318" />
              <stop offset="100%" stopColor="#050608" />
            </linearGradient>

            {/* Glossy Screen Rim Reflection */}
            <linearGradient id="screenGlassSheen" x1="0%" y1="0%" x2="100%" y2="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.02" />
              <stop offset="65%" stopColor="#00f3ff" stopOpacity="0.015" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            {/* Ambient drop shadow for the handle pass-through */}
            <linearGradient id="handlePassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#484f58" />
              <stop offset="40%" stopColor="#68727d" />
              <stop offset="100%" stopColor="#505761" />
            </linearGradient>
          </defs>

          {/* Outer Polygonal White Head Silhouette (Matches reference photo) */}
          <polygon
            points="
              325,32
              675,32
              875,142
              915,445
              795,685
              205,685
              85,445
              125,142
            "
            fill="url(#chassisGrad)"
            stroke="#ffffff"
            strokeWidth="3.5"
          />

          {/* Top Handle Opening (Oblong cutout with beveled interior) */}
          {/* Studio background seen through handle */}
          <rect
            x="340"
            y="72"
            width="320"
            height="56"
            rx="28"
            fill="url(#handlePassGrad)"
            stroke="#40464f"
            strokeWidth="4"
          />
          {/* Inner handle shadow */}
          <rect
            x="342"
            y="74"
            width="316"
            height="22"
            rx="11"
            fill="#2c323a"
            opacity="0.35"
          />

          {/* Inner Polygonal Beveled Edge (Sculpted Chamfer around screen) */}
          <polygon
            points="
              335,160
              665,160
              845,235
              875,445
              765,655
              235,655
              125,445
              155,235
            "
            fill="#dbe1e8"
            stroke="url(#bevelLight)"
            strokeWidth="3"
          />

          {/* Black Face Display Enclosure Bezel */}
          <polygon
            points="
              352,175
              648,175
              820,245
              848,438
              745,635
              255,635
              152,438
              180,245
            "
            fill="url(#innerBezelGrad)"
            stroke="#0a0c10"
            strokeWidth="5"
          />

          {/* Glossy Black Display Glass Face Area */}
          <polygon
            points="
              365,188
              635,188
              802,254
              828,428
              730,618
              270,618
              172,428
              198,254
            "
            fill="#000000"
          />

          {/* Glossy Glass Reflection Overlay */}
          <polygon
            points="
              365,188
              635,188
              802,254
              828,428
              730,618
              270,618
              172,428
              198,254
            "
            fill="url(#screenGlassSheen)"
            className="pointer-events-none"
          />
        </svg>

        {/* Digital Screen Display Area mapped into the black screen bezel */}
        <div
          className="relative z-10 w-[69%] h-[60%] rounded-3xl overflow-hidden flex items-center justify-center bg-black shadow-[inset_0_0_40px_rgba(0,0,0,0.95)]"
          style={{ transform: 'translateY(55px)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
