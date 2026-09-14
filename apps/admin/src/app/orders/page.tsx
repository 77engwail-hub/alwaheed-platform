'use client';

import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../lib/admin-api';
import { formatOrderStatus, formatPrice } from '@al-waheed/ui';
import { ShoppingBag, Search, Clock, CheckCircle2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminFetch('/orders/admin/all?limit=50')
      .then((res) => {
        setOrders(res || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">إدارة أوامر الشراء المباشر</h1>
        <p className="text-xs text-stone-500">متابعة شحنات وتوريد الأحجار الطبيعية المشتراة مباشرة من الموقع</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-stone-sm">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-400">جاري تحميل أوامر الشراء...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">لا توجد أوامر شراء حالياً</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="p-3">رقم الطلب</th>
                  <th className="p-3">العميل</th>
                  <th className="p-3">الهاتف</th>
                  <th className="p-3">المدينة</th>
                  <th className="p-3">الإجمالي</th>
                  <th className="p-3">حالة الطلب</th>
                  <th className="p-3">حالة الدفع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/50">
                    <td className="p-3 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                    <td className="p-3 font-bold text-stone-800">{ord.customerName}</td>
                    <td className="p-3 font-mono text-stone-600" dir="ltr">
                      {ord.phone}
                    </td>
                    <td className="p-3 text-stone-600">{ord.city}</td>
                    <td className="p-3 font-mono font-bold text-stone-900">
                      {formatPrice(ord.totalAmount, ord.currency)}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-stone-100 text-stone-800 border border-stone-200">
                        {formatOrderStatus(ord.status).label}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-stone-100 text-stone-600 font-mono">
                        {ord.paymentStatus}
                      </span>
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
