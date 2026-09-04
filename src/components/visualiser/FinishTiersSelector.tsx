'use client';

import React from 'react';
import { FinishTier, FinishTierDefinition } from '@/types/visualiser-scope';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Check,
  Eye,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface FinishTiersSelectorProps {
  finishTiers: FinishTierDefinition[];
  activeTier: FinishTier;
  onSelectGlobalTier: (tier: FinishTier) => void;
  onVisualiseTier: (tier: FinishTier) => void;
}

export function FinishTiersSelector({
  finishTiers,
  activeTier,
  onSelectGlobalTier,
  onVisualiseTier,
}: FinishTiersSelectorProps) {
  return (
    <div id="section-finishes" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 4 • Specification Tiers
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Three Finish &amp; Specification Levels
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Mix-and-match individual elements in Section 7
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {finishTiers.map((tierDef) => {
          const isSelected = activeTier === tierDef.tier;
          return (
            <div
              key={tierDef.tier}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-5 ${
                isSelected
                  ? 'bg-amber-50/40 border-[#FFAA4F] ring-2 ring-[#FFAA4F]/20 shadow-md'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FFAA4F]">
                    {tierDef.label}
                  </span>
                  {isSelected && (
                    <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold text-[10px]">
                      Active Tier
                    </Badge>
                  )}
                </div>

                <h3 className="text-lg font-bold font-heading text-slate-900">
                  {tierDef.tagline}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {tierDef.summary}
                </p>

                {/* Key Features */}
                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                    Specification Details:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {tierDef.keyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tier Actions */}
              <div className="pt-4 border-t border-slate-200/60 space-y-2">
                <Button
                  type="button"
                  onClick={() => onSelectGlobalTier(tierDef.tier)}
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  className={`w-full text-xs font-extrabold justify-center ${
                    isSelected
                      ? 'bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335]'
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >
                  {isSelected ? 'Selected Tier' : `Select ${tierDef.label}`}
                </Button>

                <button
                  type="button"
                  onClick={() => onVisualiseTier(tierDef.tier)}
                  className="w-full text-[11px] font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1 py-1"
                >
                  <Eye className="h-3.5 w-3.5 text-[#FFAA4F]" />
                  <span>Visualise {tierDef.label}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
