'use client';

import React, { useState } from 'react';
import { ProjectBuyingPackage } from '@/types/visualiser-scope';
import { CheckCircle2, ShieldCheck, Sparkles, Star, ArrowRight } from 'lucide-react';

interface BuyingPackagesSectionProps {
  packages: ProjectBuyingPackage[];
  selectedPackageId?: string;
  onSelectPackage?: (packageId: string) => void;
  onOpenReviewModal?: () => void;
}

export function BuyingPackagesSection({
  packages,
  selectedPackageId = 'recommended',
  onSelectPackage,
  onOpenReviewModal,
}: BuyingPackagesSectionProps) {
  const [activePackageId, setActivePackageId] = useState<string>(selectedPackageId);

  const handleSelect = (id: string) => {
    setActivePackageId(id);
    if (onSelectPackage) {
      onSelectPackage(id);
    }
  };

  return (
    <section className="space-y-10">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-[#FFAA4F]" />
          <span>Stage 5 — Specification Options</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
          Choose How Far You Want to Take It
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          Three tailored packages based on your project requirements. Every single package meets 100% of statutory UK Building Regulations.
        </p>
      </div>

      {/* 3 Package Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {packages.map((pkg) => {
          const isSelected = activePackageId === pkg.id;
          const isRecommended = pkg.id === 'recommended';

          return (
            <div
              key={pkg.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                isSelected
                  ? 'bg-slate-900 text-white border-2 border-[#FFAA4F] shadow-2xl scale-[1.02] z-10'
                  : 'bg-white text-slate-900 border-2 border-slate-200 shadow-md hover:border-slate-300'
              }`}
            >
              {/* Popular / Recommended Ribbon */}
              {isRecommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FFAA4F] text-slate-950 text-xs font-extrabold tracking-wider uppercase shadow-md flex items-center gap-1.5">
                  <Star className="h-3 w-3 fill-slate-950" />
                  <span>Most Popular Choice</span>
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2 border-b border-slate-200/40 pb-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black font-heading tracking-tight">{pkg.name}</h3>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FFAA4F]/20 text-[#FFAA4F] text-[11px] font-bold uppercase border border-[#FFAA4F]/40">
                        Selected
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs font-medium leading-normal ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {pkg.tagline}
                  </p>

                  <div className="pt-2">
                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#FFAA4F]">
                      {pkg.costRange}
                    </div>
                    <span
                      className={`text-[11px] uppercase tracking-wider ${
                        isSelected ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Indicative Project Total
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p
                  className={`text-xs leading-relaxed ${
                    isSelected ? 'text-slate-200' : 'text-slate-600'
                  }`}
                >
                  {pkg.summary}
                </p>

                {/* Visual Highlight */}
                <div
                  className={`p-3 rounded-2xl text-xs font-medium ${
                    isSelected
                      ? 'bg-slate-800/80 border border-slate-700 text-amber-200'
                      : 'bg-amber-50/70 border border-amber-200 text-amber-900'
                  }`}
                >
                  <strong>Visual Result: </strong>
                  {pkg.visualHighlight}
                </div>

                {/* Feature Inclusions */}
                <div className="space-y-3 pt-2">
                  <div
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isSelected ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Included In This Package:
                  </div>
                  <div className="space-y-2.5">
                    {pkg.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs">
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 mt-0.5 ${
                            isSelected ? 'text-[#FFAA4F]' : 'text-emerald-600'
                          }`}
                        />
                        <span className={isSelected ? 'text-slate-100' : 'text-slate-700'}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button & Compliance Badge */}
              <div className="pt-8 space-y-3">
                <button
                  type="button"
                  onClick={() => handleSelect(pkg.id)}
                  className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                    isSelected
                      ? 'bg-[#FFAA4F] text-slate-950 hover:bg-[#ffb669]'
                      : 'bg-[#0B192C] text-white hover:bg-slate-800'
                  }`}
                >
                  {isSelected ? 'Current Selection' : `Choose ${pkg.name}`}
                </button>

                {/* Statutory Guarantee Badge */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>100% Building Regs Compliant</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
