import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { ProjectCommandCenter } from '@/components/dashboard/ProjectCommandCenter';

export const metadata: Metadata = {
  title: `My Project Command Center | Live Estimate & Statutory Tracker | ${siteConfig.name}`,
  description:
    'View your unified London construction project profile. Track your project readiness score, room-by-room scope items, Party Wall statutory requirements, and book a surveyor consultation.',
};

export default function MyProjectPage() {
  return (
    <main id="main-content" role="main" className="py-8 sm:py-12 bg-slate-50 min-h-screen text-slate-900">
      <Container size="xl">
        <Breadcrumbs items={[{ name: 'My Project' }]} className="mb-6" />
        <Suspense fallback={<div className="py-20 text-center text-slate-500 font-medium">Loading your project profile...</div>}>
          <ProjectCommandCenter />
        </Suspense>
      </Container>
    </main>
  );
}
