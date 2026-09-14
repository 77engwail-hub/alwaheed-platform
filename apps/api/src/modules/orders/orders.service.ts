import { prisma } from '../../common/prisma.service.js';
import type { CreateOrderInput } from '@al-waheed/validation';

export class OrdersService {
  static async createOrder(input: CreateOrderInput) {
    const year = new Date().getFullYear();
    const count = await prisma.order.count();
    const orderNumber = `ORD-${year}-${String(count + 1).padStart(4, '0')}`;

    // Calculate subtotal from products
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of input.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`المنتج بالمعرف ${item.productId} غير متوفر`);
      }

      const unitPrice = product.basePrice || item.unitPrice;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      orderItemsData.push({
        productId: product.id,
        variantId: item.variantId || null,
        titleAr: product.titleAr,
        quantity: item.quantity,
        unit: product.unit,
        unitPrice,
        totalPrice,
      });
    }

    const deliveryFee = 0; // Configurable or free local delivery
    const discount = 0;
    const totalAmount = subtotal + deliveryFee - discount;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: input.customerName,
        phone: input.phone,
        email: input.email || null,
        shippingAddress: input.shippingAddress,
        city: input.city,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        paymentMethod: input.paymentMethod,
        subtotal,
        deliveryFee,
        discount,
        totalAmount,
        currency: 'YER',
        notes: input.notes,
        items: {
          create: orderItemsData,
        },
        statusHistory: {
          create: {
            newStatus: 'PENDING',
            notes: 'تم استلام أمر الشراء بنجاح',
          },
        },
      },
      include: {
        items: true,
        statusHistory: true,
      },
    });

    return order;
  }

  static async getOrderByNumber(orderNumber: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!order) throw new Error('الطلب غير موجود');
    return order;
  }

  static async getAdminOrders(query: { page?: number; limit?: number; status?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 15;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      prisma.order.count({ where }),
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
