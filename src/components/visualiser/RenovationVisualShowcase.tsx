'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, RefreshCw, Eye, Image as ImageIcon, Sliders } from 'lucide-react';

interface RenovationVisualShowcaseProps {
  conceptImageUrl?: string;
  sourceImageUrl?: string;
  projectTitle: string;
  onSelectDirection?: (direction: string) => void;
  isGenerating?: boolean;
}

const STYLE_DIRECTIONS = [
  'Practical',
  'Recommended',
  'Premium',
  'Warmer Tones',
  'More Contemporary',
  'More Built-in Storage',
];

export function RenovationVisualShowcase({
  conceptImageUrl,
  sourceImageUrl,
  projectTitle,
  onSelectDirection,
  isGenerating = false,
}: RenovationVisualShowcaseProps) {
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [activeDirection, setActiveDirection] = useState<string>('Recommended');

  const handleDirectionClick = (dir: string) => {
    setActiveDirection(dir);
    if (onSelectDirection) {
      onSelectDirection(dir);
    }
  };

  const currentDisplayImage = showOriginal && sourceImageUrl ? sourceImageUrl : conceptImageUrl;

  return (
    <section className="space-y-8 max-w-5xl mx-auto">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-[#FFAA4F]" />
          <span>Stage 9 — Visual Transformation Concept</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
          Here&apos;s What It Could Become
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          An architectural visual concept of your finished {projectTitle.toLowerCase()}, tailored to your space and chosen finish direction.
        </p>
      </div>

      {/* Main Visual Display Card */}
      <div className="bg-slate-900 rounded-3xl border-2 border-slate-800 p-4 sm:p-6 shadow-2xl space-y-6 text-white overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFAA4F] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {showOriginal ? 'Original Homeowner Space' : 'Architectural Design Concept'}
            </span>
          </div>

          {sourceImageUrl && (
            <button
              type="button"
              onClick={() => setShowOriginal(!showOriginal)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-[#FFAA4F]" />
              <span>{showOriginal ? 'View Renovation Concept' : 'Compare Original Photo'}</span>
            </button>
          )}
        </div>

        {/* Visual Frame */}
        <div className="relative h-80 sm:h-[480px] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
          {currentDisplayImage ? (
            <Image
              src={currentDisplayImage}
              alt={projectTitle}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          ) : (
            /* Graceful Diagram Fallback (Never Break the Flow) */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <div className="h-16 w-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#FFAA4F]">
                <ImageIcon className="h-8 w-8" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="text-lg font-bold text-white">
                  Architectural Visual in Progress
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your project roadmap, scope, and costs are fully active below. You can explore different design directions using the buttons below.
                </p>
              </div>
            </div>
          )}

          {/* Conceptual Disclaimer Badge */}
          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-bold border border-slate-700">
            CONCEPT VISUALISATION — ST CONTRACTORS
          </div>
        </div>

        {/* Style Direction Chips */}
        <div className="space-y-2.5 pt-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Explore Alternative Design Directions:
          </div>
          <div className="flex flex-wrap gap-2">
            {STYLE_DIRECTIONS.map((dir) => {
              const isSelected = activeDirection === dir;
              return (
                <button
                  key={dir}
                  type="button"
                  onClick={() => handleDirectionClick(dir)}
                  disabled={isGenerating}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#FFAA4F] text-slate-950 border-[#FFAA4F] shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {dir}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
