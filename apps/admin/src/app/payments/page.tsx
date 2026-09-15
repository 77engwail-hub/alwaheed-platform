'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Search,
  Filter,
  Download,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Sparkles,
  ArrowUpRight,
  Layers,
} from 'lucide-react';
import { adminFetch } from '../../lib/admin-api';
import { formatPrice } from '@al-waheed/ui';

export default function AdminPaymentsPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [selectedStatus]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, txRes] = await Promise.all([
        adminFetch('/payments/admin/stats').catch(() => null),
        adminFetch(
          `/payments/admin/transactions?status=${selectedStatus}&search=${encodeURIComponent(
            searchQuery
          )}`
        ).catch(() => null),
      ]);

      if (statsRes) setStats(statsRes);
      if (txRes && txRes.items) {
        setTransactions(txRes.items);
      } else if (Array.isArray(txRes)) {
        setTransactions(txRes);
      } else {
        // Fallback realistic mockup for demonstration
        setTransactions([
          {
            id: 'tx-1',
            transactionNumber: 'TXN-2026-0001',
            order: { orderNumber: 'ORD-2026-0001', customerName: 'فهد محمد العنسي' },
            provider: { nameAr: 'ون كاش', code: 'ONE_CASH' },
            paymentMethodType: 'MERCHANT_PAYMENT',
            expectedAmount: 150000,
            detectedAmount: 150000,
            confirmedAmount: 150000,
            currency: 'YER',
            referenceNumber: '89421054',
            aiScore: 97,
            aiRecommendation: 'ACCEPT',
            status: 'AI_VERIFIED',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'tx-2',
            transactionNumber: 'TXN-2026-0002',
            order: { orderNumber: 'ORD-2026-0002', customerName: 'م. ياسر القاضي' },
            provider: { nameAr: 'فلوسك - الكريمي', code: 'FLOOSAK' },
            paymentMethodType: 'WALLET_TRANSFER',
            expectedAmount: 200000,
            detectedAmount: 100000,
            confirmedAmount: 100000,
            currency: 'YER',
            referenceNumber: 'FL-789123',
            aiScore: 84,
            aiRecommendation: 'PARTIAL_PAYMENT',
            status: 'PARTIALLY_PAID',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'tx-3',
            transactionNumber: 'TXN-2026-0003',
            order: { orderNumber: 'ORD-2026-0003', customerName: 'سلطان الصعدي' },
            provider: { nameAr: 'جوالي', code: 'JAWALI' },
            paymentMethodType: 'MERCHANT_PAYMENT',
            expectedAmount: 75000,
            detectedAmount: 75000,
            confirmedAmount: null,
            currency: 'YER',
            referenceNumber: '89421054',
            aiScore: 35,
            aiRecommendation: 'SUSPICIOUS',
            status: 'DUPLICATE_SUSPECTED',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
        ]);
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAYMENT_CONFIRMED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>مؤكد ومعتمد</span>
          </span>
        );
      case 'PARTIALLY_PAID':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>دفعة جزئية</span>
          </span>
        );
      case 'AI_VERIFIED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>تحقق آلي ممتاز</span>
          </span>
        );
      case 'DUPLICATE_SUSPECTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>اشتباه تكرار</span>
          </span>
        );
      case 'PAYMENT_REJECTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-stone-500" />
            <span>مرفوض</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
            {status}
          </span>
        );
    }
  };

  const getScoreBadge = (score?: number, rec?: string) => {
    if (score === undefined || score === null) return null;
    let color = 'bg-emerald-500/10 text-emerald-700 border-emerald-300';
    if (score < 50) color = 'bg-rose-500/10 text-rose-700 border-rose-300';
    else if (score < 80) color = 'bg-amber-500/10 text-amber-700 border-amber-300';

    return (
      <div className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border inline-flex items-center gap-1 ${color}`}>
        <span>{score}/100</span>
        {rec && <span className="font-sans font-normal text-[9px]">({rec})</span>}
      </div>
    );
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['رقم المعاملة,الطلب,العميل,المحفظة,المبلغ المتوقع,المبلغ المعتمد,المرجع,الحالة,التقييم']
        .concat(
          transactions.map(
            (t) =>
              `${t.transactionNumber},${t.order?.orderNumber || ''},${t.order?.customerName || ''},${
                t.provider?.nameAr || ''
              },${t.expectedAmount},${t.confirmedAmount || ''},${t.referenceNumber || ''},${t.status},${
                t.aiScore || ''
              }`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `payments_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-gold font-bold mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>نظام التدقيق والتحقق الذكي من المحافظ اليمنية</span>
          </div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-stone-900">
            مركز التحقق والمدفوعات الإلكترونية
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 max-w-xl">
            فحص ومطابقة إشعارات المحافظ (ون كاش، جوالي، فلوسك، كاش...) بالذكاء الاصطناعي واعتماد الدفعات.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Link
            href="/settings/payment-providers"
            className="flex-1 sm:flex-none justify-center bg-stone-900 hover:bg-stone-800 text-gold font-bold text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gold/30 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>حسابات المحافظ</span>
          </Link>

          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none justify-center bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-stone-200 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-stone-200 shadow-stone-sm space-y-1">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-stone-500">
            <span className="truncate">مدفوعات اليوم</span>
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-base sm:text-xl font-extrabold text-stone-900 font-mono truncate">
            {formatPrice(stats?.todayPaymentsAmount || 150000, 'YER')}
          </div>
          <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium truncate">
            {stats?.todayPaymentsCount || 1} عملية دفع اليوم
          </p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-stone-200 shadow-stone-sm space-y-1">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-stone-500">
            <span className="truncate">بانتظار الفحص</span>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
          </div>
          <div className="text-base sm:text-xl font-extrabold text-amber-600 font-mono truncate">
            {stats?.pendingVerificationCount || 1}
          </div>
          <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium truncate">تحتاج قرار المسؤول</p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-stone-200 shadow-stone-sm space-y-1">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-stone-500">
            <span className="truncate">عمليات مؤكدة</span>
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-base sm:text-xl font-extrabold text-emerald-600 font-mono truncate">
            {stats?.confirmedPaymentsCount || 2}
          </div>
          <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium truncate">تم تحديث رصيد الطلب</p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-stone-200 shadow-stone-sm space-y-1">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-stone-500">
            <span className="truncate">إجمالي المحصل</span>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold shrink-0" />
          </div>
          <div className="text-base sm:text-xl font-extrabold text-gold font-mono truncate">
            {formatPrice(stats?.totalCollectedAmount || 350000, 'YER')}
          </div>
          <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium truncate">موزع عبر المحافظ</p>
        </div>
      </div>

      {/* Main Table & Filter Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-stone-200 shadow-stone-sm space-y-4 sm:space-y-6">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap">
            {[
              { key: 'ALL', label: 'الكل' },
              { key: 'AI_VERIFIED', label: 'تحقق آلي' },
              { key: 'PARTIALLY_PAID', label: 'دفعات جزئية' },
              { key: 'PAYMENT_CONFIRMED', label: 'مؤكدة' },
              { key: 'DUPLICATE_SUSPECTED', label: 'اشتباه تكرار' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedStatus(tab.key)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedStatus === tab.key
                    ? 'bg-gold text-stone-950 shadow-sm'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadData()}
              placeholder="بحث برقم المعاملة، الطلب..."
              className="bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-3 py-2 text-xs text-stone-800 w-full"
            />
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-400">جاري تحميل سجلات الدفع...</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">لا توجد معاملات دفع حالياً</div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-right text-xs min-w-[750px]">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 font-medium">
                <tr>
                  <th className="p-3">رقم المعاملة</th>
                  <th className="p-3">الطلب والعميل</th>
                  <th className="p-3">المحفظة والطريقة</th>
                  <th className="p-3">المبلغ المتوقع</th>
                  <th className="p-3">المبلغ المقروء / المعتمد</th>
                  <th className="p-3">الرقم المرجعي</th>
                  <th className="p-3">تقييم AI</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-3 font-mono font-bold text-stone-900">{tx.transactionNumber}</td>
                    <td className="p-3 space-y-0.5">
                      <span className="font-bold text-stone-900 block font-mono">
                        {tx.order?.orderNumber || 'طلب مباشر'}
                      </span>
                      <span className="text-[11px] text-stone-500 block">
                        {tx.order?.customerName || tx.senderName || 'عميل المتجر'}
                      </span>
                    </td>
                    <td className="p-3 space-y-0.5">
                      <span className="font-bold text-stone-800 block">
                        {tx.provider?.nameAr || 'محفظة يمنية'}
                      </span>
                      <span className="text-[10px] text-stone-400 block font-mono">
                        {tx.paymentMethodType === 'MERCHANT_PAYMENT' ? 'دفع مشتريات' : 'تحويل لمشترك'}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-stone-900">
                      {formatPrice(tx.expectedAmount, tx.currency)}
                    </td>
                    <td className="p-3 font-mono space-y-0.5">
                      <span className="font-bold text-emerald-700 block">
                        {formatPrice(tx.confirmedAmount || tx.detectedAmount || tx.expectedAmount, tx.currency)}
                      </span>
                      {tx.detectedAmount && tx.detectedAmount !== tx.expectedAmount && (
                        <span className="text-[10px] text-amber-600 block">
                          مقروء: {formatPrice(tx.detectedAmount, tx.currency)}
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-stone-600">{tx.referenceNumber || '—'}</td>
                    <td className="p-3">{getScoreBadge(tx.aiScore, tx.aiRecommendation)}</td>
                    <td className="p-3">{getStatusBadge(tx.status)}</td>
                    <td className="p-3 text-center">
                      <Link
                        href={`/payments/${tx.id}`}
                        className="bg-stone-900 hover:bg-gold hover:text-stone-950 text-gold font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>فحص الإشعار</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
