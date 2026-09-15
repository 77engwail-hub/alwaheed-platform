'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminFetch } from '../lib/admin-api';
import { formatQuotationStatus } from '@al-waheed/ui';
import {
  Boxes,
  FileText,
  Building,
  ShoppingBag,
  Plus,
  Loader2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch('/admin/dashboard/stats')
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center text-stone-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
        <span className="text-xs">جاري تحميل إحصائيات لوحة التحكم...</span>
      </div>
    );
  }

  const summary = stats?.summary || {
    totalProducts: 8,
    totalProjects: 3,
    totalQuotations: 1,
    newQuotations: 0,
    totalOrders: 0,
    pendingOrders: 0,
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-stone-200/60 sm:border-none">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">لوحة المؤشرات والعمليات</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            نظرة عامة على أداء المنصة، طلبات عروض الأسعار، والكتالوج المعماري
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Link
            href="/quotations"
            className="flex-1 sm:flex-none justify-center bg-gold hover:bg-gold-dark text-stone-950 font-bold px-3.5 sm:px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>طلبات التسعير (RFQ)</span>
          </Link>
          <Link
            href="/products"
            className="flex-1 sm:flex-none justify-center bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold px-3.5 sm:px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>إضافة منتج</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3.5 sm:p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-stone-sm space-y-2">
          <div className="flex justify-between items-center text-stone-400">
            <span className="text-xs font-bold">طلبات عروض الأسعار (RFQ)</span>
            <FileText className="w-5 h-5 text-gold-dark" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono">
              {summary.totalQuotations}
            </span>
            {summary.newQuotations > 0 && (
              <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                {summary.newQuotations} جديد
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-stone-sm space-y-2">
          <div className="flex justify-between items-center text-stone-400">
            <span className="text-xs font-bold">المنتجات والأحجار النشطة</span>
            <Boxes className="w-5 h-5 text-gold-dark" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono">
            {summary.totalProducts}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-stone-sm space-y-2">
          <div className="flex justify-between items-center text-stone-400">
            <span className="text-xs font-bold">المشاريع وسابقة الأعمال</span>
            <Building className="w-5 h-5 text-gold-dark" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono">
            {summary.totalProjects}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-stone-sm space-y-2">
          <div className="flex justify-between items-center text-stone-400">
            <span className="text-xs font-bold">أوامر الشراء المباشر</span>
            <ShoppingBag className="w-5 h-5 text-gold-dark" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono">
            {summary.totalOrders}
          </div>
        </div>
      </div>

      {/* Recent RFQs Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-stone-sm space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-stone-900 border-r-4 border-gold pr-3">
            آخر طلبات عروض الأسعار المستلمة
          </h2>
          <Link href="/quotations" className="text-xs font-bold text-gold-dark hover:underline self-start sm:self-auto">
            عرض كافة الطلبات ({summary.totalQuotations}) ↗
          </Link>
        </div>

        {stats?.recentQuotations && stats.recentQuotations.length > 0 ? (
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-right text-xs min-w-[600px]">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="p-3">رقم المعاملة</th>
                  <th className="p-3">العميل</th>
                  <th className="p-3">الموقع</th>
                  <th className="p-3">نوع المشروع</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {stats.recentQuotations.map((q: any) => (
                  <tr key={q.id} className="hover:bg-stone-50/50">
                    <td className="p-3 font-mono font-bold text-stone-900">{q.referenceNumber}</td>
                    <td className="p-3 font-bold text-stone-800">{q.customerName}</td>
                    <td className="p-3 text-stone-600">{q.city}</td>
                    <td className="p-3 text-stone-600">{q.projectType}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-stone-100 text-stone-800 border border-stone-200">
                        {formatQuotationStatus(q.status).label}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/quotations?id=${q.id}`}
                        className="text-gold-dark font-bold hover:underline"
                      >
                        معاينة وتسعير ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-stone-400">لا توجد طلبات جديدة حالياً</div>
        )}
      </div>
    </div>
  );
}

