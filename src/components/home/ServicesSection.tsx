'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { servicesData } from '@/config/services';
import { ArrowRight } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  return (
    <section
      className="py-20 sm:py-28 bg-slate-50 border-b border-slate-200/80 relative z-10"
      aria-labelledby="services-heading"
    >
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-3xl text-left">
            <h2 id="services-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-[1.15]">
              <span className="block">Specialist Residential Services.</span>
              <span className="text-[#FFAA4F] block">
                Crafted to Perfection.
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl">
              Whether you are extending your ground floor, renovating an entire townhouse, or converting your loft, our team manages every phase with guaranteed milestone contracts.
            </p>
          </div>

          <Button
            href="/plan-my-project"
            variant="primary"
            size="lg"
            className="shadow-md text-sm self-start md:self-end flex-shrink-0 px-7 py-3.5"
            rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            Plan Any Service
          </Button>
        </div>

        {/* 10-Service Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {servicesData.map((service) => (
            <Card
              key={service.id}
              hoverEffect
              className="flex flex-col justify-between bg-white border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-md hover:shadow-xl rounded-3xl overflow-hidden group text-left"
            >
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge variant="slate" className="bg-slate-950/80 text-white border-slate-700 text-xs font-semibold backdrop-blur-xs">
                    {service.typicalDuration}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-white font-heading text-lg sm:text-xl drop-shadow-md">
                    {service.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {service.shortDescription}
                </p>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Indicative Range
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 font-heading tabular-numbers">
                      {service.indicativePriceRange}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/plan-my-project?type=${service.slug}`}
                      className="text-xs font-bold text-[#FFAA4F] hover:text-[#F59E3F] inline-flex items-center gap-1 p-1 transition-colors"
                    >
                      <span>Estimate</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
