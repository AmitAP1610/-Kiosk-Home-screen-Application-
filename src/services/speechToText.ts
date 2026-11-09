/**
 * Speech-to-Text (STT) Service with Provider Abstraction
 * Supports browser Web Speech API (Chrome / Android) and Native Android SpeechRecognizer Bridge.
 * Features robust session handling, permission validation, and diagnostic error reporting.
 */

export type STTErrorType =
  | 'not-allowed'
  | 'no-speech'
  | 'network'
  | 'aborted'
  | 'service-not-allowed'
  | 'insecure-context'
  | 'unsupported'
  | 'busy'
  | 'audio'
  | 'client'
  | 'unknown';

export interface STTCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMessage: string, errorType: STTErrorType) => void;
  onEnd?: () => void;
}

export interface ISTTProvider {
  readonly id: string;
  readonly name: string;
  isSupported(): boolean;
  start(
    lang: string,
    callbacks: {
      onStart: () => void;
      onResult: (text: string, isFinal: boolean) => void;
      onError: (message: string, code: STTErrorType) => void;
      onEnd: () => void;
    }
  ): void;
  stop(): void;
  abort(): void;
}

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
  Capacitor?: any;
  AndroidSpeechRecognizer?: any;
}

/**
 * Standard Web Speech API Provider (Google Chrome on Android Tablet & Desktop)
 */
class WebSpeechAPIProvider implements ISTTProvider {
  public readonly id = 'web-speech';
  public readonly name = 'Web Speech API (Browser Engine)';
  private recognition: any = null;
  private isManuallyStopped = false;
  private lastDeliveredFinal = '';
  private latestTranscript = '';

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as IWindow;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public start(
    lang: string,
    callbacks: {
      onStart: () => void;
      onResult: (text: string, isFinal: boolean) => void;
      onError: (message: string, code: STTErrorType) => void;
      onEnd: () => void;
    }
  ): void {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      callbacks.onError('Web Speech API is not supported in this browser.', 'unsupported');
      return;
    }

    // Insecure Context check (Chrome blocks mic access on plain HTTP unless localhost)
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      callbacks.onError(
        'Insecure origin: Chrome blocks microphone on non-HTTPS IP addresses. Use https:// or localhost, or add your tablet IP to chrome://flags/#unsafely-treat-insecure-origin-as-secure',
        'insecure-context'
      );
      return;
    }

    // Always instantiate a fresh instance to avoid Chrome's InvalidStateError on reused instances
    try {
      this.abort();
      this.recognition = new SpeechRecognitionClass();
      this.isManuallyStopped = false;
      this.lastDeliveredFinal = '';
      this.latestTranscript = '';

      this.recognition.continuous = false; // Capture discrete phrases for dialogue turns
      this.recognition.interimResults = true; // Stream real-time partial feedback
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = lang;

      this.recognition.onstart = () => {
        callbacks.onStart();
      };

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const text = item[0]?.transcript || '';
          if (item.isFinal) {
            final += text;
          } else {
            interim += text;
          }
        }

        const currentText = (final || interim).trim();
        this.latestTranscript = currentText;

        if (final.trim()) {
          this.lastDeliveredFinal = final.trim();
          callbacks.onResult(final.trim(), true);
        } else if (interim.trim()) {
          callbacks.onResult(interim.trim(), false);
        }
      };

      this.recognition.onerror = (event: any) => {
        const errorType: STTErrorType = (event.error as STTErrorType) || 'unknown';
        let friendlyMessage = 'An error occurred during speech recognition.';

        switch (errorType) {
          case 'not-allowed':
            friendlyMessage = 'Microphone permission denied. Please allow microphone access in your tablet settings.';
            break;
          case 'no-speech':
            friendlyMessage = 'No speech was detected. Please tap Speak and try again.';
            break;
          case 'network':
            friendlyMessage = 'Network error: The browser speech recognition engine requires internet connectivity.';
            break;
          case 'service-not-allowed':
            friendlyMessage = 'Speech recognition service is disabled or blocked by your browser.';
            break;
          case 'aborted':
            if (this.isManuallyStopped) return;
            friendlyMessage = 'Speech recognition was stopped.';
            break;
          default:
            friendlyMessage = `Speech recognition error: ${event.error || 'unknown'}`;
            break;
        }

        callbacks.onError(friendlyMessage, errorType);
      };

      this.recognition.onend = () => {
        // Edge-case safeguard: If speech ended naturally and we captured an interim transcript that was never marked final, deliver it
        if (!this.lastDeliveredFinal && this.latestTranscript && !this.isManuallyStopped) {
          callbacks.onResult(this.latestTranscript, true);
        }
        this.recognition = null;
        callbacks.onEnd();
      };

      this.recognition.start();
    } catch (err: any) {
      console.warn('Failed to start Web Speech Recognition:', err);
      callbacks.onError(err.message || 'Failed to start speech recognition engine.', 'unknown');
    }
  }

  public stop(): void {
    this.isManuallyStopped = true;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        this.abort();
      }
    }
  }

  public abort(): void {
    this.isManuallyStopped = true;
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {}
      this.recognition = null;
    }
  }
}

/**
 * Native Android SpeechRecognizer Bridge Provider (Tablet APK)
 */
