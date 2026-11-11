// e2e/harness/referenceOracle.ts
// Authoritative Reference Specifications & Oracle derived from PROJECT.md & Survey Handoffs

export type EraId = 'donda' | 'graduation' | '808s' | 'yeezus';
export type ViewMode = 'card' | 'receipt';
export type QuoteMood = 'philosophical' | 'boastful' | 'introspective' | 'creative' | 'humorous';

export interface DestinyVerdict {
  title: string;
  subtitle: string;
}

export interface YeezyArtifact {
  name: string;
  description: string;
  iconName: string;
}

export interface KanyeFortunePackage {
  id: string;
  timestamp: number;
  userQuestion: string | null;
  quote: string;
  source: 'api' | 'offline_vault';
  era: EraId;
  destinyVerdict: DestinyVerdict;
  oracleInterpretation: string;
  actionableCommand: string;
  auraScore: number;
  auraTitle: string;
  luckyArtifact: YeezyArtifact;
  luckyNumbers: [number, number, number];
}

export interface KanyeQuoteItem {
  quote: string;
  mood: QuoteMood;
  era: EraId;
}

export const KANYE_OFFLINE_VAULT: KanyeQuoteItem[] = [
  // Philosophical (9)
  { quote: "Everything you do in life stems from either fear or love.", mood: "philosophical", era: "donda" },
  { quote: "Distraction is the enemy of vision.", mood: "philosophical", era: "donda" },
  { quote: "My memories are from the future.", mood: "philosophical", era: "graduation" },
  { quote: "We came into a broken world. And we're the cleanup crew.", mood: "philosophical", era: "donda" },
  { quote: "You can't look at a glass half full or empty if it's overflowing.", mood: "philosophical", era: "graduation" },
  { quote: "Let's be like water.", mood: "philosophical", era: "donda" },
  { quote: "Believe in your flyness... conquer your shyness.", mood: "philosophical", era: "graduation" },
  { quote: "Truth is my goal. Controversy is my gym. I'll do a hundred reps of controversy for a 6 pack of truth.", mood: "philosophical", era: "yeezus" },
  { quote: "For me, money is not my definition of success. Inspiring people is a definition of success.", mood: "philosophical", era: "graduation" },

  // Boastful (9)
  { quote: "I still think I am the greatest.", mood: "boastful", era: "yeezus" },
  { quote: "I am Warhol. I am the No. 1 most impactful artist of our generation. I am Shakespeare in the flesh.", mood: "boastful", era: "yeezus" },
  { quote: "For me to say I wasn't a genius I'd just be lying to you and to myself.", mood: "boastful", era: "yeezus" },
  { quote: "I feel like I'm too busy writing history to read it.", mood: "boastful", era: "graduation" },
  { quote: "My greatest award is what I'm about to do.", mood: "boastful", era: "graduation" },
  { quote: "If I got any cooler I would freeze to death.", mood: "boastful", era: "graduation" },
  { quote: "I'm on the pursuit of awesomeness, excellence is the bare minimum.", mood: "boastful", era: "graduation" },
  { quote: "Winning is the only option.", mood: "boastful", era: "yeezus" },
  { quote: "I am the head of Adidas. I will bring Adidas and Puma back together and bring me and Jay back together.", mood: "boastful", era: "donda" },

  // Introspective (8)
  { quote: "We all self-conscious. I'm just the first to admit it.", mood: "introspective", era: "808s" },
  { quote: "I don't expect to be understood at all.", mood: "introspective", era: "808s" },
  { quote: "My greatest pain in life is that I will never be able to see myself perform live.", mood: "introspective", era: "808s" },
  { quote: "There's so many lonely emojis man.", mood: "introspective", era: "808s" },
  { quote: "I care. I care about everything. Sometimes not giving a f#%k is caring the most.", mood: "introspective", era: "808s" },
  { quote: "People only get jealous when they care.", mood: "introspective", era: "808s" },
  { quote: "Sometimes you have to get rid of everything.", mood: "introspective", era: "donda" },
  { quote: "We laugh to keep from crying.", mood: "introspective", era: "808s" },

  // Creative (8)
  { quote: "I'm a creative genius.", mood: "creative", era: "yeezus" },
  { quote: "Burn that excel spread sheet.", mood: "creative", era: "yeezus" },
  { quote: "Artists are founders.", mood: "creative", era: "donda" },
  { quote: "I think I do myself a disservice by comparing myself to Steve Jobs and Walt Disney. It should be more like Willy Wonka... and welcome to my chocolate factory.", mood: "creative", era: "graduation" },
  { quote: "We will change the paradigm.", mood: "creative", era: "donda" },
  { quote: "We're going to move the entire music industry into the 21st Century.", mood: "creative", era: "donda" },
  { quote: "Style is genderless.", mood: "creative", era: "yeezus" },
  { quote: "Decentralize.", mood: "creative", era: "donda" },

  // Humorous (8)
  { quote: "I hate when I'm on a flight and I wake up with a water bottle next to me like oh great now I gotta be responsible for this water bottle.", mood: "humorous", era: "graduation" },
  { quote: "Fur pillows are hard to actually sleep on.", mood: "humorous", era: "graduation" },
  { quote: "I make awesome decisions in bike stores!!!", mood: "humorous", era: "graduation" },
  { quote: "I leave my emojis Bart Simpson color.", mood: "humorous", era: "graduation" },
  { quote: "I channel Will Ferrell when I'm at the daddy daughter dances.", mood: "humorous", era: "graduation" },
  { quote: "Sometimes I push the door close button on people running towards the elevator. I just need my own elevator sometimes. My sanctuary.", mood: "humorous", era: "donda" },
  { quote: "You basically can say anything to someone on an email or text as long as you put LOL at the end.", mood: "humorous", era: "graduation" },
  { quote: "I'm nice at ping pong.", mood: "humorous", era: "graduation" }
];

