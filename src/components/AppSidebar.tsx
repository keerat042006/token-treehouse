import { Link, useLocation } from 'react-router-dom';
import { Home, Recycle, Truck, ShoppingBag, User, Leaf } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/sell', icon: Recycle, label: 'Sell Waste' },
  { to: '/pickup', icon: Truck, label: 'Pickup' },
  { to: '/redeem', icon: ShoppingBag, label: 'Redeem' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const AppSidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 eco-gradient rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">TrashCash</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Leaf className="w-3.5 h-3.5 text-primary" />
          <span>TrashCash v1.0 — Hackathon Demo</span>
        </div>
      </div>
    </aside>
  );
};
