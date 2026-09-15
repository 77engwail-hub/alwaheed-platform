'use client';

import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../lib/admin-api';
import { ShieldCheck, Clock, User, Info } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminFetch('/admin/audit-logs')
      .then((res) => {
        setLogs(res || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-stone-200/60 sm:border-none">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">سجلات التدقيق والأمان (Audit Trail)</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            سجل غير قابل للتعديل يرصد كافة العمليات الإدارية وتحديثات الأسعار وتغيير الحالات
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-stone-sm">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-400">جاري تحميل سجلات التدقيق...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">لا توجد سجلات تدقيق حالياً</div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-right text-xs min-w-[700px]">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="p-3">التوقيت</th>
                  <th className="p-3">المستخدم</th>
                  <th className="p-3">نوع الإجراء (Action)</th>
                  <th className="p-3">الكيان (Entity)</th>
                  <th className="p-3">معرف الكيان</th>
                  <th className="p-3">عنوان الـ IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50">
                    <td className="p-3 font-mono text-stone-500">
                      {new Date(log.createdAt).toLocaleString('ar-YE')}
                    </td>
                    <td className="p-3 font-bold text-stone-800">{log.userEmail || 'System / Admin'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-stone-900 text-gold font-mono font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-stone-700">{log.entityType}</td>
                    <td className="p-3 font-mono text-stone-500 text-[11px]">{log.entityId || '-'}</td>
                    <td className="p-3 font-mono text-stone-400 text-[11px]">{log.ipAddress || '127.0.0.1'}</td>
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
