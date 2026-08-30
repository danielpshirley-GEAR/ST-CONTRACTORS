import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MASTER_CALCULATORS, getCalculatorBySlug } from '@/lib/calculators/registry';
import { CalculatorView } from '@/components/calculators/CalculatorView';
import { siteConfig } from '@/config/site';

interface CalculatorPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return MASTER_CALCULATORS.map((calc) => ({
    slug: calc.slug,
  }));
}

export async function generateMetadata({ params }: CalculatorPageProps): Promise<Metadata> {
  const calculator = getCalculatorBySlug(params.slug);
  if (!calculator) {
    return {
      title: 'Calculator Not Found',
    };
  }

  const canonicalUrl = `${siteConfig.url}/calculators/${calculator.slug}`;

  return {
    title: calculator.seo.title,
    description: calculator.seo.description,
    keywords: calculator.seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: calculator.seo.title,
      description: calculator.seo.description,
      url: canonicalUrl,
      type: 'website',
      siteName: siteConfig.name,
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: calculator.seo.title,
      description: calculator.seo.description,
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

export default function SingleCalculatorPage({ params }: CalculatorPageProps) {
  const calculator = getCalculatorBySlug(params.slug);

  if (!calculator) {
    notFound();
  }

  const canonicalUrl = `${siteConfig.url}/calculators/${calculator.slug}`;

  // 1. Schema.org WebApplication
  const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calculator.name,
    description: calculator.description,
    url: canonicalUrl,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
    },
    author: {
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
        name: 'Calculators',
        item: `${siteConfig.url}/calculators`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: calculator.shortTitle,
        item: canonicalUrl,
      },
    ],
  };

  // 3. Schema.org FAQPage
  const faqJsonLd = calculator.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: calculator.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  // 4. Schema.org HowTo (Step by step measurement & calculation guide)
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Use the ${calculator.shortTitle}`,
    description: `Step-by-step instructions to calculate accurate material quantities and costs using the free ${calculator.name}.`,
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Measure Your Space',
        text: 'Measure the length, width, or surface area of your planned build in meters or millimeters.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Select Specifications',
        text: 'Choose your desired material thickness, format, or finish level from the options menu.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Apply Waste Allowance',
        text: 'Select 5%, 10%, or 15% cutting and breakage waste allowance according to room shape.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Review Bill of Quantities',
        text: 'Inspect the itemized quantities (units, bags, rolls) and estimated trade guide price.',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <CalculatorView slug={params.slug} />
    </>
  );
}
