import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EraId } from '../../types/fortune';
import { getEraConfig } from '../../data/eras';
import { ThinkingOrb } from './ThinkingOrb';
import { Volume2, Square } from 'lucide-react';

export interface SpeakingVoiceOrbProps {
  isSpeaking: boolean;
  activeEra: EraId;
  quote?: string;
  onStop: () => void;
}

/**
 * SpeakingVoiceOrb inspired by Shipnotes Components (shipnotes-components/speaking-orb & iris)
 * Visualizes live AI voice synthesis with real-time reactive wave frequencies and tactile controls.
 */
export const SpeakingVoiceOrb: React.FC<SpeakingVoiceOrbProps> = ({
  isSpeaking,
  activeEra,
  quote,
  onStop,
}) => {
  const eraConfig = getEraConfig(activeEra);

  return (
    <AnimatePresence>
      {isSpeaking && (
        <motion.div
          key="speaking-voice-orb"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] sm:w-auto px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 select-none"
          style={{
            backgroundColor: `${eraConfig.colors.surface}f5`,
            borderColor: eraConfig.colors.border,
            boxShadow: `0 15px 40px -10px ${eraConfig.colors.glow}`,
          }}
          role="status"
          aria-live="polite"
        >
          {/* Reactive Particle Voice Orb */}
          <div className="shrink-0 relative flex items-center justify-center">
            <ThinkingOrb size={38} activeEra={activeEra} mode="speaking" />
          </div>

          {/* Voice status info & equalizer wave */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Volume2
                className="w-3.5 h-3.5 animate-pulse shrink-0"
                style={{ color: eraConfig.colors.accent }}
              />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-white truncate">
                YE ORACLE SPEECH ACTIVE
              </span>
              {/* Animated audio equalizer bars */}
              <div className="flex items-end gap-0.5 h-3 ml-1.5 shrink-0">
                {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8, 0.3].map((height, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      scaleY: [height * 0.3, height, height * 0.4],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + i * 0.1,
                      ease: 'easeInOut',
                    }}
                    className="w-0.5 origin-bottom rounded-full"
                    style={{
                      height: '100%',
                      backgroundColor: eraConfig.colors.accent,
                    }}
                  />
                ))}
              </div>
            </div>

            {quote && (
              <p className="text-[11px] text-zinc-300 font-mono italic truncate max-w-xs sm:max-w-sm">
                “{quote}”
              </p>
            )}
          </div>

          {/* Stop Button with tactile spring feedback */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={onStop}
            className="shrink-0 px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            style={{
              backgroundColor: `${eraConfig.colors.accent}20`,
              borderColor: `${eraConfig.colors.border}80`,
              color: eraConfig.colors.accent,
            }}
            title="Stop Speech"
          >
            <Square className="w-2.5 h-2.5 fill-current" />
            <span>STOP</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpeakingVoiceOrb;
