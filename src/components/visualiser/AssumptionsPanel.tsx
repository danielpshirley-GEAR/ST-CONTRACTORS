'use client';

import React from 'react';
import { SystemAssumption } from '@/types/visualiser-scope';
import {
  AlertCircle,
  Check,
  Edit2,
  Trash2,
  Layers,
} from 'lucide-react';

interface AssumptionsPanelProps {
  assumptions: SystemAssumption[];
  onConfirmAssumption: (id: string) => void;
  onChangeAssumption: (id: string) => void;
  onRemoveAssumption: (id: string) => void;
}

export function AssumptionsPanel({
  assumptions,
  onConfirmAssumption,
  onChangeAssumption,
  onRemoveAssumption,
}: AssumptionsPanelProps) {
  const activeAssumptions = assumptions.filter((a) => a.status === 'active');

  if (activeAssumptions.length === 0) return null;

  return (
    <div id="section-assumptions" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 10 • Assumptions &amp; Reasons
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Assumptions We&apos;re Currently Making
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Every assumption has an explicit reason and can be confirmed or edited
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeAssumptions.map((assump) => (
          <div
            key={assump.id}
            className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3 flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
                  {assump.label}
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  Assumed ({assump.confidence} confidence)
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 font-heading">
                {assump.value}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                <strong>Why: </strong>{assump.reason}
              </p>

              {assump.affectedCalculations && assump.affectedCalculations.length > 0 && (
                <div className="pt-2 border-t border-amber-200/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Affects Calculations:
                  </span>
                  <ul className="space-y-0.5 text-[11px] text-slate-600">
                    {assump.affectedCalculations.map((calc, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-[#FFAA4F] font-bold">•</span>
                        <span>{calc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-amber-200/60 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => onConfirmAssumption(assump.id)}
                className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold flex items-center gap-1 transition-colors"
              >
                <Check className="h-3 w-3" />
                <span>Confirm</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeAssumption(assump.id)}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex items-center gap-1 transition-colors"
              >
                <Edit2 className="h-3 w-3" />
                <span>Change</span>
              </button>
              <button
                type="button"
                onClick={() => onRemoveAssumption(assump.id)}
                className="px-2 py-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                title="Remove assumption"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
