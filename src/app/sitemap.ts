import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { servicesData } from '@/config/services';
import { caseStudiesData } from '@/config/case-studies';
import { MASTER_CALCULATORS } from '@/lib/calculators/registry';
import { COST_GUIDES_DATA } from '@/lib/content/cost-guides-data';
import { ADVICE_ARTICLES_DATA } from '@/lib/content/advice-data';
import { LOCATIONS_DATA } from '@/lib/content/locations-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // 1. Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/plan-my-project`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/calculators`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cost-guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/advice`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/areas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. Dynamic Commercial Service pages
  const serviceRoutes: MetadataRoute.Sitemap = servicesData.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 3. Dynamic Case Studies pages
  const projectRoutes: MetadataRoute.Sitemap = caseStudiesData.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 4. Dynamic 20 Standalone Calculator pages
  const calculatorRoutes: MetadataRoute.Sitemap = MASTER_CALCULATORS.map((calc) => ({
    url: `${baseUrl}/calculators/${calc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 5. Dynamic Cost Guides (Published only)
  const costGuideRoutes: MetadataRoute.Sitemap = COST_GUIDES_DATA.filter((g) => g.status === 'published').map(
    (guide) => ({
      url: `${baseUrl}/cost-guides/${guide.slug}`,
      lastModified: new Date(guide.lastUpdated),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  );

  // 6. Dynamic Advice / Knowledge Hub (Published only)
  const adviceRoutes: MetadataRoute.Sitemap = ADVICE_ARTICLES_DATA.filter((a) => a.status === 'published').map(
    (article) => ({
      url: `${baseUrl}/advice/${article.slug}`,
      lastModified: new Date(article.lastUpdated),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  );

  // 7. Dynamic Genuine Location Guides (Published only)
  const locationRoutes: MetadataRoute.Sitemap = LOCATIONS_DATA.filter((l) => l.status === 'published').map(
    (location) => ({
      url: `${baseUrl}/areas/${location.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  );

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...calculatorRoutes,
    ...costGuideRoutes,
    ...adviceRoutes,
    ...locationRoutes,
  ];
}
