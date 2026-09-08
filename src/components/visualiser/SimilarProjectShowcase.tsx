'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, PoundSterling, ArrowRight, CheckCircle2, Award } from 'lucide-react';

interface SimilarProjectShowcaseProps {
  caseStudy?: {
    title: string;
    location: string;
    projectType: string;
    duration: string;
    cost: string;
    coverImage: string;
    slug: string;
    whatCustomerWanted: string;
    whatStContractorsDid: string;
    result: string;
  };
  onOpenReviewModal?: () => void;
}

export function SimilarProjectShowcase({
  caseStudy,
  onOpenReviewModal,
}: SimilarProjectShowcaseProps) {
  if (!caseStudy) return null;

  return (
    <section className="space-y-8 max-w-5xl mx-auto">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
          <Award className="h-3.5 w-3.5 text-[#FFAA4F]" />
          <span>Real ST Contractors Portfolio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
          See a Similar Project
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          Completed right here in London and the South East by our dedicated construction team.
        </p>
      </div>

      {/* Case Study Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Photo Column */}
        <div className="relative min-h-[300px] md:min-h-[420px] bg-slate-100">
          <Image
            src={caseStudy.coverImage}
            alt={caseStudy.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <span className="text-xs font-bold uppercase text-[#FFAA4F] tracking-wider">
              {caseStudy.projectType} • {caseStudy.location}
            </span>
            <h4 className="text-lg font-bold leading-snug">{caseStudy.title}</h4>
          </div>
        </div>

        {/* Narrative & Details Column */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* 2 Stat Pills */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                <Clock className="h-3.5 w-3.5 text-slate-600" />
                <span>{caseStudy.duration}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-slate-900 border border-amber-200 text-xs font-extrabold">
                <PoundSterling className="h-3.5 w-3.5 text-[#FFAA4F]" />
                <span>{caseStudy.cost}</span>
              </div>
            </div>

            {/* What Customer Wanted */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                What the Homeowner Wanted:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {caseStudy.whatCustomerWanted}
              </p>
            </div>

            {/* What ST Contractors Did */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                What ST Contractors Did:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {caseStudy.whatStContractorsDid}
              </p>
            </div>

            {/* Result / Testimonial */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 italic">
              &ldquo;{caseStudy.result}&rdquo;
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Link
              href={`/projects/${caseStudy.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-[#FFAA4F] transition-colors"
            >
              <span>View Full Case Study</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={onOpenReviewModal}
              className="px-4 py-2.5 rounded-xl bg-[#0B192C] text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-sm text-center"
            >
              Planning Something Similar?
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
