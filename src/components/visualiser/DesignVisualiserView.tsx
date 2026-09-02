'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  VisualiserConcept,
  GlazingOption,
  FlooringOption,
} from '@/types/visualiser';
import {
  VISUALISER_CONCEPTS,
  GLAZING_PRICE_MODIFIERS,
  FLOORING_PRICE_MODIFIERS,
} from '@/lib/visualiser/config';
import {
  ExtractedProject,
  CustomSpecificationOption,
  ThingToConsider,
  TradePhaseBreakdown,
} from '@/lib/assistant/types';
import { getActiveProjectProfile, updateActiveProjectProfile } from '@/lib/planner/project-sync';
import { trackEvent } from '@/lib/analytics';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Building,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Printer,
  Calendar,
  Eye,
  Compass,
  FileText,
  Clock,
  Ruler,
  Check,
  Flame,
  ChevronRight,
  Phone,
  Hammer,
  Sliders,
  FileCheck2,
  HelpCircle,
  PoundSterling,
} from 'lucide-react';
import { clsx } from 'clsx';

type ViewPerspective = 'exterior' | 'interior' | 'structural_cad';
type PropertyEra = 'victorian' | 'edwardian' | '1930s' | 'modern';

const PROPERTY_ERA_RULES: Record<PropertyEra, { label: string; rules: string[] }> = {
  victorian: {
    label: 'Victorian (1837–1901)',
    rules: [
      'Party Wall Act 1996: Adjoining neighbour notice mandatory for shared chimney flues and excavations within 3m.',
      'Subfloor: Suspended timber joists require breathable insulation and air-brick cross-ventilation maintenance.',
      'Foundations: Shallow corbelled brick footings; underpinning or stepped concrete trench required when dropping floor level.',
    ],
  },
  edwardian: {
    label: 'Edwardian (1901–1910)',
    rules: [
      'Wider structural spans: Requires high-load RSJ goalposts for open-plan kitchen/diner knockthroughs.',
      'Thames Water: Build-over agreement required if rear drainage runs across side return boundary.',
      'Lime Mortar: External facing brickwork should use hydraulic lime to prevent frost spalling.',
    ],
  },
  '1930s': {
    label: '1930s Semi-Detached',
    rules: [
      'Cavity Walls: Full insulation and cavity trays required at new roof and wall abutments.',
      'Permitted Development: Rear extension depth limits (up to 4m for single storey detached/semi).',
      'Shared Drainage: Manhole / inspection chamber relocation requires foul-water re-routing.',
    ],
  },
  modern: {
    label: 'Post-War / Modern Home',
    rules: [
      'Thermal Performance: Full compliance with Building Regs Part L (Target U-value 0.15 W/m²K on walls).',
      'Floor Slab: Suspended beam and block or reinforced concrete raft foundations.',
      'Electrical: Consumer unit surge protection and dedicated sub-panel for high-load induction & heat pumps.',
    ],
  },
};

const SAMPLE_PROMPTS = [
  {
    label: '6m Rear Extension with Crittall & RSJ',
    text: 'I want to build a 6m rear kitchen extension with industrial black steel Crittall doors, knock down the dividing wall with an RSJ beam, wet underfloor heating, oak herringbone flooring, and a quartz kitchen island.',
  },
  {
    label: 'Frameless Glass Side Return Infill',
    text: 'Victorian side return extension with a frameless structural glass roof box, polished concrete floor, and contemporary sliding glass panels to the garden.',
  },
  {
    label: 'Loft Conversion with Master Ensuite',
    text: 'Convert our semi-detached roof into a master bedroom suite with rear dormer, Juliet balcony, walk-in ensuite shower room, and Velux rooflights.',
  },
  {
    label: 'Convert Garage into Cinema & Gym',
    text: 'Turn attached garage into an acoustic cinema and fitness studio, making a new structural doorway to the hallway with a fire door, infilling the front vehicle door, and adding underfloor heating.',
  },
];

