import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import { MediaService } from './media.service.js';
import { authenticateToken } from '../../common/auth.middleware.js';

const upload = multer({ storage: multer.memoryStorage() });

export const mediaRouter = Router();

// Public / Protected upload for RFQ attachments or Admin assets
mediaRouter.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'لم يتم تحديد أي ملف للرفع' },
      });
    }

    const category = req.body.category || 'GENERAL';
    const altTextAr = req.body.altTextAr;
    const asset = await MediaService.uploadFile(req.file, category, altTextAr);

    return res.status(201).json({ success: true, data: asset });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: { code: 'UPLOAD_FAILED', message: err.message },
    });
  }
});

mediaRouter.get('/all', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await MediaService.getMediaAssets(req.query as any);
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
      error: { code: 'MEDIA_FETCH_FAILED', message: err.message },
    });
  }
});
