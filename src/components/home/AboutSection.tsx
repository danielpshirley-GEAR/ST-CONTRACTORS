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
      className="relative py-20 sm:py-28 overflow-hidden text-white border-b border-neutral-900"
      aria-labelledby="about-heading"
    >
      {/* Ambient Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
          aria-hidden="true"
        >
          <source src="/videos/Natural_oak_flooring_installatio…_202608270129.mp4" type="video/mp4" />
          <source src="/videos/natural-oak-flooring.mp4" type="video/mp4" />
        </video>
        {/* Subtle Bottom Gradient without blue tint */}
        <div
          className="absolute bottom-0 inset-x-0 h-64 sm:h-80 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
          aria-hidden="true"
        />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Headline & Summary Paragraph (Sticky on large screens) */}
          <div className="lg:col-span-5 text-left space-y-5 lg:sticky lg:top-28">
            <h2
              id="about-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-heading leading-tight drop-shadow-md"
            >
              Renovate your London home, in one place
            </h2>

            <p className="text-base text-neutral-100 leading-relaxed font-normal drop-shadow-sm">
              From architectural design to signing contracts, <span className="whitespace-nowrap">ST&nbsp;Contractors</span> handles the hard parts — giving you clear time and cost estimates, expert engineering support, and the confidence to see your renovation through.
            </p>

            {/* Quick Consultation Link */}
            <div className="pt-2">
              <Link
                href="/plan-my-project"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#FFAA4F] hover:text-[#F59E3F] transition-colors drop-shadow-sm"
              >
                <span>Plan Your Project with Our Team</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Column: Clear White Liquid Glass Card */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.12] backdrop-blur-3xl border border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_20px_50px_rgba(0,0,0,0.35)] text-left space-y-8 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/25 before:via-white/[0.04] before:to-transparent before:pointer-events-none">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`space-y-2 ${
                    idx < steps.length - 1 ? 'pb-8 border-b border-white/20' : ''
                  }`}
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight drop-shadow-sm">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal max-w-2xl drop-shadow-xs">
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
