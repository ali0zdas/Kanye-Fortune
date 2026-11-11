import React, { useState } from 'react';
import { EraId, KanyeFortunePackage, ViewMode } from '../../types/fortune';
import { getEraConfig } from '../../data/eras';
import { copyFortuneToClipboard, createTwitterShareUrl } from '../../utils/shareHelpers';
import {
  RotateCcw,
  RefreshCw,
  Copy,
  Check,
  Share2,
  Download,
  Loader2,
} from 'lucide-react';

export interface ActionToolbarProps {
  fortune: KanyeFortunePackage | null;
  viewMode: ViewMode;
  isFlipped: boolean;
  isLoading: boolean;
  activeEra: EraId;
  onRedraw: () => void;
  onFlip: () => void;
  onExport?: () => void;
  onToast?: (message: string) => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  fortune,
  viewMode,
  isFlipped: _isFlipped,
  isLoading,
  activeEra,
  onRedraw,
  onFlip,
  onExport,
  onToast,
}) => {
  const eraConfig = getEraConfig(activeEra);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    if (!fortune) return;
    const success = await copyFortuneToClipboard(fortune);
    if (success) {
      setCopied(true);
      if (onToast) onToast('Ye wisdom copied to clipboard!');
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleShareTwitter = () => {
    if (!fortune) return;
    const url = createTwitterShareUrl(fortune);
    window.open(url, '_blank', 'noopener,noreferrer');
    if (onToast) onToast('Opening Twitter / X share intent...');
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-2">
      <div
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all duration-300"
        style={{
          backgroundColor: `${eraConfig.colors.surface}85`,
          borderColor: eraConfig.colors.border,
          boxShadow: `0 8px 30px -10px ${eraConfig.colors.glow}`,
        }}
      >
        {/* 1. Redraw Button */}
        <button
          onClick={onRedraw}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-200 active:scale-95 disabled:opacity-50"
          title="Draw another revelation"
          aria-label="Another revelation"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          ) : (
            <RotateCcw className="w-4 h-4" />
          )}
          <span>{isLoading ? 'DRAWING...' : 'NEW FORTUNE'}</span>
        </button>

        {/* 2. Flip Card Button (Only active/visible in 3D Card mode) */}
        {viewMode === 'card' && (
          <button
            onClick={onFlip}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-200 active:scale-95 disabled:opacity-50"
            title="Flip tarot card"
            aria-label="Flip card"
          >
            <RefreshCw className="w-4 h-4" />
            <span>FLIP</span>
          </button>
        )}

        {/* 3. 1-Click Copy Wisdom Button */}
        <button
          onClick={handleCopy}
          disabled={!fortune || isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-200 active:scale-95 disabled:opacity-50"
          title="Copy formatted quote & prophecy to clipboard"
          aria-label="Copy wisdom"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{copied ? 'COPIED!' : 'COPY'}</span>
        </button>

        {/* 5. Share to X (Twitter) */}
        <button
          onClick={handleShareTwitter}
          disabled={!fortune || isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-200 active:scale-95 disabled:opacity-50"
          title="Share revelation on X (Twitter)"
          aria-label="Share on X"
        >
          <Share2 className="w-4 h-4" />
          <span>SHARE X</span>
        </button>

        {/* 6. Export PNG Trigger (Optional handler) */}
        {onExport && (
          <button
            onClick={onExport}
            disabled={!fortune || isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-200 active:scale-95 disabled:opacity-50"
            title="Export high-resolution PNG"
            aria-label="Export PNG"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionToolbar;
