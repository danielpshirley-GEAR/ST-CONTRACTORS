'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Flame,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Building2,
  Hammer,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { CalculatorDefinition, CalculationResult, PricingResult } from '@/lib/calculators/types';

interface CalculatorConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculator: CalculatorDefinition;
  calculationResult: CalculationResult;
  pricingResult?: PricingResult;
  formInputs: Record<string, any>;
}

export const CalculatorConsultationModal: React.FC<CalculatorConsultationModalProps> = ({
  isOpen,
  onClose,
  calculator,
  calculationResult,
  pricingResult,
  formInputs,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationData, setConfirmationData] = useState<{
    referenceCode: string;
    leadScore: number;
    scoreBand: string;
    consultationType: string;
  } | null>(null);

  // Step 1: Project Qualification & Readiness
  const [postcode, setPostcode] = useState(formInputs.postcode || 'W5 2UP');
  const [planningStatus, setPlanningStatus] = useState<string>('planning_approved');
  const [budgetRange, setBudgetRange] = useState<string>('100k_150k');
  const [timeline, setTimeline] = useState<string>('1_3_months');
  const [propertyType, setPropertyType] = useState<string>('semi-detached');

  // Step 2: Contact & Preferred Consultation
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consultationType, setConsultationType] = useState<'site_visit' | 'consultation' | 'callback'>('site_visit');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('10:00 - 12:00 (Morning)');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) {
      setErrorMessage('Please enter your UK postcode or town.');
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone) {
      setErrorMessage('Please fill in your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      calculator: {
        slug: calculator.slug,
        name: calculator.name,
        category: calculator.category,
        primaryLabel: calculationResult.primaryLabel,
        formattedPrimary: calculationResult.formattedPrimary,
        primaryUnit: calculationResult.primaryUnit,
        indicativeCostLow: pricingResult?.totalCostLow || 0,
        indicativeCostHigh: pricingResult?.totalCostHigh || 0,
        inputs: formInputs,
        materials: calculationResult.materials,
      },
      qualification: {
        postcode: postcode.trim().toUpperCase(),
        propertyType,
        planningStatus,
        budgetRange,
        timeline,
      },
      contact: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        consultationType,
        requestedDate: preferredDate || undefined,
        requestedTimeSlot: preferredTimeSlot || undefined,
        notes: notes.trim() || undefined,
      },
    };

    try {
      const res = await fetch('/api/calculator-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit consultation request');
      }

      setConfirmationData({
        referenceCode: data.referenceCode,
        leadScore: data.leadScore,
        scoreBand: data.scoreBand,
        consultationType: data.consultationType,
      });
      setStep(3);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const costRangeText = pricingResult
    ? `£${pricingResult.totalCostLow.toLocaleString()} – £${pricingResult.totalCostHigh.toLocaleString()}`
    : calculationResult.formattedPrimary;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl my-8 bg-neutral-950 border border-neutral-800 text-white rounded-3xl shadow-2xl overflow-hidden text-left">
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-neutral-800 bg-neutral-900/90 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[#FFAA4F] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Flame className="h-3 w-3 text-amber-400" />
                Priority Consultation Request
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {step === 1 ? 'Step 1 of 2' : step === 2 ? 'Step 2 of 2' : 'Confirmed'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {step === 3 ? 'Consultation Confirmed' : 'Book Free Project Consultation'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-neutral-800"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ESTIMATE CONTEXT STRIP */}
        <div className="px-6 py-3.5 bg-neutral-900/60 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-[#FFAA4F] shrink-0" />
            <span className="font-semibold text-neutral-300">{calculator.shortTitle || calculator.name}:</span>
            <span className="font-mono font-bold text-white">{calculationResult.formattedPrimary}</span>
          </div>
          {pricingResult && (
            <div className="font-mono font-bold text-[#FFAA4F] bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              Guide: {costRangeText}
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <span>✕ {errorMessage}</span>
          </div>
        )}

        {/* STEP 1: QUALIFICATION & READINESS */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="p-6 sm:p-8 space-y-5 text-xs">
            {/* Postcode */}
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-200 block">
                Project Postcode / Location <span className="text-[#FFAA4F]">*</span>
              </label>
              <div className="relative">
                <MapPin className="h-4 w-4 absolute left-3.5 top-3 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  placeholder="e.g. W5 2UP (Ealing, West London)"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#FFAA4F] transition-colors"
                />
              </div>
              <p className="text-[11px] text-neutral-400">
                We provide full construction and turnkey build management across London &amp; Home Counties.
              </p>
            </div>

            {/* Planning & Architectural Status */}
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-200 block">Planning &amp; Drawings Status</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'planning_approved', label: 'Planning Approved', desc: 'Ready for structural sign-off' },
                  { id: 'drawings_completed', label: 'Drawings Completed', desc: 'Architect plans ready' },
                  { id: 'need_planning', label: 'Need Design & Planning', desc: 'Want full architectural service' },
                  { id: 'early_research', label: 'Early Cost Research', desc: 'Exploring feasibility' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setPlanningStatus(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      planningStatus === item.id
                        ? 'border-[#FFAA4F] bg-amber-500/10 text-white shadow-sm'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className={`font-bold text-xs ${planningStatus === item.id ? 'text-[#FFAA4F]' : 'text-white'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget & Timeline Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-200 block">Anticipated Budget</label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F] transition-colors"
                >
                  <option value="under_50k">Under £50,000</option>
                  <option value="50k_100k">£50,000 – £100,000</option>
                  <option value="100k_150k">£100,000 – £150,000</option>
                  <option value="150k_250k">£150,000 – £250,000</option>
                  <option value="250k_plus">£250,000+</option>
                  <option value="flexible">Flexible / Based on Consultation</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-200 block">Target Start Timeline</label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F] transition-colors"
                >
                  <option value="immediate">Immediately (Within 4 weeks)</option>
                  <option value="1_3_months">Within 1 – 3 months</option>
                  <option value="3_6_months">3 – 6 months</option>
                  <option value="6_12_months">6 – 12 months</option>
                </select>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="w-full text-sm font-bold justify-center shadow-lg py-3.5 bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335]"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Continue to Contact &amp; Schedule
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: CONTACT & PREFERRED CONSULTATION */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 text-xs">
            {/* Consultation Format Options */}
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-200 block">Preferred Consultation Format</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'site_visit',
                    title: 'On-Site Laser Survey',
                    desc: 'Senior surveyor visits property to laser measure & inspect steels',
                  },
                  {
                    id: 'consultation',
                    title: 'Video Design Review',
                    desc: 'Screen share drawings, structural advice & line-item scope',
                  },
                  {
                    id: 'callback',
                    title: 'Senior Phone Call',
                    desc: 'Direct feasibility review with our project director',
                  },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setConsultationType(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      consultationType === item.id
                        ? 'border-[#FFAA4F] bg-amber-500/10 text-white shadow-sm'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className={`font-bold text-xs ${consultationType === item.id ? 'text-[#FFAA4F]' : 'text-white'}`}>
                      {item.title}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 leading-snug">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-200 block">
                  First Name <span className="text-[#FFAA4F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Daniel"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-200 block">
                  Last Name <span className="text-[#FFAA4F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Shirley"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F] transition-colors"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-200 block">
                  Email Address <span className="text-[#FFAA4F]">*</span>
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 absolute left-3.5 top-3 text-neutral-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.co.uk"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-200 block">
                  Phone Number <span className="text-[#FFAA4F]">*</span>
                </label>
                <div className="relative">
                  <Phone className="h-4 w-4 absolute left-3.5 top-3 text-neutral-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07700 900123"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Appointment Preference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-200 block">Preferred Date (Optional)</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FFAA4F] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-200 block">Preferred Time Window</label>
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F] transition-colors"
                >
                  <option value="09:00 - 12:00 (Morning)">09:00 – 12:00 (Morning)</option>
                  <option value="12:00 - 15:00 (Early Afternoon)">12:00 – 15:00 (Early Afternoon)</option>
                  <option value="15:00 - 18:00 (Late Afternoon)">15:00 – 18:00 (Late Afternoon)</option>
                  <option value="18:00 - 20:00 (Evening)">18:00 – 20:00 (Evening)</option>
                </select>
              </div>
            </div>

            {/* Trust badge */}
            <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Direct review by our principal construction director. Zero obligation.</span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-800"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isSubmitting}
                className="flex-1 text-sm font-bold justify-center shadow-lg py-3.5 bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 flex-row whitespace-nowrap border border-[#E69335]"
                rightIcon={<ArrowRight className="h-4 w-4 shrink-0" />}
              >
                {isSubmitting ? 'Booking Consultation...' : 'Confirm Consultation Booking'}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: CONFIRMATION SUCCESS */}
        {step === 3 && confirmationData && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30 inline-block">
                Project Reference: {confirmationData.referenceCode}
              </span>
              <h3 className="text-2xl font-bold font-heading text-white">
                Consultation Request Received!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                Thank you, {firstName}. Our senior construction team has received your project calculation and requested{' '}
                <strong className="text-white capitalize">
                  {confirmationData.consultationType.replace('_', ' ')}
                </strong>.
              </p>
            </div>

            {/* CONFIRMATION SUMMARY CARD */}
            <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Project Type:</span>
                <span className="font-bold text-white">{calculator.shortTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Estimated Scope:</span>
                <span className="font-mono text-[#FFAA4F] font-bold">{calculationResult.formattedPrimary}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Location:</span>
                <span className="font-bold text-white">{postcode}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Next Step:</span>
                <span className="font-bold text-emerald-400">Surveyor will call within 2 business hours</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                size="md"
                onClick={onClose}
                className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold px-8 border border-[#E69335]"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
