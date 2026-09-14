'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Building,
  Ruler,
  Layers,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

function RfqPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const prefilledProduct = searchParams.get('productTitle') || '';
  const prefilledProductId = searchParams.get('productId') || '';

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    whatsapp: '',
    email: '',
    city: 'صنعاء',
    projectType: 'VILLA_FACADE',
    preferredStoneType: 'حجر بيج مأربي + حجر حبش أسود',
    approximateBudget: '',
    description: prefilledProduct ? `طلب تسعير ومواصفات خاصة للمنتج: ${prefilledProduct}` : '',
    needsInstallation: true,
    needsDelivery: true,
    dimensions: '',
    customTitle: prefilledProduct || '',
  });

  const [attachments, setAttachments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMessage('');

    try {
      const file = files[0];
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('category', 'BLUEPRINTS');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiUrl}/media/upload`, {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'فشل رفع الملف');

      setAttachments((prev) => [
        ...prev,
        {
          fileName: data.data.originalName || file.name,
          fileUrl: data.data.fileUrl,
          fileSize: data.data.fileSize,
          mimeType: data.data.mimeType,
        },
      ]);
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء رفع الملف');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

      const payload = {
        customerName: formData.customerName,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        email: formData.email || undefined,
        city: formData.city,
        projectType: formData.projectType,
        preferredStoneType: formData.preferredStoneType,
        approximateBudget: formData.approximateBudget || undefined,
        description: formData.description,
        needsInstallation: formData.needsInstallation,
        needsDelivery: formData.needsDelivery,
        items: [
          {
            productId: prefilledProductId || undefined,
            customTitle: formData.customTitle || 'بند مخصص للواجهة',
            dimensionsDesc: formData.dimensions || undefined,
            quantity: 1,
            unit: 'PROJECT',
          },
        ],
        attachments,
      };

      const res = await fetch(`${apiUrl}/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'فشل إرسال طلب السعر');

      setSuccessResult(data.data);
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successResult) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 text-center space-y-6 shadow-stone-md">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              تم استلام طلب عرض السعر بنجاح!
            </h1>
            <p className="text-sm text-stone-600">
              شكراً لثقتكم بمؤسسة الوحيد للزخرفة المعمارية. سيقوم الفريق الهندسي بدراسة المخطط والمواصفات وموافاتكم بعرض سعر تفصيلي.
            </p>
          </div>

          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-2 text-right">
            <div className="flex justify-between items-center text-xs text-stone-500">
              <span>رقم مرجع الطلب (Reference Number):</span>
              <span className="font-bold text-stone-900 font-mono text-sm text-gold-dark">
                {successResult.referenceNumber}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-stone-500">
              <span>العميل:</span>
              <span className="font-bold text-stone-800">{successResult.customerName}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-stone-500">
              <span>الموقع:</span>
              <span className="font-bold text-stone-800">{successResult.city}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => router.push(`/rfq/track?ref=${successResult.referenceNumber}`)}
              className="bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold px-6 py-3 rounded-xl text-sm"
            >
              تتبع حالة هذا الطلب
            </button>
            <a
              href={`https://wa.me/967777360681?text=${encodeURIComponent(
                `السلام عليكم، قمت بإرسال طلب عرض سعر رقم ${successResult.referenceNumber} باسم ${successResult.customerName}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>متابعة الطلب عبر واتساب</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-gold tracking-widest uppercase inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>محرك التسعير وطلبات التصاميم المخصصة</span>
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900">
          طلب عرض سعر / دراسة مخطط معماري (RFQ)
        </h1>
        <p className="text-sm text-stone-500 max-w-xl mx-auto">
          أدخل تفاصيل مشروعك أو واجهتك، وارفع صور التصاميم أو المخططات الهندسية للحصول على دراسة فنية وجدول كميات معتمد.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-stone-sm space-y-8"
      >
        {/* Section 1: Customer Contact Info */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-r-4 border-gold pr-3">
            1. بيانات العميل والتواصل
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">الاسم الكامل *</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="مثال: الشيخ عبد الله الأحمدي"
                className="w-full text-sm px-4 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">رقم الهاتف *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="مثال: 777360681"
                className="w-full text-sm px-4 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">رقم الواتساب (اختياري)</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="لتلقي عرض السعر والمخططات"
                className="w-full text-sm px-4 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">المدينة / موقع المشروع *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="مثال: صنعاء - حده"
                className="w-full text-sm px-4 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Project Specifications */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-base font-bold text-stone-900 border-r-4 border-gold pr-3">
            2. تفاصيل المشروع ونوع الحجر
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">نوع المشروع *</label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full text-sm px-4 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white"
              >
                <option value="VILLA_FACADE">واجهة فيلا سكنية</option>
                <option value="PALACE_FACADE">واجهة قصر ملكي</option>
                <option value="ROYAL_ENTRANCE">مدخل وبوابة ملكية / أعمدة</option>
                <option value="COMMERCIAL_BUILDING">مبنى تجاري / فندق</option>
                <option value="MOSQUE">مسجد / صرح ديني</option>
                <option value="STONE_CARVING_ART">نقوش وزخارف حجرية مخصصة</option>
                <option value="WATERFALL_FOUNTAIN">شلال أو نافورة حجرية</option>
                <option value="CUSTOM_WORK">أعمال مقاولات حجرية أخرى</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">نوع الحجر المفضل</label>
              <input
                type="text"
                value={formData.preferredStoneType}
                onChange={(e) => setFormData({ ...formData, preferredStoneType: e.target.value })}
                placeholder="مثال: حجر بيج مأربي، حجر حبش، رخام..."
                className="w-full text-sm px-4 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">الأبعاد التقديرية أو المساحة (إن توفرت)</label>
            <input
              type="text"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              placeholder="مثال: واجهة دورين 14م × 8م (مساحة تقريبية 320 م²)"
              className="w-full text-sm px-4 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">وصف المطلوب والملاحظات الفنية *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="صف بالتفصيل ما ترغب في تنفيذه (عدد النوافذ، رغبتك في التيجان، نوع النقش، أي تفاصيل خاصة)..."
              className="w-full text-sm px-4 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none"
            />
          </div>
        </div>

        {/* Section 3: Upload Blueprints and Design Images */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-base font-bold text-stone-900 border-r-4 border-gold pr-3">
            3. رفع المخططات الهندسية وصور التصاميم
          </h2>

          <div className="border-2 border-dashed border-stone-300 hover:border-gold rounded-2xl p-6 text-center space-y-3 bg-stone-50/50">
            <Upload className="w-8 h-8 text-stone-400 mx-auto" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-700 block">
                اسحب وأفلت المخطط أو صورة التصميم هنا، أو انقر للاختيار
              </span>
              <span className="text-[11px] text-stone-400 block">
                الصيغ المدعومة: PDF, JPG, PNG, WEBP (الحد الأقصى 15 ميغابايت)
              </span>
            </div>

            <label className="inline-block bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors">
              <span>{isUploading ? 'قيد الرفع...' : 'اختر ملف من جهازك'}</span>
              <input
                type="file"
                disabled={isUploading}
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Uploaded Files List */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-600 block">الملفات المرفقة:</span>
              <div className="space-y-1">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-100 rounded-xl flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-stone-800 line-clamp-1">{att.fileName}</span>
                    <span className="text-stone-400 font-mono">
                      {(att.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Execution Options & Submit */}
        <div className="pt-4 border-t border-stone-100 space-y-6">
          <div className="flex flex-wrap gap-6 text-xs text-stone-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.needsInstallation}
                onChange={(e) => setFormData({ ...formData, needsInstallation: e.target.checked })}
                className="w-4 h-4 text-gold rounded border-stone-300 focus:ring-gold"
              />
              <span>يشمل التركيب والتثبيت في الموقع بواسطة معلمين مختصين</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.needsDelivery}
                onChange={(e) => setFormData({ ...formData, needsDelivery: e.target.checked })}
                className="w-4 h-4 text-gold rounded border-stone-300 focus:ring-gold"
              />
              <span>يشمل النقل والتنزيل إلى موقع العمل</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full bg-gold hover:bg-gold-dark text-stone-950 font-bold text-base py-4 rounded-xl shadow-md hover:shadow-gold-glow transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            <span>{isSubmitting ? 'قيد معالجة وإرسال الطلب...' : 'إرسال طلب عرض السعر الآن'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function RfqPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-20 text-center text-stone-500 font-medium">جاري تحميل استمارة عرض السعر...</div>}>
      <RfqPageContent />
    </Suspense>
  );
}
