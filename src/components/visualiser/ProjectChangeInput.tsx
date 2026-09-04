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
  isApplyingChange?: boolean;
  isLoading?: boolean;
}

export const SAMPLE_CHANGE_PROMPTS = [
  'Make the room 1m wider',
  'Change specification to Bespoke tier',
  'Switch flooring to Herringbone Oak',
  'Add two frameless rooflights overhead',
];

export function ProjectChangeInput({
  onApplyChange,
  versions,
  onRestoreVersion,
  isApplyingChange,
  isLoading,
}: ProjectChangeInputProps) {
  const [prompt, setPrompt] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const loading = isLoading !== undefined ? isLoading : isApplyingChange || false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onApplyChange(prompt.trim());
    setPrompt('');
  };

  return (
    <div id="section-change-engine" className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4 text-white">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#FFAA4F] text-slate-950 flex items-center justify-center font-bold">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-white">
              AI Project Change Engine
            </h3>
            <span className="text-[10px] text-slate-400">
              Conversational design modifications
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="text-xs font-bold text-slate-400 hover:text-[#FFAA4F] flex items-center gap-1.5 transition-colors"
        >
          <History className="h-3.5 w-3.5" />
          <span>v{versions.length} History</span>
        </button>
      </div>

      {/* Change Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Tell the AI what to modify... (e.g. 'Make the extension 1m deeper and remove the island')"
            rows={3}
            className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FFAA4F] focus:bg-slate-800 resize-none"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="text-[10px] text-slate-500 hidden sm:block">
            Auto-recalculates quantities, scope &amp; budget
          </div>
          <Button
            type="submit"
            disabled={loading || !prompt.trim()}
            variant="primary"
            size="sm"
            className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-extrabold text-xs px-4 border border-[#E69335] ml-auto"
            rightIcon={<Send className="h-3 w-3" />}
          >
            {loading ? 'Applying Changes...' : 'Apply Modification'}
          </Button>
        </div>
      </form>

      {/* Sample Quick Modifiers */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          Try Example Changes:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_CHANGE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => onApplyChange(sample)}
              className="text-[11px] text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors text-left"
            >
              &ldquo;{sample}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Version History Drawer */}
      {showHistory && (
        <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Project State Version Stack</span>
            <span className="text-slate-500">{versions.length} Snapshots</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
            {versions.map((ver) => (
              <div
                key={ver.versionNumber}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#FFAA4F] font-extrabold text-[10px]">
                      v{ver.versionNumber}
                    </span>
                    <span className="text-slate-400 text-[10px]">{ver.timestamp}</span>
                  </div>
                  <p className="text-slate-200 text-[11px] font-medium line-clamp-1">
                    {ver.description}
                  </p>
                </div>

                {ver.versionNumber < versions.length && (
                  <button
                    type="button"
                    onClick={() => onRestoreVersion(ver.versionNumber)}
                    className="text-[10px] font-bold text-[#FFAA4F] hover:text-amber-300 flex items-center gap-1 shrink-0 px-2 py-1 rounded-md bg-slate-800"
                  >
                    <RotateCcw className="h-2.5 w-2.5" />
                    <span>Restore</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
