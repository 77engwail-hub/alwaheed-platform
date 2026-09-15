import { Router, type Request, type Response } from 'express';
import { PaymentsService } from './services/payments.service.js';
import { PaymentProvidersService } from './services/payment-providers.service.js';
import {
  InitiatePaymentSchema,
  UploadReceiptSchema,
  ConfirmPaymentSchema,
  RejectPaymentSchema,
  CreatePaymentProviderSchema,
  UpdatePaymentProviderSchema,
  SaveMerchantAccountSchema,
} from '@al-waheed/validation';
import { authenticateToken, requireRoles } from '../../common/auth.middleware.js';

export const paymentsRouter = Router();

// ==============================================================================
// 1. Storefront & Customer Endpoints
// ==============================================================================

/**
 * Get active Yemeni payment providers with public merchant accounts
 */
paymentsRouter.get('/providers', async (_req: Request, res: Response) => {
  try {
    const providers = await PaymentProvidersService.getActiveProviders();
    return res.json({ success: true, data: providers });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'PROVIDERS_FETCH_FAILED', message: err.message },
    });
  }
});

/**
 * Initiate a payment transaction for an order
 */
paymentsRouter.post('/initiate', async (req: Request, res: Response) => {
  try {
    const validated = InitiatePaymentSchema.parse(req.body);
    const transaction = await PaymentsService.initiatePayment(validated);
    return res.status(201).json({
      success: true,
      data: transaction,
      message: 'تم تجهيز بيانات الدفع، يرجى إتمام التحويل ورفع صورة الإشعار.',
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: { code: 'PAYMENT_INITIATE_FAILED', message: err.message },
    });
  }
});

/**
 * Upload payment receipt, trigger AI OCR analysis & duplicate checks
 */
paymentsRouter.post('/upload-receipt', async (req: Request, res: Response) => {
  try {
    const validated = UploadReceiptSchema.parse(req.body);
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string;
    const result = await PaymentsService.uploadReceiptAndVerify(validated, ipAddress);

    return res.json({
      success: true,
      data: result,
      message: 'تم استلام إشعار الدفع بنجاح وجاري التحقق والمراجعة الذكية.',
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: { code: 'RECEIPT_UPLOAD_FAILED', message: err.message },
    });
  }
});

/**
 * Track transaction status (Comprehensive Public Tracking with Two-Stage Status)
 */
paymentsRouter.get('/public-status/:identifier', async (req: Request, res: Response) => {
  try {
    const status = await PaymentsService.getTransactionPublicStatus(req.params.identifier);
    return res.json({ success: true, data: status });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      error: { code: 'TRANSACTION_NOT_FOUND', message: err.message },
    });
  }
});

/**
 * Track transaction status by ID
 */
paymentsRouter.get('/track/:id', async (req: Request, res: Response) => {
  try {
    const transaction = await PaymentsService.getTransactionPublicStatus(req.params.id);
    return res.json({ success: true, data: transaction });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      error: { code: 'TRANSACTION_NOT_FOUND', message: err.message },
    });
  }
});

// ==============================================================================
// 2. Admin & Verification Center Endpoints
// ==============================================================================

/**
 * Get Paginated Payments List with Filters
 */
paymentsRouter.get(
  '/admin/transactions',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const result = await PaymentsService.getAdminPayments(req.query as any);
      return res.json({
        success: true,
        data: result.items,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'ADMIN_PAYMENTS_FETCH_FAILED', message: err.message },
      });
    }
  }
);

/**
 * Get Detailed Transaction with AI Verification & Side-by-side data
 */
paymentsRouter.get(
  '/admin/transactions/:id',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const transaction = await PaymentsService.getTransactionDetails(req.params.id);
      return res.json({ success: true, data: transaction });
    } catch (err: any) {
      return res.status(404).json({
        success: false,
        error: { code: 'TRANSACTION_NOT_FOUND', message: err.message },
      });
    }
  }
);

