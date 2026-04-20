import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { fireBurst } from '@/components/EcoConfetti';

interface Props {
  onWin: (tcc: number) => void;
}

const W = 260;
const H = 380;
const BUMPERS = [
  { x: 60, y: 80 }, { x: 130, y: 60 }, { x: 200, y: 80 },
  { x: 80, y: 150 }, { x: 180, y: 150 }, { x: 130, y: 200 },
];

export const PinballEco = ({ onWin }: Props) => {
  const [pos, setPos] = useState({ x: W / 2, y: H - 60 });
  const [vel, setVel] = useState({ x: 1.5, y: -3 });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [flashId, setFlashId] = useState<number | null>(null);
  const [leftFlip, setLeftFlip] = useState(false);
  const [rightFlip, setRightFlip] = useState(false);
  const [over, setOver] = useState(false);
  const [running, setRunning] = useState(false);
  const totalRef = useRef(0);

  // physics loop
  useEffect(() => {
    if (!running || over) return;
    let raf: number;
    const tick = () => {
      setPos((p) => {
        let nx = p.x + vel.x;
        let ny = p.y + vel.y;
        let nvx = vel.x;
        let nvy = vel.y + 0.15; // gravity

        // walls
        if (nx < 8) { nx = 8; nvx = Math.abs(nvx); }
        if (nx > W - 8) { nx = W - 8; nvx = -Math.abs(nvx); }
        if (ny < 8) { ny = 8; nvy = Math.abs(nvy); }

        // bumpers
        for (let i = 0; i < BUMPERS.length; i++) {
          const b = BUMPERS[i];
          const dx = nx - b.x;
          const dy = ny - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 22) {
            const ang = Math.atan2(dy, dx);
            nvx = Math.cos(ang) * 5;
            nvy = Math.sin(ang) * 5;
            nx = b.x + Math.cos(ang) * 23;
            ny = b.y + Math.sin(ang) * 23;
            setScore((s) => s + 100);
            totalRef.current += 100;
            setFlashId(i);
            setTimeout(() => setFlashId(null), 150);
          }
        }

        // flippers — bottom 30px, left flipper x:30-110, right 150-230
        if (ny > H - 40 && ny < H - 10) {
          if (leftFlip && nx > 30 && nx < 110) {
            nvy = -7;
            nvx = (nx - 70) * 0.15 + 1;
          }
          if (rightFlip && nx > 150 && nx < 230) {
            nvy = -7;
            nvx = (nx - 190) * 0.15 - 1;
          }
        }

        // out
        if (ny > H - 5) {
          setLives((l) => {
            const nl = l - 1;
            if (nl <= 0) {
              setOver(true);
              setRunning(false);
              onWin(Math.round(totalRef.current / 20));
              fireBurst();
            }
            return Math.max(0, nl);
          });
          // respawn
          nx = W / 2;
          ny = H - 60;
          nvx = 1.5;
          nvy = -3;
        }

        // cap velocity
        nvx = Math.max(-7, Math.min(7, nvx));
        nvy = Math.max(-9, Math.min(9, nvy));

        setVel({ x: nvx, y: nvy });
        return { x: nx, y: ny };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, over, vel, leftFlip, rightFlip]);

  // controls
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'z' || e.key === 'Z') setLeftFlip(true);
      if (e.key === '/') setRightFlip(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'z' || e.key === 'Z') setLeftFlip(false);
      if (e.key === '/') setRightFlip(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const start = () => {
    setRunning(true);
    setOver(false);
    setScore(0);
    setLives(3);
    setPos({ x: W / 2, y: H - 60 });
    setVel({ x: 1.5, y: -3 });
    totalRef.current = 0;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm font-semibold text-white">
        <span>Score <span className="text-glow-eco text-eco-green">{score}</span></span>
        <span>Lives {'❤️'.repeat(lives)}</span>
      </div>

      <div
        className="relative mx-auto rounded-2xl overflow-hidden"
        style={{
          width: W,
          height: H,
          background: 'linear-gradient(180deg, #050d0a, #0d2118)',
          border: '2px solid rgba(0,229,160,0.3)',
        }}
      >
        {/* bumpers */}
        {BUMPERS.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              left: b.x - 18,
              top: b.y - 18,
              width: 36,
              height: 36,
              background: flashId === i ? '#00c2ff' : 'radial-gradient(circle at 30% 30%, #34d399, #047857)',
              boxShadow: flashId === i ? '0 0 24px #00c2ff' : '0 0 12px rgba(0,229,160,0.4)',
              color: '#fff',
            }}
          >
            ♻
          </div>
        ))}

        {/* ball */}
        <div
          className="absolute rounded-full"
          style={{
            left: pos.x - 8,
            top: pos.y - 8,
            width: 16,
            height: 16,
            background: 'radial-gradient(circle at 30% 30%, #ffffff, #94a3b8)',
            boxShadow: '0 0 8px rgba(255,255,255,0.5)',
          }}
        />

        {/* flippers */}
        <div
          className="absolute"
          style={{
            left: 30, top: H - 30, width: 80, height: 8,
            background: '#3b8beb',
            transformOrigin: 'left center',
            transform: `rotate(${leftFlip ? -30 : 15}deg)`,
            transition: 'transform 0.08s',
            borderRadius: 4,
          }}
        />
        <div
          className="absolute"
          style={{
            left: 150, top: H - 30, width: 80, height: 8,
            background: '#3b8beb',
            transformOrigin: 'right center',
            transform: `rotate(${rightFlip ? 30 : -15}deg)`,
            transition: 'transform 0.08s',
            borderRadius: 4,
          }}
        />

        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
            <p className="text-white font-bold mb-3">{over ? 'Game Over' : 'Pinball Eco'}</p>
            {over && <p className="text-eco-amber font-bold text-glow-amber mb-2">+{Math.round(totalRef.current / 20)} TCC</p>}
            <Button onClick={start} className="btn-eco">{over ? 'Play Again' : 'Start'}</Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          onMouseDown={() => setLeftFlip(true)}
          onMouseUp={() => setLeftFlip(false)}
          onTouchStart={() => setLeftFlip(true)}
          onTouchEnd={() => setLeftFlip(false)}
          className="bg-surface-raised text-white font-bold"
        >L (Z)</Button>
        <Button
          onMouseDown={() => setRightFlip(true)}
          onMouseUp={() => setRightFlip(false)}
          onTouchStart={() => setRightFlip(true)}
          onTouchEnd={() => setRightFlip(false)}
          className="bg-surface-raised text-white font-bold"
        >R (/)</Button>
      </div>
    </div>
  );
};
