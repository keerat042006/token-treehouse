import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { PageWrapper } from '@/components/PageWrapper';
import { TokenBadge } from '@/components/TokenBadge';
import { LevelBadge } from '@/components/LevelBadge';
import { WelcomePopup } from '@/components/WelcomePopup';
import { Recycle, Truck, ShoppingBag, Leaf, TrendingUp, Award, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeItem = {
  hidden: { opacity: 0, y: 14 },
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
      <WelcomePopup />
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* Welcome header */}
        <motion.div variants={fadeItem}>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Hey, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's your recycling overview</p>
        </motion.div>

        {/* Bento grid — top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Wallet Card — spans 2 cols */}
          <motion.div variants={fadeItem} className="md:col-span-2 eco-gradient rounded-2xl p-6 text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full -translate-y-12 translate-x-12" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/10 rounded-full translate-y-8 -translate-x-8" />
            <p className="text-sm opacity-80 font-medium">Token Wallet</p>
            <p className="text-4xl lg:text-5xl font-bold mt-1">{user.tokens} <span className="text-lg opacity-70">TC</span></p>
            <p className="text-xs opacity-60 mt-2">≈ ₹{user.tokens}</p>
            <div className="flex gap-6 mt-4 text-xs opacity-80">
              <span className="flex items-center gap-1"><Leaf className="w-3 h-3" /> {user.totalWasteKg} kg recycled</span>
              <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {user.submissions.length + user.pickups.length} submissions</span>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeItem} className="glass-card p-5 space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</h2>
            {[
              { icon: Recycle, label: 'Sell Waste', to: '/sell', iconBg: 'bg-primary/10 text-primary' },
              { icon: Truck, label: 'Schedule Pickup', to: '/pickup', iconBg: 'bg-blue-50 text-blue-600' },
              { icon: ShoppingBag, label: 'Redeem Tokens', to: '/redeem', iconBg: 'bg-amber-50 text-amber-600' },
            ].map(({ icon: Icon, label, to, iconBg }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary transition-colors group text-left"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg} group-hover:shadow-sm transition-shadow`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-foreground">{label}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Bento grid — bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Impact Stats */}
          <motion.div variants={fadeItem} className="glass-card-glow p-5">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Your Impact</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold text-primary">{impactBottles}</p>
                <p className="text-xs text-muted-foreground mt-1">Plastic bottles saved 🍶</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">{impactCO2} kg</p>
                <p className="text-xs text-muted-foreground mt-1">CO₂ reduced 🌍</p>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity — spans 2 cols on lg */}
          <motion.div variants={fadeItem} className="lg:col-span-2 glass-card p-5">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Activity</h2>
            <div className="space-y-2">
              {user.transactions.slice(0, 6).map(tx => (
                <div key={tx.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'earned' ? 'bg-green-100 text-primary' : 'bg-red-50 text-destructive'
                  }`}>
                    {tx.type === 'earned' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-bold shrink-0 ${tx.type === 'earned' ? 'text-primary' : 'text-destructive'}`}>
                    {tx.type === 'earned' ? '+' : '-'}{tx.amount} TC
                  </span>
                </div>
              ))}
              {user.transactions.length === 0 && (
                <p className="text-center text-muted-foreground py-4 text-sm">No activity yet</p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

const LoginScreen = () => {
  const user = useUser();

  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <WelcomePopup />
      <motion.div
        className="text-center space-y-6 w-full max-w-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="mx-auto w-20 h-20 eco-gradient rounded-2xl flex items-center justify-center shadow-xl"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <Recycle className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">TrashCash</h1>
          <p className="text-muted-foreground mt-2 text-base">Turn waste into rewards 🌱</p>
        </div>
        <div className="space-y-3">
          <Button
            onClick={() => user.loginDemo()}
            className="w-full eco-gradient text-primary-foreground h-12 text-base font-semibold rounded-xl hover:opacity-90"
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
