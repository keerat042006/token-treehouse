import confetti from 'canvas-confetti';

const GREEN = ['#00e5a0', '#10b981', '#34d399', '#a7f3d0'];
const GOLD = ['#F5A623', '#FBBF24', '#F59E0B', '#FCD34D'];

export const fireEcoConfetti = () => {
  const count = 220;
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };
  const fire = (ratio: number, opts: confetti.Options) =>
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * ratio) });

  fire(0.25, { spread: 26, startVelocity: 55, colors: [...GREEN, ...GOLD] });
  fire(0.2, { spread: 60, colors: GOLD });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9, colors: GREEN });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: GOLD });
  fire(0.1, { spread: 120, startVelocity: 45, colors: GREEN });
};

export const fireBurst = (x = 0.5, y = 0.5) => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { x, y },
    colors: [...GREEN, ...GOLD],
    zIndex: 9999,
  });
};
