'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatQuotationStatus, formatPrice, formatUnit } from '@al-waheed/ui';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MessageSquare,
  ShieldCheck,
  Download,
} from 'lucide-react';

function RfqTrackingContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [refNumber, setRefNumber] = useState(initialRef);
  const [quotation, setQuotation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuotation = async (ref: string) => {
    if (!ref) return;
    setIsLoading(true);
    setError('');
    setQuotation(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiUrl}/api/v1/quotations/track/${ref.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || 'لم يتم العثور على طلب بهذا الرقم المرجعي');
      }

      setQuotation(data.data);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء البحث عن الطلب');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      fetchQuotation(initialRef);
    }
  }, [initialRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuotation(refNumber);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900">
          تتبع حالة طلب عرض السعر (RFQ Tracking)
        </h1>
        <p className="text-sm text-stone-500 max-w-lg mx-auto">
          أدخل رقم المعاملة المرجعي (مثل RFQ-2026-0001) للاطلاع على نتائج الدراسة الفنية وعرض السعر المعتمد.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <input
          type="text"
          value={refNumber}
          onChange={(e) => setRefNumber(e.target.value)}
          placeholder="أدخل رمز الطلب مثل: RFQ-2026-0001"
          className="flex-1 text-sm px-4 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none font-mono"
        />
        <button
          type="submit"
          disabled={isLoading || !refNumber}
          className="bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>{isLoading ? 'جاري البحث...' : 'تتبع'}</span>
        </button>
      </form>

      {error && (
        <div className="max-w-xl mx-auto p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quotation Detail View */}
      {quotation && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-stone-sm space-y-8">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-100">
            <div className="space-y-1">
              <span className="text-xs text-stone-400 font-mono">رقم المعاملة:</span>
              <h2 className="text-xl font-extrabold text-stone-900 font-mono">
                {quotation.referenceNumber}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-500">الحالة الحالية:</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold/20 text-gold-dark border border-gold/40">
                {formatQuotationStatus(quotation.status).label}
              </span>
            </div>
          </div>

          {/* Pricing Box if Priced */}
          {quotation.totalQuotedPrice && (
            <div className="p-6 rounded-2xl bg-stone-900 text-stone-100 space-y-4 shadow-stone-md">
              <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2">
                <div>
                  <span className="text-xs text-gold font-bold uppercase tracking-wider block">
                    عرض السعر المعتمد من الإدارة الهندسية
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
                    {formatPrice(quotation.totalQuotedPrice, quotation.currency)}
                  </div>
                </div>

                {quotation.validUntil && (
                  <span className="text-xs text-stone-400">
                    صالح حتى:{' '}
                    <span className="font-mono text-stone-200">
                      {new Date(quotation.validUntil).toLocaleDateString('ar-YE')}
                    </span>
                  </span>
                )}
              </div>

              {quotation.adminNotes && (
                <div className="p-3 bg-stone-950/80 rounded-xl text-xs text-stone-300 border border-stone-800">
                  <span className="text-gold font-bold block mb-1">ملاحظات وشروط التوريد:</span>
                  <p>{quotation.adminNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* Request Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-r-4 border-gold pr-2">
              تفاصيل الطلب والبنود
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                <span className="text-stone-400 block">اسم العميل</span>
                <span className="font-bold text-stone-800">{quotation.customerName}</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                <span className="text-stone-400 block">الموقع / المدينة</span>
                <span className="font-bold text-stone-800">{quotation.city}</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                <span className="text-stone-400 block">نوع الحجر المفضل</span>
                <span className="font-bold text-stone-800">{quotation.preferredStoneType || 'حسب الدراسة الفنية'}</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                <span className="text-stone-400 block">تاريخ إرسال الطلب</span>
                <span className="font-bold text-stone-800 font-mono">
                  {new Date(quotation.createdAt).toLocaleDateString('ar-YE')}
                </span>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl text-xs space-y-1">
              <span className="text-stone-400 block">الوصف المرفق:</span>
              <p className="text-stone-700 leading-relaxed">{quotation.description}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-3 justify-end">
            <a
              href={`https://wa.me/967777360681?text=${encodeURIComponent(
                `السلام عليكم، أود المتابعة بخصوص عرض السعر رقم ${quotation.referenceNumber}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>متابعة تفاصيل العرض مع المهندس المختص</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RfqTrackingPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-20 text-center text-stone-500 font-medium">جاري تحميل بيانات التتبع...</div>}>
      <RfqTrackingContent />
    </Suspense>
  );
}
