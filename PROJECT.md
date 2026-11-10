# Project: Kanye Fortune (Oracle of Ye)

## Architecture
Kanye Fortune is a modern, responsive, high-aesthetic interactive web application delivering Kanye West fortune-telling experiences with dynamic era styling, procedural Web Audio synthesis, interactive 3D physics, brutalist receipt generation, and high-DPI social media export.

```
                      ┌──────────────────────────────────────────────┐
                      │              Browser Viewport                │
                      │  (Responsive Shell, Audio Context, Era Root) │
                      └──────────────────────┬───────────────────────┘
                                             │
                      ┌──────────────────────┴───────────────────────┐
                      │                  Header                      │
                      │  Era Switcher | Mode Toggle | Sound Toggle   │
                      └──────────────────────┬───────────────────────┘
                                             │
                      ┌──────────────────────┴───────────────────────┐
                      │                 PromptBox                    │
                      │   Dilemma Input | Draw Kanye Fortune CTA     │
                      └──────────────────────┬───────────────────────┘
                                             │
                     ┌───────────────────────┴───────────────────────┐
                     │           Main Stage (Dual Mode)              │
                     │  ┌──────────────────────┬──────────────────┐  │
                     │  │ 3D Tarot Card Flip   │  Thermal Receipt │  │
                     │  │ (Framer Motion 3D)   │  (Saw-tooth SVG) │  │
                     │  └──────────────────────┴──────────────────┘  │
                     └───────────────────────┬───────────────────────┘
                                             │
                     ┌───────────────────────┴───────────────────────┐
                     │                 Action Bar                    │
                     │ Re-draw | Flip | Speak TTS | Export | Share X │
                     └───────────────────────┬───────────────────────┘
                                             │
           ┌─────────────────────────────────┼─────────────────────────────────┐
           ▼                                 ▼                                 ▼
┌─────────────────────┐           ┌─────────────────────┐           ┌─────────────────────┐
│    Oracle Engine    │           │   Audio Synthesizer │           │ Social Share Export │
│  API Fetch + Vault  │           │   808 Sub-Bass      │           │ html-to-image 1:1   │
│  Dilemma Matcher    │           │   Vinyl Crackle     │           │ html-to-image 9:16  │
│  Aura & Command     │           │   TTS Web Speech    │           │ X Intent + Copy     │
└─────────────────────┘           └─────────────────────┘           └─────────────────────┘
```

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Greenfield Scaffolding | Vite 8 + React 19 + TypeScript + Tailwind CSS v4 setup | M1 | survey_1 |
| 2 | CSS Variable Era Tokens | CSS custom properties for 4 eras (`data-era="donda\|graduation\|808s\|yeezus"`) | M1 | survey_3 |
| 3 | Responsive App Shell | Core layout container, sticky header, main stage, footer, error boundary | M1 | survey_1/3 |
| 4 | api.kanye.rest Integration | Client fetching `https://api.kanye.rest/` with AbortController timeout (3.5s) | M2 | spec_miner_2 |
| 5 | Curated 42-Quote Offline Vault | Built-in offline vault categorized across 5 moods and 4 eras for 100% offline uptime | M2 | spec_miner_2 |
| 6 | Hybrid Question Input | User can enter dilemma/question or click for instant destiny wisdom | M2 | ORIGINAL_REQUEST |
| 7 | Destiny Verdict Heuristics | 8 archetypal verdicts ("ASCENDANT YE", "GOD LEVEL", "STADIUM STATUS", etc.) | M2 | spec_miner_2 |
| 8 | Oracle Interpretation Synthesis | 2-3 sentences of prophetic, humorous, yet authentic Ye wisdom mapped to question | M2 | spec_miner_2 |
| 9 | Actionable Ye Command | High-energy tweet-style directives ("Order 1000 pairs of foam runners immediately") | M2 | spec_miner_2 |
| 10 | Aura Score & Yeezy Artifact | Aura rating (85-100%), title, and iconic Yeezy artifact (Stem Player, Red Octobers) | M2 | spec_miner_2 |
| 11 | Procedural 808 Sub-bass | Web Audio sine oscillator with exponential pitch drop (160Hz -> 36Hz) & gain envelope | M3 | spec_miner_2 |
| 12 | Procedural Vinyl Crackle | Bandpass-filtered white noise buffer (1400Hz) with random micro-clicks | M3 | spec_miner_2 |
| 13 | Card Flip Whoosh Sound | Sweeping lowpass filter noise burst (250Hz -> 2800Hz -> 320Hz) on card flip | M3 | spec_miner_2 |
| 14 | Thermal Receipt Click Sound | Triangle blip oscillator (3200Hz -> 800Hz) emulating mechanical printer advancement | M3 | spec_miner_2 |
| 15 | Audio Context Autoplay Manager | Singleton state handling mute/unmute, localStorage persistence, and user gesture unlock | M3 | spec_miner_2 |
| 16 | Extensible Micro-TTS Hook | `useKanyeTTS` hook with tuned Web Speech API (pitch 0.82, rate 0.94) + provider adapter | M3 | spec_miner_2 |
| 17 | 4 Era Switcher Component | Dynamic switching between Donda, Graduation, 808s & Heartbreak, and Yeezus | M4 | ORIGINAL_REQUEST |
| 18 | 3D Oracle Tarot Card View | Framer Motion 3D card rotation (`rotateY: 180deg`), mouse-tilt spring physics | M4 | survey_3 |
| 19 | Era-Themed Card Backs | Distinct occult emblems: Donda monolith, Graduation bear, 808s broken heart, Yeezus CD | M4 | survey_3 |
| 20 | Yeezy Thermal Receipt View | Monospace brutalist ticket slip, itemized destiny lines, date/register, subtotal "PRICELESS" | M4 | survey_3 |
| 21 | SVG Saw-tooth Perforated Edge | Crisp vector saw-tooth top & bottom tear edges for thermal receipt | M4 | survey_3 |
| 22 | Thermal Printer Slide Animation | Framer Motion height/opacity reveal simulating live receipt printing | M4 | survey_3 |
| 23 | High-Res PNG Image Exporter | `html-to-image` export for 1:1 Square (1080x1080) and 9:16 Instagram Story (1080x1920) | M5 | survey_3 |
| 24 | 1-Click Clipboard Copy | Formatted quote, verdict, command, and aura copied with toast feedback | M5 | survey_3 |
| 25 | Share to X (Twitter) | Pre-populated Twitter Web Intent URL with hashtags and quote excerpt | M5 | survey_3 |
| 26 | Keyboard Shortcuts | [Space] to draw, [1-4] for era switching, [M] to toggle sound, [F] to flip card | M5 | survey_3 |
| 27 | E2E Test Suite (Tiers 1-4) | Comprehensive opaque-box test suite verifying all features, boundary cases, interactions | M6 | PROJECT_PATTERN |
| 28 | Adversarial Coverage Hardening | Tier 5 white-box challenger stress tests & forensic integrity audit | M6 | PROJECT_PATTERN |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Foundation & Era Design System | Greenfield scaffolding (Vite, React 19, TS, Tailwind v4), era CSS variables, App Shell | none | DONE |
| M2 | Oracle Engine & Quote Vault | api.kanye.rest fetcher, 42-quote offline vault, deterministic oracle interpretation & advice generator | M1 | DONE |
| M3 | Web Audio & Micro-TTS Synthesis | Zero-asset Web Audio procedural synth (808, vinyl, whoosh, click), AudioContext manager, `useKanyeTTS` hook | M1 | DONE |
| M4 | 3D Tarot Card & Thermal Receipt Stage | 3D flip card with mouse tilt & era backs, Yeezy thermal receipt with SVG saw-tooth edge, EraSwitcher, PromptBox | M1, M2, M3 | DONE |
| M5 | Social Export & Polish | `html-to-image` 1:1 and 9:16 export modal, 1-click clipboard copy, X share, keyboard shortcuts, confetti | M4 | DONE |
| M6 | Final Acceptance & Adversarial Hardening | Phase 1: 100% E2E test pass (Tiers 1-4). Phase 2: Tier 5 adversarial stress testing + Forensic Audit | M1, M2, M3, M4, M5 | IN_PROGRESS |

