'use client';

import React, { useState } from 'react';
import { CalculatedQuantityItem } from '@/types/visualiser-scope';
import { Badge } from '@/components/ui/Badge';
import {
  Ruler,
  HelpCircle,
  Calculator,
  CheckCircle2,
  AlertCircle,
  Info,
  Layers,
} from 'lucide-react';

interface QuantitiesBreakdownProps {
  quantities: CalculatedQuantityItem[];
  onEditDimensions: () => void;
}

export function QuantitiesBreakdown({ quantities, onEditDimensions }: QuantitiesBreakdownProps) {
  const [activeFormulaModal, setActiveFormulaModal] = useState<CalculatedQuantityItem | null>(null);

  return (
    <div id="section-quantities" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 8 • Bill of Quantities
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Estimated Project Quantities
          </h2>
        </div>
        <button
          type="button"
          onClick={onEditDimensions}
          className="text-xs font-bold text-[#FFAA4F] hover:text-amber-800 flex items-center gap-1"
        >
          <Ruler className="h-3.5 w-3.5" />
          <span>Edit Dimensions</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quantities.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {item.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    item.confidence === 'calculated'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.confidence === 'estimated'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.confidence === 'calculated' ? 'Calculated' : item.confidence === 'estimated' ? 'Estimated' : 'Unknown'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 font-heading">
                {item.item}
              </h3>

              <div className="pt-1">
                {item.confidence === 'unknown' ? (
                  <span className="text-xs font-bold text-slate-400 italic">
                    Requires confirmed dimensions
                  </span>
                ) : (
                  <div className="space-y-0.5">
                    <span className="text-xl font-extrabold text-slate-900 font-heading tabular-numbers">
                      {item.totalWithWaste} {item.unit}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {item.netQuantity > 0 && `(${item.netQuantity} net + ${item.wastePercent}% waste)`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 truncate max-w-[150px]">{item.basis}</span>
              <button
                type="button"
                onClick={() => setActiveFormulaModal(item)}
                className="text-xs font-bold text-[#FFAA4F] hover:text-amber-800 flex items-center gap-1 shrink-0"
              >
                <Info className="h-3.5 w-3.5" />
                <span>How is this calculated?</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formula Transparency Modal */}
      {activeFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Calculator className="h-4 w-4 text-[#FFAA4F]" />
                <span>Calculation Breakdown</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveFormulaModal(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 text-sm">
                {activeFormulaModal.item}
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-900 leading-relaxed">
                {activeFormulaModal.formulaExplanation}
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                ST Contractors uses pure deterministic mathematical formulas with material-specific UK trade waste allowances (8%–15%) rather than arbitrary AI guesses.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveFormulaModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
