import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { authRouter } from './modules/auth/auth.controller.js';
import { catalogRouter } from './modules/catalog/catalog.controller.js';
import { quotationsRouter } from './modules/quotations/quotations.controller.js';
import { projectsRouter } from './modules/projects/projects.controller.js';
import { ordersRouter } from './modules/orders/orders.controller.js';
import { mediaRouter } from './modules/media/media.controller.js';
import { settingsRouter } from './modules/settings/settings.controller.js';
import { AuditService } from './modules/audit/audit.service.js';
import { authenticateToken, requireRoles } from './common/auth.middleware.js';
import { prisma } from './common/prisma.service.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Parsing Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads serving
const uploadDir = path.resolve(process.cwd(), process.env.LOCAL_UPLOAD_PATH || './uploads');
app.use('/uploads', express.static(uploadDir));
app.use('/api/v1/uploads', express.static(uploadDir));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  return res.json({
    status: 'healthy',
    service: 'Al-Waheed Architectural Stone Core API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Feature Routers on /api/v1/
const apiV1 = express.Router();

apiV1.use('/auth', authRouter);
apiV1.use('/catalog', catalogRouter);
apiV1.use('/quotations', quotationsRouter);
apiV1.use('/projects', projectsRouter);
apiV1.use('/orders', ordersRouter);
apiV1.use('/media', mediaRouter);
apiV1.use('/settings', settingsRouter);

// Admin Dashboard stats
apiV1.get(
  '/admin/dashboard/stats',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'),
  async (_req: Request, res: Response) => {
    try {
      const [
        totalProducts,
        totalProjects,
        totalQuotations,
        newQuotations,
        totalOrders,
        pendingOrders,
        recentQuotations,
        recentOrders,
      ] = await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.project.count({ where: { isActive: true } }),
        prisma.quotation.count(),
        prisma.quotation.count({ where: { status: 'NEW' } }),
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.quotation.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { items: true },
        }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { items: true },
        }),
      ]);

      return res.json({
        success: true,
        data: {
          summary: {
            totalProducts,
            totalProjects,
            totalQuotations,
            newQuotations,
            totalOrders,
            pendingOrders,
          },
          recentQuotations,
          recentOrders,
        },
      });
    } catch (e: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DASHBOARD_STATS_ERROR', message: e.message },
      });
    }
  }
);

// Admin Audit Logs
apiV1.get(
  '/admin/audit-logs',
  authenticateToken,
  requireRoles('SUPER_ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const logs = await AuditService.getLogs(
        Number(req.query.page) || 1,
        Number(req.query.limit) || 20
      );
      return res.json({
        success: true,
        data: logs.items,
        meta: {
          page: logs.page,
          limit: logs.limit,
          total: logs.total,
          totalPages: logs.totalPages,
        },
      });
    } catch (e: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'AUDIT_FETCH_ERROR', message: e.message },
      });
    }
  }
);

app.use('/api/v1', apiV1);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'حدث خطأ غير متوقع في الخادم',
      timestamp: new Date().toISOString(),
    },
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🏛️  Al-Waheed API Server running on port http://localhost:${PORT}/api/v1`);
    console.log(`🩺 Health check available at http://localhost:${PORT}/health`);
  });
}

export default app;
