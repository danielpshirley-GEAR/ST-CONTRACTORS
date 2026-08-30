import React from 'react';
import Link from 'next/link';
import { ConstructionKnowledgeRecord } from '@/types/knowledge-bank';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Quote,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Hammer,
  Clock,
  PoundSterling,
} from 'lucide-react';

interface BuilderInsightsCardProps {
  records: ConstructionKnowledgeRecord[];
  title?: string;
  subtitle?: string;
}

export const BuilderInsightsCard: React.FC<BuilderInsightsCardProps> = ({
  records,
  title = 'First-Hand London Builder Experience & On-Site Realities',
  subtitle = 'Practical insights, common strip-out discoveries, and material recommendations verified by our senior London project managers.',
}) => {
  if (!records || records.length === 0) return null;

  return (
    <section aria-label="First-Hand Builder Experience" className="space-y-6 text-left my-10">
      <div className="space-y-2">
        <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold text-xs">
          Direct Trade Experience
        </Badge>
        <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {records.map((rec) => (
          <Card
            key={rec.id}
            className="p-6 bg-white border-slate-200 shadow-sm rounded-3xl space-y-4 hover:border-amber-400 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="brand" className="bg-slate-100 text-slate-800 text-[11px] font-bold">
                  {rec.category.replace('_', ' ').toUpperCase()}
                </Badge>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  {rec.verifiedBy}
                </span>
              </div>

              <h3 className="text-base font-bold font-heading text-slate-900">
                {rec.title}
              </h3>

              {rec.builderObservationQuote && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 italic relative">
                  <Quote className="h-4 w-4 text-amber-500 mb-1" />
                  <p>&ldquo;{rec.builderObservationQuote}&rdquo;</p>
                </div>
              )}

              <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                <strong className="block text-[11px] uppercase font-bold text-slate-800">
                  What We Frequently Encounter on Site:
                </strong>
                <p className="leading-relaxed">{rec.problemSummary}</p>
              </div>

              {rec.warningSignsForHomeowners && rec.warningSignsForHomeowners.length > 0 && (
                <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <strong className="block text-[10px] uppercase font-bold text-slate-500">
                    Warning Signs to Check in Your Property:
                  </strong>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                    {rec.warningSignsForHomeowners.map((sign, idx) => (
                      <li key={idx}>{sign}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-100 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-[10px] uppercase text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Preferred Materials:
                  </div>
                  <span className="block">{rec.recommendedMaterials.slice(0, 2).join(', ')}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-950 border border-rose-100 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-[10px] uppercase text-rose-800">
                    <XCircle className="h-3.5 w-3.5 text-rose-600" /> What to Avoid:
                  </div>
                  <span className="block">{rec.materialsToAvoid.slice(0, 2).join(', ') || 'Cheap subfloor plywood'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Typical Cost Impact: <strong className="text-slate-900 font-bold">{rec.estimatedCostImpact}</strong></span>
              <Link href="/plan-my-project" className="text-amber-600 font-bold hover:underline inline-flex items-center gap-1">
                <span>Check your home</span> <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
