import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hoverEffect = false,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-slate-200/80 shadow-sm',
    elevated: 'bg-white border border-slate-100 shadow-md',
    bordered: 'bg-white border-2 border-slate-200 shadow-none',
    glass: 'bg-white/80 backdrop-blur-md border border-white/40 shadow-sm',
  };

  const hoverStyles = hoverEffect
    ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300'
    : '';

  return (
    <div
      className={twMerge(
        clsx('rounded-xl overflow-hidden', variantStyles[variant], hoverStyles, className)
      )}
      {...props}
    >
      {children}
    </div>
  );
};
