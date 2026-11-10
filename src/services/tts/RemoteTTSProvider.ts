// src/services/tts/RemoteTTSProvider.ts
// Extensible micro-TTS provider for future remote Ye neural models (e.g. ElevenLabs, local Piper/ONNX)

import { TTSProvider, RemoteTTSConfig } from '../../types/tts';

export class RemoteTTSProvider implements TTSProvider {
  readonly id: string = 'remote-micro-tts';
  readonly name: string = 'Cloud Ye Model';

  private config: RemoteTTSConfig;
  private currentAudio: HTMLAudioElement | null = null;
  private currentBlobUrl: string | null = null;

  constructor(config: RemoteTTSConfig) {
    this.config = config;
  }

  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.Audio !== 'undefined' &&
      typeof fetch !== 'undefined'
    );
  }

  public async speak(
    text: string,
    onEnd?: () => void,
    onError?: (err: Error) => void
  ): Promise<void> {
    if (!this.isSupported()) {
      onError?.(new Error('Audio playback or fetch is not supported in this environment'));
      return;
    }

    if (!text || text.trim().length === 0) {
      onEnd?.();
      return;
    }

    try {
      this.stop();

      const response = await fetch(this.config.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
        },
        body: JSON.stringify({
          text,
          voiceId: this.config.voiceId || 'ye-oracle-model-v1',
        }),
      });

      if (!response.ok) {
        throw new Error(`Remote TTS endpoint returned HTTP ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      this.currentBlobUrl = audioUrl;

      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.onended = () => {
        this.cleanupAudio();
        onEnd?.();
      };

      audio.onerror = () => {
        this.cleanupAudio();
        onError?.(new Error('Remote audio playback failed'));
      };

      await audio.play();
    } catch (err) {
      this.cleanupAudio();
      onError?.(err instanceof Error ? err : new Error('Remote TTS synthesis error'));
    }
  }

  public stop(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // Safe catch
      }
    }
    this.cleanupAudio();
  }

  private cleanupAudio(): void {
    if (this.currentBlobUrl && typeof URL !== 'undefined' && URL.revokeObjectURL) {
      try {
        URL.revokeObjectURL(this.currentBlobUrl);
      } catch {
        // Safe catch
      }
      this.currentBlobUrl = null;
    }
    this.currentAudio = null;
  }
}

export default RemoteTTSProvider;
