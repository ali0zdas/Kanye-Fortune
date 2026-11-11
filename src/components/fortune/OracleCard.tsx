import React from 'react';
import { motion } from 'framer-motion';
import { EraId, KanyeFortunePackage } from '../../types/fortune';
import { getEraConfig } from '../../data/eras';
import { ThinkingOrb } from '../ui/ThinkingOrb';
import {
  Sparkles,
  Disc,
  Glasses,
  Shirt,
  Footprints,
  Shield,
  Sun,
  Sliders,
  ShieldCheck,
  Bell,
  RefreshCw,
  Award,
  Zap,
  Heart,
} from 'lucide-react';

export interface OracleCardProps {
  fortune: KanyeFortunePackage | null;
  activeEra: EraId;
  isFlipped: boolean;
  onFlip: () => void;
  isLoading?: boolean;
}

const ARTIFACT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Disc,
  Glasses,
  Shirt,
  Footprints,
  Shield,
  Sun,
  Sliders,
  ShieldCheck,
  Bell,
};

export const OracleCard: React.FC<OracleCardProps> = ({
  fortune,
  activeEra,
  isFlipped,
  onFlip,
  isLoading = false,
}) => {
  const eraConfig = getEraConfig(activeEra);

  const ArtifactIcon =
    (fortune && ARTIFACT_ICONS[fortune.luckyArtifact.iconName]) || Sparkles;

  const serialNumber = fortune
    ? `#${String(fortune.luckyNumbers[0]).padStart(3, '0')}`
    : '#808';

  const handleCardFlip = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // Ignore vibration errors
      }
    }
    onFlip();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardFlip();
    }
  };

  return (
    <div className="perspective-1200 w-full max-w-md mx-auto aspect-[5/7] min-h-[580px] sm:min-h-[620px] select-none my-2">
      {/* Flip Container with GPU-accelerated lift on hover */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        whileHover={{ y: -6, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          rotateY: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
          y: { duration: 0.2, ease: 'easeOut' },
          scale: { duration: 0.2, ease: 'easeOut' },
        }}
        onClick={handleCardFlip}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={
          isFlipped
            ? 'Oracle Tarot Card front showing revelation. Tap to flip to back.'
            : 'Oracle Tarot Card back. Tap to reveal revelation.'
        }
        aria-pressed={isFlipped}
        className="w-full h-full relative transform-style-preserve-3d cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-3xl"
      >
        {/* ========================================================= */}
        {/* CARD FRONT (FACE) — rotateY(180deg)                       */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] rounded-3xl p-6 sm:p-7 flex flex-col justify-between border shadow-2xl overflow-hidden transition-colors duration-500"
          style={{
            backgroundColor: eraConfig.colors.surface,
            borderColor: eraConfig.colors.border,
            boxShadow: `0 25px 60px -15px ${eraConfig.colors.glow}, inset 0 0 20px rgba(255,255,255,0.03)`,
          }}
        >
          {/* Top Bar: Era Badge & Serial Number */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border"
              style={{
                backgroundColor: `${eraConfig.colors.accent}15`,
                borderColor: `${eraConfig.colors.border}60`,
                color: eraConfig.colors.accent,
              }}
            >
              <Sparkles className="w-3 h-3" />
              <span>{eraConfig.badgeLabel}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-400 font-semibold tracking-wider">
                {serialNumber}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1 hover:text-zinc-300">
                <RefreshCw className="w-2.5 h-2.5" /> Flip
              </span>
            </div>
          </div>

          {/* Destiny Verdict Banner */}
          <div
            className="py-2.5 px-3 rounded-xl border text-center transition-all duration-300 my-2"
            style={{
              backgroundColor: `${eraConfig.colors.surface}bb`,
              borderColor: `${eraConfig.colors.border}80`,
              boxShadow: `0 0 15px ${eraConfig.colors.glow}`,
            }}
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-mono tracking-widest uppercase mb-0.5 text-zinc-400">
              <Award className="w-3 h-3 text-amber-400" />
              <span>DESTINY VERDICT</span>
            </div>
            <h2
              className="text-base sm:text-lg font-black tracking-wider uppercase font-sans"
              style={{ color: eraConfig.colors.accent }}
            >
              *** {fortune ? fortune.destinyVerdict.title : 'GOD LEVEL ASCENDANT'} ***
            </h2>
            <p className="text-[11px] text-zinc-300 font-mono tracking-tight mt-0.5 line-clamp-1">
              {fortune
                ? fortune.destinyVerdict.subtitle
                : 'Maximum Distortion of Standard Human Limitations'}
            </p>
          </div>

          {/* Kanye Quote Body (Hero) */}
          <div className="flex-1 flex flex-col justify-center my-2 text-center px-2">
            <blockquote className="text-lg sm:text-xl font-bold leading-snug tracking-tight text-white italic drop-shadow-md">
              “{fortune ? fortune.quote : 'I refuse to accept other people’s ideas of my limitations.'}”
            </blockquote>
            <p
              className="text-xs font-mono mt-2 font-bold tracking-widest uppercase"
              style={{ color: eraConfig.colors.accent }}
            >
              — Kanye West
            </p>
          </div>

          {/* Oracle Interpretation Guidance */}
          <div className="my-2 p-3 rounded-xl bg-black/40 border border-white/5 text-center">
            <p className="text-xs leading-relaxed text-zinc-300 italic font-serif">
              {fortune
                ? fortune.oracleInterpretation
                : 'You are operating on a frequency engineered for stadium status. Trust the vision.'}
            </p>
          </div>

          {/* Ye's Directive / Actionable Command Pill */}
          <div
            className="py-2 px-3 rounded-lg border text-center transition-colors my-1"
            style={{
              backgroundColor: `${eraConfig.colors.surface}90`,
              borderColor: `${eraConfig.colors.border}50`,
            }}
          >
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-1 text-amber-300 mb-0.5">
              <Zap className="w-3 h-3" />
              <span>YE'S DIRECTIVE</span>
            </span>
            <p className="text-xs font-mono font-medium text-white line-clamp-2">
              {fortune
                ? fortune.actionableCommand
                : 'Shut down the studio until it is completely perfect.'}
            </p>
          </div>

          {/* Aura & Artifact Footer */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-left mt-1">
            {/* Aura Pill */}
            <div className="p-2 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5">
                Aura Rating
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: eraConfig.colors.accent }}
                >
                  {fortune ? `${fortune.auraScore}%` : '99.8%'}
                </span>
                <span className="text-[10px] text-zinc-300 truncate font-mono">
                  [{fortune ? fortune.auraTitle.toUpperCase() : 'GOD COMPLEX'}]
                </span>
              </div>
            </div>

            {/* Lucky Artifact Pill */}
            <div className="p-2 rounded-lg bg-black/50 border border-white/5">
              <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5">
                Lucky Artifact
              </div>
              <div className="flex items-center gap-1.5">
                <ArtifactIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs font-mono font-medium text-white truncate">
                  {fortune ? fortune.luckyArtifact.name : 'Red Stem Player'}
                </span>
              </div>
            </div>
          </div>

          {/* Official Seal Watermark */}
          <div className="mt-2 text-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center justify-between">
            <span>EST. 1977</span>
            <span>OFFICIAL ORACLE OF YE</span>
            <span>
              {fortune ? fortune.luckyNumbers.join(' • ') : '07 • 808 • 2026'}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD BACK (ERA-SPECIFIC EMBLEM) — rotateY(0deg)           */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 backface-hidden rounded-3xl p-6 sm:p-8 flex flex-col justify-between border shadow-2xl overflow-hidden transition-colors duration-500"
          style={{
            backgroundColor: eraConfig.colors.bg,
            borderColor: eraConfig.colors.border,
            boxShadow: `0 25px 60px -15px ${eraConfig.colors.glow}`,
          }}
        >
          {/* Top Back Label */}
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
            <span>{eraConfig.name}</span>
            <span>#{eraConfig.year}</span>
          </div>

          {/* Era Specific Occult Back Emblem */}
          <div className="flex-1 flex flex-col items-center justify-center my-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center text-center">
                <ThinkingOrb size={88} activeEra={activeEra} mode="thinking" />
                <span
                  className="text-xs font-mono font-bold tracking-widest uppercase mt-4 animate-pulse"
                  style={{ color: eraConfig.colors.accent }}
                >
                  CHANNELING YE FREQUENCY...
                </span>
              </div>
            ) : (
              <>
                {/* 1. DONDA CARD BACK */}
                {activeEra === 'donda' && (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-28 h-28 rounded-2xl border border-zinc-800 relative flex items-center justify-center mb-6 shadow-[0_0_35px_rgba(255,255,255,0.06)] bg-black">
                      {/* Donda Soaring Dove (Official Merch / Balenciaga Silhouette) */}
                      <svg
                        viewBox="0 0 100 100"
                        className="w-16 h-16 text-white fill-current filter drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]"
                        aria-hidden="true"
                      >
                        <path d="M50 14c-2.8 4.2-6.5 7.6-11 9.8C26.5 19.5 13.8 22 2.5 30.2c-1.8 1.3-1.6 4.1.4 5.2 10.4 5.8 21.6 13.4 32.6 24 1.8 4.8 2.3 11 0.4 18.2-.5 2 1.2 3.8 3.2 3.2 3.6-1.1 7.2-2.1 10.9-2.1s7.3 1 10.9 2.1c2 .6 3.7-1.2 3.2-3.2-1.9-7.2-1.4-13.4 0.4-18.2 11-10.6 22.2-18.2 32.6-24 2-1.1 2.2-3.9.4-5.2C86.2 22 73.5 19.5 61 23.8c-4.5-2.2-8.2-5.6-11-9.8z" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-base font-black tracking-widest text-white uppercase font-mono">
                      TOUCH TO ENTER THE VOID
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-500 max-w-xs mt-2 uppercase tracking-widest">
                      24 SONGS • PRAISE GOD • HEAVEN AND HELL • OFF THE GRID
                    </p>
                  </div>
                )}

                {/* 2. GRADUATION CARD BACK */}
                {activeEra === 'graduation' && (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="relative w-32 h-32 rounded-full border-2 border-pink-500 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(236,72,153,0.5)] bg-purple-950">
                      <Sparkles className="w-16 h-16 text-yellow-400 animate-pulse" />
                      {/* Constellation dots */}
                      <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
                      <div className="absolute bottom-3 left-4 w-1.5 h-1.5 rounded-full bg-pink-400" />
                      <div className="absolute top-5 left-3 w-2 h-2 rounded-full bg-cyan-300" />
                    </div>
                    <h3 className="text-sm sm:text-base font-black tracking-widest text-white uppercase font-mono">
                      FLIP TO GRADUATE
                    </h3>
                    <p className="text-[10px] font-mono text-pink-300 max-w-xs mt-2 uppercase tracking-widest">
                      STRONGER • FLASHING LIGHTS • GOOD LIFE • CAN’T TELL ME NOTHING
                    </p>
                  </div>
                )}

                {/* 3. 808s & HEARTBREAK CARD BACK */}
                {activeEra === '808s' && (
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* TR-808 rhythm step dots top */}
                    <div className="flex items-center gap-1.5 mb-6">
                      {[...Array(16)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-3 rounded-xs ${
                            i < 4
                              ? 'bg-rose-500'
                              : i < 8
                              ? 'bg-amber-500'
                              : i < 12
                              ? 'bg-yellow-300'
                              : 'bg-white'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Broken Heart Wireframe */}
                    <div className="relative w-28 h-28 rounded-2xl border border-cyan-400 flex items-center justify-center mb-6 shadow-[0_0_35px_rgba(6,182,212,0.4)] bg-slate-900">
                      <Heart className="w-14 h-14 text-rose-500 stroke-[1.5]" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-0.5 bg-cyan-400 rotate-45" />
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-black tracking-widest text-white uppercase font-mono">
                      UNLOCK HEARTBREAK FREQUENCY
                    </h3>
                    <p className="text-[10px] font-mono text-cyan-300 max-w-xs mt-2 uppercase tracking-widest">
                      HEARTLESS • LOVE LOCKDOWN • PARANOID • COLDER THAN WINTER
                    </p>
                  </div>
                )}

                {/* 4. YEEZUS CARD BACK */}
                {activeEra === 'yeezus' && (
                  <div className="flex flex-col items-center justify-center text-center relative w-full">
                    {/* CD Jewel Case Reflection */}
                    <div className="relative w-32 h-32 rounded-full border-2 border-zinc-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.4)] bg-zinc-900">
                      <Disc className="w-20 h-20 text-zinc-400 animate-spin-slow" />
                      <div className="absolute w-8 h-8 rounded-full border border-zinc-400 bg-zinc-800" />
                    </div>

                    {/* Red Hazard Tape */}
                    <div className="w-full bg-red-600 text-black font-mono font-black text-[10px] py-1 tracking-tighter uppercase transform -rotate-2 shadow-lg mb-4">
                      OPEN AT YOUR OWN RISK // UNMASTERED AUDIO
                    </div>

                    <h3 className="text-sm sm:text-base font-black tracking-widest text-white uppercase font-mono">
                      BREAK THE SEAL
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-400 max-w-xs mt-1 uppercase tracking-widest">
                      BLACK SKINHEAD • NEW SLAVES • BLOOD ON THE LEAVES • BOUND 2
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Prominent Flip Callout Pill for Instant UX Clarity */}
          <div className="flex justify-center my-2">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-widest border shadow-lg transition-transform hover:scale-105"
              style={{
                backgroundColor: `${eraConfig.colors.accent}18`,
                borderColor: eraConfig.colors.border,
                color: eraConfig.colors.accent,
                boxShadow: `0 0 20px ${eraConfig.colors.glow}`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'CHANNELING YE...' : 'TOUCH TO REVEAL'}</span>
            </div>
          </div>

          {/* Bottom prompt strip */}
          <div className="pt-3 border-t border-white/10 text-center text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <RefreshCw className="w-3 h-3 text-white" />
            <span>
              {isLoading ? 'CHANNELING...' : 'CLICK TO REVEAL REVELATION'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OracleCard;
