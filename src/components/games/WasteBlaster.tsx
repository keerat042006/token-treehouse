import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { fireBurst } from '@/components/EcoConfetti';

interface Props {
  onWin: (tcc: number) => void;
}

interface Item { id: number; x: number; y: number; emoji: string; }
interface Bullet { id: number; x: number; y: number; }

const WASTE = ['🗑️', '📦', '🧴', '💻', '📱'];
const ARENA_W = 100; // %
const ARENA_H = 280; // px

export const WasteBlaster = ({ onWin }: Props) => {
  const [cannonX, setCannonX] = useState(50);
  const [items, setItems] = useState<Item[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [over, setOver] = useState(false);
  const idRef = useRef(0);
  const speedRef = useRef(0.6);

  // spawn waves
  useEffect(() => {
    if (over) return;
    const spawn = setInterval(() => {
      const newItems: Item[] = Array.from({ length: 3 }).map(() => ({
        id: ++idRef.current,
        x: 10 + Math.random() * 80,
        y: -10 - Math.random() * 30,
        emoji: WASTE[Math.floor(Math.random() * WASTE.length)],
      }));
      setItems((prev) => [...prev, ...newItems]);
    }, 1800);
    return () => clearInterval(spawn);
  }, [over]);

  // game loop
  useEffect(() => {
    if (over) return;
    let raf: number;
    const tick = () => {
      setItems((prev) => {
        const next: Item[] = [];
        let lifeLost = false;
        for (const it of prev) {
          const ny = it.y + speedRef.current;
          if (ny > ARENA_H - 20) {
            lifeLost = true;
            continue;
          }
          next.push({ ...it, y: ny });
        }
        if (lifeLost) {
          setLives((l) => {
            const nl = l - 1;
            if (nl <= 0) setOver(true);
            return Math.max(0, nl);
          });
        }
        return next;
      });
      setBullets((prev) => prev.map((b) => ({ ...b, y: b.y - 8 })).filter((b) => b.y > -20));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [over]);

  // collision
  useEffect(() => {
    setItems((prevItems) => {
      const remaining: Item[] = [];
      const usedBullets = new Set<number>();
      for (const it of prevItems) {
        let hit = false;
        for (const b of bullets) {
          if (usedBullets.has(b.id)) continue;
          const dx = Math.abs(b.x - it.x);
          const dy = Math.abs(b.y - it.y);
          if (dx < 6 && dy < 30) {
            hit = true;
            usedBullets.add(b.id);
            setScore((s) => s + 10);
            break;
          }
        }
        if (!hit) remaining.push(it);
      }
      if (usedBullets.size > 0) {
        setBullets((bs) => bs.filter((b) => !usedBullets.has(b.id)));
      }
      return remaining;
    });
  }, [bullets]);

  // wave speed up
  useEffect(() => {
    if (score > 0 && score % 100 === 0) {
      setWave((w) => w + 1);
      speedRef.current *= 1.15;
    }
  }, [score]);

  // controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (over) return;
      if (e.key === 'ArrowLeft') setCannonX((x) => Math.max(5, x - 5));
      if (e.key === 'ArrowRight') setCannonX((x) => Math.min(95, x + 5));
      if (e.code === 'Space') { e.preventDefault(); fire(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const fire = () => {
    if (over) return;
    setBullets((bs) => [...bs, { id: ++idRef.current, x: cannonX, y: ARENA_H - 30 }]);
  };

  const reset = () => {
    setCannonX(50);
    setItems([]);
    setBullets([]);
    setScore(0);
    setWave(1);
    setLives(3);
    setOver(false);
    speedRef.current = 0.6;
  };

  if (over) {
    const tcc = Math.round(score / 2);
    return (
      <div className="text-center py-10 space-y-4">
        <div className="text-5xl">💥</div>
        <h3 className="text-2xl font-extrabold text-white">Game Over</h3>
        <p className="text-muted-foreground-2">Final Score: <span className="text-glow-eco text-eco-green font-bold">{score}</span></p>
        <p className="text-eco-amber font-bold text-glow-amber">+{tcc} TCC earned</p>
        <Button onClick={() => { fireBurst(); onWin(tcc); reset(); }} className="btn-eco">Play Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm font-semibold text-white">
        <span>Score <span className="text-glow-eco text-eco-green">{score}</span></span>
        <span>Wave <span className="text-eco-blue">{wave}</span></span>
        <span>Lives {'❤️'.repeat(lives)}</span>
      </div>

      <div
        className="relative w-full rounded-xl overflow-hidden"
        style={{ height: ARENA_H, background: 'linear-gradient(180deg, #050d0a, #0d2118)', border: '1px solid rgba(0,229,160,0.2)' }}
      >
        {items.map((it) => (
          <div key={it.id} className="absolute text-2xl select-none" style={{ left: `${it.x}%`, top: it.y, transform: 'translateX(-50%)' }}>
            {it.emoji}
          </div>
        ))}
        {bullets.map((b) => (
          <div key={b.id} className="absolute w-1.5 h-4 rounded-full bg-eco-green shadow-[0_0_10px_#00e5a0]" style={{ left: `${b.x}%`, top: b.y, transform: 'translateX(-50%)' }} />
        ))}
        <div className="absolute text-3xl select-none" style={{ left: `${cannonX}%`, bottom: 4, transform: 'translateX(-50%)' }}>🎯</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button onClick={() => setCannonX((x) => Math.max(5, x - 6))} className="bg-surface-raised text-white">◀</Button>
        <Button onClick={fire} className="btn-eco font-bold">FIRE 🔥</Button>
        <Button onClick={() => setCannonX((x) => Math.min(95, x + 6))} className="bg-surface-raised text-white">▶</Button>
      </div>
      <p className="text-[11px] text-center text-muted-foreground-2">Arrow keys to move • Space to fire</p>
    </div>
  );
};
