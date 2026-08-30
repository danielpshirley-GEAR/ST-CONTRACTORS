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
import { SectionHeading } from '@/components/ui/SectionHeading';
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

  return {
    title: `${service.title} Specialists | ${siteConfig.shortName}`,
    description: service.shortDescription,
    openGraph: {
      title: `${service.title} | ${siteConfig.name}`,
      description: service.shortDescription,
      images: [{ url: service.heroImage }],
    },
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = servicesData.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const relatedCaseStudies = caseStudiesData.filter(
    (cs) => cs.serviceSlug === service.slug
  );

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* 1. HERO SECTION (LIGHT GREY) */}
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
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
                {service.title}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                {service.fullDescription}
              </p>

              {/* Key Quick Facts Grid */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Indicative Cost
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 mt-1 block tabular-numbers">
                    {service.indicativePriceRange}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Typical Duration
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 mt-1 block">
                    {service.typicalDuration}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Warranty
                  </span>
                  <span className="text-sm sm:text-base font-bold text-emerald-600 mt-1 block">
                    10-Year Guarantee
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  href={`/plan-my-project?service=${service.slug}`}
                  variant="primary"
                  size="lg"
                  className="text-xs sm:text-sm font-bold justify-center bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 shadow-md border border-[#E69335]"
                  rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                >
                  Plan My {service.title}
                </Button>
                <Button
                  href="/contact?type=consultation"
                  variant="outline"
                  size="lg"
                  className="text-xs sm:text-sm text-slate-800 border-slate-300 hover:bg-slate-100 justify-center"
                >
                  Book Free Site Survey
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5 relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              <Image
                src={service.heroImage}
                alt={service.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. KEY BENEFITS & ADVANTAGES (WHITE) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mb-8 text-center sm:text-left">
              Why Homeowners Choose Us for {service.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {service.keyBenefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs"
                >
                  <div className="p-2 rounded-xl bg-amber-100 text-[#FFAA4F] flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">
                      {benefit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 3. STEP-BY-STEP PROCESS (LIGHT GREY) */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-heading">
              The Step-by-Step Delivery Process
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
              How our project management team plans, coordinates, and builds your {service.title.toLowerCase()} from initial survey to completion.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-5">
            {service.stages.map((stage, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 sm:gap-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-md"
              >
                <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#FFAA4F] text-slate-950 flex items-center justify-center font-bold font-heading text-lg shadow-xs border border-[#E69335]">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    {stage.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. PLANNING PERMISSION & COST DRIVERS GUIDANCE (WHITE) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <Container>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Planning Info Box */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-2 text-[#FFAA4F] font-bold text-sm mb-3">
                <FileText className="h-5 w-5" aria-hidden="true" />
                <span>Planning &amp; Permitted Development</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">
                Do You Need Planning Permission?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {service.planningGuidance}
              </p>
            </div>

            {/* Cost Drivers Box */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-2 text-[#FFAA4F] font-bold text-sm mb-3">
                <PoundSterling className="h-5 w-5" aria-hidden="true" />
                <span>Key Budget Considerations</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">
                What Influences the Overall Cost?
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {service.costDrivers.map((driver, idx) => (
                  <li key={idx} className="flex items-center gap-2 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFAA4F] flex-shrink-0" aria-hidden="true" />
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4.5 VERIFIED LONDON BUILDER EXPERIENCE */}
          <div className="mt-16 pt-12 border-t border-slate-200">
            <BuilderInsightsCard
              records={constructionKnowledgeBank.filter(
                (r) =>
                  r.approvedForPublicContent &&
                  (r.serviceSlugs.includes(service.slug as any) ||
                    (service.slug === 'extensions' && r.serviceSlugs.includes('extension')) ||
                    (service.slug === 'kitchen-renovations' && r.serviceSlugs.includes('kitchen-renovation')) ||
                    (service.slug === 'bathroom-renovations' && r.serviceSlugs.includes('bathroom-renovation')) ||
                    (service.slug === 'full-house-renovations' && r.serviceSlugs.includes('full-renovation')) ||
                    (service.slug === 'loft-conversions' && r.serviceSlugs.includes('loft-conversion')))
              )}
            />
          </div>
        </Container>
      </section>

      {/* 5. RELATED CASE STUDIES (LIGHT GREY) */}
      {relatedCaseStudies.length > 0 && (
        <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-heading">
                Recent {service.title} Projects
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
                View real project challenges, solutions, timelines, and before &amp; after photographs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {relatedCaseStudies.map((study) => (
                <Card key={study.id} hoverEffect className="flex flex-col justify-between bg-white border-slate-200 rounded-3xl overflow-hidden shadow-md">
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
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

      {/* 6. SERVICE FAQS (WHITE) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <Container size="md">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-heading">
              {service.title} FAQs
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
              Answers to common queries about construction logistics, timelines, and guarantees.
            </p>
          </div>

          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
            <Accordion
              items={service.faqs.map((faq) => ({
                title: faq.question,
                content: <span className="text-slate-600 leading-relaxed">{faq.answer}</span>,
              }))}
            />
          </div>
        </Container>
      </section>

      {/* 7. BOTTOM SERVICE CONVERSION BANNER (CLEAN CLOSING ANCHOR) */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80 text-slate-900">
        <Container size="md" className="text-center">
          <h2 className="text-3xl font-bold font-heading text-slate-900">
            Ready to discuss your {service.title.toLowerCase()}?
          </h2>
          <p className="mt-3 text-slate-600 text-sm max-w-xl mx-auto leading-relaxed font-normal">
            Our estimating team is ready to review your property details, explain structural options, and provide a comprehensive project consultation.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href={`/plan-my-project?service=${service.slug}`}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto text-sm font-bold bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335]"
              rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            >
              Plan My {service.title}
            </Button>
            <Button
              href="/contact?type=consultation"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-slate-900 bg-white border-2 border-slate-950 hover:bg-slate-950 hover:text-white text-sm font-bold"
            >
              Book Free Site Survey
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
