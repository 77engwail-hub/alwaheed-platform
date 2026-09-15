'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  MessageSquare,
  ExternalLink,
  Compass,
  Globe,
  Layers,
  Sparkles,
  RotateCcw,
  Target,
  Maximize2,
} from 'lucide-react';

// Dynamically import Interactive Leaflet Map with no SSR
const InteractiveSatelliteMap = dynamic(
  () =>
    import('./InteractiveSatelliteMap').then((mod) => mod.InteractiveSatelliteMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] bg-stone-950 flex flex-col items-center justify-center space-y-3 rounded-3xl text-gold">
        <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        <p className="text-xs text-stone-400 font-mono">جاري تحميل طبقات الأقمار الصناعية عالية الدقة...</p>
      </div>
    ),
  }
);

export const GoogleMapSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lat = '15.3189667';
  const lng = '44.1804919';
  const googleMapsUrl = 'https://maps.app.goo.gl/Z3fP7feMjhyEeH7J9';

  // Listen to custom event from floating button or header to scroll and focus
  useEffect(() => {
    const handleTriggerEvent = () => {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('trigger-satellite-zoom', handleTriggerEvent);
    return () => window.removeEventListener('trigger-satellite-zoom', handleTriggerEvent);
  }, []);

  return (
    <section
      id="satellite-map"
      ref={sectionRef}
      className="py-12 sm:py-16 bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-3 py-1 rounded-full text-gold text-xs font-bold">
            <Globe className="w-3.5 h-3.5 text-gold animate-spin-slow" />
            <span>الموقع الجغرافي المباشر بالقمر الصناعي (انسيابي ودقيق)</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            مقر وورش ومعارض مؤسسة الوحيد للزخرفة والنحت
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            صنعاء — حده - فج عطان. شاهد موقعنا الدقيق بحركة هبوط انسيابية متواصلة وتكبير ملء الشاشة بدقة 4K.
          </p>
        </div>

        {/* Interactive In-Page Showcase Grid */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Interactive Map Column (Col 8) */}
          <div className="lg:col-span-8 relative min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] bg-stone-950 flex flex-col">
            <InteractiveSatelliteMap />
          </div>

          {/* Details & Visiting Hours Panel (Col 4) */}
          <div className="lg:col-span-4 p-5 sm:p-7 space-y-5 flex flex-col justify-between bg-stone-900 border-t lg:border-t-0 lg:border-r border-stone-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                <h3 className="text-sm sm:text-base font-extrabold text-white border-r-4 border-gold pr-2.5">
                  بيانات المقر والوصول
                </h3>
                <span className="text-[10px] text-stone-400 font-mono">
                  {lat}, {lng}
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-[13px]">
                <div className="flex items-start gap-2.5 p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-white block">العنوان الدقيق:</span>
                    <span className="text-stone-300 text-xs leading-relaxed block mt-0.5">
                      مؤسسة الوحيد للزخرفة المعمارية والنحت — صنعاء، حده - فج عطان،صنعاء — حده - فج عطان جوار شيلان البهلوان
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800">
                  <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-white block">ساعات العمل والاستقبال:</span>
                    <span className="text-stone-300 text-xs block mt-0.5">
                      24 ساعة
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800">
                  <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-white block">الاتصال المباشر والمبيعات:</span>
                    <a
                      href="tel:+967777360681"
                      className="text-gold font-mono text-xs block font-bold hover:underline"
                      dir="ltr"
                    >
                      +967 777 360 681
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action CTA Buttons */}
            <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row gap-2.5">
              <a
                href="https://wa.me/967777360681?text=السلام%20عليكم،%20أود%20زيارة%20مقر%20مؤسسة%20الوحيد%20في%20فج%20عطان"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 px-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>تأكيد موعد بالواتساب</span>
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gold hover:bg-gold-dark text-stone-950 font-extrabold py-2.5 px-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>فتح في Google Maps ↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
