// src/types/audio.ts
// Web Audio interfaces and synthesizer types for Kanye Fortune

export interface SoundSynthesizer {
  initContext(): AudioContext | null;
  toggleMute(): boolean;
  getMuted(): boolean;
  playSubBass808(): void;
  playVinylCrackle(durationSec?: number): void;
  playCardFlipWhoosh(): void;
  playReceiptClick(): void;
}

export type SoundEffectType =
  | 'subBass808'
  | 'vinylCrackle'
  | 'cardFlipWhoosh'
  | 'receiptClick';

export interface UseYeAudioReturn {
  isMuted: boolean;
  toggleMute: () => boolean;
  playSubBass808: () => void;
  playVinylCrackle: (durationSec?: number) => void;
  playCardFlipWhoosh: () => void;
  playReceiptClick: () => void;
  initAudio: () => void;
}