export const DESTINY_VERDICTS: DestinyVerdict[] = [
  { title: "ASCENDANT YE", subtitle: "Frequency 1000 — Untouchable Monolithic Energy" },
  { title: "GOD LEVEL", subtitle: "Maximum Distortion of Standard Human Limitations" },
  { title: "808 HEARTACHE MATRIX", subtitle: "Autotuned Sorrow Converted Into Pure Stadium Power" },
  { title: "YEEZY VISIONARY", subtitle: "Currently Operating 12 Years Ahead of the Culture" },
  { title: "MONOLITHIC DONDA", subtitle: "Matte Black Armor Against Lukewarm Frequencies" },
  { title: "TURBOGRAFX-16 UNLOCKED", subtitle: "Retro-Futuristic Creative Overflow" },
  { title: "COLLEGE DROPOUT PARADOX", subtitle: "Throw Away the Syllabus and Build an Empire" },
  { title: "STADIUM STATUS", subtitle: "Sovereign, Deafening, Unapologetic Greatness" }
];

export const YEEZY_ARTIFACTS: YeezyArtifact[] = [
  { name: "Diamond Grill", description: "Reflects divine truth into every room you enter.", iconName: "Sparkles" },
  { name: "Red Stem Player", description: "Splits reality into individual stems so you isolate what matters.", iconName: "Disc" },
  { name: "Shutter Shades", description: "Completely filters out peripheral doubt and lukewarm advice.", iconName: "Glasses" },
  { name: "Sunday Service Choir Robe", description: "Imbues your spirit with celestial harmony and armor.", iconName: "Shirt" },
  { name: "Foam Runner Proto 01", description: "Earthquake-resistant footwear engineered for extraterrestrial soil.", iconName: "Footprints" },
  { name: "Spiked Balenciaga Mask", description: "Grants supreme anonymity while commanding the room.", iconName: "Shield" },
  { name: "Silver Metallurgical Finish", description: "Replaces ordinary human emotion with timeless bronze/silver aura.", iconName: "Sun" },
  { name: "Vintage MPC 2000XL", description: "Chops your greatest failures into soul-stirring stadium anthems.", iconName: "Sliders" },
  { name: "Donda Bulletproof Vest", description: "Guards your heart against media slander and weak friends.", iconName: "ShieldCheck" },
  { name: "Titanium Cyber-Whistle", description: "Summons architects and choir vocalists at 4:15 AM.", iconName: "Bell" }
];

export const AURA_TITLES = [
  "God Complex", "Sovereign Visionary", "Untamed Frequency",
  "Stadium Resonance", "Melancholic Genius", "Pure Unfiltered Aura",
  "808 Hertz Transceiver", "Billionaire Prophet"
];

