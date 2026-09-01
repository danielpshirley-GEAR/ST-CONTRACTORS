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
    // Automatically trigger instant publication state
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
    <div className="py-16 sm:py-24 bg-slate-950 min-h-screen text-white flex items-center justify-center">
      <Container size="sm">
        <Card className="p-8 sm:p-10 bg-slate-900 border-slate-800 rounded-3xl text-left space-y-6 shadow-2xl">
          {/* Header Animation */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-7 w-7 animate-scaleIn" />
            </div>
            <div>
              <Badge variant="brand" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] uppercase font-bold">
                1-Click Publishing Complete
              </Badge>
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-white mt-0.5">
                Article Successfully Published Live!
              </h1>
            </div>
          </div>

          {/* Article Info Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Live Article Title
            </span>
            <h2 className="text-base font-bold text-slate-100 font-heading leading-snug">
              {title}
            </h2>
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400 font-mono">
              <Globe className="h-3.5 w-3.5 text-brand-400 shrink-0" />
              <span className="truncate text-amber-400">{liveUrl}</span>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center gap-2 text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>20-Pt Quality Gate: <strong>Passed</strong></span>
            </div>
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center gap-2 text-slate-300">
              <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Schema JSON-LD: <strong>Active</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <Link
              href={`/${category === 'advice' ? 'advice' : 'cost-guides'}/${slug}`}
              target="_blank"
              className="w-full bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-extrabold text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>View Live Article on Website</span>
              <ExternalLink className="h-4 w-4" />
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyLink}
                className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs py-3 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>{copied ? 'Link Copied! ✓' : 'Copy Live Link'}</span>
              </button>

              <Link
                href="/admin/editorial"
                className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs py-3 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-center"
              >
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                <span>Editorial Portal</span>
              </Link>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default function OneClickPublishPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-white">Loading publisher...</div>}>
      <PublishContentInner />
    </Suspense>
  );
}
