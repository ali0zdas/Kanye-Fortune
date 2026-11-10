// src/hooks/useYeAudio.ts
// React hook to trigger procedural Web Audio sound effects with gesture unlock and mute persistence

import { useState, useEffect, useCallback } from 'react';
import { soundSynthesizer } from '../services/audioSynthesizer';
import { UseYeAudioReturn } from '../types/audio';

export function useYeAudio(): UseYeAudioReturn {
  const [isMuted, setIsMuted] = useState<boolean>(() => soundSynthesizer.getMuted());

  // Keep state in sync with localStorage across browser tabs / windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ye_fortune_muted' && e.newValue !== null) {
        setIsMuted(e.newValue === 'true');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, []);

  const toggleMute = useCallback((): boolean => {
    const updated = soundSynthesizer.toggleMute();
    setIsMuted(updated);
    return updated;
  }, []);

  const playSubBass808 = useCallback((): void => {
    soundSynthesizer.playSubBass808();
  }, []);

  const playVinylCrackle = useCallback((durationSec?: number): void => {
    soundSynthesizer.playVinylCrackle(durationSec);
  }, []);

  const playCardFlipWhoosh = useCallback((): void => {
    soundSynthesizer.playCardFlipWhoosh();
  }, []);

  const playReceiptClick = useCallback((): void => {
    soundSynthesizer.playReceiptClick();
  }, []);

  const initAudio = useCallback((): void => {
    soundSynthesizer.initContext();
  }, []);

  return {
    isMuted,
    toggleMute,
    playSubBass808,
    playVinylCrackle,
    playCardFlipWhoosh,
    playReceiptClick,
    initAudio,
  };
}

export default useYeAudio;
