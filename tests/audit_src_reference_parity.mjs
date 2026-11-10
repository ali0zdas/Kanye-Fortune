import * as srcOracle from '../src/services/oracleEngine.ts';
import * as srcVault from '../src/data/kanyeQuotesVault.ts';
import * as srcShare from '../src/utils/shareHelpers.ts';
import * as srcEdge from '../src/components/ui/SerratedEdge.tsx';
import * as refOracle from '../e2e/harness/referenceOracle.ts';

console.log('--- Cross-verifying src vs referenceOracle ---');
console.log('Vault count match:', srcVault.KANYE_OFFLINE_VAULT.length === refOracle.KANYE_OFFLINE_VAULT.length);
console.log('Destiny Verdicts count match:', srcOracle.DESTINY_VERDICTS.length === refOracle.DESTINY_VERDICTS.length);
console.log('Artifacts count match:', srcOracle.YEEZY_ARTIFACTS.length === refOracle.YEEZY_ARTIFACTS.length);
console.log('Aura titles count match:', srcOracle.AURA_TITLES.length === refOracle.AURA_TITLES.length);
console.log('Commands count match:', srcOracle.ACTIONABLE_COMMANDS.length === refOracle.ACTIONABLE_COMMANDS.length);
console.log('Saw tooth path match:', srcEdge.SAW_TOOTH_PATH === refOracle.SAW_TOOTH_SVG_PATH);

// Test hash parity on 100 test strings
let hashParity = true;
for (let i = 0; i < 100; i++) {
  const s = 'test-seed-' + i + '-kanye';
  if (srcOracle.computeDeterministicHash(s) !== refOracle.computeDeterministicHash(s)) {
    hashParity = false;
    break;
  }
}
console.log('Hash parity across 100 seeds:', hashParity);

// Test fortune generation parity
let fortuneParity = true;
for (const q of srcVault.KANYE_OFFLINE_VAULT.slice(0, 10)) {
  const f1 = srcOracle.generateKanyeFortune(q.quote, 'Should I quit my job?', 'api', q.era);
  const f2 = refOracle.generateKanyeFortune(q.quote, 'Should I quit my job?', 'api', q.era);
  if (f1.destinyVerdict.title !== f2.destinyVerdict.title ||
      f1.oracleInterpretation !== f2.oracleInterpretation ||
      f1.actionableCommand !== f2.actionableCommand ||
      f1.auraScore !== f2.auraScore ||
      f1.luckyNumbers[1] !== f2.luckyNumbers[1]) {
    fortuneParity = false;
    break;
  }
}
console.log('Fortune generation parity:', fortuneParity);

// Test share helpers parity
const sampleFortune = srcOracle.generateKanyeFortune('Burn that excel spread sheet.', 'Should I quit my job?', 'api', 'donda');
console.log('Clipboard text parity:', srcShare.formatClipboardShareText(sampleFortune) === refOracle.formatClipboardShareText(sampleFortune));
console.log('Twitter URL parity:', srcShare.createTwitterShareUrl(sampleFortune) === refOracle.createTwitterShareUrl(sampleFortune));
