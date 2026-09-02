'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ArrowRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const steps = [
    {
      title: 'Express your style',
      description:
        "Work with our architects and interior designers to visualise your space in 3D — or come with your own plans and we'll work with what you have.",
    },
    {
      title: 'Get clear and confident',
      description:
        'Meet our senior project directors in person before you commit. Review detailed, itemised schedule of works with transparent milestones. No surprises.',
    },
    {
      title: 'Maximise your budget',
      description:
        'Fixed-price contracts. Milestone payments held securely until you approve each stage. Your money moves when you say so.',
    },
    {
      title: '10-Year insurance-backed warranty',
      description:
        'Comprehensive structural protection with full Building Control completion certificates, Gas Safe, and NICEIC Part P sign-off.',
    },
  ];

  return (
    <section
      className="relative py-20 sm:py-28 overflow-hidden text-white bg-slate-950 border-b border-neutral-900"
      aria-labelledby="about-heading"
    >
      {/* Ambient Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center opacity-30"
          aria-hidden="true"
        >
          <source src="/videos/Natural_oak_flooring_installatio…_202608270129.mp4" type="video/mp4" />
          <source src="/videos/natural-oak-flooring.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/80" aria-hidden="true" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Headline & Summary Paragraph (Sticky on large screens) */}
          <div className="lg:col-span-5 text-left space-y-5 lg:sticky lg:top-28">
            <h2
              id="about-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-heading leading-tight"
            >
              Renovate your London home, in one place
            </h2>

            <p className="text-base text-slate-300 leading-relaxed font-normal">
              From architectural design to signing contracts, <span className="whitespace-nowrap">ST&nbsp;Contractors</span> handles the hard parts — giving you clear time and cost estimates, expert engineering support, and the confidence to see your renovation through.
            </p>

            {/* Quick Consultation Link */}
            <div className="pt-2">
              <Link
                href="/plan-my-project"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#FFAA4F] hover:text-[#F59E3F] transition-colors"
              >
                <span>Plan Your Project with Our Team</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Column: High-Contrast Solid Dark Card */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-left space-y-8">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`space-y-2 ${
                    idx < steps.length - 1 ? 'pb-8 border-b border-slate-800' : ''
                  }`}
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
