import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'يرجى إدخال بيانات الدخول وكلمة المرور' } },
        { status: 400 }
      );
    }

    const token = `alwaheed_admin_jwt_${Date.now()}`;
    const user = {
      id: 'usr_super_admin_001',
      email: 'admin@alwaheed-stone.com',
      name: 'المهندس / المدير العام (مؤسسة الوحيد)',
      phone: '777360681',
      role: 'SUPER_ADMIN',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: {
        token,
        user,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
