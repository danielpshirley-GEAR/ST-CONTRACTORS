import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { servicesData } from '@/config/services';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ArrowRight, CheckCircle2, Shield, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Residential Construction Services | London & South East',
  description:
    'Explore our 10 core residential building services: house extensions, full home renovations, loft conversions, kitchen & bathroom remodeling, garden rooms, driveways, and architectural new builds.',
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
};

export default function ServicesPage() {
  return (
    <div className="py-12 sm:py-16 bg-slate-50 text-slate-900 min-h-screen">
      <Container>
        <Breadcrumbs items={[{ name: 'Services' }]} className="mb-8 text-slate-500" />

        <div className="max-w-3xl text-left mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
            Specialist Residential Services
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            We specialize in substantial residential transformations across London and the South East. Every project is delivered with fixed pricing, strict timeline management, and our 10-year warranty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {servicesData.map((service) => (
            <Card
              key={service.id}
              hoverEffect
              className="flex flex-col justify-between bg-white border-slate-200/90 hover:border-slate-300 transition-all duration-300 shadow-md hover:shadow-xl rounded-3xl overflow-hidden group text-left"
            >
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="slate"
                    className="bg-slate-900/85 text-white border-slate-700 backdrop-blur-md font-medium text-xs px-2.5 py-0.5"
                  >
                    {service.typicalDuration}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h2 className="text-lg sm:text-xl font-bold text-white font-heading drop-shadow-md">
                    {service.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {service.shortDescription}
                  </p>
                  <div className="space-y-2">
                    {service.keyBenefits.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex items-start text-xs text-slate-700 font-medium">
                        <CheckCircle2
                          className="h-3.5 w-3.5 text-[#FFAA4F] mr-2 flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Guide Range
                    </span>
                    <span className="text-sm font-bold text-slate-900 tabular-numbers">
                      {service.indicativePriceRange}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      href={`/services/${service.slug}`}
                      variant="outline"
                      size="sm"
                      className="text-xs text-slate-800 border-slate-300 hover:bg-slate-100"
                    >
                      Details
                    </Button>
                    <Button
                      href={`/plan-my-project?type=${service.slug}`}
                      variant="primary"
                      size="sm"
                      className="text-xs bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold border border-[#E69335]"
                      rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
                    >
                      Estimate
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Ambient Video Showcase Banner: Crafted for London Living */}
        <div className="mt-20 relative rounded-3xl overflow-hidden text-white border border-slate-800 shadow-2xl">
          {/* Ambient Background Video */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover object-center"
              aria-hidden="true"
            >
              <source src="/videos/contemporary-living-space.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
            <div
              className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 text-left">
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFAA4F] text-xs font-extrabold uppercase tracking-wider mb-4">
                <span>The ST Standard</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-heading leading-tight drop-shadow-md">
                Crafted for London Living. Built for Life.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-100 leading-relaxed font-normal drop-shadow-sm">
                Every project is executed by directly managed master trades, coordinated by senior project managers, and protected by comprehensive insurance and fixed-price contracts.
              </p>
            </div>

            {/* Luminous Liquid Glass Card Row */}
            <div className="w-full bg-white/[0.14] backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_25px_60px_rgba(0,0,0,0.4)] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/25 before:via-white/[0.04] before:to-transparent before:pointer-events-none mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-[#FFAA4F]" aria-hidden="true" />
                    <h3 className="text-base font-bold text-white font-heading">Turnkey Management</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    One single principal contractor overseeing architectural design, structural engineering, council approvals, and full fit-out.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-[#FFAA4F]" aria-hidden="true" />
                    <h3 className="text-base font-bold text-white font-heading">Fixed-Price Contracts</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    Clear schedules of work and milestone billing so you have total financial certainty before a single hammer swings.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-[#FFAA4F]" aria-hidden="true" />
                    <h3 className="text-base font-bold text-white font-heading">10-Year Guarantee</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    Insurance-backed structural guarantees alongside full NICEIC electrical and Gas Safe building compliance certificates.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                href="/plan-my-project"
                variant="primary"
                size="lg"
                className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold px-8 py-3.5 text-sm shadow-xl border border-[#E69335] justify-center"
                rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              >
                Plan Your Project
              </Button>
              <Button
                href="/contact?type=consultation"
                variant="outline"
                size="lg"
                className="text-white bg-slate-950/60 backdrop-blur-md border-white/60 hover:bg-slate-900/90 font-semibold px-8 py-3.5 text-sm justify-center"
              >
                Book Free Site Survey
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
