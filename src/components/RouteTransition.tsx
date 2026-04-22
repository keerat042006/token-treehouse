import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Track which direction we're navigating by comparing route history
const routeOrder = [
  '/',
  '/sell',
  '/pickup',
  '/marketplace',
  '/arcade',
  '/history',
  '/wallet',
  '/leaderboard',
  '/map',
  '/about',
  '/profile',
];

function getDirection(from: string, to: string): 1 | -1 {
  const fi = routeOrder.indexOf(from);
  const ti = routeOrder.indexOf(to);
  if (fi === -1 || ti === -1) return 1;
  return ti >= fi ? 1 : -1;
}

// Speed lines that shoot across during transition
const SpeedLines = ({ active }: { active: boolean }) => {
  const lines = Array.from({ length: 10 }, (_, i) => ({
    top: `${8 + i * 8.5}%`,
    width: `${55 + Math.random() * 35}%`,
    delay: i * 0.025,
    height: i % 3 === 0 ? 2 : 1,
  }));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence>
        {active &&
          lines.map((l, i) => (
            <motion.div
              key={i}
              initial={{ x: '110vw', opacity: 0 }}
              animate={{ x: '-110vw', opacity: [0, 0.18, 0.18, 0] }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.45,
                delay: l.delay,
                ease: 'easeIn',
              }}
              style={{
                position: 'absolute',
                top: l.top,
                right: 0,
                width: l.width,
                height: l.height,
                background:
                  'linear-gradient(90deg, transparent 0%, #00e5a0 40%, #00e5a0 60%, transparent 100%)',
                borderRadius: 2,
              }}
            />
          ))}
      </AnimatePresence>
    </div>
  );
};

// Camera shake wrapper
const CameraShake = ({ trigger }: { trigger: number }) => {
  const controls = useAnimation();
  const prevTrigger = useRef(trigger);

  useEffect(() => {
    if (trigger === prevTrigger.current) return;
    prevTrigger.current = trigger;
    controls.start({
      x: [0, -2, 2, -2, 2, -1, 0],
      transition: { duration: 0.18, ease: 'easeInOut' },
    });
  }, [trigger, controls]);

  return null; // shake is applied to the wrapper div via controls
};

export const RouteTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [progressKey, setProgressKey] = useState(location.pathname);
  const [showProgress, setShowProgress] = useState(false);
  const [showSpeedLines, setShowSpeedLines] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const prevPath = useRef(location.pathname);
  const shakeControls = useAnimation();

  useEffect(() => {
    const dir = getDirection(prevPath.current, location.pathname);
    setDirection(dir);
    prevPath.current = location.pathname;

    // Progress bar
    setProgressKey(location.pathname + Date.now());
    setShowProgress(true);
    const t1 = setTimeout(() => setShowProgress(false), 700);

    // Speed lines
    setShowSpeedLines(true);
    const t2 = setTimeout(() => setShowSpeedLines(false), 500);

    // Camera shake at start
    setShakeTrigger(n => n + 1);
    shakeControls.start({
      x: [0, -2, 2, -2, 2, -1, 0],
      transition: { duration: 0.18, ease: 'easeInOut' },
    });

    // Camera shake at end of transition
    const t3 = setTimeout(() => {
      shakeControls.start({
        x: [0, 1, -1, 1, 0],
        transition: { duration: 0.12, ease: 'easeInOut' },
      });
    }, 420);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [location.pathname]);

  // Train track variants — pages slide on Z axis like a carousel
  const variants = {
    enter: (dir: number) => ({
      x: dir * 120,
      z: -200,
      rotateY: dir * 8,
      opacity: 0,
      filter: 'blur(3px)',
    }),
    center: {
      x: 0,
      z: 0,
      rotateY: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
    exit: (dir: number) => ({
      x: dir * -120,
      z: -200,
      rotateY: dir * -8,
      opacity: 0,
      filter: 'blur(3px)',
    }),
  };

  const transition = {
    x: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] },
    z: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] },
    rotateY: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] },
    opacity: { duration: 0.35, ease: 'easeOut' },
    filter: { duration: 0.42, ease: 'easeInOut' },
  };

  return (
    <>
      {/* Green progress bar */}
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
                boxShadow: '0 0 14px rgba(0,229,160,0.9), 0 0 4px rgba(0,229,160,1)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Speed lines */}
      <SpeedLines active={showSpeedLines} />

      {/* Camera shake + 3D track container */}
      <motion.div animate={shakeControls} style={{ minHeight: '100vh' }}>
        {/* Perspective container — the "track" */}
        <div
          style={{
            perspective: '1200px',
            perspectiveOrigin: '50% 40%',
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={location.pathname}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              style={{
                minHeight: '100vh',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                willChange: 'transform, opacity, filter',
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};
