import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { caseStudiesData } from '@/config/case-studies';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ArrowRight, MapPin, Clock, PoundSterling, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Project Portfolio & Case Studies | London & South East Builders',
  description:
    'Browse our portfolio of completed residential construction projects, including house extensions, full Victorian renovations, kitchen transformations, and architectural garden studios.',
};

export default function ProjectsPage() {
  return (
    <div className="py-12 sm:py-16 bg-slate-50 text-slate-900 min-h-screen">
      <Container>
        <Breadcrumbs items={[{ name: 'Portfolio' }]} className="mb-8 text-slate-500" />

        <div className="max-w-3xl text-left mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
            Case Studies &amp; Completed Projects
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Explore real residential building projects delivered on schedule and within agreed budgets across London and the South East.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {caseStudiesData.map((study) => (
            <Card
              key={study.id}
              hoverEffect
              className="flex flex-col justify-between bg-white border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-md hover:shadow-xl rounded-3xl overflow-hidden group"
            >
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                <Image
                  src={study.coverImage}
                  alt={study.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-bold border-none shadow-md text-xs px-2.5 py-0.5">
                    {study.projectType}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="slate" className="bg-slate-950/85 text-white border-slate-700 font-semibold text-xs backdrop-blur-sm">
                    <MapPin className="h-3 w-3 mr-1 text-[#FFAA4F]" aria-hidden="true" />
                    {study.location}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-heading drop-shadow-md">
                    {study.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      <span>{study.duration} build</span>
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-900 tabular-numbers">
                      <span>{study.indicativeCost}</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {study.customerObjective}
                  </p>

                  <div className="space-y-2">
                    {study.highlights.slice(0, 2).map((highlight, idx) => (
                      <div key={idx} className="flex items-start text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#FFAA4F] mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    Completed in {study.completionYear}
                  </span>
                  <Button
                    href={`/projects/${study.slug}`}
                    variant="outline"
                    size="sm"
                    className="text-xs text-slate-800 border-slate-300 hover:bg-slate-100"
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
                  >
                    Case Study
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Consultation Box */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Have a similar property in mind?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Our architects and estimators can walk you through past blueprints and tailored cost benchmarks.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              href="/plan-my-project"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto justify-center bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold border border-[#E69335]"
              rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            >
              Start Your Plan
            </Button>
            <Button
              href="/contact?type=consultation"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto justify-center text-slate-800 border-slate-300 hover:bg-slate-50"
            >
              Book Site Survey
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
