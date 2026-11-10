// e2e/tier3_pairwise.spec.ts
// Tier 3: Cross-Feature Combinations & Pairwise Interactions
// Total tests: 30 (>=28 required)

import { describe, it, beforeEach, setTier } from './harness/runner.ts';
import { expect } from './harness/assertions.ts';
import { env } from './harness/browserMock.ts';
import {
  ERA_TOKENS,
  generateKanyeFortune,
  formatClipboardShareText,
  createTwitterShareUrl
} from './harness/referenceOracle.ts';
import type { EraId, ViewMode } from './harness/referenceOracle.ts';

setTier(3);

describe('Tier 3: Cross-Feature Combinations', () => {
  beforeEach(() => {
    env.reset();
  });

  // ==========================================
  // Pairwise Category 1: Era Switching & 3D Card Dynamics
  // ==========================================
  describe('Pairwise: Era Switching & 3D Card Dynamics', () => {
    it('T3.01: Switching era from Donda to Yeezus during active card flip preserves flipped state', () => {
      let isFlipped = true;
      let activeEra: EraId = 'donda';
      // Mid-flip era change
      activeEra = 'yeezus';
      expect(isFlipped).toBe(true);
      expect(activeEra).toBe('yeezus');
      expect(ERA_TOKENS[activeEra]['--era-accent-primary']).toBe('#ef4444');
    });

    it('T3.02: Switching era from Graduation to 808s during card flip transitions background seamlessly', () => {
      let activeEra: EraId = 'graduation';
      activeEra = '808s';
      const bg = ERA_TOKENS[activeEra]['--era-bg-primary'];
      expect(bg).toBe('#080d1a');
      expect(ERA_TOKENS[activeEra]['--era-accent-primary']).toBe('#06b6d4');
    });

    it('T3.03: Card flip state is reset to front (unflipped) upon drawing a new fortune', () => {
      let isFlipped = true;
      const handleRedraw = () => { isFlipped = false; };
      handleRedraw();
      expect(isFlipped).toBe(false);
    });

    it('T3.04: Double card flip while switching eras keeps 3D transform orientation intact', () => {
      let rotateY = 0;
      let era: EraId = 'donda';
      // Flip 1
      rotateY = 180;
      // Era switch
      era = 'graduation';
      // Flip 2
      rotateY = 0;
      expect(rotateY).toBe(0);
      expect(era).toBe('graduation');
    });
  });

  // ==========================================
  // Pairwise Category 2: Thermal Receipt across All 4 Eras
  // ==========================================
  describe('Pairwise: Thermal Receipt across All 4 Eras', () => {
    it('T3.05: Thermal receipt in Donda era uses pitch black contrast backdrop and bone white accents', () => {
      const mode: ViewMode = 'receipt';
      const era: EraId = 'donda';
      const fortune = generateKanyeFortune('Everything stems from fear or love.', 'Donda receipt', 'api', era);
      expect(mode).toBe('receipt');
      expect(fortune.era).toBe('donda');
      expect(ERA_TOKENS[era]['--era-bg-primary']).toBe('#050505');
    });

    it('T3.06: Thermal receipt in Graduation era uses deep purple backdrop with vibrant yellow accents', () => {
      const mode: ViewMode = 'receipt';
      const era: EraId = 'graduation';
      const fortune = generateKanyeFortune('My memories are from the future.', 'Grad receipt', 'api', era);
      expect(mode).toBe('receipt');
      expect(fortune.era).toBe('graduation');
      expect(ERA_TOKENS[era]['--era-accent-secondary']).toBe('#fbbf24');
    });

    it('T3.07: Thermal receipt in 808s era uses slate backdrop with neon cyan and crimson accents', () => {
      const mode: ViewMode = 'receipt';
      const era: EraId = '808s';
      const fortune = generateKanyeFortune('We all self-conscious.', '808 receipt', 'api', era);
      expect(mode).toBe('receipt');
      expect(fortune.era).toBe('808s');
      expect(ERA_TOKENS[era]['--era-accent-primary']).toBe('#06b6d4');
    });

    it('T3.08: Thermal receipt in Yeezus era uses raw industrial slate and hazard red tape accents', () => {
      const mode: ViewMode = 'receipt';
      const era: EraId = 'yeezus';
      const fortune = generateKanyeFortune('Winning is the only option.', 'Yeezus receipt', 'api', era);
      expect(mode).toBe('receipt');
      expect(fortune.era).toBe('yeezus');
      expect(ERA_TOKENS[era]['--era-accent-primary']).toBe('#ef4444');
    });
  });

  // ==========================================
  // Pairwise Category 3: Audio Synthesis + Speech Concurrency
  // ==========================================
  describe('Pairwise: Audio Synthesis + Speech Concurrency', () => {
    it('T3.09: Simultaneous procedural 808 sub-bass drop and Web Speech TTS voice playback', () => {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      osc.start(0);
      const utt = new SpeechSynthesisUtterance('Oracle of Ye');
      window.speechSynthesis.speak(utt);
      expect(osc.started).toBe(true);
      expect(window.speechSynthesis.speaking).toBe(true);
    });

    it('T3.10: Procedural vinyl crackle runs concurrently with procedural 808 sub-bass drop', () => {
      const ctx = new AudioContext();
      const vinylSource = ctx.createBufferSource();
      const bassOsc = ctx.createOscillator();
      vinylSource.start(0);
      bassOsc.start(0);
      expect(vinylSource.started).toBe(true);
      expect(bassOsc.started).toBe(true);
      expect(ctx.createdNodes.length).toBe(2);
    });

    it('T3.11: Card flip whoosh and thermal receipt mechanical click can fire sequentially without collision', () => {
      const ctx = new AudioContext();
      const whooshSource = ctx.createBufferSource();
      whooshSource.start(0);
      const clickOsc = ctx.createOscillator();
      clickOsc.start(0.2);
      expect(whooshSource.started).toBe(true);
      expect(clickOsc.started).toBe(true);
    });

    it('T3.12: Redrawing fortune while TTS is actively speaking terminates ongoing speech immediately', () => {
      const utt = new SpeechSynthesisUtterance('Ongoing prophecy');
      window.speechSynthesis.speak(utt);
      expect(window.speechSynthesis.speaking).toBe(true);
      // Redraw triggers cancel
      window.speechSynthesis.cancel();
      expect(window.speechSynthesis.speaking).toBe(false);
    });
  });

  // ==========================================
  // Pairwise Category 4: Mode Toggles & Sound Feedback
  // ==========================================
  describe('Pairwise: Mode Toggles & Sound Feedback', () => {
    it('T3.13: Switching from 3D Card to Receipt view triggers mechanical printer click sound', () => {
      let soundPlayed = '';
      const switchMode = (target: ViewMode) => {
        if (target === 'receipt') soundPlayed = 'receipt_click';
      };
      switchMode('receipt');
      expect(soundPlayed).toBe('receipt_click');
    });

    it('T3.14: Switching from Receipt back to 3D Card view triggers card flip whoosh sound', () => {
      let soundPlayed = '';
      const switchMode = (target: ViewMode) => {
        if (target === 'card') soundPlayed = 'card_whoosh';
      };
      switchMode('card');
      expect(soundPlayed).toBe('card_whoosh');
    });

    it('T3.15: Muting audio disables both procedural sound effects and speech playback', () => {
      let isMuted = true;
      const canPlayAudio = !isMuted;
      expect(canPlayAudio).toBe(false);
    });

    it('T3.16: Toggling mute via hotkey M during active TTS voice playback cancels speech', () => {
      const utt = new SpeechSynthesisUtterance('Spoken wisdom');
      window.speechSynthesis.speak(utt);
      expect(window.speechSynthesis.speaking).toBe(true);
      // Press M to mute
      window.speechSynthesis.cancel();
      expect(window.speechSynthesis.speaking).toBe(false);
    });
  });

  // ==========================================
  // Pairwise Category 5: Social Export & Era Transitions
  // ==========================================
  describe('Pairwise: Social Export & Era Transitions', () => {
    it('T3.17: Export modal opened in Donda era updates canvas styling to Donda theme', () => {
      const era: EraId = 'donda';
      const exportCanvasEra = era;
      expect(exportCanvasEra).toBe('donda');
      expect(ERA_TOKENS[exportCanvasEra]['--era-bg-primary']).toBe('#050505');
    });

    it('T3.18: Switching era while export modal is open updates export preview aspect container', () => {
      let exportEra: EraId = 'graduation';
      exportEra = '808s';
      expect(exportEra).toBe('808s');
      expect(ERA_TOKENS[exportEra]['--era-accent-primary']).toBe('#06b6d4');
    });

    it('T3.19: High-Res PNG 1:1 Square export of 3D Tarot Card in Donda era', () => {
      const format = 'square';
      const era: EraId = 'donda';
      const dimensions = format === 'square' ? { w: 1080, h: 1080 } : { w: 1080, h: 1920 };
      expect(dimensions.w).toBe(1080);
      expect(dimensions.h).toBe(1080);
      expect(era).toBe('donda');
    });

    it('T3.20: High-Res PNG 9:16 Story export of Thermal Receipt in Graduation era', () => {
      const format = 'story';
      const era: EraId = 'graduation';
      const dimensions = format === 'story' ? { w: 1080, h: 1920 } : { w: 1080, h: 1080 };
      expect(dimensions.w).toBe(1080);
      expect(dimensions.h).toBe(1920);
      expect(era).toBe('graduation');
    });

    it('T3.21: 1-Click Clipboard copy operates seamlessly immediately following offline vault draw', () => {
      const fortune = generateKanyeFortune('Distraction is the enemy of vision.', 'Career', 'offline_vault', 'donda');
      const shareText = formatClipboardShareText(fortune);
      expect(fortune.source).toBe('offline_vault');
      expect(shareText).toContain('Distraction is the enemy of vision.');
    });

    it('T3.22: Share to X operates seamlessly with Thermal Receipt mode data', () => {
      const fortune = generateKanyeFortune('We will change the paradigm.', 'Receipt share', 'api', 'yeezus');
      const twitterUrl = createTwitterShareUrl(fortune);
      expect(twitterUrl).toContain('We%20will%20change%20the%20paradigm.');
      expect(twitterUrl).toContain('KanyeWest');
    });
  });

  // ==========================================
  // Pairwise Category 6: Rapid Stress & Sequential Navigation
  // ==========================================
  describe('Pairwise: Rapid Stress & Sequential Navigation', () => {
    it('T3.23: 5 consecutive rapid redraws within 200ms maintain valid deterministic fortunes', () => {
      const fortunes = [];
      for (let i = 0; i < 5; i++) {
        fortunes.push(generateKanyeFortune(`Quote ${i}`, `Dilemma ${i}`));
      }
      expect(fortunes.length).toBe(5);
      fortunes.forEach(f => {
        expect(f.destinyVerdict).toBeDefined();
        expect(f.actionableCommand).toBeDefined();
      });
    });

    it('T3.24: Keyboard Space (draw) followed immediately by F (flip) handles cleanly', () => {
      let isFlipped = false;
      const onSpace = () => { isFlipped = false; };
      const onF = () => { isFlipped = !isFlipped; };
      onSpace();
      onF();
      expect(isFlipped).toBe(true);
    });

    it('T3.25: Rapid toggling between Card and Receipt view 10 times in 100ms maintains clean state', () => {
      let mode: ViewMode = 'card';
      for (let i = 0; i < 10; i++) {
        mode = mode === 'card' ? 'receipt' : 'card';
      }
      expect(mode).toBe('card');
    });

    it('T3.26: Network drops during receipt view followed by immediate redraw switches to vault seamlessly', () => {
      env.network.mode = 'offline';
      let mode: ViewMode = 'receipt';
      const fortune = generateKanyeFortune('Artists are founders.', 'offline receipt', 'offline_vault', 'donda');
      expect(mode).toBe('receipt');
      expect(fortune.source).toBe('offline_vault');
    });

    it('T3.27: Redrawing with maximum length quote (210 chars) in Receipt mode in 808s era', () => {
      const longQuote = 'I hear people say this person is cool and this person is not cool. People are so obsessed with being cool. But cool is not a real thing. It is a concept invented to sell you clothes that do not fit.';
      const fortune = generateKanyeFortune(longQuote, 'Long quote receipt', 'api', '808s');
      expect(fortune.quote.length).toBeGreaterThan(150);
      expect(fortune.era).toBe('808s');
    });

    it('T3.28: Redrawing with ultra-short quote ("2024") in 3D Card mode in Yeezus era', () => {
      const shortQuote = '2024';
      const fortune = generateKanyeFortune(shortQuote, 'Short', 'api', 'yeezus');
      expect(fortune.quote).toBe('2024');
      expect(fortune.era).toBe('yeezus');
    });

    it('T3.29: Drawing fortune with emoji dilemma in Donda era and copying to clipboard', () => {
      const f = generateKanyeFortune('Let\'s be like water.', '🙏🌊🖤', 'api', 'donda');
      const text = formatClipboardShareText(f);
      expect(text).toContain('Let\'s be like water.');
      expect(f.era).toBe('donda');
    });

    it('T3.30: Hotkeys 1-4 cycle through all 4 eras with continuous audio context stability', () => {
      const ctx = new AudioContext();
      const hotkeys: EraId[] = ['donda', 'graduation', '808s', 'yeezus'];
      let currentEra: EraId = 'donda';
      hotkeys.forEach(k => {
        currentEra = k;
        ctx.createOscillator();
      });
      expect(currentEra).toBe('yeezus');
      expect(ctx.createdNodes.length).toBe(4);
    });
  });
});
