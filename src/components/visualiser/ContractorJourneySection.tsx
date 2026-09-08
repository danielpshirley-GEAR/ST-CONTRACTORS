'use client';

import React from 'react';
import { Send, FileSearch, Home, FileCheck, Hammer, ArrowRight, ShieldCheck } from 'lucide-react';

interface ContractorJourneySectionProps {
  onOpenReviewModal?: () => void;
}

const JOURNEY_STEPS = [
  {
    step: 1,
    title: 'Send Us This Plan',
    icon: <Send className="h-5 w-5 text-[#FFAA4F]" />,
    description: 'We receive everything you have planned here — your room dimensions, selected options, photos, and roadmap.',
  },
  {
    step: 2,
    title: 'Project Scope Review',
    icon: <FileSearch className="h-5 w-5 text-blue-500" />,
    description: 'Our senior estimating team inspects the trade items, checks statutory considerations, and refines initial cost allowances.',
  },
  {
    step: 3,
    title: 'Site Survey Visit',
    icon: <Home className="h-5 w-5 text-emerald-500" />,
    description: 'Where appropriate, we visit your home to inspect subfloors, services, boundary party walls, and access logistics.',
  },
  {
    step: 4,
    title: 'Detailed Quotation',
    icon: <FileCheck className="h-5 w-5 text-purple-500" />,
    description: 'We prepare an itemised schedule of works with transparent fixed stage pricing and guaranteed build programme.',
  },
  {
    step: 5,
    title: 'Construction & Sign-off',
    icon: <Hammer className="h-5 w-5 text-amber-500" />,
    description: 'Our certified builders manage all on-site work through to completion, with Building Control sign-off guaranteed.',
  },
];

export function ContractorJourneySection({ onOpenReviewModal }: ContractorJourneySectionProps) {
  return (
    <section className="space-y-10 max-w-5xl mx-auto">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="h-3.5 w-3.5 text-[#FFAA4F]" />
          <span>Stage 10 — How ST Contractors Delivers Your Build</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
          If You Want to Move This Forward
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          From your early project guide to on-site completion — a seamless, transparent 5-step journey with our London construction team.
        </p>
      </div>

      {/* 5-Step Horizontal / Vertical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {JOURNEY_STEPS.map((step) => (
          <div
            key={step.step}
            className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-center items-center"
          >
            <div className="space-y-3 flex flex-col items-center">
              <div className="h-10 w-10 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center font-black text-sm shadow-xs">
                {step.step}
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                {step.icon}
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-heading leading-snug">
                {step.title}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
