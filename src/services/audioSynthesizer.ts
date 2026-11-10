// src/services/audioSynthesizer.ts
// Pure procedural Web Audio synthesis engine for Kanye Fortune (0 KB external audio files)

import { SoundSynthesizer } from '../types/audio';

const STORAGE_MUTE_KEY = 'ye_fortune_muted';

export class YeSoundSynthesizer implements SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Read mute preference from localStorage safely
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_MUTE_KEY);
        if (stored !== null) {
          this.isMuted = stored === 'true';
        }
      } catch {
        // Fall back to unmuted if storage access is restricted
        this.isMuted = false;
      }
    }
  }

  /**
   * Initializes or resumes the AudioContext on user gesture.
   */
  public initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return null;

      try {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      } catch {
        return null;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Toggles mute state, persists to localStorage, and updates master gain node.
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_MUTE_KEY, String(this.isMuted));
      } catch {
        // Ignore storage exceptions
      }
    }

    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 1;
      try {
        if (typeof this.masterGain.gain.setTargetAtTime === 'function') {
          this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.02);
        } else {
          this.masterGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
        }
      } catch {
        this.masterGain.gain.value = targetGain;
      }
    }

    return this.isMuted;
  }

  /**
   * Returns current mute status.
   */
  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * 1. 808 SUB-BASS BOOM
   * Deep sine wave with exponential pitch drop from 160Hz -> 46Hz -> 34Hz and punchy bass tail.
   */
  public playSubBass808(): void {
    const ctx = this.initContext();
    if (!ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';

      // Exponential pitch drop (classic 808 kick envelope)
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(46, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(34, now + 0.85);

      // Punchy instant attack, smooth long decay
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.9, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.0);
    } catch {
      // Audio node scheduling exception safety
    }
  }

  /**
   * 2. VINYL CRACKLE / TAPE HISS
   * Procedural white noise through 1.4kHz bandpass filter with randomized dust clicks.
   */
  public playVinylCrackle(durationSec: number = 1.2): void {
    const ctx = this.initContext();
    if (!ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const safeDuration = Math.max(0.1, durationSec);
      const bufferSize = Math.floor(ctx.sampleRate * safeDuration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Fill buffer with analog hiss + randomized dust pops
      for (let i = 0; i < bufferSize; i++) {
        const isPop = Math.random() < 0.0009;
        data[i] = isPop
          ? (Math.random() > 0.5 ? 0.85 : -0.85)
          : (Math.random() * 2 - 1) * 0.05;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(1.4, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + safeDuration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      source.start(now);
      source.stop(now + safeDuration + 0.05);
    } catch {
      // Buffer/source scheduling exception safety
    }
  }

  /**
   * 3. 3D CARD FLIP WHOOSH
   * Sweeping lowpass filter (250Hz -> 2800Hz -> 320Hz) over noise burst emulating card rotation.
   */
  public playCardFlipWhoosh(): void {
    const ctx = this.initContext();
    if (!ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const duration = 0.22;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.45;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(2800, now + 0.09);
      filter.frequency.exponentialRampToValueAtTime(320, now + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.45, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      source.start(now);
      source.stop(now + duration);
    } catch {
      // Audio node scheduling exception safety
    }
  }

  /**
   * 4. THERMAL RECEIPT MECHANICAL STEPPER CLICK
   * Micro triangle blip (3.2kHz -> 800Hz) emulating receipt paper advancement.
   */
  public playReceiptClick(): void {
    const ctx = this.initContext();
    if (!ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(3200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.022);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Audio node scheduling exception safety
    }
  }
}

export const soundSynthesizer = new YeSoundSynthesizer();
export const soundFx = soundSynthesizer;
export default soundSynthesizer;
