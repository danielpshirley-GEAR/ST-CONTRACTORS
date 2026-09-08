import React from 'react';
import { Container } from '@/components/ui/Container';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

export function VisualiserHeroSSR() {
  return (
    <div className="relative bg-slate-950 text-white py-16 sm:py-24 overflow-hidden min-h-[85vh] flex items-center justify-center">
      {/* Fixed Video Background (Long video 1) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center"
          aria-hidden="true"
        >
          <source src="/videos/Long video 1_1.mp4" type="video/mp4" />
          <source src="/videos/long-video-1-1.mp4" type="video/mp4" />
          <source src="/videos/Long video 1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#0B192C]/75 backdrop-blur-[1px]" aria-hidden="true" />
        <div
          className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"
          aria-hidden="true"
        />
      </div>
      <Container size="md" className="relative z-10">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-[#FFAA4F] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#FFAA4F]" />
            <span>AI Project Guide</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading text-white leading-tight">
              What would you like to do to your home?
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Describe it however you like. A sentence is enough.
            </p>
          </div>

          {/* Server-Rendered Input Card Skeleton */}
          <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl text-left space-y-6">
            <div className="space-y-2">
              <div className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-4 min-h-[110px] text-base text-slate-400 font-normal leading-relaxed">
                e.g. I want to convert my garage into a home office with a new doorway to the hallway, or I want to extend the back of the house with a modern open-plan kitchen...
              </div>
            </div>

            <div className="pt-2">
              <div className="w-full text-base font-extrabold py-4 rounded-xl bg-[#FFAA4F] text-slate-950 flex items-center justify-center gap-2 shadow-lg opacity-90">
                <span>START MY PROJECT</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Trust & Reassurance Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#FFAA4F] flex-shrink-0" />
              <span>FREE EXPERT PROJECT GUIDE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#FFAA4F] flex-shrink-0" />
              <span>NO OBLIGATION</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#FFAA4F] flex-shrink-0" />
              <span>PHOTOS &amp; PLANS SUPPORTED</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
