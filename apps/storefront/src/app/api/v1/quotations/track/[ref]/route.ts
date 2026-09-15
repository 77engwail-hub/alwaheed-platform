import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { ref: string } }
) {
  const ref = params.ref;

  // Mock / dynamic quotation lookup for tracking
  const sampleQuotation = {
    id: `rfq_${ref}`,
    referenceNumber: ref.toUpperCase(),
    customerName: 'العميل الموقر',
    city: 'صنعاء',
    preferredStoneType: 'حجر صنعاني حبش أسود + بيج مأربي فاخر',
    description: 'واجهة حجرية متكاملة لفيلا سكنية دورين مع تيجان أعمدة ونحت آلي بمكائن CNC والمخارط الحديثة.',
    status: 'PRICED',
    totalQuotedPrice: 2850000,
    currency: 'YER',
    validUntil: new Date(Date.now() + 15 * 86400000).toISOString(),
    adminNotes: 'تمت دراسة المخطط المعماري واعتماد الحجر النخب الأول. يشمل السعر النقل والتوريد حتى موقع المشروع في صنعاء.',
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: sampleQuotation,
  });
}
