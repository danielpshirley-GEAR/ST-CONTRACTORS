'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ExtractedProject,
  ExtractedRoom,
  ExtractedWorkItem,
  MissingQuestion,
  PotentialConsideration,
} from '@/lib/assistant/types';
import { ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const AiConstructionAssistant: React.FC = () => {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedProject, setExtractedProject] = useState<ExtractedProject | null>(null);

  const handleAnalyze = async () => {
    const prompt = inputText.trim();
    if (!prompt) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/assistant/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze project description.');
      }

      setExtractedProject(data.project);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during project analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = () => {
    if (!extractedProject) return;

    try {
      sessionStorage.setItem('ai_assistant_transfer', JSON.stringify(extractedProject));
    } catch (e) {
      console.warn('Session storage write error:', e);
    }

    router.push(`/plan-my-project?source=assistant&service=${extractedProject.projectType}`);
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* 1. INPUT CARD (Sleek with Warm Top Accent Border) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 border-t-4 border-t-[#FFAA4F] shadow-sm space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
            What are you planning to build?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Enter your project description in plain English. We extract the scope, dimensions, required trades, and building regulations.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="space-y-4"
        >
          <div className="relative">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. I want to turn my garage into a cinema room, making a door between my garage and my hallway..."
              className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F] focus:border-[#FFAA4F] transition-all resize-y"
              disabled={isLoading}
            />
            <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-400">
              {inputText.length}/2000
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="text-xs text-slate-500 font-normal hidden sm:inline">
              Free &amp; non-binding • Pre-fills your project planner
            </span>

            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-full sm:w-auto font-bold text-xs bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 px-7 py-3 shadow-md hover:shadow-amber-500/20 border border-[#E69335] transition-all"
            >
              {isLoading ? 'Analyzing Scope...' : 'Analyze Scope'}
            </Button>
          </div>
        </form>
      </div>

      {/* 2. LOADING STATE */}
      {isLoading && (
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 text-center space-y-3 animate-pulse shadow-lg">
          <div className="text-xs uppercase tracking-wider text-[#FFAA4F] font-mono font-bold">
            Processing Project Description...
          </div>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Extracting room zones, trade packages, structural requirements, and Building Regulations...
          </p>
        </div>
      )}

      {/* 3. STRUCTURED EXTRACTION BREAKDOWN */}
      {extractedProject && !isLoading && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* CONCISE BLACK BOX (Luxury Charcoal Theme with Amber Glow & Accent Highlights) */}
          <div className="bg-neutral-950 border border-neutral-800 text-white rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 relative overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,170,79,0.16),rgba(255,255,255,0))]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                {extractedProject.projectTypeDisplay}
              </h2>
              <div className="text-xs font-mono text-amber-300 font-bold bg-amber-500/15 px-3.5 py-1.5 rounded-lg border border-amber-500/30 shrink-0 self-start sm:self-auto shadow-xs">
                Estimated Timeline: {extractedProject.estimatedTimelineWeeks.min} – {extractedProject.estimatedTimelineWeeks.max} Weeks
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <p className="text-xs text-neutral-300 font-normal">
                Ready to review line-item costs and configure your estimate?
              </p>
              <button
                type="button"
                onClick={handleCreateProject}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-amber-500/25 transition-all cursor-pointer border border-[#E69335] shrink-0"
              >
                <span>Create Project From This</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* SECTION 1: EXTRACTED REQUIREMENTS */}
          <section aria-label="Project Requirements" className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-amber-100 text-amber-900 border border-amber-300/80 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Project Requirements
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-700">
              {extractedProject.projectRequirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFAA4F] ring-4 ring-amber-100/90 mt-1.5 shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2: TARGET ROOMS & ZONES (3-Stack Vertical Hierarchy) */}
          <section aria-label="Rooms and Spaces" className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-amber-100 text-amber-900 border border-amber-300/80 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Target Rooms &amp; Zones
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {extractedProject.rooms.map((room, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-1.5 text-xs text-left hover:border-amber-300/80 transition-colors"
                >
                  {/* Stack 1: Room Title */}
                  <div className="font-bold text-slate-900 text-sm">{room.name}</div>
                  {/* Stack 2: Dimensions Subtitle with Warm Amber Tag */}
                  {room.dimensions && (
                    <div className="inline-block text-[11px] font-mono text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300/70 font-semibold">
                      {room.dimensions.length}m × {room.dimensions.width}m ({room.dimensions.areaM2}m²)
                    </div>
                  )}
                  {/* Stack 3: Purpose Description */}
                  <p className="text-slate-600 text-xs font-normal leading-relaxed">{room.purpose}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: LIKELY WORKS & TRADES (3-Stack Vertical Hierarchy) */}
          <section aria-label="Likely Works" className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-amber-100 text-amber-900 border border-amber-300/80 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Likely Works &amp; Trade Packages
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {extractedProject.likelyWorks.map((work, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-1.5 text-left hover:border-amber-300/80 transition-colors"
                >
                  {/* Stack 1: Work Package Title */}
                  <div className="font-bold text-slate-900 text-sm">{work.workTitle}</div>
                  {/* Stack 2: Category & Trade Subtitle */}
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 font-medium">
                    <span>{work.category}</span>
                    <span className="text-amber-400">•</span>
                    <span>Trade: {work.tradeRequired}</span>
                  </div>
                  {/* Stack 3: Description Body */}
                  <p className="text-slate-600 text-xs font-normal leading-relaxed">{work.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: MISSING QUESTIONS (3-Stack Vertical Hierarchy) */}
          <section aria-label="Missing Questions" className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-amber-100 text-amber-900 border border-amber-300/80 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Clarifications Needed
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {extractedProject.missingQuestions.map((q) => (
                <div key={q.id} className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 space-y-1.5 text-left">
                  {/* Stack 1: Question Title */}
                  <div className="font-bold text-slate-900 text-sm">{q.question}</div>
                  {/* Stack 2: Context Subtitle */}
                  <div className="text-[11px] font-mono text-amber-800/80 font-medium">
                    Surveyor Feasibility Assessment
                  </div>
                  {/* Stack 3: Reason Body */}
                  <p className="text-slate-700 text-xs font-normal leading-relaxed">{q.reason}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: REGULATORY CONSIDERATIONS (3-Stack Vertical Hierarchy) */}
          <section aria-label="Regulatory Considerations" className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-amber-100 text-amber-900 border border-amber-300/80 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                5
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Regulatory &amp; Feasibility Considerations
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {extractedProject.potentialConsiderations.map((c, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-1.5 text-left hover:border-amber-300/80 transition-colors">
                  {/* Stack 1: Topic Title */}
                  <div className="font-bold text-slate-900 text-sm leading-snug">{c.topic}</div>
                  {/* Stack 2: Statutory Reference with Amber Highlight */}
                  {c.regulatoryRef && (
                    <div className="inline-block text-[11px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200/90 font-medium">
                      {c.regulatoryRef}
                    </div>
                  )}
                  {/* Stack 3: Consideration Description */}
                  <p className="text-slate-600 text-xs font-normal leading-relaxed">
                    {c.consideration}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* BOTTOM TRANSFER BUTTON WITH AMBER GLOW */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCreateProject}
              className="w-full py-3.5 px-6 rounded-xl bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/25 transition-all cursor-pointer border border-[#E69335]"
            >
              <span>Create Project From This Scope</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
