'use client';

import React from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import { CheckCircle2, ShieldCheck, Wrench, Sparkles } from 'lucide-react';

interface ProjectFactorsSectionProps {
  projectState: ProjectState;
}

export function ProjectFactorsSection({ projectState }: ProjectFactorsSectionProps) {
  const { workingInFavour = [], potentialChallenges = [] } = projectState;

  if (workingInFavour.length === 0 && potentialChallenges.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FFAA4F]" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Site Conditions & Project Realities
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          First-hand builder observations on site advantages and how we navigate known challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: What Works in Your Favour */}
        {workingInFavour.length > 0 && (
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-base font-bold text-white tracking-tight">
                What Works in Your Favour
              </h3>
            </div>

            <ul className="space-y-3.5 pt-1">
              {workingInFavour.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-2" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Right: Potential Challenges & Solutions */}
        {potentialChallenges.length > 0 && (
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[#FFAA4F]">
              <Wrench className="w-5 h-5" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Potential Challenges & How We Solve Them
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              {potentialChallenges.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-2"
                >
                  <p className="text-xs sm:text-sm font-bold text-white">
                    {item.challenge}
                  </p>
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-[#FFAA4F] flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      <strong className="text-slate-200">Our Solution: </strong>
                      {item.solution}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
