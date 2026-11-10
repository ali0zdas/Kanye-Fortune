// src/services/tts/WebSpeechProvider.ts
// Native browser Web Speech API provider tuned for Kanye West's measured cadence

import { TTSProvider } from '../../types/tts';

export class WebSpeechProvider implements TTSProvider {
  readonly id: string = 'browser-speech';
  readonly name: string = 'Native Neural Voice';

  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.speechSynthesis !== 'undefined' &&
      typeof window.SpeechSynthesisUtterance !== 'undefined'
    );
  }

  public speak(
    text: string,
    onEnd?: () => void,
    onError?: (err: Error) => void
  ): void {
    if (!this.isSupported()) {
      onError?.(new Error('Web Speech API not supported on this browser'));
      return;
    }

    if (!text || text.trim().length === 0) {
      onEnd?.();
      return;
    }

    try {
      // Cancel any ongoing speech to prevent Chrome 15s stall or utterance collision
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Kanye West vocal tuning: authoritative, resonant baritone
      utterance.pitch = 0.82; // Resonant deep pitch
      utterance.rate = 0.94;  // Measured, deliberate cadence
      utterance.volume = 1.0;

      // Select deep English voice if available
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const preferredVoice =
            voices.find(
              (v) =>
                v.lang.startsWith('en') &&
                (v.name.includes('Natural') ||
                  v.name.includes('David') ||
                  v.name.includes('Guy') ||
                  v.name.includes('Google US English'))
            ) ||
            voices.find((v) => v.lang.startsWith('en-US')) ||
            voices.find((v) => v.lang.startsWith('en')) ||
            voices[0];

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }
      } catch {
        // Fall back to default system voice
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        onEnd?.();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        const errType = (e as { error?: string })?.error;
        // Ignore user-initiated cancels
        if (errType !== 'canceled' && errType !== 'interrupted') {
          onError?.(new Error(`Speech synthesis error: ${errType || 'unknown'}`));
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      this.currentUtterance = null;
      onError?.(err instanceof Error ? err : new Error('Failed to start speech synthesis'));
    }
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  public stop(): void {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Safe catch
      }
    }
    if (this.currentUtterance) {
      this.currentUtterance = null;
    }
  }
}

export default WebSpeechProvider;
