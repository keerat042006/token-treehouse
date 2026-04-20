import { ReactNode, HTMLAttributes } from 'react';
import { useTilt } from '@/hooks/useTilt';

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  max?: number;
}

export const TiltCard = ({ children, max = 8, className, style, ...rest }: TiltCardProps) => {
  const ref = useTilt<HTMLDivElement>({ max });
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
