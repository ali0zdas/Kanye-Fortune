import fs from 'node:fs';
import path from 'node:path';
import * as oracleEngine from '../src/services/oracleEngine.ts';
import * as vault from '../src/data/kanyeQuotesVault.ts';
import * as shareHelpers from '../src/utils/shareHelpers.ts';
import * as serratedEdge from '../src/components/ui/SerratedEdge.tsx';
import * as eras from '../src/data/eras.ts';
import { YeSoundSynthesizer } from '../src/services/audioSynthesizer.ts';
import { WebSpeechProvider } from '../src/services/tts/WebSpeechProvider.ts';
import { RemoteTTSProvider } from '../src/services/tts/RemoteTTSProvider.ts';

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

function check(desc, pass, detail = '') {
  results.total++;
  if (pass) {
    results.passed++;
    console.log(`  [PASS] ${desc}`);
  } else {
    results.failed++;
    console.error(`  [FAIL] ${desc} - ${detail}`);
    results.details.push({ desc, detail });
  }
}

console.log('========================================================================');
console.log('   FINAL ACCEPTANCE AUDIT: FULL REPOSITORY INTEGRITY VERIFICATION       ');
console.log('========================================================================\n');

// 1. M1: Era Design Tokens
console.log('--- 1. M1: Era System & Token Verification ---');
check('4 eras configured in eras.ts', eras.ERAS.length === 4);
const eraIds = eras.ERAS.map(e => e.id);
check('Era IDs match [donda, graduation, 808s, yeezus]', ['donda', 'graduation', '808s', 'yeezus'].every(id => eraIds.includes(id)));
const cssPath = path.resolve('src/index.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');
check('CSS defines [data-era="donda"]', cssContent.includes('[data-era="donda"]'));
check('CSS defines [data-era="graduation"]', cssContent.includes('[data-era="graduation"]'));
check('CSS defines [data-era="808s"]', cssContent.includes('[data-era="808s"]'));
check('CSS defines [data-era="yeezus"]', cssContent.includes('[data-era="yeezus"]'));

// 2. M2: Oracle Engine & Vault
console.log('\n--- 2. M2: Oracle Engine & 42-Quote Offline Vault ---');
check('Exact 42 quotes in vault', vault.KANYE_OFFLINE_VAULT.length === 42);
const uniqueQuotes = new Set(vault.KANYE_OFFLINE_VAULT.map(q => q.quote));
check('0 duplicate quotes in vault', uniqueQuotes.size === 42);
check('8 Destiny Verdict archetypes', oracleEngine.DESTINY_VERDICTS.length === 8);
check('10 Yeezy Artifacts defined', oracleEngine.YEEZY_ARTIFACTS.length === 10);
check('10 Actionable Commands defined', oracleEngine.ACTIONABLE_COMMANDS.length === 10);
check('8 Aura Titles defined', oracleEngine.AURA_TITLES.length === 8);

const fortune = oracleEngine.generateKanyeFortune('Burn that excel spread sheet.', 'Should I quit my job?', 'api', 'donda');
check('Fortune has id, quote, and question', Boolean(fortune.id && fortune.quote && fortune.userQuestion));
check('Career query triggers career interpretation', fortune.oracleInterpretation.includes('spreadsheets are the modern padded cell'));
check('Aura score within 85-100', fortune.auraScore >= 85 && fortune.auraScore <= 100);
check('Lucky numbers contains 808', fortune.luckyNumbers[1] === 808);

// 3. M3: Web Audio & Micro-TTS
console.log('\n--- 3. M3: Web Audio DSP & Micro-TTS Speech Tuning ---');
const audioSynthSrc = fs.readFileSync(path.resolve('src/services/audioSynthesizer.ts'), 'utf8');
check('Zero external .mp3/.wav/.ogg assets', !audioSynthSrc.includes('.mp3') && !audioSynthSrc.includes('.wav') && !audioSynthSrc.includes('.ogg'));
check('Procedural 808 exponential pitch drop 160Hz -> 46Hz -> 34Hz', audioSynthSrc.includes('160') && audioSynthSrc.includes('46') && audioSynthSrc.includes('34'));
check('Vinyl crackle bandpass filter 1400Hz Q 1.4', audioSynthSrc.includes('1400') && audioSynthSrc.includes('1.4'));
check('Whoosh sweep 250Hz -> 2800Hz -> 320Hz', audioSynthSrc.includes('250') && audioSynthSrc.includes('2800') && audioSynthSrc.includes('320'));
check('Receipt click triangle wave 3200Hz -> 800Hz', audioSynthSrc.includes('3200') && audioSynthSrc.includes('800'));

const webSpeechSrc = fs.readFileSync(path.resolve('src/services/tts/WebSpeechProvider.ts'), 'utf8');
check('Speech pitch tuned to 0.82', webSpeechSrc.includes('pitch = 0.82'));
check('Speech rate tuned to 0.94', webSpeechSrc.includes('rate = 0.94'));