---

## Interface Contracts

### M1 ↔ M2, M3, M4, M5 (Types & Design Tokens)
```ts
// src/types/fortune.ts
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
```

### M2 ↔ M4 (Oracle Engine Hook)
```ts
// src/hooks/useKanyeFortune.ts
export interface UseKanyeFortuneReturn {
  fortune: KanyeFortunePackage | null;
  isLoading: boolean;
  isFlipped: boolean;
  activeEra: EraId;
  viewMode: ViewMode;
  userQuestion: string;
  setUserQuestion: (q: string) => void;
  setActiveEra: (era: EraId) => void;
  setViewMode: (mode: ViewMode) => void;
  drawFortune: (question?: string) => Promise<KanyeFortunePackage>;
  flipCard: () => void;
}
```

### M3 ↔ M4, M5 (Audio & TTS Engine)
```ts
// src/types/audio.ts
export interface SoundSynthesizer {
  initContext(): AudioContext | null;
  toggleMute(): boolean;
  getMuted(): boolean;
  playSubBass808(): void;
  playVinylCrackle(durationSec?: number): void;
  playCardFlipWhoosh(): void;
  playReceiptClick(): void;
}

// src/types/tts.ts
export interface TTSProvider {
  readonly id: string;
  readonly name: string;
  speak(text: string, onEnd?: () => void, onError?: (err: Error) => void): Promise<void> | void;
  stop(): void;
  isSupported(): boolean;
}

export interface UseKanyeTTSReturn {
  isPlaying: boolean;
  isSupported: boolean;
  error: string | null;
  speak: (text: string) => void;
  stop: () => void;
  toggle: (text: string) => void;
  providerName: string;
}
```

