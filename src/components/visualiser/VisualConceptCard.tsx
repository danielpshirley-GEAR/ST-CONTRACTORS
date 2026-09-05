'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProjectState, VisualConceptHistoryItem } from '@/types/visualiser-scope';
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
  Wand2,
  History,
  Columns,
  RefreshCw,
} from 'lucide-react';

interface VisualConceptCardProps {
  state: ProjectState;
  onRefineVisual: (prompt: string) => void;
  onRestoreVisualVersion?: (version: VisualConceptHistoryItem) => void;
  isRefining: boolean;
}

export const ARCHITECTURAL_STYLES = [
  { id: 'contemporary_glass', label: 'Contemporary Glass & Slimline Sliders' },
  { id: 'industrial_crittall', label: 'Industrial Black Steel Crittall Doors' },
  { id: 'heritage_period', label: 'Heritage Period In-Frame Restoration' },
  { id: 'scandinavian_minimal', label: 'Scandinavian Minimal & Light Oak' },
];

export const QUICK_MODIFIERS = [
  'Add two frameless rooflights overhead',
  'Make the central kitchen island larger',
  'Change cabinetry color to navy blue',
  'Specify herringbone engineered oak parquet',
  'Specify seamless architectural microcement',
  'Change cabinetry color to dark forest green',
];

export function VisualConceptCard({
  state,
  onRefineVisual,
  onRestoreVisualVersion,
  isRefining,
}: VisualConceptCardProps) {
  const [refineInput, setRefineInput] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number | null>(null);

  const visual = state.visualConcept;
  const isImageToImage = visual.conceptType === 'image_to_image_transformation';
  const history = visual.visualHistory || [];
  const currentVer = visual.generationVersion || 1;

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineInput.trim()) return;
    onRefineVisual(refineInput.trim());
    setRefineInput('');
  };

  const displayedImage =
    selectedHistoryIndex !== null && history[selectedHistoryIndex]
      ? history[selectedHistoryIndex].imageUrl
      : visual.currentConceptImage;

  return (
    <div id="section-visual" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 2 • Architectural Concept &amp; Visualiser
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Visual Concept &amp; Design Direction
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={isImageToImage ? 'success' : 'brand'}
            className={`text-xs font-extrabold ${
              isImageToImage
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-[#FFAA4F] text-slate-950 border-[#E69335]'
            }`}
          >
            {isImageToImage ? 'Image-to-Image Transformation' : 'Conceptual Interpretation'}
          </Badge>

          {visual.generationProvider && (
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              {visual.generationProvider}
            </span>
          )}
        </div>
      </div>

      {/* Visual Revision Bar (Items 7, 8) */}
      {history.length > 1 && (
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Visual Revisions:</span>
            <div className="flex items-center gap-1.5">
              {history.map((h, idx) => {
                const isActive = (selectedHistoryIndex === null && idx === history.length - 1) || selectedHistoryIndex === idx;
                return (
                  <button
                    key={h.id || idx}
                    type="button"
                    onClick={() => setSelectedHistoryIndex(idx)}
                    className={`px-2.5 py-1 rounded text-xs font-extrabold transition-all ${
                      isActive
                        ? 'bg-slate-900 text-[#FFAA4F] shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    v{h.version}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {visual.sourceImage && (
              <button
                type="button"
                onClick={() => setShowCompare(!showCompare)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Columns className="w-3.5 h-3.5 text-slate-500" />
                {showCompare ? 'Single View' : 'Compare Source Photo'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error UX State (Item 35) */}
      {visual.status === 'failed' ? (
        <div className="p-8 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-4">
          <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
          <div>
            <h4 className="text-base font-bold text-amber-900">Visual concept could not be generated</h4>
            <p className="text-xs text-amber-700 mt-1 max-w-md mx-auto">
              {visual.errorMessage || 'An error occurred while communicating with the visual render engine. You can retry or proceed directly with scope and calculations.'}
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRefineVisual(visual.visualPrompt || 'Regenerate visual')}
              className="gap-1.5 font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </Button>
          </div>
        </div>
      ) : showCompare && visual.sourceImage ? (
        /* Side-by-Side Comparison View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">
              Original Homeowner Photograph
            </span>
            <div className="relative h-72 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
              <Image
                src={visual.sourceImage}
                alt="Original Source Photograph"
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                SOURCE IMAGE
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-extrabold text-[#FFAA4F] uppercase tracking-wide">
              AI Concept Transformation (v{currentVer})
            </span>
            <div className="relative h-72 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
              <Image
                src={displayedImage}
                alt="AI Concept Transformation"
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#FFAA4F] text-slate-950 text-[10px] font-extrabold px-2 py-1 rounded">
                CONCEPT VISUALISATION
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Single Main Visual Image Frame */
        <div className="relative h-80 sm:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md border border-slate-200">
          <Image
            src={displayedImage}
            alt="Architectural Concept Visualisation"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-slate-950/85 text-[#FFAA4F] text-[11px] font-extrabold px-3 py-1.5 rounded-lg border border-white/20">
              CONCEPT VISUALISATION • v{currentVer}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-white text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Palette</span>
              <span className="font-bold text-white block mt-0.5">
                {visual.cabinetryColor || 'Custom'} • {visual.flooringType || 'Oak'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Fallback degraded banner when AI is offline */}
      {visual.disclaimer?.includes('ARCHITECTURAL PLACEHOLDER CONCEPT') && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Architectural Placeholder Concept: </span>
              AI visual generation was unavailable. This simplified diagram is provided so you can continue building the project scope.
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRefineVisual(visual.visualPrompt || 'Regenerate visual')}
            className="shrink-0 font-bold border-amber-400 bg-white hover:bg-amber-100 text-amber-950 gap-1.5"
            disabled={isRefining}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefining ? 'animate-spin' : ''}`} />
            Retry AI visual
          </Button>
        </div>
      )}

      {/* Safety / Legal Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-slate-600 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">Concept Visualisation Disclaimer: </span>
          {visual.disclaimer}
        </div>
      </div>

      {/* Quick Modifiers & Conversational Input */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-[#FFAA4F]" />
            Quick Design Modifiers
          </span>
          <span className="text-[11px] text-slate-400">Click to apply instant transformation</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_MODIFIERS.map((mod, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isRefining}
              onClick={() => onRefineVisual(mod)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#FFAA4F]/20 hover:text-slate-900 text-slate-700 border border-slate-200 transition-colors disabled:opacity-50"
            >
              + {mod}
            </button>
          ))}
        </div>

        {/* Custom Conversational Visual Change Form */}
        <form onSubmit={handleRefineSubmit} className="flex gap-2 pt-2">
          <input
            type="text"
            value={refineInput}
            onChange={(e) => setRefineInput(e.target.value)}
            disabled={isRefining}
            placeholder="e.g., 'Make the cabinets navy blue and add pale oak flooring'..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFAA4F] text-slate-900 placeholder:text-slate-400"
          />
          <Button
            type="submit"
            disabled={isRefining || !refineInput.trim()}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-4 rounded-xl gap-1.5"
          >
            {isRefining ? <RotateCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Modify Visual
          </Button>
        </form>
      </div>
    </div>
  );
}
