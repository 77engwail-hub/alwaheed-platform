'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Sparkles, Check, ArrowLeft, Ruler, ShieldCheck, Eye } from 'lucide-react';

const STONE_COLLECTIONS = [
  {
    id: 'marib-beige',
    name: 'حجر بيج مأربي ملكي',
    origin: 'مأرب - اليمن',
    tag: 'الأكثر طلباً للواجهات الفخمة',
    color: '#d4b886',
    description: 'يتميز بلونه الرملي الدافئ وصلابته الفائقة ومقاومته لتغيرات المناخ والرطوبة، خيار النخبة لقصور وفلل الطابع الملكي.',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=85',
    finishes: ['بوشارد ناعم', 'طبزة معمارية بارزة', 'مجلي لمعة خفيفة', 'قص منشار ومكائن دقيقة'],
    specs: { density: '2.65 جم/سم³', absorption: '0.8%', hardness: 'عالية جداً' },
    bestFor: 'واجهات الفلل، الكرانيش، التيجان الرومانية، والأعمدة الفخمة',
  },
  {
    id: 'habash-black',
    name: 'حجر حبش أسود بركاني',
    origin: 'اليمن - أحجار بركانية بازلتية',
    tag: 'فخامة وتباين معماري فريد',
    color: '#2b2b2b',
    description: 'حجر بازلتي بركاني أسود غامق شديد الصلابة، يمنح الواجهات تبايناً هندسياً مبهراً عند دمجه مع الحجر البيج أو الأبيض.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    finishes: ['طبزة خشنة', 'بوشارد خشن', 'منشار مساوي', 'نحت وزخرفة'],
    specs: { density: '2.90 جم/سم³', absorption: '0.3%', hardness: 'صلابة بازلتية قصوى' },
    bestFor: 'القواعد السفلية، الإطارات، الأحزمة الزخرفية، والشلالات',
  },
  {
    id: 'saylani-white',
    name: 'حجر أبيض سيلاني ناصع',
    origin: 'اليمن',
    tag: 'نقاء وعراقة إسلامية',
    color: '#e8e8e6',
    description: 'حجر أبيض طبيعي موحد اللون ذو مسامية منخفضة وسطح نقي، مثالي للأقواس والمشربيات والزخارف الإسلامية الدقيقة.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    finishes: ['مجلي ناعم', 'نحت زخرفي مفرغ', 'قص ليزر دقيق', 'بوشارد'],
    specs: { density: '2.60 جم/سم³', absorption: '1.1%', hardness: 'ممتازة للنحت' },
    bestFor: 'الأقواس، المشربيات، التيجان المنحوتة، والواجهات الكلاسيكية',
  },
  {
    id: 'natural-marble',
    name: 'رخام وجرانيت يمني طبيعي',
    origin: 'اليمن وخامات مستوردة مختارة',
    tag: 'لمعان وديكورات داخلية وخارجية',
    color: '#bfa888',
    description: 'رخام طبيعي عالي الكثافة بعروق جمالية متناسقة، مخصص للمداخل الملكية والأرضيات والنوافير والجداريات الحجرية الفاخرة.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
    finishes: ['مجلي كريستال عاكس', 'معتق أنتيك', 'مات غير لامع', 'بوشارد أمان'],
    specs: { density: '2.72 جم/سم³', absorption: '0.2%', hardness: 'مقاومة للاحتكاك' },
    bestFor: 'المداخل، السلالم، النوافير، وتكسية الجدران الداخلية',
  },
];

