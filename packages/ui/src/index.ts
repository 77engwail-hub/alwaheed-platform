import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ProductPricingMode, ProductUnit, QuotationStatus, OrderStatus } from '@al-waheed/types';

/**
 * Merge Tailwind classes with conflict resolution
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ==============================================================================
// 1. Architectural Color Palette Tokens
// ==============================================================================

export const stoneTokens = {
  stone: {
    50: '#FBF9F5',
    100: '#F7F5F0', // Stone Light Background
    200: '#EAE5D9', // Warm Sand
    300: '#D9D0C1', // Limestone Beige
    400: '#B8AA94', // Earth Tan
    500: '#8E7D67', // Raw Masonry
    600: '#675846', // Dark Stone
    700: '#483C2F', // Basalt Brown
    800: '#2C241C', // Deep Slate
    900: '#1C1917', // Charcoal Black
  },
  accent: {
    gold: '#C5A880',      // Architectural Warm Gold
    goldLight: '#E3CEB2', // Soft Gold Hover
    goldDark: '#9A7D55',  // Burnished Bronze
    terracotta: '#A65B32',// Yemeni Red Stone Accent
  },
} as const;

// ==============================================================================
// 2. Arabic Architectural Domain Formatters
// ==============================================================================

/**
 * Format Price with currency and localized digits
 */
export function formatPrice(
  amount: number | null | undefined,
  currency: string = 'YER',
  mode?: ProductPricingMode
): string {
  if (mode === 'CONTACT_FOR_PRICE') {
    return 'السعر عند الطلب';
  }
  if (mode === 'CUSTOM_QUOTE') {
    return 'حسب أبعاد ونوع النقش';
  }
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'السعر عند الطلب';
  }

  const formattedNum = new Intl.NumberFormat('ar-YE', {
    maximumFractionDigits: 0,
  }).format(amount);

  const currencyLabels: Record<string, string> = {
    YER: 'ريال يمني',
    SAR: 'ريال سعودي',
    USD: 'دولار',
  };

  const currLabel = currencyLabels[currency] || currency;

  if (mode === 'STARTING_FROM') {
    return `يبدأ من ${formattedNum} ${currLabel}`;
  }

  return `${formattedNum} ${currLabel}`;
}

/**
 * Localized Product Unit
 */
export function formatUnit(unit: ProductUnit): string {
  const units: Record<ProductUnit, string> = {
    PIECE: 'قطعة',
    SQUARE_METER: 'متر مربع (m²)',
    LINEAR_METER: 'متر طولي (m)',
    CUBIC_METER: 'متر مكعب (m³)',
    SET: 'طقم كامل',
    PROJECT: 'مشروع متكامل',
  };
  return units[unit] || unit;
}

/**
 * Localized Pricing Mode Label
 */
export function formatPricingMode(mode: ProductPricingMode): string {
  const modes: Record<ProductPricingMode, string> = {
    FIXED_PRICE: 'سعر محدد',
    STARTING_FROM: 'يبدأ من',
    PER_PIECE: 'بالقطعة',
    PER_SQUARE_METER: 'بالمتر المربع',
    PER_LINEAR_METER: 'بالمتر الطولي',
    PER_CUBIC_METER: 'بالمتر المكعب',
    CUSTOM_QUOTE: 'تسعير مخصص / نقش خاص',
    CONTACT_FOR_PRICE: 'السعر عند التواصل',
  };
  return modes[mode] || mode;
}

/**
 * Localized Quotation Status with Badge Colors
 */
export function formatQuotationStatus(status: QuotationStatus): {
  label: string;
  variant: 'default' | 'info' | 'warning' | 'success' | 'destructive';
} {
  const map: Record<QuotationStatus, { label: string; variant: 'default' | 'info' | 'warning' | 'success' | 'destructive' }> = {
    NEW: { label: 'طلب جديد', variant: 'info' },
    UNDER_REVIEW: { label: 'قيد الدراسة الفنية', variant: 'warning' },
    NEED_MORE_INFO: { label: 'مطلوب تفاصيل إضافية', variant: 'warning' },
    PRICED: { label: 'تم التسعير والاعتماد', variant: 'info' },
    SENT: { label: 'تم إرسال العرض للعميل', variant: 'default' },
    ACCEPTED: { label: 'تم قبول العرض', variant: 'success' },
    REJECTED: { label: 'مرفوض / ملغى', variant: 'destructive' },
    EXPIRED: { label: 'منتهي الصلاحية', variant: 'destructive' },
    CONVERTED_TO_ORDER: { label: 'تم التحويل لأمر تنفيذ', variant: 'success' },
  };
  return map[status] || { label: status, variant: 'default' };
}

/**
 * Localized Order Status
 */
export function formatOrderStatus(status: OrderStatus): {
  label: string;
  variant: 'default' | 'info' | 'warning' | 'success' | 'destructive';
} {
  const map: Record<OrderStatus, { label: string; variant: 'default' | 'info' | 'warning' | 'success' | 'destructive' }> = {
    PENDING: { label: 'بانتظار التأكيد', variant: 'warning' },
    CONFIRMED: { label: 'مؤكد', variant: 'info' },
    PROCESSING: { label: 'قيد التجهيز والنحت', variant: 'info' },
    READY_FOR_DISPATCH: { label: 'جاهز للشحن والتنزيل', variant: 'info' },
    SHIPPED: { label: 'خرج للتوصيل', variant: 'default' },
    DELIVERED: { label: 'تم التسليم بنجاح', variant: 'success' },
    CANCELLED: { label: 'ملغي', variant: 'destructive' },
  };
  return map[status] || { label: status, variant: 'default' };
}

/**
 * Build dynamic WhatsApp inquiry link with prefilled message
 */
export function buildWhatsAppInquiryUrl(options: {
  phone: string;
  productTitle?: string;
  projectTitle?: string;
  url?: string;
  customText?: string;
}): string {
  const cleanPhone = options.phone.replace(/[^0-9]/g, '');
  let message = 'السلام عليكم ورحمة الله وبركاته،\nمؤسسة الوحيد للزخرفة المعمارية والنحت،\n';

  if (options.productTitle) {
    message += `أرغب في الاستفسار عن تفاصيل وأسعار المنتج: *${options.productTitle}*\n`;
  } else if (options.projectTitle) {
    message += `أرغب في الاستفسار عن تنفيذ عمل مشابه لمشروع: *${options.projectTitle}*\n`;
  }

  if (options.url) {
    message += `الرابط: ${options.url}\n`;
  }

  if (options.customText) {
    message += `${options.customText}\n`;
  }

  message += 'أرجو التكرم بالتواصل وموافاتي بالتفاصيل الفنية والأسعار.';

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Normalize Arabic text for smart search matching
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[إأآا]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/[ؤئ]/g, 'ء')
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove Tashkeel (diacritics)
    .replace(/\u0640/g, '') // Remove Tatweel (kashida)
    .trim()
    .toLowerCase();
}
