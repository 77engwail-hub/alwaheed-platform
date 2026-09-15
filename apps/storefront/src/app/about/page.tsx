import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Building,
  Award,
  Layers,
  MapPin,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-stone-md text-center max-w-4xl mx-auto space-y-3">
        <span className="text-[11px] sm:text-xs font-bold text-gold tracking-widest uppercase inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>عن المؤسسة ورؤيتنا المعمارية</span>
        </span>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
          مؤسسة الوحيد للزخرفة المعمارية ونحت والمقاولات العامة
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
          انطلاقاً من موقعنا في صنعاء (حده - فج عطان)، نعمل على تجسيد أسمى آيات الفن المعماري الحجري، محافظين على التراث اليمني الأصيل ومطوعين أحدث تقنيات التشكيل الهندسي.
        </p>
      </div>

      {/* Main Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 sm:space-y-5">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gold uppercase tracking-wider block">
              رسالتنا وهويتنا
            </span>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-stone-900 leading-snug">
              الحجر الطبيعي ليس مجرد مادة بناء، بل هو هوية وأصالة معمارية
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            تأسست مؤسسة الوحيد للزخرفة المعمارية ونحت لتلبي تطلعات أصحاب الذوق الرفيع والمشاريع السكنية والتجارية الكبرى الراغبة في التميز المعماري. نمتلك ورشاً متخصصة مجهزة بآلات القص الدقيقة وفريقاً من أمهر النحاتين القادرين على تشكيل التيجان والأقواس والواجهات الحجرية المعقدة.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-stone-800">أصالة الأحجار اليمنية الطبيعية</h3>
                <p className="text-xs text-stone-500">
                  نعتمد الحجر الحبش الأسود والرمادي، والحجر البيج المأربي، والحجر السيلاني من أفضل المقالع.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-stone-800">حرفية يدوية وهندسية متقنة</h3>
                <p className="text-xs text-stone-500">
                  نحت ثلاثي الأبعاد بارز وغائر يعكس عمق الزخرفة الأندلسية والإسلامية والكلاسيكية.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-stone-100 border border-stone-200 shadow-stone-md">
          <img
            src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80"
            alt="نحت وزخرفة حجرية في ورش الوحيد"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
