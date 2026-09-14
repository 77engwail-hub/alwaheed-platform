import { prisma } from '../../common/prisma.service.js';
import { QuotationStateMachine } from './quotation-state-machine.js';
import type { CreateQuotationInput, PriceQuotationInput } from '@al-waheed/validation';
import type { QuotationStatus } from '@al-waheed/types';
import { AuditService } from '../audit/audit.service.js';

export class QuotationsService {
  static async createQuotation(input: CreateQuotationInput) {
    const year = new Date().getFullYear();
    const count = await prisma.quotation.count();
    const referenceNumber = `RFQ-${year}-${String(count + 1).padStart(4, '0')}`;

    const quotation = await prisma.quotation.create({
      data: {
        referenceNumber,
        customerName: input.customerName,
        phone: input.phone,
        whatsapp: input.whatsapp || input.phone,
        email: input.email || null,
        city: input.city,
        projectType: input.projectType,
        preferredStoneType: input.preferredStoneType,
        approximateBudget: input.approximateBudget,
        description: input.description,
        needsInstallation: input.needsInstallation,
        needsDelivery: input.needsDelivery,
        status: 'NEW',
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            customTitle: item.customTitle,
            materialPreference: item.materialPreference,
            finishPreference: item.finishPreference,
            quantity: item.quantity,
            unit: item.unit,
            dimensionsDesc: item.dimensionsDesc,
          })),
        },
        attachments: {
          create: input.attachments.map((att) => ({
            fileName: att.fileName,
            fileUrl: att.fileUrl,
            fileSize: att.fileSize,
            mimeType: att.mimeType,
          })),
        },
        statusHistory: {
          create: {
            newStatus: 'NEW',
            notes: 'تم استلام طلب عرض السعر من الموقع الإلكتروني بنجاح',
          },
        },
      },
      include: {
        items: true,
        attachments: true,
        statusHistory: true,
      },
    });

    return quotation;
  }

  static async getQuotationByReference(referenceNumber: string) {
    const quotation = await prisma.quotation.findUnique({
      where: { referenceNumber },
      include: {
        items: true,
        attachments: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!quotation) {
      throw new Error('طلب عرض السعر غير موجود');
    }

    return quotation;
  }

  static async getAdminQuotations(query: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 15;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { referenceNumber: { contains: query.search } },
        { customerName: { contains: query.search } },
        { phone: { contains: query.search } },
        { city: { contains: query.search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.quotation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          attachments: true,
          statusHistory: { take: 1, orderBy: { createdAt: 'desc' } },
        },
      }),
      prisma.quotation.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async updateStatus(options: {
    id: string;
    targetStatus: QuotationStatus;
    notes?: string | null;
    userId?: string;
    userName?: string;
  }) {
    const quotation = await prisma.quotation.findUnique({
      where: { id: options.id },
    });

    if (!quotation) throw new Error('طلب السعر غير موجود');

    QuotationStateMachine.validateTransition(
      quotation.status as QuotationStatus,
      options.targetStatus
    );

    const updated = await prisma.$transaction([
      prisma.quotation.update({
        where: { id: options.id },
        data: { status: options.targetStatus },
      }),
      prisma.quotationStatusHistory.create({
        data: {
          quotationId: options.id,
          previousStatus: quotation.status,
          newStatus: options.targetStatus,
          changedById: options.userId,
          changedByName: options.userName,
          notes: options.notes,
        },
      }),
    ]);

    await AuditService.log({
      userId: options.userId,
      action: 'UPDATE_QUOTATION_STATUS',
      entityType: 'Quotation',
      entityId: options.id,
      details: {
        from: quotation.status,
        to: options.targetStatus,
        notes: options.notes,
      },
    });

    return updated[0];
  }

  static async priceQuotation(id: string, input: PriceQuotationInput, adminUser: any) {
    const quotation = await prisma.quotation.findUnique({ where: { id } });
    if (!quotation) throw new Error('طلب السعر غير موجود');

    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + (input.validUntilDays || 30));

    // Update item prices if provided
    if (input.itemPrices && input.itemPrices.length > 0) {
      for (const ip of input.itemPrices) {
        await prisma.quotationItem.update({
          where: { id: ip.itemId },
          data: {
            unitPriceEstimate: ip.unitPriceEstimate,
            totalPriceEstimate: ip.totalPriceEstimate,
          },
        });
      }
    }

    const updated = await prisma.quotation.update({
      where: { id },
      data: {
        totalQuotedPrice: input.totalQuotedPrice,
        currency: input.currency || 'YER',
        validUntil: validUntilDate,
        adminNotes: input.adminNotes,
        status: 'PRICED',
      },
      include: {
        items: true,
        attachments: true,
      },
    });

    await prisma.quotationStatusHistory.create({
      data: {
        quotationId: id,
        previousStatus: quotation.status,
        newStatus: 'PRICED',
        changedById: adminUser.userId,
        changedByName: adminUser.name,
        notes: `تم تسعير الطلب بإجمالي: ${input.totalQuotedPrice} ${input.currency || 'YER'}`,
      },
    });

    return updated;
  }

  static async convertToOrder(id: string, adminUser: any) {
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!quotation) throw new Error('طلب السعر غير موجود');
    if (!quotation.totalQuotedPrice) throw new Error('لا يمكن تحويل طلب غير مسعر إلى أمر تنفيذ');

    const orderCount = await prisma.order.count();
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, '0')}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: quotation.customerName,
        phone: quotation.phone,
        email: quotation.email,
        shippingAddress: `${quotation.city} - تم التحويل من طلب عرض سعر رقم ${quotation.referenceNumber}`,
        city: quotation.city,
        status: 'CONFIRMED',
        paymentStatus: 'UNPAID',
        paymentMethod: 'CUSTOM_AGREEMENT',
        subtotal: quotation.totalQuotedPrice,
        totalAmount: quotation.totalQuotedPrice,
        currency: quotation.currency,
        notes: quotation.description,
        items: {
          create: quotation.items.map((item) => ({
            productId: item.productId || 'custom-item',
            titleAr: item.customTitle || 'بند مخصص حسب عرض السعر',
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPriceEstimate || 0,
            totalPrice: item.totalPriceEstimate || 0,
          })),
        },
      },
    });

    await this.updateStatus({
      id,
      targetStatus: 'CONVERTED_TO_ORDER',
      notes: `تم تحويل العرض إلى أمر تنفيذ مباشر برقم: ${orderNumber}`,
      userId: adminUser.userId,
      userName: adminUser.name,
    });

    return order;
  }
}
