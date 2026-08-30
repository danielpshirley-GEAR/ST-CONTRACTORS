'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { Hammer, Phone, Mail, MapPin, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Do not render footer on Admin portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800/80 architectural-grid" role="contentinfo">
      <Container>
        {/* Top Pitch Section */}
        <div className="pb-12 mb-12 border-b border-slate-850 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-500/20">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Full-Service Principal Contractor</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-heading">
              One team. One project. From idea to completion.
            </h3>
            <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              We eliminate contractor disputes and multi-trade delays by managing architectural design, planning permissions, structural engineering, and construction under a single turnkey contract.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <Link
              href="/plan-my-project"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-brand-600/30 focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px]"
            >
              <span>Plan Your Project</span>
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact?type=consultation"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-medium text-sm transition-all focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px]"
            >
              <span>Book Free Consultation</span>
            </Link>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12">
          {/* Col 1: Brand & Contact Info */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-4 group inline-flex focus-visible:ring-2 focus-visible:ring-brand-500 rounded p-1"
              aria-label="ST CONTRACTORS Home"
            >
              <div className="h-9 w-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-md">
                <Hammer className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                ST CONTRACTORS <span className="text-xs font-normal text-brand-400 tracking-normal block -mt-1">Design &amp; Build</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-6">
              Premier residential building contractor delivering high-specification house extensions, full renovations, and loft conversions across London and Surrey.
            </p>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-500 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${siteConfig.company.phone.replace(/\s+/g, '')}`}
                  className="hover:text-brand-400 font-semibold transition-colors"
                >
                  020&nbsp;8123&nbsp;4567
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-500 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${siteConfig.company.email}`}
                  className="hover:text-brand-400 transition-colors"
                >
                  {siteConfig.company.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-slate-400">{siteConfig.company.address}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/services/extensions" className="hover:text-white transition-colors">House Extensions</Link></li>
              <li><Link href="/services/renovations" className="hover:text-white transition-colors">Full Renovations</Link></li>
              <li><Link href="/services/loft-conversions" className="hover:text-white transition-colors">Loft Conversions</Link></li>
              <li><Link href="/services/kitchen-renovations" className="hover:text-white transition-colors">Kitchen Renovations</Link></li>
              <li><Link href="/services/bathroom-renovations" className="hover:text-white transition-colors">Bathroom Remodelling</Link></li>
              <li><Link href="/services/garden-rooms" className="hover:text-white transition-colors">Garden Rooms & Studios</Link></li>
              <li><Link href="/services/garage-conversions" className="hover:text-white transition-colors">Garage Conversions</Link></li>
              <li><Link href="/services/driveways" className="hover:text-white transition-colors">Driveways & Paving</Link></li>
              <li><Link href="/services/landscaping" className="hover:text-white transition-colors">Landscaping & Patios</Link></li>
            </ul>
          </div>

          {/* Col 3: Planning & Free Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Planning & Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/plan-my-project" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">Plan My Project Tool</Link></li>
              <li><Link href="/calculators" className="hover:text-white transition-colors">Construction Calculators</Link></li>
              <li><Link href="/cost-guides" className="hover:text-white transition-colors">Project Cost Guides</Link></li>
              <li><Link href="/advice" className="hover:text-white transition-colors">Planning & Regs Advice</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Case Studies Portfolio</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Our Company</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact & Consultations</Link></li>
            </ul>
          </div>

          {/* Col 4: Service Areas */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Service Areas
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {siteConfig.serviceAreas.map((area) => (
                <li key={area.slug}>
                  <Link href={`/contact?area=${area.slug}`} className="hover:text-white transition-colors">
                    {area.name} ({area.region})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quality Badges */}
        <div className="py-6 border-y border-slate-850 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>FMB Standards Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>£10M Public & Employers Liability Insurance</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>Local Authority Building Control Registered</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>10-Year Insurance Backed Guarantee</span>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} {siteConfig.company.name}. All rights reserved. Registered in England & Wales (No.&nbsp;{siteConfig.company.registrationNumber}).
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms &amp; Conditions</Link>
            <Link href="/legal/disclaimer" className="hover:text-slate-400 transition-colors">Calculator Disclaimer</Link>
            <Link href="/admin/login" className="hover:text-slate-300 text-slate-600">Staff Portal</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
