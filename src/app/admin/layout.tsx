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
    <div className="bg-slate-950 text-slate-100 min-h-screen text-left selection:bg-amber-500 selection:text-slate-950">
      {/* Top Architectural Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-40 shadow-lg backdrop-blur-md">
        <Container className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-6">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 font-extrabold text-white group"
            >
              <div className="h-8 w-8 rounded-xl bg-[#FFAA4F] flex items-center justify-center text-slate-950 font-black shadow-md group-hover:scale-105 transition-transform">
                <Hammer className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold tracking-tight text-sm text-white flex items-center gap-1.5">
                  ST CONTRACTORS
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
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
                  className="px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  CRM Pipeline
                </Link>
                <Link
                  href="/admin/seo"
                  className="px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>SEO Engine</span>
                </Link>
                <Link
                  href="/admin/knowledge"
                  className="px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                  <span>Knowledge Bank</span>
                </Link>
                <Link
                  href="/admin/editorial"
                  className="px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileCheck2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Quality Gate</span>
                </Link>
                <Link
                  href="/admin/attribution"
                  className="px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                  <span>Attribution</span>
                </Link>
                <Link
                  href="/admin/learning"
                  className="px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Award className="h-3.5 w-3.5 text-amber-400" />
                  <span>Learning &amp; CRO</span>
                </Link>
                <Link
                  href="/admin/integrations"
                  className="px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
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
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors font-medium"
            >
              <span>Live Website</span>
              <ExternalLink className="h-3 w-3 text-amber-400" />
            </Link>

            {session.isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-white font-bold text-xs">{session.username}</span>
                  <span className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Director Access
                  </span>
                </div>
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-slate-400 hover:text-red-300 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-800/60 transition-colors cursor-pointer font-bold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout</span>
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </Container>
      </header>

      {/* Secondary Mobile Sub-Navigation */}
      {session.isAuthenticated && (
        <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 py-2 overflow-x-auto">
          <nav className="flex items-center space-x-2 text-xs font-semibold whitespace-nowrap">
            <Link href="/admin/dashboard" className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200">
              CRM Pipeline
            </Link>
            <Link href="/admin/seo" className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200">
              SEO Engine
            </Link>
            <Link href="/admin/knowledge" className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200">
              Knowledge Bank
            </Link>
            <Link href="/admin/editorial" className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200">
              Quality Gate
            </Link>
            <Link href="/admin/attribution" className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200">
              Attribution
            </Link>
            <Link href="/admin/learning" className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200">
              Learning
            </Link>
            <Link href="/admin/integrations" className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200">
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
