// src/hooks/useKanyeTTS.ts
// React hook for Kanye West voice synthesis with pluggable provider architecture

import { useState, useEffect, useCallback, useRef } from 'react';
import { TTSProvider, UseKanyeTTSReturn } from '../types/tts';
import { WebSpeechProvider } from '../services/tts/WebSpeechProvider';

export function useKanyeTTS(customProvider?: TTSProvider): UseKanyeTTSReturn {
  const providerRef = useRef<TTSProvider>(customProvider || new WebSpeechProvider());
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Update provider ref when customProvider prop changes
  useEffect(() => {
    if (customProvider) {
      providerRef.current = customProvider;
    }
  }, [customProvider]);

  // Check support and setup voices listener
  useEffect(() => {
    setIsSupported(providerRef.current.isSupported());

    if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
      const handleVoicesChanged = () => {
        setIsSupported(providerRef.current.isSupported());
      };

      try {
        window.speechSynthesis.addEventListener?.('voiceschanged', handleVoicesChanged);
      } catch {
        // Fallback for browsers without addEventListener on speechSynthesis
        window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      }

      return () => {
        try {
          providerRef.current.stop();
        } catch {
          // Safe catch
        }
        try {
          window.speechSynthesis.removeEventListener?.('voiceschanged', handleVoicesChanged);
        } catch {
          // Safe catch
        }
      };
    }

    return () => {
      try {
        providerRef.current.stop();
      } catch {
        // Safe catch
      }
    };
  }, []);

  const stop = useCallback((): void => {
    providerRef.current.stop();
    setIsPlaying(false);
  }, []);

  const speak = useCallback((text: string): void => {
    if (!text || text.trim().length === 0) return;

    setError(null);
    setIsPlaying(true);

    providerRef.current.speak(
      text,
      () => {
        setIsPlaying(false);
      },
      (err: Error) => {
        setError(err.message);
        setIsPlaying(false);
      }
    );
  }, []);

  const toggle = useCallback(
    (text: string): void => {
      if (isPlaying) {
        stop();
      } else {
        speak(text);
      }
    },
    [isPlaying, speak, stop]
  );

  return {
    isPlaying,
    isSupported,
    error,
    speak,
    stop,
    toggle,
    providerName: providerRef.current.name,
  };
}

export default useKanyeTTS;
