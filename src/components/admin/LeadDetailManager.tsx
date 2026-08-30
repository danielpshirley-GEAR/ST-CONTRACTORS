'use client';

import React, { useState } from 'react';
import { DbLead, DbProject, CrmStage } from '@/lib/db/schema';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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

  // Add internal note handler
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setIsAddingNote(true);
    setSaveSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newNote: noteText.trim(),
          author: 'Senior Estimator',
        }),
      });
      const data = await res.json();
      if (res.ok && data.lead) {
        setLead(data.lead);
        setNoteText('');
        setSaveSuccessMsg('Note successfully logged to timeline.');
      }
    } catch (err) {
      console.error('Error adding note:', err);
    } finally {
      setIsAddingNote(false);
    }
  };

  const input = project?.inputData;
  const est = project?.estimateResult;
  const scopeItems = project?.scopeItems || [];
  const recommendations = project?.recommendations || [];

  return (
    <div className="space-y-8 text-left">
      {/* Alert message */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
          <span>✓ {saveSuccessMsg}</span>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Grid: Main Column (Client & Scope) vs Right Column (Stage & Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLUMNS: Profile, Customer Intent, Scope, and Cost Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Profile Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-850 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
                    {lead.firstName} {lead.lastName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-[#FFAA4F] border border-slate-700">
                    {lead.referenceCode}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-[#FFAA4F]" />
                  <span>{lead.postcode}</span>
                  <span>•</span>
                  <span>Created {new Date(lead.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              {/* Lead Score Badge */}
              <div>
                <span
                  className={clsx(
                    'px-3 py-1.5 rounded-xl font-bold text-xs flex items-center shadow-xs',
                    lead.scoreBand === 'HOT'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : lead.scoreBand === 'HIGH'
                      ? 'bg-[#FFAA4F]/20 text-[#FFAA4F] border border-[#FFAA4F]/40'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
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
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#FFAA4F] text-white flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Telephone</div>
                    <div className="text-sm font-bold font-mono group-hover:text-[#FFAA4F]">{lead.phone}</div>
                  </div>
                </div>
                <span className="text-xs text-[#FFAA4F] font-bold">Call 📞</span>
              </a>

              <a
                href={`mailto:${lead.email}?subject=Regarding Your Project Consultation (${lead.referenceCode})`}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#FFAA4F] text-white flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Email</div>
                    <div className="text-sm font-bold group-hover:text-[#FFAA4F] truncate max-w-[170px]">{lead.email}</div>
                  </div>
                </div>
                <span className="text-xs text-[#FFAA4F] font-bold">Email ✉️</span>
              </a>
            </div>

            {/* Consultation Preferences */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Consultation Type</span>
                <span className="font-bold text-white capitalize">{lead.consultationType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Postcode</span>
                <span className="font-bold text-[#FFAA4F]">{lead.postcode}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Preferred Method</span>
                <span className="font-bold text-white capitalize">{lead.preferredContactMethod}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Time Preference</span>
                <span className="font-bold text-white truncate block">{lead.requestedTimeSlot || 'Flexible'}</span>
              </div>
            </div>
          </div>

          {/* CALCULATOR ORIGIN & SPECIFICATION CARD */}
          {lead.source?.startsWith('Calculator:') && (
            <div className="p-6 rounded-2xl bg-slate-850 border border-amber-500/30 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFAA4F]">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <span>Calculator Origin &amp; Qualification</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/20 uppercase">
                  Direct Calculator Lead
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Source Tool</span>
                  <span className="font-bold text-white truncate block">{lead.source.replace('Calculator: ', '')}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Planning Status</span>
                  <span className="font-bold text-emerald-400 capitalize block">{input?.projectStatus?.replace(/_/g, ' ') || 'Planning Approved'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Budget Expectation</span>
                  <span className="font-bold text-[#FFAA4F] font-mono block">£{lead.budgetRange.replace(/_/g, ' ')}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Timeline Target</span>
                  <span className="font-bold text-white capitalize block">{lead.timeline.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Customer Goals & Original Description */}
          {(lead.customerDescription || input?.customerGoals?.length) && (
            <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFAA4F]">
                <Sparkles className="h-4 w-4" />
                <span>Customer Project Description &amp; Goals</span>
              </div>

              {lead.customerDescription && (
                <blockquote className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                  &ldquo;{lead.customerDescription}&rdquo;
                </blockquote>
              )}

              {input?.customerGoals && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {input.customerGoals.map((g) => (
                    <span key={g} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-[#FFAA4F]">
                      🎯 {g}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Room-by-Room Project Scope (BUILD_SPEC.md Section 31) */}
          {scopeItems.length > 0 && (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-850 border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Room-by-Room Specification ({scopeItems.filter((i) => i.selected).length} Active Items)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generated and customized by the homeowner
                  </p>
                </div>
                <Badge variant="brand" className="bg-[#FFAA4F]/20 text-[#FFAA4F] border-[#FFAA4F]/40 text-xs font-mono">
                  {input?.selectedAreas?.length || 1} Rooms
                </Badge>
              </div>

              <div className="space-y-4">
                {input?.selectedAreas?.map((area) => {
                  const areaItems = scopeItems.filter((i) => i.areaName === area.name);
                  const activeItems = areaItems.filter((i) => i.selected);

                  return (
                    <div key={area.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <div>
                          <span className="font-bold text-white text-sm font-heading">{area.name}</span>
                          <span className="text-[11px] text-slate-400 ml-2">
                            ({area.sizeCategory}
                            {area.lengthMeters && area.widthMeters ? ` • ${area.lengthMeters}m × ${area.widthMeters}m` : ''})
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#FFAA4F] font-mono">
                          £{activeItems.reduce((a, b) => a + b.costLow, 0).toLocaleString()} – £
                          {activeItems.reduce((a, b) => a + b.costHigh, 0).toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {areaItems.map((item) => (
                          <div
                            key={item.id}
                            className={clsx(
                              'p-2.5 rounded-lg text-xs flex items-start justify-between gap-2',
                              item.selected ? 'bg-slate-850/90 text-slate-200' : 'opacity-40 line-through text-slate-500'
                            )}
                          >
                            <div className="space-y-0.5">
                              <div className="font-semibold flex items-center gap-1.5">
                                <span className={item.selected ? 'text-emerald-400' : 'text-slate-600'}>
                                  {item.selected ? '✓' : '✕'}
                                </span>
                                <span>{item.name}</span>
                                {item.customItem && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                                    CUSTOM
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">{item.category}</div>
                            </div>
                            <span className="font-mono text-[11px] text-slate-300 shrink-0">
                              £{item.costLow.toLocaleString()} – £{item.costHigh.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations Summary */}
          {recommendations.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                <HelpCircle className="h-4 w-4 text-[#FFAA4F]" />
                <span>Recommended Considerations</span>
              </div>

              <div className="space-y-2 text-xs">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-white">{rec.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{rec.reason}</div>
                    </div>
                    <span
                      className={clsx(
                        'text-[10px] font-bold px-2 py-0.5 rounded shrink-0 uppercase',
                        rec.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      )}
                    >
                      {rec.status === 'accepted' ? 'Accepted' : 'Suggested'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Engine Calculation Breakdown */}
          {est && (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-850 border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Pricing Engine Breakdown
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Development estimate calculated across active trade items
                  </p>
                </div>
                <span className="text-xs font-mono text-[#FFAA4F] bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                  Est. £{est.indicativeCostLow.toLocaleString()} – £{est.indicativeCostHigh.toLocaleString()}
                </span>
              </div>

              {/* Room Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Room Allocation
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {est.roomBreakdowns.map((rb) => (
                    <div key={rb.areaName} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300 font-medium">{rb.areaName} ({rb.itemCount} items)</span>
                      <span className="font-bold text-white font-mono">
                        £{rb.costLow.toLocaleString()} – £{rb.costHigh.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Trade Category Breakdown
                </span>
                <div className="space-y-2">
                  {est.categoryBreakdowns.map((cat) => (
                    <div key={cat.category} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-300">{cat.category}</span>
                        <span className="font-mono text-slate-300">
                          £{cat.costLow.toLocaleString()} – £{cat.costHigh.toLocaleString()} ({cat.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FFAA4F] rounded-full"
                          style={{ width: `${Math.min(100, cat.percentage * 2.5)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CRM Pipeline Stage Switcher & Internal Team Notes */}
        <div className="space-y-6">
          {/* CRM Stage Transition Card */}
          <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 shadow-xl">
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                CRM Pipeline Stage
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Current stage: <strong className="text-[#FFAA4F] uppercase">{lead.stage.replace(/_/g, ' ')}</strong>
              </p>
            </div>

            <div className="space-y-1.5">
              {CRM_STAGES.map((s) => (
                <button
                  type="button"
                  key={s.stage}
                  onClick={() => handleStageChange(s.stage)}
                  disabled={isUpdatingStage}
                  className={clsx(
                    'w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer',
                    lead.stage === s.stage
                      ? 'border-[#FFAA4F] bg-amber-500/10 text-[#FFAA4F] font-bold shadow-xs'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  )}
                >
                  <span>{s.label}</span>
                  {lead.stage === s.stage && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Internal Team Notes & Activity Log */}
          <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 shadow-xl">
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Internal Team Notes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Activity log and internal team comments
              </p>
            </div>

            {/* Add note form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={3}
                placeholder="Add notes from site survey, client call, or structural review..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F]"
              />
              <Button
                type="submit"
                disabled={isAddingNote || !noteText.trim()}
                variant="primary"
                size="sm"
                className="w-full bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-xs"
                rightIcon={isAddingNote ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              >
                Log Internal Note
              </Button>
            </form>

            {/* Notes history list */}
            <div className="space-y-3 pt-2 max-h-[400px] overflow-y-auto pr-1">
              {lead.notesHistory.map((note) => (
                <div key={note.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-[#FFAA4F]">{note.author}</span>
                    <span>{new Date(note.createdAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
