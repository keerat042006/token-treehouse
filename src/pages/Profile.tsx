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

  const handleLogout = () => {
    user.logout();
    navigate('/');
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold neon-text">Profile</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </Button>
      </div>

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="eco-gradient rounded-2xl p-5 text-primary-foreground mb-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-xs opacity-70">{user.email}</p>
          </div>
          <TokenBadge amount={user.tokens} size="md" />
        </div>
      </motion.div>

      {/* Level Progress */}
      <div className="glass-card-glow p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <LevelBadge level={user.level} />
          {user.level !== 'Gold' && (
            <span className="text-xs text-muted-foreground">{nextLevel - user.totalWasteKg} kg to next level</span>
          )}
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{user.totalWasteKg} kg</span>
          {user.level !== 'Gold' && <span>{nextLevel} kg</span>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="glass-card p-3 text-center">
          <Recycle className="w-5 h-5 mx-auto text-primary mb-1" />
          <p className="text-lg font-bold">{user.submissions.length + user.pickups.length}</p>
          <p className="text-[10px] text-muted-foreground">Submissions</p>
        </div>
        <div className="glass-card p-3 text-center">
          <Leaf className="w-5 h-5 mx-auto text-primary mb-1" />
          <p className="text-lg font-bold">{user.totalWasteKg}</p>
          <p className="text-[10px] text-muted-foreground">Kg Recycled</p>
        </div>
        <div className="glass-card p-3 text-center">
          <Award className="w-5 h-5 mx-auto text-accent mb-1" />
          <p className="text-lg font-bold">{user.tokens}</p>
          <p className="text-[10px] text-muted-foreground">TC Balance</p>
        </div>
      </div>

      {/* Transaction History */}
      <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Transaction History</h2>
      <div className="space-y-2">
        {user.transactions.map(tx => (
          <div key={tx.id} className="glass-card p-3 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              tx.type === 'earned' ? 'bg-primary/15 text-primary' : 'bg-destructive/15 text-destructive'
            }`}>
              {tx.type === 'earned' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tx.description}</p>
              <p className="text-xs text-muted-foreground">{tx.date}</p>
            </div>
            <span className={`text-sm font-bold ${tx.type === 'earned' ? 'text-primary' : 'text-destructive'}`}>
              {tx.type === 'earned' ? '+' : '-'}{tx.amount}
            </span>
          </div>
        ))}
        {user.transactions.length === 0 && (
          <p className="text-center text-muted-foreground py-6 text-sm">No transactions yet</p>
        )}
      </div>
    </PageWrapper>
  );
};

export default Profile;
