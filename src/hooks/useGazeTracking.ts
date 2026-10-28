import { useState, useEffect, useRef } from 'react';
import { FaceExpression, StereoGaze, GazeTarget } from '../types/robot';

interface UseGazeOptions {
  expression: FaceExpression;
  enabled: boolean;
  ambient: boolean;
  eyeSpacing?: number;
  eyeOffsetY?: number;
  eyeSize?: number;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

/**
 * Transforms screen client coordinates (clientX, clientY)
 * into exact SVG viewBox (800 x 500) coordinates.
 */
function screenToSvgCoordinates(
  clientX: number,
  clientY: number,
  svgElement: SVGSVGElement | null
): GazeTarget {
  if (!svgElement) {
    return { x: 400, y: 250 };
  }

  try {
    const pt = svgElement.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgElement.getScreenCTM();
    if (ctm) {
      const transformed = pt.matrixTransform(ctm.inverse());
      return { x: transformed.x, y: transformed.y };
    }
  } catch {}

  // Fallback calculation using bounding rect
  const rect = svgElement.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return { x: 400, y: 250 };
  return {
    x: ((clientX - rect.left) / rect.width) * 800,
    y: ((clientY - rect.top) / rect.height) * 500
  };
}

/**
 * Calculates pupil displacement vector for a specific eye toward the target.
 * Clamps strictly within 10–15% of eye width (13px max) so pupils never leave eye boundaries.
 */
function computeEyeOffset(
  eyeCenterX: number,
  eyeCenterY: number,
  targetX: number,
  targetY: number,
  maxOffset: number
): GazeTarget {
  const dx = targetX - eyeCenterX;
  const dy = targetY - eyeCenterY;
  const dist = Math.hypot(dx, dy);

  if (dist < 0.5) return { x: 0, y: 0 };

  const angle = Math.atan2(dy, dx);
  // Smooth sigmoid/tanh saturation curve: near targets are subtle, far targets softly clamp to maxOffset
  const saturation = Math.tanh(dist / 220);
  const displacement = maxOffset * saturation;

  return {
    x: Math.cos(angle) * displacement,
    y: Math.sin(angle) * displacement
  };
}

export function useGazeTracking({
  expression,
  enabled,
  ambient,
  eyeSpacing = 216,
  eyeOffsetY = -24,
  eyeSize = 52,
  svgRef
}: UseGazeOptions): StereoGaze {
  // Current interpolated pupil offsets for both eyes
  const [gaze, setGaze] = useState<StereoGaze>({
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 }
  });

  // State refs for animation loop
  const targetSvgPosRef = useRef<GazeTarget>({ x: 400, y: 250 });
  const currentLeftRef = useRef<GazeTarget>({ x: 0, y: 0 });
  const currentRightRef = useRef<GazeTarget>({ x: 0, y: 0 });

  // Click tracking and idle return management
  const isClickLockedRef = useRef(false);
  const lastClickClientRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastInteractionTimeRef = useRef<number>(performance.now());
  const animFrameRef = useRef<number | null>(null);

  // Maximum pupil displacement: 12.5% of eye width (2 * eyeSize * 0.125 = 13px)
  const maxDisplacement = eyeSize * 0.25;

  const leftEyeCenter = { x: 400 - eyeSpacing / 2, y: 250 + eyeOffsetY };
  const rightEyeCenter = { x: 400 + eyeSpacing / 2, y: 250 + eyeOffsetY };

