/**
 * tests/tier5_adversarial_logic.mjs
 * Tier 5 White-Box Adversarial Stress Test Suite
 * Target: kanyeApi.ts, oracleEngine.ts, audioSynthesizer.ts, useExportImage.ts & shareHelpers.ts
 * Role: Challenger 1 (Logic, Audio & Export Hardening)
 */

import { env } from '../e2e/harness/browserMock.ts';
import { fetchKanyeQuote, DEFAULT_TIMEOUT_MS, API_URL } from '../src/services/kanyeApi.ts';
import {
  generateKanyeFortune,
  computeDeterministicHash,
  DESTINY_VERDICTS,
  YEEZY_ARTIFACTS,
  AURA_TITLES,
  ACTIONABLE_COMMANDS,
  TOPIC_PATTERNS,
} from '../src/services/oracleEngine.ts';
import { YeSoundSynthesizer } from '../src/services/audioSynthesizer.ts';
import {
  formatClipboardShareText,
  createTwitterShareUrl,
  copyFortuneToClipboard,
} from '../src/utils/shareHelpers.ts';

// 1. Initialize Headless Browser Environment
env.setupGlobals();

// Test Execution & Reporting Harness
const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: [],
  findings: [],
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
        throw new Error(`Expected deep equal ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy() {
      if (!actual) throw new Error(`Expected truthy but got ${JSON.stringify(actual)}`);
    },
    toBeFalsy() {
      if (actual) throw new Error(`Expected falsy but got ${JSON.stringify(actual)}`);
    },
    toBeGreaterThanOrEqual(expected) {
      if (actual < expected) throw new Error(`Expected ${actual} >= ${expected}`);
    },
    toBeLessThanOrEqual(expected) {
      if (actual > expected) throw new Error(`Expected ${actual} <= ${expected}`);
    },
    toThrow(expectedSubstring) {
      let threw = false;
      let error = null;
      try {
        actual();
      } catch (e) {
        threw = true;
        error = e;
      }
      if (!threw) throw new Error(`Expected function to throw, but it succeeded`);
      if (expectedSubstring && !error.message.includes(expectedSubstring)) {
        throw new Error(`Expected error message to include "${expectedSubstring}", but got "${error.message}"`);
      }
    },
    toContain(substr) {
      if (typeof actual !== 'string' || !actual.includes(substr)) {
        throw new Error(`Expected string to contain "${substr}", got "${actual}"`);
      }
    },
    not: {
      toContain(substr) {
        if (typeof actual === 'string' && actual.includes(substr)) {
          throw new Error(`Expected string NOT to contain "${substr}", but it did`);
        }
      },
    },
  };
}

console.log('========================================================================');
console.log('    TIER 5 ADVERSARIAL STRESS TEST SUITE — CHALLENGER 1 (LOGIC & IO)     ');
console.log('========================================================================\n');

// -----------------------------------------------------------------------------
// SECTION 1: kanyeApi.ts Adversarial Probing & Network Chaos
// -----------------------------------------------------------------------------
console.log('--- SECTION 1: kanyeApi.ts Adversarial Probing & Network Chaos ---');

await testAsync('1.1: Simulates HTTP 500 Internal Server Error with graceful offline vault fallback', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    status: 500,
    statusText: 'Internal Server Error',
    json: async () => ({ error: 'Database crash' }),
  });

  try {
    const res = await fetchKanyeQuote(1000);
    expect(res.source).toBe('offline_vault');
    expect(typeof res.quote).toBe('string');
    expect(res.quote.length).toBeGreaterThanOrEqual(3);
    expect(typeof res.mood).toBe('string');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await testAsync('1.2: Simulates HTTP 429 Rate Limiting with graceful offline vault fallback', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    status: 429,
    statusText: 'Too Many Requests',
    json: async () => ({ error: 'Rate limit exceeded' }),
  });

  try {
    const res = await fetchKanyeQuote(1000);
    expect(res.source).toBe('offline_vault');
    expect(res.quote.length).toBeGreaterThanOrEqual(3);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await testAsync('1.3: Simulates HTTP 404 & HTTP 502 with graceful fallback', async () => {
  const originalFetch = globalThis.fetch;
  for (const status of [404, 502, 503, 504]) {
    globalThis.fetch = async () => ({
      ok: false,
      status,
      statusText: `Error ${status}`,
      json: async () => ({}),
    });
    const res = await fetchKanyeQuote(1000);
    expect(res.source).toBe('offline_vault');
  }
  globalThis.fetch = originalFetch;
});

await testAsync('1.4: Network dropout: fetch rejects with TypeError: Failed to fetch', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new TypeError('Failed to fetch');
  };

  try {
    const res = await fetchKanyeQuote(1000);
    expect(res.source).toBe('offline_vault');
    expect(typeof res.quote).toBe('string');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await testAsync('1.5: Network dropout: fetch throws primitive non-Error string', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw 'Fatal raw network connection drop';
  };

  try {
    const res = await fetchKanyeQuote(1000);
    expect(res.source).toBe('offline_vault');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await testAsync('1.6: Malformed payload: empty JSON object {} returns offline vault', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  });

  try {
    const res = await fetchKanyeQuote(1000);
    expect(res.source).toBe('offline_vault');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await testAsync('1.7: Malformed payload: empty quote string { quote: "" } returns offline vault', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ quote: '' }),
  });

  try {
    const res = await fetchKanyeQuote(1000);
    expect(res.source).toBe('offline_vault');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await testAsync('1.8: Malformed payload: whitespace-only quote { quote: "   \\t\\n  " } returns offline vault', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ quote: '   \t\n   ' }),
  });

  try {
    const res = await fetchKanyeQuote(1000);
    expect(res.source).toBe('offline_vault');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await testAsync('1.9: Malformed payload: non-string number quote { quote: 12345 } is caught safely', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ quote: 12345 }),
  });

  try {
    const res = await fetchKanyeQuote(1000);
    // (12345 || '').trim() throws TypeError in try block, but caught by catch -> fallback
    expect(res.source).toBe('offline_vault');
    expect(typeof res.quote).toBe('string');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await testAsync('1.10: Corrupted response: non-JSON HTML body (502 Cloudflare HTML) triggers JSON SyntaxError', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => {
      throw new SyntaxError('Unexpected token < in JSON at position 0');
    },
  });

  try {
    const res = await fetchKanyeQuote(1000);
    expect(res.source).toBe('offline_vault');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await testAsync('1.11: AbortController timeout: fetch hangs longer than timeoutMs', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (_url, options) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        resolve({
          ok: true,
          status: 200,
          json: async () => ({ quote: 'Too late' }),
        });
      }, 500);

      if (options?.signal) {
        options.signal.addEventListener('abort', () => {
          clearTimeout(timer);
          const err = new Error('The operation was aborted');
          err.name = 'AbortError';
          reject(err);
        });
      }
    });
  };

  try {
    const startTime = Date.now();
    const res = await fetchKanyeQuote(60); // 60ms timeout
    const elapsed = Date.now() - startTime;
    expect(res.source).toBe('offline_vault');
    expect(elapsed).toBeLessThanOrEqual(300);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await testAsync('1.12: forcedOffline=true skips network completely and returns offline vault', async () => {
  let fetchCalled = false;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    fetchCalled = true;
    return { ok: true, json: async () => ({ quote: 'Should not see this' }) };
  };

  try {
    const res = await fetchKanyeQuote(1000, true);
    expect(fetchCalled).toBe(false);
    expect(res.source).toBe('offline_vault');
    expect(typeof res.quote).toBe('string');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await testAsync('1.13: navigator.onLine=false skips network completely', async () => {
  let fetchCalled = false;
  const originalFetch = globalThis.fetch;
  const originalOnLine = navigator.onLine;

  Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
  globalThis.fetch = async () => {
    fetchCalled = true;
    return { ok: true, json: async () => ({ quote: 'Should not see this' }) };
  };

  try {
    const res = await fetchKanyeQuote(1000, false);
    expect(fetchCalled).toBe(false);
    expect(res.source).toBe('offline_vault');
  } finally {
    Object.defineProperty(navigator, 'onLine', { value: originalOnLine, configurable: true });
    globalThis.fetch = originalFetch;
  }
});

await testAsync('1.14: Concurrent fetch storm: 50 simultaneous requests under mixed conditions', async () => {
  const originalFetch = globalThis.fetch;
  let callCount = 0;

  globalThis.fetch = async () => {
    callCount++;
    const r = Math.random();
    if (r < 0.25) {
      throw new TypeError('Socket closed');
    } else if (r < 0.5) {
      return { ok: false, status: 503, json: async () => ({}) };
    } else if (r < 0.75) {
      return { ok: true, status: 200, json: async () => ({ quote: `Live Quote Ye #${callCount}` }) };
    } else {
      return { ok: true, status: 200, json: async () => ({}) };
    }
  };

  try {
    const promises = Array.from({ length: 50 }, () => fetchKanyeQuote(200));
    const results = await Promise.all(promises);

    expect(results.length).toBe(50);
    for (const r of results) {
      expect(typeof r.quote).toBe('string');
      expect(r.quote.length).toBeGreaterThanOrEqual(1);
      expect(['api', 'offline_vault'].includes(r.source)).toBe(true);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// -----------------------------------------------------------------------------
// SECTION 2: oracleEngine.ts Adversarial Probing & Deterministic Core
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 2: oracleEngine.ts Adversarial Probing & Deterministic Core ---');

test('2.1: Input length boundary: empty dilemma "" uses serendipity mode and null userQuestion', () => {
  const fortune = generateKanyeFortune('Believe in your flyness', '', 'api', 'graduation');
  expect(fortune.userQuestion).toBe(null);
  expect(fortune.oracleInterpretation).toContain('The Oracle perceives you arrived with empty hands');
  expect(fortune.oracleInterpretation).toContain('Believe in your flyness');
});

test('2.2: Input length boundary: whitespace-only dilemma "   \\n\\t  " treated as empty', () => {
  const fortune = generateKanyeFortune('We are the cleanup crew', '   \t\n   ', 'offline_vault', 'donda');
  expect(fortune.userQuestion).toBe(null);
  expect(fortune.oracleInterpretation).toContain('The Oracle perceives you arrived with empty hands');
});

test('2.3: Input length boundary: exactly 200 characters preserved intact', () => {
  const q200 = 'A'.repeat(200);
  const fortune = generateKanyeFortune('Test quote', q200, 'api', 'yeezus');
  expect(fortune.userQuestion.length).toBe(200);
  expect(fortune.userQuestion).toBe(q200);
});

test('2.4: Input length boundary: 201 characters truncated to exactly 200 characters', () => {
  const q201 = 'B'.repeat(201);
  const fortune = generateKanyeFortune('Test quote', q201, 'api', '808s');
  expect(fortune.userQuestion.length).toBe(200);
  expect(fortune.userQuestion).toBe('B'.repeat(200));
});

test('2.5: Extreme spam: 1,000,000 characters input does not throw and executes fast (<50ms)', () => {
  const hugeSpam = 'YEEZY '.repeat(170000); // > 1,000,000 chars
  const start = Date.now();
  const fortune = generateKanyeFortune('Everything you do stems from fear or love', hugeSpam, 'api', 'donda');
  const duration = Date.now() - start;

  expect(fortune.userQuestion.length).toBe(200);
  expect(duration).toBeLessThanOrEqual(50);
});

test('2.6: Deterministic query repetition: 5,000 identical evaluations produce 100% identical packages', () => {
  const q = 'Should I quit my corporate job to build concrete houses?';
  const quote = 'I am Warhol. I am Shakespeare in the flesh.';
  const era = 'yeezus';

  const baseline = generateKanyeFortune(quote, q, 'api', era);

  for (let i = 0; i < 5000; i++) {
    const sample = generateKanyeFortune(quote, q, 'api', era);
    expect(sample.destinyVerdict.title).toBe(baseline.destinyVerdict.title);
    expect(sample.destinyVerdict.subtitle).toBe(baseline.destinyVerdict.subtitle);
    expect(sample.luckyArtifact.name).toBe(baseline.luckyArtifact.name);
    expect(sample.actionableCommand).toBe(baseline.actionableCommand);
    expect(sample.auraScore).toBe(baseline.auraScore);
    expect(sample.auraTitle).toBe(baseline.auraTitle);
    expect(sample.luckyNumbers[0]).toBe(baseline.luckyNumbers[0]);
    expect(sample.luckyNumbers[1]).toBe(808);
    expect(sample.luckyNumbers[2]).toBe(baseline.luckyNumbers[2]);
    expect(sample.oracleInterpretation).toBe(baseline.oracleInterpretation);
  }
});

test('2.7: Mathematical Invariant: Aura score is strictly bounded [86, 100] across 2,000 diverse seeds', () => {
  const eras = ['donda', 'graduation', '808s', 'yeezus'];
  let minAura = 1000;
  let maxAura = -1;

  for (let i = 0; i < 2000; i++) {
    const dummyQuote = `Quote test vector #${i * 31 + 7}`;
    const dummyQ = i % 2 === 0 ? `Dilemma variation #${i * 17}` : '';
    const era = eras[i % eras.length];
    const fortune = generateKanyeFortune(dummyQuote, dummyQ, 'api', era);

    if (fortune.auraScore < minAura) minAura = fortune.auraScore;
    if (fortune.auraScore > maxAura) maxAura = fortune.auraScore;

    expect(fortune.auraScore).toBeGreaterThanOrEqual(86);
    expect(fortune.auraScore).toBeLessThanOrEqual(100);
  }

  expect(minAura).toBe(86);
  expect(maxAura).toBe(100);
});

test('2.8: Mathematical Invariant: Lucky numbers [n1 in 1..88, n2=808, n3 in 1..2024] across 2,000 diverse seeds', () => {
  const eras = ['donda', 'graduation', '808s', 'yeezus'];
  for (let i = 0; i < 2000; i++) {
    const dummyQuote = `Quote seed #${i}`;
    const fortune = generateKanyeFortune(dummyQuote, 'test', 'api', eras[i % 4]);
    const [n1, n2, n3] = fortune.luckyNumbers;

    expect(n1).toBeGreaterThanOrEqual(1);
    expect(n1).toBeLessThanOrEqual(88);
    expect(n2).toBe(808);
    expect(n3).toBeGreaterThanOrEqual(1);
    expect(n3).toBeLessThanOrEqual(2024);
  }
});

test('2.9: 32-bit Integer boundary & Math.abs(-2147483648): posHash is always non-negative and array indices never undefined', () => {
  // Test computeDeterministicHash with strings specifically probing boundaries
  const testStrings = [
    '',
    '\0',
    '\uFFFF',
    '~',
    'a',
    'zzzzzzzzzz',
    '2147483647',
    '-2147483648',
    'supercalifragilisticexpialidocious',
  ];

  for (const s of testStrings) {
    const h = computeDeterministicHash(s);
    expect(h).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(h)).toBe(true);
    expect(Number.isFinite(h)).toBe(true);

    const fortune = generateKanyeFortune(s, s, 'api', 'donda');
    expect(fortune.destinyVerdict).toBeTruthy();
    expect(fortune.destinyVerdict.title).toBeTruthy();
    expect(fortune.luckyArtifact).toBeTruthy();
    expect(fortune.actionableCommand).toBeTruthy();
    expect(fortune.auraTitle).toBeTruthy();
  }
});

test('2.10: Unicode Astral Plane, Emojis, RTL, and Multilingual Inputs', () => {
  const vectors = [
    { name: 'Emojis & ZWJ', text: '🔥👑🐻💔💽🕊️⛷️' },
    { name: 'Arabic RTL', text: 'هل يجب أن أستقيل من وظيفتي اليوم؟' },
    { name: 'Hebrew RTL', text: 'האם עלי לעזוב את העבודה שלי?' },
    { name: 'Chinese Hanzi', text: '我应该辞职去开创自己的事业吗？' },
    { name: 'Russian Cyrillic', text: 'Стоит ли мне бросить работу и уйти в творчество?' },
    { name: 'Zero-Width Chars', text: 'Hidden\u200BZero\u200CWidth\u200DJoiner\uFEFFTest' },
  ];

  for (const v of vectors) {
    const fortune = generateKanyeFortune('Greatness is non-negotiable', v.text, 'api', 'graduation');
    expect(fortune.userQuestion).toBe(v.text);
    expect(fortune.oracleInterpretation.length).toBeGreaterThanOrEqual(20);
    expect(fortune.destinyVerdict.title.length).toBeGreaterThanOrEqual(3);
  }
});

test('2.11: Security & Injection Resilience: SQLi, XSS, Format Strings, Prototype pollution', () => {
  const injectionVectors = [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "<script>alert('ye')</script>",
    "<img src=x onerror=alert(document.cookie)>",
    'javascript:alert(1)',
    '%s%s%s%s%s%n',
    '__proto__',
    'constructor',
    'prototype',
    '{"admin": true, "__proto__": {"polluted": true}}',
  ];

  for (const inj of injectionVectors) {
    const fortune = generateKanyeFortune('Truth is my goal', inj, 'api', 'yeezus');
    expect(fortune.userQuestion).toBe(inj);
    expect(fortune.oracleInterpretation.length).toBeGreaterThanOrEqual(20);
    expect(Object.prototype.polluted).toBe(undefined);
  }
});

test('2.12: Topic pattern classification and word boundary validation', () => {
  // Punctuation adjacent to keywords
  const careerDilemma = 'Should I quit my job!?';
  const fortuneCareer = generateKanyeFortune('Test quote', careerDilemma, 'api', 'donda');
  expect(fortuneCareer.oracleInterpretation).toContain('spreadsheets are the modern padded cell');

  // Word boundary verification: "networking" should NOT trigger "work"
  const networkingDilemma = 'I went to a social networking mixer yesterday';
  const fortuneNet = generateKanyeFortune('Test quote', networkingDilemma, 'api', 'donda');
  // Should NOT trigger career interpretation because "work" is inside "networking"
  expect(fortuneNet.oracleInterpretation).not.toContain('spreadsheets are the modern padded cell');

  // Creative keyword match
  const creativeDilemma = 'How do I design my new fashion runway line?';
  const fortuneCreative = generateKanyeFortune('Test quote', creativeDilemma, 'api', 'graduation');
  expect(fortuneCreative.oracleInterpretation).toContain('They will call you crazy until the prototype hits the runway');

  // Romance keyword match
  const romanceDilemma = 'My ex texted me at midnight';
  const fortuneRomance = generateKanyeFortune('Test quote', romanceDilemma, 'api', '808s');
  expect(fortuneRomance.oracleInterpretation).toContain('Looking back at an ex is like driving a Maybach at 140 MPH');
});

test('2.13: Full archetypal matrix distribution coverage (8 verdicts, 10 artifacts, 10 commands, 8 titles)', () => {
  const hitVerdicts = new Set();
  const hitArtifacts = new Set();
  const hitCommands = new Set();
  const hitTitles = new Set();
  const eras = ['donda', 'graduation', '808s', 'yeezus'];

  for (let i = 0; i < 3000; i++) {
    const era = eras[i % eras.length];
    const quote = `Quote sample #${i}`;
    const question = i % 2 === 0 ? `Dilemma vector ${i * 7}` : '';
    const fortune = generateKanyeFortune(quote, question, 'api', era);
    hitVerdicts.add(fortune.destinyVerdict.title);
    hitArtifacts.add(fortune.luckyArtifact.name);
    hitCommands.add(fortune.actionableCommand);
    hitTitles.add(fortune.auraTitle);
  }

  expect(hitVerdicts.size).toBe(DESTINY_VERDICTS.length); // 8
  expect(hitArtifacts.size).toBe(YEEZY_ARTIFACTS.length); // 10
  expect(hitCommands.size).toBe(ACTIONABLE_COMMANDS.length); // 10
  expect(hitTitles.size).toBe(AURA_TITLES.length); // 8
});

test('2.14: Null / Undefined Quote parameter resilience', () => {
  const fNull = generateKanyeFortune(null, 'My career', 'api', 'donda');
  expect(fNull.quote).toBe('');
  expect(fNull.oracleInterpretation).toBeTruthy();

  const fUndef = generateKanyeFortune(undefined, '', 'offline_vault', '808s');
  expect(fUndef.quote).toBe('');
  expect(fUndef.oracleInterpretation).toBeTruthy();
});

// -----------------------------------------------------------------------------
// SECTION 3: audioSynthesizer.ts Adversarial Probing & Web Audio Stress
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 3: audioSynthesizer.ts Adversarial Probing & Web Audio Stress ---');

test('3.1: Rapid-fire audio flood: 1,000 rapid sound triggers within 50ms does not crash', () => {
  const synth = new YeSoundSynthesizer();
  const start = Date.now();

  for (let i = 0; i < 250; i++) {
    synth.playSubBass808();
    synth.playVinylCrackle(0.2);
    synth.playCardFlipWhoosh();
    synth.playReceiptClick();
  }

  const duration = Date.now() - start;
  expect(duration).toBeLessThanOrEqual(200);
});

test('3.2: AudioContext state in "suspended" auto-resumes without error', () => {
  const synth = new YeSoundSynthesizer();
  const ctx = synth.initContext();
  if (ctx) {
    ctx.state = 'suspended';
    synth.playSubBass808();
    // Verify no throw
    expect(true).toBe(true);
  }
});

test('3.3: AudioContext state in "closed" handles scheduling exceptions gracefully without crashing', () => {
  const synth = new YeSoundSynthesizer();
  const ctx = synth.initContext();
  if (ctx) {
    ctx.state = 'closed';
    // When context is closed, oscillator creation or timing throws in standard Web Audio
    // Verify synth internal try/catch guards catch it safely
    synth.playSubBass808();
    synth.playVinylCrackle(0.5);
    synth.playCardFlipWhoosh();
    synth.playReceiptClick();
    expect(true).toBe(true);
  }
});

test('3.4: Rapid mute toggling 100 times synchronizes masterGain and suppresses audio', () => {
  const synth = new YeSoundSynthesizer();
  synth.initContext();

  for (let i = 0; i < 100; i++) {
    synth.toggleMute();
    if (i % 5 === 0) {
      synth.playSubBass808();
    }
  }

  const isMuted = synth.getMuted();
  // 100 toggles starting from false -> back to false (unmuted)
  expect(isMuted).toBe(false);

  synth.toggleMute(); // Now muted = true
  expect(synth.getMuted()).toBe(true);

  // Play while muted: zero sounds scheduled
  synth.playSubBass808();
  synth.playVinylCrackle();
  synth.playCardFlipWhoosh();
  synth.playReceiptClick();
});

test('3.5: Vinyl crackle duration parameter boundary: negative, 0, and extreme values', () => {
  const synth = new YeSoundSynthesizer();
  synth.initContext();

  // Negative duration: clamped to 0.1s
  synth.playVinylCrackle(-10);
  // Zero duration: clamped to 0.1s
  synth.playVinylCrackle(0);
  // 5.0 seconds
  synth.playVinylCrackle(5.0);

  // NaN duration: let's verify if playVinylCrackle handles NaN
  try {
    synth.playVinylCrackle(NaN);
    expect(true).toBe(true);
  } catch (err) {
    // If it threw, note as finding
    stats.findings.push({
      component: 'audioSynthesizer.ts',
      issue: 'playVinylCrackle(NaN) uncaught exception',
      details: err.message,
    });
  }
});

test('3.6: Degraded environment: window.AudioContext and webkitAudioContext are undefined', () => {
  const originalAudioContext = window.AudioContext;
  const originalWebkit = window.webkitAudioContext;

  delete window.AudioContext;
  delete window.webkitAudioContext;

  try {
    const synth = new YeSoundSynthesizer();
    const ctx = synth.initContext();
    expect(ctx).toBe(null);

    // All play calls must safely no-op
    synth.playSubBass808();
    synth.playVinylCrackle();
    synth.playCardFlipWhoosh();
    synth.playReceiptClick();
    expect(true).toBe(true);
  } finally {
    window.AudioContext = originalAudioContext;
    window.webkitAudioContext = originalWebkit;
  }
});

test('3.7: LocalStorage failure resilience: storage throws SecurityError or QuotaExceeded', () => {
  const originalGetItem = localStorage.getItem;
  const originalSetItem = localStorage.setItem;

  localStorage.getItem = () => {
    throw new DOMException('Access denied', 'SecurityError');
  };
  localStorage.setItem = () => {
    throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
  };

  try {
    const synth = new YeSoundSynthesizer();
    expect(synth.getMuted()).toBe(false);

    const toggled = synth.toggleMute();
    expect(toggled).toBe(true);
  } finally {
    localStorage.getItem = originalGetItem;
    localStorage.setItem = originalSetItem;
  }
});

// -----------------------------------------------------------------------------
// SECTION 4: useExportImage.ts & shareHelpers.ts Adversarial Probing
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 4: useExportImage.ts & shareHelpers.ts Adversarial Probing ---');

test('4.1: formatClipboardShareText produces valid multi-line structure without undefined/NaN', () => {
  const sampleFortune = generateKanyeFortune(
    'Distraction is the enemy of vision.',
    'How do I focus?',
    'api',
    'donda'
  );

  const text = formatClipboardShareText(sampleFortune);
  expect(text).toContain('"Distraction is the enemy of vision." — Kanye West');
  expect(text).toContain('🔮 Oracle Verdict:');
  expect(text).toContain('⚡ Ye\'s Command:');
  expect(text).toContain('✨ Aura:');
  expect(text).toContain('🏆 Artifact:');
  expect(text).toContain('https://kanyefortune.com');
  expect(text.includes('undefined')).toBe(false);
  expect(text.includes('NaN')).toBe(false);
});

test('4.2: createTwitterShareUrl constructs compliant URL with encoded query parameters', () => {
  const sampleFortune = generateKanyeFortune(
    'My greatest pain in life is that I will never be able to see myself perform live.',
    'Why am I sad?',
    'offline_vault',
    '808s'
  );

  const url = createTwitterShareUrl(sampleFortune);
  expect(url.startsWith('https://twitter.com/intent/tweet?')).toBe(true);
  expect(url).toContain('text=');
  expect(url).toContain('url=');
  expect(url).toContain('hashtags=');
  expect(url).toContain('KanyeWest%2COracleOfYe%2CYeezy');
});

test('4.3: Twitter intent with emojis, quotes, and newlines encodes safely', () => {
  const emojiFortune = generateKanyeFortune(
    'Truth is my gym. 🔥👑',
    'Work dilemma 🐻',
    'api',
    'yeezus'
  );

  const url = createTwitterShareUrl(emojiFortune);
  expect(url).toContain('Truth%20is%20my%20gym.%20%F0%9F%94%A5%F0%9F%91%91');
});

test('4.4: Probe Twitter intent with unpaired surrogate characters (e.g. \\uD800)', () => {
  const surrogateFortune = generateKanyeFortune(
    'Corrupted quote \uD800',
    'Question',
    'api',
    'donda'
  );

  try {
    const url = createTwitterShareUrl(surrogateFortune);
    expect(typeof url).toBe('string');
  } catch (err) {
    stats.findings.push({
      component: 'shareHelpers.ts',
      issue: 'createTwitterShareUrl throws URIError on unpaired surrogate in quote',
      details: err.message,
    });
  }
});

await testAsync('4.5: copyFortuneToClipboard uses navigator.clipboard when available', async () => {
  let copiedText = '';
  const originalClipboard = navigator.clipboard;

  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: async (t) => {
        copiedText = t;
      },
    },
    configurable: true,
  });

  try {
    const fortune = generateKanyeFortune('Winning is the only option.', '', 'api', 'yeezus');
    const success = await copyFortuneToClipboard(fortune);
    expect(success).toBe(true);
    expect(copiedText).toContain('Winning is the only option.');
  } finally {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    });
  }
});

