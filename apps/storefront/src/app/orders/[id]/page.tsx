'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  FileText,
  DollarSign,
  User,
  Building,
  Calendar,
  Layers,
  ArrowRight,
  Phone,
  RefreshCw,
  Wallet,
  Printer,
  ChevronRight,
  UploadCloud,
} from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';
import { formatPrice } from '@al-waheed/ui';

export default function OrderTrackingAndPaymentPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any | null>(null);
  const [paymentTx, setPaymentTx] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [orderId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Order
      const orderRes = await fetchApi(`/orders/${orderId}`).catch(() => null);
      if (orderRes) setOrder(orderRes);

      // 2. Fetch Payment Transaction and Public Audit Status
      const payRes = await fetchApi(`/payments/public-status/${orderId}`).catch(() => null);
      if (payRes) setPaymentTx(payRes);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 p-8">
        <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        <p className="text-xs text-stone-500">جاري تحميل بيانات أمر الشراء والدفع...</p>
      </div>
    );
  }

  const currency = order?.currency || paymentTx?.currency || 'YER';
  const expectedAmount = order?.totalAmount || paymentTx?.expectedAmount || 150000;
  const confirmedAmount = paymentTx?.confirmedAmount;
  const status = paymentTx?.status || 'PENDING_PAYMENT';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-gold transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </Link>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline font-bold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>تحديث الحالة اللحظية</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-stone-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-stone-400 font-bold block mb-1">أمر شراء وتوريد رقم:</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-gold">
              {order?.orderNumber || paymentTx?.order?.orderNumber || 'ORD-2026-0001'}
            </h1>
            <p className="text-xs text-stone-300 mt-1">
              العميل: <strong className="text-white">{order?.customerName || paymentTx?.order?.customerName || 'فهد محمد العنسي'}</strong>
            </p>
          </div>

          <div className="text-right sm:text-left space-y-1">
            <span className="text-xs text-stone-400 block">إجمالي قيمة الطلب:</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {formatPrice(expectedAmount, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Reconciliation Status Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-stone-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <span>حالة الدفع والمطابقة اليدوية للطلب</span>
          </h2>
          {status === 'PAYMENT_CONFIRMED' && (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>مقبول ومؤكد بالكامل</span>
            </span>
          )}
          {status === 'PARTIALLY_PAID' && (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>دفعة جزئية معتمدة</span>
            </span>
          )}
          {status === 'PAYMENT_REJECTED' && (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>إشعار مرفوض</span>
            </span>
          )}
          {status !== 'PAYMENT_CONFIRMED' &&
            status !== 'PARTIALLY_PAID' &&
            status !== 'PAYMENT_REJECTED' && (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-300 animate-pulse flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>قيد المطابقة اليدوية</span>
              </span>
            )}
        </div>

        {/* Accepted Amount Breakdown */}
        {status === 'PAYMENT_CONFIRMED' && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-5 text-center space-y-1">
            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold block">
              المبلغ المقبول والمعتمد فعلياً في كشف الحساب:
            </span>
            <span className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
              {formatPrice(confirmedAmount || expectedAmount, currency)}
            </span>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 pt-1">
              تم قبول ومطابقة الدفع بالكامل وجاري تجهيز المنتجات للشحن والتوريد.
            </p>
          </div>
        )}

        {status === 'PARTIALLY_PAID' && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
              <div className="bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-amber-200">
                <span className="text-[11px] text-stone-500 block mb-1">المبلغ المقبول فعلياً:</span>
                <span className="text-xl font-extrabold font-mono text-emerald-600">
                  {formatPrice(confirmedAmount || 0, currency)}
                </span>
              </div>
              <div className="bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-amber-200">
                <span className="text-[11px] text-stone-500 block mb-1">المبلغ المتبقي المطلوب:</span>
                <span className="text-xl font-extrabold font-mono text-amber-600">
                  {formatPrice(Math.max(0, expectedAmount - (confirmedAmount || 0)), currency)}
                </span>
              </div>
            </div>
            {paymentTx?.manualAdjustmentReason && (
              <p className="text-xs text-stone-700 dark:text-stone-300 bg-white/70 dark:bg-stone-900/70 p-3 rounded-xl border border-amber-200">
                <strong>ملاحظة المحاسب:</strong> {paymentTx.manualAdjustmentReason}
              </p>
            )}
            <Link
              href={`/checkout?orderId=${orderId}`}
              className="block text-center bg-gold hover:bg-gold-dark text-stone-950 font-extrabold text-xs py-2.5 rounded-xl shadow-sm"
            >
              سداد المبلغ المتبقي ورفع الإشعار
            </Link>
          </div>
        )}

        {status === 'PAYMENT_REJECTED' && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-rose-800 dark:text-rose-300">
              سبب عدم قبول الإشعار:
            </h3>
            <p className="text-xs text-rose-900 dark:text-rose-200 bg-white dark:bg-stone-900 p-3 rounded-xl border border-rose-200">
              {paymentTx?.rejectionReason || 'لم يتم العثور على الإيداع في كشف حساب المحفظة.'}
            </p>
            <Link
              href={`/checkout?orderId=${orderId}`}
              className="block text-center bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-sm"
            >
              إعادة المحاولة ورفع إشعار جديد
            </Link>
          </div>
        )}

        {/* Two-Stage Progress Timeline */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-extrabold text-stone-700 dark:text-stone-300">
            مراحل التحقق المحاسبي:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>المرحلة 1: القراءة الذكية والتخزين</span>
              </span>
              <p className="text-[11px] text-stone-500">
                تم استخراج البيانات والتحقق من عدم تكرار الصورة أو الرقم المرجعي.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                {status === 'PAYMENT_CONFIRMED' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Clock className="w-4 h-4 text-gold" />
                )}
                <span>المرحلة 2: المطابقة اليدوية للأمان</span>
              </span>
              <p className="text-[11px] text-stone-500">
                المطابقة اليدوية مع كشف الحساب البنكي الفعلي بواسطة قسم الحسابات.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-stone-sm space-y-4">
        <h3 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-gold" />
          <span>المنتجات والخدمات المطلوبة</span>
        </h3>
        <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
          <div className="py-3 flex justify-between items-center">
            <div>
              <span className="font-bold text-stone-900 dark:text-stone-100 block">
                أحجار واجهات معمارية منحوتة وتيجان أعمدة
              </span>
              <span className="text-[11px] text-stone-500">حجر طبيعي - تصنيع ونحت يدوي وآلي</span>
            </div>
            <span className="font-mono font-extrabold text-stone-900 dark:text-stone-100">
              {formatPrice(expectedAmount, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-gold font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm text-center border border-gold/30"
        >
          العودة للصفحة الرئيسية
        </Link>
        <a
          href="https://wa.me/967777360681"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm text-center"
        >
          <Phone className="w-4 h-4" />
          <span>تواصل مباشر مع المحاسب عبر واتساب</span>
        </a>
      </div>
    </div>
  );
}
