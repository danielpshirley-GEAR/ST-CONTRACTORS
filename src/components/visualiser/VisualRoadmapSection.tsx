'use client';

import React from 'react';
import Image from 'next/image';
import { RoadmapStageCard } from '@/types/visualiser-scope';
import {
  Layers,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  PoundSterling,
  HelpCircle,
  Hammer,
  ShieldCheck,
  Maximize2,
  DoorClosed,
  Zap,
  Paintbrush,
  Sparkles,
  Search,
  Trash2,
  Wrench,
  ChefHat,
  Warehouse,
  ArrowRight,
} from 'lucide-react';

interface VisualRoadmapSectionProps {
  stages: RoadmapStageCard[];
  onSelectChoice?: (workAreaId: string, choiceId: string) => void;
  onOpenReviewModal?: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Warehouse: <Warehouse className="h-5 w-5 text-[#FFAA4F]" />,
  ShieldCheck: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
  Maximize2: <Maximize2 className="h-5 w-5 text-blue-500" />,
  DoorClosed: <DoorClosed className="h-5 w-5 text-amber-500" />,
  Zap: <Zap className="h-5 w-5 text-amber-400" />,
  Paintbrush: <Paintbrush className="h-5 w-5 text-purple-500" />,
  Sparkles: <Sparkles className="h-5 w-5 text-[#FFAA4F]" />,
  Search: <Search className="h-5 w-5 text-blue-400" />,
  Hammer: <Hammer className="h-5 w-5 text-amber-500" />,
  Trash2: <Trash2 className="h-5 w-5 text-rose-500" />,
  Wrench: <Wrench className="h-5 w-5 text-blue-500" />,
  ChefHat: <ChefHat className="h-5 w-5 text-amber-500" />,
  Layers: <Layers className="h-5 w-5 text-slate-500" />,
};

export function VisualRoadmapSection({
  stages,
  onSelectChoice,
  onOpenReviewModal,
}: VisualRoadmapSectionProps) {
  return (
    <section id="section-roadmap" className="space-y-12">
      {/* Section Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
          <Layers className="h-3.5 w-3.5 text-[#FFAA4F]" />
          <span>Stage-by-Stage Construction Plan</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
          Your Project Roadmap
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          A clear visual breakdown of what your project could involve — from current space through building works to the finished result.
        </p>
      </div>

      {/* Vertical Sequenced Roadmap Cards */}
      <div className="relative max-w-4xl mx-auto space-y-8">
        {stages.map((stage, idx) => {
          const isLast = idx === stages.length - 1;
          const icon = ICON_MAP[stage.visualAsset.iconName || ''] || <Layers className="h-5 w-5 text-slate-500" />;

          return (
            <div key={stage.id} className="relative group">
              {/* Connector line between steps */}
              {!isLast && (
                <div className="absolute left-6 sm:left-8 top-20 bottom-[-32px] w-0.5 bg-gradient-to-b from-slate-300 via-amber-400 to-slate-300 pointer-events-none z-0" />
              )}

              {/* Main Card */}
              <div
                className={`relative z-10 bg-white rounded-3xl border-2 ${
                  stage.badge === 'Completed Result'
                    ? 'border-[#FFAA4F] shadow-xl bg-gradient-to-b from-white to-amber-50/20'
                    : 'border-slate-200/90 shadow-md hover:shadow-lg'
                } p-6 sm:p-8 transition-all duration-200`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  {/* Step Number Badge */}
                  <div className="flex items-center gap-3 sm:flex-col sm:items-center shrink-0">
                    <div
                      className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl shadow-xs ${
                        stage.badge === 'Completed Result'
                          ? 'bg-[#FFAA4F] text-slate-950'
                          : 'bg-[#0B192C] text-white'
                      }`}
                    >
                      {stage.stepNumber}
                    </div>
                    {stage.badge && (
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider sm:text-center">
                        {stage.badge}
                      </span>
                    )}
                  </div>

                  {/* Stage Details */}
                  <div className="flex-1 space-y-5">
                    {/* Header: Title & Cost Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                          {icon}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                          {stage.name}
                        </h3>
                      </div>

                      {stage.costFormatted && stage.costFormatted !== 'Included in Project' && (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-slate-900 text-xs sm:text-sm font-extrabold self-start sm:self-auto">
                          <PoundSterling className="h-3.5 w-3.5 text-[#FFAA4F]" />
                          <span>{stage.costFormatted}</span>
                        </div>
                      )}
                    </div>

                    {/* Question 1 & 2: What is this? & Why is it needed? */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="h-3.5 w-3.5 text-blue-500" />
                          <span>1. What is this?</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-normal">
                          {stage.whatIsThis}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                          <span>2. Why is it needed?</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-normal">
                          {stage.whyNeeded}
                        </p>
                      </div>
                    </div>

                    {/* Scope inclusions list */}
                    {stage.possibleWorks && stage.possibleWorks.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Scope of works typically involved:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {stage.possibleWorks.map((work, wIdx) => (
                            <div
                              key={wIdx}
                              className="flex items-start gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{work}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Question 3: What are the options? (Interactive Choice Chips) */}
                    {stage.choices && stage.choices.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                          <span>3. What are the options?</span>
                          <span className="text-slate-500 font-normal lowercase text-[11px]">click to update roadmap &amp; costs</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {stage.choices.map((choice) => {
                            const isSelected = choice.isSelected || choice.id === stage.selectedChoiceId;
                            return (
                              <button
                                key={choice.id}
                                type="button"
                                onClick={() => onSelectChoice && onSelectChoice(stage.id, choice.id)}
                                className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 flex flex-col justify-between ${
                                  isSelected
                                    ? 'bg-slate-900 border-[#FFAA4F] text-white shadow-md'
                                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-xs font-bold leading-tight">{choice.label}</span>
                                  <span
                                    className={`text-xs font-mono font-black px-1.5 py-0.5 rounded ${
                                      isSelected
                                        ? 'bg-[#FFAA4F] text-slate-950'
                                        : 'bg-white text-slate-700 border border-slate-200'
                                    }`}
                                  >
                                    {choice.costIndicator}
                                  </span>
                                </div>
                                <p
                                  className={`text-[11px] leading-normal ${
                                    isSelected ? 'text-slate-300' : 'text-slate-500'
                                  }`}
                                >
                                  {choice.description}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Proactive site check note if present */}
                    {stage.needsCheck && stage.contractorSolution && (
                      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-[#FFAA4F]/40 flex items-start gap-3 text-xs">
                        <AlertCircle className="h-4 w-4 text-[#FFAA4F] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-semibold">
                            What ST Contractors Checks on Site:
                          </strong>
                          <span className="text-slate-700">{stage.contractorSolution}</span>
                        </div>
                      </div>
                    )}

                    {/* Render visual image if available */}
                    {stage.visualAsset.type === 'render' && stage.visualAsset.src && (
                      <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900 mt-4">
                        <Image
                          src={stage.visualAsset.src}
                          alt={stage.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 800px"
                        />
                        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-bold border border-slate-700">
                          Conceptual Visualisation
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Soft CTA 1: Directly after roadmap */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#0B192C] to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-lg sm:text-xl font-bold font-heading text-white">
            Want an expert to review this roadmap?
          </h4>
          <p className="text-xs sm:text-sm text-slate-300">
            Our estimating team can review these building stages, check your property constraints, and advise on site sequencing.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenReviewModal}
          className="shrink-0 px-6 py-3.5 rounded-2xl bg-[#FFAA4F] text-slate-950 font-bold text-xs sm:text-sm hover:bg-[#ffb669] transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span>GET MY PROJECT REVIEWED</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
