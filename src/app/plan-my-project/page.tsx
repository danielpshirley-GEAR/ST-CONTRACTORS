import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { TypeformWizard } from '@/components/planner/TypeformWizard';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: `AI Project Planner & Instant Quote Builder | ${siteConfig.name}`,
  description:
    'Explain what you want to build in plain English. Our AI project planner builds a customized room-by-room scope of work, allows you to edit items, and calculates an estimated development cost range.',
};

export default function PlanMyProjectPage() {
  return (
    <main id="main-content" role="main" className="relative py-8 sm:py-14 text-white min-h-screen bg-slate-950">
      {/* Full screen fixed video background with strong dark overlay for maximum readability */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center opacity-40"
          aria-hidden="true"
        >
          <source src="/videos/Long video 1_1.mp4" type="video/mp4" />
          <source src="/videos/long-video-1-1.mp4" type="video/mp4" />
        </video>
        {/* Dark contrast gradient */}
        <div className="absolute inset-0 bg-slate-950/75" aria-hidden="true" />
      </div>

      <Container size="xl" className="relative z-10">
        <Breadcrumbs items={[{ name: 'Plan Your Project' }]} className="mb-6 text-slate-300 drop-shadow-sm" />

        {/* High-contrast solid dark container */}
        <div className="bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl p-6 sm:p-10 lg:p-12 max-w-5xl mx-auto relative overflow-hidden">
          <Suspense fallback={<div className="text-center py-12 text-slate-300 font-medium">Loading AI project planner...</div>}>
            <TypeformWizard />
          </Suspense>

          <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300 font-semibold text-center">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#FFAA4F]" aria-hidden="true" />
              <span>100% Free &amp; Non-Binding</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#FFAA4F]" aria-hidden="true" />
              <span>10-Year Structural Warranty</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#FFAA4F]" aria-hidden="true" />
              <span>Direct Estimator Review</span>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
