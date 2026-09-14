import { prisma } from '../../common/prisma.service.js';
import { defaultStorage } from '../../common/storage/local-storage.provider.js';

export class MediaService {
  static async uploadFile(file: Express.Multer.File, category: string = 'GENERAL', altTextAr?: string) {
    // Validate MIME types
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new Error('نوع الملف غير مدعوم. يسمح فقط بالصور (JPG, PNG, WEBP, SVG) والمخططات (PDF).');
    }

    // Validate size (15MB)
    if (file.size > 15 * 1024 * 1024) {
      throw new Error('حجم الملف يتجاوز الحد الأقصى المسموح به (15 ميغابايت).');
    }

    const uploadRes = await defaultStorage.upload(file, category.toLowerCase());

    const asset = await prisma.mediaAsset.create({
      data: {
        fileName: uploadRes.fileName,
        originalName: file.originalname,
        fileUrl: uploadRes.fileUrl,
        mimeType: uploadRes.mimeType,
        fileSize: uploadRes.fileSize,
        category,
        altTextAr: altTextAr || file.originalname,
      },
    });

    return asset;
  }

  static async getMediaAssets(query: { category?: string; page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.category) where.category = query.category;

    const [items, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.mediaAsset.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
