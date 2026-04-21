import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const RouteTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [progressKey, setProgressKey] = useState(location.pathname);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    setProgressKey(location.pathname + Date.now());
    setShowProgress(true);
    const t = setTimeout(() => setShowProgress(false), 600);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <>
      {/* Top progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 9999, pointerEvents: 'none' }}>
        <AnimatePresence>
          {showProgress && (
            <motion.div
              key={progressKey}
              initial={{ width: '0%', opacity: 1 }}
              animate={{ width: '100%', opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ width: { duration: 0.4, ease: 'easeOut' }, opacity: { duration: 0.3, delay: 0.1 } }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #00e5a0, #00c2ff)',
                boxShadow: '0 0 12px rgba(0,229,160,0.8)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ x: 80, opacity: 0, filter: 'blur(6px)' }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ x: -60, opacity: 0, filter: 'blur(6px)' }}
          transition={{
            x: { duration: 0.38, ease: 'easeOut' },
            opacity: { duration: 0.32 },
            filter: { duration: 0.32 },
          }}
          style={{ minHeight: '100vh' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
