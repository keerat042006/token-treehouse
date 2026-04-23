import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { fireTokenRain } from '@/components/Confetti';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, MapPin, Clock, Package, ChevronRight, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import type { PickupRequest } from '@/lib/store';
import { mockApi } from '@/lib/mockApi';
import { usePending } from '@/lib/PendingActions';
import { ServerActionOverlay, useAutoClose } from '@/components/ServerActionOverlay';
import { useParticleBurst } from '@/hooks/useParticleBurst';

const timeSlots = ['09:00 - 11:00', '11:00 - 13:00', '14:00 - 16:00', '16:00 - 18:00'];
const wasteOptions = ['Plastic', 'Paper', 'Metal', 'E-Waste', 'Glass', 'Organic'];

// 5-step token flow
type PickupStatus = PickupRequest['status'];

const STATUS_STEPS: { key: PickupStatus; label: string; desc: string; icon: string }[] = [
  { key: 'scheduled',                label: 'Pickup Scheduled',        desc: 'Your pickup has been confirmed.',                                                                icon: '📅' },
  { key: 'worker_assigned',          label: 'Worker Assigned',          desc: 'A verified EcoFusion agent has been assigned to your pickup.',                                  icon: '👷' },
  { key: 'waste_collected',          label: 'Waste Collected',          desc: 'Collection confirmed! Your EcoFusion tokens are on their way to your wallet.',                  icon: '♻️' },
  { key: 'verification_in_progress', label: 'Verification In Progress', desc: 'Our team is verifying the waste type and weight. This usually takes under 30 minutes.',        icon: '🔍' },
  { key: 'tokens_credited',          label: 'Tokens Credited',          desc: 'Your waste has been successfully collected and verified. EcoFusion tokens have been credited to your wallet. Thank you for making a difference.', icon: '🪙' },
];

const getStepIndex = (status: PickupStatus) =>
  STATUS_STEPS.findIndex(s => s.key === status);

const nextStatus = (status: PickupStatus): PickupStatus | null => {
  const idx = getStepIndex(status);
  return idx < STATUS_STEPS.length - 1 ? STATUS_STEPS[idx + 1].key : null;
};

// Zomato-style vertical tracker
const StatusTracker = ({ pickup }: { pickup: PickupRequest }) => {
  const currentIdx = getStepIndex(pickup.status);
  return (
    <div className="space-y-0">
      {STATUS_STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const pending = i > currentIdx;
        return (
          <div key={step.key} className="flex gap-4">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 transition-all duration-500"
                style={{
                  background: done ? '#00e5a0' : active ? 'linear-gradient(135deg,#00e5a0,#00c2ff)' : 'hsl(var(--surface-raised))',
                  border: active ? '2px solid #00e5a0' : done ? 'none' : '2px solid hsl(var(--border))',
                  boxShadow: active ? '0 0 12px rgba(0,229,160,0.6)' : 'none',
                }}
              >
                {done ? (
                  <CheckCircle2 className="w-4 h-4 text-black" />
                ) : active ? (
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                ) : (
                  <span className="text-muted-foreground-2 text-xs">{i + 1}</span>
                )}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className="w-0.5 flex-1 min-h-[28px] transition-all duration-500"
                  style={{ background: done ? '#00e5a0' : 'hsl(var(--border))' }}
                />
              )}
            </div>

            {/* Content */}
            <div className={`pb-5 flex-1 ${i === STATUS_STEPS.length - 1 ? 'pb-0' : ''}`}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-base">{step.icon}</span>
                <p
                  className="text-sm font-bold"
                  style={{ color: done || active ? '#fff' : 'hsl(var(--text-muted))' }}
                >
                  {step.label}
                </p>
                {active && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,229,160,0.15)', color: '#00e5a0', border: '1px solid rgba(0,229,160,0.4)' }}
                  >
                    IN PROGRESS
                  </span>
                )}
                {done && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,229,160,0.1)', color: '#00e5a0' }}
                  >
                    DONE
                  </span>
                )}
              </div>
              {(done || active) && (
                <p className="text-xs text-muted-foreground-2 leading-relaxed">{step.desc}</p>
              )}
              {pickup.statusTimestamps?.[step.key] && (
                <p className="text-[11px] text-muted-foreground-2 mt-0.5 font-mono">
                  {pickup.statusTimestamps[step.key]}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const fadeVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.3, ease: 'easeIn' } },
};

