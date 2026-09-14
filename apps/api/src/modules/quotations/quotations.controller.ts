import { Router, type Request, type Response } from 'express';
import { QuotationsService } from './quotations.service.js';
import {
  CreateQuotationSchema,
  UpdateQuotationStatusSchema,
  PriceQuotationSchema,
} from '@al-waheed/validation';
import { authenticateToken, requireRoles } from '../../common/auth.middleware.js';

export const quotationsRouter = Router();

// Public RFQ submission
quotationsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validated = CreateQuotationSchema.parse(req.body);
    const result = await QuotationsService.createQuotation(validated);
    return res.status(201).json({
      success: true,
      data: result,
      message: 'تم إرسال طلب عرض السعر بنجاح، سيقوم الفريق الهندسي بدراسته والتواصل معك في أقرب وقت.',
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: { code: 'RFQ_CREATION_FAILED', message: err.message },
    });
  }
});

// Public RFQ tracking
quotationsRouter.get('/track/:referenceNumber', async (req: Request, res: Response) => {
  try {
    const result = await QuotationsService.getQuotationByReference(req.params.referenceNumber);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      error: { code: 'RFQ_NOT_FOUND', message: err.message },
    });
  }
});

// Admin Protected Endpoints
quotationsRouter.get(
  '/admin/all',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const result = await QuotationsService.getAdminQuotations(req.query as any);
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
        error: { code: 'ADMIN_RFQ_FETCH_FAILED', message: err.message },
      });
    }
  }
);

quotationsRouter.patch(
  '/admin/:id/status',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const validated = UpdateQuotationStatusSchema.parse(req.body);
      const result = await QuotationsService.updateStatus({
        id: req.params.id,
        targetStatus: validated.status as any,
        notes: validated.notes,
        userId: req.user!.userId,
        userName: req.user!.name,
      });
      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'STATUS_TRANSITION_FAILED', message: err.message },
      });
    }
  }
);

quotationsRouter.put(
  '/admin/:id/pricing',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const validated = PriceQuotationSchema.parse(req.body);
      const result = await QuotationsService.priceQuotation(req.params.id, validated, req.user);
      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'PRICING_FAILED', message: err.message },
      });
    }
  }
);

quotationsRouter.post(
  '/admin/:id/convert-to-order',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const result = await QuotationsService.convertToOrder(req.params.id, req.user);
      return res.json({
        success: true,
        data: result,
        message: 'تم تحويل عرض السعر إلى أمر تنفيذ بنجاح',
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'CONVERSION_FAILED', message: err.message },
      });
    }
  }
);
