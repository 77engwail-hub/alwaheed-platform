import { prisma } from '../../common/prisma.service.js';
import type { ContactMessageInput } from '@al-waheed/validation';

export class SettingsService {
  static async getPublicSettings() {
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return map;
  }

  static async updateSetting(key: string, value: string) {
    return prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  static async submitContactMessage(input: ContactMessageInput) {
    return prisma.contactMessage.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        subject: input.subject,
        message: input.message,
      },
    });
  }

  static async getContactMessages(page = 1, limit = 15) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.contactMessage.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count(),
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
