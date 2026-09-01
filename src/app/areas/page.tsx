import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { LOCATIONS_DATA } from '@/lib/content/locations-data';
import { MapPin, Building, ArrowRight, Phone, CheckCircle2, Compass, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: `Service Areas & Locations | ${siteConfig.name}`,
  description:
    'Explore our 55 prime residential construction service areas across London and Surrey, including Ealing, Richmond, Chiswick, Wimbledon, Hampstead, and Kensington.',
  alternates: {
    canonical: `${siteConfig.url}/areas`,
  },
};

export default function AreasHubPage() {
  const publishedAreas = LOCATIONS_DATA.filter((l) => l.status === 'published');

  return (
    <div className="py-12 sm:py-16 bg-[#F4F5F7] text-slate-900 min-h-screen text-left">
      <Container>
        <div className="max-w-7xl mx-auto space-y-12">
          <Breadcrumbs items={[{ name: 'Service Areas' }]} className="text-slate-500" />

          {/* Hero Section */}
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="brand" size="sm" className="bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40 font-bold text-xs">
                <Compass className="h-3.5 w-3.5 mr-1 inline text-[#D97706]" />
                Direct London &amp; South East Service Coverage (55 Prime Hubs)
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
              Our Construction &amp; Renovation Service Areas
            </h1>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              We deliver high-specification house extensions, period restorations, and bespoke lofts across West London, South West London, North London, and the Surrey borders. Every area guide provides local 2026 cost benchmarks, council planning insights, and architectural guidance.
            </p>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedAreas.map((area) => (
              <Link key={area.id} href={`/areas/${area.slug}`} className="group block h-full">
                <Card className="p-6 bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#FFAA4F] transition-all rounded-3xl flex flex-col justify-between h-full space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="brand" size="sm" className="bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40 text-[10px] font-bold truncate max-w-[190px]">
                        <MapPin className="h-3 w-3 mr-1 inline shrink-0" />
                        {area.borough}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-medium font-mono">
                        {area.postcodes.join(', ')}
                      </span>
                    </div>

                    <h2 className="text-lg font-extrabold text-slate-900 font-heading group-hover:text-[#D97706] transition-colors leading-snug">
                      Builders in {area.name}
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {area.intro}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Typical Extension:
                      </div>
                      <div className="font-extrabold text-emerald-700 font-mono">
                        {area.costBenchmarks?.[0]?.range || '£90,000 – £130,000'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#D97706]">
                    <span>View {area.name} area guide</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Commercial Conversion Banner */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-slate-900 text-center border border-slate-200 shadow-xl max-w-4xl mx-auto space-y-6">
            <div className="space-y-2">
              <Badge variant="brand" size="sm" className="bg-[#FFAA4F] text-slate-950 font-bold text-xs">
                ST CONTRACTORS Local Building Operations
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
                Is your property in our London &amp; South East service area?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                We operate across all Greater London boroughs and Surrey Home Counties with dedicated project managers and chartered structural engineering support.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button
                href="/contact?type=consultation"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold border border-[#E69335] shadow-md px-8 py-4"
                rightIcon={<Phone className="h-4 w-4" />}
              >
                Book Site Consultation →
              </Button>
              <Button
                href="/plan-my-project"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-slate-800 border-slate-300 hover:bg-slate-50 px-6 py-4"
              >
                Plan Your Project Live
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
