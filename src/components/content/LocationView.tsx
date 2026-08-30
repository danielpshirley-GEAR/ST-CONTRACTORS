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
} from 'lucide-react';

interface LocationViewProps {
  location: LocationAreaGuide;
}

export const LocationView: React.FC<LocationViewProps> = ({ location }) => {
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true });

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <article className="py-10 sm:py-16 bg-slate-50 text-slate-900 min-h-screen text-left">
      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: 'Service Areas', href: '/areas' },
            { name: location.name },
          ]}
          className="mb-8 text-slate-500"
        />

        {/* 1. HERO HEADER */}
        <header className="max-w-4xl mb-12 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" size="sm" className="bg-amber-100 text-amber-900 border-amber-300 font-bold text-xs">
              <MapPin className="h-3 w-3 mr-1 inline" />
              {location.borough}
            </Badge>
            <span className="text-xs text-slate-500 font-medium">
              Postcodes: {location.postcodes.join(', ')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
            Builders in {location.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {location.intro}
          </p>
        </header>

        {/* 2. LOCAL ARCHITECTURE & HOUSING CONTEXT */}
        <section aria-label="Local Architecture" className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-10 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <Building className="h-5 w-5 text-amber-500" />
            <span>{location.localArchitecture.title}</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {location.localArchitecture.description}
          </p>
          <ul className="space-y-2.5 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
            {location.localArchitecture.popularProperties.map((prop, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{prop}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. PLANNING & CONSERVATION GUIDELINES */}
        <section aria-label="Planning Guidance" className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-10 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-emerald-600" />
            <span>Local Planning &amp; Council Guidance</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-semibold">Council Planning Department:</strong>
              <p>{location.planningGuidelines.councilName}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-semibold">Permitted Development Rules:</strong>
              <p>{location.planningGuidelines.permittedDevelopmentNotes}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-semibold">Conservation Area Considerations:</strong>
              <p>{location.planningGuidelines.conservationAreaNotes}</p>
            </div>
          </div>
        </section>

        {/* 4. SERVICES AVAILABLE IN THIS AREA */}
        <section aria-label="Services Available" className="max-w-4xl space-y-4 mb-10">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
            Construction Services in {location.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {location.servicesAvailable.map((srv, idx) => (
              <Link key={idx} href={`/services/${srv.slug}`} className="group block">
                <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all h-full flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-base font-heading">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{srv.description}</p>
                  </div>
                  <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <span>Learn more</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. FEATURED LOCAL CASE STUDIES */}
        {location.featuredProjects.length > 0 && (
          <section aria-label="Local Projects" className="max-w-4xl space-y-4 mb-10">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
              Recent Completed Projects Near {location.name}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {location.featuredProjects.map((proj, idx) => (
                <Link key={idx} href={`/projects/${proj.slug}`} className="group block">
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="space-y-1">
                      <Badge variant="brand" size="sm" className="bg-slate-100 text-slate-700 border-slate-200 text-[10px] font-semibold">
                        {proj.type}
                      </Badge>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors font-heading">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-500">{proj.summary}</p>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 text-xs mt-2 sm:mt-0">
                      View Case Study →
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 6. LOCAL FAQS */}
        {location.faqs.length > 0 && (
          <section aria-label="Local FAQs" className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
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
                      className="w-full p-4 sm:p-5 bg-slate-50/60 hover:bg-slate-100/60 flex items-center justify-between text-left transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 text-sm font-heading">{faq.question}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-slate-500 ml-2" /> : <ChevronDown className="h-4 w-4 text-slate-500 ml-2" />}
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

        {/* 7. COMMERCIAL CTA BANNER */}
        <section aria-label="Site Consultation" className="max-w-4xl p-8 sm:p-12 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm mb-12">
          <div className="space-y-2">
            <Badge variant="brand" size="sm" className="bg-[#FFAA4F] text-slate-950 font-bold text-xs">
              Direct {location.name} Building Team
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
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

        {/* 8. RELATED TOOLS & COST GUIDES */}
        <section aria-label="Related Tools" className="max-w-4xl space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900">
            Related Calculators &amp; Cost Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href={`/calculators/${location.relatedCalculatorSlug}`} className="group block">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-sm">
                    Interactive Build Calculator
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Calculate costs live</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0 ml-3" />
              </div>
            </Link>
            <Link href={`/cost-guides/${location.relatedCostGuideSlug}`} className="group block">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-sm">
                    2026 UK Cost Guide
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Explore detailed price per m² data</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0 ml-3" />
              </div>
            </Link>
          </div>
        </section>
      </Container>
    </article>
  );
};
