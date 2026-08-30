import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { AiConstructionAssistant } from '@/components/assistant/AiConstructionAssistant';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: `Project Assistant | Plain-English Scope Builder | ${siteConfig.name}`,
  description:
    'Describe what you want to build in natural language. Our Project Assistant extracts structural requirements, likely works, Building Regulations, and transfers everything directly into your project estimate without re-entering data.',
  alternates: {
    canonical: `${siteConfig.url}/assistant`,
  },
};

export default function AssistantPage() {
  return (
    <main id="main-content" role="main" className="py-10 sm:py-14 bg-slate-50 text-slate-900 min-h-screen relative overflow-hidden">
      {/* Subtle Warm Accent Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-200/35 via-amber-100/15 to-transparent pointer-events-none -z-10 blur-2xl" />

      <Container>
        {/* Breadcrumbs */}
        <div className="max-w-5xl mx-auto mb-6 text-left">
          <Breadcrumbs
            items={[{ name: 'Project Assistant' }]}
            className="text-slate-500"
          />
        </div>

        {/* Hero Header with Amber Accent Details */}
        <header className="max-w-5xl mx-auto mb-8 text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300/80 font-bold text-xs shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFAA4F] animate-pulse" />
            Plain-English Scope Builder
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
            Project Assistant
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl">
            Describe what you want to build in plain English to generate a structured scope, technical considerations, and tailored estimate.
          </p>
        </header>

        {/* Assistant Interface */}
        <AiConstructionAssistant />

        {/* Footer Trust Strip */}
        <div className="max-w-5xl mx-auto mt-16 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 font-medium text-center">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-amber-600" aria-hidden="true" />
            <span>Zero Re-entry • Seamless Transfer</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-amber-600" aria-hidden="true" />
            <span>Part A &amp; Part L Building Regs Grounded</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-amber-600" aria-hidden="true" />
            <span>Reviewed by Senior Construction Director</span>
          </div>
        </div>
      </Container>
    </main>
  );
}
