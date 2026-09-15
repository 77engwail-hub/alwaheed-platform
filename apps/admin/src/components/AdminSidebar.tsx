'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Boxes,
  Building,
  ShoppingBag,
  CreditCard,
  Image as ImageIcon,
  Settings,
  ShieldCheck,
  LogOut,
  User,
  Users,
  Rss,
  Sparkles,
} from 'lucide-react';
import { removeAdminToken } from '../lib/admin-api';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'لوحة المؤشرات العامة', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/posts', label: 'المنشورات والعروض والمقالات', icon: <Rss className="w-4 h-4" /> },
    { href: '/payments', label: 'مركز التحقق والمدفوعات الذكية', icon: <CreditCard className="w-4 h-4" /> },
    { href: '/quotations', label: 'طلبات عروض الأسعار (RFQ)', icon: <FileText className="w-4 h-4" /> },
    { href: '/products', label: 'إدارة المنتجات والأحجار', icon: <Boxes className="w-4 h-4" /> },
    { href: '/projects', label: 'إدارة سابقة الأعمال والمشاريع', icon: <Building className="w-4 h-4" /> },
    { href: '/orders', label: 'أوامر الشراء المباشر', icon: <ShoppingBag className="w-4 h-4" /> },
    { href: '/users', label: 'إدارة المستخدمين والصلاحيات', icon: <Users className="w-4 h-4" /> },
    { href: '/media', label: 'مكتبة الوسائط والصور', icon: <ImageIcon className="w-4 h-4" /> },
    { href: '/profile', label: 'الملف الشخصي والحماية', icon: <User className="w-4 h-4" /> },
    { href: '/settings', label: 'إعدادات المنصة والتواصل', icon: <Settings className="w-4 h-4" /> },
    { href: '/audit', label: 'سجلات التدقيق والأمان', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleLogout = () => {
    removeAdminToken();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-stone-950 text-stone-300 border-l border-stone-800 flex flex-col justify-between shrink-0 min-h-screen">
      <div className="p-5 space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
          <div className="w-10 h-10 rounded-lg bg-stone-900 border border-gold/40 flex items-center justify-center text-gold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-stone-100 block">لوحة تحكم الوحيد</span>
            <span className="text-[11px] text-gold font-medium">الإدارة الهندسية والمبيعات</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gold text-stone-950 font-bold shadow-sm'
                    : 'text-stone-300 hover:bg-stone-900 hover:text-gold'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-stone-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-stone-900 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};
