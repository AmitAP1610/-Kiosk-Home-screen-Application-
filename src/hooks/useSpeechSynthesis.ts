import { useState, useEffect, useCallback } from 'react';
import { textToSpeech, TTSOptions } from '../services/textToSpeech';

interface UseSpeechSynthesisProps {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function useSpeechSynthesis({
  onStart,
  onEnd,
  onError
}: UseSpeechSynthesisProps = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [visemeLevel, setVisemeLevel] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>(() => localStorage.getItem('kiosk_tts_voice') || '');
  const [rate, setRateState] = useState<number>(() => parseFloat(localStorage.getItem('kiosk_tts_rate') || '0.90'));
  const [pitch, setPitchState] = useState<number>(() => parseFloat(localStorage.getItem('kiosk_tts_pitch') || '0.82'));
  const [volume, setVolumeState] = useState<number>(() => parseFloat(localStorage.getItem('kiosk_tts_volume') || '1.0'));

  const isSupported = textToSpeech.isSupported();

  useEffect(() => {
    // Connect viseme stream to local state for mouth animation
    textToSpeech.setVisemeCallback((level: number) => {
      setVisemeLevel(level);
    });

    const updateVoices = () => {
      const list = textToSpeech.getVoices();
      setAvailableVoices(list);
    };

    updateVoices();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      textToSpeech.stop();
      textToSpeech.setVisemeCallback(null);
    };
  }, []);

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
      } catch {
        setIsSpeaking(false);
        setVisemeLevel(0);
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
