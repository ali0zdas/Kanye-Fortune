# E2E Test Infrastructure & Quality Architecture — Kanye Fortune (Oracle of Ye)

## 1. Executive Summary & Philosophy

The Kanye Fortune (Oracle of Ye) E2E test infrastructure provides an exhaustive, automated, opaque-box quality assurance framework. The entire suite executes headlessly in Node.js 22+ without external test framework bloat, delivering deterministic, sub-second execution, rich colorized console output, and 100% reproducible verification.

The testing architecture adheres to:
1. **Opaque-Box Derivation**: Tests validate specifications, interface contracts, DOM output, audio node parameters, and state transitions derived directly from `PROJECT.md`, `ORIGINAL_REQUEST.md`, and architectural survey reports without coupling to transient implementation trivia.
2. **Deterministic Independence**: Every test case initializes its own isolated execution context, simulated browser globals, virtual clock, network mocks, and audio contexts, eliminating shared-state pollution.
3. **Multi-Tier Defense-in-Depth**: A structured 4-tier testing pyramid ensuring feature-level correctness, boundary resilience, multi-dimensional combinatorial stability, and realistic end-to-end user journeys.

---

## 2. Formal Test Methodologies

### 2.1 Category-Partition Method
Each feature is decomposed into functional units, input domains, and environmental conditions:
- **Input Partitions**: Valid strings (short, medium, long), empty/whitespace strings, unicode/emoji strings, adversarial escape characters, and SQL/HTML injection attempts.
- **State Partitions**: Uninitialized, loading, loaded, card flipped/unflipped, view mode (tarot card vs. thermal receipt), audio mute/unmute, and era tokens (Donda, Graduation, 808s, Yeezus).
- **Environment Partitions**: Online API available, API 500 error, network timeout (>3.5s), offline (`navigator.onLine === false`), Web Audio suspended vs. running, and Web Speech supported vs. unsupported.

### 2.2 Boundary Value Analysis (BVA)
Tests probe exact operational boundaries:
- **Quote Lengths**: Minimal valid quote (4 characters: `"2024"`), typical quotes (40–100 characters), maximum quotes (210 characters), and oversized prompt text (1,000+ characters truncated to 200).
- **Timeout Thresholds**: Latency beneath 3.5s (API resolves) vs. latency exceeding 3.5s (AbortController aborts to offline vault).
- **Audio Frequencies**: 808 sub-bass pitch drop curve boundary points (160 Hz -> 46 Hz -> 34 Hz), vinyl bandpass center frequency (1400 Hz, Q 1.4), flip whoosh filter sweep (250 Hz -> 2800 Hz -> 320 Hz), and receipt stepper click blip (3200 Hz -> 800 Hz).
- **Aura Rating Range**: Validated within strict bounds $[85, 100]$ with valid integer/percentage calculation.
- **Image Export Dimensions**: Exact aspect ratio calculations for 1:1 Square (1080x1080) and 9:16 Instagram Story (1080x1920) with pixelRatio = 2.

### 2.3 Pairwise Interaction Testing (Combinatorial Coverage)
Ensures that any pair of interactive features functions cohesively:
- **Era $\times$ View Mode**: All 4 eras (Donda, Graduation, 808s, Yeezus) rendered in both Tarot Card mode and Thermal Receipt mode ($4 \times 2 = 8$ states).
- **Era Switch during In-Flight Flip**: Triggering an era change while card flip spring physics is mid-animation.
- **Thermal Receipt Mode across Eras**: Receipt serrated edge, carbon ink styling, and itemized metrics across all visual palettes.
- **Audio Synthesis $\times$ Speech TTS Concurrency**: Triggering procedural 808 sub-bass drops simultaneously with Web Speech voice synthesis without audio clipping or mutual cancellation.
- **Rapid Re-Drawing Under Stress**: Firing redraw requests in rapid succession (<50ms intervals) ensuring state locks and no race conditions.

### 2.4 Workload & User Journey Scenarios
Realistic multi-step end-to-end user journeys simulating authentic user workflows:
- Career dilemma consultation from initial question input to fortune reveal and Twitter sharing.
- Instant wisdom draw (pure serendipity without dilemma input).
- Full Yeezy Thermal Receipt audit and validation of itemized lines, ego tax, subtotal "PRICELESS", and barcode.
- Instagram Story high-res PNG export pipeline with DOM rasterization gating.
- Power navigation via keyboard-only shortcuts (`Space`, `1-4`, `M`, `F`).

---

## 3. Four-Tier Test Suite Architecture

```
                                    ┌────────────────────────┐
                                    │        Tier 4          │
                                    │ Real-World Scenarios   │
                                    │      (>=14 tests)      │
                                    ├────────────────────────┴────────┐
                                    │             Tier 3              │
                                    │    Cross-Feature Combinations   │
                                    │           (>=28 tests)          │
                                    ├─────────────────────────────────┴────────┐
                                    │                 Tier 2                   │
                                    │       Boundary & Corner Cases            │
                                    │              (>=140 tests)               │
                                    ├──────────────────────────────────────────┴────────┐
                                    │                     Tier 1                        │
                                    │            Feature Coverage (28x5)                │
                                    │                 (>=140 tests)                     │
                                    └───────────────────────────────────────────────────┘
```

