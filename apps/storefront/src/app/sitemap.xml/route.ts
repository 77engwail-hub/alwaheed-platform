import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alwaheed-platform.vercel.app';
  const currentDate = new Date().toISOString();

  const pages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/products', priority: '0.95', changefreq: 'daily' },
    { url: '/projects', priority: '0.90', changefreq: 'weekly' },
    { url: '/rfq', priority: '0.85', changefreq: 'monthly' },
    { url: '/services', priority: '0.80', changefreq: 'monthly' },
    { url: '/about', priority: '0.70', changefreq: 'monthly' },
    { url: '/contact', priority: '0.75', changefreq: 'monthly' },
    { url: '/products/habash-black-stone', priority: '0.90', changefreq: 'weekly' },
    { url: '/products/marib-beige-stone', priority: '0.90', changefreq: 'weekly' },
    { url: '/products/natural-carved-facade', priority: '0.90', changefreq: 'weekly' },
    { url: '/products/royal-corinthian-capitals', priority: '0.90', changefreq: 'weekly' },
    { url: '/products/arch-door-stone-frame', priority: '0.90', changefreq: 'weekly' },
    { url: '/products/stone-mashrabiya-window', priority: '0.90', changefreq: 'weekly' },
    { url: '/products/classic-indoor-stone-fountain', priority: '0.90', changefreq: 'weekly' },
    { url: '/products/yemeni-natural-white-stone', priority: '0.90', changefreq: 'weekly' },
    { url: '/projects/luxury-palace-facade-sanaa', priority: '0.85', changefreq: 'monthly' },
    { url: '/projects/modern-villa-habash-stone', priority: '0.85', changefreq: 'monthly' },
    { url: '/projects/royal-hall-indoor-carving', priority: '0.85', changefreq: 'monthly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  });
}
