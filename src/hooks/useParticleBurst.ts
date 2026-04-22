import { useCallback } from 'react';

/**
 * useParticleBurst — spawns 18-24 particles + ripple ring on click.
 * Particles fly outward in #00e5a0 / #00ff88, fade over 0.6s, then are removed.
 * A ripple ring expands from the click point and fades over 0.4s.
 */
export const useParticleBurst = () => {
  const burst = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    const count = 18 + Math.floor(Math.random() * 7); // 18-24
    const colors = ['#00e5a0', '#00ff88', '#00c2ff', '#00e5a0'];

    // --- Ripple ring ---
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      border: 2px solid #00e5a0;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 99999;
      animation: ripple-expand 0.4s ease-out forwards;
    `;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 450);

    // --- Particles ---
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const angle = (i / count) * 360 + Math.random() * 20;
      const distance = 40 + Math.random() * 80;
      const size = 4 + Math.random() * 6;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rad = (angle * Math.PI) / 180;
      const vx = Math.cos(rad) * distance;
      const vy = Math.sin(rad) * distance;

      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 99999;
        animation: particle-fly 0.6s ease-out forwards;
        --vx: ${vx}px;
        --vy: ${vy}px;
      `;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 650);
    }
  }, []);

  return burst;
};