class NativeAndroidSpeechProvider implements ISTTProvider {
  public readonly id = 'native-android';
  public readonly name = 'Native Android SpeechRecognizer (Tablet Bridge)';

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as any;
    return !!(win.AndroidSpeechRecognizer && typeof win.AndroidSpeechRecognizer.startListening === 'function');
  }

  public start(
    lang: string,
    callbacks: {
      onStart: () => void;
      onResult: (text: string, isFinal: boolean) => void;
      onError: (message: string, code: STTErrorType) => void;
      onEnd: () => void;
    }
  ): void {
    const win = window as any;
    if (!this.isSupported()) {
      callbacks.onError('Native Android speech recognizer not available.', 'unsupported');
      return;
    }

    win.onAndroidSpeechStart = () => {
      callbacks.onStart();
    };

    win.onAndroidSpeechResult = (text: string, isFinal: boolean) => {
      callbacks.onResult(text, isFinal);
    };

    win.onAndroidSpeechError = (errMsg: string, errType: string) => {
      callbacks.onError(errMsg, (errType as STTErrorType) || 'unknown');
    };

    win.onAndroidSpeechEnd = () => {
      callbacks.onEnd();
    };

    // Note: Java's onRequestPermissionsResult automatically calls startPendingListen()
    // so we avoid double-triggering here to prevent ERROR_RECOGNIZER_BUSY (error 8).
    win.onMicrophonePermissionGranted = () => {
      // Handled natively by MainActivity.java startPendingListen
    };

    try {
      win.AndroidSpeechRecognizer.startListening(lang || 'en-IN');
    } catch (err: any) {
      callbacks.onError(err?.message || 'Failed to start Android speech recognizer', 'unknown');
    }
  }

  public stop(): void {
    const win = window as any;
    if (win && win.AndroidSpeechRecognizer && typeof win.AndroidSpeechRecognizer.stopListening === 'function') {
      try {
        win.AndroidSpeechRecognizer.stopListening();
      } catch {}
    }
  }

  public abort(): void {
    this.stop();
  }
}

/**
 * Primary Speech-to-Text Service Coordinator
 */
class SpeechToTextService {
  private webProvider = new WebSpeechAPIProvider();
  private nativeProvider = new NativeAndroidSpeechProvider();
  private activeProvider: ISTTProvider;
  private isListeningState = false;
  private currentLanguage = 'en-IN';
  private callbacks: STTCallbacks = {};
  private sessionLock = false;

  constructor() {
    this.activeProvider = this.nativeProvider.isSupported() ? this.nativeProvider : this.webProvider;
  }

  public isSupported(): boolean {
    return this.webProvider.isSupported() || this.nativeProvider.isSupported();
  }

  public getActiveProviderName(): string {
    return this.activeProvider.name;
  }

  public isSecureContext(): boolean {
    return typeof window !== 'undefined' ? window.isSecureContext : false;
  }

  /**
   * Performs explicit microphone permission pre-flight check
   */
  public async checkMicrophonePermission(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
    const win = typeof window !== 'undefined' ? (window as any) : null;
    if (win?.AndroidSpeechRecognizer && typeof win.AndroidSpeechRecognizer.hasMicrophonePermission === 'function') {
      try {
        return win.AndroidSpeechRecognizer.hasMicrophonePermission() ? 'granted' : 'prompt';
      } catch {}
    }

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return 'unsupported';
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        return status.state;
      } catch {
        // Some browsers do not support microphone query
      }
    }

    return 'prompt';
  }

  /**
   * Prompts user for microphone access via native bridge or getUserMedia
   */
  public async requestMicrophonePermission(): Promise<boolean> {
    const win = typeof window !== 'undefined' ? (window as any) : null;
    if (win?.AndroidSpeechRecognizer && typeof win.AndroidSpeechRecognizer.requestMicrophonePermission === 'function') {
      try {
        win.AndroidSpeechRecognizer.requestMicrophonePermission();
        return true;
      } catch {}
    }

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop media tracks immediately after test
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      console.warn('Microphone permission request rejected:', err);
      return false;
    }
  }

  public setCallbacks(callbacks: STTCallbacks) {
    this.callbacks = callbacks;
  }

  public setLanguage(lang: string) {
    this.currentLanguage = lang;
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }

  public start(lang?: string): boolean {
    // Dynamically select native provider if Android bridge is registered
    if (this.nativeProvider.isSupported()) {
      this.activeProvider = this.nativeProvider;
    } else {
      this.activeProvider = this.webProvider;
    }

    if (!this.isSupported()) {
      if (this.callbacks.onError) {
        this.callbacks.onError('Speech Recognition is not supported on this browser engine.', 'unsupported');
      }
      return false;
    }

    if (this.sessionLock) {
      console.warn('STT session is already active or transitioning.');
      return false;
    }

    this.sessionLock = true;
    const targetLang = lang || this.currentLanguage;

    // Stop existing session before new start
    this.activeProvider.stop();

    this.activeProvider.start(targetLang, {
      onStart: () => {
        this.isListeningState = true;
        this.sessionLock = false;
        if (this.callbacks.onStart) this.callbacks.onStart();
      },
      onResult: (transcript, isFinal) => {
        if (this.callbacks.onResult) {
          this.callbacks.onResult(transcript, isFinal);
        }
      },
      onError: (message, code) => {
        this.isListeningState = false;
        this.sessionLock = false;
        if (this.callbacks.onError) {
          this.callbacks.onError(message, code);
        }
      },
      onEnd: () => {
        this.isListeningState = false;
        this.sessionLock = false;
        if (this.callbacks.onEnd) {
          this.callbacks.onEnd();
        }
      }
    });

    return true;
  }

  public stop() {
    this.sessionLock = false;
    this.isListeningState = false;
    this.activeProvider.stop();
  }

  public abort() {
    this.sessionLock = false;
    this.isListeningState = false;
    this.activeProvider.abort();
  }

  public isListening(): boolean {
    return this.isListeningState;
  }
}

export const speechToText = new SpeechToTextService();
