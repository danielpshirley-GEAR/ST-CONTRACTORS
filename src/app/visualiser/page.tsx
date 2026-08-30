import React from 'react';
import { Metadata } from 'next';
import { DesignVisualiserView } from '@/components/visualiser/DesignVisualiserView';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `AI Project Visualiser & Design Explorer | ${siteConfig.name}`,
  description:
    'Explore contemporary glass extensions, industrial Crittall knockthroughs, and heritage restoration designs with instant structural feasibility checks and 2026 London cost benchmarks.',
  alternates: {
    canonical: `${siteConfig.url}/visualiser`,
  },
  openGraph: {
    title: `AI Project Visualiser & Design Explorer | ${siteConfig.name}`,
    description:
      'Configure architectural glazing, flooring, and room extensions with real-time structural feasibility and price calculations.',
    url: `${siteConfig.url}/visualiser`,
  },
};

export default function VisualiserPage() {
  return <DesignVisualiserView />;
}
