import React from 'react';
import { motion } from 'framer-motion';
import { ViewMode, EraId } from '../../types/fortune';
import { getEraConfig } from '../../data/eras';
import { Layers, ReceiptText } from 'lucide-react';

export interface ModeToggleProps {
  viewMode: ViewMode;
  onToggleMode: (mode: ViewMode) => void;
  activeEra: EraId;
  className?: string;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  viewMode,
  onToggleMode,
  activeEra,
  className = '',
}) => {
  const eraConfig = getEraConfig(activeEra);

  return (
    <div
      role="radiogroup"
      aria-label="Presentation Mode Toggle"
      className={`inline-flex items-center p-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-inner select-none ${className}`}
    >
      {/* 3D Card Mode Button */}
      <button
        role="radio"
        aria-checked={viewMode === 'card'}
        onClick={() => onToggleMode('card')}
        className={`relative px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider transition-colors duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
          viewMode === 'card' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        {viewMode === 'card' && (
          <motion.div
            layoutId="modeTogglePill"
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: eraConfig.colors.surface,
              border: `1px solid ${eraConfig.colors.border}`,
              boxShadow: `0 0 16px ${eraConfig.colors.glow}`,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>3D TAROT CARD</span>
        </span>
      </button>

      {/* Yeezy Thermal Receipt Mode Button */}
      <button
        role="radio"
        aria-checked={viewMode === 'receipt'}
        onClick={() => onToggleMode('receipt')}
        className={`relative px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider transition-colors duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
          viewMode === 'receipt' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        {viewMode === 'receipt' && (
          <motion.div
            layoutId="modeTogglePill"
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: eraConfig.colors.surface,
              border: `1px solid ${eraConfig.colors.border}`,
              boxShadow: `0 0 16px ${eraConfig.colors.glow}`,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <ReceiptText className="w-3.5 h-3.5" />
          <span>THERMAL RECEIPT</span>
        </span>
      </button>
    </div>
  );
};

export default ModeToggle;
