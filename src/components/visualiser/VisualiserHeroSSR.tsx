import React from 'react';
import { Container } from '@/components/ui/Container';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

export function VisualiserHeroSSR() {
  return (
    <div className="relative bg-slate-50 border-b border-slate-200 py-12 sm:py-16 overflow-hidden">
      <Container size="md">
        <div className="space-y-6 text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#FFAA4F]" />
            <span>AI Project Design &amp; Scope Builder</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
            AI Home Renovation &amp; Extension Visualiser
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Describe your project, upload photos or plans and turn your idea into a visual concept, construction scope, specification and project plan.
          </p>
        </div>

        {/* Server-Rendered Input Card Skeleton */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl relative z-10 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Describe Your Project Brief
            </label>
            <div className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 p-4 min-h-[110px] text-sm text-slate-400 font-normal leading-relaxed">
              e.g. 5m x 3.8m rear extension on a Victorian terrace with frameless glass rooflight, aluminium bifold doors, and open-plan kitchen diner...
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Kitchen Knockthrough', 'Victorian Rear Extension', 'Master En-Suite Wet Room', 'Dormer Loft'].map((label, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200/60"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="pt-2">
            <div className="w-full text-sm sm:text-base font-extrabold py-4 rounded-xl bg-[#FFAA4F] text-slate-950 flex items-center justify-center gap-2 shadow-lg opacity-90">
              <span>Build My Project Plan &amp; Scope</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Trust & Reassurance Strip (Phase 8 Item 14) */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>FREE PROJECT PLANNING TOOL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>NO SIGN-UP REQUIRED TO START</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>PHOTOS &amp; FLOOR PLANS SUPPORTED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>BUILT FOR UK HOME RENOVATION PROJECTS</span>
          </div>
        </div>
      </Container>
    </div>
  );
}
