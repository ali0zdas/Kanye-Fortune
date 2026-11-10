import { EraId, QuoteMood } from '../types/fortune';

export interface KanyeQuoteItem {
  quote: string;
  mood: QuoteMood;
  era: EraId;
}

/**
 * Curated 42-Quote Offline Vault
 * Carefully categorized across 5 moods (philosophical, boastful, introspective, creative, humorous)
 * and 4 iconic Kanye eras (donda, graduation, 808s, yeezus) ensuring 100% offline uptime.
 */
export const KANYE_OFFLINE_VAULT: KanyeQuoteItem[] = [
  // --- 1. Philosophical (9 quotes) ---
  {
    quote: 'Everything you do in life stems from either fear or love.',
    mood: 'philosophical',
    era: 'donda',
  },
  {
    quote: 'Distraction is the enemy of vision.',
    mood: 'philosophical',
    era: 'donda',
  },
  {
    quote: 'My memories are from the future.',
    mood: 'philosophical',
    era: 'graduation',
  },
  {
    quote: "We came into a broken world. And we're the cleanup crew.",
    mood: 'philosophical',
    era: 'donda',
  },
  {
    quote: "You can't look at a glass half full or empty if it's overflowing.",
    mood: 'philosophical',
    era: 'graduation',
  },
  {
    quote: "Let's be like water.",
    mood: 'philosophical',
    era: 'donda',
  },
  {
    quote: 'Believe in your flyness... conquer your shyness.',
    mood: 'philosophical',
    era: 'graduation',
  },
  {
    quote: "Truth is my goal. Controversy is my gym. I'll do a hundred reps of controversy for a 6 pack of truth.",
    mood: 'philosophical',
    era: 'yeezus',
  },
  {
    quote: 'For me, money is not my definition of success. Inspiring people is a definition of success.',
    mood: 'philosophical',
    era: 'graduation',
  },

  // --- 2. Boastful (9 quotes) ---
  {
    quote: 'I still think I am the greatest.',
    mood: 'boastful',
    era: 'yeezus',
  },
  {
    quote: 'I am Warhol. I am the No. 1 most impactful artist of our generation. I am Shakespeare in the flesh.',
    mood: 'boastful',
    era: 'yeezus',
  },
  {
    quote: "For me to say I wasn't a genius I'd just be lying to you and to myself.",
    mood: 'boastful',
    era: 'yeezus',
  },
  {
    quote: "I feel like I'm too busy writing history to read it.",
    mood: 'boastful',
    era: 'graduation',
  },
  {
    quote: "My greatest award is what I'm about to do.",
    mood: 'boastful',
    era: 'graduation',
  },
  {
    quote: 'If I got any cooler I would freeze to death.',
    mood: 'boastful',
    era: 'graduation',
  },
  {
    quote: "I'm on the pursuit of awesomeness, excellence is the bare minimum.",
    mood: 'boastful',
    era: 'graduation',
  },
  {
    quote: 'Winning is the only option.',
    mood: 'boastful',
    era: 'yeezus',
  },
  {
    quote: 'I am the head of Adidas. I will bring Adidas and Puma back together and bring me and Jay back together.',
    mood: 'boastful',
    era: 'donda',
  },

  // --- 3. Introspective (8 quotes) ---
  {
    quote: "We all self-conscious. I'm just the first to admit it.",
    mood: 'introspective',
    era: '808s',
  },
  {
    quote: "I don't expect to be understood at all.",
    mood: 'introspective',
    era: '808s',
  },
  {
    quote: 'My greatest pain in life is that I will never be able to see myself perform live.',
    mood: 'introspective',
    era: '808s',
  },
  {
    quote: "There's so many lonely emojis man.",
    mood: 'introspective',
    era: '808s',
  },
  {
    quote: 'I care. I care about everything. Sometimes not giving a f#%k is caring the most.',
    mood: 'introspective',
    era: '808s',
  },
  {
    quote: 'People only get jealous when they care.',
    mood: 'introspective',
    era: '808s',
  },
  {
    quote: 'Sometimes you have to get rid of everything.',
    mood: 'introspective',
    era: 'donda',
  },
  {
    quote: 'We laugh to keep from crying.',
    mood: 'introspective',
    era: '808s',
  },

  // --- 4. Creative (8 quotes) ---
  {
    quote: "I'm a creative genius.",
    mood: 'creative',
    era: 'yeezus',
  },
  {
    quote: 'Burn that excel spread sheet.',
    mood: 'creative',
    era: 'yeezus',
  },
  {
    quote: 'Artists are founders.',
    mood: 'creative',
    era: 'donda',
  },
  {
    quote: 'I think I do myself a disservice by comparing myself to Steve Jobs and Walt Disney. It should be more like Willy Wonka... and welcome to my chocolate factory.',
    mood: 'creative',
    era: 'graduation',
  },
  {
    quote: 'We will change the paradigm.',
    mood: 'creative',
    era: 'donda',
  },
  {
    quote: "We're going to move the entire music industry into the 21st Century.",
    mood: 'creative',
    era: 'donda',
  },
  {
    quote: 'Style is genderless.',
    mood: 'creative',
    era: 'yeezus',
  },
  {
    quote: 'Decentralize.',
    mood: 'creative',
    era: 'donda',
  },

  // --- 5. Humorous (8 quotes) ---
  {
    quote: "I hate when I'm on a flight and I wake up with a water bottle next to me like oh great now I gotta be responsible for this water bottle.",
    mood: 'humorous',
    era: 'graduation',
  },
  {
    quote: 'Fur pillows are hard to actually sleep on.',
    mood: 'humorous',
    era: 'graduation',
  },
  {
    quote: 'I make awesome decisions in bike stores!!!',
    mood: 'humorous',
    era: 'graduation',
  },
  {
    quote: 'I leave my emojis Bart Simpson color.',
    mood: 'humorous',
    era: 'graduation',
  },
  {
    quote: 'I channel Will Ferrell when I\'m at the daddy daughter dances.',
    mood: 'humorous',
    era: 'graduation',
  },
  {
    quote: 'Sometimes I push the door close button on people running towards the elevator. I just need my own elevator sometimes. My sanctuary.',
    mood: 'humorous',
    era: 'donda',
  },
  {
    quote: 'You basically can say anything to someone on an email or text as long as you put LOL at the end.',
    mood: 'humorous',
    era: 'graduation',
  },
  {
    quote: "I'm nice at ping pong.",
    mood: 'humorous',
    era: 'graduation',
  },
];

/**
 * Returns a random quote from the offline vault, optionally filtered by mood.
 * If the filtered mood produces no quotes, safely falls back to the full vault.
 */
export function getRandomOfflineQuote(mood?: QuoteMood): KanyeQuoteItem {
  const filtered = mood ? KANYE_OFFLINE_VAULT.filter((q) => q.mood === mood) : KANYE_OFFLINE_VAULT;
  const pool = filtered.length > 0 ? filtered : KANYE_OFFLINE_VAULT;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

/**
 * Returns all quotes from the vault matching a specific era.
 */
export function getQuotesByEra(era: EraId): KanyeQuoteItem[] {
  return KANYE_OFFLINE_VAULT.filter((q) => q.era === era);
}

/**
 * Returns all quotes from the vault matching a specific mood.
 */
export function getQuotesByMood(mood: QuoteMood): KanyeQuoteItem[] {
  return KANYE_OFFLINE_VAULT.filter((q) => q.mood === mood);
}
