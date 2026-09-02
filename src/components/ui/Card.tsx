import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass' | 'liquid';
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
    glass: 'bg-black/35 backdrop-blur-xl border border-white/35 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_10px_25px_rgba(0,0,0,0.25)]',
    liquid: 'bg-white/[0.14] backdrop-blur-3xl border border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_25px_60px_rgba(0,0,0,0.4)] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/25 before:via-white/[0.04] before:to-transparent before:pointer-events-none text-white',
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
