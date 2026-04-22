import { useEffect, useRef } from 'react';

/**
 * useTilt — adds 3D mouse tilt to any HTMLElement via ref.
 * Maps cursor offset to rotateX/rotateY (max ±15°) with translateZ pop.
 * Includes a moving glossy shine overlay that follows the cursor.
 */
export const useTilt = <T extends HTMLElement = HTMLDivElement>(opts?: {
  max?: number;
  perspective?: number;
  scale?: number;
}) => {
  const ref = useRef<T | null>(null);
  const max = opts?.max ?? 15;
  const persp = opts?.perspective ?? 800;
  const scale = opts?.scale ?? 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Ensure relative positioning for shine overlay
    const origPosition = el.style.position;
    const origOverflow = el.style.overflow;
    if (!origPosition || origPosition === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';

    // Create glossy shine overlay
    const shine = document.createElement('div');
    shine.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 10;
      background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(0,229,160,0.08) 40%, transparent 70%);
    `;
    el.appendChild(shine);

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotY = Math.max(-max, Math.min(max, dx * max));
      const rotX = Math.max(-max, Math.min(max, -dy * max));

      el.style.transform = `perspective(${persp}px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px) scale(${scale})`;

      // Move shine to follow cursor
      const shineX = ((e.clientX - rect.left) / rect.width) * 100;
      const shineY = ((e.clientY - rect.top) / rect.height) * 100;
      shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.2) 0%, rgba(0,229,160,0.1) 35%, transparent 65%)`;
      shine.style.opacity = '1';
    };

    const onLeave = () => {
      el.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease';
      el.style.transform = 'none';
      shine.style.opacity = '0';
      window.setTimeout(() => {
        if (el) el.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
      }, 400);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (el.contains(shine)) el.removeChild(shine);
      el.style.position = origPosition;
      el.style.overflow = origOverflow;
    };
  }, [max, persp, scale]);

  return ref;
};
