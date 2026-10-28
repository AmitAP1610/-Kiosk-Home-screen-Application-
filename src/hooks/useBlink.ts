import { useState, useEffect, useRef, useCallback } from 'react';
import { FaceExpression } from '../types/robot';

export const BLINK_CONFIG = {
  minInterval: 3700,
  maxInterval: 4300,
  closeDuration: 80,
  closedDuration: 40,
  openDuration: 100,
  recoveryDuration: 200,
  doubleBlinkPause: 150,
  doubleBlinkProbability: 0.10
};

interface UseBlinkOptions {
  expression: FaceExpression;
  onWakeupComplete?: () => void;
}

export function useBlink({
  expression,
  onWakeupComplete
}: UseBlinkOptions) {
  // eyelidProgress: 0 = fully open, 1 = fully closed
  const [eyelidProgress, setEyelidProgress] = useState(0);

  // Animation frame & timer references for safe cleanup
  const animFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // State guards
  const isBlinkingRef = useRef(false);
  const normalBlinkCountRef = useRef(0);
  const isMountedRef = useRef(true);
  const currentExpressionRef = useRef(expression);

  useEffect(() => {
    currentExpressionRef.current = expression;
  }, [expression]);

  // Smooth Hermite interpolation (smoothstep: 3t^2 - 2t^3)
  const smoothStep = (t: number) => {
    const clamped = Math.max(0, Math.min(1, t));
    return clamped * clamped * (3 - 2 * clamped);
  };

  // Perform a single 220ms blink (80ms close + 40ms closed + 100ms open)
  const executeSingleBlink = useCallback((onComplete: () => void) => {
    isBlinkingRef.current = true;
    const startTime = performance.now();

    const { closeDuration, closedDuration, openDuration } = BLINK_CONFIG;
    const totalBlinkDuration = closeDuration + closedDuration + openDuration; // 220ms

    const animate = (currentTime: number) => {
      if (!isMountedRef.current) return;

      const elapsed = currentTime - startTime;

      if (elapsed < closeDuration) {
        // Phase 1: Closing (80 ms) -> progress 0 to 1
        const t = elapsed / closeDuration;
        setEyelidProgress(smoothStep(t));
        animFrameRef.current = requestAnimationFrame(animate);
      } else if (elapsed < closeDuration + closedDuration) {
        // Phase 2: Fully closed (40 ms) -> progress = 1
        setEyelidProgress(1);
        animFrameRef.current = requestAnimationFrame(animate);
      } else if (elapsed < totalBlinkDuration) {
        // Phase 3: Opening (100 ms) -> progress 1 to 0
        const t = (elapsed - closeDuration - closedDuration) / openDuration;
        setEyelidProgress(1 - smoothStep(t));
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Complete single blink
        setEyelidProgress(0);
        isBlinkingRef.current = false;
        onComplete();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // Main sequence orchestrator
  useEffect(() => {
    isMountedRef.current = true;

    // Handle Sleep state: keep eyes closed until wake-up
    if (expression === 'sleep' || expression === 'sleepy') {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setEyelidProgress(1);
      isBlinkingRef.current = false;
      return;
    }

    // Handle Wake-up state: smooth 1-second opening sequence
    if (expression === 'wakeup') {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      isBlinkingRef.current = true;
      setEyelidProgress(1);

      const wakeDuration = 1000;
      const startTime = performance.now();

      const animateWake = (now: number) => {
        if (!isMountedRef.current) return;
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / wakeDuration);

        // Smooth opening from bottom up (progress 1 -> 0)
        const t = p - 1;
        const curve = -(t * t * t);
        setEyelidProgress(Math.max(0, Math.min(1, curve)));

        if (p < 1) {
          animFrameRef.current = requestAnimationFrame(animateWake);
        } else {
          setEyelidProgress(0);
          isBlinkingRef.current = false;
          if (onWakeupComplete) onWakeupComplete();
        }
      };

      animFrameRef.current = requestAnimationFrame(animateWake);
      return;
    }

    // Normal active states: Idle, Listening, Thinking, Speaking, Happy, Curious, Surprised
    const scheduleNextBlink = () => {
      if (!isMountedRef.current) return;
      if (currentExpressionRef.current === 'sleep' || currentExpressionRef.current === 'sleepy') return;

      // Choose randomized interval between 3,700 and 4,300 ms (averaging 4,000 ms)
      const { minInterval, maxInterval } = BLINK_CONFIG;
      const nextInterval = minInterval + Math.random() * (maxInterval - minInterval);

      timeoutRef.current = window.setTimeout(() => {
        if (!isMountedRef.current) return;
        if (currentExpressionRef.current === 'sleep' || currentExpressionRef.current === 'sleepy') return;

        // Perform first blink (220 ms total)
        executeSingleBlink(() => {
          if (!isMountedRef.current) return;
          if (currentExpressionRef.current === 'sleep' || currentExpressionRef.current === 'sleepy') return;

          normalBlinkCountRef.current += 1;

          // Check if double blink should be triggered (approx once every 8–12 cycles)
          const shouldDoubleBlink =
            normalBlinkCountRef.current >= 8 &&
            (normalBlinkCountRef.current >= 12 || Math.random() < BLINK_CONFIG.doubleBlinkProbability);

          if (shouldDoubleBlink) {
            normalBlinkCountRef.current = 0;

            // Pause with eyes open: 150 ms
            timeoutRef.current = window.setTimeout(() => {
              if (!isMountedRef.current) return;
              if (currentExpressionRef.current === 'sleep' || currentExpressionRef.current === 'sleepy') return;

              // Second blink: 220 ms total
              executeSingleBlink(() => {
                if (!isMountedRef.current) return;

                // Recovery period: 200 ms before resuming normal wait interval
                timeoutRef.current = window.setTimeout(() => {
                  scheduleNextBlink();
                }, BLINK_CONFIG.recoveryDuration);
              });
            }, BLINK_CONFIG.doubleBlinkPause);
          } else {
            // Normal recovery period: 200 ms
            timeoutRef.current = window.setTimeout(() => {
              scheduleNextBlink();
            }, BLINK_CONFIG.recoveryDuration);
          }
        });
      }, nextInterval);
    };

    // Begin sequence if not already in the middle of a blink
    if (!isBlinkingRef.current) {
      scheduleNextBlink();
    }

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [expression, executeSingleBlink, onWakeupComplete]);

  return eyelidProgress;
}
