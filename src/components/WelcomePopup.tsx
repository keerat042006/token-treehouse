import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WelcomePopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem('tc-welcome');
    if (!shown) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem('tc-welcome', '1');
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={close} />
          <motion.div
            className="relative rounded-3xl p-8 max-w-sm w-full text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--forest-card)), hsl(var(--forest-deep)))',
              border: '1px solid hsl(var(--lime) / 0.4)',
              boxShadow: '0 20px 60px -12px hsl(var(--lime) / 0.35)',
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, hsl(var(--lime) / 0.2) 0%, transparent 70%)' }} />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle, hsl(var(--amber) / 0.15) 0%, transparent 70%)' }} />

            <motion.div
              className="relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div className="w-16 h-16 mx-auto eco-gradient rounded-2xl flex items-center justify-center mb-4">
                <Recycle className="w-8 h-8" style={{ color: 'hsl(var(--forest-deep))' }} strokeWidth={2.4} />
              </div>

              <h2 className="text-2xl font-bold text-cream">Welcome to TrashCash! 🌱</h2>
              <p className="text-cream-muted text-sm mt-2 leading-relaxed">
                Turn your waste into tokens and spend them on food, entertainment, and more!
              </p>

              <div className="flex items-center justify-center gap-2 my-5 flex-wrap">
                {['♻️ Recycle', '🪙 Earn', '🎉 Enjoy'].map((step, i) => (
                  <motion.div
                    key={step}
                    className="flex items-center gap-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <span className="pill-outline">{step}</span>
                    {i < 2 && <ArrowRight className="w-3 h-3 text-cream-muted" />}
                  </motion.div>
                ))}
              </div>

              <Button onClick={close} className="eco-gradient px-8 h-11 text-base font-bold">
                <Sparkles className="w-4 h-4 mr-2" /> Let's Go!
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
