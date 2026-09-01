import React from 'react';
import Link from 'next/link';
import { getCustomerSession } from '@/lib/customer-auth';
import {
  LayoutDashboard,
  FolderKanban,
  Calculator,
  FileText,
  Calendar,
  LogOut,
  User,
  Shield,
  Hammer,
  ChevronRight,
} from 'lucide-react';
import { CustomerLogoutButton } from '@/components/portal/CustomerLogoutButton';

export default async function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCustomerSession();

  // For public auth routes (/portal/login, /portal/register), render children without sidebar
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {session.isAuthenticated && session.user ? (
        <div className="flex-1 flex flex-col md:flex-row">
          {/* SIDEBAR */}
          <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
            <div>
              {/* BRAND HEADER */}
              <div className="p-6 border-b border-slate-800">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[#FFAA4F] text-slate-950 flex items-center justify-center font-bold font-heading shadow-md">
                    <Hammer className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-extrabold font-heading text-base tracking-tight text-white block">
                      ST CONTRACTORS
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block">
                      Client Portal
                    </span>
                  </div>
                </Link>
              </div>

              {/* USER PROFILE SNIPPET */}
              <div className="p-4 mx-3 my-4 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-[#FFAA4F] flex items-center justify-center font-bold">
                  <User className="h-5 w-5" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-bold text-white truncate">{session.user.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">{session.user.email}</div>
                </div>
              </div>

              {/* NAVIGATION LINKS */}
              <nav className="px-3 space-y-1 text-xs font-semibold">
                <Link
                  href="/portal/dashboard"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#FFAA4F]" />
                  <span>Overview</span>
                </Link>
                <Link
                  href="/portal/projects"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <FolderKanban className="h-4 w-4 text-emerald-400" />
                  <span>My Projects &amp; Estimates</span>
                </Link>
                <Link
                  href="/portal/calculations"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Calculator className="h-4 w-4 text-blue-400" />
                  <span>Saved Calculations</span>
                </Link>
                <Link
                  href="/portal/documents"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <FileText className="h-4 w-4 text-purple-400" />
                  <span>Documents &amp; Uploads</span>
                </Link>
                <Link
                  href="/portal/consultations"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Calendar className="h-4 w-4 text-rose-400" />
                  <span>Consultations &amp; Visits</span>
                </Link>
              </nav>
            </div>

            {/* BOTTOM ACTIONS */}
            <div className="p-4 border-t border-slate-800 space-y-3">
              <Link
                href="/plan-my-project"
                className="block text-center py-2.5 px-3 rounded-xl bg-[#FFAA4F] hover:bg-[#f59e3f] text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                + Plan Another Project
              </Link>
              <CustomerLogoutButton />
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8 md:p-10">
            {children}
          </main>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
