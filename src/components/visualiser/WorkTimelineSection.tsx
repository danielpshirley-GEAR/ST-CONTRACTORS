'use client';

import React, { useState } from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import { Calendar, Clock, Check, ChevronDown, ChevronUp, UserCheck, AlertCircle } from 'lucide-react';

interface WorkTimelineSectionProps {
  projectState: ProjectState;
}

export function WorkTimelineSection({ projectState }: WorkTimelineSectionProps) {
  const { phases = [], budgetAlignment } = projectState;
  const [expandedPhase, setExpandedPhase] = useState<number>(1);

  if (phases.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FFAA4F]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Construction Sequencing & Phases
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            How ST Contractors executes your project step-by-step to minimise domestic disruption.
          </p>
        </div>

        {budgetAlignment?.onSiteWorkDuration && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
            <Clock className="w-3.5 h-3.5 text-[#FFAA4F]" />
            <span>Total On-Site Duration: {budgetAlignment.onSiteWorkDuration}</span>
          </div>
        )}
      </div>

      {/* Stepper Grid / Accordion */}
      <div className="space-y-4">
        {phases.map((phase) => {
          const isExpanded = expandedPhase === phase.phaseNumber;

          return (
            <div
              key={phase.phaseNumber}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900 border-[#FFAA4F]/40 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Bar */}
              <button
                type="button"
                onClick={() => setExpandedPhase(isExpanded ? 0 : phase.phaseNumber)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                      isExpanded
                        ? 'bg-[#FFAA4F] text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {phase.phaseNumber}
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {phase.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {phase.indicativeDuration}
                  </span>

                  <div className="p-1 rounded-lg bg-slate-800 text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-2 border-t border-slate-800 space-y-5 text-xs sm:text-sm">
                  {/* What Happens Paragraph */}
                  <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800/80 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFAA4F]">
                      What Happens On Site:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {phase.whatHappens}
                    </p>
                  </div>

                  {/* Two Columns: Specific Works & Homeowner Decisions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Work Involved */}
                    {phase.workInvolved && phase.workInvolved.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Specific Work Carried Out:
                        </span>
                        <ul className="space-y-1.5">
                          {phase.workInvolved.map((work, wIdx) => (
                            <li key={wIdx} className="flex items-start gap-2 text-xs text-slate-300">
                              <Check className="w-3.5 h-3.5 text-[#FFAA4F] flex-shrink-0 mt-0.5" />
                              <span>{work}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Trades & Decisions */}
                    <div className="space-y-4">
                      {phase.decisionsRequired && phase.decisionsRequired.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-blue-300 font-semibold text-xs">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Your Decision Required:</span>
                          </div>
                          <ul className="space-y-1">
                            {phase.decisionsRequired.map((dec, dIdx) => (
                              <li key={dIdx} className="text-xs text-blue-200 leading-snug">
                                • {dec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {phase.tradesInvolved && phase.tradesInvolved.length > 0 && (
                        <div className="text-xs text-slate-400">
                          <span className="font-semibold text-slate-300">Trades Involved: </span>
                          <span>{phase.tradesInvolved.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
