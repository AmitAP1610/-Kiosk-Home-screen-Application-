/**
 * Text-to-Speech (TTS) Service
 * Utilizes the browser SpeechSynthesis API running locally on the Realme Android tablet.
 * Fixes Chrome Android garbage-collection bugs, handles sentence chunking,
 * and synchronizes viseme mouth animation with zero square artifacts.
 */

export interface TTSOptions {
  voiceURI?: string;
  rate?: number;    // 0.5 to 2.0 (default 1.0)
  pitch?: number;   // 0.5 to 2.0 (default 1.05)
  volume?: number;  // 0.0 to 1.0 (default 1.0)
  lang?: string;    // 'en-IN', 'hi-IN', 'en-US'
}

export type VisemeCallback = (level: number) => void;

// Retain global reference array to prevent Chrome garbage collector bug
const activeUtterances: SpeechSynthesisUtterance[] = [];

class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;
  private visemeAnimFrame: number | null = null;
  private onVisemeUpdate: VisemeCallback | null = null;
  private isVoicesLoaded: boolean = false;
  private voiceLoadPromise: Promise<SpeechSynthesisVoice[]> | null = null;
  private keepAliveTimer: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoiceLoader();

      // Auto-unlock speech synthesis on first user interaction anywhere on screen
      const unlock = () => {
        this.unlockAudioEngine();
        window.removeEventListener('click', unlock);
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('pointerdown', unlock);
      };
      window.addEventListener('click', unlock, { once: true, passive: true });
      window.addEventListener('touchstart', unlock, { once: true, passive: true });
      window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    }
  }

  /**
   * Unlocks speech synthesis and audio pipeline after user interaction
   */
  public unlockAudioEngine() {
    if (!this.synth) return;
    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
      const silent = new SpeechSynthesisUtterance(' ');
      silent.volume = 0.01;
      silent.rate = 2.0;
      this.synth.speak(silent);
    } catch {}
  }

  private startKeepAlive() {
    this.stopKeepAlive();
    this.keepAliveTimer = setInterval(() => {
      if (this.synth && this.isSpeakingState) {
        if (this.synth.paused) {
          this.synth.resume();
        }
      }
    }, 4000);
  }

  private stopKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  private initVoiceLoader() {
    if (!this.synth) return;

    this.voiceLoadPromise = new Promise((resolve) => {
      const immediate = this.synth!.getVoices();
      if (immediate && immediate.length > 0) {
        this.voices = immediate;
        this.isVoicesLoaded = true;
        resolve(this.voices);
      } else {
        const onVoicesChanged = () => {
          this.voices = this.synth!.getVoices();
          this.isVoicesLoaded = true;
          resolve(this.voices);
        };
        this.synth!.onvoiceschanged = onVoicesChanged;

        // Fallback timeout in case onvoiceschanged does not fire
        setTimeout(() => {
          if (!this.isVoicesLoaded && this.synth) {
            this.voices = this.synth.getVoices();
            this.isVoicesLoaded = true;
            resolve(this.voices);
          }
        }, 1200);
      }
    });
  }

  public async waitForVoices(): Promise<SpeechSynthesisVoice[]> {
    if (this.voices.length > 0) return this.voices;
    if (this.voiceLoadPromise) return this.voiceLoadPromise;
    if (this.synth) {
      this.voices = this.synth.getVoices();
      return this.voices;
    }
    return [];
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public setVisemeCallback(cb: VisemeCallback | null) {
    this.onVisemeUpdate = cb;
  }

  /**
   * Checks if an installed voice exists for the specified language
   */
  public hasVoiceForLanguage(lang: string): boolean {
    const list = this.getVoices();
    const prefix = lang.split('-')[0].toLowerCase();
    return list.some(v => v.lang.toLowerCase().startsWith(prefix));
  }

  /**
   * Finds the best voice matching language preference.
   * Strictly prioritizes deep resonant natural male voices (like George, Google UK/US Male, Brian, David, Guy, Daniel)
   * matching the uploaded baritone reference audio sample ("I fear darkness hunts us...").
   */
  public findBestVoice(lang = 'en-IN', voiceURI?: string): SpeechSynthesisVoice | null {
    const list = this.getVoices();
    if (list.length === 0) return null;

    // Female keywords to strictly reject
    const femaleKeywords = [
      'female', 'zira', 'jenny', 'aria', 'hazel', 'susan', 'linda',
      'heera', 'kalpana', 'samantha', 'victoria', 'karen', 'catherine',
      'helena', 'stephanie', 'nicole', 'ananya', 'priya', 'pooja', 'neerja',
      'swara', 'veena', 'aditi', 'raveena', 'alva', 'fiona', 'moira', 'tessa', 'siri'
    ];
    const isFemale = (v: SpeechSynthesisVoice) => {
      const combined = (v.name + ' ' + v.voiceURI).toLowerCase();
      return femaleKeywords.some(k => combined.includes(k));
    };

    // If explicit voiceURI was requested, verify it is valid and not female
    if (voiceURI) {
      const match = list.find(v => v.voiceURI === voiceURI);
      if (match && !isFemale(match)) return match;
    }

    // Tier 1: British Baritone Male (Closest match to the reference sample)
    const tier1Keywords = [
      'george', 'uk english male', 'en-gb-male', 'brian', 'ryan', 'daniel', 'richard', 'oliver'
    ];
    const tier1Match = list.find(v => {
      const combined = (v.name + ' ' + v.voiceURI).toLowerCase();
      return tier1Keywords.some(k => combined.includes(k)) && !isFemale(v);
    });
    if (tier1Match) return tier1Match;

    // Tier 2: Android / Google UK English Male (e.g. en-gb-x-rjs#male, Google UK English Male)
    const ukMaleMatch = list.find(v => {
      const langLower = v.lang.replace('_', '-').toLowerCase();
      const combined = (v.name + ' ' + v.voiceURI).toLowerCase();
      return (
        langLower.startsWith('en-gb') &&
        (combined.includes('male') || combined.includes('#male') || combined.includes('natural')) &&
        !isFemale(v)
      );
    });
    if (ukMaleMatch) return ukMaleMatch;

    // Tier 3: US English Male (e.g. Guy, David, Mark, Google US English Male)
    const tier3Keywords = ['guy', 'david', 'mark', 'us english male', 'en-us-male', 'andrew', 'christopher'];
    const usMaleMatch = list.find(v => {
      const combined = (v.name + ' ' + v.voiceURI).toLowerCase();
      return tier3Keywords.some(k => combined.includes(k)) && !isFemale(v);
    });
    if (usMaleMatch) return usMaleMatch;

    // Tier 4: Android Google US Male (e.g. en-us-x-sfg#male, en-us male)
    const androidUsMale = list.find(v => {
      const langLower = v.lang.replace('_', '-').toLowerCase();
      const combined = (v.name + ' ' + v.voiceURI).toLowerCase();
      return (
        langLower.startsWith('en-us') &&
        (combined.includes('male') || combined.includes('#male') || combined.includes('natural')) &&
        !isFemale(v)
      );
    });
    if (androidUsMale) return androidUsMale;

    // Tier 5: Indian English Male (e.g. Prabhat, Ravi, Madhav, en-in male)
    const indianMale = list.find(v => {
      const langLower = v.lang.replace('_', '-').toLowerCase();
      const combined = (v.name + ' ' + v.voiceURI).toLowerCase();
      return (
        langLower.startsWith('en-in') &&
        (combined.includes('male') || combined.includes('prabhat') || combined.includes('ravi') || combined.includes('madhav')) &&
        !isFemale(v)
      );
    });
    if (indianMale) return indianMale;

    // Tier 6: Any English male voice
    const anyEnglishMale = list.find(v => {
      const langLower = v.lang.replace('_', '-').toLowerCase();
      const combined = (v.name + ' ' + v.voiceURI).toLowerCase();
      return langLower.startsWith('en') && combined.includes('male') && !isFemale(v);
    });
    if (anyEnglishMale) return anyEnglishMale;

    // Tier 7: Any general English voice that is not female
    const anyNonFemaleEnglish = list.find(v => {
      const langLower = v.lang.replace('_', '-').toLowerCase();
      return langLower.startsWith('en') && !isFemale(v);
    });
    if (anyNonFemaleEnglish) return anyNonFemaleEnglish;

    // Tier 8: Fallback to target language match
    const langMatch = list.find(v => {
      const langLower = v.lang.replace('_', '-').toLowerCase();
      return (langLower.startsWith(lang.toLowerCase()) || langLower.startsWith(lang.split('-')[0].toLowerCase())) && !isFemale(v);
    });
    if (langMatch) return langMatch;

    // Tier 9: Fallback default
    return list.find(v => v.default && !isFemale(v)) || list[0] || null;
  }

  /**
   * Splits long text into natural punctuation chunks (< 200 chars) to prevent Android Chrome audio engine timeouts
   */
  private splitIntoChunks(text: string): string[] {
    const clean = text.trim();
    if (clean.length < 180) return [clean];

    const sentences = clean.match(/[^.!?।]+[.!?।]+|[^.!?।]+$/g) || [clean];
    const chunks: string[] = [];
    let current = '';

    for (const s of sentences) {
      if ((current + ' ' + s).trim().length < 180) {
        current = (current + ' ' + s).trim();
      } else {
        if (current) chunks.push(current);
        current = s.trim();
      }
    }
    if (current) chunks.push(current);
    return chunks.length > 0 ? chunks : [clean];
  }

  /**
   * Speaks text with given options.
   * Cancels any active speech immediately to prevent overlapping.
   */
  public async speak(
    text: string,
    options: TTSOptions = {},
    callbacks?: { onStart?: () => void; onEnd?: () => void; onError?: (err: any) => void }
  ): Promise<void> {
    if (!this.synth || !this.isSupported()) {
      const err = new Error('SpeechSynthesis is not supported on this device/browser.');
      if (callbacks?.onError) callbacks.onError(err);
      throw err;
    }

    // Stop existing playback safely if active
    if (this.synth.speaking || this.synth.pending) {
      this.stop();
      await new Promise(r => setTimeout(r, 50));
    }

    if (this.synth.paused) {
      try {
        this.synth.resume();
      } catch {}
    }

    await this.waitForVoices();
    const voice = this.findBestVoice(options.lang || 'en-IN', options.voiceURI);

    // If requesting Hindi but no Hindi voice exists, surface a warning callback
    if (options.lang?.toLowerCase().startsWith('hi') && !this.hasVoiceForLanguage('hi')) {
      console.warn('Hindi voice not installed in Android Speech engine. Falling back to default voice.');
    }

    const chunks = this.splitIntoChunks(text);

    return new Promise((resolve, reject) => {
      let chunkIndex = 0;
      let hasStarted = false;

      const speakNextChunk = () => {
        if (chunkIndex >= chunks.length) {
          this.isSpeakingState = false;
          this.stopKeepAlive();
          this.stopVisemeSimulation();
          this.currentUtterance = null;
          if (callbacks?.onEnd) callbacks.onEnd();
          resolve();
          return;
        }

        const chunkText = chunks[chunkIndex++];
        const utterance = new SpeechSynthesisUtterance(chunkText);
        this.currentUtterance = utterance;

        // Prevent garbage collection by keeping in active array
        activeUtterances.push(utterance);

        if (voice) {
          utterance.voice = voice;
        }

        // Calibrate pitch and rate to mirror the deep baritone sample (0.80 pitch, 0.88 rate)
        utterance.rate = Math.max(0.5, Math.min(2.0, options.rate ?? 0.88));
        utterance.pitch = Math.max(0.5, Math.min(2.0, options.pitch ?? 0.80));
        utterance.volume = Math.max(0.0, Math.min(1.0, options.volume ?? 1.0));

        utterance.onstart = () => {
          if (!hasStarted) {
            hasStarted = true;
            this.isSpeakingState = true;
            this.startKeepAlive();
            this.startVisemeSimulation();
            if (callbacks?.onStart) callbacks.onStart();
          }
        };

        utterance.onend = () => {
          // Remove from active utterances
          const idx = activeUtterances.indexOf(utterance);
          if (idx !== -1) activeUtterances.splice(idx, 1);

          speakNextChunk();
        };

        utterance.onerror = (e) => {
          const idx = activeUtterances.indexOf(utterance);
          if (idx !== -1) activeUtterances.splice(idx, 1);

          this.isSpeakingState = false;
          this.stopKeepAlive();
          this.stopVisemeSimulation();
          this.currentUtterance = null;

          if (e.error !== 'canceled' && e.error !== 'interrupted') {
            console.warn('SpeechSynthesis error:', e.error);
            if (callbacks?.onError) callbacks.onError(e);
          }
          reject(new Error(`SpeechSynthesis error: ${e.error}`));
        };

        try {
          if (this.synth!.paused) {
            this.synth!.resume();
          }
          this.synth!.speak(utterance);
        } catch (err) {
          this.isSpeakingState = false;
          this.stopKeepAlive();
          this.stopVisemeSimulation();
          this.currentUtterance = null;
          if (callbacks?.onError) callbacks.onError(err);
          reject(err);
        }
      };

      speakNextChunk();
    });
  }

  /**
   * Stops current speech playback immediately and clears animation.
   */
  public stop() {
    this.stopKeepAlive();
    this.stopVisemeSimulation();
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
    activeUtterances.length = 0;
    this.isSpeakingState = false;
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState || (this.synth?.speaking ?? false);
  }

  /**
   * Animates robotic speech viseme levels (0.0 to 1.0) synchronized with speech
   */
  private startVisemeSimulation() {
    this.stopVisemeSimulation();
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      // Multi-rhythm acoustic envelope mimicking natural vocal syllables
      const primary = Math.sin(elapsed * 13);
      const secondary = Math.cos(elapsed * 7.5);
      const tertiary = Math.sin(elapsed * 21);

      const raw = Math.abs(primary * 0.5 + secondary * 0.35 + tertiary * 0.15);
      const smoothed = Math.min(1.0, Math.max(0.12, raw * 1.1));

      if (this.onVisemeUpdate) {
        this.onVisemeUpdate(smoothed);
      }

      if (this.isSpeakingState) {
        this.visemeAnimFrame = requestAnimationFrame(step);
      } else {
        if (this.onVisemeUpdate) this.onVisemeUpdate(0);
      }
    };

    this.visemeAnimFrame = requestAnimationFrame(step);
  }

  private stopVisemeSimulation() {
    if (this.visemeAnimFrame !== null) {
      cancelAnimationFrame(this.visemeAnimFrame);
      this.visemeAnimFrame = null;
    }
    if (this.onVisemeUpdate) {
      this.onVisemeUpdate(0);
    }
  }
}

export const textToSpeech = new TextToSpeechService();
