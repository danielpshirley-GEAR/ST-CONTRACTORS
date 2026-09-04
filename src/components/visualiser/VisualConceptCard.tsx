'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProjectState } from '@/types/visualiser-scope';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Eye,
  Sliders,
  Send,
  AlertTriangle,
  RotateCw,
  Layers,
  Check,
} from 'lucide-react';

interface VisualConceptCardProps {
  state: ProjectState;
  onRefineVisual: (prompt: string) => void;
  isRefining: boolean;
}

export const ARCHITECTURAL_STYLES = [
  { id: 'contemporary_glass', label: 'Contemporary Glass & Slimline Sliders' },
  { id: 'industrial_crittall', label: 'Industrial Black Steel Crittall Doors' },
  { id: 'heritage_period', label: 'Heritage Period In-Frame Restoration' },
  { id: 'scandinavian_minimal', label: 'Scandinavian Minimal & Light Oak' },
];

export function VisualConceptCard({ state, onRefineVisual, isRefining }: VisualConceptCardProps) {
  const [refineInput, setRefineInput] = useState('');
  const visual = state.visualConcept;

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineInput.trim()) return;
    onRefineVisual(refineInput.trim());
    setRefineInput('');
  };

  return (
    <div id="section-visual" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 2 • Architectural Concept
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Visual Concept &amp; Design Direction
          </h2>
        </div>
        <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold text-xs">
          Concept Visualization
        </Badge>
      </div>

      {/* Main Visual Image Frame */}
      <div className="relative h-80 sm:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md border border-slate-200">
        <Image
          src={visual.currentConceptImage}
          alt="Architectural Concept Visualisation"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

        {/* Floating Style Label */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-white text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Style</span>
            <span className="font-bold text-white block mt-0.5 capitalize">
              {visual.architecturalStyle.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Visual Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>Important Note: </strong>{visual.disclaimer}
        </span>
      </div>

      {/* Style Selector Chips */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Switch Architectural Style:
        </span>
        <div className="flex flex-wrap gap-2">
          {ARCHITECTURAL_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => onRefineVisual(`Switch design style to ${style.label}`)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                visual.architecturalStyle === style.id
                  ? 'bg-[#FFAA4F] text-slate-950 border-[#E69335] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversational Visual Refiner */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label htmlFor="visual-refine" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Refine This Visual Concept Conversationally:
        </label>
        <form onSubmit={handleRefineSubmit} className="flex gap-2">
          <input
            id="visual-refine"
            type="text"
            value={refineInput}
            onChange={(e) => setRefineInput(e.target.value)}
            placeholder="e.g. Make the island larger, change worktop to white marble, add ceiling rooflights..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FFAA4F] focus:bg-white"
          />
          <Button
            type="submit"
            disabled={isRefining || !refineInput.trim()}
            variant="primary"
            size="sm"
            className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-extrabold text-xs px-4 border border-[#E69335] shrink-0"
            rightIcon={<Send className="h-3.5 w-3.5" />}
          >
            {isRefining ? 'Refining...' : 'Refine'}
          </Button>
        </form>
      </div>
    </div>
  );
}
