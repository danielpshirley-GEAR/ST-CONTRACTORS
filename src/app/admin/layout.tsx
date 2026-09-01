import React from 'react';
import Link from 'next/link';
import { verifyAdminAuth } from '@/lib/auth';
import { Container } from '@/components/ui/Container';
import {
  Hammer,
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
  Compass,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifyAdminAuth();

  return (
    <div className="bg-[#0B0D10] text-slate-100 min-h-screen text-left selection:bg-[#FFAA4F] selection:text-[#0B0D10]">
      {/* Top Architectural Header */}
      <header className="bg-[#12151B] border-b border-[#2A313C] px-4 py-3 sticky top-0 z-40 shadow-2xl backdrop-blur-md">
        <Container className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-6">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 font-extrabold text-white group"
            >
              <div className="h-8 w-8 rounded-xl bg-[#FFAA4F] flex items-center justify-center text-[#0B0D10] font-black shadow-[0_2px_12px_rgba(255,170,79,0.4)] group-hover:scale-105 transition-transform">
                <Hammer className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold tracking-tight text-sm text-white flex items-center gap-1.5">
                  ST CONTRACTORS
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-[#FFAA4F]/20 text-[#FFAA4F] border border-[#FFAA4F]/30">
                    Console
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium -mt-0.5">
                  Lead CRM &amp; Revenue Engine
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {session.isAuthenticated && (
              <nav className="hidden xl:flex items-center space-x-1 text-xs font-semibold">
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-1.5 rounded-xl hover:bg-[#1C222B] text-slate-300 hover:text-white transition-colors"
                >
                  CRM Pipeline
                </Link>
                <Link
                  href="/admin/seo"
                  className="px-3 py-1.5 rounded-xl hover:bg-[#1C222B] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#FFAA4F]" />
                  <span>SEO Engine</span>
                </Link>
                <Link
                  href="/admin/knowledge"
                  className="px-3 py-1.5 rounded-xl hover:bg-[#1C222B] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#FFAA4F]" />
                  <span>Knowledge Bank</span>
                </Link>
                <Link
                  href="/admin/editorial"
                  className="px-3 py-1.5 rounded-xl hover:bg-[#1C222B] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileCheck2 className="h-3.5 w-3.5 text-[#FFAA4F]" />
                  <span>Quality Gate</span>
                </Link>
                <Link
                  href="/admin/attribution"
                  className="px-3 py-1.5 rounded-xl hover:bg-[#1C222B] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <TrendingUp className="h-3.5 w-3.5 text-[#FFAA4F]" />
                  <span>Attribution</span>
                </Link>
                <Link
                  href="/admin/learning"
                  className="px-3 py-1.5 rounded-xl hover:bg-[#1C222B] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Award className="h-3.5 w-3.5 text-[#FFAA4F]" />
                  <span>Learning &amp; CRO</span>
                </Link>
                <Link
                  href="/admin/integrations"
                  className="px-3 py-1.5 rounded-xl hover:bg-[#1C222B] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Network className="h-3.5 w-3.5 text-slate-400" />
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
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C222B] hover:bg-[#252D3A] text-slate-300 hover:text-white border border-[#2A313C] transition-colors font-medium"
            >
              <span>Live Website</span>
              <ExternalLink className="h-3 w-3 text-[#FFAA4F]" />
            </Link>

            {session.isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-white font-bold text-xs">{session.username}</span>
                  <span className="text-[10px] text-[#FFAA4F] flex items-center justify-end gap-1 font-mono font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFAA4F] animate-pulse" />
                    Director Access
                  </span>
                </div>
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-slate-400 hover:text-red-300 px-3 py-1.5 rounded-xl bg-[#1C222B] hover:bg-red-950/40 border border-[#2A313C] hover:border-red-800/60 transition-colors cursor-pointer font-bold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout</span>
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="px-4 py-2 rounded-xl bg-[#FFAA4F] hover:bg-[#FFB86A] text-[#0B0D10] font-black transition-colors shadow-[0_2px_10px_rgba(255,170,79,0.3)]"
              >
                Sign In
              </Link>
            )}
          </div>
        </Container>
      </header>

      {/* Secondary Mobile Sub-Navigation */}
      {session.isAuthenticated && (
        <div className="xl:hidden bg-[#12151B] border-b border-[#2A313C] px-4 py-2 overflow-x-auto">
          <nav className="flex items-center space-x-2 text-xs font-semibold whitespace-nowrap">
            <Link href="/admin/dashboard" className="px-2.5 py-1 rounded-lg bg-[#1C222B] text-slate-200">
              CRM Pipeline
            </Link>
            <Link href="/admin/seo" className="px-2.5 py-1 rounded-lg bg-[#1C222B] text-slate-200">
              SEO Engine
            </Link>
            <Link href="/admin/knowledge" className="px-2.5 py-1 rounded-lg bg-[#1C222B] text-slate-200">
              Knowledge Bank
            </Link>
            <Link href="/admin/editorial" className="px-2.5 py-1 rounded-lg bg-[#1C222B] text-slate-200">
              Quality Gate
            </Link>
            <Link href="/admin/attribution" className="px-2.5 py-1 rounded-lg bg-[#1C222B] text-slate-200">
              Attribution
            </Link>
            <Link href="/admin/learning" className="px-2.5 py-1 rounded-lg bg-[#1C222B] text-slate-200">
              Learning
            </Link>
            <Link href="/admin/integrations" className="px-2.5 py-1 rounded-lg bg-[#1C222B] text-slate-200">
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
