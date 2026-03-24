import { Badge } from '@/components/ui/badge';

const colors = {
  Bronze: 'bg-amber-700/20 text-amber-800 border-amber-700/30',
  Silver: 'bg-slate-400/20 text-slate-700 border-slate-400/30',
  Gold: 'bg-yellow-400/20 text-yellow-700 border-yellow-500/30',
};

export const LevelBadge = ({ level }: { level: 'Bronze' | 'Silver' | 'Gold' }) => (
  <Badge variant="outline" className={`${colors[level]} font-semibold text-xs`}>
    {level === 'Gold' ? '🥇' : level === 'Silver' ? '🥈' : '🥉'} {level} Recycler
  </Badge>
);
