import { Badge } from '@/components/ui/badge';

const colors = {
  Bronze: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Silver: 'bg-slate-400/15 text-slate-300 border-slate-400/30',
  Gold: 'bg-yellow-400/15 text-yellow-300 border-yellow-400/30',
};

export const LevelBadge = ({ level }: { level: 'Bronze' | 'Silver' | 'Gold' }) => (
  <Badge variant="outline" className={`${colors[level]} font-semibold text-xs`}>
    {level === 'Gold' ? '🥇' : level === 'Silver' ? '🥈' : '🥉'} {level} Recycler
  </Badge>
);
