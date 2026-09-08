'use client';

import React from 'react';
import { ProjectState, FinishTier } from '@/types/visualiser-scope';
import { Check, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface HomeownerFinishTiersProps {
  projectState: ProjectState;
  onSelectTier?: (tier: FinishTier) => void;
}

export function HomeownerFinishTiers({ projectState, onSelectTier }: HomeownerFinishTiersProps) {
  const { finishSelections, projectTypes, originalBrief } = projectState;
  const lower = (originalBrief || '').toLowerCase();
  const isGarageDoor = (lower.includes('garage') && lower.includes('door')) || (lower.includes('door') && lower.includes('hallway'));
  const isBathroom = projectTypes.includes('bathroom-renovation') || lower.includes('bath') || lower.includes('shower');

  const currentTier = (finishSelections.Cabinetry as FinishTier) || 'enhanced';

  // Project-tailored tier definitions ensuring zero safety upsells (Rule 14)
  const tiers = isGarageDoor
    ? [
        {
          tier: 'standard' as FinishTier,
          label: 'Standard Compliant Doorset',
          tagline: 'Paint-Grade FD30S Fire Doorset',
          badge: 'Fully Compliant',
          description: 'Certified FD30S fire-and-smoke door leaf supplied pre-primed for site painting, with CE fire hinges and overhead closer.',
          features: [
            'Certified 30-minute fire resistance (FD30S)',
            'Intumescent fire & cold smoke perimeter seals',
            'Pre-stressed concrete or steel box lintel',
            'Compliant 100mm threshold step formation',
            'CE-marked commercial overhead self-closer',
            'Pre-primed leaf ready for site painting',
          ],
          indicativeDiff: 'Baseline',
        },
        {
          tier: 'enhanced' as FinishTier,
          label: 'Enhanced Architectural Doorset',
          tagline: 'Factory Pre-Finished Veneer or Colour',
          badge: 'Most Popular',
          description: 'Upgraded factory-finished solid-core FD30S doorset with brushed stainless steel ironmongery and matching architraves.',
          features: [
            'Certified 30-minute fire resistance (FD30S)',
            'Intumescent fire & cold smoke perimeter seals',
            'Factory-sprayed finish or real oak veneer leaf',
            'Brushed stainless steel lever handles & escutcheons',
            'Soft-action adjustable hydraulic self-closer',
            'Matching primed architraves & skirting make-good',
          ],
          indicativeDiff: '+15% – 20%',
        },
        {
          tier: 'bespoke' as FinishTier,
          label: 'Bespoke Custom Joinery Doorset',
          tagline: 'Architectural Concealed Hardware',
          badge: 'Luxury Spec',
          description: 'Custom hardwood timber fire doorset with concealed flush hinges and acoustic drop seals matching luxury interior doors.',
          features: [
            'Certified 30-minute fire resistance (FD30S)',
            'Intumescent fire & cold smoke perimeter seals',
            'Concealed European fire-rated hinge system',
            'Automatic concealed bottom acoustic drop seal',
            'Custom bespoke stain or lacquer match to hallway',
            'Magnetic latching for silent domestic closing',
          ],
          indicativeDiff: '+35% – 45%',
        },
      ]
    : isBathroom
    ? [
        {
          tier: 'standard' as FinishTier,
          label: 'Standard Designer Suite',
          tagline: 'Clean, Durable Modern Finishes',
          badge: 'Fully Compliant',
          description: 'Contemporary porcelain wall and floor tiles, exposed chrome thermostatic shower valve, and floor-mounted sanitaryware.',
          features: [
            '100% full waterproof fleece tanking in wet zone',
            'Subfloor joist stiffening & laser levelling',
            'Large format rectified porcelain wall tiles',
            'Quality chrome thermostatic rainfall shower',
            'Part F compliant extract ventilation',
            'Close-coupled rimless WC & vanity basin',
          ],
          indicativeDiff: 'Baseline',
        },
        {
          tier: 'enhanced' as FinishTier,
          label: 'Enhanced Architectural Spec',
          tagline: 'Wall-Hung Frames & Designer Brassware',
          badge: 'Most Popular',
          description: 'Walk-in frameless fluted or clear shower screen, concealed thermostatic valve, wall-hung vanity, and brushed brass or black metalwork.',
          features: [
            '100% full waterproof fleece tanking in wet zone',
            'Concealed in-wall thermostatic mixer valve',
            'Rigid steel frame with wall-hung vanity & WC',
            'Low-iron 10mm toughened glass walk-in screen',
            'Brushed brass or matte black PVD brassware',
            'Continuous humidistat inline extraction fan',
          ],
          indicativeDiff: '+25% – 30%',
        },
        {
          tier: 'bespoke' as FinishTier,
          label: 'Bespoke Luxury Wetroom',
          tagline: 'Seamless Microcement & Flush Niches',
          badge: 'Luxury Spec',
          description: 'Hand-trowelled seamless microcement walls and floor, flush wetroom former, recessed linear drain, and bespoke illuminated alcoves.',
          features: [
            '100% full waterproof fleece tanking in wet zone',
            'Multi-coat hand-trowelled waterproof microcement',
            'Recessed flush floor linear channel drain',
            'Concealed waterproof LED perimeter ambient lighting',
            'Bespoke fluted oak or custom lacquer vanity unit',
            'Underfloor heating mat with smart touchscreen thermostat',
          ],
          indicativeDiff: '+45% – 60%',
        },
      ]
    : [
        {
          tier: 'standard' as FinishTier,
          label: 'Standard Build Specification',
          tagline: 'Reliable, Robust Trade-Grade Finishes',
          badge: 'Fully Compliant',
          description: 'Quality trade-trusted materials, standard aperture glazing, and durable contemporary finishes.',
          features: [
            'Full statutory Building Regulations compliance',
            'High-efficiency Part L thermal insulation envelope',
            'Standard size powder-coated aluminium glazing',
            'Engineered timber or quality luxury vinyl flooring',
            'Smooth plaster skim & trade emulsion mist coats',
            'NICEIC certified electrical layout',
          ],
          indicativeDiff: 'Baseline',
        },
        {
          tier: 'enhanced' as FinishTier,
          label: 'Enhanced Architectural Spec',
          tagline: 'Slimline Glazing & Upgraded Finishes',
          badge: 'Most Popular',
          description: 'Slimline thermally broken aluminium bifold/sliding doors, quartz surfaces, and integrated architectural lighting.',
          features: [
            'Full statutory Building Regulations compliance',
            'Slimline profile aluminium sliding or bifold doors',
            'Solar-control Low-E argon-filled glazing',
            '20mm/30mm quartz worktops & under-cabinet LEDs',
            'Concealed flush ceiling steelwork details',
            'Underfloor heating across ground floor footprint',
          ],
          indicativeDiff: '+20% – 30%',
        },
        {
          tier: 'bespoke' as FinishTier,
          label: 'Bespoke Master Craftsmanship',
          tagline: 'Custom Joinery & Minimalist Glazing',
          badge: 'Luxury Spec',
          description: 'Ultra-slim structural glass rooflights, custom spray-painted joinery, book-matched stone, and smart home automation.',
          features: [
            'Full statutory Building Regulations compliance',
            'Ultra-slim frameless structural glass rooflights',
            'Hand-crafted bespoke painted timber cabinetry',
            'Sintered stone or book-matched quartzite worktops',
            'Integrated shadow gaps and flush architectural reveals',
            'Smart multi-zone heating and scene lighting control',
          ],
          indicativeDiff: '+40% – 55%',
        },
      ];

  const handleTierClick = (tier: FinishTier) => {
    trackEvent('tier_selected', { tier, isGarageDoor, isBathroom });
    if (onSelectTier) onSelectTier(tier);
  };

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FFAA4F]" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Specification & Finish Levels
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Tailor material selections to your taste. Regulated fire safety, structural integrity, and insulation standards are non-negotiable and included in every tier.
        </p>
      </div>

      {/* Tiers Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((item) => {
          const isSelected = currentTier === item.tier;

          return (
            <div
              key={item.tier}
              onClick={() => handleTierClick(item.tier)}
              className={`rounded-3xl p-6 sm:p-7 border transition-all duration-300 cursor-pointer flex flex-col justify-between relative ${
                isSelected
                  ? 'bg-slate-900 border-[#FFAA4F] shadow-xl shadow-[#FFAA4F]/10 ring-2 ring-[#FFAA4F]/20'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              {/* Selected Floating Indicator */}
              {isSelected && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFAA4F] text-slate-950 shadow-md flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Current Selection
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {/* Header with Badge */}
                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      item.tier === 'enhanced'
                        ? 'bg-[#FFAA4F]/15 border-[#FFAA4F]/30 text-[#FFAA4F]'
                        : item.tier === 'bespoke'
                        ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>

                  <span className="text-xs text-slate-400 font-medium">
                    {item.indicativeDiff}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {item.label}
                  </h3>
                  <p className="text-xs font-semibold text-[#FFAA4F] mt-0.5">
                    {item.tagline}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Features List */}
                <div className="space-y-2.5 pt-3 border-t border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    What is Included:
                  </span>
                  <ul className="space-y-2">
                    {item.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-200">
                        <Check className="w-3.5 h-3.5 text-[#FFAA4F] flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-6 mt-6 border-t border-slate-800">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#FFAA4F] text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {isSelected ? 'Selected Finish' : `Select ${item.label}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Callout */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <span>
          <strong className="text-slate-200">Building Control Guarantee:</strong> All structural calculations, fire-resisting seals, insulation envelopes, and electrical certificates comply with UK Building Regulations regardless of tier chosen.
        </span>
      </div>
    </section>
  );
}
