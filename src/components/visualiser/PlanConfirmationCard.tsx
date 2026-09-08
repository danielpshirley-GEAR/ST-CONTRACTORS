'use client';

import React, { useState } from 'react';
import { MultiPartProjectUnderstanding } from '@/types/visualiser-scope';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Edit3,
  Check,
  Building2,
  Ruler,
  Layers,
  Wrench,
  DoorOpen,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';

interface PlanConfirmationCardProps {
  understanding: MultiPartProjectUnderstanding;
  onConfirm: () => void;
  onChangeSomething: (tweakText: string) => void;
  onBack?: () => void;
  onReset?: () => void;
  isBuildingPlan?: boolean;
}

export function PlanConfirmationCard({
  understanding,
  onConfirm,
  onChangeSomething,
  onBack,
  onReset,
  isBuildingPlan = false,
}: PlanConfirmationCardProps) {
  const [showEditInput, setShowEditInput] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');

  const { confirmationSummary } = understanding;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt.trim()) return;
    onChangeSomething(editPrompt.trim());
    setEditPrompt('');
    setShowEditInput(false);
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        {/* Top Eyebrow with Back & Reset Controls */}
        <div className="flex items-center justify-between gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={isBuildingPlan}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700/80 shadow-sm transition-all active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#FFAA4F]" />
              <span>Back to Questions</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Consultation Complete</span>
          </div>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={isBuildingPlan}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 shadow-sm transition-all active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Here&apos;s What You&apos;re Planning
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Review the key elements before we generate your personalised project guide.
          </p>
        </div>

        {/* Master Confirmation Breakdown Card */}
        <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-2xl space-y-8 text-left">
          {/* 1. Primary Project Block */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#FFAA4F]">
              <Building2 className="h-4 w-4 text-[#FFAA4F]" />
              <span>{confirmationSummary.headline}</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-relaxed">
              {confirmationSummary.primaryDescription}
            </p>
          </div>

          {/* 2. Secondary & Key Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {confirmationSummary.secondaryDescription && (
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <DoorOpen className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Internal Access / Knockthrough</span>
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-normal">
                  {confirmationSummary.secondaryDescription}
                </p>
              </div>
            )}

            {confirmationSummary.frontageOrKeyElement && (
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[#FFAA4F]" />
                  <span>Frontage &amp; External Enclosure</span>
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-normal">
                  {confirmationSummary.frontageOrKeyElement}
                </p>
              </div>
            )}

            {confirmationSummary.dimensionsSummary && (
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Ruler className="h-3.5 w-3.5 text-blue-600" />
                  <span>Physical Size / Area</span>
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-normal">
                  {confirmationSummary.dimensionsSummary}
                </p>
              </div>
            )}
          </div>

          {/* 3. Main Requirements Checklist */}
          {confirmationSummary.mainRequirements.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Main Requirements Covered in This Scope:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {confirmationSummary.mainRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Mandatory Confirmation Gate Question */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                Is this right?
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Click below to generate your visual roadmap, options, budget breakdown, and tailored project guide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {/* Primary Action Button */}
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={isBuildingPlan}
                onClick={onConfirm}
                className="flex-1 text-base font-extrabold justify-center bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335] shadow-xl py-4 rounded-2xl transition-all transform hover:-translate-y-0.5"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                {isBuildingPlan ? 'Preparing Your Project Guide...' : 'YES — SHOW MY PROJECT GUIDE'}
              </Button>

              {/* Secondary Action: CHANGE SOMETHING (Part 21) */}
              <button
                type="button"
                disabled={isBuildingPlan}
                onClick={() => setShowEditInput(!showEditInput)}
                className="px-5 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold border border-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 className="h-4 w-4 text-slate-600" />
                <span>CHANGE SOMETHING</span>
              </button>
            </div>

            {/* Inline Change Form */}
            {showEditInput && (
              <form onSubmit={handleEditSubmit} className="pt-4 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
                <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">
                  What would you like to tweak or add?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="e.g. 'Actually make it a bedroom' or 'The garage is 6m x 3m' or 'Keep the frontage'..."
                    className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-[#FFAA4F] focus:outline-none focus:ring-2 focus:ring-[#FFAA4F]/20"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={!editPrompt.trim() || isBuildingPlan}
                    className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold px-5"
                  >
                    Update
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