### M5 ↔ M4 (Export Pipeline)
```ts
// src/hooks/useExportImage.ts
export type ExportFormat = 'square' | 'story'; // 'square' = 1:1 (1080x1080), 'story' = 9:16 (1080x1920)

export interface UseExportImageReturn {
  isExporting: boolean;
  exportImage: (elementRef: HTMLElement | null, format: ExportFormat, era: EraId) => Promise<string | null>;
  copyQuoteToClipboard: (fortune: KanyeFortunePackage) => Promise<boolean>;
  shareToTwitter: (fortune: KanyeFortunePackage) => void;
}
```

---

## Code Layout
```
g:\Github\Kanye Fortune\
├── index.html                           # Root HTML with title, meta tags, font preloads
├── package.json                         # Dependencies & npm scripts
├── tsconfig.json                        # Project references configuration
├── tsconfig.app.json                    # Client TypeScript options
├── tsconfig.node.json                   # Node/Vite TypeScript options
├── vite.config.ts                       # Vite + React + Tailwind v4 plugin configuration
├── public/
│   ├── favicon.svg                      # Custom Kanye Fortune icon
│   └── og-image.svg                     # Social card preview image
├── e2e/                                 # E2E test suites (Tiers 1-4)
│   ├── harness/                         # Test runner & headless validation harness
│   ├── tier1_feature_coverage.spec.ts   # Tier 1 tests (>=5 per feature)
│   ├── tier2_boundary_corner.spec.ts    # Tier 2 boundary tests
│   ├── tier3_pairwise.spec.ts           # Tier 3 cross-feature combinations
│   └── tier4_real_world.spec.ts         # Tier 4 real-world user scenarios
└── src/
    ├── main.tsx                         # React entrypoint
    ├── App.tsx                          # App root orchestration
    ├── index.css                        # Tailwind v4 @import & CSS variable era tokens
    ├── types/
    │   ├── fortune.ts                   # Fortune data model, EraId, ViewMode
    │   ├── audio.ts                     # Audio synthesizer interfaces
    │   └── tts.ts                       # Pluggable TTS provider interfaces
    ├── data/
    │   ├── eras.ts                      # Era descriptions, visual tokens, back emblems
    │   └── kanyeQuotesVault.ts          # Curated 42-quote categorized offline database
    ├── services/
    │   ├── kanyeApi.ts                  # Fetch client with 3.5s timeout & vault fallback
    │   ├── oracleEngine.ts              # Deterministic fortune & advice generator
    │   ├── audioSynthesizer.ts          # Web Audio procedural synthesis (808, vinyl, etc.)
    │   └── tts/
    │       ├── WebSpeechProvider.ts     # Tuned browser SpeechSynthesis
    │       └── RemoteTTSProvider.ts     # Extensible cloud micro-TTS interface
    ├── hooks/
    │   ├── useKanyeFortune.ts           # Fortune state & draw handler
    │   ├── useYeAudio.ts                # Audio trigger integration hook
    │   ├── useKanyeTTS.ts               # Voice playback hook
    │   └── useExportImage.ts            # html-to-image PNG exporter & sharing
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx               # Logo, EraSwitcher, ModeToggle, SoundToggle
    │   │   └── Footer.tsx               # Attribution, keyboard shortcut drawer, credits
    │   ├── era/
    │   │   └── EraSwitcher.tsx          # 4-era pill selector with active indicators
    │   ├── fortune/
    │   │   ├── PromptBox.tsx            # Dilemma input + "Consult the Oracle" button
    │   │   ├── ModeToggle.tsx           # Switch between 3D Tarot Card and Thermal Receipt
    │   │   ├── OracleCard.tsx           # 3D Framer Motion interactive flip card
    │   │   ├── ThermalReceipt.tsx       # Brutalist receipt with SVG saw-tooth edge
    │   │   └── ActionToolbar.tsx        # Redraw, Flip, Voice TTS, Save PNG, Copy, Post X
    │   ├── export/
    │   │   ├── ExportModal.tsx          # Export preview (1:1 vs 9:16) & download trigger
    │   │   └── DedicatedExportCard.tsx  # Off-screen crisp high-DPI export canvas
    │   └── ui/
    │       ├── Toast.tsx                # Action feedback alerts
    │       └── SerratedEdge.tsx         # SVG saw-tooth jagged edge component
    └── utils/
        └── shareHelpers.ts              # Clipboard formatting & Twitter web intent URL
```
