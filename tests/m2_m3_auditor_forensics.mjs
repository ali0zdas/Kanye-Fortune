/**
 * tests/m2_m3_auditor_forensics.mjs
 * Independent Forensic Audit & Stress-Test Suite for Milestones 2 & 3
 * Executed by Forensic Auditor (auditor_m2_m3)
 */

import { DESTINY_VERDICTS, YEEZY_ARTIFACTS, AURA_TITLES, ACTIONABLE_COMMANDS, computeDeterministicHash, generateKanyeFortune } from '../src/services/oracleEngine.ts';
import { KANYE_OFFLINE_VAULT, getRandomOfflineQuote, getQuotesByEra, getQuotesByMood } from '../src/data/kanyeQuotesVault.ts';
import { fetchKanyeQuote, DEFAULT_TIMEOUT_MS } from '../src/services/kanyeApi.ts';
import { YeSoundSynthesizer } from '../src/services/audioSynthesizer.ts';
import { WebSpeechProvider } from '../src/services/tts/WebSpeechProvider.ts';
import { RemoteTTSProvider } from '../src/services/tts/RemoteTTSProvider.ts';
import { env } from '../e2e/harness/browserMock.ts';

const auditResults = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: [],
};

function verify(condition, title, details = null) {
  auditResults.total++;
  if (condition) {
    auditResults.passed++;
    console.log(`  [PASS] ${title}`);
  } else {
    auditResults.failed++;
    auditResults.failures.push({ title, details });
    console.error(`  [FAIL] ${title}`);
    if (details) console.error(`    Details:`, details);
  }
}

console.log('========================================================================');
console.log('   FORENSIC AUDITOR INDEPENDENT VERIFICATION & STRESS-TEST SUITE        ');
console.log('   Target: Milestone 2 (Oracle & Vault) & Milestone 3 (Audio & TTS)     ');
console.log('========================================================================\n');

const validMoods = ['philosophical', 'boastful', 'introspective', 'creative', 'humorous'];
const validEras = ['donda', 'graduation', '808s', 'yeezus'];

// -----------------------------------------------------------------------------
// CHECK 1: Curated Vault Deep Integrity (Milestone 2)
// -----------------------------------------------------------------------------
console.log('--- CHECK 1: Quote Vault Structural & Distribution Integrity ---');
{
  verify(KANYE_OFFLINE_VAULT.length === 42, 'Vault contains exact count of 42 quotes');

  const quotesSet = new Set();
  let duplicates = 0;
  for (const q of KANYE_OFFLINE_VAULT) {
    if (quotesSet.has(q.quote)) duplicates++;
    quotesSet.add(q.quote);
  }
  verify(duplicates === 0, 'All 42 quotes in vault are distinct with 0 duplicates');

  let allValid = true;
  for (const q of KANYE_OFFLINE_VAULT) {
    if (!q.quote || typeof q.quote !== 'string' || q.quote.trim().length === 0) allValid = false;
    if (!validMoods.includes(q.mood)) allValid = false;
    if (!validEras.includes(q.era)) allValid = false;
  }
  verify(allValid, 'Every quote item has non-empty quote, valid mood, and valid era');

  // Verify getRandomOfflineQuote across 500 iterations never fails
  let randomSuccess = true;
  for (let i = 0; i < 500; i++) {
    const q = getRandomOfflineQuote();
    if (!q || !q.quote) randomSuccess = false;
  }
  verify(randomSuccess, 'getRandomOfflineQuote survives 500 random draws without error');

  // Verify getQuotesByEra
  for (const era of validEras) {
    const eraQuotes = getQuotesByEra(era);
    verify(eraQuotes.length > 0 && eraQuotes.every(q => q.era === era), `getQuotesByEra('${era}') returns strictly matching quotes (${eraQuotes.length} quotes)`);
  }

  // Verify getQuotesByMood
  for (const mood of validMoods) {
    const moodQuotes = getQuotesByMood(mood);
    verify(moodQuotes.length > 0 && moodQuotes.every(q => q.mood === mood), `getQuotesByMood('${mood}') returns strictly matching quotes (${moodQuotes.length} quotes)`);
  }
}

