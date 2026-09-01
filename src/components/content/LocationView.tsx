'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LocationAreaGuide } from '@/lib/content/types';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import {
  MapPin,
  Building,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Phone,
  Compass,
  FileCheck2,
  Layers,
  Sparkles,
  ShieldCheck,
  Hammer,
  HelpCircle,
  PoundSterling,
} from 'lucide-react';
import { clsx } from 'clsx';

interface LocationViewProps {
  location: LocationAreaGuide;
}

export const LocationView: React.FC<LocationViewProps> = ({ location }) => {
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <article className="py-10 sm:py-16 bg-[#F4F5F7] text-slate-900 min-h-screen text-left">
      <Container>
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { name: 'Service Areas', href: '/areas' },
              { name: location.name },
            ]}
            className="text-slate-500"
          />

          {/* 1. HERO HEADER */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" size="sm" className="bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40 font-bold text-xs">
                <MapPin className="h-3 w-3 mr-1 inline" />
                {location.borough}
              </Badge>
              <span className="text-xs text-slate-500 font-mono font-medium">
                Postcodes: {location.postcodes.join(', ')}
              </span>
              {location.opportunityScore && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Opportunity Score: {location.opportunityScore}/100
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
              Builders in {location.name}
            </h1>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              {location.intro}
            </p>
          </header>

          {/* 2. LOCAL 2026 PRICING BENCHMARKS */}
          {location.costBenchmarks && location.costBenchmarks.length > 0 && (
            <section aria-label="Cost Benchmarks" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#FFAA4F]/20 text-[#D97706]">
                    <PoundSterling className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold font-heading text-slate-900">
                      Typical Construction Costs in {location.name} (2026 Guide)
                    </h2>
                    <p className="text-xs text-slate-500">Indicative project ranges based on recent local residential completions.</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-[#FAFAF9] text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
                    <tr>
                      <th className="py-3 px-4">Project Type</th>
                      <th className="py-3 px-4">Typical Price Range</th>
                      <th className="py-3 px-4">Scope &amp; Inclusions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {location.costBenchmarks.map((bm, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{bm.projectType}</td>
                        <td className="py-3 px-4 font-extrabold text-emerald-700 font-mono text-sm tabular-numbers">
                          {bm.range}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{bm.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* 3. LOCAL ARCHITECTURE & HOUSING CONTEXT */}
          <section aria-label="Local Architecture" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 flex items-center gap-2.5">
              <Building className="h-5 w-5 text-[#FFAA4F]" />
              <span>{location.localArchitecture.title}</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {location.localArchitecture.description}
            </p>
            <ul className="space-y-2.5 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
              {location.localArchitecture.popularProperties.map((prop, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{prop}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. BUILDER TRADE INSIGHTS & ENGINEERING NOTES */}
          {location.builderInsights && location.builderInsights.length > 0 && (
            <section aria-label="Builder Insights" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 flex items-center gap-2.5">
                <Hammer className="h-5 w-5 text-[#D97706]" />
                <span>First-Hand Builder Notes &amp; Engineering Realities</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {location.builderInsights.map((insight, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1">
                    <span className="font-bold text-[#D97706] block text-[11px] uppercase tracking-wider">Site Observation #{idx + 1}</span>
                    <p>{insight}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. PLANNING & CONSERVATION GUIDELINES */}
          <section aria-label="Planning Guidance" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 flex items-center gap-2.5">
              <FileCheck2 className="h-5 w-5 text-emerald-600" />
              <span>Local Authority Planning &amp; Council Guidance</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-bold">Council Planning Department:</strong>
                <p>{location.planningGuidelines.councilName}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-bold">Permitted Development Rules:</strong>
                <p>{location.planningGuidelines.permittedDevelopmentNotes}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-bold">Conservation Area Considerations:</strong>
                <p>{location.planningGuidelines.conservationAreaNotes}</p>
              </div>
            </div>
          </section>

          {/* 6. SERVICES AVAILABLE IN THIS AREA */}
          <section aria-label="Services Available" className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
              Construction Services in {location.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {location.servicesAvailable.map((srv, idx) => (
                <Link key={idx} href={`/services/${srv.slug}`} className="group block">
                  <div className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#FFAA4F] hover:shadow-md transition-all h-full flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-slate-900 group-hover:text-[#D97706] transition-colors text-base font-heading">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>
                    </div>
                    <div className="text-xs font-bold text-[#D97706] flex items-center gap-1">
                      <span>Explore service details</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 7. LOCAL FAQS */}
          {location.faqs.length > 0 && (
            <section aria-label="Local FAQs" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
                Frequently Asked Questions for {location.name}
              </h2>
              <div className="space-y-3">
                {location.faqs.map((faq, idx) => {
                  const isOpen = openFaqs[idx] ?? false;
                  return (
                    <div key={idx} className="rounded-2xl border border-slate-200/90 overflow-hidden transition-all">
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-4 sm:p-5 bg-[#FAFAF9] hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <span className="font-bold text-slate-900 text-sm font-heading">{faq.question}</span>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-slate-500 ml-2 shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-500 ml-2 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 8. COMMERCIAL CTA BANNER */}
          <section aria-label="Site Consultation" className="p-8 sm:p-12 rounded-3xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2">
              <Badge variant="brand" size="sm" className="bg-[#FFAA4F] text-slate-950 font-bold text-xs">
                Direct {location.name} Building Operations
              </Badge>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                {location.commercialCta.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                {location.commercialCta.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
              <Button
                href={location.commercialCta.buttonHref}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-sm px-8 py-4 shadow-md"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {location.commercialCta.buttonText}
              </Button>
              <Button
                href="/plan-my-project"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-slate-800 border-slate-300 hover:bg-white text-xs sm:text-sm px-6 py-4"
              >
                Plan Project Live
              </Button>
            </div>
          </section>

          {/* 9. NEARBY AREAS CONTEXTUAL INTERNAL LINKS */}
          {location.nearbyAreas && location.nearbyAreas.length > 0 && (
            <section aria-label="Nearby Areas" className="space-y-3">
              <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-500">
                Explore Neighboring Service Areas:
              </h3>
              <div className="flex flex-wrap gap-2">
                {location.nearbyAreas.map((nb, idx) => (
                  <Link
                    key={idx}
                    href={`/areas/${nb.slug}`}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#FFAA4F] hover:text-[#D97706] text-slate-700 text-xs font-bold transition-all shadow-xs"
                  >
                    Builders in {nb.name} →
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 10. RELATED TOOLS & COST GUIDES */}
          <section aria-label="Related Tools" className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-extrabold font-heading text-slate-900">
              Related Calculators &amp; Cost Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href={`/calculators/${location.relatedCalculatorSlug}`} className="group block">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#FFAA4F] hover:shadow-xs transition-all flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-[#D97706] transition-colors text-sm">
                      Interactive Build Calculator
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Calculate costs live</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-[#D97706] transition-colors shrink-0 ml-3" />
                </div>
              </Link>
              <Link href={`/cost-guides/${location.relatedCostGuideSlug}`} className="group block">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#FFAA4F] hover:shadow-xs transition-all flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-[#D97706] transition-colors text-sm">
                      2026 UK Cost Guide
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Explore detailed price per m² data</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-[#D97706] transition-colors shrink-0 ml-3" />
                </div>
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </article>
  );
};
