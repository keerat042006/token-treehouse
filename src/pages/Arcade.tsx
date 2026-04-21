import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Coins, Gamepad2, Trophy, Star, Calendar, MapPin, Clock, X, ChevronDown } from 'lucide-react';
import { mockApi, Booking } from '@/lib/mockApi';
import { usePending } from '@/lib/PendingActions';
import { ServerActionOverlay, useAutoClose } from '@/components/ServerActionOverlay';
import { TiltCard } from '@/components/TiltCard';
import { CountUp } from '@/components/CountUp';
import { useUser } from '@/lib/UserContext';
import { fireEcoConfetti } from '@/components/EcoConfetti';

interface PhysicalGame {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  cost: number;
  reward: number;
  difficulty: number;
  difficultyLabel: string;
  venueTag: string;
  venues: string[];
  gradient: string;
}

const GAMES: PhysicalGame[] = [
  {
    id: 'bowling', name: 'Eco Bowling', emoji: '🎳',
    desc: 'Book a lane at partner bowling alleys. Knock pins, earn green points.',
    cost: 120, reward: 200, difficulty: 2, difficultyLabel: 'Casual',
    venueTag: 'Available at 3 venues near you',
    venues: ['Strike Zone Andheri', 'BowlPlex Bandra', 'PinDrop Powai'],
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    id: 'pool', name: 'Pool & Billiards Night', emoji: '🎱',
    desc: 'Challenge friends to a pool game at eco-certified partner cafes.',
    cost: 80, reward: 150, difficulty: 3, difficultyLabel: 'Moderate',
    venueTag: '2 venues nearby',
    venues: ['Cue Club Bandra', 'EightBall Lounge Lower Parel'],
    gradient: 'linear-gradient(135deg, #10b981, #047857)',
  },
  {
    id: 'frisbee', name: 'Nature Frisbee Golf', emoji: '🥏',
    desc: 'Play frisbee golf in local parks. Outdoor eco activity.',
    cost: 50, reward: 100, difficulty: 1, difficultyLabel: 'Easy',
    venueTag: 'City park grounds',
    venues: ['Aarey Park Course', 'Powai Lake Loop', 'Sanjay Gandhi Trail'],
    gradient: 'linear-gradient(135deg, #00e5a0, #00c2ff)',
  },
  {
    id: 'tabletennis', name: 'Table Tennis Tournament', emoji: '🏓',
    desc: 'Join weekly table tennis rounds at community centers.',
    cost: 60, reward: 120, difficulty: 2, difficultyLabel: 'Casual',
    venueTag: 'Community centers',
    venues: ['Andheri Community Hall', 'Bandra Sports Club', 'Kurla Recreation Center'],
    gradient: 'linear-gradient(135deg, #3b8beb, #1e40af)',
  },
];

const TIME_SLOTS = ['Morning (9–12)', 'Afternoon (12–5)', 'Evening (5–9)'];

