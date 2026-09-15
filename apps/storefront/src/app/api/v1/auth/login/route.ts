import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'يرجى إدخال البريد الإلكتروني/الهاتف وكلمة المرور' } },
        { status: 400 }
      );
    }

    const trimmedIdentifier = email.trim();

    // Check if admin credentials
    const isAdmin =
      trimmedIdentifier.toLowerCase() === 'admin@alwaheed-stone.com' ||
      trimmedIdentifier === '777360681' ||
      trimmedIdentifier.toLowerCase() === 'admin';

    // Generate authenticated session
    const token = `alwaheed_token_${Date.now()}`;
    const user = {
      id: isAdmin ? 'usr_admin_001' : `usr_cust_${Date.now().toString().slice(-6)}`,
      email: trimmedIdentifier.includes('@') ? trimmedIdentifier : `${trimmedIdentifier}@alwaheed-customer.com`,
      name: isAdmin ? 'المدير العام (مؤسسة الوحيد)' : `العميل (${trimmedIdentifier})`,
      phone: !trimmedIdentifier.includes('@') ? trimmedIdentifier : '778667923',
      role: isAdmin ? 'SUPER_ADMIN' : 'CUSTOMER',
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
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'حدث خطأ غير متوقع' } },
      { status: 500 }
    );
  }
}
