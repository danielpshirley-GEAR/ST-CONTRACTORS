import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCATIONS_DATA, getLocationBySlug } from '@/lib/content/locations-data';
import { LocationView } from '@/components/content/LocationView';
import { siteConfig } from '@/config/site';

interface LocationPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return LOCATIONS_DATA.map((loc) => ({
    slug: loc.slug,
  }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const location = getLocationBySlug(params.slug);
  if (!location) {
    return {
      title: 'Location Not Found',
    };
  }

  const canonicalUrl = `${siteConfig.url}/areas/${location.slug}`;

  return {
    title: `${location.metaTitle} | ${siteConfig.name}`,
    description: location.metaDescription,
    keywords: location.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: location.metaTitle,
      description: location.metaDescription,
      url: canonicalUrl,
      type: 'website',
      siteName: siteConfig.name,
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: location.metaTitle,
      description: location.metaDescription,
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
}

export default function SingleLocationPage({ params }: LocationPageProps) {
  const location = getLocationBySlug(params.slug);

  if (!location) {
    notFound();
  }

  const canonicalUrl = `${siteConfig.url}/areas/${location.slug}`;

  // 1. Schema.org LocalBusiness
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: `${siteConfig.name} - ${location.name}`,
    description: location.metaDescription,
    url: canonicalUrl,
    telephone: '+44 20 8123 4567',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: location.borough,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.name,
      addressRegion: 'Greater London',
      addressCountry: 'GB',
    },
    priceRange: '£££',
  };

  // 2. Schema.org BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Service Areas',
        item: `${siteConfig.url}/areas`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: location.name,
        item: canonicalUrl,
      },
    ],
  };

  // 3. Schema.org FAQPage
  const faqJsonLd = location.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: location.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <LocationView location={location} />
    </>
  );
}
