import confetti from 'canvas-confetti';

export const fireConfetti = () => {
  const count = 200;
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#22c55e', '#16a34a', '#4ade80'] });
  fire(0.2, { spread: 60, colors: ['#facc15', '#fbbf24', '#f59e0b'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#22c55e', '#facc15', '#86efac'] });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#4ade80', '#fde047'] });
  fire(0.1, { spread: 120, startVelocity: 45, colors: ['#22c55e', '#facc15'] });
};

export const fireTokenRain = () => {
  const duration = 1500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ['#facc15', '#f59e0b', '#fbbf24'],
      zIndex: 9999,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ['#facc15', '#f59e0b', '#fbbf24'],
      zIndex: 9999,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
};
