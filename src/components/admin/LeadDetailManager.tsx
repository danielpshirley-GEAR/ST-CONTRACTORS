'use client';

import React, { useState } from 'react';
import { DbLead, DbProject, CrmStage } from '@/lib/db/schema';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  PoundSterling,
  Flame,
  Check,
  CheckCircle2,
  Send,
  RefreshCw,
  Edit3,
  Layers,
  FileText,
  User,
  ShieldCheck,
  Hammer,
  Sparkles,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { clsx } from 'clsx';

const CRM_STAGES: { stage: CrmStage; label: string }[] = [
  { stage: 'new', label: '1. New Lead' },
  { stage: 'attempting_contact', label: '2. Attempting Contact' },
  { stage: 'contacted', label: '3. Contacted' },
  { stage: 'consultation_booked', label: '4. Consultation Booked' },
  { stage: 'consultation_completed', label: '5. Consultation Completed' },
  { stage: 'site_visit_booked', label: '6. Site Visit Booked' },
  { stage: 'site_visit_completed', label: '7. Site Visit Completed' },
  { stage: 'preparing_quote', label: '8. Preparing Quote' },
  { stage: 'quote_sent', label: '9. Quote Sent' },
  { stage: 'follow_up', label: '10. Follow Up' },
  { stage: 'negotiating', label: '11. Negotiating' },
  { stage: 'won', label: '12. WON Project' },
  { stage: 'lost', label: '13. Lost' },
  { stage: 'future_opportunity', label: '14. Future Opportunity' },
];

