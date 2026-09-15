'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Bell, ExternalLink, ShieldCheck } from 'lucide-react';

export const AdminHeader: React.FC = () => {
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
    <header className="h-16 bg-white border-b border-stone-200 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-stone-600 hover:text-gold-dark flex items-center gap-1.5 py-1 px-3 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>زيارة واجهة المتجر والمعرض المعماري</span>
        </a>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="flex items-center gap-2.5 text-xs p-1.5 pr-3 rounded-2xl hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-all group"
        >
          <div className="text-right">
            <span className="font-extrabold text-stone-900 group-hover:text-gold-dark transition-colors block">
              {userName}
            </span>
            <span className="text-[10px] text-stone-500 font-mono">الملف الشخصي والأمان ↗</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-stone-900 text-gold flex items-center justify-center font-bold shadow-inner group-hover:scale-105 transition-transform">
            <User className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </header>
  );
};
