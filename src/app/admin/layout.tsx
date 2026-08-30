import React from 'react';
import Link from 'next/link';
import { verifyAdminAuth } from '@/lib/auth';
import { Container } from '@/components/ui/Container';
import { Hammer, Users, BarChart3, Settings, LogOut, Shield, Sparkles, Network, BookOpen, FileCheck2, TrendingUp, Award } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifyAdminAuth();

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen text-left">
      {/* Admin Top Navigation Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-3">
        <Container className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-white">
              <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Hammer className="h-4 w-4" />
              </div>
              <span className="font-heading tracking-tight">Apex Admin &amp; SEO</span>
            </Link>

            {session.isAuthenticated && (
              <nav className="hidden md:flex items-center space-x-2 text-xs font-medium">
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  Leads &amp; Pipeline
                </Link>
                <Link
                  href="/admin/seo"
                  className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>SEO Opportunities</span>
                </Link>
                <Link
                  href="/admin/knowledge"
                  className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                  <span>Knowledge Bank</span>
                </Link>
                <Link
                  href="/admin/editorial"
                  className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileCheck2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Quality Gate</span>
                </Link>
                <Link
                  href="/admin/attribution"
                  className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                  <span>Revenue Attribution</span>
                </Link>
                <Link
                  href="/admin/learning"
                  className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Award className="h-3.5 w-3.5 text-amber-400" />
                  <span>Learning &amp; CRO</span>
                </Link>
                <Link
                  href="/admin/integrations"
                  className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Network className="h-3.5 w-3.5 text-slate-400" />
                  <span>Integrations</span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  View Live Site ↗
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4 text-xs">
            {session.isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-slate-400 hidden sm:inline">
                  Logged in as <strong className="text-white">{session.username}</strong>
                </span>
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-slate-400 hover:text-red-400 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-slate-500 text-xs">
                <Shield className="h-3.5 w-3.5 text-amber-400" />
                <span>Protected Admin Zone</span>
              </div>
            )}
          </div>
        </Container>
      </header>

      {/* Main Admin Area */}
      <main className="p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