// -----------------------------------------------------------------------------
// CHECK 2: Oracle Determinism & Adversarial Inputs (Milestone 2)
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 2: Oracle Engine Determinism & Adversarial Stress ---');
{
  // Deterministic Hash stability
  const h1 = computeDeterministicHash('Test String 123');
  const h2 = computeDeterministicHash('Test String 123');
  const h3 = computeDeterministicHash('Test String 124');
  verify(h1 === h2, 'computeDeterministicHash produces identical hash for identical input');
  verify(h1 !== h3, 'computeDeterministicHash produces different hash for different input');
  verify(typeof h1 === 'number' && h1 >= 0 && Number.isInteger(h1), 'Hash is positive 32-bit integer');

  // Deterministic Fortune Generation
  const f1 = generateKanyeFortune('Quote Alpha', 'Should I quit?', 'api', 'donda');
  const f2 = generateKanyeFortune('Quote Alpha', 'Should I quit?', 'api', 'donda');
  verify(f1.destinyVerdict.title === f2.destinyVerdict.title, 'Fortune verdict is 100% deterministic');
  verify(f1.auraScore === f2.auraScore, 'Fortune auraScore is 100% deterministic');
  verify(f1.luckyArtifact.name === f2.luckyArtifact.name, 'Fortune luckyArtifact is 100% deterministic');
  verify(f1.actionableCommand === f2.actionableCommand, 'Fortune actionableCommand is 100% deterministic');
  verify(f1.luckyNumbers[0] === f2.luckyNumbers[0] && f1.luckyNumbers[1] === 808 && f1.luckyNumbers[2] === f2.luckyNumbers[2], 'Lucky numbers are 100% deterministic and n2 is 808');

  // Adversarial Inputs Stress-Testing
  const adversarialCases = [
    { input: '', desc: 'Empty input string' },
    { input: '   ', desc: 'Whitespace-only string' },
    { input: 'A'.repeat(50000), desc: '50,000 char buffer overflow attack' },
    { input: '<script>alert("XSS")</script>', desc: 'Cross-Site Scripting snippet' },
    { input: 'SELECT * FROM users WHERE 1=1; DROP TABLE fortunes;', desc: 'SQL injection string' },
    { input: '🔥💯🐻🕊️🖤⚡🎶🤖', desc: 'Dense Unicode emojis' },
    { input: '\0\x01\x02\x03\r\n\t', desc: 'Control & null byte characters' },
    { input: 'undefined', desc: 'Literal "undefined" string' },
    { input: 'null', desc: 'Literal "null" string' },
    { input: '{"json": true, "evil": [1,2,3]}', desc: 'Raw JSON object string' },
  ];

  let adversarialPass = true;
  for (const tc of adversarialCases) {
    try {
      const f = generateKanyeFortune('Believe in your flyness.', tc.input, 'offline_vault', 'yeezus');
      if (!f || !f.id || !f.destinyVerdict || !f.oracleInterpretation) {
        adversarialPass = false;
        console.error(`Failed on case: ${tc.desc}`);
      }
      if (f.auraScore < 85 || f.auraScore > 100) {
        adversarialPass = false;
        console.error(`Invalid aura score on ${tc.desc}: ${f.auraScore}`);
      }
    } catch (e) {
      adversarialPass = false;
      console.error(`Exception on adversarial case ${tc.desc}:`, e);
    }
  }
  verify(adversarialPass, 'Survives all 10 adversarial/hostile input test vectors without throwing');

  // Distribution verification over 1,000 draws
  const verdictsSeen = new Set();
  const artifactsSeen = new Set();
  const commandsSeen = new Set();
  for (let i = 0; i < 1000; i++) {
    const f = generateKanyeFortune(`Quote_${i}`, `Question_${i * 3}`, 'api', validEras[i % 4]);
    verdictsSeen.add(f.destinyVerdict.title);
    artifactsSeen.add(f.luckyArtifact.name);
    commandsSeen.add(f.actionableCommand);
  }
  verify(verdictsSeen.size === DESTINY_VERDICTS.length, `Full verdict distribution achieved (${verdictsSeen.size}/${DESTINY_VERDICTS.length})`);
  verify(artifactsSeen.size === YEEZY_ARTIFACTS.length, `Full artifact distribution achieved (${artifactsSeen.size}/${YEEZY_ARTIFACTS.length})`);
  verify(commandsSeen.size === ACTIONABLE_COMMANDS.length, `Full command distribution achieved (${commandsSeen.size}/${ACTIONABLE_COMMANDS.length})`);
}

