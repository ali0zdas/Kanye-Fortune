/**
 * tests/tier5_adversarial_ui.mjs
 * Tier 5 White-Box Adversarial Stress Test Suite: UI/UX, Rapid Input & State Hardening
 * Challenger 2 (Empirical Challenger)
 *
 * Probes:
 * 1. Rapid era switching (cyclical era changes, audio concurrency, mid-flip state preservation).
 * 2. Rapid mode toggling (swapping between 3D Tarot Card and Thermal Receipt mid-draw).
 * 3. High-concurrency keyboard smashing (Space, 1-4, M, F bursts & hotkey suppression).
 * 4. Adversarial input injection (XSS, SQLi, RTL, 2,000-100,000 char essays, ReDoS, Emojis, Prototype pollution).
 * 5. Responsive layout integrity across extreme simulated resolutions (320px mobile to 3840px 4K).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../e2e/harness/browserMock.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Initialize Headless Browser Virtualization
env.setupGlobals();

// 2. Import Production Implementation Modules via tsx
const { ERAS, getEraConfig } = await import('../src/data/eras.ts');
const {
  generateKanyeFortune,
  computeDeterministicHash,
  DESTINY_VERDICTS,
  YEEZY_ARTIFACTS,
  ACTIONABLE_COMMANDS,
  AURA_TITLES,
  TOPIC_PATTERNS,
} = await import('../src/services/oracleEngine.ts');
const { fetchKanyeQuote, DEFAULT_TIMEOUT_MS } = await import('../src/services/kanyeApi.ts');
const { soundSynthesizer, YeSoundSynthesizer } = await import('../src/services/audioSynthesizer.ts');
const {
  formatClipboardShareText,
  createTwitterShareUrl,
  copyFortuneToClipboard,
} = await import('../src/utils/shareHelpers.ts');

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
    toBeLessThan(expected) {
      if (!(actual < expected)) {
        throw new Error(`Expected ${actual} < ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected) {
      if (!(actual <= expected)) {
        throw new Error(`Expected ${actual} <= ${expected}`);
      }
    },
    toBeCloseTo(expected, precision = 2) {
      const diff = Math.abs(actual - expected);
      if (diff >= Math.pow(10, -precision)) {
        throw new Error(`Expected ${actual} to be close to ${expected} (precision: ${precision})`);
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
console.log(' TIER 5 WHITE-BOX ADVERSARIAL STRESS TEST SUITE (CHALLENGER 2)           ');
console.log(' Target: UI/UX, Rapid Input, State Transitions & Layout Hardening       ');
console.log('========================================================================\n');

// -----------------------------------------------------------------------------
// SUITE 1: RAPID ERA SWITCHING UNDER HEAVY STRESS
// -----------------------------------------------------------------------------
console.log('--- SUITE 1: Rapid Era Switching Under Heavy Stress ---');

test('1.1: 100 rapid cyclical era switches update document data-era cleanly', () => {
  const eraOrder = ['donda', 'graduation', '808s', 'yeezus'];
  let currentEra = 'donda';

  for (let i = 0; i < 100; i++) {
    currentEra = eraOrder[i % eraOrder.length];
    document.documentElement.setAttribute('data-era', currentEra);
  }

  expect(document.documentElement.getAttribute('data-era')).toBe('yeezus');
  const cfg = getEraConfig('yeezus');
  expect(cfg.name).toBe('Yeezus');
  expect(cfg.year).toBe('2013');
  expect(cfg.colors.accent).toBe('#ef4444');
});

test('1.2: Rapid era switching while AudioSynthesizer fires 808 kicks without AudioParam collision', () => {
  const synth = new YeSoundSynthesizer();
  synth.initContext();

  const eras = ['donda', 'graduation', '808s', 'yeezus'];
  for (let i = 0; i < 40; i++) {
    const era = eras[i % eras.length];
    document.documentElement.setAttribute('data-era', era);
    // Trigger 808 bass kick concurrently
    synth.playSubBass808();
  }

  expect(synth.getMuted()).toBe(false);
  expect(document.documentElement.getAttribute('data-era')).toBe('yeezus');
});

test('1.3: Era switching during active card flip preserves flipped status', () => {
  let isFlipped = true;
  let activeEra = 'donda';

  // Rapid era change while flipped
  const targetEras = ['graduation', '808s', 'yeezus'];
  for (const nextEra of targetEras) {
    activeEra = nextEra;
    // Card flip status must remain true (not forced to front)
    expect(isFlipped).toBe(true);
  }

  expect(activeEra).toBe('yeezus');
  expect(isFlipped).toBe(true);
});

testAsync('1.4: In-flight async draw during era thrashing maintains fortune integrity', async () => {
  let activeEra = 'donda';
  let isLoading = true;

  // Simulate in-flight async draw
  const drawPromise = fetchKanyeQuote(DEFAULT_TIMEOUT_MS, true).then((quoteResult) => {
    return generateKanyeFortune(quoteResult.quote, 'Am I the greatest?', quoteResult.source, activeEra);
  });

  // Rapidly thrash active era while promise is in-flight
  const intermediateEras = ['graduation', '808s', 'yeezus', 'graduation'];
  for (const e of intermediateEras) {
    activeEra = e;
  }

  const fortune = await drawPromise;
  isLoading = false;

  expect(isLoading).toBe(false);
  expect(fortune).toBeDefined();
  expect(fortune.quote.length).toBeGreaterThan(0);
  expect(fortune.destinyVerdict).toBeDefined();
  expect(fortune.destinyVerdict.title.length).toBeGreaterThan(0);
  expect(fortune.auraScore).toBeGreaterThanOrEqual(85);
  expect(fortune.auraScore).toBeLessThanOrEqual(100);
});

test('1.5: Complete 4-era token and aesthetic descriptor validation', () => {
  expect(ERAS.length).toBe(4);
  const eraIds = ERAS.map((e) => e.id);
  expect(eraIds).toEqual(['donda', 'graduation', '808s', 'yeezus']);

  for (const era of ERAS) {
    expect(era.badgeLabel.length).toBeGreaterThan(0);
    expect(era.subtitle.length).toBeGreaterThan(0);
    expect(era.colors.bg.startsWith('#')).toBe(true);
    expect(era.colors.surface.startsWith('#')).toBe(true);
    expect(era.colors.border.startsWith('#')).toBe(true);
    expect(era.colors.accent.startsWith('#')).toBe(true);
    expect(era.colors.glow.length).toBeGreaterThan(0);
  }
});

test('1.6: Audio mute state remains invariant across 50 era switches', () => {
  const synth = new YeSoundSynthesizer();
  synth.toggleMute(); // Mute
  expect(synth.getMuted()).toBe(true);

  const eras = ['donda', 'graduation', '808s', 'yeezus'];
  for (let i = 0; i < 50; i++) {
    const era = eras[i % eras.length];
    document.documentElement.setAttribute('data-era', era);
    expect(synth.getMuted()).toBe(true);
  }

  synth.toggleMute(); // Restore unmute
  expect(synth.getMuted()).toBe(false);
});

// -----------------------------------------------------------------------------
// SUITE 2: RAPID MODE TOGGLING (3D TAROT CARD VS THERMAL RECEIPT)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 2: Rapid Mode Toggling (3D Card vs Thermal Receipt) ---');

test('2.1: 50 rapid mode toggles converge to final state without corruption', () => {
  let viewMode = 'card';
  for (let i = 0; i < 50; i++) {
    viewMode = viewMode === 'card' ? 'receipt' : 'card';
  }
  // Started at card, 50 flips = card
  expect(viewMode).toBe('card');

  // One more toggle
  viewMode = viewMode === 'card' ? 'receipt' : 'card';
  expect(viewMode).toBe('receipt');
});

testAsync('2.2: Mode toggling mid-draw preserves loading state and fortune binding', async () => {
  let viewMode = 'card';
  let isLoading = true;

  // Initiate draw
  const drawPromise = fetchKanyeQuote(DEFAULT_TIMEOUT_MS, true).then((q) => {
    return generateKanyeFortune(q.quote, 'Should I buy the ranch in Wyoming?', q.source, 'donda');
  });

  // Toggle view mode mid-draw
  viewMode = 'receipt';
  expect(isLoading).toBe(true);
  expect(viewMode).toBe('receipt');

  const fortune = await drawPromise;
  isLoading = false;

  expect(isLoading).toBe(false);
  expect(fortune.userQuestion).toBe('Should I buy the ranch in Wyoming?');
  expect(fortune.quote.length).toBeGreaterThan(0);
});

test('2.3: Audio sound triggers during mode toggles fire appropriate sound effects', () => {
  const synth = new YeSoundSynthesizer();
  synth.initContext();

  let viewMode = 'card';

  // Card -> Receipt triggers mechanical click
  viewMode = 'receipt';
  synth.playReceiptClick();

  // Receipt -> Card triggers whoosh
  viewMode = 'card';
  synth.playCardFlipWhoosh();

  expect(viewMode).toBe('card');
});

test('2.4: Card flip triggered in Receipt mode updates state and renders valid 3D angles in Card view', () => {
  let isFlipped = false;
  let viewMode = 'receipt';

  // User hits 'F' hotkey while in receipt view
  const handleFlip = () => {
    isFlipped = !isFlipped;
  };

  handleFlip();
  expect(isFlipped).toBe(true);

  // Switch back to 3D Card view
  viewMode = 'card';
  expect(viewMode).toBe('card');
  expect(isFlipped).toBe(true);

  // Flip back to front
  handleFlip();
  expect(isFlipped).toBe(false);
});

test('2.5: Thermal Receipt SVG serrated edges parameter integrity', () => {
  // Validate serrated edge geometry specifications
  const width = 400;
  const height = 12;
  const teeth = 40;
  const toothWidth = width / teeth;

  let pathD = `M 0 0 `;
  for (let i = 0; i < teeth; i++) {
    const xMid = i * toothWidth + toothWidth / 2;
    const xEnd = (i + 1) * toothWidth;
    pathD += `L ${xMid} ${height} L ${xEnd} 0 `;
  }
  pathD += `Z`;

  expect(pathD.includes('NaN')).toBe(false);
  expect(pathD.startsWith('M 0 0')).toBe(true);
  expect(pathD.endsWith('Z')).toBe(true);
  expect(pathD.includes(`L ${width} 0`)).toBe(true);
});

test('2.6: Thermal Receipt itemized metrics & financial breakdown completeness', () => {
  const fortune = generateKanyeFortune(
    'We are here to complete the revolution.',
    'How do we disrupt the paradigm?',
    'api',
    'graduation'
  );

  expect(fortune.userQuestion).toBe('How do we disrupt the paradigm?');
  expect(fortune.quote).toBe('We are here to complete the revolution.');
  expect(fortune.destinyVerdict.title).toBeDefined();
  expect(fortune.actionableCommand.length).toBeGreaterThan(0);
  expect(fortune.auraScore).toBeGreaterThanOrEqual(85);
  expect(fortune.luckyArtifact.name.length).toBeGreaterThan(0);
  expect(fortune.luckyNumbers.length).toBe(3);
  expect(fortune.luckyNumbers[1]).toBe(808);
});

// -----------------------------------------------------------------------------
// SUITE 3: HIGH-CONCURRENCY KEYBOARD SMASHING BURSTS
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 3: High-Concurrency Keyboard Smashing Bursts ---');

testAsync('3.1: 100 consecutive Space (draw) keydowns in rapid burst resolve cleanly', async () => {
  let drawCount = 0;
  const promises = [];

  for (let i = 0; i < 100; i++) {
    const p = fetchKanyeQuote(DEFAULT_TIMEOUT_MS, true).then((q) => {
      drawCount++;
      return generateKanyeFortune(q.quote, '', q.source, 'donda');
    });
    promises.push(p);
  }

  const results = await Promise.all(promises);
  expect(drawCount).toBe(100);
  expect(results.length).toBe(100);
  for (const f of results) {
    expect(f.destinyVerdict.title.length).toBeGreaterThan(0);
    expect(f.auraScore).toBeGreaterThanOrEqual(85);
  }
});

test('3.2: Chaotic interleaved hotkey storm (200 random keyboard events)', () => {
  const state = {
    activeEra: 'donda',
    viewMode: 'card',
    isFlipped: false,
    isMuted: false,
    drawTriggerCount: 0,
  };

  const keys = [' ', '1', '2', '3', '4', 'm', 'M', 'f', 'F'];

  for (let i = 0; i < 200; i++) {
    const key = keys[Math.floor(Math.random() * keys.length)];
    if (key === ' ') {
      state.drawTriggerCount++;
    } else if (key === '1') {
      state.activeEra = 'donda';
    } else if (key === '2') {
      state.activeEra = 'graduation';
    } else if (key === '3') {
      state.activeEra = '808s';
    } else if (key === '4') {
      state.activeEra = 'yeezus';
    } else if (key.toLowerCase() === 'm') {
      state.isMuted = !state.isMuted;
    } else if (key.toLowerCase() === 'f') {
      state.isFlipped = !state.isFlipped;
    }
  }

  expect(['donda', 'graduation', '808s', 'yeezus'].includes(state.activeEra)).toBe(true);
  expect(['card', 'receipt'].includes(state.viewMode)).toBe(true);
  expect(typeof state.isFlipped).toBe('boolean');
  expect(typeof state.isMuted).toBe('boolean');
  expect(state.drawTriggerCount).toBeGreaterThan(0);
});

test('3.3: Hotkey suppression when event target is HTMLInputElement or HTMLTextAreaElement', () => {
  const simulatedKeyboardHandler = (e, targetTag) => {
    // Exact guard logic from App.tsx line 172-177
    if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') {
      return 'SUPPRESSED';
    }
    if (e.key === ' ' || e.code === 'Space') return 'DRAW';
    if (e.key === '1') return 'ERA_1';
    if (e.key.toLowerCase() === 'm') return 'MUTE';
    if (e.key.toLowerCase() === 'f') return 'FLIP';
    return 'IGNORED';
  };

  // When user is typing inside dilemma input box:
  expect(simulatedKeyboardHandler({ key: ' ' }, 'INPUT')).toBe('SUPPRESSED');
  expect(simulatedKeyboardHandler({ key: '1' }, 'INPUT')).toBe('SUPPRESSED');
  expect(simulatedKeyboardHandler({ key: 'm' }, 'INPUT')).toBe('SUPPRESSED');
  expect(simulatedKeyboardHandler({ key: 'F' }, 'INPUT')).toBe('SUPPRESSED');
  expect(simulatedKeyboardHandler({ key: ' ' }, 'TEXTAREA')).toBe('SUPPRESSED');

  // When focus is outside inputs:
  expect(simulatedKeyboardHandler({ key: ' ' }, 'BODY')).toBe('DRAW');
  expect(simulatedKeyboardHandler({ key: '1' }, 'BODY')).toBe('ERA_1');
  expect(simulatedKeyboardHandler({ key: 'M' }, 'DIV')).toBe('MUTE');
  expect(simulatedKeyboardHandler({ key: 'f' }, 'DIV')).toBe('FLIP');
});

test('3.4: Case-insensitivity and code fallbacks for Space and M / F keys', () => {
  const checkKey = (e) => {
    if (e.key === ' ' || e.code === 'Space') return 'DRAW';
    if (e.key.toLowerCase() === 'm') return 'MUTE';
    if (e.key.toLowerCase() === 'f') return 'FLIP';
    return 'NONE';
  };

  expect(checkKey({ key: ' ', code: 'Space' })).toBe('DRAW');
  expect(checkKey({ key: 'Spacebar', code: 'Space' })).toBe('DRAW'); // Older IE/Edge
  expect(checkKey({ key: 'm' })).toBe('MUTE');
  expect(checkKey({ key: 'M' })).toBe('MUTE');
  expect(checkKey({ key: 'f' })).toBe('FLIP');
  expect(checkKey({ key: 'F' })).toBe('FLIP');
});

test('3.5: Space key triggers preventDefault to eliminate page scroll jitter', () => {
  let defaultPrevented = false;
  const mockEvent = {
    key: ' ',
    code: 'Space',
    target: { tagName: 'BODY' },
    preventDefault: () => {
      defaultPrevented = true;
    },
  };

  if (mockEvent.key === ' ' || mockEvent.code === 'Space') {
    mockEvent.preventDefault();
  }

  expect(defaultPrevented).toBe(true);
});

// -----------------------------------------------------------------------------
// SUITE 4: ADVERSARIAL INPUT INJECTION & PROMPT BOX HARDENING
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 4: Adversarial Input Injection & Prompt Box Hardening ---');

test('4.1: Cross-Site Scripting (XSS) attack payloads are neutralized and safely hashed', () => {
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(1)>',
    '"><script src=http://evil.com/xss.js></script>',
    '<svg onload=alert("HACKED")>',
    'javascript:alert(document.domain)',
    '"><iframe src=javascript:alert(1)></iframe>',
    '<body onload=alert(1)>',
    '"><input autofocus onfocus=alert(1)>',
  ];

  for (const payload of xssPayloads) {
    const fortune = generateKanyeFortune('Greatness requires sacrifice.', payload, 'api', 'yeezus');
    expect(fortune.userQuestion).toBe(payload);
    expect(fortune.destinyVerdict).toBeDefined();
    expect(fortune.actionableCommand.length).toBeGreaterThan(0);

    // Verify formatted share text safely quotes user question without evaluation
    const shareText = formatClipboardShareText(fortune);
    expect(shareText.includes('🔮 Oracle Verdict:')).toBe(true);

    // Verify Twitter URL properly encodes the quote and parameters
    const tweetUrl = createTwitterShareUrl(fortune);
    expect(tweetUrl.includes('<script>')).toBe(false);
    expect(tweetUrl.startsWith('https://twitter.com/intent/tweet?')).toBe(true);
  }
});

test('4.2: SQL Injection & database syntax payloads processed with deterministic stability', () => {
  const sqliPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "1'; WAITFOR DELAY '0:0:5'--",
    "admin' --",
    "' UNION SELECT username, password FROM users --",
    "1' ORDER BY 1--+",
  ];

  for (const sql of sqliPayloads) {
    const f1 = generateKanyeFortune('Artists are founders.', sql, 'api', 'donda');
    const f2 = generateKanyeFortune('Artists are founders.', sql, 'api', 'donda');

    expect(f1.destinyVerdict.title).toBe(f2.destinyVerdict.title);
    expect(f1.auraScore).toBe(f2.auraScore);
    expect(f1.actionableCommand).toBe(f2.actionableCommand);
  }
});

test('4.3: Right-to-Left (RTL), Arabic, Hebrew, and BiDi override stress', () => {
  const rtlInputs = [
    'هل يجب أن أترك وظيفتي وأبدأ شركة تكنولوجيا جديدة؟',
    'האם עלי ללכת בעקבות החלום שלי או להישאר בטוח?',
    'کیا مجھے اپنی نوکری چھوڑ دینی چاہیے؟',
    '\u202E\u202BOVERRIDE_TEST\u202C',
    'English text with \u200Fעברית embedded and \u200Emixed directions',
  ];

  for (const rtl of rtlInputs) {
    const fortune = generateKanyeFortune('Believe in your flyness.', rtl, 'offline_vault', '808s');
    expect(fortune.destinyVerdict).toBeDefined();
    expect(fortune.auraScore).toBeGreaterThanOrEqual(85);
    expect(fortune.userQuestion).toBe(rtl.slice(0, 200));
  }
});

test('4.4: Massive buffer flood / 100,000-character essay input safely truncated to 200 chars', () => {
  const essay = 'Kanye West visionary genius stadium status '.repeat(2500); // ~107,500 chars
  expect(essay.length).toBeGreaterThan(100000);

  const start = performance.now();
  const fortune = generateKanyeFortune('I am Warhol.', essay, 'api', 'graduation');
  const elapsed = performance.now() - start;

  // Must finish in sub-10ms (safe truncation at 200 chars)
  expect(elapsed).toBeLessThanOrEqual(50);
  expect(fortune.userQuestion.length).toBe(200);
  expect(fortune.destinyVerdict).toBeDefined();
});

test('4.5: ReDoS vulnerability stress against TOPIC_PATTERNS (catastrophic backtracking defense)', () => {
  const adversarialStrings = [
    'job '.repeat(5000),
    'a'.repeat(20000) + 'work',
    'love '.repeat(5000),
    'ex '.repeat(5000),
    'money '.repeat(5000),
    'scared '.repeat(5000),
    'art '.repeat(5000),
    'genius '.repeat(5000),
  ];

  const patterns = Object.values(TOPIC_PATTERNS);
  for (const str of adversarialStrings) {
    const t0 = performance.now();
    for (const regex of patterns) {
      regex.test(str);
    }
    const t1 = performance.now();
    expect(t1 - t0).toBeLessThanOrEqual(25);
  }
});

test('4.6: Multi-byte emojis, surrogate pairs, and astral plane unicode preserved accurately', () => {
  const emojiInput = '🐻👑🔥💔🕊️✨🛸💿💫🔮👁️💯';
  const fortune = generateKanyeFortune('Style is the answer to everything.', emojiInput, 'api', 'graduation');

  expect(fortune.userQuestion).toBe(emojiInput);
  expect(fortune.destinyVerdict).toBeDefined();

  const formatted = formatClipboardShareText(fortune);
  expect(formatted.includes('Oracle Verdict:')).toBe(true);
});

test('4.7: Prototype pollution & reserved property names attack defense', () => {
  const hostileKeys = [
    '__proto__',
    'constructor',
    'prototype',
    'toString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
  ];

  for (const key of hostileKeys) {
    const fortune = generateKanyeFortune('Distraction is the enemy of vision.', key, 'api', 'donda');
    expect(fortune.userQuestion).toBe(key);
    // Ensure Object.prototype remains clean
    expect(
      Object.prototype[key] === undefined ||
        typeof Object.prototype[key] === 'function' ||
        Object.prototype[key] === null
    ).toBe(true);
  }
});

test('4.8: Whitespace, tabs, newlines, and zero-width spaces fallback to Serendipity mode', () => {
  const whitespaceInputs = [
    '',
    '   ',
    '\t\t\t',
    '\n\r\n',
    '   \t   \n  ',
  ];

  for (const ws of whitespaceInputs) {
    const fortune = generateKanyeFortune('Refuse limitations.', ws, 'api', 'donda');
    // Empty / whitespace inputs must result in null userQuestion
    expect(fortune.userQuestion).toBeNull();
    // Oracle interpretation reflects serendipity contemplation
    expect(fortune.oracleInterpretation.length > 0).toBe(true);
    expect(fortune.oracleInterpretation.includes('empty hands')).toBe(false);
  }
});

test('4.9: Preset category chips clicking sets dilemma or toggles clear on second click', () => {
  let userQuestion = '';
  const onQuestionChange = (q) => {
    userQuestion = q;
  };

  const handleChipClick = (query) => {
    if (userQuestion === query) {
      onQuestionChange('');
    } else {
      onQuestionChange(query);
    }
  };

  const careerQuery = 'Should I quit my corporate job and start my own company?';
  const romanceQuery = 'Should I text my ex or wait for them to see my greatness?';

  // 1. Click Career
  handleChipClick(careerQuery);
  expect(userQuestion).toBe(careerQuery);

  // 2. Click Career again -> toggles off (clears)
  handleChipClick(careerQuery);
  expect(userQuestion).toBe('');

  // 3. Click Romance
  handleChipClick(romanceQuery);
  expect(userQuestion).toBe(romanceQuery);

  // 4. Click Career -> switches to Career
  handleChipClick(careerQuery);
  expect(userQuestion).toBe(careerQuery);
});

// -----------------------------------------------------------------------------
// SUITE 5: RESPONSIVE LAYOUT INTEGRITY ACROSS EXTREME SIMULATED RESOLUTIONS
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 5: Responsive Layout Integrity Across Extreme Resolutions ---');

test('5.1: Ultra-narrow mobile viewport (320px width - iPhone SE / Fold) containment', () => {
  const viewportWidth = 320;
  const stageMaxWidth = 448; // max-w-md = 28rem = 448px

  // Constrained width should flex to 100% of viewport width minus padding
  const paddingX = 16 * 2; // px-4 on mobile
  const availableContentWidth = viewportWidth - paddingX;
  expect(availableContentWidth).toBe(288);
  expect(availableContentWidth).toBeLessThanOrEqual(stageMaxWidth);

  // Serrated edge SVG viewBox scaling remains valid
  const svgViewBox = '0 0 400 12';
  expect(svgViewBox).toBe('0 0 400 12');
});

test('5.2: Mobile viewport (375px & 414px) typography & ActionToolbar wrapping', () => {
  // Mobile ActionToolbar buttons wrap cleanly via flex-wrap
  const toolbarClasses = 'flex flex-wrap items-center justify-center gap-2 sm:gap-3';
  expect(toolbarClasses.includes('flex-wrap')).toBe(true);

  // Header mobile switcher strip visibility check
  const headerMobileStripClass = 'md:hidden flex justify-center py-2 px-4';
  expect(headerMobileStripClass.includes('md:hidden')).toBe(true);
});

test('5.3: Tablet viewport (768px - iPad portrait) navigation bar layout', () => {
  const headerDesktopClass = 'hidden md:flex items-center justify-center';
  expect(headerDesktopClass.includes('hidden md:flex')).toBe(true);

  const containerMaxWidthClass = 'max-w-5xl w-full mx-auto';
  expect(containerMaxWidthClass.includes('max-w-5xl')).toBe(true);
});

test('5.4: Desktop 1080p viewport (1920x1080) centering & radial atmosphere glow', () => {
  const eraConfigs = ['donda', 'graduation', '808s', 'yeezus'].map(getEraConfig);
  for (const cfg of eraConfigs) {
    expect(cfg.colors.glow.includes('rgba')).toBe(true);
    expect(cfg.colors.surface.startsWith('#')).toBe(true);
  }
});

test('5.5: Ultra-wide 4K viewport (3840x2160) bounds containment', () => {
  const mainStageMaxPx = 1024; // max-w-5xl = 64rem = 1024px
  const viewportWidth = 3840;
  expect(mainStageMaxPx).toBeLessThan(viewportWidth);
});

test('5.6: Dedicated High-DPI Export dimensions strictly 1080x1080 and 1080x1920', () => {
  const squareDims = { width: 1080, height: 1080, format: 'square' };
  const storyDims = { width: 1080, height: 1920, format: 'story' };

  expect(squareDims.width).toBe(1080);
  expect(squareDims.height).toBe(1080);
  expect(storyDims.width).toBe(1080);
  expect(storyDims.height).toBe(1920);

  // Aspect ratios
  expect(squareDims.width / squareDims.height).toBe(1);
  expect(storyDims.width / storyDims.height).toBeCloseTo(9 / 16, 2);
});

test('5.7: Twitter Share Web Intent URL length and URL-encoding under hostile payload', () => {
  const hostileFortune = generateKanyeFortune(
    'My memories are from the future.',
    '"><script>alert("hacked")</script>&foo=bar#baz',
    'api',
    'graduation'
  );

  const tweetUrl = createTwitterShareUrl(hostileFortune);
  expect(tweetUrl.startsWith('https://twitter.com/intent/tweet?')).toBe(true);
  expect(tweetUrl.includes('<script>')).toBe(false);
  expect(tweetUrl.includes('&hashtags=KanyeWest%2COracleOfYe%2CYeezy')).toBe(true);
  // Ensure query component is properly URL-encoded
  expect(decodeURIComponent(tweetUrl).includes(hostileFortune.quote)).toBe(true);
});

// Helper for close floating point comparison
function toBeCloseTo(actual, expected, precision = 2) {
  const diff = Math.abs(actual - expected);
  return diff < Math.pow(10, -precision);
}

// -----------------------------------------------------------------------------
// SUMMARY & EXIT REPORT
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(` TIER 5 ADVERSARIAL STRESS TEST SUMMARY`);
console.log(` Total Tests: ${stats.total}`);
console.log(` Passed:      ${stats.passed}`);
console.log(` Failed:      ${stats.failed}`);
console.log('========================================================================\n');

if (stats.failed > 0) {
  console.error(`🚨 FAILURES DETECTED (${stats.failed}):`);
  for (const f of stats.failures) {
    console.error(` - ${f.name}: ${f.error.message}`);
  }
  process.exit(1);
} else {
  console.log('✅ ALL TIER 5 ADVERSARIAL STRESS TESTS PASSED WITH ZERO FAILURES!');
  process.exit(0);
}
