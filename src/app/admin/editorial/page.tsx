'use client';

import React, { useState } from 'react';
import { auditContentQuality, ContentQualityAuditReport } from '@/lib/content/quality-audit';
import { COST_GUIDES_DATA } from '@/lib/content/cost-guides-data';
import { ADVICE_ARTICLES_DATA } from '@/lib/content/advice-data';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Building,
  Hammer,
  HelpCircle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function AdminEditorialPage() {
  const [selectedArticleKey, setSelectedArticleKey] = useState<string>('cost-guides/extension-cost');
  const [customDraftTitle, setCustomDraftTitle] = useState('');
  const [customDraftContent, setCustomDraftContent] = useState('');
  const [activeReport, setActiveReport] = useState<ContentQualityAuditReport>(() => {
    const firstGuide = COST_GUIDES_DATA[0];
    const fullText = `${firstGuide.introParagraphs.join('\n\n')} ${firstGuide.costFactors.map((s) => `${s.title}\n${s.description}`).join('\n\n')}`;
    return auditContentQuality(firstGuide.h1, fullText, firstGuide.slug);
  });

  const handleSelectPreset = (key: string) => {
    setSelectedArticleKey(key);
    if (key.startsWith('cost-guides/')) {
      const slug = key.replace('cost-guides/', '');
      const guide = COST_GUIDES_DATA.find((g) => g.slug === slug);
      if (guide) {
        const fullText = `${guide.introParagraphs.join('\n\n')} ${guide.costFactors.map((s) => `${s.title}\n${s.description}`).join('\n\n')}`;
        setActiveReport(auditContentQuality(guide.h1, fullText, guide.slug));
      }
    } else if (key.startsWith('advice/')) {
      const slug = key.replace('advice/', '');
      const article = ADVICE_ARTICLES_DATA.find((a) => a.slug === slug);
      if (article) {
        const fullText = `${article.summary}\n\n${article.contentSections.map((s) => `${s.heading}\n${s.paragraphs.join('\n')}`).join('\n\n')}`;
        setActiveReport(auditContentQuality(article.title, fullText, article.slug));
      }
    }
  };

  const handleAuditCustom = () => {
    if (!customDraftTitle.trim() || !customDraftContent.trim()) return;
    const report = auditContentQuality(customDraftTitle, customDraftContent, 'custom-draft');
    setActiveReport(report);
  };

  const isApproved = activeReport.status === 'APPROVED_FOR_PUBLICATION';

  return (
    <div className="py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 text-left bg-[#F4F5F7] min-h-screen text-slate-900">
      {/* 1. HEADER */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" className="bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40 font-bold text-xs">
              <FileCheck2 className="h-3 w-3 mr-1 text-[#D97706]" />
              Section 23 Master Quality Gate
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            Editorial Content Quality Gate
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Automated 20-Point Quality Gate auditor enforcing genuine construction expertise, London property realities, and commercial conversion integrity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="brand"
            className={clsx(
              'font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs',
              isApproved
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-[#FFAA4F] text-slate-950 border-[#FFAA4F]'
            )}
          >
            {activeReport.status.replace(/_/g, ' ')} ({activeReport.totalScore} / 20)
          </Badge>
        </div>
      </div>

      {/* 2. SELECT ARTICLE PRESET */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-3">
          <label className="block text-slate-900 font-extrabold text-sm">Select Published Page to Audit:</label>
          <select
            value={selectedArticleKey}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#FAFAF9] border border-slate-300 text-slate-900 font-medium focus:border-[#FFAA4F] focus:outline-none"
          >
            <optgroup label="Cost Guides">
              {COST_GUIDES_DATA.map((g) => (
                <option key={g.slug} value={`cost-guides/${g.slug}`}>
                  Cost Guide: {g.h1}
                </option>
              ))}
            </optgroup>
            <optgroup label="Advice Guides">
              {ADVICE_ARTICLES_DATA.map((a) => (
                <option key={a.slug} value={`advice/${a.slug}`}>
                  Advice: {a.title}
                </option>
              ))}
            </optgroup>
          </select>
        </Card>

        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-2">
          <label className="block text-slate-900 font-extrabold text-sm">Audit Custom Draft Ingestion:</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Draft H1 Title..."
              value={customDraftTitle}
              onChange={(e) => setCustomDraftTitle(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-[#FAFAF9] border border-slate-300 text-slate-900 text-xs focus:border-[#FFAA4F] focus:outline-none"
            />
            <Button
              onClick={handleAuditCustom}
              variant="primary"
              size="sm"
              className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-extrabold px-5 rounded-xl shadow-xs"
            >
              Audit
            </Button>
          </div>
        </Card>
      </div>

      {/* 3. AUDIT REPORT RESULTS */}
      <Card className="p-6 sm:p-8 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-extrabold font-heading text-slate-900">
              Audit Breakdown: {activeReport.title}
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Slug: {activeReport.slug || 'custom-draft'} • Score: {activeReport.totalScore}/20
            </span>
          </div>
          <Badge
            variant="brand"
            className={clsx(
              'font-extrabold text-xs',
              isApproved
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-red-100 text-red-700 border-red-200'
            )}
          >
            {isApproved ? '✓ Passes Quality Gate' : '⚠️ Requires Revision'}
          </Badge>
        </div>

        {/* 20 Criteria Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeReport.criteria.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {c.status === 'PASS' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  )}
                  <span className="font-extrabold text-slate-900">{c.name}</span>
                </div>
                <span className="font-mono font-bold text-[#D97706]">{c.points} pt</span>
              </div>
              <p className="text-slate-600 leading-relaxed pl-6">{c.explanation}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
