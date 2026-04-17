import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { getAllRates, getMarketRate } from '@/lib/store';
import { PageWrapper } from '@/components/PageWrapper';
import { TokenBadge } from '@/components/TokenBadge';
import { CelebrationModal } from '@/components/CelebrationModal';
import { fireConfetti } from '@/components/Confetti';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp } from 'lucide-react';

const wasteTypes = [
  { name: 'Plastic', emoji: '🧴' },
  { name: 'Paper', emoji: '📄' },
  { name: 'Metal', emoji: '🥫' },
  { name: 'E-Waste', emoji: '📱' },
  { name: 'Glass', emoji: '🍾' },
  { name: 'Organic', emoji: '🍂' },
];

const SellWaste = () => {
  const user = useUser();
  const [selected, setSelected] = useState('');
  const [weight, setWeight] = useState('');
  const [step, setStep] = useState<'select' | 'weight'>('select');
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(0);
  const rates = getAllRates();

  const handleSubmit = () => {
    const w = parseFloat(weight);
    if (!selected || !w || w <= 0) return;
    const earned = user.submitWaste(selected, w);
    setEarnedTokens(earned);
    setShowCelebration(true);
    fireConfetti();
  };

  const reset = () => {
    setSelected(''); setWeight(''); setStep('select');
    setEarnedTokens(0); setShowCelebration(false);
  };

  return (
    <PageWrapper>
      <CelebrationModal
        open={showCelebration}
        onClose={reset}
        tokens={earnedTokens}
        title="Waste Sold!"
        subtitle={`${weight} kg of ${selected} submitted`}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-cream">Sell Waste ♻️</h1>
          <p className="text-sm text-cream-muted">Drop waste at any café to earn tokens</p>
        </div>
        <TokenBadge amount={user.tokens} />
      </div>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="glass-card-glow p-4 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-lime" />
                <h3 className="text-sm font-bold text-cream">Today's Market Rates</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {Object.entries(rates).map(([type, rate]) => (
                  <div key={type} className="flex justify-between items-center bg-forest-darker rounded-lg px-2.5 py-1.5 border border-border">
                    <span className="text-cream-muted">{type}</span>
                    <span className="font-bold text-lime">₹{rate}</span>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="section-label mb-3">Select Waste Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {wasteTypes.map(({ name, emoji }, i) => (
                <motion.button
                  key={name}
                  onClick={() => { setSelected(name); setStep('weight'); }}
                  className="glass-tile p-4 flex items-center gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-3xl">{emoji}</span>
                  <div className="text-left">
                    <p className="font-bold text-sm text-cream">{name}</p>
                    <p className="text-xs text-lime font-semibold">₹{getMarketRate(name)}/kg</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'weight' && (
          <motion.div key="weight" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <div className="glass-card-glow p-6 space-y-5">
              <div className="text-center">
                <span className="text-5xl">{wasteTypes.find(w => w.name === selected)?.emoji}</span>
                <h2 className="text-xl font-bold mt-2 text-cream">{selected}</h2>
                <p className="text-sm text-cream-muted">Rate: <span className="text-lime font-semibold">₹{getMarketRate(selected)}/kg</span></p>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1.5 block text-cream">Weight (kg)</label>
                <Input
                  type="number"
                  placeholder="e.g. 2.5"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="text-center text-lg h-12 bg-forest-darker border-border text-cream"
                  min="0.1"
                  step="0.1"
                />
              </div>

              {parseFloat(weight) > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-4 eco-gradient-light rounded-2xl"
                >
                  <p className="text-xs text-cream-muted uppercase tracking-wider font-semibold">You'll earn</p>
                  <p className="text-3xl font-bold text-lime mt-1" style={{ textShadow: '0 0 20px hsl(var(--lime) / 0.5)' }}>
                    {Math.round(parseFloat(weight) * getMarketRate(selected))} TC 🪙
                  </p>
                </motion.div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('select')} className="flex-1 border-border text-cream hover:bg-forest-darker">Back</Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!weight || parseFloat(weight) <= 0}
                  className="flex-1 eco-gradient font-bold"
                >
                  Submit ✨
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default SellWaste;
