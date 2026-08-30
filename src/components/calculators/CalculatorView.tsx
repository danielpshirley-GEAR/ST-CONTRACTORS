'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorDefinition } from '@/lib/calculators/types';
import { getCalculatorBySlug } from '@/lib/calculators/registry';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import {
  Calculator,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  Building,
  Phone,
  AlertTriangle,
  FileCheck2,
  Compass,
  ArrowUpRight,
  Flame,
  Calendar,
} from 'lucide-react';
import { clsx } from 'clsx';
import { CalculatorConsultationModal } from './CalculatorConsultationModal';
import { syncCalculatorToProjectProfile } from '@/lib/planner/project-sync';
import { trackEvent } from '@/lib/analytics';

interface CalculatorViewProps {
  slug: string;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({ slug }) => {
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) {
    return null;
  }

  // Initialize input state with default values
  const [formInputs, setFormInputs] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    calculator.inputs.forEach((inp) => {
      defaults[inp.id] = inp.defaultValue;
    });
    return defaults;
  });

  const [wastePercent, setWastePercent] = useState<number>(calculator.defaultWastePercent);
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true });

  // Compute results live whenever inputs or waste changes
  const calculationResult = useMemo(() => {
    return calculator.calculate(formInputs, wastePercent);
  }, [calculator, formInputs, wastePercent]);

  // Compute pricing estimate
  const pricingResult = useMemo(() => {
    if (calculationResult.pricing) return calculationResult.pricing;
    if (calculator.pricingEstimate) {
      return calculator.pricingEstimate(calculationResult, formInputs);
    }
    return undefined;
  }, [calculator, calculationResult, formInputs]);

  // Sync to Unified Project Profile on calculation changes
  useEffect(() => {
    try {
      syncCalculatorToProjectProfile({
        calculatorSlug: slug,
        calculatorTitle: calculator.name,
        category: calculator.category,
        inputs: formInputs,
        outputs: {
          primaryQuantity: `${calculationResult.formattedPrimary || calculationResult.primaryValue.toLocaleString()} ${calculationResult.primaryUnit}`,
          unit: calculationResult.primaryUnit,
          lowGbp: pricingResult?.totalCostLow,
          highGbp: pricingResult?.totalCostHigh,
        },
      });
      trackEvent('calculator_completed', {
        calculatorSlug: slug,
        calculatorTitle: calculator.name,
        primaryValue: calculationResult.primaryValue,
        estimatedLow: pricingResult?.totalCostLow,
        estimatedHigh: pricingResult?.totalCostHigh,
      });
    } catch (e) {
      // safe fallback
    }
  }, [slug, calculator, formInputs, calculationResult, pricingResult]);

  // Input change handler with validation bounds
  const handleInputChange = (id: string, value: any, min?: number, max?: number) => {
    let parsedVal = value;
    if (typeof value === 'number' || (!isNaN(Number(value)) && value !== '')) {
      parsedVal = Number(value);
      if (min !== undefined && parsedVal < min) parsedVal = min;
      if (max !== undefined && parsedVal > max) parsedVal = max;
    }
    setFormInputs((prev) => ({ ...prev, [id]: parsedVal }));
  };

  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const handleSaveCalculation = async () => {
    const calcData = {
      calculatorSlug: slug,
      calculatorTitle: calculator.name,
      category: calculator.category,
      inputs: formInputs,
      outputs: {
        primaryQuantity: `${calculationResult.formattedPrimary || calculationResult.primaryValue.toLocaleString()} ${calculationResult.primaryUnit}`,
        unit: calculationResult.primaryUnit,
        priceRange: pricingResult
          ? `£${pricingResult.totalCostLow.toLocaleString()} – £${pricingResult.totalCostHigh.toLocaleString()}`
          : undefined,
        breakdown: calculationResult.materials.map((m) => ({
          label: m.name,
          value: m.formattedQuantity,
        })),
        assumptions: calculationResult.assumptions || [],
      },
    };

    try {
      const checkAuth = await fetch('/api/customer/auth/me');
      const authData = await checkAuth.json();
      if (authData.authenticated) {
        const res = await fetch('/api/customer/calculations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(calcData),
        });
        if (res.ok) {
          setSavedStatus('Saved to your Client Portal!');
          setTimeout(() => setSavedStatus(null), 3000);
          return;
        }
      }
    } catch (e) {
      // ignore
    }

    sessionStorage.setItem('pending_saved_calculation', JSON.stringify(calcData));
    window.location.href = '/portal/register';
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Related calculators
  const relatedCalcs = calculator.relatedCalculators
    .map((slug) => getCalculatorBySlug(slug))
    .filter((c): c is CalculatorDefinition => Boolean(c));

  return (
    <article className="py-10 sm:py-16 bg-slate-50 text-slate-900 min-h-screen">
      <Container>
        {/* Breadcrumbs */}
        <div className="max-w-5xl mx-auto mb-6 text-left">
          <Breadcrumbs
            items={[
              { name: 'Calculators', href: '/calculators' },
              { name: calculator.shortTitle },
            ]}
            className="text-slate-500"
          />
        </div>

        {/* 2-COLUMN MAIN INTERFACE: Left Column (Heading + Inputs) / Right Column (Estimated Cost aligned with top of Heading) */}
        <section aria-label="Interactive Calculator" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
          {/* LEFT COLUMN: HEADING, SUBTEXT & INPUT SPECIFICATIONS */}
          <div className="space-y-6 text-left">
            {/* Header (Left-aligned, tags removed) */}
            <header className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-[1.12]">
                {calculator.name}
              </h1>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                {calculator.description}
              </p>
            </header>

            {/* Clean White Specifications Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[#FFAA4F]" />
                  <span>Enter Dimensions &amp; Specifications</span>
                </h2>
                <span className="text-xs font-semibold text-slate-400">Metric Dimensions</span>
              </div>

            <div className="space-y-5">
              {calculator.inputs.map((inp) => {
                const currentVal = formInputs[inp.id] ?? inp.defaultValue;

                return (
                  <div key={inp.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor={inp.id} className="block text-xs sm:text-sm font-bold text-slate-800">
                        {inp.label}
                      </label>
                      {inp.unit && (
                        <span className="text-xs font-mono font-semibold text-slate-400">
                          {inp.unit}
                        </span>
                      )}
                    </div>

                    {inp.helperText && (
                      <p className="text-xs text-slate-500">{inp.helperText}</p>
                    )}

                    {/* Numeric Input */}
                    {inp.type === 'number' && (
                      <div className="relative rounded-xl shadow-2xs">
                        <input
                          id={inp.id}
                          type="number"
                          step={inp.step || 0.1}
                          min={inp.min}
                          max={inp.max}
                          value={currentVal}
                          onChange={(e) =>
                            handleInputChange(
                              inp.id,
                              e.target.value === '' ? '' : Number(e.target.value),
                              inp.min,
                              inp.max
                            )
                          }
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm sm:text-base font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F] focus:border-[#FFAA4F] transition-all"
                        />
                        {inp.unit && (
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs font-bold text-slate-400">
                            {inp.unit}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Select Dropdown Input */}
                    {inp.type === 'select' && inp.options && (
                      <div className="space-y-1.5">
                        <select
                          id={inp.id}
                          value={currentVal}
                          onChange={(e) => handleInputChange(inp.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F] focus:border-[#FFAA4F] transition-all"
                        >
                          {inp.options.map((opt) => (
                            <option key={String(opt.value)} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Waste Allowance Selector */}
              {calculator.allowedWasteOptions.length > 1 && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      Cutting &amp; Breakage Waste Allowance
                    </label>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                      +{wastePercent}% extra
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {calculator.allowedWasteOptions.map((w) => (
                      <button
                        type="button"
                        key={w}
                        onClick={() => setWastePercent(w)}
                        className={clsx(
                          'py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer',
                          wastePercent === w
                            ? 'border-[#FFAA4F] bg-[#FFAA4F] text-slate-950 shadow-2xs'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        )}
                      >
                        {w}%
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>

          {/* RIGHT COLUMN: CALCULATION RESULT CARD (Signature Luxury Charcoal - No Blues) */}
          <div className="bg-neutral-950 border border-neutral-800 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFAA4F]">
                {calculationResult.primaryLabel}
              </span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tabular-numbers pt-1">
                {calculationResult.formattedPrimary}
              </div>
            </div>

            {/* Indicative Cost Range */}
            {pricingResult && (
              <div className="pt-4 border-t border-neutral-800 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Estimated Guide Price (Materials + Labour)
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-heading text-[#FFAA4F]">
                  £{pricingResult.totalCostLow.toLocaleString()} – £
                  {pricingResult.totalCostHigh.toLocaleString()}
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Indicative trade estimate based on UK benchmark rates with {pricingResult.contingencyIncluded}% contingency reserve.
                </p>
              </div>
            )}

            {/* Materials Breakdown List (Pure Charcoal Neutral - Zero Blue) */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Itemized Material Bill of Quantities
              </div>
              <div className="space-y-2.5">
                {calculationResult.materials.map((mat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white">{mat.name}</div>
                      {mat.notes && <div className="text-[11px] text-neutral-400">{mat.notes}</div>}
                    </div>
                    <span className="font-bold text-[#FFAA4F] shrink-0 font-mono">
                      {mat.formattedQuantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Commercial Consultation Offer */}
            <div className="pt-2 space-y-3">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFAA4F]">
                  <Flame className="h-4 w-4 text-[#FFAA4F] shrink-0" />
                  <span>Want our construction team to plan &amp; build this?</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Book a priority consultation or site survey with our senior estimator. Fixed-price structural quotes, planning compliance, and full build management.
                </p>
                <button
                  type="button"
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-sm flex items-center justify-center flex-row flex-nowrap whitespace-nowrap gap-2 shadow-lg transition-colors cursor-pointer border border-[#E69335]"
                >
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>Book Free Project Consultation</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                {savedStatus ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5 col-span-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{savedStatus}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveCalculation}
                    className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-[#FFAA4F] border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Save Calculation to My Account</span>
                  </button>
                )}

                <Link
                  href={calculator.commercialCta.buttonHref}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border border-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                >
                  <span>Custom Room Planner</span>
                  <ArrowRight className="h-3 w-3 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. EDITORIAL & TECHNICAL SECTIONS (Centered max-w-5xl) */}
        <div className="max-w-5xl mx-auto space-y-10 mt-12 text-left">
          {/* Formula & Methodology */}
          {calculator.howItWorks && (
            <section aria-label="Formula & Methodology" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
                <Compass className="h-5 w-5 text-[#FFAA4F]" />
                <span>{calculator.howItWorks.title}</span>
              </h2>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed font-normal">
                {calculator.howItWorks.paragraphs?.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </section>
          )}

          {/* UK Cost Benchmark Table */}
          {calculator.costBenchmarkTable && (
            <section aria-label="Cost Benchmarks" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                  {calculator.costBenchmarkTable.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {calculator.costBenchmarkTable.description}
                </p>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                      <th className="py-3 pr-4">Material / Work Item</th>
                      <th className="py-3 px-4">UK Benchmark Rate</th>
                      <th className="py-3 pl-4">Application &amp; Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {calculator.costBenchmarkTable.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 pr-4 font-bold text-slate-900">{row.item}</td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-700">{row.unitCost}</td>
                        <td className="py-3 pl-4 text-slate-500 text-xs">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Common Mistakes & Building Regulations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {calculator.commonMistakes && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span>{calculator.commonMistakes.title}</span>
                </h3>
                <ul className="space-y-3">
                  {calculator.commonMistakes.points?.map((pt, idx) => (
                    <li key={idx} className="text-xs sm:text-sm space-y-1">
                      <strong className="text-slate-900 block font-semibold">• {pt.title}</strong>
                      <span className="text-slate-600 block pl-3.5 leading-relaxed">{pt.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {calculator.buildingRegulations && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-emerald-600" />
                  <span>{calculator.buildingRegulations.title}</span>
                </h3>
                <ul className="space-y-3">
                  {calculator.buildingRegulations.points?.map((pt, idx) => (
                    <li key={idx} className="text-xs sm:text-sm space-y-1">
                      <strong className="text-slate-900 block font-semibold">• {pt.title}</strong>
                      <span className="text-slate-600 block pl-3.5 leading-relaxed">{pt.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Calculation Assumptions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
              <Info className="h-5 w-5 text-[#FFAA4F]" />
              <span>Calculation Assumptions &amp; Standards</span>
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-600">
              {calculationResult.assumptions.map((assump, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#FFAA4F] font-bold">•</span>
                  <span>{assump}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Frequently Asked Questions */}
          {calculator.faqs.length > 0 && (
            <section aria-label="Frequently Asked Questions" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Practical advice, trade guidelines, and UK building standards.
                </p>
              </div>

              <div className="space-y-3">
                {calculator.faqs.map((faq, idx) => {
                  const isOpen = openFaqs[idx] ?? false;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200/90 overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-4 sm:p-5 bg-slate-50/60 hover:bg-slate-100/60 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <span className="font-bold text-slate-900 text-sm font-heading">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-slate-500 shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-500 shrink-0 ml-2" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Full Commercial CTA Banner */}
          <section aria-label="Project Planning Consultation" className="p-8 sm:p-12 rounded-3xl bg-amber-50/80 border border-amber-200/90 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2">
              <Badge variant="brand" size="sm" className="bg-[#FFAA4F] text-slate-950 font-bold text-xs">
                Apex Construction Full Project Delivery
              </Badge>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                {calculator.commercialCta.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                {calculator.commercialCta.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
              <Button
                href={calculator.commercialCta.buttonHref}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-sm px-8 py-4 shadow-md border border-[#E69335]"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {calculator.commercialCta.buttonText}
              </Button>
              <Button
                href="/contact?type=consultation"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-slate-800 border-slate-300 hover:bg-white text-xs sm:text-sm px-6 py-4"
                leftIcon={<Phone className="h-4 w-4 text-amber-600" />}
              >
                Book Site Consultation
              </Button>
            </div>
          </section>

          {/* Related Services */}
          {calculator.relatedServices && calculator.relatedServices.length > 0 && (
            <section aria-label="Our Construction Services" className="space-y-4">
              <h3 className="text-lg font-bold font-heading text-slate-900">
                Our Professional Construction Services
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {calculator.relatedServices.map((srv, idx) => (
                  <Link key={idx} href={srv.href} className="group block">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-sm">
                          {srv.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{srv.desc}</div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0 ml-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related Calculators */}
          {relatedCalcs.length > 0 && (
            <section aria-label="Related Calculators" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                    Related Construction Tools
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Explore other trade and project calculators for your build.
                  </p>
                </div>
                <Link
                  href="/calculators"
                  className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
                >
                  View all 20 tools →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedCalcs.map((rc) => (
                  <Link key={rc.id} href={`/calculators/${rc.slug}`} className="group block">
                    <Card className="p-6 bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-300 transition-all rounded-3xl flex flex-col justify-between h-full space-y-4">
                      <div className="space-y-2">
                        <Badge variant="brand" size="sm" className="bg-slate-100 text-slate-700 border-slate-200 text-[11px] font-semibold">
                          {rc.badge}
                        </Badge>
                        <h4 className="text-base font-bold text-slate-900 font-heading group-hover:text-amber-600 transition-colors">
                          {rc.name}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {rc.tagline}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                        <span>Calculate now</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </Container>

      {/* CALCULATOR CONSULTATION MODAL */}
      <CalculatorConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        calculator={calculator}
        calculationResult={calculationResult}
        pricingResult={pricingResult}
        formInputs={formInputs}
      />
    </article>
  );
};
