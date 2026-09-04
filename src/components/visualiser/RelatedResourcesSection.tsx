'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectState } from '@/types/visualiser-scope';
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
  state: ProjectState;
}

export function RelatedResourcesSection({ state }: RelatedResourcesSectionProps) {
  const isExtension = state.projectTypes.includes('extension');
  const isKitchen = state.projectTypes.includes('kitchen-renovation');
  const isBathroom = state.projectTypes.includes('bathroom-renovation');
  const isLoft = state.projectTypes.includes('loft-conversion');

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
      { title: 'House Extensions Service', href: '/services/extensions', type: 'Service', desc: 'Single-storey, side-return, and wraparound extensions' },
      { title: 'Extension Cost Guide 2026', href: '/cost-guides/extension-cost', type: 'Cost Guide', desc: 'Itemised London square metre costs and steelwork prices' },
      { title: 'Interactive Extension Calculator', href: '/calculators/extension-calculator', type: 'Calculator', desc: 'Calculate exact footing, brick, and glazing quantities' }
    );
  } else if (isKitchen) {
    recommendations.push(
      { title: 'Kitchen Renovations Service', href: '/services/kitchen-renovations', type: 'Service', desc: 'Bespoke cabinetry, quartz worktops & open-plan living' },
      { title: 'Kitchen Renovation Cost Guide', href: '/cost-guides/kitchen-renovation-cost', type: 'Cost Guide', desc: 'Trade costs for plumbing, electrics, and cabinetry fitting' },
      { title: 'Interactive Kitchen Calculator', href: '/calculators/kitchen-calculator', type: 'Calculator', desc: 'Estimate custom appliance and stone worktop costs' }
    );
  } else if (isBathroom) {
    recommendations.push(
      { title: 'Bathroom Renovations Service', href: '/services/bathroom-renovations', type: 'Service', desc: 'Luxury walk-in wet rooms & Italian porcelain tiling' },
      { title: 'Bathroom Renovation Cost Guide', href: '/cost-guides/bathroom-renovation-cost', type: 'Cost Guide', desc: 'Tanking, concealed shower valve, and tiling costs' },
      { title: 'Interactive Bathroom Calculator', href: '/calculators/bathroom-calculator', type: 'Calculator', desc: 'Estimate sanitaryware and tile adhesive quantities' }
    );
  } else {
    recommendations.push(
      { title: 'Full House Renovations', href: '/services/renovations', type: 'Service', desc: 'Turnkey period restoration and structural modernisation' },
      { title: 'House Renovation Cost Guide', href: '/cost-guides/house-renovation-cost', type: 'Cost Guide', desc: 'Complete back-to-brick refurb prices per square metre' },
      { title: 'Renovation Calculator', href: '/calculators/renovation-calculator', type: 'Calculator', desc: 'Room-by-room trade and material estimator' }
    );
  }

  return (
    <div className="space-y-10 pt-4">
      {/* 1. Contextual Resources */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            Relevant ST Contractors Guides &amp; Tools
          </h3>
          <span className="text-xs text-slate-500 font-medium">Curated for this project</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recommendations.map((rec, idx) => (
            <Link
              key={idx}
              href={rec.href}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#FFAA4F] hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <Badge variant="slate" className="bg-slate-100 text-slate-700 text-[10px] font-bold">
                  {rec.type}
                </Badge>
                <h4 className="text-sm font-bold text-slate-900 font-heading group-hover:text-[#FFAA4F] transition-colors">
                  {rec.title}
                </h4>
                <p className="text-xs text-slate-600 leading-normal font-normal">
                  {rec.desc}
                </p>
              </div>
              <span className="text-xs font-bold text-[#FFAA4F] flex items-center gap-1 pt-2 border-t border-slate-100">
                <span>Explore</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Similar Completed Case Studies */}
      {relatedCaseStudies.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Similar Projects Delivered by ST Contractors
            </h3>
            <Link href="/projects" className="text-xs font-bold text-[#FFAA4F] hover:text-amber-800">
              View All Projects →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedCaseStudies.map((study) => (
              <Card key={study.id} hoverEffect className="bg-white border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image src={study.coverImage} alt={study.title} fill className="object-cover" />
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="slate" className="bg-slate-950/85 text-white text-xs font-semibold">
                      {study.location}
                    </Badge>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-heading">
                      {study.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {study.customerObjective}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 tabular-numbers">
                      {study.indicativeCost} • {study.duration}
                    </span>
                    <Link
                      href={`/projects/${study.slug}`}
                      className="font-bold text-[#FFAA4F] hover:text-amber-800 flex items-center gap-1"
                    >
                      <span>Case Study</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
