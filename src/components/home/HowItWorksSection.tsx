'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ParallaxBlueprintSection } from '@/components/ui/ParallaxBlueprint';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Check } from 'lucide-react';
import { clsx } from 'clsx';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const step1Ref = useRef<HTMLDivElement | null>(null);
  const step2Ref = useRef<HTMLDivElement | null>(null);
  const step3Ref = useRef<HTMLDivElement | null>(null);

  // Scroll listener to update active step dynamically on scroll
  useEffect(() => {
    const handleScroll = () => {
      const step1 = step1Ref.current?.getBoundingClientRect();
      const step2 = step2Ref.current?.getBoundingClientRect();
      const step3 = step3Ref.current?.getBoundingClientRect();

      const triggerOffset = window.innerHeight * 0.45;

      if (step3 && step3.top <= triggerOffset) {
        setActiveStep(3);
      } else if (step2 && step2.top <= triggerOffset) {
        setActiveStep(2);
      } else {
        setActiveStep(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler when clicking milestones
  const scrollToStep = (stepNumber: number) => {
    const targetRef = stepNumber === 1 ? step1Ref : stepNumber === 2 ? step2Ref : step3Ref;
    if (targetRef.current) {
      const y = targetRef.current.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Progress bar percentage calculation
  const progressHeight = activeStep === 1 ? '33%' : activeStep === 2 ? '66%' : '100%';

  return (
    <ParallaxBlueprintSection
      variant="white"
      className="py-20 sm:py-24 border-b border-slate-200/80"
      aria-labelledby="how-it-works-heading"
    >
      <Container>
        {/* Top Header */}
        <div className="max-w-2xl text-left mb-16">
          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight"
          >
            How <span className="whitespace-nowrap">ST Contractors</span> works
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
            With <span className="whitespace-nowrap">ST Contractors</span>, an expert planner can help get your project ready, our in-house team drafts architectural plans, and our master builders manage the build from concept to handover.
          </p>
        </div>

        {/* Timeline Container with Center Vertical Interactive Progress Bar */}
        <div className="relative">
          {/* Vertical Progress Rail Track (Desktop) */}
          <div
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1.5 -translate-x-1/2 bg-slate-200 rounded-full"
            aria-hidden="true"
          >
            {/* Active Progress Fill Line */}
            <div
              className="w-full bg-[#FFAA4F] rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ height: progressHeight }}
            />
          </div>

          <div className="space-y-24 lg:space-y-32">
            {/* STEP 1 */}
            <div
              ref={step1Ref}
              id="step-1"
              className={clsx(
                'relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center transition-all duration-300',
                activeStep === 1 ? 'opacity-100' : 'opacity-85 lg:opacity-70'
              )}
            >
              {/* Interactive Milestone Indicator 1 */}
              <button
                onClick={() => scrollToStep(1)}
                className={clsx(
                  'hidden lg:flex absolute left-1/2 top-6 -translate-x-1/2 w-8 h-8 rounded-full items-center justify-center z-20 transition-all duration-300 cursor-pointer shadow-md font-bold text-xs',
                  activeStep === 1
                    ? 'bg-[#FFAA4F] text-slate-950 ring-4 ring-amber-100 scale-110 shadow-amber-500/30'
                    : activeStep > 1
                    ? 'bg-[#FFAA4F] text-slate-950 ring-2 ring-white'
                    : 'bg-white border-2 border-slate-300 text-slate-600'
                )}
                aria-label="Navigate to step 1: Set your budget"
              >
                {activeStep > 1 ? <Check className="h-4 w-4" /> : '1'}
              </button>

              {/* Left Illustration 1 */}
              <div className="flex justify-center lg:justify-end order-2 lg:order-1">
                <div className="relative w-64 h-56 sm:w-72 sm:h-64 flex items-center justify-center">
                  <svg viewBox="0 0 240 200" className="w-full h-full drop-shadow-md" fill="none">
                    <ellipse cx="120" cy="175" rx="90" ry="12" fill="rgba(245, 158, 11, 0.12)" />
                    <path
                      d="M60 110 C60 95, 75 85, 95 85 L125 85 C145 85, 160 95, 160 110 L160 145 C160 152, 154 158, 146 158 L74 158 C66 158, 60 152, 60 145 Z"
                      fill="#d97706"
                    />
                    <path
                      d="M70 110 L150 110 C154 110, 156 114, 154 118 L148 140 C146 144, 142 146, 138 146 L82 146 C78 146, 74 144, 72 140 L66 118 C64 114, 66 110, 70 110 Z"
                      fill="#f59e0b"
                    />
                    <line x1="85" y1="110" x2="85" y2="146" stroke="#b45309" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="110" y1="110" x2="110" y2="146" stroke="#b45309" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="135" y1="110" x2="135" y2="146" stroke="#b45309" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="68" y1="158" x2="58" y2="175" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                    <line x1="152" y1="158" x2="162" y2="175" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                    <line x1="85" y1="158" x2="80" y2="172" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                    <line x1="135" y1="158" x2="140" y2="172" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                    <line x1="180" y1="115" x2="162" y2="175" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
                    <line x1="180" y1="115" x2="198" y2="175" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
                    <line x1="180" y1="115" x2="180" y2="172" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="180" cy="115" r="5" fill="#f59e0b" />
                    <rect x="152" y="92" width="55" height="12" rx="3" transform="rotate(-28 152 92)" fill="#64748b" />
                    <rect x="195" y="68" width="18" height="16" rx="2" transform="rotate(-28 195 68)" fill="#f59e0b" />
                    <circle cx="218" cy="58" r="2.5" fill="#fbbf24" />
                  </svg>
                </div>
              </div>

              {/* Right Content 1 */}
              <div className="text-left order-1 lg:order-2 lg:pl-6 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
                  1. Set your budget
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-lg">
                  Take our two-minute planner to share your project and get a typical cost range. Or speak to an expert ST Contractors estimator, who has guided hundreds of renovations across London at every budget and scope, and can help shape a plan builders take seriously.
                </p>
                <div className="pt-2">
                  <Button
                    href="/plan-my-project"
                    variant="primary"
                    size="sm"
                    className="shadow-md bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-xs sm:text-sm px-6 py-2.5 border border-[#E69335]"
                    rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  >
                    Start your project
                  </Button>
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div
              ref={step2Ref}
              id="step-2"
              className={clsx(
                'relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center transition-all duration-300',
                activeStep === 2 ? 'opacity-100' : 'opacity-85 lg:opacity-70'
              )}
            >
              {/* Interactive Milestone Indicator 2 */}
              <button
                onClick={() => scrollToStep(2)}
                className={clsx(
                  'hidden lg:flex absolute left-1/2 top-6 -translate-x-1/2 w-8 h-8 rounded-full items-center justify-center z-20 transition-all duration-300 cursor-pointer shadow-md font-bold text-xs',
                  activeStep === 2
                    ? 'bg-[#FFAA4F] text-slate-950 ring-4 ring-amber-100 scale-110 shadow-amber-500/30'
                    : activeStep > 2
                    ? 'bg-[#FFAA4F] text-slate-950 ring-2 ring-white'
                    : 'bg-white border-2 border-slate-300 text-slate-600'
                )}
                aria-label="Navigate to step 2: Meet project manager"
              >
                {activeStep > 2 ? <Check className="h-4 w-4" /> : '2'}
              </button>

              {/* Left Content 2 */}
              <div className="text-left lg:text-left lg:pr-6 space-y-3 order-1">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
                  2. Meet project manager
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-lg">
                  Meet your dedicated Senior Project Manager in person for a comprehensive site feasibility survey. We produce detailed, like-for-like schedules of works and 3D architectural models so you can compare every trade item with complete clarity.
                </p>
              </div>

              {/* Right Illustration 2 */}
              <div className="flex justify-center lg:justify-start order-2 lg:pl-6">
                <div className="relative w-64 h-56 sm:w-72 sm:h-64 flex items-center justify-center">
                  <svg viewBox="0 0 240 200" className="w-full h-full drop-shadow-md" fill="none">
                    <ellipse cx="120" cy="170" rx="85" ry="10" fill="rgba(245, 158, 11, 0.12)" />
                    <circle cx="78" cy="135" r="26" fill="#854d0e" />
                    <circle cx="78" cy="135" r="16" fill="#ca8a04" />
                    <rect x="86" y="132" width="16" height="6" rx="2" fill="#eab308" />
                    <path d="M110 85 C140 70, 175 90, 195 80 L205 130 C185 140, 150 120, 120 135 Z" fill="#f97316" />
                    <path d="M100 95 C130 80, 165 100, 185 90 L180 135 C160 145, 125 125, 95 140 Z" fill="#fed7aa" />
                    <path
                      d="M138 108 C135 104, 128 105, 128 112 C128 118, 138 126, 138 126 C138 126, 148 118, 148 112 C148 105, 141 104, 138 108 Z"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <g transform="rotate(18 175 100)">
                      <rect x="172" y="55" width="8" height="42" fill="#d97706" rx="2" />
                      <polygon points="172,97 180,97 176,108" fill="#fde047" />
                      <polygon points="174,104 178,104 176,108" fill="#1e293b" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div
              ref={step3Ref}
              id="step-3"
              className={clsx(
                'relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center transition-all duration-300',
                activeStep === 3 ? 'opacity-100' : 'opacity-85 lg:opacity-70'
              )}
            >
              {/* Interactive Milestone Indicator 3 */}
              <button
                onClick={() => scrollToStep(3)}
                className={clsx(
                  'hidden lg:flex absolute left-1/2 top-6 -translate-x-1/2 w-8 h-8 rounded-full items-center justify-center z-20 transition-all duration-300 cursor-pointer shadow-md font-bold text-xs',
                  activeStep === 3
                    ? 'bg-[#FFAA4F] text-slate-950 ring-4 ring-amber-100 scale-110 shadow-amber-500/30'
                    : 'bg-white border-2 border-slate-300 text-slate-600'
                )}
                aria-label="Navigate to step 3: Renovate with confidence"
              >
                3
              </button>

              {/* Left Illustration 3 */}
              <div className="flex justify-center lg:justify-end order-2 lg:order-1">
                <div className="relative w-64 h-56 sm:w-72 sm:h-64 flex items-center justify-center">
                  <svg viewBox="0 0 240 200" className="w-full h-full drop-shadow-md" fill="none">
                    <ellipse cx="120" cy="175" rx="90" ry="10" fill="rgba(245, 158, 11, 0.12)" />
                    <rect x="45" y="150" width="150" height="12" rx="4" fill="#047857" />
                    <path d="M125 110 L165 110 L180 170 L110 170 Z" fill="#f97316" />
                    <path d="M115 105 C125 90, 155 90, 165 105 L170 145 L110 145 Z" fill="#e2e8f0" />
                    <circle cx="140" cy="80" r="16" fill="#fde047" />
                    <path d="M128 72 C132 64, 152 64, 156 72 Z" fill="#047857" />
                    <circle cx="134" cy="80" r="4" stroke="#0f172a" strokeWidth="2" fill="none" />
                    <circle cx="146" cy="80" r="4" stroke="#0f172a" strokeWidth="2" fill="none" />
                    <line x1="138" y1="80" x2="142" y2="80" stroke="#0f172a" strokeWidth="2" />
                    <path d="M95 138 C90 125, 140 120, 155 138 C140 148, 105 148, 95 138 Z" fill="#f59e0b" />
                    <ellipse cx="125" cy="142" rx="35" ry="10" fill="#fbbf24" />
                    <rect x="60" y="146" width="45" height="5" rx="1.5" fill="#fde047" />
                    <circle cx="82" cy="148.5" r="1.5" fill="#10b981" />
                  </svg>
                </div>
              </div>

              {/* Right Content 3 */}
              <div className="text-left order-1 lg:order-2 lg:pl-6 space-y-3">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
                  3. Renovate with confidence
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-lg">
                  Lock in your plan with guaranteed milestone payments held securely until you inspect and approve each stage. Your dedicated Senior Project Director oversees all master trades on site with weekly video updates and a 10-Year Insurance Warranty at handover.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className="mt-20 text-left">
          <Button
            href="/plan-my-project"
            variant="secondary"
            size="lg"
            className="text-white bg-slate-900 hover:bg-slate-800 text-sm font-semibold px-8 py-3.5"
            rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            How it works
          </Button>
        </div>
      </Container>
    </ParallaxBlueprintSection>
  );
};
