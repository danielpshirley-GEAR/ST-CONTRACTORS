'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DbSavedCalculation } from '@/lib/db/schema';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Calculator, ExternalLink, Trash2, ArrowRight } from 'lucide-react';

interface SavedCalculationsListProps {
  initialCalculations: DbSavedCalculation[];
}

export function SavedCalculationsList({ initialCalculations }: SavedCalculationsListProps) {
  const [calculations, setCalculations] = useState<DbSavedCalculation[]>(initialCalculations);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved calculation?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/customer/calculations?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCalculations((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {calculations.map((c) => (
        <Card
          key={c.id}
          className="p-6 bg-slate-900 border-slate-800 hover:border-slate-700 transition-all rounded-3xl flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="brand" size="sm" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px] uppercase mb-1">
                  {c.category}
                </Badge>
                <h3 className="text-lg font-bold text-white font-heading">{c.calculatorTitle}</h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Saved {new Date(c.savedAt).toLocaleDateString('en-GB')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                disabled={deletingId === c.id}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Delete calculation"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* PRIMARY RESULT BANNER */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Primary Output Quantity
              </span>
              <div className="text-xl font-bold font-heading text-blue-400">{c.outputs.primaryQuantity}</div>
              {c.outputs.priceRange && (
                <div className="text-xs text-slate-300 font-mono">
                  Est. Material Range: <strong className="text-white">{c.outputs.priceRange}</strong>
                </div>
              )}
            </div>

            {/* BREAKDOWN LIST */}
            {c.outputs.breakdown && c.outputs.breakdown.length > 0 && (
              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Itemized Materials</span>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1">
                  {c.outputs.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between font-mono text-[11px]">
                      <span className="text-slate-400">{item.label}:</span>
                      <strong className="text-slate-200">{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ACTION BUTTON */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Slug: {c.calculatorSlug}</span>
            <Link href={`/calculators/${c.calculatorSlug}`}>
              <Button variant="primary" size="sm" className="text-xs font-bold gap-1">
                <span>Re-run Calculator</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
