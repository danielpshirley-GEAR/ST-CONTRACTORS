'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export interface AccordionItem {
  id?: string;
  title: string;
  content: string | React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
  variant?: 'light' | 'dark' | 'liquid';
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  className = '',
  allowMultiple = false,
  variant = 'light',
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  const isLiquid = variant === 'liquid';
  const isDark = variant === 'dark';

  return (
    <div
      className={clsx(
        'divide-y border-y transition-colors',
        isLiquid
          ? 'divide-white/20 border-white/30'
          : isDark
          ? 'divide-slate-800 border-slate-800'
          : 'divide-slate-200 border-slate-200',
        className
      )}
    >
      {items.map((item, idx) => {
        const isOpen = openIndexes.includes(idx);
        return (
          <div key={idx} className="py-4 sm:py-5">
            <button
              onClick={() => toggleItem(idx)}
              className="flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAA4F] rounded-sm group transition-colors"
              aria-expanded={isOpen}
            >
              <span
                className={clsx(
                  'text-base sm:text-lg font-medium pr-4 transition-colors',
                  isLiquid
                    ? 'text-white group-hover:text-[#FFAA4F] drop-shadow-xs'
                    : isDark
                    ? 'text-slate-100 group-hover:text-[#FFAA4F]'
                    : 'text-slate-900 group-hover:text-slate-700'
                )}
              >
                {item.title}
              </span>
              <span
                className={clsx(
                  'flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-200',
                  isLiquid
                    ? isOpen
                      ? 'rotate-180 bg-[#FFAA4F] text-neutral-950 font-bold shadow-md'
                      : 'bg-white/15 text-white border border-white/30 group-hover:bg-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
                    : isDark
                    ? isOpen
                      ? 'rotate-180 bg-[#FFAA4F] text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                    : isOpen
                    ? 'rotate-180 bg-[#FFAA4F]/20 text-[#FFAA4F]'
                    : 'bg-slate-100 text-slate-500'
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
            {isOpen && (
              <div
                className={clsx(
                  'mt-3 pr-8 text-sm sm:text-base leading-relaxed',
                  isLiquid
                    ? 'text-white/90 drop-shadow-xs font-normal'
                    : isDark
                    ? 'text-slate-300 font-normal'
                    : 'text-slate-600'
                )}
              >
                {typeof item.content === 'string' ? <p>{item.content}</p> : item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
