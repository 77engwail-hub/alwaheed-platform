import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const referenceNumber = `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newQuotation = {
      id: `rfq_${Date.now()}`,
      referenceNumber,
      customerName: body.customerName,
      phone: body.phone,
      whatsapp: body.whatsapp || body.phone,
      email: body.email,
      city: body.city,
      projectType: body.projectType,
      preferredStoneType: body.preferredStoneType,
      description: body.description,
      status: 'NEW',
      items: body.items || [],
      attachments: body.attachments || [],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newQuotation,
      message: 'تم استلام طلب عرض السعر بنجاح، وسيتواصل معكم فريقنا الهندسي.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SUBMIT_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
