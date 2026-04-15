import { Badge } from '@/components/ui/badge';

const colors = {
  Bronze: 'bg-amber-100 text-amber-700 border-amber-300',
  Silver: 'bg-slate-100 text-slate-600 border-slate-300',
  Gold: 'bg-yellow-100 text-yellow-700 border-yellow-300',
};

export const LevelBadge = ({ level }: { level: 'Bronze' | 'Silver' | 'Gold' }) => (
  <Badge variant="outline" className={`${colors[level]} font-semibold text-xs`}>
    {level === 'Gold' ? '🥇' : level === 'Silver' ? '🥈' : '🥉'} {level} Recycler
  </Badge>
);