export const LeadDetailManager: React.FC<{
  initialLead: DbLead;
  initialProject?: DbProject;
}> = ({ initialLead, initialProject }) => {
  const [lead, setLead] = useState<DbLead>(initialLead);
  const [project] = useState<DbProject | undefined>(initialProject);

  const [currentStage, setCurrentStage] = useState<CrmStage>(lead.stage);
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);

  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Update CRM stage handler
  const handleStageChange = async (newStage: CrmStage) => {
    setCurrentStage(newStage);
    setIsUpdatingStage(true);
    setSaveSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      const data = await res.json();
      if (res.ok && data.lead) {
        setLead(data.lead);
        setSaveSuccessMsg(`Stage successfully updated to ${newStage.replace(/_/g, ' ').toUpperCase()}`);
      }
    } catch (err) {
      console.error('Error updating stage:', err);
    } finally {
      setIsUpdatingStage(false);
    }
  };

  // Add internal CRM note handler
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setIsAddingNote(true);
    setSaveSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: noteText }),
      });
      const data = await res.json();
      if (res.ok && data.lead) {
        setLead(data.lead);
        setNoteText('');
        setSaveSuccessMsg('Internal note appended successfully.');
      }
    } catch (err) {
      console.error('Error adding note:', err);
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <div className="space-y-8 text-left text-slate-900">
      {/* Alert message */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs">
          <span>✓ {saveSuccessMsg}</span>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
        </div>
      )}

      {/* Grid: Main Column (Client & Scope) vs Right Column (Stage & Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLUMNS: Profile, Customer Intent, Scope, and Cost Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Profile Card */}
          <Card className="p-6 sm:p-8 rounded-3xl bg-white border-slate-200/90 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                    {lead.firstName} {lead.lastName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-[#FFAA4F]/20 text-[#D97706] border border-[#FFAA4F]/40 font-bold">
                    {lead.referenceCode}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-1 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-[#D97706]" />
                  <span>{lead.postcode}</span>
                  <span>•</span>
                  <span>Created {new Date(lead.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              {/* Lead Score Badge */}
              <div>
                <span
                  className={clsx(
                    'px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center shadow-xs',
                    lead.scoreBand === 'HOT'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : lead.scoreBand === 'HIGH'
                      ? 'bg-[#FFAA4F]/20 text-[#D97706] border border-[#FFAA4F]/40'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  )}
                >
                  <Flame className="h-3.5 w-3.5 mr-1" />
                  Score: {lead.score}/100 • {lead.scoreBand}
                </span>
              </div>
            </div>

            {/* Quick Action Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200 hover:border-[#FFAA4F] text-slate-900 flex items-center justify-between transition-colors group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Telephone</div>
                    <div className="text-sm font-extrabold font-mono group-hover:text-[#D97706]">{lead.phone}</div>
                  </div>
                </div>
                <span className="text-xs text-[#D97706] font-bold">Call 📞</span>
              </a>

              <a
                href={`mailto:${lead.email}?subject=Regarding Your Project Consultation (${lead.referenceCode})`}
                className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200 hover:border-[#FFAA4F] text-slate-900 flex items-center justify-between transition-colors group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email</div>
                    <div className="text-sm font-extrabold group-hover:text-[#D97706] truncate max-w-[170px]">{lead.email}</div>
                  </div>
                </div>
                <span className="text-xs text-[#D97706] font-bold">Email ✉️</span>
              </a>
            </div>

            {/* Consultation Preferences */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAFAF9] p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Consultation Type</span>
                <span className="font-bold text-slate-900 capitalize">{lead.consultationType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Postcode</span>
                <span className="font-bold text-[#D97706]">{lead.postcode}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Preferred Method</span>
                <span className="font-bold text-slate-900 capitalize">{lead.preferredContactMethod}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Preferred Slot</span>
                <span className="font-bold text-slate-900 capitalize">
                  {lead.requestedDate ? `${lead.requestedDate} (${lead.requestedTimeSlot})` : 'Flexible / None'}
                </span>
              </div>
            </div>

            {/* Project Scope & Estimation */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                Project Scope &amp; Commercial Estimate
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Project Category</span>
                  <div className="font-bold text-slate-900 capitalize">{lead.projectType.replace(/-/g, ' ')}</div>
                  <div className="text-[10px] text-slate-500">Period Residential Stock</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Estimated Value</span>
                  <div className="text-lg font-extrabold text-emerald-700 font-heading">
                    £{(lead.estimatedValue || 0).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">Turnkey indicative target</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Budget &amp; Timing</span>
                  <div className="font-bold text-slate-900">£{lead.budgetRange?.replace(/_/g, ' ') || 'Not specified'}</div>
                  <div className="text-[10px] text-[#D97706] font-medium">{lead.timeline?.replace(/_/g, ' ')}</div>
                </div>
              </div>
            </div>

            {/* Customer's Description */}
            {lead.customerDescription && (
              <div className="space-y-1.5 pt-2">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                  Customer Project Notes &amp; Description
                </h4>
                <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  &ldquo;{lead.customerDescription}&rdquo;
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT COLUMN: Pipeline Stage Manager & Notes */}
        <div className="space-y-6">
          {/* CRM Stage Manager Card */}
          <Card className="p-6 rounded-3xl bg-white border-slate-200/90 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                Pipeline Stage Progression
              </h3>
              {isUpdatingStage && <RefreshCw className="h-3.5 w-3.5 text-[#D97706] animate-spin" />}
            </div>

            <div className="space-y-1.5">
              {CRM_STAGES.map((s) => {
                const isSelected = currentStage === s.stage;
                return (
                  <button
                    key={s.stage}
                    onClick={() => handleStageChange(s.stage)}
                    className={clsx(
                      'w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer',
                      isSelected
                        ? 'bg-[#FFAA4F] text-slate-950 font-black shadow-xs'
                        : 'bg-[#FAFAF9] hover:bg-slate-100 text-slate-700 border border-slate-200'
                    )}
                  >
                    <span>{s.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-slate-950 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Internal Notes Card */}
          <Card className="p-6 rounded-3xl bg-white border-slate-200/90 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-sm font-heading border-b border-slate-200 pb-3">
              Director &amp; Surveyor Notes
            </h3>

            {/* Note History List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {lead.notesHistory && lead.notesHistory.length > 0 ? (
                lead.notesHistory.map((n, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#FAFAF9] border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-[#D97706]">{n.author || 'ST Director'}</span>
                      <span>{new Date(n.createdAt).toLocaleString('en-GB')}</span>
                    </div>
                    <p className="text-slate-700 leading-snug">{n.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic text-center py-4">
                  No internal notes recorded yet.
                </div>
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-200">
              <textarea
                rows={2}
                placeholder="Add private note (site visit finding, quote revision...)"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAFAF9] border border-slate-300 text-xs text-slate-900 focus:border-[#FFAA4F] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isAddingNote || !noteText.trim()}
                className="w-full py-2.5 rounded-xl bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <span>{isAddingNote ? 'Saving...' : 'Add Note'}</span>
                <Send className="h-3 w-3" />
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
