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
    return <div className="p-12 text-center text-slate-400">Loading Continuous Learning &amp; CRO Engine...</div>;
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 text-left text-white">
      {/* 1. HEADER */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Self-Improving Feedback Loop
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Conversion Rate Optimisation &amp; Pricing Calibration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Compares initial algorithm estimates against actual completed project outturns to fine-tune future estimations and optimize commercial conversion funnels.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="sm"
          className="font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Log Project Outturn Actuals</span>
        </Button>
      </div>

      {/* 2. EXECUTIVE ACCURACY & FUNNEL KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Estimate Accuracy</span>
          <div className="text-2xl font-bold text-emerald-400 font-heading">
            {data.averageEstimateAccuracyPercent}%
          </div>
          <span className="text-[11px] text-slate-400">Average variance &lt;2.1%</span>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Projects Calibrated</span>
          <div className="text-2xl font-bold text-blue-400 font-heading">
            {data.totalWonProjectsAnalyzed + data.totalLostProjectsAnalyzed}
          </div>
          <span className="text-[11px] text-slate-400">{data.totalWonProjectsAnalyzed} won / {data.totalLostProjectsAnalyzed} lost cases</span>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">End-to-End Funnel CVR</span>
          <div className="text-2xl font-bold text-amber-400 font-heading">
            {data.overallFunnelConversionRatePercent}%
          </div>
          <span className="text-[11px] text-slate-400">Visitor to won contract</span>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Avg Cost Delta</span>
          <div className="text-2xl font-bold text-amber-400 font-heading">
            +£{data.averageCostVarianceGbp.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Unforeseen strip-out reserve</span>
        </Card>
      </div>

      {/* 3. FULL-FUNNEL CONVERSION DROP-OFF VISUALISER */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-amber-400" />
          End-to-End Commercial Conversion Funnel
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.funnelStages.slice(0, 4).map((st) => (
            <Card key={st.stageId} className="p-4 bg-slate-900 border-slate-800 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">{st.stageName}</span>
              <div className="text-xl font-bold text-white font-heading">{st.visitorsCount.toLocaleString()}</div>
              <div className="text-[11px] flex items-center justify-between pt-1 border-t border-slate-800 text-slate-400">
                <span>Conversion: <strong className="text-emerald-400">{st.conversionFromPreviousPercent}%</strong></span>
                <span>Drop-off: <strong className="text-rose-400">{st.dropOffPercent}%</strong></span>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.funnelStages.slice(4).map((st) => (
            <Card key={st.stageId} className="p-4 bg-slate-900 border-slate-800 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">{st.stageName}</span>
              <div className="text-xl font-bold text-white font-heading">{st.visitorsCount.toLocaleString()}</div>
              <div className="text-[11px] flex items-center justify-between pt-1 border-t border-slate-800 text-slate-400">
                <span>Stage CVR: <strong className="text-emerald-400">{st.conversionFromPreviousPercent}%</strong></span>
                <span>Drop-off: <strong className="text-rose-400">{st.dropOffPercent}%</strong></span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. PRICING CALIBRATION BENCHMARK RECOMMENDATIONS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-amber-400" />
          Live Pricing Calibration Recommendations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.pricingCalibrationFactors.map((cal, idx) => (
            <Card key={idx} className="p-5 bg-slate-900 border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-white font-heading">{cal.category}</h3>
                <Badge
                  variant="brand"
                  className={clsx(
                    'text-[10px] font-bold',
                    cal.currentBenchmarkDeltaPercent > 0
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  )}
                >
                  {cal.currentBenchmarkDeltaPercent > 0 ? `+${cal.currentBenchmarkDeltaPercent}%` : `${cal.currentBenchmarkDeltaPercent}%`}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{cal.recommendedAdjustment}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. VERIFIED PROJECT OUTTURNS TABLE */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-400" />
          Real Project Outturn Audits &amp; Win/Loss Intelligence
        </h2>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4 font-bold">Project / Reference</th>
                  <th className="p-4 font-bold">Location &amp; Era</th>
                  <th className="p-4 font-bold text-right">Initial Estimate</th>
                  <th className="p-4 font-bold text-right">Quoted Value</th>
                  <th className="p-4 font-bold text-right">Final Actual</th>
                  <th className="p-4 font-bold text-right">Variance</th>
                  <th className="p-4 font-bold">Win / Loss Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.outturns.map((out) => (
                  <tr key={out.id} className="hover:bg-slate-850 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white font-heading">{out.customerName}</div>
                      <span className="text-[11px] text-slate-400 font-mono">{out.referenceCode}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-300">{out.borough}</div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">{out.propertyEra}</span>
                    </td>
                    <td className="p-4 text-right font-mono text-slate-400">£{out.initialEstimatedCostGbp.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono text-amber-400 font-bold">£{out.quotedContractValueGbp.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono text-emerald-400 font-bold">
                      {out.finalActualCostGbp ? `£${out.finalActualCostGbp.toLocaleString()}` : 'In Progress'}
                    </td>
                    <td className="p-4 text-right font-mono font-bold">
                      {out.variancePercentage !== undefined ? (
                        <span className={out.variancePercentage > 2 ? 'text-amber-400' : 'text-emerald-400'}>
                          {out.variancePercentage > 0 ? `+${out.variancePercentage}%` : `${out.variancePercentage}%`}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-4 max-w-xs">
                      <Badge variant="brand" className="bg-slate-800 text-slate-300 text-[10px] uppercase mb-1">
                        {out.winLossCategory.replace(/_/g, ' ')}
                      </Badge>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{out.clientFeedbackNotes}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. LOG OUTTURN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-800 space-y-4 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <Badge variant="brand" className="bg-amber-500/20 text-amber-400 text-xs mb-1">
                  Pricing Feedback Loop
                </Badge>
                <h3 className="text-xl font-bold font-heading text-white">Log Project Outturn Actuals</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOutturn} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Reference Code</label>
                  <input
                    type="text"
                    required
                    value={newOutturn.referenceCode}
                    onChange={(e) => setNewOutturn((p) => ({ ...p, referenceCode: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Julian Thorne"
                    value={newOutturn.customerName}
                    onChange={(e) => setNewOutturn((p) => ({ ...p, customerName: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Initial Est. (£)</label>
                  <input
                    type="number"
                    required
                    value={newOutturn.initialEstimatedCostGbp}
                    onChange={(e) => setNewOutturn((p) => ({ ...p, initialEstimatedCostGbp: Number(e.target.value) }))}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Quoted (£)</label>
                  <input
                    type="number"
                    required
                    value={newOutturn.quotedContractValueGbp}
                    onChange={(e) => setNewOutturn((p) => ({ ...p, quotedContractValueGbp: Number(e.target.value) }))}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Final Actual (£)</label>
                  <input
                    type="number"
                    required
                    value={newOutturn.finalActualCostGbp}
                    onChange={(e) => setNewOutturn((p) => ({ ...p, finalActualCostGbp: Number(e.target.value) }))}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Win/Loss Category</label>
                <select
                  value={newOutturn.winLossCategory}
                  onChange={(e) => setNewOutturn((p) => ({ ...p, winLossCategory: e.target.value as any }))}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                >
                  <option value="TRUST_AND_EXPERTISE">Trust &amp; Expert Advice</option>
                  <option value="SPECIFICATION_QUALITY">Specification Quality &amp; Transparency</option>
                  <option value="PRICE_COMPETITIVENESS">Price Competitiveness</option>
                  <option value="TIMELINE">Timeline &amp; Guaranteed Schedule</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Client Feedback Notes</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Why the customer chose our proposal..."
                  value={newOutturn.clientFeedbackNotes}
                  onChange={(e) => setNewOutturn((p) => ({ ...p, clientFeedbackNotes: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 py-3"
              >
                Ingest Outturn into Calibration Engine
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
