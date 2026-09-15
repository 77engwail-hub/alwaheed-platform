import { z } from 'zod';

// ==============================================================================
// 1. Auth Schemas
// ==============================================================================

export const LoginSchema = z
  .object({
    email: z.string().optional(),
    identifier: z.string().optional(),
    username: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().min(1, 'كلمة المرور مطلوبة'),
  })
  .transform((data) => ({
    email: (data.email || data.identifier || data.username || data.phone || '').trim(),
    password: data.password,
  }))
  .refine((data) => data.email.length > 0, {
    message: 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف أو اسم المستخدم',
    path: ['email'],
  });

export type LoginInput = z.infer<typeof LoginSchema>;

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z.string().min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل وتتضمن أرقاماً ورموزاً'),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

// ==============================================================================
// 2. Quotation & RFQ Schemas
// ==============================================================================

export const CreateQuotationItemSchema = z.object({
  productId: z.string().optional().nullable(),
  customTitle: z.string().optional().nullable(),
  materialPreference: z.string().optional().nullable(),
  finishPreference: z.string().optional().nullable(),
  quantity: z.number().positive('الكمية يجب أن تكون أكبر من صفر').default(1),
  unit: z.enum(['PIECE', 'SQUARE_METER', 'LINEAR_METER', 'CUBIC_METER', 'SET', 'PROJECT']).default('PIECE'),
  dimensionsDesc: z.string().optional().nullable(),
});

export const CreateQuotationSchema = z.object({
  customerName: z.string().min(3, 'الاسم يجب أن يتكون من 3 أحرف على الأقل'),
  phone: z.string().min(7, 'رقم الهاتف غير صالح'),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().nullable().or(z.literal('')),
  city: z.string().min(2, 'يرجى تحديد المدينة أو موقع المشروع'),
  projectType: z.string().min(2, 'يرجى اختيار نوع المشروع'),
  preferredStoneType: z.string().optional().nullable(),
  approximateBudget: z.string().optional().nullable(),
  description: z.string().min(10, 'يرجى كتابة وصف موجز للتصميم أو العمل المطلوب (10 أحرف على الأقل)'),
  needsInstallation: z.boolean().default(false),
  needsDelivery: z.boolean().default(true),
  items: z.array(CreateQuotationItemSchema).optional().default([]),
  attachments: z.array(
    z.object({
      fileName: z.string(),
      fileUrl: z.string().url(),
      fileSize: z.number(),
      mimeType: z.string(),
    })
  ).optional().default([]),
});

export type CreateQuotationInput = z.infer<typeof CreateQuotationSchema>;

export const UpdateQuotationStatusSchema = z.object({
  status: z.enum([
    'NEW',
    'UNDER_REVIEW',
    'NEED_MORE_INFO',
    'PRICED',
    'SENT',
    'ACCEPTED',
    'REJECTED',
    'EXPIRED',
    'CONVERTED_TO_ORDER',
  ]),
  notes: z.string().optional().nullable(),
});

export type UpdateQuotationStatusInput = z.infer<typeof UpdateQuotationStatusSchema>;

export const PriceQuotationSchema = z.object({
  totalQuotedPrice: z.number().positive('المبلغ الإجمالي يجب أن يكون قيمة موجبة'),
  currency: z.string().default('YER'),
  validUntilDays: z.number().int().positive().default(30),
  adminNotes: z.string().optional().nullable(),
  itemPrices: z.array(
    z.object({
      itemId: z.string(),
      unitPriceEstimate: z.number().nonnegative(),
      totalPriceEstimate: z.number().nonnegative(),
    })
  ).optional(),
});

export type PriceQuotationInput = z.infer<typeof PriceQuotationSchema>;

// ==============================================================================
// 3. Product & Catalog Schemas
// ==============================================================================

