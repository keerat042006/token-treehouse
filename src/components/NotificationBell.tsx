import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Truck, Coins, Trophy, Gamepad2, Recycle } from 'lucide-react';

interface Notification {
  id: string;
  icon: any;
  title: string;
  desc: string;
  time: string;
  color: string;
  unread: boolean;
}

const initial: Notification[] = [
  { id: '1', icon: Truck, title: 'Pickup confirmed', desc: 'Your Apr 22 pickup is confirmed', time: '2 hours ago', color: 'hsl(var(--eco-blue))', unread: true },
  { id: '2', icon: Coins, title: 'TCC credited', desc: '+84 TCC added for Laptop submission', time: 'Yesterday', color: 'hsl(var(--eco-amber))', unread: true },
  { id: '3', icon: Trophy, title: 'Rank up', desc: 'You moved to Rank 3 in your city!', time: '2 days ago', color: 'hsl(var(--eco-green))', unread: true },
  { id: '4', icon: Gamepad2, title: 'New game', desc: 'PinballEco is now unlocked in Arcade', time: '3 days ago', color: 'hsl(var(--eco-coral))', unread: true },
  { id: '5', icon: Recycle, title: 'Streak bonus', desc: '2x TCC streak bonus is now active', time: '4 days ago', color: 'hsl(var(--eco-teal))', unread: true },
];

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>(initial);
  const wrapRef = useRef<HTMLDivElement>(null);
  const unread = items.filter((i) => i.unread).length;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const markAll = () => setItems((arr) => arr.map((x) => ({ ...x, unread: false })));

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-10 h-10 rounded-xl flex items-center justify-center surface-raised hover:border-eco-blue/40 transition"
        aria-label="Notifications"
      >
        <Bell className="w-4.5 h-4.5 text-muted-foreground-2" />
        {unread > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-eco-coral text-white text-[10px] font-bold flex items-center justify-center"
            style={{ boxShadow: '0 0 8px hsl(var(--eco-coral))' }}
          >
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="absolute right-0 top-[64px] w-[360px] max-w-[calc(100vw-32px)] z-50 rounded-2xl overflow-hidden"
            style={{
              background: '#0d2118',
              border: '1px solid rgba(0,229,160,0.2)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <p className="text-sm font-bold text-white">Notifications</p>
              <button
                onClick={markAll}
                className="text-xs font-semibold text-eco-green hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            </div>
            <div className="max-h-[420px] overflow-y-auto">
              {items.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition border-b border-white/5"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${n.color.replace(')', ' / 0.15)')}`, border: `1px solid ${n.color.replace(')', ' / 0.3)')}` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: n.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{n.title}</p>
                      <p className="text-xs text-muted-foreground-2 mt-0.5">{n.desc}</p>
                      <p className="text-[10px] text-muted-foreground-2 mt-1">{n.time}</p>
                    </div>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-eco-green mt-2 shrink-0" style={{ boxShadow: '0 0 6px #00e5a0' }} />}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
