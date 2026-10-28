import { useState, useEffect, useRef } from 'react';
import { FaceExpression } from '../types/robot';

interface UseBreathingOptions {
  expression: FaceExpression;
  enabled?: boolean;
}

export function useBreathing({ expression, enabled = true }: UseBreathingOptions) {
  // Breathing multiplier: smoothly oscillates between ~0.88 and 1.12 during idle
  const [breathFactor, setBreathFactor] = useState(1);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !enabled || expression === 'sleep' || expression === 'sleepy') {
      setBreathFactor(1);
      return;
    }

    const startTime = performance.now();
    // 3.8s breathing cycle
    const cycleDuration = 3800;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const phase = (elapsed % cycleDuration) / cycleDuration; // 0 to 1

      // Gentle sine oscillation
      // In idle: subtle 0.90 to 1.10
      // In thinking: reduced glow ~0.75
      let baseGlow = 1;
      let amplitude = 0.1;

      if (expression === 'thinking') {
        baseGlow = 0.78;
        amplitude = 0.05;
      } else if (expression === 'happy') {
        baseGlow = 1.12;
        amplitude = 0.08;
      }

      const oscillation = Math.sin(phase * Math.PI * 2) * amplitude;
      setBreathFactor(baseGlow + oscillation);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [expression, enabled]);

  return breathFactor;
}

