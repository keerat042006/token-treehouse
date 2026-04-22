import { ReactNode, HTMLAttributes } from 'react';
import { useTilt } from '@/hooks/useTilt';

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  max?: number;
  perspective?: number;
}

export const TiltCard = ({ children, max = 15, perspective = 800, className, style, ...rest }: TiltCardProps) => {
  const ref = useTilt<HTMLDivElement>({ max, perspective });
  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: 'preserve-3d', ...style }}
      {...rest}
    >
      {children}
    </div>
  );
};
