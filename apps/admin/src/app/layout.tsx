import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';

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
      <body className="min-h-screen flex bg-stone-100 text-stone-900 font-arabic">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
