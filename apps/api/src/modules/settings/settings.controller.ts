import { Router, type Request, type Response } from 'express';
import { SettingsService } from './settings.service.js';
import { ContactMessageSchema, UpdateSettingSchema } from '@al-waheed/validation';
import { authenticateToken, requireRoles } from '../../common/auth.middleware.js';

export const settingsRouter = Router();

// Public Settings (Verified Phone, WhatsApp, Name, Address, Currency)
settingsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const settings = await SettingsService.getPublicSettings();
    return res.json({ success: true, data: settings });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SETTINGS_FETCH_FAILED', message: err.message },
    });
  }
});

// Public Contact Form submission
settingsRouter.post('/contact', async (req: Request, res: Response) => {
  try {
    const validated = ContactMessageSchema.parse(req.body);
    const result = await SettingsService.submitContactMessage(validated);
    return res.status(201).json({
      success: true,
      data: result,
      message: 'شكراً لتواصلك معنا، تم استلام رسالتك وسنقوم بالرد عليك سريعاً.',
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: { code: 'CONTACT_FAILED', message: err.message },
    });
  }
});

// Admin Update Setting
settingsRouter.put(
  '/admin',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const validated = UpdateSettingSchema.parse(req.body);
      const updated = await SettingsService.updateSetting(validated.key, validated.value);
      return res.json({ success: true, data: updated });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: { code: 'SETTING_UPDATE_FAILED', message: err.message },
      });
    }
  }
);

// Admin Get Contact Messages
settingsRouter.get(
  '/admin/contact-messages',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const result = await SettingsService.getContactMessages(
        Number(req.query.page) || 1,
        Number(req.query.limit) || 15
      );
      return res.json({
        success: true,
        data: result.items,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'MESSAGES_FETCH_FAILED', message: err.message },
      });
    }
  }
);
