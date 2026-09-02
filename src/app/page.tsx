import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { caseStudiesData } from '@/config/case-studies';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { HeroVideo } from '@/components/ui/HeroVideo';
import { ParallaxBlueprintSection } from '@/components/ui/ParallaxBlueprint';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { AboutSection } from '@/components/home/AboutSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  Phone,
  Box,
} from 'lucide-react';

export default function HomePage() {
  const homepageFaqs = [
    {
      title: 'How accurate are your online cost estimates?',
      content:
        'Our online planning estimates and calculators are derived from real project data across London and the South East, using current trade labour rates and material indexes. While indicative for planning purposes, they provide a realistic starting budget before our team conducts an on-site architectural survey for a formal fixed-price quotation.',
    },
    {
      title: 'Do you manage planning permission and Building Regulations?',
      content:
        'Yes. We are a turnkey principal building contractor. We handle everything from Permitted Development certificate applications and full local council planning submissions to structural engineer calculations and final Building Control sign-off.',
    },
    {
      title: 'What insurance and warranties do you provide?',
      content:
        'We hold £10M Public and Employers Liability Insurance and provide a comprehensive 10-Year Insurance Backed Guarantee on all structural work. All electrical (NICEIC/Part P) and gas (Gas Safe) installations come with independent regulatory certificates.',
    },
    {
      title: 'Do you offer a fixed-price contract?',
      content:
        'Yes. Following our architectural site survey and structural review, we provide a detailed, itemized fixed-price schedule of works with milestone-based payment schedules so you have complete financial certainty throughout the build.',
    },
  ];

  return (
    <main id="main-content" role="main" className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* 1. FULL SCREEN HERO SECTION (WHITE & HIGHLIGHT ORANGE OVER VIDEO) */}
      <section className="relative min-h-[90vh] lg:min-h-[96vh] flex flex-col justify-end text-white overflow-hidden border-b border-slate-800">
        {/* Ambient Background Video */}
        <HeroVideo
          posterSrc="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=2400&q=90"
          videoSrc="/videos/hero-kitchen.mp4"
          alt="Inside a bespoke renovated luxury kitchen with architectural marble island, warm cabinetry, and designer lighting by ST Contractors"
        />

        <Container className="relative z-10 pt-24 sm:pt-32 pb-20 sm:pb-24 lg:pb-28">
          <div className="max-w-4xl xl:max-w-5xl text-left">
            {/* Main Hero Headline (Balanced Typography & Refined Spacing) */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-heading leading-[1.12] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              <span className="block text-white">Plan Your Project.</span>
              <span className="block mt-1.5">
                <span className="text-[#FFAA4F]">
                  Know Your Budget.
                </span>{' '}
                <span className="text-white">Let Us Build It.</span>
              </span>
            </h1>

            {/* Supporting Copy (White) */}
            <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed max-w-3xl font-normal drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
              Explore your project feasibility, estimate costs with transparent pricing, and let our master builders manage everything from architectural drawings to final handover.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                href="/plan-my-project"
                variant="primary"
                size="lg"
                className="shadow-xl shadow-[#FFAA4F]/25 bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 text-base font-bold px-9 py-4 justify-center border border-[#E69335]"
                rightIcon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
              >
                Start Your Project
              </Button>
              <Button
                href="/calculators"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-white bg-slate-950/60 backdrop-blur-md border-white/60 hover:bg-slate-900/90 text-base font-semibold px-9 py-4 justify-center shadow-md"
              >
                Explore Free Calculators
              </Button>
            </div>

            {/* Direct Assistance Line */}
            <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
              <Phone className="h-4 w-4 text-[#FFAA4F]" aria-hidden="true" />
              <span>
                Speak directly with a Senior Estimator:{' '}
                <a
                  href={`tel:${siteConfig.company.phone.replace(/\s+/g, '')}`}
                  className="font-bold text-[#FFAA4F] hover:text-white underline"
                >
                  020&nbsp;8123&nbsp;4567
                </a>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 1. STATS & 3D PREVIEW STRIP (LIGHT GREY) */}
      <section className="bg-slate-50 border-b border-slate-200/80 py-6 sm:py-8 relative z-20 shadow-xs">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
            {/* Box 1: 3D Plans */}
            <Link
              href="/plan-my-project?mode=3d"
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#FFAA4F] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer text-left"
            >
              <div className="text-xl sm:text-2xl font-bold text-[#FFAA4F] font-heading">
                3D Plans
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                Custom 1:1 Mockups
              </div>
            </Link>

            {/* Box 2: Years Experience */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between text-left">
              <div className="text-xl sm:text-2xl font-bold text-[#FFAA4F] font-heading tabular-numbers">
                15+
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                Years Experience
              </div>
            </div>

            {/* Box 3: Delivered Projects */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between text-left">
              <div className="text-xl sm:text-2xl font-bold text-[#FFAA4F] font-heading tabular-numbers">
                250+
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                Delivered Projects
              </div>
            </div>

            {/* Box 4: Dedicated Project Managers */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between text-left">
              <div className="text-xl sm:text-2xl font-bold text-[#FFAA4F] font-heading tabular-numbers">
                100%
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                Dedicated Project Managers
              </div>
            </div>

            {/* Box 5: Structural Warranty */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between text-left col-span-2 sm:col-span-1">
              <div className="text-xl sm:text-2xl font-bold text-[#FFAA4F] font-heading tabular-numbers">
                10-YEAR
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                Structural Warranty
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. REVIEWS SECTION (WHITE) */}
      <ReviewsSection />

      {/* 3. ABOUT SECTION (LIGHT GREY) */}
      <AboutSection />

      {/* 4. HOW IT WORKS INTERACTIVE PROGRESS BAR SECTION (WHITE) */}
      <HowItWorksSection />

      {/* 5. TYPES OF SERVICES (LIGHT GREY) */}
      <ServicesSection />

      {/* 6. FEATURED CASE STUDIES / PORTFOLIO SPOTLIGHT (WHITE) */}
      <ParallaxBlueprintSection
        variant="white"
        className="py-20 sm:py-28 border-b border-slate-200/80"
        aria-labelledby="case-studies-heading"
      >
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-3xl text-left">
              <h2 id="case-studies-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
                Recent Transformations.{' '}
                <span className="text-amber-600">
                  Delivered on Budget.
                </span>
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
                Explore our completed projects with transparent contract breakdowns, challenge-and-solution walkthroughs, and client reviews.
              </p>
            </div>

            <Button
              href="/projects"
              variant="outline"
              size="lg"
              className="text-slate-800 border-slate-300 hover:bg-slate-100 text-sm self-start md:self-end flex-shrink-0"
              rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            >
              View Full Portfolio
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudiesData.slice(0, 2).map((study) => (
              <Card
                key={study.id}
                hoverEffect
                className="flex flex-col justify-between bg-slate-50 border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-md hover:shadow-xl rounded-3xl overflow-hidden text-left"
              >
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={study.coverImage}
                    alt={study.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="brand" className="bg-[#FFAA4F] text-slate-950 font-bold text-xs">
                      {study.projectType}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="slate" className="bg-slate-950/85 text-white border-slate-700 backdrop-blur-md text-xs font-semibold">
                      {study.location}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-heading drop-shadow-md">
                      {study.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 text-left">
                      {study.customerObjective}
                    </p>

                    <div className="mt-6 pt-5 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left">
                      <div>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                          Contract Value
                        </span>
                        <span className="text-sm sm:text-base font-bold text-slate-900 font-heading tabular-numbers mt-0.5 block">
                          {study.indicativeCost}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                          Duration
                        </span>
                        <span className="text-sm sm:text-base font-bold text-slate-900 font-heading tabular-numbers mt-0.5 block">
                          {study.duration}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                          Outcome
                        </span>
                        <span className="text-sm sm:text-base font-bold text-emerald-600 font-heading mt-0.5 block">
                          On Budget
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Turnkey Design &amp; Build
                    </span>
                    <Link
                      href={`/projects/${study.slug}`}
                      className="text-xs font-bold text-[#FFAA4F] hover:text-[#F59E3F] inline-flex items-center gap-1.5 focus-visible:ring-1 focus-visible:ring-[#FFAA4F] rounded p-1 transition-colors"
                    >
                      <span>Read Full Case Study</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </ParallaxBlueprintSection>

      {/* 7. FREQUENTLY ASKED QUESTIONS (WITH REAR EXTENSION VIDEO BACKGROUND) */}
      <section
        className="relative py-20 sm:py-28 overflow-hidden text-white border-b border-neutral-900"
        aria-labelledby="faq-heading"
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
            <source src="/videos/Camera_reveals_house_rear_extension_202608270129.mp4" type="video/mp4" />
          </video>
          {/* Subtle Bottom Gradient */}
          <div
            className="absolute bottom-0 inset-x-0 h-64 sm:h-80 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
            aria-hidden="true"
          />
        </div>

        <Container className="relative z-10">
          <div className="text-left max-w-3xl mb-12">
            <h2 id="faq-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-heading leading-tight drop-shadow-md">
              Common Questions About Building with Us
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-200 leading-relaxed font-normal drop-shadow-sm">
              Straightforward answers on planning permission, pricing transparency, contracts, and on-site management.
            </p>
          </div>

          <div className="w-full bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-700/80 shadow-2xl">
            <Accordion items={homepageFaqs} variant="dark" />
          </div>

          <div className="mt-8 text-left text-xs sm:text-sm text-neutral-300 font-medium">
            Have a specific engineering or planning question?{' '}
            <Link href="/contact" className="text-[#FFAA4F] hover:underline font-bold">
              Contact our senior team
            </Link>
          </div>
        </Container>
      </section>

      {/* 8. FINAL CONSULTATION & PLANNING CTA BANNER (WHITE BACKGROUND WITH PARALLAX BLUEPRINT) */}
      <ParallaxBlueprintSection
        variant="white"
        className="py-20 sm:py-28 border-t border-slate-200/80"
        aria-labelledby="cta-banner-heading"
      >
        <Container className="text-center">
          <div className="max-w-3xl mx-auto">
            <h2 id="cta-banner-heading" className="text-3xl sm:text-5xl font-bold tracking-tight font-heading leading-tight text-slate-900">
              Ready to Plan Your Next Home Project?
            </h2>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto font-normal">
              Get an instant indicative cost range using our interactive planning tools, or book a free architectural consultation with our senior project estimators.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                href="/plan-my-project"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-xl bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-base px-9 py-4"
                rightIcon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
              >
                Plan My Project Now
              </Button>
              <Button
                href="/contact?type=consultation"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-slate-900 bg-white border-2 border-slate-950 hover:bg-slate-950 hover:text-white text-base font-bold px-9 py-4"
              >
                Book Free Consultation
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Free &amp; No Obligation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100% Fixed-Price Quotation
              </span>
            </div>
          </div>
        </Container>
      </ParallaxBlueprintSection>
    </main>
  );
}
