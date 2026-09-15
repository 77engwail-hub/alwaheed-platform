import { Router, type Request, type Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginSchema } from '@al-waheed/validation';
import { authenticateToken, requireRoles } from '../../common/auth.middleware.js';

export const authRouter = Router();

// 1. User / Admin / Customer Login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const validated = LoginSchema.parse(req.body);
    const ip = req.ip || req.socket.remoteAddress;
    const result = await AuthService.login(validated, ip);
    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'AUTH_FAILED',
        message: err.message || 'فشل تسجيل الدخول',
      },
    });
  }
});

// 2. Customer Self-Registration
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'يرجى إدخال الاسم والبريد الإلكتروني وكلمة المرور' },
      });
    }

    const ip = req.ip || req.socket.remoteAddress;
    const result = await AuthService.register({ email, password, name, phone }, ip);
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'REGISTER_FAILED',
        message: err.message || 'فشل تسجيل الحساب',
      },
    });
  }
});

// 3. Get Current User Profile
authRouter.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getProfile(req.user!.userId);
    return res.json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: err.message,
      },
    });
  }
});

// 3.1 Update User Profile
authRouter.patch('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.socket.remoteAddress;
    const updated = await AuthService.updateProfile(req.user!.userId, req.body, ip);
    return res.json({
      success: true,
      data: updated,
      message: 'تم تحديث الملف الشخصي بنجاح',
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: { code: 'UPDATE_PROFILE_FAILED', message: err.message },
    });
  }
});

// 3.2 Change Password
authRouter.post('/change-password', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const ip = req.ip || req.socket.remoteAddress;
    const result = await AuthService.changePassword(
      req.user!.userId,
      { currentPassword, newPassword },
      false,
      ip
    );
    return res.json({
      success: true,
      data: result,
      message: 'تم تغيير كلمة المرور بنجاح',
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: { code: 'CHANGE_PASSWORD_FAILED', message: err.message },
    });
  }
});

// 3.3 Security Overview & Audit Logs
authRouter.get('/security-overview', authenticateToken, async (req: Request, res: Response) => {
  try {
    const overview = await AuthService.getSecurityOverview(req.user!.userId);
    return res.json({
      success: true,
      data: overview,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SECURITY_OVERVIEW_FAILED', message: err.message },
    });
  }
});

// 3.4 Deactivate Own Account
authRouter.post('/deactivate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.socket.remoteAddress;
    const result = await AuthService.deactivateAccount(req.user!.userId, ip);
    return res.json({
      success: true,
      data: result,
      message: 'تم تعطيل الحساب بنجاح',
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: { code: 'DEACTIVATE_FAILED', message: err.message },
    });
  }
});

// --- Admin Management Routes ---

// 4. List All Users
authRouter.get(
  '/users',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN'),
  async (_req: Request, res: Response) => {
    try {
      const users = await AuthService.listUsers();
      return res.json({ success: true, data: users });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: err.message },
      });
    }
  }
);

// 5. Create New User with Specific Role
authRouter.post(
  '/users',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const { email, password, name, phone, role, isActive } = req.body;
      if (!email || !password || !name || !role) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'يرجى إكمال الحقول المطلوبة' },
        });
      }

      const ip = req.ip || req.socket.remoteAddress;
      const user = await AuthService.createUser(
        { email, password, name, phone, role, isActive },
        req.user!.userId,
        ip
      );
      return res.status(201).json({ success: true, data: user });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'CREATE_USER_FAILED', message: err.message },
      });
    }
  }
);

// 6. Update User Role or Status
authRouter.patch(
  '/users/:id',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const updated = await AuthService.updateUser(req.params.id, req.body, req.user!.userId, ip);
      return res.json({ success: true, data: updated });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'UPDATE_USER_FAILED', message: err.message },
      });
    }
  }
);

// 7. Delete User (Super Admin only)
authRouter.delete(
  '/users/:id',
  authenticateToken,
  requireRoles('SUPER_ADMIN'),
  async (req: Request, res: Response) => {
    try {
      if (req.params.id === req.user!.userId) {
        return res.status(400).json({
          success: false,
          error: { code: 'CANNOT_DELETE_SELF', message: 'لا يمكنك حذف حسابك الحالي' },
        });
      }

      const ip = req.ip || req.socket.remoteAddress;
      await AuthService.deleteUser(req.params.id, req.user!.userId, ip);
      return res.json({ success: true, message: 'تم حذف المستخدم بنجاح' });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'DELETE_USER_FAILED', message: err.message },
      });
    }
  }
);

// 8. Admin Reset User Password
authRouter.post(
  '/users/:id/reset-password',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_PASSWORD', message: 'كلمة المرور يجب ألا تقل عن 6 أحرف' },
        });
      }

      const ip = req.ip || req.socket.remoteAddress;
      const result = await AuthService.changePassword(
        req.params.id,
        { newPassword },
        true,
        ip
      );
      return res.json({
        success: true,
        data: result,
        message: 'تم إعادة تعيين كلمة المرور للمستخدم بنجاح',
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'RESET_PASSWORD_FAILED', message: err.message },
      });
    }
  }
);
