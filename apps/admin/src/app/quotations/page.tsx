'use client';

import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../lib/admin-api';
import { formatQuotationStatus, formatPrice, formatUnit } from '@al-waheed/ui';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Download,
  Send,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Pricing Form State
  const [pricingAmount, setPricingAmount] = useState<number>(0);
  const [adminNotes, setAdminNotes] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const loadQuotations = async () => {
    setIsLoading(true);
    try {
      let query = '/quotations/admin/all?limit=50';
      if (statusFilter) query += `&status=${statusFilter}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;

      const res = await adminFetch(query);
      setQuotations(res);
      if (res.length > 0 && !selectedQuotation) {
        setSelectedQuotation(res[0]);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuotations();
  }, [statusFilter]);

  const handleStatusTransition = async (targetStatus: string, notes?: string) => {
    if (!selectedQuotation) return;
    setIsActionLoading(true);
    setFeedback(null);

    try {
      const updated = await adminFetch(`/quotations/admin/${selectedQuotation.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: targetStatus, notes: notes || `تحديث الحالة إلى ${targetStatus}` }),
      });

      setSelectedQuotation({ ...selectedQuotation, status: targetStatus });
      setFeedback({ type: 'success', message: `تم تحديث حالة الطلب إلى: ${targetStatus}` });
      loadQuotations();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuotation || pricingAmount <= 0) return;
    setIsActionLoading(true);
    setFeedback(null);

    try {
      await adminFetch(`/quotations/admin/${selectedQuotation.id}/pricing`, {
        method: 'PUT',
        body: JSON.stringify({
          totalQuotedPrice: Number(pricingAmount),
          currency: 'YER',
          adminNotes,
          validUntilDays: 30,
        }),
      });

      setFeedback({ type: 'success', message: 'تم اعتماد التسعير وإصدار عرض السعر بنجاح!' });
      setSelectedQuotation({
        ...selectedQuotation,
        status: 'PRICED',
        totalQuotedPrice: pricingAmount,
        adminNotes,
      });
      loadQuotations();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConvertToOrder = async () => {
    if (!selectedQuotation) return;
    setIsActionLoading(true);
    setFeedback(null);

    try {
      const order = await adminFetch(`/quotations/admin/${selectedQuotation.id}/convert-to-order`, {
        method: 'POST',
      });

      setFeedback({
        type: 'success',
        message: `تم تحويل العرض إلى أمر تنفيذ مباشر برقم: ${order.orderNumber}`,
      });
      setSelectedQuotation({ ...selectedQuotation, status: 'CONVERTED_TO_ORDER' });
      loadQuotations();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">
            إدارة طلبات عروض الأسعار والتصاميم المخصصة (RFQ)
          </h1>
          <p className="text-xs text-stone-500">
            متابعة المخططات الهندسية، احتساب التكاليف وجداول الكميات، واعتماد عروض الأسعار
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Quotations List */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-stone-200 shadow-stone-sm space-y-4">
          {/* Filter Bar */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-200 outline-none bg-stone-50"
            >
              <option value="">كافة الحالات</option>
              <option value="NEW">جديد (NEW)</option>
              <option value="UNDER_REVIEW">قيد الدراسة (UNDER_REVIEW)</option>
              <option value="PRICED">تم التسعير (PRICED)</option>
              <option value="ACCEPTED">مقبول (ACCEPTED)</option>
              <option value="CONVERTED_TO_ORDER">تم التحويل لأمر تنفيذ</option>
            </select>
          </div>

          {/* List */}
          {isLoading ? (
            <div className="p-8 text-center text-xs text-stone-400">جاري تحميل الطلبات...</div>
          ) : quotations.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">لا توجد طلبات تطابق الفلتر</div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {quotations.map((q) => {
                const isSelected = selectedQuotation?.id === q.id;
                const statusMeta = formatQuotationStatus(q.status);
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setSelectedQuotation(q);
                      setPricingAmount(q.totalQuotedPrice || 0);
                      setAdminNotes(q.adminNotes || '');
                      setFeedback(null);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'border-gold bg-stone-900 text-stone-100 shadow-sm'
                        : 'border-stone-100 bg-stone-50/60 hover:bg-stone-100/80 text-stone-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-bold text-xs">{q.referenceNumber}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isSelected
                            ? 'bg-gold text-stone-950'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="text-xs font-bold">{q.customerName}</div>

                    <div className="flex justify-between text-[11px] text-stone-400">
                      <span>{q.city}</span>
                      <span className="font-mono">
                        {new Date(q.createdAt).toLocaleDateString('ar-YE')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Quotation Details & Management */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-stone-sm space-y-6">
          {selectedQuotation ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-stone-100">
                <div>
                  <span className="text-[11px] text-stone-400 font-mono">تفاصيل المعاملة</span>
                  <h2 className="text-xl font-bold text-stone-900 font-mono">
                    {selectedQuotation.referenceNumber}
                  </h2>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold/20 text-gold-dark border border-gold/40">
                  {formatQuotationStatus(selectedQuotation.status).label}
                </span>
              </div>

              {/* Customer Info Card */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                  <span className="text-stone-400 block">اسم العميل</span>
                  <span className="font-bold text-stone-800">{selectedQuotation.customerName}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                  <span className="text-stone-400 block">رقم الهاتف / واتساب</span>
                  <a
                    href={`https://wa.me/${selectedQuotation.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 hover:underline font-mono block"
                    dir="ltr"
                  >
                    {selectedQuotation.phone} ↗
                  </a>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                  <span className="text-stone-400 block">الموقع</span>
                  <span className="font-bold text-stone-800">{selectedQuotation.city}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                  <span className="text-stone-400 block">نوع الحجر المطلوب</span>
                  <span className="font-bold text-stone-800">
                    {selectedQuotation.preferredStoneType || 'حسب التوصية'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-stone-50 rounded-xl text-xs space-y-1">
                <span className="text-stone-400 block">الوصف الفني من العميل:</span>
                <p className="text-stone-700 leading-relaxed">{selectedQuotation.description}</p>
              </div>

              {/* Attachments */}
              {selectedQuotation.attachments && selectedQuotation.attachments.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-700 block">المخططات وصور التصاميم المرفقة:</span>
                  <div className="space-y-1">
                    {selectedQuotation.attachments.map((att: any, idx: number) => (
                      <a
                        key={idx}
                        href={att.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="font-medium">{att.fileName}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gold-dark" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* State Machine Transition Actions */}
              <div className="p-4 bg-stone-100 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-stone-800 block">إجراءات دورة حياة الطلب:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedQuotation.status === 'NEW' && (
                    <button
                      onClick={() => handleStatusTransition('UNDER_REVIEW', 'بدء الدراسة الهندسية')}
                      disabled={isActionLoading}
                      className="bg-stone-900 text-gold text-xs font-bold px-4 py-2 rounded-lg"
                    >
                      بدء الدراسة الفنية (UNDER_REVIEW)
                    </button>
                  )}

                  {selectedQuotation.status === 'PRICED' && (
                    <button
                      onClick={() => handleStatusTransition('SENT', 'تم إرسال العرض للعميل')}
                      disabled={isActionLoading}
                      className="bg-stone-900 text-gold text-xs font-bold px-4 py-2 rounded-lg"
                    >
                      إرسال العرض للعميل (SENT)
                    </button>
                  )}

                  {selectedQuotation.status === 'SENT' && (
                    <button
                      onClick={() => handleStatusTransition('ACCEPTED', 'تمت موافقة العميل')}
                      disabled={isActionLoading}
                      className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
                    >
                      تسجيل قبول العميل (ACCEPTED)
                    </button>
                  )}

                  {(selectedQuotation.status === 'ACCEPTED' || selectedQuotation.status === 'PRICED') && (
                    <button
                      onClick={handleConvertToOrder}
                      disabled={isActionLoading}
                      className="bg-gold hover:bg-gold-dark text-stone-950 text-xs font-bold px-4 py-2 rounded-lg"
                    >
                      تحويل إلى أمر تنفيذ ومشروع رسمي ➔
                    </button>
                  )}
                </div>
              </div>

              {/* Pricing Form */}
              <form onSubmit={handleSavePricing} className="p-5 border border-stone-200 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-stone-900">
                  إعداد وتسعير جدول الكميات المعتمد
                </h3>

                <div className="space-y-1">
                  <label className="text-xs text-stone-500">المبلغ الإجمالي المعتمد (بالريال اليمني) *</label>
                  <input
                    type="number"
                    required
                    value={pricingAmount}
                    onChange={(e) => setPricingAmount(Number(e.target.value))}
                    placeholder="مثال: 4500000"
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-stone-300 focus:border-gold outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-stone-500">ملاحظات وشروط التوريد والتركيب</label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="شروط الدفع، مدة التجهيز، شمول النقل والتركيب..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 focus:border-gold outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isActionLoading || pricingAmount <= 0}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-gold font-bold text-xs py-3 rounded-xl transition-all"
                >
                  {isActionLoading ? 'جاري الحفظ...' : 'اعتماد وتثبيت تسعير الطلب'}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-stone-400">اختر طلباً من القائمة للاطلاع على تفاصيله وتسعيره</div>
          )}
        </div>
      </div>
    </div>
  );
}
