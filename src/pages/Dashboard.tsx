import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { PageWrapper } from '@/components/PageWrapper';
import { TokenBadge } from '@/components/TokenBadge';
import { LevelBadge } from '@/components/LevelBadge';
import { WelcomePopup } from '@/components/WelcomePopup';
import { Recycle, Truck, ShoppingBag, Leaf, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Dashboard = () => {
  const user = useUser();
  const navigate = useNavigate();

  if (!user.isLoggedIn) {
    return <LoginScreen />;
  }

  const impactBottles = Math.round(user.totalWasteKg * 20);
  const impactCO2 = (user.totalWasteKg * 2.5).toFixed(1);

  return (
    <PageWrapper>
      <WelcomePopup />
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
        {/* Header */}
        <motion.div variants={fadeItem} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hey, {user.name.split(' ')[0]}! 👋</h1>
            <LevelBadge level={user.level} />
          </div>
          <TokenBadge amount={user.tokens} size="lg" />
        </motion.div>

        {/* Wallet Card */}
        <motion.div variants={fadeItem} className="eco-gradient rounded-3xl p-6 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full -translate-y-12 translate-x-12" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/10 rounded-full translate-y-8 -translate-x-8" />
          <p className="text-sm opacity-80 font-medium">Token Wallet</p>
          <p className="text-5xl font-bold mt-1">{user.tokens} <span className="text-lg opacity-70">TC</span></p>
          <p className="text-xs opacity-60 mt-2">≈ ₹{user.tokens}</p>
          <div className="flex gap-6 mt-4 text-xs opacity-80">
            <span className="flex items-center gap-1"><Leaf className="w-3 h-3" /> {user.totalWasteKg} kg recycled</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {user.submissions.length + user.pickups.length} submissions</span>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeItem}>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Recycle, label: 'Sell Waste', to: '/sell', color: 'bg-green-50 text-primary border-green-200', iconBg: 'bg-primary/10' },
              { icon: Truck, label: 'Pickup', to: '/pickup', color: 'bg-blue-50 text-blue-600 border-blue-200', iconBg: 'bg-blue-100' },
              { icon: ShoppingBag, label: 'Redeem', to: '/redeem', color: 'bg-amber-50 text-amber-600 border-amber-200', iconBg: 'bg-amber-100' },
            ].map(({ icon: Icon, label, to, iconBg }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className="glass-card card-hover p-4 flex flex-col items-center gap-2"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-foreground">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div variants={fadeItem}>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Your Impact</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card-glow p-5">
              <p className="text-3xl font-bold text-primary">{impactBottles}</p>
              <p className="text-xs text-muted-foreground mt-1">Plastic bottles saved 🍶</p>
            </div>
            <div className="glass-card-glow p-5">
              <p className="text-3xl font-bold text-primary">{impactCO2} kg</p>
              <p className="text-xs text-muted-foreground mt-1">CO₂ reduced 🌍</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeItem}>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Recent Activity</h2>
          <div className="space-y-2">
            {user.transactions.slice(0, 4).map(tx => (
              <div key={tx.id} className="glass-card p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'earned' ? 'text-primary' : 'text-destructive'}`}>
                  {tx.type === 'earned' ? '+' : '-'}{tx.amount} TC
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};

const LoginScreen = () => {
  const user = useUser();

  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-screen">
      <WelcomePopup />
      <motion.div
        className="text-center space-y-6 w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mx-auto w-24 h-24 eco-gradient rounded-3xl flex items-center justify-center shadow-xl"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <Recycle className="w-12 h-12 text-primary-foreground" />
        </motion.div>
        <div>
          <h1 className="text-4xl font-bold text-foreground">TrashCash</h1>
          <p className="text-muted-foreground mt-2 text-base">Turn waste into rewards 🌱</p>
        </div>
        <div className="space-y-3">
          <Button
            onClick={() => user.loginDemo()}
            className="w-full eco-gradient text-primary-foreground h-14 text-lg font-semibold rounded-2xl hover:opacity-90"
          >
            <Award className="w-5 h-5 mr-2" /> Try Demo Account
          </Button>
          <p className="text-xs text-muted-foreground">Pre-loaded with sample data for the hackathon demo</p>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default Dashboard;
