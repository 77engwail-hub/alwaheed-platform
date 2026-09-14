/**
 * @al-waheed/types
 * Core Domain Types & Enums for Al-Waheed Architectural Stone & Carving Platform
 */

// ==============================================================================
// 1. Core Domain Enums & Literals
// ==============================================================================

export type ProductPricingMode =
  | 'FIXED_PRICE'
  | 'STARTING_FROM'
  | 'PER_PIECE'
  | 'PER_SQUARE_METER'
  | 'PER_LINEAR_METER'
  | 'PER_CUBIC_METER'
  | 'CUSTOM_QUOTE'
  | 'CONTACT_FOR_PRICE';

export type ProductUnit =
  | 'PIECE'
  | 'SQUARE_METER'
  | 'LINEAR_METER'
  | 'CUBIC_METER'
  | 'SET'
  | 'PROJECT';

export type QuotationStatus =
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'NEED_MORE_INFO'
  | 'PRICED'
  | 'SENT'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CONVERTED_TO_ORDER';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY_FOR_DISPATCH'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'UNPAID'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'REFUNDED';

export type PaymentMethod =
  | 'CASH_ON_DELIVERY'
  | 'BANK_TRANSFER'
  | 'CREDIT_CARD'
  | 'CUSTOM_AGREEMENT';

export type RoleType =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'CATALOG_MANAGER'
  | 'SALES_MANAGER'
  | 'CONTENT_MANAGER'
  | 'CUSTOMER';

export type ProjectType =
  | 'VILLA_FACADE'
  | 'PALACE_FACADE'
  | 'COMMERCIAL_BUILDING'
  | 'MOSQUE'
  | 'ROYAL_ENTRANCE'
  | 'INTERIOR_DECOR'
  | 'WATERFALL_FOUNTAIN'
  | 'STONE_CARVING_ART'
  | 'CUSTOM_WORK';

export type ImageType =
  | 'MAIN'
  | 'GALLERY'
  | 'BEFORE'
  | 'AFTER'
  | 'DETAIL'
  | 'BLUEPRINT';

// ==============================================================================
// 2. Domain Entities Interfaces
// ==============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: RoleType;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Material {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  origin?: string | null; // e.g., 'حجر صنعاني حبش', 'حجر مأربي بيج'
  density?: string | null;
  compressiveStrength?: string | null;
  waterAbsorption?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Finish {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  textureSampleUrl?: string | null;
  isActive: boolean;
}

export interface Color {
  id: string;
  nameAr: string;
  nameEn: string;
  hexCode: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  parentId?: string | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  titleAr: string;
  titleEn?: string | null;
  lengthCm?: number | null;
  widthCm?: number | null;
  thicknessCm?: number | null;
  priceDelta: number;
  isDefault: boolean;
  stockStatus: 'IN_STOCK' | 'MADE_TO_ORDER' | 'OUT_OF_STOCK';
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  thumbnailUrl?: string | null;
  altTextAr?: string | null;
  altTextEn?: string | null;
  sortOrder: number;
  isFeatured: boolean;
}

export interface Product {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  sku: string;
  shortDescAr?: string | null;
  shortDescEn?: string | null;
  fullDescAr?: string | null;
  fullDescEn?: string | null;
  categoryId: string;
  category?: Category;
  pricingMode: ProductPricingMode;
  unit: ProductUnit;
  basePrice?: number | null;
  compareAtPrice?: number | null;
  currency: string;
  isFeatured: boolean;
  isActive: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  materials?: Material[];
  finishes?: Finish[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  thumbnailUrl?: string | null;
  captionAr?: string | null;
  imageType: ImageType;
  sortOrder: number;
}

export interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  projectType: ProjectType;
  locationCity?: string | null;
  completionYear?: number | null;
  shortDescAr?: string | null;
  shortDescEn?: string | null;
  fullDescAr?: string | null;
  fullDescEn?: string | null;
  coverImageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  images: ProjectImage[];
  materialsUsed?: Material[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface QuotationItem {
  id: string;
  quotationId: string;
  productId?: string | null;
  customTitle?: string | null;
  materialPreference?: string | null;
  finishPreference?: string | null;
  quantity: number;
  unit: ProductUnit;
  dimensionsDesc?: string | null; // e.g. "واجهة 12م × 4م"
  unitPriceEstimate?: number | null;
  totalPriceEstimate?: number | null;
  adminNotes?: string | null;
}

export interface QuotationAttachment {
  id: string;
  quotationId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface QuotationStatusHistory {
  id: string;
  quotationId: string;
  previousStatus?: QuotationStatus | null;
  newStatus: QuotationStatus;
  changedById?: string | null;
  changedByName?: string | null;
  notes?: string | null;
  createdAt: string | Date;
}

export interface Quotation {
  id: string;
  referenceNumber: string; // e.g., RFQ-2026-0042
  customerName: string;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  city: string;
  projectType: ProjectType | string;
  preferredStoneType?: string | null;
  approximateBudget?: string | null;
  description: string;
  needsInstallation: boolean;
  needsDelivery: boolean;
  status: QuotationStatus;
  totalQuotedPrice?: number | null;
  currency: string;
  items: QuotationItem[];
  attachments: QuotationAttachment[];
  statusHistory: QuotationStatusHistory[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  titleAr: string;
  quantity: number;
  unit: ProductUnit;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ORD-2026-0010
  customerName: string;
  phone: string;
  email?: string | null;
  shippingAddress: string;
  city: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  currency: string;
  notes?: string | null;
  items: OrderItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Setting {
  key: string;
  value: string;
  description?: string | null;
  group: 'GENERAL' | 'CONTACT' | 'SOCIAL' | 'APPEARANCE' | 'SEO';
}

export interface AuditLog {
  id: string;
  userId?: string | null;
  userEmail?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, any> | null;
  ipAddress?: string | null;
  createdAt: string | Date;
}

// ==============================================================================
// 3. API Response Helpers & Pagination
// ==============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
    timestamp?: string;
  };
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
