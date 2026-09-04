import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { VISUALISER_EXAMPLES } from '@/config/visualiser-examples';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { siteConfig } from '@/config/site';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  PoundSterling,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Sliders,
  Ruler,
  Compass,
  Layers,
} from 'lucide-react';

interface ExamplePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return VISUALISER_EXAMPLES.map((ex) => ({
    slug: ex.slug,
  }));
}

export async function generateMetadata({ params }: ExamplePageProps): Promise<Metadata> {
  const example = VISUALISER_EXAMPLES.find((e) => e.slug === params.slug);
  if (!example) return {};

  return {
    title: example.metaTitle,
    description: example.metaDescription,
    alternates: {
      canonical: `${siteConfig.url}/visualiser/examples/${example.slug}`,
    },
    openGraph: {
      title: example.metaTitle,
      description: example.metaDescription,
      url: `${siteConfig.url}/visualiser/examples/${example.slug}`,
      siteName: siteConfig.name,
      images: [{ url: example.heroImage, width: 1200, height: 630, alt: example.title }],
      locale: 'en_GB',
      type: 'article',
    },
  };
}

export default function VisualiserExampleDetailPage({ params }: ExamplePageProps) {
  const example = VISUALISER_EXAMPLES.find((e) => e.slug === params.slug);

  if (!example) {
    notFound();
  }

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: example.h1,
    description: example.metaDescription,
    image: `${siteConfig.url}${example.heroImage}`,
    publisher: {
      '@type': 'HomeAndConstructionBusiness',
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: siteConfig.company.phone,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/visualiser/examples/${example.slug}`,
    },
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="relative bg-slate-50 text-slate-900 pt-10 pb-16 border-b border-slate-200">
        <Container>
          <Breadcrumbs
            items={[
              { name: 'AI Visualiser', href: '/visualiser' },
              { name: 'Examples', href: '/visualiser' },
              { name: example.title },
            ]}
            className="mb-6 text-slate-500"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-[#FFAA4F]" />
                <span>Curated Project Specification</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
                {example.h1}
              </h1>

              <p className="text-base text-slate-600 leading-relaxed font-normal">
                {example.briefDescription}
              </p>

              {/* Quick Facts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 text-xs">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Budget</span>
                  <span className="font-bold text-slate-900 block mt-0.5 text-xs">{example.estimatedCostRange}</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Timeline</span>
                  <span className="font-bold text-slate-900 block mt-0.5 text-xs">{example.duration}</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Property Type</span>
                  <span className="font-bold text-slate-900 block mt-0.5 text-xs line-clamp-1">{example.propertyType}</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Dimensions</span>
                  <span className="font-bold text-slate-900 block mt-0.5 text-xs line-clamp-1">{example.dimensionsText}</span>
                </div>
              </div>

              {/* CTA to load in visualiser */}
              <div className="pt-3 flex flex-col sm:flex-row gap-3">
                <Button
                  href={`/visualiser?prompt=${encodeURIComponent(example.initialPrompt)}&length=${example.initialDimensions.length}&width=${example.initialDimensions.width}`}
                  variant="primary"
                  size="lg"
                  className="text-xs sm:text-sm font-extrabold bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335] shadow-md justify-center"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Load &amp; Customise This Project in Visualiser
                </Button>
                <Button
                  href="/contact?type=consultation"
                  variant="outline"
                  size="lg"
                  className="text-xs sm:text-sm text-slate-800 bg-white border-slate-300 hover:bg-slate-100 justify-center font-bold"
                >
                  Discuss With Our Team
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5 relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              <Image
                src={example.heroImage}
                alt={example.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Highlights & Engineering Details */}
      <section className="py-16 bg-white border-b border-slate-200">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Key Architectural Highlights */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                Architectural &amp; Structural Highlights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {example.keyHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges & Solutions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200 space-y-3">
                <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span>Key Project Challenges</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-amber-900">
                  {example.keyChallenges.map((ch, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{ch}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span>ST Contractors Engineering Solutions</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-emerald-900">
                  {example.recommendedSolutions.map((sol, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom CTA Box */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4 shadow-xl">
              <h3 className="text-2xl font-bold font-heading text-white">
                Want to build a similar project?
              </h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Load this project configuration directly into our AI Visualiser to adjust dimensions, switch finish tiers, and calculate quantities in seconds.
              </p>
              <div className="pt-2">
                <Button
                  href={`/visualiser?prompt=${encodeURIComponent(example.initialPrompt)}&length=${example.initialDimensions.length}&width=${example.initialDimensions.width}`}
                  variant="primary"
                  size="lg"
                  className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-extrabold text-sm border border-[#E69335] shadow-lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Customise This Plan in Visualiser
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
