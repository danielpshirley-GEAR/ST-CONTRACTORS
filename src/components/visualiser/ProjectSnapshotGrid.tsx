'use client';

import React from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import {
  Hammer,
  Home,
  Ruler,
  FileCheck,
  Calendar,
  PoundSterling,
  Info,
} from 'lucide-react';

interface ProjectSnapshotGridProps {
  projectState: ProjectState;
}

export function ProjectSnapshotGrid({ projectState }: ProjectSnapshotGridProps) {
  const cards = projectState.projectSnapshot || [];

  if (cards.length === 0) return null;

  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('scope') || l.includes('work')) return Hammer;
    if (l.includes('property') || l.includes('context')) return Home;
    if (l.includes('physical') || l.includes('dimension') || l.includes('area')) return Ruler;
    if (l.includes('pathway') || l.includes('statutory') || l.includes('reg')) return FileCheck;
    if (l.includes('duration') || l.includes('timeline') || l.includes('time')) return Calendar;
    if (l.includes('cost') || l.includes('budget') || l.includes('guide')) return PoundSterling;
    return Info;
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span>Project Snapshot at a Glance</span>
        </h2>
        <span className="text-xs text-slate-400">Core parameters mapped from brief</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {cards.map((card, idx) => {
          const Icon = getIcon(card.label);
          const isBudget = card.label.toLowerCase().includes('cost') || card.label.toLowerCase().includes('budget');

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isBudget
                  ? 'bg-slate-900/90 border-[#FFAA4F]/40 shadow-lg shadow-[#FFAA4F]/5'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {card.label}
                  </span>
                  <Icon
                    className={`w-4 h-4 ${
                      isBudget ? 'text-[#FFAA4F]' : 'text-slate-500'
                    }`}
                  />
                </div>

                <p
                  className={`text-sm sm:text-base font-bold tracking-tight line-clamp-2 ${
                    isBudget ? 'text-[#FFAA4F]' : 'text-slate-100'
                  }`}
                >
                  {card.value}
                </p>
              </div>

              {card.detail && (
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-1 border-t border-slate-800/60 pt-1.5">
                  {card.detail}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
