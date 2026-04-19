import { motion } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { Trophy, TrendingUp, Crown } from 'lucide-react';
import { Coins } from 'lucide-react';

const players = [
  { name: 'Priya Sharma', tc: 892, kg: 124, city: 'Bangalore', tier: 'Gold' },
  { name: 'Rahul Mehta', tc: 674, kg: 98, city: 'Mumbai', tier: 'Gold' },
  { name: 'Aditi Rao', tc: 521, kg: 76, city: 'Delhi', tier: 'Silver' },
  { name: 'Vikram Singh', tc: 488, kg: 71, city: 'Pune', tier: 'Silver' },
  { name: 'Sneha Iyer', tc: 401, kg: 60, city: 'Hyderabad', tier: 'Silver' },
  { name: 'Karan Patel', tc: 376, kg: 55, city: 'Ahmedabad', tier: 'Silver' },
  { name: 'Meera Joshi', tc: 290, kg: 42, city: 'Jaipur', tier: 'Bronze' },
  { name: 'Arnav Reddy', tc: 245, kg: 36, city: 'Chennai', tier: 'Bronze' },
  { name: 'Riya Kapoor', tc: 210, kg: 31, city: 'Kolkata', tier: 'Bronze' },
];

const Leaderboard = () => {
  const user = useUser();
  const youName = user.isLoggedIn ? `${user.name} (You)` : 'Arjun (You)';
  const youEntry = { name: youName, tc: user.isLoggedIn ? user.tokens : 342, kg: user.isLoggedIn ? user.totalWasteKg : 47.5, city: 'Bangalore', tier: 'Silver', you: true };

  const merged = [...players, youEntry].sort((a, b) => b.tc - a.tc);
  const top3 = merged.slice(0, 3);
  const rest = merged.slice(3);

  return (
    <AppShell>
      <PageWrapper>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="section-label">Community</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white mt-1">Leaderboard 🏆</h1>
            <p className="text-muted-foreground-2 mt-1 text-sm">Top recyclers in your region this month</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 surface-raised rounded-full">
            <TrendingUp className="w-3.5 h-3.5 text-eco-green" />
            <span className="text-xs font-semibold text-white">Updated hourly</span>
          </div>
        </div>

        {/* Podium */}
        <div className="grid grid-cols-3 gap-3 lg:gap-5 mb-6 items-end">
          {[top3[1], top3[0], top3[2]].map((p, i) => {
            const isFirst = i === 1;
            const heights = ['h-32', 'h-44', 'h-28'];
            const medals = ['🥈', '🥇', '🥉'];
            const ranks = [2, 1, 3];
            const colors = ['hsl(0 0% 75%)', 'hsl(var(--eco-amber))', 'hsl(28 78% 58%)'];
            return (
              <motion.div
                key={p.name}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className={`text-4xl lg:text-5xl mb-2 ${isFirst ? 'animate-bounce' : ''}`}>{medals[i]}</div>
                <p className="text-xs lg:text-sm font-bold text-white text-center truncate w-full px-1">{p.name}</p>
                <p className="text-xs text-eco-amber font-bold mt-0.5 flex items-center gap-1"><Coins className="w-3 h-3" /> {p.tc} TCC</p>
                <div
                  className={`mt-3 w-full ${heights[i]} rounded-t-2xl flex items-start justify-center pt-2 relative overflow-hidden`}
                  style={{
                    background: `linear-gradient(180deg, ${colors[i].replace(')', ' / 0.3)')} 0%, ${colors[i].replace(')', ' / 0.05)')} 100%)`,
                    border: `1px solid ${colors[i].replace(')', ' / 0.4)')}`,
                  }}
                >
                  <span className="text-2xl lg:text-3xl font-extrabold" style={{ color: colors[i] }}>#{ranks[i]}</span>
                  {isFirst && <Crown className="absolute top-1 right-1 w-4 h-4 text-eco-amber" />}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="surface-flat overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2"><Trophy className="w-4 h-4 text-eco-amber" /> Full Rankings</h3>
            <span className="text-xs text-muted-foreground-2">{merged.length} recyclers</span>
          </div>
          <div className="divide-y divide-border">
            {rest.map((p: any, i) => {
              const rank = i + 4;
              return (
                <div
                  key={p.name + rank}
                  className={`flex items-center gap-4 px-5 py-3.5 transition hover:bg-white/[0.02] ${p.you ? 'bg-eco-blue/10' : ''}`}
                >
                  <span className="w-8 text-sm font-bold text-muted-foreground-2 text-center">#{rank}</span>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--eco-blue)), hsl(220 80% 50%))' }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground-2">{p.city} • {p.tier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-eco-amber">{p.tc} TCC</p>
                    <p className="text-[11px] text-muted-foreground-2">{p.kg} kg</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageWrapper>
    </AppShell>
  );
};

export default Leaderboard;
