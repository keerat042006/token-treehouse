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
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={close} />
          <motion.div
            className="relative bg-card rounded-3xl p-8 max-w-sm w-full text-center border border-border overflow-hidden"
            style={{ boxShadow: '0 20px 60px -12px rgba(34,197,94,0.25)' }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-accent/10" />

            <motion.div
              className="relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div className="w-16 h-16 mx-auto eco-gradient rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Recycle className="w-8 h-8 text-primary-foreground" />
              </div>

              <h2 className="text-2xl font-bold text-foreground">Welcome to TrashCash! 🌱</h2>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                Turn your waste into tokens and spend them on food, entertainment, and more!
              </p>

              <div className="flex items-center justify-center gap-4 my-5">
                {['♻️ Recycle', '🪙 Earn', '🎉 Enjoy'].map((step, i) => (
                  <motion.div
                    key={step}
                    className="flex items-center gap-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full">{step}</span>
                    {i < 2 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                  </motion.div>
                ))}
              </div>

              <Button onClick={close} className="eco-gradient text-primary-foreground px-8 h-11 text-base font-semibold">
                <Sparkles className="w-4 h-4 mr-2" /> Let's Go!
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
