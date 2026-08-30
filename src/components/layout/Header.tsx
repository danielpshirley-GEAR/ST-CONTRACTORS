'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { Container } from '@/components/ui/Container';
import {
  Phone,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Building2,
  User,
  Calculator,
  BookOpen,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setResourcesDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services', hasDropdown: 'services' },
    { name: 'Visualiser', href: '/visualiser' },
    { name: 'Resources', href: '/calculators', hasDropdown: 'resources' },
    { name: 'Portfolio', href: '/projects' },
    { name: 'My Project', href: '/my-project' },
    { name: 'Sign in', href: '/portal/login' },
  ];

  // Do not render public header on Admin or Portal layouts
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/portal')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFAA4F] text-white border-b border-[#E69335] shadow-md transition-all duration-200" role="banner">
      <Container size="full" className="px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* 1. Left Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus-visible:ring-2 focus-visible:ring-white rounded-lg p-1 flex-shrink-0"
            aria-label="ST CONTRACTORS Home"
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white text-[#FFAA4F] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <Building2 className="h-5 w-5 sm:h-5.5 sm:w-5.5" aria-hidden="true" />
            </div>
            <div className="flex items-center whitespace-nowrap">
              <span className="text-base sm:text-lg lg:text-xl font-extrabold tracking-wider font-heading whitespace-nowrap text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                ST CONTRACTORS
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation: Home - Services - Resources - Portfolio - Sign in */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <nav className="flex items-center space-x-6 xl:space-x-8" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href)) ||
                  (link.name === 'Resources' &&
                    (pathname.startsWith('/calculators') ||
                      pathname.startsWith('/cost-guides') ||
                      pathname.startsWith('/advice') ||
                      pathname.startsWith('/assistant')));

                // SERVICES DROPDOWN
                if (link.hasDropdown === 'services') {
                  return (
                    <div
                      key={link.name}
                      className="relative"
                      onMouseEnter={() => setServicesDropdownOpen(true)}
                      onMouseLeave={() => setServicesDropdownOpen(false)}
                    >
                      <Link
                        href={link.href}
                        className={clsx(
                          'relative py-2 text-sm font-bold transition-colors inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-white rounded drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]',
                          isActive ? 'text-white font-extrabold' : 'text-white/95 hover:text-white'
                        )}
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          className={clsx(
                            'h-3.5 w-3.5 text-white transition-transform duration-200',
                            servicesDropdownOpen && 'rotate-180'
                          )}
                          aria-hidden="true"
                        />
                        {isActive && (
                          <span className="absolute -bottom-5 left-0 w-full h-[3px] bg-white rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.25)]" />
                        )}
                      </Link>

                      {servicesDropdownOpen && (
                        <div className="absolute top-full left-0 w-72 pt-2 z-50 animate-fadeIn">
                          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-2.5 grid gap-1">
                            <Link
                              href="/services"
                              className="px-3 py-2 rounded-xl text-xs font-bold text-[#FFAA4F] hover:bg-amber-50 flex items-center justify-between"
                            >
                              <span>Explore All Services</span>
                              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </Link>
                            <hr className="border-slate-100 my-1" />
                            <Link
                              href="/services/extensions"
                              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-[#FFAA4F]"
                            >
                              House Extensions
                            </Link>
                            <Link
                              href="/services/renovations"
                              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-[#FFAA4F]"
                            >
                              Full House Renovations
                            </Link>
                            <Link
                              href="/services/loft-conversions"
                              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-[#FFAA4F]"
                            >
                              Loft Conversions
                            </Link>
                            <Link
                              href="/services/kitchen-renovations"
                              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-[#FFAA4F]"
                            >
                              Kitchen Renovations
                            </Link>
                            <Link
                              href="/services/garden-rooms"
                              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-[#FFAA4F]"
                            >
                              Garden Rooms &amp; Studios
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // RESOURCES DROPDOWN
                if (link.hasDropdown === 'resources') {
                  return (
                    <div
                      key={link.name}
                      className="relative"
                      onMouseEnter={() => setResourcesDropdownOpen(true)}
                      onMouseLeave={() => setResourcesDropdownOpen(false)}
                    >
                      <Link
                        href={link.href}
                        className={clsx(
                          'relative py-2 text-sm font-bold transition-colors inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-white rounded drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]',
                          isActive ? 'text-white font-extrabold' : 'text-white/95 hover:text-white'
                        )}
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          className={clsx(
                            'h-3.5 w-3.5 text-white transition-transform duration-200',
                            resourcesDropdownOpen && 'rotate-180'
                          )}
                          aria-hidden="true"
                        />
                        {isActive && (
                          <span className="absolute -bottom-5 left-0 w-full h-[3px] bg-white rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.25)]" />
                        )}
                      </Link>

                      {resourcesDropdownOpen && (
                        <div className="absolute top-full left-0 w-72 pt-2 z-50 animate-fadeIn">
                          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-2.5 grid gap-1">
                            <Link
                              href="/calculators"
                              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-[#FFAA4F] flex items-center justify-between"
                            >
                              <span>Build Calculators</span>
                              <Calculator className="h-3.5 w-3.5 text-slate-400" />
                            </Link>
                            <Link
                              href="/cost-guides"
                              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-[#FFAA4F] flex items-center justify-between"
                            >
                              <span>Project Cost Guides</span>
                              <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                            </Link>
                            <Link
                              href="/advice"
                              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-[#FFAA4F] flex items-center justify-between"
                            >
                              <span>Planning &amp; Regs Advice</span>
                              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                            </Link>
                            <Link
                              href="/assistant"
                              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-[#FFAA4F] flex items-center justify-between"
                            >
                              <span>Project Assistant</span>
                              <Sparkles className="h-3.5 w-3.5 text-[#FFAA4F]" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // STANDARD NAV LINK (Home, Portfolio, Sign in)
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      'relative py-2 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-white rounded drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]',
                      isActive ? 'text-white font-extrabold' : 'text-white/95 hover:text-white',
                      link.name === 'Sign in' && 'inline-flex items-center gap-1.5'
                    )}
                  >
                    {link.name === 'Sign in' && <User className="h-3.5 w-3.5" />}
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute -bottom-5 left-0 w-full h-[3px] bg-white rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.25)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Direct Phone Number */}
            <a
              href={`tel:${siteConfig.company.phone.replace(/\s+/g, '')}`}
              className="text-sm font-bold text-white hover:text-white/90 transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-white rounded px-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
              aria-label={`Call our office directly on ${siteConfig.company.phone}`}
            >
              020&nbsp;8123&nbsp;4567
            </a>

            {/* Primary Action Button: QUOTE ME */}
            <Link
              href="/plan-my-project"
              className="px-5 py-2.5 rounded-xl bg-slate-950 text-white hover:bg-black transition-all duration-200 text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-white group"
            >
              <span>QUOTE ME</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* 3. Mobile Header Controls */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Link
              href="/portal/login"
              className="p-1.5 rounded-lg bg-white/20 text-white text-xs font-bold"
              aria-label="Sign In"
            >
              <User className="h-4 w-4" />
            </Link>

            <Link
              href="/plan-my-project"
              className="px-3 py-1.5 rounded-lg bg-slate-950 text-white hover:bg-black text-[11px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 shadow-sm"
            >
              <span>QUOTE ME</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-black/10 rounded-lg focus-visible:ring-2 focus-visible:ring-white focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6 text-white" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        {mobileMenuOpen && (
          <div id="mobile-nav-menu" className="lg:hidden border-t border-[#E69335] py-5 animate-fadeIn">
            <nav className="flex flex-col space-y-2" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      'px-3 py-2 text-base font-bold rounded-lg transition-colors flex items-center justify-between',
                      isActive
                        ? 'text-white bg-black/20 font-extrabold'
                        : 'text-white/90 hover:text-white hover:bg-black/10'
                    )}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="h-2 w-2 rounded-full bg-white" />}
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-[#E69335] flex flex-col gap-3">
                <a
                  href={`tel:${siteConfig.company.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 text-sm font-bold text-white px-3 py-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>020&nbsp;8123&nbsp;4567</span>
                </a>

                <Link
                  href="/plan-my-project"
                  className="w-full py-3 bg-slate-950 text-white hover:bg-black text-center font-extrabold rounded-xl text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <span>QUOTE ME</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};
