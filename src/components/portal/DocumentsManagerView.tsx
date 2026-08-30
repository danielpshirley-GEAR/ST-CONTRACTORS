'use client';

import React, { useState } from 'react';
import { DbCustomerDocument, DbProject } from '@/lib/db/schema';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Upload,
  FileText,
  Trash2,
  Download,
  CheckCircle2,
  Image as ImageIcon,
  FileCode,
  FileSpreadsheet,
} from 'lucide-react';

interface DocumentsManagerViewProps {
  initialDocuments: DbCustomerDocument[];
  projects: DbProject[];
  activeProjectId?: string;
}

export function DocumentsManagerView({
  initialDocuments,
  projects,
  activeProjectId,
}: DocumentsManagerViewProps) {
  const [documents, setDocuments] = useState<DbCustomerDocument[]>(initialDocuments);
  const [projectId, setProjectId] = useState<string>(activeProjectId || (projects[0]?.id || ''));
  const [category, setCategory] = useState<DbCustomerDocument['category']>('ARCHITECTURAL_DRAWING');
  const [fileName, setFileName] = useState('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    setIsUploading(true);
    try {
      const res = await fetch('/api/customer/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectId || undefined,
          fileName,
          category,
          notes,
          fileSize: 1024 * 1024 * (Math.floor(Math.random() * 3) + 1.2), // Mock 1.2 - 4.2 MB
          fileType: fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
          fileUrl: `/uploads/${fileName.toLowerCase().replace(/\s+/g, '-')}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.document) {
        setDocuments((prev) => [data.document, ...prev]);
        setFileName('');
        setNotes('');
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this document?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/customer/documents?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* UPLOAD FORM */}
      <Card className="p-6 bg-slate-900 border-slate-800 rounded-3xl space-y-5 h-fit">
        <div>
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <Upload className="h-4 w-4 text-[#FFAA4F]" />
            <span>Upload New Document</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Attach drawings, planning certificates, or photos to your project file.
          </p>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          {projects.length > 0 && (
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 block">Link to Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.referenceCode})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">Document Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F]"
            >
              <option value="ARCHITECTURAL_DRAWING">Architectural Floorplans / Elevation</option>
              <option value="PLANNING_NOTICE">Planning Permission / Permitted Dev Notice</option>
              <option value="STRUCTURAL_CALCULATION">Structural Engineers Calculations</option>
              <option value="SITE_PHOTO">Existing Site / Garden Photos</option>
              <option value="QUOTE_DOCUMENT">Contract / Formal Quote</option>
              <option value="OTHER">Other Supplementary Document</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">File Name / Title</label>
            <input
              type="text"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. Proposed-Rear-Extension-Plan-v2.pdf"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">Notes for Surveyor (Optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Note the drain inspection chamber location near the rear wall."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FFAA4F]"
            />
          </div>

          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={isUploading || !fileName}
            className="w-full text-xs font-bold gap-2 shadow-md"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>{isUploading ? 'Uploading...' : 'Save & Attach to Project'}</span>
          </Button>
        </form>
      </Card>

      {/* DOCUMENTS LIST */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-base font-bold text-white font-heading">
          Attached Files ({documents.length})
        </h3>

        {documents.length === 0 ? (
          <Card className="p-8 text-center bg-slate-900 border-slate-800 rounded-3xl space-y-2 text-xs text-slate-400">
            <FileText className="h-8 w-8 mx-auto text-slate-600 mb-2" />
            <p className="font-bold text-white text-sm">No files uploaded yet.</p>
            <p>Use the form on the left to attach architectural drawings or site photos.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="p-4 sm:p-5 bg-slate-900 border-slate-800 hover:border-slate-700 transition-all rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="brand" size="sm" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] uppercase">
                      {doc.category.replace('_', ' ')}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-400">
                      {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{doc.fileName}</h4>
                  {doc.notes && <p className="text-xs text-slate-400 italic">&quot;{doc.notes}&quot;</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a href={doc.fileUrl} target="_blank" download>
                    <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-200 gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </Button>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Delete file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
