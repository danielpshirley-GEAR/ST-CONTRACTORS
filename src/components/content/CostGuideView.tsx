'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CostGuide } from '@/lib/content/types';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import {
  Calculator,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Clock,
  PoundSterling,
  AlertCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Building,
  Phone,
  ArrowUpRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { clsx } from 'clsx';
import { BuilderInsightsCard } from '@/components/knowledge/BuilderInsightsCard';
import { constructionKnowledgeBank } from '@/lib/knowledge/knowledge-bank';

interface CostGuideViewProps {
  guide: CostGuide;
}

export const CostGuideView: React.FC<CostGuideViewProps> = ({ guide }) => {
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
            { name: 'Cost Guides', href: '/cost-guides' },
            { name: guide.title },
          ]}
          className="mb-8 text-slate-500"
        />

        {/* 1. HERO HEADER */}
        <header className="max-w-4xl mb-12 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" size="sm" className="bg-amber-100 text-amber-900 border-amber-300 font-bold text-xs">
              2026 UK Build Benchmark
            </Badge>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5" />
              Updated February 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
            {guide.h1}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {guide.subtitle}
          </p>

          {/* Quick Benchmark Card */}
          <div className="mt-6 p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Typical UK Budget Range
              </span>
              <div className="text-3xl sm:text-4xl font-bold font-heading text-white tabular-numbers">
                {guide.indicativeRange.formatted}
              </div>
              <p className="text-xs text-slate-400">
                {guide.indicativeRange.unit} • Indicative planning benchmark including 10% contingency.
              </p>
            </div>
            <Button
              href={guide.commercialCta.buttonHref}
              variant="primary"
              size="lg"
              className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-sm px-6 py-3.5 shrink-0 shadow-md"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Estimate Your Space Live →
            </Button>
          </div>
        </header>

        {/* 2. INTRODUCTION */}
        <section aria-label="Overview" className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-10 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
            Project Overview &amp; Market Context
          </h2>
          <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {guide.introParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </section>

        {/* 3. PRICE TABLE */}
        <section aria-label="Price Breakdown" className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-10 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
              {guide.priceTable.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Transparent price per m² and turnkey estimates based on recent UK contractor data.
            </p>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  <th className="py-3 pr-4">Project Format</th>
                  <th className="py-3 px-4">Indicative Range</th>
                  {guide.priceTable.rows.some((r) => r.perM2) && <th className="py-3 px-4">Rate per m²</th>}
                  <th className="py-3 pl-4">Specification Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {guide.priceTable.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-4 font-bold text-slate-900">{row.type}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-700 whitespace-nowrap">{row.guideRange}</td>
                    {guide.priceTable.rows.some((r) => r.perM2) && (
                      <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">{row.perM2 || '—'}</td>
                    )}
                    <td className="py-3.5 pl-4 text-slate-500 text-xs">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. COST FACTORS & DRIVERS */}
        <section aria-label="Cost Factors" className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-10 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
            Key Construction Cost Factors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {guide.costFactors.map((factor, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base font-heading">
                  {factor.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FINISH LEVEL MATRIX */}
        <section aria-label="Finish Levels" className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-10 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
              Finish Level Specifications
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              How internal specification and material quality influence total build budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {guide.finishLevels.map((lvl, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm font-heading">{lvl.level}</span>
                    <Badge variant="brand" size="sm" className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-bold">
                      {lvl.multiplier}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">{lvl.description}</p>
                </div>
                <ul className="space-y-1.5 pt-3 border-t border-slate-200 text-xs text-slate-700">
                  {lvl.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 6. PROJECT TIMELINE */}
        <section aria-label="Timeline" className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-10 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
              Realistic Construction Timeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Typical build schedule from site mobilization to completion certificate.
            </p>
          </div>

          <div className="space-y-3">
            {guide.timeline.map((stage, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 font-heading">{stage.stage}</div>
                  <div className="text-slate-500 text-xs">{stage.description}</div>
                </div>
                <span className="font-bold text-amber-700 font-mono shrink-0 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 self-start sm:self-auto">
                  {stage.duration}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 7. COMMON ADDITIONAL COSTS */}
        <section aria-label="Additional Costs" className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-10 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
            Professional Fees &amp; Statutory Costs
          </h2>
          <div className="space-y-3">
            {guide.commonAdditionalCosts.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                <div>
                  <strong className="text-slate-900 block font-semibold">{item.item}</strong>
                  <span className="text-slate-500 text-xs">{item.description}</span>
                </div>
                <span className="font-bold text-slate-900 font-mono shrink-0">{item.cost}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 7.5 FIRST-HAND BUILDER EXPERTISE & STRIP-OUT REALITIES */}
        <div className="max-w-4xl">
          <BuilderInsightsCard
            records={constructionKnowledgeBank.filter(
              (r) =>
                r.approvedForPublicContent &&
                (guide.slug.includes('extension')
                  ? r.serviceSlugs.includes('extension')
                  : guide.slug.includes('kitchen')
                  ? r.serviceSlugs.includes('kitchen-renovation')
                  : guide.slug.includes('bathroom')
                  ? r.serviceSlugs.includes('bathroom-renovation')
                  : true)
            )}
          />
        </div>

        {/* 8. FAQS */}
        {guide.faqs.length > 0 && (
          <section aria-label="FAQs" className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {guide.faqs.map((faq, idx) => {
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

        {/* 9. COMMERCIAL CONVERSION HERO BANNER */}
        <section aria-label="Project Planning Consultation" className="max-w-4xl p-8 sm:p-12 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm mb-12">
          <div className="space-y-2">
            <Badge variant="brand" size="sm" className="bg-[#FFAA4F] text-slate-950 font-bold text-xs">
              Apex Turnkey Construction
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {guide.commercialCta.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              {guide.commercialCta.description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <Button
              href={guide.commercialCta.buttonHref}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-sm px-8 py-4 shadow-md"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {guide.commercialCta.buttonText}
            </Button>
            <Button
              href="/contact?type=consultation"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-slate-800 border-slate-300 hover:bg-white text-xs sm:text-sm px-6 py-4"
              leftIcon={<Phone className="h-4 w-4 text-amber-600" />}
            >
              Book Consultation
            </Button>
          </div>
        </section>

        {/* 10. RELATED TOOLS & SERVICES (Intentional Commercial Journey) */}
        <section aria-label="Related Tools & Services" className="max-w-4xl space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900">
            Related Construction Calculators &amp; Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href={`/calculators/${guide.relatedCalculatorSlug}`} className="group block">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-sm">
                    Interactive Cost Calculator
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Calculate materials &amp; labor live</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0 ml-3" />
              </div>
            </Link>
            <Link href={`/services/${guide.relatedServiceSlug}`} className="group block">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-sm">
                    Professional Building Services
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Explore our turnkey delivery standards</div>
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
