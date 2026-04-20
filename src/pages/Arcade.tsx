import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Coins, Sparkles, Trophy, MapPin, Calendar, Clock, Star, CircleCheck as CheckCircle2, Circle as XCircle, Loader as Loader2, List, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/lib/UserContext';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { CountUp } from '@/components/CountUp';
import { TiltCard } from '@/components/TiltCard';

interface PhysicalGame {
  id: string;
  name: string;
  desc: string;
  cost: number;
  reward: number;
  difficulty: 1 | 2 | 3;
  emoji: string;
  gradient: string;
  venueTag: string;
  venues: string[];
}

interface Booking {
  id: string;
  gameId: string;
  gameName: string;
  venue: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  tcc: number;
  createdAt: string;
}

const games: PhysicalGame[] = [
  {
    id: 'bowling',
    name: 'Eco Bowling',
    desc: 'Book a lane at partner bowling alleys. Knock pins, earn green points.',
    cost: 120,
    reward: 200,
    difficulty: 2,
    emoji: '🎳',
    gradient: 'linear-gradient(135deg, hsl(var(--eco-amber)), hsl(35 95% 50%))',
    venueTag: 'Available at 3 venues near you',
    venues: ['GreenBowl Andheri', 'EcoPins Bandra', 'GreenStrike Powai'],
  },
  {
    id: 'pool',
    name: 'Pool & Billiards Night',
    desc: 'Challenge friends to a pool game at eco-certified partner cafes.',
    cost: 80,
    reward: 150,
    difficulty: 3,
    emoji: '🎱',
    gradient: 'linear-gradient(135deg, hsl(var(--eco-blue)), hsl(210 80% 45%))',
    venueTag: '2 venues nearby',
    venues: ['EcoCue Dadar', 'GreenTable Kurla'],
  },
  {
    id: 'frisbee',
    name: 'Nature Frisbee Golf',
    desc: 'Play frisbee golf in local parks. Outdoor eco activity.',
    cost: 50,
    reward: 100,
    difficulty: 1,
    emoji: '🥏',
    gradient: 'linear-gradient(135deg, hsl(var(--eco-green)), hsl(160 65% 30%))',
    venueTag: 'City park grounds',
    venues: ['Sanjay Gandhi Park', 'Juhu Beach Grounds', 'Powai Lake Park'],
  },
  {
    id: 'tabletennis',
    name: 'Table Tennis Tournament',
    desc: 'Join weekly table tennis rounds at community centers.',
    cost: 60,
    reward: 120,
    difficulty: 2,
    emoji: '🏓',
    gradient: 'linear-gradient(135deg, hsl(var(--eco-teal)), hsl(173 70% 30%))',
    venueTag: 'Community centers',
    venues: ['Andheri Sports Hub', 'Bandra Community Center', 'Powai Recreation Zone'],
  },
];

const timeSlots = ['Morning (9AM - 12PM)', 'Afternoon (1PM - 4PM)', 'Evening (5PM - 8PM)'];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeItem = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const statusColors: Record<string, string> = {
  Pending: 'hsl(var(--eco-amber))',
  Confirmed: 'hsl(var(--eco-blue))',
  Completed: 'hsl(var(--eco-green))',
  Cancelled: 'hsl(var(--eco-coral))',
};

