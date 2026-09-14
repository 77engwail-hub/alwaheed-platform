import { Router, type Request, type Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginSchema } from '@al-waheed/validation';
import { authenticateToken } from '../../common/auth.middleware.js';

export const authRouter = Router();

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
