import React, { useMemo } from 'react';
import { FaceConfig, FaceExpression } from '../../types/robot';

interface RobotMouthProps {
  config: FaceConfig;
  expression: FaceExpression;
  visemeLevel?: number; // 0 to 1 for speech sync
  breathFactor?: number;
}

export const RobotMouth: React.FC<RobotMouthProps> = ({
  config,
  expression,
  visemeLevel = 0,
  breathFactor = 1
}) => {
  const {
    mouthWidth,
    mouthOffsetY,
    mouthCurve,
    primaryColor,
    errorColor
  } = config;

  const isError = expression === 'error';
  const isSleep = expression === 'sleep' || expression === 'sleepy';
  const isSpeaking = expression === 'speaking' || visemeLevel > 0.05;
  const isHappy = expression === 'happy';
  const isThinking = expression === 'thinking';
  const isListening = expression === 'listening' || expression === 'attentive';
  const isSurprised = expression === 'surprised';

  const activeColor = isError ? errorColor : primaryColor;

  const centerX = 400;
  const centerY = 250 + mouthOffsetY;

  // Compute smooth mouth path and stroke (100% clean SVG vector lines, zero rectangular filters)
  const { pathD, strokeWidth, fill, isClosedShape } = useMemo(() => {
    const halfW = mouthWidth / 2;

    if (isSpeaking) {
      // Subtle natural speech mouth opening (proportional, not exaggerated)
      const openAmount = Math.max(0.08, visemeLevel);
      const apertureH = 2 + openAmount * 9;
      const talkingW = halfW * (0.92 + openAmount * 0.1);

      if (openAmount > 0.45) {
        // Small speaking rounded oval
        return {
          pathD: `M ${-talkingW},0 C ${-talkingW},${apertureH} ${talkingW},${apertureH} ${talkingW},0 C ${talkingW},${-apertureH * 0.45} ${-talkingW},${-apertureH * 0.45} ${-talkingW},0 Z`,
          strokeWidth: 3.8,
          fill: activeColor,
          isClosedShape: true
        };
      } else {
        // Speaking gentle smiling aperture
        return {
          pathD: `M ${-talkingW},0 C ${-talkingW * 0.45},${mouthCurve + apertureH * 0.4} ${talkingW * 0.45},${mouthCurve + apertureH * 0.4} ${talkingW},0`,
          strokeWidth: 4.2,
          fill: 'none',
          isClosedShape: false
        };
      }
    }

    if (isSurprised) {
      // Small, polite surprise 'o' mouth
      const r = 6.5;
      return {
        pathD: `M 0,${-r} C ${r * 1.25},${-r} ${r * 1.25},${r} 0,${r} C ${-r * 1.25},${r} ${-r * 1.25},${-r} 0,${-r} Z`,
        strokeWidth: 3.5,
        fill: 'none',
        isClosedShape: true
      };
    }

    if (isHappy) {
      // Cheerful, slightly wider smile
      const hw = halfW * 1.2;
      const hc = mouthCurve * 1.25;
      return {
        pathD: `M ${-hw},-1.5 C ${-hw * 0.45},${hc} ${hw * 0.45},${hc} ${hw},-1.5`,
        strokeWidth: 4.6,
        fill: 'none',
        isClosedShape: false
      };
    }

    if (isThinking) {
      // Neutral contemplative line with slight friendly curve
      const tw = halfW * 0.88;
      return {
        pathD: `M ${-tw},0 Q 0,4 ${tw},0`,
        strokeWidth: 3.8,
        fill: 'none',
        isClosedShape: false
      };
    }

    if (isListening) {
      // Minimal, attentive subtle smile
      const lw = halfW * 0.92;
      return {
        pathD: `M ${-lw},0 C ${-lw * 0.45},${mouthCurve * 0.85} ${lw * 0.45},${mouthCurve * 0.85} ${lw},0`,
        strokeWidth: 4,
        fill: 'none',
        isClosedShape: false
      };
    }

    if (isSleep) {
      // Relaxed subtle sleeping line
      const sw = halfW * 0.72;
      return {
        pathD: `M ${-sw},0 Q 0,1.8 ${sw},0`,
        strokeWidth: 3.2,
        fill: 'none',
        isClosedShape: false
      };
    }

    if (isError) {
      // Restrained diagnostic straight line
      const ew = halfW * 0.8;
      return {
        pathD: `M ${-ew},0 L ${ew},0`,
        strokeWidth: 3.8,
        fill: 'none',
        isClosedShape: false
      };
    }

    // Default Neutral / Idle: Small, elegant, smooth cyan-blue smile
    return {
      pathD: `M ${-halfW},0 C ${-halfW * 0.5},${mouthCurve} ${halfW * 0.5},${mouthCurve} ${halfW},0`,
      strokeWidth: 4.2,
      fill: 'none',
      isClosedShape: false
    };
  }, [
    isSpeaking,
    visemeLevel,
    isSurprised,
    isHappy,
    isThinking,
    isListening,
    isSleep,
    isError,
    mouthWidth,
    mouthCurve,
    activeColor
  ]);

  return (
    <g
      id="robot-mouth"
      transform={`translate(${centerX}, ${centerY})`}
      className="transition-all duration-200 ease-out"
      opacity={isSleep ? 0.28 : 1}
    >
      {/* 1. Soft Outer Glow Stroke (Zero rectangular filters, pure smooth vector) */}
      <path
        d={pathD}
        fill={fill}
        stroke={activeColor}
        strokeWidth={strokeWidth + 6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.2 * breathFactor}
      />

      {/* 2. Mid Glow Stroke */}
      <path
        d={pathD}
        fill={fill}
        stroke={activeColor}
        strokeWidth={strokeWidth + 2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.48 * breathFactor}
      />

      {/* 3. Crisp Cyan Core Stroke */}
      <path
        d={pathD}
        fill={fill}
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.96}
      />

      {/* 4. Precision White Core Highlight */}
      {!isClosedShape && (
        <path
          d={pathD}
          fill="none"
          stroke="#ffffff"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeOpacity={0.65 * breathFactor}
        />
      )}
    </g>
  );
};

