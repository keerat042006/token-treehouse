import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, Check } from 'lucide-react';

interface Props {
  open: boolean;
  state: 'idle' | 'loading' | 'success' | 'error';
  loadingText?: string;
  successTitle?: string;
  successText?: string;
  errorText?: string;
  onClose: () => void;
  onRetry?: () => void;
}

export const ServerActionOverlay = ({ open, state, loadingText = 'Sending request to server...', successTitle = 'Request sent!', successText, errorText, onClose, onRetry }: Props) => {
  return (
    <AnimatePresence>
      {open && state !== 'idle' && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <motion.div
            className="relative w-full max-w-sm rounded-3xl glass-deep p-7 text-center"
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {state === 'loading' && (
              <>
                <motion.div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,229,160,0.15)', border: '1px solid rgba(0,229,160,0.4)' }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  <Loader2 className="w-8 h-8 text-eco-green animate-spin" />
                </motion.div>
                <p className="mt-4 text-white font-bold">{loadingText}</p>
                <p className="text-xs text-muted-foreground-2 mt-1">Please wait — securing your transaction</p>
              </>
            )}
            {state === 'success' && (
              <>
                <motion.div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,229,160,0.2)', border: '1px solid rgba(0,229,160,0.5)' }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  <Check className="w-9 h-9 text-eco-green" />
                </motion.div>
                <p className="mt-4 text-lg font-extrabold text-white">{successTitle}</p>
                <p className="text-sm text-muted-foreground-2 mt-1.5">{successText}</p>
                <button onClick={onClose} className="btn-eco mt-5 w-full h-11 rounded-xl font-bold">Done</button>
              </>
            )}
            {state === 'error' && (
              <>
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-red-500/15 border border-red-500/40">
                  <X className="w-9 h-9 text-red-400" />
                </div>
                <p className="mt-4 text-lg font-extrabold text-white">Something went wrong</p>
                <p className="text-sm text-muted-foreground-2 mt-1.5">{errorText || 'We could not reach the server. Please try again.'}</p>
                <div className="flex gap-2 mt-5">
                  <button onClick={onClose} className="flex-1 h-11 rounded-xl font-bold bg-surface-raised border border-border text-white">Close</button>
                  {onRetry && <button onClick={onRetry} className="flex-1 h-11 rounded-xl font-bold btn-eco">Retry</button>}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Auto-close success after a few seconds via consumer-side useEffect
export const useAutoClose = (state: string, onClose: () => void, ms = 3500) => {
  useEffect(() => {
    if (state === 'success') {
      const t = setTimeout(onClose, ms);
      return () => clearTimeout(t);
    }
  }, [state, onClose, ms]);
};
