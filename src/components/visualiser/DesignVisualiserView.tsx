'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

export const DesignVisualiserView: React.FC = () => {
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

  // Calculate live dynamic prices and BOQ metrics
  const glazingDelta = GLAZING_PRICE_MODIFIERS[selectedGlazing]?.deltaPerM2 || 0;
  const flooringDelta = FLOORING_PRICE_MODIFIERS[selectedFlooring]?.deltaPerM2 || 0;
  const baseRatePerM2 = selectedConcept.indicativeCostPerM2;
  const effectiveCostPerM2 = baseRatePerM2 + glazingDelta + flooringDelta;

  const estimatedMinCost = Math.round(floorAreaM2 * effectiveCostPerM2 * 0.92);
  const estimatedMaxCost = Math.round(floorAreaM2 * effectiveCostPerM2 * 1.15);

  // Calculated Bill of Quantities (BOQ) metrics
  const estimatedSteelKg = Math.round(floorAreaM2 * 28 + 350);
  const estimatedExcavationM3 = Number((floorAreaM2 * 0.85).toFixed(1));
  const estimatedConcreteM3 = Number((floorAreaM2 * 0.38).toFixed(1));
  const estimatedGlassSpanM = Number((Math.sqrt(floorAreaM2) * 1.2).toFixed(1));
  const estimatedWeeksMin = Math.max(8, Math.round(floorAreaM2 * 0.28 + 4));
  const estimatedWeeksMax = estimatedWeeksMin + 3;

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

  const handlePrint = () => {
    trackEvent('visualiser_print_spec', { concept_id: selectedConcept.id });
    window.print();
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
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen text-slate-900">
      <Container>
        {/* 1. PURPOSE-DRIVEN HEADER */}
        <div className="max-w-4xl text-left space-y-3 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" className="bg-amber-100 text-amber-900 border-amber-300 text-xs font-bold">
              <Compass className="h-3.5 w-3.5 mr-1" />
              Interactive Architectural Feasibility &amp; Cost Studio
            </Badge>
            <span className="text-xs text-slate-500 font-medium">
              Verified London Builder &amp; Quantity Surveyor Engine
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-heading tracking-tight">
            Design Your Project, Calculate Structural Scope &amp; Instant Costs
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Choose an architectural style, adjust floor area dimensions, and configure bespoke glazing and finishes. Inspect live structural steel requirements, excavation volumes, statutory planning rules, and indicative London build costs.
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

        {/* 3. MAIN INTERACTIVE STUDIO WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Visual Showcase, Perspective Switcher & BOQ Metrics */}
          <div className="lg:col-span-7 space-y-6">
            {/* Perspective View Switcher Toolbar */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[11px] font-bold text-slate-400 uppercase px-2 hidden sm:inline">Perspective:</span>
                <button
                  onClick={() => setActivePerspective('exterior')}
                  className={clsx(
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                    activePerspective === 'exterior' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Exterior Architecture</span>
                </button>
                <button
                  onClick={() => setActivePerspective('interior')}
                  className={clsx(
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                    activePerspective === 'interior' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Interior Open-Plan</span>
                </button>
                <button
                  onClick={() => setActivePerspective('structural_cad')}
                  className={clsx(
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                    activePerspective === 'structural_cad' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>Structural CAD Layout</span>
                </button>
              </div>

              <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-300 font-mono hidden md:inline-flex">
                {floorAreaM2} m² ({Math.round(floorAreaM2 * 10.764)} sq ft)
              </Badge>
            </div>

            {/* Interactive Image Showcase Box */}
            <Card className="overflow-hidden rounded-3xl border-slate-200 shadow-lg bg-white relative p-0">
              <div className="relative h-80 sm:h-[440px] w-full bg-slate-900">
                <Image
                  src={getPerspectiveImage()}
                  alt={selectedConcept.name}
                  fill
                  className="object-cover transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Perspective Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="brand" className="bg-slate-900/80 backdrop-blur-md text-amber-400 border border-slate-700 text-[10px] uppercase font-bold">
                    {activePerspective === 'structural_cad' ? '📐 Engineering CAD View' : activePerspective === 'interior' ? '🛋️ Living Space View' : '📸 External View'}
                  </Badge>
                </div>

                {/* Bottom Overlay Info with High Contrast */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand" className="bg-amber-500 text-slate-900 font-extrabold text-[10px] uppercase">
                      {selectedConcept.style.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-slate-300 font-medium">
                      Est. Timeline: {estimatedWeeksMin}–{estimatedWeeksMax} Weeks
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">{selectedConcept.name}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 max-w-xl">{selectedConcept.tagline}</p>
                </div>
              </div>

              {/* Spec Overview Quick Bar */}
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

            {/* LIVE BILL OF QUANTITIES (BOQ) BREAKDOWN */}
            <Card className="p-6 bg-white border-slate-200 rounded-3xl space-y-4 shadow-xs text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Hammer className="h-5 w-5 text-amber-600" />
                  <h3 className="text-base font-bold font-heading text-slate-900">
                    Calculated Bill of Quantities &amp; Trade Scope ({floorAreaM2} m²)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">BS 8110 / Eurocode 3 Spec</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Structural Steel</span>
                  <strong className="text-slate-900 text-sm block font-mono">~{estimatedSteelKg} kg</strong>
                  <span className="text-[10px] text-slate-500">Universal Columns &amp; Goalposts</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Soil Excavation</span>
                  <strong className="text-slate-900 text-sm block font-mono">{estimatedExcavationM3} m³</strong>
                  <span className="text-[10px] text-slate-500">London clay trench disposal</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Ready-Mix Concrete</span>
                  <strong className="text-slate-900 text-sm block font-mono">{estimatedConcreteM3} m³</strong>
                  <span className="text-[10px] text-slate-500">C25/30 foundation pour</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Glazing Span</span>
                  <strong className="text-slate-900 text-sm block font-mono">{estimatedGlassSpanM} m linear</strong>
                  <span className="text-[10px] text-slate-500">Low-E Solar 1.1 W/m²K</span>
                </div>
              </div>
            </Card>

            {/* LONDON PROPERTY ERA & STATUTORY RULES */}
            <Card className="p-6 bg-white border-slate-200 rounded-3xl space-y-4 shadow-xs text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-base font-bold font-heading text-slate-900">
                    London Property Era Feasibility Check
                  </h3>
                </div>

                {/* Era Selector Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Your Property:</span>
                  <select
                    value={propertyEra}
                    onChange={(e) => setPropertyEra(e.target.value as PropertyEra)}
                    className="text-xs font-bold bg-slate-100 border border-slate-300 rounded-xl p-1.5 text-slate-800 focus:outline-none"
                  >
                    <option value="victorian">Victorian (1837–1901)</option>
                    <option value="edwardian">Edwardian (1901–1910)</option>
                    <option value="1930s">1930s Semi-Detached</option>
                    <option value="modern">Post-War / Modern</option>
                  </select>
                </div>
              </div>

              {/* Era specific rules */}
              <div className="space-y-2 text-xs text-slate-700">
                {PROPERTY_ERA_RULES[propertyEra].rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Interactive Customizer Controls & Action Hub */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 sm:p-7 bg-white border-slate-200 rounded-3xl shadow-md space-y-6 text-left sticky top-24">
              <div>
                <h2 className="text-lg font-bold font-heading text-slate-900">
                  Customise Specification
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fine-tune floor area, architectural glazing, and subfloor finishes.
                </p>
              </div>

              {/* 1. Floor Area Slider */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Ruler className="h-4 w-4 text-amber-600" />
                    Planned Floor Area
                  </label>
                  <span className="text-sm font-extrabold font-mono text-slate-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg">
                    {floorAreaM2} m² ({Math.round(floorAreaM2 * 10.764)} sq ft)
                  </span>
                </div>

                <input
                  type="range"
                  min="15"
                  max="65"
                  step="1"
                  value={floorAreaM2}
                  onChange={(e) => setFloorAreaM2(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>15 m² (Side Return)</span>
                  <span>35 m² (Rear Extension)</span>
                  <span>65 m² (Wrap-around)</span>
                </div>
              </div>

              {/* 2. Glazing Specification Selector */}
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

              {/* 4. Live Cost Estimation Box & Action Buttons */}
              <div className="p-6 rounded-3xl bg-slate-950 text-white space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Live Indicative Build Range
                  </span>
                  <Badge variant="brand" className="bg-emerald-500 text-emerald-950 font-extrabold text-[10px]">
                    2026 London Verified
                  </Badge>
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  £{estimatedMinCost.toLocaleString()} – £{estimatedMaxCost.toLocaleString()}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Includes ~{estimatedSteelKg}kg RSJ steelwork, architectural glazing, first/second fix MEP, finishes, project management, and 10% contingency.
                </p>

                {/* 3 Explicit Working Buttons */}
                <div className="pt-2 space-y-2.5">
                  {/* Primary Button */}
                  <button
                    onClick={handleSaveToProject}
                    className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{savedSuccess ? 'Saved to Project Profile! ✓' : 'Save to My Project Dashboard'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Secondary Button */}
                  <button
                    onClick={() => setIsConsultationModalOpen(true)}
                    className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="h-4 w-4 text-amber-400" />
                    <span>Book Free Surveyor Feasibility Visit</span>
                  </button>

                  {/* Tertiary Action */}
                  <button
                    onClick={handlePrint}
                    className="w-full bg-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-[11px] font-semibold py-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print / Save Specification Sheet (PDF)</span>
                  </button>
                </div>

                {savedSuccess && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
                    <span>Added to your project dashboard!</span>
                    <Link href="/my-project" className="text-white font-bold underline">
                      View Dashboard →
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Container>

      {/* SURVEYOR FEASIBILITY BOOKING MODAL */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <Badge variant="brand" className="bg-amber-100 text-amber-900 text-xs mb-1">
                  Senior Estimator Feasibility Review
                </Badge>
                <h3 className="text-xl font-bold font-heading text-slate-900">
                  Book Free Site Feasibility Visit
                </h3>
              </div>
              <button
                onClick={() => setIsConsultationModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {consultationSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900 font-heading">Consultation Requested!</h4>
                <p className="text-xs text-slate-600">
                  Our senior estimator will contact you within 2 business hours to confirm your site review for <strong>{selectedConcept.name}</strong>.
                </p>
                <Button
                  onClick={() => {
                    setIsConsultationModalOpen(false);
                    setConsultationSubmitted(false);
                  }}
                  variant="primary"
                  size="sm"
                  className="bg-amber-500 text-slate-950 font-bold"
                >
                  Close &amp; Return to Visualiser
                </Button>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Helena Vance"
                    value={consultationForm.name}
                    onChange={(e) => setConsultationForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="07123 456789"
                      value={consultationForm.phone}
                      onChange={(e) => setConsultationForm((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">London Postcode</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. W4 1PR"
                      value={consultationForm.postcode}
                      onChange={(e) => setConsultationForm((p) => ({ ...p, postcode: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="helena@example.co.uk"
                    value={consultationForm.email}
                    onChange={(e) => setConsultationForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Project Notes / Questions (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Need advice on Party Wall notices and Thames Water sewer clearance..."
                    value={consultationForm.notes}
                    onChange={(e) => setConsultationForm((p) => ({ ...p, notes: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px]">
                  <strong>Selected Specification:</strong> {selectedConcept.name} ({floorAreaM2}m²), Est. £{estimatedMinCost.toLocaleString()} – £{estimatedMaxCost.toLocaleString()}.
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm py-3 rounded-xl transition-all shadow-md cursor-pointer mt-2"
                >
                  Confirm Free Site Feasibility Booking →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
