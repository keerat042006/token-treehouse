import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const PageWrapper = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <motion.div
    className={`min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto ${className}`}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);
