import React from 'react';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCustomerSession } from '@/lib/customer-auth';
import { db } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FolderKanban,
  Calendar,
  Upload,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronLeft,
  ArrowRight,
  Shield,
  Download,
  Hammer,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CustomerProjectStatusBadge } from '@/components/portal/CustomerProjectStatusBadge';
import { TimelineProgressView } from '@/components/portal/TimelineProgressView';

export default async function CustomerProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    redirect('/portal/login');
  }

  const project = await db.getCustomerProjectById(params.id, session.user.id);
  if (!project) {
    notFound();
  }

  const [documents, consultations] = await Promise.all([
    db.getCustomerDocuments(session.user.id, params.id),
    db.getCustomerConsultations(session.user.id),
  ]);

  const linkedConsultation = consultations.find(
    (c) => c.projectId === params.id || c.leadId === project.leadId
  );

  const estimate = project.estimateResult;
  const input = project.inputData;

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left pb-16">
      {/* BREADCRUMB & BACK LINK */}
      <div className="flex items-center justify-between">
        <Link
          href="/portal/projects"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to My Projects</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/portal/documents?projectId=${project.id}`}>
            <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-300">
              <Upload className="h-3.5 w-3.5 mr-1" />
              <span>Upload Drawings</span>
            </Button>
          </Link>
          <Link href={`/portal/consultations?projectId=${project.id}`}>
            <Button variant="primary" size="sm" className="text-xs font-bold">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>Book Consultation</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* PROJECT HEADER CARD */}
      <Card className="p-6 sm:p-8 bg-slate-900 border-slate-800 rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CustomerProjectStatusBadge status={project.status || 'ESTIMATE_SAVED'} />
              <span className="text-xs font-mono text-slate-400">Ref: {project.referenceCode}</span>
              {input.postcode && (
                <span className="text-xs text-slate-300 font-mono bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                  {input.postcode}
                </span>
              )}
              {input.finishLevel && (
                <span className="text-xs text-[#FFAA4F] font-mono bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30 uppercase">
                  {input.finishLevel} Finish
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {input.customDescription ||
                `Comprehensive project specification with ${project.scopeItems?.length || 0} room items.`}
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-left md:text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Estimated Project Cost
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-heading text-[#FFAA4F]">
              £{(estimate.indicativeCostLow || 0).toLocaleString()} – £
              {(estimate.indicativeCostHigh || 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Includes materials, labour &amp; contingency reserve
            </span>
          </div>
        </div>

        {/* FINANCIAL SUMMARY METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Indicative Low</span>
            <strong className="text-white font-mono">
              £{(estimate.indicativeCostLow || 0).toLocaleString()}
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Indicative High</span>
            <strong className="text-white font-mono">
              £{(estimate.indicativeCostHigh || 0).toLocaleString()}
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Contingency Reserve</span>
            <strong className="text-amber-400 font-mono">
              £{(estimate.contingencyAmount || 0).toLocaleString()}
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Estimated Duration</span>
            <strong className="text-emerald-400 font-mono">
              {estimate.durationWeeksMin || 6} – {estimate.durationWeeksMax || 14} Weeks
            </strong>
          </div>
        </div>
      </Card>

      {/* 7-STAGE TIMELINE TRACKER */}
      {project.timelineStages && (
        <Card className="p-6 sm:p-8 bg-slate-900 border-slate-800 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Project Timeline &amp; Next Milestones</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Our 7-stage construction process from initial scope through to turnkey council signoff.
              </p>
            </div>
            <Badge variant="brand" size="sm" className="bg-[#FFAA4F]/20 text-[#FFAA4F] border-[#FFAA4F]/30 text-xs">
              Phase 5 Tracker
            </Badge>
          </div>

          <TimelineProgressView stages={project.timelineStages} />

          {/* DETAILED STAGES BREAKDOWN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {project.timelineStages.map((stg) => (
              <div
                key={stg.id}
                className={`p-4 rounded-2xl border text-xs space-y-1 ${
                  stg.status === 'COMPLETED'
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
                    : stg.status === 'IN_PROGRESS'
                    ? 'bg-amber-950/20 border-[#FFAA4F]/40 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-white">
                    Stage {stg.stageNumber}: {stg.title}
                  </span>
                  <span className="font-mono text-[10px] uppercase">
                    {stg.status === 'COMPLETED' ? '✓ Complete' : stg.status === 'IN_PROGRESS' ? '● In Progress' : '○ Upcoming'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{stg.description}</p>
                {stg.notes && <div className="text-[11px] text-[#FFAA4F] pt-1">Note: {stg.notes}</div>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ROOM-BY-ROOM SCOPE BREAKDOWN */}
      <Card className="p-6 sm:p-8 bg-slate-900 border-slate-800 rounded-3xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white font-heading">Itemized Scope &amp; Specification</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Breakdown of all architectural elements, structural changes, and finishes selected for your project.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Item / Specification</th>
                <th className="py-3 px-3">Scope Area</th>
                <th className="py-3 px-3">Estimated Range (£)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {project.scopeItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850 transition-colors">
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-white">
                    {item.name}
                    {item.notes && <span className="block font-normal text-[10px] text-slate-400">{item.notes}</span>}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{item.areaName || 'General'}</td>
                  <td className="py-3 px-3 text-slate-200">
                    £{(item.costLow || 0).toLocaleString()} – £{(item.costHigh || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DOCUMENTS & CONSULTATION ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ATTACHED DOCUMENTS */}
        <Card className="p-6 bg-slate-900 border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-400" />
              <span>Project Drawings &amp; Documents</span>
            </h3>
            <Link href={`/portal/documents?projectId=${project.id}`}>
              <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-300">
                <Upload className="h-3 w-3 mr-1" />
                Upload
              </Button>
            </Link>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 space-y-2">
              <p>No architectural drawings or site photos uploaded yet.</p>
              <Link href={`/portal/documents?projectId=${project.id}`} className="text-[#FFAA4F] font-bold hover:underline block">
                Upload your plans for surveyor review →
              </Link>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white truncate max-w-[200px]">{doc.fileName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(doc.fileSize / 1024 / 1024).toFixed(2)} MB · {doc.category.replace('_', ' ')}
                    </span>
                  </div>
                  <a href={doc.fileUrl} target="_blank" download>
                    <Button variant="outline" size="sm" className="text-[11px] h-7 border-slate-700 text-slate-300">
                      <Download className="h-3 w-3 mr-1" /> View
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* CONSULTATION DETAILS */}
        <Card className="p-6 bg-slate-900 border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-400" />
              <span>Site Visit &amp; Surveyor Status</span>
            </h3>
            <Link href={`/portal/consultations?projectId=${project.id}`}>
              <Button variant="outline" size="sm" className="text-xs border-slate-700 text-emerald-400">
                Manage
              </Button>
            </Link>
          </div>

          {linkedConsultation ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="brand" size="sm" className="text-[10px] uppercase font-bold">
                  {linkedConsultation.status}
                </Badge>
                <span className="font-mono text-slate-400">{linkedConsultation.referenceCode}</span>
              </div>
              <div>
                <strong>Appointment: </strong>
                <span>{linkedConsultation.type === 'site_visit' ? 'On-Site Inspection' : 'Architectural Video Call'}</span>
              </div>
              <div className="text-slate-300">
                Date: <strong>{linkedConsultation.requestedDate || 'Pending Scheduling'}</strong> · Time: <strong>{linkedConsultation.requestedTimeSlot || 'Morning'}</strong>
              </div>
              {linkedConsultation.assignedSurveyor && (
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  Lead Surveyor: <strong className="text-white">{linkedConsultation.assignedSurveyor}</strong>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-3">
              <p className="leading-relaxed">
                Schedule an in-person site inspection with our senior construction team to review drains, load-bearing points, and party wall considerations.
              </p>
              <Link href={`/portal/consultations?projectId=${project.id}`} className="block">
                <Button variant="primary" size="sm" className="w-full text-xs font-bold">
                  Book Free Project Consultation
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
