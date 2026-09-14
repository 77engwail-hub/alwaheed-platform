import { prisma } from '../../common/prisma.service.js';

export class AuditService {
  static async log(options: {
    userId?: string;
    userEmail?: string;
    action: string;
    entityType: string;
    entityId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
  }) {
    try {
      await prisma.auditLog.create({
        data: {
          userId: options.userId,
          userEmail: options.userEmail,
          action: options.action,
          entityType: options.entityType,
          entityId: options.entityId,
          details: options.details ? JSON.stringify(options.details) : null,
          ipAddress: options.ipAddress,
        },
      });
    } catch (e) {
      console.error('Failed to write audit log:', e);
    }
  }

  static async getLogs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count(),
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
