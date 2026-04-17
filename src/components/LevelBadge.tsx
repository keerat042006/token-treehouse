import { Recycle } from 'lucide-react';

const styles = {
  Bronze: { bg: 'hsl(28 78% 58%)', fg: '#1a1208', label: 'Bronze Recycler' },
  Silver: { bg: 'hsl(var(--primary))', fg: '#ffffff', label: 'Silver Recycler' },
  Gold: { bg: 'hsl(var(--amber))', fg: '#1a1208', label: 'Gold Recycler' },
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
