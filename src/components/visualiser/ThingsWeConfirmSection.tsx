'use client';

import React from 'react';
import { ConfirmCheckItem } from '@/types/visualiser-scope';
import { CheckCircle2, AlertCircle, Wrench, ShieldCheck } from 'lucide-react';

interface ThingsWeConfirmSectionProps {
  checks: ConfirmCheckItem[];
}

export function ThingsWeConfirmSection({ checks }: ThingsWeConfirmSectionProps) {
  if (!checks || checks.length === 0) return null;

  return (
    <section className="space-y-8">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="h-3.5 w-3.5 text-[#FFAA4F]" />
          <span>Stage 7 — Proactive Pre-Construction Verification</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
          A Few Things We Need to Confirm
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          Every building project has a few critical structural or statutory details. Rather than leaving them uncertain, here is how ST Contractors verifies and solves each one during pre-construction.
        </p>
      </div>

      {/* 2–5 Clean Check Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {checks.map((check) => (
          <div
            key={check.id}
            className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 shrink-0 mt-0.5">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                    Important Check
                  </span>
                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {check.issue}
                  </h4>
                </div>
              </div>
            </div>

            {/* Proactive Contractor Solution */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Wrench className="h-3.5 w-3.5 text-[#FFAA4F]" />
                <span>What ST Contractors Does About It:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {check.whatWeDo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
