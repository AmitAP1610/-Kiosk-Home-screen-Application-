import { useState, useEffect, useRef, useCallback } from 'react';
import { FaceExpression } from '../types/robot';

interface UseSpeechRecognitionProps {
  onCommand?: (command: string, expression?: FaceExpression) => void;
}

// Window interface augmentation for WebkitSpeechRecognition
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export function useSpeechRecognition({ onCommand }: UseSpeechRecognitionProps = {}) {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript.trim().toLowerCase();
        setLastTranscript(transcript);

        if (!onCommand) return;

        // Command routing
        if (transcript.includes('wake up') || transcript.includes('power on')) {
          onCommand(transcript, 'wakeup');
        } else if (transcript.includes('sleep') || transcript.includes('good night') || transcript.includes('power down')) {
          onCommand(transcript, 'sleep');
        } else if (transcript.includes('happy') || transcript.includes('smile') || transcript.includes('good job')) {
          onCommand(transcript, 'happy');
        } else if (transcript.includes('confused') || transcript.includes('what') || transcript.includes('huh')) {
          onCommand(transcript, 'confused');
        } else if (transcript.includes('error') || transcript.includes('warning') || transcript.includes('alert')) {
          onCommand(transcript, 'error');
        } else if (transcript.includes('think') || transcript.includes('calculate') || transcript.includes('search')) {
          onCommand(transcript, 'thinking');
        } else if (transcript.includes('listen') || transcript.includes('hey robot') || transcript.includes('hello') || transcript.includes('hi')) {
          onCommand(transcript, 'listening');
        } else {
          onCommand(transcript, 'idle');
        }
      };

      recognition.onerror = (err: any) => {
        if (err.error !== 'no-speech') {
          console.warn('Speech recognition error:', err.error);
        }
      };

      recognition.onend = () => {
        // If meant to stay recognizing, restart
        if (recognitionRef.current && isRecognizing) {
          try {
            recognition.start();
          } catch {
            setIsRecognizing(false);
          }
        } else {
          setIsRecognizing(false);
        }
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [onCommand, isRecognizing]);

  const startRecognition = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsRecognizing(true);
    } catch (e) {
      console.warn('Recognition start failed', e);
    }
  }, []);

  const stopRecognition = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      setIsRecognizing(false);
      recognitionRef.current.stop();
    } catch (e) {
      console.warn('Recognition stop failed', e);
    }
  }, []);

  const toggleRecognition = useCallback(() => {
    if (isRecognizing) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }, [isRecognizing, startRecognition, stopRecognition]);

  return {
    isSupported,
    isRecognizing,
    lastTranscript,
    startRecognition,
    stopRecognition,
    toggleRecognition
  };
}