export const ACTIONABLE_COMMANDS = [
  "Delete every spreadsheet on your hard drive and compose a 9-minute orchestral outro.",
  "Order 1,000 pairs of foam runners immediately and refuse to explain why to anyone.",
  "Wear sunglasses inside the grocery store today. Maintain zero eye contact.",
  "Call your manager at 3:15 AM to inform them you are Steve Jobs reincarnated.",
  "Send a single-word email saying 'EXCELLENCE' and turn on airplane mode for 72 hours.",
  "Pull up to your next meeting on a motorized bicycle wearing an oversized designer hoodie.",
  "Redesign your living room furniture using only monolithic concrete slabs.",
  "Forgive your enemies, but sample their crying voice memo on your next masterpiece.",
  "Cut out all squares from your circle before sunset.",
  "Speak directly to the universe and demand your executive producer credit."
];

export const TOPIC_PATTERNS = {
  career: /\b(job|work|career|boss|promotion|quit|office|excel|corporate|startup|company|business|interview)\b/i,
  romance: /\b(love|ex|relationship|date|text|crush|boyfriend|girlfriend|marriage|heartbreak|divorce|lonely)\b/i,
  money: /\b(money|rich|buy|purchase|cost|dollar|expensive|invest|afford|shopping|luxury|wealth)\b/i,
  doubt: /\b(scared|fail|afraid|fear|doubt|anxious|anxiety|imposter|depressed|stress|hesitate|worried)\b/i,
  creative: /\b(art|music|design|create|write|album|book|painting|fashion|aesthetic|vision|idea)\b/i,
  ego: /\b(genius|greatest|best|special|legacy|famous|fame|respect|power|status)\b/i
};

export const ERA_TOKENS: Record<EraId, Record<string, string>> = {
  donda: {
    '--era-bg-primary': '#050505',
    '--era-bg-secondary': '#0d0d0d',
    '--era-bg-surface': '#121212',
    '--era-accent-primary': '#ffffff',
    '--era-accent-secondary': '#71717a',
    '--era-border': '#27272a',
    '--era-text-primary': '#f4f4f5',
    '--era-text-secondary': '#a1a1aa',
    '--era-radius': '0px'
  },
  graduation: {
    '--era-bg-primary': '#1e053a',
    '--era-bg-secondary': '#3b0764',
    '--era-bg-surface': '#581c87',
    '--era-accent-primary': '#ec4899',
    '--era-accent-secondary': '#fbbf24',
    '--era-border': '#ec4899',
    '--era-text-primary': '#ffffff',
    '--era-text-secondary': '#f3e8ff',
    '--era-radius': '24px'
  },
  '808s': {
    '--era-bg-primary': '#080d1a',
    '--era-bg-secondary': '#0f172a',
    '--era-bg-surface': '#1e293b',
    '--era-accent-primary': '#06b6d4',
    '--era-accent-secondary': '#f43f5e',
    '--era-border': '#06b6d4',
    '--era-text-primary': '#f8fafc',
    '--era-text-secondary': '#94a3b8',
    '--era-radius': '16px'
  },
  yeezus: {
    '--era-bg-primary': '#0a0a0c',
    '--era-bg-secondary': '#18181b',
    '--era-bg-surface': '#27272a',
    '--era-accent-primary': '#ef4444',
    '--era-accent-secondary': '#cbd5e1',
    '--era-border': '#ef4444',
    '--era-text-primary': '#ffffff',
    '--era-text-secondary': '#94a3b8',
    '--era-radius': '2px'
  }
};

