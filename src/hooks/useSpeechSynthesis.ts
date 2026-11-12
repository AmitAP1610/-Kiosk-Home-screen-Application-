import { useState, useEffect, useCallback } from 'react';
import { textToSpeech, TTSOptions } from '../services/textToSpeech';

interface UseSpeechSynthesisProps {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export const DEFAULT_BARITONE_CONFIG = {
  pitch: 0.74, // Deep baritone pitch matching uploaded sample ("I fear darkness hunts us...")
  rate: 0.86,  // Measured authoritative pace
  volume: 1.0,
  version: 'baritone_default_v6'
};

export function useSpeechSynthesis({
  onStart,
  onEnd,
  onError
}: UseSpeechSynthesisProps = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [visemeLevel, setVisemeLevel] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Default to Baritone Voice matching uploaded sample
  const [selectedVoice, setSelectedVoice] = useState<string>(() => {
    const version = localStorage.getItem('kiosk_voice_version');
    if (version === DEFAULT_BARITONE_CONFIG.version) {
      return localStorage.getItem('kiosk_tts_voice') || '';
    }
    return '';
  });

  const [rate, setRateState] = useState<number>(() => {
    const version = localStorage.getItem('kiosk_voice_version');
    if (version === DEFAULT_BARITONE_CONFIG.version) {
      const saved = localStorage.getItem('kiosk_tts_rate');
      if (saved) return parseFloat(saved);
    }
    return DEFAULT_BARITONE_CONFIG.rate;
  });

  const [pitch, setPitchState] = useState<number>(() => {
    const version = localStorage.getItem('kiosk_voice_version');
    if (version === DEFAULT_BARITONE_CONFIG.version) {
      const saved = localStorage.getItem('kiosk_tts_pitch');
      if (saved) return parseFloat(saved);
    }
    return DEFAULT_BARITONE_CONFIG.pitch;
  });

  const [volume, setVolumeState] = useState<number>(() => {
    const version = localStorage.getItem('kiosk_voice_version');
    if (version === DEFAULT_BARITONE_CONFIG.version) {
      const saved = localStorage.getItem('kiosk_tts_volume');
      if (saved) return parseFloat(saved);
    }
    return DEFAULT_BARITONE_CONFIG.volume;
  });

  const isSupported = textToSpeech.isSupported();

  useEffect(() => {
    // Migration: enforce the default baritone voice settings across all client devices
    const version = localStorage.getItem('kiosk_voice_version');
    if (version !== DEFAULT_BARITONE_CONFIG.version) {
      localStorage.setItem('kiosk_voice_version', DEFAULT_BARITONE_CONFIG.version);
      localStorage.setItem('kiosk_tts_pitch', DEFAULT_BARITONE_CONFIG.pitch.toString());
      localStorage.setItem('kiosk_tts_rate', DEFAULT_BARITONE_CONFIG.rate.toString());
      localStorage.setItem('kiosk_tts_volume', DEFAULT_BARITONE_CONFIG.volume.toString());
      localStorage.removeItem('kiosk_tts_voice');
      setPitchState(DEFAULT_BARITONE_CONFIG.pitch);
      setRateState(DEFAULT_BARITONE_CONFIG.rate);
      setVolumeState(DEFAULT_BARITONE_CONFIG.volume);
      setSelectedVoice('');
    }
  }, []);

  useEffect(() => {
    // Connect viseme stream to local state for mouth animation
    textToSpeech.setVisemeCallback((level: number) => {
      setVisemeLevel(level);
    });

    const updateVoices = () => {
      const list = textToSpeech.getVoices();
      setAvailableVoices(list);

      // Automatically assign the best baritone voice matching the reference audio if not explicitly pinned
      if (list.length > 0) {
        const bestVoice = textToSpeech.findBestVoice('en-IN', selectedVoice || undefined);
        if (bestVoice && !selectedVoice) {
          setSelectedVoice(bestVoice.voiceURI);
          localStorage.setItem('kiosk_tts_voice', bestVoice.voiceURI);
        }
      }
    };

    updateVoices();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      textToSpeech.stop();
      textToSpeech.setVisemeCallback(null);
    };
  }, [selectedVoice]);

  const setRate = useCallback((val: number) => {
    setRateState(val);
    localStorage.setItem('kiosk_tts_rate', val.toString());
  }, []);

  const setPitch = useCallback((val: number) => {
    setPitchState(val);
    localStorage.setItem('kiosk_tts_pitch', val.toString());
  }, []);

  const setVolume = useCallback((val: number) => {
    setVolumeState(val);
    localStorage.setItem('kiosk_tts_volume', val.toString());
  }, []);

  const setVoice = useCallback((voiceURI: string) => {
    setSelectedVoice(voiceURI);
    localStorage.setItem('kiosk_tts_voice', voiceURI);
  }, []);

  const speak = useCallback(
    async (text: string, options: TTSOptions = {}) => {
      if (!isSupported) return;

      const mergedOptions: TTSOptions = {
        rate,
        pitch,
        volume,
        voiceURI: selectedVoice || undefined,
        ...options
      };

      try {
        await textToSpeech.speak(text, mergedOptions, {
          onStart: () => {
            setIsSpeaking(true);
            if (onStart) onStart();
          },
          onEnd: () => {
            setIsSpeaking(false);
            setVisemeLevel(0);
            if (onEnd) onEnd();
          },
          onError: (err) => {
            setIsSpeaking(false);
            setVisemeLevel(0);
            if (onError) onError(err);
          }
        });
      } catch (err) {
        setIsSpeaking(false);
        setVisemeLevel(0);
        throw err;
      }
    },
    [isSupported, rate, pitch, volume, selectedVoice, onStart, onEnd, onError]
  );

  const stop = useCallback(() => {
    textToSpeech.stop();
    setIsSpeaking(false);
    setVisemeLevel(0);
    if (onEnd) onEnd();
  }, [onEnd]);

  return {
    isSupported,
    isSpeaking,
    visemeLevel,
    availableVoices,
    selectedVoice,
    rate,
    pitch,
    volume,
    speak,
    stop,
    setRate,
    setPitch,
    setVolume,
    setSelectedVoice: setVoice
  };
}
