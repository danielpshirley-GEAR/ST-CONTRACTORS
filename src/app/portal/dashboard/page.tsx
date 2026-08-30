import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCustomerSession } from '@/lib/customer-auth';
import { db } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FolderKanban,
  Calculator,
  FileText,
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Upload,
  Phone,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { CustomerProjectStatusBadge } from '@/components/portal/CustomerProjectStatusBadge';
import { TimelineProgressView } from '@/components/portal/TimelineProgressView';

export default async function CustomerDashboardPage() {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    redirect('/portal/login');
  }

  const [projects, calculations, documents, consultations] = await Promise.all([
    db.getCustomerProjects(session.user.id),
    db.getCustomerCalculations(session.user.id),
    db.getCustomerDocuments(session.user.id),
    db.getCustomerConsultations(session.user.id),
  ]);

  const upcomingConsultation = consultations.find(
    (c) => c.status === 'confirmed' || c.status === 'pending'
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left">
      {/* WELCOME BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm" className="bg-[#FFAA4F]/20 text-[#FFAA4F] border-[#FFAA4F]/30 text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Verified Client Portal
            </Badge>
            <span className="text-xs text-slate-400 font-mono">ID: {session.user.id.slice(0, 10)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Welcome back, {session.user.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your construction project, manage architectural plans, and view upcoming surveyor appointments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/portal/consultations">
            <Button variant="outline" size="sm" className="text-xs border-slate-700 hover:bg-slate-800 text-slate-200">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-[#FFAA4F]" />
              <span>Book Consultation</span>
            </Button>
          </Link>
          <Link href="/plan-my-project">
            <Button variant="primary" size="sm" className="text-xs font-bold gap-1.5 shadow-md">
              <span>+ Plan New Project</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* QUICK STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Active Projects
          </span>
          <div className="text-2xl font-bold text-white font-heading">{projects.length}</div>
          <Link href="/portal/projects" className="text-[11px] text-[#FFAA4F] hover:underline flex items-center gap-1 font-semibold">
            <span>View estimates</span> <ChevronRight className="h-3 w-3" />
          </Link>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Saved Calculations
          </span>
          <div className="text-2xl font-bold text-blue-400 font-heading">{calculations.length}</div>
          <Link href="/portal/calculations" className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-semibold">
            <span>Material counts</span> <ChevronRight className="h-3 w-3" />
          </Link>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Attached Documents
          </span>
          <div className="text-2xl font-bold text-amber-400 font-heading">{documents.length}</div>
          <Link href="/portal/documents" className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold">
            <span>Drawings &amp; PDFs</span> <ChevronRight className="h-3 w-3" />
          </Link>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Next Site Visit
          </span>
          <div className="text-sm font-bold text-emerald-400 font-heading truncate">
            {upcomingConsultation ? upcomingConsultation.requestedDate || 'Scheduled' : 'None booked'}
          </div>
          <Link href="/portal/consultations" className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
            <span>{upcomingConsultation ? 'View details' : 'Book survey'}</span> <ChevronRight className="h-3 w-3" />
          </Link>
        </Card>
      </div>

      {/* ACTIVE PROJECTS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-emerald-400" />
            <span>My Construction Projects</span>
          </h2>
          <Link href="/portal/projects" className="text-xs text-[#FFAA4F] hover:underline font-semibold">
            View All ({projects.length})
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card className="p-8 text-center bg-slate-900 border-slate-800 rounded-3xl space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-[#FFAA4F] flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Saved Projects Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Use our interactive project planner to configure your room dimensions, structural knockthroughs, and finish level.
              </p>
            </div>
            <Link href="/plan-my-project">
              <Button variant="primary" size="sm" className="text-xs font-bold">
                Configure Project Now
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {projects.map((proj) => (
              <Card
                key={proj.id}
                className="p-6 sm:p-7 bg-slate-900 border-slate-800 hover:border-slate-700 transition-all rounded-3xl space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <CustomerProjectStatusBadge status={proj.status || 'ESTIMATE_SAVED'} />
                      <span className="text-xs font-mono text-slate-400">Ref: {proj.referenceCode}</span>
                      {proj.inputData.postcode && (
                        <span className="text-xs text-slate-300 font-mono bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                          {proj.inputData.postcode}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white font-heading">{proj.title}</h3>
                    <p className="text-xs text-slate-400">
                      Configured for {proj.inputData.propertyType || 'Residential'} property ·{' '}
                      {proj.scopeItems?.length || 0} Scope Items Selected
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0 bg-slate-950 p-3 sm:p-0 rounded-2xl sm:bg-transparent">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Estimated Range</span>
                    <div className="text-xl sm:text-2xl font-bold font-heading text-[#FFAA4F]">
                      £{(proj.estimateResult.indicativeCostLow || 0).toLocaleString()} – £
                      {(proj.estimateResult.indicativeCostHigh || 0).toLocaleString()}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Incl. materials, labour &amp; contingency reserve
                    </span>
                  </div>
                </div>

                {/* 7-STAGE TIMELINE TRACKER */}
                {proj.timelineStages && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">Construction Timeline Tracker</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        Stage {proj.timelineStages.filter((s) => s.status === 'COMPLETED').length} of {proj.timelineStages.length} Active
                      </span>
                    </div>
                    <TimelineProgressView stages={proj.timelineStages} />
                  </div>
                )}

                {/* ACTION BAR */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/portal/projects/${proj.id}`}>
                      <Button variant="primary" size="sm" className="text-xs font-bold gap-1.5 shadow-md">
                        <span>View Project &amp; Detailed Scope</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Link href={`/portal/documents?projectId=${proj.id}`}>
                      <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-300">
                        <Upload className="h-3.5 w-3.5 mr-1" />
                        <span>Upload Plans</span>
                      </Button>
                    </Link>
                  </div>

                  <Link href={`/portal/consultations?projectId=${proj.id}`}>
                    <Button variant="outline" size="sm" className="text-xs border-slate-700 text-emerald-400 hover:bg-emerald-950/30">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>Book Free Site Consultation</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* TWO COLUMN LOWER TILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SAVED CALCULATIONS SHORTCUT */}
        <Card className="p-6 bg-slate-900 border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Calculator className="h-4 w-4 text-blue-400" />
              <span>Recent Trade Calculations</span>
            </h3>
            <Link href="/portal/calculations" className="text-xs text-blue-400 hover:underline font-semibold">
              View All ({calculations.length})
            </Link>
          </div>

          {calculations.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 space-y-2">
              <p>No trade calculations saved yet.</p>
              <Link href="/calculators" className="text-[#FFAA4F] font-bold hover:underline block">
                Explore 20+ Free Construction Calculators →
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {calculations.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{c.calculatorTitle}</div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Quantity: {c.outputs.primaryQuantity}
                    </span>
                  </div>
                  <Link href={`/calculators/${c.calculatorSlug}`}>
                    <Button variant="outline" size="sm" className="text-[11px] h-7 border-slate-700 text-slate-300">
                      Open Tool
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* CONSULTATION & SURVEYOR CARD */}
        <Card className="p-6 bg-slate-900 border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Calendar className="h-4 w-4 text-rose-400" />
              <span>Consultation &amp; Survey Status</span>
            </h3>
            <Link href="/portal/consultations" className="text-xs text-rose-400 hover:underline font-semibold">
              Manage
            </Link>
          </div>

          {upcomingConsultation ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <Badge
                  variant={upcomingConsultation.status === 'confirmed' ? 'brand' : 'warning'}
                  size="sm"
                  className="text-[10px] uppercase font-bold"
                >
                  {upcomingConsultation.status}
                </Badge>
                <span className="font-mono text-slate-400 text-[11px]">{upcomingConsultation.referenceCode}</span>
              </div>
              <div className="font-bold text-white text-sm">
                {upcomingConsultation.type === 'site_visit' ? 'In-Person Site Survey' : 'Architectural Video Consultation'}
              </div>
              <div className="text-slate-300 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-[#FFAA4F]" />
                <span>Date: <strong>{upcomingConsultation.requestedDate || 'TBD'}</strong></span>
                <span>Slot: <strong>{upcomingConsultation.requestedTimeSlot || 'Morning'}</strong></span>
              </div>
              {upcomingConsultation.assignedSurveyor && (
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  Assigned Lead: <strong className="text-white">{upcomingConsultation.assignedSurveyor}</strong>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-3">
              <p className="leading-relaxed">
                Ready for our team to review your drawings or visit your property for an on-site feasibility inspection?
              </p>
              <Link href="/portal/consultations" className="block">
                <Button variant="primary" size="sm" className="w-full text-xs font-bold">
                  Schedule Free Project Consultation
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
