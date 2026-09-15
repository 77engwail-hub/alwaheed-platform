import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'يرجى ملء جميع الحقول الإلزامية' } },
        { status: 400 }
      );
    }

    const token = `alwaheed_token_${Date.now()}`;
    const user = {
      id: `usr_reg_${Date.now().toString().slice(-6)}`,
      email,
      name,
      phone: phone || null,
      role: 'CUSTOMER',
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
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'حدث خطأ أثناء التسجيل' } },
      { status: 500 }
    );
  }
}
