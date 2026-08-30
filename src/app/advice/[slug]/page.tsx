import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ADVICE_ARTICLES_DATA, getAdviceArticleBySlug } from '@/lib/content/advice-data';
import { AdviceArticleView } from '@/components/content/AdviceArticleView';
import { siteConfig } from '@/config/site';

interface AdvicePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return ADVICE_ARTICLES_DATA.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: AdvicePageProps): Promise<Metadata> {
  const article = getAdviceArticleBySlug(params.slug);
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const canonicalUrl = `${siteConfig.url}/advice/${article.slug}`;

  return {
    title: `${article.seoTitle} | ${siteConfig.name}`,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.seoTitle,
      description: article.metaDescription,
      url: canonicalUrl,
      type: 'article',
      siteName: siteConfig.name,
      locale: 'en_GB',
      publishedTime: article.publishedDate,
      modifiedTime: article.lastUpdated,
      authors: [article.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle,
      description: article.metaDescription,
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

export default function SingleAdvicePage({ params }: AdvicePageProps) {
  const article = getAdviceArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const canonicalUrl = `${siteConfig.url}/advice/${article.slug}`;

  // 1. Schema.org Article
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    url: canonicalUrl,
    datePublished: article.publishedDate,
    dateModified: article.lastUpdated,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
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
        name: 'Advice & Guides',
        item: `${siteConfig.url}/advice`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  // 3. Schema.org FAQPage
  const faqJsonLd = article.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((faq) => ({
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
      <AdviceArticleView article={article} />
    </>
  );
}
