import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  href,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors duration-200 cursor-pointer select-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50 min-h-[40px] touch-manipulation';

  const variantStyles = {
    primary:
      'bg-[#FFAA4F] text-white hover:bg-[#F59E3F] active:bg-[#E69335] border border-[#E69335] shadow-md hover:shadow-lg font-bold',
    amber:
      'bg-[#FFAA4F] text-white hover:bg-[#F59E3F] active:bg-[#E69335] border border-[#E69335] shadow-md font-bold',
    secondary:
      'bg-slate-950 text-white hover:bg-black active:bg-black border border-slate-800 shadow-md font-bold',
    outline:
      'border-2 border-slate-950 bg-white text-slate-950 hover:bg-slate-950 hover:text-white active:bg-slate-900 active:text-white font-bold transition-colors shadow-2xs',
    ghost:
      'bg-transparent text-slate-900 hover:bg-slate-100 active:bg-slate-200 font-semibold',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 font-semibold',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5 min-h-[36px]',
    md: 'text-sm px-5 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold min-h-[50px]',
  };

  const combinedClasses = twMerge(
    clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses} aria-label={ariaLabel}>
        {isLoading ? (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"
            aria-hidden="true"
          />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </Link>
    );
  }

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"
          aria-hidden="true"
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
