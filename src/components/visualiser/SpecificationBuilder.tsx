'use client';

import React from 'react';
import { SpecificationNode, FinishTier } from '@/types/visualiser-scope';
import { Badge } from '@/components/ui/Badge';
import {
  Sliders,
  Check,
  CheckCircle2,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface SpecificationBuilderProps {
  specificationTree?: SpecificationNode[];
  nodes?: SpecificationNode[];
  onUpdateSpecOption?: (nodeId: string, optionName: string, tier: FinishTier) => void;
  onUpdateOption?: (nodeId: string, optionName: string, tier: FinishTier) => void;
  onSetNotDecided: (nodeId: string) => void;
}

export function SpecificationBuilder({
  specificationTree,
  nodes,
  onUpdateSpecOption,
  onUpdateOption,
  onSetNotDecided,
}: SpecificationBuilderProps) {
  const specList = nodes || specificationTree || [];
  const handleUpdate = onUpdateOption || onUpdateSpecOption || (() => {});
  // Group by trade
  const trades = Array.from(new Set(specList.map((s) => s.trade)));

  return (
    <div id="section-specification" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 7 • Itemised Specification
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Project Specification Builder
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Select Standard, Enhanced, or Bespoke per element
        </p>
      </div>

      <div className="space-y-6">
        {trades.map((trade) => {
          const tradeNodes = specList.filter((s) => s.trade === trade);
          return (
            <div key={trade} className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                {trade}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {tradeNodes.map((node) => {
                  const isNotDecided = node.status === 'not_decided';

                  return (
                    <div
                      key={node.id}
                      className={`p-5 rounded-2xl border transition-all space-y-3 ${
                        isNotDecided
                          ? 'bg-slate-100/60 border-slate-200'
                          : 'bg-slate-50/90 border-slate-200 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 font-heading">
                            {node.element}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            ({node.trade})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isNotDecided ? (
                            <Badge variant="slate" className="bg-slate-200 text-slate-700 text-[10px] font-bold">
                              Not Yet Decided
                            </Badge>
                          ) : (
                            <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold text-[10px] uppercase">
                              {node.finishTier}
                            </Badge>
                          )}

                          <button
                            type="button"
                            onClick={() => onSetNotDecided(node.id)}
                            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline ml-1"
                          >
                            {isNotDecided ? 'Select Option' : 'Mark as undecided'}
                          </button>
                        </div>
                      </div>

                      {!isNotDecided && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                          {node.availableOptions.map((opt) => {
                            const isSelected = node.selectedOption === opt.name;
                            return (
                              <button
                                key={opt.name}
                                type="button"
                                onClick={() => handleUpdate(node.id, opt.name, opt.tier)}
                                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                                  isSelected
                                    ? 'bg-amber-50/80 border-[#FFAA4F] shadow-xs'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-extrabold uppercase text-[#FFAA4F]">
                                      {opt.tier}
                                    </span>
                                    {isSelected && (
                                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                                    )}
                                  </div>
                                  <div className="text-xs font-bold text-slate-900 leading-snug">
                                    {opt.name}
                                  </div>
                                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                    {opt.description}
                                  </p>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 block pt-1 border-t border-slate-100">
                                  {opt.costImpact}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
