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
import { MapPin, Building, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: `Service Areas & Locations | ${siteConfig.name}`,
  description:
    'Explore our prime residential construction service areas across London and Surrey, including Ealing, Richmond upon Thames, Chiswick, and Harrow.',
  alternates: {
    canonical: `${siteConfig.url}/areas`,
  },
};

export default function AreasHubPage() {
  const publishedAreas = LOCATIONS_DATA.filter((l) => l.status === 'published');

  return (
    <div className="py-12 sm:py-16 bg-slate-50 text-slate-900 min-h-screen text-left">
      <Container>
        <Breadcrumbs items={[{ name: 'Service Areas' }]} className="mb-8 text-slate-500" />

        {/* Hero Section */}
        <div className="max-w-3xl mb-12">
          <Badge variant="brand" size="sm" className="mb-3 bg-amber-100 text-amber-900 border-amber-300 font-bold text-xs">
            Direct London &amp; Surrey Service Coverage
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
            Our Construction Service Areas
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            We deliver high-spec residential extensions, period renovations, and bespoke lofts across West London, North West London, and Surrey.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {publishedAreas.map((area) => (
            <Link key={area.id} href={`/areas/${area.slug}`} className="group block h-full">
              <Card className="p-7 bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400 transition-all rounded-3xl flex flex-col justify-between h-full space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="brand" size="sm" className="bg-amber-50 text-amber-900 border-amber-200 text-[11px] font-bold">
                      <MapPin className="h-3 w-3 mr-1 inline" />
                      {area.borough}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-medium font-mono">
                      {area.postcodes.join(', ')}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 font-heading group-hover:text-amber-600 transition-colors leading-snug">
                    Builders in {area.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {area.intro}
                  </p>

                  <div className="pt-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Popular Local Projects:
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {area.localArchitecture.popularProperties.slice(0, 2).map((prop, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-1.5 line-clamp-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{prop}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                  <span>View {area.name} project area guide</span>
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
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
              Is your property in our service area?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              We operate across all London boroughs and Surrey Home Counties with dedicated site management teams.
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
      </Container>
    </div>
  );
}
