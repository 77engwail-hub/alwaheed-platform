'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const phone = '967777360681';
  const message = encodeURIComponent(
    'السلام عليكم ورحمة الله وبركاته، أود الاستفسار عن أعمال ونقوش الحجر والواجهات وتفاصيل الأسعار لدى مؤسسة الوحيد للزخرفة المعمارية.'
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group border border-emerald-400/40"
      aria-label="تواصل مباشر عبر الواتساب"
    >
      <MessageSquare className="w-6 h-6 animate-pulse" />
      <span className="hidden sm:inline text-sm font-medium">استفسر عبر واتساب</span>
    </a>
  );
};
