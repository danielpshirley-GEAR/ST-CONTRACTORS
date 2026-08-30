'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import {
  VISUALISER_CONCEPTS,
  GLAZING_PRICE_MODIFIERS,
  FLOORING_PRICE_MODIFIERS,
} from '@/lib/visualiser/config';
import { VisualiserConcept, GlazingOption, FlooringOption } from '@/types/visualiser';
import { getActiveProjectProfile, updateActiveProjectProfile } from '@/lib/planner/project-sync';
import { trackEvent } from '@/lib/analytics';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Maximize2,
  Clock,
  PoundSterling,
  Calendar,
  Building,
  Info,
} from 'lucide-react';
import { clsx } from 'clsx';

export const DesignVisualiserView: React.FC = () => {
  const router = useRouter();
  const [selectedConcept, setSelectedConcept] = useState<VisualiserConcept>(VISUALISER_CONCEPTS[0]);
  const [selectedGlazing, setSelectedGlazing] = useState<GlazingOption>(selectedConcept.glazing);
  const [selectedFlooring, setSelectedFlooring] = useState<FlooringOption>(selectedConcept.flooring);
  const [roomAreaM2, setRoomAreaM2] = useState<number>(30);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Handle switching concept preset
  const handleConceptChange = (concept: VisualiserConcept) => {
    setSelectedConcept(concept);
    setSelectedGlazing(concept.glazing);
    setSelectedFlooring(concept.flooring);
    setSavedSuccess(false);

    trackEvent('calculator_field_changed', {
      concept_id: concept.id,
      concept_name: concept.name,
    });
  };

  // Dynamic cost calculation based on concept base cost + glazing delta + flooring delta * area
  const glazingDelta = GLAZING_PRICE_MODIFIERS[selectedGlazing]?.deltaPerM2 || 0;
  const flooringDelta = FLOORING_PRICE_MODIFIERS[selectedFlooring]?.deltaPerM2 || 0;
  const effectiveCostPerM2 = selectedConcept.indicativeCostPerM2 + glazingDelta + flooringDelta;

  const estimatedMinCost = Math.round(effectiveCostPerM2 * roomAreaM2 * 0.9);
  const estimatedMaxCost = Math.round(effectiveCostPerM2 * roomAreaM2 * 1.15);

  // Sync to Unified Project Profile
  const handleSaveToProject = () => {
    const profile = getActiveProjectProfile();
    const updatedRooms = [...profile.rooms];
    
    const roomTypeMapped =
      selectedConcept.category === 'extension'
        ? 'living_dining'
        : selectedConcept.category === 'kitchen'
        ? 'kitchen'
        : selectedConcept.category === 'loft'
        ? 'loft'
        : selectedConcept.category === 'bathroom'
        ? 'bathroom'
        : 'other';

    const newRoom = {
      id: `room-vis-${Date.now()}`,
      roomType: roomTypeMapped as any,
      customName: selectedConcept.name,
      lengthMeters: Math.round(Math.sqrt(roomAreaM2) * 1.2 * 10) / 10,
      widthMeters: Math.round((roomAreaM2 / (Math.sqrt(roomAreaM2) * 1.2)) * 10) / 10,
      areaSqM: roomAreaM2,
      specificationTier: 'premium' as const,
      includedWorks: [
        'Demolition & Structural Openings',
        'Structural Steel (RSJs)',
        GLAZING_PRICE_MODIFIERS[selectedGlazing]?.label || 'Architectural Glazing',
        FLOORING_PRICE_MODIFIERS[selectedFlooring]?.label || 'Premium Flooring',
        'First & Second Fix MEP',
        'Plastering & Decoration',
      ],
      subtotalEstimate: {
        low: estimatedMinCost,
        expected: Math.round((estimatedMinCost + estimatedMaxCost) / 2),
        high: estimatedMaxCost,
      },
    };

    const existingIndex = updatedRooms.findIndex((r) => r.customName === selectedConcept.name);
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

    trackEvent('quote_saved', {
      concept_id: selectedConcept.id,
      estimated_min: estimatedMinCost,
      estimated_max: estimatedMaxCost,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      router.push('/my-project');
    }, 800);
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50 text-slate-900 min-h-screen text-left">
      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'AI Design Visualiser' },
          ]}
          className="mb-8 text-slate-500"
        />

        {/* 1. HEADER */}
        <div className="max-w-4xl mb-10 space-y-3">
          <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold text-xs">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Interactive Architectural Explorer
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 tracking-tight">
            Explore Architectural Styles &amp; Real Construction Costs
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Configure architectural styles, structural glazing, and bespoke flooring for your London home. Inspect live price deltas and structural feasibility rules verified by our senior quantity surveyors.
          </p>
        </div>

        {/* 2. PRESET CONCEPT TABS */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8">
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

        {/* 3. MAIN INTERACTIVE VISUALISER WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Showcase & Surveyor Notes */}
          <div className="lg:col-span-7 space-y-6">
            {/* Image Box with Spec Badges */}
            <Card className="overflow-hidden rounded-3xl border-slate-200 shadow-lg bg-white relative p-0">
              <div className="relative h-80 sm:h-[420px] w-full bg-slate-900">
                <Image
                  src={selectedConcept.image}
                  alt={selectedConcept.name}
                  fill
                  className="object-cover transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <Badge variant="brand" className="bg-amber-500 text-slate-950 font-bold text-[10px] uppercase">
                    {selectedConcept.style.replace('_', ' ')}
                  </Badge>
                  <h3 className="text-lg sm:text-xl font-bold font-heading">{selectedConcept.name}</h3>
                  <p className="text-xs text-slate-200 line-clamp-2">{selectedConcept.tagline}</p>
                </div>
              </div>

              {/* Spec Overview Bar */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs border-t border-slate-800">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Base Rate</span>
                  <strong className="text-amber-400 text-sm">~£{effectiveCostPerM2.toLocaleString()} / m²</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Planning Status</span>
                  <span className="text-emerald-400 font-medium">{selectedConcept.statutoryConsiderations.planningStatus}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Party Wall</span>
                  <span className={selectedConcept.statutoryConsiderations.partyWallRequired ? 'text-amber-400' : 'text-slate-300'}>
                    {selectedConcept.statutoryConsiderations.partyWallRequired ? 'Notices Required (3m rule)' : 'Not Required'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Surveyor & Structural Feasibility Notes */}
            <Card className="p-6 bg-white border-slate-200 rounded-3xl space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold font-heading text-slate-900">
                  Senior Surveyor Feasibility &amp; Structural Checklist
                </h3>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                {selectedConcept.structuralNotes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Building Control Compliance:</strong> Fully compliant with England Approved Documents {selectedConcept.statutoryConsiderations.buildingRegsPart.join(', ')}.
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column: Interactive Material Configurator & Live Price */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 bg-white border-slate-200 rounded-3xl shadow-md space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Customise Specification
                </h3>
                <p className="text-xs text-slate-500">
                  Fine-tune architectural glazing and flooring options.
                </p>
              </div>

              {/* 1. Floor Area Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <label className="text-slate-800 flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-amber-500" /> Planned Floor Area
                  </label>
                  <span className="font-mono text-amber-600 text-sm bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    {roomAreaM2} m² ({Math.round(roomAreaM2 * 10.764)} sq ft)
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={65}
                  step={1}
                  value={roomAreaM2}
                  onChange={(e) => setRoomAreaM2(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>15 m² (Small side return)</span>
                  <span>35 m² (Medium)</span>
                  <span>65 m² (Full wrap-around)</span>
                </div>
              </div>

              {/* 2. Glazing Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Architectural Glazing Specification
                </label>
                <div className="space-y-2">
                  {Object.entries(GLAZING_PRICE_MODIFIERS).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedGlazing(key as GlazingOption)}
                      className={clsx(
                        'w-full p-3 rounded-2xl text-left text-xs transition-all border flex items-center justify-between cursor-pointer',
                        selectedGlazing === key
                          ? 'border-amber-500 bg-amber-50/70 text-slate-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <span className="text-xs">{item.label}</span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {item.deltaPerM2 > 0 ? `+£${item.deltaPerM2}/m²` : 'Included'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Flooring Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Flooring &amp; Subfloor Finish
                </label>
                <div className="space-y-2">
                  {Object.entries(FLOORING_PRICE_MODIFIERS).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedFlooring(key as FlooringOption)}
                      className={clsx(
                        'w-full p-3 rounded-2xl text-left text-xs transition-all border flex items-center justify-between cursor-pointer',
                        selectedFlooring === key
                          ? 'border-amber-500 bg-amber-50/70 text-slate-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <span className="text-xs">{item.label}</span>
                      <span className="text-[11px] font-mono text-slate-500">
                        +£{item.deltaPerM2}/m²
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Live Cost Estimation Box */}
              <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Live Indicative Build Range
                  </span>
                  <Badge variant="brand" className="bg-emerald-500 text-slate-950 font-extrabold text-[10px]">
                    2026 London Verified
                  </Badge>
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  £{estimatedMinCost.toLocaleString()} – £{estimatedMaxCost.toLocaleString()}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Includes structural steelwork, architectural glazing, first/second fix MEP, finishes, site management, and 10% contingency.
                </p>

                <div className="pt-2 space-y-2">
                  <Button
                    onClick={handleSaveToProject}
                    variant="primary"
                    size="lg"
                    className="w-full bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-xs sm:text-sm py-3.5 justify-center shadow-lg"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    {savedSuccess ? 'Saved to Project Profile! ✓' : 'Save Concept to My Project Dashboard →'}
                  </Button>

                  <Button
                    href="/contact?type=consultation"
                    variant="outline"
                    size="sm"
                    className="w-full text-white border-slate-700 hover:bg-slate-800 text-xs py-2.5"
                  >
                    Book Free Feasibility Review with Estimator
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};
