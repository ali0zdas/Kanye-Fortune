import { KanyeFortunePackage } from '../types/fortune';

/**
 * Formats a fortune package into a clean, viral multi-line clipboard text snippet.
 */
export function formatClipboardShareText(fortune: KanyeFortunePackage): string {
  return [
    `"${fortune.quote}" — Kanye West`,
    '',
    `🔮 Oracle Verdict: ${fortune.destinyVerdict.title}`,
    `⚡ Ye's Command: ${fortune.actionableCommand}`,
    `✨ Aura: ${fortune.auraScore}% [${fortune.auraTitle.toUpperCase()}]`,
    `🏆 Artifact: ${fortune.luckyArtifact.name}`,
    '',
    'Draw your fortune: https://kanyefortune.com',
  ].join('\n');
}

/**
 * Sanitizes a string by converting or removing unpaired Unicode surrogate code points
 * to ensure encodeURIComponent never throws a URIError: URI malformed.
 */
function sanitizeSurrogates(str: string): string {
  if (typeof (str as unknown as { toWellFormed?: () => string }).toWellFormed === 'function') {
    return (str as unknown as { toWellFormed: () => string }).toWellFormed();
  }
  // Fallback for environments lacking String.prototype.toWellFormed
  return str.replace(
    /([\uD800-\uDBFF](?![\uDC00-\uDFFF]))|((?<![\uD800-\uDBFF])[\uDC00-\uDFFF])/g,
    '\uFFFD'
  );
}

/**
 * Generates an official Twitter/X Web Intent share URL pre-populated with quote & hashtags.
 */
export function createTwitterShareUrl(fortune: KanyeFortunePackage): string {
  const rawText = `"${fortune.quote}" — Ye\n🔮 Verdict: ${fortune.destinyVerdict.title}\n⚡ Directive: ${fortune.actionableCommand}\n\nDraw your Kanye Fortune:`;
  const text = sanitizeSurrogates(rawText);
  const url = 'https://kanyefortune.com';
  const hashtags = 'KanyeWest,OracleOfYe,Yeezy';
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
}

/**
 * Copies the formatted fortune text to the user's system clipboard.
 */
export async function copyFortuneToClipboard(fortune: KanyeFortunePackage): Promise<boolean> {
  const text = formatClipboardShareText(fortune);
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers / non-secure contexts
    if (typeof document !== 'undefined') {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
    return false;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}
