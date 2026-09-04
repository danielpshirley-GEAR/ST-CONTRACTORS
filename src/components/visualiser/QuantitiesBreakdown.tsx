'use client';

import React, { useState } from 'react';
import { CalculatedQuantityItem, StructuralEngineerSpec } from '@/types/visualiser-scope';
import {
  Ruler,
  Calculator,
  Info,
  AlertTriangle,
  HardHat,
  PlusCircle,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QuantitiesBreakdownProps {
  quantities: CalculatedQuantityItem[];
  onEditDimensions: () => void;
  onSaveEngineerSpec?: (spec: StructuralEngineerSpec) => void;
  currentEngineerSpec?: StructuralEngineerSpec;
}

export function QuantitiesBreakdown({
  quantities,
  onEditDimensions,
  onSaveEngineerSpec,
  currentEngineerSpec,
}: QuantitiesBreakdownProps) {
  const [activeFormulaModal, setActiveFormulaModal] = useState<CalculatedQuantityItem | null>(null);
  const [showEngineerModal, setShowEngineerModal] = useState(false);

  const [sectionDesig, setSectionDesig] = useState(currentEngineerSpec?.sectionDesignation || '203 x 133 x 30 UB');
  const [massPerM, setMassPerM] = useState(currentEngineerSpec?.massPerMetre?.toString() || '30');
  const [memberLen, setMemberLen] = useState(currentEngineerSpec?.memberLength?.toString() || '4.5');
  const [memberCount, setMemberCount] = useState(currentEngineerSpec?.memberCount?.toString() || '1');
  const [padstones, setPadstones] = useState(currentEngineerSpec?.padstones?.toString() || '2');

  const handleSaveSpec = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveEngineerSpec) {
      onSaveEngineerSpec({
        sectionDesignation: sectionDesig,
        massPerMetre: parseFloat(massPerM) || 30,
        memberLength: parseFloat(memberLen) || 4.5,
        memberCount: parseInt(memberCount, 10) || 1,
        padstones: parseInt(padstones, 10) || 2,
        bearingSpecification: '150mm concrete padstone Class C30',
        calculationStatus: 'fully_specified',
      });
    }
    setShowEngineerModal(false);
  };

  return (
    <div id="section-quantities" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 8 • Bill of Quantities &amp; Takeoffs
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Deterministic Project Quantities
          </h2>
        </div>
        <button
          type="button"
          onClick={onEditDimensions}
          className="text-xs font-bold text-[#FFAA4F] hover:text-amber-800 flex items-center gap-1"
        >
          <Ruler className="h-3.5 w-3.5" />
          <span>Edit Dimensions</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quantities.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {item.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    item.confidence === 'CALCULATED_FROM_CONFIRMED_INPUT'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : item.confidence === 'ESTIMATED_FROM_ASSUMPTION'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : item.confidence === 'ENGINEERING_REQUIRED'
                      ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.confidence === 'CALCULATED_FROM_CONFIRMED_INPUT'
                    ? 'Calculated'
                    : item.confidence === 'ESTIMATED_FROM_ASSUMPTION'
                    ? 'Estimated'
                    : item.confidence === 'ENGINEERING_REQUIRED'
                    ? 'Engineering Required'
                    : 'Insufficient Info'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 font-heading">
                {item.item}
              </h3>

              <div className="pt-1">
                {item.confidence === 'ENGINEERING_REQUIRED' ? (
                  <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 space-y-1.5">
                    <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <HardHat className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{item.unit}</span>
                    </span>
                    {item.engineeringNote && (
                      <p className="text-[10px] text-indigo-800 leading-tight">
                        {item.engineeringNote}
                      </p>
                    )}
                    {item.materialCategory === 'steel' && onSaveEngineerSpec && (
                      <button
                        type="button"
                        onClick={() => setShowEngineerModal(true)}
                        className="mt-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline flex items-center gap-1"
                      >
                        <PlusCircle className="w-3 h-3" />
                        Enter Verified Engineer Steel Spec
                      </button>
                    )}
                  </div>
                ) : item.confidence === 'INSUFFICIENT_INFORMATION' ? (
                  <span className="text-xs font-bold text-slate-400 italic">
                    Requires confirmed dimensions
                  </span>
                ) : (
                  <div className="space-y-0.5">
                    <span className="text-xl font-extrabold text-slate-900 font-heading tabular-numbers">
                      {item.totalWithWaste} {item.unit}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {item.basis}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={() => setActiveFormulaModal(item)}
                className="text-[#FFAA4F] hover:text-amber-800 font-bold flex items-center gap-1 text-[11px]"
              >
                <Info className="h-3 w-3" />
                <span>View Formula &amp; Waste</span>
              </button>
              {item.wastePercent > 0 && (
                <span className="text-[10px] font-semibold text-slate-400">
                  +{item.wastePercent}% cutting allowance
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Formula Transparency Modal */}
      {activeFormulaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                Formula &amp; Calculation Basis
              </h3>
              <button
                type="button"
                onClick={() => setActiveFormulaModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Item</span>
                <span className="font-bold text-slate-900 text-sm">{activeFormulaModal.item}</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Basis</span>
                <p className="font-medium text-slate-800">{activeFormulaModal.basis}</p>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Formula Explanation</span>
                <p className="font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-900 text-xs leading-relaxed">
                  {activeFormulaModal.formulaExplanation}
                </p>
              </div>

              {activeFormulaModal.wastePercent > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  <span className="font-bold block mb-0.5">Material Waste Factor: {activeFormulaModal.wastePercent}%</span>
                  <span className="text-[11px] text-amber-800">
                    Accounts for layout cutting offcuts, boundary cuts, and profile trimming.
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveFormulaModal(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Engineer Specification Input Modal (Item 22) */}
      {showEngineerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveSpec}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <HardHat className="w-4 h-4 text-indigo-600" />
                <span>Structural Engineer Steel Spec</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEngineerModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Section Designation</label>
                <input
                  type="text"
                  value={sectionDesig}
                  onChange={(e) => setSectionDesig(e.target.value)}
                  placeholder="e.g. 203 x 133 x 30 UB"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mass (kg/m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={massPerM}
                    onChange={(e) => setMassPerM(e.target.value)}
                    placeholder="e.g. 30"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Length (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={memberLen}
                    onChange={(e) => setMemberLen(e.target.value)}
                    placeholder="e.g. 4.5"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Member Count</label>
                  <input
                    type="number"
                    value={memberCount}
                    onChange={(e) => setMemberCount(e.target.value)}
                    placeholder="1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Padstones</label>
                  <input
                    type="number"
                    value={padstones}
                    onChange={(e) => setPadstones(e.target.value)}
                    placeholder="2"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEngineerModal(false)}
                className="flex-1 text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Save &amp; Calculate Steel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
