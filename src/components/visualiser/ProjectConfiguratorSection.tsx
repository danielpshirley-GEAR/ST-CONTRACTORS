'use client';

import React, { useState } from 'react';
import { ProjectCategoryType, FinishTier } from '@/types/visualiser-scope';
import { Sliders, Check, Plus, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface ProjectConfiguratorSectionProps {
  projectTypes: ProjectCategoryType[];
  briefText: string;
  onConfigChange?: (summary: string) => void;
}

interface ConfigItem {
  id: string;
  category: string;
  currentOption: 'Practical' | 'Recommended' | 'Premium';
  options: Array<{ tier: 'Practical' | 'Recommended' | 'Premium'; label: string; delta: string }>;
  included: boolean;
}

export function ProjectConfiguratorSection({
  projectTypes,
  briefText,
  onConfigChange,
}: ProjectConfiguratorSectionProps) {
  const lower = (briefText || '').toLowerCase();
  const isGarageConversion =
    projectTypes.includes('garage-conversion') ||
    lower.includes('garage conversion') ||
    (lower.includes('convert') && lower.includes('garage'));

  const isGarageDoor = !isGarageConversion && ((lower.includes('garage') && lower.includes('door')) || (lower.includes('door') && lower.includes('hallway')));
  const isBathroom = projectTypes.includes('bathroom-renovation') || lower.includes('bath') || lower.includes('shower');

  const initialItems: ConfigItem[] = isGarageConversion
    ? [
        {
          id: 'frontage',
          category: 'Frontage Enclosure',
          currentOption: 'Recommended',
          options: [
            { tier: 'Practical', label: 'Matching brick infill + standard uPVC window', delta: 'Baseline' },
            { tier: 'Recommended', label: 'Thermally-broken aluminium casement window', delta: '+£650' },
            { tier: 'Premium', label: 'Full-height architectural bifold / French doors', delta: '+£1,450' },
          ],
          included: true,
        },
        {
          id: 'door',
          category: 'Internal Access Doorway',
          currentOption: 'Recommended',
          options: [
            { tier: 'Practical', label: 'FD30S Paint-Grade Flush Doorset', delta: 'Baseline' },
            { tier: 'Recommended', label: 'FD30S Moulded 4-Panel Doorset (Matching Hallway)', delta: '+£180' },
            { tier: 'Premium', label: 'FD30S Real Oak Veneer with Acoustic Drop Seal', delta: '+£390' },
          ],
          included: true,
        },
        {
          id: 'insulation',
          category: 'Acoustic Soundproofing',
          currentOption: 'Recommended',
          options: [
            { tier: 'Practical', label: 'Standard Approved Doc L thermal insulation', delta: 'Baseline' },
            { tier: 'Recommended', label: 'High-density acoustic rockwool ceiling & walls', delta: '+£450' },
            { tier: 'Premium', label: 'Double sound-plasterboard with resilient bars', delta: '+£850' },
          ],
          included: true,
        },
        {
          id: 'flooring',
          category: 'Floor Finish',
          currentOption: 'Recommended',
          options: [
            { tier: 'Practical', label: 'AC4 heavy-duty commercial laminate', delta: 'Baseline' },
            { tier: 'Recommended', label: 'Luxury Vinyl Tile (LVT / Karndean)', delta: '+£400' },
            { tier: 'Premium', label: 'Engineered European Natural Oak Herringbone', delta: '+£950' },
          ],
          included: true,
        },
      ]
    : isGarageDoor
    ? [
        {
          id: 'doorset',
          category: 'FD30S Certified Doorset',
          currentOption: 'Recommended',
          options: [
            { tier: 'Practical', label: 'Paint-Grade Flush FD30S Doorset', delta: 'Baseline' },
            { tier: 'Recommended', label: 'Period 4-Panel Moulded FD30S Doorset', delta: '+£150' },
            { tier: 'Premium', label: 'Natural Pre-Finished Oak Veneer FD30S', delta: '+£340' },
          ],
          included: true,
        },
        {
          id: 'closer',
          category: 'Self-Closing Mechanism',
          currentOption: 'Recommended',
          options: [
            { tier: 'Practical', label: 'Concealed spring-loaded jamb chain', delta: 'Baseline' },
            { tier: 'Recommended', label: 'Overhead hydraulic controlled speed closer', delta: '+£95' },
            { tier: 'Premium', label: 'Concealed concealed-head architectural closer', delta: '+£220' },
          ],
          included: true,
        },
        {
          id: 'hardware',
          category: 'Ironmongery & Threshold',
          currentOption: 'Recommended',
          options: [
            { tier: 'Practical', label: 'Brushed satin aluminium lever handles & 100mm sill', delta: 'Baseline' },
            { tier: 'Recommended', label: 'Heavy-duty stainless steel fire-rated handles & seal', delta: '+£80' },
            { tier: 'Premium', label: 'Heritage antique brass / matte black architectural set', delta: '+£160' },
          ],
          included: true,
        },
      ]
    : isBathroom
    ? [
        {
          id: 'shower',
          category: 'Shower Brassware & Valve',
          currentOption: 'Recommended',
          options: [
            { tier: 'Practical', label: 'Exposed thermostatic mixer with riser rail', delta: 'Baseline' },
            { tier: 'Recommended', label: 'Concealed thermostatic valve + rainfall head', delta: '+£450' },
            { tier: 'Premium', label: 'Brushed brass three-way valve with handset & jets', delta: '+£1,100' },
          ],
          included: true,
        },
        {
          id: 'wall_finish',
          category: 'Wall Finish & Waterproofing',
          currentOption: 'Recommended',
          options: [
            { tier: 'Practical', label: 'Porcelain wall tiling over Schlüter tanking', delta: 'Baseline' },
            { tier: 'Recommended', label: '1200x600 rectified Italian porcelain slabs', delta: '+£750' },
            { tier: 'Premium', label: 'Hand-trowelled waterproof microcement (seamless)', delta: '+£1,600' },
          ],
          included: true,
        },
        {
          id: 'vanity',
          category: 'Vanity Unit & Basin',
          currentOption: 'Recommended',
          options: [
            { tier: 'Practical', label: 'Floor-standing 600mm gloss white vanity', delta: 'Baseline' },
            { tier: 'Recommended', label: 'Wall-hung 800mm fluted wood vanity with drawer', delta: '+£400' },
            { tier: 'Premium', label: 'Bespoke Corian integrated basin & walnut cabinet', delta: '+£1,250' },
          ],
          included: true,
        },
      ]
    : [
        {
          id: 'glazing',
          category: 'Rear Glazing System',
          currentOption: 'Recommended',
          options: [
            { tier: 'Practical', label: '3-panel aluminium bifold doors', delta: 'Baseline' },
            { tier: 'Recommended', label: 'Slimline sliding glass panels (20mm sightline)', delta: '+£1,800' },
            { tier: 'Premium', label: 'Heritage Crittall-style black metal doors & screens', delta: '+£3,500' },
          ],
          included: true,
        },
        {
          id: 'rooflight',
          category: 'Architectural Rooflight',
          currentOption: 'Recommended',
          options: [
            { tier: 'Practical', label: 'Standard double-glazed rooflight', delta: 'Baseline' },
            { tier: 'Recommended', label: 'Frameless solar-control Low-E structural glass', delta: '+£850' },
            { tier: 'Premium', label: 'Pitched aluminium architectural roof lantern', delta: '+£1,650' },
          ],
          included: true,
        },
      ];

  const [items, setItems] = useState<ConfigItem[]>(initialItems);

  const handleSelectOption = (itemId: string, tier: 'Practical' | 'Recommended' | 'Premium') => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, currentOption: tier } : it))
    );
    if (onConfigChange) {
      onConfigChange(`Configured ${itemId} to ${tier}`);
    }
  };

  return (
    <div id="section-configurator" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4 space-y-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
          Section 9 • Project Customiser
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Project Configurator
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Easily tailor key fixtures and finishes. Every option meets 100% UK Building Regulations compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                {item.category}
              </span>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md">
                {item.currentOption}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {item.options.map((opt) => {
                const isSelected = item.currentOption === opt.tier;
                return (
                  <button
                    key={opt.tier}
                    type="button"
                    onClick={() => handleSelectOption(item.id, opt.tier)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col justify-between gap-1 ${
                      isSelected
                        ? 'bg-[#FFAA4F]/20 border-[#FFAA4F] text-slate-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[11px] font-bold block">{opt.tier}</span>
                    <span className="text-[10px] text-slate-500 block leading-tight truncate">{opt.delta}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-600 font-medium pt-1">
              Active: {item.options.find((o) => o.tier === item.currentOption)?.label}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Detailed trade specifications and BoQ available under Technical Details</span>
        </div>
      </div>
    </div>
  );
}
