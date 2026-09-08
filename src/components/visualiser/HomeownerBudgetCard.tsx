'use client';

import React from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';
import {
  PoundSterling,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Info,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface HomeownerBudgetCardProps {
  projectState: ProjectState;
  onOpenReviewModal: () => void;
  onOpenModifyDrawer?: () => void;
}

export function HomeownerBudgetCard({
  projectState,
  onOpenReviewModal,
  onOpenModifyDrawer,
}: HomeownerBudgetCardProps) {
  const { budgetAlignment, projectTypes, reportDepth } = projectState;

  if (!budgetAlignment) return null;

  const isReady = budgetAlignment.isBudgetReady !== false;
  const {
    indicativeCostRange,
    inclusions = [],
    costDrivers = [],
    couldIncreaseIf = [],
    potentialSavings = [],
    onSiteWorkDuration,
    totalLeadTime,
    benchmarkPerM2,
    budgetUnreadyReason,
  } = budgetAlignment;

  const handleReviewClick = () => {
    trackEvent('review_modal_opened', {
      source: 'budget_card_cta',
      projectType: projectTypes.join(','),
      reportDepth,
    });
    onOpenReviewModal();
  };

  // State A: Budget Not Ready Yet
  if (!isReady) {
    return (
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-[#FFAA4F]" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Indicative Budget Guide
          </h2>
        </div>

        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[#FFAA4F] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Detailed Scope Required for Pricing
              </h3>
              <p className="text-sm text-slate-300">
                {budgetUnreadyReason ||
                  'To provide a realistic contractor-grade budget range, our team needs room dimensions or a brief site survey.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {onOpenModifyDrawer && (
              <Button
                type="button"
                onClick={onOpenModifyDrawer}
                size="sm"
                className="bg-[#FFAA4F] hover:bg-[#ffbe73] text-slate-950 font-bold px-4 py-2 text-xs"
              >
                Add Room Dimensions
              </Button>
            )}
            <Button
              type="button"
              onClick={handleReviewClick}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-200 hover:text-white text-xs"
            >
              Book Free Site Survey
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // State B: Ready Budget Guide
  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <PoundSterling className="w-5 h-5 text-[#FFAA4F]" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Indicative Budget & Timeline Guide
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Realistic benchmark range based on ST Contractors London & South East projects (Q1 2026).
        </p>
      </div>

      {/* Main Budget Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-8">
        {/* Top Summary Bar: Price Range & Duration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 border-b border-slate-800 items-center">
          {/* Price Range */}
          <div className="lg:col-span-7 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Estimated Total Cost Range (Inc. VAT)
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              <span className="text-[#FFAA4F]">{indicativeCostRange.formatted}</span>
            </div>
            {benchmarkPerM2 && (
              <p className="text-xs text-slate-400 font-medium">
                Benchmark: {benchmarkPerM2}
              </p>
            )}
          </div>

          {/* Timelines */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {onSiteWorkDuration && (
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-[#FFAA4F]" />
                  <span>On-Site Duration</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">
                  {onSiteWorkDuration}
                </p>
              </div>
            )}

            {totalLeadTime && (
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Procurement / Lead</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">
                  {totalLeadTime}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Standard Inclusions Checklist */}
        {inclusions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              What Is Included In This Benchmark:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {inclusions.map((inc, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#FFAA4F] flex-shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cost Drivers */}
        {costDrivers.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFAA4F]" />
              <span>Key Factors Influencing Your Cost</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {costDrivers.map((driver, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5"
                >
                  <p className="text-xs font-bold text-slate-200">{driver.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {driver.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two-Column Risk vs Opportunity Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Could Increase Costs If */}
          {couldIncreaseIf.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Costs Could Increase If:
                </h4>
              </div>
              <ul className="space-y-2">
                {couldIncreaseIf.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Value Engineering Opportunities */}
          {potentialSavings.length > 0 && (
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingDown className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Where You Can Save Money:
                </h4>
              </div>
              <ul className="space-y-2">
                {potentialSavings.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 max-w-md">
            Every home is unique. Our site survey validates underlying walls, subfloors, and services to give you a fixed, itemised quotation.
          </p>

          <Button
            type="button"
            onClick={handleReviewClick}
            size="lg"
            className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#ffbe73] text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>REQUEST FIRM WRITTEN QUOTATION</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
