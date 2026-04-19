import { useUser } from '@/lib/UserContext';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { LevelBadge } from '@/components/LevelBadge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LogOut, Recycle, Leaf, Award, Mail, Phone } from 'lucide-react';
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
    <AppShell>
      <PageWrapper>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="section-label">Account</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white mt-1">Profile 👤</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-border bg-surface-card text-white hover:bg-surface-raised">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* User card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="wallet-hero p-6 lg:col-span-2 relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, hsl(var(--eco-blue) / 0.18) 0%, transparent 70%)' }} />
            <div className="relative flex items-center gap-5">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, hsl(var(--eco-blue)), hsl(220 80% 50%))' }}
              >
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-xs text-muted-foreground-2 flex items-center gap-1 mt-1"><Mail className="w-3 h-3" /> {user.email}</p>
                <p className="text-xs text-muted-foreground-2 flex items-center gap-1"><Phone className="w-3 h-3" /> {user.phone}</p>
                <div className="mt-3"><LevelBadge level={user.level} /></div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Tier progress</span>
                {user.level !== 'Gold' && <span className="text-xs text-muted-foreground-2">{(nextLevel - user.totalWasteKg).toFixed(1)} kg to next tier</span>}
              </div>
              <Progress value={progress} className="h-2.5 bg-surface-raised" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground-2">
                <span>{user.totalWasteKg} kg</span>
                {user.level !== 'Gold' && <span>{nextLevel} kg</span>}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
            <StatCard icon={Recycle} value={user.submissions.length + user.pickups.length} label="Submissions" />
            <StatCard icon={Leaf} value={user.totalWasteKg} label="Kg Recycled" />
            <StatCard icon={Award} value={user.tokens} label="TCC Balance" amber />
          </div>
        </div>
      </PageWrapper>
    </AppShell>
  );
};

const StatCard = ({ icon: Icon, value, label, amber }: { icon: React.ElementType; value: number; label: string; amber?: boolean }) => {
  const c = amber ? 'hsl(var(--eco-amber))' : 'hsl(var(--eco-blue))';
  return (
    <div className="surface-card p-4 text-center">
      <div
        className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2"
        style={{ background: `${c.replace(')', ' / 0.15)')}`, border: `1px solid ${c.replace(')', ' / 0.35)')}` }}
      >
        <Icon className="w-5 h-5" style={{ color: c }} />
      </div>
      <p className="text-xl font-extrabold" style={{ color: c }}>{value}</p>
      <p className="text-[10px] text-muted-foreground-2 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
};

export default Profile;
