import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { AdminShell } from '../components/AdminShell';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
});

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
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
