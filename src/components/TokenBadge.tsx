import { Coins } from 'lucide-react';

export const TokenBadge = ({ amount, size = 'md' }: { amount: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sz = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }[size];
  const ic = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  return (
    <span className={`token-pill ${sz}`}>
      <span className="coin-spin inline-flex"><Coins className={ic} /></span>
      {amount} TC
    </span>
  );
};
