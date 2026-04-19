import { Link, useLocation } from 'react-router-dom';
import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Clock3, Trophy, Info, Recycle, Truck,
  Bell, Menu, X, Coins, LogOut,
} from 'lucide-react';
import { useUser } from '@/lib/UserContext';
import { LevelBadge } from '@/components/LevelBadge';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/sell', label: 'Sell Waste', icon: Recycle },
  { to: '/pickup', label: 'Pickup', icon: Truck },
  { to: '/history', label: 'History', icon: Clock3 },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/about', label: 'About', icon: Info },
];

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5 group">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--eco-blue)), hsl(220 90% 55%))',
        boxShadow: '0 6px 18px -6px hsl(var(--eco-blue) / 0.6)',
      }}
    >
      <Recycle className="w-5 h-5 text-white" strokeWidth={2.5} />
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-extrabold text-white text-lg tracking-tight">EcoFusion</span>
      <span className="text-[9px] font-semibold text-eco-amber tracking-[0.18em] uppercase">Recycle • Earn</span>
    </div>
  </Link>
);

const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { pathname } = useLocation();
  return (
    <nav className="flex flex-col gap-1 p-3">
      {nav.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={`nav-item ${active ? 'nav-item-active' : ''}`}
          >
            <Icon className="w-4.5 h-4.5" strokeWidth={active ? 2.4 : 2} />
            <span>{label}</span>
            {active && <motion.div layoutId="sidebar-dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-eco-blue glow-blue" />}
          </Link>
        );
      })}
    </nav>
  );
};

export const AppShell = ({ children }: { children: ReactNode }) => {
  const user = useUser();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{
          background: 'hsl(var(--surface-nav) / 0.85)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center justify-between px-4 lg:px-6 h-16 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden p-2 -ml-2 text-muted-foreground-2 hover:text-white"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <Logo />
            {/* Desktop top nav links */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {nav.slice(0, 5).map(({ to, label }) => {
                const active = pathname === to;
                return (
                  <Link key={to} to={to} className={`topnav-link ${active ? 'topnav-link-active' : ''}`}>
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {user.isLoggedIn && (
              <>
                <button
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center surface-raised hover:border-eco-blue/40 transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-4.5 h-4.5 text-muted-foreground-2" />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-eco-amber" style={{ boxShadow: '0 0 8px hsl(var(--eco-amber))' }} />
                </button>

                <span className="token-pill hidden sm:inline-flex">
                  <span className="coin-spin inline-flex"><Coins className="w-3.5 h-3.5" /></span>
                  {user.tokens} TC
                </span>

                <div className="hidden md:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl surface-raised">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--eco-blue)), hsl(220 80% 50%))' }}
                  >
                    {user.name.charAt(0) || 'A'}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-semibold text-white">{user.name.split(' ')[0] || 'Guest'}</span>
                    <LevelBadge level={user.level} size="sm" />
                  </div>
                </div>

                <button
                  onClick={user.logout}
                  className="hidden md:flex w-9 h-9 rounded-xl items-center justify-center surface-raised hover:text-eco-coral text-muted-foreground-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        {/* Desktop sidebar */}
        <aside
          className="hidden lg:flex flex-col w-60 shrink-0 sticky top-16 self-start"
          style={{ height: 'calc(100vh - 4rem)' }}
        >
          <div className="flex-1 overflow-y-auto">
            <p className="section-label px-6 pt-5 pb-2">Menu</p>
            <Sidebar />
          </div>
          <div className="p-4 m-3 rounded-2xl surface-raised">
            <p className="text-xs font-bold text-white">Need help?</p>
            <p className="text-[11px] text-muted-foreground-2 mt-0.5">Chat with our eco-team 24/7</p>
            <button className="mt-3 text-xs font-semibold text-eco-blue hover:underline">Open support →</button>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              className="absolute left-0 top-0 bottom-0 w-64 bg-surface-nav border-r border-border flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Logo />
                <button onClick={() => setMobileOpen(false)} className="text-muted-foreground-2 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </div>
        )}

        {/* Main */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};
