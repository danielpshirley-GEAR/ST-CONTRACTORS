import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { MASTER_CALCULATORS } from '@/lib/calculators/registry';
import { Calculator, ArrowRight, Phone, Sparkles, Building, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: `Free Construction & Material Calculators | ${siteConfig.name}`,
  description:
    'Free UK construction calculators for bricks, blocks, concrete, tiles, paint, plaster, house extensions, renovations, and loft conversions.',
  alternates: {
    canonical: `${siteConfig.url}/calculators`,
  },
};

export default function CalculatorsHubPage() {
  const tradeMaterialCalculators = MASTER_CALCULATORS.filter((c) => c.category === 'trade_material');
  const projectCostCalculators = MASTER_CALCULATORS.filter((c) => c.category === 'project_cost');

  return (
    <div className="py-12 sm:py-16 bg-slate-50 text-slate-900 min-h-screen">
      <Container>
        <div className="flex justify-center mb-6">
          <Breadcrumbs items={[{ name: 'Calculators' }]} className="text-slate-500" />
        </div>

        {/* Hero Section (Center Aligned) */}
        <div className="max-w-3xl mx-auto mb-14 text-center space-y-4">
          <div className="flex justify-center">
            <Badge variant="brand" size="sm" className="bg-amber-100/90 text-amber-900 border-amber-300/80 font-bold text-xs px-3 py-1 rounded-full">
              Phase 3 Engine • 20 Interactive Tools
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
            Free Construction &amp; Material Calculators
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Accurately compute material quantities, waste allowances, and realistic labor rates for your building project.
          </p>
        </div>

        {/* 1. PROJECT COST CALCULATORS */}
        <div className="space-y-6 mb-16">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                Project Cost Estimators
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Turnkey budget benchmarks for house extensions, conversions, and interior renovations.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {projectCostCalculators.length} Tools
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {projectCostCalculators.map((calc) => (
              <Link key={calc.id} href={`/calculators/${calc.slug}`} className="group block">
                <Card className="p-6 bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400 transition-all rounded-3xl flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2">
                    <Badge variant="brand" size="sm" className="bg-amber-50 text-amber-900 border-amber-200 text-[11px] font-bold">
                      {calc.badge}
                    </Badge>
                    <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-amber-600 transition-colors leading-snug">
                      {calc.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {calc.tagline}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                    <span>Calculate cost</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 2. TRADE & MATERIAL QUANTITY CALCULATORS */}
        <div className="space-y-6 mb-16">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                Material Quantity Calculators
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Compute bricks, concrete volume, tiles, paint, plaster, and outdoor landscaping supplies.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {tradeMaterialCalculators.length} Tools
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tradeMaterialCalculators.map((calc) => (
              <Link key={calc.id} href={`/calculators/${calc.slug}`} className="group block">
                <Card className="p-6 bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400 transition-all rounded-3xl flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2">
                    <Badge variant="brand" size="sm" className="bg-slate-100 text-slate-700 border-slate-200 text-[11px] font-semibold">
                      {calc.badge}
                    </Badge>
                    <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-amber-600 transition-colors leading-snug">
                      {calc.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {calc.tagline}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                    <span>Calculate quantity</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. GLOBAL CONVERSION BANNER */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-slate-900 text-center border border-slate-200 shadow-xl max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <Badge variant="brand" size="sm" className="bg-[#FFAA4F] text-slate-950 font-bold text-xs">
              Apex Construction Full Turnkey Service
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
              Need an accurate, fixed-price project quote?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Our estimating and architectural team can review your site dimensions and provide a transparent, itemized cost plan with no obligation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              href="/plan-my-project"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold border border-[#E69335] shadow-md px-8 py-4"
              rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            >
              Plan Your Project in Detail →
            </Button>
            <Button
              href="/contact?type=consultation"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-slate-800 border-slate-300 hover:bg-slate-50 px-6 py-4"
              leftIcon={<Phone className="h-4 w-4 text-amber-600" />}
            >
              Book Site Consultation
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
