import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface Badge {
  emoji: string;
  name: string;
  unlocked: boolean;
}

const badges: Badge[] = [
  { emoji: '🥇', name: 'First Pickup', unlocked: true },
  { emoji: '💯', name: '100kg Club', unlocked: true },
  { emoji: '🔥', name: 'Week Streak', unlocked: true },
  { emoji: '🌍', name: 'CO₂ Fighter', unlocked: false },
  { emoji: '🏆', name: 'Gold Recycler', unlocked: false },
  { emoji: '⚡', name: 'Speed Sorter', unlocked: false },
];

export const Achievements = () => (
  <div className="glass-deep p-5 rounded-2xl">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="section-label">Achievements</p>
        <h3 className="text-lg font-bold text-white mt-0.5">Your badges</h3>
      </div>
      <span className="text-xs text-muted-foreground-2">3 of 6</span>
    </div>
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
      {badges.map((b, i) => (
        <motion.div
          key={b.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="shrink-0 flex flex-col items-center gap-1.5"
          style={{ opacity: b.unlocked ? 1 : 0.4 }}
        >
          <div
            className="hexagon w-20 h-20 flex items-center justify-center text-3xl relative"
            style={{
              background: b.unlocked
                ? 'linear-gradient(135deg, hsl(var(--eco-green) / 0.4), hsl(var(--eco-amber) / 0.3))'
                : 'rgba(255,255,255,0.05)',
              filter: b.unlocked ? 'drop-shadow(0 0 12px rgba(0,229,160,0.4))' : 'grayscale(1)',
            }}
          >
            {b.emoji}
            {!b.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 hexagon">
                <Lock className="w-5 h-5 text-white/70" />
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold text-white text-center w-20 leading-tight">{b.name}</span>
        </motion.div>
      ))}
    </div>
  </div>
);