// -----------------------------------------------------------------------------
// CHECK 3: kanyeApi Network Resilience & Fallback (Milestone 2)
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 3: kanyeApi Network Resilience & Fallback ---');
{
  // Test forced offline fallback
  const offlineResult = await fetchKanyeQuote(1000, true);
  verify(offlineResult.source === 'offline_vault', 'Forced offline mode triggers offline_vault source');
  verify(typeof offlineResult.quote === 'string' && offlineResult.quote.length > 0, 'Offline fallback yields valid quote');

  // Setup headless environment globals for API mocking
  env.setupGlobals();

  // Test online mock
  env.network.mode = 'online';
  env.network.mockQuote = 'Oracle of Ye Test Revolution';
  const onlineResult = await fetchKanyeQuote(1000, false);
  verify(onlineResult.source === 'api', 'Online API responds with source: api');
  verify(onlineResult.quote === 'Oracle of Ye Test Revolution', 'Online API returns fetched quote');

  // Test timeout fallback
  env.network.mode = 'timeout';
  const timeoutResult = await fetchKanyeQuote(50, false);
  verify(timeoutResult.source === 'offline_vault', 'Network timeout triggers graceful offline_vault fallback');

  // Test 500 error fallback
  env.network.mode = 'error500';
  const errorResult = await fetchKanyeQuote(500, false);
  verify(errorResult.source === 'offline_vault', 'HTTP 500 triggers graceful offline_vault fallback');
}

// -----------------------------------------------------------------------------
// CHECK 4: Procedural Web Audio Engine Node Graph (Milestone 3)
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 4: Web Audio Synthesizer Node Graph & Scheduling ---');
{
  const synth = new YeSoundSynthesizer();
  verify(synth.getMuted() === false, 'Synthesizer defaults to unmuted');
  verify(synth.toggleMute() === true, 'toggleMute() toggles to muted');
  verify(synth.getMuted() === true, 'getMuted() reflects muted');
  verify(synth.toggleMute() === false, 'toggleMute() un-mutes cleanly');

  // Initialize Audio Context under mock
  const ctx = synth.initContext();
  verify(ctx !== null, 'initContext() creates valid AudioContext');

  // 1. 808 Sub-bass node graph verification
  synth.playSubBass808();
  const oscs = ctx.createdNodes.filter(n => n.type === 'sine');
  verify(oscs.length >= 1, 'playSubBass808() created a sine wave oscillator');
  const subBassOsc = oscs[oscs.length - 1];
  verify(subBassOsc.started === true && subBassOsc.stopped === true, '808 oscillator started and scheduled stop');
  const freqCalls = subBassOsc.frequency.calls;
  verify(freqCalls.some(c => c.method === 'setValueAtTime' && c.args[0] === 160), '808 starts at 160 Hz');
  verify(freqCalls.some(c => c.method === 'exponentialRampToValueAtTime' && c.args[0] === 46), '808 ramps down to 46 Hz');
  verify(freqCalls.some(c => c.method === 'exponentialRampToValueAtTime' && c.args[0] === 34), '808 drops to 34 Hz sub-bass');

  // 2. Vinyl Crackle node graph verification
  synth.playVinylCrackle(0.5);
  const bandpassFilters = ctx.createdNodes.filter(n => n.type === 'bandpass');
  verify(bandpassFilters.length >= 1, 'playVinylCrackle() creates bandpass filter');
  const bp = bandpassFilters[bandpassFilters.length - 1];
  verify(bp.frequency.calls.some(c => c.args[0] === 1400), 'Bandpass filter frequency is 1400 Hz');
  verify(bp.Q.calls.some(c => c.args[0] === 1.4), 'Bandpass filter Q factor is 1.4');

  // 3. Card Flip Whoosh node graph verification
  synth.playCardFlipWhoosh();
  const lowpassFilters = ctx.createdNodes.filter(n => n.type === 'lowpass');
  verify(lowpassFilters.length >= 1, 'playCardFlipWhoosh() creates lowpass sweep filter');
  const lp = lowpassFilters[lowpassFilters.length - 1];
  verify(lp.frequency.calls.some(c => c.args[0] === 250), 'Whoosh starts at 250 Hz');
  verify(lp.frequency.calls.some(c => c.args[0] === 2800), 'Whoosh sweeps up to 2800 Hz');

  // 4. Receipt Click node graph verification
  synth.playReceiptClick();
  const triangleOscs = ctx.createdNodes.filter(n => n.type === 'triangle');
  verify(triangleOscs.length >= 1, 'playReceiptClick() creates triangle oscillator');
  const tr = triangleOscs[triangleOscs.length - 1];
  verify(tr.frequency.calls.some(c => c.args[0] === 3200), 'Receipt click starts at 3200 Hz');
  verify(tr.frequency.calls.some(c => c.args[0] === 800), 'Receipt click ramps down to 800 Hz');

  // 5. Muted suppression verification
  synth.toggleMute(); // Mute
  const preCount = ctx.createdNodes.length;
  synth.playSubBass808();
  synth.playVinylCrackle();
  synth.playCardFlipWhoosh();
  synth.playReceiptClick();
  const postCount = ctx.createdNodes.length;
  verify(preCount === postCount, 'When muted, all play sound methods immediately return with zero node allocations');
  synth.toggleMute(); // Unmute
}

