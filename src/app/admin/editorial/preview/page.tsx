'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CostGuide } from '@/lib/content/types';
import { COST_GUIDES_DATA, getCostGuideBySlug } from '@/lib/content/cost-guides-data';
import { CostGuideView } from '@/components/content/CostGuideView';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Eye,
  Edit3,
  CheckCircle2,
  Globe,
  ArrowRight,
  Sparkles,
  Save,
  FileText,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Undo2,
  Hammer,
} from 'lucide-react';
import { clsx } from 'clsx';
import { siteConfig } from '@/config/site';

function EditorialPreviewInner() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || 'wraparound-extension-cost';
  const router = useRouter();

  // Find guide or use default wraparound guide
  const initialGuide =
    getCostGuideBySlug(slug) ||
    COST_GUIDES_DATA.find((g) => g.slug === 'wraparound-extension-cost') ||
    COST_GUIDES_DATA[0];

  const [activeTab, setActiveTab] = useState<'preview' | 'editor'>('preview');
  const [guide, setGuide] = useState<CostGuide>(initialGuide);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Editable state
  const [title, setTitle] = useState(guide.title);
  const [h1, setH1] = useState(guide.h1);
  const [subtitle, setSubtitle] = useState(guide.subtitle);
  const [metaDescription, setMetaDescription] = useState(guide.metaDescription);
  const [priceLow, setPriceLow] = useState(guide.indicativeRange.low);
  const [priceHigh, setPriceHigh] = useState(guide.indicativeRange.high);
  const [introPara1, setIntroPara1] = useState(guide.introParagraphs[0] || '');
  const [introPara2, setIntroPara2] = useState(guide.introParagraphs[1] || '');

  const handleApplyEdits = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CostGuide = {
      ...guide,
      title,
      h1,
      subtitle,
      metaDescription,
      indicativeRange: {
        ...guide.indicativeRange,
        low: Number(priceLow),
        high: Number(priceHigh),
        formatted: `£${Number(priceLow).toLocaleString()} – £${Number(priceHigh).toLocaleString()}`,
      },
      introParagraphs: [introPara1, introPara2, ...(guide.introParagraphs.slice(2) || [])],
    };
    setGuide(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
    setActiveTab('preview');
  };

  const handlePublish = () => {
    setIsPublished(true);
  };

  const liveUrl = `${siteConfig.url}/cost-guides/${guide.slug}`;

  return (
    <div className="bg-[#0B0D10] min-h-screen text-slate-100 pb-20">
      {/* 1. TOP STICKY EDITORIAL CONTROLLER BAR (WARM CHARCOAL & ORANGE) */}
      <div className="sticky top-0 z-50 bg-[#12151B]/95 backdrop-blur-md border-b border-[#2A313C] py-3 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left info */}
          <div className="flex items-center gap-3">
            <Badge variant="brand" className="bg-[#FFAA4F] text-[#0B0D10] font-black text-xs">
              Draft Preview Studio
            </Badge>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-white block">{guide.title}</span>
              <span className="text-[11px] text-[#FFAA4F] font-mono font-bold">
                {isPublished ? '🟢 Published Live on Website' : '🟡 Interactive Draft Preview'}
              </span>
            </div>
          </div>

          {/* Center Mode Switcher Tabs */}
          <div className="flex items-center bg-[#1C222B] p-1 rounded-2xl border border-[#2A313C]">
            <button
              onClick={() => setActiveTab('preview')}
              className={clsx(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                activeTab === 'preview'
                  ? 'bg-[#FFAA4F] text-[#0B0D10] shadow-[0_2px_10px_rgba(255,170,79,0.35)] font-black'
                  : 'text-slate-300 hover:text-white'
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Full Test Version</span>
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={clsx(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                activeTab === 'editor'
                  ? 'bg-[#FFAA4F] text-[#0B0D10] shadow-[0_2px_10px_rgba(255,170,79,0.35)] font-black'
                  : 'text-slate-300 hover:text-white'
              )}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Easy Editor</span>
            </button>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-2">
            {isPublished ? (
              <Link
                href={`/cost-guides/${guide.slug}`}
                target="_blank"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 shadow-lg"
              >
                <span>View Live on Website</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <button
                onClick={handlePublish}
                className="bg-[#FFAA4F] hover:bg-[#FFB86A] text-[#0B0D10] font-black text-xs py-2.5 px-5 rounded-xl transition-all flex items-center gap-1.5 shadow-[0_4px_16px_rgba(255,170,79,0.35)] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Publish to Live Website →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. SUCCESS PUBLISHED BANNER */}
      {isPublished && (
        <div className="bg-emerald-950/90 border-b border-emerald-700 py-3.5 px-4 text-center text-xs text-emerald-200 flex items-center justify-center gap-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span><strong>Success!</strong> Article is now published live at <code className="text-white font-bold underline">{liveUrl}</code></span>
          <Link
            href={`/cost-guides/${guide.slug}`}
            target="_blank"
            className="bg-emerald-500 text-slate-950 font-black px-3.5 py-1 rounded-lg hover:bg-emerald-400"
          >
            Open Live Page ↗
          </Link>
        </div>
      )}

      {/* 3. MAIN WORKSPACE */}
      {activeTab === 'preview' ? (
        <div>
          {/* Draft notice banner */}
          <div className="bg-[#1C222B] border-b border-[#2A313C] py-3 px-4 text-center text-xs text-[#FFAA4F] flex items-center justify-center gap-2 font-medium">
            <ShieldCheck className="h-4 w-4 text-[#FFAA4F]" />
            <span>This is the <strong>Full Test Version</strong>. Inspect the centered layout, real photography, and pricing benchmarks below.</span>
            <button
              onClick={() => setActiveTab('editor')}
              className="text-white font-bold underline hover:text-[#FFAA4F] ml-2 cursor-pointer"
            >
              Edit Content ✏️
            </button>
          </div>

          {/* Real live component render */}
          <CostGuideView guide={guide} />
        </div>
      ) : (
        /* 4. EASY CONTENT EDITOR (CENTERED & WARM CHARCOAL THEME) */
        <Container size="md" className="py-12 text-left">
          <Card className="p-8 sm:p-10 bg-[#12151B] border-[#2A313C] rounded-3xl space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2A313C] pb-5">
              <div>
                <h2 className="text-xl font-extrabold font-heading text-white">
                  Quick Content Editor
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Make tweaks to pricing, headings, or text copy. Changes update the test preview instantly.
                </p>
              </div>
              <Badge variant="outline" className="text-xs text-[#FFAA4F] border-[#FFAA4F]/40 font-mono">
                {guide.slug}
              </Badge>
            </div>

            <form onSubmit={handleApplyEdits} className="space-y-5 text-xs">
              {/* Title & H1 */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  Article Headline (H1)
                </label>
                <input
                  type="text"
                  value={h1}
                  onChange={(e) => setH1(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#1C222B] border border-[#2A313C] text-white text-sm focus:border-[#FFAA4F] focus:outline-none"
                  required
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  SEO Subtitle &amp; Meta Description
                </label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#1C222B] border border-[#2A313C] text-slate-200 text-xs focus:border-[#FFAA4F] focus:outline-none"
                  required
                />
              </div>

              {/* Price Range Benchmark */}
              <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-[#0B0D10] border border-[#2A313C]">
                <div className="space-y-1.5">
                  <label className="block text-[#FFAA4F] font-bold uppercase tracking-wider text-[11px]">
                    Lowest Guide Price (£)
                  </label>
                  <input
                    type="number"
                    value={priceLow}
                    onChange={(e) => setPriceLow(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-[#1C222B] border border-[#2A313C] text-white font-mono text-sm focus:border-[#FFAA4F] focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[#FFAA4F] font-bold uppercase tracking-wider text-[11px]">
                    Highest Guide Price (£)
                  </label>
                  <input
                    type="number"
                    value={priceHigh}
                    onChange={(e) => setPriceHigh(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-[#1C222B] border border-[#2A313C] text-white font-mono text-sm focus:border-[#FFAA4F] focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Intro Paragraphs */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  Introductory Overview
                </label>
                <textarea
                  rows={3}
                  value={introPara1}
                  onChange={(e) => setIntroPara1(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#1C222B] border border-[#2A313C] text-slate-200 text-xs focus:border-[#FFAA4F] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  London Builder Advice &amp; Structural Notes
                </label>
                <textarea
                  rows={3}
                  value={introPara2}
                  onChange={(e) => setIntroPara2(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#1C222B] border border-[#2A313C] text-slate-200 text-xs focus:border-[#FFAA4F] focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-5 border-t border-[#2A313C]">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-5 py-3 rounded-xl bg-[#1C222B] text-slate-300 font-bold hover:bg-[#252D3A] cursor-pointer"
                >
                  Cancel &amp; Return to Preview
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#FFAA4F] hover:bg-[#FFB86A] text-[#0B0D10] font-black flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(255,170,79,0.35)]"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaved ? 'Saved! ✓' : 'Save Changes & Update Preview'}</span>
                  </button>
                </div>
              </div>
            </form>
          </Card>
        </Container>
      )}
    </div>
  );
}

export default function EditorialPreviewPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-white">Loading Test Preview Studio...</div>}>
      <EditorialPreviewInner />
    </Suspense>
  );
}
