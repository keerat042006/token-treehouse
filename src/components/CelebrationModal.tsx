import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Coins, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CelebrationModalProps {
  open: boolean;
  onClose: () => void;
  tokens: number;
  title?: string;
  subtitle?: string;
}

export const CelebrationModal = ({ open, onClose, tokens, title = 'Tokens Earned!', subtitle }: CelebrationModalProps) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
        <motion.div
          className="relative rounded-3xl p-8 max-w-sm w-full text-center surface-flat"
          style={{
            background: 'linear-gradient(160deg, hsl(var(--surface-card)), hsl(var(--surface-base)))',
            border: '1px solid hsl(var(--eco-blue) / 0.4)',
            boxShadow: '0 20px 60px -12px hsl(var(--eco-blue) / 0.4), 0 0 40px hsl(var(--eco-amber) / 0.15)',
          }}
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground-2 hover:text-white">
            <X className="w-5 h-5" />
          </button>

          <motion.div
            className="w-20 h-20 mx-auto btn-eco rounded-full flex items-center justify-center mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.15, damping: 12 }}
          >
            <PartyPopper className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h2
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title} 🎉
          </motion.h2>

          {subtitle && (
            <motion.p
              className="text-muted-foreground-2 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              {subtitle}
            </motion.p>
          )}

          <motion.div
            className="my-5 p-4 rounded-2xl"
            style={{ background: 'hsl(var(--eco-amber) / 0.1)', border: '1px solid hsl(var(--eco-amber) / 0.35)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-6 h-6 text-eco-amber coin-spin" />
              <span className="text-4xl font-bold text-eco-amber" style={{ textShadow: '0 0 20px hsl(var(--eco-amber) / 0.5)' }}>+{tokens}</span>
              <span className="text-lg font-bold text-eco-amber/70">TCC</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button onClick={onClose} className="btn-eco px-8 h-11 text-base font-bold">
              Awesome! 🙌
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
