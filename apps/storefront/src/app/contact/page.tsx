'use client';

import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

import { GoogleMapSection } from '../../components/GoogleMapSection';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiUrl}/api/v1/settings/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'فشل إرسال الرسالة');

      setSuccessMsg(data.message || 'تم إرسال رسالتك بنجاح، وسنتواصل معك سريعاً.');
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء إرسال الرسالة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2.5 max-w-2xl mx-auto">
        <span className="text-[11px] sm:text-xs font-bold text-gold tracking-widest uppercase inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>تواصل مباشر مع الإدارة والورش</span>
        </span>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900">
          تواصل مع مؤسسة الوحيد للزخرفة المعمارية
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          يسعدنا استقبال استفساراتكم وزيارتكم في مقرنا ومعارضنا في صنعاء، أو التواصل مباشرة عبر الهاتف والواتساب.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Information Sidebar */}
        <div className="lg:col-span-5 bg-stone-950 text-stone-200 rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-stone-md space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white border-r-4 border-gold pr-3">
              المقر الرئيسي ومعلومات الاتصال
            </h2>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                <div>
                  <span className="font-bold text-stone-100 block">العنوان والموقع الجغرافي:</span>
                  <span className="text-stone-400 block">حده - فج عطان، صنعاء، الجمهورية اليمنية</span>
                  <a
                    href="https://maps.app.goo.gl/Z3fP7feMjhyEeH7J9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline font-bold mt-1.5 bg-stone-900 px-3 py-1.5 rounded-lg border border-gold/40"
                  >
                    <span>فتح الموقع في خرائط Google Maps ↗</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0 mt-1" />
                <div>
                  <span className="font-bold text-stone-100 block">رقم الهاتف المباشر:</span>
                  <a href="tel:+967777360681" className="text-stone-300 hover:text-gold font-mono" dir="ltr">
                    +967 777 360 681
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <span className="font-bold text-stone-100 block">خدمة عملاء الواتساب:</span>
                  <a
                    href="https://wa.me/967777360681"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-mono"
                    dir="ltr"
                  >
                    +967 777 360 681
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-stone-400 shrink-0 mt-1" />
                <div>
                  <span className="font-bold text-stone-100 block">ساعات العمل:</span>
                  <span className="text-stone-400">السبت - الخميس: 8:00 صباحاً - 8:00 مساءً</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 space-y-3">
            <a
              href="https://maps.app.goo.gl/Z3fP7feMjhyEeH7J9"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-stone-900 hover:bg-stone-800 text-gold border border-gold/40 py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 font-bold transition-all"
            >
              <MapPin className="w-4 h-4 text-gold" />
              <span>الاتجاهات والملاحة عبر Google Maps</span>
            </a>
            <a
              href="https://www.facebook.com/people/%D8%A7%D9%84%D9%88%D8%AD%D9%8A%D8%AF-%D9%84%D9%84%D8%B2%D8%AE%D8%B1%D9%81%D9%87-%D8%A7%D9%84%D9%85%D8%B9%D9%85%D8%A7%D8%B1%D9%8A%D9%87-%D9%88%D9%86%D8%AD%D8%AA-%D9%88%D8%A7%D9%84%D9%85%D9%82%D8%A7%D9%88%D9%84%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D8%A7%D9%85%D9%87-%D8%AD%D8%AF%D9%87-%D9%81%D8%AC-%D8%B9%D8%B7%D8%A7%D9%86-770663641/100067643884572/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-stone-400 hover:text-gold block text-center"
            >
              صفحة فيسبوك الرسمية للمؤسسة ↗
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-stone-sm space-y-6">
          <h2 className="text-xl font-bold text-stone-900 border-r-4 border-gold pr-3">
            أرسل لنا استفسارك أو رسالتك
          </h2>

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">الاسم *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="اسمك الكريم"
                  className="w-full text-sm px-4 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">رقم الهاتف *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="رقم للتواصل والرد"
                  className="w-full text-sm px-4 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">موضوع الرسالة *</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="مثال: استفسار عن توريد حجر حبش لفيلا سكنية"
                className="w-full text-sm px-4 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">الرسالة والتفاصيل *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="اكتب رسالتك أو استفسارك هنا بالتفصيل..."
                className="w-full text-sm px-4 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-stone-900 hover:bg-stone-800 text-gold font-bold text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة الآن'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Google Maps Location Section */}
      <div className="pt-8 border-t border-stone-200">
        <GoogleMapSection />
      </div>
    </div>
  );
}
