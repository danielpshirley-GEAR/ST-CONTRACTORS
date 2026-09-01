'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ExtractedProject,
  CustomSpecificationOption,
  ThingToConsider,
  TradePhaseBreakdown,
} from '@/lib/assistant/types';
import {
  ArrowRight,
  AlertTriangle,
  Sparkles,
  PoundSterling,
  Building2,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  Hammer,
  HelpCircle,
  FileCheck2,
  ArrowUpRight,
  Sliders,
  Flame,
  Droplets,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

const SAMPLE_PROMPTS = [
  {
    label: 'Kitchen Extension & RSJ Knockthrough',
    text: 'I want to build a 6m rear kitchen extension with slimline aluminium sliding doors, knock down the dividing wall to the dining room with an RSJ steel beam, install wet underfloor heating, herringbone oak flooring, and a large quartz kitchen island.',
  },
  {
    label: 'Loft Conversion with Ensuite',
    text: 'Convert our semi-detached loft into a master bedroom with an ensuite shower room, rear dormer with Juliet balcony, two Velux rooflights, and bespoke fitted eaves wardrobes.',
  },
  {
    label: 'Garage to Cinema / Gym',
    text: 'I want to turn my attached garage into a dedicated acoustic cinema and home gym, cutting a new doorway through to the main hallway with a fire door, infilling the front vehicle door, and adding underfloor heating.',
  },
  {
    label: 'Period Back-to-Brick Renovation',
    text: 'Full turnkey back-to-brick renovation of a 3-bedroom Victorian terraced house. Needs complete rewiring, new central heating and unvented cylinder, replastering, structural chimney breast removal, and new family bathroom.',
  },
];

export const AiConstructionAssistant: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedProject, setExtractedProject] = useState<ExtractedProject | null>(null);
  const [activeSpecTier, setActiveSpecTier] = useState<string>('Architectural Premium');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q.trim()) {
      setInputText(q.trim());
      handleAnalyze(q.trim());
    }
  }, [searchParams]);

  const handleAnalyze = async (textToUse?: string) => {
    const prompt = (textToUse || inputText).trim();
    if (!prompt) return;

    if (textToUse) {
      setInputText(textToUse);
    }

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

  const handleTransferToPlanner = () => {
    if (!extractedProject) return;
    try {
      sessionStorage.setItem('ai_assistant_transfer', JSON.stringify(extractedProject));
    } catch (e) {
      console.warn('Session storage write error:', e);
    }
    router.push(`/plan-my-project?source=assistant&service=${extractedProject.projectType}`);
  };

  return (
    <div className="space-y-10 text-left max-w-5xl mx-auto">
      {/* 1. PRIMARY INPUT PROMPT BOX */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md border-t-4 border-t-[#FFAA4F] space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-[#D97706]">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              What are you building?
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Type your project idea in plain English (simple or complex). Our AI Surveyor interprets your scope, calculates 2026 London build prices, presents custom options, identifies key regulatory considerations, and provides a trade-by-trade breakdown.
          </p>
        </div>

        {/* Quick-Prompt Inspiration Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Popular Example Projects (Click to test):
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAnalyze(item.text)}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-full bg-[#FAFAF9] hover:bg-amber-50 hover:text-[#D97706] hover:border-[#FFAA4F] border border-slate-200 text-xs font-semibold text-slate-700 transition-all text-left shadow-2xs"
              >
                + {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input & Submit */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="space-y-4"
        >
          <div className="relative">
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. I want to build a 6m rear kitchen extension with aluminium bifolds, taking out the wall to the dining room with an RSJ, underfloor heating, and a small utility room..."
              className="w-full p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F] focus:border-[#FFAA4F] transition-all resize-y shadow-inner"
              disabled={isLoading}
            />
            <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-400 bg-white/80 px-2 py-0.5 rounded-md">
              {inputText.length}/2000
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Free instant calculation • No email required to view prices</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-full sm:w-auto font-bold text-sm bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 px-8 py-3.5 shadow-md hover:shadow-amber-500/20 border border-[#E69335] transition-all"
            >
              {isLoading ? 'Interpreting Scope...' : 'Calculate Scope & Costs →'}
            </Button>
          </div>
        </form>
      </div>

      {/* 2. LOADING STATE */}
      {isLoading && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm animate-pulse">
          <div className="p-3 rounded-2xl bg-amber-100 text-[#D97706] inline-block">
            <Sparkles className="h-6 w-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <div className="text-base font-extrabold text-slate-900 font-heading">
              Interpreting Project Scope &amp; Calculating 2026 London Rates...
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Extracting structural RSJ steel loads, calculating concrete &amp; excavation volumes, verifying Part L insulation, and checking Party Wall &amp; Thames Water rules...
            </p>
          </div>
        </div>
      )}

      {/* 3. STRUCTURED INTERPRETATION RESULTS */}
      {extractedProject && !isLoading && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* HEADER SUMMARY CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <Badge variant="brand" size="sm" className="bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40 font-bold text-xs mb-2">
                  Interpreted Project Classification
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
                  {extractedProject.projectTypeDisplay}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleTransferToPlanner}
                  variant="primary"
                  size="md"
                  className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-xs px-6 py-3 shadow-md"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Transfer to Planner
                </Button>
              </div>
            </div>

            {/* A. GENERAL DESCRIPTION OF WORK NEEDED */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                General Description of Works Required:
              </h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                {extractedProject.generalDescription || extractedProject.summary}
              </p>
            </div>

            {/* B. 2026 INDICATIVE COST RANGE & BENCHMARKS */}
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] block">
                    Estimated 2026 London Turnkey Cost Range:
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tracking-tight">
                    {extractedProject.costEstimate?.formatted || '£85,000 – £120,000'}
                  </div>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <Badge variant="brand" size="sm" className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-xs">
                    Benchmark: {extractedProject.costEstimate?.benchmarkPerM2 || '£2,400 – £3,200 / m²'}
                  </Badge>
                  <div className="text-xs text-slate-500 font-medium">
                    Estimated Timeline: {extractedProject.estimatedTimelineWeeks.min}–{extractedProject.estimatedTimelineWeeks.max} Weeks
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 border-t border-amber-200/60 pt-2 font-normal">
                {extractedProject.costEstimate?.notes || 'Includes structural steelwork, foundations, architectural glazing, first/second fix MEP, and turnkey plastering.'}
              </p>
            </div>
          </div>

          {/* C. CUSTOM SPECIFICATION TIERS & OPTIONS */}
          {extractedProject.customSpecifications && extractedProject.customSpecifications.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-1">
                <h4 className="text-xl font-extrabold font-heading text-slate-900 flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-[#D97706]" />
                  <span>Custom Specification Options &amp; Upgrades</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Compare finish levels and architectural options tailored to your project.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {extractedProject.customSpecifications.map((spec, sIdx) => {
                  const isSelected = activeSpecTier === spec.tier;
                  return (
                    <div
                      key={sIdx}
                      onClick={() => setActiveSpecTier(spec.tier)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'border-[#FFAA4F] bg-amber-50/40 shadow-sm ring-1 ring-[#FFAA4F]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 font-heading">{spec.tier}</span>
                          {spec.isRecommended && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFAA4F] text-slate-950">
                              Popular
                            </span>
                          )}
                        </div>
                        <h5 className="font-extrabold text-sm text-slate-900">{spec.title}</h5>
                        <div className="font-mono text-xs font-extrabold text-emerald-700">{spec.priceImpact}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{spec.description}</p>
                      </div>

                      <ul className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                        {spec.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* D. PHASE-BY-PHASE TRADE & SCOPE BREAKDOWN */}
          {extractedProject.tradePhaseBreakdown && extractedProject.tradePhaseBreakdown.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-1">
                <h4 className="text-xl font-extrabold font-heading text-slate-900 flex items-center gap-2">
                  <Hammer className="h-5 w-5 text-[#D97706]" />
                  <span>Trade-by-Trade Scope Breakdown &amp; Sequence</span>
                </h4>
                <p className="text-xs text-slate-500">
                  How our master building team will sequence and execute each construction phase.
                </p>
              </div>

              <div className="space-y-3">
                {extractedProject.tradePhaseBreakdown.map((phase, pIdx) => (
                  <div key={pIdx} className="p-5 rounded-2xl bg-[#FAFAF9] border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-6 w-6 rounded-full bg-[#FFAA4F] text-slate-950 font-bold text-xs flex items-center justify-center">
                          {phase.phase}
                        </span>
                        <h5 className="font-extrabold text-sm text-slate-900 font-heading">
                          Phase {phase.phase}: {phase.title}
                        </h5>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500">{phase.estimatedWeeks}</span>
                        <span className="text-xs font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {phase.estimatedCostRange}
                        </span>
                      </div>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                      {phase.items.map((it, itIdx) => (
                        <li key={itIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* E. CRITICAL THINGS TO CONSIDER */}
          {extractedProject.thingsToConsider && extractedProject.thingsToConsider.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-1">
                <h4 className="text-xl font-extrabold font-heading text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-emerald-600" />
                  <span>Critical Things to Consider &amp; Statutory Approvals</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Key engineering, legal, and planning factors required before construction starts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {extractedProject.thingsToConsider.map((item, cIdx) => (
                  <div key={cIdx} className="p-5 rounded-2xl bg-[#FAFAF9] border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {item.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.impactLevel === 'high'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.impactLevel.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <h5 className="font-extrabold text-sm text-slate-900">{item.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* F. COMMERCIAL CONVERSION ACTION BAR */}
          <div className="p-8 sm:p-10 rounded-3xl bg-amber-50/70 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <Badge variant="brand" size="sm" className="bg-[#FFAA4F] text-slate-950 font-bold text-xs">
                Next Steps with ST CONTRACTORS
              </Badge>
              <h4 className="text-2xl font-extrabold font-heading text-slate-900">
                Ready to turn this scope into an itemised quote?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                Carry your custom scope directly into our Project Planner, test in our 3D Visualiser Studio, or book a site consultation with our senior surveying team.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
              <Button
                onClick={handleTransferToPlanner}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-sm px-8 py-4 shadow-md"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Transfer to Live Planner
              </Button>
              <Button
                href="/contact?type=consultation"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-slate-800 border-slate-300 hover:bg-white text-xs sm:text-sm px-6 py-4"
              >
                Book Site Consultation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
