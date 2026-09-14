import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppFloatingButton } from '../components/WhatsAppFloatingButton';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'مؤسسة الوحيد للزخرفة المعمارية ونحت والمقاولات العامة | حده - فج عطان، صنعاء',
  description:
    'المؤسسة الرائدة في نحت وزخرفة الأحجار الطبيعية والرخام، تنفيذ أرقى واجهات الفلل والقصور، تشكيل التيجان والأعمدة الملكية، مشربيات وإطارات، مقاولات حجرية متكاملة في صنعاء، اليمن.',
  keywords: [
    'الوحيد للزخرفة المعمارية',
    'نحت حجر صنعاء',
    'واجهات حجر طبيعي',
    'حجر حبش',
    'حجر بيج مأربي',
    'تيجان وأعمدة رومانية',
    'مقاولات حجر اليمن',
    'نقوش حجرية يدوية',
    'مشربيات حجرية',
    'حده فج عطان',
  ],
  authors: [{ name: 'مؤسسة الوحيد للزخرفة المعمارية' }],
  creator: 'مؤسسة الوحيد للزخرفة المعمارية',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'ar_YE',
    url: 'http://localhost:3000',
    title: 'مؤسسة الوحيد للزخرفة المعمارية ونحت والمقاولات العامة',
    description:
      'نحوّل الحجر الطبيعي إلى صروح معمارية وتحف فنية خالدة. واجهات فلل وقصور، تيجان، أعمدة، وزخارف معمارية في صنعاء.',
    siteName: 'الوحيد للزخرفة المعمارية',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'واجهات حجرية ملكية - الوحيد للزخرفة المعمارية',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org LocalBusiness JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'مؤسسة الوحيد للزخرفة المعمارية ونحت والمقاولات العامة',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    telephone: '+967770663641',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'حده - فج عطان',
      addressLocality: 'صنعاء',
      addressCountry: 'YE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '15.3218',
      longitude: '44.1852',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '08:00',
        closes: '20:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/people/%D8%A7%D9%84%D9%88%D8%AD%D9%8A%D8%AF-%D9%84%D9%84%D8%B2%D8%AE%D8%B1%D9%81%D9%87-%D8%A7%D9%84%D9%85%D8%B9%D9%85%D8%A7%D8%B1%D9%8A%D9%87-%D9%88%D9%86%D8%AD%D8%AA-%D9%88%D8%A7%D9%84%D9%85%D9%82%D8%A7%D9%88%D9%84%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D8%A7%D9%85%D9%87-%D8%AD%D8%AF%D9%87-%D9%81%D8%AC-%D8%B9%D8%B7%D8%A7%D9%86-770663641/100067643884572/',
    ],
  };

  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-stone-100 text-stone-900 selection:bg-gold selection:text-stone-950 font-arabic">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