  // Pointer and Touch event listeners
  useEffect(() => {
    if (!enabled) return;

    // Pointer down: click or tap anywhere sets immediate locked gaze target
    const handlePointerDown = (e: PointerEvent) => {
      if (expression === 'sleep' || expression === 'sleepy') return;

      const svg = svgRef.current;
      const svgCoords = screenToSvgCoordinates(e.clientX, e.clientY, svg);

      targetSvgPosRef.current = svgCoords;
      isClickLockedRef.current = true;
      lastClickClientRef.current = { x: e.clientX, y: e.clientY };
      lastInteractionTimeRef.current = performance.now();
    };

    // Pointer move: follows cursor/finger movement smoothly
    const handlePointerMove = (e: PointerEvent) => {
      if (expression === 'sleep' || expression === 'sleepy') return;

      // If clicked, maintain look at clicked position until cursor moves again
      if (isClickLockedRef.current) {
        const moveDist = Math.hypot(
          e.clientX - lastClickClientRef.current.x,
          e.clientY - lastClickClientRef.current.y
        );
        // Unlock click hold if user moves mouse more than 5px
        if (moveDist > 5) {
          isClickLockedRef.current = false;
        } else {
          return;
        }
      }

      const svg = svgRef.current;
      const svgCoords = screenToSvgCoordinates(e.clientX, e.clientY, svg);

      targetSvgPosRef.current = svgCoords;
      lastInteractionTimeRef.current = performance.now();
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [enabled, expression, svgRef]);

  // Main animation and interpolation loop
  useEffect(() => {
    let lastTime = performance.now();
    let ambientTimer = 0;
    let ambientOffset = { x: 0, y: 0 };

    const updateGaze = (currentTime: number) => {
      const dt = Math.min(0.1, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      let effectiveTargetSvg = { ...targetSvgPosRef.current };

      // Expression overrides & adjustments
      if (expression === 'thinking') {
        // Look gently upward and slightly left
        const t = currentTime / 1000;
        effectiveTargetSvg = {
          x: 340 + Math.sin(t * 1.2) * 20,
          y: 80 + Math.cos(t * 1.5) * 12
        };
      } else if (expression === 'curious' || expression === 'confused') {
        // Attentive inquisitive tilt
        effectiveTargetSvg = {
          x: targetSvgPosRef.current.x + 30,
          y: targetSvgPosRef.current.y - 20
        };
      } else if (expression === 'sleep' || expression === 'sleepy') {
        // Eyes resting downwards
        effectiveTargetSvg = { x: 400, y: 380 };
      } else {
        // Idle return: gently return toward center (400, 250) after 6s of inactivity
        const timeSinceInteraction = currentTime - lastInteractionTimeRef.current;
        if (timeSinceInteraction > 6000 && !isClickLockedRef.current) {
          targetSvgPosRef.current.x += (400 - targetSvgPosRef.current.x) * (1 - Math.exp(-1.8 * dt));
          targetSvgPosRef.current.y += (250 - targetSvgPosRef.current.y) * (1 - Math.exp(-1.8 * dt));
        }

        // Ambient micro-saccades (natural subtle life when near center)
        if (ambient && enabled) {
          ambientTimer += dt;
          if (ambientTimer > 3.5 + Math.random() * 2.5) {
            ambientTimer = 0;
            ambientOffset = {
              x: (Math.random() - 0.5) * 18,
              y: (Math.random() - 0.5) * 12
            };
          }
          effectiveTargetSvg.x += ambientOffset.x;
          effectiveTargetSvg.y += ambientOffset.y;
        }
      }

      // Calculate target pupil offsets for left and right eyes
      const targetLeftOffset = computeEyeOffset(
        leftEyeCenter.x,
        leftEyeCenter.y,
        effectiveTargetSvg.x,
        effectiveTargetSvg.y,
        maxDisplacement
      );

      const targetRightOffset = computeEyeOffset(
        rightEyeCenter.x,
        rightEyeCenter.y,
        effectiveTargetSvg.x,
        effectiveTargetSvg.y,
        maxDisplacement
      );

      // Frame-rate independent smooth interpolation (speed ~ 7.5 for natural responsiveness)
      const interpolationSpeed = expression === 'thinking' ? 4.0 : 7.5;
      const lerpFactor = 1 - Math.exp(-interpolationSpeed * dt);

      currentLeftRef.current.x += (targetLeftOffset.x - currentLeftRef.current.x) * lerpFactor;
      currentLeftRef.current.y += (targetLeftOffset.y - currentLeftRef.current.y) * lerpFactor;

      currentRightRef.current.x += (targetRightOffset.x - currentRightRef.current.x) * lerpFactor;
      currentRightRef.current.y += (targetRightOffset.y - currentRightRef.current.y) * lerpFactor;

      setGaze({
        left: { x: currentLeftRef.current.x, y: currentLeftRef.current.y },
        right: { x: currentRightRef.current.x, y: currentRightRef.current.y }
      });

      animFrameRef.current = requestAnimationFrame(updateGaze);
    };

    animFrameRef.current = requestAnimationFrame(updateGaze);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    expression,
    enabled,
    ambient,
    maxDisplacement,
    leftEyeCenter.x,
    leftEyeCenter.y,
    rightEyeCenter.x,
    rightEyeCenter.y
  ]);

  return gaze;
}
