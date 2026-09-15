import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, MapPin, Sparkles, Clock, ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800/80 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-stone-800/60">
          {/* Column 1: Identity & About */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-stone-900 border border-gold/40 flex items-center justify-center text-gold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-stone-100">
                الوحيد للزخرفة المعمارية
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-stone-400 leading-relaxed">
              المؤسسة الرائدة في نحت وزخرفة الأحجار الطبيعية والرخام، تنفيذ أرقى الواجهات الحجرية للفلل والقصور، وتشكيل التيجان والأعمدة الملكية في الجمهورية اليمنية.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="p-2 bg-stone-900 rounded border border-stone-800 flex items-center gap-1.5 text-xs text-gold">
                <Award className="w-3.5 h-3.5 text-gold" />
                <span className="text-[11px]">حرفية معمارية وأحجار طبيعية 100%</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-100 tracking-wider uppercase border-r-2 border-gold pr-2">
              أقسام الكتالوج
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-[13px] text-stone-400">
              <li>
                <Link href="/products?category=facades" className="hover:text-gold transition-colors">
                  واجهات حجرية ورخام للفلل والقصور
                </Link>
              </li>
              <li>
                <Link href="/products?category=columns-capitals" className="hover:text-gold transition-colors">
                  تيجان وأعمدة وقواعد رومانية
                </Link>
              </li>
              <li>
                <Link href="/products?category=carvings-motifs" className="hover:text-gold transition-colors">
                  نقوش وزخارف حجرية يدوية
                </Link>
              </li>
              <li>
                <Link href="/products?category=mashrabiyas-frames" className="hover:text-gold transition-colors">
                  مشربيات وإطارات شبابيك مقوسة
                </Link>
              </li>
              <li>
                <Link href="/products?category=fountains-decors" className="hover:text-gold transition-colors">
                  شلالات ونوافير وديكورات حجرية
                </Link>
              </li>
              <li>
                <Link href="/products?category=building-stones" className="hover:text-gold transition-colors">
                  توريد أحجار البناء والكسوات
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services & Quotations */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-100 tracking-wider uppercase border-r-2 border-gold pr-2">
              الخدمات والتسعير
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-[13px] text-stone-400">
              <li>
                <Link href="/rfq" className="hover:text-gold transition-colors font-semibold text-gold">
                  ✦ اطلب عرض سعر لمشروعك (RFQ)
                </Link>
              </li>
              <li>
                <Link href="/rfq/track" className="hover:text-gold transition-colors">
                  تتبع حالة طلب السعر والمخططات
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-gold transition-colors">
                  معرض المشاريع المنفذة (قبل / بعد)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold transition-colors">
                  مقاولات وتكسية وتركيب الواجهات
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  المحاجر وأنواع الحجر الطبيعي
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Verified Contact & Location */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-100 tracking-wider uppercase border-r-2 border-gold pr-2">
              بيانات التواصل والموقع
            </h3>
            <div className="space-y-2.5 text-xs sm:text-[13px] text-stone-400">
              <a
                href="https://maps.app.goo.gl/Z3fP7feMjhyEeH7J9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 group hover:text-gold transition-colors"
                title="فتح الموقع على خرائط Google Maps"
              >
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-stone-300 group-hover:text-gold block">حده - فج عطان، صنعاء، اليمن</span>
                  <span className="text-[10px] text-gold/80 block mt-0.5 font-bold">خرائط Google ↗</span>
                </div>
              </a>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <a href="tel:+967777360681" className="hover:text-gold font-mono" dir="ltr">
                  +967 777 360 681
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/967777360681"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 font-mono text-emerald-400"
                  dir="ltr"
                >
                  +967 777 360 681 (WhatsApp)
                </a>
              </div>
              <div className="flex items-start gap-2 pt-0.5 text-[11px] text-stone-400">
                <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>السبت - الخميس: 8:00 ص - 8:00 م</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-400 gap-3">
          <p>© {new Date().getFullYear()} مؤسسة الوحيد للزخرفة المعمارية ونحت والمقاولات العامة. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://maps.app.goo.gl/Z3fP7feMjhyEeH7J9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-gold transition-colors flex items-center gap-1"
            >
              <MapPin className="w-3 h-3 text-gold" />
              <span>صنعاء - فج عطان</span>
            </a>
            <a
              href="https://www.facebook.com/people/%D8%A7%D9%84%D9%88%D8%AD%D9%8A%D8%AF-%D9%84%D9%84%D8%B2%D8%AE%D8%B1%D9%81%D9%88-%D8%A7%D9%84%D9%85%D8%B9%D9%85%D8%A7%D8%B1%D9%8A%D9%87-%D9%88%D9%86%D8%AD%D8%AA-%D9%88%D8%A7%D9%84%D9%85%D9%82%D8%A7%D9%88%D9%84%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D8%A7%D9%85%D9%87-%D8%AD%D8%AF%D9%87-%D9%81%D8%AC-%D8%B9%D8%B7%D8%A7%D9%86-770663641/100067643884572/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              Facebook الرسمية
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
