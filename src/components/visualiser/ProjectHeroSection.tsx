'use client';

import React from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  SlidersHorizontal,
  MessageSquare,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface ProjectHeroSectionProps {
  projectState: ProjectState;
  onOpenReviewModal: () => void;
  onOpenBriefModal: () => void;
  onOpenModifyDrawer?: () => void;
  onOpenAskDrawer?: () => void;
}

export function ProjectHeroSection({
  projectState,
  onOpenReviewModal,
  onOpenBriefModal,
  onOpenModifyDrawer,
  onOpenAskDrawer,
}: ProjectHeroSectionProps) {
  const { projectTypes, originalBrief, visualConcept, humanReadableStatus, reportDepth } = projectState;
  const lower = (originalBrief || '').toLowerCase();

  // Dynamic project title
  let projectTitle = 'Your Project Consultation & Initial Plan';
  let projectSubtitle = 'Initial architectural interpretation, construction sequencing, and statutory requirements prepared by ST Contractors.';

  if (lower.includes('garage') && lower.includes('door')) {
    projectTitle = 'Your Garage Access Door Consultation & Initial Plan';
    projectSubtitle = 'Approved Document B fire separation, structural lintel installation, and statutory Building Notice requirements.';
  } else if (projectTypes.includes('bathroom-renovation') || lower.includes('bath') || lower.includes('shower')) {
    projectTitle = 'Your Bathroom & Wetroom Consultation & Initial Plan';
    projectSubtitle = 'Wet-zone tanking, subfloor stiffening, drainage falls, and luxury bespoke finishes.';
  } else if (projectTypes.includes('extension') || lower.includes('extension')) {
    projectTitle = 'Your Rear Extension Consultation & Initial Plan';
    projectSubtitle = 'Groundworks, structural steelwork, thermal envelope, and statutory Building Control pathways.';
  } else if (projectTypes.includes('kitchen-renovation') || lower.includes('kitchen')) {
    projectTitle = 'Your Kitchen Renovation & Layout Consultation';
    projectSubtitle = 'Spatial layout, service modifications, high-load electricals, and surface specifications.';
  }

  const hasSourceImage = Boolean(visualConcept?.sourceImage);
  const currentImage = visualConcept?.currentConceptImage || visualConcept?.generatedConceptImage;

  const handleReviewClick = () => {
    trackEvent('review_modal_opened', {
      source: 'hero_primary_cta',
      projectType: projectTypes.join(','),
      reportDepth,
    });
    onOpenReviewModal();
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-8 lg:p-10">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-[#FFAA4F]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -z-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Eyebrow & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFAA4F]/15 text-[#FFAA4F] border border-[#FFAA4F]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            ST Contractors Project Consultation
          </span>
          <span className="hidden sm:inline-block text-slate-500">•</span>
          <span className="text-xs text-slate-400 font-medium">London & South East</span>
        </div>

        {/* Human-Readable Status Badge (Zero Raw Percentages) */}
        {humanReadableStatus && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">{humanReadableStatus.stage}</span>
            {humanReadableStatus.detailsNeededCount > 0 && (
              <span className="text-slate-400">({humanReadableStatus.detailsNeededCount} checks to confirm)</span>
            )}
          </div>
        )}
      </div>

      {/* Main Hero Content: Two-Column Layout on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 items-start">
        {/* Left Column: Title, Narrative & Primary Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {projectTitle}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {projectSubtitle}
            </p>
          </div>

          {/* Original Brief Context Block */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">Your Initial Brief</span>
              {onOpenModifyDrawer && (
                <button
                  type="button"
                  onClick={onOpenModifyDrawer}
                  className="text-[#FFAA4F] hover:text-[#ffbe73] font-medium flex items-center gap-1 transition-colors"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  Modify Details
                </button>
              )}
            </div>
            <p className="text-sm text-slate-200 italic line-clamp-3">
              &ldquo;{originalBrief}&rdquo;
            </p>
          </div>

          {/* Status Headline & Detail */}
          {humanReadableStatus && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-semibold text-emerald-200">{humanReadableStatus.headline}</p>
                <p className="text-emerald-300/80 leading-normal">{humanReadableStatus.detail}</p>
              </div>
            </div>
          )}

          {/* Primary Conversion Action Bar */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                type="button"
                onClick={handleReviewClick}
                size="lg"
                className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#ffbe73] text-slate-950 font-bold px-7 py-3.5 rounded-xl shadow-xl shadow-[#FFAA4F]/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <span>GET ST CONTRACTORS TO REVIEW MY PROJECT</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                onClick={onOpenBriefModal}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-100 font-semibold px-5 py-3.5 rounded-xl text-sm"
              >
                <FileText className="w-4 h-4 text-[#FFAA4F] mr-2" />
                Export Builder Brief
              </Button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 pl-1 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                No obligation consultation
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FFAA4F]" />
                Direct review with our site director
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Concept / Before & After Showcase */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden bg-slate-800/80 border border-slate-700 shadow-xl group">
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              {currentImage ? (
                currentImage.startsWith('<svg') ? (
                  <div
                    className="w-full h-full flex items-center justify-center p-4 [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: currentImage }}
                  />
                ) : (
                  <img
                    src={currentImage}
                    alt="Project Architectural Concept"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )
              ) : (
                <div className="p-8 text-center space-y-3">
                  <Sparkles className="w-10 h-10 text-[#FFAA4F] mx-auto opacity-60" />
                  <p className="text-sm font-semibold text-slate-300">Architectural Concept Blueprint</p>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Visual model generated based on your scope requirements.
                  </p>
                </div>
              )}

              {/* Floating Concept Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900/90 text-white backdrop-blur-md border border-slate-700/80 shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#FFAA4F]" />
                  {visualConcept?.conceptType === 'image_to_image_transformation'
                    ? 'Transformed Photo Concept'
                    : 'Architectural Concept Plan'}
                </span>
              </div>

              {/* Has Original Photo Indicator */}
              {hasSourceImage && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                    Site Photo Linked
                  </span>
                </div>
              )}
            </div>

            {/* Visual Action Footer */}
            <div className="p-4 bg-slate-800 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {visualConcept?.generationVersion
                  ? `Concept Revision ${visualConcept.generationVersion}`
                  : 'Initial Consultation Plan'}
              </span>

              {onOpenAskDrawer && (
                <button
                  type="button"
                  onClick={onOpenAskDrawer}
                  className="text-[#FFAA4F] hover:text-[#ffbe73] font-medium flex items-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Ask a question about this plan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
