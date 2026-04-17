import { useUser } from '@/lib/UserContext';
import { PageWrapper } from '@/components/PageWrapper';
import { TokenBadge } from '@/components/TokenBadge';
import { LevelBadge } from '@/components/LevelBadge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LogOut, Recycle, Leaf, Award, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const user = useUser();
  const navigate = useNavigate();

  const nextLevel = user.level === 'Bronze' ? 30 : user.level === 'Silver' ? 100 : 999;
  const prevLevel = user.level === 'Bronze' ? 0 : user.level === 'Silver' ? 30 : 100;
  const progress = Math.min(100, ((user.totalWasteKg - prevLevel) / (nextLevel - prevLevel)) * 100);

  const handleLogout = () => { user.logout(); navigate('/'); };

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] font-bold text-cream">Profile 👤</h1>
        <Button variant="outline" size="sm" onClick={handleLogout} className="border-border text-cream hover:bg-forest-darker">
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </Button>
      </div>

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-5 mb-5 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--forest-darker)), hsl(var(--forest-deep)))',
          border: '1px solid hsl(var(--lime) / 0.25)',
          boxShadow: '0 0 32px -8px hsl(var(--lime) / 0.2)',
        }}
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, hsl(var(--lime) / 0.18) 0%, transparent 70%)' }} />
        <div className="relative flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ background: 'hsl(var(--lime))', color: 'hsl(var(--forest-deep))' }}
          >
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-cream">{user.name}</h2>
            <p className="text-xs text-cream-muted">{user.email}</p>
          </div>
          <TokenBadge amount={user.tokens} size="md" />
        </div>
      </motion.div>

      {/* Level Progress */}
      <div className="glass-card-glow p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <LevelBadge level={user.level} />
          {user.level !== 'Gold' && (
            <span className="text-xs text-cream-muted">{nextLevel - user.totalWasteKg} kg to next</span>
          )}
        </div>
        <Progress value={progress} className="h-2.5 bg-forest-darker" />
        <div className="flex justify-between mt-1 text-xs text-cream-muted">
          <span>{user.totalWasteKg} kg</span>
          {user.level !== 'Gold' && <span>{nextLevel} kg</span>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard icon={Recycle} value={user.submissions.length + user.pickups.length} label="Submissions" />
        <StatCard icon={Leaf} value={user.totalWasteKg} label="Kg Recycled" />
        <StatCard icon={Award} value={user.tokens} label="TC Balance" amber />
      </div>

      <h2 className="section-label mb-3">Transaction History</h2>
      <div className="space-y-2">
        {user.transactions.map(tx => (
          <div key={tx.id} className="glass-card p-3 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: tx.type === 'earned' ? 'hsl(var(--lime) / 0.15)' : 'hsl(var(--coral) / 0.15)',
                color: tx.type === 'earned' ? 'hsl(var(--lime))' : 'hsl(var(--coral))',
              }}
            >
              {tx.type === 'earned' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-cream">{tx.description}</p>
              <p className="text-xs text-cream-muted">{tx.date}</p>
            </div>
            <span className={`text-sm font-bold ${tx.type === 'earned' ? 'text-lime' : 'text-coral'}`}>
              {tx.type === 'earned' ? '+' : '-'}{tx.amount}
            </span>
          </div>
        ))}
        {user.transactions.length === 0 && (
          <p className="text-center text-cream-muted py-6 text-sm">No transactions yet</p>
        )}
      </div>
    </PageWrapper>
  );
};

const StatCard = ({ icon: Icon, value, label, amber }: { icon: React.ElementType; value: number; label: string; amber?: boolean }) => {
  const c = amber ? 'hsl(var(--amber))' : 'hsl(var(--lime))';
  return (
    <div className="glass-card p-3 text-center">
      <div
        className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-1"
        style={{ background: `${c.replace(')', ' / 0.12)')}`, border: `1px solid ${c.replace(')', ' / 0.3)')}` }}
      >
        <Icon className="w-5 h-5" style={{ color: c }} />
      </div>
      <p className="text-lg font-bold text-cream">{value}</p>
      <p className="text-[10px] text-cream-muted uppercase tracking-wider">{label}</p>
    </div>
  );
};

export default Profile;
