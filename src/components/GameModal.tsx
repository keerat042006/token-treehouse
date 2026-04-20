import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface GameModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const GameModal = ({ open, onClose, title, children }: GameModalProps) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center px-3 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-deep p-5 sm:p-6"
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,229,160,0.15)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition"
              aria-label="Close game"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
