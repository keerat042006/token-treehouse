// Simple in-memory store for hackathon prototype
// Simple in-memory store for hackathon prototype

export interface WasteSubmission {
  id: string;
  type: string;
  weight: number;
  tokens: number;
  date: string;
  method: 'cafe-drop' | 'pickup';
}

export interface PickupRequest {
  id: string;
  address: string;
  wasteType: string;
  weight: number;
  timeSlot: string;
  status: 'scheduled' | 'worker_assigned' | 'waste_collected' | 'verification_in_progress' | 'tokens_credited';
  agent?: string;
  tokens: number;
  date: string;
  statusTimestamps?: Partial<Record<string, string>>;
}

export interface Transaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  date: string;
  category?: string;
}

export interface UserState {
  name: string;
  email: string;
  phone: string;
  tokens: number;
  level: 'Bronze' | 'Silver' | 'Gold';
  totalWasteKg: number;
  submissions: WasteSubmission[];
  pickups: PickupRequest[];
  transactions: Transaction[];
  isLoggedIn: boolean;
  login: (name: string, email: string, phone: string) => void;
  logout: () => void;
  submitWaste: (type: string, weight: number) => void;
  requestPickup: (address: string, wasteType: string, weight: number, timeSlot: string) => void;
  updatePickupStatus: (id: string, status: PickupRequest['status']) => void;
  spendTokens: (amount: number, description: string, category: string) => void;
}

const MARKET_RATES: Record<string, number> = {
  'Plastic': 12,
  'Paper': 8,
  'Metal': 25,
  'E-Waste': 40,
  'Glass': 6,
  'Organic': 3,
};

export const getMarketRate = (type: string) => MARKET_RATES[type] || 10;
export const getAllRates = () => MARKET_RATES;

const calcLevel = (kg: number): 'Bronze' | 'Silver' | 'Gold' => {
  if (kg >= 100) return 'Gold';
  if (kg >= 30) return 'Silver';
  return 'Bronze';
};

const uid = () => Math.random().toString(36).slice(2, 9);

// We'll use a simple React context instead of zustand to avoid adding deps
// Actually let's just use localStorage + React state pattern

export const createInitialState = (): Omit<UserState, 'login' | 'logout' | 'submitWaste' | 'requestPickup' | 'updatePickupStatus' | 'spendTokens'> => ({
  name: '',
  email: '',
  phone: '',
  tokens: 0,
  level: 'Bronze',
  totalWasteKg: 0,
  submissions: [],
  pickups: [],
  transactions: [],
  isLoggedIn: false,
});

export const SAMPLE_USER = {
  name: 'Arjun Sharma',
  email: 'arjun@trashcash.in',
  phone: '+91 98765 43210',
  tokens: 422,
  level: 'Silver' as const,
  totalWasteKg: 47.5,
  submissions: [
    { id: '1', type: 'Plastic', weight: 5.2, tokens: 62, date: '2026-03-22', method: 'cafe-drop' as const },
    { id: '2', type: 'Paper', weight: 8.0, tokens: 64, date: '2026-03-20', method: 'pickup' as const },
    { id: '3', type: 'Metal', weight: 2.3, tokens: 58, date: '2026-03-18', method: 'cafe-drop' as const },
    { id: '4', type: 'E-Waste', weight: 1.0, tokens: 40, date: '2026-03-15', method: 'pickup' as const },
  ],
  pickups: [
    { id: 'p1', address: '42 MG Road, Bangalore', wasteType: 'Plastic', weight: 3, timeSlot: '10:00 - 12:00', status: 'tokens_credited' as const, agent: 'Ravi K.', tokens: 36, date: '2026-03-21', statusTimestamps: { scheduled: '2026-03-21 09:00', worker_assigned: '2026-03-21 09:30', waste_collected: '2026-03-21 10:45', verification_in_progress: '2026-03-21 11:15', tokens_credited: '2026-03-21 12:00' } },
    { id: 'p2', address: '42 MG Road, Bangalore', wasteType: 'Paper', weight: 5, timeSlot: '14:00 - 16:00', status: 'waste_collected' as const, agent: 'Priya M.', tokens: 40, date: '2026-03-24', statusTimestamps: { scheduled: '2026-03-24 13:00', worker_assigned: '2026-03-24 13:45', waste_collected: '2026-03-24 15:10' } },
  ],
  transactions: [
    { id: 't1', type: 'earned' as const, amount: 62, description: 'Plastic - 5.2 kg café drop', date: '2026-03-22', category: 'waste' },
    { id: 't2', type: 'spent' as const, amount: 45, description: 'Cappuccino at Green Bean Café', date: '2026-03-22', category: 'cafe' },
    { id: 't3', type: 'earned' as const, amount: 64, description: 'Paper - 8 kg pickup', date: '2026-03-20', category: 'waste' },
    { id: 't4', type: 'spent' as const, amount: 30, description: 'Movie Night token', date: '2026-03-19', category: 'entertainment' },
    { id: 't5', type: 'earned' as const, amount: 58, description: 'Metal - 2.3 kg café drop', date: '2026-03-18', category: 'waste' },
    { id: 't6', type: 'spent' as const, amount: 20, description: 'Donated to CleanOcean Fund', date: '2026-03-17', category: 'donation' },
  ],
  isLoggedIn: true,
};

export { MARKET_RATES, calcLevel, uid };
