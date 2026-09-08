'use client';

import React from 'react';
import { BudgetCostDriverCard, CustomerDecisionItem } from '@/types/visualiser-scope';
import { PoundSterling, ArrowUpRight, ArrowDownRight, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';

interface InteractiveCostSectionProps {
  budgetBreakdown: {
    category: string;
    costMin: number;
    costMax: number;
    formatted: string;
  }[];
  totalEarlyBudget: {
    min: number;
    max: number;
    formatted: string;
  };
  costDrivers: BudgetCostDriverCard[];
  customerChoices?: CustomerDecisionItem[];
  onSelectOption?: (categoryId: string, optionId: string) => void;
  onOpenReviewModal?: () => void;
}

export function InteractiveCostSection({
  budgetBreakdown,
  totalEarlyBudget,
  costDrivers,
  customerChoices = [],
  onSelectOption,
  onOpenReviewModal,
}: InteractiveCostSectionProps) {
  const totalMax = Math.max(1, totalEarlyBudget.max);

  return (
    <section className="space-y-12">
      {/* 1. Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
          <PoundSterling className="h-3.5 w-3.5 text-[#FFAA4F]" />
          <span>Stage 6 — Cost Breakdown &amp; Drivers</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
          Where Your Budget Goes
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          Transparent cost allocation across every building trade, with interactive options that adjust your project budget in real time.
        </p>
      </div>

      {/* 2. Visual Budget Breakdown Stack & Total */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-xl max-w-5xl mx-auto space-y-8">
        {/* Total Price Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Indicative Early Project Guide
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-heading">
              {totalEarlyBudget.formatted}
            </div>
          </div>
          <div className="text-xs text-slate-500 max-w-xs sm:text-right font-medium leading-relaxed">
            Includes all core building fabric, specialist trade labour, materials, and local authority Building Control sign-off.
          </div>
        </div>

        {/* Multi-segment Visual Allocation Bar */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Budget Distribution Across Trades:
          </div>
          <div className="h-6 sm:h-7 w-full rounded-xl overflow-hidden flex shadow-inner bg-slate-100">
            {budgetBreakdown.map((item, idx) => {
              const share = Math.max(8, Math.round((item.costMax / totalMax) * 100));
              const colors = [
                'bg-slate-900',
                'bg-[#FFAA4F]',
                'bg-blue-600',
                'bg-emerald-600',
                'bg-purple-600',
                'bg-slate-500',
              ];
              return (
                <div
                  key={idx}
                  style={{ width: `${share}%` }}
                  title={`${item.category}: ${item.formatted}`}
                  className={`${colors[idx % colors.length]} transition-all duration-300 relative group cursor-pointer`}
                />
              );
            })}
          </div>
        </div>

        {/* Trade Breakdown Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {budgetBreakdown.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 flex flex-col justify-between"
            >
              <span className="text-xs font-bold text-slate-700 leading-snug">
                {item.category}
              </span>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-500 font-semibold uppercase">Estimated:</span>
                <span className="text-sm font-extrabold text-slate-900">{item.formatted}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. What Could Move the Price Up or Down? (3–5 Cards) */}
      <div className="max-w-5xl mx-auto space-y-6 pt-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-slate-900 font-heading">
            What Could Move the Price Up or Down?
          </h3>
          <p className="text-sm text-slate-600">
            The main variables that influence where your final price falls within the early range.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {costDrivers.map((driver) => (
            <div
              key={driver.id}
              className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 font-heading">{driver.title}</span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      driver.impact === 'high'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {driver.impact} impact
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {driver.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="font-semibold text-slate-700">Cost Variation:</div>
                <div className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                  {driver.costDeltaLabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive Cost Options Switches */}
      {customerChoices && customerChoices.length > 0 && (
        <div className="max-w-5xl mx-auto bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-[#FFAA4F] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interactive Cost Switches</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Try Changing Key Options to See Price Impact
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Tap any option below to instantly see how finish levels and choices alter your roadmap budget.
            </p>
          </div>

          <div className="space-y-6 pt-2">
            {customerChoices.map((choice) => (
              <div key={choice.id} className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 uppercase tracking-wider">
                    {choice.title}
                  </span>
                  <span className="text-[#FFAA4F] font-semibold">
                    Current: {choice.currentValue}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {choice.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onSelectOption && onSelectOption(choice.id, opt.id)}
                      className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all cursor-pointer space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:text-[#FFAA4F]">
                          {opt.label}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {opt.priceIndicator}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {opt.impact}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Soft CTA 2: After cost guide */}
      <div className="max-w-4xl mx-auto bg-amber-500/10 border-2 border-[#FFAA4F]/60 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
            Want an expert to review these numbers?
          </h4>
          <p className="text-xs sm:text-sm text-slate-700">
            Send your project roadmap to ST Contractors. We will check the trade scope, verify material allowances, and provide a fixed quote.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenReviewModal}
          className="shrink-0 px-6 py-3.5 rounded-2xl bg-[#0B192C] text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span>GET MY PROJECT REVIEWED</span>
          <ArrowRight className="h-4 w-4 text-[#FFAA4F]" />
        </button>
      </div>
    </section>
  );
}
