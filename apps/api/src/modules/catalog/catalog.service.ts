import { prisma } from '../../common/prisma.service.js';
import type { CreateProductInput } from '@al-waheed/validation';

export class CatalogService {
  static async getProducts(query: {
    page?: number;
    limit?: number;
    categorySlug?: string;
    materialSlug?: string;
    finishSlug?: string;
    pricingMode?: string;
    search?: string;
    isFeatured?: boolean;
    sort?: 'featured' | 'newest' | 'price_asc' | 'price_desc';
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (query.categorySlug) {
      where.category = { slug: query.categorySlug };
    }

    if (query.materialSlug) {
      where.materials = { some: { material: { slug: query.materialSlug } } };
    }

    if (query.finishSlug) {
      where.finishes = { some: { finish: { slug: query.finishSlug } } };
    }

    if (query.pricingMode) {
      where.pricingMode = query.pricingMode;
    }

    if (query.isFeatured !== undefined) {
      where.isFeatured = String(query.isFeatured) === 'true';
    }

    if (query.search) {
      where.OR = [
        { titleAr: { contains: query.search } },
        { titleEn: { contains: query.search } },
        { shortDescAr: { contains: query.search } },
        { fullDescAr: { contains: query.search } },
        { sku: { contains: query.search } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (query.sort === 'featured') orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
    if (query.sort === 'price_asc') orderBy = { basePrice: 'asc' };
    if (query.sort === 'price_desc') orderBy = { basePrice: 'desc' };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          materials: { include: { material: true } },
          finishes: { include: { finish: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items: items.map(this.formatProductResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        materials: { include: { material: true } },
        finishes: { include: { finish: true } },
      },
    });

    if (!product || !product.isActive) {
      throw new Error('المنتج المطلوب غير موجود أو غير متاح حالياً');
    }

    // Fetch related products in the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
    });

    return {
      ...this.formatProductResponse(product),
      relatedProducts: relatedProducts.map(this.formatProductResponse),
    };
  }

  static async getCategories() {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  static async getMaterials() {
    return prisma.material.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getFinishes() {
    return prisma.finish.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin Catalog Methods
  static async createProduct(input: CreateProductInput) {
    const product = await prisma.product.create({
      data: {
        titleAr: input.titleAr,
        titleEn: input.titleEn,
        slug: input.slug,
        sku: input.sku,
        shortDescAr: input.shortDescAr,
        shortDescEn: input.shortDescEn,
        fullDescAr: input.fullDescAr,
        fullDescEn: input.fullDescEn,
        categoryId: input.categoryId,
        pricingMode: input.pricingMode,
        unit: input.unit,
        basePrice: input.basePrice,
        compareAtPrice: input.compareAtPrice,
        currency: input.currency,
        isFeatured: input.isFeatured,
        isActive: input.isActive,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        materials: {
          create: input.materialIds.map((materialId) => ({ materialId })),
        },
        finishes: {
          create: input.finishIds.map((finishId) => ({ finishId })),
        },
      },
      include: {
        category: true,
        materials: { include: { material: true } },
        finishes: { include: { finish: true } },
        images: true,
      },
    });

    return this.formatProductResponse(product);
  }

  static async updateProduct(id: string, input: Partial<CreateProductInput>) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new Error('المنتج غير موجود');

    if (input.materialIds) {
      await prisma.productMaterial.deleteMany({ where: { productId: id } });
    }
    if (input.finishIds) {
      await prisma.productFinish.deleteMany({ where: { productId: id } });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...input,
        materialIds: undefined,
        finishIds: undefined,
        materials: input.materialIds
          ? { create: input.materialIds.map((materialId) => ({ materialId })) }
          : undefined,
        finishes: input.finishIds
          ? { create: input.finishIds.map((finishId) => ({ finishId })) }
          : undefined,
      } as any,
      include: {
        category: true,
        materials: { include: { material: true } },
        finishes: { include: { finish: true } },
        images: true,
      },
    });

    return this.formatProductResponse(updated);
  }

  static async deleteProduct(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private static formatProductResponse(p: any) {
    return {
      ...p,
      materials: p.materials ? p.materials.map((pm: any) => pm.material || pm) : [],
      finishes: p.finishes ? p.finishes.map((pf: any) => pf.finish || pf) : [],
    };
  }
}
