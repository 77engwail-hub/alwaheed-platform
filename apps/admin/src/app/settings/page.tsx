'use client';

import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../lib/admin-api';
import { Settings, Save, CheckCircle2, AlertCircle, Phone, MessageSquare, MapPin } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    STORE_NAME_AR: '',
    STORE_NAME_EN: '',
    STORE_PHONE: '',
    STORE_WHATSAPP: '',
    STORE_LOCATION: '',
    STORE_CURRENCY: 'YER',
    BUSINESS_HOURS: '',
    FACEBOOK_URL: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    adminFetch('/settings')
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }));
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
      setFeedback({ type: 'success', message: 'تم حفظ وتحديث الإعدادات بنجاح!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'فشل حفظ الإعدادات' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">إعدادات المنصة والهوية التجارية</h1>
        <p className="text-xs text-stone-500">
          تعديل أرقام التواصل، الواتساب، الموقع الجغرافي، ساعات العمل، والروابط الرسمية
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
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

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-stone-sm space-y-6 text-xs">
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
                className="w-full p-3 rounded-xl border border-stone-300 outline-none"
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

        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-sm font-bold text-stone-900 border-r-4 border-gold pr-2">
            2. أرقام التواصل والموقع (المعتمدة)
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

        <button
          type="submit"
          disabled={isSaving}
          className="bg-stone-900 hover:bg-stone-800 text-gold font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
        </button>
      </form>
    </div>
  );
}
