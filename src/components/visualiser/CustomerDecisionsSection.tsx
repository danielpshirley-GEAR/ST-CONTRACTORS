'use client';

import React, { useState } from 'react';
import { CustomerDecisionItem } from '@/types/visualiser-scope';
import { Sparkles, CheckCircle2, SlidersHorizontal, Heart, Shield, Zap, DollarSign, Clock } from 'lucide-react';

interface CustomerDecisionsSectionProps {
  choices: CustomerDecisionItem[];
  onSelectOption?: (categoryId: string, optionId: string) => void;
  onApplyPreferencePreset?: (preset: 'cost' | 'value' | 'design' | 'comfort' | 'speed') => void;
}

const PREFERENCE_PRESETS = [
  {
    id: 'cost' as const,
    label: 'Keep Cost Down',
    icon: <DollarSign className="h-4 w-4" />,
    description: 'Prioritise durable, budget-controlled standard materials without compromising regulatory safety.',
  },
  {
    id: 'value' as const,
    label: 'Best Long-Term Value',
    icon: <Shield className="h-4 w-4" />,
    description: 'Optimal balance of thermal efficiency, resale value, and durable low-maintenance finishes.',
  },
  {
    id: 'design' as const,
    label: 'Best-Looking Result',
    icon: <Sparkles className="h-4 w-4" />,
    description: 'Architectural glazing, bespoke joinery detailing, and designer lighting scenes.',
  },
  {
    id: 'comfort' as const,
    label: 'Maximum Comfort',
    icon: <Heart className="h-4 w-4" />,
    description: 'Enhanced acoustic isolation, luxury underfloor heating, and premium thermal linings.',
  },
  {
    id: 'speed' as const,
    label: 'Finish Quickly',
    icon: <Clock className="h-4 w-4" />,
    description: 'Off-the-shelf standard dimensions and dry construction methods for minimal time on site.',
  },
];

export function CustomerDecisionsSection({
  choices,
  onSelectOption,
  onApplyPreferencePreset,
}: CustomerDecisionsSectionProps) {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const handlePresetClick = (presetId: 'cost' | 'value' | 'design' | 'comfort' | 'speed') => {
    setActivePreset(presetId);
    if (onApplyPreferencePreset) {
      onApplyPreferencePreset(presetId);
    }
  };

  return (
    <section className="space-y-12">
      {/* 1. Help Me Choose Preference Selector */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-[#0B192C] text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-[#FFAA4F]/30 text-[#FFAA4F] text-xs font-bold uppercase tracking-wider">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Interactive Guide Assistant</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            Help Me Choose
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            What matters most for this project? Tap your top priority and we will instantly align our specification recommendations.
          </p>
        </div>

        {/* 5 Preset Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          {PREFERENCE_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#FFAA4F] text-slate-950 border-[#FFAA4F] shadow-lg scale-105'
                    : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {preset.icon}
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {activePreset && (
          <div className="pt-2 text-xs text-amber-200 max-w-md mx-auto">
            {PREFERENCE_PRESETS.find((p) => p.id === activePreset)?.description}
          </div>
        )}
      </div>

      {/* 2. Your Main Choices Section */}
      {choices && choices.length > 0 && (
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Your Main Choices
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Key design and material decisions that shape your finished project. Tap any option to explore alternatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {choices.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-[#FFAA4F] bg-slate-900 px-2.5 py-0.5 rounded-full">
                      {item.currentValue}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 font-heading">
                    {item.title}
                  </h4>
                </div>

                <div className="space-y-2 pt-2">
                  {item.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onSelectOption && onSelectOption(item.id, opt.id)}
                      className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-between gap-3 text-xs group cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-slate-950">
                          {opt.label}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {opt.impact}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200 shrink-0">
                        {opt.priceIndicator}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
