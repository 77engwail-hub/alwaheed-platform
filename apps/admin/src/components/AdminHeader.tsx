'use client';

import React, { useState, useEffect } from 'react';
import { User, Bell, ExternalLink } from 'lucide-react';

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
        <div className="flex items-center gap-2 text-xs">
          <div className="w-8 h-8 rounded-full bg-stone-900 text-gold flex items-center justify-center font-bold">
            <User className="w-4 h-4" />
          </div>
          <div className="text-right">
            <span className="font-bold text-stone-900 block">{userName}</span>
            <span className="text-[10px] text-stone-500 font-mono">SUPER_ADMIN</span>
          </div>
        </div>
      </div>
    </header>
  );
};
