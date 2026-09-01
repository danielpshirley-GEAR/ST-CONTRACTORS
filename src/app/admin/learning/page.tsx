'use client';

import React, { useState, useEffect } from 'react';
import {
  LearningCalibrationOverview,
  ProjectOutturnRecord,
  FunnelStageMetric,
} from '@/types/learning';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  BarChart3,
  Flame,
  Calendar,
  Building,
  Target,
  PoundSterling,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function AdminLearningPage() {
  const [data, setData] = useState<LearningCalibrationOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newOutturn, setNewOutturn] = useState({
    referenceCode: 'ST-2026-',
    customerName: '',
    projectType: 'Rear Extension & Kitchen Knockthrough',
    borough: 'Ealing (W5)',
    propertyEra: 'Victorian',
    status: 'WON_COMPLETED' as const,
    initialEstimatedCostGbp: 75000,
    quotedContractValueGbp: 78000,
    finalActualCostGbp: 79200,
    variancePercentage: 1.54,
    estimatedDurationWeeks: 12,
    actualDurationWeeks: 12,
    stripOutSurprises: '',
    costImpactOfUnforeseenGbp: 1200,
    winLossCategory: 'TRUST_AND_EXPERTISE' as const,
    clientFeedbackNotes: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/learning');
      const json = await res.json();
      if (json.overview) {
        setData(json.overview);
      }
    } catch (err) {
      console.error('Error fetching learning overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOutturn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newOutturn,
          stripOutSurprises: newOutturn.stripOutSurprises
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error('Error creating outturn:', err);
    }
  };

  if (loading || !data) {
    return <div className="p-12 text-center text-slate-500 font-bold">Loading Continuous Learning &amp; CRO Engine...</div>;
  }

  return (
    <div className="py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 text-left bg-[#F4F5F7] min-h-screen text-slate-900">
      {/* 1. HEADER */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" className="bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40 font-bold text-xs">
              <Sparkles className="h-3 w-3 mr-1 text-[#D97706]" />
              Self-Improving Feedback Loop
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            Conversion Rate Optimisation &amp; Pricing Calibration
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Compares initial algorithm estimates against actual completed project outturns to fine-tune future estimations and optimize commercial conversion funnels.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="sm"
          className="font-extrabold text-xs bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 gap-1.5 shrink-0 px-5 py-3 rounded-xl shadow-md cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Log Project Outturn Actuals</span>
        </Button>
      </div>

      {/* 2. EXECUTIVE ACCURACY & FUNNEL KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Estimate Accuracy</span>
          <div className="text-3xl font-extrabold text-emerald-700 font-heading mt-1">
            {data.averageEstimateAccuracyPercent}%
          </div>
          <span className="text-[11px] text-slate-500">Average variance &lt;2.1%</span>
        </Card>

        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Projects Calibrated</span>
          <div className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
            {data.totalWonProjectsAnalyzed + data.totalLostProjectsAnalyzed}
          </div>
          <span className="text-[11px] text-slate-500">{data.totalWonProjectsAnalyzed} won / {data.totalLostProjectsAnalyzed} lost cases</span>
        </Card>

        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">End-to-End Funnel CVR</span>
          <div className="text-3xl font-extrabold text-[#D97706] font-heading mt-1">
            {data.overallFunnelConversionRatePercent}%
          </div>
          <span className="text-[11px] text-slate-500">Visitor to won contract</span>
        </Card>

        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Avg Cost Delta</span>
          <div className="text-3xl font-extrabold text-[#D97706] font-heading mt-1">
            +£{data.averageCostVarianceGbp.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Unforeseen strip-out reserve</span>
        </Card>
      </div>

      {/* 3. END-TO-END COMMERCIAL CONVERSION FUNNEL */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#D97706]" />
          <span>End-to-End Commercial Conversion Funnel</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.funnelStages.map((stage) => (
            <Card key={stage.stageId} className="p-5 bg-white border-slate-200/90 rounded-2xl shadow-sm space-y-3">
              <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider truncate">
                {stage.stageName}
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-heading">
                {stage.visitorsCount.toLocaleString()}
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-medium">
                <span className="text-emerald-700 font-bold">Conversion: {stage.conversionFromPreviousPercent}%</span>
                <span className="text-slate-400">Drop-off: {stage.dropOffPercent}%</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. PRICING CALIBRATION RECOMMENDATIONS */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#D97706]" />
          <span>Live Pricing Calibration Recommendations</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(data.pricingCalibrationFactors || []).map((adj, idx) => (
            <Card key={idx} className="p-5 bg-white border-slate-200/90 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-900">{adj.category}</h3>
                <Badge
                  variant="brand"
                  className={clsx(
                    'text-[10px] font-extrabold',
                    adj.currentBenchmarkDeltaPercent > 0
                      ? 'bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40'
                      : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  )}
                >
                  {adj.currentBenchmarkDeltaPercent > 0 ? `+${adj.currentBenchmarkDeltaPercent}%` : `${adj.currentBenchmarkDeltaPercent}%`}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{adj.recommendedAdjustment}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. OUTTURN AUDITS & WIN/LOSS INTELLIGENCE */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
          <Award className="h-4 w-4 text-[#D97706]" />
          <span>Real Project Outturn Audits &amp; Win/Loss Intelligence</span>
        </h2>

        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#FAFAF9] text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-4 px-5">Project / Reference</th>
                  <th className="py-4 px-5">Location &amp; Era</th>
                  <th className="py-4 px-5">Initial Estimate</th>
                  <th className="py-4 px-5">Quoted Value</th>
                  <th className="py-4 px-5">Final Actual</th>
                  <th className="py-4 px-5">Variance</th>
                  <th className="py-4 px-5">Win / Loss Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data.outturns || []).map((rec) => (
                  <tr key={rec.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      <div>{rec.customerName}</div>
                      <div className="text-[10px] font-mono text-[#D97706] font-bold">{rec.referenceCode}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div>{rec.borough}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{rec.propertyEra}</div>
                    </td>
                    <td className="py-4 px-5 tabular-numbers font-medium text-slate-600">
                      £{rec.initialEstimatedCostGbp.toLocaleString()}
                    </td>
                    <td className="py-4 px-5 tabular-numbers font-bold text-slate-900">
                      £{rec.quotedContractValueGbp.toLocaleString()}
                    </td>
                    <td className="py-4 px-5 tabular-numbers font-extrabold text-slate-900">
                      {rec.finalActualCostGbp ? `£${rec.finalActualCostGbp.toLocaleString()}` : <span className="text-[#D97706]">In Progress</span>}
                    </td>
                    <td className="py-4 px-5">
                      {rec.variancePercentage !== undefined ? (
                        <span
                          className={clsx(
                            'font-extrabold text-[11px]',
                            rec.variancePercentage <= 2 ? 'text-emerald-700' : 'text-[#D97706]'
                          )}
                        >
                          {rec.variancePercentage > 0 ? `+${rec.variancePercentage}%` : `${rec.variancePercentage}%`}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <Badge variant="brand" className="text-[9px] bg-slate-100 text-slate-800 border-slate-200 font-bold mb-1">
                        {rec.winLossCategory.replace(/_/g, ' ')}
                      </Badge>
                      {rec.clientFeedbackNotes && (
                        <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                          {rec.clientFeedbackNotes}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="bg-white border-slate-200 p-6 sm:p-8 max-w-lg w-full space-y-4 rounded-3xl shadow-2xl text-slate-900">
            <h3 className="text-lg font-extrabold font-heading text-slate-900">Log Completed Project Outturn</h3>
            <form onSubmit={handleCreateOutturn} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newOutturn.customerName}
                  onChange={(e) => setNewOutturn({ ...newOutturn, customerName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAF9] border border-slate-300 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Initial Estimate (£)</label>
                  <input
                    type="number"
                    required
                    value={newOutturn.initialEstimatedCostGbp}
                    onChange={(e) => setNewOutturn({ ...newOutturn, initialEstimatedCostGbp: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF9] border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Final Actual Cost (£)</label>
                  <input
                    type="number"
                    required
                    value={newOutturn.finalActualCostGbp}
                    onChange={(e) => setNewOutturn({ ...newOutturn, finalActualCostGbp: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF9] border border-slate-300 text-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-[#FFAA4F] text-slate-950 font-bold">
                  Save Calibration Data
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
