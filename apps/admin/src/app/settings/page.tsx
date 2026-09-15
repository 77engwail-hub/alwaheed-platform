'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminFetch } from '../../lib/admin-api';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  MapPin,
  Palette,
  Sliders,
  Wallet,
  Globe,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    STORE_NAME_AR: 'مؤسسة الوحيد للزخرفة المعمارية والنحت',
    STORE_NAME_EN: 'Al-Waheed Stone & Architectural Carving',
    STORE_PHONE: '+967 777 360 681',
    STORE_WHATSAPP: '967777360681',
    STORE_LOCATION: 'صنعاء - حده - فج عطان',
    STORE_CURRENCY: 'YER',
    BUSINESS_HOURS: 'السبت - الخميس: 8:00 صباحاً - 8:00 مساءً',
    FACEBOOK_URL: 'https://www.facebook.com/people/%D8%A7%D9%84%D9%88%D8%AD%D9%8A%D8%AF-%D9%84%D9%84%D8%B2%D8%AE%D8%B1%D9%81%D9%87-%D8%A7%D9%84%D9%85%D8%B9%D9%85%D8%A7%D8%B1%D9%8A%D9%87-%D9%88%D9%86%D8%AD%D8%AA-%D9%88%D8%A7%D9%84%D9%85%D9%82%D8%A7%D9%88%D9%84%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D8%A7%D9%85%D9%87-%D8%AD%D8%AF%D9%87-%D9%81%D8%AC-%D8%B9%D8%B7%D8%A7%D9%86-770663641/100067643884572/',
    GOOGLE_MAPS_URL: 'https://maps.app.goo.gl/Z3fP7feMjhyEeH7J9',
    DEFAULT_THEME: 'dark',
    DEFAULT_FONT_FAMILY: 'tajawal',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    adminFetch('/settings')
      .then((data) => {
        if (data && typeof data === 'object') {
          setSettings((prev) => ({ ...prev, ...data }));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      for (const [key, value] of Object.entries(settings)) {
        await adminFetch('/settings/admin', {
          method: 'PUT',
          body: JSON.stringify({ key, value }),
        });
      }
      setFeedback({ type: 'success', message: 'تم حفظ وتحديث كافة الإعدادات بنجاح!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'فشل حفظ الإعدادات' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200/60 sm:border-none">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">إعدادات المنصة والمظهر العام</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            تعديل الهوية، أرقام التواصل، الموقع الجغرافي، الثيمات الافتراضية، وبوابات الدفع
          </p>
        </div>

        <Link
          href="/settings/payment-providers"
          className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-stone-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Wallet className="w-4 h-4" />
          <span>إدارة حسابات المحافظ ↗</span>
        </Link>
      </div>

      {feedback && (
        <div
          className={`p-3.5 sm:p-4 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200 shadow-stone-sm space-y-6 text-xs">
        {/* Section 1: Store Identity */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 border-r-4 border-gold pr-2">
            1. الهوية والاسم التجاري
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-stone-700">الاسم التجاري بالعربية</label>
              <input
                type="text"
                value={settings.STORE_NAME_AR}
                onChange={(e) => setSettings({ ...settings, STORE_NAME_AR: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-300 outline-none font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-700">الاسم بالإنجليزية</label>
              <input
                type="text"
                value={settings.STORE_NAME_EN}
                onChange={(e) => setSettings({ ...settings, STORE_NAME_EN: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-300 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-sm font-bold text-stone-900 border-r-4 border-gold pr-2">
            2. أرقام التواصل والموقع الجغرافي
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-stone-700">رقم الهاتف المباشر</label>
              <input
                type="text"
                value={settings.STORE_PHONE}
                onChange={(e) => setSettings({ ...settings, STORE_PHONE: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-300 outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-700">رقم الواتساب الرسمي (للأزرار التلقائية)</label>
              <input
                type="text"
                value={settings.STORE_WHATSAPP}
                onChange={(e) => setSettings({ ...settings, STORE_WHATSAPP: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-300 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-stone-700">الموقع الجغرافي / المقر</label>
              <input
                type="text"
                value={settings.STORE_LOCATION}
                onChange={(e) => setSettings({ ...settings, STORE_LOCATION: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-300 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-700">ساعات وأيام العمل</label>
              <input
                type="text"
                value={settings.BUSINESS_HOURS}
                onChange={(e) => setSettings({ ...settings, BUSINESS_HOURS: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-300 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">رابط خرائط جوجل الرسمي (Google Maps):</label>
            <input
              type="url"
              value={settings.GOOGLE_MAPS_URL}
              onChange={(e) => setSettings({ ...settings, GOOGLE_MAPS_URL: e.target.value })}
              className="w-full p-3 rounded-xl border border-stone-300 outline-none font-mono text-left"
              dir="ltr"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">رابط صفحة فيسبوك الرسمية</label>
            <input
              type="url"
              value={settings.FACEBOOK_URL}
              onChange={(e) => setSettings({ ...settings, FACEBOOK_URL: e.target.value })}
              className="w-full p-3 rounded-xl border border-stone-300 outline-none font-mono text-left"
              dir="ltr"
            />
          </div>
        </div>

        {/* Section 3: Appearance & Defaults */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-sm font-bold text-stone-900 border-r-4 border-gold pr-2 flex items-center gap-2">
            <Palette className="w-4 h-4 text-gold" />
            <span>3. الثيم والمظهر الافتراضي للمنصة</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-stone-700">الثيم المعماري الافتراضي للزوار</label>
              <select
                value={settings.DEFAULT_THEME}
                onChange={(e) => setSettings({ ...settings, DEFAULT_THEME: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-300 outline-none bg-white font-bold"
              >
                <option value="dark">👑 الملكي الأسود والذهب (Dark Obsidian)</option>
                <option value="light">🏛️ الرخام الإمبراطوري الأبيض (Imperial Light)</option>
                <option value="heritage">🏺 التراث الصنعاني العريق (Heritage)</option>
                <option value="emerald">💎 الزمردي المعماري الفاخر (Emerald)</option>
                <option value="sapphire">🌌 اللازوردي الكريستالي (Sapphire)</option>
                <option value="sandstone">🏜️ الحجر الرملي الصحراوي (Sandstone)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">الخط العربي الافتراضي</label>
              <select
                value={settings.DEFAULT_FONT_FAMILY}
                onChange={(e) => setSettings({ ...settings, DEFAULT_FONT_FAMILY: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-300 outline-none bg-white font-bold"
              >
                <option value="tajawal">خط تجوال (Tajawal)</option>
                <option value="alexandria">خط الإسكندرية (Alexandria)</option>
                <option value="almarai">خط المراعي (Almarai)</option>
                <option value="cairo">خط القاهرة (Cairo)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-gold hover:bg-gold-dark text-stone-950 font-extrabold px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'جاري الحفظ...' : 'حفظ وتطبيق التعديلات'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
