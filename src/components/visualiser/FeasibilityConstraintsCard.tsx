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
  HardHat,
} from 'lucide-react';

interface FeasibilityConstraintsCardProps {
  feasibility?: FeasibilityItem[];
  items?: FeasibilityItem[];
}

export function FeasibilityConstraintsCard({ feasibility, items }: FeasibilityConstraintsCardProps) {
  const list = items || feasibility || [];

  return (
    <div id="section-feasibility" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 9 • Technical &amp; Statutory Viability
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Feasibility &amp; Project Constraints
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Evidence-based statutory and engineering checks (4 Tiers)
        </p>
      </div>

      <div className="space-y-4">
        {list.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Tier: {item.tier || item.category}
                </span>
                <span className="text-xs font-bold text-slate-900 font-heading">
                  {item.title}
                </span>
              </div>
              <FeasibilityBadge level={item.level} />
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {item.assessment}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-[11px]">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">Why &amp; Evidence:</span>
                <p className="text-slate-600 leading-normal">{item.why || item.evidenceUsed}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">Recommended Next Action:</span>
                <p className="text-slate-600 leading-normal flex items-start gap-1">
                  <ArrowRight className="h-3 w-3 text-[#FFAA4F] shrink-0 mt-0.5" />
                  <span>{item.nextCheck || item.recommendedNextStep}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeasibilityBadge({ level }: { level: FeasibilityLevel }) {
  switch (level) {
    case 'LIKELY_STRAIGHTFORWARD':
      return (
        <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">
          Likely Straightforward
        </Badge>
      );
    case 'POSSIBLE_REQUIRES_CONFIRMATION':
      return (
        <Badge variant="warning" className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-bold">
          Requires Confirmation
        </Badge>
      );
    case 'POTENTIAL_CONSTRAINT':
      return (
        <Badge variant="warning" className="bg-orange-100 text-orange-900 border-orange-300 text-[10px] font-bold">
          Potential Constraint
        </Badge>
      );
    case 'PROFESSIONAL_ASSESSMENT_REQUIRED':
      return (
        <Badge variant="warning" className="bg-rose-100 text-rose-900 border-rose-300 text-[10px] font-bold">
          Engineer Assessment Required
        </Badge>
      );
    default:
      return (
        <Badge variant="slate" className="bg-slate-200 text-slate-700 text-[10px] font-bold">
          Assessment Pending
        </Badge>
      );
  }
}
