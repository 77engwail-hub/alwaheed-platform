import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { provider, email, name, phone, avatar } = body;

    if (!provider) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_PROVIDER', message: 'يرجى تحديد مزود المصادقة' } },
        { status: 400 }
      );
    }

    const providerNameMap: Record<string, string> = {
      google: 'Google',
      facebook: 'Facebook',
      twitter: 'X (Twitter)',
      apple: 'Apple ID',
      whatsapp: 'WhatsApp',
    };

    const userEmail = email || `${provider}.user@alwaheed-stone.com`;
    const userName = name || `مستخدم ${providerNameMap[provider] || provider}`;
    const userPhone = phone || '777360681';

    // Mock/Demo generated JWT token and user profile
    const token = `alwaheed_jwt_social_${provider}_${Date.now()}`;
    const user = {
      id: `usr_social_${provider}_${Date.now().toString().slice(-6)}`,
      email: userEmail,
      name: userName,
      phone: userPhone,
      role: 'CUSTOMER',
      isActive: true,
      authProvider: provider,
      avatarUrl: avatar || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: {
        token,
        user,
        message: `تم تسجيل الدخول بنجاح عبر ${providerNameMap[provider] || provider}`,
      },
    });
  } catch (error: any) {
    console.error('Social Login Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message || 'حدث خطأ في الخادم' },
      },
      { status: 500 }
    );
  }
}
