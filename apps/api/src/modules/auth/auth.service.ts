import { prisma } from '../../common/prisma.service.js';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../common/auth.middleware.js';
import type { LoginInput } from '@al-waheed/validation';
import type { RoleType } from '@al-waheed/types';
import { AuditService } from '../audit/audit.service.js';

export class AuthService {
  static async login(input: LoginInput, ipAddress?: string) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !user.isActive) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role as RoleType,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await AuditService.log({
      userId: user.id,
      userEmail: user.email,
      action: 'LOGIN_SUCCESS',
      entityType: 'User',
      entityId: user.id,
      ipAddress,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
    if (!user) throw new Error('المستخدم غير موجود');
    return user;
  }
}
