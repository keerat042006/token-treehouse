import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coins, ArrowDownToLine, ArrowUpFromLine, Wallet as WalletIcon, X, IndianRupee, Sparkles } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useUser } from '@/lib/UserContext';
import { mockApi } from '@/lib/mockApi';
import { ServerActionOverlay, useAutoClose } from '@/components/ServerActionOverlay';
import { usePending } from '@/lib/PendingActions';
import { useParticleBurst } from '@/hooks/useParticleBurst';

const last7Days = () => {
  const labels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return labels;
};

const incomeData = [20, 84, 0, 45, 0, 120, 50];
const expenseData = [0, 0, 80, 0, 60, 0, 0];

const txns = [
  { sign: '+', amount: 84, label: 'Laptop submission verified', date: 'Apr 20' },
  { sign: '-', amount: 80, label: 'Pool Night booking', date: 'Apr 18' },
  { sign: '+', amount: 120, label: 'Eco Bowling completion reward', date: 'Apr 17' },
  { sign: '-', amount: 60, label: 'Marketplace: Tote bag redeemed', date: 'Apr 15' },
  { sign: '+', amount: 45, label: 'Pickup #PK-0042 completed', date: 'Apr 13' },
  { sign: '+', amount: 20, label: 'Daily login streak bonus', date: 'Apr 12' },
];

const Wallet = () => {
  const user = useUser();
  const burst = useParticleBurst();
  const [cashOpen, setCashOpen] = useState(false);

  const labels = last7Days();
  const chart = labels.map((l, i) => ({ day: l, Income: incomeData[i], Expense: expenseData[i] }));

  return (
    <AppShell>
      <PageWrapper>
        <div className="mb-6">
          <p className="section-label flex items-center gap-2"><WalletIcon className="w-3.5 h-3.5 text-eco-amber" /> TCC Wallet</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mt-1">Your TrashCash Vault 💰</h1>
          <p className="text-muted-foreground-2 text-sm mt-1">Manage balance, view income, and cash out to UPI.</p>
        </div>

        {/* Coin + balance */}
        <div className="glass-deep rounded-3xl p-8 mb-6 text-center relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} />
          <FlipCoin balance={user.tokens} />
          <p
            className="text-5xl lg:text-6xl font-extrabold text-eco-amber mt-6"
            style={{ textShadow: '0 0 32px hsl(var(--eco-amber) / 0.6), 0 0 80px hsl(var(--eco-amber) / 0.25)', fontFamily: 'DM Sans' }}
          >
            {user.tokens} TCC
          </p>
          <p className="text-eco-green/90 mt-2 flex items-center justify-center gap-1 font-semibold">
            <IndianRupee className="w-4 h-4" />{(user.tokens * 0.5).toFixed(2)} <span className="text-muted-foreground-2 font-normal text-xs ml-1">value</span>
          </p>
          <Button onClick={(e) => { burst(e); setCashOpen(true); }} className="btn-amber mt-6 h-12 px-8 font-bold rounded-xl">
            <ArrowUpFromLine className="w-4 h-4 mr-2" /> Cash Out to UPI
          </Button>
        </div>

        {/* Chart */}
        <div className="glass-deep rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-label">Last 7 days</p>
              <h3 className="text-lg font-bold text-white">Income vs Expense</h3>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-eco-green"><span className="w-2.5 h-2.5 rounded-full bg-eco-green inline-block" /> Income</span>
              <span className="flex items-center gap-1.5 text-eco-coral"><span className="w-2.5 h-2.5 rounded-full bg-eco-coral inline-block" /> Expense</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-inc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.55} /><stop offset="100%" stopColor="#10b981" stopOpacity={0.02} /></linearGradient>
                  <linearGradient id="g-exp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff6b35" stopOpacity={0.55} /><stop offset="100%" stopColor="#ff6b35" stopOpacity={0.02} /></linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0d2118', border: '1px solid rgba(0,229,160,0.25)', borderRadius: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} fill="url(#g-inc)" />
                <Area type="monotone" dataKey="Expense" stroke="#ff6b35" strokeWidth={2} fill="url(#g-exp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions */}
        <div className="glass-deep rounded-2xl p-5">
          <h3 className="text-lg font-bold text-white mb-3">Recent Transactions</h3>
          <ul className="space-y-2">
            {txns.map((t, i) => (
              <li key={i} className="flex items-center gap-3 surface-raised rounded-xl p-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.sign === '+' ? 'bg-eco-green/15 text-eco-green' : 'bg-eco-coral/15 text-eco-coral'}`}>
                  {t.sign === '+' ? <ArrowDownToLine className="w-4 h-4" /> : <ArrowUpFromLine className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{t.label}</p>
                  <p className="text-[11px] text-muted-foreground-2">{t.date}</p>
                </div>
                <span className={`text-sm font-bold ${t.sign === '+' ? 'text-eco-green' : 'text-eco-coral'}`}>
                  {t.sign}{t.amount} TCC
                </span>
              </li>
            ))}
          </ul>
        </div>

        {cashOpen && <CashOutModal onClose={() => setCashOpen(false)} balance={user.tokens} />}
      </PageWrapper>
    </AppShell>
  );
};

