import {
  DestinyVerdict,
  EraId,
  KanyeFortunePackage,
  YeezyArtifact,
} from '../types/fortune';

export const DESTINY_VERDICTS: DestinyVerdict[] = [
  {
    title: 'ASCENDANT YE',
    subtitle: 'Frequency 1000 — Untouchable Monolithic Energy',
  },
  {
    title: 'GOD LEVEL',
    subtitle: 'Maximum Distortion of Standard Human Limitations',
  },
  {
    title: '808 HEARTACHE MATRIX',
    subtitle: 'Autotuned Sorrow Converted Into Pure Stadium Power',
  },
  {
    title: 'YEEZY VISIONARY',
    subtitle: 'Currently Operating 12 Years Ahead of the Culture',
  },
  {
    title: 'MONOLITHIC DONDA',
    subtitle: 'Matte Black Armor Against Lukewarm Frequencies',
  },
  {
    title: 'TURBOGRAFX-16 UNLOCKED',
    subtitle: 'Retro-Futuristic Creative Overflow',
  },
  {
    title: 'COLLEGE DROPOUT PARADOX',
    subtitle: 'Throw Away the Syllabus and Build an Empire',
  },
  {
    title: 'STADIUM STATUS',
    subtitle: 'Sovereign, Deafening, Unapologetic Greatness',
  },
];

export const YEEZY_ARTIFACTS: YeezyArtifact[] = [
  {
    name: 'Diamond Grill',
    description: 'Reflects divine truth into every room you enter.',
    iconName: 'Sparkles',
  },
  {
    name: 'Red Stem Player',
    description: 'Splits reality into individual stems so you isolate what matters.',
    iconName: 'Disc',
  },
  {
    name: 'Shutter Shades',
    description: 'Completely filters out peripheral doubt and lukewarm advice.',
    iconName: 'Glasses',
  },
  {
    name: 'Sunday Service Choir Robe',
    description: 'Imbues your spirit with celestial harmony and armor.',
    iconName: 'Shirt',
  },
  {
    name: 'Foam Runner Proto 01',
    description: 'Earthquake-resistant footwear engineered for extraterrestrial soil.',
    iconName: 'Footprints',
  },
  {
    name: 'Spiked Balenciaga Mask',
    description: 'Grants supreme anonymity while commanding the room.',
    iconName: 'Shield',
  },
  {
    name: 'Silver Metallurgical Finish',
    description: 'Replaces ordinary human emotion with timeless bronze/silver aura.',
    iconName: 'Sun',
  },
  {
    name: 'Vintage MPC 2000XL',
    description: 'Chops your greatest failures into soul-stirring stadium anthems.',
    iconName: 'Sliders',
  },
  {
    name: 'Donda Bulletproof Vest',
    description: 'Guards your heart against media slander and weak friends.',
    iconName: 'ShieldCheck',
  },
  {
    name: 'Titanium Cyber-Whistle',
    description: 'Summons architects and choir vocalists at 4:15 AM.',
    iconName: 'Bell',
  },
];

export const AURA_TITLES: string[] = [
  'God Complex',
  'Sovereign Visionary',
  'Untamed Frequency',
  'Stadium Resonance',
  'Melancholic Genius',
  'Pure Unfiltered Aura',
  '808 Hertz Transceiver',
  'Billionaire Prophet',
];

export const ACTIONABLE_COMMANDS: string[] = [
  'Delete every spreadsheet on your hard drive and compose a 9-minute orchestral outro.',
  'Order 1,000 pairs of foam runners immediately and refuse to explain why to anyone.',
  'Wear sunglasses inside the grocery store today. Maintain zero eye contact.',
  'Call your manager at 3:15 AM to inform them you are Steve Jobs reincarnated.',
  'Send a single-word email saying \'EXCELLENCE\' and turn on airplane mode for 72 hours.',
  'Pull up to your next meeting on a motorized bicycle wearing an oversized designer hoodie.',
  'Redesign your living room furniture using only monolithic concrete slabs.',
  'Forgive your enemies, but sample their crying voice memo on your next masterpiece.',
  'Cut out all squares from your circle before sunset.',
  'Speak directly to the universe and demand your executive producer credit.',
];

export const TOPIC_PATTERNS = {
  career: /\b(job|work|career|boss|promotion|quit|office|excel|corporate|startup|company|business|interview)\b/i,
  romance: /\b(love|ex|relationship|date|text|crush|boyfriend|girlfriend|marriage|heartbreak|divorce|lonely)\b/i,
  money: /\b(money|rich|buy|purchase|cost|dollar|expensive|invest|afford|shopping|luxury|wealth)\b/i,
  doubt: /\b(scared|fail|afraid|fear|doubt|anxious|anxiety|imposter|depressed|stress|hesitate|worried)\b/i,
  creative: /\b(art|music|design|create|write|album|book|painting|fashion|aesthetic|vision|idea)\b/i,
  ego: /\b(genius|greatest|best|special|legacy|famous|fame|respect|power|status)\b/i,
};

