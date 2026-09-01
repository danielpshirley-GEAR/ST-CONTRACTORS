import React from 'react';
import Link from 'next/link';
import { verifyAdminAuth } from '@/lib/auth';
import { Container } from '@/components/ui/Container';
import {
  Building2,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Sparkles,
  Network,
  BookOpen,
  FileCheck2,
  TrendingUp,
  Award,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifyAdminAuth();

  return (
    <div className="bg-[#F4F5F7] text-slate-900 min-h-screen text-left selection:bg-[#FFAA4F] selection:text-slate-950">
      {/* 1. SIGNATURE ORANGE HEADER (IDENTICAL TO MAIN WEBSITE BRANDING) */}
      <header className="sticky top-0 z-50 w-full bg-[#FFAA4F] text-white border-b border-[#E69335] shadow-md transition-all duration-200">
        <Container size="full" className="px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Left Brand Logo */}
            <div className="flex items-center space-x-6 xl:space-x-8">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2.5 sm:gap-3 group focus-visible:ring-2 focus-visible:ring-white rounded-lg p-1 flex-shrink-0"
                aria-label="ST CONTRACTORS Admin Console"
              >
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white text-[#FFAA4F] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
                  <Building2 className="h-5 w-5 sm:h-5.5 sm:w-5.5" aria-hidden="true" />
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-base sm:text-lg lg:text-xl font-extrabold tracking-wider font-heading whitespace-nowrap text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                    ST CONTRACTORS
                  </span>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-white text-slate-950 shadow-xs">
                    Console
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              {session.isAuthenticated && (
                <nav className="hidden xl:flex items-center space-x-2 text-xs font-bold" aria-label="Admin Navigation">
                  <Link
                    href="/admin/dashboard"
                    className="px-3.5 py-2 rounded-xl text-white hover:bg-white/20 transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                  >
                    CRM Pipeline
                  </Link>
                  <Link
                    href="/admin/seo"
                    className="px-3.5 py-2 rounded-xl text-white hover:bg-white/20 transition-colors flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>SEO Engine</span>
                  </Link>
                  <Link
                    href="/admin/knowledge"
                    className="px-3.5 py-2 rounded-xl text-white hover:bg-white/20 transition-colors flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Knowledge Bank</span>
                  </Link>
                  <Link
                    href="/admin/editorial"
                    className="px-3.5 py-2 rounded-xl text-white hover:bg-white/20 transition-colors flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                  >
                    <FileCheck2 className="h-3.5 w-3.5" />
                    <span>Quality Gate</span>
                  </Link>
                  <Link
                    href="/admin/attribution"
                    className="px-3.5 py-2 rounded-xl text-white hover:bg-white/20 transition-colors flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Attribution</span>
                  </Link>
                  <Link
                    href="/admin/learning"
                    className="px-3.5 py-2 rounded-xl text-white hover:bg-white/20 transition-colors flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                  >
                    <Award className="h-3.5 w-3.5" />
                    <span>Learning</span>
                  </Link>
                  <Link
                    href="/admin/integrations"
                    className="px-3.5 py-2 rounded-xl text-white hover:bg-white/20 transition-colors flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                  >
                    <Network className="h-3.5 w-3.5" />
                    <span>Integrations</span>
                  </Link>
                </nav>
              )}
            </div>

            {/* Right Action Bar */}
            <div className="flex items-center space-x-3 text-xs">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 transition-colors font-bold shadow-xs"
              >
                <span>Live Website</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#FFAA4F]" />
              </Link>

              {session.isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-white font-bold text-xs drop-shadow-xs">{session.username}</span>
                    <span className="text-[10px] text-white/90 font-medium">Director Access</span>
                  </div>
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 text-slate-950 hover:text-white px-3 py-2 rounded-xl bg-white/90 hover:bg-slate-900 transition-colors cursor-pointer font-bold shadow-xs"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Logout</span>
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/admin/login"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors shadow-md"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </Container>
      </header>

      {/* Secondary Mobile Sub-Navigation */}
      {session.isAuthenticated && (
        <div className="xl:hidden bg-[#FFAA4F]/90 border-b border-[#E69335] px-4 py-2 overflow-x-auto">
          <nav className="flex items-center space-x-2 text-xs font-bold whitespace-nowrap text-white">
            <Link href="/admin/dashboard" className="px-3 py-1 rounded-lg bg-white text-slate-950 shadow-xs">
              CRM Pipeline
            </Link>
            <Link href="/admin/seo" className="px-3 py-1 rounded-lg bg-white/20 text-white">
              SEO Engine
            </Link>
            <Link href="/admin/knowledge" className="px-3 py-1 rounded-lg bg-white/20 text-white">
              Knowledge Bank
            </Link>
            <Link href="/admin/editorial" className="px-3 py-1 rounded-lg bg-white/20 text-white">
              Quality Gate
            </Link>
            <Link href="/admin/attribution" className="px-3 py-1 rounded-lg bg-white/20 text-white">
              Attribution
            </Link>
            <Link href="/admin/learning" className="px-3 py-1 rounded-lg bg-white/20 text-white">
              Learning
            </Link>
            <Link href="/admin/integrations" className="px-3 py-1 rounded-lg bg-white/20 text-white">
              Integrations
            </Link>
          </nav>
        </div>
      )}

      {/* Main Admin Content Body */}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
