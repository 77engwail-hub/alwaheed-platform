import React from 'react';
import { fetchApi } from '../../lib/api-client';
import { ProductCard } from '../../components/ProductCard';
import Link from 'next/link';
import { Search, Filter, Layers, Sparkles } from 'lucide-react';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    material?: string;
    finish?: string;
    pricingMode?: string;
    search?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categorySlug = searchParams.category;
  const materialSlug = searchParams.material;
  const finishSlug = searchParams.finish;
  const pricingMode = searchParams.pricingMode;
  const search = searchParams.search;
  const sort = searchParams.sort || 'featured';
  const page = searchParams.page || '1';

  let queryString = `page=${page}&limit=12&sort=${sort}`;
  if (categorySlug) queryString += `&categorySlug=${categorySlug}`;
  if (materialSlug) queryString += `&materialSlug=${materialSlug}`;
  if (finishSlug) queryString += `&finishSlug=${finishSlug}`;
  if (pricingMode) queryString += `&pricingMode=${pricingMode}`;
  if (search) queryString += `&search=${encodeURIComponent(search)}`;

  let products: any[] = [];
  let total = 0;
  let categories: any[] = [];
  let materials: any[] = [];
  let finishes: any[] = [];

  try {
    const [productsRes, catRes, matRes, finRes] = await Promise.all([
      fetchApi(`/catalog/products?${queryString}`),
      fetchApi('/catalog/categories'),
      fetchApi('/catalog/materials'),
      fetchApi('/catalog/finishes'),
    ]);
    products = productsRes.items || productsRes || [];
    total = productsRes.total || products.length;
    categories = catRes || [];
    materials = matRes || [];
    finishes = finRes || [];
  } catch (e) {
    console.error('Failed to load products list:', e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-stone-md">
        <div className="max-w-3xl space-y-2.5">
          <span className="text-[11px] sm:text-xs font-bold text-gold tracking-widest uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>كتالوج الأحجار والزخارف المعمارية</span>
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
            أحجار البناء الطبيعية، الواجهات، والنقوش الملكية
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            استعرض تشكيلة متكاملة من كتل وألواح الحجر الصنعاني والمأربي، التيجان الكورنثية، الأقواس، المشربيات، والمدافئ الحجرية المنفذة بدقة هندسية عالية.
          </p>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-5 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-stone-sm h-fit">
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
            <span className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-gold-dark" />
              <span>تصفية النتائج</span>
            </span>
            {(categorySlug || materialSlug || finishSlug || pricingMode || search) && (
              <Link href="/products" className="text-xs text-rose-600 hover:underline">
                إعادة ضبط
              </Link>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">الأقسام</h3>
            <div className="flex flex-col gap-1 text-xs">
              <Link
                href={`/products?${new URLSearchParams({ ...searchParams, category: '' }).toString()}`}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  !categorySlug ? 'bg-stone-900 text-gold font-bold' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                كافة الأقسام
              </Link>
              {categories.map((c: any) => (
                <Link
                  key={c.id}
                  href={`/products?${new URLSearchParams({ ...searchParams, category: c.slug }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    categorySlug === c.slug
                      ? 'bg-stone-900 text-gold font-bold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>{c.nameAr}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">نوع الحجر / المادة</h3>
            <div className="flex flex-col gap-1 text-xs">
              {materials.map((m: any) => (
                <Link
                  key={m.id}
                  href={`/products?${new URLSearchParams({ ...searchParams, material: m.slug }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    materialSlug === m.slug
                      ? 'bg-stone-900 text-gold font-bold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {m.nameAr}
                </Link>
              ))}
            </div>
          </div>

          {/* Pricing Mode */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">نمط البيع والتسعير</h3>
            <div className="flex flex-col gap-1 text-xs">
              <Link
                href={`/products?${new URLSearchParams({ ...searchParams, pricingMode: 'FIXED_PRICE' }).toString()}`}
                className={`px-3 py-1.5 rounded-lg ${
                  pricingMode === 'FIXED_PRICE' ? 'bg-stone-900 text-gold font-bold' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                سعر محدد للقطعة
              </Link>
              <Link
                href={`/products?${new URLSearchParams({ ...searchParams, pricingMode: 'PER_SQUARE_METER' }).toString()}`}
                className={`px-3 py-1.5 rounded-lg ${
                  pricingMode === 'PER_SQUARE_METER' ? 'bg-stone-900 text-gold font-bold' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                بالمتر المربع (m²)
              </Link>
              <Link
                href={`/products?${new URLSearchParams({ ...searchParams, pricingMode: 'STARTING_FROM' }).toString()}`}
                className={`px-3 py-1.5 rounded-lg ${
                  pricingMode === 'STARTING_FROM' ? 'bg-stone-900 text-gold font-bold' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                سعر يبدأ من
              </Link>
              <Link
                href={`/products?${new URLSearchParams({ ...searchParams, pricingMode: 'CUSTOM_QUOTE' }).toString()}`}
                className={`px-3 py-1.5 rounded-lg ${
                  pricingMode === 'CUSTOM_QUOTE' ? 'bg-stone-900 text-gold font-bold' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                تسعير مخصص / نقش خاص
              </Link>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200/80">
            <span className="text-xs font-bold text-stone-700">
              إجمالي النتائج: <span className="text-gold-dark font-mono font-bold">{total}</span> منتج وعمل معماري
            </span>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-800">لا توجد منتجات مطابقة لخيارات البحث</h3>
              <p className="text-xs text-stone-500">
                يمكنك إعادة ضبط الفلاتر أو طلب تسعير مخصص مباشرة لأي تصميم ترغب به.
              </p>
              <Link href="/rfq" className="inline-block bg-gold text-stone-950 font-bold px-5 py-2.5 rounded-lg text-xs">
                طلب تسعير تصميم خاص
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
