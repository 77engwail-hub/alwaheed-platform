import React from 'react';
import Link from 'next/link';
import {
  Hammer,
  Building,
  Layers,
  Sparkles,
  Compass,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: <Building className="w-8 h-8 text-gold" />,
      title: 'تنفيذ وتكسية الواجهات الحجرية للفلل والقصور',
      description:
        'دراسة المخططات الهندسية وتصميم وتنفيذ واجهات حجرية متكاملة تجمع بين حجر الحبش الصنعاني والحجر البيج المأربي بأحدث التشكيلات المعمارية.',
      features: ['تكسية وتثبيت احترافي', 'مقاومة فائقة للعوامل الجوية', 'عزل حراري وجمالي متميز'],
    },
    {
      icon: <Hammer className="w-8 h-8 text-gold" />,
      title: 'نحت التيجان والأعمدة والقواعد الرومانية بمكائن CNC والمخارط',
      description:
        'نحت وتشكيل آلي متقدم عبر مكائن CNC ومخارط الحجر والرخام الحديثة لتيجان الأعمدة الكورنثية والإسلامية والأقواس الملكية للمداخل والشرفات بأعلى دقة هندسية.',
      features: ['نقوش ثلاثية الأبعاد بارزة 3D CNC', 'خرط أعمدة وقواعد بمقاسات وأقطار متنوعة', 'صلابة وجودة صخرية عالية'],
    },
    {
      icon: <Layers className="w-8 h-8 text-gold" />,
      title: 'المشربيات وإطارات النوافذ الزخرفية',
      description:
        'تشكيل إطارات شبابيك مقوسة ومشربيات مفرغة بأنماط هندسية إسلامية توفر التهوية والخصوصية وتمنح الواجهة رونقاً تراثياً فاخراً.',
      features: ['تفريغ هندسي دقيق', 'حماية وخصوصية تامة', 'تصاميم أندلسية وإسلامية'],
    },
    {
      icon: <Sparkles className="w-8 h-8 text-gold" />,
      title: 'شلالات ونوافير وديكورات حجرية داخلية وخارجية',
      description:
        'نحت وتركيب النوافير الحجرية متعددة الطبقات والمدافئ الرخامية والشلالات الجدارية التي تضفي هدوءاً وفخامة على الحدائق والمجالس.',
      features: ['تمديدات مائية معزولة', 'رخام وحجر طبيعي نقي', 'إتقان في حركة وتدفق المياه'],
    },
    {
      icon: <Compass className="w-8 h-8 text-gold" />,
      title: 'توريد وقص أحجار البناء بمختلف المقاسات والتشطيبات',
      description:
        'توريد مباشر لأحجار البناء اليمنية الطبيعية من المحاجر مع قص ليزري ومعالجات أسطح متنوعة (بوشارده، مجلي، مسمسم، مطبه).',
      features: ['توريد كميات ضخمة للمشاريع', 'سماكات منتظمة دقيقة', 'أسعار منافسة وجودة أولى'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-stone-md text-center max-w-4xl mx-auto space-y-3">
        <span className="text-[11px] sm:text-xs font-bold text-gold tracking-widest uppercase inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>خدمات متخصصة في الحجر المعماري</span>
        </span>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
          خدمات المقاولات الحجرية والنحت والتشكيل المعماري
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
          نقدم حلولاً معمارية متكاملة تبدأ من دراسة المخطط الهندسي وحتى التسليم النهائي في موقع البناء بأعلى مواصفات الجودة والإتقان.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-stone-sm hover:shadow-stone-md hover:border-gold/60 transition-all duration-300 space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-stone-950 flex items-center justify-center border border-stone-800 shadow-md">
                {srv.icon}
              </div>
              <h3 className="text-lg font-bold text-stone-900 leading-snug">{srv.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{srv.description}</p>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                {srv.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/rfq"
              className="w-full mt-4 bg-stone-100 hover:bg-stone-900 hover:text-gold text-stone-800 text-xs font-bold py-3 px-4 rounded-xl text-center transition-all"
            >
              طلب تسعير لهذه الخدمة
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
