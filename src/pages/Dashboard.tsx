import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { WelcomePopup } from '@/components/WelcomePopup';
import { CountUp } from '@/components/CountUp';
import { LevelBadge } from '@/components/LevelBadge';
import { Button } from '@/components/ui/button';
import {
  Recycle, Truck, Gift, Coins, Sparkles, ArrowUpRight, Leaf, TrendingUp,
  CheckCircle2, Clock, Trophy, Award, IndianRupee, Footprints, ShoppingBag,
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Bar, BarChart } from 'recharts';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeItem = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Dashboard = () => {
  const user = useUser();
  if (!user.isLoggedIn) return <LoginScreen />;
  return (
    <AppShell>
      <WelcomePopup />
      <DashboardContent />
    </AppShell>
  );
};

const DashboardContent = () => {
  const user = useUser();
  const navigate = useNavigate();

  const tierTarget = user.level === 'Gold' ? 1000 : 500;
  const tierProgress = Math.min(100, (user.tokens / tierTarget) * 100);
  const submissionsCount = user.submissions.length + user.pickups.length;
  const co2Saved = +(user.totalWasteKg * 2.5).toFixed(1);
  const ecoPoints = Math.round(user.totalWasteKg * 20);

  const sampleSubmissions = [
    { date: 'Apr 14', type: 'Cardboard', weight: 8.2, tokens: 82, status: 'verified' },
    { date: 'Apr 10', type: 'Plastic PET', weight: 3.5, tokens: 35, status: 'verified' },
    { date: 'Apr 7', type: 'E-waste', weight: 12.0, tokens: 144, status: 'pending' },
    { date: 'Apr 3', type: 'Metal', weight: 6.8, tokens: 81, status: 'verified' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Priya S.', tc: 892, you: false, medal: '🥇' },
    { rank: 2, name: 'Rahul M.', tc: 674, you: false, medal: '🥈' },
    { rank: 3, name: `${user.name.split(' ')[0] || 'Arjun'} (You)`, tc: user.tokens, you: true, medal: '🥉' },
  ];

  const rewards = [
    { name: 'Amazon ₹100', cost: 100, emoji: '🛒', color: 'hsl(var(--eco-amber))' },
    { name: 'Zepto ₹50', cost: 50, emoji: '🛍️', color: 'hsl(var(--eco-blue))' },
    { name: 'Plant a Tree', cost: 10, emoji: '🌳', color: 'hsl(var(--eco-green))' },
  ];

  const spark = (seed: number) =>
    Array.from({ length: 8 }).map((_, i) => ({ v: Math.round(20 + Math.sin(i + seed) * 10 + (i * seed) % 12) }));

  return (
    <PageWrapper>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* Greeting */}
        <motion.div variants={fadeItem} className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-label mb-1.5">Welcome back</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Hey, {user.name.split(' ')[0]} <span className="inline-block">👋</span>
            </h1>
            <p className="text-muted-foreground-2 text-sm mt-1">Here's your sustainability snapshot for this week.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/sell')} className="btn-eco h-10 font-semibold">
              <Recycle className="w-4 h-4 mr-2" /> Sell Waste
            </Button>
            <Button onClick={() => navigate('/marketplace')} variant="outline" className="h-10 border-border bg-surface-card hover:bg-surface-raised">
              <Gift className="w-4 h-4 mr-2" /> Redeem
            </Button>
          </div>
        </motion.div>

        {/* Hero grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
          {/* Wallet hero */}
          <motion.div variants={fadeItem} className="wallet-hero shimmer p-6 lg:p-8 lg:col-span-2 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, hsl(var(--eco-blue) / 0.18), transparent 70%)' }} />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, hsl(var(--eco-amber) / 0.12), transparent 70%)' }} />

            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <p className="section-label">Token Wallet</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span
                    className="font-extrabold leading-none text-eco-blue"
                    style={{
                      fontSize: 'clamp(48px, 7vw, 72px)',
                      textShadow: '0 0 32px hsl(var(--eco-blue) / 0.45)',
                      fontFamily: 'DM Sans, Inter, sans-serif',
                    }}
                  >
                    <CountUp end={user.tokens} />
                  </span>
                  <span className="text-2xl font-bold text-eco-blue/70">TC</span>
                  <span className="coin-spin ml-1 inline-flex">
                    <Coins className="w-7 h-7 text-eco-amber" />
                  </span>
                </div>
                <p className="text-eco-amber font-semibold mt-2 flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />{user.tokens.toFixed(2)} INR
                  <span className="text-muted-foreground-2 font-normal text-xs ml-2">≈ live conversion</span>
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="pill-outline"><Recycle className="w-3 h-3 text-eco-blue" /> {user.totalWasteKg} kg recycled</span>
                  <span className="pill-outline"><TrendingUp className="w-3 h-3 text-eco-blue" /> {submissionsCount} submissions</span>
                </div>
              </div>

              {/* Tier ring */}
              <TierRing progress={tierProgress} level={user.level} tokens={user.tokens} target={tierTarget} />
            </div>
          </motion.div>

          {/* Quick actions stacked */}
          <motion.div variants={fadeItem} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            <QuickAction
              icon={Truck}
              title="Sell Waste"
              desc="Schedule a pickup or drop-off"
              color="hsl(var(--eco-blue))"
              onClick={() => navigate('/sell')}
            />
            <QuickAction
              icon={Footprints}
              title="Request Pickup"
              desc="We come to you within 24hrs"
              color="hsl(var(--eco-amber))"
              onClick={() => navigate('/pickup')}
            />
            <QuickAction
              icon={Gift}
              title="Redeem Tokens"
              desc="Exchange TC for rewards"
              color="hsl(var(--eco-green))"
              onClick={() => navigate('/marketplace')}
            />
          </motion.div>
        </div>

        {/* Your Impact */}
        <motion.div variants={fadeItem}>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="section-label">Your Impact</p>
              <h2 className="text-xl font-bold text-white mt-1">Sustainability metrics</h2>
            </div>
            <span className="text-xs text-muted-foreground-2 hidden sm:inline">Last 30 days</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <ImpactCard value={ecoPoints} label="EcoPoints earned" color="hsl(var(--eco-green))" icon={Leaf} chart="area" data={spark(2)} />
            <ImpactCard value={co2Saved} suffix=" kg" label="CO₂ offset" color="hsl(var(--eco-teal))" icon={Sparkles} decimals={1} chart="area" data={spark(5)} />
            <ImpactCard value={submissionsCount} label="Successful pickups" color="hsl(var(--eco-blue))" icon={Truck} chart="bar" data={spark(7)} />
            <ImpactCard value={user.tokens} prefix="₹" label="Total value earned" color="hsl(var(--eco-amber))" icon={IndianRupee} chart="bar" data={spark(11)} />
          </div>
        </motion.div>

        {/* Two-col: submissions + leaderboard */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-5">
          {/* Recent submissions */}
          <motion.div variants={fadeItem} className="surface-flat p-5 lg:p-6 xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="section-label">Activity</p>
                <h3 className="text-lg font-bold text-white mt-0.5">Recent Submissions</h3>
              </div>
              <button onClick={() => navigate('/history')} className="text-xs font-semibold text-eco-blue hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto -mx-5 lg:-mx-6 px-5 lg:px-6">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-muted-foreground-2 border-b border-border">
                    <th className="text-left font-semibold py-2.5">Date</th>
                    <th className="text-left font-semibold py-2.5">Waste Type</th>
                    <th className="text-left font-semibold py-2.5">Weight</th>
                    <th className="text-right font-semibold py-2.5">Tokens</th>
                    <th className="text-right font-semibold py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleSubmissions.map((s, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-white/[0.02] transition">
                      <td className="py-3 text-sm text-muted-foreground-2">{s.date}</td>
                      <td className="py-3 text-sm font-semibold text-white">{s.type}</td>
                      <td className="py-3 text-sm text-white">{s.weight} kg</td>
                      <td className="py-3 text-sm font-bold text-eco-amber text-right">+{s.tokens} TC</td>
                      <td className="py-3 text-right">
                        {s.status === 'verified' ? (
                          <span className="pill-status-verified"><CheckCircle2 className="w-3 h-3" /> Verified</span>
                        ) : (
                          <span className="pill-status-pending"><Clock className="w-3 h-3" /> Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Leaderboard preview */}
          <motion.div variants={fadeItem} className="surface-flat p-5 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="section-label">Local Leaderboard</p>
                <h3 className="text-lg font-bold text-white mt-0.5">Top recyclers</h3>
              </div>
              <Trophy className="w-5 h-5 text-eco-amber" />
            </div>
            <div className="space-y-2.5">
              {leaderboard.map(l => (
                <div
                  key={l.rank}
                  className={`flex items-center gap-3 p-3 rounded-xl ${l.you ? 'bg-eco-blue/10 border border-eco-blue/30' : 'bg-surface-raised'}`}
                >
                  <span className="text-xl">{l.medal}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{l.name}</p>
                    <p className="text-[11px] text-muted-foreground-2">Rank #{l.rank}</p>
                  </div>
                  <span className="text-sm font-bold text-eco-amber">{l.tc} TC</span>
                </div>
              ))}
            </div>
            <Button onClick={() => navigate('/leaderboard')} variant="outline" className="w-full mt-4 bg-transparent border-border text-white hover:bg-surface-raised">
              View Full Leaderboard <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </motion.div>
        </div>

        {/* Marketplace preview */}
        <motion.div variants={fadeItem} className="surface-flat p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-label">Marketplace</p>
              <h3 className="text-lg font-bold text-white mt-0.5">Trending rewards</h3>
            </div>
            <button onClick={() => navigate('/marketplace')} className="text-xs font-semibold text-eco-blue hover:underline flex items-center gap-1">
              Browse all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {rewards.map(r => (
              <div key={r.name} className="surface-card p-4 group cursor-pointer" onClick={() => navigate('/marketplace')}>
                <div
                  className="aspect-[3/2] rounded-xl flex items-center justify-center text-5xl mb-3"
                  style={{ background: `linear-gradient(135deg, ${r.color.replace(')', ' / 0.2)')}, ${r.color.replace(')', ' / 0.05)')})`, border: `1px solid ${r.color.replace(')', ' / 0.3)')}` }}
                >
                  {r.emoji}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{r.name}</p>
                    <p className="text-xs text-eco-amber font-semibold mt-0.5">{r.cost} TC</p>
                  </div>
                  <Button size="sm" className="btn-eco h-8 text-xs">Redeem</Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};

const TierRing = ({ progress, level, tokens, target }: { progress: number; level: string; tokens: number; target: number }) => {
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  return (
    <div className="relative w-36 h-36 shrink-0 mx-auto lg:mx-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="hsl(var(--surface-raised))" strokeWidth="10" />
        <motion.circle
          cx="70" cy="70" r={r} fill="none"
          stroke="url(#tier-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="tier-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--eco-blue))" />
            <stop offset="100%" stopColor="hsl(var(--eco-amber))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Award className="w-4 h-4 text-eco-amber mb-1" />
        <span className="text-xs font-bold text-white">{level}</span>
        <span className="text-[10px] text-muted-foreground-2">{tokens}/{target} TC</span>
      </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, title, desc, color, onClick }: any) => (
  <motion.button
    onClick={onClick}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    className="surface-card p-5 text-left flex items-start gap-4 group h-full"
  >
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition"
      style={{ background: `${color.replace(')', ' / 0.15)')}`, border: `1px solid ${color.replace(')', ' / 0.35)')}` }}
    >
      <Icon className="w-5 h-5" style={{ color }} strokeWidth={2.4} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-white">{title}</p>
      <p className="text-xs text-muted-foreground-2 mt-0.5 leading-snug">{desc}</p>
    </div>
    <ArrowUpRight className="w-4 h-4 text-muted-foreground-2 group-hover:text-eco-blue transition" />
  </motion.button>
);

const ImpactCard = ({
  value, label, color, icon: Icon, chart, data, decimals = 0, prefix = '', suffix = '',
}: any) => (
  <div className="surface-card p-5 relative overflow-hidden">
    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-25" style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color.replace(')', ' / 0.15)')}`, border: `1px solid ${color.replace(')', ' / 0.3)')}` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-eco-green" />
      </div>
      <p className="font-extrabold leading-none" style={{ fontSize: '32px', color, textShadow: `0 0 24px ${color.replace(')', ' / 0.4)')}` }}>
        {prefix}<CountUp end={value} decimals={decimals} />{suffix}
      </p>
      <p className="text-xs text-muted-foreground-2 mt-2">{label}</p>
      <div className="h-10 mt-2 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          {chart === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`g-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#g-${label})`} />
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <Bar dataKey="v" fill={color} radius={[3, 3, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const LoginScreen = () => {
  const user = useUser();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 h-16 flex items-center border-b border-border bg-surface-nav/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center btn-eco">
            <Recycle className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-white text-lg">EcoFusion</span>
        </div>
      </header>
      <main className="flex-1 grid lg:grid-cols-2 items-center gap-8 max-w-[1200px] mx-auto w-full px-6 py-10">
        <WelcomePopup />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="pill-outline mb-5"><Sparkles className="w-3 h-3 text-eco-blue" /> The fintech of recycling</span>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
            Turn your <span className="text-eco-blue">waste</span> into a real <span className="text-eco-amber">wallet</span>.
          </h1>
          <p className="text-muted-foreground-2 text-lg mt-5 leading-relaxed">
            EcoFusion is a modern circular economy platform. Recycle, earn TC tokens at live market rates, and redeem at 200+ partners.
          </p>
          <div className="flex items-center gap-3 mt-7">
            <Button onClick={() => user.loginDemo()} className="btn-eco h-12 px-6 text-base font-bold">
              <Award className="w-4 h-4 mr-2" /> Try Demo Account
            </Button>
            <Button variant="outline" className="h-12 px-6 border-border bg-surface-card hover:bg-surface-raised">
              Learn more
            </Button>
          </div>
          <div className="flex items-center gap-6 mt-8 text-xs text-muted-foreground-2">
            <div><span className="text-white font-bold">12K+</span> recyclers</div>
            <div><span className="text-white font-bold">₹4.2M</span> tokens issued</div>
            <div><span className="text-white font-bold">340 t</span> CO₂ saved</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="wallet-hero p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, hsl(var(--eco-blue) / 0.25), transparent 70%)' }} />
          <div className="relative">
            <p className="section-label">Demo wallet preview</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-extrabold text-eco-blue" style={{ fontSize: '64px', textShadow: '0 0 32px hsl(var(--eco-blue) / 0.45)' }}>342</span>
              <span className="text-xl font-bold text-eco-blue/70">TC</span>
              <Coins className="w-6 h-6 text-eco-amber coin-spin ml-2" />
            </div>
            <p className="text-eco-amber font-semibold mt-1">≈ ₹342.00 INR</p>
            <div className="grid grid-cols-3 gap-2 mt-6">
              {[
                { l: '47.5 kg', s: 'Recycled', i: Recycle },
                { l: '6', s: 'Pickups', i: Truck },
                { l: '950', s: 'Points', i: Leaf },
              ].map(({ l, s, i: I }) => (
                <div key={s} className="surface-raised p-3 text-center">
                  <I className="w-4 h-4 mx-auto text-eco-blue mb-1" />
                  <p className="text-sm font-bold text-white">{l}</p>
                  <p className="text-[10px] text-muted-foreground-2 uppercase tracking-wider">{s}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 surface-raised p-4 flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-eco-amber" />
              <div>
                <p className="text-xs font-semibold text-white">Plant a Tree • 10 TC</p>
                <p className="text-[11px] text-muted-foreground-2">Trending in Marketplace</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
