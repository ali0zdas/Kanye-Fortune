import React from 'react';
import { motion } from 'framer-motion';
import { EraId } from '../../types/fortune';
import { getEraConfig } from '../../data/eras';
import { BorderBeam } from '../ui/BorderBeam';
import { ThinkingOrb } from '../ui/ThinkingOrb';
import {
  Sparkles,
  X,
  Briefcase,
  Heart,
  DollarSign,
  Lightbulb,
  Crown,
} from 'lucide-react';

export interface PromptBoxProps {
  userQuestion: string;
  onQuestionChange: (q: string) => void;
  onDraw: (question?: string) => void;
  isLoading: boolean;
  activeEra: EraId;
}

interface CategoryChip {
  id: string;
  label: string;
  query: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_CHIPS: CategoryChip[] = [
  {
    id: 'career',
    label: 'Career',
    query: 'Should I quit my corporate job and start my own company?',
    icon: Briefcase,
  },
  {
    id: 'romance',
    label: 'Romance',
    query: 'Should I text my ex or wait for them to see my greatness?',
    icon: Heart,
  },
  {
    id: 'money',
    label: 'Money',
    query: 'Should I invest all my money in the futuristic vision?',
    icon: DollarSign,
  },
  {
    id: 'creativity',
    label: 'Creativity',
    query: 'How do I break through this creative block and finish my masterpiece?',
    icon: Lightbulb,
  },
  {
    id: 'ego',
    label: 'Ego',
    query: 'Am I secretly the greatest visionary of my generation?',
    icon: Crown,
  },
];

export const PromptBox: React.FC<PromptBoxProps> = ({
  userQuestion,
  onQuestionChange,
  onDraw,
  isLoading,
  activeEra,
}) => {
  const eraConfig = getEraConfig(activeEra);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onDraw(userQuestion);
    }
  };

  const handleChipClick = (query: string) => {
    if (userQuestion === query) {
      onQuestionChange('');
    } else {
      onQuestionChange(query);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Main Input Wrapper */}
        <div
          className="relative flex items-center rounded-2xl border backdrop-blur-xl transition-all duration-300 shadow-xl"
          style={{
            backgroundColor: `${eraConfig.colors.surface}95`,
            borderColor: eraConfig.colors.border,
            boxShadow: `0 8px 30px -10px ${eraConfig.colors.glow}`,
          }}
        >
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder="Ask Ye anything... or leave blank for pure destiny"
            disabled={isLoading}
            className="w-full py-4 pl-5 pr-12 text-sm sm:text-base text-white placeholder-zinc-400 bg-transparent rounded-2xl outline-none focus:ring-0 disabled:opacity-60"
            aria-label="Ask Kanye a question"
          />

          {userQuestion.length > 0 && !isLoading && (
            <button
              type="button"
              onClick={() => onQuestionChange('')}
              className="absolute right-4 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Clear question"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 5 Quick Category Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center pt-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline mr-1">
            Presets:
          </span>
          {CATEGORY_CHIPS.map((chip) => {
            const Icon = chip.icon;
            const isSelected = userQuestion === chip.query;
            return (
              <motion.button
                key={chip.id}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                onClick={() => handleChipClick(chip.query)}
                disabled={isLoading}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'border-white text-white shadow-sm'
                    : 'border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/25 hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isSelected ? eraConfig.colors.surface : 'transparent',
                  borderColor: isSelected ? eraConfig.colors.border : undefined,
                  color: isSelected ? eraConfig.colors.accent : undefined,
                }}
              >
                <Icon className="w-3 h-3 opacity-80" />
                <span>{chip.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Big Draw Fortune CTA Button */}
        <div className="flex justify-center mt-2">
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="relative group overflow-hidden px-8 py-3.5 rounded-full font-extrabold text-xs sm:text-sm tracking-widest uppercase text-white transition-all duration-300 flex items-center justify-center gap-2.5 shadow-2xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{
              backgroundColor: eraConfig.colors.surface,
              border: `1px solid ${eraConfig.colors.border}`,
              boxShadow: `0 0 25px ${eraConfig.colors.glow}`,
            }}
          >
            {/* Border beam ambient edge */}
            <BorderBeam activeEra={activeEra} borderWidth={1.5} duration={10} />

            {/* Animated shimmer highlight */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent, ${eraConfig.colors.accent}25, transparent)`,
              }}
            />

            {isLoading ? (
              <>
                <ThinkingOrb size={20} activeEra={activeEra} mode="thinking" />
                <span>CHANNELING YE...</span>
              </>
            ) : (
              <>
                <Sparkles
                  className="w-4 h-4 transition-transform group-hover:rotate-12"
                  style={{ color: eraConfig.colors.accent }}
                />
                <span>CONSULT THE ORACLE</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default PromptBox;
