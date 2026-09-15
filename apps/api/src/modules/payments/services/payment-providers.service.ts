import { prisma } from '../../../common/prisma.service.js';
import type { PaymentProvider, MerchantWalletAccount, PaymentProviderCode } from '@al-waheed/types';
import type {
  CreatePaymentProviderInput,
  UpdatePaymentProviderInput,
  SaveMerchantAccountInput,
} from '@al-waheed/validation';

export class PaymentProvidersService {
  /**
   * Get all active payment providers for storefront checkout
   */
  public static async getActiveProviders(): Promise<any[]> {
    const providers = await prisma.paymentProvider.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        accounts: {
          where: { isActive: true },
          orderBy: { isDefault: 'desc' },
        },
      },
    });

    return providers.map((p) => ({
      ...p,
      supportedMethods: p.supportedMethods.split(',').filter(Boolean),
    }));
  }

  /**
   * Get all providers for admin settings
   */
  public static async getAllAdminProviders(): Promise<any[]> {
    const providers = await prisma.paymentProvider.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        accounts: true,
        credentials: {
          select: {
            id: true,
            apiUrl: true,
            environment: true,
            updatedAt: true,
          },
        },
      },
    });

    return providers.map((p) => ({
      ...p,
      supportedMethods: p.supportedMethods.split(',').filter(Boolean),
    }));
  }

  /**
   * Create a new payment provider or bank channel manually from Admin Panel
   */
  public static async createProvider(data: CreatePaymentProviderInput): Promise<any> {
    const existing = await prisma.paymentProvider.findUnique({
      where: { code: data.code.toUpperCase() },
    });

    if (existing) {
      throw new Error(`رمز المحفظة (${data.code}) مسجل مسبقاً، يرجى اختيار رمز مختلف.`);
    }

    const created = await prisma.paymentProvider.create({
      data: {
        code: data.code.toUpperCase(),
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        entityIssuer: data.entityIssuer || null,
        logoUrl: data.logoUrl || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        displayOrder: data.displayOrder || 0,
        supportedMethods: (data.supportedMethods || ['MANUAL_RECEIPT', 'MERCHANT_PAYMENT', 'WALLET_TRANSFER']).join(','),
        defaultCurrency: data.defaultCurrency || 'YER',
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        instructionsAr: data.instructionsAr,
        instructionsEn: data.instructionsEn,
        isAiVerificationEnabled: data.isAiVerificationEnabled !== undefined ? data.isAiVerificationEnabled : true,
        isApiVerificationEnabled: data.isApiVerificationEnabled || false,
        isWebhookEnabled: data.isWebhookEnabled || false,
      } as any,
      include: { accounts: true },
    });

    return {
      ...created,
      supportedMethods: created.supportedMethods.split(',').filter(Boolean),
    };
  }

  /**
   * Update provider settings
   */
  public static async updateProvider(
    id: string,
    data: UpdatePaymentProviderInput
  ): Promise<any> {
    const updated = await prisma.paymentProvider.update({
      where: { id },
      data: {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        entityIssuer: data.entityIssuer,
        logoUrl: data.logoUrl,
        isActive: data.isActive,
        displayOrder: data.displayOrder,
        supportedMethods: data.supportedMethods.join(','),
        defaultCurrency: data.defaultCurrency,
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        instructionsAr: data.instructionsAr,
        instructionsEn: data.instructionsEn,
        isAiVerificationEnabled: data.isAiVerificationEnabled,
        isApiVerificationEnabled: data.isApiVerificationEnabled,
        isWebhookEnabled: data.isWebhookEnabled,
      } as any,
      include: { accounts: true },
    });

    return {
      ...updated,
      supportedMethods: updated.supportedMethods.split(',').filter(Boolean),
    };
  }

  /**
   * Delete a custom payment provider
   */
  public static async deleteProvider(id: string): Promise<any> {
    return await prisma.paymentProvider.delete({
      where: { id },
    });
  }

  /**
   * Save or update a merchant wallet account
   */
  public static async saveMerchantAccount(data: SaveMerchantAccountInput): Promise<any> {
    if (data.isDefault) {
      await prisma.merchantWalletAccount.updateMany({
        where: { providerId: data.providerId },
        data: { isDefault: false },
      });
    }

    const existingAccount = await prisma.merchantWalletAccount.findFirst({
      where: { providerId: data.providerId },
    });

    if (existingAccount) {
      return await prisma.merchantWalletAccount.update({
        where: { id: existingAccount.id },
        data: {
          accountName: data.accountName,
          accountNumber: data.accountNumber,
          walletNumber: data.walletNumber,
          merchantId: data.merchantId,
          merchantPaymentNumber: data.merchantPaymentNumber || data.merchantId,
          qrCodeUrl: data.qrCodeUrl !== undefined ? data.qrCodeUrl : existingAccount.qrCodeUrl,
          accountHolderName: data.accountHolderName,
          currency: data.currency || 'YER',
          isActive: data.isActive !== undefined ? data.isActive : true,
          isDefault: data.isDefault || true,
        },
      });
    }

    return await prisma.merchantWalletAccount.create({
      data: {
        providerId: data.providerId,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        walletNumber: data.walletNumber,
        merchantId: data.merchantId,
        merchantPaymentNumber: data.merchantPaymentNumber || data.merchantId,
        qrCodeUrl: data.qrCodeUrl,
        accountHolderName: data.accountHolderName,
        currency: data.currency || 'YER',
        isActive: data.isActive !== undefined ? data.isActive : true,
        isDefault: data.isDefault || true,
      },
    });
  }

  /**
   * Seed default Yemeni payment providers with verified issuers & separated entities
   */
  public static async seedDefaultProviders(): Promise<void> {
    // Delete previous providers if re-seeding or updating entity data
    const existing = await prisma.paymentProvider.findMany();
    if (existing.length >= 6) {
      // Update entityIssuer on existing if missing
      for (const p of existing) {
        if (!(p as any).entityIssuer) {
          let issuer = 'مؤسسة الدفع الإلكتروني المعتمدة';
          if (p.code === 'ONE_CASH') issuer = 'شركة ون كاش لخدمات الدفع الإلكتروني (مجموعة هائل سعيد أنعم)';
          else if (p.code === 'FLOOSAK') issuer = 'شركة فلوسك للنقود الإلكترونية / شركة الأكوع موني (Al-Akwaa Money) وبنك اليمن والكويت';
          else if (p.code === 'JAWALI') issuer = 'شركة وي كاش (WeCash) لخدمات وأنظمة الدفع الإلكتروني';
          else if (p.code === 'CAC_MOBILY') issuer = 'بنك التسليف التعاوني والزراعي (كاك بنك - CAC Bank)';
          else if (p.code === 'SABA_CASH') issuer = 'شركة سبأكاش لخدمات النقود الإلكترونية (سبأفون)';
          else if (p.code === 'MPAY') issuer = 'شركة إم بي المتكاملة للأنظمة المالية';
          else if (p.code === 'CASH') issuer = 'خدمة كاش للدفع الإلكتروني';
          
          await prisma.paymentProvider.update({
            where: { id: p.id },
            data: { entityIssuer: issuer } as any,
          });
        }
      }
      return;
    }

    const defaultProviders = [
      {
        code: 'ONE_CASH',
        nameAr: 'ون كاش (ONE Cash)',
        nameEn: 'ONE Cash',
        entityIssuer: 'شركة ون كاش لخدمات الدفع الإلكتروني (مجموعة هائل سعيد أنعم وشركاه)',
        logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80',
        displayOrder: 1,
        supportedMethods: 'MANUAL_RECEIPT,MERCHANT_PAYMENT,WALLET_TRANSFER,QR_PAYMENT',
        instructionsAr: 'يرجى الدفع عبر تطبيق ون كاش إلى رقم خدمة المشتريات أو رقم المشترك ثم رفع صورة الإشعار.',
        accounts: {
          create: [
            {
              accountName: 'حساب مبيعات ون كاش الرئيسي',
              merchantId: '889201',
              merchantPaymentNumber: '889201',
              walletNumber: '777360681',
              accountHolderName: 'مؤسسة الوحيد للزخرفة المعمارية',
              isDefault: true,
            },
          ],
        },
      },
      {
        code: 'KURAIMI_BANK',
        nameAr: 'بنك الكريمي الإسلامي (حساب مميز / إكسبرس)',
        nameEn: 'Al-Kuraimi Bank (Special Account)',
        entityIssuer: 'بنك الكريمي للتمويل الأصغر الإسلامي (خدمة كريمي جوال / إكسبرس)',
        logoUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=120&q=80',
        displayOrder: 2,
        supportedMethods: 'MANUAL_RECEIPT,WALLET_TRANSFER',
        instructionsAr: 'التحويل عبر تطبيق كريمي جوال أو إيداع نقدي في حساب الكريمي المميز باسم المؤسسة.',
        accounts: {
          create: [
            {
              accountName: 'حساب بنك الكريمي المميز للمؤسسة',
              accountNumber: '12089456',
              walletNumber: '777360681',
              accountHolderName: 'مؤسسة الوحيد للزخرفة والنحت',
              isDefault: true,
            },
          ],
        },
      },
      {
        code: 'FLOOSAK',
        nameAr: 'محفظة فلوسك (Floosak)',
        nameEn: 'Floosak (Al-Akwaa Money / YKB)',
        entityIssuer: 'شركة فلوسك للنقود الإلكترونية / شركة الأكوع موني (Al-Akwaa Money) وبنك اليمن والكويت',
        logoUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=120&q=80',
        displayOrder: 3,
        supportedMethods: 'MANUAL_RECEIPT,MERCHANT_PAYMENT,WALLET_TRANSFER',
        instructionsAr: 'التحويل أو سداد المشتريات عبر تطبيق محفظة فلوسك.',
        accounts: {
          create: [
            {
              accountName: 'حساب محفظة فلوسك المعتمد',
              merchantId: '330192',
              walletNumber: '777360681',
              accountHolderName: 'مؤسسة الوحيد للزخرفة المعمارية',
              isDefault: true,
            },
          ],
        },
      },
      {
        code: 'JAWALI',
        nameAr: 'محفظة جوالي (Jawali)',
        nameEn: 'Jawali (WeCash)',
        entityIssuer: 'شركة وي كاش (WeCash) لخدمات وأنظمة الدفع الإلكتروني',
        logoUrl: 'https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?auto=format&fit=crop&w=120&q=80',
        displayOrder: 4,
        supportedMethods: 'MANUAL_RECEIPT,MERCHANT_PAYMENT,WALLET_TRANSFER,QR_PAYMENT',
        instructionsAr: 'الدفع لمشتريات جوالي أو التحويل لرقم المشترك ثم إرفاق إشعار السداد.',
        accounts: {
          create: [
            {
              accountName: 'حساب جوالي المعتمد',
              merchantId: '450912',
              walletNumber: '777360681',
              accountHolderName: 'مؤسسة الوحيد للأحجار',
              isDefault: true,
            },
          ],
        },
      },
      {
        code: 'CAC_MOBILY',
        nameAr: 'موبايل موني - كاك بنك (CAC Mobile)',
        nameEn: 'CAC Mobile Money',
        entityIssuer: 'بنك التسليف التعاوني والزراعي (كاك بنك - CAC Bank)',
        logoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=120&q=80',
        displayOrder: 5,
        supportedMethods: 'MANUAL_RECEIPT,WALLET_TRANSFER',
        instructionsAr: 'التحويل المباشر عبر تطبيق موبايل موني كاك بنك.',
        accounts: {
          create: [
            {
              accountName: 'حساب كاك بنك موبايل موني',
              accountNumber: '100458921',
              walletNumber: '777360681',
              accountHolderName: 'مؤسسة الوحيد للزخرفة',
              isDefault: true,
            },
          ],
        },
      },
      {
        code: 'SABA_CASH',
        nameAr: 'سبأكاش (SabaCash)',
        nameEn: 'SabaCash',
        entityIssuer: 'شركة سبأكاش لخدمات النقود الإلكترونية (سبأفون)',
        logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&q=80',
        displayOrder: 6,
        supportedMethods: 'MANUAL_RECEIPT,WALLET_TRANSFER,MERCHANT_PAYMENT',
        instructionsAr: 'سداد مشتريات سبأكاش أو التحويل لرقم الحساب.',
        accounts: {
          create: [
            {
              accountName: 'حساب سبأكاش',
              walletNumber: '777360681',
              accountHolderName: 'مؤسسة الوحيد',
              isDefault: true,
            },
          ],
        },
      },
      {
        code: 'MPAY',
        nameAr: 'إم بي المتكاملة (mPay)',
        nameEn: 'mPay',
        entityIssuer: 'شركة إم بي المتكاملة للخدمات والأنظمة المالية',
        logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80',
        displayOrder: 7,
        supportedMethods: 'MANUAL_RECEIPT,WALLET_TRANSFER',
        instructionsAr: 'التحويل عبر محفظة إم بي المتكاملة.',
        accounts: {
          create: [
            {
              accountName: 'حساب إم بي',
              walletNumber: '777360681',
              accountHolderName: 'مؤسسة الوحيد',
              isDefault: true,
            },
          ],
        },
      },
    ];

    for (const p of defaultProviders) {
      await prisma.paymentProvider.upsert({
        where: { code: p.code },
        update: {
          nameAr: p.nameAr,
          nameEn: p.nameEn,
          entityIssuer: p.entityIssuer,
          instructionsAr: p.instructionsAr,
        } as any,
        create: p as any,
      });
    }
  }
}
