'use client';

import React from 'react';
import { ThingToConsiderItem } from '@/types/visualiser-scope';
import { Badge } from '@/components/ui/Badge';
import {
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface ThingsToConsiderGridProps {
  items: ThingToConsiderItem[];
}

export function ThingsToConsiderGrid({ items }: ThingsToConsiderGridProps) {
  return (
    <div id="section-considerations" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 6 • Planning &amp; Engineering Checks
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Important Things to Consider for Your Project
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          {items.length} Project-Specific Considerations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {item.category}
                </span>
                <Badge
                  variant={item.impactLevel === 'HIGH' ? 'warning' : item.impactLevel === 'MEDIUM' ? 'warning' : 'slate'}
                  className={`text-[10px] font-bold ${
                    item.impactLevel === 'HIGH'
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : item.impactLevel === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.impactLevel} Impact
                </Badge>
              </div>

              <h3 className="text-sm font-bold text-slate-900 font-heading">
                {item.issue}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                <strong className="text-slate-800">Why it matters: </strong>
                {item.whyItMatters}
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xs">
              <div className="text-slate-700">
                <strong className="text-slate-900">What should be checked: </strong>
                {item.whatShouldBeChecked}
              </div>
              <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200/50 text-amber-950 text-[11px]">
                <strong>Effect on this project: </strong>
                {item.effectOnProject}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
