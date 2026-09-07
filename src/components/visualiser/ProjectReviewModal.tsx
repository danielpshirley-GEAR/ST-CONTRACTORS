'use client';

import React, { useState } from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Phone,
  Mail,
  MessageSquare,
  FileCheck2,
  Lock,
} from 'lucide-react';

interface ProjectReviewModalProps {
  state: ProjectState;
  isOpen: boolean;
  onClose: () => void;
  onExportBrief?: () => void;
  ctaTitle?: string;
}

export function ProjectReviewModal({
  state,
  isOpen,
  onClose,
  onExportBrief,
  ctaTitle = 'Get My Project Reviewed',
}: ProjectReviewModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredMethod, setPreferredMethod] = useState<'phone' | 'email' | 'whatsapp'>('phone');
  const [postcode, setPostcode] = useState(state.property?.location?.value || '');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [nextStepText, setNextStepText] = useState('');

  if (!isOpen) return null;

  const totalArea = state.spaces.reduce((acc, s) => acc + (s.areaM2?.value || 0), 0);
  const projectTypesStr = state.projectTypes.map((t) => t.replace(/_/g, ' ')).join(' + ');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMessage('Please confirm consent to be contacted regarding your project.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/leads/visualiser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            preferredContactMethod: preferredMethod,
            postcode: postcode.trim() || undefined,
            message: message.trim() || undefined,
            consent,
          },
          state,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit project review request.');
      }

      setReferenceCode(data.referenceCode);
      setNextStepText(data.nextStep || 'A senior estimator will contact you within 24 business hours.');
      setStatus('success');

      trackEvent('consultation_submitted', {
        referenceCode: data.referenceCode,
        projectType: projectTypesStr,
        spaceCount: state.spaces.length,
        totalArea,
        finishTier: state.selectedFinishTier,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-extrabold text-[11px] px-3 py-1 mb-3">
            Zero Re-Entry Handoff
          </Badge>

          <h3 className="text-xl sm:text-2xl font-bold font-heading leading-tight text-white">
            {status === 'success' ? 'Project Plan Received' : ctaTitle}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {status === 'success'
              ? 'Your project plan and full scope of works have been lodged with ST Contractors.'
              : 'Our senior estimating team will review your specifications, check structural feasibility, and prepare an itemized fixed schedule of works.'}
          </p>

          {/* Project Summary Pill in Header */}
          {status !== 'success' && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="font-semibold text-white capitalize">{projectTypesStr}</span>
              {totalArea > 0 && <span>• {totalArea}m²</span>}
              <span>• {state.selectedFinishTier || 'enhanced'} finish</span>
              <span>• {state.scopeOfWorks?.length || 0} scope items</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {status === 'success' ? (
            <div className="space-y-6 text-center py-4">
              <div className="h-16 w-16 bg-emerald-100 border border-emerald-300 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900 font-heading">
                  Reference: <span className="font-mono text-amber-600">{referenceCode}</span>
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  {nextStepText}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>What happens next?</span>
                </div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-500">
                  <li>Senior surveyor conducts desktop feasibility check</li>
                  <li>We confirm structural steel requirements &amp; Thames Water build-overs</li>
                  <li>We contact you to schedule an on-site feasibility measure</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {onExportBrief && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onExportBrief}
                    className="flex-1 text-xs font-bold flex items-center justify-center gap-2 border-slate-300"
                  >
                    <FileCheck2 className="h-4 w-4 text-amber-600" />
                    <span>Download Builder Brief PDF</span>
                  </Button>
                )}
                <Button
                  type="button"
                  variant="primary"
                  onClick={onClose}
                  className="flex-1 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Return to Visualiser
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {status === 'error' && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Full Name <span className="text-[#FFAA4F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Telephone Number <span className="text-[#FFAA4F]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 07700 900123"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-[#FFAA4F]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah@example.co.uk"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Property Postcode
                  </label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="e.g. SW19, W5, TW9..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'phone', label: 'Phone Call', icon: Phone },
                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                    { id: 'email', label: 'Email', icon: Mail },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = preferredMethod === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPreferredMethod(item.id as any)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Additional Notes or Timing (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Planning permission is already granted; hoping to start groundworks in 2 months..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Zero Re-entry Notice & Consent */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-2.5">
                  <input
                    id="consent-check"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 mt-0.5"
                  />
                  <label htmlFor="consent-check" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                    I agree for ST Contractors to review my attached project plan, contact me regarding my enquiry, and store my project specifications. We never sell your data.
                  </label>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Lock className="h-3 w-3 text-slate-400" />
                  <span>256-bit encrypted • Direct to ST Contractors Estimating Team • No Spam</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={status === 'submitting'}
                  disabled={status === 'submitting'}
                  className="w-full justify-center text-sm font-extrabold bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335] shadow-md py-3.5"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {status === 'submitting' ? 'Submitting Scope...' : 'Submit Scope for Review'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
