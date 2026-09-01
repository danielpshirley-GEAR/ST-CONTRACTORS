'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ShieldCheck,
  Hammer,
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
    <article className="py-10 sm:py-16 bg-[#FAFAF9] text-slate-900 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { name: 'Cost Guides', href: '/cost-guides' },
              { name: guide.title },
            ]}
            className="text-slate-500"
          />

          {/* 1. HERO HEADER (CENTERED & BALANCED) */}
          <header className="space-y-5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" size="sm" className="bg-[#FFAA4F]/20 text-slate-950 border-[#FFAA4F] font-bold text-xs">
                2026 UK Build Benchmark
              </Badge>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                <Clock className="h-3.5 w-3.5 text-[#FFAA4F]" />
                Updated February 2026
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 font-heading leading-tight">
              {guide.h1}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {guide.subtitle}
            </p>

            {/* Quick Benchmark Card (Warm Charcoal & Golden Orange) */}
            <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-[#0E1013] text-white shadow-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFAA4F]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-1 relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFAA4F] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#FFAA4F]" />
                  Typical London Budget Range
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-heading text-white tabular-numbers tracking-tight">
                  {guide.indicativeRange.formatted}
                </div>
                <p className="text-xs text-slate-400">
                  {guide.indicativeRange.unit} • Fixed-price turnkey benchmark including 10% contingency.
                </p>
              </div>
              <Button
                href={guide.commercialCta.buttonHref}
                variant="primary"
                size="lg"
                className="bg-[#FFAA4F] hover:bg-[#FFB86A] text-slate-950 font-extrabold text-sm px-7 py-4 shrink-0 shadow-[0_4px_20px_rgba(255,170,79,0.35)] relative z-10 transition-all cursor-pointer"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Estimate Your Space Live →
              </Button>
            </div>
          </header>

          {/* 2. FEATURED HERO IMAGE #1: ARCHITECTURAL EXTERIOR */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
            <img
              src="/images/cost-guides/wraparound-exterior.jpg"
              alt="Luxury modern Victorian wraparound house extension in London with frameless glass and London stock brick"
              className="w-full h-[360px] sm:h-[480px] object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-2 text-white">
              <div>
                <span className="bg-[#FFAA4F] text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider">
                  Real London Case Study
                </span>
                <p className="text-sm font-bold text-white mt-1">
                  Victorian Wraparound with Slimline 20mm Sliding Glazing &amp; Reclaimed Stock Brick
                </p>
              </div>
              <span className="text-xs text-slate-300 font-medium">Turnkey Delivery: 16 Weeks</span>
            </div>
          </div>

          {/* 3. INTRODUCTION & PROJECT OVERVIEW */}
          <section aria-label="Overview" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 text-left">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-950 flex items-center gap-2">
              <span className="h-6 w-1.5 rounded-full bg-[#FFAA4F]" />
              Project Overview &amp; Market Context
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {guide.introParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </section>

          {/* 4. PRICE TABLE */}
          <section aria-label="Price Breakdown" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5 text-left">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-950 flex items-center gap-2">
                <span className="h-6 w-1.5 rounded-full bg-[#FFAA4F]" />
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
                    <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-4 pr-4 font-bold text-slate-900">{row.type}</td>
                      <td className="py-4 px-4 font-extrabold text-[#D97706] tabular-numbers">{row.guideRange}</td>
                      {row.perM2 && <td className="py-4 px-4 font-mono text-slate-600">{row.perM2}</td>}
                      <td className="py-4 pl-4 text-xs text-slate-500 leading-relaxed">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. FEATURED IMAGE #2: OPEN-PLAN INTERIOR LIVING */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
            <img
              src="/images/cost-guides/wraparound-interior.jpg"
              alt="Open-plan modern kitchen with marble waterfall island and structural roof lantern"
              className="w-full h-[360px] sm:h-[440px] object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-2 text-white">
              <div>
                <span className="bg-[#FFAA4F] text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider">
                  Interior Spatial Design
                </span>
                <p className="text-sm font-bold text-white mt-1">
                  Frameless Roof Lantern Deep Core Lighting &amp; Bespoke Fluted Oak Joinery
                </p>
              </div>
              <span className="text-xs text-slate-300 font-medium">Bespoke Finish: Standard on ST CONTRACTORS Builds</span>
            </div>
          </div>

          {/* 6. STRUCTURAL FACTORS & COST DRIVERS */}
          <section aria-label="Cost Factors" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 text-left">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-950 flex items-center gap-2">
                <span className="h-6 w-1.5 rounded-full bg-[#FFAA4F]" />
                Key Structural &amp; Engineering Cost Factors
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                What drives the difference between baseline quotes and high-specification architectural builds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guide.costFactors.map((factor, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#FAFAF9] border border-slate-200/90 space-y-2 hover:border-[#FFAA4F]/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-[#FFAA4F]/20 text-[#D97706] flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{factor.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{factor.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. FEATURED IMAGE #3: STRUCTURAL STEEL GOALPOST INSTALLATION */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
            <img
              src="/images/cost-guides/wraparound-steelwork.jpg"
              alt="Contractor precision laser levelling 3-steel RSJ goalpost frame on concrete padstones for London wraparound extension"
              className="w-full h-[340px] sm:h-[420px] object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-2 text-white">
              <div>
                <span className="bg-[#FFAA4F] text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider">
                  Structural Engineering Phase
                </span>
                <p className="text-sm font-bold text-white mt-1">
                  Precision 3-Steel Goalpost Frame Bearing on Engineered Concrete Padstones
                </p>
              </div>
              <span className="text-xs text-slate-300 font-medium">Building Regulations Part A Sign-Off</span>
            </div>
          </div>

          {/* 8. BUILDER INSIGHTS CARD */}
          <div className="text-left">
            <BuilderInsightsCard
              records={constructionKnowledgeBank.filter((k) => k.serviceSlugs?.includes('extension') || k.id === 'KB-EXT-001')}
            />
          </div>

          {/* 9. TIMELINE PHASES */}
          {guide.timeline && (
            <section aria-label="Project Timeline" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5 text-left">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-950 flex items-center gap-2">
                  <span className="h-6 w-1.5 rounded-full bg-[#FFAA4F]" />
                  Expected Construction Schedule &amp; Sequence
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  How our principal contracting team stages trade sequences from excavation to final decoration.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {guide.timeline.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200/90 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-[#FFAA4F]/20 px-2 py-0.5 rounded-md">
                      {step.duration}
                    </span>
                    <h3 className="font-bold text-xs text-slate-900 mt-1">{step.stage}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 10. FAQS */}
          {guide.faqs && guide.faqs.length > 0 && (
            <section aria-label="Frequently Asked Questions" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 text-left">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-950 flex items-center gap-2">
                <span className="h-6 w-1.5 rounded-full bg-[#FFAA4F]" />
                Frequently Asked Homeowner Questions
              </h2>

              <div className="space-y-3 pt-2">
                {guide.faqs.map((faq, idx) => {
                  const isOpen = openFaqs[idx] ?? false;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-4 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 bg-[#FAFAF9] hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-[#D97706]" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="p-4 text-xs sm:text-sm text-slate-600 bg-white border-t border-slate-200 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 11. COMMERCIAL CONVERSION HERO BANNER (WARM CHARCOAL + GOLDEN ORANGE) */}
          <section aria-label="Project Planning Consultation" className="p-8 sm:p-12 rounded-3xl bg-[#0E1013] text-white border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFAA4F]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3 relative z-10 max-w-xl">
              <Badge variant="brand" size="sm" className="bg-[#FFAA4F] text-slate-950 font-black text-xs">
                ST CONTRACTORS Turnkey Delivery
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                {guide.commercialCta.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {guide.commercialCta.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0 relative z-10">
              <Button
                href={guide.commercialCta.buttonHref}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#FFB86A] text-slate-950 font-black text-sm px-8 py-4 shadow-[0_4px_20px_rgba(255,170,79,0.35)] transition-all cursor-pointer"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {guide.commercialCta.buttonText}
              </Button>
            </div>
          </section>
        </div>
      </Container>
    </article>
  );
};
