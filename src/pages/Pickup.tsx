import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { PageWrapper } from '@/components/PageWrapper';
import { TokenBadge } from '@/components/TokenBadge';
import { fireTokenRain } from '@/components/Confetti';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, MapPin, Clock, Package, ChevronRight, PartyPopper } from 'lucide-react';
import type { PickupRequest } from '@/lib/store';

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
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-cream">Doorstep Pickup 🚚</h1>
          <p className="text-sm text-cream-muted">We collect waste from your door</p>
        </div>
        <TokenBadge amount={user.tokens} />
      </div>

      <div className="flex gap-2 mb-5">
        <Button
          className={view === 'form' ? 'eco-gradient font-bold' : 'bg-forest-card border border-border text-cream hover:bg-forest-darker'}
          onClick={() => setView('form')}
          size="sm"
        >
          Request Pickup
        </Button>
        <Button
          className={view === 'tracking' ? 'eco-gradient font-bold' : 'bg-forest-card border border-border text-cream hover:bg-forest-darker'}
          onClick={() => setView('tracking')}
          size="sm"
        >
          Track ({user.pickups.length})
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'form' && !submitted && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="glass-card-glow p-5 space-y-4">
              <div>
                <label className="text-sm font-semibold flex items-center gap-1 mb-1.5 text-cream"><MapPin className="w-3.5 h-3.5 text-lime" /> Address</label>
                <Input placeholder="42 MG Road, Bangalore" value={address} onChange={e => setAddress(e.target.value)} className="bg-forest-darker border-border text-cream" />
              </div>
              <div>
                <label className="text-sm font-semibold flex items-center gap-1 mb-1.5 text-cream"><Package className="w-3.5 h-3.5 text-lime" /> Waste Type</label>
                <Select value={wasteType} onValueChange={setWasteType}>
                  <SelectTrigger className="bg-forest-darker border-border text-cream"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {wasteOptions.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block text-cream">Approx. Weight (kg)</label>
                <Input type="number" placeholder="e.g. 5" value={weight} onChange={e => setWeight(e.target.value)} min="0.5" step="0.5" className="bg-forest-darker border-border text-cream" />
              </div>
              <div>
                <label className="text-sm font-semibold flex items-center gap-1 mb-1.5 text-cream"><Clock className="w-3.5 h-3.5 text-lime" /> Preferred Time</label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger className="bg-forest-darker border-border text-cream"><SelectValue placeholder="Select slot" /></SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!address || !wasteType || !weight || !timeSlot}
                className="w-full eco-gradient h-12 text-base font-bold rounded-2xl"
              >
                <Truck className="w-4 h-4 mr-2" /> Schedule Pickup
              </Button>
            </div>
          </motion.div>
        )}

        {submitted && (
          <motion.div key="submitted" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
            <motion.div
              className="w-20 h-20 mx-auto eco-gradient rounded-full flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <PartyPopper className="w-10 h-10" style={{ color: 'hsl(var(--forest-deep))' }} />
            </motion.div>
            <h2 className="text-xl font-bold mt-4 text-cream">Pickup Scheduled! 🎉</h2>
            <p className="text-cream-muted text-sm mt-1">You'll be notified at each step</p>
          </motion.div>
        )}

        {view === 'tracking' && (
          <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {user.pickups.length === 0 ? (
              <div className="text-center py-10 text-cream-muted">
                <Truck className="w-12 h-12 mx-auto opacity-30 mb-3" />
                <p>No pickups yet</p>
              </div>
            ) : (
              user.pickups.map(p => (
                <div key={p.id} className="glass-card p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-cream">{p.wasteType} — {p.weight} kg</p>
                      <p className="text-xs text-cream-muted">{p.address}</p>
                      <p className="text-xs text-cream-muted">{p.timeSlot} · {p.date}</p>
                      {p.agent && <p className="text-xs mt-1 text-cream">Agent: <span className="font-semibold text-lime">{p.agent}</span></p>}
                    </div>
                    <TokenBadge amount={p.tokens} size="sm" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {statusSteps.map((s, i) => {
                      const currentIdx = statusSteps.indexOf(p.status);
                      const done = i <= currentIdx;
                      return (
                        <div key={s} className="flex-1">
                          <div className={`h-2 rounded-full transition-colors ${done ? 'eco-gradient' : 'bg-forest-darker border border-border'}`} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-lime">{statusLabels[p.status]}</span>
                    {p.status !== 'collected' && (
                      <Button size="sm" variant="outline" onClick={() => advanceStatus(p.id, p.status)} className="text-xs h-7 border-border text-cream hover:bg-forest-darker">
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
    </PageWrapper>
  );
};

export default Pickup;
