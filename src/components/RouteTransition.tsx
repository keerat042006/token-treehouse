import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const RouteTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [progressKey, setProgressKey] = useState(location.pathname);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    setProgressKey(location.pathname + Date.now());
    setShowProgress(true);
    const t = setTimeout(() => setShowProgress(false), 700);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <>
      {/* Green progress bar — kept on every navigation */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {showProgress && (
            <motion.div
              key={progressKey}
              initial={{ width: '0%', opacity: 1 }}
              animate={{ width: '100%', opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                width: { duration: 0.4, ease: 'easeOut' },
                opacity: { duration: 0.25, delay: 0.15 },
              }}
              style={{
                height: '100%',
                background: '#00e5a0',
                boxShadow: '0 0 14px rgba(0,229,160,0.9)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Smooth fade transition — no slides, no bounces */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{
            opacity: { duration: 0.4, ease: 'easeOut' },
            y: { duration: 0.4, ease: 'easeOut' },
          }}
          style={{ minHeight: '100vh' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
