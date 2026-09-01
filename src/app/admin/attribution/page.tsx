'use client';

import React, { useState, useEffect } from 'react';
import {
  AttributionOverviewReport,
  AttributionModelType,
  AssetAttributionSummary,
  CustomerJourneyRecord,
} from '@/types/attribution';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  TrendingUp,
  PoundSterling,
  Sparkles,
  Search,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Target,
  BarChart3,
  Filter,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function AdminAttributionPage() {
  const [report, setReport] = useState<AttributionOverviewReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<AttributionModelType>('w_shaped');
  const [selectedJourney, setSelectedJourney] = useState<CustomerJourneyRecord | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/attribution');
        const data = await res.json();
        if (data.report) {
          setReport(data.report);
          setSelectedJourney(data.report.journeys?.[0] || null);
        }
      } catch (err) {
        console.error('Error fetching attribution report:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !report) {
    return <div className="p-12 text-center text-slate-500 font-bold">Loading Revenue Attribution Engine...</div>;
  }

  const getAttributedRevenue = (asset: AssetAttributionSummary) => {
    switch (selectedModel) {
      case 'first_touch':
        return asset.firstTouchAttributedRevenueGbp;
      case 'last_touch':
        return asset.lastTouchAttributedRevenueGbp;
      case 'w_shaped':
      default:
        return asset.wShapedAttributedRevenueGbp;
    }
  };

  const assetList = report.topAcquisitionAssets || [];

  return (
    <div className="py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 text-left bg-[#F4F5F7] min-h-screen text-slate-900">
      {/* 1. HEADER */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" className="bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40 font-bold text-xs">
              <TrendingUp className="h-3 w-3 mr-1 text-[#D97706]" />
              Closed-Loop Revenue Attribution
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            Revenue Attribution &amp; Multi-Touch Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Tracks commercial construction revenue (£) back to originating SEO keywords, cost guides, calculators, and customer conversion paths.
          </p>
        </div>

        {/* Model Switcher Buttons */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-auto">
          <span className="text-[10px] uppercase font-bold text-slate-500 px-2">Model:</span>
          {(['w_shaped', 'first_touch', 'last_touch'] as AttributionModelType[]).map((model) => (
            <button
              key={model}
              onClick={() => setSelectedModel(model)}
              className={clsx(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize',
                selectedModel === model
                  ? 'bg-[#FFAA4F] text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {model.replace('_', '-')}
            </button>
          ))}
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Total Pipeline</span>
          <div className="text-3xl font-extrabold text-slate-900 font-heading tabular-numbers">
            £{report.totalPipelineValueGbp.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">{report.journeys?.length || 0} Tracked Projects</span>
        </Card>

        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Won Revenue</span>
          <div className="text-3xl font-extrabold text-emerald-700 font-heading tabular-numbers">
            £{report.totalRealisedWonRevenueGbp.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold">{report.totalWonContracts} Executed Contracts</span>
        </Card>

        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Top Value Channel</span>
          <div className="text-xl font-extrabold text-[#D97706] font-heading truncate mt-1">
            {assetList[0]?.assetTitle || 'Wraparound Extension'}
          </div>
          <span className="text-[11px] text-slate-500">Highest attributed revenue</span>
        </Card>

        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Avg Contract Value</span>
          <div className="text-3xl font-extrabold text-slate-900 font-heading tabular-numbers">
            £{(report.averageContractValueGbp || 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Across won contracts</span>
        </Card>
      </div>

      {/* 3. ASSETS REVENUE TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">
            Content Asset &amp; Calculator Attribution Breakdown
          </h2>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Active Model: {selectedModel.toUpperCase()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAFAF9] text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-4 px-5">Asset / Content URL</th>
                <th className="py-4 px-5">Type</th>
                <th className="py-4 px-5">First Touch</th>
                <th className="py-4 px-5">Last Touch</th>
                <th className="py-4 px-5 font-bold text-slate-900">Attributed Revenue (£)</th>
                <th className="py-4 px-5 text-right">Won Contracts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assetList.map((asset, idx) => (
                <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-4 px-5 font-bold text-slate-900">
                    <div>{asset.assetTitle}</div>
                    <div className="text-[10px] text-slate-400 font-mono font-normal">{asset.assetUrl}</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2 py-0.5 rounded-md bg-[#FFAA4F]/20 text-[#D97706] text-[10px] font-bold uppercase">
                      {asset.assetCategory}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono text-slate-600">£{asset.firstTouchAttributedRevenueGbp.toLocaleString()}</td>
                  <td className="py-4 px-5 font-mono text-slate-600">£{asset.lastTouchAttributedRevenueGbp.toLocaleString()}</td>
                  <td className="py-4 px-5 font-extrabold text-emerald-700 tabular-numbers text-sm font-mono">
                    £{getAttributedRevenue(asset).toLocaleString()}
                  </td>
                  <td className="py-4 px-5 text-right font-extrabold text-slate-900">{asset.wonProjectsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
