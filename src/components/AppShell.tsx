import { Link, useLocation } from 'react-router-dom';
import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Clock3, Trophy, Info, Recycle, Truck,
  Menu, X, Coins, LogOut, Gamepad2,
} from 'lucide-react';
import { useUser } from '@/lib/UserContext';
import { LevelBadge } from '@/components/LevelBadge';
import { NotificationBell } from '@/components/NotificationBell';
import { SupportDrawer } from '@/components/SupportDrawer';
import { XPBar } from '@/components/XPBar';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/sell', label: 'Sell Waste', icon: Recycle },
  { to: '/pickup', label: 'Pickup', icon: Truck },
  { to: '/arcade', label: 'Arcade', icon: Gamepad2 },
  { to: '/history', label: 'History', icon: Clock3 },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/about', label: 'About', icon: Info },
];

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--eco-blue)), hsl(220 90% 50%))',
        boxShadow: '0 4px 14px -5px hsl(var(--eco-blue) / 0.55)',
      }}
    >
      <Recycle className="w-4 h-4 text-white" strokeWidth={2.5} />
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-extrabold text-foreground text-base tracking-tight">EcoFusion</span>
      <span className="text-[8px] font-semibold text-eco-amber tracking-[0.18em] uppercase">Recycle • Earn</span>
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
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--surface-base))]">
      <SupportDrawer open={supportOpen} onClose={() => setSupportOpen(false)} userName={user.name || 'Friend'} />
      {/* Top Nav */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'hsl(var(--surface-nav))',
          borderBottom: '1px solid hsl(var(--border))',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div className="flex items-center justify-between px-4 lg:px-6 h-14 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-5">
            <button
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <Logo />
            {/* Desktop top nav links */}
            <nav className="hidden lg:flex items-center gap-0.5 ml-3">
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
                {/* Greeting — visible on desktop, aligned right */}
                <span className="hidden md:inline text-sm font-semibold text-foreground">
                  Hey, {user.name.split(' ')[0] || 'Friend'} 👋
                </span>

                <NotificationBell />

                <span className="token-pill">
                  <span className="coin-spin inline-flex"><Coins className="w-3 h-3" /></span>
                  {user.tokens} TCC
                </span>

                <div className="hidden md:flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg surface-raised">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--eco-blue)), hsl(220 80% 45%))' }}
                  >
                    {user.name.charAt(0) || 'A'}
                  </div>
                  <LevelBadge level={user.level} size="sm" />
                </div>

                <button
                  onClick={user.logout}
                  className="hidden md:flex w-8 h-8 rounded-lg items-center justify-center surface-raised hover:text-eco-coral text-muted-foreground"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        {/* Desktop sidebar */}
        <aside
          className="hidden lg:flex flex-col w-52 shrink-0 sticky top-14 self-start border-r border-border bg-[hsl(var(--surface-nav))]"
          style={{ height: 'calc(100vh - 3.5rem)' }}
        >
          <div className="flex-1 overflow-y-auto">
            {user.isLoggedIn && <XPBar current={user.tokens} target={1000} fromLabel="Silver" toLabel="Gold" />}
            <p className="section-label px-5 pt-4 pb-1.5">Menu</p>
            <Sidebar />
          </div>
          <div className="p-3.5 m-2.5 rounded-xl border border-border bg-[hsl(var(--surface-raised))]">
            <p className="text-xs font-bold text-foreground">Need help?</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Chat with our eco-team 24/7</p>
            <button
              onClick={() => setSupportOpen(true)}
              className="mt-2 text-xs font-semibold text-eco-blue hover:underline"
            >
              Open support →
            </button>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              className="absolute left-0 top-0 bottom-0 w-60 bg-[hsl(var(--surface-nav))] border-r border-border flex flex-col"
            >
              <div className="flex items-center justify-between p-3.5 border-b border-border">
                <Logo />
                <button onClick={() => setMobileOpen(false)} className="text-muted-foreground p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </div>
        )}

        {/* Main */}
        <main className="flex-1 min-w-0 px-4 sm:px-5 lg:px-6 py-5 lg:py-6 light-text-fix">
          {children}
        </main>
      </div>
    </div>
  );
};
