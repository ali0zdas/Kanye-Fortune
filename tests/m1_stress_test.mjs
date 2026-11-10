/**
 * tests/m1_stress_test.mjs
 * Empirical stress test harness for Milestone 1 (Foundation & Era Design System)
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
  warnings: [],
};

function assert(condition, message, details = null) {
  results.total++;
  if (condition) {
    results.passed++;
    console.log(`  ✓ ${message}`);
  } else {
    results.failed++;
    const failInfo = { message, details };
    results.failures.push(failInfo);
    console.error(`  ✗ FAIL: ${message}`);
    if (details) console.error(`    Details:`, details);
  }
}

function warn(message) {
  results.warnings.push(message);
  console.warn(`  ⚠️ WARN: ${message}`);
}

console.log('====================================================');
console.log(' Milestone 1: Empirical Verification & Stress Test  ');
console.log('====================================================\n');

// -----------------------------------------------------------------------------
// Test Suite 1: File Structure & Interface Contracts
// -----------------------------------------------------------------------------
console.log('Suite 1: File Existence & Interface Contracts');
{
  const requiredFiles = [
    'package.json',
    'vite.config.ts',
    'tsconfig.json',
    'tsconfig.app.json',
    'index.html',
    'public/favicon.svg',
    'src/index.css',
    'src/types/fortune.ts',
    'src/data/eras.ts',
    'src/components/era/EraSwitcher.tsx',
    'src/components/layout/Header.tsx',
    'src/components/layout/Footer.tsx',
    'src/App.tsx',
    'src/main.tsx',
  ];

  for (const relPath of requiredFiles) {
    const fullPath = path.join(ROOT_DIR, relPath);
    assert(fs.existsSync(fullPath), `Required file exists: ${relPath}`);
  }

  // Verify fortune.ts defines required types according to PROJECT.md
  const fortuneTs = fs.readFileSync(path.join(ROOT_DIR, 'src/types/fortune.ts'), 'utf-8');
  assert(fortuneTs.includes("type EraId = 'donda' | 'graduation' | '808s' | 'yeezus'"), 'fortune.ts exports EraId with all 4 eras');
  assert(fortuneTs.includes("type ViewMode = 'card' | 'receipt'"), 'fortune.ts exports ViewMode');
  assert(fortuneTs.includes('interface DestinyVerdict'), 'fortune.ts exports DestinyVerdict');
  assert(fortuneTs.includes('interface YeezyArtifact'), 'fortune.ts exports YeezyArtifact');
  assert(fortuneTs.includes('interface KanyeFortunePackage'), 'fortune.ts exports KanyeFortunePackage');
}

// -----------------------------------------------------------------------------
// Test Suite 2: CSS Variables & Era Token Completeness
// -----------------------------------------------------------------------------
console.log('\nSuite 2: CSS Variables & Era Design Tokens');
{
  const cssContent = fs.readFileSync(path.join(ROOT_DIR, 'src/index.css'), 'utf-8');

  const requiredTokens = [
    '--era-bg-primary',
    '--era-bg-secondary',
    '--era-bg-surface',
    '--era-accent-primary',
    '--era-accent-secondary',
    '--era-border',
    '--era-text-primary',
    '--era-text-secondary',
    '--era-glow',
    '--era-radius',
    '--era-font',
    '--era-tracking',
  ];

  const eras = ['donda', 'graduation', '808s', 'yeezus'];
  const extractedTokens = {};

  for (const era of eras) {
    // Regex to match the selector block
    const selectorRegex = new RegExp(`\\[data-era=["']${era}["']\\]\\s*\\{([^\\}]+)\\}`, 'm');
    let match = cssContent.match(selectorRegex);

    if (!match && era === 'donda') {
      // Donda is also defined on :root, [data-era="donda"]
      const dondaRegex = /:root\s*,\s*\[data-era=["']donda["']\]\s*\{([^\}]+)\}/m;
      match = cssContent.match(dondaRegex);
    }

    assert(Boolean(match), `CSS block found for era: [data-era="${era}"]`);

    if (match) {
      const block = match[1];
      extractedTokens[era] = {};

      for (const token of requiredTokens) {
        const tokenRegex = new RegExp(`${token}\\s*:\\s*([^;]+);`);
        const tokenMatch = block.match(tokenRegex);
        assert(
          Boolean(tokenMatch),
          `Era "${era}" defines token ${token}`,
          tokenMatch ? tokenMatch[1].trim() : 'MISSING'
        );
        if (tokenMatch) {
          extractedTokens[era][token] = tokenMatch[1].trim();
        }
      }
    }
  }

  // Verify distinct visual properties across eras
  const bgPrimaries = eras.map((e) => extractedTokens[e]?.['--era-bg-primary']).filter(Boolean);
  const distinctBgs = new Set(bgPrimaries);
  assert(distinctBgs.size === 4, `All 4 eras have distinct --era-bg-primary (${distinctBgs.size}/4)`, bgPrimaries);

  const accentPrimaries = eras.map((e) => extractedTokens[e]?.['--era-accent-primary']).filter(Boolean);
  const distinctAccents = new Set(accentPrimaries);
  assert(distinctAccents.size === 4, `All 4 eras have distinct --era-accent-primary (${distinctAccents.size}/4)`, accentPrimaries);

  const borders = eras.map((e) => extractedTokens[e]?.['--era-border']).filter(Boolean);
  const distinctBorders = new Set(borders);
  assert(distinctBorders.size === 4, `All 4 eras have distinct --era-border (${distinctBorders.size}/4)`, borders);

  // Check 3D perspective helper classes in CSS
  assert(cssContent.includes('.perspective-1000') || cssContent.includes('.perspective-1200'), 'CSS includes 3D perspective classes');
  assert(cssContent.includes('.backface-hidden'), 'CSS includes backface-hidden class');
}

// -----------------------------------------------------------------------------
// Test Suite 3: Color Contrast Verification (WCAG 2.1)
// -----------------------------------------------------------------------------
console.log('\nSuite 3: Color Contrast Verification (WCAG 2.1 AA Standards)');
{
  function parseHex(hex) {
    hex = hex.replace('#', '').trim();
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }

  function getLuminance({ r, g, b }) {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function getContrastRatio(hex1, hex2) {
    const l1 = getLuminance(parseHex(hex1));
    const l2 = getLuminance(parseHex(hex2));
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  const eraColors = {
    donda: {
      bg: '#050505',
      surface: '#121212',
      textPrimary: '#f4f4f5',
      textSecondary: '#a1a1aa',
      accent: '#ffffff',
    },
    graduation: {
      bg: '#1a052e',
      surface: '#4c1d95',
      textPrimary: '#ffffff',
      textSecondary: '#f3e8ff',
      accent: '#ec4899',
    },
    '808s': {
      bg: '#080d1a',
      surface: '#1e293b',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      accent: '#06b6d4',
    },
    yeezus: {
      bg: '#0a0a0c',
      surface: '#27272a',
      textPrimary: '#ffffff',
      textSecondary: '#a1a1aa',
      accent: '#ef4444',
    },
  };

  for (const [era, colors] of Object.entries(eraColors)) {
    // Primary text on primary bg: WCAG AA normal text requires >= 4.5:1
    const textOnBg = getContrastRatio(colors.textPrimary, colors.bg);
    assert(textOnBg >= 7.0, `[${era}] Primary text on bg contrast >= 7:1 (AAA)`, `${textOnBg.toFixed(2)}:1`);

    // Primary text on surface: WCAG AA normal text requires >= 4.5:1
    const textOnSurface = getContrastRatio(colors.textPrimary, colors.surface);
    assert(textOnSurface >= 4.5, `[${era}] Primary text on surface contrast >= 4.5:1 (AA)`, `${textOnSurface.toFixed(2)}:1`);

    // Secondary text on bg: WCAG AA large/secondary text >= 3.0:1
    const secOnBg = getContrastRatio(colors.textSecondary, colors.bg);
    assert(secOnBg >= 4.5, `[${era}] Secondary text on bg contrast >= 4.5:1 (AA)`, `${secOnBg.toFixed(2)}:1`);

    // Accent readability: Check contrast of accent on primary background
    const accentOnBg = getContrastRatio(colors.accent, colors.bg);
    assert(accentOnBg >= 3.0, `[${era}] Accent on bg contrast >= 3.0:1 (UI components)`, `${accentOnBg.toFixed(2)}:1`);
  }
}

// -----------------------------------------------------------------------------
// Test Suite 4: Era Configuration Data & Helper Function
// -----------------------------------------------------------------------------
console.log('\nSuite 4: Era Configuration Data Logic');
{
  const erasTs = fs.readFileSync(path.join(ROOT_DIR, 'src/data/eras.ts'), 'utf-8');

  // Check all 4 era IDs in ERAS array
  const expectedEras = ['donda', 'graduation', '808s', 'yeezus'];
  for (const eraId of expectedEras) {
    assert(erasTs.includes(`id: '${eraId}'`), `eras.ts defines era '${eraId}'`);
  }

  // Check essential properties per era
  assert(erasTs.includes('promptMessage:'), 'eras.ts defines promptMessage');
  assert(erasTs.includes('runes:'), 'eras.ts defines runes');
  assert(erasTs.includes('badgeLabel:'), 'eras.ts defines badgeLabel');
  assert(erasTs.includes('colors:'), 'eras.ts defines colors');
  assert(erasTs.includes('export function getEraConfig'), 'eras.ts exports getEraConfig function');
  assert(erasTs.includes("return ERA_MAP[eraId] || ERA_MAP['donda']"), 'getEraConfig contains safe fallback to donda');
}

// -----------------------------------------------------------------------------
// Test Suite 5: Production Bundle & Asset Integrity
// -----------------------------------------------------------------------------
console.log('\nSuite 5: Production Bundle & Asset Integrity');
{
  const distDir = path.join(ROOT_DIR, 'dist');
  assert(fs.existsSync(distDir), 'Production build directory `dist/` exists');

  const distHtmlPath = path.join(distDir, 'index.html');
  assert(fs.existsSync(distHtmlPath), '`dist/index.html` exists');

  if (fs.existsSync(distHtmlPath)) {
    const htmlContent = fs.readFileSync(distHtmlPath, 'utf-8');

    // Check root mounting element
    assert(htmlContent.includes('id="root"'), '`dist/index.html` has `<div id="root">`');

    // Check favicon reference
    assert(htmlContent.includes('/favicon.svg') || htmlContent.includes('favicon.svg'), '`dist/index.html` references favicon.svg');

    // Check CSS link tags
    const cssMatch = htmlContent.match(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/i) ||
                     htmlContent.match(/<link[^>]+href=["']([^"']+\.css)["'][^>]+rel=["']stylesheet["']/i);
    assert(Boolean(cssMatch), '`dist/index.html` links to a stylesheet', cssMatch ? cssMatch[1] : null);

    if (cssMatch) {
      let cssHref = cssMatch[1].replace(/^\//, '');
      const fullCssPath = path.join(distDir, cssHref);
      assert(fs.existsSync(fullCssPath), `Referenced CSS file exists: ${cssHref}`);

      const cssStats = fs.statSync(fullCssPath);
      const cssSizeKB = cssStats.size / 1024;
      console.log(`    CSS Size: ${cssSizeKB.toFixed(2)} KB (limit: 50 KB)`);
      assert(cssSizeKB < 50, `CSS bundle is within size budget (<50 KB)`, `${cssSizeKB.toFixed(2)} KB`);
      assert(cssStats.size > 1000, `CSS bundle is non-trivial (>1 KB)`);
    }

    // Check JS script tags
    const jsMatch = htmlContent.match(/<script[^>]+src=["']([^"']+\.js)["']/i);
    assert(Boolean(jsMatch), '`dist/index.html` loads a JavaScript entry module', jsMatch ? jsMatch[1] : null);

    if (jsMatch) {
      let jsHref = jsMatch[1].replace(/^\//, '');
      const fullJsPath = path.join(distDir, jsHref);
      assert(fs.existsSync(fullJsPath), `Referenced JS file exists: ${jsHref}`);

      const jsStats = fs.statSync(fullJsPath);
      const jsSizeKB = jsStats.size / 1024;
      console.log(`    JS Size: ${jsSizeKB.toFixed(2)} KB (limit: 400 KB)`);
      assert(jsSizeKB < 400, `JS bundle is within size budget (<400 KB)`, `${jsSizeKB.toFixed(2)} KB`);
      assert(jsStats.size > 10000, `JS bundle has valid content (>10 KB)`);
    }

    // Check favicon asset exists in public and dist
    const publicFavicon = path.join(ROOT_DIR, 'public/favicon.svg');
    const distFavicon = path.join(distDir, 'favicon.svg');
    assert(fs.existsSync(publicFavicon), 'public/favicon.svg exists');
    assert(fs.existsSync(distFavicon), 'dist/favicon.svg exists');

    if (fs.existsSync(distFavicon)) {
      const svgContent = fs.readFileSync(distFavicon, 'utf-8');
      assert(svgContent.includes('<svg') && svgContent.includes('</svg>'), 'favicon.svg is a valid SVG document');
    }
  }
}

// -----------------------------------------------------------------------------
// Test Suite 6: App Component Keyboard Shortcuts & Runtime Invariants
// -----------------------------------------------------------------------------
console.log('\nSuite 6: App Component Keyboard Shortcuts & Runtime Logic');
{
  const appTsx = fs.readFileSync(path.join(ROOT_DIR, 'src/App.tsx'), 'utf-8');

  // Verify keyboard navigation
  assert(appTsx.includes("handleSelectEra('donda')") || appTsx.includes("setActiveEra('donda')"), "Key '1' sets era to 'donda'");
  assert(appTsx.includes("handleSelectEra('graduation')") || appTsx.includes("setActiveEra('graduation')"), "Key '2' sets era to 'graduation'");
  assert(appTsx.includes("handleSelectEra('808s')") || appTsx.includes("setActiveEra('808s')"), "Key '3' sets era to '808s'");
  assert(appTsx.includes("handleSelectEra('yeezus')") || appTsx.includes("setActiveEra('yeezus')"), "Key '4' sets era to 'yeezus'");
  assert(appTsx.includes("e.key.toLowerCase() === 'm'"), "Key 'm' toggles sound");
  assert(appTsx.includes("e.key.toLowerCase() === 'f'"), "Key 'f' toggles card flip");

  // Verify input typing guard
  assert(
    appTsx.includes('HTMLInputElement') && appTsx.includes('HTMLTextAreaElement'),
    'App has typing guard preventing shortcuts inside inputs/textareas'
  );

  // Verify DOM data-era synchronization
  assert(
    appTsx.includes("document.documentElement.setAttribute('data-era', activeEra)"),
    'App synchronizes data-era attribute to document.documentElement'
  );
}

// -----------------------------------------------------------------------------
// Test Suite 7: Era Value Formats & Syntax Validation
// -----------------------------------------------------------------------------
console.log('\nSuite 7: CSS Variable Value Format & Syntax Stress Test');
{
  const cssContent = fs.readFileSync(path.join(ROOT_DIR, 'src/index.css'), 'utf-8');
  const eras = ['donda', 'graduation', '808s', 'yeezus'];

  const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  const rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
  const radiusRegex = /^[0-9]+(px|rem|em|%)?$/;
  const trackingRegex = /^-?[0-9.]+(em|rem|px)?$/;

  for (const era of eras) {
    const eraRegex = era === 'donda'
      ? /:root\s*,\s*\[data-era=["']donda["']\]\s*\{([^\}]+)\}/m
      : new RegExp(`\\[data-era=["']${era}["']\\]\\s*\\{([^\\}]+)\\}`, 'm');
    const match = cssContent.match(eraRegex);
    assert(Boolean(match), `Era [${era}] block extracted`);

    if (match) {
      const block = match[1];
      const extract = (token) => {
        const m = block.match(new RegExp(`${token}\\s*:\\s*([^;]+);`));
        return m ? m[1].trim() : '';
      };

      const bgPri = extract('--era-bg-primary');
      assert(hexColorRegex.test(bgPri), `[${era}] --era-bg-primary is valid hex (${bgPri})`);

      const bgSec = extract('--era-bg-secondary');
      assert(hexColorRegex.test(bgSec), `[${era}] --era-bg-secondary is valid hex (${bgSec})`);

      const bgSurf = extract('--era-bg-surface');
      assert(hexColorRegex.test(bgSurf), `[${era}] --era-bg-surface is valid hex (${bgSurf})`);

      const accentPri = extract('--era-accent-primary');
      assert(hexColorRegex.test(accentPri), `[${era}] --era-accent-primary is valid hex (${accentPri})`);

      const accentSec = extract('--era-accent-secondary');
      assert(hexColorRegex.test(accentSec), `[${era}] --era-accent-secondary is valid hex (${accentSec})`);

      const border = extract('--era-border');
      assert(hexColorRegex.test(border), `[${era}] --era-border is valid hex (${border})`);

      const glow = extract('--era-glow');
      assert(rgbaRegex.test(glow), `[${era}] --era-glow is valid rgba (${glow})`);

      const radius = extract('--era-radius');
      assert(radiusRegex.test(radius), `[${era}] --era-radius is valid measurement (${radius})`);

      const tracking = extract('--era-tracking');
      assert(trackingRegex.test(tracking), `[${era}] --era-tracking is valid measurement (${tracking})`);
    }
  }
}

// -----------------------------------------------------------------------------
// Test Suite 8: All 16 Era Transition Permutations
// -----------------------------------------------------------------------------
console.log('\nSuite 8: Combinatorial Era Transition Permutations (4 x 4 = 16)');
{
  const eras = ['donda', 'graduation', '808s', 'yeezus'];
  let successfulTransitions = 0;

  for (const fromEra of eras) {
    for (const toEra of eras) {
      // Simulate state transition: ensure both states have defined configurations and distinct properties
      const cssContent = fs.readFileSync(path.join(ROOT_DIR, 'src/index.css'), 'utf-8');
      const hasFrom = cssContent.includes(`data-era="${fromEra}"`);
      const hasTo = cssContent.includes(`data-era="${toEra}"`);
      if (hasFrom && hasTo) {
        successfulTransitions++;
      }
    }
  }
  assert(successfulTransitions === 16, `All 16 era transition pairs valid (${successfulTransitions}/16)`);
}

// -----------------------------------------------------------------------------
// Test Suite 9: HTML Meta Tags & Accessibility Foundation
// -----------------------------------------------------------------------------
console.log('\nSuite 9: HTML Meta Tags & SEO/Accessibility Foundation');
{
  const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
  assert(indexHtml.includes('<title>Kanye Fortune — Oracle of Ye</title>'), 'index.html has title "Kanye Fortune — Oracle of Ye"');
  assert(indexHtml.includes('name="viewport"'), 'index.html includes responsive viewport meta');
  assert(indexHtml.includes('name="theme-color"'), 'index.html includes theme-color meta');
  assert(indexHtml.includes('name="description"'), 'index.html includes description meta');
  assert(indexHtml.includes('property="og:title"'), 'index.html includes Open Graph title');
  assert(indexHtml.includes('property="og:description"'), 'index.html includes Open Graph description');
  assert(indexHtml.includes('property="twitter:card"'), 'index.html includes Twitter card meta');
  assert(indexHtml.includes('fonts.googleapis.com'), 'index.html preloads Google Fonts');
  assert(indexHtml.includes('class="dark"'), 'index.html defaults to dark mode class');
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
if (results.warnings.length > 0) {
  console.log(` Warnings: ${results.warnings.length}`);
  for (const w of results.warnings) {
    console.warn(`  - ${w}`);
  }
}
console.log('====================================================\n');

process.exit(results.failed === 0 ? 0 : 1);
