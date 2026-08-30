'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ComprehensivePlannerInput,
  ProjectScopeItem,
  RecommendedWorkItem,
  FullProjectQuoteEstimate,
  WorkCategory,
} from '@/lib/ai/types';
import { calculateFullRoomQuote } from '@/lib/pricing/room-estimator';
import { generateProjectSummary, generateBudgetOptimizationOptions, BudgetOptimizationOption } from '@/lib/ai/planner';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import {
  Check,
  CheckCircle2,
  Clock,
  PoundSterling,
  AlertTriangle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  Send,
  RefreshCw,
  ShieldCheck,
  HelpCircle,
  Layers,
  Building,
  Info,
  Sliders,
  FileText,
} from 'lucide-react';
import { clsx } from 'clsx';
import { updateActiveProjectProfile } from '@/lib/planner/project-sync';
import { trackEvent } from '@/lib/analytics';

interface QuoteConfiguratorProps {
  initialInput: ComprehensivePlannerInput;
  initialScopeItems: ProjectScopeItem[];
  initialRecommendations: RecommendedWorkItem[];
  answers?: Record<string, any>;
  onBackToWizard: () => void;
}

export const QuoteConfigurator: React.FC<QuoteConfiguratorProps> = ({
  initialInput,
  initialScopeItems,
  initialRecommendations,
  answers = {},
  onBackToWizard,
}) => {
  const [inputData, setInputData] = useState<ComprehensivePlannerInput>(initialInput);
  const [scopeItems, setScopeItems] = useState<ProjectScopeItem[]>(initialScopeItems);
  const [recommendations, setRecommendations] = useState<RecommendedWorkItem[]>(initialRecommendations);
  const [estimate, setEstimate] = useState<FullProjectQuoteEstimate>(() =>
    calculateFullRoomQuote(initialInput, initialScopeItems, initialRecommendations)
  );

  const customerProjectSummary = generateProjectSummary(inputData, answers);

  // Active accordion tabs (all closed initially)
  const [openRooms, setOpenRooms] = useState<Record<string, boolean>>({});

  // Custom Item Input state per room
  const [customItemText, setCustomItemText] = useState<Record<string, string>>({});
  const [isAddingCustom, setIsAddingCustom] = useState<Record<string, boolean>>({});

  // Breakdown view mode (by room vs by trade category)
  const [breakdownMode, setBreakdownMode] = useState<'room' | 'category'>('room');

  // Booking & Budget Modal States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [budgetOptimizerOpen, setBudgetOptimizerOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'consultation' | 'callback' | 'save'>('consultation');
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredContactMethod: 'phone' as 'phone' | 'email',
    preferredDay: 'As soon as convenient',
    requestedTimeSlot: 'Morning (9:00 AM - 12:00 PM)',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceCode: string;
    leadId: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open so background does not shift
  useEffect(() => {
    if (bookingModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [bookingModalOpen]);

  // Recalculate quote whenever items or recommendations change
  useEffect(() => {
    const newEst = calculateFullRoomQuote(inputData, scopeItems, recommendations);
    setEstimate(newEst);
  }, [scopeItems, recommendations, inputData]);

  // Toggle item selected state
  const toggleItem = (itemId: string) => {
    setScopeItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, selected: !item.selected } : item))
    );
  };

  // Toggle room accordion
  const toggleRoomAccordion = (roomName: string) => {
    setOpenRooms((prev) => ({ ...prev, [roomName]: !prev[roomName] }));
  };

  // Accept Recommendation
  const acceptRecommendation = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, status: 'accepted' } : r))
    );
  };

  // Dismiss Recommendation
  const dismissRecommendation = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, status: 'dismissed' } : r))
    );
  };

  // Add Custom User Item into a room
  const handleAddCustomItem = async (areaName: string) => {
    const text = customItemText[areaName]?.trim();
    if (!text) return;

    setIsAddingCustom((prev) => ({ ...prev, [areaName]: true }));

    try {
      const res = await fetch('/api/planner/custom-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          areaName,
          finishLevel: inputData.finishLevel,
        }),
      });
      const data = await res.json();
      if (res.ok && data.item) {
        setScopeItems((prev) => [...prev, data.item]);
        setCustomItemText((prev) => ({ ...prev, [areaName]: '' }));
      }
    } catch (err) {
      console.error('Error adding custom item:', err);
    } finally {
      setIsAddingCustom((prev) => ({ ...prev, [areaName]: false }));
    }
  };

  // Save Estimate to Customer Account (Value First)
  const handleSaveToAccount = async () => {
    try {
      const checkAuth = await fetch('/api/customer/auth/me');
      const authData = await checkAuth.json();
      if (authData.authenticated) {
        const res = await fetch('/api/customer/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inputData,
            scopeItems,
            recommendations,
            estimateResult: estimate,
          }),
        });
        if (res.ok) {
          window.location.href = '/portal/projects';
          return;
        }
      }
    } catch (e) {
      // ignore
    }

    // Save pending estimate to session storage and route to register
    sessionStorage.setItem(
      'pending_saved_project',
      JSON.stringify({
        title: `${inputData.postcode || 'London'} ${inputData.projectType.toUpperCase()} Estimate`,
        inputData,
        scopeItems,
        recommendations,
        estimateResult: estimate,
      })
    );
    window.location.href = '/portal/register';
  };

  // Submit Lead & Consultation / Callback
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputData,
          scopeItems,
          recommendations,
          contact: {
            ...contactForm,
            consultationType: bookingType === 'callback' ? 'callback' : 'consultation',
          },
          source: 'AI Typeform Quote Configurator',
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit consultation request');
      }

      setSubmissionSuccess({
        referenceCode: data.referenceCode,
        leadId: data.leadId,
      });
      setBookingModalOpen(false);

      try {
        updateActiveProjectProfile({
          professionalReviewRequested: true,
          leadId: data.leadId,
          referenceCode: data.referenceCode,
          contactDetails: {
            name: `${contactForm.firstName} ${contactForm.lastName}`.trim(),
            email: contactForm.email,
            phone: contactForm.phone,
            preferredContactMethod: contactForm.preferredContactMethod,
            requestedConsultationDate: contactForm.preferredDay,
            requestedTimeSlot: contactForm.requestedTimeSlot,
          },
        });
        trackEvent('professional_review_requested', {
          referenceCode: data.referenceCode,
          leadId: data.leadId,
          projectType: inputData.projectType,
          estimatedTotal: estimate.averageCost,
        });
      } catch (e) {
        // safe fallback
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Group items by room and category
  const roomNames = Array.from(new Set(scopeItems.map((i) => i.areaName)));

  return (
    <div className="space-y-10 text-left animate-fadeIn">
      {/* 1. TOP ESTIMATE HERO BANNER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 architectural-grid opacity-15 pointer-events-none" />
        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold text-xs px-3 py-1">
                {estimate.projectTitle}
              </Badge>
              <span className="text-xs text-slate-400 font-medium">
                {inputData.selectedAreas.length} {inputData.selectedAreas.length === 1 ? 'Area' : 'Areas'} • {inputData.finishLevel} finish
              </span>
              {inputData.postcode && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  📍 {inputData.postcode}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Clock className="h-4 w-4 text-[#FFAA4F]" />
              <span>Est. Duration: <strong className="text-white">{estimate.durationWeeksMin}–{estimate.durationWeeksMax} Weeks</strong></span>
            </div>
          </div>

          {/* Custom Inclusions Pill Strip */}
          {((inputData.glazingChoices && inputData.glazingChoices.length > 0) ||
            (inputData.structuralFeatures && inputData.structuralFeatures.length > 0) ||
            (inputData.interiorSpecialties && inputData.interiorSpecialties.length > 0) ||
            (inputData.heatingElectrics && inputData.heatingElectrics.length > 0) ||
            (inputData.externalFinishes && inputData.externalFinishes.length > 0)) && (
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="text-[11px] font-bold text-[#FFAA4F] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Your Custom Inclusions Included in this Estimate:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {inputData.glazingChoices?.map((g) => (
                  <span key={g} className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-200 border border-slate-700 text-xs font-medium">
                    🪟 {g.replace(/_/g, ' ')}
                  </span>
                ))}
                {inputData.structuralFeatures?.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-200 border border-slate-700 text-xs font-medium">
                    🏗️ {s.replace(/_/g, ' ')}
                  </span>
                ))}
                {inputData.interiorSpecialties?.map((i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-200 border border-slate-700 text-xs font-medium">
                    ✨ {i.replace(/_/g, ' ')}
                  </span>
                ))}
                {inputData.heatingElectrics?.map((h) => (
                  <span key={h} className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-200 border border-slate-700 text-xs font-medium">
                    ♨️ {h.replace(/_/g, ' ')}
                  </span>
                ))}
                {inputData.externalFinishes?.map((e) => (
                  <span key={e} className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-200 border border-slate-700 text-xs font-medium">
                    🌿 {e.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Large Indicative Range */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span>Estimated Project Cost Range</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                Accuracy: {estimate.confidenceRating}
              </span>
            </div>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-bold font-heading text-white mt-1 tabular-numbers">
              £{estimate.indicativeCostLow.toLocaleString()}{' '}
              <span className="text-[#FFAA4F] font-normal text-2xl sm:text-4xl">–</span>{' '}
              £{estimate.indicativeCostHigh.toLocaleString()}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              This is an initial planning estimate based on your selected room specifications. Ticking or unticking items below updates this range live.
            </p>
          </div>

          {/* Development Pricing Notice per BUILD_SPEC.md Section 41 */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-400 flex items-center gap-2">
            <Info className="h-4 w-4 text-[#FFAA4F] shrink-0" />
            <span>
              <strong>DEMO ESTIMATE:</strong> Development benchmark pricing for initial feasibility scoping. A formal fixed-price quotation is provided following an on-site architectural survey.
            </span>
          </div>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button
              type="button"
              onClick={() => {
                setBookingType('consultation');
                setBookingModalOpen(true);
              }}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-sm sm:text-base px-8 py-4 shadow-xl"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Book Free Project Consultation
            </Button>
            <Button
              type="button"
              onClick={() => setBudgetOptimizerOpen(true)}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 text-xs sm:text-sm font-bold px-6 py-4"
              leftIcon={<PoundSterling className="h-4 w-4 text-emerald-400" />}
            >
              AI Budget Optimizer ✨
            </Button>
            <Button
              type="button"
              onClick={handleSaveToAccount}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-[#FFAA4F] bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 text-xs sm:text-sm font-bold px-6 py-4"
              leftIcon={<Sparkles className="h-4 w-4 text-[#FFAA4F]" />}
            >
              Save Estimate to My Account
            </Button>
            <Button
              type="button"
              onClick={() => {
                setBookingType('callback');
                setBookingModalOpen(true);
              }}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-white bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-xs sm:text-sm font-semibold px-6 py-4"
              leftIcon={<Phone className="h-4 w-4 text-[#FFAA4F]" />}
            >
              Request a Callback
            </Button>
            <button
              type="button"
              onClick={onBackToWizard}
              className="text-xs text-slate-400 hover:text-white underline underline-offset-4 ml-auto pt-2 sm:pt-0"
            >
              ← Edit Answers in Questionnaire
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Banner if Form Submitted */}
      {submissionSuccess && (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-4 shadow-md">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold font-heading text-lg text-emerald-900">
              Project Plan &amp; Consultation Request Saved!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
              Your room-by-room scope has been registered under Project Reference{' '}
              <strong className="font-mono underline">{submissionSuccess.referenceCode}</strong>. A Senior Estimator will review your specifications and contact you at your preferred time.
            </p>
          </div>
        </div>
      )}

      {/* 2. WHAT YOU ASKED FOR (Summary of Customer Specifications) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-500" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
            What You Asked For
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {customerProjectSummary}
        </p>
      </div>

      {/* 3. RECOMMENDED WORK SECTION (BUILD_SPEC.md Section 14) */}
      {recommendations.some((r) => r.status === 'suggested') && (
        <div className="bg-amber-50/80 rounded-3xl p-6 sm:p-8 border border-amber-200/90 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FFAA4F]" />
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              You may also want to consider
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Based on your property age and project requirements, our estimators recommend considering these additional items:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {recommendations
              .filter((r) => r.status === 'suggested')
              .map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm font-heading">{rec.title}</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        £{rec.costLow.toLocaleString()} – £{rec.costHigh.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rec.reason}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => acceptRecommendation(rec.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add to Project</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => dismissRecommendation(rec.id)}
                      className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-600 text-xs font-semibold"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. ROOM-BY-ROOM EDITABLE SCOPE CHECKLIST */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Room-by-Room Project Scope
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any item to include or exclude it from your estimated scope.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            {scopeItems.filter((i) => i.selected).length} of {scopeItems.length} items active
          </span>
        </div>

        {/* Room Accordion Cards */}
        {roomNames.map((roomName) => {
          const roomItems = scopeItems.filter((i) => i.areaName === roomName);
          const activeRoomItems = roomItems.filter((i) => i.selected);
          const isOpen = Boolean(openRooms[roomName]);

          // Group by work category
          const categories: WorkCategory[] = Array.from(
            new Set(roomItems.map((i) => i.category))
          ) as WorkCategory[];

          return (
            <div
              key={roomName}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              {/* Room Accordion Header */}
              <button
                type="button"
                onClick={() => toggleRoomAccordion(roomName)}
                className={clsx(
                  'w-full p-5 sm:p-6 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-left transition-colors cursor-pointer',
                  isOpen && 'border-b border-slate-200/80'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#FFAA4F]">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base sm:text-lg font-heading">
                      {roomName}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {activeRoomItems.length} jobs selected
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono">
                    £{activeRoomItems.reduce((a, b) => a + b.costLow, 0).toLocaleString()} – £
                    {activeRoomItems.reduce((a, b) => a + b.costHigh, 0).toLocaleString()}
                  </span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </div>
              </button>

              {/* Room Accordion Content */}
              {isOpen && (
                <div className="p-5 sm:p-8 space-y-6">
                  {categories.map((cat) => {
                    const catItems = roomItems.filter((i) => i.category === cat);
                    return (
                      <div key={cat} className="space-y-2.5">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {cat}
                        </div>
                        <div className="space-y-2">
                          {catItems.map((item) => (
                            <button
                              type="button"
                              key={item.id}
                              onClick={() => toggleItem(item.id)}
                              className={clsx(
                                'w-full p-3.5 rounded-2xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer',
                                item.selected
                                  ? 'border-[#FFAA4F] bg-amber-50/40 shadow-2xs'
                                  : 'border-slate-200/80 bg-white opacity-60 hover:opacity-100 hover:border-slate-300'
                              )}
                            >
                              <div
                                className={clsx(
                                  'mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition-colors shrink-0',
                                  item.selected
                                    ? 'bg-[#FFAA4F] border-[#E69335] text-slate-950'
                                    : 'border-slate-300 bg-white'
                                )}
                              >
                                {item.selected && <Check className="h-3 w-3 stroke-[3]" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className={clsx(
                                      'text-xs sm:text-sm font-bold',
                                      item.selected ? 'text-slate-900 font-heading' : 'text-slate-500 line-through'
                                    )}
                                  >
                                    {item.name}
                                  </span>
                                  <span className="text-xs font-bold text-slate-700 font-mono shrink-0">
                                    {item.pricingStatus === 'requires_review' ? (
                                      <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                                        Price requires review
                                      </span>
                                    ) : (
                                      `£${item.costLow.toLocaleString()} – £${item.costHigh.toLocaleString()}`
                                    )}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* + Add Something Else Input in Room (BUILD_SPEC.md Section 16) */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      + Add custom work to {roomName}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Build fitted bench under the window with storage underneath..."
                        value={customItemText[roomName] || ''}
                        onChange={(e) =>
                          setCustomItemText((prev) => ({ ...prev, [roomName]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomItem(roomName);
                          }
                        }}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustomItem(roomName)}
                        disabled={isAddingCustom[roomName] || !customItemText[roomName]?.trim()}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 text-xs font-bold transition-colors"
                      >
                        {isAddingCustom[roomName] ? 'Adding...' : 'Add Work +'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. ESTIMATE BREAKDOWN TABLE & TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Cost Breakdown
            </h4>
            <div className="flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setBreakdownMode('room')}
                className={clsx(
                  'px-2.5 py-1 rounded-md transition-colors',
                  breakdownMode === 'room' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                )}
              >
                By Room
              </button>
              <button
                type="button"
                onClick={() => setBreakdownMode('category')}
                className={clsx(
                  'px-2.5 py-1 rounded-md transition-colors',
                  breakdownMode === 'category' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                )}
              >
                By Trade
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {breakdownMode === 'room'
              ? estimate.roomBreakdowns.map((rb) => (
                  <div key={rb.areaName} className="p-3 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-200/80">
                    <span className="font-semibold text-slate-800">{rb.areaName} ({rb.itemCount} items)</span>
                    <span className="font-bold text-slate-900 font-mono">
                      £{rb.costLow.toLocaleString()} – £{rb.costHigh.toLocaleString()}
                    </span>
                  </div>
                ))
              : estimate.categoryBreakdowns.map((cb) => (
                  <div key={cb.category} className="p-3 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-200/80">
                    <span className="font-semibold text-slate-800">{cb.category}</span>
                    <span className="font-bold text-slate-900 font-mono">
                      £{cb.costLow.toLocaleString()} – £{cb.costHigh.toLocaleString()} ({cb.percentage}%)
                    </span>
                  </div>
                ))}
          </div>
        </div>

        {/* High-Level Delivery Timeline (BUILD_SPEC.md Section 21) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Project Delivery Schedule
            </h4>
            <span className="text-xs font-bold text-[#FFAA4F]">
              Total: {estimate.durationWeeksMin}–{estimate.durationWeeksMax} Weeks
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {estimate.timelinePhases.map((phase) => (
              <div key={phase.phaseNumber} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    {phase.phaseNumber}. {phase.name}
                  </span>
                  <span className="text-[11px] font-semibold text-[#FFAA4F]">{phase.duration}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. THINGS THAT MAY NEED CONFIRMING (BUILD_SPEC.md Section 20) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-slate-500" />
          <h4 className="font-bold text-slate-900 text-sm font-heading">
            Things that may need confirming during a site visit
          </h4>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600">
          {estimate.thingsToConfirm.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#FFAA4F] font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 6. BOTTOM CONVERSION BANNER */}
      <div className="p-8 sm:p-10 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div>
          <h4 className="text-xl font-bold text-slate-900 font-heading">
            Ready to discuss your project?
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Our building team will review your room-by-room scope and conduct a free on-site feasibility survey.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            onClick={handleSaveToAccount}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-sm px-6 py-3.5"
            leftIcon={<Sparkles className="h-4 w-4 text-[#FFAA4F]" />}
          >
            Save to My Account
          </Button>
          <Button
            type="button"
            onClick={() => {
              setBookingType('consultation');
              setBookingModalOpen(true);
            }}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-sm px-7 py-3.5"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Book Free Project Consultation
          </Button>
        </div>
      </div>

      {/* 7. BOOKING & SAVE MODAL (PORTALED DIRECTLY TO BODY FOR VIEWPORT CENTERING) */}
      {mounted && typeof document !== 'undefined' && bookingModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto text-left relative my-auto">
            <button
              type="button"
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-lg p-2"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <Badge variant="brand" className="bg-[#FFAA4F]/20 text-slate-900 border-[#FFAA4F]/40 font-bold">
                {bookingType === 'callback' ? '📞 Free Callback Request' : '🏛️ Free Project Consultation'}
              </Badge>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                {bookingType === 'callback' ? 'Request a Callback from Our Estimator' : 'Book Your Free Project Consultation'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {bookingType === 'callback'
                  ? `Our senior building estimator will call you to discuss your indicative estimate (£${estimate.indicativeCostLow.toLocaleString()} – £${estimate.indicativeCostHigh.toLocaleString()}) and answer any technical questions.`
                  : `Your full room-by-room specification (${scopeItems.filter((i) => i.selected).length} items • ${estimate.projectTitle}) will be attached automatically.`}
              </p>
            </div>

            {submitError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {submitError}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4 mt-5">
              {/* When booking callback: prominent time slot picker first per Section 26 */}
              {bookingType === 'callback' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    When is the best time to call?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { slot: 'Morning (9:00 AM - 12:00 PM)', label: 'Morning', time: '9:00 AM – 12:00 PM', icon: '🌅' },
                      { slot: 'Afternoon (12:00 PM - 4:00 PM)', label: 'Afternoon', time: '12:00 PM – 4:00 PM', icon: '☀️' },
                      { slot: 'Evening (4:00 PM - 7:00 PM)', label: 'Evening', time: '4:00 PM – 7:00 PM', icon: '🌙' },
                      { slot: 'Anytime', label: 'Anytime / ASAP', time: 'First available agent', icon: '⚡' },
                    ].map((item) => {
                      const isSelected = contactForm.requestedTimeSlot === item.slot;
                      return (
                        <button
                          type="button"
                          key={item.slot}
                          onClick={() => setContactForm((prev) => ({ ...prev, requestedTimeSlot: item.slot }))}
                          className={clsx(
                            'p-3 rounded-xl border text-left transition-all cursor-pointer',
                            isSelected
                              ? 'border-[#FFAA4F] bg-amber-50/80 ring-2 ring-[#FFAA4F]/40 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          )}
                        >
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{item.time}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="David"
                    value={contactForm.firstName}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-[#FFAA4F]"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-[#FFAA4F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telephone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="07700 900123"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-[#FFAA4F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address {bookingType === 'callback' ? '(Optional)' : '*'}
                  </label>
                  <input
                    type="email"
                    required={bookingType !== 'callback'}
                    placeholder="david@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-[#FFAA4F]"
                  />
                </div>
              </div>

              {bookingType === 'consultation' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Contact</label>
                    <select
                      value={contactForm.preferredContactMethod}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          preferredContactMethod: e.target.value as 'phone' | 'email',
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-[#FFAA4F]"
                    >
                      <option value="phone">Phone Call</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time Slot</label>
                    <select
                      value={contactForm.requestedTimeSlot}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, requestedTimeSlot: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-[#FFAA4F]"
                    >
                      <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                      <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                      <option value="Anytime">Anytime</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {bookingType === 'callback' ? 'Questions or Project Notes (Optional)' : 'Additional Project Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    bookingType === 'callback'
                      ? "Any questions about your estimate, structural knockthroughs, or planning..."
                      : "Any particular drawings links, site access information, or special requests..."
                  }
                  value={contactForm.notes}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-[#FFAA4F]"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  size="lg"
                  className="w-full bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold py-3.5 justify-center shadow-lg text-sm sm:text-base"
                  rightIcon={submitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                >
                  {submitting
                    ? 'Processing...'
                    : bookingType === 'callback'
                    ? 'Request Callback Now 📞'
                    : 'Confirm Consultation Request →'}
                </Button>
              </div>

              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>100% Free &amp; Confidential • Direct Senior Estimator Review</span>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 8. BUDGET OPTIMIZER MODAL */}
      {mounted && budgetOptimizerOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-6 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <Badge variant="brand" className="bg-emerald-100 text-emerald-900 font-bold text-xs mb-1">
                  AI Commercial Engineering
                </Badge>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                  Safe Budget Optimization Options
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBudgetOptimizerOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Below are verified commercial trade-offs evaluated by our quantity surveyors. Each option reduces upfront capital outlay <strong>without compromising structural safety, waterproofing, or Building Control compliance</strong>.
            </p>

            <div className="space-y-4">
              {generateBudgetOptimizationOptions(inputData, estimate.averageCost).map((opt) => (
                <div key={opt.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900 font-heading">{opt.title}</h4>
                    <Badge variant="brand" className="bg-emerald-600 text-white font-extrabold text-xs">
                      Save £{opt.estimatedSavingMinGbp.toLocaleString()} – £{opt.estimatedSavingMaxGbp.toLocaleString()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{opt.tradeOffDescription}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100 space-y-1">
                      <strong className="block text-[10px] uppercase font-bold text-emerald-800">Key Advantages:</strong>
                      <ul className="list-disc list-inside space-y-0.5">
                        {opt.pros.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-100 space-y-1">
                      <strong className="block text-[10px] uppercase font-bold text-amber-800">Trade-offs to consider:</strong>
                      <ul className="list-disc list-inside space-y-0.5">
                        {opt.cons.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold pt-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>100% Building Regulations &amp; Structural Safety Guaranteed</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Want our estimating director to customize these options for your property?
              </span>
              <Button
                onClick={() => {
                  setBudgetOptimizerOpen(false);
                  setBookingType('consultation');
                  setBookingModalOpen(true);
                }}
                variant="primary"
                size="sm"
                className="font-bold text-xs bg-[#FFAA4F] text-slate-950"
              >
                Discuss on Free Consultation
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