const Arcade = () => {
  const user = useUser();
  const { add, resolve } = usePending();
  const [tab, setTab] = useState<'browse' | 'bookings'>('browse');
  const [active, setActive] = useState<PhysicalGame | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    const r = await mockApi.arcade.list();
    if (r.ok && r.data) setBookings(r.data);
    setLoadingBookings(false);
  };

  useEffect(() => { if (tab === 'bookings') fetchBookings(); }, [tab]);

  return (
    <AppShell>
      <PageWrapper>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="section-label flex items-center gap-2"><Gamepad2 className="w-3.5 h-3.5 text-eco-blue" /> EcoArcade · Real-world play</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-1">
              Book, Play, <span className="text-eco-green text-glow-eco">Earn TCC</span> 🎮
            </h1>
            <p className="text-muted-foreground-2 text-sm mt-1">Spend tokens to book physical activity sessions at partner venues.</p>
          </div>
          <div className="glass-deep px-5 py-3 rounded-2xl flex items-center gap-3">
            <Coins className="w-5 h-5 text-eco-amber coin-spin" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">Wallet</p>
              <p className="text-xl font-extrabold text-eco-amber leading-none mt-0.5">
                <CountUp end={user.tokens} /> <span className="text-sm text-eco-amber/70">TCC</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(['browse', 'bookings'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition ${
                tab === t ? 'bg-eco-blue text-white shadow-lg' : 'bg-white/[0.07] text-muted-foreground-2 hover:text-white hover:bg-white/[0.1]'
              }`}
              style={tab === t ? { boxShadow: '0 6px 18px -6px hsl(var(--eco-blue) / 0.6)' } : {}}
            >
              {t === 'browse' ? 'Browse Games' : `My Bookings (${bookings.length})`}
            </button>
          ))}
        </div>

        {tab === 'browse' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
            {GAMES.map(g => {
              const canBook = user.tokens >= g.cost;
              return (
                <TiltCard key={g.id} max={6} className="glass-deep rounded-2xl overflow-hidden flex flex-col">
                  <div className="relative aspect-[16/10] flex items-center justify-center text-7xl" style={{ background: g.gradient }}>
                    <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)' }} />
                    <span className="relative drop-shadow-lg">{g.emoji}</span>
                    <span
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5"
                      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', color: '#fff' }}
                    >
                      {Array.from({ length: g.difficulty }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-eco-amber text-eco-amber" />
                      ))}
                      <span className="ml-1">{g.difficultyLabel}</span>
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-extrabold text-white">{g.name}</h3>
                    <p className="text-xs text-muted-foreground-2 mt-1 leading-snug">{g.desc}</p>
                    <p className="text-[11px] text-eco-green mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> {g.venueTag}</p>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="surface-raised p-2.5 rounded-lg">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">Cost</p>
                        <p className="text-sm font-bold text-eco-coral mt-0.5 flex items-center gap-1"><Coins className="w-3 h-3" /> {g.cost} TCC</p>
                      </div>
                      <div className="surface-raised p-2.5 rounded-lg">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">Reward</p>
                        <p className="text-sm font-bold text-eco-amber mt-0.5 flex items-center gap-1"><Trophy className="w-3 h-3" /> +{g.reward} TCC</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => setActive(g)}
                      disabled={!canBook}
                      className="btn-eco w-full mt-4 h-10 font-bold disabled:opacity-50"
                      style={{ boxShadow: canBook ? '0 0 20px hsl(var(--eco-blue) / 0.5)' : undefined }}
                    >
                      {canBook ? <>📅 Book Session</> : `Need ${g.cost - user.tokens} more TCC`}
                    </Button>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        )}

        {tab === 'bookings' && (
          <div className="space-y-3">
            {loadingBookings && <div className="text-center text-muted-foreground-2 py-12">Loading your bookings…</div>}
            {!loadingBookings && bookings.length === 0 && (
              <div className="text-center text-muted-foreground-2 py-16 glass-deep rounded-2xl">
                <Calendar className="w-10 h-10 mx-auto opacity-40 mb-2" />
                <p>No bookings yet. Book your first session above.</p>
              </div>
            )}
            {bookings.map(b => (
              <div key={b.id} className="glass-deep rounded-2xl p-5 flex flex-wrap items-center gap-4 justify-between">
                <div>
                  <p className="font-bold text-white">{b.gameName} <span className="text-xs text-muted-foreground-2 ml-1">#{b.id}</span></p>
                  <p className="text-xs text-muted-foreground-2 mt-0.5"><MapPin className="w-3 h-3 inline" /> {b.venue} · <Calendar className="w-3 h-3 inline" /> {b.date} · <Clock className="w-3 h-3 inline" /> {b.timeSlot}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-eco-amber">−{b.cost} / +{b.reward} TCC</span>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        )}

        {active && (
          <BookingModal
            game={active}
            onClose={() => setActive(null)}
            onSuccess={(payload) => {
              setBookings(prev => [payload, ...prev]);
              fireEcoConfetti();
            }}
            onAddPending={(p) => add(p)}
            onResolvePending={resolve}
            userId="me"
          />
        )}
      </PageWrapper>
    </AppShell>
  );
};

const StatusBadge = ({ status }: { status: Booking['status'] }) => {
  const map: Record<Booking['status'], { bg: string; color: string; label: string }> = {
    Pending: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: '⏳ Pending' },
    Confirmed: { bg: 'rgba(59,139,235,0.15)', color: '#3b8beb', label: '✓ Confirmed' },
    Completed: { bg: 'rgba(0,229,160,0.15)', color: '#00e5a0', label: '🏆 Completed' },
    Cancelled: { bg: 'rgba(255,107,53,0.15)', color: '#ff6b35', label: '✗ Cancelled' },
  };
  const m = map[status];
  return <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: m.bg, color: m.color, border: `1px solid ${m.color}40` }}>{m.label}</span>;
};

interface BookingModalProps {
  game: PhysicalGame;
  onClose: () => void;
  onSuccess: (b: Booking) => void;
  onAddPending: (p: any) => string;
  onResolvePending: (id: string, status: 'confirmed' | 'failed') => void;
  userId: string;
}

const BookingModal = ({ game, onClose, onSuccess, onAddPending, onResolvePending, userId }: BookingModalProps) => {
  const [venue, setVenue] = useState(game.venues[0]);
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [slot, setSlot] = useState(TIME_SLOTS[2]);
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  const submit = async () => {
    setState('loading');
    const pendingId = onAddPending({ kind: 'arcade', label: `${game.name} @ ${venue}`, amount: game.cost });
    const res = await mockApi.arcade.book({
      gameId: game.id, gameName: game.name, venue, date, timeSlot: slot,
      cost: game.cost, reward: game.reward, userId,
    });
    if (res.ok && res.data) {
      onResolvePending(pendingId, 'confirmed');
      onSuccess(res.data);
      setState('success');
    } else {
      onResolvePending(pendingId, 'failed');
      setErrorText(res.error || 'Booking failed');
      setState('error');
    }
  };

  useAutoClose(state, onClose, 3000);

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-md rounded-3xl glass-deep p-6"
            initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"><X className="w-5 h-5" /></button>
            <div className="text-center mb-5">
              <div className="text-5xl mb-2">{game.emoji}</div>
              <h2 className="text-xl font-extrabold text-white">{game.name}</h2>
              <p className="text-xs text-muted-foreground-2 mt-1">−{game.cost} TCC now · +{game.reward} TCC after attendance</p>
            </div>

            <div className="space-y-3">
              <Field label="Venue" icon={MapPin}>
                <SelectBox value={venue} options={game.venues} onChange={setVenue} />
              </Field>
              <Field label="Date" icon={Calendar}>
                <input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={e => setDate(e.target.value)} className="w-full bg-surface-raised border border-border rounded-xl px-3 h-10 text-white text-sm" />
              </Field>
              <Field label="Time slot" icon={Clock}>
                <SelectBox value={slot} options={TIME_SLOTS} onChange={setSlot} />
              </Field>
            </div>

            <Button onClick={submit} className="btn-eco w-full mt-5 h-11 font-bold">
              Confirm Booking · {game.cost} TCC
            </Button>
            <p className="text-[11px] text-muted-foreground-2 text-center mt-2">TCC will be deducted only after the venue confirms.</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <ServerActionOverlay
        open={state !== 'idle'}
        state={state}
        loadingText="Sending request to server..."
        successTitle="Booking request sent! ✅"
        successText="TCC will be deducted after venue confirms your session."
        errorText={errorText}
        onClose={() => { setState('idle'); if (state === 'success') onClose(); }}
        onRetry={submit}
      />
    </>
  );
};

const Field = ({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) => (
  <div>
    <label className="text-xs font-semibold text-white flex items-center gap-1 mb-1.5"><Icon className="w-3 h-3 text-eco-blue" /> {label}</label>
    {children}
  </div>
);

const SelectBox = ({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) => (
  <div className="relative">
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full appearance-none bg-surface-raised border border-border rounded-xl px-3 pr-9 h-10 text-white text-sm">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground-2 pointer-events-none" />
  </div>
);

export default Arcade;