### 3.1 Tier 1: Feature Coverage (>= 140 Tests)
Covers all 28 features defined in `PROJECT.md § Feature Inventory` with a minimum of 5 rigorous test cases each:
1. **Greenfield Scaffolding**: Vite, React 19, TS config, package.json integrity, dependencies.
2. **CSS Variable Era Tokens**: CSS variable injection for Donda, Graduation, 808s, Yeezus.
3. **Responsive App Shell**: Container layout, header elements, main stage, footer, error boundaries.
4. **api.kanye.rest Integration**: API client, fetch handling, 3.5s timeout, response parsing, JSON schema.
5. **Curated 42-Quote Offline Vault**: 42 entries, 5 mood categories, 4 era tags, random offline selector.
6. **Hybrid Question Input**: Text dilemma submission, empty string instant wisdom draw, placeholder text.
7. **Destiny Verdict Heuristics**: 8 archetypal verdicts, title/subtitle mapping, deterministic hashing.
8. **Oracle Interpretation Synthesis**: Category matching (career, romance, money, doubt, creative, ego), 2-3 sentence output.
9. **Actionable Ye Command**: 10 high-energy directive matrix, non-empty, actionable sentence structure.
10. **Aura Score & Yeezy Artifact**: Aura 85-100%, 8 aura titles, 10 Yeezy artifacts, 3 lucky numbers.
11. **Procedural 808 Sub-bass**: Sine wave oscillator, 160Hz -> 36Hz exponential drop, gain envelope, cleanup.
12. **Procedural Vinyl Crackle**: White noise buffer, 1400Hz bandpass filter, Q=1.4, random click impulses.
13. **Card Flip Whoosh Sound**: Noise buffer, sweeping lowpass 250Hz -> 2800Hz -> 320Hz, polyphonic play.
14. **Thermal Receipt Click Sound**: Triangle oscillator, 3200Hz -> 800Hz pitch blip, mechanical feel.
15. **Audio Context Autoplay Manager**: Singleton context, mute toggle, localStorage persistence, gesture unlock.
16. **Extensible Micro-TTS Hook**: WebSpeechProvider adapter, pitch 0.82, rate 0.94, voice resolution, stop/toggle.
17. **4 Era Switcher Component**: 4 era buttons, active pill highlight, data-era attribute mutation, persistence.
18. **3D Oracle Tarot Card View**: 3D transform style preserve-3d, rotateY 180deg flip, perspective 1200px, spring physics.
19. **Era-Themed Card Backs**: Donda cross, Graduation bear, 808s broken heart, Yeezus CD seal.
20. **Yeezy Thermal Receipt View**: Monospace font, store header, trans number, cashier YE, itemized list, barcode.
21. **SVG Saw-tooth Perforated Edge**: 400x12 viewBox, 40-tooth zig-zag path, top & bottom margin offsets.
22. **Thermal Printer Slide Animation**: Framer Motion height/opacity reveal transition, mechanical timing.
23. **High-Res PNG Image Exporter**: 1:1 and 9:16 export container, pixelRatio 2, font-ready gating.
24. **1-Click Clipboard Copy**: Formatted quote text, verdict, command, aura, clipboard write, toast alert.
25. **Share to X (Twitter)**: Twitter intent URL construction, hashtags, encoded query parameters, window open.
26. **Keyboard Shortcuts**: Space (draw), 1-4 (era switch), M (mute toggle), F (card flip).
27. **E2E Test Suite Runner**: Harness runner, lifecycle hooks, assertion reporting, exit codes.
28. **Adversarial Hardening**: Robustness against invalid inputs, prototype pollution, unexpected nulls.

### 3.2 Tier 2: Boundary & Corner Cases (>= 140 Tests)
Covers >= 5 boundary/corner conditions per feature:
- Empty inputs, whitespace-only queries, 1000+ character spam strings.
- Network outages (`TypeError: Failed to fetch`), HTTP 500, HTTP 404, HTTP 429 rate limit.
- AbortController timeout exactly at 3500ms.
- Explicit profanity filtering and sanitization.
- AudioContext autoplay restriction in `'suspended'` state and subsequent gesture unlock.
- Extreme rapid click spamming (audio nodes concurrency, draw debouncing).
- Missing browser SpeechSynthesis API graceful fallback.
- Special characters, unicode, RTL strings, and HTML markup in dilemma inputs.
- Web font loading latency during image export.
- Viewport boundary testing (mobile vs. desktop sizing).

### 3.3 Tier 3: Cross-Feature Combinations (>= 28 Tests)
Evaluates pairwise feature interaction matrices:
- Era switching while 3D card flip animation is mid-progress.
- Switching between 3D Tarot Card and Thermal Receipt modes across all 4 eras.
- Simultaneous Web Audio 808 bass boom + Web Speech TTS playback.
- Redrawing fortune while TTS speech synthesis is actively speaking.
- Copying to clipboard and exporting PNG concurrently.
- Rapid era hotkey cycling (`1` -> `2` -> `3` -> `4`) with continuous sound feedback.
- Offline network disconnect while in receipt view followed by immediate redraw.

