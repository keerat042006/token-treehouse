import { motion } from 'framer-motion';
import { Recycle } from 'lucide-react';

interface DailyChallengeProps {
  current: number;
  target: number;
}

export const DailyChallenge = ({ current, target }: DailyChallengeProps) => {
  const pct = Math.min(100, (current / target) * 100);
  const r = 32;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="glass-deep p-5 rounded-2xl flex items-center gap-4">
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <motion.circle
            cx="40" cy="40" r={r} fill="none"
            stroke="url(#dc-grad)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="dc-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00e5a0" />
              <stop offset="100%" stopColor="hsl(var(--eco-amber))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Recycle className="w-6 h-6 text-eco-green" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="section-label">Daily Challenge</p>
        <p className="text-base font-bold text-white mt-0.5">Recycle 5kg today</p>
        <p className="text-xs text-muted-foreground-2 mt-1">
          <span className="text-glow-eco text-eco-green font-bold">{current}</span> / {target} kg complete · {Math.round(pct)}%
        </p>
      </div>
    </div>
  );
};
