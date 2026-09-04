'use client';

import React from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';
import Link from 'next/link';

interface ConversionBannerProps {
  state: ProjectState;
  onOpenBriefModal?: () => void;
}

export function ConversionBanner({ state, onOpenBriefModal }: ConversionBannerProps) {
  const primarySpace = state.spaces[0];
  const queryParams = new URLSearchParams({
    type: 'consultation',
    source: 'visualiser',
    brief: state.originalBrief.slice(0, 150),
    projectTypes: state.projectTypes.join(','),
    area: primarySpace ? String(primarySpace.areaM2.value) : '',
  });

  return (
    <section className="py-14 sm:py-18 bg-slate-900 text-white rounded-3xl relative overflow-hidden shadow-2xl border border-slate-800">
      <div className="absolute inset-0 architectural-grid opacity-10 pointer-events-none" />
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6 px-4">
        <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold text-xs px-3 py-1">
          Turnkey London Construction
        </Badge>

        <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
          Want our team to review your project?
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Book a free 30-minute technical project consultation with ST Contractors. We will review your brief, assess structural viability, and provide a comprehensive fixed Schedule of Works.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={`/contact?${queryParams.toString()}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-extrabold text-sm border border-[#E69335] shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <span>Book Free Project Consultation</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {onOpenBriefModal && (
            <button
              type="button"
              onClick={onOpenBriefModal}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <FileCheck2 className="h-4 w-4 text-[#FFAA4F]" />
              <span>Export Builder Brief</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 pt-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Direct Principal Contractor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>FMB &amp; TrustMark Certified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Comprehensive £5M Insurance</span>
          </div>
        </div>
      </div>
    </section>
  );
}
