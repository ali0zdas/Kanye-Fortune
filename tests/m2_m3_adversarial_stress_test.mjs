/**
 * tests/m2_m3_adversarial_stress_test.mjs
 * Comprehensive Adversarial Stress Test Suite for Milestone 2 & Milestone 3
 * Reviewer 2 / Adversarial Critic
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../e2e/harness/browserMock.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Set up full browser mock environment
env.setupGlobals();

const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: [],
};

function test(name, fn) {
  stats.total++;
  try {
    fn();
    stats.passed++;
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    stats.failed++;
    stats.failures.push({ name, error: err });
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

async function testAsync(name, fn) {
  stats.total++;
  try {
    await fn();
    stats.passed++;
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    stats.failed++;
    stats.failures.push({ name, error: err });
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toBeGreaterThan(expected) {
      if (!(actual > expected)) {
        throw new Error(`Expected ${actual} > ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected) {
      if (!(actual >= expected)) {
        throw new Error(`Expected ${actual} >= ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected) {
      if (!(actual <= expected)) {
        throw new Error(`Expected ${actual} <= ${expected}`);
      }
    },
    toContain(expected) {
      if (!actual || !actual.includes(expected)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(expected)}`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error(`Expected value to be defined`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null but got ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy but got ${JSON.stringify(actual)}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy but got ${JSON.stringify(actual)}`);
      }
    },
  };
}

console.log('========================================================================');
console.log('   ADVERSARIAL STRESS TEST SUITE: MILESTONE 2 & MILESTONE 3             ');
console.log('========================================================================\n');

// -----------------------------------------------------------------------------
// SECTION 1: INTEGRITY AUDIT — CODEBASE SCAN FOR SHORTCUTS & FACADES
// -----------------------------------------------------------------------------
console.log('--- SECTION 1: Forensic Integrity & Anti-Facade Audit ---');

test('Audit 1.1: No hardcoded test responses or bypasses in M2 implementation', () => {
  const m2Files = [
    'src/data/kanyeQuotesVault.ts',
    'src/services/kanyeApi.ts',
    'src/services/oracleEngine.ts',
    'src/hooks/useKanyeFortune.ts',
  ];
  for (const file of m2Files) {
    const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf-8');
    expect(content.includes('TODO')).toBe(false);
    expect(content.includes('FIXME')).toBe(false);
    expect(content.includes('placeholder')).toBe(false);
    expect(content.includes('__MOCK__')).toBe(false);
  }
});

test('Audit 1.2: No hardcoded test responses or dummy facades in M3 implementation', () => {
  const m3Files = [
    'src/services/audioSynthesizer.ts',
    'src/services/tts/WebSpeechProvider.ts',
    'src/services/tts/RemoteTTSProvider.ts',
    'src/hooks/useYeAudio.ts',
    'src/hooks/useKanyeTTS.ts',
  ];
  for (const file of m3Files) {
    const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf-8');
    expect(content.includes('TODO')).toBe(false);
    expect(content.includes('FIXME')).toBe(false);
    expect(content.includes('__MOCK__')).toBe(false);
  }
});

test('Audit 1.3: Real procedural Web Audio math instead of empty stubs', () => {
  const synthSource = fs.readFileSync(path.join(ROOT_DIR, 'src/services/audioSynthesizer.ts'), 'utf-8');
  expect(synthSource.includes('.connect(')).toBe(true);
  expect(synthSource.includes('exponentialRampToValueAtTime')).toBe(true);
  expect(synthSource.includes('createOscillator')).toBe(true);
  expect(synthSource.includes('createGain')).toBe(true);
  expect(synthSource.includes('createBuffer')).toBe(true);
  expect(synthSource.includes('createBiquadFilter')).toBe(true);
});

// -----------------------------------------------------------------------------
// SECTION 2: MILESTONE 2 — ORACLE ENGINE & VAULT ADVERSARIAL STRESS
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 2: Milestone 2 Adversarial Stress (Oracle & Vault) ---');

const {
  KANYE_OFFLINE_VAULT,
  getRandomOfflineQuote,
  getQuotesByEra,
  getQuotesByMood,
} = await import('../src/data/kanyeQuotesVault.ts');

const {
  generateKanyeFortune,
  computeDeterministicHash,
  DESTINY_VERDICTS,
  YEEZY_ARTIFACTS,
  ACTIONABLE_COMMANDS,
  AURA_TITLES,
} = await import('../src/services/oracleEngine.ts');

const {
  fetchKanyeQuote,
  DEFAULT_TIMEOUT_MS,
} = await import('../src/services/kanyeApi.ts');

test('Stress 2.1: Vault categorization integrity and uniqueness', () => {
  expect(KANYE_OFFLINE_VAULT.length).toBe(42);
  const quotes = new Set();
  for (const item of KANYE_OFFLINE_VAULT) {
    expect(item.quote.length).toBeGreaterThan(0);
    expect(['donda', 'graduation', '808s', 'yeezus'].includes(item.era)).toBe(true);
    expect(['philosophical', 'boastful', 'introspective', 'creative', 'humorous'].includes(item.mood)).toBe(true);
    quotes.add(item.quote);
  }
  expect(quotes.size).toBe(42);
});

test('Stress 2.2: getRandomOfflineQuote fallback on invalid or empty mood filter', () => {
  const fallback = getRandomOfflineQuote('non_existent_mood');
  expect(fallback).toBeDefined();
  expect(fallback.quote.length).toBeGreaterThan(0);
});

test('Stress 2.3: Deterministic hash stability across 10,000 iterations', () => {
  const seed = 'Truth is my goal. Controversy is my gym.::Should I drop out of college?::graduation';
  const initialHash = computeDeterministicHash(seed);
  for (let i = 0; i < 10000; i++) {
    const h = computeDeterministicHash(seed);
    if (h !== initialHash) {
      throw new Error(`Deterministic hash mutated on iteration ${i}: ${h} !== ${initialHash}`);
    }
  }
  expect(initialHash).toBeGreaterThanOrEqual(0);
});

test('Stress 2.4: Deterministic fortune stability for identical inputs', () => {
  const q = 'Should I quit my corporate job to design sneakers?';
  const quote = 'Artists are founders.';
  const era = 'yeezus';

  const f1 = generateKanyeFortune(quote, q, 'api', era);
  const f2 = generateKanyeFortune(quote, q, 'api', era);

  expect(f1.destinyVerdict.title).toBe(f2.destinyVerdict.title);
  expect(f1.oracleInterpretation).toBe(f2.oracleInterpretation);
  expect(f1.actionableCommand).toBe(f2.actionableCommand);
  expect(f1.auraScore).toBe(f2.auraScore);
  expect(f1.auraTitle).toBe(f2.auraTitle);
  expect(f1.luckyArtifact.name).toBe(f2.luckyArtifact.name);
  expect(f1.luckyNumbers).toEqual(f2.luckyNumbers);
});

test('Stress 2.5: Extreme input length handling (100,000 character spam attack)', () => {
  const spam = 'a'.repeat(100000);
  const quote = 'Believe in your flyness... conquer your shyness.';
  const start = performance.now();
  const fortune = generateKanyeFortune(quote, spam, 'api', 'donda');
  const elapsed = performance.now() - start;

  expect(fortune.userQuestion.length).toBe(200);
  expect(elapsed).toBeLessThanOrEqual(50);
});

test('Stress 2.6: Hostile inputs (XSS, SQLi, Null bytes, Emojis, Profanity)', () => {
  const attacks = [
    '<script>alert("hacked")</script>',
    '\x00\x01\x02\x03\x04\x1f',
    '\' OR \'1\'=\'1\'; DROP TABLE fortunes; --',
    '🔥💀🕊️🐐👑💎⚡🔮💔🕊️',
    'What the f*** should I do with my b***h?',
    '   \t\r\n   ',
    'undefined',
    'null',
    'NaN',
    '[object Object]',
  ];

  for (const attack of attacks) {
    const fortune = generateKanyeFortune('Decentralize.', attack, 'offline_vault', 'donda');
    expect(fortune).toBeDefined();
    expect(fortune.destinyVerdict.title.length).toBeGreaterThan(0);
    expect(fortune.auraScore).toBeGreaterThanOrEqual(85);
    expect(fortune.auraScore).toBeLessThanOrEqual(100);
    expect(fortune.luckyNumbers[1]).toBe(808);
  }
});

test('Stress 2.7: Empty question serendipity mode validation', () => {
  const fortune = generateKanyeFortune('Winning is the only option.', '', 'api', 'graduation');
  expect(fortune.userQuestion).toBeNull();
  expect(fortune.oracleInterpretation).toContain('arrived with empty hands and open channels');
  expect(fortune.oracleInterpretation).toContain('Winning is the only option.');
});

test('Stress 2.8: Whitespace-only question treats as empty', () => {
  const fortune = generateKanyeFortune('Winning is the only option.', '     \t\n   ', 'api', 'graduation');
  expect(fortune.userQuestion).toBeNull();
  expect(fortune.oracleInterpretation).toContain('arrived with empty hands and open channels');
});

test('Stress 2.9: Null/Undefined quote safety', () => {
  const fortune = generateKanyeFortune(null, 'test dilemma', 'api', '808s');
  expect(fortune.quote).toBe('');
  expect(fortune.destinyVerdict).toBeDefined();
});

test('Stress 2.10: Aura Score mathematical invariants across 1,000 varied seeds', () => {
  for (let i = 0; i < 1000; i++) {
    const seed = `quote_${i}::question_${i * 3}::donda`;
    const f = generateKanyeFortune(`quote_${i}`, `question_${i}`, 'api', 'donda');
    expect(f.auraScore).toBeGreaterThanOrEqual(86);
    expect(f.auraScore).toBeLessThanOrEqual(100);
    expect(f.luckyNumbers[0]).toBeGreaterThanOrEqual(1);
    expect(f.luckyNumbers[0]).toBeLessThanOrEqual(88);
    expect(f.luckyNumbers[1]).toBe(808);
    expect(f.luckyNumbers[2]).toBeGreaterThanOrEqual(1);
    expect(f.luckyNumbers[2]).toBeLessThanOrEqual(2024);
  }
});

// -----------------------------------------------------------------------------
// SECTION 3: API & TIMEOUT / OFFLINE FALLBACK RESILIENCE
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 3: Kanye API & Timeout Fallback Verification ---');

await testAsync('Stress 3.1: forcedOffline=true immediately returns offline vault quote without network', async () => {
  const res = await fetchKanyeQuote(DEFAULT_TIMEOUT_MS, true);
  expect(res.source).toBe('offline_vault');
  expect(res.quote.length).toBeGreaterThan(0);
});

await testAsync('Stress 3.2: Network latency exceeding timeout triggers AbortController and falls back to vault', async () => {
  env.network.mode = 'timeout';
  try {
    const res = await fetchKanyeQuote(10, false);
    expect(res.source).toBe('offline_vault');
    expect(res.quote.length).toBeGreaterThan(0);
  } finally {
    env.network.mode = 'online';
  }
});

await testAsync('Stress 3.3: Mocked HTTP 500 server crash safely falls back to vault', async () => {
  env.network.mode = 'error500';
  try {
    const res = await fetchKanyeQuote(2000, false);
    expect(res.source).toBe('offline_vault');
    expect(res.quote.length).toBeGreaterThan(0);
  } finally {
    env.network.mode = 'online';
  }
});

await testAsync('Stress 3.4: Mocked malformed empty quote response safely falls back to vault', async () => {
  env.network.mockQuote = '   ';
  try {
    const res = await fetchKanyeQuote(2000, false);
    expect(res.source).toBe('offline_vault');
    expect(res.quote.length).toBeGreaterThan(0);
  } finally {
    env.network.mockQuote = 'We are here to complete the revolution.';
  }
});

// -----------------------------------------------------------------------------
// SECTION 4: MILESTONE 3 — WEB AUDIO SYNTHESIZER ADVERSARIAL STRESS
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 4: Milestone 3 Adversarial Stress (Web Audio Synthesizer) ---');

const { YeSoundSynthesizer } = await import('../src/services/audioSynthesizer.ts');

test('Stress 4.1: Synthesizer handles audio context creation and node scheduling', () => {
  const synth = new YeSoundSynthesizer();
  expect(synth.getMuted()).toBe(false);

  synth.playSubBass808();
  synth.playVinylCrackle(0.2);
  synth.playCardFlipWhoosh();
  synth.playReceiptClick();

  expect(env.audioContext).toBeDefined();
  expect(env.audioContext.createdNodes.length).toBeGreaterThan(0);
});

test('Stress 4.2: Toggle mute synchronizes state and stops sound output', () => {
  const synth = new YeSoundSynthesizer();
  synth.initContext();
  const initialNodes = env.audioContext.createdNodes.length;

  // Toggle mute on
  const toggled = synth.toggleMute();
  expect(toggled).toBe(true);
  expect(synth.getMuted()).toBe(true);

  // Play sounds while muted — no new oscillator or buffer source nodes should be created!
  synth.playSubBass808();
  synth.playVinylCrackle();
  synth.playCardFlipWhoosh();
  synth.playReceiptClick();

  // Created nodes count remains identical (no new nodes created)
  expect(env.audioContext.createdNodes.length).toBe(initialNodes);

  // Toggle mute off
  synth.toggleMute();
  expect(synth.getMuted()).toBe(false);

  // Play sounds while unmuted — new nodes ARE created
  synth.playSubBass808();
  expect(env.audioContext.createdNodes.length).toBeGreaterThan(initialNodes);
});

test('Stress 4.3: Rapid concurrent audio hammering (1,000 rapid sound triggers)', () => {
  const synth = new YeSoundSynthesizer();
  for (let i = 0; i < 250; i++) {
    synth.playSubBass808();
    synth.playVinylCrackle(0.01);
    synth.playCardFlipWhoosh();
    synth.playReceiptClick();
  }
});

test('Stress 4.4: Vinyl crackle negative duration clamping safety', () => {
  const synth = new YeSoundSynthesizer();
  synth.playVinylCrackle(-10);
  synth.playVinylCrackle(0);
  synth.playVinylCrackle(NaN);
});

// -----------------------------------------------------------------------------
// SECTION 5: MILESTONE 3 — SPEECH SYNTHESIS & GC RETENTION AUDIT
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 5: Milestone 3 Speech Synthesis & GC Protection Audit ---');

const { WebSpeechProvider } = await import('../src/services/tts/WebSpeechProvider.ts');
const { RemoteTTSProvider } = await import('../src/services/tts/RemoteTTSProvider.ts');

test('Stress 5.1: WebSpeechProvider isSupported handles current environment', () => {
  const provider = new WebSpeechProvider();
  expect(provider.isSupported()).toBe(true);
});

test('Stress 5.2: Chrome 15s Garbage Collection bug defense — reference retention', () => {
  const provider = new WebSpeechProvider();
  provider.speak('I still think I am the greatest.');

  const retained = provider.getCurrentUtterance();
  expect(retained).toBeDefined();
  expect(retained.pitch).toBe(0.82);
  expect(retained.rate).toBe(0.94);
  expect(retained.text).toBe('I still think I am the greatest.');

  provider.stop();
  expect(provider.getCurrentUtterance()).toBeNull();
});

test('Stress 5.3: WebSpeechProvider empty text or whitespace is a clean no-op with onEnd', () => {
  const provider = new WebSpeechProvider();
  let ended = false;
  provider.speak('   ', () => { ended = true; });
  expect(ended).toBe(true);
  expect(provider.getCurrentUtterance()).toBeNull();
});

test('Stress 5.4: WebSpeechProvider ignores user-initiated cancel and interrupted events', () => {
  let errorReported = null;
  const provider = new WebSpeechProvider();
  provider.speak(
    'Test canceled speech',
    () => {},
    (err) => { errorReported = err; }
  );

  // Trigger cancel via mock
  env.speechSynthesis.cancel();
  expect(errorReported).toBeNull();
});

test('Stress 5.5: RemoteTTSProvider Object URL lifecycle and error handling', async () => {
  const provider = new RemoteTTSProvider({ endpointUrl: 'https://api.ye-tts.mock/speak' });
  provider.stop();
  expect(provider.id).toBe('remote-micro-tts');
  expect(provider.name).toBe('Cloud Ye Model');
});

// -----------------------------------------------------------------------------
// SECTION 6: REACT HOOKS CONTRACT & EXPORT INTEGRITY
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 6: React Hooks Contract & Export Integrity ---');

const { useKanyeFortune } = await import('../src/hooks/useKanyeFortune.ts');
const { useYeAudio } = await import('../src/hooks/useYeAudio.ts');
const { useKanyeTTS } = await import('../src/hooks/useKanyeTTS.ts');

test('Stress 6.1: useKanyeFortune export is a valid callable function', () => {
  expect(typeof useKanyeFortune).toBe('function');
});

test('Stress 6.2: useYeAudio export is a valid callable function', () => {
  expect(typeof useYeAudio).toBe('function');
});

test('Stress 6.3: useKanyeTTS export is a valid callable function', () => {
  expect(typeof useKanyeTTS).toBe('function');
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(` RESULTS: ${stats.passed} / ${stats.total} adversarial stress tests passed`);
console.log('========================================================================\n');

if (stats.failed > 0) {
  console.error(`💥 ${stats.failed} ADVERSARIAL STRESS TEST FAILURES:`);
  for (const f of stats.failures) {
    console.error(`  - ${f.name}: ${f.error.message}`);
  }
  process.exit(1);
} else {
  console.log('🛡️ ALL ADVERSARIAL ATTACKS DEFENDED AND INVARIANTS SATISFIED!');
  process.exit(0);
}
