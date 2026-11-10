// src/types/tts.ts
// Pluggable Text-to-Speech (TTS) provider and hook interfaces

export interface TTSProvider {
  readonly id: string;
  readonly name: string;
  speak(text: string, onEnd?: () => void, onError?: (err: Error) => void): Promise<void> | void;
  stop(): void;
  isSupported(): boolean;
}

export interface UseKanyeTTSReturn {
  isPlaying: boolean;
  isSupported: boolean;
  error: string | null;
  speak: (text: string) => void;
  stop: () => void;
  toggle: (text: string) => void;
  providerName: string;
}

export interface RemoteTTSConfig {
  endpointUrl: string;
  apiKey?: string;
  voiceId?: string;
}
