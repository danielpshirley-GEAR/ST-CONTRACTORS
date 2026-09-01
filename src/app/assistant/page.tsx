import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { AiConstructionAssistant } from '@/components/assistant/AiConstructionAssistant';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: `AI Project Scope & Cost Assistant | ${siteConfig.name}`,
  description:
    'Tell us what you are building in plain English. Our AI Surveyor interprets your scope, calculates 2026 London build prices, presents custom options, identifies key regulatory considerations, and provides a trade breakdown.',
  alternates: {
    canonical: `${siteConfig.url}/assistant`,
  },
};

export default function AssistantPage() {
  return (
    <main id="main-content" role="main" className="py-10 sm:py-16 bg-[#F4F5F7] text-slate-900 min-h-screen text-left">
      <Container>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[{ name: 'AI Scope & Cost Assistant' }]}
            className="text-slate-500"
          />

          {/* Hero Header */}
          <header className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFAA4F]/20 text-[#D97706] border border-[#FFAA4F]/40 font-bold text-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
              <span>AI Scope &amp; Cost Interpreter</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
              What are you building?
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-3xl">
              Type your project in plain English — whether a simple query or an intricate specification. Our intelligent construction engine interprets your scope, provides realistic 2026 London cost benchmarks, presents custom options, and breaks down the required trades.
            </p>
          </header>

          {/* Assistant Interactive Interface */}
          <React.Suspense
            fallback={
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center animate-pulse">
                <div className="text-slate-400 text-sm font-medium">Loading AI Construction Assistant...</div>
              </div>
            }
          >
            <AiConstructionAssistant />
          </React.Suspense>

          {/* Footer Trust Strip */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 font-medium text-center">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#D97706]" aria-hidden="true" />
              <span>Instant Transfer to Project Planner</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#D97706]" aria-hidden="true" />
              <span>Part A, L, P &amp; Party Wall Grounded</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#D97706]" aria-hidden="true" />
              <span>London 2026 Quantity Surveyor Rates</span>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
