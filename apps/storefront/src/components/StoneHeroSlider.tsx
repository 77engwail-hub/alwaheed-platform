'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, FileText, ChevronRight, ChevronLeft, Shield, Award, Layers } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'نحوّل الحجر الطبيعي إلى صروح معمارية وتحف فنية خالدة',
    subtitle: 'أرقى الواجهات الحجرية للفلل والقصور الملكية، بتشكيل وزخرفة الحجر البيج المأربي والحجر الحبش الأسود بأعلى معايير الدقة الهندسية.',
    tag: 'واجهات حجرية ملكية',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85',
    accent: 'حجر بيج مأربي + حبش أسود',
  },
  {
    id: 2,
    title: 'نحت التيجان والأعمدة والأقواس بروح العمارة الأصيلة',
    subtitle: 'تشكيل تيجان كورنثية وإسلامية، أعمدة مبرومة ومضلعة، وإطارات شبابيك ومشربيات حجرية بدقة متناهية تحاكي الفخامة التاريخية.',
    tag: 'نحت وزخرفة معمارية',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1920&q=85',
    accent: 'نحت آلي بالمكائن الحديثة CNC والمخارط',
  },
  {
    id: 3,
    title: 'توريد أجود أحجار البناء والرخام والجرانيت الطبيعي',
    subtitle: 'أحجار بناء طبيعية بمختلف المقاسات والقصّات (بوشارد، طبزة، مجلي، منشار) مباشرة من المقالع إلى موقع مشروعك في صنعاء وكافة المحافظات.',
    tag: 'توريد أحجار البناء',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=85',
    accent: 'جودة صلابة وتحمل استثنائية',
  },
];

export const StoneHeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex items-center bg-stone-950 overflow-hidden">
      {/* Background Slides with Ken-Burns and Crossfade */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className={`w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out ${
              idx === currentSlide ? 'scale-105' : 'scale-100'
            }`}
          />
          {/* Luxury Stone Dark & Gold Ambient Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>
      ))}

      {/* Decorative Gold Border Lines */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent z-20" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent z-20" />

      {/* Slide Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-2xl space-y-4 sm:space-y-5">
          {/* Animated Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/90 border border-gold/40 text-gold text-xs font-bold backdrop-blur-md shadow-gold-glow animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-spin-slow" />
            <span>{slide.tag}</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-300 font-normal">{slide.accent}</span>
          </div>

          {/* Headline - Refined Desktop & Mobile Scale */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-extrabold text-white leading-[1.3] tracking-tight drop-shadow-md">
            {slide.title}
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm lg:text-[14px] text-stone-300 leading-relaxed max-w-xl drop-shadow">
            {slide.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/rfq"
              className="bg-gold hover:bg-gold-dark text-stone-950 font-bold px-5 py-3 lg:px-6 lg:py-3.5 rounded-xl flex items-center gap-2 shadow-md hover:shadow-gold-glow transition-all duration-300 text-xs sm:text-sm hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>اطلب دراسة ومخطط مجاني (RFQ)</span>
            </Link>

            <Link
              href="/projects"
              className="bg-stone-900/80 hover:bg-stone-800 text-stone-100 border border-stone-700/80 hover:border-gold/60 font-bold px-5 py-3 lg:px-6 lg:py-3.5 rounded-xl flex items-center gap-2 transition-all duration-300 text-xs sm:text-sm backdrop-blur-sm"
            >
              <span>تصفح سابقة أعمالنا</span>
              <ArrowLeft className="w-4 h-4 text-gold" />
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 border-t border-stone-800/80 grid grid-cols-3 gap-3 text-stone-300 text-xs">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="text-[11px] sm:text-xs">أحجار طبيعية 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="text-[11px] sm:text-xs">نحت آلي CNC ومخارط</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="text-[11px] sm:text-xs">ضمان جودة التركيب</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-8 bg-gold' : 'w-2.5 bg-stone-600 hover:bg-stone-400'
            }`}
            aria-label={`الشريحة ${idx + 1}`}
          />
        ))}
      </div>

      {/* Arrow Nav Buttons */}
      <div className="hidden sm:flex absolute bottom-6 right-6 z-30 items-center gap-2">
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
          className="w-10 h-10 rounded-full bg-stone-900/80 border border-stone-700 hover:border-gold text-stone-300 hover:text-gold flex items-center justify-center transition-all backdrop-blur-sm"
          aria-label="السابق"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="w-10 h-10 rounded-full bg-stone-900/80 border border-stone-700 hover:border-gold text-stone-300 hover:text-gold flex items-center justify-center transition-all backdrop-blur-sm"
          aria-label="التالي"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
