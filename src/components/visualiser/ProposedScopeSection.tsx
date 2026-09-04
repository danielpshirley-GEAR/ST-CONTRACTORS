'use client';

import React from 'react';
import { ScopeOfWorkItem } from '@/types/visualiser-scope';
import { Badge } from '@/components/ui/Badge';
import {
  Hammer,
  CheckCircle2,
  Shield,
  Layers,
  Check,
  X,
} from 'lucide-react';

interface ProposedScopeSectionProps {
  scopeOfWorks: ScopeOfWorkItem[];
  onToggleItem: (id: string) => void;
}

export function ProposedScopeSection({ scopeOfWorks, onToggleItem }: ProposedScopeSectionProps) {
  // Group by trade category
  const categories = Array.from(new Set(scopeOfWorks.map((s) => s.category)));

  return (
    <div id="section-scope" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 3 • Construction Scope
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Proposed Scope of Works
          </h2>
        </div>
        <div className="text-xs font-bold text-slate-500">
          {scopeOfWorks.filter((s) => s.included).length} of {scopeOfWorks.length} Trade Items Active
        </div>
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const catItems = scopeOfWorks.filter((s) => s.category === category);
          return (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                {category} Scope
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                      item.included
                        ? 'bg-slate-50/80 border-slate-200 shadow-xs'
                        : 'bg-slate-100/50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 font-heading">
                          {item.title}
                        </span>
                        {item.isStructural && (
                          <Badge variant="slate" className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-bold">
                            Structural Engineer Required
                          </Badge>
                        )}
                        {item.requiresInspection && (
                          <Badge variant="slate" className="bg-slate-200 text-slate-800 text-[10px] font-bold">
                            Building Control Sign-Off
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {item.description}
                      </p>
                      <div className="text-[11px] text-slate-400 font-medium">
                        Trade: {item.trade}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleItem(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                        item.included
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {item.included ? 'Included' : 'Excluded'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
