'use client';

import React, { useState } from 'react';
import { DbConsultation, DbProject } from '@/lib/db/schema';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Video,
  MapPin,
  Phone,
} from 'lucide-react';

interface ConsultationsManagerViewProps {
  initialConsultations: DbConsultation[];
  projects: DbProject[];
  activeProjectId?: string;
}

export function ConsultationsManagerView({
  initialConsultations,
  projects,
  activeProjectId,
}: ConsultationsManagerViewProps) {
  const [consultations, setConsultations] = useState<DbConsultation[]>(initialConsultations);
  const [projectId, setProjectId] = useState<string>(activeProjectId || (projects[0]?.id || ''));
  const [type, setType] = useState<DbConsultation['type']>('site_visit');
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTimeSlot, setRequestedTimeSlot] = useState('Morning (09:00 - 12:00)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(false);

    try {
      const res = await fetch('/api/customer/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectId || undefined,
          type,
          requestedDate,
          requestedTimeSlot,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.consultation) {
        setConsultations((prev) => [data.consultation, ...prev]);
        setSuccessMessage(true);
        setNotes('');
        setRequestedDate('');
      }
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* BOOKING FORM */}
      <Card className="p-6 bg-slate-900 border-slate-800 rounded-3xl space-y-5 h-fit">
        <div>
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#FFAA4F]" />
            <span>Book New Appointment</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Choose between a video consultation or an on-site property inspection.
          </p>
        </div>

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Consultation request submitted. Our surveyor will confirm within 4 hours.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {projects.length > 0 && (
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 block">Link to Saved Project</label>
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
            <label className="font-semibold text-slate-300 block">Consultation Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'site_visit', label: 'Site Visit', icon: MapPin },
                { id: 'consultation', label: 'Video Call', icon: Video },
                { id: 'callback', label: 'Phone Call', icon: Phone },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = type === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setType(opt.id as any)}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFAA4F] text-slate-950 border-[#FFAA4F] font-bold shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[11px]">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">Preferred Date</label>
            <input
              type="date"
              required
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">Time Slot</label>
            <select
              value={requestedTimeSlot}
              onChange={(e) => setRequestedTimeSlot(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F]"
            >
              <option value="Morning (09:00 - 12:00)">Morning (09:00 – 12:00)</option>
              <option value="Early Afternoon (12:00 - 15:00)">Early Afternoon (12:00 – 15:00)</option>
              <option value="Late Afternoon (15:00 - 18:00)">Late Afternoon (15:00 – 18:00)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">Special Focus / Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Would like to discuss bifold doors vs sliding doors and check if party wall agreement will be needed."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FFAA4F]"
            />
          </div>

          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={isSubmitting}
            className="w-full text-xs font-bold gap-2 shadow-md"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Submitting...' : 'Request Consultation'}</span>
          </Button>
        </form>
      </Card>

      {/* APPOINTMENTS LIST */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-base font-bold text-white font-heading">
          Scheduled &amp; Past Appointments ({consultations.length})
        </h3>

        {consultations.length === 0 ? (
          <Card className="p-8 text-center bg-slate-900 border-slate-800 rounded-3xl space-y-2 text-xs text-slate-400">
            <Calendar className="h-8 w-8 mx-auto text-slate-600 mb-2" />
            <p className="font-bold text-white text-sm">No consultations scheduled yet.</p>
            <p>Use the booking form to request an on-site property inspection or video consultation.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {consultations.map((c) => (
              <Card
                key={c.id}
                className="p-6 bg-slate-900 border-slate-800 hover:border-slate-700 transition-all rounded-3xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={c.status === 'confirmed' ? 'brand' : c.status === 'completed' ? 'slate' : 'warning'}
                        size="sm"
                        className="text-[10px] uppercase font-bold"
                      >
                        {c.status}
                      </Badge>
                      <span className="text-xs font-mono text-slate-400">Ref: {c.referenceCode}</span>
                    </div>
                    <h4 className="text-base font-bold text-white font-heading">
                      {c.type === 'site_visit'
                        ? 'On-Site Property Inspection'
                        : c.type === 'consultation'
                        ? 'Architectural Video Consultation'
                        : 'Phone Callback'}
                    </h4>
                  </div>

                  <div className="text-left sm:text-right text-xs">
                    <div className="font-bold text-white flex items-center gap-1.5 sm:justify-end">
                      <Calendar className="h-3.5 w-3.5 text-[#FFAA4F]" />
                      <span>{c.requestedDate || 'Date to be confirmed'}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px] block mt-0.5">
                      Slot: {c.requestedTimeSlot || 'Morning'}
                    </span>
                  </div>
                </div>

                {c.notes && (
                  <p className="text-xs text-slate-300 italic bg-slate-950 p-3 rounded-xl border border-slate-800">
                    &quot;{c.notes}&quot;
                  </p>
                )}

                {c.assignedSurveyor && (
                  <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-[#FFAA4F]" />
                      <span>Assigned Project Director: <strong className="text-white">{c.assignedSurveyor}</strong></span>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
