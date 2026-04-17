import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { PageWrapper } from '@/components/PageWrapper';
import { LevelBadge } from '@/components/LevelBadge';
import { WelcomePopup } from '@/components/WelcomePopup';
import { CountUp } from '@/components/CountUp';
import { Recycle, Truck, ShoppingBag, Leaf, TrendingUp, Award, Coins, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const Dashboard = () => {
  const user = useUser();
  const navigate = useNavigate();

  if (!user.isLoggedIn) return <LoginScreen />;

  const impactBottles = Math.round(user.totalWasteKg * 20);
  const impactCO2 = +(user.totalWasteKg * 2.5).toFixed(1);
  const submissionsCount = user.submissions.length + user.pickups.length;

  return (
    <PageWrapper>
      <WelcomePopup />
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={fadeItem} className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-[28px] font-bold text-cream leading-tight">
              Hey, {user.name.split(' ')[0]}! <span className="inline-block">👋</span>
            </h1>
            <LevelBadge level={user.level} />
          </div>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold"
            style={{ background: 'hsl(var(--amber))', color: 'hsl(var(--forest-deep))', boxShadow: '0 6px 18px -6px hsl(var(--amber) / 0.6)' }}
          >
            <span className="coin-spin inline-flex"><Coins className="w-4 h-4" /></span>
            {user.tokens} TC
          </span>
        </motion.div>

        {/* Token Wallet — premium dark card */}
        <motion.div
          variants={fadeItem}
          className="shimmer relative rounded-3xl p-6 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--forest-darker)) 0%, hsl(var(--forest-deep)) 100%)',
            border: '1px solid hsl(var(--lime) / 0.25)',
            boxShadow: '0 0 40px -8px hsl(var(--lime) / 0.18), 0 12px 40px -12px rgba(0,0,0,0.5)',
          }}
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, hsl(var(--lime) / 0.18) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, hsl(var(--amber) / 0.12) 0%, transparent 70%)' }} />

          <div className="relative">
            <p className="section-label">Token Wallet</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span
                className="font-bold leading-none"
                style={{
                  fontSize: '56px',
                  color: 'hsl(var(--lime))',
                  textShadow: '0 0 32px hsl(var(--lime) / 0.45)',
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                }}
              >
                <CountUp end={user.tokens} />
              </span>
              <span className="text-2xl font-bold text-lime/70">TC</span>
              <span className="coin-spin ml-1 inline-flex">
                <Coins className="w-7 h-7" style={{ color: 'hsl(var(--lime))' }} />
              </span>
            </div>
            <p className="text-amber font-semibold mt-1">≈ ₹{user.tokens}</p>

            <div className="flex flex-wrap gap-2 mt-5">
              <span className="pill-outline">
                <Leaf className="w-3 h-3 text-lime" /> {user.totalWasteKg} kg recycled
              </span>
              <span className="pill-outline">
                <TrendingUp className="w-3 h-3 text-lime" /> {submissionsCount} submissions
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeItem}>
          <h2 className="section-label mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Recycle, label: 'Sell Waste', to: '/sell' },
              { icon: Truck, label: 'Pickup', to: '/pickup' },
              { icon: ShoppingBag, label: 'Redeem', to: '/redeem' },
            ].map(({ icon: Icon, label, to }, i) => (
              <motion.button
                key={to}
                onClick={() => navigate(to)}
                className="glass-tile p-4 flex flex-col items-center gap-2.5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                whileTap={{ scale: 0.96 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'hsl(var(--lime) / 0.12)',
                    border: '1px solid hsl(var(--lime) / 0.3)',
                  }}
                  whileHover={{ scale: 1.1, rotate: -6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Icon className="w-6 h-6" style={{ color: 'hsl(var(--lime))' }} strokeWidth={2.4} />
                </motion.div>
                <span
                  className="text-cream font-semibold"
                  style={{ fontSize: '13px', letterSpacing: '0.05em' }}
                >
                  {label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Your Impact */}
        <motion.div variants={fadeItem}>
          <h2 className="section-label mb-3">Your Impact</h2>
          <div className="grid grid-cols-2 gap-3">
            <ImpactCard value={impactBottles} label="Plastic bottles saved 🍶" color="lime" />
            <ImpactCard value={impactCO2} label="kg CO₂ reduced 🌍" color="coral" decimals={1} />
          </div>
        </motion.div>

        {/* Recent Activity */}
        {user.transactions.length > 0 && (
          <motion.div variants={fadeItem}>
            <h2 className="section-label mb-3">Recent Activity</h2>
            <div className="space-y-2">
              {user.transactions.slice(0, 4).map(tx => (
                <div key={tx.id} className="glass-card p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-cream">{tx.description}</p>
                    <p className="text-xs text-cream-muted mt-0.5">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-bold ${tx.type === 'earned' ? 'text-lime' : 'text-coral'}`}>
                    {tx.type === 'earned' ? '+' : '-'}{tx.amount} TC
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
};

const ImpactCard = ({ value, label, color, decimals = 0 }: { value: number; label: string; color: 'lime' | 'coral'; decimals?: number }) => {
  const colorVar = color === 'lime' ? 'hsl(var(--lime))' : 'hsl(var(--coral))';
  return (
    <div className="glass-card p-5 relative overflow-hidden">
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
        style={{ background: `radial-gradient(circle, ${colorVar} 0%, transparent 70%)`, opacity: 0.18 }}
      />
      <div className="relative">
        <CountUp
          end={value}
          decimals={decimals}
          className="block font-bold leading-none"
        />
        <p
          className="font-bold leading-none mb-2"
          style={{
            fontSize: '40px',
            color: colorVar,
            textShadow: `0 0 24px ${colorVar.replace(')', ' / 0.4)')}`,
            fontFamily: 'Space Grotesk, Inter, sans-serif',
          }}
        >
          <CountUp end={value} decimals={decimals} />
        </p>
        <p className="text-xs text-cream-muted">{label}</p>
      </div>
    </div>
  );
};

const LoginScreen = () => {
  const user = useUser();
  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-screen">
      <WelcomePopup />
      <motion.div
        className="text-center space-y-6 w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mx-auto w-24 h-24 rounded-3xl flex items-center justify-center animate-pulse-lime"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--lime)), hsl(80 80% 52%))',
            boxShadow: '0 0 40px hsl(var(--lime) / 0.5)',
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <Recycle className="w-12 h-12" style={{ color: 'hsl(var(--forest-deep))' }} strokeWidth={2.4} />
        </motion.div>
        <div>
          <h1 className="text-5xl font-bold text-cream tracking-tight">TrashCash</h1>
          <p className="text-cream-muted mt-2 text-base">Turn waste into rewards <Sparkles className="inline w-4 h-4 text-lime" /></p>
        </div>
        <div className="space-y-3">
          <Button
            onClick={() => user.loginDemo()}
            className="w-full eco-gradient h-14 text-lg font-bold rounded-2xl hover:opacity-95"
          >
            <Award className="w-5 h-5 mr-2" /> Try Demo Account
          </Button>
          <p className="text-xs text-cream-muted">Pre-loaded with sample data for the demo</p>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default Dashboard;
