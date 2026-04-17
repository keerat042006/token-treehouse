import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

export const TokenBadge = ({ amount, size = 'md' }: { amount: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-lg px-4 py-2 gap-2',
  };

  return (
    <motion.span
      className={`token-badge ${sizeClasses[size]}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <span className="coin-spin inline-flex">
        <Coins className={size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      </span>
      {amount} TC
    </motion.span>
  );
};