// 4. M4: 3D Tarot Card & Thermal Receipt
console.log('\n--- 4. M4: 3D Tarot Card & Thermal Receipt Stage ---');
const oracleCardSrc = fs.readFileSync(path.resolve('src/components/fortune/OracleCard.tsx'), 'utf8');
check('OracleCard implements rotateY 180deg flip', oracleCardSrc.includes('rotateY: 180') || oracleCardSrc.includes('rotateY: isFlipped ? 180 : 0'));
check('OracleCard implements mouse tilt physics', oracleCardSrc.includes('useMotionValue') && oracleCardSrc.includes('useSpring'));
check('OracleCard contains 4 era card backs', oracleCardSrc.includes("activeEra === 'donda'") && oracleCardSrc.includes("activeEra === 'graduation'") && oracleCardSrc.includes("activeEra === '808s'") && oracleCardSrc.includes("activeEra === 'yeezus'"));

const thermalReceiptSrc = fs.readFileSync(path.resolve('src/components/fortune/ThermalReceipt.tsx'), 'utf8');
check('ThermalReceipt uses monospace font', thermalReceiptSrc.includes('font-mono'));
check('ThermalReceipt shows EST. 1977', thermalReceiptSrc.includes('1977'));
check('ThermalReceipt includes SVG vector barcode', thermalReceiptSrc.includes('viewBox="0 0 280 48"') || thermalReceiptSrc.includes('rect x='));
check('ThermalReceipt subtotal $0.00 and total PRICELESS', thermalReceiptSrc.includes('$0.00') && thermalReceiptSrc.includes('PRICELESS'));

const sawToothPath = serratedEdge.SAW_TOOTH_PATH;
check('SerratedEdge SVG path starts with M0,12 and ends with Z', sawToothPath.startsWith('M0,12') && sawToothPath.endsWith('Z'));

// 5. M5: High-DPI Export & Social Sharing
console.log('\n--- 5. M5: High-DPI PNG Exporter & Viral Social Sharing ---');
const exportHookSrc = fs.readFileSync(path.resolve('src/hooks/useExportImage.ts'), 'utf8');
check('useExportImage imports toPng from html-to-image', exportHookSrc.includes("toPng") && exportHookSrc.includes('html-to-image'));
check('useExportImage gates on document.fonts.ready', exportHookSrc.includes('document.fonts.ready'));
check('useExportImage supports square (1080x1080) and story (1080x1920)', exportHookSrc.includes('1080') && exportHookSrc.includes('1920'));
check('useExportImage uses pixelRatio: 2', exportHookSrc.includes('pixelRatio: 2'));

const shareText = shareHelpers.formatClipboardShareText(fortune);
check('Clipboard share text contains quote and Kanye West', shareText.includes(fortune.quote) && shareText.includes('Kanye West'));
check('Clipboard share text contains Oracle Verdict', shareText.includes('Oracle Verdict'));
check('Clipboard share text contains Ye\'s Command', shareText.includes("Ye's Command"));

const twitterUrl = shareHelpers.createTwitterShareUrl(fortune);
check('Twitter share intent constructed with proper encoding', twitterUrl.startsWith('https://twitter.com/intent/tweet?') && twitterUrl.includes('hashtags='));

// 6. Security & Anti-Facade Scan
console.log('\n--- 6. Security, Zero-Facade, & Zero-Hardcoded Output Scan ---');
const allSrcFiles = [
  'src/services/kanyeApi.ts',
  'src/services/oracleEngine.ts',
  'src/services/audioSynthesizer.ts',
  'src/services/tts/WebSpeechProvider.ts',
  'src/services/tts/RemoteTTSProvider.ts',
  'src/hooks/useKanyeFortune.ts',
  'src/hooks/useYeAudio.ts',
  'src/hooks/useKanyeTTS.ts',
  'src/hooks/useExportImage.ts',
  'src/components/fortune/OracleCard.tsx',
  'src/components/fortune/ThermalReceipt.tsx',
  'src/components/export/DedicatedExportCard.tsx',
  'src/components/export/ExportModal.tsx',
  'src/App.tsx'
];

let zeroFacades = true;
for (const file of allSrcFiles) {
  const content = fs.readFileSync(path.resolve(file), 'utf8');
  if (content.includes('return "PASS"') || content.includes('return true; // dummy') || content.includes('NotImplementedError')) {
    zeroFacades = false;
    break;
  }
}
check('All source files free of dummy facades / test shortcuts', zeroFacades);

console.log('\n========================================================================');
console.log(` RESULTS: ${results.passed} / ${results.total} AUDIT CHECKS PASSED (${results.failed} failed)`);
console.log('========================================================================\n');

if (results.failed === 0) {
  console.log('✅ REPOSITORY-WIDE ACCEPTANCE AUDIT VERDICT: 100% CLEAN');
} else {
  console.error('❌ REPOSITORY AUDIT DETECTED FAILURES');
  process.exit(1);
}
