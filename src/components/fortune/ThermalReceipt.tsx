import React from 'react';
import { motion } from 'framer-motion';
import { EraId, KanyeFortunePackage } from '../../types/fortune';
import { SerratedEdge } from '../ui/SerratedEdge';

export interface ThermalReceiptProps {
  fortune: KanyeFortunePackage | null;
  activeEra: EraId;
  isLoading?: boolean;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({
  fortune,
  activeEra: _activeEra,
  isLoading = false,
}) => {
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

  const displayInterpretation = fortune
    ? fortune.oracleInterpretation
    : 'You are compromising your frequency for people who do not even listen to uncompressed audio. Step boldly into the light.';

  const displayDirective = fortune
    ? fortune.actionableCommand
    : 'Cut off all distractions for 48 hours. Build the prototype immediately.';

  const displayAura = fortune
    ? `${fortune.auraScore}% ${fortune.auraTitle.toUpperCase()}`
    : '99.8% UNFILTERED GENIUS';

  const displayArtifact = fortune
    ? `${fortune.luckyArtifact.name.toUpperCase()} (${fortune.luckyArtifact.description})`
    : 'RED OCTOBERS (MINT CONDITION)';

  return (
    <div className="w-full max-w-md mx-auto my-4 font-mono select-none overflow-hidden">
      {/* Thermal Printer Reveal Container */}
      <motion.div
        key={fortune?.id || 'empty-receipt'}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: 1.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="overflow-hidden shadow-2xl rounded-sm"
      >
        {/* Top Serrated Edge */}
        <SerratedEdge position="top" fill="#f7f6f2" />

        {/* Receipt Paper Body */}
        <div
          className="bg-[#f7f6f2] text-[#18181b] p-6 sm:p-8 space-y-4 text-xs leading-relaxed border-x border-[#e4e4e7]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.015), rgba(0,0,0,0.015) 1px, transparent 1px, transparent 2px)',
          }}
        >
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="text-sm sm:text-base font-extrabold tracking-widest uppercase">
              ================================================
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-widest uppercase py-0.5">
              ORACLE OF YE - EST. 1977
            </h2>
            <p className="text-[11px] font-bold tracking-wider uppercase text-zinc-700">
              CALABASAS / CHICAGO / CODY / TOKYO
            </p>
            <div className="text-sm sm:text-base font-extrabold tracking-widest uppercase">
              ================================================
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="text-[11px] space-y-0.5 pt-1">
            <div className="flex justify-between">
              <span>TRANS #: 0808-YE-2026-X</span>
              <span>REGISTER: 01</span>
            </div>
            <div className="flex justify-between">
              <span>DATE: {formattedDate}</span>
              <span>CASHIER: YE</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>MODE: DIVINE REVELATION</span>
              <span>STATUS: PAID</span>
            </div>
          </div>

          <div className="border-t border-dashed border-zinc-400 my-2" />

          {/* Itemized Table Header */}
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-600">
            <span>[ITEM]</span>
            <div className="flex gap-6">
              <span>[QTY]</span>
              <span>[VALUE]</span>
            </div>
          </div>

          {/* Optional User Inquiry (if provided) */}
          {fortune?.userQuestion && fortune.userQuestion.trim().length > 0 && (
            <div className="space-y-1">
              <div className="font-bold uppercase text-zinc-700">USER INQUIRY:</div>
              <div className="flex justify-between pl-2 italic">
                <span className="max-w-[240px] truncate">"{fortune.userQuestion.trim()}"</span>
                <div className="flex gap-8 shrink-0 font-bold">
                  <span>1</span>
                  <span>$0.00</span>
                </div>
              </div>
            </div>
          )}

          {/* Item 2: The Prophecy */}
          <div className="space-y-1">
            <div className="font-bold uppercase text-zinc-700">THE PROPHECY:</div>
            <blockquote className="pl-2 font-black text-xs sm:text-sm leading-snug my-1">
              “{displayQuote}”
            </blockquote>
            <div className="flex justify-end font-bold text-[11px]">
              <div className="flex gap-8">
                <span>1</span>
                <span>PRICELESS</span>
              </div>
            </div>
          </div>

          {/* Item 3: Destiny Verdict */}
          <div className="space-y-1">
            <div className="font-bold uppercase text-zinc-700">DESTINY VERDICT:</div>
            <div className="flex justify-between pl-2">
              <span className="font-extrabold tracking-wider">
                *** {displayVerdict} ***
              </span>
              <div className="flex gap-8 shrink-0 font-bold">
                <span>1</span>
                <span>INFINITE</span>
              </div>
            </div>
          </div>

          {/* Item 4: Oracle Interpretation */}
          <div className="space-y-1">
            <div className="font-bold uppercase text-zinc-700">
              ORACLE INTERPRETATION:
            </div>
            <p className="pl-2 text-[11px] leading-relaxed text-zinc-800 italic">
              {displayInterpretation}
            </p>
          </div>

