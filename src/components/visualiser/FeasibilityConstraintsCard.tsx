'use client';

import React from 'react';
import { FeasibilityItem, FeasibilityLevel } from '@/types/visualiser-scope';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface FeasibilityConstraintsCardProps {
  feasibility: FeasibilityItem[];
}

export function FeasibilityConstraintsCard({ feasibility }: FeasibilityConstraintsCardProps) {
  return (
    <div id="section-feasibility" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 9 • Technical Viability
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Feasibility &amp; Project Constraints
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Evidence-based statutory and engineering checks
        </p>
      </div>

      <div className="space-y-4">
        {feasibility.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {item.category.replace(/_/g, ' ')}
                </span>
                <span className="text-slate-300">•</span>
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  {item.title}
                </h3>
              </div>

              <FeasibilityLevelBadge level={item.level} />
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {item.assessment}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Evidence Used &amp; Unknowns:
                </span>
                <div className="text-slate-600 leading-normal">
                  <strong className="text-slate-800">Basis: </strong>{item.evidenceUsed}
                </div>
                <div className="text-slate-500 text-[11px]">
                  <strong className="text-slate-700">Unknown: </strong>{item.whatIsUnknown}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-1 text-amber-950">
                <span className="text-[10px] font-bold uppercase text-amber-800 block">
                  Recommended Next Action:
                </span>
                <p className="text-xs text-amber-900 font-medium leading-normal">
                  {item.recommendedNextStep}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeasibilityLevelBadge({ level }: { level: FeasibilityLevel }) {
  switch (level) {
    case 'LIKELY_STRAIGHTFORWARD':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Likely Straightforward</span>
        </span>
      );
    case 'POSSIBLE_REQUIRES_CONFIRMATION':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Possible — Requires Confirmation</span>
        </span>
      );
    case 'POTENTIAL_CONSTRAINT':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-900 bg-orange-100 border border-orange-300 px-2.5 py-1 rounded-full">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Potential Constraint Identified</span>
        </span>
      );
    case 'PROFESSIONAL_ASSESSMENT_REQUIRED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-900 bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-full">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Professional Assessment Required</span>
        </span>
      );
    default:
      return null;
  }
}