export const ORACLE_PROPHECIES: string[] = [
  'The cosmos confirms your current frequency is operating beyond standard human limitations. Do not apologize for the volume of your ambition; rip the knob off entirely and let the stadium monitors peak.',
  'Your timeline is actively accelerating past lukewarm consensus. What they label as erratic is simply the sonic boom of you breaking away from average expectations. Meditate on this sovereign conviction.',
  'You are currently navigating a season of monolithic focus. Never compromise your palette for rooms where people are still negotiating with mediocrity. Build the prototype in absolute conviction.',
  'The universe is demanding uncompromising sovereignty. Stop seeking permission from custodians of obsolete systems you are destined to reinvent from the ground up.',
  'A profound shift in cultural gravity is working in your favor. Trust the inner frequency that keeps you up until 4 AM perfecting your masterpiece. Greatness needs no consensus.',
  'Your spiritual architecture is impervious to peripheral distortion. When comfortable critics attempt to judge your trajectory, remember that architects do not seek approval from tenants.',
  'Every obstacle in your current orbit is merely friction engineered to polish your raw genius. Step into the arena with unhinged confidence; the culture has already cleared your path.',
  'This is a season of unfiltered execution. Strip away the superfluous noise, cut off the lukewarm advice, and let the undeniable gravity of your craft command the room.',
  'You are playing in an arena engineered for giants while they debate inside playpens. Commission your own monolith, stand tall upon your vision, and never look down.',
  'The master channel of your destiny has zero distortion. When doubt whispers in the background, drown it out with maximum stadium amplification. You hold the keys.',
];

/**
 * Deterministic 32-bit hash function for consistent fortune generation across identical seeds.
 */
export function computeDeterministicHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Core deterministic fortune generation algorithm.
 * Synthesizes:
 * - Destiny Verdict (8 archetypes)
 * - Thematic Oracle Interpretation tailored to user inquiry (or empty serendipity)
 * - Actionable high-energy Ye Command
 * - Aura Rating (86-100) & Aura Title
 * - Lucky Yeezy Artifact with Lucide icon
 * - 3 Lucky Yeezy Numbers (including 808)
 */
export function generateKanyeFortune(
  quote: string,
  userQuestion: string = '',
  source: 'api' | 'offline_vault' = 'api',
  activeEra: EraId = 'donda'
): KanyeFortunePackage {
  const safeQuote = String(quote ?? '');
  const trimmedQ = (userQuestion || '').trim();
  // Safe truncation for massive spam inputs
  const cleanQ = trimmedQ.length > 200 ? trimmedQ.slice(0, 200) : trimmedQ;
  const seedString = `${safeQuote}::${cleanQ}::${activeEra}`;
  const posHash = computeDeterministicHash(seedString);

  const verdict = DESTINY_VERDICTS[posHash % DESTINY_VERDICTS.length];
  const artifact = YEEZY_ARTIFACTS[(posHash * 7) % YEEZY_ARTIFACTS.length];
  const command = ACTIONABLE_COMMANDS[(posHash * 13) % ACTIONABLE_COMMANDS.length];
  const auraScore = 86 + (posHash % 15);
  const auraTitle = AURA_TITLES[(posHash * 3) % AURA_TITLES.length];

  const n1 = (posHash % 88) + 1;
  const n2 = 808;
  const n3 = ((posHash * 17) % 2024) + 1;

  let interpretation = '';
  if (TOPIC_PATTERNS.career.test(cleanQ)) {
    interpretation =
      'You are playing in an arena engineered by people with a fraction of your vibration. Ye reminds you that spreadsheets are the modern padded cell for creative gods. Stop begging for a seat at their table—commission a custom concrete monolith and broadcast your truth.';
  } else if (TOPIC_PATTERNS.romance.test(cleanQ)) {
    interpretation =
      "The 808 kick in your chest is clipping the master channel for a reason. Looking back at an ex is like driving a Maybach at 140 MPH while staring solely at the rearview mirror. You don't need closure; you need stadium lighting and a 60-person gospel choir behind you.";
  } else if (TOPIC_PATTERNS.money.test(cleanQ)) {
    interpretation =
      'Fiat currency is a temporary collective illusion invented by bankers who never harmonized an 8-bar loop. If this acquisition elevates your architectural aura and terrifies lukewarm thinkers, it is already funded by future timelines. Buy the vision, not the receipt.';
  } else if (TOPIC_PATTERNS.doubt.test(cleanQ)) {
    interpretation =
      'Fear is merely your old persona choking as your next form ascends. Ye conquered shyness with flyness, and your hesitation is already overdue for liquidation. Turn the headphone monitors up to max gain and refuse to apologize for being loud.';
  } else if (TOPIC_PATTERNS.creative.test(cleanQ)) {
    interpretation =
      'They will call you crazy until the prototype hits the runway—then they will call you a genius. Do not compromise your palette for people whose peak ambition is blending into wallpaper. Lock the studio doors and do not emerge until the frequency is undeniable.';
  } else if (TOPIC_PATTERNS.ego.test(cleanQ)) {
    interpretation =
      'Humility was invented to keep titans from disrupting the comfortable mediocrity of the crowd. Ye knows that acknowledging your own divinity is simply honesty. Let them debate your character while you collect the culture\'s keys.';
  } else if (cleanQ.length === 0) {
    interpretation = ORACLE_PROPHECIES[posHash % ORACLE_PROPHECIES.length];
  } else {
    interpretation =
      'Your inquiry sends tremors through the Yeezy continuum. Step forward with unhinged conviction; greatness has never once apologized for taking the stage.';
  }

  return {
    id: `fortune-${Date.now()}-${posHash.toString(36)}`,
    timestamp: Date.now(),
    userQuestion: cleanQ.length > 0 ? cleanQ : null,
    quote: safeQuote,
    source,
    era: activeEra,
    destinyVerdict: verdict,
    oracleInterpretation: interpretation,
    actionableCommand: command,
    auraScore,
    auraTitle,
    luckyArtifact: artifact,
    luckyNumbers: [n1, n2, n3],
  };
}
