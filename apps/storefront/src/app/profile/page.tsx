'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, FileText, ShoppingBag, LogOut, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function CustomerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const rawUser = localStorage.getItem('alwaheed_customer_user');
    const token = localStorage.getItem('alwaheed_customer_token');
    if (!token || !rawUser) {
      router.push('/login');
      return;
    }
    try {
      setUser(JSON.parse(rawUser));
    } catch {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('alwaheed_customer_token');
    localStorage.removeItem('alwaheed_customer_user');
    router.push('/');
  };

  if (isLoading) {
    return <div className="py-20 text-center text-stone-400">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-stone-800 border border-gold/40 flex items-center justify-center text-gold font-extrabold text-xl shadow-gold-glow">
              {user?.name ? user.name.slice(0, 2) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold">{user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold border border-gold/30">
                  عميل مميز
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono mt-0.5">{user?.email}</p>
              {user?.phone && <p className="text-xs text-stone-400 font-mono">{user?.phone}</p>}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-stone-800 border border-rose-500/30 transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Action Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/rfq"
          className="p-6 bg-white rounded-2xl border border-stone-200 hover:border-gold/60 shadow-stone-sm hover:shadow-stone-md transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <FileText className="w-4 h-4 text-gold" />
              <span>طلب عرض سعر جديد (RFQ)</span>
            </div>
            <p className="text-xs text-stone-500">
              ارفع مخططاً هندسياً أو اطلب تسعير واجهة حجرية أو نقش خاص.
            </p>
          </div>
          <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-gold group-hover:-translate-x-1 transition-all" />
        </Link>

        <Link
          href="/rfq/track"
          className="p-6 bg-white rounded-2xl border border-stone-200 hover:border-gold/60 shadow-stone-sm hover:shadow-stone-md transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>تتبع حالة عرض السعر والمعاملات</span>
            </div>
            <p className="text-xs text-stone-500">
              أدخل رقم المعاملة للاطلاع على السعر المعتمد والمخططات الفنية.
            </p>
          </div>
          <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-gold group-hover:-translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
