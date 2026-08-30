import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { siteConfig } from '@/config/site';
import {
  Shield,
  CheckCircle2,
  Award,
  Users,
  Hammer,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: `About Us | Master Residential Builders | ${siteConfig.name}`,
  description:
    'Learn about ST CONTRACTORS. Over 15 years delivering high-specification residential extensions, period renovations, and luxury living spaces with fixed-price integrity.',
};

export default function AboutPage() {
  const values = [
    {
      title: 'Fixed-Price Certainty',
      description:
        'We believe in financial transparency. Our contracts feature comprehensive schedules of works with fixed milestone billing, removing the risk of surprise overrun costs.',
      icon: Award,
    },
    {
      title: 'One Dedicated Team',
      description:
        'From architectural feasibility through to final painting, you deal with one accountable project manager overseeing all structural, electrical, plumbing, and finishing trades.',
      icon: Users,
    },
    {
      title: 'Master Craftsmanship',
      description:
        'We employ directly managed, time-served bricklayers, carpenters, electricians, and gas-safe plumbers committed to flawless execution and spotless job sites.',
      icon: Hammer,
    },
    {
      title: 'Rigorous Safety & Compliance',
      description:
        'Full CDM 2015 principal contractor management, £10M insurance backing, and full Building Control certifications for complete legal compliance.',
      icon: Shield,
    },
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* 1. HERO SECTION (LIGHT GREY) */}
      <section className="bg-slate-50 text-slate-900 pt-10 pb-16 sm:pb-20 border-b border-slate-200">
        <Container>
          <Breadcrumbs items={[{ name: 'About' }]} className="mb-8 text-slate-500" />

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
              Building exceptional homes with transparency and craft.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Founded on the belief that residential construction should be predictable, professional, and enjoyable, <span className="whitespace-nowrap">ST&nbsp;CONTRACTORS</span> delivers turnkey architectural building services across London and the South East.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. COMPANY STATS & STORY (WHITE) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFAA4F]">
                15+ Years of Excellence
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading leading-tight">
                A single accountable team from initial sketch to final coat of paint.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                Homeowners often face the headache of coordinating separate architects, structural engineers, builders, and sub-trades—each blaming the other when issues arise.
              </p>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                We created <span className="whitespace-nowrap">ST&nbsp;CONTRACTORS</span> to solve that problem. As your single principal contractor, we take full responsibility for design viability, council permissions, structural steel calculations, foundation works, and interior fit-out.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-4">
                {siteConfig.trustStats.map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
                    <span className="text-2xl font-bold text-[#FFAA4F] font-heading tabular-numbers">
                      {stat.value}
                    </span>
                    <span className="text-xs text-slate-600 block mt-1 font-medium">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 relative h-80 sm:h-[420px] rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
                alt="ST CONTRACTORS master builders at work on residential construction site"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 3. CORE PRINCIPLES (LIGHT GREY) */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-heading">
              Our Four Building Pillars
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
              The principles that guide how we treat our clients, manage our sites, and deliver our projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <Card key={idx} className="p-8 bg-white border-slate-200/90 shadow-md hover:shadow-xl rounded-3xl flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-amber-100 text-[#FFAA4F] flex items-center justify-center mb-5 shadow-xs">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">
                      {v.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {v.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. GUARANTEES & COMPLIANCE (WHITE) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Complete Protection for Your Property Investment
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
              Every <span className="whitespace-nowrap">ST&nbsp;CONTRACTORS</span> construction contract includes comprehensive legal and insurance protections.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              {siteConfig.guarantees.map((g, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <BadgeCheck className="h-6 w-6 text-[#FFAA4F] flex-shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">{g.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{g.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 5. CTA BANNER (CLEAN CLOSING ANCHOR) */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80 text-slate-900">
        <Container size="md" className="text-center">
          <h2 className="text-3xl font-bold font-heading text-slate-900">
            Let&apos;s build something exceptional together.
          </h2>
          <p className="mt-3 text-slate-600 text-base max-w-xl mx-auto leading-relaxed font-normal">
            Speak directly with our senior building team to discuss your plans and explore initial architectural options.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href="/plan-my-project"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto text-sm font-bold bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335] shadow-md"
              rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            >
              Start Project Planner
            </Button>
            <Button
              href="/contact?type=consultation"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-slate-900 bg-white border-2 border-slate-950 hover:bg-slate-950 hover:text-white text-sm font-bold"
            >
              Book Free Site Consultation
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
