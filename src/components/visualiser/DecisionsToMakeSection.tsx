'use client';

import React from 'react';
import { ProjectCategoryType } from '@/types/visualiser-scope';
import { HelpCircle, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';

interface DecisionsToMakeSectionProps {
  projectTypes: ProjectCategoryType[];
  briefText: string;
}

interface DecisionItem {
  title: string;
  question: string;
  impact: string;
  options: string[];
  recommendedOption: string;
}

export function DecisionsToMakeSection({
  projectTypes,
  briefText,
}: DecisionsToMakeSectionProps) {
  const lower = (briefText || '').toLowerCase();
  const isGarageConversion =
    projectTypes.includes('garage-conversion') ||
    lower.includes('garage conversion') ||
    (lower.includes('convert') && lower.includes('garage'));

  const isGarageDoor = !isGarageConversion && ((lower.includes('garage') && lower.includes('door')) || (lower.includes('door') && lower.includes('hallway')));
  const isBathroom = projectTypes.includes('bathroom-renovation') || lower.includes('bath') || lower.includes('shower');
  const isExtension = projectTypes.includes('extension') || lower.includes('extension');

  let decisions: DecisionItem[] = [];

  if (isGarageConversion) {
    decisions = [
      {
        title: 'Frontage Opening Design',
        question: 'How would you like the former garage door opening to look externally?',
        impact: 'Affects external brickwork matching, daylight levels, and planning rules under Permitted Development.',
        options: ['Cavity wall with matching brickwork & standard window', 'Full-height architectural glass / French doors', 'Retain external garage door appearance'],
        recommendedOption: 'Cavity wall with matching brickwork & standard window',
      },
      {
        title: 'Heating Integration Method',
        question: 'Should the converted room connect to your boiler or use independent heating?',
        impact: 'Plumbing into central heating offers the lowest running cost; electric underfloor provides independent zoned control.',
        options: ['Tie into existing combi boiler central heating with panel radiator', 'Electric underfloor heating mat beneath tiles/LVT', 'Wall-mounted slimline electric convection heater'],
        recommendedOption: 'Central heating radiator tied to existing combi boiler',
      },
      {
        title: 'Ceiling Acoustic Specification',
        question: 'Do you require enhanced sound insulation in the ceiling?',
        impact: 'Integral garages with bedrooms above benefit significantly from acoustic rockwool to isolate footfall noise.',
        options: ['High-density acoustic rockwool + resilient sound bars', 'Standard thermal fiberglass quilt'],
        recommendedOption: 'High-density acoustic rockwool with fireline plasterboard',
      },
      {
        title: 'Finished Floor Surface',
        question: 'What floor covering best suits your intended daily room use?',
        impact: 'Affects floor build-up height, screed depth, and underfloor thermal comfort.',
        options: ['Luxury Vinyl Tile (LVT / Karndean)', 'Engineered European Oak', 'Commercial hardwearing laminate'],
        recommendedOption: 'Luxury Vinyl Tile (LVT) with acoustic underlay',
      },
    ];
  } else if (isGarageDoor) {
    decisions = [
      {
        title: 'FD30S Fire Door Architectural Finish',
        question: 'Which door profile matches your home’s existing interior doors?',
        impact: 'Ensures aesthetic continuity with hallway joinery while guaranteeing 30-minute fire resistance.',
        options: ['Paint-grade flush white', 'Moulded 4-panel Victorian style', 'Real oak veneer pre-finished'],
        recommendedOption: 'Moulded 4-panel or paint-grade flush matching hallway',
      },
      {
        title: 'Threshold Step Configuration',
        question: 'How should the mandatory 100mm floor level difference be detailed?',
        impact: 'Building Regulations require fluid and vapour barrier isolation between garage and dwelling.',
        options: ['Form single 100mm timber step inside door frame', 'Cast ramped concrete slope in garage', 'Install raised hardwood threshold sill'],
        recommendedOption: 'Formed 100mm step inside the certified frame',
      },
    ];
  } else if (isBathroom) {
    decisions = [
      {
        title: 'Shower Enclosure & Tray Gradient',
        question: 'Do you prefer a flush wetroom floor deck or a slimline low-profile tray?',
        impact: 'Recessed wetroom formers require subfloor joist modification; slimline trays are straightforward to install.',
        options: ['Flush tiled wetroom former deck', 'Ultra-low profile (25mm) stone resin shower tray'],
        recommendedOption: 'Ultra-low profile (25mm) stone resin tray for zero-leak reliability',
      },
      {
        title: 'Concealed vs Exposed Thermostatic Shower Valve',
        question: 'Should shower plumbing valves be built into the wall cavity or surface mounted?',
        impact: 'Concealed valves provide a sleek look but require deep wall chasing and accessible service panels.',
        options: ['Concealed two-way thermostatic valve with wall-mounted plate', 'Exposed chrome thermostatic bar shower'],
        recommendedOption: 'Concealed two-way thermostatic valve with removable plate',
      },
      {
        title: 'Wall Surface: Microcement vs Large-Format Porcelain',
        question: 'Which aesthetic finish do you prefer for wet zone walls?',
        impact: 'Microcement creates a seamless, grout-free look; porcelain tiles offer classic durability.',
        options: ['Hand-trowelled waterproof microcement (seamless)', '1200x600 rectified Italian porcelain tiles'],
        recommendedOption: '1200x600 porcelain or microcement over rigid cement backer',
      },
    ];
  } else {
    decisions = [
      {
        title: 'Rear Glazing System: Bifolds vs Large Sliders',
        question: 'Do you prefer multi-panel concertina folding doors or large minimal glass panels?',
        impact: 'Bifolds open 90% of the aperture; slimline sliding panels provide larger uninterrupted panes of glass.',
        options: ['Aluminium bifolding doors (3 to 5 leaves)', 'Slimline sliding panels with 20mm sightlines', 'Heritage Crittall-style black metal doors'],
        recommendedOption: 'Slimline sliding panels or bifolds with integrated blinds',
      },
      {
        title: 'Roof Glazing Architecture',
        question: 'Frameless flat glass rooflight or central pitched aluminium lantern?',
        impact: 'Flat rooflights offer clean external lines; lanterns create internal ceiling volume over kitchen islands.',
        options: ['Frameless flat glass rooflight with solar control', 'Pitched aluminium architectural roof lantern'],
        recommendedOption: 'Frameless flat rooflight with solar-control Low-E coating',
      },
    ];
  }

  return (
    <div id="section-decisions" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4 space-y-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
          Section 8 • Project Choices
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Decisions You&apos;ll Need to Make
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          The few meaningful choices that materially impact cost, layout, daily usability, and project duration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {decisions.map((dec, idx) => (
          <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Decision {idx + 1}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Advice Available
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {dec.title}
              </h3>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                {dec.question}
              </p>
              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900 font-medium">
                <strong>Why it matters:</strong> {dec.impact}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Our Recommended Choice:
              </span>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>{dec.recommendedOption}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
