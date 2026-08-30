'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ProjectType,
  PropertyType,
  FinishLevel,
  ProjectStatus,
  DesiredTimeline,
  BudgetRange,
  ProjectPlanInput,
  EstimateResult,
} from '@/lib/pricing/types';
import { calculateProjectEstimate } from '@/lib/pricing/estimator';
import {
  FINISH_LEVEL_MULTIPLIERS,
  PROJECT_SPECIFIC_ADDONS,
  ADDON_FEATURE_COSTS,
} from '@/lib/pricing/benchmarks';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Home,
  Hammer,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Building,
  Layers,
  Maximize2,
  Compass,
  AlertCircle,
  HelpCircle,
  FileCheck,
  Send,
  RefreshCw,
} from 'lucide-react';
import { clsx } from 'clsx';

const PROJECT_TYPE_OPTIONS: { type: ProjectType; label: string; icon: string; desc: string }[] = [
  { type: 'extension', label: 'House Extension', icon: '🏗️', desc: 'Rear, side return, or wrap-around extensions' },
  { type: 'full-renovation', label: 'Full House Renovation', icon: '🏡', desc: 'Complete period property transformation & rewiring' },
  { type: 'kitchen', label: 'Kitchen Renovation', icon: '🍳', desc: 'Bespoke cabinetry, open-plan structural openings' },
  { type: 'bathroom', label: 'Bathroom Renovation', icon: '🛁', desc: 'Luxury en-suites, wetrooms & family bathrooms' },
  { type: 'loft-conversion', label: 'Loft Conversion', icon: '📐', desc: 'Rear dormer, hip-to-gable or mansard lofts' },
  { type: 'garage-conversion', label: 'Garage Conversion', icon: '🚗', desc: 'Transform unused garage into luxury living space' },
  { type: 'garden-room', label: 'Garden Studio / Room', icon: '🌿', desc: 'Insulated contemporary timber home office studio' },
  { type: 'driveway', label: 'Driveway & Entrance', icon: '🛣️', desc: 'Resin-bound, block paving and dropped kerbs' },
  { type: 'landscaping', label: 'Landscaping & Patio', icon: '🌳', desc: 'Porcelain slab patios, turfing and garden architecture' },
  { type: 'other', label: 'Other Construction', icon: '🔨', desc: 'Custom structural modifications and bespoke building' },
];

const PROPERTY_TYPE_OPTIONS: { type: PropertyType; label: string; icon: string }[] = [
  { type: 'semi-detached', label: 'Semi-Detached', icon: '🏘️' },
  { type: 'terraced', label: 'Terraced House', icon: '🏙️' },
  { type: 'detached', label: 'Detached House', icon: '🏡' },
  { type: 'bungalow', label: 'Bungalow', icon: '🏠' },
  { type: 'flat', label: 'Apartment / Flat', icon: '🏢' },
  { type: 'other', label: 'Other Property', icon: '🏛️' },
];

const STATUS_OPTIONS: { status: ProjectStatus; label: string; desc: string }[] = [
  { status: 'exploring_ideas', label: '1. Exploring Ideas', desc: 'Gathering initial inspiration and ballpark budgets' },
  { status: 'researching_costs', label: '2. Researching Costs', desc: 'Actively comparing indicative pricing for feasibility' },
  { status: 'ready_to_plan', label: '3. Ready to Plan', desc: 'Requirements defined, ready for architectural drawings' },
  { status: 'drawings_completed', label: '4. Drawings Completed', desc: 'Architectural drawings & elevations prepared' },
  { status: 'planning_approved', label: '5. Planning Approved', desc: 'Permitted development or council planning approved' },
  { status: 'ready_to_appoint', label: '6. Ready to Appoint Builder', desc: 'Ready to receive formal tender & appoint contractor' },
];

