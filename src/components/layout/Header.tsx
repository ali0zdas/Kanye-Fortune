import React from 'react';
import { EraId, ViewMode } from '../../types/fortune';
import { EraSwitcher } from '../era/EraSwitcher';
import { Sparkles, Layers, ReceiptText } from 'lucide-react';
import { getEraConfig } from '../../data/eras';

interface HeaderProps {
  activeEra: EraId;
  onSelectEra: (era: EraId) => void;
  viewMode?: ViewMode;
  onToggleViewMode?: (mode: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeEra,
  onSelectEra,
  viewMode = 'card',
  onToggleViewMode,
}) => {
  const eraConfig = getEraConfig(activeEra);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-white/10 bg-black/50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg"
            style={{
              backgroundColor: eraConfig.colors.surface,
              border: `1px solid ${eraConfig.colors.border}`,
              boxShadow: `0 0 14px ${eraConfig.colors.glow}`,
            }}
          >
            <Sparkles
              className="w-5 h-5 transition-colors duration-500"
              style={{ color: eraConfig.colors.accent }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-widest text-white uppercase font-sans">
                ORACLE OF YE
              </span>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded tracking-normal font-semibold transition-colors duration-300"
                style={{
                  backgroundColor: `${eraConfig.colors.accent}20`,
                  color: eraConfig.colors.accent,
                  border: `1px solid ${eraConfig.colors.border}40`,
                }}
              >
                {eraConfig.year}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block tracking-wide">
              {eraConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Era Switcher Center Controls */}
        <div className="hidden md:flex items-center justify-center">
          <EraSwitcher activeEra={activeEra} onSelectEra={onSelectEra} />
        </div>

        {/* Action Controls: Mode & Audio */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          {onToggleViewMode && (
            <div className="flex items-center p-0.5 rounded-lg border border-white/10 bg-black/30 text-xs">
              <button
                onClick={() => onToggleViewMode('card')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'card'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="3D Oracle Card View"
                aria-label="3D Oracle Card View"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => onToggleViewMode('receipt')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'receipt'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Yeezy Thermal Receipt View"
                aria-label="Yeezy Thermal Receipt View"
              >
                <ReceiptText className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Era Selector Strip */}
      <div className="md:hidden flex justify-center py-2 px-4 border-t border-white/5 bg-black/30 overflow-x-auto">
        <EraSwitcher activeEra={activeEra} onSelectEra={onSelectEra} />
      </div>
    </header>
  );
};
