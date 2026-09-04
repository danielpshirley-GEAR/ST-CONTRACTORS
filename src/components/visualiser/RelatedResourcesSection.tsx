'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectState, ProjectCategoryType } from '@/types/visualiser-scope';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { caseStudiesData } from '@/config/case-studies';
import {
  ArrowRight,
  Calculator,
  FileText,
  Home,
  Sparkles,
} from 'lucide-react';

interface RelatedResourcesSectionProps {
  state?: ProjectState;
  projectTypes?: ProjectCategoryType[];
}

export function RelatedResourcesSection({ state, projectTypes }: RelatedResourcesSectionProps) {
  const types = projectTypes || state?.projectTypes || ['extension'];
  const isExtension = types.includes('extension');
  const isKitchen = types.includes('kitchen-renovation');
  const isBathroom = types.includes('bathroom-renovation');
  const isLoft = types.includes('loft-conversion');

  const relatedCaseStudies = caseStudiesData.filter((cs) => {
    if (isExtension && cs.serviceSlug.includes('extension')) return true;
    if (isKitchen && cs.serviceSlug.includes('kitchen')) return true;
    if (isBathroom && cs.serviceSlug.includes('bathroom')) return true;
    if (isLoft && cs.serviceSlug.includes('loft')) return true;
    return false;
  }).slice(0, 2);

  // Recommendations
  const recommendations = [];
  if (isExtension) {
    recommendations.push(
      { title: 'House Extensions Service', href: '/services/extensions', type: 'Service', desc: 'Single-storey, side-return, and wraparound extensions in London' },
      { title: 'Extension Cost Guide 2026', href: '/cost-guides/extension-cost', type: 'Guide', desc: 'Detailed London square-metre benchmark prices' },
      { title: 'Extension Calculator', href: '/calculators/extension-calculator', type: 'Tool', desc: 'Interactive planning & estimate calculator' }
    );
  } else if (isKitchen) {
    recommendations.push(
      { title: 'Kitchen Renovation Service', href: '/services/kitchen-renovations', type: 'Service', desc: 'Bespoke cabinetry, knockthroughs, and luxury stone worktops' },
      { title: 'Kitchen Renovation Cost Guide', href: '/cost-guides/kitchen-renovation-cost', type: 'Guide', desc: 'Cabinetry, trade labor, and appliance cost breakdowns' },
      { title: 'Kitchen Cost Calculator', href: '/calculators/kitchen-cost-calculator', type: 'Tool', desc: 'Calculate kitchen renovation pricing' }
    );
  } else if (isBathroom) {
    recommendations.push(
      { title: 'Bathroom Renovation Service', href: '/services/bathroom-renovations', type: 'Service', desc: 'Schlüter tanking, wetrooms, and luxury sanitaryware installation' },
      { title: 'Bathroom Cost Guide', href: '/cost-guides/bathroom-renovation-cost', type: 'Guide', desc: 'London bathroom fitting and waterproofing costs' },
      { title: 'Tile Calculator', href: '/calculators/tile-calculator', type: 'Tool', desc: 'Calculate tile square meterage & cut waste' }
    );
  } else {
    recommendations.push(
      { title: 'Full House Renovation Service', href: '/services/renovations', type: 'Service', desc: 'Complete structural renovations and interior fit-outs' },
      { title: 'House Renovation Cost Guide', href: '/cost-guides/house-renovation-cost', type: 'Guide', desc: 'Square-metre pricing for London properties' },
      { title: 'Project Planner Engine', href: '/plan-my-project', type: 'Tool', desc: 'Detailed multi-room construction planning' }
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold font-heading text-white">
          Related Construction Resources &amp; Case Studies
        </h3>
        <p className="text-xs text-slate-400">
          Explore completed London projects and detailed pricing guides for this project type
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec, idx) => (
          <Link
            key={idx}
            href={rec.href}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-[#FFAA4F] transition-all space-y-2 group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFAA4F]">
                {rec.type}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#FFAA4F] transition-colors font-heading">
              {rec.title}
            </h4>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {rec.desc}
            </p>
          </Link>
        ))}
      </div>

      {relatedCaseStudies.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Recent ST Contractors Case Studies:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedCaseStudies.map((cs) => (
              <Link
                key={cs.slug}
                href={`/projects/${cs.slug}`}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-[#FFAA4F] transition-all flex items-center gap-4 group"
              >
                <div className="relative h-16 w-20 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  <Image
                    src={cs.coverImage}
                    alt={cs.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400">
                    {cs.location} • {cs.duration}
                  </span>
                  <h5 className="text-xs font-bold text-white group-hover:text-[#FFAA4F] transition-colors line-clamp-1">
                    {cs.title}
                  </h5>
                  <span className="text-[11px] font-extrabold text-[#FFAA4F]">
                    {cs.indicativeCost}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
