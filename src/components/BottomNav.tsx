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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border px-2 py-1 safe-area-bottom shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-primary/10' : ''}`}>
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