const BookingModal = ({
  game,
  onClose,
  onSuccess,
}: {
  game: PhysicalGame;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}) => {
  const [venue, setVenue] = useState(game.venues[0]);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(timeSlots[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const user = useUser();

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handleConfirm = async () => {
    if (!date) { toast.error('Please select a date'); return; }
    setLoading(true);
    try {
      const response = await fetch('/api/arcade/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id, venue, date, timeSlot, userId: user.email }),
      });
      if (!response.ok) throw new Error('Server error');
      const booking: Booking = {
        id: 'BK-' + Date.now(),
        gameId: game.id,
        gameName: game.name,
        venue,
        date,
        timeSlot,
        status: 'Pending',
        tcc: game.cost,
        createdAt: new Date().toISOString(),
      };
      onSuccess(booking);
      setResult('success');
    } catch {
      setResult('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md glass-deep rounded-3xl p-6"
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
      >
        {result === 'success' ? (
          <div className="text-center py-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
              <CheckCircle2 className="w-16 h-16 text-eco-green mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 12px #10b981)' }} />
            </motion.div>
            <h3 className="text-xl font-extrabold text-white mb-2">Booking Request Sent!</h3>
            <p className="text-sm text-muted-foreground-2 leading-relaxed">
              TCC will be deducted after the venue confirms your session.
            </p>
            <Button onClick={onClose} className="btn-eco mt-5 px-8">Done</Button>
          </div>
        ) : result === 'error' ? (
          <div className="text-center py-6">
            <XCircle className="w-16 h-16 text-eco-coral mx-auto mb-4" />
            <h3 className="text-xl font-extrabold text-white mb-2">Booking Failed</h3>
            <p className="text-sm text-muted-foreground-2">Could not reach the server. Please try again.</p>
            <div className="flex gap-3 mt-5 justify-center">
              <Button onClick={() => setResult(null)} className="btn-eco px-6">Retry</Button>
              <Button onClick={onClose} variant="outline" className="border-border bg-surface-raised text-white">Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-4xl">{game.emoji}</span>
              <div>
                <h3 className="text-xl font-extrabold text-white">{game.name}</h3>
                <p className="text-xs text-muted-foreground-2 mt-0.5">Book your session</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="section-label mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-eco-blue" /> Select Venue
                </label>
                <select
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  className="w-full bg-surface-raised border border-border text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-eco-blue/50"
                >
                  {game.venues.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div>
                <label className="section-label mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-eco-blue" /> Select Date
                </label>
                <input
                  type="date"
                  value={date}
                  min={minDateStr}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-surface-raised border border-border text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-eco-blue/50 [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="section-label mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-eco-blue" /> Time Slot
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition ${
                        timeSlot === slot
                          ? 'bg-eco-blue/20 border border-eco-blue/50 text-eco-blue'
                          : 'bg-surface-raised border border-border text-muted-foreground-2 hover:text-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="surface-raised p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm text-muted-foreground-2">Session cost</span>
                <span className="text-sm font-bold text-eco-amber flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> {game.cost} TCC
                </span>
              </div>

              <div className="flex gap-3">
                <Button onClick={onClose} variant="outline" className="flex-1 border-border bg-surface-raised text-white hover:bg-surface-card">
                  Cancel
                </Button>
                <Button onClick={handleConfirm} disabled={loading || !date} className="btn-eco flex-1 font-bold">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </span>
                  ) : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

const Arcade = () => {
  const user = useUser();
  const [activeTab, setActiveTab] = useState<'games' | 'bookings'>('games');
  const [bookingGame, setBookingGame] = useState<PhysicalGame | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'BK-001',
      gameId: 'bowling',
      gameName: 'Eco Bowling',
      venue: 'GreenBowl Andheri',
      date: '2026-04-25',
      timeSlot: 'Morning (9AM - 12PM)',
      status: 'Confirmed',
      tcc: 120,
      createdAt: '2026-04-20T10:00:00Z',
    },
    {
      id: 'BK-002',
      gameId: 'pool',
      gameName: 'Pool & Billiards Night',
      venue: 'EcoCue Dadar',
      date: '2026-04-18',
      timeSlot: 'Evening (5PM - 8PM)',
      status: 'Completed',
      tcc: 80,
      createdAt: '2026-04-15T14:00:00Z',
    },
  ]);

  const handleBookingSuccess = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
    toast.success('Booking request sent for ' + booking.gameName + '!', {
      description: 'TCC will be deducted after venue confirms.',
    });
    setBookingGame(null);
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
                Eco<span className="text-eco-green text-glow-eco">Arcade</span>
              </h1>
              <p className="text-muted-foreground-2 text-sm mt-1">Book real-world eco activities, earn TCC on completion.</p>
            </div>
            <div className="glass-deep px-5 py-3 rounded-2xl flex items-center gap-3">
              <div className="coin-spin"><Coins className="w-5 h-5 text-eco-amber" /></div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">Balance</p>
                <p className="text-xl font-extrabold text-eco-amber leading-none mt-0.5 text-glow-amber">
                  <CountUp end={user.tokens} /> <span className="text-sm text-eco-amber/70">TCC</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div variants={fadeItem} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Gamepad2, label: 'Activities', value: games.length, color: 'hsl(var(--eco-blue))' },
              { icon: Trophy, label: 'Top reward', value: '200 TCC', color: 'hsl(var(--eco-amber))' },
              { icon: MapPin, label: 'Partner venues', value: '11', color: 'hsl(var(--eco-green))' },
              { icon: Sparkles, label: 'Sessions booked', value: bookings.length, color: 'hsl(var(--eco-teal))' },
            ].map((s, i) => (
              <TiltCard key={i} className="glass-deep p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.color.replace(')', ' / 0.15)'), border: '1px solid ' + s.color.replace(')', ' / 0.3)') }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">{s.label}</p>
                  <p className="text-base font-bold text-white">{s.value}</p>
                </div>
              </TiltCard>
            ))}
          </motion.div>

          {/* Tabs */}
          <motion.div variants={fadeItem} className="flex gap-2">
            <button
              onClick={() => setActiveTab('games')}
              className={'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ' + (activeTab === 'games' ? 'bg-eco-blue text-white' : 'bg-surface-raised text-muted-foreground-2 hover:text-white')}
              style={activeTab === 'games' ? { boxShadow: '0 6px 18px -6px hsl(var(--eco-blue) / 0.6)' } : {}}
            >
              <Plus className="w-4 h-4" /> Book Activity
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ' + (activeTab === 'bookings' ? 'bg-eco-blue text-white' : 'bg-surface-raised text-muted-foreground-2 hover:text-white')}
              style={activeTab === 'bookings' ? { boxShadow: '0 6px 18px -6px hsl(var(--eco-blue) / 0.6)' } : {}}
            >
              <List className="w-4 h-4" /> My Bookings ({bookings.length})
            </button>
          </motion.div>

          {/* Games Grid */}
          <AnimatePresence mode="wait">
            {activeTab === 'games' && (
              <motion.div key="games" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                  {games.map((g) => (
                    <TiltCard key={g.id} max={6} className="glass-deep rounded-2xl overflow-hidden flex flex-col group">
                      <div className="relative aspect-[16/10] flex items-center justify-center text-7xl overflow-hidden" style={{ background: g.gradient }}>
                        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)' }} />
                        <span className="relative drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{g.emoji}</span>
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-0.5" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', color: '#fff' }}>
                          {Array.from({ length: g.difficulty }).map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 fill-eco-amber text-eco-amber" />
                          ))}
                        </span>
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', color: '#00e5a0' }}>
                          <MapPin className="w-3 h-3" /> {g.venueTag}
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-extrabold text-white">{g.name}</h3>
                        <p className="text-xs text-muted-foreground-2 mt-1 flex-1">{g.desc}</p>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="surface-raised p-2.5 rounded-lg">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">Cost</p>
                            <p className="text-sm font-bold text-eco-coral mt-0.5 flex items-center gap-1"><Coins className="w-3 h-3" /> {g.cost} TCC</p>
                          </div>
                          <div className="surface-raised p-2.5 rounded-lg">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground-2 font-semibold">Reward</p>
                            <p className="text-sm font-bold text-eco-amber mt-0.5 flex items-center gap-1 text-glow-amber"><Trophy className="w-3 h-3" /> +{g.reward}</p>
                          </div>
                        </div>
                        <Button onClick={() => setBookingGame(g)} className="btn-eco w-full mt-4 h-10 font-bold" style={{ boxShadow: '0 0 20px hsl(var(--eco-blue) / 0.4)' }}>
                          Book Session
                        </Button>
                      </div>
                    </TiltCard>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="text-center py-16 glass-deep rounded-2xl text-muted-foreground-2">
                    <Gamepad2 className="w-12 h-12 mx-auto opacity-30 mb-3" />
                    <p>No bookings yet. Book your first activity!</p>
                  </div>
                ) : (
                  bookings.map(b => (
                    <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-deep p-4 rounded-2xl">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: games.find(g => g.id === b.gameId)?.gradient || 'rgba(255,255,255,0.1)' }}>
                            {games.find(g => g.id === b.gameId)?.emoji || '🎮'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{b.gameName}</p>
                            <p className="text-xs text-muted-foreground-2 mt-0.5">{b.venue}</p>
                            <p className="text-xs text-muted-foreground-2">{b.date} · {b.timeSlot}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: statusColors[b.status].replace(')', ' / 0.15)'), border: '1px solid ' + statusColors[b.status].replace(')', ' / 0.4)'), color: statusColors[b.status] }}>
                            {b.status}
                          </span>
                          <span className="text-xs text-muted-foreground-2">{b.tcc} TCC · {b.id}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {bookingGame && (
            <BookingModal game={bookingGame} onClose={() => setBookingGame(null)} onSuccess={handleBookingSuccess} />
          )}
        </AnimatePresence>
      </PageWrapper>
    </AppShell>
  );
};

export default Arcade;
