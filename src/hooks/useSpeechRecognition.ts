import { useState, useEffect, useCallback, useRef } from 'react';
import { speechToText, STTErrorType } from '../services/speechToText';

interface UseSpeechRecognitionOptions {
  language?: string;
  onFinalResult?: (transcript: string) => void;
  onError?: (error: string, type: STTErrorType) => void;
}

export function useSpeechRecognition({
  language = 'en-IN',
  onFinalResult,
  onError
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<STTErrorType | null>(null);
  const isSupported = speechToText.isSupported();

  const onFinalResultRef = useRef(onFinalResult);
  onFinalResultRef.current = onFinalResult;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    speechToText.setCallbacks({
      onStart: () => {
        setIsListening(true);
        setError(null);
        setErrorType(null);
      },
      onResult: (text: string, isFinal: boolean) => {
        if (isFinal) {
          setTranscript(text);
          setInterimTranscript('');
          if (onFinalResultRef.current) {
            onFinalResultRef.current(text);
          }
        } else {
          setInterimTranscript(text);
        }
      },
      onError: (errMsg: string, errType: STTErrorType) => {
        setIsListening(false);
        setError(errMsg);
        setErrorType(errType);
        if (onErrorRef.current) {
          onErrorRef.current(errMsg, errType);
        }
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    return () => {
      speechToText.stop();
    };
  }, []);

  const startListening = useCallback((lang = language) => {
    setError(null);
    setErrorType(null);
    setInterimTranscript('');
    return speechToText.start(lang);
  }, [language]);

  const stopListening = useCallback(() => {
    speechToText.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    setErrorType(null);
  }, []);

  const retry = useCallback(() => {
    resetTranscript();
    startListening(language);
  }, [resetTranscript, startListening, language]);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    errorType,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    retry,
    checkMicrophonePermission: () => speechToText.checkMicrophonePermission(),
    requestMicrophonePermission: () => speechToText.requestMicrophonePermission()
  };
}
