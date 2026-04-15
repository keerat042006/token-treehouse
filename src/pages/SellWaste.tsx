import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { getAllRates, getMarketRate } from '@/lib/store';
import { PageWrapper } from '@/components/PageWrapper';
import { CelebrationModal } from '@/components/CelebrationModal';
import { fireConfetti } from '@/components/Confetti';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Recycle, TrendingUp } from 'lucide-react';

const wasteTypes = [
  { name: 'Plastic', emoji: '🧴', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:shadow-md' },
  { name: 'Paper', emoji: '📄', color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:shadow-md' },
  { name: 'Metal', emoji: '🥫', color: 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:shadow-md' },
  { name: 'E-Waste', emoji: '📱', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100 hover:shadow-md' },
  { name: 'Glass', emoji: '🍾', color: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100 hover:shadow-md' },
  { name: 'Organic', emoji: '🍂', color: 'bg-green-50 border-green-200 hover:bg-green-100 hover:shadow-md' },
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
    setSelected('');
    setWeight('');
    setStep('select');
    setEarnedTokens(0);
    setShowCelebration(false);
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

      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Sell Waste ♻️</h1>
        <p className="text-sm text-muted-foreground mt-1">Drop waste at any café to earn tokens</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Market Rates — always visible as a side panel on desktop */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="glass-card-glow p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Today's Market Rates</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(rates).map(([type, rate]) => (
                <div key={type} className="flex justify-between items-center bg-secondary rounded-lg px-3 py-2 hover:bg-secondary/80 transition-colors">
                  <span className="text-sm text-muted-foreground">{type}</span>
                  <span className="text-sm font-bold text-foreground">₹{rate}/kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Main action area */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <AnimatePresence mode="wait">
            {step === 'select' && (
              <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Select Waste Type</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {wasteTypes.map(({ name, emoji, color }) => (
                    <motion.button
                      key={name}
                      onClick={() => { setSelected(name); setStep('weight'); }}
                      className={`glass-card p-4 flex items-center gap-3 border-2 transition-all cursor-pointer ${color}`}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-3xl">{emoji}</span>
                      <div className="text-left">
                        <p className="font-semibold text-sm text-foreground">{name}</p>
                        <p className="text-xs text-muted-foreground">₹{getMarketRate(name)}/kg</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'weight' && (
              <motion.div key="weight" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="max-w-md">
                <div className="glass-card-glow p-6 space-y-5">
                  <div className="text-center">
                    <span className="text-5xl">{wasteTypes.find(w => w.name === selected)?.emoji}</span>
                    <h2 className="text-xl font-bold mt-2 text-foreground">{selected}</h2>
                    <p className="text-sm text-muted-foreground">Rate: ₹{getMarketRate(selected)}/kg</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block text-foreground">Weight (kg)</label>
                    <Input
                      type="number"
                      placeholder="e.g. 2.5"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      className="text-center text-lg h-11"
                      min="0.1"
                      step="0.1"
                    />
                  </div>

                  {parseFloat(weight) > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center p-4 eco-gradient-light rounded-2xl border border-primary/20"
                    >
                      <p className="text-sm text-muted-foreground">You'll earn</p>
                      <p className="text-3xl font-bold text-primary">
                        {Math.round(parseFloat(weight) * getMarketRate(selected))} TC 🪙
                      </p>
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep('select')} className="flex-1">Back</Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!weight || parseFloat(weight) <= 0}
                      className="flex-1 eco-gradient text-primary-foreground font-semibold"
                    >
                      Submit ✨
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SellWaste;
