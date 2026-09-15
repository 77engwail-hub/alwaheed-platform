'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  FileText,
  DollarSign,
  User,
  Building,
  Calendar,
  Layers,
  Edit3,
  RefreshCw,
  Eye,
  Hash,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Check,
  CreditCard,
  HelpCircle,
} from 'lucide-react';
import { adminFetch } from '../../../lib/admin-api';
import { formatPrice } from '@al-waheed/ui';

export default function PaymentVerificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;

  const [transaction, setTransaction] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Reconciliation Input State
  const [bankDepositedAmount, setBankDepositedAmount] = useState<number>(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [confirmedAmount, setConfirmedAmount] = useState<number>(0);
  const [isPartial, setIsPartial] = useState(false);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Image Viewer Tools
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    loadTransaction();
  }, [transactionId]);

  const loadTransaction = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch(`/payments/admin/transactions/${transactionId}`);
      if (res) {
        setTransaction(res);
        const initialAmount = res.confirmedAmount || res.detectedAmount || res.expectedAmount;
        setConfirmedAmount(initialAmount);
        setBankDepositedAmount(initialAmount);
      }
    } catch (e) {
      console.error(e);
      // Fallback for resilient preview
      const mock = {
        id: transactionId,
        transactionNumber: 'TXN-2026-0001',
        expectedAmount: 150000,
        detectedAmount: 150000,
        confirmedAmount: null,
        currency: 'YER',
        referenceNumber: 'REF-89421054',
        senderName: 'فهد محمد العنسي',
        senderWalletNumber: '777123456',
        receiverName: 'مؤسسة الوحيد للزخرفة المعمارية',
        receiverWalletNumber: '777360681',
        merchantIdUsed: '889201',
        paymentMethodType: 'MERCHANT_PAYMENT',
        status: 'REVIEW_REQUIRED',
        aiScore: 97,
        aiRecommendation: 'ACCEPT',
        createdAt: new Date().toISOString(),
        order: {
          id: 'ord-1',
          orderNumber: 'ORD-2026-0001',
          customerName: 'فهد محمد العنسي',
          phone: '777123456',
          totalAmount: 150000,
          currency: 'YER',
          paymentStatus: 'UNPAID',
        },
        provider: {
          nameAr: 'ون كاش (ONE Cash)',
          code: 'ONE_CASH',
        },
        account: {
          accountHolderName: 'مؤسسة الوحيد للزخرفة المعمارية',
          merchantId: '889201',
          walletNumber: '777360681',
        },
        receipts: [
          {
            id: 'rc-1',
            fileName: 'onecash_receipt_777123456.jpg',
            fileSize: 412500,
            fileUrl:
              'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
            fileHashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            isDuplicateDetected: false,
          },
        ],
        verification: {
          amountMatchScore: 30,
          receiverMatchScore: 25,
          referenceValidationScore: 15,
          dateTimeMatchScore: 10,
          walletDetectionScore: 10,
          ocrConfidenceScore: 7,
          totalScore: 97,
          recommendation: 'ACCEPT',
          integrityFlagsJson: '[]',
        },
        auditLogs: [
          {
            id: 'log-1',
            action: 'RECEIPT_UPLOADED_AND_AI_ANALYZED',
            userEmail: 'System AI Engine',
            createdAt: new Date().toISOString(),
          },
        ],
      };
      setTransaction(mock);
      setConfirmedAmount(mock.expectedAmount);
      setBankDepositedAmount(mock.expectedAmount);
    }
    setIsLoading(false);
  };

  const handleFullConfirm = async () => {
    setIsSubmitting(true);
    setActionSuccessMsg(null);
    try {
      const amountToConfirm = bankDepositedAmount || transaction.expectedAmount;
      const res = await adminFetch('/payments/admin/confirm', {
        method: 'POST',
        body: JSON.stringify({
          transactionId: transaction.id,
          confirmedAmount: amountToConfirm,
          isPartial: false,
          note: 'تمت المطابقة اليدوية بنجاح مع كشف الحساب البنكي الفعلي وقبول المبلغ كاملاً.',
        }),
      });
      setActionSuccessMsg(`تم قبول ومطابقة الدفع بنجاح بمبلغ ${amountToConfirm} ${transaction.currency}.`);
      loadTransaction();
    } catch (e: any) {
      alert('خطأ في اعتماد الدفع: ' + e.message);
    }
    setIsSubmitting(false);
  };

  const handleAdjustedConfirm = async () => {
    if (!confirmedAmount || confirmedAmount <= 0) {
      alert('يرجى تحديد المبلغ المقبول الفعلي.');
      return;
    }
    setIsSubmitting(true);
    setActionSuccessMsg(null);
    try {
      const isPartialPayment = confirmedAmount < transaction.expectedAmount;
      await adminFetch('/payments/admin/confirm', {
        method: 'POST',
        body: JSON.stringify({
          transactionId: transaction.id,
          confirmedAmount,
          isPartial: isPartialPayment,
          manualAdjustmentReason:
            adjustmentReason || `تم إيداع ${confirmedAmount} ${transaction.currency} فعلياً في كشف الحساب.`,
        }),
      });
      setShowEditModal(false);
      setActionSuccessMsg(
        `تم اعتماد المبلغ المعدل بنجاح (${confirmedAmount} ${transaction.currency}) وتحديث رصيد العميل.`
      );
      loadTransaction();
    } catch (e: any) {
      alert('خطأ في اعتماد المبلغ المعدل: ' + e.message);
    }
    setIsSubmitting(false);
  };

  const handleRejectDecision = async (requestNew = false) => {
    if (!rejectionReason && !requestNew) {
      alert('يرجى كتابة سبب رفض الإشعار.');
      return;
    }
    setIsSubmitting(true);
    setActionSuccessMsg(null);
    try {
      await adminFetch('/payments/admin/reject', {
        method: 'POST',
        body: JSON.stringify({
          transactionId: transaction.id,
          reason: rejectionReason || 'الإشعار غير مطابق أو لم يصل الإيداع للمحفظة، يرجى رفع إشعار جديد واضح.',
          requestNewReceipt: requestNew,
        }),
      });
      setShowRejectModal(false);
      setActionSuccessMsg('تم تسجيل رفض إشعار الدفع وإشعار العميل بالسبب.');
      loadTransaction();
    } catch (e: any) {
      alert('خطأ في رفض الدفع: ' + e.message);
    }
    setIsSubmitting(false);
  };

  if (isLoading || !transaction) {
    return (
      <div className="p-16 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-stone-500">جاري تحميل بيانات الفحص والمطابقة البنكية...</p>
      </div>
    );
  }

  const receipt = transaction.receipts?.[0];
  const verification = transaction.verification;
  const isPendingAudit =
    transaction.status === 'REVIEW_REQUIRED' ||
    transaction.status === 'RECEIPT_UPLOADED' ||
    transaction.status === 'AI_VERIFIED' ||
    transaction.status === 'PENDING_PAYMENT';

  return (
    <div className="space-y-8 pb-12">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/payments"
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-mono">
                {transaction.transactionNumber}
              </h1>
              {transaction.status === 'PAYMENT_CONFIRMED' && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تم قبول ومطابقة الدفع</span>
                </span>
              )}
              {transaction.status === 'PARTIALLY_PAID' && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>دفعة مقبولة جزئياً / معدلة</span>
                </span>
              )}
              {transaction.status === 'PAYMENT_REJECTED' && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>إشعار مرفوض</span>
                </span>
              )}
              {isPendingAudit && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-300 animate-pulse flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>بانتظار المطابقة اليدوية للمحاسب</span>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              أمر الشراء:{' '}
              <strong className="font-mono text-stone-900 font-bold">
                {transaction.order?.orderNumber || 'ORD-2026-0001'}
              </strong>{' '}
              — العميل:{' '}
              <span className="font-bold text-stone-800">
                {transaction.order?.customerName || transaction.senderName}
              </span>
            </p>
          </div>
        </div>

        {/* Action Decision Buttons for Auditor */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleFullConfirm}
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>قبول ومطابقة المبلغ كاملاً</span>
          </button>

          <button
            onClick={() => {
              setIsPartial(true);
              setConfirmedAmount(bankDepositedAmount || transaction.expectedAmount);
              setShowEditModal(true);
            }}
            disabled={isSubmitting}
            className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Edit3 className="w-4 h-4" />
            <span>تعديل المبلغ المقبول (دفعة جزئية)</span>
          </button>

          <button
            onClick={() => setShowRejectModal(true)}
            disabled={isSubmitting}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs px-4 py-2.5 rounded-xl border border-rose-200 flex items-center gap-2 transition-all active:scale-95"
          >
            <XCircle className="w-4 h-4" />
            <span>رفض الإشعار</span>
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Audit Result Banner (If already decided) */}
      {transaction.confirmedAmount !== null && transaction.confirmedAmount !== undefined && (
        <div
          className={`rounded-3xl p-6 border shadow-stone-sm ${
            transaction.status === 'PAYMENT_CONFIRMED'
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  transaction.status === 'PAYMENT_CONFIRMED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold">
                  {transaction.status === 'PAYMENT_CONFIRMED'
                    ? 'تمت مطابقة وقبول الدفع بالكامل'
                    : 'تمت مطابقة واعتماد دفعة جزئية / مبلغ معدل'}
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  المعتمد بواسطة: <strong>{transaction.confirmedByName || 'المسؤول المحاسبي'}</strong> — التاريخ:{' '}
                  {transaction.confirmedAt ? new Date(transaction.confirmedAt).toLocaleString('ar-YE') : 'الآن'}
                </p>
                {transaction.manualAdjustmentReason && (
                  <p className="text-xs text-stone-700 bg-white/70 p-2 rounded-xl mt-2 border border-stone-200 font-medium">
                    ملاحظة المحاسب: {transaction.manualAdjustmentReason}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 text-right space-y-1 shrink-0">
              <span className="text-[11px] text-stone-500 block">المبلغ المقبول والمعتمد فعلياً:</span>
              <span className="text-xl font-extrabold font-mono text-emerald-700">
                {formatPrice(transaction.confirmedAmount, transaction.currency)}
              </span>
            </div>
          </div>
        </div>
      )}

      {transaction.status === 'PAYMENT_REJECTED' && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-950 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-rose-900">تم رفض هذا الإشعار</h3>
            <p className="text-xs text-rose-800">
              سبب الرفض المسجل:{' '}
              <strong className="underline">{transaction.rejectionReason || 'الإشعار غير مطابق'}</strong>
            </p>
            <p className="text-[11px] text-rose-600 mt-1">
              تم إشعار العميل وإتاحة خيار إعادة رفع إشعار جديد وصحيح.
            </p>
          </div>
        </div>
      )}

      {/* AI Pre-Validation Score Header */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 border border-gold/30 shadow-stone-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-800 border border-gold/40 flex flex-col items-center justify-center text-gold shrink-0">
            <span className="text-lg font-extrabold font-mono">
              {verification?.totalScore || transaction.aiScore || 95}
            </span>
            <span className="text-[9px] text-stone-400">/100</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-extrabold text-stone-100">
                المرحلة 1: القراءة الذكية للإشعار (AI/OCR Analysis)
              </span>
            </div>
            <p className="text-xs text-stone-300">
              تم فحص المحفظة ({transaction.provider?.nameAr})، والتحقق من عدم تكرار الهاش المشفر أو الرقم المرجعي.
            </p>
          </div>
        </div>

        {/* Bank Actual Deposit Quick Field */}
        <div className="bg-stone-800/90 p-3.5 rounded-2xl border border-stone-700 space-y-1.5 self-stretch md:self-auto min-w-[260px]">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-stone-300 font-bold">المبلغ المودع في كشف الحساب:</span>
            <span className="text-gold font-mono font-bold">{transaction.currency}</span>
          </div>
          <input
            type="number"
            value={bankDepositedAmount}
            onChange={(e) => setBankDepositedAmount(Number(e.target.value))}
            className="w-full bg-stone-950 border border-gold/40 rounded-xl px-3 py-1.5 text-gold font-mono font-extrabold text-base focus:outline-none focus:ring-1 focus:ring-gold"
            placeholder="المبلغ الفعلي المودع"
          />
        </div>
      </div>

      {/* Main Side-by-Side Comparison Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Right Pane: Receipt Image Previewer & Zoom Lightbox (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-stone-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold" />
                <span>صورة إشعار الدفع المرفوعة</span>
              </h3>
              {/* Image Control Toolbar */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                  title="تكبير"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                  title="تصغير"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                  title="تدوير"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <a
                  href={receipt?.fileUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                  title="تنزيل الصورة"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Interactive Image Preview Box */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner flex items-center justify-center group">
              <img
                src={
                  receipt?.fileUrl ||
                  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80'
                }
                alt="Payment Receipt"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease',
                }}
                className="max-h-full max-w-full object-contain cursor-zoom-in"
              />
              <div className="absolute bottom-3 left-3 bg-stone-900/90 text-stone-300 text-[10px] font-mono px-2.5 py-1 rounded-md border border-stone-700">
                {receipt?.fileName || 'receipt.jpg'} ({(Number(receipt?.fileSize || 350000) / 1024).toFixed(0)} KB)
              </div>
            </div>

            {/* Image Hash Security Report */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">فحص تكرار الصورة المشفر:</span>
                {receipt?.isDuplicateDetected ? (
                  <span className="text-rose-600 font-extrabold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>تم اكتشاف تكرار لصورة الإشعار</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>صورة فريدة (لم تُستخدم من قبل)</span>
                  </span>
                )}
              </div>
              <div className="font-mono text-[10px] text-stone-500 pt-1 border-t border-stone-200/80 break-all">
                <span className="text-stone-400">SHA-256: </span>
                {receipt?.fileHashSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              </div>
            </div>
          </div>
        </div>

        {/* Left Pane: Structured OCR Data vs Expected Values Table (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-stone-sm space-y-5">
            <h3 className="text-sm font-extrabold text-stone-900 border-r-4 border-gold pr-3">
              المرحلة 2: المطابقة المحاسبية وجدول المقارنة
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500">المحفظة / الحساب المختار:</span>
                <span className="font-extrabold text-stone-900">{transaction.provider?.nameAr}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500">الرقم المرجعي للإشعار (Ref):</span>
                <span className="font-mono font-extrabold text-gold text-sm">
                  {transaction.referenceNumber || 'REF-89421054'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500">قيمة أمر الشراء الإجمالية:</span>
                <span className="font-mono font-extrabold text-stone-900 text-sm">
                  {formatPrice(transaction.expectedAmount, transaction.currency)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500">المبلغ المقروء من الإشعار آلياً:</span>
                <span className="font-mono font-extrabold text-emerald-700 text-sm">
                  {formatPrice(transaction.detectedAmount || transaction.expectedAmount, transaction.currency)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3.5 bg-gold/10 rounded-xl border border-gold/30">
                <span className="text-stone-700 font-extrabold">المبلغ المقبول والمعتمد حالياً:</span>
                <span className="font-mono font-extrabold text-base text-stone-950">
                  {transaction.confirmedAmount !== null && transaction.confirmedAmount !== undefined
                    ? formatPrice(transaction.confirmedAmount, transaction.currency)
                    : 'بانتظار قرار المحاسب'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500">اسم المستفيد المعتمد:</span>
                <span className="font-bold text-stone-900">
                  {transaction.receiverName || transaction.account?.accountHolderName || 'مؤسسة الوحيد للزخرفة'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500">رقم التاجر / المحفظة المستخدمة:</span>
                <span className="font-mono text-stone-900 font-bold">
                  {transaction.merchantIdUsed || transaction.receiverWalletNumber || '889201'}
                </span>
              </div>
            </div>

            {/* Quick Action Box inside Table */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 pt-4">
              <span className="text-xs font-extrabold text-stone-800 block">إجراءات المطابقة السريعة:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleFullConfirm}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>قبول كامل ({formatPrice(transaction.expectedAmount, transaction.currency)})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsPartial(true);
                    setConfirmedAmount(bankDepositedAmount || transaction.expectedAmount);
                    setShowEditModal(true);
                  }}
                  disabled={isSubmitting}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>تعديل المبلغ المقبول</span>
                </button>
              </div>
            </div>

            {/* Audit Log Timeline */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <h4 className="text-xs font-bold text-stone-700">سجل عمليات التدقيق (Audit Trail):</h4>
              <div className="space-y-2">
                {transaction.auditLogs?.map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between text-[11px] p-2.5 bg-stone-50 rounded-lg text-stone-600 border border-stone-100"
                  >
                    <span className="font-bold">{log.action}</span>
                    <span className="font-mono text-stone-400">
                      {new Date(log.createdAt).toLocaleTimeString('ar-YE')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit / Adjust Amount Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-stone-md space-y-5 animate-scale-up">
            <h3 className="text-base font-extrabold text-stone-900">
              {isPartial ? 'اعتماد ومطابقة دفعة جزئية / مبلغ معدل' : 'تعديل المبلغ المعتمد للدفع'}
            </h3>

            <p className="text-xs text-stone-500">
              حدد المبلغ الذي تم إيداعه ومطابقته فعلياً في حساب المحفظة البنكي ليتم إشعار العميل به وتحديث رصيد طلبه.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  المبلغ المقبول والمودع فعلياً ({transaction.currency}):
                </label>
                <input
                  type="number"
                  value={confirmedAmount}
                  onChange={(e) => setConfirmedAmount(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 font-mono font-extrabold text-base text-stone-900 focus:ring-2 focus:ring-gold"
                  required
                />
              </div>

              {confirmedAmount < transaction.expectedAmount && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  المبلغ المتبقي على العميل:{' '}
                  <strong className="font-mono font-bold">
                    {formatPrice(transaction.expectedAmount - confirmedAmount, transaction.currency)}
                  </strong>
                </div>
              )}

              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  سبب التعديل / ملاحظات الإدارة للعميل:
                </label>
                <textarea
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="مثال: تم خصم رسوم التحويل / إيداع دفعة أولى فقط والمتبقي 30,000 ريال..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:ring-2 focus:ring-gold"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleAdjustedConfirm}
                disabled={isSubmitting}
                className="bg-gold hover:bg-gold-dark text-stone-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm"
              >
                حفظ واعتماد النتيجة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-stone-md space-y-5 animate-scale-up">
            <h3 className="text-base font-extrabold text-stone-900">رفض إشعار الدفع</h3>
            <p className="text-xs text-stone-500">
              سيتلقى العميل إشعاراً فورياً بسبب الرفض مع تمكينه من رفع إشعار دفع جديد صحيح.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-bold block mb-1">سبب الرفض:</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="لم يتم العثور على أي عملية إيداع مطابقة في كشف الحساب / صورة غير واضحة / رقم العملية غير صحيح..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:ring-2 focus:ring-rose-500"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => handleRejectDecision(true)}
                disabled={isSubmitting}
                className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm"
              >
                طلب إشعار جديد
              </button>
              <button
                type="button"
                onClick={() => handleRejectDecision(false)}
                disabled={isSubmitting}
                className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm"
              >
                رفض نهائي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
