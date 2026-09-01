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
  PoundSterling,
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

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEntry,
          recommendedMaterials: newEntry.recommendedMaterials.split(',').map((s) => s.trim()).filter(Boolean),
          materialsToAvoid: newEntry.materialsToAvoid.split(',').map((s) => s.trim()).filter(Boolean),
          serviceSlugs: [newEntry.service],
          propertyTypes: ['terraced', 'semi-detached'],
          propertyEras: [newEntry.propertyEra],
          warningSignsForHomeowners: ['Cracking plaster', 'Springy floor joists', 'Damp along skirtings'],
          whyThisSolution: 'Standard industry structural best practice for London period stock.',
          tradeSequence: ['Strip-out & propping', 'Structural RSJ installation', 'Padstone curing', 'Joinery reinstatement'],
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
    <div className="py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 text-left bg-[#F4F5F7] min-h-screen text-slate-900">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" className="bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40 font-bold text-xs">
              <BookOpen className="h-3 w-3 mr-1 text-[#D97706]" />
              Proprietary Construction Knowledge Base
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            Builder Knowledge Bank
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Verified London construction failure modes, strip-out discoveries, and trade sequencing rules that automatically power the AI Planner and SEO Content Engine.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
          size="sm"
          className="font-extrabold text-xs bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 gap-1.5 shrink-0 px-5 py-3 rounded-xl shadow-md cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Builder Observation</span>
        </Button>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Total Observations</span>
          <div className="text-3xl font-extrabold text-slate-900 font-heading">{records.length}</div>
          <span className="text-[11px] text-[#D97706] font-bold">100% Verified by Senior Builders</span>
        </Card>
        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Structural Records</span>
          <div className="text-3xl font-extrabold text-slate-900 font-heading">
            {records.filter((r) => r.category === 'structural').length}
          </div>
          <span className="text-[11px] text-slate-500">Joists, RSJs, Foundations</span>
        </Card>
        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Planning &amp; Regs</span>
          <div className="text-3xl font-extrabold text-emerald-700 font-heading">
            {records.filter((r) => r.category === 'planning_regs').length}
          </div>
          <span className="text-[11px] text-slate-500">Party Wall &amp; Thames Water</span>
        </Card>
        <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">M&amp;E &amp; Materials</span>
          <div className="text-3xl font-extrabold text-[#D97706] font-heading">
            {records.filter((r) => r.category === 'm_and_e' || r.category === 'materials').length}
          </div>
          <span className="text-[11px] text-slate-500">Unvented cylinders, VCL</span>
        </Card>
      </div>

      {/* 3. CATEGORY FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <span className="text-xs text-slate-500 font-bold uppercase mr-2 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5 text-[#D97706]" /> Filter:
        </span>
        {['all', 'structural', 'planning_regs', 'm_and_e', 'materials', 'trade_sequencing'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize',
              selectedCategory === cat
                ? 'bg-[#FFAA4F] text-slate-950 font-black shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            )}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* 4. KNOWLEDGE CARDS GRID */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-bold">Loading knowledge bank records...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRecords.map((rec) => (
            <Card key={rec.id} className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm space-y-4 text-left hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="brand" className="text-[10px] font-extrabold bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40 uppercase">
                      {rec.category.replace('_', ' ')}
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">{rec.id}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 font-heading leading-snug">
                    {rec.title}
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px] text-slate-700 border-slate-300 capitalize shrink-0">
                  {rec.propertyEras?.[0] || 'Period Home'}
                </Badge>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200/90 space-y-1.5 text-xs text-slate-700">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#D97706]" />
                  <span>Problem &amp; Strip-Out Reality:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{rec.problemSummary}</p>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  <strong>Root Cause:</strong> {rec.rootCause}
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Trade Solution &amp; Materials:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{rec.tradeSolution}</p>
                {rec.recommendedMaterials && rec.recommendedMaterials.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rec.recommendedMaterials.map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                        ✓ {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {rec.builderObservationQuote && (
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2 italic">
                  <Quote className="h-4 w-4 text-[#D97706] shrink-0 mt-0.5" />
                  <span>&ldquo;{rec.builderObservationQuote}&rdquo;</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Verified: {rec.verifiedBy || 'Senior Project Director'}
                </span>
                <span className="font-mono font-bold text-slate-800">Impact: {rec.estimatedCostImpact || 'Standard'}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="bg-white border-slate-200 p-6 sm:p-8 max-w-xl w-full space-y-4 rounded-3xl shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-extrabold font-heading text-slate-900">Add Builder Knowledge Record</h3>
              <Badge variant="brand" className="bg-[#FFAA4F]/20 text-[#D97706] font-bold">Internal Trade Rule</Badge>
            </div>
            <form onSubmit={handleAddRecord} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Observation Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Victorian Suspended Floor Bounciness & Joist Sistering"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAF9] border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Trade Category</label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value as KnowledgeCategory })}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF9] border border-slate-300 text-slate-900"
                  >
                    <option value="structural">Structural</option>
                    <option value="planning_regs">Planning &amp; Regs</option>
                    <option value="m_and_e">M&amp;E Plumbing &amp; Electrical</option>
                    <option value="materials">Materials</option>
                    <option value="trade_sequencing">Trade Sequencing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Property Era</label>
                  <select
                    value={newEntry.propertyEra}
                    onChange={(e) => setNewEntry({ ...newEntry, propertyEra: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF9] border border-slate-300 text-slate-900"
                  >
                    <option value="victorian">Victorian (1837–1901)</option>
                    <option value="edwardian">Edwardian (1901–1914)</option>
                    <option value="1930s">1930s Suburban</option>
                    <option value="georgian">Georgian</option>
                    <option value="modern">Modern Post-1980</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Problem &amp; Strip-Out Discovery</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What unexpected defect or construction detail is discovered during strip-out..."
                  value={newEntry.problemSummary}
                  onChange={(e) => setNewEntry({ ...newEntry, problemSummary: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAF9] border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Builder Trade Solution</label>
                <textarea
                  rows={2}
                  required
                  placeholder="How our site team engineers and permanently fixes this issue..."
                  value={newEntry.tradeSolution}
                  onChange={(e) => setNewEntry({ ...newEntry, tradeSolution: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAF9] border border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-[#FFAA4F] text-slate-950 font-bold">
                  Save Knowledge Record
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
