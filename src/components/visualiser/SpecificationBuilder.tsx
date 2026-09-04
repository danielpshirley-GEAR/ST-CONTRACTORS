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
  specificationTree: SpecificationNode[];
  onUpdateSpecOption: (nodeId: string, optionName: string, tier: FinishTier) => void;
  onSetNotDecided: (nodeId: string) => void;
}

export function SpecificationBuilder({
  specificationTree,
  onUpdateSpecOption,
  onSetNotDecided,
}: SpecificationBuilderProps) {
  // Group by trade
  const trades = Array.from(new Set(specificationTree.map((s) => s.trade)));

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
          Mix-and-match finishes across trades
        </p>
      </div>

      <div className="space-y-6">
        {trades.map((trade) => {
          const tradeNodes = specificationTree.filter((s) => s.trade === trade);
          return (
            <div key={trade} className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                {trade}
              </span>

              <div className="grid grid-cols-1 gap-4">
                {tradeNodes.map((node) => (
                  <div
                    key={node.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 font-heading">
                          {node.element}
                        </h3>
                        {node.status === 'not_decided' ? (
                          <Badge variant="slate" className="bg-slate-200 text-slate-700 text-[10px] font-bold">
                            Not Decided Yet
                          </Badge>
                        ) : (
                          <Badge
                            variant="brand"
                            className={`text-[10px] font-bold ${
                              node.finishTier === 'bespoke'
                                ? 'bg-purple-100 text-purple-900 border-purple-200'
                                : node.finishTier === 'enhanced'
                                ? 'bg-[#FFAA4F] text-slate-950'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {node.finishTier.toUpperCase()}
                          </Badge>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onSetNotDecided(node.id)}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-800 text-left sm:text-right"
                      >
                        {node.status === 'not_decided' ? 'Choose Option' : 'Mark as "Not Decided"'}
                      </button>
                    </div>

                    {/* Available Tier Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {node.availableOptions.map((opt, idx) => {
                        const isSelected = node.status !== 'not_decided' && node.selectedOption === opt.name;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => onUpdateSpecOption(node.id, opt.name, opt.tier)}
                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                              isSelected
                                ? 'bg-white border-[#FFAA4F] ring-2 ring-[#FFAA4F]/20 shadow-xs'
                                : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold uppercase text-[#FFAA4F]">
                                  {opt.tier}
                                </span>
                                {isSelected && (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                )}
                              </div>
                              <span className="text-xs font-bold text-slate-900 block leading-snug">
                                {opt.name}
                              </span>
                              <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                                {opt.description}
                              </p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 block pt-1 border-t border-slate-100">
                              {opt.costImpact}
                            </span>
                          </button>
                        );
                      })}
                    </div>
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
