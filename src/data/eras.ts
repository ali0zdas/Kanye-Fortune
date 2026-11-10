import { EraId } from '../types/fortune';

export interface EraColors {
  bg: string;
  surface: string;
  accent: string;
  secondary: string;
  border: string;
  glow: string;
}

export interface EraConfig {
  id: EraId;
  name: string;
  year: string;
  subtitle: string;
  description: string;
  colors: EraColors;
  promptMessage: string;
  runes: string;
  fontVibe: string;
  badgeLabel: string;
}

export const ERAS: EraConfig[] = [
  {
    id: 'donda',
    name: 'Donda',
    year: '2021',
    subtitle: 'Brutalist Monolith & Void',
    description: 'Pitch black void, monolithic Latin cross runes, ultra-minimalist utilitarian transcendence.',
    colors: {
      bg: '#050505',
      surface: '#121212',
      accent: '#ffffff',
      secondary: '#71717a',
      border: '#27272a',
      glow: 'rgba(255, 255, 255, 0.08)',
    },
    promptMessage: 'TOUCH TO ENTER THE VOID',
    runes: '24 SONGS • PRAISE GOD • HEAVEN AND HELL • OFF THE GRID',
    fontVibe: 'Monolithic Utilitarian',
    badgeLabel: 'DONDA ARCANA 2021',
  },
  {
    id: 'graduation',
    name: 'Graduation',
    year: '2007',
    subtitle: 'Murakami Pop Art & Cosmic Anime',
    description: 'Vibrant indigos, neon hot pinks, gold constellations, and iconic Dropout Bear graduation glory.',
    colors: {
      bg: '#1a052e',
      surface: '#4c1d95',
      accent: '#ec4899',
      secondary: '#fbbf24',
      border: '#ec4899',
      glow: 'rgba(236, 72, 153, 0.45)',
    },
    promptMessage: 'FLIP TO GRADUATE',
    runes: 'STRONGER • FLASHING LIGHTS • GOOD LIFE • CAN’T TELL ME NOTHING',
    fontVibe: 'Playful Cosmic Pop',
    badgeLabel: 'GRADUATION ARCANA 2007',
  },
  {
    id: '808s',
    name: '808s & Heartbreak',
    year: '2008',
    subtitle: 'Cold Melancholy & Neon Synthwave',
    description: 'Sterile slate textures, Roland TR-808 rhythm steps, and dual neon cyan-crimson pulses.',
    colors: {
      bg: '#080d1a',
      surface: '#1e293b',
      accent: '#06b6d4',
      secondary: '#f43f5e',
      border: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.35)',
    },
    promptMessage: 'UNLOCK HEARTBREAK FREQUENCY',
    runes: 'HEARTLESS • LOVE LOCKDOWN • PARANOID • COLDER THAN WINTER',
    fontVibe: 'Cold Studio Precision',
    badgeLabel: '808s ARCANA 2008',
  },
  {
    id: 'yeezus',
    name: 'Yeezus',
    year: '2013',
    subtitle: 'Industrial Warehouse & Acid Glitch',
    description: 'Unmastered raw audio, CD jewel case reflection, hazard red gaffer tape, and distorted sonic rebellion.',
    colors: {
      bg: '#0a0a0c',
      surface: '#27272a',
      accent: '#ef4444',
      secondary: '#cbd5e1',
      border: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.35)',
    },
    promptMessage: 'BREAK THE RED SEAL',
    runes: 'BLACK SKINHEAD • NEW SLAVES • BLOOD ON THE LEAVES • BOUND 2',
    fontVibe: 'Acid Industrial Raw',
    badgeLabel: 'YEEZUS ARCANA 2013',
  },
];

export const ERA_MAP: Record<EraId, EraConfig> = ERAS.reduce(
  (acc, era) => {
    acc[era.id] = era;
    return acc;
  },
  {} as Record<EraId, EraConfig>
);

export function getEraConfig(eraId: EraId): EraConfig {
  return ERA_MAP[eraId] || ERA_MAP['donda'];
}
