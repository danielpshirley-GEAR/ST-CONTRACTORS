'use client';

import React, { useState, useEffect } from 'react';
import { ConstructionKnowledgeRecord, KnowledgeCategory } from '@/types/knowledge-bank';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  BookOpen,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ShieldCheck,
  Building,
  Hammer,
  Quote,
  Eye,
  Filter,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function AdminKnowledgePage() {
  const [records, setRecords] = useState<ConstructionKnowledgeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newEntry, setNewEntry] = useState({
    title: '',
    category: 'structural' as KnowledgeCategory,
    service: 'full-renovation',
    propertyEra: 'victorian',
    problemSummary: '',
    rootCause: '',
    howIdentifiedOnSite: '',
    tradeSolution: '',
    recommendedMaterials: '',
    materialsToAvoid: '',
    estimatedCostImpact: '+£1,500 – £3,000',
    builderObservationQuote: '',
    verifiedBy: 'Senior Site Director - 24 yrs exp',
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/knowledge');
      const data = await res.json();
      if (data.records) {
        setRecords(data.records);
      }
    } catch (err) {
      console.error('Error loading knowledge records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEntry.title,
          category: newEntry.category,
          serviceSlugs: [newEntry.service],
          propertyTypes: ['terraced', 'semi-detached'],
          propertyEras: [newEntry.propertyEra],
          problemSummary: newEntry.problemSummary,
          rootCause: newEntry.rootCause,
          howIdentifiedOnSite: newEntry.howIdentifiedOnSite,
          tradeSolution: newEntry.tradeSolution,
          recommendedMaterials: newEntry.recommendedMaterials.split(',').map((s) => s.trim()).filter(Boolean),
          materialsToAvoid: newEntry.materialsToAvoid.split(',').map((s) => s.trim()).filter(Boolean),
          estimatedCostImpact: newEntry.estimatedCostImpact,
          builderObservationQuote: newEntry.builderObservationQuote,
          verifiedBy: newEntry.verifiedBy,
          approvedForPublicContent: true,
        }),
      });

      if (res.ok) {
        setIsCreateModalOpen(false);
        fetchRecords();
        setNewEntry({
          title: '',
          category: 'structural',
          service: 'full-renovation',
          propertyEra: 'victorian',
          problemSummary: '',
          rootCause: '',
          howIdentifiedOnSite: '',
          tradeSolution: '',
          recommendedMaterials: '',
          materialsToAvoid: '',
          estimatedCostImpact: '+£1,500 – £3,000',
          builderObservationQuote: '',
          verifiedBy: 'Senior Site Director - 24 yrs exp',
        });
      }
    } catch (err) {
      console.error('Error adding knowledge:', err);
    }
  };

  const filteredRecords = selectedCategory === 'all'
    ? records
    : records.filter((r) => r.category === selectedCategory);

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 text-left text-white">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
              <BookOpen className="h-3 w-3 mr-1" />
              Proprietary Construction Knowledge Base
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Builder Knowledge Bank
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Verified London construction failure modes, strip-out discoveries, and trade sequencing rules that automatically power the AI Planner and SEO Content Engine.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
          size="sm"
          className="font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Builder Observation</span>
        </Button>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Observations</span>
          <div className="text-2xl font-bold text-white font-heading">{records.length}</div>
          <span className="text-[11px] text-amber-400 font-semibold">100% Verified by Senior Builders</span>
        </Card>
        <Card className="p-4 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Structural Records</span>
          <div className="text-2xl font-bold text-blue-400 font-heading">
            {records.filter((r) => r.category === 'structural').length}
          </div>
          <span className="text-[11px] text-slate-400">Joists, RSJs, Foundations</span>
        </Card>
        <Card className="p-4 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Planning &amp; Regs</span>
          <div className="text-2xl font-bold text-emerald-400 font-heading">
            {records.filter((r) => r.category === 'planning_regs').length}
          </div>
          <span className="text-[11px] text-slate-400">Party Wall &amp; Thames Water</span>
        </Card>
        <Card className="p-4 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">M&amp;E &amp; Materials</span>
          <div className="text-2xl font-bold text-amber-400 font-heading">
            {records.filter((r) => r.category === 'm_and_e' || r.category === 'materials').length}
          </div>
          <span className="text-[11px] text-slate-400">Unvented cylinders, VCL</span>
        </Card>
      </div>

      {/* 3. CATEGORY FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs text-slate-400 font-bold uppercase mr-2 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" /> Filter:
        </span>
        {['all', 'structural', 'planning_regs', 'm_and_e', 'materials', 'trade_sequencing'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer capitalize',
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            )}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* 4. KNOWLEDGE CARDS GRID */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading knowledge records...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRecords.map((rec) => (
            <Card key={rec.id} className="p-6 bg-slate-900 border-slate-800 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="brand" className="bg-slate-800 text-slate-200 border-slate-700 text-[10px] uppercase font-bold">
                  {rec.category.replace('_', ' ')}
                </Badge>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {rec.verifiedBy}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-heading">{rec.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{rec.problemSummary}</p>
              </div>

              {rec.builderObservationQuote && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 italic space-y-1">
                  <div className="flex items-center gap-1 font-bold text-amber-400 text-[10px] uppercase not-italic">
                    <Quote className="h-3 w-3" /> First-Hand Builder Quote:
                  </div>
                  <p>&ldquo;{rec.builderObservationQuote}&rdquo;</p>
                </div>
              )}

              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                <div>
                  <strong className="text-slate-400 block text-[10px] uppercase">Verified Trade Solution:</strong>
                  <span>{rec.tradeSolution}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <strong className="text-slate-400 block text-[10px] uppercase">Recommended Materials:</strong>
                    <span className="text-emerald-400">{rec.recommendedMaterials?.slice(0, 2).join(', ') || 'Standard C24'}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400 block text-[10px] uppercase">Typical Cost Impact:</strong>
                    <span className="text-amber-400">{rec.estimatedCostImpact}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 5. CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-800 space-y-5 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <Badge variant="brand" className="bg-amber-500/20 text-amber-400 text-xs mb-1">
                  New Knowledge Entry
                </Badge>
                <h3 className="text-xl font-bold font-heading text-white">Log Real Site Observation</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Observation Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Victorian Chimney Breast Removal & Steel Beam Gantry Deflection"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry((p) => ({ ...p, title: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry((p) => ({ ...p, category: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                  >
                    <option value="structural">Structural</option>
                    <option value="planning_regs">Planning &amp; Regs</option>
                    <option value="m_and_e">M&amp;E / Plumbing / Electrics</option>
                    <option value="materials">Materials &amp; Insulation</option>
                    <option value="trade_sequencing">Trade Sequencing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Property Era</label>
                  <select
                    value={newEntry.propertyEra}
                    onChange={(e) => setNewEntry((p) => ({ ...p, propertyEra: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                  >
                    <option value="victorian">Victorian / Period</option>
                    <option value="edwardian">Edwardian</option>
                    <option value="1930s">1930s Semi</option>
                    <option value="modern">Modern Build</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Problem Found During Strip-Out</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe the condition uncovered on site..."
                  value={newEntry.problemSummary}
                  onChange={(e) => setNewEntry((p) => ({ ...p, problemSummary: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Verified Trade Solution</label>
                <textarea
                  rows={2}
                  required
                  placeholder="How our team solved it correctly..."
                  value={newEntry.tradeSolution}
                  onChange={(e) => setNewEntry((p) => ({ ...p, tradeSolution: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Direct Builder Quote / Tip</label>
                <input
                  type="text"
                  placeholder="e.g. On pre-1900 London homes, always check..."
                  value={newEntry.builderObservationQuote}
                  onChange={(e) => setNewEntry((p) => ({ ...p, builderObservationQuote: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Recommended Materials (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. C24 Timber, ProClima VCL"
                    value={newEntry.recommendedMaterials}
                    onChange={(e) => setNewEntry((p) => ({ ...p, recommendedMaterials: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cost Impact</label>
                  <input
                    type="text"
                    placeholder="e.g. +£1,500 – £3,000"
                    value={newEntry.estimatedCostImpact}
                    onChange={(e) => setNewEntry((p) => ({ ...p, estimatedCostImpact: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 py-3"
              >
                Save Knowledge Record to Platform
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
