import { useState, useCallback, useRef } from 'react';
import { FaceExpression, VoiceAssistantState } from '../types/robot';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { aiService, ChatMessage, AIResponse } from '../services/aiService';
import { robotAudio } from '../utils/soundEffects';

interface UseVoiceAssistantOptions {
  language?: string;
  onExpressionChange?: (expression: FaceExpression) => void;
  onMovementCommand?: (cmd: { linear: number; angular: number }) => void;
}

export function useVoiceAssistant({
  language = 'en-IN',
  onExpressionChange,
  onMovementCommand
}: UseVoiceAssistantOptions = {}) {
  const [state, setState] = useState<VoiceAssistantState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Hello! Welcome to Sri Sri University. I am your AI campus assistant. Sri Sri University brings together modern innovation and traditional values to create a holistic learning experience. How can I help you today?',
      timestamp: new Date()
    }
  ]);

  const onExpressionChangeRef = useRef(onExpressionChange);
  onExpressionChangeRef.current = onExpressionChange;

  const onMovementCommandRef = useRef(onMovementCommand);
  onMovementCommandRef.current = onMovementCommand;

  const updateExpression = useCallback((exp: FaceExpression) => {
    if (onExpressionChangeRef.current) {
      onExpressionChangeRef.current(exp);
    }
  }, []);

  // Text-to-Speech Hook
  const {
    isSpeaking,
    visemeLevel,
    availableVoices,
    selectedVoice,
    rate,
    pitch,
    volume,
    speak: ttsSpeak,
    stop: ttsStop,
    setRate,
    setPitch,
    setVolume,
    setSelectedVoice
  } = useSpeechSynthesis({
    onStart: () => {
      setState('SPEAKING');
      updateExpression('speaking');
    },
    onEnd: () => {
      setState('IDLE');
      updateExpression('idle');
    },
    onError: (err) => {
      console.warn('TTS error in voice assistant:', err);
      setState('IDLE');
      updateExpression('idle');
    }
  });

  // Handler for final recognized user speech
  const handleFinalSpeech = useCallback(
    async (spokenText: string) => {
      if (!spokenText.trim()) {
        setState('IDLE');
        updateExpression('idle');
        return;
      }

      // Add user message to history
      const userMsg: ChatMessage = {
        role: 'user',
        text: spokenText,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, userMsg]);

      // Transition to THINKING
      setState('THINKING');
      updateExpression('thinking');

      try {
        const response: AIResponse = await aiService.getResponse(spokenText, chatHistory, language);

        // Add assistant message to history
        const assistantMsg: ChatMessage = {
          role: 'assistant',
          text: response.text,
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, assistantMsg]);

        // Forward suggested movement command to Jetson safety layer if present
        if (response.movementCommand && onMovementCommandRef.current) {
          onMovementCommandRef.current(response.movementCommand);
        }

        // Play synthetic chime if happy or special
        if (response.suggestedExpression === 'happy') {
          robotAudio.playHappy();
        }

        // Convert response into speech
        await ttsSpeak(response.text, { lang: language });
      } catch (err: any) {
        console.error('Error in AI Assistant processing:', err);
        setState('ERROR');
        updateExpression('error');
        setErrorMessage(err.message || 'Failed to process AI response.');
        setTimeout(() => {
          setState('IDLE');
          updateExpression('idle');
        }, 3000);
      }
    },
    [chatHistory, language, ttsSpeak, updateExpression]
  );

  // Speech Recognition Hook
  const {
    isListening,
    transcript,
    interimTranscript,
    error: sttError,
    errorType: sttErrorType,
    isSupported: isSTTSupported,
    startListening: sttStartListening,
    stopListening: sttStopListening,
    resetTranscript,
    retry: sttRetry
  } = useSpeechRecognition({
    language,
    onFinalResult: handleFinalSpeech,
    onError: (errMsg) => {
      setState('ERROR');
      updateExpression('error');
      setErrorMessage(errMsg);
      setTimeout(() => {
        setState('IDLE');
        updateExpression('idle');
      }, 3500);
    }
  });

  // Start Voice Interaction Cycle
  const startListening = useCallback(() => {
    // If robot is currently speaking, stop speech first
    if (isSpeaking) {
      ttsStop();
    }

    setErrorMessage(null);
    resetTranscript();
    setState('LISTENING');
    updateExpression('listening');
    robotAudio.playListening();

    sttStartListening(language);
  }, [isSpeaking, ttsStop, resetTranscript, updateExpression, sttStartListening, language]);

  // Stop Listening Manually
  const stopListening = useCallback(() => {
    sttStopListening();
    if (state === 'LISTENING') {
      setState('IDLE');
      updateExpression('idle');
    }
  }, [sttStopListening, state, updateExpression]);

  // Interrupt Speech Immediately
  const interrupt = useCallback(() => {
    ttsStop();
    sttStopListening();
    setState('IDLE');
    updateExpression('idle');
  }, [ttsStop, sttStopListening, updateExpression]);

  // Send Manual Text Message (from input form)
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      if (isSpeaking) ttsStop();
      await handleFinalSpeech(text);
    },
    [isSpeaking, ttsStop, handleFinalSpeech]
  );

  // Direct Speech Output (Without AI processing)
  const speakDirect = useCallback(
    async (text: string, onEndCallback?: () => void) => {
      if (!text.trim()) return;
      if (isSpeaking) ttsStop();
      try {
        await ttsSpeak(text);
        if (onEndCallback) onEndCallback();
      } catch {
        if (onEndCallback) onEndCallback();
      }
    },
    [isSpeaking, ttsStop, ttsSpeak]
  );

  return {
    state,
    isListening,
    isSpeaking,
    visemeLevel,
    transcript: transcript || interimTranscript,
    interimTranscript,
    chatHistory,
    errorMessage: errorMessage || sttError,
    errorType: sttErrorType,
    isSTTSupported,
    startListening,
    stopListening,
    interrupt,
    sendMessage,
    speakDirect,
    retry: sttRetry,
    // TTS voice settings
    availableVoices,
    selectedVoice,
    rate,
    pitch,
    volume,
    setRate,
    setPitch,
    setVolume,
    setSelectedVoice
  };
}

