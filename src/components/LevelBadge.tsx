import { Recycle } from 'lucide-react';

const styles = {
  Bronze: { cls: 'bronze-shimmer', label: 'Bronze Recycler' },
  Silver: { cls: 'silver-shimmer', label: 'Silver Recycler' },
  Gold: { cls: 'gold-shimmer', label: 'Gold Recycler' },
};

export const LevelBadge = ({ level, size = 'md' }: { level: 'Bronze' | 'Silver' | 'Gold'; size?: 'sm' | 'md' }) => {
  const s = styles[level];
  const sz = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold ${sz} ${s.cls}`}>
      <Recycle className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} strokeWidth={2.6} />
      {s.label}
    </span>
  );
};
