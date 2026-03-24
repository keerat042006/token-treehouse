import { Link, useLocation } from 'react-router-dom';
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-none rounded-t-2xl border-t border-border/60 px-2 py-1 safe-area-bottom">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-primary scale-105'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
