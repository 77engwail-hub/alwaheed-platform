import React from 'react';
import Link from 'next/link';
import { fetchApi } from '../lib/api-client';
import { ProductCard } from '../components/ProductCard';
import { ProjectCard } from '../components/ProjectCard';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
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
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-stone-950 text-stone-100 overflow-hidden pattern-geometric">
        {/* Architectural Background Image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="صروح معمارية وواجهات حجرية فاخرة"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 py-20">
          {/* Top Trust Pill */}
          <div className="inline-flex items-center gap-2 bg-stone-900/90 border border-gold/40 px-4 py-1.5 rounded-full text-xs sm:text-sm text-gold shadow-gold-glow">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>مؤسسة الوحيد للزخرفة المعمارية ونحت الأحجار الطبيعية والمقاولات</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            نحوّل الحجر الطبيعي إلى <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
              صروح معمارية وتحف فنية خالدة
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-stone-300 leading-relaxed font-normal">
            متخصصون في نحت وزخرفة الأحجار الطبيعية والرخام، تنفيذ أرقى الواجهات الحجرية للفلل والقصور، وتشكيل التيجان والأعمدة الملكية والمشربيات بأعلى معايير الحرفية والهندسة في الجمهورية اليمنية.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/rfq"
              className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-stone-950 font-bold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-gold-glow transition-all"
            >
              <FileText className="w-5 h-5" />
              <span>اطلب عرض سعر لمشروعك (RFQ)</span>
            </Link>

            <Link
              href="/projects"
              className="w-full sm:w-auto bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-700 hover:border-gold font-bold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <span>تصفح المشاريع وسابقة الأعمال</span>
              <ArrowLeft className="w-5 h-5 text-gold" />
            </Link>
          </div>

          {/* Location & Quick Inquiry */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-gold" />
              <span>المقر والورش: صنعاء - حده - فج عطان</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>أحجار طبيعية 100% من أجود المحاجر</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-gold tracking-widest uppercase block mb-1">
              التصنيفات التخصصية
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              أقسام ومنتجات الحجر المعماري
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold text-gold-dark hover:text-stone-900 flex items-center gap-1 group"
          >
            <span>عرض كافة المنتجات والأحجار</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-900 border border-stone-200/80 hover:border-gold/60 shadow-stone-sm hover:shadow-stone-md transition-all"
            >
              <img
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80'}
                alt={cat.nameAr}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-85"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              <div className="absolute bottom-4 right-4 left-4">
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-gold transition-colors">
                  {cat.nameAr}
                </h3>
                <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5">
                  {cat.descriptionAr || 'أعمال هندسية وحرفية فاخرة'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (MULTI-PRICING SHOWCASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-gold tracking-widest uppercase block mb-1">
              تشكيلات مختارة
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              منتجات ونقوش حجرية مميزة
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              أحجار جاهزة للطلب المباشر أو التسعير حسب المقاسات والنقوش المخصصة
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold text-stone-900 bg-stone-200 hover:bg-gold hover:text-stone-950 px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all"
          >
            <span>استعراض الكتالوج الكامل</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. BEFORE / AFTER & FEATURED PROJECTS SHOWCASE */}
      <section className="bg-stone-900 text-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-gold tracking-widest uppercase">
              سابقة الأعمال والتنفيذ الواقعي
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              مشاريع حجرية تتحدث عن جودة الحرفية
            </h2>
            <p className="text-sm text-stone-300">
              نفتخر بتنفيذ أرقى واجهات الفلل والقصور والمداخل الملكية في صنعاء ومختلف المحافظات
            </p>
          </div>

          {/* Interactive Before/After Demonstration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                afterImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                beforeLabel="مخطط الهيكل والواجهة قبل التكسية"
                afterLabel="الواجهة بعد التكسية والنحت بالحجر البيج والحبش"
              />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="bg-stone-800 text-gold text-xs px-3 py-1 rounded border border-gold/30 font-mono">
                  مشروع قصر السعادة - حده
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  التحول المعماري من الهيكل الإنشائي إلى فخامة الحجر الطبيعي
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed">
                  تم دمج حجر الحبش الأسود مع الحجر البيج المأربي في الواجهة الرئيسية، مع نحت تيجان كورنثية ضخمة وأقواس شبابيك بارزة تعكس الهيبة الملكية.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                  <span className="text-xs text-stone-400 block">المواد المستخدمة</span>
                  <span className="text-sm font-bold text-stone-200">حجر حبش + بيج مأربي</span>
                </div>
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                  <span className="text-xs text-stone-400 block">الموقع</span>
                  <span className="text-sm font-bold text-stone-200">حده، صنعاء</span>
                </div>
              </div>

              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-gold hover:text-white font-bold text-sm pt-2"
              >
                <span>استكشف باقي مشاريع الفلل والقصور</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {projects.map((prj: any) => (
              <ProjectCard key={prj.id} project={prj} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY AL-WAHEED (TRUST FACTORS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-gold tracking-widest uppercase">
            لماذا تختارنا؟
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            معايير الجودة والأصالة الحجرية
          </h2>
          <p className="text-sm text-stone-500">
            نجمع بين مهارات النحت اليدوي التراثي وأحدث تقنيات القص والتشكيل الهندسي
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-stone-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-gold-dark border border-stone-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">أحجار طبيعية 100%</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              انتقاء دقيق للكتل الحجرية من أفضل محاجر صنعاء ومأرب لضمان خلوها من العيوب والتشققات ومقاومتها للزمن.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-stone-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-gold-dark border border-stone-200">
              <Hammer className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">نحاتون محترفون</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              نخبة من أمهر معلمين النحت والزخرفة المعمارية القادرين على تحويل أي تصميم أو صورة إلى نقش حجري بارز.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-stone-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-gold-dark border border-stone-200">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">مقاولات وتوريد متكامل</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              من مرحلة دراسة المخطط الهندسي وجداول الكميات، حتى التوريد والقص والتركيب والتسليم النهائي في الموقع.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-stone-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-gold-dark border border-stone-200">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">دقة قياسات ومواصفات</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              قص ليزري متقن يضمن سماكات متطابقة وزوايا حادة تسهل التركيب وتمنح الواجهة رونقاً هندسياً متكاملاً.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CUSTOM RFQ TEASER CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white p-8 sm:p-12 border border-gold/30 shadow-stone-lg overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs font-bold text-gold tracking-widest uppercase block">
              لديك تصميم خاص أو مخطط واجهة؟
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              أرسل مخططك الهندسي واحصل على دراسة كميات وعرض سعر دقيق
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              يمكنك رفع صور التصاميم المطلوبة، مخططات الـ PDF، أو أبعاد الواجهات، وسيقوم فريقنا الهندسي بدراسة المشروع وتحديد تكاليف الحجر والنحت والتركيب.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/rfq"
                className="bg-gold hover:bg-gold-dark text-stone-950 font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-md transition-all text-sm"
              >
                <FileText className="w-4 h-4" />
                <span>بدء طلب التسعير المخصص (RFQ)</span>
              </Link>
              <a
                href="https://wa.me/967770663641?text=السلام%20عليكم،%20أود%20إرسال%20مخطط%20واجهة%20للتسعير"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all text-sm"
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
