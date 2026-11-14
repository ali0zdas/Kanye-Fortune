<p align="center">
  <img src="./assets/readme/hero.svg" width="100%" alt="Kanye Fortune (Oracle of Ye) — Interactive fortune-telling web app with 4 dynamic Kanye era themes, 3D tarot card, and brutalist thermal receipt">
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-09090b?style=flat-square&logo=react&logoColor=61dafb" alt="React 19"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-7-09090b?style=flat-square&logo=typescript&logoColor=3178c6" alt="TypeScript 7"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-8-09090b?style=flat-square&logo=vite&logoColor=646cff" alt="Vite 8"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-09090b?style=flat-square&logo=tailwindcss&logoColor=38bdf8" alt="Tailwind CSS v4"></a>
  <img src="https://img.shields.io/badge/License-MIT-09090b?style=flat-square" alt="MIT License">
</p>

**Kanye Fortune (Oracle of Ye)** is an interactive fortune-telling web application that pairs Kanye West era aesthetics with 3D tarot physics, brutalist thermal receipts, zero-asset Web Audio synthesis, and 1-click high-DPI social export.

---

## Quick Start

Requires **Node.js 20+**.

```bash
git clone https://github.com/ali0zdas/Kanye-Fortune.git
cd Kanye-Fortune
npm install
npm run dev
```

Press **`Space`** to draw your first fortune, **`V`** to switch between 3D Card and Thermal Receipt, or **`1`–`4`** to shift eras.

---

<p align="center">
  <img src="./assets/readme/eras-and-flow.svg" width="100%" alt="Oracle pipeline: Dilemma or Space input, Hybrid API + 42-quote offline vault, Dual View 3D Card and Thermal Receipt, and Web Audio + High-DPI PNG export">
</p>

## Core Capabilities

- **4 Dynamic Era Themes**: Switch between **Donda** (monolith void), **Graduation** (Murakami cosmic pop), **808s & Heartbreak** (neon synthwave), and **Yeezus** (industrial brutalism) — each with its own design tokens and audio profile.
- **Dual Presentation Views**:
  - **3D Tarot Card**: Interactive flip card with holographic borders, dynamic glow, and aura score.
  - **Yeezy Thermal Receipt**: Monochrome store receipt with serrated tear edges and barcode styling.
- **Procedural Web Audio & TTS**: Zero-asset audio synthesizer generating 808 sub-bass drops, vinyl crackle, printer clicks, and card whooshes, paired with Web Speech & remote TTS voicing.
- **High-DPI Social Export**: 1-click PNG export in **1:1 Square** and **9:16 Story** formats, plus direct clipboard and X (Twitter) sharing.
- **Offline Resilient**: Hybrid API connection with automatic fallback to a curated **42-quote offline vault**.

---

## Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Space` | Draw New Fortune |
| `F` | Flip 3D Card (Card Mode) |
| `V` | Toggle View Mode (Card / Receipt) |
| `M` | Toggle Audio Mute |
| `E` | Open Social Export Modal |
| `1` – `4` | Switch Era (`1` Donda, `2` Graduation, `3` 808s, `4` Yeezus) |

---

## Tech Stack

- **Core**: React 19, TypeScript, Vite 8
- **Styling & Motion**: Tailwind CSS v4, Framer Motion, Canvas Confetti, Lucide React
- **Export**: `html-to-image`

---

## Build & Verification

```bash
# Production build & local preview
npm run build
npm run preview

# Headless E2E test suite (324 tests across 4 tiers)
npm run test

# Full verification audits & adversarial stress tests
npm run test:all
```

---

## License

MIT
