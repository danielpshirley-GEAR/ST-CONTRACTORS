import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyAdminAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  PoundSterling,
  Flame,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Search,
  Filter,
  ShieldCheck,
  Building,
  Sparkles,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: { stage?: string; scoreBand?: string; search?: string };
}) {
  const session = await verifyAdminAuth();

  if (!session.isAuthenticated) {
    redirect('/admin/login');
  }

  const stageFilter = searchParams?.stage || 'all';
  const scoreFilter = searchParams?.scoreBand || 'all';
  const searchQuery = searchParams?.search || '';

  const leads = await db.getLeads({
    stage: stageFilter !== 'all' ? stageFilter : undefined,
    scoreBand: scoreFilter !== 'all' ? scoreFilter : undefined,
    search: searchQuery || undefined,
  });

  const contactSubmissions = await db.getContactSubmissions();

  const totalPipelineValue = leads.reduce(
    (acc, lead) => acc + (lead.estimatedValue || 0),
    0
  );
  const hotLeadsCount = leads.filter((l) => l.scoreBand === 'HOT').length;
  const consultationsCount = leads.filter(
    (l) => l.consultationType === 'consultation' || l.consultationType === 'site_visit'
  ).length;

  const pipelineStages = [
    { key: 'all', label: 'All Pipeline' },
    { key: 'new', label: 'New Leads' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'consultation_booked', label: 'Consultation Booked' },
    { key: 'site_visit_booked', label: 'Site Visit Booked' },
    { key: 'won', label: 'Won Projects' },
  ];

  return (
    <div className="py-8 bg-slate-950 min-h-screen text-slate-100">
      <Container>
        <div className="space-y-8">
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">
                  ST CONTRACTORS Commercial Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight mt-1">
                CRM &amp; Construction Lead Pipeline
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Lead qualification scoring (0–100), full property questionnaire answers, and quotation tracking.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/plan-my-project"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-[#FFAA4F] text-slate-950 hover:bg-[#F59E3F] shadow-lg transition-all"
              >
                <span>Test Live Project Planner</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 4 Pipeline Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-slate-900 border-slate-800 text-white rounded-2xl shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-bold">
                <span>Active Leads</span>
                <Users className="h-4 w-4 text-[#FFAA4F]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-heading text-white mt-2">
                {leads.length}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                High-intent residential projects
              </div>
            </Card>

            <Card className="p-5 bg-slate-900 border-slate-800 text-white rounded-2xl shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-bold">
                <span>Hot Leads (80–100)</span>
                <Flame className="h-4 w-4 text-red-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-heading text-red-400 mt-2">
                {hotLeadsCount}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Immediate start / Planning approved
              </div>
            </Card>

            <Card className="p-5 bg-slate-900 border-slate-800 text-white rounded-2xl shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-bold">
                <span>Estimated Pipeline</span>
                <PoundSterling className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-heading text-emerald-400 mt-2 tabular-numbers">
                £{totalPipelineValue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Cumulative project quote value
              </div>
            </Card>

            <Card className="p-5 bg-slate-900 border-slate-800 text-white rounded-2xl shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-bold">
                <span>Consultations / Surveys</span>
                <Calendar className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-heading text-blue-400 mt-2">
                {consultationsCount}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Scheduled site assessments
              </div>
            </Card>
          </div>

          {/* Pipeline Stage Filter Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
            {pipelineStages.map((stage) => {
              const isActive = stageFilter === stage.key;
              return (
                <Link
                  key={stage.key}
                  href={stage.key === 'all' ? '/admin/dashboard' : `/admin/dashboard?stage=${stage.key}`}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#FFAA4F] text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {stage.label}
                </Link>
              );
            })}
          </div>

          {/* Leads Table */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-white font-heading">
                  Construction Lead Pipeline
                </h2>
                <span className="text-xs text-slate-400">
                  Click any lead row to view complete project answers, measurements &amp; update CRM stage
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Showing {leads.length} records
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-bold">
                  <tr>
                    <th className="py-4 px-5">Ref Code</th>
                    <th className="py-4 px-5">Lead Name</th>
                    <th className="py-4 px-5">Project &amp; Location</th>
                    <th className="py-4 px-5">Est. Value</th>
                    <th className="py-4 px-5">Internal Score</th>
                    <th className="py-4 px-5">CRM Stage</th>
                    <th className="py-4 px-5">Consultation</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-5 font-mono font-bold text-[#FFAA4F]">
                        <Link href={`/admin/leads/${lead.id}`} className="hover:underline">
                          {lead.referenceCode}
                        </Link>
                      </td>
                      <td className="py-4 px-5 font-semibold text-white">
                        <Link href={`/admin/leads/${lead.id}`} className="block">
                          <div className="text-sm font-bold text-white group-hover:text-[#FFAA4F] transition-colors">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                            {lead.phone} • {lead.email}
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-slate-200 font-bold capitalize flex items-center gap-1.5">
                          <span>{lead.projectType.replace(/-/g, ' ')}</span>
                          {lead.source?.startsWith('Calculator:') && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-[#FFAA4F] border border-amber-500/40 text-[9px] font-mono font-bold uppercase">
                              Calculator Lead
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-[#FFAA4F]" />
                          <span>{lead.postcode}</span>
                          {lead.budgetRange && (
                            <>
                              <span>•</span>
                              <span className="text-slate-300 font-mono">£{lead.budgetRange.replace(/_/g, ' ')}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 font-bold text-emerald-400 tabular-numbers text-sm">
                        £{(lead.estimatedValue || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                            lead.scoreBand === 'HOT'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : lead.scoreBand === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {lead.score}/100 • {lead.scoreBand}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-[11px] font-bold border border-slate-700">
                          {lead.stage.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        {lead.requestedDate ? (
                          <div className="text-[11px] text-slate-300">
                            <div className="font-bold text-white flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-[#FFAA4F]" />
                              <span>{lead.requestedDate}</span>
                            </div>
                            <div className="text-slate-400 capitalize">{lead.requestedTimeSlot || 'Standard Slot'}</div>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">None requested</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-[#FFAA4F] hover:text-slate-950 text-slate-300 font-bold transition-all border border-slate-700"
                        >
                          <span>Manage</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No leads found matching the current filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
