import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';

const variants = {
  enter: {
    x: 80,
    opacity: 0,
    filter: 'blur(6px)',
  },
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: {
    x: -60,
    opacity: 0,
    filter: 'blur(6px)',
  },
};

const NavProgressBar = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setProgress(0);
    setVisible(true);
    const t1 = setTimeout(() => setProgress(100), 20);
    const t2 = setTimeout(() => setVisible(false), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [location.pathname]);

  if (!visible) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 2,
        zIndex: 9999,
        width: `${progress}%`,
        background: '#00e5a0',
        boxShadow: '0 0 8px #00e5a0',
        transition: 'width 0.4s ease, opacity 0.2s ease',
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export const PageTransitionWrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <>
      <NavProgressBar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.35,
            ease: [0.0, 0.0, 0.2, 1.0],
            x: { type: 'tween' },
            opacity: { duration: 0.3 },
            filter: { duration: 0.3 },
          }}
          style={{ width: '100%', flex: 1 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