const Pickup = () => {
  const user = useUser();
  const { add, resolve } = usePending();
  const burst = useParticleBurst();
  const [view, setView] = useState<'form' | 'tracking'>('form');
  const [address, setAddress] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [weight, setWeight] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [serverState, setServerState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async () => {
    if (!address || !wasteType || !weight || !timeSlot) return;
    setServerState('loading');
    const pid = add({ kind: 'pickup', label: `${wasteType} pickup @ ${address.slice(0, 24)}`, amount: 0 });
    const res = await mockApi.pickup.schedule({ address, wasteType, weight: parseFloat(weight), timeSlot });
    if (res.ok) {
      user.requestPickup(address, wasteType, parseFloat(weight), timeSlot);
      resolve(pid, 'confirmed');
      setServerState('idle');
      setSubmitted(true);
      fireTokenRain();
      setTimeout(() => {
        setSubmitted(false);
        setView('tracking');
        setAddress(''); setWasteType(''); setWeight(''); setTimeSlot('');
      }, 3000);
    } else {
      resolve(pid, 'failed');
      setErrMsg(res.error || 'Pickup scheduling failed');
      setServerState('error');
    }
  };

  const advanceStatus = (id: string, currentStatus: PickupStatus) => {
    const next = nextStatus(currentStatus);
    if (next) user.updatePickupStatus(id, next);
  };

  return (
    <AppShell>
      <PageWrapper>
        <div className="mb-6">
          <p className="section-label">Doorstep service</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mt-1">Schedule a Pickup 🚚</h1>
          <p className="text-muted-foreground-2 text-sm mt-1">We collect waste from your door within 24 hours</p>
        </div>

        <div className="flex gap-2 mb-5">
          <Button
            className={view === 'form' ? 'btn-eco font-bold' : 'bg-surface-card border border-border text-white hover:bg-surface-raised'}
            onClick={() => setView('form')}
            size="sm"
          >
            New Pickup
          </Button>
          <Button
            className={view === 'tracking' ? 'btn-eco font-bold' : 'bg-surface-card border border-border text-white hover:bg-surface-raised'}
            onClick={() => setView('tracking')}
            size="sm"
          >
            Track ({user.pickups.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {view === 'form' && !submitted && (
                <motion.div key="form" variants={fadeVariants} initial="initial" animate="animate" exit="exit">
                  <div className="surface-flat p-6 space-y-4">
                    <div>
                      <label className="text-sm font-semibold flex items-center gap-1 mb-1.5 text-white">
                        <MapPin className="w-3.5 h-3.5 text-eco-blue" /> Address
                      </label>
                      <Input placeholder="42 MG Road, Bangalore" value={address} onChange={e => setAddress(e.target.value)} className="bg-surface-raised border-border text-white" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold flex items-center gap-1 mb-1.5 text-white">
                          <Package className="w-3.5 h-3.5 text-eco-blue" /> Waste Type
                        </label>
                        <Select value={wasteType} onValueChange={setWasteType}>
                          <SelectTrigger className="bg-surface-raised border-border text-white"><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            {wasteOptions.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block text-white">Approx. Weight (kg)</label>
                        <Input type="number" placeholder="e.g. 5" value={weight} onChange={e => setWeight(e.target.value)} min="0.5" step="0.5" className="bg-surface-raised border-border text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold flex items-center gap-1 mb-1.5 text-white">
                        <Clock className="w-3.5 h-3.5 text-eco-blue" /> Preferred Time
                      </label>
                      <Select value={timeSlot} onValueChange={setTimeSlot}>
                        <SelectTrigger className="bg-surface-raised border-border text-white"><SelectValue placeholder="Select slot" /></SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={(e) => { burst(e); handleSubmit(); }}
                      disabled={!address || !wasteType || !weight || !timeSlot}
                      className="w-full btn-eco h-12 text-base font-bold"
                    >
                      <Truck className="w-4 h-4 mr-2" /> Schedule Pickup
                    </Button>
                  </div>
                </motion.div>
              )}

              {submitted && (
                <motion.div key="submitted" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="surface-flat p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4" style={{ background: 'rgba(0,229,160,0.15)', border: '2px solid rgba(0,229,160,0.4)' }}>
                      📅
                    </div>
                    <h2 className="text-xl font-bold text-white">Pickup Scheduled</h2>
                    <p className="text-muted-foreground-2 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                      Your pickup has been confirmed. Tokens are being processed and will reflect in your wallet once our team completes the collection.
                    </p>
                  </div>
                </motion.div>
              )}

              {view === 'tracking' && (
                <motion.div key="tracking" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                  {user.pickups.length === 0 ? (
                    <div className="text-center py-16 surface-flat text-muted-foreground-2">
                      <Truck className="w-12 h-12 mx-auto opacity-30 mb-3" />
                      <p>No pickups yet</p>
                    </div>
                  ) : (
                    user.pickups.map(p => (
                      <div key={p.id} className="surface-card p-5 space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-bold text-white">{p.wasteType} — {p.weight} kg</p>
                            <p className="text-xs text-muted-foreground-2 mt-0.5">{p.address}</p>
                            <p className="text-xs text-muted-foreground-2">{p.timeSlot} · {p.date}</p>
                            {p.agent && (
                              <p className="text-xs mt-1 text-white">
                                Agent: <span className="font-semibold text-eco-blue">{p.agent}</span>
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="token-pill text-xs px-2.5 py-1">+{p.tokens} TCC</span>
                            {p.status === 'tokens_credited' && (
                              <p className="text-[10px] text-eco-green mt-1 font-semibold">Credited ✓</p>
                            )}
                          </div>
                        </div>

                        {/* 5-step tracker */}
                        <div className="pt-2 border-t border-border">
                          <StatusTracker pickup={p} />
                        </div>

                        {/* Simulate next step button */}
                        {p.status !== 'tokens_credited' && (
                          <div className="flex justify-end pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => advanceStatus(p.id, p.status)}
                              className="text-xs h-7 border-border bg-surface-raised text-white hover:bg-surface-card"
                            >
                              Simulate Next Step <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <div className="surface-flat p-5">
              <h3 className="text-sm font-bold text-white mb-3">Why doorstep?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground-2">
                <li>🚚 Free pickup, no minimum</li>
                <li>⚡ Within 24 hours, citywide</li>
                <li>💰 Same market rates as drop-off</li>
                <li>🌱 Verified agents & paperwork</li>
              </ul>
            </div>
            <div className="surface-flat p-5">
              <h3 className="text-sm font-bold text-white mb-2">Token Timeline</h3>
              <p className="text-xs text-muted-foreground-2 leading-relaxed">
                Tokens are credited after our team collects and verifies your waste. The full process typically takes 1–3 hours from pickup.
              </p>
            </div>
          </div>
        </div>

        <ServerActionOverlay
          open={serverState !== 'idle'}
          state={serverState}
          loadingText="Scheduling pickup..."
          successTitle="Pickup scheduled!"
          successText="Pickup scheduled! Your tokens are being processed and will reflect in your wallet once our team completes the collection."
          errorText={errMsg}
          onClose={() => setServerState('idle')}
          onRetry={handleSubmit}
        />
      </PageWrapper>
    </AppShell>
  );
};

export default Pickup;
