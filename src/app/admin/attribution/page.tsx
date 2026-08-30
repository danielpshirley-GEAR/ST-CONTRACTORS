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
          setSelectedJourney(data.report.journeys[0] || null);
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
    return <div className="p-12 text-center text-slate-400">Loading Revenue Attribution Engine...</div>;
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

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 text-left text-white">
      {/* 1. HEADER */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Closed-Loop Revenue Attribution
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Revenue Attribution &amp; Multi-Touch Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Tracks commercial construction revenue (£) back to originating SEO keywords, cost guides, calculators, and customer conversion paths.
          </p>
        </div>

        {/* Model Switcher Buttons */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Model:</span>
          {(['w_shaped', 'first_touch', 'last_touch'] as AttributionModelType[]).map((model) => (
            <button
              key={model}
              onClick={() => setSelectedModel(model)}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize',
                selectedModel === model
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              {model.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 2. EXECUTIVE REVENUE KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Won Contract Revenue</span>
          <div className="text-2xl font-bold text-emerald-400 font-heading">
            £{report.totalRealisedWonRevenueGbp.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">{report.totalWonContracts} signed residential contracts</span>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Active Tender Pipeline</span>
          <div className="text-2xl font-bold text-amber-400 font-heading">
            £{report.totalPipelineValueGbp.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">{report.totalConsultations} qualified consultations</span>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Average Contract Value</span>
          <div className="text-2xl font-bold text-blue-400 font-heading">
            £{report.averageContractValueGbp.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Across London &amp; South East</span>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Avg. Days to Close</span>
          <div className="text-2xl font-bold text-amber-400 font-heading">
            {report.averageDaysToClose} days
          </div>
          <span className="text-[11px] text-slate-400">First touch to signed tender</span>
        </Card>
      </div>

      {/* 3. ASSET ATTRIBUTION LEADERBOARD */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-amber-400" />
            Top Revenue Generating Assets ({selectedModel.replace('_', ' ').toUpperCase()})
          </h2>
          <span className="text-xs text-slate-400 font-medium">Sorted by Attributed Construction Revenue</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4 font-bold">Acquisition Asset / Landing Page</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold text-right">Organic Visits</th>
                  <th className="p-4 font-bold text-right">Consultations</th>
                  <th className="p-4 font-bold text-right">Won Contracts</th>
                  <th className="p-4 font-bold text-right">Attributed Revenue (£)</th>
                  <th className="p-4 font-bold text-right">Marketing ROMI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {report.topAcquisitionAssets.map((asset) => (
                  <tr key={asset.assetUrl} className="hover:bg-slate-850 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white font-heading">{asset.assetTitle}</div>
                      <span className="text-[11px] text-slate-400 font-mono">{asset.assetUrl}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="brand" className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] uppercase">
                        {asset.assetCategory.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 text-right font-mono text-slate-300">{asset.totalOrganicVisits.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono text-amber-400 font-bold">{asset.consultationsBooked}</td>
                    <td className="p-4 text-right font-mono text-emerald-400 font-bold">{asset.wonProjectsCount}</td>
                    <td className="p-4 text-right font-mono font-bold text-white text-sm">
                      £{getAttributedRevenue(asset).toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-emerald-400 font-bold">
                      {asset.romiMultiplier}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. REAL CUSTOMER MULTI-TOUCH JOURNEY VIEWER */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-amber-400" />
          Verified Multi-Touch Customer Journey Timelines
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Journey Select List */}
          <div className="lg:col-span-5 space-y-2">
            {report.journeys.map((j) => (
              <Card
                key={j.leadId}
                onClick={() => setSelectedJourney(j)}
                className={clsx(
                  'p-4 rounded-2xl cursor-pointer transition-all border text-left',
                  selectedJourney?.leadId === j.leadId
                    ? 'bg-slate-850 border-amber-500 shadow-md scale-[1.01]'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white font-heading">{j.customerName}</span>
                  <Badge variant="brand" className="bg-emerald-500 text-emerald-950 font-extrabold text-[10px]">
                    WON £{j.realisedWonRevenueGbp?.toLocaleString()}
                  </Badge>
                </div>
                <div className="text-xs text-slate-400">{j.projectType} • {j.borough}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800 mt-2">
                  <span>{j.touchpoints.length} touchpoints</span>
                  <span>Converted in {j.daysToConvert} days</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Right: Detailed Touchpoint Flow */}
          <div className="lg:col-span-7">
            {selectedJourney && (
              <Card className="p-6 bg-slate-900 border-slate-800 rounded-3xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400">Customer Conversion Path</span>
                    <h3 className="text-lg font-bold font-heading text-white">{selectedJourney.customerName}</h3>
                    <p className="text-xs text-slate-400">{selectedJourney.referenceCode} • {selectedJourney.borough}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Contract Revenue</span>
                    <strong className="text-emerald-400 text-lg font-heading">£{selectedJourney.realisedWonRevenueGbp?.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Touchpoint Timeline */}
                <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-800">
                  {selectedJourney.touchpoints.map((tp, idx) => (
                    <div key={tp.id} className="flex items-start gap-4 relative">
                      <div className="h-8 w-8 rounded-full bg-slate-850 border-2 border-amber-500 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 z-10">
                        {tp.stepNumber}
                      </div>
                      <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-white">{tp.pageTitle}</span>
                          <Badge variant="brand" className="bg-slate-800 text-slate-300 text-[10px] uppercase">
                            {tp.channel.replace('_', ' ')}
                          </Badge>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 block">{tp.pageUrl}</span>
                        <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-2">
                          <span>Action: <strong>{tp.interactionType}</strong></span>
                          {tp.utmSource && <span>• Source: <strong>{tp.utmSource}</strong></span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
