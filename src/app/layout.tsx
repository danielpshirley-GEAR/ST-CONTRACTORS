import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Luxury Home Extensions & Renovations`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: [
    'house extensions London',
    'luxury residential construction',
    'full home renovation London',
    'loft conversion specialists',
    'architectural building contractor',
    'single storey rear extension',
    'Chiswick builders',
    'Richmond renovation',
    'Ealing house extension',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteConfig.url,
    title: `${siteConfig.name} | Plan it. Price it. Let us build it.`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Architectural Residential Construction`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data JSON-LD Schema for LocalBusiness / General Contractor
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: siteConfig.company.name,
    image: siteConfig.ogImage,
    '@id': siteConfig.url,
    url: siteConfig.url,
    telephone: siteConfig.company.phone,
    email: siteConfig.company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '14 Enterprise Way, Chiswick Park',
      addressLocality: 'London',
      postalCode: 'W4 5YB',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.4934,
      longitude: -0.2747,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    priceRange: '££££',
    areaServed: siteConfig.serviceAreas.map((area) => area.name),
  };

  return (
    <html lang="en" className="h-full bg-white">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-white text-slate-900 selection:bg-brand-500 selection:text-white">
        {/* Web Interface Guidelines: Skip to main content link for screen reader accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-brand-600 focus:text-white focus:font-semibold focus:rounded-md focus:shadow-2xl focus:ring-2 focus:ring-white focus:outline-none"
        >
          Skip to main content
        </a>

        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
