import { motion } from 'framer-motion';
import { Gamepad2, Coins, Sparkles, Trophy, Zap, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/lib/UserContext';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { CountUp } from '@/components/CountUp';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface Game {
  id: string;
  name: string;
  desc: string;
  cost: number;
  reward: number;
  difficulty: Difficulty;
  emoji: string;
  gradient: string;
}

const games: Game[] = [
  { id: 'recycle-rush', name: 'RecycleRush', desc: 'Sort waste at lightning speed', cost: 5, reward: 50, difficulty: 'Easy', emoji: '♻️', gradient: 'linear-gradient(135deg, hsl(var(--eco-green)), hsl(var(--eco-teal)))' },
  { id: 'sort-master', name: 'SortMaster', desc: 'Match items to the right bins', cost: 5, reward: 40, difficulty: 'Easy', emoji: '🗑️', gradient: 'linear-gradient(135deg, hsl(var(--eco-blue)), hsl(220 80% 50%))' },
  { id: 'waste-warden', name: 'WasteWarden', desc: 'Defend the city from pollution', cost: 10, reward: 80, difficulty: 'Medium', emoji: '🛡️', gradient: 'linear-gradient(135deg, hsl(var(--eco-amber)), hsl(35 95% 50%))' },
  { id: 'eco-dash', name: 'EcoDash', desc: 'Endless runner through nature', cost: 10, reward: 100, difficulty: 'Medium', emoji: '🏃', gradient: 'linear-gradient(135deg, hsl(var(--eco-coral)), hsl(15 90% 55%))' },
  { id: 'trash-tetris', name: 'TrashTetris', desc: 'Stack and crush garbage blocks', cost: 15, reward: 150, difficulty: 'Hard', emoji: '🧱', gradient: 'linear-gradient(135deg, hsl(280 70% 55%), hsl(var(--eco-blue)))' },
  { id: 'green-quest', name: 'GreenQuest', desc: 'Adventure RPG to save the forest', cost: 20, reward: 200, difficulty: 'Hard', emoji: '🌳', gradient: 'linear-gradient(135deg, hsl(var(--eco-teal)), hsl(160 70% 35%))' },
];

const diffColor = (d: Difficulty) => {
  if (d === 'Easy') return { bg: 'hsl(var(--eco-green) / 0.15)', border: 'hsl(var(--eco-green) / 0.4)', text: 'hsl(var(--eco-green))' };
  if (d === 'Medium') return { bg: 'hsl(var(--eco-amber) / 0.15)', border: 'hsl(var(--eco-amber) / 0.4)', text: 'hsl(var(--eco-amber))' };
  return { bg: 'hsl(var(--eco-coral) / 0.15)', border: 'hsl(var(--eco-coral) / 0.4)', text: 'hsl(var(--eco-coral))' };
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeItem = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Arcade = () => {
  const user = useUser();

  const play = (game: Game) => {
    if (user.tokens < game.cost) {
      toast.error('Not enough TCC', { description: `You need ${game.cost - user.tokens} more TCC to play ${game.name}` });
      return;
    }
    const ok = user.spendTokens(game.cost, `Played ${game.name}`, 'arcade');
    if (!ok) return;
    // Simulate game outcome
    const won = Math.random() > 0.35;
    const winnings = won ? Math.round(game.reward * (0.3 + Math.random() * 0.7)) : 0;
    setTimeout(() => {
      if (won) {
        toast.success(`🎉 You won ${winnings} TCC!`, { description: `${game.name} payout credited to your wallet` });
      } else {
        toast(`Better luck next time at ${game.name}`, { description: 'Try again — the next round could be a jackpot!' });
      }
    }, 400);
  };

  return (
    <AppShell>
      <PageWrapper>
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          {/* Header */}
          <motion.div variants={fadeItem} className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-label mb-1.5 flex items-center gap-2">
                <Gamepad2 className="w-3.5 h-3.5 text-eco-blue" /> Arcade
              </p>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Eco<span className="text-eco-blue">Arcade</span> 🎮
              </h1>
              <p className="text-muted-foreground-2 text-sm mt-1">Play games, earn TrashCash. Every round funds real recycling.</p>
            </div>
            <div className="surface-flat px-5 py-3 flex items-center gap-3">
              <div className="coin-spin"><Coins className="w-5 h-5 text-eco-amber" /></div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">Your balance</p>
                <p className="text-xl font-extrabold text-eco-amber leading-none mt-0.5">
                  <CountUp end={user.tokens} /> <span className="text-sm text-eco-amber/70">TCC</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div variants={fadeItem} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Gamepad2, label: 'Games available', value: games.length, color: 'hsl(var(--eco-blue))' },
              { icon: Trophy, label: 'Top win this week', value: '420 TCC', color: 'hsl(var(--eco-amber))' },
              { icon: Zap, label: 'Live players', value: '1.2K', color: 'hsl(var(--eco-green))' },
              { icon: Sparkles, label: 'Daily bonus', value: '+10 TCC', color: 'hsl(var(--eco-teal))' },
            ].map((s, i) => (
              <div key={i} className="surface-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color.replace(')', ' / 0.15)')}`, border: `1px solid ${s.color.replace(')', ' / 0.3)')}` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">{s.label}</p>
                  <p className="text-base font-bold text-white">{s.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Games grid */}
          <motion.div variants={fadeItem}>
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="section-label">Featured</p>
                <h2 className="text-xl font-bold text-white mt-1">All Games</h2>
              </div>
              <span className="text-xs text-muted-foreground-2 hidden sm:inline">{games.length} titles</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {games.map((g, i) => {
                const d = diffColor(g.difficulty);
                const canPlay = user.tokens >= g.cost;
                return (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="surface-card overflow-hidden group flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative aspect-[16/10] flex items-center justify-center text-7xl overflow-hidden"
                      style={{ background: g.gradient }}
                    >
                      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)' }} />
                      <span className="relative drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{g.emoji}</span>
                      <span
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: d.bg, border: `1px solid ${d.border}`, color: d.text, backdropFilter: 'blur(8px)' }}
                      >
                        {g.difficulty}
                      </span>
                    </div>
                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-extrabold text-white">{g.name}</h3>
                      <p className="text-xs text-muted-foreground-2 mt-1">{g.desc}</p>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="surface-raised p-2.5 rounded-lg">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">Entry</p>
                          <p className="text-sm font-bold text-eco-coral mt-0.5 flex items-center gap-1"><Coins className="w-3 h-3" /> {g.cost} TCC</p>
                        </div>
                        <div className="surface-raised p-2.5 rounded-lg">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">Win up to</p>
                          <p className="text-sm font-bold text-eco-amber mt-0.5 flex items-center gap-1"><Trophy className="w-3 h-3" /> {g.reward} TCC</p>
                        </div>
                      </div>

                      <Button
                        onClick={() => play(g)}
                        disabled={!canPlay}
                        className="btn-eco w-full mt-4 h-10 font-bold disabled:opacity-50"
                      >
                        {canPlay ? <><Gamepad2 className="w-4 h-4 mr-2" /> Play Now</> : <><Lock className="w-4 h-4 mr-2" /> Need {g.cost - user.tokens} more TCC</>}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </PageWrapper>
    </AppShell>
  );
};

export default Arcade;
