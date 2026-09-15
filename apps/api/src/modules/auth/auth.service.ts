import { prisma } from '../../common/prisma.service.js';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../common/auth.middleware.js';
import type { LoginInput } from '@al-waheed/validation';
import type { RoleType } from '@al-waheed/types';
import { AuditService } from '../audit/audit.service.js';

export class AuthService {
  static async login(input: LoginInput, ipAddress?: string) {
    const rawIdentifier = input.email.trim();
    const cleanPhone = rawIdentifier.replace(/[\s\-]/g, '');
    const phoneNoCode = cleanPhone.replace(/^(\+967|00967|0)/, '');
    const phoneVariants = [
      rawIdentifier,
      cleanPhone,
      phoneNoCode,
      `+967${phoneNoCode}`,
      `00967${phoneNoCode}`,
      `0${phoneNoCode}`,
    ].filter(Boolean);

    // Look up by email (exact/lowercase), phone variants, or username / name
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: rawIdentifier },
          { email: rawIdentifier.toLowerCase() },
          { phone: { in: phoneVariants } },
          { name: rawIdentifier },
        ],
      },
    });

    if (!user) {
      throw new Error('بيانات الدخول (البريد، الهاتف، أو اسم المستخدم) أو كلمة المرور غير صحيحة');
    }

    if (!user.isActive) {
      throw new Error('تم تعطيل هذا الحساب. يرجى التواصل مع إدارة النظام للمساعدة');
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      await AuditService.log({
        userId: user.id,
        userEmail: user.email,
        action: 'LOGIN_FAILED_WRONG_PASSWORD',
        entityType: 'User',
        entityId: user.id,
        ipAddress,
      }).catch(() => {});
      throw new Error('بيانات الدخول أو كلمة المرور غير صحيحة');
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
        phone: user.phone,
        role: user.role,
      },
    };
  }

  static async register(
    input: { email: string; password: string; name: string; phone?: string },
    ipAddress?: string
  ) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new Error('هذا البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        phone: input.phone || null,
        passwordHash,
        role: 'CUSTOMER',
        isActive: true,
      },
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
      action: 'CUSTOMER_REGISTER',
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
        phone: user.phone,
        role: user.role,
      },
    };
  }

  static async socialLogin(
    input: { provider: string; email?: string; name?: string; phone?: string; avatar?: string },
    ipAddress?: string
  ) {
    const providerNameMap: Record<string, string> = {
      google: 'Google',
      facebook: 'Facebook',
      twitter: 'X (Twitter)',
      apple: 'Apple ID',
      whatsapp: 'WhatsApp',
    };

    const email = input.email || `${input.provider}.user@alwaheed-stone.com`;
    const name = input.name || `مستخدم ${providerNameMap[input.provider] || input.provider}`;

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(input.phone ? [{ phone: input.phone }] : []),
        ],
      },
    });

    if (!user) {
      const dummyPasswordHash = await bcrypt.hash(`SocialOAuth_${input.provider}_${Date.now()}`, 10);
      user = await prisma.user.create({
        data: {
          email,
          name,
          phone: input.phone || null,
          passwordHash: dummyPasswordHash,
          role: 'CUSTOMER',
          isActive: true,
        },
      });
    }

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
      action: `SOCIAL_LOGIN_${input.provider.toUpperCase()}`,
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
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      message: `تم تسجيل الدخول بنجاح عبر ${providerNameMap[input.provider] || input.provider}`,
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
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
    if (!user) throw new Error('المستخدم غير موجود');
    return user;
  }

  static async updateProfile(
    userId: string,
    data: { name?: string; phone?: string; email?: string },
    ipAddress?: string
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('المستخدم غير موجود');

    const updateData: any = {};
    if (data.name && data.name.trim()) updateData.name = data.name.trim();
    if (data.phone !== undefined) updateData.phone = data.phone?.trim() || null;
    if (data.email && data.email.trim() && data.email.trim() !== user.email) {
      const emailExists = await prisma.user.findUnique({ where: { email: data.email.trim() } });
      if (emailExists) throw new Error('البريد الإلكتروني مستخدم بالفعل بحساب آخر');
      updateData.email = data.email.trim();
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    await AuditService.log({
      userId,
      userEmail: updated.email,
      action: 'UPDATE_PROFILE',
      entityType: 'User',
      entityId: userId,
      details: data,
      ipAddress,
    });

    return updated;
  }

  static async changePassword(
    userId: string,
    input: { currentPassword?: string; newPassword: string },
    isAdminBypass: boolean = false,
    ipAddress?: string
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('المستخدم غير موجود');

    if (!isAdminBypass) {
      if (!input.currentPassword) throw new Error('يرجى إدخال كلمة المرور الحالية');
      const isValid = await bcrypt.compare(input.currentPassword, user.passwordHash);
      if (!isValid) throw new Error('كلمة المرور الحالية غير صحيحة');
    }

    if (!input.newPassword || input.newPassword.length < 6) {
      throw new Error('كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف أو أرقام');
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await AuditService.log({
      userId,
      userEmail: user.email,
      action: 'CHANGE_PASSWORD',
      entityType: 'User',
      entityId: userId,
      details: { changedByAdmin: isAdminBypass },
      ipAddress,
    });

    return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
  }

  static async getSecurityOverview(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
    if (!user) throw new Error('المستخدم غير موجود');

    const logs = await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      user,
      lastLoginAt: user.lastLoginAt,
      securityLogs: logs,
      securityStatus: {
        hasPhone: !!user.phone,
        twoFactorReady: true,
        lastPasswordChange: logs.find((l) => l.action === 'CHANGE_PASSWORD')?.createdAt || user.createdAt,
      },
    };
  }

  static async deactivateAccount(userId: string, ipAddress?: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    await AuditService.log({
      userId,
      userEmail: user.email,
      action: 'DEACTIVATE_ACCOUNT',
      entityType: 'User',
      entityId: userId,
      ipAddress,
    });

    return { success: true, message: 'تم تعطيل الحساب بنجاح' };
  }

  // --- Admin User Management ---

  static async listUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
  }

  static async createUser(
    input: {
      email: string;
      password: string;
      name: string;
      phone?: string;
      role: RoleType;
      isActive?: boolean;
    },
    adminUserId: string,
    ipAddress?: string
  ) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        phone: input.phone || null,
        passwordHash,
        role: input.role || 'SALES_MANAGER',
        isActive: input.isActive ?? true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    await AuditService.log({
      userId: adminUserId,
      action: 'CREATE_USER',
      entityType: 'User',
      entityId: user.id,
      details: { email: user.email, role: user.role },
      ipAddress,
    });

    return user;
  }

  static async updateUser(
    userId: string,
    data: {
      role?: RoleType;
      isActive?: boolean;
      name?: string;
      phone?: string;
      newPassword?: string;
    },
    adminUserId: string,
    ipAddress?: string
  ) {
    const updateData: any = {};
    if (data.role) updateData.role = data.role;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.name) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.newPassword) {
      updateData.passwordHash = await bcrypt.hash(data.newPassword, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    await AuditService.log({
      userId: adminUserId,
      action: 'UPDATE_USER',
      entityType: 'User',
      entityId: user.id,
      details: data,
      ipAddress,
    });

    return user;
  }

  static async deleteUser(userId: string, adminUserId: string, ipAddress?: string) {
    const user = await prisma.user.delete({
      where: { id: userId },
    });

    await AuditService.log({
      userId: adminUserId,
      action: 'DELETE_USER',
      entityType: 'User',
      entityId: userId,
      details: { email: user.email },
      ipAddress,
    });

    return true;
  }
}
