import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { PageWrapper } from '@/components/PageWrapper';
import { TokenBadge } from '@/components/TokenBadge';
import { LevelBadge } from '@/components/LevelBadge';
import { Recycle, Truck, ShoppingBag, Leaf, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
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
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
        {/* Header */}
        <motion.div variants={fadeItem} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hey, {user.name.split(' ')[0]}! 👋</h1>
            <LevelBadge level={user.level} />
          </div>
          <TokenBadge amount={user.tokens} size="lg" />
        </motion.div>

        {/* Wallet Card */}
        <motion.div variants={fadeItem} className="eco-gradient rounded-2xl p-5 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary-foreground/5 rounded-full translate-y-6 -translate-x-6" />
          <p className="text-sm opacity-80 font-medium">Token Wallet</p>
          <p className="text-4xl font-bold mt-1">{user.tokens} <span className="text-lg opacity-70">TC</span></p>
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
              { icon: Recycle, label: 'Sell Waste', to: '/sell', color: 'bg-primary/15 text-primary border-primary/20' },
              { icon: Truck, label: 'Pickup', to: '/pickup', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
              { icon: ShoppingBag, label: 'Redeem', to: '/redeem', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
            ].map(({ icon: Icon, label, to, color }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className="glass-card p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform active:scale-95"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div variants={fadeItem}>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Your Impact</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card-glow p-4">
              <p className="text-2xl font-bold text-primary neon-text">{impactBottles}</p>
              <p className="text-xs text-muted-foreground">Plastic bottles equivalent saved</p>
            </div>
            <div className="glass-card-glow p-4">
              <p className="text-2xl font-bold text-primary neon-text">{impactCO2} kg</p>
              <p className="text-xs text-muted-foreground">CO₂ emissions reduced</p>
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
                  <p className="text-sm font-medium">{tx.description}</p>
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
  const navigate = useNavigate();

  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-screen">
      <motion.div
        className="text-center space-y-6 w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto w-20 h-20 eco-gradient rounded-2xl flex items-center justify-center animate-pulse-glow">
          <Recycle className="w-10 h-10 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold neon-text">TrashCash</h1>
          <p className="text-muted-foreground mt-1">Turn waste into rewards 🌱</p>
        </div>
        <div className="space-y-3">
          <Button
            onClick={() => user.loginDemo()}
            className="w-full eco-gradient text-primary-foreground h-12 text-base font-semibold hover:opacity-90"
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
