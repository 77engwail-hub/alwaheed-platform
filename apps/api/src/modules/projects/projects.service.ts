import { prisma } from '../../common/prisma.service.js';
import type { CreateProjectInput } from '@al-waheed/validation';

export class ProjectsService {
  static async getProjects(query: {
    page?: number;
    limit?: number;
    projectType?: string;
    categorySlug?: string;
    isFeatured?: boolean;
    search?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (query.projectType) where.projectType = query.projectType;
    if (query.categorySlug) where.category = { slug: query.categorySlug };
    if (query.isFeatured !== undefined) where.isFeatured = query.isFeatured;

    if (query.search) {
      where.OR = [
        { titleAr: { contains: query.search } },
        { titleEn: { contains: query.search } },
        { locationCity: { contains: query.search } },
        { shortDescAr: { contains: query.search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { completionYear: 'desc' }, { createdAt: 'desc' }],
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          materials: { include: { material: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      items: items.map(this.formatProjectResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getProjectBySlug(slug: string) {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        materials: { include: { material: true } },
      },
    });

    if (!project || !project.isActive) {
      throw new Error('المشروع غير موجود');
    }

    // Get related projects
    const related = await prisma.project.findMany({
      where: {
        id: { not: project.id },
        isActive: true,
      },
      take: 3,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
    });

    return {
      ...this.formatProjectResponse(project),
      relatedProjects: related.map(this.formatProjectResponse),
    };
  }

  static async getProjectCategories() {
    return prisma.projectCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { projects: true } } },
    });
  }

  static async createProject(input: CreateProjectInput) {
    const project = await prisma.project.create({
      data: {
        titleAr: input.titleAr,
        titleEn: input.titleEn,
        slug: input.slug,
        projectType: input.projectType,
        locationCity: input.locationCity,
        completionYear: input.completionYear,
        shortDescAr: input.shortDescAr,
        shortDescEn: input.shortDescEn,
        fullDescAr: input.fullDescAr,
        fullDescEn: input.fullDescEn,
        coverImageUrl: input.coverImageUrl,
        isFeatured: input.isFeatured,
        isActive: input.isActive,
        materials: {
          create: input.materialIds.map((materialId) => ({ materialId })),
        },
      },
      include: {
        images: true,
        materials: { include: { material: true } },
      },
    });

    return this.formatProjectResponse(project);
  }

  private static formatProjectResponse(p: any) {
    return {
      ...p,
      materials: p.materials ? p.materials.map((pm: any) => pm.material || pm) : [],
    };
  }
}
