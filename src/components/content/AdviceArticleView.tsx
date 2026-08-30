'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdviceArticle } from '@/lib/content/types';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import {
  Clock,
  User,
  Calendar,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Phone,
  BookOpen,
} from 'lucide-react';
import { BuilderInsightsCard } from '@/components/knowledge/BuilderInsightsCard';
import { constructionKnowledgeBank } from '@/lib/knowledge/knowledge-bank';

interface AdviceArticleViewProps {
  article: AdviceArticle;
}

export const AdviceArticleView: React.FC<AdviceArticleViewProps> = ({ article }) => {
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
            { name: 'Advice & Guides', href: '/advice' },
            { name: article.title },
          ]}
          className="mb-8 text-slate-500"
        />

        {/* 1. ARTICLE HEADER */}
        <header className="max-w-3xl mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" size="sm" className="bg-amber-100 text-amber-900 border-amber-300 font-bold text-xs">
              {article.category}
            </Badge>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5" />
              {article.readingTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
            {article.title}
          </h1>

          <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="h-3.5 w-3.5 text-amber-600" />
              <span>{article.author.name}</span>
              <span className="text-slate-400">({article.author.role})</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Updated February 2026</span>
            </div>
          </div>
        </header>

        {/* 2. SUMMARY CALLOUT */}
        <div className="max-w-3xl p-6 rounded-3xl bg-amber-50 border border-amber-200 mb-10 text-sm text-slate-700 leading-relaxed font-medium">
          <strong>Key Takeaway:</strong> {article.summary}
        </div>

        {/* 3. MAIN ARTICLE CONTENT */}
        <div className="max-w-3xl space-y-8 mb-12">
          {article.contentSections.map((section, idx) => (
            <section key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                {section.heading}
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                  {section.bulletPoints.map((pt, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* 3.5 FIRST-HAND LONDON BUILDER EXPERIENCE */}
        <div className="max-w-3xl">
          <BuilderInsightsCard
            records={constructionKnowledgeBank.filter(
              (r) =>
                r.approvedForPublicContent &&
                (article.slug.includes('extension') || article.slug.includes('permitted')
                  ? r.serviceSlugs.includes('extension')
                  : article.slug.includes('kitchen')
                  ? r.serviceSlugs.includes('kitchen-renovation')
                  : article.slug.includes('party-wall')
                  ? r.category === 'planning_regs'
                  : true)
            )}
          />
        </div>

        {/* 4. FAQS */}
        {article.faqs.length > 0 && (
          <section aria-label="FAQs" className="max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {article.faqs.map((faq, idx) => {
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

        {/* 5. COMMERCIAL CONVERSION CTA */}
        <section aria-label="Project Planning Consultation" className="max-w-3xl p-8 sm:p-12 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm mb-12">
          <div className="space-y-2">
            <Badge variant="brand" size="sm" className="bg-[#FFAA4F] text-slate-950 font-bold text-xs">
              Apex Construction Advisory
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {article.commercialCta.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              {article.commercialCta.description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <Button
              href={article.commercialCta.buttonHref}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-sm px-8 py-4 shadow-md"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {article.commercialCta.buttonText}
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

        {/* 6. RELATED TOOLS & SERVICES */}
        {(article.relatedCalculatorSlug || article.relatedServiceSlug) && (
          <section aria-label="Related Tools & Services" className="max-w-3xl space-y-4">
            <h3 className="text-lg font-bold font-heading text-slate-900">
              Related Construction Tools &amp; Services
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.relatedCalculatorSlug && (
                <Link href={`/calculators/${article.relatedCalculatorSlug}`} className="group block">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-sm">
                        Interactive Calculator
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Calculate costs live</div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0 ml-3" />
                  </div>
                </Link>
              )}
              {article.relatedServiceSlug && (
                <Link href={`/services/${article.relatedServiceSlug}`} className="group block">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-sm">
                        Our Building Services
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Explore our delivery approach</div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0 ml-3" />
                  </div>
                </Link>
              )}
            </div>
          </section>
        )}
      </Container>
    </article>
  );
};
