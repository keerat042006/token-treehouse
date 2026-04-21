// Mock server layer. Simulates network latency and occasional failures.
// All TCC-mutating actions go through here so swapping to a real backend later is trivial.

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
const rand = () => Math.random();

async function simulate<T>(payload: T, opts: { minMs?: number; maxMs?: number; failRate?: number } = {}): Promise<ApiResponse<T>> {
  const { minMs = 900, maxMs = 1600, failRate = 0 } = opts;
  await sleep(minMs + rand() * (maxMs - minMs));
  if (rand() < failRate) {
    return { ok: false, error: 'Network error. Please try again.' };
  }
  return { ok: true, data: payload };
}

export interface BookingPayload {
  gameId: string;
  gameName: string;
  venue: string;
  date: string;
  timeSlot: string;
  cost: number;
  reward: number;
  userId: string;
}

export interface Booking extends BookingPayload {
  id: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

const seedBookings: Booking[] = [
  { id: 'BK-1001', gameId: 'bowling', gameName: 'Eco Bowling', venue: 'Strike Zone Andheri', date: '2026-04-12', timeSlot: 'Evening', cost: 120, reward: 200, userId: 'me', status: 'Completed', createdAt: '2026-04-10' },
  { id: 'BK-1002', gameId: 'pool', gameName: 'Pool & Billiards Night', venue: 'Cue Club Bandra', date: '2026-04-25', timeSlot: 'Evening', cost: 80, reward: 150, userId: 'me', status: 'Confirmed', createdAt: '2026-04-18' },
];

export const mockApi = {
  arcade: {
    book: (payload: BookingPayload) => simulate<Booking>({
      ...payload,
      id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      status: 'Pending',
      createdAt: new Date().toISOString().slice(0, 10),
    }, { failRate: 0.05 }),
    list: () => simulate<Booking[]>(seedBookings),
  },
  marketplace: {
    redeem: (itemId: string, itemName: string, cost: number) => simulate({ itemId, itemName, cost, status: 'Processing', eta: '24 hours' }, { failRate: 0.05 }),
  },
  waste: {
    submit: (data: { type: string; weight: number; method: string }) => simulate({ ...data, status: 'Pending Verification', eta: '2 hours' }, { failRate: 0.05 }),
  },
  pickup: {
    schedule: (data: any) => simulate({ ...data, status: 'Scheduled', pickupId: 'PK-' + Math.floor(1000 + Math.random() * 9000) }, { failRate: 0.05 }),
  },
  wallet: {
    cashout: (data: { upiId: string; tccAmount: number; userId: string }) => simulate({ ...data, refId: 'CO-' + Math.floor(10000 + Math.random() * 90000), eta: '4 hours' }, { failRate: 0.05 }),
  },
};
