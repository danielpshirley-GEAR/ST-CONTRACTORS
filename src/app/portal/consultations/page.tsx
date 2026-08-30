import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCustomerSession } from '@/lib/customer-auth';
import { db } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Shield, Phone, Sparkles } from 'lucide-react';
import { ConsultationsManagerView } from '@/components/portal/ConsultationsManagerView';

export default async function CustomerConsultationsPage({
  searchParams,
}: {
  searchParams: { projectId?: string };
}) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    redirect('/portal/login');
  }

  const [projects, consultations] = await Promise.all([
    db.getCustomerProjects(session.user.id),
    db.getCustomerConsultations(session.user.id),
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Appointments &amp; Surveys
            </Badge>
            <span className="text-xs text-slate-400 font-mono">
              {consultations.length} Consultations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Consultations &amp; Site Visits
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Book an architectural review or arrange an on-site feasibility survey with our senior project directors.
          </p>
        </div>

        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <Phone className="h-4 w-4 text-[#FFAA4F] shrink-0" />
          <span>Direct Office Hotline: <strong>020 8942 1000</strong></span>
        </div>
      </div>

      {/* INTERACTIVE CONSULTATIONS VIEW */}
      <ConsultationsManagerView
        initialConsultations={consultations}
        projects={projects}
        activeProjectId={searchParams.projectId}
      />
    </div>
  );
}
