import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCustomerSession } from '@/lib/customer-auth';
import { db } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Calculator,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import { SavedCalculationsList } from '@/components/portal/SavedCalculationsList';

export default async function CustomerCalculationsPage() {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    redirect('/portal/login');
  }

  const calculations = await db.getCustomerCalculations(session.user.id);

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
              <Calculator className="h-3 w-3 mr-1" />
              Trade Calculations
            </Badge>
            <span className="text-xs text-slate-400 font-mono">
              {calculations.length} Saved {calculations.length === 1 ? 'Calculation' : 'Calculations'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Saved Trade &amp; Material Estimates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Material quantities, sand/cement ratios, and trade day forecasts saved from our 20+ specialized construction calculators.
          </p>
        </div>

        <Link href="/calculators">
          <Button variant="primary" size="sm" className="text-xs font-bold gap-1.5 shadow-md">
            <Plus className="h-3.5 w-3.5" />
            <span>Browse 20+ Calculators</span>
          </Button>
        </Link>
      </div>

      {/* CALCULATIONS LIST / EMPTY STATE */}
      {calculations.length === 0 ? (
        <Card className="p-12 text-center bg-slate-900 border-slate-800 rounded-3xl space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
            <Calculator className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-heading">No Calculations Saved Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Run any of our material or project calculators and click &quot;Save Calculation to My Account&quot; to keep a record here.
            </p>
          </div>
          <Link href="/calculators">
            <Button variant="primary" size="md" className="text-xs font-bold">
              Explore Calculators
            </Button>
          </Link>
        </Card>
      ) : (
        <SavedCalculationsList initialCalculations={calculations} />
      )}
    </div>
  );
}
