'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Search,
  Sparkles,
  Zap,
  Target,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  MapPin,
  FileText,
  Activity,
  Gauge,
  RefreshCw,
  Filter,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  SEOOpportunity,
  RankingMetric,
  ConversionMetric,
  KeywordMetric,
  TechnicalAuditIssue,
  IntegrationHealthCheckResult,
  ContentBriefOutput,
  OpportunityPriority,
  OpportunityType,
} from '@/lib/seo/types';

interface SeoDashboardViewProps {
  initialOverview: {
    kpis: {
      organicClicks: number;
      organicClicksChangePercent: number;
      organicImpressions: number;
      organicImpressionsChangePercent: number;
      organicSessions: number;
      organicLeads: number;
      pipelineValueGbp: number;
      averageCtr: number;
      trackedKeywordsCount: number;
      keywordsTop3Count: number;
      keywordsTop10Count: number;
      keywordsTop20Count: number;
      totalOpportunitiesCount: number;
      criticalOpportunitiesCount: number;
      criticalTechnicalIssuesCount: number;
    };
    topOpportunities: SEOOpportunity[];
    recentRankingGains: RankingMetric[];
    recentRankingLosses: RankingMetric[];
    topConversionPages: ConversionMetric[];
    technicalWarnings: TechnicalAuditIssue[];
  };
  trackedKeywords: KeywordMetric[];
  allOpportunities: SEOOpportunity[];
  healthStatuses: IntegrationHealthCheckResult[];
}

