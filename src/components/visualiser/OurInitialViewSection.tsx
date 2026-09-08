'use client';

import React from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import {
  ShieldAlert,
  AlertTriangle,
  Hammer,
  Droplets,
  Layers,
  Wrench,
  Anchor,
  Columns,
  Sun,
  CheckCircle2,
  Clock,
  Sparkles,
  LucideIcon,
} from 'lucide-react';

interface OurInitialViewSectionProps {
  projectState: ProjectState;
}

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldAlert,
  AlertTriangle,
  Hammer,
  Droplets,
  Layers,
  Wrench,
  Anchor,
  Columns,
  Sun,
  CheckCircle2,
  Clock,
};

export function OurInitialViewSection({ projectState }: OurInitialViewSectionProps) {
  const initialView = projectState.initialView;

  if (!initialView) return null;

  const { paragraphs = [], keyPriorities = [] } = initialView;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFAA4F]" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Our Initial Builder Appraisal
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          First-hand perspective from ST Contractors site managers before pricing and survey.
        </p>
      </div>

      {/* Expert Builder Consultation Narrative */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        {paragraphs.map((p, idx) => (
          <p key={idx} className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            {p}
          </p>
        ))}
      </div>

      {/* The 3 Things That Matter Most for This Project */}
      {keyPriorities.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFAA4F]" />
              <span>The 3 Things That Matter Most for This Project</span>
            </h3>
            <span className="text-xs text-slate-400">Key priorities for flawless delivery</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {keyPriorities.map((item, idx) => {
              const IconComponent = (item.icon && ICON_MAP[item.icon]) || CheckCircle2;

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#FFAA4F]/10 border border-[#FFAA4F]/20 text-[#FFAA4F] flex-shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Priority {idx + 1}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {item.title}
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
