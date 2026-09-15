import type { Metadata, Viewport } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { AdminShell } from '../components/AdminShell';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1C1917',
};

export const metadata: Metadata = {
  title: 'لوحة تحكم الوحيد للزخرفة المعمارية والنحت',
  description: 'النظام الإداري لإدارة الكتالوج، طلبات عروض الأسعار، والمشاريع المعمارية.',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-stone-100 text-stone-900 font-arabic antialiased overflow-x-hidden">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
