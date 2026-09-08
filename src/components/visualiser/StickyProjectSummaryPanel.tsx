'use client';

import React from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, Edit3, MessageSquare, CheckCircle2 } from 'lucide-react';

interface StickyProjectSummaryPanelProps {
  projectState: ProjectState;
  onOpenReviewModal: () => void;
  onOpenModifyDrawer: () => void;
  onOpenAskDrawer: () => void;
}

export function StickyProjectSummaryPanel({
  projectState,
  onOpenReviewModal,
  onOpenModifyDrawer,
  onOpenAskDrawer,
}: StickyProjectSummaryPanelProps) {
  const { budgetAlignment, humanReadableStatus } = projectState;
  const rangeFormatted = budgetAlignment.indicativeCostRange?.formatted || '£0';
  const projectTitle = projectState.projectSnapshot?.[0]?.value || 'Your Plan';
  const tier = projectState.selectedFinishTier === 'bespoke' ? 'Bespoke' : projectState.selectedFinishTier === 'standard' ? 'Practical' : 'Recommended';

  return (
    <>
      {/* Desktop Sticky Panel (Bottom Right) */}
      <aside aria-label="Project buying plan summary" className="hidden lg:block fixed bottom-6 right-6 z-40 w-80 bg-slate-900/95 backdrop-blur-md text-white rounded-3xl border border-slate-700/80 p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F]">
              Your Plan
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
            {tier} Option
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-bold text-white font-heading truncate">
            {projectTitle}
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs text-slate-400">Early Guide Range:</span>
            <span className="text-base font-extrabold text-[#FFAA4F]">
              {rangeFormatted}
            </span>
          </div>
          {humanReadableStatus && (
            <div className="text-[11px] text-slate-400 pt-0.5 truncate">
              {humanReadableStatus.detailsNeededCount > 0
                ? `${humanReadableStatus.detailsNeededCount} details to confirm on site`
                : 'Ready for site survey review'}
            </div>
          )}
        </div>

        <div className="space-y-2 pt-1">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onOpenReviewModal}
            className="w-full text-xs font-extrabold justify-center bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335] shadow-lg py-2.5 rounded-xl transition-all"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            GET MY PROJECT REVIEWED
          </Button>

          <div className="flex items-center justify-center gap-3 text-[11px] font-medium text-slate-400 pt-1">
            <button
              type="button"
              onClick={onOpenModifyDrawer}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Edit3 className="h-3 w-3 text-slate-500" />
              <span>Change Plan</span>
            </button>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={onOpenAskDrawer}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <MessageSquare className="h-3 w-3 text-slate-500" />
              <span>Ask a Question</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Compact Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/98 backdrop-blur-md border-t border-slate-800 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-extrabold text-white truncate">
            {projectTitle}
          </div>
          <div className="text-xs font-extrabold text-[#FFAA4F]">
            {rangeFormatted}
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onOpenReviewModal}
          className="text-xs font-extrabold bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335] py-2 px-3 rounded-xl flex-shrink-0"
        >
          REVIEW PROJECT
        </Button>
      </div>
    </>
  );
}
