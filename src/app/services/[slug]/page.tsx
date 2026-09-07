import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { servicesData } from '@/config/services';
import { caseStudiesData } from '@/config/case-studies';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Accordion } from '@/components/ui/Accordion';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { siteConfig } from '@/config/site';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  PoundSterling,
  Shield,
  FileText,
  HelpCircle,
  Phone,
  Layers,
  AlertTriangle,
  Lightbulb,
  Check,
  X,
  Compass,
  Sparkles,
  Building,
  MapPin,
  Calculator,
  ChevronRight,
} from 'lucide-react';
import { BuilderInsightsCard } from '@/components/knowledge/BuilderInsightsCard';
import { constructionKnowledgeBank } from '@/lib/knowledge/knowledge-bank';

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = servicesData.find((s) => s.slug === params.slug);
  if (!service) return {};

  const title = service.seoTitle || `${service.title} | ${siteConfig.name}`;
  const description = service.metaDescription || service.shortDescription;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/services/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/services/${service.slug}`,
      siteName: siteConfig.name,
      images: [{ url: service.heroImage, width: 1200, height: 630, alt: service.title }],
      locale: 'en_GB',
      type: 'website',
    },
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = servicesData.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const relatedCaseStudies = caseStudiesData.filter(
    (cs) => cs.serviceSlug === service.slug || (service.slug === 'extensions' && cs.serviceSlug.includes('extension'))
  );

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${siteConfig.url}/services/${service.slug}#service`,
        name: service.title,
        description: service.shortDescription,
        provider: {
          '@type': 'HomeAndConstructionBusiness',
          name: siteConfig.name,
          telephone: siteConfig.company.phone,
          email: siteConfig.company.email,
          url: siteConfig.url,
          address: {
            '@type': 'PostalAddress',
            streetAddress: siteConfig.company.address,
            addressLocality: 'London',
            addressCountry: 'GB',
          },
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'London and South East England',
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'GBP',
          description: service.indicativePriceRange,
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: service.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteConfig.url,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: `${siteConfig.url}/services`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: service.title,
            item: `${siteConfig.url}/services/${service.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-50 text-slate-900 pt-10 pb-16 sm:pb-20 overflow-hidden border-b border-slate-200">
        <Container>
          <Breadcrumbs
            items={[
              { name: 'Services', href: '/services' },
              { name: service.title },
            ]}
            className="mb-8 text-slate-500"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="h-3.5 w-3.5 text-[#FFAA4F]" />
                <span>London Design &amp; Build Specialists</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
                {service.h1 || service.title}
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                {service.fullDescription}
              </p>

              {/* Key Quick Facts Grid */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200">
                {service.quickFacts.map((fact, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                      {fact.label}
                    </span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block tabular-numbers">
                      {fact.value}
                    </span>
                    {fact.detail && (
                      <span className="text-[11px] text-slate-500 block mt-0.5 line-clamp-1">
                        {fact.detail}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  href={`/plan-my-project?service=${service.slug}`}
                  variant="primary"
                  size="lg"
                  className="text-xs sm:text-sm font-extrabold justify-center bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 shadow-md border border-[#E69335]"
                  rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                >
                  Plan My {service.title}
                </Button>
                <Button
                  href="/contact?type=consultation"
                  variant="outline"
                  size="lg"
                  className="text-xs sm:text-sm text-slate-800 bg-white border-slate-300 hover:bg-slate-100 justify-center font-bold"
                >
                  Book Free Site Survey
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5 relative h-80 sm:h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <Image
                src={service.heroImage}
                alt={service.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 text-slate-900 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{service.title} Guarantee</span>
                    <span className="text-[11px] text-slate-600 block">Fixed-price contracts &amp; 10-year warranty</span>
                  </div>
                  <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold text-[10px] px-2.5 py-1">
                    Turnkey
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. WHAT IS THIS SERVICE & WHO IS IT FOR? */}
      {service.whatIs && (
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
                  Homeowner Education
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  What is a {service.title}?
                </h2>
                <p className="mt-3 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                  {service.whatIs.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Problems Solved */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#FFAA4F]" />
                    <span>Common Problems This Solves</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {service.whatIs.problemsSolved.map((prob, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FFAA4F] mt-1.5 shrink-0" />
                        <span>{prob}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Who is it for */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="h-5 w-5 text-[#FFAA4F]" />
                    <span>Properties &amp; Situations Best Suited</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {service.whatIs.suitableFor.map((suit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{suit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Alternative note */}
              {service.whatIs.whenAlternativeBetter && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-[#FFAA4F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">When another option might make more sense: </strong>
                    <span className="text-amber-900">{service.whatIs.whenAlternativeBetter}</span>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* 3. TYPES & OPTIONS (DEEP DIVE) */}
      {service.typesAndOptions && service.typesAndOptions.length > 0 && (
        <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
                Explore Your Options
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-heading">
                Types of {service.title}
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
                Compare the main design configurations, structural requirements, spatial gains, and planning considerations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {service.typesAndOptions.map((opt, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
                          Option {idx + 1}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 font-heading mt-0.5">
                          {opt.title}
                        </h3>
                      </div>
                      <Badge variant="slate" className="bg-slate-100 text-slate-800 border-slate-200 font-bold text-xs shrink-0">
                        {opt.costTier}
                      </Badge>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {opt.description}
                    </p>

                    {/* Pros & Cons */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">Main Advantages:</span>
                        {opt.advantages.map((adv, aIdx) => (
                          <div key={aIdx} className="flex items-start gap-1.5 text-slate-700">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{adv}</span>
                          </div>
                        ))}
                      </div>

                      {opt.disadvantages.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">Considerations:</span>
                          {opt.disadvantages.map((dis, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-1.5 text-slate-500">
                              <span className="text-slate-400 text-xs">•</span>
                              <span>{dis}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-3.5 rounded-2xl">
                    {opt.spaceRequired && (
                      <div>
                        <strong className="text-slate-700">Space Needed:</strong> {opt.spaceRequired}
                      </div>
                    )}
                    <div>
                      <strong className="text-slate-700">Planning:</strong> {opt.planningNotes}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            {service.comparisonTable && (
              <div className="mt-12 max-w-5xl mx-auto">
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 font-heading">
                      {service.title} Quick Comparison Matrix
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                          {service.comparisonTable.headers.map((h, i) => (
                            <th key={i} className="p-3.5 sm:p-4 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {service.comparisonTable.rows.map((row, rIdx) => {
                          const values = Object.values(row);
                          return (
                            <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                              {values.map((val, vIdx) => (
                                <td
                                  key={vIdx}
                                  className={`p-3.5 sm:p-4 ${
                                    vIdx === 0
                                      ? 'font-bold text-slate-900'
                                      : val.includes('£')
                                      ? 'font-bold text-[#FFAA4F]'
                                      : 'text-slate-600'
                                  }`}
                                >
                                  {val}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* 4. IDEAS & ARCHITECTURAL INSPIRATION */}
      {service.designIdeas && service.designIdeas.length > 0 && (
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
                Design &amp; Inspiration
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-heading">
                Ideas for Your {service.title}
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
                Modern architectural features, material finishes, and spatial details popular with London homeowners.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {service.designIdeas.map((idea, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <Badge variant="slate" className="bg-white text-slate-800 border-slate-200 text-[10px] font-bold">
                      {idea.category}
                    </Badge>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      {idea.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {idea.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 5. HOMEOWNER PLANNING CHECKLIST */}
      {service.homeownerChecklist && service.homeownerChecklist.length > 0 && (
        <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
          <Container>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
                  Preparation Guide
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  Things to Think About Before Starting Your {service.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Key practical questions to consider before commissioning architectural drawings or contractors.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {service.homeownerChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 font-medium">
                    <span className="h-6 w-6 rounded-full bg-[#FFAA4F] text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs border border-[#E69335]">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 6. WHAT AFFECTS THE COST? (IN-DEPTH COST EDUCATION) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
                Transparent Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-heading">
                What Affects the Cost of a {service.title}?
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
                Why construction estimates vary and how specific decisions impact your total project budget.
              </p>
            </div>

            {/* Detailed Cost Factors */}
            {service.costFactorsDetailed && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {service.costFactorsDetailed.map((cf, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                      <PoundSterling className="h-4 w-4 text-[#FFAA4F]" />
                      <span>{cf.title}</span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {cf.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Total Budget Formula Box */}
            {service.budgetFormula && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-[#FFAA4F] uppercase tracking-wider block">
                      Total Project Formula
                    </span>
                    <h3 className="text-xl font-bold font-heading text-white mt-0.5">
                      How to Structure Your Total {service.title} Budget
                    </h3>
                  </div>
                  {service.connectedCalculator && (
                    <Button
                      href={`/calculators/${service.connectedCalculator.slug}`}
                      variant="primary"
                      size="sm"
                      className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-extrabold text-xs px-4 py-2 border border-[#E69335] shrink-0"
                      rightIcon={<Calculator className="h-3.5 w-3.5" />}
                    >
                      {service.connectedCalculator.ctaText}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">1. Construction</span>
                    <span className="font-bold text-white text-xs mt-1 block">{service.budgetFormula.constructionPercent}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">2. Professional Fees</span>
                    <span className="font-bold text-white text-xs mt-1 block">{service.budgetFormula.feesPercent}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">3. Fixtures &amp; Finishes</span>
                    <span className="font-bold text-white text-xs mt-1 block">{service.budgetFormula.finishesPercent}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">4. Contingency</span>
                    <span className="font-bold text-emerald-400 text-xs mt-1 block">{service.budgetFormula.contingencyPercent}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed italic">
                  Note: {service.budgetFormula.notes}
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* 7. STEP-BY-STEP PROCESS */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
              Turnkey Management
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-heading">
              The Step-by-Step Construction Process
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
              How our project directors, engineers, and site managers deliver your {service.title.toLowerCase()} smoothly from survey to completion.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {service.stages.map((stage, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#FFAA4F] text-slate-950 flex items-center justify-center font-extrabold font-heading text-base sm:text-lg shadow-xs border border-[#E69335]">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                    {stage.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 8. TECHNICAL TERMS IN PLAIN ENGLISH ("JARGON BUSTER") */}
      {service.technicalJargonBuster && service.technicalJargonBuster.length > 0 && (
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
                  Demystifying Construction
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  Technical Terms Explained in Plain English
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Understand the terminology your architect, structural engineer, and builders use on site.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.technicalJargonBuster.map((jargon, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block text-[#FFAA4F]">
                      {jargon.term}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {jargon.plainEnglishMeaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 9. PLANNING & BUILDING REGULATIONS */}
      {service.planningAndRegulations && (
        <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
                  Legal &amp; Regulatory Guidance
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  Planning Permission &amp; Building Regulations
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Understanding the critical difference between planning consent and mandatory Building Regulations sign-off.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <FileText className="h-5 w-5 text-[#FFAA4F]" />
                    <span>Planning Permission &amp; Permitted Development</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {service.planningAndRegulations.planningPermission}
                  </p>
                  <p className="text-xs text-slate-500 italic pt-2 border-t border-slate-100">
                    {service.planningAndRegulations.permittedDevelopment}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    <span>Mandatory Building Regulations</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {service.planningAndRegulations.buildingRegulations}
                  </p>
                  {service.planningAndRegulations.partyWallNotes && (
                    <p className="text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 mt-2">
                      <strong>Party Wall Act: </strong>{service.planningAndRegulations.partyWallNotes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 10. LONDON PROPERTY REALITIES */}
      {service.londonPropertyRealities && service.londonPropertyRealities.length > 0 && (
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
                  Local Expertise
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  London Property Realities &amp; On-Site Logistics
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  How our construction teams navigate the practical realities of Victorian terraces, parking suspensions, and London building constraints.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {service.londonPropertyRealities.map((real, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-[#FFAA4F] shrink-0" />
                      <span>{real.title}</span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {real.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 11. COMMON MISTAKES TO AVOID */}
      {service.commonMistakes && service.commonMistakes.length > 0 && (
        <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
                  Expert Advice
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  Common Mistakes to Avoid
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Real lessons from London construction sites to protect your timeline and budget.
                </p>
              </div>

              <div className="space-y-4">
                {service.commonMistakes.map((mis, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600 shrink-0 mt-0.5">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 font-heading">
                        Mistake: {mis.mistake}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 pl-8 leading-relaxed">
                      <strong className="text-slate-800">Why it causes problems: </strong>{mis.whyItCausesProblems}
                    </p>
                    <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl ml-8">
                      <strong>How to avoid it: </strong>{mis.howToAvoid}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 12. VERIFIED LONDON BUILDER EXPERIENCE (KNOWLEDGE BANK) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <Container>
          <div className="max-w-4xl mx-auto">
            <BuilderInsightsCard
              records={constructionKnowledgeBank.filter(
                (r) =>
                  r.approvedForPublicContent &&
                  (r.serviceSlugs.includes(service.slug as any) ||
                    (service.slug === 'extensions' && r.serviceSlugs.includes('extension')) ||
                    (service.slug === 'kitchen-renovations' && r.serviceSlugs.includes('kitchen-renovation')) ||
                    (service.slug === 'bathroom-renovations' && r.serviceSlugs.includes('bathroom-renovation')) ||
                    (service.slug === 'renovations' && r.serviceSlugs.includes('full-renovation')) ||
                    (service.slug === 'loft-conversions' && r.serviceSlugs.includes('loft-conversion')) ||
                    (service.slug === 'garden-rooms' && r.serviceSlugs.includes('garden-room')) ||
                    (service.slug === 'driveways' && r.serviceSlugs.includes('driveway')) ||
                    (service.slug === 'landscaping' && r.serviceSlugs.includes('landscaping')))
              )}
            />
          </div>
        </Container>
      </section>

      {/* 13. RELATED CASE STUDIES */}
      {relatedCaseStudies.length > 0 && (
        <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
                Completed Work
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-heading">
                Recent {service.title} Projects
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
                View real project challenges, architectural solutions, timelines, and before &amp; after photography.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {relatedCaseStudies.map((study) => (
                <Card key={study.id} hoverEffect className="flex flex-col justify-between bg-white border-slate-200 rounded-3xl overflow-hidden shadow-md">
                  <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={study.coverImage}
                      alt={study.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="slate" className="bg-slate-950/85 text-white border-slate-800 font-semibold text-xs">
                        {study.location}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">
                      {study.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {study.customerObjective}
                    </p>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 tabular-numbers">
                        {study.indicativeCost} • {study.duration}
                      </span>
                      <Link
                        href={`/projects/${study.slug}`}
                        className="text-xs font-bold text-[#FFAA4F] hover:text-amber-800 inline-flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-amber-500 rounded p-1"
                      >
                        Case Study <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 14. COMPREHENSIVE SERVICE FAQS */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <Container size="md">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-heading">
              {service.title} FAQs
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
              Direct, factual answers to common questions asked before commissioning a {service.title.toLowerCase()}.
            </p>
          </div>

          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <Accordion
              items={service.faqs.map((faq) => ({
                title: faq.question,
                content: <span className="text-slate-600 leading-relaxed font-normal">{faq.answer}</span>,
              }))}
            />
          </div>
        </Container>
      </section>

      {/* 15. CLOSING CONTEXTUAL CONVERSION ANCHOR */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 architectural-grid opacity-10 pointer-events-none" />
        <Container size="md" className="relative z-10 text-center space-y-6">
          <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold text-xs px-3 py-1 mx-auto">
            Fixed-Price Turnkey Delivery
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            Ready to Plan Your {service.title}?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
            Use our interactive AI Project Planner to customize your room-by-room specifications and generate an estimated budget breakdown in minutes.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href={`/plan-my-project?service=${service.slug}`}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto text-sm font-extrabold bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335] shadow-lg"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Plan My {service.title}
            </Button>
            <Button
              href="/contact?type=consultation"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-white bg-slate-800 hover:bg-slate-700 border-slate-600 text-sm font-bold"
            >
              Book Free Site Survey
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
