import React from 'react';
import { ProjectTimelineStage } from '@/lib/db/schema';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

interface TimelineProgressViewProps {
  stages: ProjectTimelineStage[];
}

export function TimelineProgressView({ stages }: TimelineProgressViewProps) {
  return (
    <div className="space-y-3">
      {/* HORIZONTAL STEPPER (DESKTOP) */}
      <div className="hidden lg:grid grid-cols-7 gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800">
        {stages.map((stage) => {
          const isCompleted = stage.status === 'COMPLETED';
          const isInProgress = stage.status === 'IN_PROGRESS';

          return (
            <div
              key={stage.id}
              className={`p-2.5 rounded-xl transition-all border ${
                isCompleted
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : isInProgress
                  ? 'bg-amber-950/30 border-[#FFAA4F]/60 text-amber-300 ring-1 ring-[#FFAA4F]/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold">Stage {stage.stageNumber}</span>
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : isInProgress ? (
                  <Clock className="h-3.5 w-3.5 text-[#FFAA4F] animate-pulse" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-slate-600" />
                )}
              </div>
              <div className="text-[11px] font-bold text-white leading-tight line-clamp-2">
                {stage.title}
              </div>
              <div className="text-[9px] text-slate-400 mt-1 font-mono">
                {stage.completedDate ? `Done ${stage.completedDate}` : stage.estimatedWeeks || 'Upcoming'}
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPACT PROGRESS BAR (MOBILE/TABLET) */}
      <div className="lg:hidden space-y-2">
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
          {stages.map((stage) => {
            const isCompleted = stage.status === 'COMPLETED';
            const isInProgress = stage.status === 'IN_PROGRESS';
            return (
              <div
                key={stage.id}
                className={`h-full flex-1 border-r border-slate-900 ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : isInProgress
                    ? 'bg-[#FFAA4F] animate-pulse'
                    : 'bg-slate-800'
                }`}
              />
            );
          })}
        </div>

        {/* ACTIVE STAGE HIGHLIGHT */}
        {(() => {
          const activeStage = stages.find((s) => s.status === 'IN_PROGRESS') || stages[0];
          return (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase block">
                  Current Active Stage ({activeStage.stageNumber}/7)
                </span>
                <strong className="text-white">{activeStage.title}</strong>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">{activeStage.estimatedWeeks}</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
