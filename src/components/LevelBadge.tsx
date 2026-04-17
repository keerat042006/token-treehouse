import { Recycle } from 'lucide-react';

const styles = {
  Bronze: { bg: 'hsl(30 80% 65%)', fg: 'hsl(var(--forest-deep))', label: 'Bronze Recycler' },
  Silver: { bg: 'hsl(var(--lime))', fg: 'hsl(var(--forest-deep))', label: 'Silver Recycler' },
  Gold: { bg: 'hsl(var(--amber))', fg: 'hsl(var(--forest-deep))', label: 'Gold Recycler' },
};

export const LevelBadge = ({ level }: { level: 'Bronze' | 'Silver' | 'Gold' }) => {
  const s = styles[level];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: s.bg, color: s.fg, boxShadow: `0 4px 14px -4px ${s.bg}` }}
    >
      <Recycle className="w-3 h-3" strokeWidth={2.6} />
      {s.label}
    </span>
  );
};
