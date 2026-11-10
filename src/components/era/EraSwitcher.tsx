import React from 'react';
import { motion } from 'framer-motion';
import { EraId } from '../../types/fortune';
import { ERAS } from '../../data/eras';
import { Disc, Sparkles, Heart, Zap } from 'lucide-react';

interface EraSwitcherProps {
  activeEra: EraId;
  onSelectEra: (era: EraId) => void;
}

const ERA_ICONS: Record<EraId, React.ReactNode> = {
  donda: <Disc className="w-3.5 h-3.5" />,
  graduation: <Sparkles className="w-3.5 h-3.5" />,
  '808s': <Heart className="w-3.5 h-3.5" />,
  yeezus: <Zap className="w-3.5 h-3.5" />,
};

export const EraSwitcher: React.FC<EraSwitcherProps> = ({ activeEra, onSelectEra }) => {
  return (
    <nav
      aria-label="Album Era Selector"
      className="inline-flex items-center p-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-inner"
    >
      <div className="flex items-center gap-1">
        {ERAS.map((era, index) => {
          const isActive = activeEra === era.id;
          return (
            <button
              key={era.id}
              onClick={() => onSelectEra(era.id)}
              className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                isActive
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
              title={`${era.name} (${era.year}) - Key [${index + 1}]`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeEraPill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: era.colors.surface,
                    border: `1px solid ${era.colors.border}`,
                    boxShadow: `0 0 16px ${era.colors.glow}`,
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="opacity-80">{ERA_ICONS[era.id]}</span>
                <span>{era.name.toUpperCase()}</span>
                <span className="text-[10px] opacity-40 font-mono hidden sm:inline">
                  [{index + 1}]
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
