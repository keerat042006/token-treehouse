import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { fireBurst } from '@/components/EcoConfetti';

interface Props {
  onWin: (tcc: number) => void;
}

interface Obj { id: number; x: number; y: number; type: 'cloud' | 'recycle'; }

const CANVAS_H = 200;
const GROUND_Y = CANVAS_H - 30;
const PLAYER_X = 40;

export const EcoRunner = ({ onWin }: Props) => {
  const [playerY, setPlayerY] = useState(GROUND_Y);
  const [vy, setVy] = useState(0);
  const [jumps, setJumps] = useState(0); // for double jump
  const [objs, setObjs] = useState<Obj[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => parseInt(localStorage.getItem('ef-runner-best') || '0'));
  const [over, setOver] = useState(false);
  const [running, setRunning] = useState(false);
  const speedRef = useRef(3);
  const idRef = useRef(0);
  const bgOffsetRef = useRef(0);
  const [bgOffset, setBgOffset] = useState(0);

  // physics + spawn
  useEffect(() => {
    if (!running || over) return;
    let raf: number;
    let frame = 0;
    const tick = () => {
      frame++;
      // gravity
      setPlayerY((y) => {
        const ny = Math.min(GROUND_Y, y + vy);
        return ny;
      });
      setVy((v) => {
        if (playerY >= GROUND_Y) return 0;
        return v + 0.6;
      });
      if (playerY >= GROUND_Y && jumps > 0) setJumps(0);

      // move objects
      setObjs((prev) => {
        const next: Obj[] = [];
        for (const o of prev) {
          const nx = o.x - speedRef.current;
          if (nx < -30) continue;
          next.push({ ...o, x: nx });
        }
        return next;
      });

      // spawn
      if (frame % 70 === 0) {
        const isCloud = Math.random() > 0.45;
        setObjs((p) => [
          ...p,
          {
            id: ++idRef.current,
            x: 600,
            y: isCloud ? GROUND_Y : GROUND_Y - 20 - Math.random() * 50,
            type: isCloud ? 'cloud' : 'recycle',
          },
        ]);
      }

      // score
      if (frame % 6 === 0) setScore((s) => s + 1);
      // speed up
      if (frame % 600 === 0) speedRef.current = Math.min(8, speedRef.current + 0.5);
      // bg scroll
      bgOffsetRef.current = (bgOffsetRef.current + speedRef.current) % 80;
      setBgOffset(bgOffsetRef.current);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, over, vy, playerY, jumps]);

  // collision
  useEffect(() => {
    for (const o of objs) {
      const dx = Math.abs(o.x - PLAYER_X);
      const dy = Math.abs(o.y - playerY);
      if (dx < 22 && dy < 25) {
        if (o.type === 'cloud') {
          end();
          return;
        } else {
          setScore((s) => s + 15);
          fireBurst(0.2, 0.6);
          setObjs((p) => p.filter((x) => x.id !== o.id));
        }
      }
    }
  }, [objs, playerY]);

  const jump = () => {
    if (over || !running) return;
    if (jumps < 2) {
      setVy(-11);
      setJumps((j) => j + 1);
    }
  };

  const start = () => {
    setRunning(true);
    setOver(false);
    setScore(0);
    setObjs([]);
    setPlayerY(GROUND_Y);
    setVy(0);
    setJumps(0);
    speedRef.current = 3;
  };

  const end = () => {
    setOver(true);
    setRunning(false);
    const tcc = Math.round(score / 5);
    if (score > best) {
      setBest(score);
      localStorage.setItem('ef-runner-best', String(score));
    }
    onWin(tcc);
    fireBurst();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); jump(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm font-semibold text-white">
        <span>Score <span className="text-glow-eco text-eco-green">{score}</span></span>
        <span>Best <span className="text-eco-amber">{best}</span></span>
      </div>

      <div
        onClick={jump}
        className="relative w-full overflow-hidden rounded-xl cursor-pointer"
        style={{
          height: CANVAS_H,
          background: `linear-gradient(180deg, #0a1f17 0%, #0d2118 70%, #1a3328 100%)`,
          border: '1px solid rgba(0,229,160,0.2)',
          backgroundImage: `linear-gradient(180deg, #0a1f17 0%, #0d2118 70%, #1a3328 100%), repeating-linear-gradient(90deg, transparent 0 40px, rgba(0,229,160,0.08) 40px 42px)`,
          backgroundPosition: `0 0, ${-bgOffset}px ${GROUND_Y + 5}px`,
          backgroundRepeat: 'no-repeat, repeat-x',
        }}
      >
        {/* ground line */}
        <div className="absolute left-0 right-0" style={{ top: GROUND_Y + 25, height: 1, background: 'rgba(0,229,160,0.3)' }} />
        {/* player */}
        <div className="absolute text-2xl select-none" style={{ left: PLAYER_X, top: playerY - 5, transform: 'translateX(-50%)' }}>🧑</div>
        {/* objects */}
        {objs.map((o) => (
          <div key={o.id} className="absolute text-2xl select-none" style={{ left: o.x, top: o.y - 5, transform: 'translateX(-50%)' }}>
            {o.type === 'cloud' ? '☁️' : '♻️'}
          </div>
        ))}

        {!running && !over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
            <p className="text-white font-bold mb-3">Tap or press SPACE to jump</p>
            <Button onClick={start} className="btn-eco">START</Button>
          </div>
        )}
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <p className="text-3xl mb-2">💀</p>
            <p className="text-white font-bold">Game Over · {score} pts</p>
            <p className="text-eco-amber font-bold text-glow-amber my-2">+{Math.round(score / 5)} TCC</p>
            <Button onClick={start} className="btn-eco">Run Again</Button>
          </div>
        )}
      </div>
      <p className="text-[11px] text-center text-muted-foreground-2">Double jump available · ♻️ +15 · ☁️ ends run</p>
    </div>
  );
};
