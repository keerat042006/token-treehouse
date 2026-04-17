import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Recycle, Truck, ShoppingBag, User } from 'lucide-react';

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/sell', icon: Recycle, label: 'Sell' },
  { to: '/pickup', icon: Truck, label: 'Pickup' },
  { to: '/redeem', icon: ShoppingBag, label: 'Redeem' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-forest-darker/95 backdrop-blur-xl border-t border-border px-2 py-1.5"
      style={{ boxShadow: '0 -8px 32px -8px rgba(0,0,0,0.5)' }}
    >
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="relative flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl"
            >
              <motion.div
                animate={active ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                className="relative p-1"
              >
                <Icon
                  className="w-5 h-5"
                  strokeWidth={active ? 2.4 : 1.8}
                  style={{
                    color: active ? 'hsl(var(--lime))' : 'hsl(var(--cream) / 0.4)',
                    filter: active ? 'drop-shadow(0 0 8px hsl(var(--lime) / 0.6))' : undefined,
                  }}
                />
              </motion.div>
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{ color: active ? 'hsl(var(--lime))' : 'hsl(var(--cream) / 0.4)' }}
              >
                {label}
              </span>
              {active && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                  style={{ background: 'hsl(var(--lime))', boxShadow: '0 0 8px hsl(var(--lime))' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
