import { Router, type Request, type Response } from 'express';
import { CatalogService } from './catalog.service.js';
import { CreateProductSchema } from '@al-waheed/validation';
import { authenticateToken, requireRoles } from '../../common/auth.middleware.js';

export const catalogRouter = Router();

// Public Endpoints
catalogRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const result = await CatalogService.getProducts(req.query as any);
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
      error: { code: 'CATALOG_FETCH_ERROR', message: err.message },
    });
  }
});

catalogRouter.get('/products/:slug', async (req: Request, res: Response) => {
  try {
    const product = await CatalogService.getProductBySlug(req.params.slug);
    return res.json({
      success: true,
      data: product,
    });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      error: { code: 'PRODUCT_NOT_FOUND', message: err.message },
    });
  }
});

catalogRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await CatalogService.getCategories();
    return res.json({ success: true, data: categories });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'CATEGORIES_FETCH_ERROR', message: err.message },
    });
  }
});

catalogRouter.get('/materials', async (_req: Request, res: Response) => {
  try {
    const materials = await CatalogService.getMaterials();
    return res.json({ success: true, data: materials });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'MATERIALS_FETCH_ERROR', message: err.message },
    });
  }
});

catalogRouter.get('/finishes', async (_req: Request, res: Response) => {
  try {
    const finishes = await CatalogService.getFinishes();
    return res.json({ success: true, data: finishes });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'FINISHES_FETCH_ERROR', message: err.message },
    });
  }
});

// Admin Protected Endpoints
catalogRouter.post(
  '/admin/products',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'CATALOG_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const validated = CreateProductSchema.parse(req.body);
      const product = await CatalogService.createProduct(validated);
      return res.status(201).json({ success: true, data: product });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'PRODUCT_CREATE_FAILED', message: err.message },
      });
    }
  }
);

catalogRouter.put(
  '/admin/products/:id',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'CATALOG_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const product = await CatalogService.updateProduct(req.params.id, req.body);
      return res.json({ success: true, data: product });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'PRODUCT_UPDATE_FAILED', message: err.message },
      });
    }
  }
);

catalogRouter.delete(
  '/admin/products/:id',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'CATALOG_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      await CatalogService.deleteProduct(req.params.id);
      return res.json({ success: true, message: 'تم تعطيل المنتج بنجاح' });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'PRODUCT_DELETE_FAILED', message: err.message },
      });
    }
  }
);
