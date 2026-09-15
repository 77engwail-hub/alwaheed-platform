import React from 'react';
import Link from 'next/link';
import { fetchApi } from '../lib/api-client';
import { ProductCard } from '../components/ProductCard';
import { ProjectCard } from '../components/ProjectCard';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { StoneHeroSlider } from '../components/StoneHeroSlider';
import { AnimatedStatistics } from '../components/AnimatedStatistics';
import { InteractiveStoneVisualizer } from '../components/InteractiveStoneVisualizer';
import { InteractiveMasonryGallery } from '../components/InteractiveMasonryGallery';
import { GoogleMapSection } from '../components/GoogleMapSection';
import {
  Sparkles,
  ArrowLeft,
  FileText,
  Compass,
  Phone,
  MessageSquare,
  ShieldCheck,
  Layers,
  Hammer,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const revalidate = 30; // ISR

async function getHomeData() {
  try {
    const [productsRes, projectsRes, categoriesRes] = await Promise.all([
      fetchApi('/catalog/products?limit=6&isFeatured=true'),
      fetchApi('/projects?limit=3&isFeatured=true'),
      fetchApi('/catalog/categories'),
    ]);
    return {
      products: productsRes.items || productsRes || [],
      projects: projectsRes.items || projectsRes || [],
      categories: categoriesRes || [],
    };
  } catch (e) {
    console.error('Failed to load home data from API, using fallback:', e);
    return { products: [], projects: [], categories: [] };
  }
}

export default async function HomePage() {
  const { products, projects, categories } = await getHomeData();

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. INTERACTIVE HERO SLIDER WITH KEN-BURNS & GOLD ACCENTS */}
      <StoneHeroSlider />

      {/* 2. ANIMATED KEY STATISTICS (+500 Projects, +25 Years, +20 Varieties, 100% Quality) */}
      <AnimatedStatistics />

      {/* 3. INTERACTIVE STONE & TEXTURE VISUALIZER (3D & Specs Explorer) */}
      <InteractiveStoneVisualizer />

      {/* 4. INTERACTIVE REAL PORTFOLIO MASONRY GALLERY WITH LIGHTBOX */}
      <InteractiveMasonryGallery />

      {/* 5. SPECIALIZED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-gold tracking-widest uppercase block mb-1">
              التصنيفات التخصصية
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900">
              أقسام ومنتجات الحجر المعماري
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-gold-dark hover:text-stone-900 flex items-center gap-1 group"
          >
            <span>عرض كافة المنتجات والأحجار</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-900 border border-stone-200/80 hover:border-gold/60 shadow-stone-sm hover:shadow-stone-md transition-all"
            >
              <img
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80'}
                alt={cat.nameAr}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              <div className="absolute bottom-3.5 right-3.5 left-3.5">
                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-gold transition-colors">
                  {cat.nameAr}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-stone-300 line-clamp-1 mt-0.5">
                  {cat.descriptionAr || 'أعمال هندسية وحرفية فاخرة'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. FEATURED PRODUCTS (MULTI-PRICING SHOWCASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-gold tracking-widest uppercase block mb-1">
              تشكيلات مختارة
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900">
              منتجات ونقوش حجرية مميزة
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              أحجار جاهزة للطلب المباشر أو التسعير حسب المقاسات والنقوش المخصصة
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-stone-900 bg-stone-200 hover:bg-gold hover:text-stone-950 px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all"
          >
            <span>استعراض الكتالوج الكامل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. BEFORE / AFTER & FEATURED PROJECTS SHOWCASE */}
      <section className="bg-stone-900 text-stone-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] sm:text-xs font-bold text-gold tracking-widest uppercase">
              سابقة الأعمال والتنفيذ الواقعي
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
              مشاريع حجرية تتحدث عن جودة الحرفية
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              نفتخر بتنفيذ أرقى واجهات الفلل والقصور والمداخل الملكية في صنعاء ومختلف المحافظات
            </p>
          </div>

          {/* Interactive Before/After Demonstration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-7">
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                afterImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                beforeLabel="مخطط الهيكل والواجهة قبل التكسية"
                afterLabel="الواجهة بعد التكسية والنحت بالحجر البيج والحبش"
              />
            </div>
            <div className="lg:col-span-5 space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <span className="bg-stone-800 text-gold text-[11px] px-2.5 py-0.5 rounded border border-gold/30 font-mono">
                  مشروع قصر السعادة - حده
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  التحول المعماري من الهيكل الإنشائي إلى فخامة الحجر الطبيعي
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  تم دمج حجر الحبش الأسود مع الحجر البيج المأربي في الواجهة الرئيسية، مع نحت تيجان كورنثية ضخمة وأقواس شبابيك بارزة تعكس الهيبة الملكية.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">المواد المستخدمة</span>
                  <span className="text-xs font-bold text-stone-200">حجر حبش + بيج مأربي</span>
                </div>
                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">الموقع</span>
                  <span className="text-xs font-bold text-stone-200">حده، صنعاء</span>
                </div>
              </div>

              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-gold hover:text-white font-bold text-xs pt-1"
              >
                <span>استكشف باقي مشاريع الفلل والقصور</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-4">
            {projects.map((prj: any) => (
              <ProjectCard key={prj.id} project={prj} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHY AL-WAHEED (TRUST FACTORS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-10">
          <span className="text-[11px] sm:text-xs font-bold text-gold tracking-widest uppercase">
            لماذا تختارنا؟
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900">
            معايير الجودة والأصالة الحجرية
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            نجمع بين أحدث تقنيات النحت بالمكائن الآلية الحديثة CNC والمخارط الرقمية وأصالة الحجر اليمني الطبيعي
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-stone-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-gold-dark border border-stone-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">أحجار طبيعية 100%</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              انتقاء دقيق للكتل الحجرية من أفضل محاجر صنعاء ومأرب لضمان خلوها من العيوب والتشققات ومقاومتها للزمن.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-stone-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-gold-dark border border-stone-200">
              <Hammer className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">نحت آلي وهندسي (CNC)</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              أحدث مكائن النحت الآلية CNC والمخارط الرقمية القادرة على تنفيذ أدق المخططات والزخارف المعمارية الملكية.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-stone-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-gold-dark border border-stone-200">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">مقاولات وتوريد متكامل</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              من مرحلة دراسة المخطط الهندسي وجداول الكميات، حتى التوريد والقص والتركيب والتسليم النهائي في الموقع.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-stone-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-gold-dark border border-stone-200">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">دقة قياسات ومواصفات</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              قص ليزري متقن يضمن سماكات متطابقة وزوايا حادة تسهل التركيب وتمنح الواجهة رونقاً هندسياً متكاملاً.
            </p>
          </div>
        </div>
      </section>

      {/* 9. GOOGLE MAPS SHOWCASE & SANA'A LOCATION SECTION */}
      <GoogleMapSection />

      {/* 10. CUSTOM RFQ TEASER CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white p-6 sm:p-8 lg:p-10 border border-gold/30 shadow-stone-lg overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-5">
            <span className="text-[11px] sm:text-xs font-bold text-gold tracking-widest uppercase block">
              لديك تصميم خاص أو مخطط واجهة؟
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight">
              أرسل مخططك الهندسي واحصل على دراسة كميات وعرض سعر دقيق
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              يمكنك رفع صور التصاميم المطلوبة، مخططات الـ PDF، أو أبعاد الواجهات، وسيقوم فريقنا الهندسي بدراسة المشروع وتحديد تكاليف الحجر والنحت والتركيب.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/rfq"
                className="bg-gold hover:bg-gold-dark text-stone-950 font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all text-xs sm:text-sm"
              >
                <FileText className="w-4 h-4" />
                <span>بدء طلب التسعير المخصص (RFQ)</span>
              </Link>
              <a
                href="https://wa.me/967777360681?text=السلام%20عليكم،%20أود%20إرسال%20مخطط%20واجهة%20للتسعير"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition-all text-xs sm:text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>إرسال المخطط عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