const FlipCoin = ({ balance }: { balance: number }) => (
  <div style={{ perspective: 1000, display: 'inline-block' }}>
    <motion.div
      style={{
        width: 120, height: 120, position: 'relative',
        transformStyle: 'preserve-3d',
      }}
      animate={{ rotateY: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #fde68a, #f59e0b 60%, #b45309)',
        border: '4px solid #fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(245,158,11,0.5), inset 0 0 20px rgba(255,255,255,0.3)',
        backfaceVisibility: 'hidden',
      }}>
        <span style={{ fontSize: 38, fontWeight: 900, color: '#1a1208' }}>TCC</span>
      </div>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #fde68a, #f59e0b 60%, #b45309)',
        border: '4px solid #fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(245,158,11,0.5), inset 0 0 20px rgba(255,255,255,0.3)',
        transform: 'rotateY(180deg)', backfaceVisibility: 'hidden',
      }}>
        <span style={{ fontSize: 24, fontWeight: 900, color: '#1a1208' }}>{balance}</span>
      </div>
    </motion.div>
  </div>
);

const CashOutModal = ({ onClose, balance }: { onClose: () => void; balance: number }) => {
  const { add, resolve } = usePending();
  const burst = useParticleBurst();
  const [upi, setUpi] = useState('');
  const [amount, setAmount] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const num = parseFloat(amount) || 0;
  const valid = upi.includes('@') && upi.length > 4 && num >= 100 && num <= balance;

  const submit = async (e?: React.MouseEvent<HTMLElement>) => {
    if (e) burst(e);
    if (!valid) return;
    setState('loading');
    const pid = add({ kind: 'cashout', label: `Cashout to ${upi}`, amount: num });
    const res = await mockApi.wallet.cashout({ upiId: upi, tccAmount: num, userId: 'me' });
    if (res.ok) {
      resolve(pid, 'confirmed');
      setState('success');
    } else {
      resolve(pid, 'failed');
      setError(res.error || 'Cashout failed');
      setState('error');
    }
  };

  useAutoClose(state, onClose, 3500);

  return (
    <>
      <motion.div className="fixed inset-0 z-[200] flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        <motion.div className="relative w-full max-w-md rounded-3xl glass-deep p-6" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"><X className="w-5 h-5" /></button>
          <div className="text-center mb-5">
            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center bg-eco-amber/15 border border-eco-amber/40">
              <Sparkles className="w-7 h-7 text-eco-amber" />
            </div>
            <h2 className="text-xl font-extrabold text-white mt-3">Cash Out to UPI</h2>
            <p className="text-xs text-muted-foreground-2 mt-1">Convert TCC into INR (1 TCC = ₹0.50). Min 100 TCC.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-white mb-1.5 block">UPI ID</label>
              <Input value={upi} onChange={e => setUpi(e.target.value)} placeholder="yourname@upi" className="bg-surface-raised border-border text-white" />
            </div>
            <div>
              <label className="text-xs font-semibold text-white mb-1.5 block">Amount (TCC)</label>
              <Input type="number" min={100} max={balance} value={amount} onChange={e => setAmount(e.target.value)} placeholder="100" className="bg-surface-raised border-border text-white" />
              <p className="text-[11px] text-muted-foreground-2 mt-1.5">≈ <span className="text-eco-green font-semibold">₹{(num * 0.5).toFixed(2)}</span> · Available: {balance} TCC</p>
            </div>
          </div>

          <Button onClick={(e) => submit(e)} disabled={!valid} className="btn-amber w-full mt-5 h-11 font-bold disabled:opacity-50">
            Submit Cashout
          </Button>
        </motion.div>
      </motion.div>

      <ServerActionOverlay
        open={state !== 'idle'}
        state={state}
        loadingText="Processing transfer..."
        successTitle="Request submitted! 💸"
        successText="UPI transfer will arrive within 4 hours."
        errorText={error}
        onClose={() => { setState('idle'); if (state === 'success') onClose(); }}
        onRetry={() => submit()}
      />
    </>
  );
};

export default Wallet;