export const InteractiveStoneVisualizer: React.FC = () => {
  const [selectedStone, setSelectedStone] = useState(STONE_COLLECTIONS[0]);
  const [selectedFinish, setSelectedFinish] = useState(STONE_COLLECTIONS[0].finishes[0]);

  const handleSelectStone = (stone: typeof STONE_COLLECTIONS[0]) => {
    setSelectedStone(stone);
    setSelectedFinish(stone.finishes[0]);
  };

  return (
    <section className="py-12 sm:py-16 bg-stone-900 text-stone-100 relative overflow-hidden">
      {/* Background Lighting Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <span className="text-[11px] sm:text-xs font-bold text-gold tracking-widest uppercase inline-flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>معرض الخامات والتشطيبات التفاعلي</span>
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
            استكشف أصناف الأحجار الطبيعية والتشطيبات
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            انقر على أي خامة لمعاينة خصائصها الهندسية، أساليب القص والتشطيب، والاستخدامات المعمارية الموصى بها.
          </p>
        </div>

        {/* Stone Selector Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 max-w-4xl mx-auto">
          {STONE_COLLECTIONS.map((stone) => {
            const isSelected = selectedStone.id === stone.id;
            return (
              <button
                key={stone.id}
                onClick={() => handleSelectStone(stone)}
                className={`p-3 sm:p-3.5 rounded-2xl border text-right transition-all duration-300 flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-stone-800 border-gold shadow-gold-glow scale-[1.01]'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: stone.color }}
                  />
                  {isSelected && <Check className="w-3.5 h-3.5 text-gold" />}
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-[13px] text-white block">{stone.name}</span>
                  <span className="text-[10px] text-stone-400 block">{stone.origin}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Visualizer Interactive Card */}
        <div className="bg-stone-950 rounded-3xl border border-stone-800 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          {/* Image Showcase with Zoom/Details Overlay */}
          <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[380px] group overflow-hidden">
            <img
              src={selectedStone.image}
              alt={selectedStone.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-5 right-5 left-5 flex justify-between items-end">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold/90 text-stone-950 shadow">
                  {selectedStone.tag}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow">
                  {selectedStone.name}
                </h3>
              </div>
              <span className="text-[11px] text-stone-300 bg-stone-900/80 px-2.5 py-1 rounded-lg border border-stone-700 backdrop-blur-sm">
                تشطيب: {selectedFinish}
              </span>
            </div>
          </div>

          {/* Details & Specs Panel */}
          <div className="lg:col-span-6 p-5 sm:p-7 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs text-gold font-bold uppercase tracking-wider block">
                  الوصف الهندسي والمميزات
                </span>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {selectedStone.description}
                </p>
              </div>

              {/* Finishes Selector */}
              <div className="space-y-2 pt-2 border-t border-stone-800/80">
                <span className="text-xs text-stone-400 block font-medium">
                  أنواع القص والتشطيب المتوفرة في ورشنا:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStone.finishes.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFinish(f)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        selectedFinish === f
                          ? 'bg-gold text-stone-950 border-gold font-bold shadow'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-800/80">
                <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800 text-center">
                  <span className="text-[10px] text-stone-400 block">الكثافة النوعية</span>
                  <span className="text-xs font-bold text-gold font-mono">{selectedStone.specs.density}</span>
                </div>
                <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800 text-center">
                  <span className="text-[10px] text-stone-400 block">نسبة الامتصاص</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{selectedStone.specs.absorption}</span>
                </div>
                <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800 text-center">
                  <span className="text-[10px] text-stone-400 block">مستوى الصلابة</span>
                  <span className="text-xs font-bold text-white">{selectedStone.specs.hardness}</span>
                </div>
              </div>

              {/* Best For Note */}
              <div className="p-2.5 bg-gold/10 rounded-xl border border-gold/20 text-xs text-gold flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">الاستخدام المعماري الموصى به:</span>
                  <span className="text-stone-300 text-[11px] sm:text-xs">{selectedStone.bestFor}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row gap-2.5">
              <Link
                href={`/rfq?preferredStone=${encodeURIComponent(selectedStone.name)}`}
                className="flex-1 bg-gold hover:bg-gold-dark text-stone-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-gold-glow transition-all"
              >
                <span>طلب تسعير لهذا النوع</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/products"
                className="bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-gold" />
                <span>عرض الكتالوج</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
