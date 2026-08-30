import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Badge } from './Badge';

export interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  light?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className,
  light = false,
}) => {
  const alignStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div
      className={twMerge(
        clsx('flex flex-col max-w-3xl mb-12 sm:mb-16', alignStyles[align], className)
      )}
    >
      {badge && (
        <Badge
          variant={light ? 'slate' : 'brand'}
          className={clsx('mb-3', light && 'bg-white/10 text-white border-white/20')}
        >
          {badge}
        </Badge>
      )}
      <h2
        className={clsx(
          'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight',
          light ? 'text-white' : 'text-slate-900'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            'mt-4 text-base sm:text-lg leading-relaxed max-w-2xl',
            light ? 'text-slate-300' : 'text-slate-600'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
