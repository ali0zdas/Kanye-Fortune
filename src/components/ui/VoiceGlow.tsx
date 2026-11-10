import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EraId } from '../../types/fortune';

export interface VoiceGlowProps {
  isSpeaking: boolean;
  activeEra?: EraId;
}

const ERA_VOICE_GLOW: Record<EraId, { start: string; mid: string }> = {
  donda: {
    start: 'rgba(255, 255, 255, 0.28)',
    mid: 'rgba(255, 255, 255, 0.08)',
  },
  graduation: {
    start: 'rgba(236, 72, 153, 0.45)',
    mid: 'rgba(251, 191, 36, 0.2)',
  },
  '808s': {
    start: 'rgba(6, 182, 212, 0.45)',
    mid: 'rgba(244, 63, 94, 0.2)',
  },
  yeezus: {
    start: 'rgba(239, 68, 68, 0.5)',
    mid: 'rgba(251, 146, 60, 0.2)',
  },
};

/**
 * VoiceGlow component inspired by Jakub Antalik's Voice Glow (libraries.dev/voice).
 * A dynamic ambient illumination that rises from the viewport bottom when Kanye TTS is active.
 */
export const VoiceGlow: React.FC<VoiceGlowProps> = ({
  isSpeaking,
  activeEra = 'donda',
}) => {
  const glow = ERA_VOICE_GLOW[activeEra] || ERA_VOICE_GLOW.donda;

  return (
    <AnimatePresence>
      {isSpeaking && (
        <motion.div
          key="voice-glow-layer"
          initial={{ opacity: 0, scaleY: 0.8 }}
          animate={{
            opacity: 1,
            scaleY: [1, 1.15, 1],
          }}
          exit={{ opacity: 0, scaleY: 0.8 }}
          transition={{
            opacity: { duration: 0.4 },
            scaleY: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
          }}
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-64 sm:h-80 z-20 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(ellipse 75% 100% at 50% 100%, ${glow.start} 0%, ${glow.mid} 45%, transparent 80%)`,
              filter: 'blur(32px)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceGlow;
