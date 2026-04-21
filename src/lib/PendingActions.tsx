import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface PendingAction {
  id: string;
  kind: 'arcade' | 'marketplace' | 'waste' | 'pickup' | 'cashout';
  label: string;
  amount?: number;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
}

interface Ctx {
  pending: PendingAction[];
  add: (a: Omit<PendingAction, 'id' | 'createdAt' | 'status'> & { status?: PendingAction['status'] }) => string;
  resolve: (id: string, status: 'confirmed' | 'failed') => void;
}

const PendingCtx = createContext<Ctx | null>(null);

export const usePending = () => {
  const c = useContext(PendingCtx);
  if (!c) throw new Error('usePending must be used in PendingProvider');
  return c;
};

export const PendingProvider = ({ children }: { children: ReactNode }) => {
  const [pending, setPending] = useState<PendingAction[]>([]);

  const add: Ctx['add'] = useCallback((a) => {
    const id = 'pa-' + Math.random().toString(36).slice(2, 9);
    setPending(p => [{ id, createdAt: new Date().toISOString(), status: 'pending', ...a }, ...p]);
    return id;
  }, []);

  const resolve: Ctx['resolve'] = useCallback((id, status) => {
    setPending(p => p.map(x => x.id === id ? { ...x, status } : x));
  }, []);

  return <PendingCtx.Provider value={{ pending, add, resolve }}>{children}</PendingCtx.Provider>;
};
