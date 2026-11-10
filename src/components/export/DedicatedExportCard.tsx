import React, { forwardRef } from 'react';
import { EraId, KanyeFortunePackage, ViewMode } from '../../types/fortune';
import { getEraConfig } from '../../data/eras';
import { SerratedEdge } from '../ui/SerratedEdge';
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
  Award,
  Zap,
  Compass,
  Flame,
} from 'lucide-react';

export interface DedicatedExportCardProps {
  fortune: KanyeFortunePackage | null;
  activeEra: EraId;
  viewMode: ViewMode;
  format: 'square' | 'story';
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
  Flame,
};

/**
 * Dedicated high-DPI export target supporting 1:1 Square (1080x1080)
 * and 9:16 Story (1080x1920) formats with authentic era aesthetics.
 */
export const DedicatedExportCard = forwardRef<HTMLDivElement, DedicatedExportCardProps>(
  ({ fortune, activeEra, viewMode, format }, ref) => {
    const eraConfig = getEraConfig(activeEra);
    const isStory = format === 'story';

    const ArtifactIcon =
      (fortune && ARTIFACT_ICONS[fortune.luckyArtifact.iconName]) || Sparkles;

    const serialNumber = fortune
      ? `#${String(fortune.luckyNumbers[0]).padStart(3, '0')}`
      : '#808';

    const formattedDate = fortune
      ? new Date(fortune.timestamp).toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

    const displayQuote = fortune
      ? fortune.quote
      : 'I refuse to accept other people’s ideas of my limitations.';

    const displayVerdict = fortune
      ? fortune.destinyVerdict.title
      : 'GOD LEVEL ASCENDANT';

    const displaySubtitle = fortune
      ? fortune.destinyVerdict.subtitle
      : 'Maximum Distortion of Standard Human Limitations';

    const displayInterpretation = fortune
      ? fortune.oracleInterpretation
      : 'You are compromising your frequency for people who do not even listen to uncompressed audio. Step boldly into the light.';

    const displayDirective = fortune
      ? fortune.actionableCommand
      : 'Shut down the studio until it is completely perfect.';

    return (
      <div
        ref={ref}
        data-era={activeEra}
        className="relative select-none flex flex-col justify-between overflow-hidden text-white"
        style={{
          width: '1080px',
          height: isStory ? '1920px' : '1080px',
          backgroundColor: eraConfig.colors.bg,
          fontFamily:
            activeEra === 'donda'
              ? 'Inter, ui-sans-serif, system-ui, sans-serif'
              : activeEra === 'graduation'
              ? 'Outfit, Plus Jakarta Sans, system-ui, sans-serif'
              : activeEra === '808s'
              ? 'Plus Jakarta Sans, system-ui, sans-serif'
              : 'Space Grotesk, monospace, sans-serif',
        }}
      >
        {/* Era Atmosphere Layer (Glows & Gradients) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background:
              activeEra === 'graduation'
                ? 'radial-gradient(circle at 50% 25%, #7e22ce 0%, #3b0764 50%, #1e053a 100%)'
                : activeEra === '808s'
                ? 'radial-gradient(circle at 50% 20%, #0891b2 0%, #0f172a 60%, #080d1a 100%)'
                : activeEra === 'yeezus'
                ? 'radial-gradient(circle at 50% 30%, #3f3f46 0%, #18181b 60%, #0a0a0c 100%)'
                : 'radial-gradient(circle at 50% 30%, #27272a 0%, #121212 60%, #050505 100%)',
          }}
        />

        {/* Ambient Subtle Grid / Tech Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* ========================================================= */}
        {/* TOP WATERMARK & BRANDING HEADER                           */}
        {/* ========================================================= */}
        <header
          className={`relative z-10 w-full flex items-center justify-between border-b ${
            isStory ? 'px-16 pt-16 pb-8' : 'px-12 pt-8 pb-4'
          }`}
          style={{ borderColor: `${eraConfig.colors.border}40` }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border"
              style={{
                backgroundColor: `${eraConfig.colors.surface}90`,
                borderColor: eraConfig.colors.border,
                color: eraConfig.colors.accent,
                boxShadow: `0 0 20px ${eraConfig.colors.glow}`,
              }}
            >
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-widest uppercase text-white font-mono">
                ORACLE OF YE
              </h1>
              <p
                className="text-xs font-mono font-bold tracking-widest uppercase"
                style={{ color: eraConfig.colors.accent }}
              >
                DIVINE WISDOM • {eraConfig.name.toUpperCase()}
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono font-bold tracking-widest uppercase"
            style={{
              backgroundColor: `${eraConfig.colors.surface}95`,
              borderColor: eraConfig.colors.border,
              color: eraConfig.colors.accent,
              boxShadow: `0 0 15px ${eraConfig.colors.glow}`,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{eraConfig.badgeLabel}</span>
          </div>
        </header>

        {/* ========================================================= */}
        {/* MAIN BODY: TAROT CARD VS THERMAL RECEIPT                  */}
        {/* ========================================================= */}
        <main
          className={`relative z-10 flex-1 flex items-center justify-center ${
            isStory ? 'px-16 py-12' : 'px-12 py-6'
          }`}
        >
          {viewMode === 'card' ? (
            /* --- 3D TAROT CARD PRESENTATION --- */
            <div
              className={`w-full max-w-2xl mx-auto flex flex-col justify-between border rounded-3xl backdrop-blur-2xl shadow-2xl transition-all ${
                isStory ? 'p-12 min-h-[1180px]' : 'p-8 min-h-[720px]'
              }`}
              style={{
                backgroundColor: `${eraConfig.colors.surface}f5`,
                borderColor: eraConfig.colors.border,
                boxShadow: `0 35px 80px -20px ${eraConfig.colors.glow}, inset 0 0 30px rgba(255,255,255,0.05)`,
              }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase border"
                  style={{
                    backgroundColor: `${eraConfig.colors.accent}20`,
                    borderColor: `${eraConfig.colors.border}80`,
                    color: eraConfig.colors.accent,
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{eraConfig.badgeLabel}</span>
                </div>

                <div className="text-sm font-mono text-zinc-400 font-bold tracking-widest">
                  SERIES {serialNumber}
                </div>
              </div>

              {/* Destiny Verdict Banner */}
              <div
                className={`rounded-2xl border text-center transition-all ${
                  isStory ? 'py-6 px-6 my-6' : 'py-3.5 px-4 my-3'
                }`}
                style={{
                  backgroundColor: `${eraConfig.colors.surface}cc`,
                  borderColor: `${eraConfig.colors.border}90`,
                  boxShadow: `0 0 25px ${eraConfig.colors.glow}`,
                }}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono tracking-widest uppercase mb-1 text-zinc-400">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>DESTINY VERDICT</span>
                </div>
                <h2
                  className={`font-black tracking-wider uppercase font-sans ${
                    isStory ? 'text-3xl' : 'text-2xl'
                  }`}
                  style={{ color: eraConfig.colors.accent }}
                >
                  *** {displayVerdict} ***
                </h2>
                <p className="text-xs text-zinc-300 font-mono tracking-tight mt-1">
                  {displaySubtitle}
                </p>
              </div>

              {/* Kanye Quote Body (Hero) */}
              <div
                className={`flex-1 flex flex-col justify-center text-center ${
                  isStory ? 'my-8 px-6' : 'my-3 px-4'
                }`}
              >
                <blockquote
                  className={`font-bold leading-snug tracking-tight text-white italic drop-shadow-lg ${
                    isStory ? 'text-4xl' : 'text-2xl'
                  }`}
                >
                  “{displayQuote}”
                </blockquote>
                <p
                  className="text-sm font-mono mt-3 font-bold tracking-widest uppercase"
                  style={{ color: eraConfig.colors.accent }}
                >
                  — Kanye West
                </p>
              </div>

              {/* Oracle Interpretation */}
              <div
                className={`rounded-2xl bg-black/50 border border-white/10 text-center ${
                  isStory ? 'my-6 p-6' : 'my-2.5 p-4'
                }`}
              >
                <p
                  className={`leading-relaxed text-zinc-200 italic font-serif ${
                    isStory ? 'text-lg' : 'text-sm'
                  }`}
                >
                  {displayInterpretation}
                </p>
              </div>

              {/* Ye's Directive */}
              <div
                className={`rounded-xl border text-center ${
                  isStory ? 'py-4 px-6 my-4' : 'py-2.5 px-4 my-2'
                }`}
                style={{
                  backgroundColor: `${eraConfig.colors.surface}95`,
                  borderColor: `${eraConfig.colors.border}60`,
                }}
              >
                <span className="text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 text-amber-300 mb-1">
                  <Zap className="w-4 h-4" />
                  <span>YE'S DIRECTIVE</span>
                </span>
                <p
                  className={`font-mono font-medium text-white ${
                    isStory ? 'text-base' : 'text-xs'
                  }`}
                >
                  {displayDirective}
                </p>
              </div>

              {/* Footer Metrics: Aura & Lucky Artifact */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-left">
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/5">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    Aura Rating
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-base font-mono font-bold"
                      style={{ color: eraConfig.colors.accent }}
                    >
                      {fortune ? `${fortune.auraScore}%` : '99.8%'}
                    </span>
                    <span className="text-xs text-zinc-300 font-mono">
                      [{fortune ? fortune.auraTitle.toUpperCase() : 'GOD COMPLEX'}]
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-white/5">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    Lucky Yeezy Artifact
                  </div>
                  <div className="flex items-center gap-2">
                    <ArtifactIcon className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-zinc-200 font-mono font-bold truncate">
                      {fortune ? fortune.luckyArtifact.name.toUpperCase() : 'RED OCTOBERS'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* --- YEEZY THERMAL RECEIPT PRESENTATION --- */
            <div
              className={`w-full max-w-xl mx-auto font-mono text-[#18181b] shadow-2xl rounded-sm ${
                isStory ? 'my-4' : 'my-1'
              }`}
            >
              {/* Top Serrated Edge */}
              <SerratedEdge position="top" fill="#f7f6f2" />

              {/* Receipt Body on Vintage Parchment */}
              <div
                className={`bg-[#f7f6f2] ${
                  isStory ? 'p-10 text-sm' : 'p-7 text-xs'
                }`}
              >
                {/* Store Header */}
                <div className="text-center border-b-2 border-dashed border-[#18181b]/30 pb-4 mb-4">
                  <h3 className="font-black tracking-widest text-base sm:text-lg uppercase">
                    ORACLE OF YE — EST. 1977
                  </h3>
                  <p className="text-[10px] text-zinc-600 tracking-wider">
                    CALABASAS / CHICAGO / CODY / TOKYO
                  </p>
                  <p className="text-[9px] text-zinc-500 mt-0.5 uppercase tracking-widest">
                    OFFICIAL DESTINY TRANSACTION RECEIPT
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex justify-between text-[11px] border-b border-[#18181b]/20 pb-2 mb-3">
                  <span>TRANS #: 0808-YE-{fortune ? fortune.timestamp : '2026'}</span>
                  <span>REG: 01</span>
                </div>
                <div className="flex justify-between text-[11px] border-b border-[#18181b]/20 pb-2 mb-3">
                  <span>DATE: {formattedDate}</span>
                  <span>CASHIER: YE</span>
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-3">
                  MODE: DIVINE REVELATION // {activeEra.toUpperCase()}
                </div>

                {/* Question (only if inquiry submitted) */}
                {fortune?.userQuestion && fortune.userQuestion.trim().length > 0 && (
                  <div className="my-3 border-b border-[#18181b]/10 pb-2">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase">
                      [01] INQUIRY SUBMITTED
                    </div>
                    <div className="text-xs font-semibold text-[#18181b] mt-0.5">
                      "{fortune.userQuestion.trim()}"
                    </div>
                  </div>
                )}

                {/* Prophecy */}
                <div className="my-3 border-b border-[#18181b]/10 pb-2">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">
                    [02] THE PROPHECY
                  </div>
                  <div className="text-xs font-bold italic text-[#18181b] mt-0.5 leading-snug">
                    “{displayQuote}”
                  </div>
                </div>

                {/* Verdict & Directive */}
                <div className="my-3 border-b border-[#18181b]/10 pb-2">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">
                    [03] DESTINY VERDICT
                  </div>
                  <div className="text-xs font-black text-[#18181b] mt-0.5">
                    *** {displayVerdict} ***
                  </div>
                  <div className="text-[10px] text-zinc-700 mt-1 italic leading-tight">
                    {displayInterpretation}
                  </div>
                </div>

                <div className="my-3 border-b border-[#18181b]/10 pb-2">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">
                    [04] YE'S DIRECTIVE
                  </div>
                  <div className="text-xs font-bold text-[#18181b] mt-0.5">
                    {displayDirective}
                  </div>
                </div>

                {/* Aura & Artifact */}
                <div className="flex justify-between text-[11px] border-b border-[#18181b]/10 pb-2 my-2">
                  <span>AURA FREQUENCY:</span>
                  <span className="font-bold">
                    {fortune ? `${fortune.auraScore}% ${fortune.auraTitle.toUpperCase()}` : '99.8% UNFILTERED GENIUS'}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] border-b border-[#18181b]/10 pb-2 my-2">
                  <span>LUCKY ARTIFACT:</span>
                  <span className="font-bold">
                    {fortune ? fortune.luckyArtifact.name.toUpperCase() : 'RED OCTOBERS'}
                  </span>
                </div>

                {/* Financial Totals */}
                <div className="pt-2 border-t-2 border-dashed border-[#18181b]/30 my-3 text-[11px]">
                  <div className="flex justify-between">
                    <span>SUBTOTAL:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EGO LEVY (TAX):</span>
                    <span>100.0%</span>
                  </div>
                  <div className="flex justify-between font-black text-sm pt-1 border-t border-[#18181b]/20 mt-1">
                    <span>TOTAL DUE:</span>
                    <span>PRICELESS</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-600 mt-0.5">
                    <span>PAYMENT METHOD:</span>
                    <span>SOUL / ENERGY</span>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="pt-4 text-center">
                  <div className="flex justify-center items-center gap-[2px] h-10 px-6">
                    {Array.from({ length: 48 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-full bg-[#18181b]"
                        style={{
                          width: `${(idx % 4 === 0 ? 3 : idx % 3 === 0 ? 2 : 1) * 2}px`,
                          opacity: idx % 7 === 0 ? 0.3 : 1,
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-zinc-600 mt-1">
                    * 0 7 0 9 1 9 7 7 - Y E *
                  </div>
                </div>

                <div className="text-center text-[9px] text-zinc-600 pt-3 border-t border-[#18181b]/20 mt-3 uppercase tracking-wider">
                  THANK YOU FOR TRANSACTING WITH THE UNIVERSE
                  <br />
                  NO REFUNDS • ALL VISIONS FINAL & BINDING
                </div>
              </div>

              {/* Bottom Serrated Edge */}
              <SerratedEdge position="bottom" fill="#f7f6f2" />
            </div>
          )}
        </main>

        {/* ========================================================= */}
        {/* BOTTOM BRANDING & VIRAL URL FOOTER                        */}
        {/* ========================================================= */}
        <footer
          className={`relative z-10 w-full flex items-center justify-between border-t ${
            isStory ? 'px-16 pt-8 pb-16' : 'px-12 pt-4 pb-8'
          }`}
          style={{ borderColor: `${eraConfig.colors.border}40` }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono font-bold tracking-widest uppercase"
              style={{ color: eraConfig.colors.accent }}
            >
              kanyefortune.com
            </span>
            <span className="text-xs text-zinc-500 font-mono">•</span>
            <span className="text-xs text-zinc-400 font-mono tracking-wider">
              DRAW YOUR DESTINY
            </span>
          </div>

          <div className="text-xs font-mono text-zinc-500 tracking-widest">
            AUTHENTIC ORACLE OF YE © {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    );
  }
);

DedicatedExportCard.displayName = 'DedicatedExportCard';

export default DedicatedExportCard;