const TIMELINE_OPTIONS: { timeline: DesiredTimeline; label: string; icon: string }[] = [
  { timeline: 'asap', label: 'Immediately / ASAP', icon: '⚡' },
  { timeline: '1_3_months', label: 'In 1 to 3 Months', icon: '📅' },
  { timeline: '3_6_months', label: 'In 3 to 6 Months', icon: '🗓️' },
  { timeline: '6_12_months', label: 'In 6 to 12 Months', icon: '⏳' },
  { timeline: 'researching_only', label: 'Researching (12+ Months)', icon: '🔍' },
];

const BUDGET_OPTIONS: { budget: BudgetRange; label: string }[] = [
  { budget: 'under_25k', label: 'Under £25,000' },
  { budget: '25k_50k', label: '£25,000 – £50,000' },
  { budget: '50k_100k', label: '£50,000 – £100,000' },
  { budget: '100k_150k', label: '£100,000 – £150,000' },
  { budget: '150k_250k', label: '£150,000 – £250,000' },
  { budget: '250k_plus', label: '£250,000+' },
  { budget: 'not_sure', label: 'Not Sure / Need Advice' },
];

export const ProjectPlannerWizard: React.FC = () => {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service');

  // Step index: 1 to 8, then Step 9 is Results
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [planData, setPlanData] = useState<ProjectPlanInput>({
    projectType: 'extension',
    propertyType: 'semi-detached',
    bedrooms: 3,
    postcode: 'W5',
    lengthMeters: 6,
    widthMeters: 4,
    storeys: 1,
    approxAreaM2: 24,
    roomCount: 4,
    isUnknownDimensions: false,
    requirements: ['bifold_doors', 'rooflights', 'underfloor_heating'],
    finishLevel: 'standard',
    status: 'ready_to_plan',
    timeline: '1_3_months',
    budgetRange: '50k_100k',
    customNotes: '',
  });

  // Prepopulate from service query param
  useEffect(() => {
    if (initialService) {
      const mapping: Record<string, ProjectType> = {
        extensions: 'extension',
        renovations: 'full-renovation',
        'kitchen-renovations': 'kitchen',
        'bathroom-renovations': 'bathroom',
        'loft-conversions': 'loft-conversion',
        'garage-conversions': 'garage-conversion',
        'garden-rooms': 'garden-room',
        driveways: 'driveway',
        landscaping: 'landscaping',
      };
      if (mapping[initialService]) {
        setPlanData((prev) => ({ ...prev, projectType: mapping[initialService] }));
      }
    }
  }, [initialService]);

  // Calculated Estimate
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);

  // Booking Modal / Consultation Form State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'consultation' | 'callback' | 'site_visit'>('consultation');
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredContactMethod: 'phone' as 'phone' | 'email',
    requestedDate: '',
    requestedTimeSlot: 'Morning (9:00 AM - 12:00 PM)',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceCode: string;
    leadId: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Recalculate estimate whenever entering Step 9 or changing data
  useEffect(() => {
    const result = calculateProjectEstimate(planData);
    setEstimate(result);
  }, [planData]);

  // Requirement toggle
  const toggleRequirement = (reqKey: string) => {
    setPlanData((prev) => {
      const exists = prev.requirements.includes(reqKey);
      return {
        ...prev,
        requirements: exists
          ? prev.requirements.filter((r) => r !== reqKey)
          : [...prev.requirements, reqKey],
      };
    });
  };

  const nextStep = () => {
    if (currentStep < 9) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Submit Lead & Consultation Booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectInput: planData,
          estimateResult: estimate,
          contact: {
            ...contactForm,
            consultationType: bookingType,
          },
          source: 'Plan My Project Interactive Wizard',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking request');
      }

      setSubmissionSuccess({
        referenceCode: data.referenceCode,
        leadId: data.leadId,
      });
      setBookingModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const totalSteps = 8;
  const progressPercent = Math.round((Math.min(currentStep, totalSteps) / totalSteps) * 100);

  return (
    <div className="w-full">
      {/* Progress Bar & Breadcrumb Header */}
      {currentStep <= 8 && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>
              STEP {currentStep} OF {totalSteps}
            </span>
            <span className="text-[#FFAA4F]">{progressPercent}% COMPLETE</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FFAA4F] transition-all duration-300 ease-out rounded-full shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: PROJECT TYPE */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-left">
            <Badge variant="brand" className="mb-2 bg-[#FFAA4F]/20 text-slate-900 border-[#FFAA4F]/40">
              Step 1 • Project Type
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              What type of project are you planning?
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select your primary project focus to tailor dimension calculations and architectural trade rates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {PROJECT_TYPE_OPTIONS.map((item) => {
              const isSelected = planData.projectType === item.type;
              return (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => {
                    const specificAddons = PROJECT_SPECIFIC_ADDONS[item.type] || PROJECT_SPECIFIC_ADDONS.other;
                    const defaultReqs = specificAddons.slice(0, 3).map((a) => a.key);
                    setPlanData((prev) => ({
                      ...prev,
                      projectType: item.type,
                      requirements: defaultReqs,
                    }));
                  }}
                  className={clsx(
                    'p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 cursor-pointer',
                    isSelected
                      ? 'border-[#FFAA4F] bg-amber-50/60 ring-2 ring-[#FFAA4F]/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                  )}
                >
                  <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-white border border-slate-100 shadow-xs">
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-sm sm:text-base font-heading">
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-6 flex justify-end">
            <Button
              type="button"
              onClick={nextStep}
              variant="primary"
              size="lg"
              className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold px-8 py-3.5"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Continue to Property Details
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: PROPERTY DETAILS & POSTCODE */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="text-left">
            <Badge variant="brand" className="mb-2 bg-[#FFAA4F]/20 text-slate-900 border-[#FFAA4F]/40">
              Step 2 • Property &amp; Location
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Tell us about your property
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Property structure and location help determine access requirements, party wall considerations, and local trade logistics.
            </p>
          </div>

          <div className="space-y-5 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Property Structure
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PROPERTY_TYPE_OPTIONS.map((item) => (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setPlanData((prev) => ({ ...prev, propertyType: item.type }))}
                    className={clsx(
                      'p-3.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer',
                      planData.propertyType === item.type
                        ? 'border-[#FFAA4F] bg-amber-50/60 ring-2 ring-[#FFAA4F]/40'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    )}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Number of Bedrooms
                </label>
                <select
                  value={planData.bedrooms || 3}
                  onChange={(e) => setPlanData((prev) => ({ ...prev, bedrooms: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F]"
                >
                  <option value={1}>1 Bedroom</option>
                  <option value={2}>2 Bedrooms</option>
                  <option value={3}>3 Bedrooms</option>
                  <option value={4}>4 Bedrooms</option>
                  <option value={5}>5+ Bedrooms</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Project Postcode (e.g. W5, TW9, SW19)
                </label>
                <input
                  type="text"
                  placeholder="e.g. W5 2UP"
                  value={planData.postcode}
                  onChange={(e) => setPlanData((prev) => ({ ...prev, postcode: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F] uppercase placeholder:normal-case placeholder:font-normal"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between">
            <Button type="button" onClick={prevStep} variant="outline" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              variant="primary"
              size="lg"
              className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold px-8 py-3.5"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Continue to Dimensions
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: DIMENSIONS & PROJECT SCOPE */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="text-left">
            <Badge variant="brand" className="mb-2 bg-[#FFAA4F]/20 text-slate-900 border-[#FFAA4F]/40">
              Step 3 • Dimensions &amp; Scope
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Estimated Dimensions &amp; Scale
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Give approximate measurements if known, or choose standard typical sizing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 text-left">
            {planData.projectType === 'extension' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Length (meters outward)
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={20}
                      step={0.5}
                      value={planData.lengthMeters || 6}
                      onChange={(e) => setPlanData((prev) => ({ ...prev, lengthMeters: Number(e.target.value), isUnknownDimensions: false }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold text-base focus:ring-2 focus:ring-[#FFAA4F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Width (meters across)
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={20}
                      step={0.5}
                      value={planData.widthMeters || 4}
                      onChange={(e) => setPlanData((prev) => ({ ...prev, widthMeters: Number(e.target.value), isUnknownDimensions: false }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold text-base focus:ring-2 focus:ring-[#FFAA4F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Number of Storeys
                    </label>
                    <select
                      value={planData.storeys || 1}
                      onChange={(e) => setPlanData((prev) => ({ ...prev, storeys: Number(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold text-base focus:ring-2 focus:ring-[#FFAA4F]"
                    >
                      <option value={1}>1 Storey (Single Rear / Side)</option>
                      <option value={2}>2 Storeys (Double Height)</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs text-slate-500 pt-2 flex items-center gap-1.5 font-medium">
                  <Maximize2 className="h-4 w-4 text-[#FFAA4F]" />
                  <span>
                    Calculated Footprint: <strong>{((planData.lengthMeters || 6) * (planData.widthMeters || 4)).toFixed(1)} m²</strong>
                    {planData.storeys === 2 && ' (~' + (((planData.lengthMeters || 6) * (planData.widthMeters || 4) * 2)).toFixed(1) + ' m² across 2 floors)'}
                  </span>
                </div>
              </div>
            )}

            {planData.projectType === 'full-renovation' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Approximate Gross Floor Area (m²)
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={500}
                    step={5}
                    value={planData.approxAreaM2 || 110}
                    onChange={(e) => setPlanData((prev) => ({ ...prev, approxAreaM2: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold text-base focus:ring-2 focus:ring-[#FFAA4F]"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Typical 3-bed house is ~100–120m²</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Number of Habitable Rooms to Renovate
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={planData.roomCount || 5}
                    onChange={(e) => setPlanData((prev) => ({ ...prev, roomCount: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold text-base focus:ring-2 focus:ring-[#FFAA4F]"
                  />
                </div>
              </div>
            )}

            {(planData.projectType === 'kitchen' || planData.projectType === 'bathroom' || planData.projectType === 'loft-conversion' || planData.projectType === 'garage-conversion' || planData.projectType === 'garden-room' || planData.projectType === 'driveway' || planData.projectType === 'landscaping' || planData.projectType === 'other') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Approximate Working Area (m²)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={300}
                    step={1}
                    value={planData.approxAreaM2 || 25}
                    onChange={(e) => setPlanData((prev) => ({ ...prev, approxAreaM2: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold text-base focus:ring-2 focus:ring-[#FFAA4F]"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={planData.isUnknownDimensions}
                  onChange={(e) => setPlanData((prev) => ({ ...prev, isUnknownDimensions: e.target.checked }))}
                  className="rounded border-slate-300 text-[#FFAA4F] focus:ring-[#FFAA4F] h-4 w-4"
                />
                <span className="text-xs text-slate-600 font-medium">
                  I don&apos;t know exact dimensions (use realistic typical project size)
                </span>
              </label>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between">
            <Button type="button" onClick={prevStep} variant="outline" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              variant="primary"
              size="lg"
              className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold px-8 py-3.5"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Continue to Specifications
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: REQUIREMENTS & ADD-ONS (DYNAMICALLY PROJECT-SPECIFIC) */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="text-left">
            <Badge variant="brand" className="mb-2 bg-[#FFAA4F]/20 text-slate-900 border-[#FFAA4F]/40">
              Step 4 • Project Features &amp; Add-ons
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Select specific <span className="capitalize text-[#FFAA4F]">{planData.projectType.replace(/-/g, ' ')}</span> options
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select all features you would like included in your architectural scope.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {(PROJECT_SPECIFIC_ADDONS[planData.projectType] || PROJECT_SPECIFIC_ADDONS.other).map((item) => {
              const isChecked = planData.requirements.includes(item.key);
              return (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => toggleRequirement(item.key)}
                  className={clsx(
                    'p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 cursor-pointer',
                    isChecked
                      ? 'border-[#FFAA4F] bg-amber-50/60 ring-2 ring-[#FFAA4F]/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  )}
                >
                  <div
                    className={clsx(
                      'mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors shrink-0',
                      isChecked ? 'bg-[#FFAA4F] border-[#E69335] text-slate-950' : 'border-slate-300 bg-white'
                    )}
                  >
                    {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-sm font-heading">{item.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {item.description}
                    </div>
                    <div className="text-[11px] font-semibold text-[#FFAA4F] mt-1.5 font-mono">
                      Est. impact: £{item.costLow.toLocaleString()} – £{item.costHigh.toLocaleString()}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-6 flex items-center justify-between">
            <Button type="button" onClick={prevStep} variant="outline" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              variant="primary"
              size="lg"
              className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold px-8 py-3.5"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Continue to Finish Level
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: FINISH LEVEL */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="text-left">
            <Badge variant="brand" className="mb-2 bg-[#FFAA4F]/20 text-slate-900 border-[#FFAA4F]/40">
              Step 5 • Finish Level
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Select your desired finish level
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Material grades, fixtures, and bespoke architectural detailing directly influence your overall project investment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {(Object.entries(FINISH_LEVEL_MULTIPLIERS) as [FinishLevel, typeof FINISH_LEVEL_MULTIPLIERS.standard][]).map(
              ([level, info]) => {
                const isSelected = planData.finishLevel === level;
                return (
                  <button
                    type="button"
                    key={level}
                    onClick={() => setPlanData((prev) => ({ ...prev, finishLevel: level }))}
                    className={clsx(
                      'p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer space-y-4',
                      isSelected
                        ? 'border-[#FFAA4F] bg-amber-50/60 ring-2 ring-[#FFAA4F]/40 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-lg font-heading">{info.label}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-[#FFAA4F] text-slate-950 rounded-md">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
                        {info.description}
                      </p>
                    </div>
                  </button>
                );
              }
            )}
          </div>

          <div className="pt-6 flex items-center justify-between">
            <Button type="button" onClick={prevStep} variant="outline" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              variant="primary"
              size="lg"
              className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold px-8 py-3.5"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Continue to Project Status
            </Button>
          </div>
        </div>
      )}

      {/* STEP 6: PROJECT STATUS */}
      {currentStep === 6 && (
        <div className="space-y-6">
          <div className="text-left">
            <Badge variant="brand" className="mb-2 bg-[#FFAA4F]/20 text-slate-900 border-[#FFAA4F]/40">
              Step 6 • Planning Status
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              What stage are you currently at?
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Whether you need initial design drawings or already have full planning approval, our turnkey team manages every phase.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {STATUS_OPTIONS.map((item) => {
              const isSelected = planData.status === item.status;
              return (
                <button
                  type="button"
                  key={item.status}
                  onClick={() => setPlanData((prev) => ({ ...prev, status: item.status }))}
                  className={clsx(
                    'p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3 cursor-pointer',
                    isSelected
                      ? 'border-[#FFAA4F] bg-amber-50/60 ring-2 ring-[#FFAA4F]/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  )}
                >
                  <div
                    className={clsx(
                      'mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center',
                      isSelected ? 'border-[#FFAA4F] bg-[#FFAA4F]' : 'border-slate-300 bg-white'
                    )}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm font-heading">{item.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-6 flex items-center justify-between">
            <Button type="button" onClick={prevStep} variant="outline" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              variant="primary"
              size="lg"
              className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold px-8 py-3.5"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Continue to Timeline
            </Button>
          </div>
        </div>
      )}

      {/* STEP 7: DESIRED TIMELINE */}
      {currentStep === 7 && (
        <div className="space-y-6">
          <div className="text-left">
            <Badge variant="brand" className="mb-2 bg-[#FFAA4F]/20 text-slate-900 border-[#FFAA4F]/40">
              Step 7 • Construction Timeline
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              When would you ideally like work to begin?
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Help us allocate appropriate project managers and trade availability.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {TIMELINE_OPTIONS.map((item) => {
              const isSelected = planData.timeline === item.timeline;
              return (
                <button
                  type="button"
                  key={item.timeline}
                  onClick={() => setPlanData((prev) => ({ ...prev, timeline: item.timeline }))}
                  className={clsx(
                    'w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer',
                    isSelected
                      ? 'border-[#FFAA4F] bg-amber-50/60 ring-2 ring-[#FFAA4F]/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-bold text-slate-900 text-sm sm:text-base font-heading">{item.label}</span>
                  </div>
                  <div
                    className={clsx(
                      'h-4 w-4 rounded-full border flex items-center justify-center',
                      isSelected ? 'border-[#FFAA4F] bg-[#FFAA4F]' : 'border-slate-300 bg-white'
                    )}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-6 flex items-center justify-between">
            <Button type="button" onClick={prevStep} variant="outline" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              variant="primary"
              size="lg"
              className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold px-8 py-3.5"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Continue to Budget Range
            </Button>
          </div>
        </div>
      )}

      {/* STEP 8: BUDGET RANGE */}
      {currentStep === 8 && (
        <div className="space-y-6">
          <div className="text-left">
            <Badge variant="brand" className="mb-2 bg-[#FFAA4F]/20 text-slate-900 border-[#FFAA4F]/40">
              Step 8 • Target Budget
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              What is your approximate budget target?
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              We compare your budget against live trade material indices to optimize structural solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {BUDGET_OPTIONS.map((item) => {
              const isSelected = planData.budgetRange === item.budget;
              return (
                <button
                  type="button"
                  key={item.budget}
                  onClick={() => setPlanData((prev) => ({ ...prev, budgetRange: item.budget }))}
                  className={clsx(
                    'p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer',
                    isSelected
                      ? 'border-[#FFAA4F] bg-amber-50/60 ring-2 ring-[#FFAA4F]/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  )}
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base font-heading">{item.label}</span>
                  <div
                    className={clsx(
                      'h-4 w-4 rounded-full border flex items-center justify-center',
                      isSelected ? 'border-[#FFAA4F] bg-[#FFAA4F]' : 'border-slate-300 bg-white'
                    )}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-6 flex items-center justify-between">
            <Button type="button" onClick={prevStep} variant="outline" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              variant="primary"
              size="lg"
              className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold px-9 py-4 shadow-xl"
              rightIcon={<Sparkles className="h-5 w-5" />}
            >
              Generate Project Estimate &amp; Plan →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 9: ESTIMATE RESULTS VIEW (CUSTOMER-FIRST!) */}
      {currentStep === 9 && estimate && (
        <div className="space-y-10 text-left animate-fadeIn">
          {/* Top Banner with Indicative Range */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 architectural-grid opacity-15 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold px-3 py-1 text-xs">
                  {estimate.projectTitle}
                </Badge>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#FFAA4F]" />
                  <span>Est. Duration: <strong>{estimate.estimatedDurationWeeksMin}–{estimate.estimatedDurationWeeksMax} Weeks</strong></span>
                </div>
              </div>

              <div>
                <div className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-400">
                  Indicative Project Range (London &amp; SE)
                </div>
                <div className="text-3xl sm:text-5xl lg:text-6xl font-bold font-heading text-white mt-1 tabular-numbers">
                  £{estimate.indicativeCostLow.toLocaleString()}{' '}
                  <span className="text-[#FFAA4F] font-normal text-2xl sm:text-4xl">–</span>{' '}
                  £{estimate.indicativeCostHigh.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Includes 10% Contingency (£{estimate.contingencyAllowance.toLocaleString()}) &amp; Turnkey Management</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <Button
                  type="button"
                  onClick={() => {
                    setBookingType('consultation');
                    setBookingModalOpen(true);
                  }}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-base px-8 py-4 shadow-xl"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Book Free Project Consultation
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setBookingType('callback');
                    setBookingModalOpen(true);
                  }}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-white bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-sm font-semibold px-6 py-4"
                  leftIcon={<Phone className="h-4 w-4 text-[#FFAA4F]" />}
                >
                  Request a Callback
                </Button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-slate-400 hover:text-white underline underline-offset-4 ml-auto pt-2 sm:pt-0"
                >
                  Edit Specifications
                </button>
              </div>
            </div>
          </div>

          {/* Submission Success Notice (if submitted) */}
          {submissionSuccess && (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold font-heading text-lg text-emerald-900">
                  Consultation Request Confirmed!
                </h3>
                <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                  Thank you! Your project plan has been registered under Reference{' '}
                  <strong className="underline">{submissionSuccess.referenceCode}</strong>. A Senior Estimator will review your specifications and contact you shortly.
                </p>
              </div>
            </div>
          )}

          {/* Itemized Cost Category Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                Itemized Cost Category Breakdown
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Standard RICS trade distribution based on your {planData.finishLevel} finish specification.
              </p>
            </div>

            <div className="space-y-4">
              {estimate.breakdown.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm font-heading">{item.category}</span>
                    <span className="font-bold text-slate-900 text-sm tabular-numbers">
                      £{item.lowCost.toLocaleString()} – £{item.highCost.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{item.description}</p>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FFAA4F] rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8-Stage Visual Project Timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                Step-by-Step Delivery Process
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                How ST Contractors manages your build from initial architectural survey to certified handover.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {estimate.timelineStages.map((stage) => (
                <div key={stage.stageNumber} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider">
                      Stage {stage.stageNumber} • {stage.durationWeeks}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm font-heading">{stage.name}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{stage.description}</p>
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {stage.deliverables.map((del, dIdx) => (
                      <span key={dIdx} className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        ✓ {del}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Conversion Strip */}
          <div className="p-8 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-bold text-slate-900 font-heading">
                Want our master builders to review your project?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Book a free architectural survey or request a direct callback to discuss your drawings.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                onClick={() => {
                  setBookingType('consultation');
                  setBookingModalOpen(true);
                }}
                variant="primary"
                size="md"
                className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold"
              >
                Book Free Consultation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* BOOKING MODAL (POPUP) */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto text-left relative">
            <button
              type="button"
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-lg p-2"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="space-y-1">
              <Badge variant="brand" className="bg-[#FFAA4F]/20 text-slate-900 border-[#FFAA4F]/40">
                {bookingType === 'consultation'
                  ? 'Free Architectural Consultation'
                  : bookingType === 'site_visit'
                  ? 'Book Site Survey'
                  : 'Request a Direct Callback'}
              </Badge>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                {bookingType === 'callback' ? 'Request Senior Estimator Call' : 'Book Your Free Project Consultation'}
              </h3>
              <p className="text-xs text-slate-500">
                Your online plan specifications ({planData.projectType.toUpperCase()} • {planData.postcode.toUpperCase()}) will be attached automatically.
              </p>
            </div>

            {submitError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {submitError}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4 mt-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="David"
                    value={contactForm.firstName}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#FFAA4F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Miller"
                    value={contactForm.lastName}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#FFAA4F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="david@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#FFAA4F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="07700 900123"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#FFAA4F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Contact</label>
                  <select
                    value={contactForm.preferredContactMethod}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, preferredContactMethod: e.target.value as 'phone' | 'email' }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#FFAA4F]"
                  >
                    <option value="phone">Phone Call</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time</label>
                  <select
                    value={contactForm.requestedTimeSlot}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, requestedTimeSlot: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#FFAA4F]"
                  >
                    <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                    <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Any specific architectural requests, drawings links, or structural details..."
                  value={contactForm.notes}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#FFAA4F]"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  size="lg"
                  className="w-full bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold py-3.5 justify-center shadow-lg"
                  rightIcon={submitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                >
                  {submitting ? 'Registering Project...' : 'Confirm Consultation Booking →'}
                </Button>
              </div>

              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>100% Free &amp; Confidential • Direct Contractor Consultation</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
