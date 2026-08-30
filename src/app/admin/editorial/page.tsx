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

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 text-left text-white">
      {/* 1. HEADER */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
              <FileCheck2 className="h-3 w-3 mr-1" />
              Section 23 Master Quality Gate
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Editorial Content Quality Gate
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Automated 20-Point Quality Gate auditor enforcing genuine construction expertise, London property realities, and commercial conversion integrity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="brand"
            className={clsx(
              'font-extrabold text-xs px-3 py-1.5',
              activeReport.status === 'APPROVED_FOR_PUBLICATION'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-amber-500 text-slate-950'
            )}
          >
            {activeReport.status.replace(/_/g, ' ')} ({activeReport.totalScore} / 20)
          </Badge>
        </div>
      </div>

      {/* 2. SELECT ARTICLE PRESET */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-slate-300 font-bold mb-1.5">Select Published Page to Audit:</label>
          <select
            value={selectedArticleKey}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white"
          >
            <optgroup label="Cost Guides (8 Articles)">
              {COST_GUIDES_DATA.map((g) => (
                <option key={g.slug} value={`cost-guides/${g.slug}`}>
                  Cost Guide: {g.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Advice Guides (4 Articles)">
              {ADVICE_ARTICLES_DATA.map((a) => (
                <option key={a.slug} value={`advice/${a.slug}`}>
                  Advice: {a.title}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Audit Score</span>
            <div className="text-2xl font-bold font-heading text-white">
              {activeReport.totalScore} <span className="text-sm font-normal text-slate-400">/ 20 points ({activeReport.percentage}%)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-400 font-semibold block">
              {activeReport.criteria.filter((c) => c.status === 'PASS').length} Passed
            </span>
            <span className="text-xs text-amber-400 font-semibold block">
              {activeReport.criteria.filter((c) => c.status === 'CONDITIONAL').length} Conditional
            </span>
          </div>
        </div>
      </div>

      {/* 3. 20-POINT QUALITY GATE CHECKLIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-amber-400" />
          20-Point Quality Gate Audit Results
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeReport.criteria.map((crit) => (
            <Card key={crit.id} className="p-4 bg-slate-900 border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                    {crit.id}
                  </span>
                  <h4 className="font-bold text-xs text-white">{crit.name}</h4>
                </div>
                <Badge
                  variant="brand"
                  className={clsx(
                    'text-[10px] font-bold',
                    crit.status === 'PASS'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : crit.status === 'CONDITIONAL'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  )}
                >
                  {crit.status} ({crit.points} pt)
                </Badge>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{crit.explanation}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. STRENGTHS & ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-5 bg-slate-900 border-slate-800 rounded-2xl space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> Editorial Strengths:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
            {activeReport.strengths.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800 rounded-2xl space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" /> Recommendations for 100% Score:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
            {activeReport.actionableImprovements.length > 0 ? (
              activeReport.actionableImprovements.map((a, idx) => <li key={idx}>{a}</li>)
            ) : (
              <li>All core quality gate criteria satisfied to the highest standard.</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