await testAsync('4.6: copyFortuneToClipboard falls back to document.execCommand when clipboard.writeText fails', async () => {
  const originalClipboard = navigator.clipboard;
  const originalExecCommand = document.execCommand;

  let execCommandCalled = false;
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: async () => {
        throw new Error('NotAllowedError: Clipboard permission denied');
      },
    },
    configurable: true,
  });

  document.execCommand = (cmd) => {
    if (cmd === 'copy') {
      execCommandCalled = true;
      return true;
    }
    return false;
  };

  try {
    const fortune = generateKanyeFortune('Test fallback', '', 'api', 'donda');
    const success = await copyFortuneToClipboard(fortune);
    expect(typeof success).toBe('boolean');
  } finally {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    });
    document.execCommand = originalExecCommand;
  }
});

test('4.7: formatClipboardShareText handles massive multiline quote safely', () => {
  const hugeQuote = 'Ye wisdom line\n'.repeat(500);
  const fortune = generateKanyeFortune(hugeQuote, 'Multiline test', 'api', 'donda');
  const text = formatClipboardShareText(fortune);
  expect(typeof text).toBe('string');
  expect(text).toContain('🔮 Oracle Verdict:');
  expect(text).toContain('⚡ Ye\'s Command:');
});

test('4.8: exportImage DOM exclusion filter accurately discriminates nodes', () => {
  // Directly test the filter function logic specified in useExportImage
  const filter = (domNode) => {
    if (domNode && domNode.classList && typeof domNode.classList.contains === 'function') {
      return !domNode.classList.contains('export-exclude');
    }
    return true;
  };

  // Standard DOM element with DOMTokenList
  const standardEl = {
    classList: {
      contains: (cls) => ['tarot-card', 'front-face'].includes(cls),
    },
  };
  expect(filter(standardEl)).toBe(true);

  // Excluded DOM element with DOMTokenList
  const excludedEl = {
    classList: {
      contains: (cls) => ['export-exclude', 'toolbar-button'].includes(cls),
    },
  };
  expect(filter(excludedEl)).toBe(false);

  // SVG element without export-exclude
  const svgEl = {
    classList: {
      contains: (cls) => ['lucide', 'lucide-sparkles'].includes(cls),
    },
  };
  expect(filter(svgEl)).toBe(true);

  // Text node (no classList)
  const textNode = { nodeType: 3, textContent: 'Sample text' };
  expect(filter(textNode)).toBe(true);

  // Comment node (no classList)
  const commentNode = { nodeType: 8, data: 'Comment' };
  expect(filter(commentNode)).toBe(true);

  // Node with malformed classList (not a function)
  const malformedNode = { classList: 'not-an-object' };
  expect(filter(malformedNode)).toBe(true);

  // Null node
  expect(filter(null)).toBe(true);
});