// -----------------------------------------------------------------------------
// CHECK 5: Speech Synthesis & Micro-TTS Strategy (Milestone 3)
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 5: Speech Synthesis Vocal Tunings & Micro-TTS Strategy ---');
{
  const webSpeech = new WebSpeechProvider();
  verify(webSpeech.isSupported() === true, 'WebSpeechProvider reports isSupported = true in browser env');
  verify(webSpeech.id === 'browser-speech', 'WebSpeechProvider id matches contract');

  let ended = false;
  webSpeech.speak('We are going to move the entire music industry.', () => { ended = true; });
  const currUtterance = webSpeech.getCurrentUtterance();
  verify(currUtterance !== null, 'WebSpeechProvider dispatches SpeechSynthesisUtterance');
  verify(Math.abs(currUtterance.pitch - 0.82) < 0.001, 'Pitch tuned to deep resonant 0.82 baritone');
  verify(Math.abs(currUtterance.rate - 0.94) < 0.001, 'Rate tuned to deliberate 0.94 cadence');
  verify(currUtterance.volume === 1.0, 'Volume set to 1.0');

  webSpeech.stop();
  verify(webSpeech.getCurrentUtterance() === null, 'stop() clears utterance and cancels synthesis');

  // Remote Micro-TTS Strategy Pattern
  const remoteTTS = new RemoteTTSProvider({
    endpointUrl: 'https://api.kanye-fortune.mock/tts',
    apiKey: 'mock-key-12345',
    voiceId: 'ye-monolith',
  });
  verify(remoteTTS.id === 'remote-micro-tts', 'RemoteTTSProvider has id: remote-micro-tts');
  verify(remoteTTS.name === 'Cloud Ye Model', 'RemoteTTSProvider has name: Cloud Ye Model');
  verify(typeof remoteTTS.speak === 'function', 'RemoteTTSProvider implements speak()');
  verify(typeof remoteTTS.stop === 'function', 'RemoteTTSProvider implements stop()');
  verify(typeof remoteTTS.isSupported === 'function', 'RemoteTTSProvider implements isSupported()');
}

// -----------------------------------------------------------------------------
// SUMMARY & EXIT
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(` AUDIT VERIFICATION SUMMARY: ${auditResults.passed} / ${auditResults.total} CHECKS PASSED`);
if (auditResults.failures.length > 0) {
  console.error(` VIOLATIONS DETECTED: ${auditResults.failed}`);
  for (const f of auditResults.failures) {
    console.error(`  - ${f.title}`);
  }
} else {
  console.log(' VERDICT CANDIDATE: ALL FORENSIC CHECKS SATISFIED WITH 0 VIOLATIONS.');
}
console.log('========================================================================\n');

process.exit(auditResults.failed === 0 ? 0 : 1);
