import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { getAllRates, getMarketRate } from '@/lib/store';
import { PageWrapper } from '@/components/PageWrapper';
import { TokenBadge } from '@/components/TokenBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Recycle, TrendingUp } from 'lucide-react';

const wasteTypes = [
  { name: 'Plastic', emoji: '🧴', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { name: 'Paper', emoji: '📄', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { name: 'Metal', emoji: '🥫', color: 'bg-slate-50 border-slate-300 text-slate-700' },
  { name: 'E-Waste', emoji: '📱', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { name: 'Glass', emoji: '🍾', color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
  { name: 'Organic', emoji: '🍂', color: 'bg-green-50 border-green-200 text-green-700' },
];

const SellWaste = () => {
  const user = useUser();
  const [selected, setSelected] = useState('');
  const [weight, setWeight] = useState('');
  const [step, setStep] = useState<'select' | 'weight' | 'success'>('select');
  const [earnedTokens, setEarnedTokens] = useState(0);
  const rates = getAllRates();

  const handleSubmit = () => {
    const w = parseFloat(weight);
    if (!selected || !w || w <= 0) return;
    const earned = user.submitWaste(selected, w);
    setEarnedTokens(earned);
    setStep('success');
  };

  const reset = () => {
    setSelected('');
    setWeight('');
    setStep('select');
    setEarnedTokens(0);
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sell Waste</h1>
          <p className="text-sm text-muted-foreground">Drop waste at any café to earn tokens</p>
        </div>
        <TokenBadge amount={user.tokens} />
      </div>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Market Rates */}
            <div className="glass-card p-4 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Today's Market Rates</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {Object.entries(rates).map(([type, rate]) => (
                  <div key={type} className="flex justify-between bg-muted/50 rounded-lg px-2 py-1.5">
                    <span className="text-muted-foreground">{type}</span>
                    <span className="font-semibold">₹{rate}/kg</span>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Select Waste Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {wasteTypes.map(({ name, emoji, color }) => (
                <button
                  key={name}
                  onClick={() => { setSelected(name); setStep('weight'); }}
                  className={`glass-card p-4 flex items-center gap-3 border-2 hover:scale-105 transition-all active:scale-95 ${color}`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{name}</p>
                    <p className="text-xs opacity-70">₹{getMarketRate(name)}/kg</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'weight' && (
          <motion.div key="weight" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <div className="glass-card p-6 space-y-5">
              <div className="text-center">
                <span className="text-4xl">{wasteTypes.find(w => w.name === selected)?.emoji}</span>
                <h2 className="text-xl font-bold mt-2">{selected}</h2>
                <p className="text-sm text-muted-foreground">Rate: ₹{getMarketRate(selected)}/kg</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Weight (kg)</label>
                <Input
                  type="number"
                  placeholder="e.g. 2.5"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="text-center text-lg h-12"
                  min="0.1"
                  step="0.1"
                />
              </div>

              {parseFloat(weight) > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-4 bg-eco-light rounded-xl"
                >
                  <p className="text-sm text-muted-foreground">You'll earn</p>
                  <p className="text-3xl font-bold text-primary">
                    {Math.round(parseFloat(weight) * getMarketRate(selected))} TC
                  </p>
                </motion.div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('select')} className="flex-1">Back</Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!weight || parseFloat(weight) <= 0}
                  className="flex-1 eco-gradient text-primary-foreground"
                >
                  Submit
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-5 py-10"
          >
            <motion.div
              className="w-20 h-20 mx-auto eco-gradient rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <Check className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">Tokens Credited! 🎉</h2>
              <p className="text-muted-foreground mt-1">You earned</p>
              <motion.p
                className="text-4xl font-bold text-primary mt-2"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.4 }}
              >
                +{earnedTokens} TC
              </motion.p>
            </div>
            <Button onClick={reset} className="eco-gradient text-primary-foreground">
              <Recycle className="w-4 h-4 mr-2" /> Sell More Waste
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default SellWaste;
