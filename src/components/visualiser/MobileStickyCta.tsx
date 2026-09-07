'use client';

import React from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import { trackEvent } from '@/lib/analytics';
import { siteConfig } from '@/config/site';
import { ArrowRight, Phone } from 'lucide-react';

interface MobileStickyCtaProps {
  state: ProjectState;
  onOpenReviewModal: () => void;
}

export function MobileStickyCta({ state, onOpenReviewModal }: MobileStickyCtaProps) {
  const handleClick = () => {
    trackEvent('project_review_clicked', {
      source: 'mobile_sticky_cta',
      projectTypes: state.projectTypes,
    });
    onOpenReviewModal();
  };

  const handlePhoneClick = () => {
    trackEvent('phone_clicked', {
      source: 'mobile_sticky_cta',
    });
  };

  return (
    <aside
      aria-label="Mobile Project Review Navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 shadow-2xl safe-area-inset-bottom"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <button
          type="button"
          onClick={handleClick}
          className="flex-1 py-3 px-4 rounded-xl bg-[#FFAA4F] active:bg-[#F59E3F] text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 border border-[#E69335] shadow-md"
        >
          <span>Get My Project Reviewed</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <a
          href={`tel:${siteConfig.company.phone.replace(/\s+/g, '')}`}
          onClick={handlePhoneClick}
          aria-label="Call ST Contractors directly"
          className="p-3 rounded-xl bg-slate-800 active:bg-slate-700 text-[#FFAA4F] border border-slate-700 flex items-center justify-center"
        >
          <Phone className="h-4 w-4" />
        </a>
      </div>
    </aside>
  );
}
