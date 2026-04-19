import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WelcomePopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem('ef-welcome');
    if (!shown) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem('ef-welcome', '1');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={close} />
          <motion.div
            className="relative rounded-3xl p-8 max-w-md w-full text-center overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, hsl(var(--surface-card)), hsl(var(--surface-base)))',
              border: '1px solid hsl(var(--eco-blue) / 0.4)',
              boxShadow: '0 20px 60px -12px hsl(var(--eco-blue) / 0.5)',
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, hsl(var(--eco-blue) / 0.25) 0%, transparent 70%)' }} />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle, hsl(var(--eco-amber) / 0.18) 0%, transparent 70%)' }} />

            <motion.div
              className="relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div className="w-16 h-16 mx-auto btn-eco rounded-2xl flex items-center justify-center mb-4">
                <Recycle className="w-8 h-8 text-white" strokeWidth={2.4} />
              </div>

              <h2 className="text-2xl font-bold text-white">Welcome to EcoFusion 🌱</h2>
              <p className="text-muted-foreground-2 text-sm mt-2 leading-relaxed">
                The fintech-grade circular economy platform. Recycle waste, earn TC tokens, redeem real rewards.
              </p>

              <div className="flex items-center justify-center gap-2 my-5 flex-wrap">
                {['♻️ Recycle', '🪙 Earn TC', '🎁 Redeem'].map((step, i) => (
                  <motion.div
                    key={step}
                    className="flex items-center gap-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <span className="pill-outline">{step}</span>
                    {i < 2 && <ArrowRight className="w-3 h-3 text-muted-foreground-2" />}
                  </motion.div>
                ))}
              </div>

              <Button onClick={close} className="btn-eco px-8 h-11 text-base font-bold">
                <Sparkles className="w-4 h-4 mr-2" /> Enter Dashboard
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
