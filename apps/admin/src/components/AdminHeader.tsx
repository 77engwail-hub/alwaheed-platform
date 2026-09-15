'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, ExternalLink, Menu, Sparkles } from 'lucide-react';

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileMenu }) => {
  const [userName, setUserName] = useState('مدير النظام');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('alwaheed_admin_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setUserName(u.name);
      }
    } catch {}
  }, []);

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-stone-200 px-2.5 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0 w-full max-w-full">
      {/* Right Side (RTL): Hamburger menu & Store Link */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Mobile Hamburger Toggle Button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 border border-stone-200 transition-colors flex items-center justify-center"
            aria-label="فتح قائمة التنقل"
            title="القائمة الرئيسية"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Mobile Brand Mark */}
        <div className="flex lg:hidden items-center gap-1.5 pl-1">
          <div className="w-7 h-7 rounded-lg bg-stone-900 border border-gold/40 flex items-center justify-center text-gold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Storefront Link */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-stone-700 hover:text-gold-dark flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors font-medium"
        >
          <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
          <span className="hidden sm:inline">زيارة واجهة المتجر والمعرض المعماري</span>
          <span className="inline sm:hidden text-[11px]">المتجر ↗</span>
        </a>
      </div>

      {/* Left Side (RTL): Profile & User info */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/profile"
          className="flex items-center gap-2 sm:gap-2.5 text-xs p-1 sm:p-1.5 pr-2 sm:pr-3 rounded-2xl hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-all group max-w-[180px] sm:max-w-none"
        >
          <div className="text-right hidden xs:block">
            <span className="font-extrabold text-stone-900 group-hover:text-gold-dark transition-colors block truncate max-w-[120px] sm:max-w-[180px]">
              {userName}
            </span>
            <span className="text-[10px] text-stone-500 font-mono block">الملف والأمان</span>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-900 text-gold flex items-center justify-center font-bold shadow-inner group-hover:scale-105 transition-transform shrink-0">
            <User className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </header>
  );
};

