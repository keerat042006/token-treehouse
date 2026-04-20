import { useEffect, useRef } from 'react';

/**
 * useTilt — adds 3D mouse tilt to any HTMLElement via ref.
 * Maps cursor offset to rotateX/rotateY between -8..8deg with translateZ pop.
 */
export const useTilt = <T extends HTMLElement = HTMLDivElement>(opts?: {
  max?: number;
  perspective?: number;
  scale?: number;
}) => {
  const ref = useRef<T | null>(null);
  const max = opts?.max ?? 8;
  const persp = opts?.perspective ?? 600;
  const scale = opts?.scale ?? 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ensure transition baseline
    const original = el.style.transition;
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform 0.15s ease';

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotY = Math.max(-max, Math.min(max, dx * max));
      const rotX = Math.max(-max, Math.min(max, -dy * max));
      el.style.transform = `perspective(${persp}px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px) scale(${scale})`;
    };

    const onLeave = () => {
      el.style.transition = 'transform 0.4s ease';
      el.style.transform = 'none';
      // restore the snappy hover transition after reset
      window.setTimeout(() => {
        if (el) el.style.transition = 'transform 0.15s ease';
      }, 400);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (el) el.style.transition = original;
    };
  }, [max, persp, scale]);

  return ref;
};
