import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { DesignVisualiserView } from '@/components/visualiser/DesignVisualiserView';
import { VisualiserHeroSSR } from '@/components/visualiser/VisualiserHeroSSR';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Accordion } from '@/components/ui/Accordion';
import { siteConfig } from '@/config/site';
import { VISUALISER_EXAMPLES } from '@/config/visualiser-examples';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Ruler,
  Compass,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: `AI Home Renovation & Extension Project Guide | ${siteConfig.name}`,
  description:
    'Plan your London home renovation or extension with ST Contractors. Explore interactive roadmaps, realistic cost options, construction stages, and architectural visualisations.',
  alternates: {
    canonical: `${siteConfig.url}/visualiser`,
  },
  openGraph: {
    title: `AI Home Renovation & Extension Project Guide | ${siteConfig.name}`,
    description:
      'Turn simple or detailed project briefs into structured visual roadmaps, realistic cost options, and expert ST Contractors consultations.',
    url: `${siteConfig.url}/visualiser`,
    siteName: siteConfig.name,
    images: [{ url: '/images/services/house-extensions.png', width: 1200, height: 630, alt: 'AI Project Guide' }],
    locale: 'en_GB',
    type: 'website',
  },
};

const VISUALISER_FAQS = [
  {
    question: 'How does the AI Project Guide work?',
    answer:
      'You describe what you want to build or renovate in plain English. A sentence is enough. Our system asks a few smart probing questions, confirms your plan, and structures an interactive visual roadmap with realistic cost options, buying packages, and delivery stages.',
  },
  {
    question: 'Can I upload photos of my existing room or garden?',
    answer:
      'Yes! You can upload multiple photographs of your existing rooms, sketches, or floor plans. Our AI extracts architectural features, layout constraints, and creates visual concepts reflecting your actual space.',
  },
  {
    question: 'Are the cost ranges accurate?',
    answer:
      'Our pricing engine uses real UK residential construction benchmark data tailored to London and the South East. You can use interactive cost switches to see how different finishes, heating types, and architectural options impact the overall budget.',
  },
  {
    question: 'Does this replace an architect or structural engineer?',
    answer:
      'No. The Project Guide gives you clarity on layout, stages, budget alignment, and key checks. Formal structural calculations, Thames Water build-overs, and local council approvals are carried out during our pre-construction phase.',
  },
  {
    question: 'What happens after I see my project guide?',
    answer:
      'You can explore your interactive roadmap and finish options, or click "Get ST Contractors to Review My Project" to send your plan directly to our team for an expert consultation and site visit.',
  },
];

export default function VisualiserPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${siteConfig.url}/visualiser#app`,
        name: 'ST Contractors AI Project Design & Scope Builder',
        description: 'Interactive AI architectural planning tool for London home extensions, kitchen knockthroughs, and renovations.',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'GBP',
        },
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
            name: 'AI Visualiser & Scope Builder',
            item: `${siteConfig.url}/visualiser`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: VISUALISER_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Interactive Application Shell */}
      <React.Suspense fallback={<VisualiserHeroSSR />}>
        <DesignVisualiserView />
      </React.Suspense>

      {/* Server-Rendered Crawlable Editorial Content Below Tool */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
        <Container>
          <div className="max-w-4xl mx-auto space-y-16">
            {/* 1. What the Project Visualiser Can Help You Plan */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
                  Comprehensive Planning Support
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  What the Project Visualiser Can Help You Plan
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
                  Our planning engine dynamically adapts to virtually any residential construction or renovation project.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { title: 'House Extensions', desc: 'Rear, side-return, and wraparound structural additions' },
                  { title: 'Kitchen Knockthroughs', desc: 'Open-plan living, islands, and Crittall glazed screens' },
                  { title: 'Bathroom Wet Rooms', desc: 'Schlüter waterproofed walk-in showers and luxury en-suites' },
                  { title: 'Loft Conversions', desc: 'Rear dormers, hip-to-gable, and master rooftop suites' },
                  { title: 'Garage Conversions', desc: 'Habitable home offices, gyms, and playrooms' },
                  { title: 'Full Renovations', desc: 'Whole-house period restorations and M&E rewiring' },
                  { title: 'Structural Alterations', desc: 'Load-bearing wall removals and RSJ steel frames' },
                  { title: 'Garden Rooms', desc: 'Insulated standalone studios and outdoor annexes' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <h3 className="text-xs font-bold text-slate-900 font-heading">{item.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-normal">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. How It Works: Step-by-Step */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
                  How It Works
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  From Conversational Brief to Clear Project Guide
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { step: '1', title: 'Describe Your Idea', desc: 'Tell us what you want to do to your home in plain English. A sentence is enough.' },
                  { step: '2', title: 'Smart Probing Questions', desc: 'Answer a few targeted questions to narrow down room use, layout, and structure.' },
                  { step: '3', title: 'Explore Roadmap & Options', desc: 'See your visual construction steps, buying packages, and interactive cost switches.' },
                  { step: '4', title: 'Consult With ST Contractors', desc: 'Have our estimating team review your plan and conduct a thorough site survey.' },
                ].map((st, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                    <span className="h-7 w-7 rounded-lg bg-[#FFAA4F] text-slate-950 font-extrabold flex items-center justify-center text-xs">
                      {st.step}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 font-heading">{st.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Curated Example Showcase Links */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block">
                    Curated Project Blueprints
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
                    Explore Curated Example Projects
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {VISUALISER_EXAMPLES.map((ex) => (
                  <Link
                    key={ex.slug}
                    href={`/visualiser/examples/${ex.slug}`}
                    className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#FFAA4F] hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <Badge variant="slate" className="bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {ex.location}
                      </Badge>
                      <h3 className="text-sm font-bold text-slate-900 font-heading group-hover:text-[#FFAA4F] transition-colors">
                        {ex.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {ex.briefDescription}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{ex.estimatedCostRange}</span>
                      <span className="font-bold text-[#FFAA4F] flex items-center gap-1">
                        <span>View Plan</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 4. What the Visualiser Can and Cannot Determine */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#FFAA4F]" />
                <span>What the Visualiser Can and Cannot Determine</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                  <strong className="text-emerald-950 font-bold block">What the Tool DOES Provide:</strong>
                  <ul className="space-y-1 text-emerald-900">
                    <li>• Rapid spatial and visual concept exploration</li>
                    <li>• Deterministic mathematical material quantities</li>
                    <li>• Trade-by-trade scope and sequential construction phasing</li>
                    <li>• Statutory planning and Party Wall Act flag identification</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                  <strong className="text-amber-950 font-bold block">What Requires On-Site Confirmation:</strong>
                  <ul className="space-y-1 text-amber-900">
                    <li>• Physical inspection of load-bearing walls and ceiling spans</li>
                    <li>• CCTV drainage depth verification for Thames Water approval</li>
                    <li>• Subfloor timber moisture probing and joist condition</li>
                    <li>• Final binding contractual quotation and structural sign-off</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. Frequently Asked Questions */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block mb-1">
                  FAQ
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <Accordion
                  items={VISUALISER_FAQS.map((faq) => ({
                    title: faq.question,
                    content: <span className="text-slate-600 leading-relaxed font-normal">{faq.answer}</span>,
                  }))}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