export function computeDeterministicHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateKanyeFortune(
  quote: string,
  userQuestion: string = '',
  source: 'api' | 'offline_vault' = 'api',
  activeEra: EraId = 'donda'
): KanyeFortunePackage {
  const safeQuote = String(quote ?? '');
  const cleanQ = (userQuestion || '').trim();
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
    interpretation = `You are playing in an arena engineered by people with a fraction of your vibration. Ye reminds you that spreadsheets are the modern padded cell for creative gods. Stop begging for a seat at their table—commission a custom concrete monolith and broadcast your truth.`;
  } else if (TOPIC_PATTERNS.romance.test(cleanQ)) {
    interpretation = `The 808 kick in your chest is clipping the master channel for a reason. Looking back at an ex is like driving a Maybach at 140 MPH while staring solely at the rearview mirror. You don't need closure; you need stadium lighting and a 60-person gospel choir behind you.`;
  } else if (TOPIC_PATTERNS.money.test(cleanQ)) {
    interpretation = `Fiat currency is a temporary collective illusion invented by bankers who never harmonized an 8-bar loop. If this acquisition elevates your architectural aura and terrifies lukewarm thinkers, it is already funded by future timelines. Buy the vision, not the receipt.`;
  } else if (TOPIC_PATTERNS.doubt.test(cleanQ)) {
    interpretation = `Fear is merely your old persona choking as your next form ascends. Ye conquered shyness with flyness, and your hesitation is already overdue for liquidation. Turn the headphone monitors up to max gain and refuse to apologize for being loud.`;
  } else if (TOPIC_PATTERNS.creative.test(cleanQ)) {
    interpretation = `They will call you crazy until the prototype hits the runway—then they will call you a genius. Do not compromise your palette for people whose peak ambition is blending into wallpaper. Lock the studio doors and do not emerge until the frequency is undeniable.`;
  } else if (TOPIC_PATTERNS.ego.test(cleanQ)) {
    interpretation = `Humility was invented to keep titans from disrupting the comfortable mediocrity of the crowd. Ye knows that acknowledging your own divinity is simply honesty. Let them debate your character while you collect the culture's keys.`;
  } else if (cleanQ.length === 0) {
    interpretation = 'The cosmos confirms your current frequency is operating beyond standard human limitations. Do not apologize for the volume of your ambition; rip the knob off entirely and let the stadium monitors peak.';
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
    luckyNumbers: [n1, n2, n3]
  };
}

export async function fetchKanyeQuoteWithTimeout(
  timeoutMs = 3500,
  forcedOffline = false
): Promise<{ quote: string; source: 'api' | 'offline_vault'; mood?: QuoteMood }> {
  if (forcedOffline) {
    const fallback = KANYE_OFFLINE_VAULT[Math.floor(Math.random() * KANYE_OFFLINE_VAULT.length)];
    return { quote: fallback.quote, source: 'offline_vault', mood: fallback.mood };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch('https://api.kanye.rest/', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { quote: string };
    if (!data.quote || typeof data.quote !== 'string') throw new Error('Malformed quote');

    return { quote: data.quote.trim(), source: 'api' };
  } catch {
    clearTimeout(timer);
    const fallback = KANYE_OFFLINE_VAULT[Math.floor(Math.random() * KANYE_OFFLINE_VAULT.length)];
    return { quote: fallback.quote, source: 'offline_vault', mood: fallback.mood };
  }
}

export function formatClipboardShareText(fortune: KanyeFortunePackage): string {
  return [
    `"${fortune.quote}" — Kanye West`,
    '',
    `🔮 Oracle Verdict: ${fortune.destinyVerdict.title}`,
    `⚡ Ye's Command: ${fortune.actionableCommand}`,
    `✨ Aura: ${fortune.auraScore}% [${fortune.auraTitle.toUpperCase()}]`,
    `🏆 Artifact: ${fortune.luckyArtifact.name}`,
    '',
    'Draw your fortune: https://kanyefortune.com'
  ].join('\n');
}

function sanitizeSurrogates(str: string): string {
  if (typeof (str as unknown as { toWellFormed?: () => string }).toWellFormed === 'function') {
    return (str as unknown as { toWellFormed: () => string }).toWellFormed();
  }
  return str.replace(
    /([\uD800-\uDBFF](?![\uDC00-\uDFFF]))|((?<![\uD800-\uDBFF])[\uDC00-\uDFFF])/g,
    '\uFFFD'
  );
}

export function createTwitterShareUrl(fortune: KanyeFortunePackage): string {
  const rawText = `"${fortune.quote}" — Ye\n🔮 Verdict: ${fortune.destinyVerdict.title}\n⚡ Directive: ${fortune.actionableCommand}\n\nDraw your Kanye Fortune:`;
  const text = sanitizeSurrogates(rawText);
  const url = 'https://kanyefortune.com';
  const hashtags = 'KanyeWest,OracleOfYe,Yeezy';
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
}

export const SAW_TOOTH_SVG_PATH = "M0,12 L10,0 L20,12 L30,0 L40,12 L50,0 L60,12 L70,0 L80,12 L90,0 L100,12 L110,0 L120,12 L130,0 L140,12 L150,0 L160,12 L170,0 L180,12 L190,0 L200,12 L210,0 L220,12 L230,0 L240,12 L250,0 L260,12 L270,0 L280,12 L290,0 L300,12 L310,0 L320,12 L330,0 L340,12 L350,0 L360,12 L370,0 L380,12 L390,0 L400,12 Z";
