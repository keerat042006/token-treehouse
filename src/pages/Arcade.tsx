import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Coins, Sparkles, Trophy, Zap, Lock, Star, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/lib/UserContext';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { CountUp } from '@/components/CountUp';
import { TiltCard } from '@/components/TiltCard';
import { GameModal } from '@/components/GameModal';
import { fireEcoConfetti } from '@/components/EcoConfetti';
import { EcoBowling } from '@/components/games/EcoBowling';
import { WasteBlaster } from '@/components/games/WasteBlaster';
import { EcoRunner } from '@/components/games/EcoRunner';
import { PinballEco } from '@/components/games/PinballEco';

type Difficulty = 1 | 2 | 3;

interface Game {
  id: 'bowling' | 'blaster' | 'runner' | 'pinball';
  name: string;
  desc: string;
  cost: number;
  reward: string;
  difficulty: Difficulty;
  emoji: string;
  gradient: string;
}

const games: Game[] = [
  { id: 'bowling', name: 'EcoBowling', desc: 'Strike pins, score TCC frames', cost: 5, reward: '5–150', difficulty: 2, emoji: '🎳', gradient: 'linear-gradient(135deg, hsl(var(--eco-amber)), hsl(35 95% 50%))' },
  { id: 'blaster', name: 'WasteBlaster', desc: 'Blast waste before it hits ground', cost: 5, reward: '10–200', difficulty: 2, emoji: '🎯', gradient: 'linear-gradient(135deg, hsl(var(--eco-coral)), hsl(15 90% 55%))' },
  { id: 'runner', name: 'EcoRunner', desc: 'Endless runner, dodge pollution', cost: 5, reward: '10–250', difficulty: 1, emoji: '🏃', gradient: 'linear-gradient(135deg, hsl(var(--eco-green)), hsl(160 70% 35%))' },
  { id: 'pinball', name: 'PinballEco', desc: 'Bumpers, flippers, eco physics', cost: 10, reward: '20–300', difficulty: 3, emoji: '🪩', gradient: 'linear-gradient(135deg, hsl(280 70% 55%), hsl(var(--eco-blue)))' },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeItem = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Arcade = () => {
  const user = useUser();
  const [active, setActive] = useState<Game | null>(null);

  const play = (g: Game) => {
    if (user.tokens < g.cost) {
      toast.error('Not enough TCC', { description: `You need ${g.cost - user.tokens} more TCC to play ${g.name}` });
      return;
    }
    const ok = user.spendTokens(g.cost, `Played ${g.name}`, 'arcade');
    if (!ok) return;
    setActive(g);
  };

  const handleWin = (tcc: number) => {
    if (tcc <= 0) return;
    fireEcoConfetti();
    user.creditTokens(tcc, `Won ${tcc} TCC at ${active?.name}`, 'arcade');
    toast.success(`🎉 You won ${tcc} TCC!`, { description: `Credited from ${active?.name}` });
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
                Eco<span className="text-eco-green text-glow-eco">Arcade</span> 🎮
              </h1>
              <p className="text-muted-foreground-2 text-sm mt-1">Play games, earn TrashCash. Every round funds real recycling.</p>
            </div>
            <div className="glass-deep px-5 py-3 rounded-2xl flex items-center gap-3">
              <div className="coin-spin"><Coins className="w-5 h-5 text-eco-amber" /></div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">Your balance</p>
                <p className="text-xl font-extrabold text-eco-amber leading-none mt-0.5 text-glow-amber">
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
              <TiltCard key={i} className="glass-deep p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color.replace(')', ' / 0.15)')}`, border: `1px solid ${s.color.replace(')', ' / 0.3)')}` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">{s.label}</p>
                  <p className="text-base font-bold text-white">{s.value}</p>
                </div>
              </TiltCard>
            ))}
          </motion.div>

          {/* Games grid */}
          <motion.div variants={fadeItem}>
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="section-label">Featured</p>
                <h2 className="text-xl font-bold text-white mt-1">All Games · Fully playable</h2>
              </div>
              <span className="text-xs text-muted-foreground-2 hidden sm:inline">{games.length} titles</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {games.map((g, i) => {
                const canPlay = user.tokens >= g.cost;
                return (
                  <TiltCard
                    key={g.id}
                    max={6}
                    className="glass-deep rounded-2xl overflow-hidden group flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative aspect-[16/10] flex items-center justify-center text-7xl overflow-hidden"
                      style={{ background: g.gradient }}
                    >
                      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)' }} />
                      <span className="relative drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{g.emoji}</span>
                      <span
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', color: '#fff' }}
                      >
                        {Array.from({ length: g.difficulty }).map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-eco-amber text-eco-amber" />
                        ))}
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
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">Win range</p>
                          <p className="text-sm font-bold text-eco-amber mt-0.5 flex items-center gap-1 text-glow-amber"><Trophy className="w-3 h-3" /> {g.reward}</p>
                        </div>
                      </div>

                      <Button
                        onClick={() => play(g)}
                        disabled={!canPlay}
                        className="btn-eco w-full mt-4 h-10 font-bold disabled:opacity-50"
                        style={{ boxShadow: canPlay ? '0 0 20px hsl(var(--eco-blue) / 0.5)' : undefined }}
                      >
                        {canPlay ? <><Play className="w-4 h-4 mr-2" /> Play Now</> : <><Lock className="w-4 h-4 mr-2" /> Need {g.cost - user.tokens} more TCC</>}
                      </Button>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        <GameModal open={!!active} onClose={() => setActive(null)} title={active?.name || ''}>
          {active?.id === 'bowling' && <EcoBowling onWin={handleWin} />}
          {active?.id === 'blaster' && <WasteBlaster onWin={handleWin} />}
          {active?.id === 'runner' && <EcoRunner onWin={handleWin} />}
          {active?.id === 'pinball' && <PinballEco onWin={handleWin} />}
        </GameModal>
      </PageWrapper>
    </AppShell>
  );
};

export default Arcade;
