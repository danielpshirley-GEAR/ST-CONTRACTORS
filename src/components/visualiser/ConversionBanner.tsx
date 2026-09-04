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

interface ConversionBannerProps {
  state: ProjectState;
  onOpenBriefModal: () => void;
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
    <section className="py-14 sm:py-18 bg-slate-900 text-white rounded-3xl relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 architectural-grid opacity-10 pointer-events-none" />
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6 px-4">
        <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold text-xs px-3 py-1">
          Turnkey London Construction
        </Badge>

        <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
          Want us to turn this into a real project?
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Send your project plan to ST Contractors and our team will review the scope, identify anything that needs on-site confirmation, and provide a fixed-price proposal.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Button
            href={`/contact?${queryParams.toString()}`}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto text-sm font-extrabold bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335] shadow-lg justify-center"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Get My Project Reviewed
          </Button>

          <Button
            type="button"
            onClick={onOpenBriefModal}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-white bg-slate-800 hover:bg-slate-700 border-slate-700 text-sm font-bold justify-center"
            leftIcon={<FileCheck2 className="h-4 w-4" />}
          >
            View Builder-Ready Brief
          </Button>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Fixed-Price Milestone Contracts</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#FFAA4F]" />
            <span>10-Year Insurance-Backed Warranty</span>
          </span>
        </div>
      </div>
    </section>
  );
}
