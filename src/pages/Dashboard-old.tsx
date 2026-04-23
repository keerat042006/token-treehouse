import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { WelcomePopup } from '@/components/WelcomePopup';
import { CountUp } from '@/components/CountUp';
import { DailyChallenge } from '@/components/DailyChallenge';
import { Achievements } from '@/components/Achievements';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Recycle, Truck, Gift, Coins, Sparkles, ArrowUpRight, Leaf, TrendingUp,
  CheckCircle2, Clock, Trophy, Award, IndianRupee, Mail, Lock, User as UserIcon, LogIn, UserPlus, Zap,
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

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

  const submissionsCount = user.submissions.length + user.pickups.length;
  const co2Saved = +(user.totalWasteKg * 2.5).toFixed(1);

  const chartData = Array.from({ length: 7 }, (_, i) => ({
    day: i,
    value: Math.floor(Math.random() * 50) + 20
  }));

  const recentActivity = [
    { date: 'Apr 22', type: 'Plastic PET', weight: 5.5, tokens: 55, status: 'verified' },
    { date: 'Apr 20', type: 'Cardboard', weight: 8.2, tokens: 82, status: 'verified' },
    { date: 'Apr 18', type: 'E-waste', weight: 3.0, tokens: 36, status: 'pending' },
  ];

  return (
    <PageWrapper>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Welcome back, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-muted-foreground">Track your impact and earn rewards</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/sell')} className="btn-primary">
              <Recycle className="w-4 h-4 mr-2" />
              Sell Waste
            </Button>
            <Button onClick={() => navigate('/marketplace')} className="btn-secondary">
              <Gift className="w-4 h-4 mr-2" />
              Rewards
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={item} className="stat-card group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Coins className="w-5 h-5 text-blue-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="stat-value">
              <CountUp end={user.tokens} />
            </div>
            <div className="stat-label">TrashCash Tokens</div>
            <div className="mt-2 text-xs text-green-400">≈ ₹{user.tokens.toFixed(2)} INR</div>
          </motion.div>

          <motion.div variants={item} className="stat-card group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Leaf className="w-5 h-5 text-green-400" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-green-400" />
            </div>
            <div className="stat-value">
              <CountUp end={user.totalWasteKg} decimals={1} />
            </div>
            <div className="stat-label">Kg Recycled</div>
          </motion.div>

          <motion.div variants={item} className="stat-card group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-purple-400" />
            </div>
            <div className="stat-value">
              <CountUp end={co2Saved} decimals={1} />
            </div>
            <div className="stat-label">CO₂ Offset (kg)</div>
          </motion.div>

          <motion.div variants={item} className="stat-card group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="stat-value">
              <CountUp end={submissionsCount} />
            </div>
            <div className="stat-label">Total Submissions</div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Activity Chart */}
          <motion.div variants={item} className="lg:col-span-2 card-modern p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Your Impact</h2>
                <p className="text-sm text-muted-foreground mt-1">Last 7 days activity</p>
              </div>
              <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                View All →
              </button>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold text-white">
                  <CountUp end={245} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">This Week</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">+12%</div>
                <div className="text-xs text-muted-foreground mt-1">vs Last Week</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  <CountUp end={892} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">All Time</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Quick Actions */}
          <motion.div variants={item} className="space-y-4">
            <div className="card-modern p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/sell')}
                  className="w-full flex items-center gap-3 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl transition-all group"
                >
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Recycle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white">Sell Waste</div>
                    <div className="text-xs text-muted-foreground">Earn tokens now</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-blue-400" />
                </button>

                <button
                  onClick={() => navigate('/pickup')}
                  className="w-full flex items-center gap-3 p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl transition-all group"
                >
                  <div className="p-2 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Truck className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white">Request Pickup</div>
                    <div className="text-xs text-muted-foreground">Schedule collection</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                </button>

                <button
                  onClick={() => navigate('/marketplace')}
                  className="w-full flex items-center gap-3 p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl transition-all group"
                >
                  <div className="p-2 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Gift className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white">Redeem Rewards</div>
                    <div className="text-xs text-muted-foreground">Browse marketplace</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-purple-400" />
                </button>
              </div>
            </div>

            <div className="card-modern p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Level Progress</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Level</span>
                  <span className="font-semibold text-white">{user.level}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '65%' }} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{user.tokens} TCC</span>
                  <span>500 TCC</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Daily Challenge */}
        <motion.div variants={item}>
          <DailyChallenge current={2.3} target={5} />
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item} className="card-modern p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <button
              onClick={() => navigate('/history')}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Weight</th>
                  <th className="text-right">Tokens</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, i) => (
                  <tr key={i}>
                    <td className="text-muted-foreground">{activity.date}</td>
                    <td className="font-medium text-white">{activity.type}</td>
                    <td>{activity.weight} kg</td>
                    <td className="text-right font-semibold text-green-400">+{activity.tokens} TCC</td>
                    <td className="text-right">
                      {activity.status === 'verified' ? (
                        <span className="badge-success">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="badge-warning">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div variants={item}>
          <Achievements />
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};

const LoginScreen = () => {
  const user = useUser();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email || !password) return toast.error('Enter email and password');
      const derivedName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'Recycler';
      user.login(derivedName.charAt(0).toUpperCase() + derivedName.slice(1), email, '');
      toast.success('Welcome back!');
    } else {
      if (!name || !email || !password) return toast.error('Fill all fields');
      if (password !== confirm) return toast.error('Passwords do not match');
      user.login(name, email, '');
      toast.success('Account created!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
              <Recycle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">EcoFusion</h1>
            <p className="text-sm text-muted-foreground">Recycle. Earn. Redeem.</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'login'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-muted-foreground hover:text-white'
                }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'register'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-muted-foreground hover:text-white'
                }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Name</Label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="input-modern pl-11"
                  />
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Email</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-modern pl-11"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Password</Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-modern pl-11"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Confirm Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="input-modern pl-11"
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="btn-primary w-full">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-xs text-muted-foreground bg-[#1e293b]">or</span>
            </div>
          </div>

          <Button
            onClick={() => user.loginDemo()}
            className="btn-secondary w-full"
          >
            Continue as Guest →
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
