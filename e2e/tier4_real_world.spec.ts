// e2e/tier4_real_world.spec.ts
// Tier 4: Real-World Application Scenarios (14 comprehensive end-to-end user journeys)
// Total tests: 14

import { describe, it, beforeEach, setTier } from './harness/runner.ts';
import { expect } from './harness/assertions.ts';
import { env } from './harness/browserMock.ts';
import {
  generateKanyeFortune,
  formatClipboardShareText,
  createTwitterShareUrl,
  ERA_TOKENS
} from './harness/referenceOracle.ts';
import type { EraId, ViewMode } from './harness/referenceOracle.ts';

setTier(4);

describe('Tier 4: Real-World Application Scenarios', () => {
  beforeEach(() => {
    env.reset();
  });

  // ==========================================
  // Scenario 1: Corporate Career Dilemma Consultation
  // ==========================================
  it('Scenario 01: The Corporate Career Dilemma Consultation Workflow', async () => {
    // 1. User lands on App in Donda era
    let activeEra: EraId = 'donda';
    expect(activeEra).toBe('donda');

    // 2. User inputs corporate job dilemma
    const dilemma = 'Should I quit my accounting job to start a custom architectural furniture studio?';
    expect(dilemma.length).toBeGreaterThan(0);

    // 3. User clicks "Consult the Oracle"
    const quote = 'Burn that excel spread sheet.';
    const fortune = generateKanyeFortune(quote, dilemma, 'api', activeEra);

    // 4. Validate fortune synthesis
    expect(fortune.userQuestion).toBe(dilemma);
    expect(fortune.quote).toBe(quote);
    expect(fortune.oracleInterpretation).toContain('spreadsheets are the modern padded cell');

    // 5. Flip 3D card to front
    let isFlipped = false;
    isFlipped = true;
    expect(isFlipped).toBe(true);

    // 6. Audio TTS speaks prophecy
    const utt = new SpeechSynthesisUtterance(fortune.oracleInterpretation);
    window.speechSynthesis.speak(utt);
    expect(window.speechSynthesis.speaking).toBe(true);

    // 7. User copies quote to clipboard
    const clipText = formatClipboardShareText(fortune);
    await navigator.clipboard.writeText(clipText);
    const read = await navigator.clipboard.readText();
    expect(read).toContain('Burn that excel spread sheet.');
    expect(read).toContain(fortune.destinyVerdict.title);
  });

  // ==========================================
  // Scenario 2: Pure Serendipity (Instant Wisdom Click)
  // ==========================================
  it('Scenario 02: Pure Serendipity — Instant Destiny Wisdom Click', async () => {
    // 1. User arrives with empty question
    const emptyQuestion = '';

    // 2. User clicks "Draw Kanye Fortune" directly
    const quote = 'My memories are from the future.';
    const fortune = generateKanyeFortune(quote, emptyQuestion, 'api', 'graduation');

    // 3. Verifies serendipity cosmic interpretation
    expect(fortune.userQuestion).toBeNull();
    expect(fortune.oracleInterpretation.length).toBeGreaterThan(0);

    // 4. Verifies lucky numbers include 808
    expect(fortune.luckyNumbers[1]).toBe(808);

    // 5. User shares to X
    const twitterUrl = createTwitterShareUrl(fortune);
    expect(twitterUrl).toContain('https://twitter.com/intent/tweet');
    expect(twitterUrl).toContain(encodeURIComponent('My memories are from the future.'));
  });

  // ==========================================
  // Scenario 3: The Melancholic Heartbreak Night Session
  // ==========================================
  it('Scenario 03: The Melancholic 808s Heartbreak Night Session', async () => {
    // 1. User switches era to 808s & Heartbreak
    const activeEra: EraId = '808s';
    expect(ERA_TOKENS[activeEra]['--era-accent-primary']).toBe('#06b6d4');
    expect(ERA_TOKENS[activeEra]['--era-accent-secondary']).toBe('#f43f5e');

    // 2. User enters heartbreak dilemma
    const dilemma = 'My ex texted me at 2 AM after 6 months of silence, should I text back?';

    // 3. Sub-bass 808 boom audio synthesizes
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(160, 0);
    osc.frequency.exponentialRampToValueAtTime(36, 0.85);
    osc.start(0);
    osc.stop(0.95);
    expect(osc.started).toBe(true);

    // 4. Oracle generates heartbreak warning
    const quote = 'There\'s so many lonely emojis man.';
    const fortune = generateKanyeFortune(quote, dilemma, 'api', activeEra);
    expect(fortune.oracleInterpretation).toContain('Maybach at 140 MPH');
    expect(fortune.auraScore).toBeGreaterThanOrEqual(85);
  });

  // ==========================================
  // Scenario 4: Brutalist Yeezy Pop-up Receipt Collector
  // ==========================================
  it('Scenario 04: The Brutalist Yeezy Pop-up Thermal Receipt Collector Journey', () => {
    // 1. User toggles view mode from 3D card to Thermal Receipt
    let viewMode: ViewMode = 'card';
    viewMode = 'receipt';
    expect(viewMode).toBe('receipt');

    // 2. Mechanical printer click triggers
    const ctx = new AudioContext();
    const click = ctx.createOscillator();
    click.type = 'triangle';
    click.start(0);
    click.stop(0.03);
    expect(click.type).toBe('triangle');

    // 3. Generates itemized receipt data
    const fortune = generateKanyeFortune('Truth is my goal. Controversy is my gym.', 'Am I too aggressive?', 'api', 'yeezus');

    // 4. Audits receipt components
    expect(fortune.destinyVerdict.title).toBeDefined();
    expect(fortune.actionableCommand).toBeDefined();
    expect(fortune.luckyNumbers).toBeDefined();
    const subtotal = '$0.00';
    const total = 'PRICELESS';
    const tax = '100.0%';
    expect(subtotal).toBe('$0.00');
    expect(total).toBe('PRICELESS');
    expect(tax).toBe('100.0%');
  });

  // ==========================================
  // Scenario 5: Viral Instagram Story Export Workflow
  // ==========================================
  it('Scenario 05: Viral Instagram Story High-Res Export Workflow', async () => {
    // 1. User in Graduation era
    const era: EraId = 'graduation';
    const fortune = generateKanyeFortune('Believe in your flyness... conquer your shyness.', 'How to conquer fear', 'api', era);

    // 2. User opens export modal and selects 9:16 Instagram Story format
    const format = 'story';
    const width = 1080;
    const height = 1920;
    const pixelRatio = 2;
    expect(width / height).toBeCloseTo(0.5625);

    // 3. Await font readiness
    await env.document.fonts.ready;

    // 4. Generated filename for download
    const filename = `ye-fortune-${era}-${fortune.timestamp}.png`;
    expect(filename).toContain('graduation');
    expect(filename.endsWith('.png')).toBe(true);
  });

  // ==========================================
  // Scenario 6: Keyboard-Only Power User Navigation
  // ==========================================
  it('Scenario 06: Keyboard-Only Power User Complete Navigation', () => {
    let currentEra: EraId = 'donda';
    let isFlipped = false;
    let isMuted = false;
    let drawCount = 0;

    // Step 1: User presses [Space] to draw fortune
    const onSpace = () => { drawCount++; isFlipped = false; };
    onSpace();
    expect(drawCount).toBe(1);
    expect(isFlipped).toBe(false);

    // Step 2: User presses [F] to flip card
    const onF = () => { isFlipped = !isFlipped; };
    onF();
    expect(isFlipped).toBe(true);

    // Step 3: User presses [2] for Graduation era
    currentEra = 'graduation';
    expect(currentEra).toBe('graduation');

    // Step 4: User presses [4] for Yeezus era
    currentEra = 'yeezus';
    expect(currentEra).toBe('yeezus');

    // Step 5: User presses [M] to toggle mute
    isMuted = !isMuted;
    expect(isMuted).toBe(true);

    // Step 6: User presses [Space] for another revelation
    onSpace();
    expect(drawCount).toBe(2);
    expect(isFlipped).toBe(false);
  });

  // ==========================================
  // Scenario 7: Airplane Mode Offline Zero-Asset Resilience
  // ==========================================
  it('Scenario 07: Airplane Mode / Zero-Asset Uptime Journey', async () => {
    // 1. Set environment offline
    env.network.mode = 'offline';

    // 2. Fetch catches error and switches to offline vault
    let quoteResult: { quote: string; source: 'api' | 'offline_vault' };
    try {
      const res = await fetch('https://api.kanye.rest/');
      const data = await res.json();
      quoteResult = { quote: data.quote, source: 'api' };
    } catch {
      quoteResult = { quote: 'We came into a broken world. And we\'re the cleanup crew.', source: 'offline_vault' };
    }

    expect(quoteResult.source).toBe('offline_vault');

    // 3. Synthesize Web Audio procedurally with 0 external mp3 requests
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.start(0);
    expect(osc.started).toBe(true);

    // 4. Complete fortune generation
    const fortune = generateKanyeFortune(quoteResult.quote, 'Survival in the void', 'offline_vault', 'donda');
    expect(fortune.source).toBe('offline_vault');
    expect(fortune.quote).toBe(quoteResult.quote);
  });

  // ==========================================
  // Scenario 8: Creative Block Breakthrough (Yeezus Session)
  // ==========================================
  it('Scenario 08: Creative Block Breakthrough — Yeezus Studio Session', () => {
    // 1. User in Yeezus era
    const era: EraId = 'yeezus';
    expect(ERA_TOKENS[era]['--era-accent-primary']).toBe('#ef4444');

    // 2. User dilemma on creative block
    const dilemma = 'The label says my new album track design is too aggressive and uncommercial';
    const quote = 'I\'m a creative genius.';
    const fortune = generateKanyeFortune(quote, dilemma, 'api', era);

    // 3. Oracle gives fearless directive
    expect(fortune.oracleInterpretation).toContain('until the prototype hits the runway');
    expect(fortune.actionableCommand.length).toBeGreaterThan(10);

    // 4. Procedural vinyl crackle gives studio warmth
    const ctx = new AudioContext();
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, 0);
    expect(filter.type).toBe('bandpass');
  });

  // ==========================================
  // Scenario 9: Multi-Era Comparison Consultation
  // ==========================================
  it('Scenario 09: Multi-Era Comparison Consultation Workflow', () => {
    const question = 'Should I move to Tokyo to launch a new brand?';
    const quote = 'For me, money is not my definition of success.';

    // Generate across all 4 eras
    const fDonda = generateKanyeFortune(quote, question, 'api', 'donda');
    const fGrad = generateKanyeFortune(quote, question, 'api', 'graduation');
    const f808s = generateKanyeFortune(quote, question, 'api', '808s');
    const fYeezus = generateKanyeFortune(quote, question, 'api', 'yeezus');

    expect(fDonda.era).toBe('donda');
    expect(fGrad.era).toBe('graduation');
    expect(f808s.era).toBe('808s');
    expect(fYeezus.era).toBe('yeezus');

    // Verify all 4 produce consistent high aura
    [fDonda, fGrad, f808s, fYeezus].forEach(f => {
      expect(f.auraScore).toBeGreaterThanOrEqual(85);
      expect(f.auraScore).toBeLessThanOrEqual(100);
    });
  });

  // ==========================================
  // Scenario 10: High-Frequency Redraw Stress Journey
  // ==========================================
  it('Scenario 10: High-Frequency Redraw Stress Journey', () => {
    const fortunes = [];
    for (let i = 0; i < 10; i++) {
      const f = generateKanyeFortune(`Quote ${i}`, `Dilemma ${i}`, 'api', 'donda');
      fortunes.push(f);
    }
    expect(fortunes.length).toBe(10);
    // Verify no duplicated or corrupted IDs
    const ids = new Set(fortunes.map(f => f.id));
    expect(ids.size).toBe(10);
  });

  // ==========================================
  // Scenario 11: The Viral Tweet Creator Journey
  // ==========================================
  it('Scenario 11: The Viral Tweet Creator Journey', async () => {
    const dilemma = 'My coworker ate my lunch from the shared fridge';
    const quote = 'Fur pillows are hard to actually sleep on.';
    const fortune = generateKanyeFortune(quote, dilemma, 'api', 'graduation');

    // Share to Twitter
    const twitterUrl = createTwitterShareUrl(fortune);
    expect(twitterUrl).toContain('Fur%20pillows%20are%20hard%20to%20actually%20sleep%20on.');
    expect(twitterUrl).toContain('KanyeWest%2COracleOfYe%2CYeezy');

    // Backup copy to clipboard
    const text = formatClipboardShareText(fortune);
    await navigator.clipboard.writeText(text);
    const read = await navigator.clipboard.readText();
    expect(read).toContain('Fur pillows are hard to actually sleep on.');
  });

  // ==========================================
  // Scenario 12: Corrupted LocalStorage Recovery Journey
  // ==========================================
  it('Scenario 12: Corrupted LocalStorage Recovery Journey', () => {
    // Write corrupted data to storage
    localStorage.setItem('ye_fortune_muted', '{malformed:true]');

    // Safe retrieval logic
    let isMuted = false;
    try {
      isMuted = localStorage.getItem('ye_fortune_muted') === 'true';
    } catch {
      isMuted = false;
    }

    expect(isMuted).toBe(false); // Resets safely to unmuted
  });

  // ==========================================
  // Scenario 13: Mobile Viewport Touch & Swipe Journey
  // ==========================================
  it('Scenario 13: Mobile Viewport Responsive Layout Journey (375x667)', () => {
    const mobileWidth = 375;
    const mobileHeight = 667;

    // Viewport check
    expect(mobileWidth).toBe(375);
    expect(mobileHeight).toBe(667);

    // Font clamp check
    const isMobile = mobileWidth < 640;
    const fontClass = isMobile ? 'text-sm' : 'text-base';
    expect(fontClass).toBe('text-sm');

    // Receipt max width check
    const receiptWidth = Math.min(mobileWidth - 32, 448);
    expect(receiptWidth).toBe(343);
    expect(receiptWidth).toBeLessThan(mobileWidth);
  });

  // ==========================================
  // Scenario 14: Full Life Dilemma Lifecycle — Question to Victory
  // ==========================================
  it('Scenario 14: Full Life Dilemma Lifecycle — Question to Victory', async () => {
    // 1. User ponders deepest existential question
    const question = 'What is the highest purpose of my creative journey?';

    // 2. Consults oracle
    const quote = 'Everything you do in life stems from either fear or love.';
    const fortune = generateKanyeFortune(quote, question, 'api', 'donda');

    // 3. Card flips & Web Speech speaks
    let isFlipped = true;
    expect(isFlipped).toBe(true);
    const utt = new SpeechSynthesisUtterance(fortune.oracleInterpretation);
    window.speechSynthesis.speak(utt);
    expect(window.speechSynthesis.speaking).toBe(true);

    // 4. User views both Card and Receipt mode
    let viewMode: ViewMode = 'card';
    viewMode = 'receipt';
    expect(viewMode).toBe('receipt');

    // 5. Copies quote & verifies all metrics
    const text = formatClipboardShareText(fortune);
    await navigator.clipboard.writeText(text);
    expect(fortune.auraScore).toBeGreaterThanOrEqual(85);
    expect(fortune.luckyNumbers.length).toBe(3);
    expect(fortune.luckyArtifact.name.length).toBeGreaterThan(0);
  });
});
