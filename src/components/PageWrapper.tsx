import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const PageWrapper = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <motion.div
    className={`w-full max-w-[1400px] mx-auto ${className}`}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);
