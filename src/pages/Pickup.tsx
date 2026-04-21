import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { fireTokenRain } from '@/components/Confetti';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, MapPin, Clock, Package, ChevronRight, PartyPopper } from 'lucide-react';
import type { PickupRequest } from '@/lib/store';
import { mockApi } from '@/lib/mockApi';
import { usePending } from '@/lib/PendingActions';
import { ServerActionOverlay, useAutoClose } from '@/components/ServerActionOverlay';

const timeSlots = ['09:00 - 11:00', '11:00 - 13:00', '14:00 - 16:00', '16:00 - 18:00'];
const wasteOptions = ['Plastic', 'Paper', 'Metal', 'E-Waste', 'Glass', 'Organic'];

const statusSteps: PickupRequest['status'][] = ['requested', 'assigned', 'on-the-way', 'collected'];
const statusLabels: Record<string, string> = {
  requested: 'Requested',
  assigned: 'Agent Assigned',
  'on-the-way': 'On the Way',
  collected: 'Collected ✓',
};

const Pickup = () => {
  const user = useUser();
  const [view, setView] = useState<'form' | 'tracking'>('form');
  const [address, setAddress] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [weight, setWeight] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!address || !wasteType || !weight || !timeSlot) return;
    user.requestPickup(address, wasteType, parseFloat(weight), timeSlot);
    setSubmitted(true);
    fireTokenRain();
    setTimeout(() => {
      setSubmitted(false);
      setView('tracking');
      setAddress(''); setWasteType(''); setWeight(''); setTimeSlot('');
    }, 2500);
  };

  const advanceStatus = (id: string, currentStatus: PickupRequest['status']) => {
    const idx = statusSteps.indexOf(currentStatus);
    if (idx < statusSteps.length - 1) user.updatePickupStatus(id, statusSteps[idx + 1]);
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
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="surface-flat p-6 space-y-4">
                    <div>
                      <label className="text-sm font-semibold flex items-center gap-1 mb-1.5 text-white"><MapPin className="w-3.5 h-3.5 text-eco-blue" /> Address</label>
                      <Input placeholder="42 MG Road, Bangalore" value={address} onChange={e => setAddress(e.target.value)} className="bg-surface-raised border-border text-white" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold flex items-center gap-1 mb-1.5 text-white"><Package className="w-3.5 h-3.5 text-eco-blue" /> Waste Type</label>
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
                      <label className="text-sm font-semibold flex items-center gap-1 mb-1.5 text-white"><Clock className="w-3.5 h-3.5 text-eco-blue" /> Preferred Time</label>
                      <Select value={timeSlot} onValueChange={setTimeSlot}>
                        <SelectTrigger className="bg-surface-raised border-border text-white"><SelectValue placeholder="Select slot" /></SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={!address || !wasteType || !weight || !timeSlot}
                      className="w-full btn-eco h-12 text-base font-bold"
                    >
                      <Truck className="w-4 h-4 mr-2" /> Schedule Pickup
                    </Button>
                  </div>
                </motion.div>
              )}

              {submitted && (
                <motion.div key="submitted" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 surface-flat">
                  <motion.div
                    className="w-20 h-20 mx-auto btn-eco rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 12 }}
                  >
                    <PartyPopper className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-xl font-bold mt-4 text-white">Pickup Scheduled! 🎉</h2>
                  <p className="text-muted-foreground-2 text-sm mt-1">You'll be notified at each step</p>
                </motion.div>
              )}

              {view === 'tracking' && (
                <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  {user.pickups.length === 0 ? (
                    <div className="text-center py-16 surface-flat text-muted-foreground-2">
                      <Truck className="w-12 h-12 mx-auto opacity-30 mb-3" />
                      <p>No pickups yet</p>
                    </div>
                  ) : (
                    user.pickups.map(p => (
                      <div key={p.id} className="surface-card p-5 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-bold text-white">{p.wasteType} — {p.weight} kg</p>
                            <p className="text-xs text-muted-foreground-2">{p.address}</p>
                            <p className="text-xs text-muted-foreground-2">{p.timeSlot} · {p.date}</p>
                            {p.agent && <p className="text-xs mt-1 text-white">Agent: <span className="font-semibold text-eco-blue">{p.agent}</span></p>}
                          </div>
                          <span className="token-pill text-xs px-2.5 py-1">+{p.tokens} TCC</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {statusSteps.map((s, i) => {
                            const currentIdx = statusSteps.indexOf(p.status);
                            const done = i <= currentIdx;
                            return (
                              <div key={s} className="flex-1">
                                <div className={`h-2 rounded-full transition-colors ${done ? 'btn-eco' : 'bg-surface-raised border border-border'}`} />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-eco-blue">{statusLabels[p.status]}</span>
                          {p.status !== 'collected' && (
                            <Button size="sm" variant="outline" onClick={() => advanceStatus(p.id, p.status)} className="text-xs h-7 border-border bg-surface-raised text-white hover:bg-surface-card">
                              Simulate Next <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                        </div>
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
          </div>
        </div>
      </PageWrapper>
    </AppShell>
  );
};

export default Pickup;
