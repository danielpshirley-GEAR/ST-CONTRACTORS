'use client';

import React from 'react';
import { ProjectState, FeasibilityLevel } from '@/types/visualiser-scope';
import { CheckCircle2, AlertCircle, AlertTriangle, HelpCircle, FileCheck2 } from 'lucide-react';

interface WhatNeedsConfirmingSectionProps {
  projectState: ProjectState;
}

export function WhatNeedsConfirmingSection({ projectState }: WhatNeedsConfirmingSectionProps) {
  const items = projectState.feasibility || [];

  if (items.length === 0) return null;

  const getStatusBadge = (level: FeasibilityLevel) => {
    switch (level) {
      case 'LIKELY_STRAIGHTFORWARD':
        return {
          label: 'Likely Straightforward',
          className: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
          icon: CheckCircle2,
        };
      case 'POSSIBLE_REQUIRES_CONFIRMATION':
        return {
          label: 'Confirm on Site Visit',
          className: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
          icon: AlertTriangle,
        };
      case 'POTENTIAL_CONSTRAINT':
      case 'PROFESSIONAL_ASSESSMENT_REQUIRED':
      default:
        return {
          label: 'Important Statutory Check',
          className: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
          icon: AlertCircle,
        };
    }
  };

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-[#FFAA4F]" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            What Needs Confirming Before Work Starts
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Statutory compliance, structural bearings, and site logistics mapped to plain English status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) => {
          const badge = getStatusBadge(item.level);
          const Icon = badge.icon;

          return (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-slate-900/85 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {item.category.replace('_', ' ')}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.className}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {badge.label}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.assessment}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
                {item.why && (
                  <p className="text-slate-400">
                    <strong className="text-slate-300">Why this matters: </strong>
                    {item.why}
                  </p>
                )}

                {item.nextCheck && (
                  <div className="flex items-start gap-1.5 text-[#FFAA4F] pt-1">
                    <span className="font-semibold flex-shrink-0">Next step:</span>
                    <span className="text-slate-300">{item.nextCheck}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
