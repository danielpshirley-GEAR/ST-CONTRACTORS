import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { COST_GUIDES_DATA } from '@/lib/content/cost-guides-data';
import { ArrowRight, PoundSterling, Clock, Phone, Sparkles, Building } from 'lucide-react';

export const metadata: Metadata = {
  title: `UK Construction Cost Guides 2026 | ${siteConfig.name}`,
  description:
    'Comprehensive UK building cost guides for house extensions, full home renovations, loft conversions, kitchen knockthroughs, and garden studios.',
  alternates: {
    canonical: `${siteConfig.url}/cost-guides`,
  },
};

export default function CostGuidesHubPage() {
  const publishedGuides = COST_GUIDES_DATA.filter((g) => g.status === 'published');

  return (
    <div className="py-12 sm:py-16 bg-slate-50 text-slate-900 min-h-screen text-left">
      <Container>
        <Breadcrumbs items={[{ name: 'Resources', href: '/calculators' }, { name: 'Cost Guides' }]} className="mb-8 text-slate-500" />

        {/* Hero Section */}
        <div className="max-w-3xl mb-12">
          <Badge variant="brand" size="sm" className="mb-3 bg-amber-100 text-amber-900 border-amber-300 font-bold text-xs">
            2026 UK Build Benchmarks
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
            UK Construction Cost Guides (2026)
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Transparent, data-backed building cost benchmarks for house extensions, period home renovations, loft conversions, and architectural remodeling.
          </p>
        </div>

        {/* Cost Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {publishedGuides.map((guide) => (
            <Link key={guide.id} href={`/cost-guides/${guide.slug}`} className="group block h-full">
              <Card className="p-7 bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400 transition-all rounded-3xl flex flex-col justify-between h-full space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="brand" size="sm" className="bg-amber-50 text-amber-900 border-amber-200 text-[11px] font-bold">
                      {guide.category.toUpperCase()}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-medium">Updated 2026</span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 font-heading group-hover:text-amber-600 transition-colors leading-snug">
                    {guide.title}
                  </h2>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Typical Budget Range
                    </div>
                    <div className="text-lg sm:text-xl font-bold font-heading text-slate-900 font-mono">
                      {guide.indicativeRange.formatted}
                    </div>
                    <div className="text-[11px] text-slate-500">{guide.indicativeRange.unit}</div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {guide.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                  <span>Read full guide &amp; breakdown</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Global Commercial Conversion Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-slate-900 text-center border border-slate-200 shadow-xl max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <Badge variant="brand" size="sm" className="bg-[#FFAA4F] text-slate-950 font-bold text-xs">
              Apex Project Estimating
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
              Need a personalized project estimate?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Use our interactive Project Planner to configure your exact room dimensions, structural knockthroughs, and finish options in 2 minutes.
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
              Plan Your Project Live →
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
