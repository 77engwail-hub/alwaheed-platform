import { Router, type Request, type Response } from 'express';
import { OrdersService } from './orders.service.js';
import { CreateOrderSchema } from '@al-waheed/validation';
import { authenticateToken, requireRoles } from '../../common/auth.middleware.js';

export const ordersRouter = Router();

ordersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validated = CreateOrderSchema.parse(req.body);
    const order = await OrdersService.createOrder(validated);
    return res.status(201).json({
      success: true,
      data: order,
      message: 'تم تسجيل طلب الشراء بنجاح، وسيتواصل معك فريق التجهيز لتأكيد الشحن.',
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: { code: 'ORDER_CREATE_FAILED', message: err.message },
    });
  }
});

ordersRouter.get('/track/:orderNumber', async (req: Request, res: Response) => {
  try {
    const order = await OrdersService.getOrderByNumber(req.params.orderNumber);
    return res.json({ success: true, data: order });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      error: { code: 'ORDER_NOT_FOUND', message: err.message },
    });
  }
});

ordersRouter.get(
  '/admin/all',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const result = await OrdersService.getAdminOrders(req.query as any);
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
        error: { code: 'ADMIN_ORDERS_FETCH_FAILED', message: err.message },
      });
    }
  }
);
