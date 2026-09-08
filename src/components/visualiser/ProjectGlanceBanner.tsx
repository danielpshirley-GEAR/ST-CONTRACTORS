'use client';

import React from 'react';
import { ProjectAtAGlance } from '@/types/visualiser-scope';
import { Clock, PoundSterling, Layers, CheckCircle2, ArrowDown, Sparkles } from 'lucide-react';

interface ProjectGlanceBannerProps {
  glance: ProjectAtAGlance;
  onScrollToRoadmap?: () => void;
}

export function ProjectGlanceBanner({ glance, onScrollToRoadmap }: ProjectGlanceBannerProps) {
  const handleScroll = () => {
    if (onScrollToRoadmap) {
      onScrollToRoadmap();
    } else {
      const el = document.getElementById('section-roadmap');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0B192C] via-slate-900 to-[#0B192C] text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-[#FFAA4F]/30 text-[#FFAA4F] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{glance.projectType} Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-heading">
            Your Project at a Glance
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-normal">
            Personalised architectural and construction roadmap for {glance.projectTitle.toLowerCase()}.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleScroll}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FFAA4F] text-slate-950 font-bold text-sm hover:bg-[#ffb669] transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            <span>SEE THE ROADMAP</span>
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <div className="bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-700/60 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="h-4 w-4 text-[#FFAA4F]" />
            <span>Work Areas</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {glance.workAreasCount} Main Stages
          </div>
          <p className="text-[11px] text-slate-400">Sequenced building works</p>
        </div>

        <div className="bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-700/60 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Clock className="h-4 w-4 text-[#FFAA4F]" />
            <span>On-Site Duration</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {glance.approxDuration}
          </div>
          <p className="text-[11px] text-slate-400">Estimated trade time on site</p>
        </div>

        <div className="bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-700/60 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <PoundSterling className="h-4 w-4 text-[#FFAA4F]" />
            <span>Early Budget</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#FFAA4F]">
            {glance.earlyBudgetRange}
          </div>
          <p className="text-[11px] text-slate-400">Guide price range</p>
        </div>

        <div className="bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-700/60 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Main Check</span>
          </div>
          <div className="text-sm font-bold text-white line-clamp-2 leading-snug">
            {glance.mainThingToCheck}
          </div>
          <p className="text-[11px] text-slate-400">Confirmed on site visit</p>
        </div>
      </div>

      {/* Cost Drivers Strip */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#FFAA4F]" />
          <span>Biggest Cost Drivers:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {glance.biggestCostDrivers.map((driver, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium"
            >
              {driver}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
