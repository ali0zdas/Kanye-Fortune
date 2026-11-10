import React from 'react';

export interface SerratedEdgeProps {
  position?: 'top' | 'bottom';
  className?: string;
  fill?: string;
}

export const SAW_TOOTH_PATH =
  'M0,12 L10,0 L20,12 L30,0 L40,12 L50,0 L60,12 L70,0 L80,12 L90,0 L100,12 L110,0 L120,12 L130,0 L140,12 L150,0 L160,12 L170,0 L180,12 L190,0 L200,12 L210,0 L220,12 L230,0 L240,12 L250,0 L260,12 L270,0 L280,12 L290,0 L300,12 L310,0 L320,12 L330,0 L340,12 L350,0 L360,12 L370,0 L380,12 L390,0 L400,12 Z';

/**
 * Pure SVG saw-tooth perforated jagged edge for thermal receipts.
 * Uses 400x12 viewBox with seamless negative margins.
 */
export const SerratedEdge: React.FC<SerratedEdgeProps> = ({
  position = 'top',
  className = '',
  fill = '#f7f6f2',
}) => {
  const marginClass = position === 'top' ? '-mb-1' : '-mt-1';
  const rotationClass = position === 'bottom' ? 'rotate-180' : '';

  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden leading-none select-none ${marginClass} ${className}`}
    >
      <svg
        viewBox="0 0 400 12"
        className={`w-full h-3 block ${rotationClass}`}
        preserveAspectRatio="none"
        style={{ fill }}
      >
        <path d={SAW_TOOTH_PATH} />
      </svg>
    </div>
  );
};

export default SerratedEdge;
