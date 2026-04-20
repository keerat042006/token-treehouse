import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SAMPLE_USER, getMarketRate, calcLevel, uid, type WasteSubmission, type PickupRequest, type Transaction } from './store';

interface UserContextType {
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
  loginDemo: () => void;
  logout: () => void;
  submitWaste: (type: string, weight: number) => number;
  requestPickup: (address: string, wasteType: string, weight: number, timeSlot: string) => void;
  updatePickupStatus: (id: string, status: PickupRequest['status']) => void;
  spendTokens: (amount: number, description: string, category: string) => boolean;
  creditTokens: (amount: number, description: string, category: string) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tokens, setTokens] = useState(0);
  const [level, setLevel] = useState<'Bronze' | 'Silver' | 'Gold'>('Bronze');
  const [totalWasteKg, setTotalWasteKg] = useState(0);
  const [submissions, setSubmissions] = useState<WasteSubmission[]>([]);
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (n: string, e: string, p: string) => {
    setName(n); setEmail(e); setPhone(p);
    setIsLoggedIn(true);
  };

  const loginDemo = () => {
    setName(SAMPLE_USER.name);
    setEmail(SAMPLE_USER.email);
    setPhone(SAMPLE_USER.phone);
    setTokens(SAMPLE_USER.tokens);
    setLevel(SAMPLE_USER.level);
    setTotalWasteKg(SAMPLE_USER.totalWasteKg);
    setSubmissions(SAMPLE_USER.submissions);
    setPickups(SAMPLE_USER.pickups);
    setTransactions(SAMPLE_USER.transactions);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setName(''); setEmail(''); setPhone('');
    setTokens(0); setLevel('Bronze'); setTotalWasteKg(0);
    setSubmissions([]); setPickups([]); setTransactions([]);
    setIsLoggedIn(false);
  };

  const submitWaste = (type: string, weight: number) => {
    const rate = getMarketRate(type);
    const earned = Math.round(weight * rate);
    const sub: WasteSubmission = {
      id: uid(), type, weight, tokens: earned,
      date: new Date().toISOString().slice(0, 10), method: 'cafe-drop',
    };
    const tx: Transaction = {
      id: uid(), type: 'earned', amount: earned,
      description: `${type} - ${weight} kg café drop`,
      date: new Date().toISOString().slice(0, 10), category: 'waste',
    };
    setSubmissions(s => [sub, ...s]);
    setTransactions(t => [tx, ...t]);
    setTokens(tk => tk + earned);
    const newKg = totalWasteKg + weight;
    setTotalWasteKg(newKg);
    setLevel(calcLevel(newKg));
    return earned;
  };

  const requestPickup = (address: string, wasteType: string, weight: number, timeSlot: string) => {
    const rate = getMarketRate(wasteType);
    const earned = Math.round(weight * rate);
    const p: PickupRequest = {
      id: uid(), address, wasteType, weight, timeSlot,
      status: 'requested', tokens: earned,
      date: new Date().toISOString().slice(0, 10),
    };
    setPickups(pk => [p, ...pk]);
  };

  const updatePickupStatus = (id: string, status: PickupRequest['status']) => {
    setPickups(pk => pk.map(p => {
      if (p.id !== id) return p;
      const updated = { ...p, status, agent: p.agent || 'Ravi K.' };
      if (status === 'collected') {
        const tx: Transaction = {
          id: uid(), type: 'earned', amount: updated.tokens,
          description: `${updated.wasteType} - ${updated.weight} kg pickup`,
          date: new Date().toISOString().slice(0, 10), category: 'waste',
        };
        setTransactions(t => [tx, ...t]);
        setTokens(tk => tk + updated.tokens);
        const newKg = totalWasteKg + updated.weight;
        setTotalWasteKg(newKg);
        setLevel(calcLevel(newKg));
      }
      return updated;
    }));
  };

  const spendTokens = (amount: number, description: string, category: string) => {
    if (tokens < amount) return false;
    const tx: Transaction = {
      id: uid(), type: 'spent', amount,
      description, date: new Date().toISOString().slice(0, 10), category,
    };
    setTransactions(t => [tx, ...t]);
    setTokens(tk => tk - amount);
    return true;
  };

  return (
    <UserContext.Provider value={{
      name, email, phone, tokens, level, totalWasteKg,
      submissions, pickups, transactions, isLoggedIn,
      login, loginDemo, logout, submitWaste, requestPickup,
      updatePickupStatus, spendTokens,
    }}>
      {children}
    </UserContext.Provider>
  );
};
