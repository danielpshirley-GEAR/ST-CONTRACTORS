'use client';

import React, { useState } from 'react';
import { ProjectVersion } from '@/types/visualiser-scope';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  History,
  RotateCcw,
  Send,
  ArrowRight,
  Sliders,
} from 'lucide-react';

interface ProjectChangeInputProps {
  onApplyChange: (prompt: string) => void;
  versions: ProjectVersion[];
  onRestoreVersion: (versionNum: number) => void;
  isApplyingChange: boolean;
}

export const SAMPLE_CHANGE_PROMPTS = [
  'Make the room 1m wider',
  'Change specification to Bespoke Luxury tier',
  'Switch flooring to Herringbone Oak',
  'Add underfloor heating to whole area',
];

export function ProjectChangeInput({
  onApplyChange,
  versions,
  onRestoreVersion,
  isApplyingChange,
}: ProjectChangeInputProps) {
  const [prompt, setPrompt] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onApplyChange(prompt.trim());
    setPrompt('');
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Natural Language Modifier
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white mt-0.5">
            Modify Your Project in Plain English
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 self-start sm:self-auto bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
        >
          <History className="h-3.5 w-3.5 text-[#FFAA4F]" />
          <span>Version History ({versions.length})</span>
        </button>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
        Type any adjustment. Our engine intelligently recalculates downstream quantities, specifications, and feasibility without wiping your existing plan.
      </p>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Make the room 1m wider, change flooring to herringbone, upgrade to bespoke tier..."
          className="flex-1 rounded-2xl border border-slate-700 bg-slate-800/90 p-3.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#FFAA4F]"
        />
        <Button
          type="submit"
          disabled={isApplyingChange || !prompt.trim()}
          variant="primary"
          size="md"
          className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-extrabold text-xs sm:text-sm px-6 border border-[#E69335] justify-center"
          rightIcon={<Send className="h-4 w-4" />}
        >
          {isApplyingChange ? 'Recalculating...' : 'Apply Change'}
        </Button>
      </form>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 pt-1">
        {SAMPLE_CHANGE_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onApplyChange(p)}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/80 transition-colors"
          >
            + {p}
          </button>
        ))}
      </div>

      {/* Version History Drawer */}
      {showHistory && (
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Project Version Stack (Undo / Restore):
          </span>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {versions.map((ver) => (
              <div
                key={ver.versionNumber}
                className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">
                    Version {ver.versionNumber}: {ver.description}
                  </span>
                  <span className="text-[11px] text-slate-400 block">{ver.timestamp}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRestoreVersion(ver.versionNumber)}
                  className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-[11px] flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3 text-[#FFAA4F]" />
                  <span>Restore</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
