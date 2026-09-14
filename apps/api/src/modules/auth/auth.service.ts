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
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة أو الحساب معطل');
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
