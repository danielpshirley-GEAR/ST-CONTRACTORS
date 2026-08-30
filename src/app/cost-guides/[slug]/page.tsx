import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COST_GUIDES_DATA, getCostGuideBySlug } from '@/lib/content/cost-guides-data';
import { CostGuideView } from '@/components/content/CostGuideView';
import { siteConfig } from '@/config/site';

interface CostGuidePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return COST_GUIDES_DATA.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: CostGuidePageProps): Promise<Metadata> {
  const guide = getCostGuideBySlug(params.slug);
  if (!guide) {
    return {
      title: 'Cost Guide Not Found',
    };
  }

  const canonicalUrl = `${siteConfig.url}/cost-guides/${guide.slug}`;

  return {
    title: `${guide.metaTitle} | ${siteConfig.name}`,
    description: guide.metaDescription,
    keywords: guide.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: canonicalUrl,
      type: 'article',
      siteName: siteConfig.name,
      locale: 'en_GB',
      publishedTime: guide.publishedDate,
      modifiedTime: guide.lastUpdated,
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metaTitle,
      description: guide.metaDescription,
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

export default function SingleCostGuidePage({ params }: CostGuidePageProps) {
  const guide = getCostGuideBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  const canonicalUrl = `${siteConfig.url}/cost-guides/${guide.slug}`;

  // 1. Schema.org Article
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.h1,
    description: guide.metaDescription,
    url: canonicalUrl,
    datePublished: guide.publishedDate,
    dateModified: guide.lastUpdated,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
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
        name: 'Cost Guides',
        item: `${siteConfig.url}/cost-guides`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: guide.title,
        item: canonicalUrl,
      },
    ],
  };

  // 3. Schema.org FAQPage
  const faqJsonLd = guide.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map((faq) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
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
      <CostGuideView guide={guide} />
    </>
  );
}
