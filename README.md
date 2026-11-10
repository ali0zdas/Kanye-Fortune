# Kanye Fortune (Oracle of Ye) 🔮

> A modern, responsive, high-aesthetic interactive web application delivering Kanye West fortune-telling experiences with dynamic era styling, procedural Web Audio synthesis, interactive 3D physics, brutalist receipt generation, and high-DPI social media export.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)

---

## ✨ Features

- **Interactive Oracle Engine**: Delivers destiny verdicts, actionable Ye commands, and aura scores based on user dilemmas or instant serendipity wisdom.
- **Dynamic Era Switching**: 4 distinct aesthetic themes (Donda, Graduation, 808s & Heartbreak, Yeezus) with custom design tokens, typography, and procedural audio profiles.
- **Dual Presentation Views**:
  - **3D Tarot Card**: Interactive 3D flip card with dynamic glow, holographic borders, and smooth animations.
  - **Yeezy Thermal Receipt**: Brutalist monochrome store receipt with serrated tear edges and barcode styling.
- **Procedural Web Audio**: Zero-asset audio synthesizer generating 808 sub-bass drops, vinyl crackle, mechanical printer clicks, and card whooshes.
- **Web Speech & Remote TTS**: Text-to-speech engine voicing Kanye prophecies with live visualizer glow.
- **High-DPI Social Export**: 1-click export to high-resolution PNG images (1:1 Square, 9:16 Story) and direct sharing to clipboard and X (Twitter).
- **Offline Resilient**: Hybrid API connection with automatic fallback to a curated 42-quote offline vault.
- **Keyboard Navigation**: Comprehensive hotkeys for era switching, drawing fortunes, flipping cards, muting sound, and opening export.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Custom Era Design Tokens
- **Animations**: Framer Motion + Canvas Confetti
- **Icons**: Lucide React
- **Exporting**: html-to-image
- **Build Tool**: Vite 8

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/ali0zdas/Kanye-Fortune.git

# Navigate to project directory
cd Kanye-Fortune

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Running Tests

```bash
# Run headless E2E test suite (324 tests across 4 tiers)
npm run test

# Run all verification audits and stress tests
npm run test:all
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Draw New Fortune |
| `F` | Flip 3D Card (Card Mode) |
| `V` | Toggle View Mode (Card / Receipt) |
| `M` | Toggle Audio Mute |
| `E` | Open Social Export Modal |
| `1` | Switch to Donda Era |
| `2` | Switch to Graduation Era |
| `3` | Switch to 808s & Heartbreak Era |
| `4` | Switch to Yeezus Era |

---

## 📄 License

MIT
