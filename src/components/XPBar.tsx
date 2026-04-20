import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

interface XPBarProps {
  current: number;
  target: number;
  fromLabel?: string;
  toLabel?: string;
}

export const XPBar = ({ current, target, fromLabel = 'Silver', toLabel = 'Gold' }: XPBarProps) => {
  const pct = Math.min(100, (current / target) * 100);
  return (
    <div className="px-4 py-3 mx-3 mt-3 rounded-2xl glass-deep">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-1.5">
        <span className="text-muted-foreground-2 flex items-center gap-1">
          <Award className="w-3 h-3 text-eco-green" /> {fromLabel}
        </span>
        <span className="text-eco-amber">{toLabel}</span>
      </div>
      <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #00e5a0, #34d399, hsl(var(--eco-amber)))',
            boxShadow: '0 0 12px rgba(0,229,160,0.6)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground-2 mt-1.5">
        <span className="text-glow-eco font-bold text-eco-green">{current}</span> / {target} TCC
      </p>
    </div>
  );
};
