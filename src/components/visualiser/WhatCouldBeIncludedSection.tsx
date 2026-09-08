'use client';

import React from 'react';
import { ProjectCategoryType, ProjectSpace } from '@/types/visualiser-scope';
import { Check, Layers, DoorOpen, Zap, Sparkles, Trash2, Hammer } from 'lucide-react';

interface WhatCouldBeIncludedSectionProps {
  projectTypes: ProjectCategoryType[];
  briefText: string;
  spaces: ProjectSpace[];
}

interface IncludedCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
}

export function WhatCouldBeIncludedSection({
  projectTypes,
  briefText,
  spaces,
}: WhatCouldBeIncludedSectionProps) {
  const lower = (briefText || '').toLowerCase();
  const isGarageConversion =
    projectTypes.includes('garage-conversion') ||
    lower.includes('garage conversion') ||
    (lower.includes('convert') && lower.includes('garage'));

  const isGarageDoor = !isGarageConversion && ((lower.includes('garage') && lower.includes('door')) || (lower.includes('door') && lower.includes('hallway')));
  const isBathroom = projectTypes.includes('bathroom-renovation') || lower.includes('bath') || lower.includes('shower');
  const isExtension = projectTypes.includes('extension') || lower.includes('extension');

  let categories: IncludedCategory[] = [];

  if (isGarageConversion) {
    categories = [
      {
        title: 'BUILDING FABRIC & INSULATION',
        icon: Layers,
        items: [
          'High-performance Kingspan/Celotex rigid insulation to subfloor, external walls & ceiling',
          'Heavy-duty liquid/sheet damp-proof membrane (DPM) isolated from original slab',
          'Treated timber stud framework with acoustic insulation infill',
          'Fire-rated double plasterboard ceiling lining (where bedrooms sit overhead)',
        ],
      },
      {
        title: 'STRUCTURAL OPENINGS & ACCESS',
        icon: DoorOpen,
        items: [
          'Direct connecting doorway from hallway with certified FD30S 30-minute fire doorset',
          'Pre-stressed reinforced concrete or steel box lintel with 150mm padstone bearings',
          'Removal of existing vehicular garage door and frame',
          'Frontage infill with cavity wall, matching exterior facing brickwork & double-glazed window',
        ],
      },
      {
        title: 'ELECTRICS, HEATING & VENTILATION',
        icon: Zap,
        items: [
          'Dedicated electrical ring main with brushed metal socket outlets & USB points',
          'Warm-white recessed LED downlights with dimmable zoning switch',
          'Central heating radiator connected to existing combi boiler system',
          'Approved Document F compliant background trickle ventilation',
        ],
      },
      {
        title: 'INTERIOR FINISHES & JOINERY',
        icon: Sparkles,
        items: [
          'Full two-coat British Gypsum multi-finish plaster skim throughout',
          'Engineered hardwood, luxury vinyl tile (LVT), or laminate floor finish with acoustic underlay',
          'Moulded skirting boards, architraves, and decorated reveals to match existing hallway',
          'Full trade mist-coat and two finishing coats of durable matt emulsion paint',
        ],
      },
      {
        title: 'SITE COMPLETION & CERTIFICATION',
        icon: Trash2,
        items: [
          'Local Authority Building Control statutory inspections & Final Completion Certificate',
          'NICEIC Part P electrical installation compliance certificate',
          'Complete licensed skip hire and waste disposal with site swept clean',
          'Comprehensive 10-year structural warranty & hand-over pack',
        ],
      },
    ];
  } else if (isGarageDoor) {
    categories = [
      {
        title: 'STRUCTURAL KNOCKTHROUGH & LINTEL',
        icon: Hammer,
        items: [
          'Temporary Acrow propping of overhead ceiling joists during opening formation',
          'Clean masonry aperture cut through dividing wall with water-mist dust extraction',
          'Pre-stressed reinforced concrete or steel box lintel with 150mm padstone bearings',
        ],
      },
      {
        title: 'CERTIFIED FIRE & SMOKE SEPARATION',
        icon: DoorOpen,
        items: [
          'Approved Document B certified FD30S 30-minute fire-and-smoke rated doorset',
          'Intumescent perimeter fire seals and cold smoke nylon brush seals',
          'Overhead commercial-grade hydraulic automatic self-closing mechanism',
          'Mandatory 100mm threshold step or floor fall barrier to contain petrol fumes/spills',
        ],
      },
      {
        title: 'JOINERY & SURFACE MAKE-GOOD',
        icon: Sparkles,
        items: [
          'Plasterboard reveals, bonding coat, and smooth multi-finish plaster skim',
          'Timber architrave casing on both hallway and garage sides matching existing trim',
          'Three-lever mortice fire-door latch and brushed stainless steel lever handles',
        ],
      },
      {
        title: 'BUILDING CONTROL SIGN-OFF & WASTE',
        icon: Trash2,
        items: [
          'Local Authority Building Control Building Notice inspection and sign-off',
          'Complete rubble and masonry clearance and vacuum cleaning of hallway',
        ],
      },
    ];
  } else if (isBathroom) {
    categories = [
      {
        title: 'PREPARATION & SUBSTRATE STABILISATION',
        icon: Hammer,
        items: [
          'Complete strip-out of existing sanitaryware, tiles, plasterboard, and flooring',
          'Subfloor deflection stiffening (18mm/22mm marine plywood or cement backer boards)',
          'Laser floor levelling for flush drainage gradients',
        ],
      },
      {
        title: 'WATERPROOFING & TANKING FLEECE',
        icon: Layers,
        items: [
          'Schlüter-KERDI continuous tanking fleece membrane throughout shower and bath zones',
          'Waterproof sealing bands on all wall-to-floor junctions and pipe penetrations',
          'Integral shower tray former with low-profile high-flow waste trap',
        ],
      },
      {
        title: 'PLUMBING & MECHANICAL SERVICES',
        icon: Zap,
        items: [
          'Concealed thermostatic shower mixer valve and ceiling rainfall shower head',
          'Wall-hung concealed toilet cistern frame and waste reconfiguration to stack',
          'High-extract inline Part F mechanical extractor fan ducted outside',
        ],
      },
      {
        title: 'SURFACE FINISHES & FIT-OUT',
        icon: Sparkles,
        items: [
          'Precision installation of wall tiles, porcelain slabs, or hand-trowelled microcement',
          'Wall-hung vanity unit with integrated washbasin and monobloc tap',
          'Frameless toughened glass shower screen with anti-calcification treatment',
          'Heated anti-fog LED mirror cabinet and designer towel radiator',
        ],
      },
      {
        title: 'COMPLETION & TESTING',
        icon: Trash2,
        items: [
          'Full hydraulic pressure testing of all supply pipework and drainage fall check',
          'NICEIC Part P electrical certification for bathroom lighting circuits',
          'Silicone mastic sealing and deep clean ready for immediate use',
        ],
      },
    ];
  } else {
    // Extension / General
    categories = [
      {
        title: 'GROUNDWORKS & STRUCTURAL ENVELOPE',
        icon: Hammer,
        items: [
          'Excavation of mass concrete strip foundations designed for London clay',
          'Structural steel universal beams (RSJs) supporting overhead rear brickwork',
          'Cavity wall masonry with Kingspan cavity insulation meeting Approved Document L',
        ],
      },
      {
        title: 'ARCHITECTURAL GLAZING & ROOF',
        icon: DoorOpen,
        items: [
          'High-performance warm flat roof with EPDM or single-ply membrane',
          'Frameless structural glass rooflights with Low-E solar-control coatings',
          'Multi-panel aluminium bifolding or sliding patio door system',
        ],
      },
      {
        title: 'MECHANICAL & ELECTRICAL FIT-OUT',
        icon: Zap,
        items: [
          'Warm-water underfloor heating system connected to manifolds and digital thermostat',
          'Zoned recessed LED downlights, feature pendant points, and USB power sockets',
          'High-efficiency ventilation and plumbing first-fix for kitchen or utility',
        ],
      },
      {
        title: 'PLASTER & ARCHITECTURAL FINISHES',
        icon: Sparkles,
        items: [
          'Dry-lining and two-coat British Gypsum plaster skim across all new walls and ceilings',
          'Finished flooring with subfloor screed levelling across the entire open-plan zone',
          'Skirting boards, architraves, and trade mist-coat paint application',
        ],
      },
      {
        title: 'STATUTORY SIGN-OFF & WARRANTIES',
        icon: Trash2,
        items: [
          'Local Authority Building Control completion certificate for your deeds',
          'NICEIC Part P and Gas Safe compliance documentation',
          '10-year structural warranty on all foundation and steelwork',
        ],
      },
    ];
  }

  return (
    <div id="section-included" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
      <div className="border-b border-slate-100 pb-4 space-y-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
          Section 3 • Detailed Scope
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          What Could Be Included in Your Plan
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          A clear, categorized breakdown answering exactly: &ldquo;What am I actually getting?&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                <Icon className="h-4 w-4 text-[#FFAA4F]" />
                <span>{cat.title}</span>
              </div>
              <ul className="space-y-2">
                {cat.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
