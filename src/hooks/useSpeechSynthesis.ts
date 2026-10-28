import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechSynthesisProps {
  onStart?: () => void;
  onEnd?: () => void;
}

export function useSpeechSynthesis({ onStart, onEnd }: UseSpeechSynthesisProps = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [visemeLevel, setVisemeLevel] = useState(0); // 0 to 1 for mouth shape
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Populate voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = useCallback((text: string, rate = 1.0, pitch = 1.05) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    // Cancel current speech if any
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Pick English or clean robotic voice if available
    const voice = availableVoices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David'))) || availableVoices[0];
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (onStart) onStart();

      // Start viseme pulse simulation
      let startTime = performance.now();
      const animateVisemes = (currentTime: number) => {
        const elapsed = (currentTime - startTime) / 1000;
        // Multi-frequency rhythm mimicking human vocal syllables
        const primary = Math.sin(elapsed * 12);
        const secondary = Math.cos(elapsed * 7.5);
        const combined = Math.max(0, (primary + secondary * 0.5) / 1.5);

        setVisemeLevel(combined);
        animFrameRef.current = requestAnimationFrame(animateVisemes);
      };

      animFrameRef.current = requestAnimationFrame(animateVisemes);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setVisemeLevel(0);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setVisemeLevel(0);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }, [availableVoices, onStart, onEnd]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setVisemeLevel(0);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (onEnd) onEnd();
  }, [onEnd]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isSpeaking,
    visemeLevel,
    availableVoices,
    speak,
    stop
  };
}

