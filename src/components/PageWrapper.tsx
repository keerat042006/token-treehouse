import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const PageWrapper = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <motion.div
    className={`w-full py-6 px-4 lg:py-8 lg:px-8 ${className}`}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
);