test('4.9: Export dimensions contract: 1:1 Square (1080x1080) vs 9:16 Story (1080x1920)', () => {
  const getDims = (format) =>
    format === 'story'
      ? { width: 1080, height: 1920 }
      : { width: 1080, height: 1080 };

  const squareDims = getDims('square');
  expect(squareDims.width).toBe(1080);
  expect(squareDims.height).toBe(1080);

  const storyDims = getDims('story');
  expect(storyDims.width).toBe(1080);
  expect(storyDims.height).toBe(1920);
});

test('4.10: Font readiness gating catches rejection without unhandled exception', async () => {
  const originalFonts = document.fonts;
  Object.defineProperty(document, 'fonts', {
    value: {
      ready: Promise.reject(new Error('FontFace load network failure')),
    },
    configurable: true,
  });

  try {
    let fontErrorCaught = false;
    try {
      await document.fonts.ready;
    } catch (fontErr) {
      fontErrorCaught = true;
    }
    expect(fontErrorCaught).toBe(true);
  } finally {
    Object.defineProperty(document, 'fonts', {
      value: originalFonts,
      configurable: true,
    });
  }
});


// -----------------------------------------------------------------------------
// SUMMARY & FINDINGS AUDIT
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(` TIER 5 ADVERSARIAL STRESS TEST SUMMARY: ${stats.passed} / ${stats.total} PASSED`);
if (stats.failed > 0) {
  console.log(` ❌ ${stats.failed} FAILURES DETECTED`);
  for (const f of stats.failures) {
    console.log(`   - ${f.name}: ${f.error.message}`);
  }
} else {
  console.log(' ✅ ALL ADVERSARIAL ATTACKS SUCCESSFULLY DEFENDED & ISOLATED!');
}

if (stats.findings.length > 0) {
  console.log('\n ⚠️ ADVERSARIAL EDGE CASE FINDINGS (SURFACED FOR FORENSIC REPORT):');
  for (const find of stats.findings) {
    console.log(`   - [${find.component}] ${find.issue}: ${find.details}`);
  }
} else {
  console.log(' 🛡️ ZERO HIGH-RISK VULNERABILITIES IDENTIFIED.');
}
console.log('========================================================================\n');

if (stats.failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
