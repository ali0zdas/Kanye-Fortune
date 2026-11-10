import React from 'react';
import { EraId } from '../../types/fortune';
import { getEraConfig } from '../../data/eras';
import { Keyboard, ExternalLink } from 'lucide-react';

interface FooterProps {
  activeEra: EraId;
}

export const Footer: React.FC<FooterProps> = ({ activeEra }) => {
  const eraConfig = getEraConfig(activeEra);

  return (
    <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-md py-6 px-4 sm:px-6 lg:px-8 mt-auto transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        {/* Attribution & Tribute */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span>
            ORACLE OF YE • <span className="text-zinc-500">Est. 1977</span>
          </span>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <a
            href="https://api.kanye.rest/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
          >
            Powered by api.kanye.rest
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>

        {/* Keyboard Shortcuts Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded-md">
            <Keyboard className="w-3.5 h-3.5 opacity-70" />
            <span className="text-zinc-500">Shortcuts:</span>
          </div>
          <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-300">
            [1-4] Eras
          </span>
          <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-300">
            [Space] Draw
          </span>
          <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-300">
            [F] Flip
          </span>
          <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-300">
            [M] Sound
          </span>
        </div>

        {/* Era Tagline */}
        <div
          className="text-[11px] font-mono uppercase tracking-widest transition-colors duration-300"
          style={{ color: eraConfig.colors.accent }}
        >
          {eraConfig.badgeLabel}
        </div>
      </div>
    </footer>
  );
};
