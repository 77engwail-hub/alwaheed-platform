'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, Sparkles, Filter, X, ZoomIn, ArrowLeft } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'واجهة قصر ملكي - حجر بيج وحبش أسود',
    category: 'facades',
    categoryLabel: 'واجهات فلل وقصور',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    desc: 'تنفيذ كامل لكسوة الواجهة بأحجار البيج المأربي وقواعد الحجر الحبش الأسود.',
    location: 'حده، صنعاء',
  },
  {
    id: 2,
    title: 'تيجان وأعمدة كورنثية رومانية منحوتة',
    category: 'carvings',
    categoryLabel: 'تيجان وأعمدة',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=85',
    desc: 'نحت وتشكيل آلي فائق الدقة بمكائن CNC ومخارط الأعمدة المبرومة والمضلعة.',
    location: 'صنعاء',
  },
  {
    id: 3,
    title: 'أقواس ومداخل حجرية إسلامية أصيلة',
    category: 'arches',
    categoryLabel: 'أقواس ومداخل',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    desc: 'تشكيل عقد إسلامي مدبب مع زخارف هندسية غائرة وإطارات حجرية متداخلة.',
    location: 'عطان، صنعاء',
  },
  {
    id: 4,
    title: 'نافورة وشلال حجر طبيعي كلاسيكي',
    category: 'fountains',
    categoryLabel: 'ديكورات ونوافير',
    image: 'https://images.unsplash.com/photo-1584467741267-b6e0b06869b9?auto=format&fit=crop&w=1200&q=85',
    desc: 'نافورة حجرية منحوتة من قطعة واحدة مع أحواض رخامية متعددة الطبقات.',
    location: 'صنعاء',
  },
  {
    id: 5,
    title: 'مشربية حجرية مفرغة ونوافذ تراثية',
    category: 'carvings',
    categoryLabel: 'تيجان ونقوش',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    desc: 'نقوش هندسية مفرغة تسمح بمرور الضوء بنمط العمارة الصنعانية الفريدة.',
    location: 'صنعاء القديمة - الطابع الحديث',
  },
  {
    id: 6,
    title: 'واجهة فيلا حديثة - حجر حبش مودرن',
    category: 'facades',
    categoryLabel: 'واجهات فلل وقصور',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    desc: 'تصميم مودرن يدمج الحجر الحبش الأسود مع الإضاءات المخفية والزجاج.',
    location: 'بيت بوس، صنعاء',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'كافة الأعمال' },
  { key: 'facades', label: 'واجهات الفلل والقصور' },
  { key: 'carvings', label: 'التيجان والأعمدة والنقوش' },
  { key: 'arches', label: 'الأقواس والمداخل' },
  { key: 'fountains', label: 'النوافير والديكورات' },
];

export const InteractiveMasonryGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxImage, setLightboxImage] = useState<any | null>(null);

  const filteredItems =
    activeTab === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section className="py-12 sm:py-16 bg-stone-950 text-stone-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-5">
          <div className="space-y-2.5 max-w-xl">
            <span className="text-[11px] sm:text-xs font-bold text-gold tracking-widest uppercase inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>معرض الإبداع المعماري الحي</span>
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
              روائع المشروعات الحجرية المنفذة
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              شاهد تفاصيل النحت وزخرفة الواجهات والأعمدة المنفذة بأعلى معايير الإتقان والفخامة.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveTab(c.key)}
                className={`text-xs px-3.5 py-1.5 rounded-xl transition-all font-bold ${
                  activeTab === c.key
                    ? 'bg-gold text-stone-950 shadow-gold-glow'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-xl cursor-pointer"
              onClick={() => setLightboxImage(item)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Floating Category Badge */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-950/80 text-gold border border-gold/40 backdrop-blur-md">
                    {item.categoryLabel}
                  </span>
                </div>

                {/* Hover Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-2xl bg-gold/90 text-stone-950 flex items-center justify-center shadow-gold-glow transform scale-75 group-hover:scale-100 transition-transform">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-3.5 inset-x-4 space-y-1 text-right">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-1">{item.desc}</p>
                  <span className="text-[10px] text-gold font-mono block pt-0.5">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-gold text-stone-200 hover:text-white text-xs font-bold px-6 py-3 rounded-xl transition-all"
          >
            <span>استعراض كافة المشاريع وسابقة الأعمال (Portfolio)</span>
            <ArrowLeft className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-stone-950 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={lightboxImage.image}
                alt={lightboxImage.title}
                className="w-full max-h-[70vh] object-contain"
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-stone-900/80 text-white hover:bg-gold hover:text-stone-950 flex items-center justify-center transition-all border border-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-2 text-right">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-gold/20 text-gold border border-gold/40">
                {lightboxImage.categoryLabel}
              </span>
              <h3 className="text-xl font-bold text-white">{lightboxImage.title}</h3>
              <p className="text-xs text-stone-300 leading-relaxed">{lightboxImage.desc}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
