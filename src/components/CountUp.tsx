import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  className?: string;
}

export const CountUp = ({ end, duration = 1200, decimals = 0, className }: CountUpProps) => {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      setVal(end);
      return;
    }
    startedRef.current = true;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(end * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);

  return <span className={className}>{val.toFixed(decimals)}</span>;
};
