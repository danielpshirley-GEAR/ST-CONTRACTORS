import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Contact Us & Book a Project Consultation | ${siteConfig.name}`,
  description:
    'Book a free project consultation, arrange a feasibility site visit, or speak with our senior building and estimating team across London and the South East.',
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  openGraph: {
    title: `Contact Us & Book a Project Consultation | ${siteConfig.name}`,
    description:
      'Book a free project consultation, arrange a feasibility site visit, or speak with our senior building and estimating team across London and the South East.',
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    locale: 'en_GB',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
