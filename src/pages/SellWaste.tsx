import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { getAllRates, getMarketRate } from '@/lib/store';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { CelebrationModal } from '@/components/CelebrationModal';
import { fireConfetti } from '@/components/Confetti';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, ArrowLeft, Coins, Camera } from 'lucide-react';
import { ARScanner } from '@/components/ARScanner';
import { mockApi } from '@/lib/mockApi';
import { usePending } from '@/lib/PendingActions';
import { ServerActionOverlay, useAutoClose } from '@/components/ServerActionOverlay';

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
  const { add, resolve } = usePending();
  const [selected, setSelected] = useState('');
  const [weight, setWeight] = useState('');
  const [step, setStep] = useState<'select' | 'weight'>('select');
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(0);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [serverState, setServerState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');
  const rates = getAllRates();

  const handleSubmit = async () => {
    const w = parseFloat(weight);
    if (!selected || !w || w <= 0) return;
    setServerState('loading');
    const pid = add({ kind: 'waste', label: `${selected} · ${w} kg`, amount: Math.round(w * getMarketRate(selected)) });
    const res = await mockApi.waste.submit({ type: selected, weight: w, method: 'cafe-drop' });
    if (res.ok) {
      const earned = user.submitWaste(selected, w);
      resolve(pid, 'confirmed');
      setEarnedTokens(earned);
      setServerState('idle');
      setShowCelebration(true);
      fireConfetti();
    } else {
      resolve(pid, 'failed');
      setErrMsg(res.error || 'Submission failed');
      setServerState('error');
    }
  };

  const reset = () => {
    setSelected(''); setWeight(''); setStep('select');
    setEarnedTokens(0); setShowCelebration(false);
  };

  const onScannerResult = ({ category, weightKg }: { category: string; weightKg: number }) => {
    setSelected(category);
    setWeight(String(weightKg));
    setStep('weight');
  };


  return (
    <AppShell>
      <PageWrapper>
        <CelebrationModal
          open={showCelebration}
          onClose={reset}
          tokens={earnedTokens}
          title="Waste Submitted!"
          subtitle={`${weight} kg of ${selected} successfully verified`}
        />

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-label">Earn TCC</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white mt-1">Sell Waste ♻️</h1>
            <p className="text-muted-foreground-2 text-sm mt-1">Drop waste at any partner café to earn tokens instantly</p>
          </div>
          <Button onClick={() => setScannerOpen(true)} className="btn-eco font-bold h-11 px-5 rounded-xl">
            <Camera className="w-4 h-4 mr-2" /> Scan Waste with Camera
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 'select' && (
                <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="surface-flat p-5 mb-5">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-eco-blue" />
                      <h3 className="text-sm font-bold text-white">Today's Market Rates</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {Object.entries(rates).map(([type, rate]) => (
                        <div key={type} className="flex justify-between items-center surface-raised px-3 py-2">
                          <span className="text-muted-foreground-2">{type}</span>
                          <span className="font-bold text-eco-amber">₹{rate}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="section-label mb-3">Select Waste Type</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {wasteTypes.map(({ name, emoji }, i) => (
                      <motion.button
                        key={name}
                        onClick={() => { setSelected(name); setStep('weight'); }}
                        className="surface-card p-4 flex items-center gap-3 text-left"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="text-3xl">{emoji}</span>
                        <div>
                          <p className="font-bold text-sm text-white">{name}</p>
                          <p className="text-xs text-eco-amber font-semibold">₹{getMarketRate(name)}/kg</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 'weight' && (
                <motion.div key="weight" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <button onClick={() => setStep('select')} className="text-xs font-semibold text-eco-blue mb-3 inline-flex items-center gap-1 hover:underline">
                    <ArrowLeft className="w-3 h-3" /> Back to types
                  </button>
                  <div className="surface-flat p-6 lg:p-8 space-y-5 wallet-hero">
                    <div className="text-center">
                      <span className="text-6xl">{wasteTypes.find(w => w.name === selected)?.emoji}</span>
                      <h2 className="text-2xl font-bold mt-3 text-white">{selected}</h2>
                      <p className="text-sm text-muted-foreground-2">Rate: <span className="text-eco-amber font-semibold">₹{getMarketRate(selected)}/kg</span></p>
                    </div>

                    <div className="max-w-sm mx-auto">
                      <label className="text-sm font-semibold mb-1.5 block text-white">Weight (kg)</label>
                      <Input
                        type="number"
                        placeholder="e.g. 2.5"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                        className="text-center text-lg h-12 bg-surface-raised border-border text-white"
                        min="0.1"
                        step="0.1"
                      />
                    </div>

                    {parseFloat(weight) > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-5 rounded-2xl max-w-sm mx-auto"
                        style={{ background: 'hsl(var(--eco-amber) / 0.1)', border: '1px solid hsl(var(--eco-amber) / 0.35)' }}
                      >
                        <p className="text-xs text-muted-foreground-2 uppercase tracking-wider font-semibold">You'll earn</p>
                        <p className="text-4xl font-extrabold text-eco-amber mt-1 flex items-center justify-center gap-2" style={{ textShadow: '0 0 20px hsl(var(--eco-amber) / 0.5)' }}>
                          <Coins className="w-7 h-7 coin-spin" />
                          {Math.round(parseFloat(weight) * getMarketRate(selected))} TCC
                        </p>
                      </motion.div>
                    )}

                    <div className="flex gap-3 max-w-sm mx-auto">
                      <Button variant="outline" onClick={() => setStep('select')} className="flex-1 border-border bg-surface-card hover:bg-surface-raised text-white">Back</Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!weight || parseFloat(weight) <= 0}
                        className="flex-1 btn-eco font-bold"
                      >
                        Submit ✨
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Side info */}
          <div className="space-y-4">
            <div className="surface-flat p-5">
              <h3 className="text-sm font-bold text-white mb-3">How it works</h3>
              <ol className="space-y-3 text-sm text-muted-foreground-2">
                {['Pick your waste type', 'Enter weight (kg)', 'Drop at partner café', 'Tokens credited instantly'].map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-eco-blue/20 border border-eco-blue/40 text-eco-blue text-[11px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="surface-flat p-5 wallet-hero">
              <p className="section-label">Your wallet</p>
              <p className="text-3xl font-extrabold text-eco-blue mt-2">{user.tokens} <span className="text-base text-eco-blue/70">TCC</span></p>
              <p className="text-xs text-eco-amber mt-1">≈ ₹{user.tokens.toFixed(2)} INR</p>
            </div>
          </div>
        </div>
      </PageWrapper>
    </AppShell>
  );
};

export default SellWaste;
