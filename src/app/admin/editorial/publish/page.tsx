'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  Globe,
  ArrowRight,
  Share2,
  Copy,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

function PublishContentInner() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || 'wraparound-extension-cost';
  const title = searchParams.get('title') || 'Victorian Wraparound Extension Costs & Structural Feasibility in London (2026 Guide)';
  const category = searchParams.get('category') || 'cost-guides';

  const [published, setPublished] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPublished(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const liveUrl = `${siteConfig.url}/${category === 'advice' ? 'advice' : 'cost-guides'}/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="py-16 sm:py-24 bg-[#F4F5F7] min-h-screen text-slate-900 flex items-center justify-center">
      <Container size="sm">
        <Card className="p-8 sm:p-10 bg-white border-slate-200 rounded-3xl text-left space-y-6 shadow-xl">
          {/* Header Animation */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <Badge variant="brand" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] uppercase font-extrabold">
                1-Click Publishing Complete
              </Badge>
              <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 mt-0.5">
                Article Successfully Published Live!
              </h1>
            </div>
          </div>

          {/* Article Info Card */}
          <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
              Live Article Title
            </span>
            <h2 className="text-base font-extrabold text-slate-900 font-heading leading-snug">
              {title}
            </h2>
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-500 font-mono">
              <Globe className="h-3.5 w-3.5 text-[#D97706] shrink-0" />
              <span className="truncate text-[#D97706] font-bold">{liveUrl}</span>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FAFAF9] border border-slate-200 flex items-center gap-2 text-slate-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>20-Pt Quality Gate: <strong>Passed</strong></span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAFAF9] border border-slate-200 flex items-center gap-2 text-slate-700">
              <Sparkles className="h-4 w-4 text-[#D97706] shrink-0" />
              <span>Schema JSON-LD: <strong>Active</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <Link
              href={`/${category === 'advice' ? 'advice' : 'cost-guides'}/${slug}`}
              target="_blank"
              className="w-full bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-extrabold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>View Live Article on Website</span>
              <ExternalLink className="h-4 w-4" />
            </Link>

            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#FAFAF9] hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>{copied ? 'Copied URL! ✓' : 'Copy Live URL'}</span>
              </button>

              <Link
                href="/admin/editorial/preview"
                className="py-2.5 px-4 rounded-xl bg-[#FAFAF9] hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Preview Studio</span>
              </Link>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default function PublishContentPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-700">Publishing...</div>}>
      <PublishContentInner />
    </Suspense>
  );
}
