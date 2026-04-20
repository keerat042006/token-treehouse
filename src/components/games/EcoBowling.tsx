import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fireBurst } from '@/components/EcoConfetti';

interface Props {
  onWin: (tcc: number) => void;
}

interface PinState {
  id: number;
  down: boolean;
}

const initialPins = (): PinState[] => Array.from({ length: 10 }, (_, i) => ({ id: i, down: false }));
// pin layout 4 rows: 1,2,3,4 from front
const ROW_LAYOUT: number[][] = [[0], [1, 2], [3, 4, 5], [6, 7, 8, 9]];

export const EcoBowling = ({ onWin }: Props) => {
  const [aim, setAim] = useState(0);
  const [pins, setPins] = useState<PinState[]>(initialPins());
  const [frame, setFrame] = useState(1);
  const [roll, setRoll] = useState<1 | 2>(1);
  const [score, setScore] = useState(0);
  const [throwing, setThrowing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [ballPos, setBallPos] = useState(0);
  const totalEarned = useRef(0);

  const standing = pins.filter((p) => !p.down).length;

  const handleThrow = () => {
    if (throwing || frame > 10) return;
    setThrowing(true);
    setBallPos(1);
    setTimeout(() => {
      // accuracy: 0 = perfect center, ±60 = worst
      const accuracy = 1 - Math.abs(aim) / 60;
      // available standing pins
      const avail = pins.map((p, i) => (!p.down ? i : -1)).filter((i) => i >= 0);
      const minK = Math.max(1, Math.floor(avail.length * (accuracy * 0.4 + 0.1)));
      const maxK = Math.min(avail.length, Math.ceil(avail.length * (accuracy * 0.7 + 0.3)));
      let knock = minK + Math.floor(Math.random() * (maxK - minK + 1));
      if (accuracy > 0.85 && roll === 1 && Math.random() > 0.4) knock = avail.length;

      const toKnock = [...avail].sort(() => Math.random() - 0.5).slice(0, knock);
      const newPins = pins.map((p, i) => (toKnock.includes(i) ? { ...p, down: true } : p));
      setPins(newPins);

      let frameScore = knock;
      let msg: string | null = null;
      if (roll === 1 && knock === avail.length && avail.length === 10) {
        frameScore += 15;
        msg = '🎯 STRIKE!';
        fireBurst(0.5, 0.5);
      } else if (roll === 2 && newPins.every((p) => p.down)) {
        frameScore += 8;
        msg = '✨ SPARE!';
        fireBurst(0.5, 0.5);
      }
      setScore((s) => s + frameScore);
      totalEarned.current += frameScore;
      setMessage(msg);
      setBallPos(0);

      setTimeout(() => {
        setMessage(null);
        // advance roll/frame
        const allDown = newPins.every((p) => p.down);
        if (roll === 1 && !allDown && frame < 10) {
          setRoll(2);
        } else {
          // next frame
          if (frame >= 10) {
            // game over
            const tcc = totalEarned.current;
            setMessage(`🏆 Final: ${tcc} TCC`);
            onWin(tcc);
          } else {
            setFrame((f) => f + 1);
            setRoll(1);
            setPins(initialPins());
          }
        }
        setThrowing(false);
      }, 900);
    }, 700);
  };

  const reset = () => {
    setPins(initialPins());
    setFrame(1);
    setRoll(1);
    setScore(0);
    setMessage(null);
    totalEarned.current = 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm font-semibold text-white">
        <span>Frame <span className="text-eco-blue">{Math.min(frame, 10)}/10</span></span>
        <span>Roll <span className="text-eco-amber">{roll}</span></span>
        <span>Score <span className="text-glow-eco text-eco-green">{score}</span></span>
        <span>Pins {standing}</span>
      </div>

      {/* Lane */}
      <div
        className="relative h-72 mx-auto rounded-2xl overflow-hidden"
        style={{
          width: '100%',
          maxWidth: 380,
          background: 'linear-gradient(180deg, #1a1208 0%, #2d1f0e 100%)',
          transform: 'perspective(600px) rotateX(40deg)',
          transformOrigin: 'bottom',
          border: '2px solid #5a3e1a',
        }}
      >
        {/* lane lines */}
        <div className="absolute inset-x-0 top-0 bottom-0 flex justify-between px-4 opacity-30">
          {[0, 1, 2, 3].map((i) => <div key={i} className="w-px h-full bg-amber-200/40" />)}
        </div>

        {/* Pins triangle */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          {ROW_LAYOUT.map((row, ri) => (
            <div key={ri} className="flex gap-2">
              {row.map((pinIdx) => {
                const p = pins[pinIdx];
                return (
                  <motion.div
                    key={pinIdx}
                    className="w-5 h-7 rounded-t-full bg-white shadow"
                    animate={p.down ? { scale: 0.1, rotate: 90, opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Ball */}
        <motion.div
          className="absolute bottom-2 w-7 h-7 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #c084fc, #6b21a8)',
            left: `calc(50% + ${aim * 0.6}px)`,
            transform: 'translateX(-50%)',
          }}
          animate={{ bottom: ballPos ? '85%' : '8px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>

      {/* Aim slider */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground-2 font-semibold">Aim ({aim > 0 ? `→${aim}` : aim < 0 ? `←${Math.abs(aim)}` : 'center'})</label>
        <input
          type="range"
          min={-60}
          max={60}
          value={aim}
          onChange={(e) => setAim(parseInt(e.target.value))}
          disabled={throwing}
          className="w-full accent-eco-blue"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleThrow} disabled={throwing || frame > 10} className="btn-eco flex-1 h-11 font-bold">
          🎳 THROW
        </Button>
        <Button onClick={reset} variant="outline" className="bg-surface-raised border-border text-white">Reset</Button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="text-center text-3xl font-extrabold text-eco-amber text-glow-amber"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
