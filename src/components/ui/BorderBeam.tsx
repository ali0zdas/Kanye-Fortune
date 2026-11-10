import React from 'react';
import { EraId } from '../../types/fortune';
import { getEraConfig } from '../../data/eras';

export interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  activeEra?: EraId;
}

const ERA_BEAM_PALETTES: Record<EraId, { from: string; to: string }> = {
  donda: {
    from: '#ffffff',
    to: '#52525b',
  },
  graduation: {
    from: '#ec4899',
    to: '#fbbf24',
  },
  '808s': {
    from: '#06b6d4',
    to: '#f43f5e',
  },
  yeezus: {
    from: '#ef4444',
    to: '#cbd5e1',
  },
};

/**
 * BorderBeam component inspired by Jakub Antalik's Libraries.dev (libraries.dev/beam)
 * Traces an animated, glowing light beam along the perimeter of cards and modals.
 */
export const BorderBeam: React.FC<BorderBeamProps> = ({
  className = '',
  duration = 8,
  borderWidth = 2,
  colorFrom,
  colorTo,
  activeEra = 'donda',
}) => {
  const palette = ERA_BEAM_PALETTES[activeEra] || ERA_BEAM_PALETTES.donda;
  const fromColor = colorFrom || palette.from;
  const toColor = colorTo || palette.to;
  const eraConfig = getEraConfig(activeEra);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-10 ${className}`}
      style={{
        padding: `${borderWidth}px`,
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
      }}
    >
      <div
        className="absolute inset-[-150%] animate-border-beam"
        style={{
          animationDuration: `${duration}s`,
          background: `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${fromColor} 325deg, ${toColor} 360deg)`,
          filter: `drop-shadow(0 0 8px ${eraConfig.colors.glow})`,
        }}
      />
    </div>
  );
};

export default BorderBeam;
