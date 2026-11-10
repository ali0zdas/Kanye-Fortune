import React, { useEffect, useRef } from 'react';
import { EraId } from '../../types/fortune';

export interface ThinkingOrbProps {
  size?: number;
  activeEra?: EraId;
  mode?: 'thinking' | 'speaking' | 'idle';
  className?: string;
  label?: string;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  angle: number;
  speed: number;
  distance: number;
  opacity: number;
}

const ERA_ORB_COLORS: Record<
  EraId,
  { primary: string; secondary: string; glow: string }
> = {
  donda: {
    primary: '#ffffff',
    secondary: '#a1a1aa',
    glow: 'rgba(255, 255, 255, 0.45)',
  },
  graduation: {
    primary: '#ec4899',
    secondary: '#fbbf24',
    glow: 'rgba(236, 72, 153, 0.55)',
  },
  '808s': {
    primary: '#06b6d4',
    secondary: '#f43f5e',
    glow: 'rgba(6, 182, 212, 0.55)',
  },
  yeezus: {
    primary: '#ef4444',
    secondary: '#cbd5e1',
    glow: 'rgba(239, 68, 68, 0.55)',
  },
};

/**
 * ThinkingOrb component inspired by Jakub Antalik's Thinking Orbs (libraries.dev/orbs)
 * and Shipnotes Dust Orb (shipnotes-components).
 * Pure HTML5 Canvas 2D particle simulation, zero external assets.
 */
export const ThinkingOrb: React.FC<ThinkingOrbProps> = ({
  size = 64,
  activeEra = 'donda',
  mode = 'thinking',
  className = '',
  label,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Handle High-DPI screens
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const colors = ERA_ORB_COLORS[activeEra] || ERA_ORB_COLORS.donda;
    const center = (size * dpr) / 2;
    const baseRadius = (size * dpr) * 0.28;

    // Initialize 18 floating ambient dust particles
    const particles: Particle[] = Array.from({ length: 18 }, () => ({
      x: 0,
      y: 0,
      radius: Math.random() * 1.6 + 0.8,
      angle: Math.random() * Math.PI * 2,
      speed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
      distance: baseRadius * (0.6 + Math.random() * 0.7),
      opacity: Math.random() * 0.6 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += mode === 'thinking' ? 0.035 : mode === 'speaking' ? 0.05 : 0.018;

      // 1. Central breathing glowing nucleus
      const pulseScale =
        mode === 'speaking'
          ? 1 + Math.sin(time * 3.5) * 0.18 + Math.cos(time * 1.8) * 0.08
          : mode === 'thinking'
          ? 1 + Math.sin(time * 2.2) * 0.12
          : 1 + Math.sin(time * 1.2) * 0.05;

      const nucleusRadius = baseRadius * 0.55 * pulseScale;
      const gradient = ctx.createRadialGradient(
        center,
        center,
        0,
        center,
        center,
        nucleusRadius * 2
      );
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(0.4, colors.secondary);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(center, center, nucleusRadius * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // 2. Middle dotted orbital ring (Sinusoidal phase wobble)
      const dotCount = 14;
      for (let i = 0; i < dotCount; i++) {
        const angle = (i / dotCount) * Math.PI * 2 + time;
        const wobble = Math.sin(angle * 3 + time * 2) * (baseRadius * 0.08);
        const r = baseRadius * 0.95 + wobble;
        const x = center + Math.cos(angle) * r;
        const y = center + Math.sin(angle) * r;

        ctx.beginPath();
        ctx.arc(x, y, 1.8 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = colors.primary;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 6 * dpr;
        ctx.fill();
      }

      // 3. Outer counter-rotating dots ring
      const outerCount = 18;
      for (let i = 0; i < outerCount; i++) {
        const angle = (i / outerCount) * Math.PI * 2 - time * 0.7;
        const r = baseRadius * 1.35;
        const x = center + Math.cos(angle) * r;
        const y = center + Math.sin(angle) * r;
        const alpha = 0.35 + Math.sin(angle * 2 + time) * 0.3;

        ctx.beginPath();
        ctx.arc(x, y, 1.3 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = colors.secondary;
        ctx.globalAlpha = Math.max(0.1, alpha);
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 4 * dpr;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 4. Floating ambient dust particles (Shipnotes inspired)
      particles.forEach((p) => {
        p.angle += p.speed;
        const x = center + Math.cos(p.angle) * p.distance;
        const y = center + Math.sin(p.angle) * p.distance;

        ctx.beginPath();
        ctx.arc(x, y, p.radius * dpr, 0, Math.PI * 2);
        ctx.fillStyle = colors.primary;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Reset shadow for next frame
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size, activeEra, mode]);

  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <canvas ref={canvasRef} className="block" />
      </div>
      {label && (
        <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 mt-1">
          {label}
        </span>
      )}
    </div>
  );
};

export default ThinkingOrb;
