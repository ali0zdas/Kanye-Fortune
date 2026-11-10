/**
 * tests/m3_audio_tts_test.mjs
 * Empirical unit and stress test suite for Milestone 3 (Web Audio & Micro-TTS Synthesis)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: [],
};

function assert(condition, message, details = null) {
  results.total++;
  if (condition) {
    results.passed++;
    console.log(`  ✓ ${message}`);
  } else {
    results.failed++;
    results.failures.push({ message, details });
    console.error(`  ✗ FAIL: ${message}`);
    if (details) console.error(`    Details:`, details);
  }
}

console.log('====================================================');
console.log(' Milestone 3: Audio & TTS Empirical Verification   ');
console.log('====================================================\n');

// -----------------------------------------------------------------------------
// Test Suite 1: File Existence & Interface Contracts
// -----------------------------------------------------------------------------
console.log('Suite 1: File Existence & Interface Contracts');
{
  const requiredFiles = [
    'src/types/audio.ts',
    'src/types/tts.ts',
    'src/services/audioSynthesizer.ts',
    'src/services/tts/WebSpeechProvider.ts',
    'src/services/tts/RemoteTTSProvider.ts',
    'src/hooks/useYeAudio.ts',
    'src/hooks/useKanyeTTS.ts',
  ];

  for (const relPath of requiredFiles) {
    const fullPath = path.join(ROOT_DIR, relPath);
    assert(fs.existsSync(fullPath), `Required file exists: ${relPath}`);
  }

  // Contract checks for audio.ts
  const audioTs = fs.readFileSync(path.join(ROOT_DIR, 'src/types/audio.ts'), 'utf-8');
  assert(audioTs.includes('interface SoundSynthesizer'), 'audio.ts defines SoundSynthesizer interface');
  assert(audioTs.includes('initContext(): AudioContext | null;'), 'SoundSynthesizer defines initContext');
  assert(audioTs.includes('toggleMute(): boolean;'), 'SoundSynthesizer defines toggleMute');
  assert(audioTs.includes('getMuted(): boolean;'), 'SoundSynthesizer defines getMuted');
  assert(audioTs.includes('playSubBass808(): void;'), 'SoundSynthesizer defines playSubBass808');
  assert(audioTs.includes('playVinylCrackle(durationSec?: number): void;'), 'SoundSynthesizer defines playVinylCrackle');
  assert(audioTs.includes('playCardFlipWhoosh(): void;'), 'SoundSynthesizer defines playCardFlipWhoosh');
  assert(audioTs.includes('playReceiptClick(): void;'), 'SoundSynthesizer defines playReceiptClick');
  assert(audioTs.includes('interface UseYeAudioReturn'), 'audio.ts defines UseYeAudioReturn');

  // Contract checks for tts.ts
  const ttsTs = fs.readFileSync(path.join(ROOT_DIR, 'src/types/tts.ts'), 'utf-8');
  assert(ttsTs.includes('interface TTSProvider'), 'tts.ts defines TTSProvider interface');
  assert(ttsTs.includes('speak('), 'TTSProvider defines speak method');
  assert(ttsTs.includes('stop(): void;'), 'TTSProvider defines stop method');
  assert(ttsTs.includes('isSupported(): boolean;'), 'TTSProvider defines isSupported method');
  assert(ttsTs.includes('interface UseKanyeTTSReturn'), 'tts.ts defines UseKanyeTTSReturn');
  assert(ttsTs.includes('interface RemoteTTSConfig'), 'tts.ts defines RemoteTTSConfig');
}

// -----------------------------------------------------------------------------
// Test Suite 2: Web Audio Procedural Synth Inspection & Mock Simulation
// -----------------------------------------------------------------------------
console.log('\nSuite 2: Web Audio Synthesizer Engine Invariants');
{
  const synthSource = fs.readFileSync(path.join(ROOT_DIR, 'src/services/audioSynthesizer.ts'), 'utf-8');

  // Zero-asset verification
  assert(!synthSource.includes('.mp3'), 'Synthesizer uses NO external .mp3 files');
  assert(!synthSource.includes('.wav'), 'Synthesizer uses NO external .wav files');
  assert(!synthSource.includes('.ogg'), 'Synthesizer uses NO external .ogg files');

  // 808 sub-bass verification
  assert(synthSource.includes("osc.type = 'sine'"), '808 kick uses sine wave');
  assert(synthSource.includes('setValueAtTime(160, now)'), '808 kick starts at 160 Hz');
  assert(synthSource.includes('exponentialRampToValueAtTime(46,'), '808 kick ramps down to 46 Hz');
  assert(synthSource.includes('exponentialRampToValueAtTime(34,'), '808 kick settles around sub-bass ~34 Hz');
  assert(synthSource.includes('stop(now + 1.0)'), '808 kick terminates cleanly after 1 second');

  // Vinyl crackle verification
  assert(synthSource.includes("filter.type = 'bandpass'"), 'Vinyl crackle uses bandpass filter');
  assert(synthSource.includes('setValueAtTime(1400, now)'), 'Bandpass center frequency is 1400 Hz');
  assert(synthSource.includes('setValueAtTime(1.4, now)'), 'Bandpass filter Q factor is 1.4');
  assert(synthSource.includes('createBuffer(1,'), 'Creates mono noise buffer');

  // Card flip whoosh verification
  assert(synthSource.includes("filter.type = 'lowpass'"), 'Card whoosh uses lowpass filter');
  assert(synthSource.includes('setValueAtTime(250, now)'), 'Whoosh lowpass starts at 250 Hz');
  assert(synthSource.includes('exponentialRampToValueAtTime(2800,'), 'Whoosh sweeps up to 2800 Hz');
  assert(synthSource.includes('exponentialRampToValueAtTime(320,'), 'Whoosh decays down to 320 Hz');

  // Thermal receipt click verification
  assert(synthSource.includes("osc.type = 'triangle'"), 'Receipt click uses triangle wave');
  assert(synthSource.includes('setValueAtTime(3200, now)'), 'Receipt click starts at 3200 Hz');
  assert(synthSource.includes('exponentialRampToValueAtTime(800,'), 'Receipt click drops to 800 Hz');

  // Autoplay and persistence verification
  assert(synthSource.includes('ye_fortune_muted'), 'Mute preference persists under ye_fortune_muted');
  assert(synthSource.includes('ctx.state === \'suspended\''), 'Detects suspended AudioContext');
  assert(synthSource.includes('ctx.resume()'), 'Resumes AudioContext on user gesture');
  assert(synthSource.includes('export const soundSynthesizer'), 'Exports soundSynthesizer instance');
}

// -----------------------------------------------------------------------------
// Test Suite 3: Speech Synthesis Tunings & Voice Matching
// -----------------------------------------------------------------------------
console.log('\nSuite 3: Kanye West Voice Profile Tuning');
{
  const webSpeechSource = fs.readFileSync(path.join(ROOT_DIR, 'src/services/tts/WebSpeechProvider.ts'), 'utf-8');

  assert(webSpeechSource.includes("readonly id: string = 'browser-speech'"), 'WebSpeechProvider id is browser-speech');
  assert(webSpeechSource.includes("readonly name: string = 'Native Neural Voice'"), 'WebSpeechProvider name is Native Neural Voice');
  assert(webSpeechSource.includes('utterance.pitch = 0.82'), 'Pitch is tuned to deep resonant 0.82');
  assert(webSpeechSource.includes('utterance.rate = 0.94'), 'Rate is tuned to measured deliberate 0.94');
  assert(webSpeechSource.includes('speechSynthesis.cancel()'), 'Cancels active speech to prevent Chrome 15s freeze');
  assert(webSpeechSource.includes('onend'), 'Handles speech onend callback');
  assert(webSpeechSource.includes('onerror'), 'Handles speech onerror callback with cancel exclusion');
}

// -----------------------------------------------------------------------------
// Test Suite 4: Remote TTS Extensibility & Network Failover
// -----------------------------------------------------------------------------
console.log('\nSuite 4: Remote Micro-TTS Strategy Pattern');
{
  const remoteTtsSource = fs.readFileSync(path.join(ROOT_DIR, 'src/services/tts/RemoteTTSProvider.ts'), 'utf-8');

  assert(remoteTtsSource.includes("readonly id: string = 'remote-micro-tts'"), 'RemoteTTSProvider id is remote-micro-tts');
  assert(remoteTtsSource.includes("readonly name: string = 'Cloud Ye Model'"), 'RemoteTTSProvider name is Cloud Ye Model');
  assert(remoteTtsSource.includes('fetch(this.config.endpointUrl'), 'Fetches configured remote endpoint');
  assert(remoteTtsSource.includes('method: \'POST\''), 'Uses POST method with JSON payload');
  assert(remoteTtsSource.includes('URL.revokeObjectURL'), 'Revokes object URLs to prevent memory leaks');
  assert(remoteTtsSource.includes('currentAudio.pause()'), 'Pauses and stops audio playback cleanly');
}

// -----------------------------------------------------------------------------
// Test Suite 5: React Audio and TTS Hooks Contracts
// -----------------------------------------------------------------------------
console.log('\nSuite 5: React Hooks Export & API Integrity');
{
  const audioHookSource = fs.readFileSync(path.join(ROOT_DIR, 'src/hooks/useYeAudio.ts'), 'utf-8');
  assert(audioHookSource.includes('export function useYeAudio'), 'useYeAudio hook is exported');
  assert(audioHookSource.includes('toggleMute'), 'useYeAudio provides toggleMute');
  assert(audioHookSource.includes('playSubBass808'), 'useYeAudio provides playSubBass808');
  assert(audioHookSource.includes('playVinylCrackle'), 'useYeAudio provides playVinylCrackle');
  assert(audioHookSource.includes('playCardFlipWhoosh'), 'useYeAudio provides playCardFlipWhoosh');
  assert(audioHookSource.includes('playReceiptClick'), 'useYeAudio provides playReceiptClick');
  assert(audioHookSource.includes('initAudio'), 'useYeAudio provides initAudio');

  const ttsHookSource = fs.readFileSync(path.join(ROOT_DIR, 'src/hooks/useKanyeTTS.ts'), 'utf-8');
  assert(ttsHookSource.includes('export function useKanyeTTS'), 'useKanyeTTS hook is exported');
  assert(ttsHookSource.includes('isPlaying'), 'useKanyeTTS provides isPlaying state');
  assert(ttsHookSource.includes('isSupported'), 'useKanyeTTS provides isSupported state');
  assert(ttsHookSource.includes('error'), 'useKanyeTTS provides error state');
  assert(ttsHookSource.includes('speak'), 'useKanyeTTS provides speak method');
  assert(ttsHookSource.includes('stop'), 'useKanyeTTS provides stop method');
  assert(ttsHookSource.includes('toggle'), 'useKanyeTTS provides toggle method');
  assert(ttsHookSource.includes('providerName'), 'useKanyeTTS provides providerName');
}

// -----------------------------------------------------------------------------
// Summary & Verdict
// -----------------------------------------------------------------------------
console.log('\n====================================================');
console.log(` Results: ${results.passed} / ${results.total} assertions passed`);
if (results.failures.length > 0) {
  console.log(` Failed: ${results.failed} assertions`);
  for (const f of results.failures) {
    console.error(`  - ${f.message}`);
  }
}
console.log('====================================================\n');

process.exit(results.failed === 0 ? 0 : 1);
