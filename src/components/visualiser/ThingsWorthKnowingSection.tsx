'use client';

import React from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import { HelpCircle, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ThingsWorthKnowingSectionProps {
  projectState: ProjectState;
}

export function ThingsWorthKnowingSection({ projectState }: ThingsWorthKnowingSectionProps) {
  const items = projectState.thingsToConsider || [];

  if (items.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#FFAA4F]" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Things Worth Knowing Before You Start
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Critical technical and statutory considerations specific to your property and scope.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) => {
          const isHigh = item.impactLevel === 'HIGH';

          return (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-slate-900/85 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.category}
                  </span>

                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isHigh
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {item.impactLevel} Impact
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {item.issue}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.whyItMatters}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-start gap-2 text-slate-400">
                  <span className="font-semibold text-slate-200 flex-shrink-0">
                    What we check:
                  </span>
                  <span>{item.whatShouldBeChecked}</span>
                </div>

                <div className="flex items-start gap-2 text-[#FFAA4F]">
                  <span className="font-semibold flex-shrink-0">
                    Effect on project:
                  </span>
                  <span className="text-slate-300">{item.effectOnProject}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