### 3.4 Tier 4: Real-World Application Scenarios (>= 14 Tests)
Validates complete user journeys from entry to exit:
1. **The Career Dilemma**: User asks about quitting job, draws fortune, flips card, listens to TTS, copies quote.
2. **Pure Serendipity**: User leaves prompt blank, clicks instant fortune, reads cosmic advice, shares to X.
3. **The Melancholic 808s Night**: User selects 808s era, asks about heartbreak, un-mutes sound, experiences 808 boom.
4. **Brutalist Receipt Collector**: User switches to Receipt mode, inspects itemized Yeezy lines, barcode, and ego tax.
5. **Instagram Story Creator**: User draws fortune in Graduation era, opens export modal, renders 9:16 story PNG.
6. **Keyboard Power User**: User navigates site entirely via `Space`, `1-4`, `M`, and `F` keys without mouse clicks.
7. **Offline Airplane Mode**: User goes offline, draws fortune from 42-quote vault, switches eras, exports receipt.
8. **Maximalist Yeezus Industrial Session**: User enters Yeezus era, enters intense dilemma, tests glitch aesthetic.
9. **Soundtrack Master**: User plays all 4 procedural sound effects in sequence (808, vinyl, whoosh, click).
10. **Viral Tweet Workflow**: User draws fortune, clicks Share to X, verifies encoded tweet parameters.
11. **Donda Monolith Meditation**: User enters Donda era, enters existential dilemma, validates monolithic card back.
12. **Double Flip & Redraw Loop**: User draws, flips, flips back, redraws, and verifies clean state reset.
13. **Corrupted Storage Recovery**: User has malformed localStorage data; app gracefully resets and functions.
14. **Mobile Responsive Touch Flow**: User interacts on simulated mobile viewport, ensuring responsive layouts.

---

## 4. Test Runner Architecture (`e2e/harness/`)

The test harness is built as a zero-dependency, self-contained TypeScript/ESM framework executing in Node.js 22+:

```
e2e/
├── harness/
│   ├── run_e2e.js             # Main CLI execution entrypoint
│   ├── runner.ts              # Suite builder, lifecycle hooks, and CLI reporter
│   ├── assertions.ts          # Expect matcher library with detailed diffs
│   └── browserMock.ts         # Headless DOM, Web Audio, Web Speech, & Network mocks
├── tier1_feature_coverage.spec.ts  # Tier 1 tests (>=140 tests)
├── tier2_boundary_corner.spec.ts   # Tier 2 tests (>=140 tests)
├── tier3_pairwise.spec.ts          # Tier 3 tests (>=28 tests)
└── tier4_real_world.spec.ts        # Tier 4 tests (>=14 tests)
```

### 4.1 Mocking & Headless Virtualization (`browserMock.ts`)
- **Simulated DOM**: Lightweight DOM node hierarchy (`HTMLElement`, `SVGElement`, `DOMParser`, `classList`, `style`, `dataset`).
- **Web Audio Virtualizer**: Tracks audio graph creation, node connections, oscillator types, frequency automation curves (`setValueAtTime`, `exponentialRampToValueAtTime`), and gain nodes without requiring physical audio hardware.
- **Speech Synthesis Virtualizer**: Mocks `window.speechSynthesis` and `SpeechSynthesisUtterance`, recording speech events, pitch, rate, and cancellation.
- **Storage Virtualizer**: In-memory `localStorage` implementation with standard API.
- **Clipboard Virtualizer**: `navigator.clipboard.writeText` capturing copied text buffers.
- **Network Virtualizer**: Configurable `fetch` interceptor supporting simulated live responses, offline connection failures, HTTP error codes, and abort timing.

---

## 5. Execution Instructions & CLI Interface

### 5.1 Standard Execution
Run the complete test suite:
```bash
npm test
```
or directly:
```bash
node e2e/harness/run_e2e.js
```

### 5.2 Filter Options
Run a specific tier:
```bash
node e2e/harness/run_e2e.js --tier=1
node e2e/harness/run_e2e.js --tier=2
node e2e/harness/run_e2e.js --tier=3
node e2e/harness/run_e2e.js --tier=4
```

Filter tests by name or feature regex:
```bash
node e2e/harness/run_e2e.js --filter="808"
node e2e/harness/run_e2e.js --filter="Receipt"
```

Verbose mode (prints assertion-level details):
```bash
node e2e/harness/run_e2e.js --verbose
```

---

## 6. Pass/Fail Gates & CI Integration

The test runner returns:
- **Exit Code 0**: All tests passed, zero assertion errors, zero unhandled rejections.
- **Exit Code 1**: One or more tests failed, assertion mismatched, or unhandled exception thrown.

This exit code cleanly gates continuous integration pipelines, preventing regressions from merging into production.
