import { QuoteMood } from '../types/fortune';
import { getRandomOfflineQuote } from '../data/kanyeQuotesVault';

export const API_URL = 'https://api.kanye.rest/';
export const DEFAULT_TIMEOUT_MS = 3500;

export interface KanyeApiResponse {
  quote: string;
}

export interface QuoteResult {
  quote: string;
  source: 'api' | 'offline_vault';
  mood?: QuoteMood;
}

/**
 * Live client for api.kanye.rest with a strict 3.5s timeout.
 * If the API is unreachable, times out, returns an error status, or returns an empty quote,
 * it seamlessly and gracefully falls back to the curated 42-quote offline vault.
 */
export async function fetchKanyeQuote(
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
  forcedOffline: boolean = false
): Promise<QuoteResult> {
  // Check for intentional offline mode or browser offline status
  if (
    forcedOffline ||
    (typeof navigator !== 'undefined' && navigator.onLine === false)
  ) {
    const fallback = getRandomOfflineQuote();
    return {
      quote: fallback.quote,
      source: 'offline_vault',
      mood: fallback.mood,
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
      cache: 'no-cache',
    });
    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = (await response.json()) as KanyeApiResponse;
    const cleanQuote = (data?.quote || '').trim();

    if (!cleanQuote) {
      throw new Error('Malformed or empty quote received from API');
    }

    return {
      quote: cleanQuote,
      source: 'api',
    };
  } catch (_err) {
    clearTimeout(timer);
    const fallback = getRandomOfflineQuote();
    return {
      quote: fallback.quote,
      source: 'offline_vault',
      mood: fallback.mood,
    };
  }
}

/**
 * Backward and test compatibility alias
 */
export const fetchKanyeQuoteWithTimeout = fetchKanyeQuote;
