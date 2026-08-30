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
    <main id="main-content" role="main" className="relative py-8 sm:py-14 text-white min-h-screen">
      {/* Full screen fixed video background that does not move on scroll */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
          aria-hidden="true"
        >
          <source src="/videos/Long video 1_1.mp4" type="video/mp4" />
          <source src="/videos/long-video-1-1.mp4" type="video/mp4" />
        </video>
        {/* 10% black overlay */}
        <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
        {/* Subtle Bottom Gradient */}
        <div
          className="absolute bottom-0 inset-x-0 h-64 sm:h-80 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
          aria-hidden="true"
        />
      </div>

      <Container size="xl" className="relative z-10">
        <Breadcrumbs items={[{ name: 'Plan Your Project' }]} className="mb-6 text-white drop-shadow-sm" />

        {/* Clear, white luminous liquid glass container */}
        <div className="bg-white/[0.12] backdrop-blur-3xl rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_20px_50px_rgba(0,0,0,0.35)] max-w-5xl mx-auto relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/25 before:via-white/[0.04] before:to-transparent before:pointer-events-none">
          <Suspense fallback={<div className="text-center py-12 text-white font-medium">Loading AI project planner...</div>}>
            <TypeformWizard />
          </Suspense>

          <div className="mt-12 pt-8 border-t border-white/25 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white font-medium text-center drop-shadow-sm">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#FFAA4F]" aria-hidden="true" />
              <span>100% Free &amp; Non-Binding</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#FFAA4F]" aria-hidden="true" />
              <span>10-Year Structural Warranty</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#FFAA4F]" aria-hidden="true" />
              <span>Direct Estimator Review</span>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