          {/* Item 5: Ye's Directive */}
          <div className="space-y-1">
            <div className="font-bold uppercase text-zinc-700">
              YE'S DIRECTIVE:
            </div>
            <p className="pl-2 text-[11px] font-bold uppercase tracking-tight text-zinc-900 bg-black/5 p-2 rounded">
              ⚡ {displayDirective}
            </p>
          </div>

          {/* Item 6: Aura Assessment */}
          <div className="space-y-1">
            <div className="font-bold uppercase text-zinc-700">
              AURA ASSESSMENT:
            </div>
            <p className="pl-2 text-xs font-black tracking-wide text-zinc-900">
              ✨ {displayAura}
            </p>
          </div>

          {/* Item 7: Lucky Artifact */}
          <div className="space-y-1">
            <div className="font-bold uppercase text-zinc-700">
              LUCKY ARTIFACT:
            </div>
            <p className="pl-2 text-[11px] font-bold text-zinc-900">
              🏆 {displayArtifact}
            </p>
          </div>

          <div className="border-t border-dashed border-zinc-400 my-2" />

          {/* Financials & Balance */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>SUBTOTAL:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>EGO LEVY (TAX):</span>
              <span>100.0%</span>
            </div>
            <div className="flex justify-between font-black text-sm pt-1 border-t border-zinc-800">
              <span>TOTAL DUE:</span>
              <span>PRICELESS</span>
            </div>
            <div className="flex justify-between text-[11px] text-zinc-600">
              <span>PAYMENT METHOD:</span>
              <span>SOUL / ENERGY</span>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="pt-4 text-center space-y-1">
            <div className="text-sm font-extrabold tracking-widest uppercase">
              ================================================
            </div>

            {/* SVG Vector Barcode */}
            <div className="flex justify-center items-center py-2 h-14 overflow-hidden">
              <svg viewBox="0 0 280 48" className="w-56 h-12 fill-current">
                {/* Simulated vertical barcode stripes of varying widths */}
                <rect x="0" y="0" width="3" height="48" />
                <rect x="6" y="0" width="1" height="48" />
                <rect x="10" y="0" width="4" height="48" />
                <rect x="18" y="0" width="2" height="48" />
                <rect x="23" y="0" width="5" height="48" />
                <rect x="32" y="0" width="2" height="48" />
                <rect x="38" y="0" width="3" height="48" />
                <rect x="44" y="0" width="1" height="48" />
                <rect x="48" y="0" width="6" height="48" />
                <rect x="58" y="0" width="2" height="48" />
                <rect x="64" y="0" width="4" height="48" />
                <rect x="72" y="0" width="1" height="48" />
                <rect x="76" y="0" width="3" height="48" />
                <rect x="83" y="0" width="5" height="48" />
                <rect x="92" y="0" width="2" height="48" />
                <rect x="98" y="0" width="4" height="48" />
                <rect x="106" y="0" width="1" height="48" />
                <rect x="111" y="0" width="3" height="48" />
                <rect x="118" y="0" width="6" height="48" />
                <rect x="128" y="0" width="2" height="48" />
                <rect x="134" y="0" width="1" height="48" />
                <rect x="139" y="0" width="4" height="48" />
                <rect x="147" y="0" width="2" height="48" />
                <rect x="153" y="0" width="5" height="48" />
                <rect x="162" y="0" width="3" height="48" />
                <rect x="169" y="0" width="1" height="48" />
                <rect x="174" y="0" width="4" height="48" />
                <rect x="182" y="0" width="2" height="48" />
                <rect x="188" y="0" width="6" height="48" />
                <rect x="198" y="0" width="1" height="48" />
                <rect x="203" y="0" width="3" height="48" />
                <rect x="210" y="0" width="5" height="48" />
                <rect x="219" y="0" width="2" height="48" />
                <rect x="225" y="0" width="4" height="48" />
                <rect x="233" y="0" width="2" height="48" />
                <rect x="239" y="0" width="6" height="48" />
                <rect x="249" y="0" width="1" height="48" />
                <rect x="254" y="0" width="3" height="48" />
                <rect x="261" y="0" width="2" height="48" />
                <rect x="267" y="0" width="4" height="48" />
                <rect x="275" y="0" width="2" height="48" />
              </svg>
            </div>

            <div className="font-extrabold tracking-widest text-xs">
              * 0 7 0 9 1 9 7 7 - Y E *
            </div>

            <div className="text-sm font-extrabold tracking-widest uppercase">
              ================================================
            </div>

            {/* Footer Sign-off */}
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-700 pt-1">
              THANK YOU FOR TRANSACTING WITH THE UNIVERSE
            </p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              NO REFUNDS • ALL VISIONS FINAL & BINDING
            </p>
          </div>

          {isLoading && (
            <div className="text-center font-bold text-xs py-2 animate-pulse text-zinc-600">
              *** TRANSMITTING NEXT REVELATION VIA SATELLITE... ***
            </div>
          )}
        </div>

        {/* Bottom Serrated Edge */}
        <SerratedEdge position="bottom" fill="#f7f6f2" />
      </motion.div>
    </div>
  );
};

export default ThermalReceipt;
