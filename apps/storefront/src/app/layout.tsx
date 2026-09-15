import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppFloatingButton } from '../components/WhatsAppFloatingButton';
import { SatelliteLocationFloatingButton } from '../components/SatelliteLocationFloatingButton';
import { ThemeProvider } from '../context/ThemeContext';
import { I18nProvider } from '../context/I18nContext';
import { StoneConsultantChatbot } from '../components/StoneConsultantChatbot';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alwaheed-platform.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'أحجار بناء وحجر طبيعي ونحت وزخرفة معمارية | مؤسسة الوحيد - صنعاء اليمن',
    template: '%s | مؤسسة الوحيد لأحجار البناء والزخرفة المعمارية',
  },
  description:
    'المؤسسة الأولى في توريد ونحت أحجار البناء الطبيعية والرخام في اليمن وصنعاء. متخصصون في أحجار البناء، حجر حبش أسود ورمادي، حجر بيج مأربي، واجهات فلل وقصور ملكية، تيجان وأعمدة حجرية، مشربيات، ونوافير بأعلى جودة وأفضل سعر.',
  keywords: [
    'أحجار بناء',
    'احجار بناء',
    'حجر بناء',
    'أحجار بناء صنعاء',
    'حجر طبيعي يمني',
    'حجر حبش أسود',
    'حجر بيج مأربي',
    'حجر أبيض سيلاني',
    'واجهات حجرية',
    'واجهات فلل حجر',
    'نحت على الحجر',
    'زخرفة معمارية',
    'تيجان وأعمدة حجرية',
    'مقاولات حجر في اليمن',
    'أسعار أحجار البناء اليمن',
    'مشربيات حجرية',
    'أقواس حجرية ومداخل',
    'رخام وجرانيت يمني',
    'مؤسسة الوحيد للأحجار',
    'حده فج عطان',
  ],
  authors: [{ name: 'مؤسسة الوحيد للزخرفة المعمارية والنحت' }],
  creator: 'مؤسسة الوحيد للزخرفة المعمارية',
  publisher: 'مؤسسة الوحيد للزخرفة المعمارية',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
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
  openGraph: {
    type: 'website',
    locale: 'ar_YE',
    url: siteUrl,
    title: 'أحجار بناء وحجر طبيعي ونحت وزخرفة معمارية | مؤسسة الوحيد',
    description:
      'نحوّل الحجر الطبيعي إلى صروح معمارية وتحف فنية خالدة. توريد أحجار بناء، واجهات فلل وقصور، تيجان، أعمدة، وزخارف معمارية في صنعاء واليمن.',
    siteName: 'مؤسسة الوحيد للزخرفة المعمارية وأحجار البناء',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'أحجار بناء وواجهات حجرية فاخرة - مؤسسة الوحيد',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أحجار بناء وحجر طبيعي | مؤسسة الوحيد للزخرفة المعمارية',
    description:
      'توريد وتنفيذ أحجار البناء، الحجر الطبيعي والرخام، واجهات حجرية للفلل والقصور بصنعاء.',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Enhanced Schema.org LocalBusiness & OfferCatalog JSON-LD for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'Store', 'GeneralContractor'],
        '@id': `${siteUrl}/#organization`,
        name: 'مؤسسة الوحيد للزخرفة المعمارية ونحت والمقاولات العامة',
        alternateName: 'مؤسسة الوحيد لأحجار البناء والحجر الطبيعي',
        description:
          'مؤسسة متخصصة في توريد ونحت وزخرفة أحجار البناء، الحجر الطبيعي اليمني، الرخام، والواجهات الحجرية للفلل والقصور في صنعاء واليمن.',
        url: siteUrl,
        hasMap: 'https://maps.app.goo.gl/Z3fP7feMjhyEeH7J9',
        telephone: '+967777360681',
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'حده - فج عطان',
          addressLocality: 'صنعاء',
          addressRegion: 'أمانة العاصمة',
          addressCountry: 'YE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '15.3189667',
          longitude: '44.1804919',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '08:00',
            closes: '20:00',
          },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'كتالوج أحجار البناء والخدمات المعمارية',
          itemListElement: [
            {
              '@type': 'OfferCatalog',
              name: 'أحجار البناء الطبيعية (حبش، بيج، أبيض)',
            },
            {
              '@type': 'OfferCatalog',
              name: 'واجهات حجرية للفلل والقصور',
            },
            {
              '@type': 'OfferCatalog',
              name: 'نحت التيجان والأعمدة والأقواس',
            },
            {
              '@type': 'OfferCatalog',
              name: 'الرخام والجرانيت والديكورات الحجرية',
            },
          ],
        },
        sameAs: [
          'https://maps.app.goo.gl/Z3fP7feMjhyEeH7J9',
          'https://www.facebook.com/people/%D8%A7%D9%84%D9%88%D8%AD%D9%8A%D8%AF-%D9%84%D9%84%D8%B2%D8%AE%D8%B1%D9%81%D9%87-%D8%A7%D9%84%D9%85%D8%B9%D9%85%D8%A7%D8%B1%D9%8A%D9%87-%D9%88%D9%86%D8%AD%D8%AA-%D9%88%D8%A7%D9%84%D9%85%D9%82%D8%A7%D9%88%D9%84%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D8%A7%D9%85%D9%87-%D8%AD%D8%AF%D9%87-%D9%81%D8%AC-%D8%B9%D8%B7%D8%A7%D9%86-770663641/100067643884572/',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'مؤسسة الوحيد لأحجار البناء والزخرفة المعمارية',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang="ar" dir="rtl" data-theme="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&family=Almarai:wght@300;400;700;800&family=Cairo:wght@300;400;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col selection:bg-gold selection:text-stone-950 font-arabic">
        <I18nProvider>
          <ThemeProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppFloatingButton />
            <SatelliteLocationFloatingButton />
            <StoneConsultantChatbot />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

