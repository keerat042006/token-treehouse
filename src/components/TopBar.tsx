import { useUser } from '@/lib/UserContext';
import { TokenBadge } from '@/components/TokenBadge';
import { LevelBadge } from '@/components/LevelBadge';
import { Leaf, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Recycle, Truck, ShoppingBag, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/sell', icon: Recycle, label: 'Sell Waste' },
  { to: '/pickup', icon: Truck, label: 'Pickup' },
  { to: '/redeem', icon: ShoppingBag, label: 'Redeem' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const TopBar = () => {
  const user = useUser();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left: mobile menu + logo (logo only on mobile since sidebar has it on desktop) */}
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 border-b border-border">
                <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 eco-gradient rounded-xl flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold text-foreground">TrashCash</span>
                </Link>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map(({ to, icon: Icon, label }) => {
                  const active = pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 eco-gradient rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">TrashCash</span>
          </Link>
        </div>

        {/* Right: user info */}
        {user.isLoggedIn && (
          <div className="flex items-center gap-3">
            <TokenBadge amount={user.tokens} />
            <LevelBadge level={user.level} />
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary hover:bg-primary/20 transition-colors"
            >
              {user.name.charAt(0)}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