export const CreateProductSchema = z.object({
  titleAr: z.string().min(3, 'عنوان المنتج بالعربية مطلوب'),
  titleEn: z.string().min(3, 'عنوان المنتج بالإنجليزية مطلوب'),
  slug: z.string().min(3, 'الرابط الدائم (Slug) مطلوب'),
  sku: z.string().min(2, 'رمز المنتج (SKU) مطلوب'),
  shortDescAr: z.string().optional().nullable(),
  shortDescEn: z.string().optional().nullable(),
  fullDescAr: z.string().optional().nullable(),
  fullDescEn: z.string().optional().nullable(),
  categoryId: z.string().min(1, 'فئة المنتج مطلوبة'),
  pricingMode: z.enum([
    'FIXED_PRICE',
    'STARTING_FROM',
    'PER_PIECE',
    'PER_SQUARE_METER',
    'PER_LINEAR_METER',
    'PER_CUBIC_METER',
    'CUSTOM_QUOTE',
    'CONTACT_FOR_PRICE',
  ]),
  unit: z.enum(['PIECE', 'SQUARE_METER', 'LINEAR_METER', 'CUBIC_METER', 'SET', 'PROJECT']).default('PIECE'),
  basePrice: z.number().nullable().optional(),
  compareAtPrice: z.number().nullable().optional(),
  currency: z.string().default('YER'),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  materialIds: z.array(z.string()).optional().default([]),
  finishIds: z.array(z.string()).optional().default([]),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

// ==============================================================================
// 4. Project & Portfolio Schemas
// ==============================================================================

export const CreateProjectSchema = z.object({
  titleAr: z.string().min(3, 'عنوان المشروع بالعربية مطلوب'),
  titleEn: z.string().min(3, 'عنوان المشروع بالإنجليزية مطلوب'),
  slug: z.string().min(3, 'الرابط الدائم مطلوب'),
  projectType: z.enum([
    'VILLA_FACADE',
    'PALACE_FACADE',
    'COMMERCIAL_BUILDING',
    'MOSQUE',
    'ROYAL_ENTRANCE',
    'INTERIOR_DECOR',
    'WATERFALL_FOUNTAIN',
    'STONE_CARVING_ART',
    'CUSTOM_WORK',
  ]),
  locationCity: z.string().optional().nullable(),
  completionYear: z.number().int().optional().nullable(),
  shortDescAr: z.string().optional().nullable(),
  shortDescEn: z.string().optional().nullable(),
  fullDescAr: z.string().optional().nullable(),
  fullDescEn: z.string().optional().nullable(),
  coverImageUrl: z.string().url('رابط صورة الغلاف مطلوب'),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  materialIds: z.array(z.string()).optional().default([]),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

// ==============================================================================
// 5. Order & Direct Commerce Schemas
// ==============================================================================

export const CreateOrderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional().nullable(),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
});

export const CreateOrderSchema = z.object({
  customerName: z.string().min(3, 'اسم العميل مطلوب'),
  phone: z.string().min(7, 'رقم الهاتف مطلوب'),
  email: z.string().email().optional().nullable().or(z.literal('')),
  shippingAddress: z.string().min(5, 'عنوان الشحن والتوصيل مطلوب'),
  city: z.string().min(2, 'المدينة مطلوبة'),
  paymentMethod: z.enum(['CASH_ON_DELIVERY', 'BANK_TRANSFER', 'CREDIT_CARD', 'CUSTOM_AGREEMENT']).default('CASH_ON_DELIVERY'),
  notes: z.string().optional().nullable(),
  items: z.array(CreateOrderItemSchema).min(1, 'يجب أن يحتوي الطلب على عنصر واحد على الأقل'),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// ==============================================================================
// 6. Settings & Contact Schemas
// ==============================================================================

export const UpdateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export type UpdateSettingInput = z.infer<typeof UpdateSettingSchema>;

export const ContactMessageSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(7, 'رقم الهاتف مطلوب'),
  email: z.string().email().optional().nullable().or(z.literal('')),
  subject: z.string().min(3, 'الموضوع مطلوب'),
  message: z.string().min(10, 'الرسالة يجب أن لا تقل عن 10 أحرف'),
});

export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;

// ==============================================================================
// 7. Payment & Yemeni Wallets Schemas
// ==============================================================================

export const InitiatePaymentSchema = z.object({
  orderId: z.string().min(1, 'معرف الطلب مطلوب'),
  providerCode: z.string().min(1, 'يرجى اختيار المحفظة الإلكترونية'),
  accountId: z.string().optional().nullable(),
  paymentMethodType: z.enum([
    'MANUAL_RECEIPT',
    'MERCHANT_PAYMENT',
    'WALLET_TRANSFER',
    'QR_PAYMENT',
    'API',
    'WEBHOOK',
  ]),
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  currency: z.string().default('YER'),
  senderName: z.string().optional().nullable(),
  senderWalletNumber: z.string().optional().nullable(),
});

export type InitiatePaymentInput = z.infer<typeof InitiatePaymentSchema>;

export const UploadReceiptSchema = z.object({
  transactionId: z.string().min(1, 'معرف المعاملة مطلوب'),
  fileUrl: z.string().url('رابط ملف الإشعار غير صالح'),
  fileName: z.string().min(1, 'اسم الملف مطلوب'),
  fileSize: z.number().positive('حجم الملف غير صالح'),
  mimeType: z.string().min(1, 'نوع الملف مطلوب'),
  fileHashSha256: z.string().optional(),
  perceptualHash: z.string().optional(),
  customerNote: z.string().optional().nullable(),
});

export type UploadReceiptInput = z.infer<typeof UploadReceiptSchema>;

export const ConfirmPaymentSchema = z.object({
  transactionId: z.string().min(1, 'معرف المعاملة مطلوب'),
  confirmedAmount: z.number().positive('المبلغ المؤكد يجب أن يكون قيمة موجبة'),
  isPartial: z.boolean().default(false),
  manualAdjustmentReason: z.string().optional().nullable(),
  orderAllocations: z
    .array(
      z.object({
        orderId: z.string(),
        amount: z.number().positive(),
      })
    )
    .optional(),
  note: z.string().optional().nullable(),
});

export type ConfirmPaymentInput = z.infer<typeof ConfirmPaymentSchema>;

export const RejectPaymentSchema = z.object({
  transactionId: z.string().min(1, 'معرف المعاملة مطلوب'),
  reason: z.string().min(3, 'يرجى كتابة سبب رفض الدفع (3 أحرف على الأقل)'),
  requestNewReceipt: z.boolean().default(false),
});

export type RejectPaymentInput = z.infer<typeof RejectPaymentSchema>;

export const CreatePaymentProviderSchema = z.object({
  code: z.string().min(2, 'رمز المحفظة الفريد مطلوب (مثال: ONE_CASH, FLOOSAK)'),
  nameAr: z.string().min(2, 'الاسم العربي مطلوب'),
  nameEn: z.string().min(2, 'الاسم بالإنجليزية مطلوب'),
  entityIssuer: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  supportedMethods: z
    .array(
      z.enum([
        'MANUAL_RECEIPT',
        'MERCHANT_PAYMENT',
        'WALLET_TRANSFER',
        'QR_PAYMENT',
        'API',
        'WEBHOOK',
      ])
    )
    .default(['MANUAL_RECEIPT', 'MERCHANT_PAYMENT', 'WALLET_TRANSFER']),
  defaultCurrency: z.string().default('YER'),
  minAmount: z.number().nonnegative().optional().nullable(),
  maxAmount: z.number().positive().optional().nullable(),
  instructionsAr: z.string().optional().nullable(),
  instructionsEn: z.string().optional().nullable(),
  isAiVerificationEnabled: z.boolean().default(true),
  isApiVerificationEnabled: z.boolean().default(false),
  isWebhookEnabled: z.boolean().default(false),
});

export type CreatePaymentProviderInput = z.infer<typeof CreatePaymentProviderSchema>;

export const UpdatePaymentProviderSchema = z.object({
  nameAr: z.string().min(2, 'الاسم العربي مطلوب'),
  nameEn: z.string().min(2, 'الاسم الإنجليزي مطلوب'),
  entityIssuer: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  supportedMethods: z.array(
    z.enum([
      'MANUAL_RECEIPT',
      'MERCHANT_PAYMENT',
      'WALLET_TRANSFER',
      'QR_PAYMENT',
      'API',
      'WEBHOOK',
    ])
  ),
  defaultCurrency: z.string().default('YER'),
  minAmount: z.number().nonnegative().optional().nullable(),
  maxAmount: z.number().positive().optional().nullable(),
  instructionsAr: z.string().optional().nullable(),
  instructionsEn: z.string().optional().nullable(),
  isAiVerificationEnabled: z.boolean().default(true),
  isApiVerificationEnabled: z.boolean().default(false),
  isWebhookEnabled: z.boolean().default(false),
});

export type UpdatePaymentProviderInput = z.infer<typeof UpdatePaymentProviderSchema>;

export const SaveMerchantAccountSchema = z.object({
  providerId: z.string().min(1, 'معرف المحفظة مطلوب'),
  accountName: z.string().min(2, 'اسم الحساب مطلوب'),
  accountNumber: z.string().optional().nullable(),
  walletNumber: z.string().optional().nullable(),
  merchantId: z.string().optional().nullable(),
  merchantPaymentNumber: z.string().optional().nullable(),
  qrCodeUrl: z.string().optional().nullable(),
  accountHolderName: z.string().min(2, 'اسم صاحب الحساب مطلوب'),
  currency: z.string().default('YER'),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

export type SaveMerchantAccountInput = z.infer<typeof SaveMerchantAccountSchema>;


