import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs sm:text-sm text-slate-500 py-3 ${className}`}
    >
      <ol className="flex items-center space-x-2 flex-wrap">
        <li>
          <Link
            href="/"
            className="flex items-center hover:text-slate-900 transition-colors"
            title="Home"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center space-x-2">
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-slate-900 transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
