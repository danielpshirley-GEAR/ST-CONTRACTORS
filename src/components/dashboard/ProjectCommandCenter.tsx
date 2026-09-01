'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UnifiedProjectProfile, ProjectScopeItem, ProjectUploadItem } from '@/types/project-profile';
import { getActiveProjectProfile, updateActiveProjectProfile } from '@/lib/planner/project-sync';
import { trackEvent } from '@/lib/analytics';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PoundSterling,
  Calendar,
  Phone,
  Upload,
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building,
  Layers,
  MapPin,
  HelpCircle,
  Plus,
  Trash2,
  Download,
  Info,
  Check,
} from 'lucide-react';
import { clsx } from 'clsx';

export const ProjectCommandCenter: React.FC = () => {
  const [profile, setProfile] = useState<UnifiedProjectProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'scope' | 'statutory' | 'uploads' | 'calculations'>('overview');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<ProjectUploadItem['category']>('photo');
  const [uploadNotes, setUploadNotes] = useState('');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: 'As soon as convenient',
    slot: 'Morning (9:00 AM - 12:00 PM)',
    notes: '',
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Load active project profile
  useEffect(() => {
    const loaded = getActiveProjectProfile();
    setProfile(loaded);
    if (loaded.contactDetails?.name) {
      setBookingForm((prev) => ({
        ...prev,
        name: loaded.contactDetails?.name || prev.name,
        email: loaded.contactDetails?.email || prev.email,
        phone: loaded.contactDetails?.phone || prev.phone,
      }));
    }
  }, []);

  if (!profile) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading your project command center...</p>
      </div>
    );
  }

  const handlePrint = () => {
    trackEvent('project_report_generated', {
      referenceCode: profile.referenceCode,
      estimatedLow: profile.estimate.low,
      estimatedHigh: profile.estimate.high,
    });
    window.print();
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputData: {
            projectType: profile.projectTypes[0] || 'full-renovation',
            postcode: profile.location.postcode || 'W4 1PR',
            propertyType: profile.propertyType,
            propertyAge: profile.propertyEra || 'victorian',
            finishLevel: profile.specificationTier,
            selectedAreas: profile.rooms.map((r) => ({
              id: r.id,
              name: r.customName,
              sizeCategory: 'medium',
              lengthMeters: r.lengthMeters,
              widthMeters: r.widthMeters,
            })),
          },
          scopeItems: profile.scopeItems,
          contact: {
            firstName: bookingForm.name.split(' ')[0] || bookingForm.name,
            lastName: bookingForm.name.split(' ').slice(1).join(' ') || 'Customer',
            email: bookingForm.email,
            phone: bookingForm.phone,
            preferredDay: bookingForm.date,
            requestedTimeSlot: bookingForm.slot,
            notes: bookingForm.notes,
            consultationType: 'consultation',
          },
          source: 'Project Command Center (/my-project)',
        }),
      });

      if (res.ok) {
        setBookingSuccess(true);
        const updated = updateActiveProjectProfile({
          professionalReviewRequested: true,
          contactDetails: {
            name: bookingForm.name,
            email: bookingForm.email,
            phone: bookingForm.phone,
            requestedConsultationDate: bookingForm.date,
            requestedTimeSlot: bookingForm.slot,
          },
        });
        setProfile(updated);
        trackEvent('professional_review_requested', {
          referenceCode: profile.referenceCode,
          leadEmail: bookingForm.email,
        });
      }
    } catch (err) {
      console.error('Error submitting consultation:', err);
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleFileUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newUpload: ProjectUploadItem = {
      id: `up_${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'image/jpeg',
      fileUrl: URL.createObjectURL(file),
      category: uploadCategory,
      uploadedAt: new Date().toISOString(),
      notes: uploadNotes,
    };

    const updated = updateActiveProjectProfile({
      uploads: [newUpload, ...(profile.uploads || [])],
    });
    setProfile(updated);
    setUploadNotes('');
    trackEvent('photo_uploaded', {
      fileName: file.name,
      category: uploadCategory,
      referenceCode: profile.referenceCode,
    });
  };

  const statutoryItems = [
    {
      title: 'Party Wall Act 1996 Notice',
      status: profile.projectTypes.includes('extension') || profile.projectTypes.includes('loft' as any) ? 'Required' : 'Advisory',
      description: 'Required for excavations within 3–6m of neighbour foundations or cutting into shared party walls.',
      actionNote: 'Our project team prepares Section 1 & Section 6 notices directly.',
    },
    {
      title: 'Thames Water Build Over Agreement',
      status: profile.projectTypes.includes('extension') ? 'Review Needed' : 'Not Required',
      description: 'Applies if extending over or within 3m of a public/shared drainage pipe.',
      actionNote: 'Confirmed via CCTV drainage survey prior to footing pour.',
    },
    {
      title: 'Building Regulations Compliance (Part A, P, G, L)',
      status: 'Mandatory',
      description: 'Structural calculations, Part P electrical certification, Part G water safety, and Part L thermal efficiency.',
      actionNote: 'Full Building Control inspections scheduled at key milestone sign-offs.',
    },
    {
      title: 'CDM Regulations 2015 Health & Safety Plan',
      status: 'Mandatory',
      description: 'Principal Contractor duties and site welfare compliance.',
      actionNote: 'Managed 100% by ST CONTRACTORS site management.',
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* 1. TOP COMMAND HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 architectural-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold text-xs">
                {profile.referenceCode}
              </Badge>
              <Badge variant="outline" className="text-slate-300 border-slate-700 text-xs">
                {profile.propertyType.replace('_', ' ').toUpperCase()} • {profile.location.postcode || 'LONDON'}
              </Badge>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Live Project Profile
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Project Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Your real-time residential build portal. Edit room scopes, track London statutory approvals, upload architectural plans, and book surveyor site reviews.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0 print:hidden">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="text-xs border-slate-700 text-slate-200 hover:bg-slate-800"
              leftIcon={<Printer className="h-4 w-4 text-slate-400" />}
            >
              Print / Save PDF
            </Button>
            <Link href="/plan-my-project">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-slate-700 text-slate-200 hover:bg-slate-800"
                leftIcon={<Layers className="h-4 w-4 text-[#FFAA4F]" />}
              >
                Refine in Planner
              </Button>
            </Link>
            <Button
              onClick={() => setIsConsultationModalOpen(true)}
              variant="primary"
              size="sm"
              className="text-xs font-bold bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335] shadow-md"
              leftIcon={<Calendar className="h-4 w-4" />}
            >
              Book Site Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* 2. READINESS & COST ESTIMATE KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Readiness Gauge */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Readiness Score
            </span>
            <Badge
              variant="brand"
              className={clsx(
                'font-bold text-xs',
                profile.readiness.score >= 70 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
              )}
            >
              {profile.readiness.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 font-heading">
              {profile.readiness.score}%
            </span>
            <span className="text-xs text-slate-500 font-medium">ready for contractor appointment</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-[#FFAA4F] h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${profile.readiness.score}%` }}
            />
          </div>

          <div className="text-xs text-slate-600 space-y-1 pt-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <Check className="h-3.5 w-3.5" />
              <span>{profile.readiness.completedItems.length} Milestones Complete</span>
            </div>
            {profile.readiness.missingItems.length > 0 && (
              <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Next: {profile.readiness.missingItems[0]}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Live Cost Range */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Indicative London Cost Range
            </span>
            <Badge variant="brand" className="bg-slate-100 text-slate-700 text-xs font-semibold">
              {profile.specificationTier.toUpperCase()} FINISH
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              £{profile.estimate.low.toLocaleString()} – £{profile.estimate.high.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Target Expected: <strong className="text-slate-900 font-bold">£{profile.estimate.expected.toLocaleString()}</strong> (incl. London prelims &amp; contingency)
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Confidence: <strong className="text-emerald-700 font-bold">{profile.confidenceLevel}</strong></span>
            <span className="text-slate-400">Fixed quote post site survey</span>
          </div>
        </Card>

        {/* Timeline & Professional Review */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Surveyor Review Status
            </span>
            <Badge
              variant="brand"
              className={clsx(
                'text-xs font-bold',
                profile.professionalReviewRequested ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-700'
              )}
            >
              {profile.professionalReviewRequested ? 'REQUESTED' : 'READY TO BOOK'}
            </Badge>
          </div>

          <div className="space-y-1.5">
            <div className="text-base font-bold text-slate-900 font-heading">
              {profile.professionalReviewRequested ? 'Consultation Queued' : 'Free Technical Review'}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {profile.professionalReviewRequested
                ? 'Our senior project surveyor is reviewing your room scope and ground conditions.'
                : 'Have our estimating director review your project dimensions, Party Wall notices, and M&E capacity.'}
            </p>
          </div>

          <Button
            onClick={() => setIsConsultationModalOpen(true)}
            variant={profile.professionalReviewRequested ? 'outline' : 'primary'}
            size="sm"
            className="w-full text-xs font-bold py-2.5"
          >
            {profile.professionalReviewRequested ? 'Update Booking Details' : 'Book Free Surveyor Review'}
          </Button>
        </Card>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="border-b border-slate-200 print:hidden">
        <nav className="flex space-x-6 overflow-x-auto pb-px" aria-label="Tabs">
          {[
            { id: 'overview', label: 'Project Overview' },
            { id: 'scope', label: `Room Scopes (${profile.rooms.length})` },
            { id: 'statutory', label: 'Statutory & Planning' },
            { id: 'uploads', label: `Plans & Photos (${profile.uploads.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                'py-3.5 px-1 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer',
                activeTab === tab.id
                  ? 'border-[#FFAA4F] text-slate-950'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 4. TAB CONTENTS */}
      {/* TAB A: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Property Context */}
            <Card className="p-6 bg-white border-slate-200 shadow-xs rounded-3xl space-y-4">
              <h3 className="text-base font-bold font-heading text-slate-900 flex items-center gap-2">
                <Building className="h-4 w-4 text-[#FFAA4F]" />
                Property Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Property Type</span>
                  <span className="font-bold text-slate-800 capitalize">{profile.propertyType.replace('_', ' ')}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Property Era</span>
                  <span className="font-bold text-slate-800 capitalize">{profile.propertyEra || 'Victorian'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Postcode / Area</span>
                  <span className="font-bold text-slate-800 font-mono">{profile.location.postcode || 'London W4'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Occupied During Works</span>
                  <span className="font-bold text-slate-800">{profile.occupiedDuringWorks ? 'Yes (Phased)' : 'No (Vacant)'}</span>
                </div>
              </div>
            </Card>

            {/* Estimated Cost Breakdown */}
            <Card className="p-6 bg-white border-slate-200 shadow-xs rounded-3xl space-y-4">
              <h3 className="text-base font-bold font-heading text-slate-900 flex items-center gap-2">
                <PoundSterling className="h-4 w-4 text-emerald-600" />
                Cost Component Breakdown
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Structural Labour &amp; Installation</span>
                  <span className="font-bold text-slate-900">£{profile.estimate.breakdown.labourTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Building Materials &amp; Finishes</span>
                  <span className="font-bold text-slate-900">£{profile.estimate.breakdown.materialsTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Structural Steel (RSJ) Allowance</span>
                  <span className="font-bold text-slate-900">£{profile.estimate.breakdown.structuralSteelAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Waste Removal &amp; Skip Permits</span>
                  <span className="font-bold text-slate-900">£{profile.estimate.breakdown.wasteAndDisposal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Project Management &amp; Prelims</span>
                  <span className="font-bold text-slate-900">£{profile.estimate.breakdown.prelimsAndManagement.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 text-emerald-700 font-bold bg-emerald-50/70 px-2 rounded-lg">
                  <span>Recommended Contingency (10%)</span>
                  <span>£{profile.estimate.breakdown.contingency.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB B: ROOM SCOPES */}
      {activeTab === 'scope' && (
        <div className="space-y-4">
          {profile.rooms.length === 0 ? (
            <Card className="p-10 text-center bg-white border-slate-200 rounded-3xl space-y-3">
              <Layers className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 font-heading">No Room Scopes Configured Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Use our AI Project Planner or any trade calculator to configure room dimensions and itemized works.
              </p>
              <Link href="/plan-my-project">
                <Button variant="primary" size="sm" className="font-bold text-xs mt-2">
                  Launch Project Planner
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.rooms.map((room) => (
                <Card key={room.id} className="p-5 bg-white border-slate-200 rounded-3xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 font-heading">{room.customName}</h4>
                    <Badge variant="brand" className="bg-amber-100 text-amber-900 text-[11px] font-bold">
                      £{room.subtotalEstimate.expected.toLocaleString()}
                    </Badge>
                  </div>
                  {room.lengthMeters && room.widthMeters && (
                    <div className="text-xs text-slate-500">
                      Dimensions: <strong className="text-slate-700">{room.lengthMeters}m × {room.widthMeters}m</strong> ({(room.lengthMeters * room.widthMeters).toFixed(1)} m²)
                    </div>
                  )}
                  <div className="text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-700 block text-[11px] uppercase">Included Items:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      {room.includedWorks.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB C: STATUTORY & PLANNING */}
      {activeTab === 'statutory' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statutoryItems.map((item, idx) => (
              <Card key={idx} className="p-5 bg-white border-slate-200 rounded-3xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 font-heading">{item.title}</h4>
                  <Badge variant="brand" className="bg-slate-100 text-slate-800 text-[11px] font-semibold">
                    {item.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 font-medium flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{item.actionNote}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB D: UPLOADS */}
      {activeTab === 'uploads' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white border-slate-200 rounded-3xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Upload Site Photos, Floorplans &amp; Architectural Drawings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Asset Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="photo">Room / Exterior Site Photo</option>
                  <option value="architectural_drawing">Architectural Drawing / Floorplan</option>
                  <option value="quote_document">Existing Contractor Quote for Comparison</option>
                  <option value="inspiration">Inspiration Image</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Optional Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Current rear kitchen before knockthrough"
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center bg-slate-50/50">
              <Upload className="h-8 w-8 text-amber-600" />
              <span className="text-xs font-bold text-slate-800">Click to select files (JPG, PNG, PDF max 15MB)</span>
              <span className="text-[11px] text-slate-500">Files are linked directly to project reference {profile.referenceCode}</span>
              <input type="file" onChange={handleFileUploadSimulated} className="hidden" accept="image/*,application/pdf" />
            </label>
          </Card>

          {profile.uploads.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {profile.uploads.map((up) => (
                <Card key={up.id} className="p-4 bg-white border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="brand" className="bg-slate-100 text-slate-700 text-[10px] uppercase font-bold">
                      {up.category}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono">{(up.fileSize / 1024).toFixed(0)} KB</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">{up.fileName}</div>
                  {up.notes && <div className="text-[11px] text-slate-500">{up.notes}</div>}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. CONSULTATION MODAL */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 text-left">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-bold text-xs mb-1">
                  Project {profile.referenceCode}
                </Badge>
                <h3 className="text-xl font-bold font-heading text-slate-900">
                  Book Site Consultation &amp; Review
                </h3>
              </div>
              <button
                onClick={() => setIsConsultationModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-950 font-heading">Consultation Requested!</h4>
                <p className="text-xs text-emerald-800">
                  Our estimating team has received your project profile ({profile.referenceCode}) and will contact you within 1 business day.
                </p>
                <Button
                  onClick={() => {
                    setIsConsultationModalOpen(false);
                    setBookingSuccess(false);
                  }}
                  variant="primary"
                  size="sm"
                  className="font-bold text-xs mt-3"
                >
                  Return to Dashboard
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. David Richardson"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="david@example.com"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="07123 456789"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Time</label>
                    <select
                      value={bookingForm.slot}
                      onChange={(e) => setBookingForm((p) => ({ ...p, slot: e.target.value }))}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Morning (9:00 AM - 12:00 PM)">Morning (9am - 12pm)</option>
                      <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon (1pm - 5pm)</option>
                      <option value="Evening (5:00 PM - 7:30 PM)">Evening (5pm - 7:30pm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Timing</label>
                    <input
                      type="text"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm((p) => ({ ...p, date: e.target.value }))}
                      placeholder="This week / Next week"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={bookingSubmitting}
                  variant="primary"
                  size="lg"
                  className="w-full font-bold text-xs bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 py-3.5"
                >
                  {bookingSubmitting ? 'Submitting...' : 'Confirm Consultation Request'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
