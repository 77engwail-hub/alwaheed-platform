import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_FILE', message: 'لم يتم إرفاق ملف' } },
        { status: 400 }
      );
    }

    const mockFileUrl = `https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80`;

    return NextResponse.json({
      success: true,
      data: {
        id: `med_${Date.now()}`,
        originalName: file.name,
        fileName: file.name,
        fileUrl: mockFileUrl,
        fileSize: file.size,
        mimeType: file.type,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'UPLOAD_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
