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
  X,
} from 'lucide-react';
import { removeAdminToken } from '../lib/admin-api';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen = false, onClose }) => {
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
    if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
      removeAdminToken();
      window.location.href = '/login';
    }
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="p-4 sm:p-5 space-y-5">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-100 block">لوحة تحكم الوحيد</span>
              <span className="text-[11px] text-gold font-medium block">الإدارة الهندسية والمبيعات</span>
            </div>
          </div>

          {/* Close Button on Mobile Drawer */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-190px)] pr-0.5">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onClose?.()}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gold text-stone-950 font-bold shadow-sm'
                    : 'text-stone-300 hover:bg-stone-900 hover:text-gold active:bg-stone-800'
                }`}
              >
                <span className="shrink-0">{link.icon}</span>
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-stone-800/80 bg-stone-950/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-900/30"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج من النظام</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Static Sidebar (Strictly hidden on mobile/tablet) */}
      <aside className="admin-desktop-sidebar hidden lg:flex w-64 bg-stone-950 text-stone-300 border-l border-stone-800 flex-col shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto z-30 select-none">
        {navContent}
      </aside>

      {/* 2. Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 lg:hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* 3. Mobile Drawer Aside (Slide-over from right in RTL) */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-stone-950 text-stone-300 border-l border-stone-800 shadow-2xl transition-all duration-300 ease-in-out lg:hidden flex flex-col ${
          isOpen ? 'translate-x-0 pointer-events-auto visible' : 'translate-x-full pointer-events-none invisible'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
};

