import type { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import type { RoleType } from '@al-waheed/types';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  name: string;
  role: RoleType;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production-al-waheed-2026';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'يجب تسجيل الدخول للوصول إلى هذا المسار',
      },
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN_TOKEN_INVALID',
        message: 'جلسة تسجيل الدخول منتهية أو غير صالحة',
      },
    });
  }
}

export function requireRoles(...allowedRoles: RoleType[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'يجب تسجيل الدخول للتحقق من الصلاحيات',
        },
      });
    }

    if (req.user.role === 'SUPER_ADMIN') {
      return next(); // Super admin has full permissions
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'ليس لديك الصلاحيات الكافية لتنفيذ هذا الإجراء',
        },
      });
    }

    next();
  };
}
