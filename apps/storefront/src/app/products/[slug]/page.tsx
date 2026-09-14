import React from 'react';
import { notFound } from 'next/navigation';
import { fetchApi } from '../../../lib/api-client';
import { formatPrice, formatPricingMode, formatUnit, buildWhatsAppInquiryUrl } from '@al-waheed/ui';
import { ProductCard } from '../../../components/ProductCard';
import Link from 'next/link';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  FileText,
  MessageSquare,
  ArrowRight,
  Ruler,
  Building,
  Info,
} from 'lucide-react';

interface ProductDetailPageProps {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  let product: any = null;

  try {
    product = await fetchApi(`/catalog/products/${params.slug}`);
  } catch (e) {
    console.error('Failed to load product details:', e);
    notFound();
  }

  if (!product) notFound();

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80';

  const priceFormatted = formatPrice(product.basePrice, product.currency, product.pricingMode);
  const modeLabel = formatPricingMode(product.pricingMode);

  const whatsAppUrl = buildWhatsAppInquiryUrl({
    phone: '967770663641',
    productTitle: product.titleAr,
    url: `http://localhost:3000/products/${product.slug}`,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-stone-900">
          المنتجات
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-stone-900">
              {product.category.nameAr}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-stone-900 font-bold line-clamp-1">{product.titleAr}</span>
      </nav>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery & Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-stone-md">
            <img
              src={mainImage}
              alt={product.titleAr}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 right-4 bg-stone-900/90 text-gold text-xs px-3 py-1 rounded-md font-medium border border-gold/30">
              {product.category?.nameAr}
            </div>
          </div>

          {/* Thumbnails if available */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img: any, i: number) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-stone-200 bg-stone-50 cursor-pointer hover:border-gold"
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Purchase Options */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
              <span>رمز المنتج (SKU):</span>
              <span className="font-bold text-stone-700">{product.sku}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-snug">
              {product.titleAr}
            </h1>
            <p className="text-xs text-stone-500 font-mono tracking-wide">{product.titleEn}</p>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-stone-sm space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-500">طريقة وحالة التسعير:</span>
              <span className="text-xs bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded font-medium border border-stone-200">
                {modeLabel}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono">
                {priceFormatted}
              </span>
              <span className="text-xs text-stone-500">/ {formatUnit(product.unit)}</span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-sm text-stone-600 leading-relaxed">
            {product.fullDescAr || product.shortDescAr || 'أعمال حجرية ونقوش معمارية فاخرة.'}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Primary Action: Request Quote with prefilled product */}
            <Link
              href={`/rfq?productId=${product.id}&productTitle=${encodeURIComponent(product.titleAr)}`}
              className="w-full bg-gold hover:bg-gold-dark text-stone-950 font-bold text-sm py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-gold-glow transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>اطلب تسعير لهذا المنتج بالمقاسات المطلوبة (RFQ)</span>
            </Link>

            {/* Direct WhatsApp CTA */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>استفسر فوراً عبر واتساب مع تفاصيل المنتج</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-200 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-dark" />
              <span>أحجار يمنية طبيعية 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>إمكانية التعديل حسب المخطط</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Sheet */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-stone-sm space-y-6">
        <h2 className="text-lg font-bold text-stone-900 border-r-4 border-gold pr-3">
          المواصفات الفنية والخصائص المعمارية
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {product.materials && product.materials.length > 0 && (
            <div className="p-4 bg-stone-50 rounded-xl space-y-1">
              <span className="text-xs text-stone-400 block">نوع الحجر المستخدم</span>
              <span className="text-sm font-bold text-stone-800">
                {product.materials.map((m: any) => m.nameAr).join(' ، ')}
              </span>
            </div>
          )}

          {product.finishes && product.finishes.length > 0 && (
            <div className="p-4 bg-stone-50 rounded-xl space-y-1">
              <span className="text-xs text-stone-400 block">نوع المعالجة والتشطيب</span>
              <span className="text-sm font-bold text-stone-800">
                {product.finishes.map((f: any) => f.nameAr).join(' ، ')}
              </span>
            </div>
          )}

          <div className="p-4 bg-stone-50 rounded-xl space-y-1">
            <span className="text-xs text-stone-400 block">وحدة القياس والتوريد</span>
            <span className="text-sm font-bold text-stone-800">{formatUnit(product.unit)}</span>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl space-y-1">
            <span className="text-xs text-stone-400 block">المصدر والمحاجر</span>
            <span className="text-sm font-bold text-stone-800">محاجر صنعاء ومأرب - اليمن</span>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">منتجات ونقوش ذات صلة</h2>
            <Link href="/products" className="text-xs font-bold text-gold-dark hover:underline">
              استعراض المزيد
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((rp: any) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
