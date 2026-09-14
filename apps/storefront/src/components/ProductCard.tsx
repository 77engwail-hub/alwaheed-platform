import React from 'react';
import Link from 'next/link';
import { formatPrice, formatPricingMode, formatUnit } from '@al-waheed/ui';
import type { Product } from '@al-waheed/types';
import { Sparkles, MessageSquare, ArrowLeft, Layers } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80';

  const priceFormatted = formatPrice(product.basePrice, product.currency, product.pricingMode);
  const modeLabel = formatPricingMode(product.pricingMode);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-gold/60 shadow-stone-sm hover:shadow-stone-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
          <img
            src={mainImage}
            alt={product.titleAr}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
            <span className="bg-stone-900/90 backdrop-blur-md text-gold text-xs px-2.5 py-1 rounded-md font-medium border border-gold/30">
              {product.category?.nameAr || 'حجر طبيعي'}
            </span>
            {product.isFeatured && (
              <span className="bg-gold text-stone-950 text-xs px-2 py-0.5 rounded font-bold shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>مميز</span>
              </span>
            )}
          </div>
          <div className="absolute bottom-3 right-3">
            <span className="bg-stone-950/80 backdrop-blur-sm text-stone-200 text-xs px-2.5 py-0.5 rounded-full border border-stone-700 font-mono">
              {modeLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-base font-bold text-stone-900 group-hover:text-gold-dark transition-colors line-clamp-2 leading-snug">
            <Link href={`/products/${product.slug}`}>{product.titleAr}</Link>
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.shortDescAr || 'أحجار ونقوش معمارية طبيعية بأعلى معايير الحرفية والجودة.'}
          </p>

          {/* Materials Tag Preview */}
          {product.materials && product.materials.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {product.materials.slice(0, 2).map((m: any, idx: number) => (
                <span
                  key={idx}
                  className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200 flex items-center gap-1"
                >
                  <Layers className="w-2.5 h-2.5 text-gold-dark" />
                  <span>{m.nameAr || m}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="p-5 pt-0 border-t border-stone-100 mt-2 space-y-3">
        <div className="flex items-baseline justify-between pt-3">
          <div className="flex flex-col">
            <span className="text-[11px] text-stone-400">طريقة التسعير</span>
            <span className="text-sm font-bold text-stone-900 font-mono">{priceFormatted}</span>
          </div>
          <span className="text-xs text-stone-500 font-medium">{formatUnit(product.unit)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href={`/products/${product.slug}`}
            className="w-full bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>التفاصيل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <a
            href={`https://wa.me/967777360681?text=${encodeURIComponent(
              `السلام عليكم، أود الاستفسار عن تفاصيل وأسعار: ${product.titleAr} (SKU: ${product.sku})`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-bold py-2.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>واتساب</span>
          </a>
        </div>
      </div>
    </div>
  );
};
