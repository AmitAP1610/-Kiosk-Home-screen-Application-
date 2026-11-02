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

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoiceLoader();
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
   * Strictly prioritizes deep resonant natural male voices (like George, Google UK/US Male, Brian, David, Guy)
   * matching the uploaded baritone reference audio sample ("I fear darkness hunts us...").
   */
  public findBestVoice(lang = 'en-IN', voiceURI?: string): SpeechSynthesisVoice | null {
    const list = this.getVoices();
    if (list.length === 0) return null;

    if (voiceURI) {
      const match = list.find(v => v.voiceURI === voiceURI);
      if (match) return match;
    }

    // Explicit female names to filter out
    const femaleKeywords = [
      'female', 'zira', 'jenny', 'aria', 'hazel', 'susan', 'linda',
      'heera', 'kalpana', 'samantha', 'victoria', 'karen', 'catherine',
      'helena', 'stephanie', 'nicole', 'ananya', 'priya', 'pooja', 'neerja'
    ];
    const isFemale = (name: string) => femaleKeywords.some(k => name.toLowerCase().includes(k));

    // Deep resonant male voice keywords (mirrors the uploaded baritone audio sample)
    const priorityBaritoneKeywords = [
      'george', 'uk english male', 'brian', 'ryan', 'guy', 'david', 'mark', 'richard', 'en-gb-male'
    ];
    const generalMaleKeywords = [
      'male', 'ravi', 'prabhat', 'james', 'andrew', 'daniel', 'madhav', 'rohit'
    ];

    const isPriorityBaritone = (name: string) =>
      priorityBaritoneKeywords.some(k => name.toLowerCase().includes(k)) && !isFemale(name);

    const isGeneralMale = (name: string) =>
      (priorityBaritoneKeywords.some(k => name.toLowerCase().includes(k)) ||
       generalMaleKeywords.some(k => name.toLowerCase().includes(k))) && !isFemale(name);

    // 1. Top priority: British/deep baritone male matching reference tone
    const baritoneMatch = list.find(v => isPriorityBaritone(v.name));
    if (baritoneMatch) return baritoneMatch;

    // 2. Prioritize target language male voice
    const targetMale = list.find(v => {
      const langLower = v.lang.replace('_', '-').toLowerCase();
      return (langLower.startsWith(lang.toLowerCase()) || langLower.startsWith(lang.split('-')[0].toLowerCase())) && isGeneralMale(v.name);
    });
    if (targetMale) return targetMale;

    // 3. Try any English male voice
    const anyEnglishMale = list.find(v => {
      const langLower = v.lang.replace('_', '-').toLowerCase();
      return langLower.startsWith('en') && isGeneralMale(v.name);
    });
    if (anyEnglishMale) return anyEnglishMale;

    // 4. Try any male voice in the system
    const anyMale = list.find(v => isGeneralMale(v.name));
    if (anyMale) return anyMale;

    // 5. Prefer non-female voice matching language
    const nonFemaleLang = list.find(v => {
      const langLower = v.lang.replace('_', '-').toLowerCase();
      return (langLower.startsWith(lang.toLowerCase()) || langLower.startsWith(lang.split('-')[0].toLowerCase())) && !isFemale(v.name);
    });
    if (nonFemaleLang) return nonFemaleLang;

    // 6. Match exact language code (e.g. 'en-IN' or 'hi-IN')
    const langMatch = list.find(v => v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase());
    if (langMatch) return langMatch;

    // 7. Match prefix (e.g. 'hi' for Hindi, 'en' for English)
    const prefix = lang.split('-')[0].toLowerCase();
    const prefixMatch = list.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (prefixMatch) return prefixMatch;

    // 8. Fallback to default or first available
    return list.find(v => v.default) || list[0] || null;
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

    // Stop existing playback first
    this.stop();

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

        // Calibrate pitch and rate to mirror the deep baritone sample (0.82 pitch, 0.90 rate)
        utterance.rate = Math.max(0.5, Math.min(2.0, options.rate ?? 0.90));
        utterance.pitch = Math.max(0.5, Math.min(2.0, options.pitch ?? 0.82));
        utterance.volume = Math.max(0.0, Math.min(1.0, options.volume ?? 1.0));

        utterance.onstart = () => {
          if (!hasStarted) {
            hasStarted = true;
            this.isSpeakingState = true;
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
          this.stopVisemeSimulation();
          this.currentUtterance = null;

          if (e.error !== 'canceled' && e.error !== 'interrupted') {
            console.warn('SpeechSynthesis error:', e.error);
            if (callbacks?.onError) callbacks.onError(e);
          }
          resolve();
        };

        try {
          this.synth!.speak(utterance);
        } catch (err) {
          this.isSpeakingState = false;
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
