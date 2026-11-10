import { useState, useCallback, useEffect } from 'react';
import { EraId, KanyeFortunePackage, ViewMode } from '../types/fortune';
import { fetchKanyeQuote, DEFAULT_TIMEOUT_MS } from '../services/kanyeApi';
import { generateKanyeFortune } from '../services/oracleEngine';

export interface UseKanyeFortuneOptions {
  initialEra?: EraId;
  initialViewMode?: ViewMode;
  initialFortune?: KanyeFortunePackage | null;
  forcedOffline?: boolean;
  autoDraw?: boolean;
}

export interface UseKanyeFortuneReturn {
  fortune: KanyeFortunePackage | null;
  isLoading: boolean;
  isFlipped: boolean;
  activeEra: EraId;
  viewMode: ViewMode;
  userQuestion: string;
  setUserQuestion: (q: string) => void;
  setActiveEra: (era: EraId) => void;
  setViewMode: (mode: ViewMode) => void;
  drawFortune: (question?: string) => Promise<KanyeFortunePackage>;
  flipCard: () => void;
}

/**
 * Primary React hook managing Kanye Fortune state, asynchronous quote fetching,
 * deterministic oracle fortune generation, era transitions, view modes, and card flips.
 * Conforms strictly to PROJECT.md § Interface Contracts.
 */
export function useKanyeFortune(options?: UseKanyeFortuneOptions): UseKanyeFortuneReturn {
  const [fortune, setFortune] = useState<KanyeFortunePackage | null>(
    options?.initialFortune ?? null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [activeEra, setActiveEra] = useState<EraId>(options?.initialEra ?? 'donda');
  const [viewMode, setViewMode] = useState<ViewMode>(options?.initialViewMode ?? 'card');
  const [userQuestion, setUserQuestion] = useState<string>('');

  // Sync data-era attribute to DOM document root for CSS custom properties
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-era', activeEra);
    }
  }, [activeEra]);

  const flipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const drawFortune = useCallback(
    async (question?: string): Promise<KanyeFortunePackage> => {
      setIsLoading(true);
      // Card flip state is reset to front (unflipped) upon drawing a new fortune
      setIsFlipped(false);

      const targetQuestion = question !== undefined ? question : userQuestion;
      if (question !== undefined) {
        setUserQuestion(question);
      }

      try {
        const quoteResult = await fetchKanyeQuote(
          DEFAULT_TIMEOUT_MS,
          options?.forcedOffline
        );
        const newFortune = generateKanyeFortune(
          quoteResult.quote,
          targetQuestion,
          quoteResult.source,
          activeEra
        );
        setFortune(newFortune);
        return newFortune;
      } finally {
        setIsLoading(false);
      }
    },
    [userQuestion, activeEra, options?.forcedOffline]
  );

  // Optional auto-draw on mount if requested in options
  useEffect(() => {
    if (options?.autoDraw && !fortune) {
      drawFortune().catch(() => {});
    }
  }, [options?.autoDraw]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    fortune,
    isLoading,
    isFlipped,
    activeEra,
    viewMode,
    userQuestion,
    setUserQuestion,
    setActiveEra,
    setViewMode,
    drawFortune,
    flipCard,
  };
}
