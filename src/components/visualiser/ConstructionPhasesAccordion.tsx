'use client';

import React, { useState } from 'react';
import { ConstructionPhase } from '@/types/visualiser-scope';
import {
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface ConstructionPhasesAccordionProps {
  phases: ConstructionPhase[];
}

export function ConstructionPhasesAccordion({ phases }: ConstructionPhasesAccordionProps) {
  const [openPhaseIndex, setOpenPhaseIndex] = useState<number | null>(0);

  const togglePhase = (index: number) => {
    setOpenPhaseIndex(openPhaseIndex === index ? null : index);
  };

  return (
    <div id="section-phases" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 5 • Construction Phasing
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            How Your Project Could Be Built
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Clock className="h-4 w-4 text-[#FFAA4F]" />
          <span>{phases.length} Sequential Phases</span>
        </div>
      </div>

      <div className="space-y-3">
        {phases.map((phase, idx) => {
          const isOpen = openPhaseIndex === idx;
          return (
            <div
              key={phase.phaseNumber}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen ? 'border-amber-300 bg-amber-50/20 shadow-xs' : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <button
                type="button"
                onClick={() => togglePhase(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left focus:outline-none"
              >
                <div className="flex items-center gap-3.5">
                  <span className="h-8 w-8 rounded-xl bg-[#FFAA4F] text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs border border-[#E69335]">
                    {phase.phaseNumber}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">
                      {phase.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                    {phase.indicativeDuration}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="p-4 sm:p-6 pt-0 border-t border-slate-200/60 space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 font-bold block mb-1">What Happens:</strong>
                    {phase.whatHappens}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Work Involved */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-2">
                      <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
                        Work Involved:
                      </span>
                      <ul className="space-y-1 text-slate-600">
                        {phase.workInvolved.map((w, wIdx) => (
                          <li key={wIdx} className="flex items-start gap-1.5">
                            <span className="text-[#FFAA4F]">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Trades & Decisions */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-3">
                      <div>
                        <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block flex items-center gap-1 mb-1">
                          <Users className="h-3 w-3 text-slate-500" />
                          <span>Trades Typically Involved:</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.tradesInvolved.map((trade, tIdx) => (
                            <span key={tIdx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                              {trade}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block mb-1">
                          Decisions Required from Homeowner:
                        </span>
                        <ul className="space-y-1 text-slate-600">
                          {phase.decisionsRequired.map((dec, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{dec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Dependencies & Potential Risks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-slate-100/80 text-slate-600">
                      <strong className="text-slate-800">Dependencies: </strong>
                      {phase.dependencies.join('; ')}
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/60 flex items-start gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Potential Risks: </strong>
                        {phase.potentialRisks.join('; ')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
