'use client';

import React from 'react';
import { BudgetAlignment } from '@/types/visualiser-scope';
import { Badge } from '@/components/ui/Badge';
import {
  PoundSterling,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface BudgetAlignmentCardProps {
  budget: BudgetAlignment;
}

export function BudgetAlignmentCard({ budget }: BudgetAlignmentCardProps) {
  return (
    <div id="section-budget" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 11 • Budget Alignment
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Budget Alignment &amp; Cost Levers
          </h2>
        </div>

        {/* Indicative Range Box */}
        <div className="bg-amber-50 border border-amber-300 p-3 px-5 rounded-2xl text-right">
          <span className="text-[10px] uppercase font-bold text-amber-900 block">
            Indicative Turnkey Range (2026 London)
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading block tabular-numbers">
            {budget.indicativeCostRange.formatted}
          </span>
          {budget.benchmarkPerM2 && (
            <span className="text-[10px] text-amber-900 font-medium block">
              Benchmark: {budget.benchmarkPerM2}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Cost Drivers */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block flex items-center gap-1.5">
            <PoundSterling className="h-3.5 w-3.5 text-[#FFAA4F]" />
            <span>Elements Most Affecting Budget</span>
          </span>
          <ul className="space-y-1.5 text-slate-600">
            {budget.elementsMostAffectingBudget.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#FFAA4F]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Where to Spend More */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
          <span className="font-bold text-emerald-950 uppercase tracking-wider text-[10px] block flex items-center gap-1.5">
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
            <span>Where It&apos;s Worth Spending More</span>
          </span>
          <ul className="space-y-1.5 text-emerald-900">
            {budget.whereToSpendMore.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Where to Save */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
          <span className="font-bold text-amber-950 uppercase tracking-wider text-[10px] block flex items-center gap-1.5">
            <ArrowDownRight className="h-3.5 w-3.5 text-amber-700" />
            <span>Where Savings Are Possible</span>
          </span>
          <ul className="space-y-1.5 text-amber-900">
            {budget.whereToSave.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
