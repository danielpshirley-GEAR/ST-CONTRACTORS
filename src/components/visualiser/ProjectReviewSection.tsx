'use client';

import React from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import { trackEvent } from '@/lib/analytics';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface ProjectReviewSectionProps {
  state: ProjectState;
  onOpenReviewModal: () => void;
  onOpenBriefModal?: () => void;
}

/**
 * Returns a tailored, professional CTA headline based on project types and scope
 */
export function getPersonalisedCtaHeadline(state: ProjectState): string {
  const pTypes = state.projectTypes || [];
  const pTypesStr = pTypes.join(' ').toLowerCase();

  if (pTypesStr.includes('bathroom') || pTypesStr.includes('wet_room')) {
    return 'Let Us Review Your Bathroom Plan';
  }
  if (pTypesStr.includes('loft')) {
    return 'Get Your Loft Conversion Plan Reviewed';
  }
  if (pTypesStr.includes('renovation') || pTypesStr.includes('refurbishment')) {
    return 'Talk to Us About Your Renovation';
  }
  if (pTypesStr.includes('kitchen') && !pTypesStr.includes('extension')) {
    return 'Let Us Review Your Kitchen Transformation';
  }
  if (pTypesStr.includes('extension')) {
    return 'Discuss Your Extension With Our Team';
  }
  return 'Get ST Contractors to Review This Plan';
}

export function ProjectReviewSection({
  state,
  onOpenReviewModal,
  onOpenBriefModal,
}: ProjectReviewSectionProps) {
  const totalArea = state.spaces.reduce((acc, s) => acc + (s.areaM2?.value || 0), 0);
  const primarySpace = state.spaces[0];
  const projectTypesStr = state.projectTypes.map((t) => t.replace(/_/g, ' ')).join(' + ');

  const personalisedHeadline = getPersonalisedCtaHeadline(state);

  // Extract top items to confirm from assumptions or structural feasibility
  const itemsToConfirm: string[] = [];
  if (state.assumptions && state.assumptions.length > 0) {
    itemsToConfirm.push(...state.assumptions.slice(0, 3).map((a) => a.label || a.reason || a.key));
  } else {
    itemsToConfirm.push(
      'Site laser measure & floor level survey',
      'Structural wall load-bearing confirmation',
      'Thames Water underground drainage alignment'
    );
  }

  const handleReviewClick = () => {
    trackEvent('project_review_clicked', {
      projectTypes: state.projectTypes,
      finishTier: state.selectedFinishTier,
      spaceCount: state.spaces.length,
      totalArea,
    });
    onOpenReviewModal();
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-900 text-white rounded-3xl relative overflow-hidden shadow-2xl border border-slate-800">
      <div className="absolute inset-0 architectural-grid opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold text-xs px-3 py-1">
            Turnkey Pre-Construction Review
          </Badge>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
            {personalisedHeadline}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl mx-auto">
            Send this project plan directly to ST Contractors. We will review your 12-section scope of works, check structural viability, and provide a comprehensive fixed-price proposal.
          </p>
        </div>

        {/* Commercial Summary Card Before CTA (Phase 8 Item 8) */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xs">
          <span className="text-[11px] font-extrabold text-[#FFAA4F] uppercase tracking-wider block mb-3">
            Project Scope Summary
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-700/60 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Your Project</span>
              <span className="font-bold text-white capitalize line-clamp-1">{projectTypesStr}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Approximate Area</span>
              <span className="font-bold text-white">
                {totalArea > 0 ? `${totalArea}m²` : 'To be confirmed on site'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Finish Level</span>
              <span className="font-bold text-white capitalize">{state.selectedFinishTier || 'Enhanced'} Tier</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Complexity</span>
              <span className="font-bold text-white capitalize">{state.complexity?.level || 'Moderate'}</span>
            </div>
          </div>

          {/* Main items to confirm */}
          <div className="pt-3.5 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Main Items to Confirm During Technical Consultation:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {itemsToConfirm.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Hierarchy (Phase 8 Item 6 & Item 50) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          {/* Primary CTA */}
          <button
            type="button"
            onClick={handleReviewClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-extrabold text-sm sm:text-base border border-[#E69335] shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <span>Get My Project Reviewed</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Secondary CTA */}
          <button
            type="button"
            onClick={handleReviewClick}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-[#FFAA4F]" />
            <span>Book Technical Consultation</span>
          </button>

          {/* Tertiary Action */}
          {onOpenBriefModal && (
            <button
              type="button"
              onClick={onOpenBriefModal}
              className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileCheck2 className="h-4 w-4 text-slate-400" />
              <span>Export Builder Brief</span>
            </button>
          )}
        </div>

        {/* Trust Signals Layer (Phase 8 Item 49) */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>Direct Principal Contractor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>FMB &amp; TrustMark Certified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>Comprehensive £5M Insurance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>10-Year Structural Warranty</span>
          </div>
        </div>
      </div>
    </section>
  );
}