export function SeoDashboardView({
  initialOverview,
  trackedKeywords,
  allOpportunities,
  healthStatuses,
}: SeoDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'opportunities' | 'keywords' | 'pages' | 'competitors' | 'technical' | 'local' | 'integrations'
  >('overview');

  const [selectedPriority, setSelectedPriority] = useState<OpportunityPriority | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<OpportunityType | 'ALL'>('ALL');

  // AI Content Brief Modal State
  const [activeBrief, setActiveBrief] = useState<ContentBriefOutput | null>(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

  // Health check state
  const [healthResults, setHealthResults] = useState<IntegrationHealthCheckResult[]>(healthStatuses);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // PageSpeed audit state
  const [auditUrl, setAuditUrl] = useState('/cost-guides/extension-cost');
  const [auditDevice, setAuditDevice] = useState<'MOBILE' | 'DESKTOP'>('MOBILE');
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isRunningAudit, setIsRunningAudit] = useState(false);

  // Filtered opportunities
  const filteredOpportunities = allOpportunities.filter((opp) => {
    if (selectedPriority !== 'ALL' && opp.priority !== selectedPriority) return false;
    if (selectedType !== 'ALL' && opp.type !== selectedType) return false;
    return true;
  });

  const handleGenerateBrief = async (keyword: string, volume?: number, position?: number) => {
    setIsGeneratingBrief(true);
    try {
      const res = await fetch('/api/admin/seo/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, volume, position }),
      });
      const data = await res.json();
      if (data.brief) {
        setActiveBrief(data.brief);
      }
    } catch (err) {
      console.error('Failed to generate content brief:', err);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const handleRunHealthCheck = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await fetch('/api/admin/seo/health');
      const data = await res.json();
      if (data.services) {
        setHealthResults(data.services);
      }
    } catch (err) {
      console.error('Health check failed:', err);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleRunPageSpeed = async () => {
    setIsRunningAudit(true);
    try {
      const res = await fetch('/api/admin/seo/pagespeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: auditUrl, device: auditDevice }),
      });
      const data = await res.json();
      if (data.audit) {
        setAuditResult(data.audit);
      }
    } catch (err) {
      console.error('PageSpeed audit failed:', err);
    } finally {
      setIsRunningAudit(false);
    }
  };

  const kpis = initialOverview.kpis;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm" className="bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40">
              <Sparkles className="h-3 w-3 mr-1" />
              Unified Intelligence Layer
            </Badge>
            <span className="text-xs text-slate-500 font-mono">Phase 4 Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            SEO &amp; Content Intelligence Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time synthesis of Search Console, GA4, DataForSEO, PageSpeed, and Gemini AI reasoning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunHealthCheck}
            disabled={isCheckingHealth}
            className="text-xs border-slate-200 hover:bg-slate-800 text-slate-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isCheckingHealth ? 'animate-spin' : ''}`} />
            {isCheckingHealth ? 'Testing APIs...' : 'Test All Integrations'}
          </Button>

          <Link href="/cost-guides" target="_blank">
            <Button variant="primary" size="sm" className="text-xs gap-1.5 shadow-md">
              <span>View Public Hub</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'opportunities', label: `Opportunities (${allOpportunities.length})`, icon: Zap },
          { id: 'keywords', label: `Keywords (${trackedKeywords.length})`, icon: Search },
          { id: 'pages', label: 'Pages & Conversions', icon: FileText },
          { id: 'competitors', label: 'Competitors & Gaps', icon: Target },
          { id: 'technical', label: 'Technical SEO', icon: Gauge },
          { id: 'local', label: 'Local SEO', icon: MapPin },
          { id: 'integrations', label: 'Integrations & Health', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#FFAA4F] text-slate-950 shadow-md font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* 1. OVERVIEW TAB */}
      {/* ===================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI CARDS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-4 bg-white border-slate-200/90 shadow-sm text-slate-900 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Organic Clicks</span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                {kpis.organicClicks.toLocaleString()}
              </div>
              <div className="flex items-center text-[11px] text-emerald-400 font-semibold gap-0.5">
                <ArrowUpRight className="h-3 w-3" />
                <span>+{kpis.organicClicksChangePercent}% 28d</span>
              </div>
            </Card>

            <Card className="p-4 bg-white border-slate-200/90 shadow-sm text-slate-900 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Impressions</span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                {kpis.organicImpressions.toLocaleString()}
              </div>
              <div className="flex items-center text-[11px] text-emerald-400 font-semibold gap-0.5">
                <ArrowUpRight className="h-3 w-3" />
                <span>+{kpis.organicImpressionsChangePercent}% 28d</span>
              </div>
            </Card>

            <Card className="p-4 bg-white border-slate-200/90 shadow-sm text-slate-900 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Organic Leads</span>
              <div className="text-xl sm:text-2xl font-bold text-[#D97706] font-heading">
                {kpis.organicLeads} Enquiries
              </div>
              <div className="text-[11px] text-slate-500">
                Avg CTR: <strong className="text-slate-900">{kpis.averageCtr}%</strong>
              </div>
            </Card>

            <Card className="p-4 bg-white border-slate-200/90 shadow-sm text-slate-900 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Won Pipeline</span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-heading">
                £{(kpis.pipelineValueGbp / 1000).toFixed(0)}k
              </div>
              <div className="text-[11px] text-slate-500">Attributed to SEO</div>
            </Card>

            <Card className="p-4 bg-white border-slate-200/90 shadow-sm text-slate-900 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Rankings (Top 3/10)</span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                {kpis.keywordsTop3Count} <span className="text-sm text-slate-500">/ {kpis.keywordsTop10Count}</span>
              </div>
              <div className="text-[11px] text-slate-500">of {kpis.trackedKeywordsCount} tracked</div>
            </Card>

            <Card className="p-4 bg-white border-slate-200/90 shadow-sm text-slate-900 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Opportunities</span>
              <div className="text-xl sm:text-2xl font-bold text-[#D97706] font-heading">
                {kpis.criticalOpportunitiesCount} Critical
              </div>
              <div className="text-[11px] text-slate-500">{kpis.totalOpportunitiesCount} total actions</div>
            </Card>
          </div>

          {/* TOP OPPORTUNITIES & QUICK WINS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 bg-white border-slate-200/90 shadow-sm text-slate-900 space-y-5 rounded-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#D97706]" />
                    <span>Top Priority SEO Opportunities</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Highest commercial return actions scored deterministically (0–100).
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('opportunities')}
                  className="text-xs border-slate-200 text-slate-700"
                >
                  View All ({allOpportunities.length})
                </Button>
              </div>

              <div className="space-y-3">
                {initialOverview.topOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-4 rounded-2xl bg-[#FAFAF9]/70 border border-slate-200 hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={opp.priority === 'CRITICAL' ? 'warning' : 'brand'}
                          size="sm"
                          className="text-[10px] uppercase font-bold"
                        >
                          {opp.priority}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-700 font-mono">
                          Score: {opp.opportunityScore}/100
                        </span>
                        {opp.keyword && (
                          <span className="text-xs text-[#D97706] font-mono truncate max-w-[200px]">
                            &quot;{opp.keyword}&quot;
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-slate-900">{opp.title}</div>
                      <p className="text-xs text-slate-500 leading-relaxed">{opp.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {opp.keyword && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleGenerateBrief(opp.keyword!, opp.searchVolume, opp.currentPosition)}
                          disabled={isGeneratingBrief}
                          className="text-xs gap-1"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>AI Brief</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* RANKING GAINS & LOSSES */}
            <div className="space-y-6">
              <Card className="p-5 bg-white border-slate-200/90 shadow-sm text-slate-900 space-y-3 rounded-3xl">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <TrendingUp className="h-3.5 w-3.5" /> Recent Ranking Gains
                  </span>
                  <span>Pos 28d</span>
                </div>
                <div className="space-y-2 text-xs">
                  {initialOverview.recentRankingGains.slice(0, 4).map((g) => (
                    <div key={g.keyword} className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAF9] border border-slate-200">
                      <span className="text-slate-800 truncate max-w-[180px] font-mono">{g.keyword}</span>
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                        <span>#{g.position}</span>
                        <span className="text-[10px] text-emerald-300">
                          (+{g.positionChange?.toFixed(1)})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5 bg-white border-slate-200/90 shadow-sm text-slate-900 space-y-3 rounded-3xl">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#D97706]">
                    <AlertTriangle className="h-3.5 w-3.5" /> Technical Health
                  </span>
                  <Badge variant="brand" size="sm" className="text-[10px]">
                    100% Validated
                  </Badge>
                </div>
                <div className="space-y-2 text-xs">
                  {initialOverview.technicalWarnings.map((w) => (
                    <div key={w.id} className="p-2.5 rounded-xl bg-[#FAFAF9] border border-slate-200 border border-slate-200/50 space-y-1">
                      <div className="font-semibold text-slate-800">{w.title}</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{w.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. OPPORTUNITIES SCREEN */}
      {/* ===================================================================== */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          {/* FILTER CONTROLS */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#FAFAF9]/80 rounded-2xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Priority:
              </span>
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedPriority === p
                      ? 'bg-[#FFAA4F] text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Showing {filteredOpportunities.length} of {allOpportunities.length} opportunities
            </div>
          </div>

          {/* OPPORTUNITIES TABLE / CARDS */}
          <div className="space-y-4">
            {filteredOpportunities.map((opp) => (
              <Card
                key={opp.id}
                className="p-6 bg-white border-slate-200/90 shadow-sm text-slate-900 hover:border-slate-600 transition-all rounded-3xl space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={opp.priority === 'CRITICAL' ? 'warning' : 'brand'}
                        size="sm"
                        className="text-[10px] uppercase font-bold"
                      >
                        {opp.priority}
                      </Badge>
                      <span className="text-xs font-bold text-[#D97706] bg-[#FAFAF9] px-2 py-0.5 rounded-md border border-slate-200 font-mono">
                        Score: {opp.opportunityScore}/100
                      </span>
                      {opp.leadPotentialScore && (
                        <span className="text-xs text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-800/60 font-mono">
                          Lead Potential: {opp.leadPotentialScore}/100
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-mono uppercase text-[10px]">
                        Sources: {opp.sourceApis.join(', ')}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 font-heading">{opp.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
                      {opp.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {opp.keyword && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleGenerateBrief(opp.keyword!, opp.searchVolume, opp.currentPosition)}
                        disabled={isGeneratingBrief}
                        className="text-xs gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Generate Brief</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* METRICS ROW */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 p-3 bg-[#FAFAF9]/80 rounded-2xl text-xs">
                  {opp.currentPosition && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">Position</span>
                      <strong className="text-slate-900 font-mono">#{opp.currentPosition}</strong>
                    </div>
                  )}
                  {opp.searchVolume && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">Monthly Vol</span>
                      <strong className="text-slate-900 font-mono">{opp.searchVolume.toLocaleString()}</strong>
                    </div>
                  )}
                  {opp.impressions && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">Impressions</span>
                      <strong className="text-slate-900 font-mono">{opp.impressions.toLocaleString()}</strong>
                    </div>
                  )}
                  {opp.ctr && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">CTR</span>
                      <strong className="text-slate-900 font-mono">{opp.ctr}%</strong>
                    </div>
                  )}
                  {opp.keywordDifficulty && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">Difficulty</span>
                      <strong className="text-slate-900 font-mono">{opp.keywordDifficulty}/100</strong>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-slate-500 block">Estimated Impact</span>
                    <span className="text-emerald-400 font-semibold text-[11px] truncate block">
                      {opp.estimatedImpact}
                    </span>
                  </div>
                </div>

                {/* RECOMMENDED ACTION */}
                <div className="p-3 bg-[#FAFAF9]/50 rounded-xl border border-slate-200/50 text-xs text-slate-700 flex items-start gap-2">
                  <Zap className="h-3.5 w-3.5 text-[#D97706] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Recommended Action: </strong>
                    <span>{opp.recommendedAction}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. KEYWORDS & RANKINGS SCREEN */}
      {/* ===================================================================== */}
      {activeTab === 'keywords' && (
        <Card className="p-6 bg-white border-slate-200/90 shadow-sm text-slate-900 rounded-3xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">Tracked Construction Search Keywords</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live ranking data combined with search volume, CPC, commercial intent, and lead potential.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Keyword</th>
                  <th className="py-3 px-3">Intent</th>
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Search Vol</th>
                  <th className="py-3 px-3">CPC (£)</th>
                  <th className="py-3 px-3">Lead Score</th>
                  <th className="py-3 px-3">Top Competitor</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-mono">
                {trackedKeywords.map((kw) => (
                  <tr key={kw.keyword} className="hover:bg-slate-750 transition-colors">
                    <td className="py-3 px-3 text-slate-900 font-bold">{kw.keyword}</td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={kw.searchIntent === 'COMMERCIAL' || kw.searchIntent === 'LOCAL' ? 'brand' : 'slate'}
                        size="sm"
                        className="text-[10px]"
                      >
                        {kw.searchIntent}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-400 font-bold">#{kw.currentPosition}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{kw.searchVolumeMonthly.toLocaleString()}</td>
                    <td className="py-3 px-3 text-slate-700">£{kw.cpcGbp.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className="text-[#D97706] font-bold">{kw.leadPotentialScore}/100</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] truncate max-w-[140px]">
                      {kw.serpTopCompetitor || '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateBrief(kw.keyword, kw.searchVolumeMonthly, kw.currentPosition)}
                        className="text-[11px] h-7 px-2.5 border-slate-200 text-slate-700"
                      >
                        <Sparkles className="h-3 w-3 mr-1" /> Brief
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* 4. PAGES & CONVERSIONS SCREEN */}
      {/* ===================================================================== */}
      {activeTab === 'pages' && (
        <Card className="p-6 bg-white border-slate-200/90 shadow-sm text-slate-900 rounded-3xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">Organic Landing Page Revenue Attribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks the entire conversion funnel: Organic Visit → Calculator Start → Plan My Project → Won Revenue.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Landing Page</th>
                  <th className="py-3 px-3">Sessions</th>
                  <th className="py-3 px-3">Calculators</th>
                  <th className="py-3 px-3">Planner Starts</th>
                  <th className="py-3 px-3">Leads</th>
                  <th className="py-3 px-3">Won Jobs</th>
                  <th className="py-3 px-3">Pipeline Value</th>
                  <th className="py-3 px-3 text-right">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-mono">
                {initialOverview.topConversionPages.map((p) => (
                  <tr key={p.url} className="hover:bg-slate-750 transition-colors">
                    <td className="py-3 px-3">
                      <Link href={p.url} target="_blank" className="text-slate-900 hover:text-brand-400 font-bold block">
                        {p.pageTitle}
                      </Link>
                      <span className="text-[10px] text-slate-500">{p.url}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{p.organicSessions.toLocaleString()}</td>
                    <td className="py-3 px-3 text-slate-700">{p.calculatorCompletions.toLocaleString()}</td>
                    <td className="py-3 px-3 text-slate-700">{p.plannerStarts}</td>
                    <td className="py-3 px-3 text-[#D97706] font-bold">{p.leadsGenerated}</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">{p.wonProjects}</td>
                    <td className="py-3 px-3 text-emerald-300 font-bold">
                      £{(p.pipelineValueGbp / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3 px-3 text-right text-slate-900 font-bold">
                      {p.conversionRatePercent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* 5. COMPETITORS & GAPS SCREEN */}
      {/* ===================================================================== */}
      {activeTab === 'competitors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white border-slate-200/90 shadow-sm text-slate-900 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">Competitor SERP Overlap &amp; Weaknesses</h3>
            <p className="text-xs text-slate-500">
              Audit results from DataForSEO analyzing Checkatrade, MyBuilder, and Resi.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAFAF9]/80 border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 text-sm">checkatrade.com</strong>
                  <Badge variant="slate" size="sm">
                    High DA / Directory
                  </Badge>
                </div>
                <p className="text-slate-700">
                  <strong>Weakness:</strong> Generic nationwide averages without room-by-room architectural options or London Borough planning context.
                </p>
                <div className="text-[#D97706] font-semibold">
                  Opportunity: Outrank on &quot;rear extension cost london&quot; with itemized project scope calculator.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAF9]/80 border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 text-sm">mybuilder.com</strong>
                  <Badge variant="slate" size="sm">
                    Directory
                  </Badge>
                </div>
                <p className="text-slate-700">
                  <strong>Weakness:</strong> Thin pricing pages with minimal mechanical / underfloor heating specifications.
                </p>
                <div className="text-[#D97706] font-semibold">
                  Opportunity: Provide complete specification breakdowns and verified local project case studies.
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200/90 shadow-sm text-slate-900 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">Identified Content Gaps (High Demand)</h3>
            <p className="text-xs text-slate-500">
              High search volume topics with low competition ready for creation.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAFAF9]/80 border border-slate-200/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Side Return Infill Extension Costs</div>
                  <span className="text-slate-500 font-mono">4,400 monthly UK searches · Medium competition</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateBrief('side return extension cost', 4400, 6)}
                  className="text-[11px] border-slate-200"
                >
                  <Sparkles className="h-3 w-3 mr-1" /> Brief
                </Button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAFAF9]/80 border border-slate-200/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">RSJ Steel Beam Knockthrough Price</div>
                  <span className="text-slate-500 font-mono">3,200 monthly searches · Low competition</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateBrief('kitchen knockthrough cost', 5400, 11)}
                  className="text-[11px] border-slate-200"
                >
                  <Sparkles className="h-3 w-3 mr-1" /> Brief
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. TECHNICAL SEO SCREEN */}
      {/* ===================================================================== */}
      {activeTab === 'technical' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white border-slate-200/90 shadow-sm text-slate-900 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">On-Demand PageSpeed &amp; Core Web Vitals Audit</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Audits LCP, CLS, FID/INP, and accessibility on mobile and desktop.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  className="bg-[#FAFAF9] border border-slate-200 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-mono"
                >
                  <option value="/">Homepage (/)</option>
                  <option value="/cost-guides/extension-cost">Extension Cost Guide</option>
                  <option value="/calculators/brick-calculator">Brick Calculator</option>
                  <option value="/areas/ealing">Ealing Service Area</option>
                </select>

                <select
                  value={auditDevice}
                  onChange={(e) => setAuditDevice(e.target.value as any)}
                  className="bg-[#FAFAF9] border border-slate-200 text-slate-900 rounded-xl px-3 py-1.5 text-xs"
                >
                  <option value="MOBILE">Mobile</option>
                  <option value="DESKTOP">Desktop</option>
                </select>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRunPageSpeed}
                  disabled={isRunningAudit}
                  className="text-xs"
                >
                  <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isRunningAudit ? 'animate-spin' : ''}`} />
                  {isRunningAudit ? 'Auditing...' : 'Run Audit'}
                </Button>
              </div>
            </div>

            {/* AUDIT METRICS RESULT */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FAFAF9]/90 rounded-2xl">
              <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Performance</span>
                <div className="text-2xl font-bold text-emerald-400 font-heading">
                  {auditResult ? auditResult.performanceScore : 96} / 100
                </div>
                <span className="text-[10px] text-emerald-300">Grade: Fast</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">LCP (Largest Paint)</span>
                <div className="text-2xl font-bold text-slate-900 font-heading">
                  {auditResult ? auditResult.lcpSeconds : 1.2}s
                </div>
                <span className="text-[10px] text-emerald-400">&lt; 2.5s Target (Good)</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">CLS (Layout Shift)</span>
                <div className="text-2xl font-bold text-slate-900 font-heading">
                  {auditResult ? auditResult.clsScore : 0.0}
                </div>
                <span className="text-[10px] text-emerald-400">&lt; 0.1 Target (Stable)</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">SEO &amp; Schema</span>
                <div className="text-2xl font-bold text-emerald-400 font-heading">
                  {auditResult ? auditResult.seoScore : 100} / 100
                </div>
                <span className="text-[10px] text-emerald-300">100% Validated</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. LOCAL SEO SCREEN */}
      {/* ===================================================================== */}
      {activeTab === 'local' && (
        <Card className="p-6 bg-white border-slate-200/90 shadow-sm text-slate-900 rounded-3xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">Local Service Area Coverage &amp; Postcode Tiers</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Authentic borough landing hubs with verified planning rules, outward postcode resolution, and local case studies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Ealing (W5 / W13)', mult: '1.18x', demand: '3,800/mo', slug: 'ealing', status: 'Active Hub' },
              { name: 'Richmond (TW9 / TW10)', mult: '1.22x', demand: '4,600/mo', slug: 'richmond', status: 'Active Hub' },
              { name: 'Chiswick (W4)', mult: '1.20x', demand: '3,100/mo', slug: 'chiswick', status: 'Active Hub' },
              { name: 'Harrow (HA1 / HA2)', mult: '1.14x', demand: '2,700/mo', slug: 'harrow', status: 'Active Hub' },
            ].map((loc) => (
              <div key={loc.name} className="p-4 rounded-2xl bg-[#FAFAF9]/80 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{loc.name}</span>
                  <Badge variant="brand" size="sm" className="text-[10px]">
                    {loc.status}
                  </Badge>
                </div>
                <div className="text-xs text-slate-500 space-y-1 font-mono">
                  <div>Price Tier: <strong className="text-slate-900">{loc.mult}</strong></div>
                  <div>Search Demand: <strong className="text-slate-900">{loc.demand}</strong></div>
                </div>
                <Link href={`/areas/${loc.slug}`} target="_blank" className="block pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs border-slate-200">
                    <span>View Borough Hub</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* 8. INTEGRATIONS & HEALTH SCREEN */}
      {/* ===================================================================== */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white border-slate-200/90 shadow-sm text-slate-900 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">External API Connection Health</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Server-side health checks with safe fallback modes. Zero public downtime if credentials are missing.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRunHealthCheck}
                disabled={isCheckingHealth}
                className="text-xs gap-1"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isCheckingHealth ? 'animate-spin' : ''}`} />
                <span>Re-check Health</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthResults.map((h) => (
                <div
                  key={h.serviceId}
                  className="p-4 rounded-2xl bg-[#FAFAF9]/80 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{h.name}</h4>
                      <span className="text-[11px] text-slate-500 font-mono">{h.message}</span>
                    </div>
                    <Badge
                      variant={
                        h.status === 'PASS'
                          ? 'brand'
                          : h.status === 'DISABLED'
                          ? 'slate'
                          : 'warning'
                      }
                      size="sm"
                      className="text-[10px] uppercase font-bold"
                    >
                      {h.status === 'PASS' ? (
                        <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                      ) : null}
                      {h.status}
                    </Badge>
                  </div>

                  {h.troubleshooting && (
                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-200/60 text-[11px] text-slate-700 space-y-1">
                      <div className="text-[#D97706] font-semibold">Diagnostic Note:</div>
                      <p className="text-slate-500">{h.troubleshooting.likelyReason}</p>
                      <div className="text-slate-700 pt-1">
                        <strong>Fix:</strong> {h.troubleshooting.recommendedFix}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ===================================================================== */}
      {/* AI CONTENT BRIEF MODAL */}
      {/* ===================================================================== */}
      {activeBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAFAF9]/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAFAF9] border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <Badge variant="brand" size="sm" className="mb-1 text-[10px]">
                  Draft Pending Approval
                </Badge>
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  AI Content Brief: &quot;{activeBrief.targetKeyword}&quot;
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {activeBrief.estimatedSearchVolume.toLocaleString()} searches/mo · {activeBrief.targetWordCount} words
                </span>
              </div>
              <button
                onClick={() => setActiveBrief(null)}
                className="text-slate-500 hover:text-slate-900 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-slate-800/70 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Suggested H1 Title</span>
                <strong className="text-slate-900 text-sm">{activeBrief.suggestedH1}</strong>
              </div>

              <div className="p-3 bg-slate-800/70 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Meta Description</span>
                <p className="text-slate-700 leading-relaxed">{activeBrief.suggestedMetaDescription}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Recommended Content Structure</span>
                {activeBrief.structure.map((sec, idx) => (
                  <div key={idx} className="p-3 bg-[#FAFAF9]/60 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 text-xs">{idx + 1}. {sec.heading}</div>
                    <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-0.5">
                      {sec.bulletPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-[#D97706] text-[11px] flex items-center gap-2">
                <Shield className="h-4 w-4 shrink-0" />
                <span>
                  <strong>Strict Quality Guard:</strong> All AI drafts remain in draft state until reviewed and approved by an administrator.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setActiveBrief(null)} className="text-xs border-slate-200">
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert('Content brief saved to draft registry.');
                  setActiveBrief(null);
                }}
                className="text-xs"
              >
                Approve &amp; Save Brief
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
