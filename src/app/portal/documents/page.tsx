import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCustomerSession } from '@/lib/customer-auth';
import { db } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { FileText, Shield } from 'lucide-react';
import { DocumentsManagerView } from '@/components/portal/DocumentsManagerView';

export default async function CustomerDocumentsPage({
  searchParams,
}: {
  searchParams: { projectId?: string };
}) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    redirect('/portal/login');
  }

  const [projects, documents] = await Promise.all([
    db.getCustomerProjects(session.user.id),
    db.getCustomerDocuments(session.user.id, searchParams.projectId),
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Document Vault
            </Badge>
            <span className="text-xs text-slate-400 font-mono">
              {documents.length} Files Uploaded
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Architectural Plans &amp; Project Uploads
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload floorplans, structural engineer drawings, council planning notices, and site photos for our survey team to review.
          </p>
        </div>

        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Encrypted client document storage</span>
        </div>
      </div>

      {/* INTERACTIVE MANAGER VIEW */}
      <DocumentsManagerView
        initialDocuments={documents}
        projects={projects}
        activeProjectId={searchParams.projectId}
      />
    </div>
  );
}
