'use client';

import React from 'react';
import { ProjectComplexity } from '@/types/visualiser-scope';
import { Badge } from '@/components/ui/Badge';
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface ProjectComplexityBadgeProps {
  complexity: ProjectComplexity;
}

export function ProjectComplexityBadge({ complexity }: ProjectComplexityBadgeProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-[#FFAA4F]" />
          <span>Project Complexity Rating</span>
        </span>
        <Badge
          variant={
            complexity.level === 'VERY_HIGH'
              ? 'warning'
              : complexity.level === 'HIGH'
              ? 'warning'
              : complexity.level === 'MODERATE'
              ? 'brand'
              : 'slate'
          }
          className={`text-xs font-extrabold px-3 py-1 ${
            complexity.level === 'VERY_HIGH'
              ? 'bg-rose-100 text-rose-900 border-rose-300'
              : complexity.level === 'HIGH'
              ? 'bg-orange-100 text-orange-900 border-orange-300'
              : complexity.level === 'MODERATE'
              ? 'bg-[#FFAA4F] text-slate-950 border-[#E69335]'
              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
          }`}
        >
          {complexity.level} COMPLEXITY ({complexity.scoreOutOf10}/10)
        </Badge>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed font-normal">
        {complexity.summary}
      </p>

      <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Primary Complexity Drivers:
        </span>
        <ul className="space-y-1 text-xs text-slate-700">
          {complexity.mainDrivers.map((driver, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-[#FFAA4F] font-bold">•</span>
              <span>{driver}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