/**
 * Confirm Payment (Full, Partial, or Modified Amount)
 */
paymentsRouter.post(
  '/admin/confirm',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const validated = ConfirmPaymentSchema.parse(req.body);
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string;
      const adminUser = (req as any).user || { name: 'المسؤول' };

      const result = await PaymentsService.confirmPayment(validated, adminUser, ipAddress);

      return res.json({
        success: true,
        data: result,
        message: 'تم تأكيد واعتماد الدفع وتحديث رصيد الطلب بنجاح.',
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'PAYMENT_CONFIRM_FAILED', message: err.message },
      });
    }
  }
);

/**
 * Reject Payment or Request New Receipt
 */
paymentsRouter.post(
  '/admin/reject',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const validated = RejectPaymentSchema.parse(req.body);
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string;
      const adminUser = (req as any).user || { name: 'المسؤول' };

      const result = await PaymentsService.rejectPayment(validated, adminUser, ipAddress);

      return res.json({
        success: true,
        data: result,
        message: validated.requestNewReceipt
          ? 'تم طلب إشعار دفع جديد من العميل بنجاح.'
          : 'تم رفض إشعار الدفع وتسجيل السبب.',
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'PAYMENT_REJECT_FAILED', message: err.message },
      });
    }
  }
);

/**
 * Payments Dashboard KPI Stats
 */
paymentsRouter.get(
  '/admin/stats',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'),
  async (_req: Request, res: Response) => {
    try {
      const stats = await PaymentsService.getDashboardStats();
      return res.json({ success: true, data: stats });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DASHBOARD_STATS_FAILED', message: err.message },
      });
    }
  }
);

/**
 * Admin: Get All Providers & Accounts
 */
paymentsRouter.get(
  '/admin/providers',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN'),
  async (_req: Request, res: Response) => {
    try {
      const providers = await PaymentProvidersService.getAllAdminProviders();
      return res.json({ success: true, data: providers });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'PROVIDERS_FETCH_FAILED', message: err.message },
      });
    }
  }
);

/**
 * Admin: Create New Payment Provider / Bank Account
 */
paymentsRouter.post(
  '/admin/providers',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const validated = CreatePaymentProviderSchema.parse(req.body);
      const created = await PaymentProvidersService.createProvider(validated);
      return res.status(201).json({
        success: true,
        data: created,
        message: 'تم إضافة المحفظة أو الحساب البنكي الجديد بنجاح.',
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'PROVIDER_CREATE_FAILED', message: err.message },
      });
    }
  }
);

/**
 * Admin: Update Provider Settings
 */
paymentsRouter.put(
  '/admin/providers/:id',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const validated = UpdatePaymentProviderSchema.parse(req.body);
      const updated = await PaymentProvidersService.updateProvider(req.params.id, validated);
      return res.json({
        success: true,
        data: updated,
        message: 'تم تحديث إعدادات المحفظة بنجاح.',
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'PROVIDER_UPDATE_FAILED', message: err.message },
      });
    }
  }
);

/**
 * Admin: Delete Payment Provider
 */
paymentsRouter.delete(
  '/admin/providers/:id',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      await PaymentProvidersService.deleteProvider(req.params.id);
      return res.json({
        success: true,
        message: 'تم حذف المحفظة بنجاح.',
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'PROVIDER_DELETE_FAILED', message: err.message },
      });
    }
  }
);

/**
 * Admin: Save Merchant Wallet Account
 */
paymentsRouter.post(
  '/admin/accounts',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const validated = SaveMerchantAccountSchema.parse(req.body);
      const account = await PaymentProvidersService.saveMerchantAccount(validated);
      return res.status(201).json({
        success: true,
        data: account,
        message: 'تم حفظ حساب المحفظة بنجاح.',
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'ACCOUNT_SAVE_FAILED', message: err.message },
      });
    }
  }
);
