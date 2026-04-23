import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// Consistent fade-in with subtle upward drift — matches RouteTransition
export const PageWrapper = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <motion.div
    className={`w-full max-w-[1400px] mx-auto ${className}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);