export const DesignVisualiserView: React.FC = () => {
  const searchParams = useSearchParams();

  // AI Prompt & Analysis State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<ExtractedProject | null>(null);
  const [activeSpecTier, setActiveSpecTier] = useState<string>('Architectural Premium');

  // Visualiser Interactive Studio State
  const [selectedConcept, setSelectedConcept] = useState<VisualiserConcept>(VISUALISER_CONCEPTS[0]);
  const [selectedGlazing, setSelectedGlazing] = useState<GlazingOption>(selectedConcept.glazing);
  const [selectedFlooring, setSelectedFlooring] = useState<FlooringOption>(selectedConcept.flooring);
  const [floorAreaM2, setFloorAreaM2] = useState<number>(35);
  const [activePerspective, setActivePerspective] = useState<ViewPerspective>('exterior');
  const [propertyEra, setPropertyEra] = useState<PropertyEra>('victorian');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    phone: '',
    email: '',
    postcode: 'W4 1PR',
    notes: '',
  });

  // Automatically execute if query param is passed
  useEffect(() => {
    const q = searchParams?.get('q');
    if (q && q.trim()) {
      setAiPrompt(q.trim());
      handleAiAnalyze(q.trim());
    }
  }, [searchParams]);

  const handleAiAnalyze = async (promptToUse?: string) => {
    const query = (promptToUse || aiPrompt).trim();
    if (!query) return;

    if (promptToUse) {
      setAiPrompt(promptToUse);
    }

    setIsAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch('/api/assistant/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze project description.');
      }

      const project: ExtractedProject = data.project;
      setAiAnalysis(project);

      // Dynamically synchronise Visualiser Concept & Settings based on AI interpretation
      const lower = query.toLowerCase();
      if (lower.includes('crittall') || lower.includes('industrial') || lower.includes('black steel')) {
        setSelectedConcept(VISUALISER_CONCEPTS.find((c) => c.id === 'concept-industrial-crittall') || VISUALISER_CONCEPTS[1]);
        setSelectedGlazing('crittall_steel_doors');
        setSelectedFlooring('herringbone_engineered_oak');
      } else if (lower.includes('heritage') || lower.includes('period') || lower.includes('victorian') || lower.includes('sash') || lower.includes('french door')) {
        setSelectedConcept(VISUALISER_CONCEPTS.find((c) => c.id === 'concept-heritage-period-restoration') || VISUALISER_CONCEPTS[2]);
        setSelectedGlazing('heritage_timber_french');
        setSelectedFlooring('large_porcelain_tiles');
      } else if (lower.includes('timber') || lower.includes('garden studio') || lower.includes('outbuilding') || lower.includes('annexe')) {
        setSelectedConcept(VISUALISER_CONCEPTS.find((c) => c.id === 'concept-scandi-timber') || VISUALISER_CONCEPTS[3]);
        setSelectedGlazing('slimline_aluminium_bifold');
        setSelectedFlooring('herringbone_engineered_oak');
      } else {
        setSelectedConcept(VISUALISER_CONCEPTS[0]);
        setSelectedGlazing('frameless_glass_box');
        setSelectedFlooring('large_porcelain_tiles');
      }

      // Update Area if extracted
      if (project.rooms?.[0]?.dimensions?.areaM2) {
        setFloorAreaM2(Math.round(project.rooms[0].dimensions.areaM2));
      } else if (lower.includes('6m') || lower.includes('6 m')) {
        setFloorAreaM2(36);
      } else if (lower.includes('side return') || lower.includes('garage')) {
        setFloorAreaM2(20);
      }

      trackEvent('visualiser_ai_interpreted', {
        project_type: project.projectType,
        estimated_min: project.costEstimate?.low,
        estimated_max: project.costEstimate?.high,
      });
    } catch (err: any) {
      setAiError(err.message || 'An error occurred during project interpretation. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Calculate live dynamic prices and BOQ metrics
  const glazingDelta = GLAZING_PRICE_MODIFIERS[selectedGlazing]?.deltaPerM2 || 0;
  const flooringDelta = FLOORING_PRICE_MODIFIERS[selectedFlooring]?.deltaPerM2 || 0;
  const baseRatePerM2 = selectedConcept.indicativeCostPerM2;
  const effectiveCostPerM2 = baseRatePerM2 + glazingDelta + flooringDelta;

  const estimatedMinCost = aiAnalysis?.costEstimate?.low ?? Math.round(floorAreaM2 * effectiveCostPerM2 * 0.92);
  const estimatedMaxCost = aiAnalysis?.costEstimate?.high ?? Math.round(floorAreaM2 * effectiveCostPerM2 * 1.15);

  // Calculated Bill of Quantities (BOQ) metrics
  const estimatedSteelKg = Math.round(floorAreaM2 * 28 + 350);
  const estimatedExcavationM3 = Number((floorAreaM2 * 0.85).toFixed(1));
  const estimatedConcreteM3 = Number((floorAreaM2 * 0.38).toFixed(1));
  const estimatedGlassSpanM = Number((Math.sqrt(floorAreaM2) * 1.2).toFixed(1));
  const estimatedWeeksMin = aiAnalysis?.estimatedTimelineWeeks?.min ?? Math.max(8, Math.round(floorAreaM2 * 0.28 + 4));
  const estimatedWeeksMax = aiAnalysis?.estimatedTimelineWeeks?.max ?? (estimatedWeeksMin + 3);

  // Perspective Image Selection
  const getPerspectiveImage = () => {
    if (activePerspective === 'structural_cad') {
      return '/images/architectural-blueprint.jpg';
    }
    if (activePerspective === 'interior') {
      if (selectedConcept.id === 'concept-industrial-crittall') return '/images/case-studies/chiswick-kitchen.png';
      if (selectedConcept.id === 'concept-heritage-period-restoration') return '/images/case-studies/richmond-master-suite.jpg';
      return '/images/services/full-house-renovations.png';
    }
    return selectedConcept.image;
  };

  const handleConceptChange = (concept: VisualiserConcept) => {
    setSelectedConcept(concept);
    setSelectedGlazing(concept.glazing);
    setSelectedFlooring(concept.flooring);
    setSavedSuccess(false);
    trackEvent('visualiser_concept_selected', {
      concept_id: concept.id,
      concept_name: concept.name,
      base_rate: concept.indicativeCostPerM2,
    });
  };

  const handleSaveToProject = () => {
    const profile = getActiveProjectProfile();

    const newRoom = {
      id: `visualiser_${selectedConcept.id}_${Date.now()}`,
      roomType: (selectedConcept.category === 'garden_studio' ? 'other' : selectedConcept.category) as any,
      customName: `${selectedConcept.name} (${floorAreaM2}m²)`,
      lengthMeters: Number(Math.sqrt(floorAreaM2 * 1.3).toFixed(1)),
      widthMeters: Number((floorAreaM2 / Math.sqrt(floorAreaM2 * 1.3)).toFixed(1)),
      specificationTier: 'premium' as const,
      subtotalEstimate: {
        low: estimatedMinCost,
        expected: Math.round((estimatedMinCost + estimatedMaxCost) / 2),
        high: estimatedMaxCost,
      },
      includedWorks: [
        `Architectural Concept: ${selectedConcept.name}`,
        `Glazing: ${GLAZING_PRICE_MODIFIERS[selectedGlazing]?.label || selectedGlazing}`,
        `Flooring: ${FLOORING_PRICE_MODIFIERS[selectedFlooring]?.label || selectedFlooring}`,
        `Estimated Structural Steel: ~${estimatedSteelKg} kg RSJ frame`,
        `Estimated Groundworks: ${estimatedExcavationM3} m³ excavation + ${estimatedConcreteM3} m³ concrete`,
        `Property Era Context: ${PROPERTY_ERA_RULES[propertyEra].label}`,
      ],
    };

    const updatedRooms = [...profile.rooms];
    const existingIndex = updatedRooms.findIndex((r) => r.customName.includes(selectedConcept.name));
    if (existingIndex >= 0) {
      updatedRooms[existingIndex] = newRoom;
    } else {
      updatedRooms.push(newRoom);
    }

    const totalEstimateMin = updatedRooms.reduce((sum, r) => sum + (r.subtotalEstimate?.low || 0), 0);
    const totalEstimateMax = updatedRooms.reduce((sum, r) => sum + (r.subtotalEstimate?.high || 0), 0);

    updateActiveProjectProfile({
      projectTypes: [
        selectedConcept.category === 'garden_studio'
          ? 'other'
          : (selectedConcept.category as any),
      ],
      propertyEra: propertyEra as any,
      rooms: updatedRooms,
      estimate: {
        low: Math.round(totalEstimateMin),
        expected: Math.round((totalEstimateMin + totalEstimateMax) / 2),
        high: Math.round(totalEstimateMax),
        currency: 'GBP',
        breakdown: {
          materialsTotal: Math.round(totalEstimateMin * 0.42),
          labourTotal: Math.round(totalEstimateMin * 0.48),
          wasteAndDisposal: Math.round(totalEstimateMin * 0.04),
          structuralSteelAllowance: Math.round(totalEstimateMin * 0.06),
          prelimsAndManagement: Math.round(totalEstimateMin * 0.03),
          contingency: Math.round(totalEstimateMin * 0.08),
        },
      },
    });

    setSavedSuccess(true);
    trackEvent('visualiser_saved_to_project', {
      concept_id: selectedConcept.id,
      floor_area: floorAreaM2,
      estimated_min: estimatedMinCost,
      estimated_max: estimatedMaxCost,
    });
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputData: {
            projectType: selectedConcept.category === 'garden_studio' ? 'other' : selectedConcept.category,
            postcode: consultationForm.postcode,
            propertyAge: propertyEra,
            finishLevel: 'premium',
            selectedAreas: [
              {
                id: selectedConcept.id,
                name: selectedConcept.name,
                sizeCategory: 'medium',
                lengthMeters: Math.sqrt(floorAreaM2),
                widthMeters: Math.sqrt(floorAreaM2),
              },
            ],
          },
          contact: {
            firstName: consultationForm.name.split(' ')[0] || consultationForm.name,
            lastName: consultationForm.name.split(' ').slice(1).join(' ') || 'Client',
            phone: consultationForm.phone,
            email: consultationForm.email,
            notes: `Visualiser Config: ${selectedConcept.name} (${floorAreaM2}m²), Glazing: ${selectedGlazing}, Flooring: ${selectedFlooring}. ${consultationForm.notes}`,
            consultationType: 'site_visit',
          },
          source: 'Architectural Feasibility Studio (/visualiser)',
        }),
      });
      setConsultationSubmitted(true);
    } catch (err) {
      console.error('Error submitting consultation:', err);
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-[#F4F5F7] min-h-screen text-slate-900 text-left">
      <Container>
        <div className="max-w-6xl mx-auto space-y-10">
          {/* 1. HEADER */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" className="bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40 text-xs font-bold">
                <Compass className="h-3.5 w-3.5 mr-1 text-[#D97706]" />
                Interactive Architectural Feasibility &amp; Cost Studio
              </Badge>
              <span className="text-xs text-slate-500 font-medium">
                Verified London Builder &amp; Quantity Surveyor Engine
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-heading tracking-tight">
              Design Your Project, Calculate Structural Scope &amp; Instant Costs
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-4xl">
              Type what you are building below in plain English, or configure an architectural style manually. Our engine interprets your scope, calculates 2026 London build prices, presents custom options, details structural steel &amp; BOQ quantities, and highlights critical statutory considerations.
            </p>
          </div>

          {/* 2. AI START QUESTION: "WHAT ARE YOU BUILDING?" */}
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
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Type any simple or complicated project message. We interpret the architectural scope, configure the 3D studio, calculate 2026 prices, provide custom specifications, and detail the necessary trades.
              </p>
            </div>

            {/* Quick Inspiration Pills */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Quick-Start Examples (Click to test):
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAiAnalyze(item.text)}
                    disabled={isAiLoading}
                    className="px-3.5 py-1.5 rounded-full bg-[#FAFAF9] hover:bg-amber-50 hover:text-[#D97706] hover:border-[#FFAA4F] border border-slate-200 text-xs font-semibold text-slate-700 transition-all text-left shadow-2xs"
                  >
                    + {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAiAnalyze();
              }}
              className="space-y-4"
            >
              <div className="relative">
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. I want to build a 6m rear kitchen extension with Crittall steel doors, knock down the dividing wall with an RSJ beam, wet underfloor heating, oak herringbone flooring, and a quartz kitchen island..."
                  className="w-full p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F] focus:border-[#FFAA4F] transition-all resize-y shadow-inner"
                  disabled={isAiLoading}
                />
                <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-400 bg-white/80 px-2 py-0.5 rounded-md">
                  {aiPrompt.length}/2000
                </div>
              </div>

              {aiError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{aiError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Instant structural &amp; pricing interpretation • London 2026 Rates</span>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  disabled={isAiLoading || !aiPrompt.trim()}
                  className="w-full sm:w-auto font-bold text-sm bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 px-8 py-3.5 shadow-md hover:shadow-amber-500/20 border border-[#E69335] transition-all"
                >
                  {isAiLoading ? 'Interpreting Scope...' : 'Interpret Scope & Calculate Costs →'}
                </Button>
              </div>
            </form>
          </div>

          {/* 3. AI INTERPRETATION RESULTS PANEL (IF GENERATED) */}
          {aiAnalysis && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <Badge variant="brand" size="sm" className="bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40 font-bold text-xs mb-2">
                      Interpreted Project Classification
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
                      {aiAnalysis.projectTypeDisplay}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleSaveToProject}
                      variant="primary"
                      size="md"
                      className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-xs px-6 py-3 shadow-md"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      {savedSuccess ? 'Saved to Dashboard ✓' : 'Save to My Dashboard'}
                    </Button>
                  </div>
                </div>

                {/* General Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    General Description of Works Needed:
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {aiAnalysis.generalDescription || aiAnalysis.summary}
                  </p>
                </div>

                {/* Indicative Cost Range */}
                <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] block">
                        Interpreted 2026 London Turnkey Cost Range:
                      </span>
                      <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tracking-tight">
                        {aiAnalysis.costEstimate?.formatted || `£${estimatedMinCost.toLocaleString()} – £${estimatedMaxCost.toLocaleString()}`}
                      </div>
                    </div>

                    <div className="text-left sm:text-right space-y-1">
                      <Badge variant="brand" size="sm" className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-xs">
                        Benchmark: {aiAnalysis.costEstimate?.benchmarkPerM2 || '£2,400 – £3,400 / m²'}
                      </Badge>
                      <div className="text-xs text-slate-500 font-medium">
                        Estimated Timeline: {aiAnalysis.estimatedTimelineWeeks.min}–{aiAnalysis.estimatedTimelineWeeks.max} Weeks
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 border-t border-amber-200/60 pt-2 font-normal">
                    {aiAnalysis.costEstimate?.notes || 'Includes structural steel RSJ, foundations, architectural glazing, first/second fix MEP, and turnkey plastering.'}
                  </p>
                </div>

                {/* Custom Specification Tiers & Options */}
                {aiAnalysis.customSpecifications && aiAnalysis.customSpecifications.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h4 className="text-lg font-extrabold font-heading text-slate-900 flex items-center gap-2">
                      <Sliders className="h-5 w-5 text-[#D97706]" />
                      <span>Custom Specification Tiers &amp; Finish Options</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {aiAnalysis.customSpecifications.map((spec, sIdx) => {
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
                                    Recommended
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

                {/* Phase-by-Phase Trade Breakdown */}
                {aiAnalysis.tradePhaseBreakdown && aiAnalysis.tradePhaseBreakdown.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h4 className="text-lg font-extrabold font-heading text-slate-900 flex items-center gap-2">
                      <Hammer className="h-5 w-5 text-[#D97706]" />
                      <span>Phase-by-Phase Trade Breakdown &amp; Sequence</span>
                    </h4>
                    <div className="space-y-3">
                      {aiAnalysis.tradePhaseBreakdown.map((phase, pIdx) => (
                        <div key={pIdx} className="p-4 sm:p-5 rounded-2xl bg-[#FAFAF9] border border-slate-200 space-y-3">
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

                {/* Things to Consider */}
                {aiAnalysis.thingsToConsider && aiAnalysis.thingsToConsider.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h4 className="text-lg font-extrabold font-heading text-slate-900 flex items-center gap-2">
                      <FileCheck2 className="h-5 w-5 text-emerald-600" />
                      <span>Key Things to Consider &amp; Statutory Approvals</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {aiAnalysis.thingsToConsider.map((item, cIdx) => (
                        <div key={cIdx} className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200 space-y-2">
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
              </div>
            </div>
          )}

          {/* 4. CONCEPT PRESET TABS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Or Choose an Architectural Concept:
            </h3>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {VISUALISER_CONCEPTS.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => handleConceptChange(concept)}
                  className={clsx(
                    'px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border',
                    selectedConcept.id === concept.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50'
                  )}
                >
                  <Building className="h-3.5 w-3.5 text-[#FFAA4F]" />
                  <span>{concept.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. MAIN INTERACTIVE STUDIO WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Visual Showcase, Perspective Switcher & BOQ Metrics */}
            <div className="lg:col-span-7 space-y-6">
              {/* Perspective Switcher Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                  Perspective:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActivePerspective('exterior')}
                    className={clsx(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                      activePerspective === 'exterior'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Exterior Architecture</span>
                  </button>
                  <button
                    onClick={() => setActivePerspective('interior')}
                    className={clsx(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                      activePerspective === 'interior'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Interior Open-Plan</span>
                  </button>
                  <button
                    onClick={() => setActivePerspective('structural_cad')}
                    className={clsx(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                      activePerspective === 'structural_cad'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>Structural CAD Layout</span>
                  </button>
                </div>
                <Badge variant="outline" className="text-slate-600 font-mono text-xs hidden sm:inline-flex">
                  {floorAreaM2} m² ({Math.round(floorAreaM2 * 10.764)} sq ft)
                </Badge>
              </div>

              {/* Main Visual Display Image */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 aspect-4/3 sm:aspect-16/10 shadow-xl group">
                <Image
                  src={getPerspectiveImage()}
                  alt={`${selectedConcept.name} - ${activePerspective} view`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[#FFAA4F] text-[11px] font-bold border border-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    {activePerspective === 'exterior' ? 'External View' : activePerspective === 'interior' ? 'Interior Spec' : 'Structural Plan'}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-10 text-white space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 text-xs font-bold">
                      {selectedConcept.style === 'contemporary_glass' ? 'Contemporary Glass' : selectedConcept.style === 'industrial_crittall' ? 'Industrial Crittall' : 'Heritage Spec'}
                    </Badge>
                    <span className="text-xs text-slate-300 font-medium">
                      Est. Timeline: {estimatedWeeksMin}–{estimatedWeeksMax} Weeks
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold font-heading leading-tight">
                    {selectedConcept.name}
                  </h2>
                  <p className="text-xs text-slate-200 line-clamp-2 max-w-xl font-normal">
                    {selectedConcept.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20 text-[11px]">
                    <div>
                      <span className="text-slate-400 block font-normal">Base Rate</span>
                      <strong className="text-white font-mono">~£{effectiveCostPerM2.toLocaleString()} / m²</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-normal">Planning Status</span>
                      <strong className="text-emerald-400">Permitted Development likely</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-normal">Party Wall</span>
                      <strong className="text-amber-300">Notices Required (3m rule)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculated Bill of Quantities (BOQ) Card */}
              <Card className="p-6 bg-white border-slate-200/90 shadow-sm rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Hammer className="h-4 w-4 text-[#D97706]" />
                    <h3 className="font-extrabold text-sm text-slate-900 font-heading">
                      Calculated Bill of Quantities &amp; Trade Scope ({floorAreaM2} m²)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">BS 8110 / Eurocode 3 Spec</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Structural Steel</span>
                    <div className="text-base font-extrabold text-slate-900 font-mono">~{estimatedSteelKg} kg</div>
                    <span className="text-[10px] text-slate-500 block">Universal Columns &amp; Goalposts</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Soil Excavation</span>
                    <div className="text-base font-extrabold text-slate-900 font-mono">{estimatedExcavationM3} m³</div>
                    <span className="text-[10px] text-slate-500 block">London clay trench disposal</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Ready-Mix Concrete</span>
                    <div className="text-base font-extrabold text-slate-900 font-mono">{estimatedConcreteM3} m³</div>
                    <span className="text-[10px] text-slate-500 block">C25/30 foundation pour</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Glazing Span</span>
                    <div className="text-base font-extrabold text-slate-900 font-mono">{estimatedGlassSpanM} m linear</div>
                    <span className="text-[10px] text-slate-500 block">Low-E Solar 1.1 W/m²K</span>
                  </div>
                </div>
              </Card>

              {/* Property Era Rules Check */}
              <Card className="p-6 bg-white border-slate-200/90 shadow-sm rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <h3 className="font-extrabold text-sm text-slate-900 font-heading">
                      London Property Era Feasibility Check
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Your Property:</span>
                    <select
                      value={propertyEra}
                      onChange={(e) => setPropertyEra(e.target.value as PropertyEra)}
                      aria-label="Select Property Era"
                      className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#FFAA4F]"
                    >
                      <option value="victorian">Victorian (1837–1901)</option>
                      <option value="edwardian">Edwardian (1901–1910)</option>
                      <option value="1930s">1930s Semi-Detached</option>
                      <option value="modern">Post-War / Modern</option>
                    </select>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-700">
                  {PROPERTY_ERA_RULES[propertyEra].rules.map((rule, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* RIGHT COLUMN: Customisation Controls, Live Price & CTAs */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="p-6 sm:p-7 bg-white border-slate-200/90 shadow-md rounded-3xl space-y-6 text-left">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                    Customise Specification
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fine-tune floor area, architectural glazing, and subfloor finishes.
                  </p>
                </div>

                {/* Slider: Floor Area */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="floor-area-slider" className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Ruler className="h-3.5 w-3.5 text-[#D97706]" />
                      <span>Planned Floor Area</span>
                    </label>
                    <span className="text-xs font-extrabold font-mono bg-amber-50 text-[#D97706] px-2.5 py-1 rounded-lg border border-amber-200">
                      {floorAreaM2} m² ({Math.round(floorAreaM2 * 10.764)} sq ft)
                    </span>
                  </div>
                  <input
                    id="floor-area-slider"
                    type="range"
                    min="15"
                    max="65"
                    step="1"
                    value={floorAreaM2}
                    onChange={(e) => setFloorAreaM2(Number(e.target.value))}
                    aria-label="Planned Floor Area in square meters"
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FFAA4F]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>15 m² (Side Return)</span>
                    <span>35 m² (Rear Extension)</span>
                    <span>65 m² (Wrap-around)</span>
                  </div>
                </div>

                {/* Glazing Specification Options */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Architectural Glazing Specification
                  </span>
                  <div className="space-y-1.5">
                    {Object.entries(GLAZING_PRICE_MODIFIERS).map(([key, opt]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedGlazing(key as GlazingOption)}
                        className={clsx(
                          'w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer',
                          selectedGlazing === key
                            ? 'border-[#FFAA4F] bg-amber-50/60 font-bold text-slate-900 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        )}
                      >
                        <span>{opt.label}</span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {opt.deltaPerM2 > 0 ? `+£${opt.deltaPerM2}/m²` : opt.deltaPerM2 < 0 ? `-£${Math.abs(opt.deltaPerM2)}/m²` : 'Included'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flooring Specification Options */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Flooring &amp; Subfloor Finish
                  </span>
                  <div className="space-y-1.5">
                    {Object.entries(FLOORING_PRICE_MODIFIERS).map(([key, opt]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedFlooring(key as FlooringOption)}
                        className={clsx(
                          'w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer',
                          selectedFlooring === key
                            ? 'border-[#FFAA4F] bg-amber-50/60 font-bold text-slate-900 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        )}
                      >
                        <span>{opt.label}</span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {opt.deltaPerM2 > 0 ? `+£${opt.deltaPerM2}/m²` : 'Included'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* LIVE INDICATIVE BUILD RANGE BOX */}
                <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Live Indicative Build Range
                    </span>
                    <Badge variant="brand" className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold">
                      2026 London Verified
                    </Badge>
                  </div>

                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                    £{estimatedMinCost.toLocaleString()} – £{estimatedMaxCost.toLocaleString()}
                  </div>

                  <p className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 leading-relaxed">
                    Includes ~{estimatedSteelKg}kg RSJ steelwork, architectural glazing, first/second fix MEP, finishes, project management, and 10% contingency.
                  </p>

                  <div className="pt-2 space-y-2">
                    <Button
                      onClick={handleSaveToProject}
                      variant="primary"
                      size="lg"
                      className="w-full bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-xs py-3.5 shadow-md border border-[#E69335]"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      {savedSuccess ? 'Saved to Project Profile ✓' : 'Save to My Project Dashboard'}
                    </Button>

                    <Button
                      onClick={() => setIsConsultationModalOpen(true)}
                      variant="outline"
                      size="lg"
                      className="w-full text-white border-slate-700 hover:bg-slate-900 text-xs py-3.5"
                      leftIcon={<Calendar className="h-4 w-4" />}
                    >
                      Book Free Surveyor Feasibility Visit
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Container>

      {/* CONSULTATION BOOKING MODAL */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl text-left space-y-6 relative">
            <button
              onClick={() => setIsConsultationModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              aria-label="Close modal"
            >
              ✕
            </button>

            {!consultationSubmitted ? (
              <form onSubmit={handleConsultationSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Badge variant="brand" className="bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40 text-xs font-bold">
                    Free On-Site Architectural Feasibility
                  </Badge>
                  <h3 className="text-xl font-bold font-heading text-slate-900">
                    Book Site Feasibility Consultation
                  </h3>
                  <p className="text-xs text-slate-600">
                    A Senior Quantity Surveyor &amp; Structural Builder will inspect your property, verify load paths, and provide a fixed-price quotation.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{selectedConcept.name} ({floorAreaM2} m²)</div>
                  <div className="text-slate-500">Estimated Guide: £{estimatedMinCost.toLocaleString()} – £{estimatedMaxCost.toLocaleString()}</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={consultationForm.name}
                      onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#FFAA4F]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={consultationForm.phone}
                        onChange={(e) => setConsultationForm({ ...consultationForm, phone: e.target.value })}
                        placeholder="07123 456789"
                        className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#FFAA4F]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Property Postcode</label>
                      <input
                        type="text"
                        required
                        value={consultationForm.postcode}
                        onChange={(e) => setConsultationForm({ ...consultationForm, postcode: e.target.value })}
                        placeholder="W4 1PR"
                        className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#FFAA4F]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={consultationForm.email}
                      onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
                      placeholder="sarah@example.com"
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#FFAA4F]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-xs py-3.5 shadow-md border border-[#E69335]"
                >
                  Confirm Site Consultation Booking →
                </Button>
              </form>
            ) : (
              <div className="py-6 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Feasibility Request Confirmed
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Our Senior Estimating Director will review your specifications ({selectedConcept.name}, ~{floorAreaM2}m²) and call you within 2 business hours.
                </p>
                <Button
                  onClick={() => {
                    setIsConsultationModalOpen(false);
                    setConsultationSubmitted(false);
                  }}
                  variant="outline"
                  size="md"
                  className="mt-4"
                >
                  Close &amp; Return to Visualiser
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
