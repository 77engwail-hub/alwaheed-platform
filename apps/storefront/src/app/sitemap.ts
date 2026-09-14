import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alwaheed-platform.vercel.app';
  const currentDate = new Date();

  // Core high-intent SEO pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/rfq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
  ];

  // Specific product category landing keywords
  const stoneProducts = [
    'habash-black-stone',
    'marib-beige-stone',
    'natural-carved-facade',
    'royal-corinthian-capitals',
    'arch-door-stone-frame',
    'stone-mashrabiya-window',
    'classic-indoor-stone-fountain',
    'yemeni-natural-white-stone',
  ];

  const productRoutes: MetadataRoute.Sitemap = stoneProducts.map((slug) => ({
    url: `${siteUrl}/products/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const projectRoutes: MetadataRoute.Sitemap = [
    'luxury-palace-facade-sanaa',
    'modern-villa-habash-stone',
    'royal-hall-indoor-carving',
  ].map((slug) => ({
    url: `${siteUrl}/projects/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...productRoutes, ...projectRoutes];
}
