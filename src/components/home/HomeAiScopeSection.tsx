'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const QUICK_IDEAS = [
  '6m Rear Kitchen Extension with Bifolds & RSJ',
  'Dormer Loft Conversion with Master Ensuite',
  'Convert Garage into Home Cinema & Gym',
  'Victorian Back-to-Brick Full House Renovation',
];

export const HomeAiScopeSection: React.FC = () => {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/assistant?q=${encodeURIComponent(prompt.trim())}`);
  };

  const handleChipClick = (text: string) => {
    router.push(`/assistant?q=${encodeURIComponent(text)}`);
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80 relative z-20">
      <Container>
        <div className="max-w-4xl mx-auto text-left bg-[#F4F5F7] rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-md border-t-4 border-t-[#FFAA4F] space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-[#D97706]">
                <Sparkles className="h-5 w-5" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
                What are you building?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Type your project in plain English. Our AI Construction Surveyor will instantly interpret your scope, calculate realistic 2026 London build costs, outline custom options, and give you a trade-by-trade breakdown.
            </p>
          </div>

          {/* Quick Idea Chips */}
          <div className="flex flex-wrap gap-2">
            {QUICK_IDEAS.map((idea, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(idea)}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 hover:text-[#D97706] hover:border-[#FFAA4F] border border-slate-200 text-xs font-semibold text-slate-700 transition-all text-left shadow-2xs"
              >
                + {idea}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 5m rear kitchen extension with steel bifold doors, taking down wall to living room..."
                className="flex-1 p-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F] focus:border-[#FFAA4F] transition-all shadow-xs"
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!prompt.trim()}
                className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-sm px-8 py-4 shadow-md shrink-0"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Calculate Scope &amp; Costs
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Free instant calculation • Grounded in Part A, L &amp; P Building Regs • No spam</span>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
};
