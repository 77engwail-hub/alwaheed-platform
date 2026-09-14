import { Router, type Request, type Response } from 'express';
import { ProjectsService } from './projects.service.js';
import { CreateProjectSchema } from '@al-waheed/validation';
import { authenticateToken, requireRoles } from '../../common/auth.middleware.js';

export const projectsRouter = Router();

projectsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const result = await ProjectsService.getProjects(req.query as any);
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
      error: { code: 'PROJECTS_FETCH_ERROR', message: err.message },
    });
  }
});

projectsRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const cats = await ProjectsService.getProjectCategories();
    return res.json({ success: true, data: cats });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'PROJECT_CATEGORIES_FETCH_ERROR', message: err.message },
    });
  }
});

projectsRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const project = await ProjectsService.getProjectBySlug(req.params.slug);
    return res.json({ success: true, data: project });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      error: { code: 'PROJECT_NOT_FOUND', message: err.message },
    });
  }
});

projectsRouter.post(
  '/admin',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const validated = CreateProjectSchema.parse(req.body);
      const project = await ProjectsService.createProject(validated);
      return res.status(201).json({ success: true, data: project });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'PROJECT_CREATE_FAILED', message: err.message },
      });
    }
  }
);
