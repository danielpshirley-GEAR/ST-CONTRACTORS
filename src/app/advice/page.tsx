import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { ADVICE_ARTICLES_DATA } from '@/lib/content/advice-data';
import { Clock, User, ArrowRight, BookOpen, Sparkles, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: `Construction Advice & Planning Guides | ${siteConfig.name}`,
  description:
    'Expert construction advice, planning permission guides, Permitted Development rules, and building regulations insights from UK contractors.',
  alternates: {
    canonical: `${siteConfig.url}/advice`,
  },
};

export default function AdviceHubPage() {
  const publishedArticles = ADVICE_ARTICLES_DATA.filter((a) => a.status === 'published');

  return (
    <div className="py-12 sm:py-16 bg-slate-50 text-slate-900 min-h-screen text-left">
      <Container>
        <Breadcrumbs items={[{ name: 'Advice & Guides' }]} className="mb-8 text-slate-500" />

        {/* Hero Section */}
        <div className="max-w-3xl mb-12">
          <Badge variant="brand" size="sm" className="mb-3 bg-amber-100 text-amber-900 border-amber-300 font-bold text-xs">
            Construction Knowledge Hub
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
            Construction Advice &amp; Planning Guides
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Practical advice from experienced builders and surveyors covering UK planning rules, building regulations, party wall notices, and structural alterations.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {publishedArticles.map((article) => (
            <Link key={article.id} href={`/advice/${article.slug}`} className="group block h-full">
              <Card className="p-7 bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400 transition-all rounded-3xl flex flex-col justify-between h-full space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="brand" size="sm" className="bg-amber-50 text-amber-900 border-amber-200 text-[11px] font-bold">
                      {article.category}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading group-hover:text-amber-600 transition-colors leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-700">By {article.author.name}</span>
                  <span className="font-bold text-amber-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read guide →
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Commercial Conversion Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-slate-900 text-center border border-slate-200 shadow-xl max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <Badge variant="brand" size="sm" className="bg-[#FFAA4F] text-slate-950 font-bold text-xs">
              ST CONTRACTORS Turnkey Delivery
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
              Have questions about your specific property?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Our architectural and estimating team can review your site requirements, assess permitted development feasibility, and provide an itemized project scope.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              href="/plan-my-project"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold border border-[#E69335] shadow-md px-8 py-4"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Plan Your Project Live →
            </Button>
            <Button
              href="/contact?type=consultation"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-slate-800 border-slate-300 hover:bg-slate-50 px-6 py-4"
              leftIcon={<Phone className="h-4 w-4 text-amber-600" />}
            >
              Book Consultation
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
