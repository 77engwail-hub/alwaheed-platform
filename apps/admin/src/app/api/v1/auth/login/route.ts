import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const identifier = body.email || body.identifier || body.username || body.phone;
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني وكلمة المرور',
          },
        },
        { status: 400 }
      );
    }

    const apiUrl = process.env.API_URL || 'http://localhost:4000/api/v1';
    const backendRes = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: identifier, password }),
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error.message || 'حدث خطأ أثناء الاتصال بقاعدة البيانات',
        },
      },
      { status: 500 }
    );
  }
}

