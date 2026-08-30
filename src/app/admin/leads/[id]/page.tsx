import React from 'react';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { verifyAdminAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Container } from '@/components/ui/Container';
import { LeadDetailManager } from '@/components/admin/LeadDetailManager';
import { ArrowLeft } from 'lucide-react';

export default async function AdminLeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await verifyAdminAuth();
  if (!session.isAuthenticated) {
    redirect('/admin/login');
  }

  const { id } = params;
  const lead = await db.getLeadById(id);

  if (!lead) {
    notFound();
  }

  const project = await db.getProjectByLeadId(lead.id);

  return (
    <Container>
      <div className="space-y-6">
        {/* Navigation Back Link */}
        <div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#FFAA4F] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>← Back to CRM Pipeline Dashboard</span>
          </Link>
        </div>

        <LeadDetailManager initialLead={lead} initialProject={project} />
      </div>
    </Container>
  );
}
