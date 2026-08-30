import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseStudiesData } from '@/config/case-studies';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { siteConfig } from '@/config/site';
import {
  ArrowRight,
  MapPin,
  Clock,
  PoundSterling,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return caseStudiesData.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const study = caseStudiesData.find((s) => s.slug === params.slug);
  if (!study) return {};

  return {
    title: `${study.title} | Case Study | ${siteConfig.shortName}`,
    description: `${study.customerObjective} Located in ${study.location}. Completed in ${study.duration}.`,
    openGraph: {
      title: `${study.title} | ${siteConfig.name}`,
      description: study.customerObjective,
      images: [{ url: study.coverImage }],
    },
  };
}

export default function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const study = caseStudiesData.find((s) => s.slug === params.slug);

  if (!study) {
    notFound();
  }

  return (
    <div className="bg-white text-slate-900 min-h-screen pb-20">
      {/* 1. HERO HEADER (LIGHT GREY) */}
      <section className="bg-slate-50 text-slate-900 pt-10 pb-16 sm:pb-20 border-b border-slate-200">
        <Container>
          <Breadcrumbs
            items={[
              { name: 'Projects', href: '/projects' },
              { name: study.title },
            ]}
            className="mb-8 text-slate-500"
          />

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-bold border-none shadow-xs text-xs px-2.5 py-0.5">
                {study.projectType}
              </Badge>
              <Badge variant="slate" className="bg-white text-slate-800 border-slate-300 text-xs">
                <MapPin className="h-3 w-3 mr-1 text-[#FFAA4F]" aria-hidden="true" />
                {study.location}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
              {study.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {study.customerObjective}
            </p>

            {/* Quick Metrics Strip */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Project Duration
                </span>
                <span className="text-base font-bold text-slate-900 mt-1 block flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#FFAA4F]" aria-hidden="true" />
                  {study.duration}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Indicative Cost
                </span>
                <span className="text-base font-bold text-slate-900 mt-1 block flex items-center gap-1.5 tabular-numbers">
                  <PoundSterling className="h-4 w-4 text-[#FFAA4F]" aria-hidden="true" />
                  {study.indicativeCost}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Completion Year
                </span>
                <span className="text-base font-bold text-slate-900 mt-1 block flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#FFAA4F]" aria-hidden="true" />
                  {study.completionYear}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Contract Type
                </span>
                <span className="text-base font-bold text-emerald-600 mt-1 block">
                  Fixed Price
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. MAIN PHOTOGRAPH & CHALLENGE / SOLUTION BREAKDOWN (WHITE) */}
      <section className="py-12 sm:py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-10">
              {/* Featured Cover Image */}
              <div className="relative h-80 sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                <Image
                  src={study.coverImage}
                  alt={study.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
              </div>

              {/* Challenge vs Solution Narrative */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200/80">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-3">
                    <AlertTriangle className="h-5 w-5 text-amber-700" aria-hidden="true" />
                    <span>The Challenge</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {study.challenge}
                  </p>
                </div>

                <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200/80">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
                    <Lightbulb className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                    <span>The Solution</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {study.solution}
                  </p>
                </div>
              </div>

              {/* Project Highlights */}
              <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-heading">
                  Project Highlights &amp; Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {study.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-[#FFAA4F] mr-1 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before, Progress & After Gallery */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  Transformation Gallery
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {study.beforeImages.map((img, idx) => (
                    <div key={`before-${idx}`} className="space-y-2">
                      <div className="relative h-60 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                        <Image
                          src={img}
                          alt={`Before construction state ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-slate-900/85 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                          Before
                        </span>
                      </div>
                    </div>
                  ))}

                  {study.afterImages.map((img, idx) => (
                    <div key={`after-${idx}`} className="space-y-2">
                      <div className="relative h-60 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                        <Image
                          src={img}
                          alt={`Completed construction transformation ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-[#FFAA4F] text-slate-950 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          Completed Finish
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial Quote */}
              {study.testimonial && (
                <div className="bg-slate-50 text-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 relative overflow-hidden">
                  <span className="text-xs font-bold uppercase text-[#FFAA4F] tracking-wider block mb-2">
                    Client Testimonial
                  </span>
                  <blockquote className="text-base sm:text-lg italic text-slate-800 leading-relaxed font-normal">
                    “{study.testimonial.quote}”
                  </blockquote>
                  <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="font-bold text-slate-900">{study.testimonial.author}</span>
                    <span>{study.testimonial.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar CTA Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  Get a planning estimate for your home
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Use our free project planning engine to calculate indicative costs, build stages, and timescales based on your specific property footprint.
                </p>

                <div className="space-y-3 pt-2">
                  <Button
                    href="/plan-my-project"
                    variant="primary"
                    size="lg"
                    className="w-full justify-center text-xs sm:text-sm font-bold bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335] shadow-md"
                    rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  >
                    Start Project Planner
                  </Button>

                  <Button
                    href="/contact?type=consultation"
                    variant="outline"
                    size="md"
                    className="w-full justify-center text-xs sm:text-sm text-slate-800 border-slate-300 hover:bg-slate-50"
                  >
                    Book Free Site Survey
                  </Button>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                    <span>Fixed-price milestone contracts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                    <span>10-Year structural insurance warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                    <span>Dedicated in-house project manager</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
