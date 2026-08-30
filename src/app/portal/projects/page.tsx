import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCustomerSession } from '@/lib/customer-auth';
import { db } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FolderKanban,
  ArrowRight,
  Sparkles,
  Calendar,
  Upload,
  Plus,
  FileText,
  Hammer,
} from 'lucide-react';
import { CustomerProjectStatusBadge } from '@/components/portal/CustomerProjectStatusBadge';
import { TimelineProgressView } from '@/components/portal/TimelineProgressView';

export default async function CustomerProjectsPage() {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    redirect('/portal/login');
  }

  const projects = await db.getCustomerProjects(session.user.id);

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm" className="bg-[#FFAA4F]/20 text-[#FFAA4F] border-[#FFAA4F]/30 text-xs">
              <FolderKanban className="h-3 w-3 mr-1" />
              Project Portfolio
            </Badge>
            <span className="text-xs text-slate-400 font-mono">
              {projects.length} Saved {projects.length === 1 ? 'Project' : 'Projects'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            My Saved Construction Estimates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            View room-by-room specifications, track timeline stages, and manage consultations with our construction team.
          </p>
        </div>

        <Link href="/plan-my-project">
          <Button variant="primary" size="sm" className="text-xs font-bold gap-1.5 shadow-md">
            <Plus className="h-3.5 w-3.5" />
            <span>Configure Another Project</span>
          </Button>
        </Link>
      </div>

      {/* PROJECTS LIST */}
      {projects.length === 0 ? (
        <Card className="p-12 text-center bg-slate-900 border-slate-800 rounded-3xl space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-[#FFAA4F] flex items-center justify-center mx-auto">
            <Sparkles className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-heading">No Projects Saved Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You haven&apos;t saved any projects yet. Use our interactive estimator to configure your extension or renovation.
            </p>
          </div>
          <Link href="/plan-my-project">
            <Button variant="primary" size="md" className="text-xs font-bold">
              Start Project Planner
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {projects.map((proj) => (
            <Card
              key={proj.id}
              className="p-6 sm:p-8 bg-slate-900 border-slate-800 hover:border-slate-700 transition-all rounded-3xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CustomerProjectStatusBadge status={proj.status || 'ESTIMATE_SAVED'} />
                    <span className="text-xs font-mono text-slate-400">Ref: {proj.referenceCode}</span>
                    {proj.inputData.postcode && (
                      <span className="text-xs text-slate-300 font-mono bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                        {proj.inputData.postcode}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">{proj.title}</h2>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    {proj.inputData.customDescription ||
                      `Specification configured with ${proj.scopeItems?.length || 0} room items.`}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0 bg-slate-950 p-4 sm:p-0 rounded-2xl sm:bg-transparent">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Indicative Estimate</span>
                  <div className="text-2xl sm:text-3xl font-bold font-heading text-[#FFAA4F]">
                    £{(proj.estimateResult.indicativeCostLow || 0).toLocaleString()} – £
                    {(proj.estimateResult.indicativeCostHigh || 0).toLocaleString()}
                  </div>
                  <span className="text-xs text-slate-400">
                    Incl. materials, labour &amp; contingency reserve
                  </span>
                </div>
              </div>

              {/* TIMELINE PROGRESS VIEW */}
              {proj.timelineStages && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Construction Timeline Status</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Stage {proj.timelineStages.filter((s) => s.status === 'COMPLETED').length} of {proj.timelineStages.length} Active
                    </span>
                  </div>
                  <TimelineProgressView stages={proj.timelineStages} />
                </div>
              )}

              {/* ACTION FOOTER */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Link href={`/portal/projects/${proj.id}`}>
                    <Button variant="primary" size="sm" className="text-xs font-bold gap-1.5 shadow-md">
                      <span>View Full Project Breakdown</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href={`/portal/documents?projectId=${proj.id}`}>
                    <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-300">
                      <Upload className="h-3.5 w-3.5 mr-1" />
                      <span>Upload Drawings</span>
                    </Button>
                  </Link>
                </div>

                <Link href={`/portal/consultations?projectId=${proj.id}`}>
                  <Button variant="outline" size="sm" className="text-xs border-slate-700 text-emerald-400 hover:bg-emerald-950/30">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>Book Site Consultation</span>
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
