'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Trash2,
  Mail,
  Phone,
  Lock,
  Key,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { getAdminToken } from '../../lib/admin-api';

const ROLES: { value: string; label: string; desc: string; color: string }[] = [
  { value: 'SUPER_ADMIN', label: 'مدير نظام عام (Super Admin)', desc: 'صلاحيات كاملة للتحكم بالنظام والمستخدمين', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  { value: 'ADMIN', label: 'مدير إداري (Admin)', desc: 'إدارة المنتجات والمشاريع وعروض الأسعار', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { value: 'CATALOG_MANAGER', label: 'مدير الكتالوج والمنتجات', desc: 'إضافة وتعديل الأحجار، الخامات، والأسعار', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'SALES_MANAGER', label: 'مدير المبيعات والتسعير', desc: 'مراجعة طلبات عروض الأسعار (RFQ) واعتماد الأسعار', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { value: 'CONTENT_MANAGER', label: 'مدير المحتوى والمعرض', desc: 'إدارة صور المشاريع وسابقة الأعمال', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'CUSTOMER', label: 'عميل مسجل (Customer)', desc: 'مستخدم عادي يطلب ويسجل عروض أسعار', color: 'bg-stone-500/20 text-stone-400 border-stone-500/30' },
];

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [resetUser, setResetUser] = useState<any>(null);
  const [newResetPassword, setNewResetPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states for new/edit user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'SALES_MANAGER',
    isActive: true,
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.data || []);
      } else {
        throw new Error(data?.error?.message || 'فشل تحميل قائمة المستخدمين');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/auth/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'فشل إنشاء المستخدم');

      setSuccessMsg(`تم إنشاء المستخدم (${formData.name}) بنجاح.`);
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'SALES_MANAGER',
        isActive: true,
      });
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/auth/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error?.message || 'فشل تحديث الصلاحية');
      }
      setSuccessMsg('تم تحديث صلاحية المستخدم بنجاح.');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/auth/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error?.message || 'فشل تعديل حالة الحساب');
      }
      setSuccessMsg('تم تعديل حالة الحساب بنجاح.');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUser || !newResetPassword || newResetPassword.length < 6) {
      setError('كلمة المرور يجب ألا تقل عن 6 أحرف');
      return;
    }

    setIsResetting(true);
    setError('');
    setSuccessMsg('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/auth/users/${resetUser.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: newResetPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'فشل إعادة تعيين كلمة المرور');

      setSuccessMsg(`تم بنجاح تغيير كلمة المرور للمستخدم (${resetUser.name})`);
      setResetUser(null);
      setNewResetPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف المستخدم "${userName}" نهائياً؟`)) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/auth/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error?.message || 'فشل حذف المستخدم');
      }
      setSuccessMsg('تم حذف المستخدم بنجاح.');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-gold" />
            <span>إدارة المستخدمين وصلاحيات النظام (RBAC)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            إضافة مدراء وموظفين وتحديد صلاحيات التسعير، الكتالوج، وإدارة المحتوى، وحسابات العملاء.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gold hover:bg-gold-dark text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-stone-400 hover:text-stone-700">✕</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-stone-400 hover:text-stone-700">✕</button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute top-3.5 right-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث بالاسم، البريد، الهاتف، أو الصلاحية..."
          className="w-full bg-white border border-stone-200 rounded-xl pr-10 pl-4 py-2.5 text-xs text-stone-800 focus:border-gold focus:ring-1 focus:ring-gold outline-none shadow-sm"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-stone-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
              <tr>
                <th className="py-3.5 px-4">المستخدم</th>
                <th className="py-3.5 px-4">بيانات الاتصال</th>
                <th className="py-3.5 px-4">الصلاحية والرتبة</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4">تاريخ الانضمام</th>
                <th className="py-3.5 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    جاري تحميل المستخدمين...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    لا يوجد مستخدمين مطابقين للبحث.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const roleObj = ROLES.find((r) => r.value === u.role) || ROLES[1];
                  return (
                    <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-stone-900 text-gold flex items-center justify-center font-bold text-xs shrink-0">
                            {u.name ? u.name.slice(0, 2) : 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block">{u.name}</span>
                            <span className="text-[11px] text-stone-400 font-mono">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-stone-600 font-mono">
                        {u.phone || 'غير مسجل'}
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${roleObj.color}`}
                        >
                          {ROLES.map((r) => (
                            <option key={r.value} value={r.value} className="bg-stone-900 text-stone-100">
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(u.id, u.isActive)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border transition-all ${
                            u.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                          }`}
                        >
                          {u.isActive ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>مفعل</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              <span>معطل</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-stone-500 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString('ar-YE')}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setResetUser(u);
                              setNewResetPassword('');
                              setError('');
                            }}
                            className="p-1.5 text-stone-400 hover:text-gold hover:bg-stone-900 rounded-lg transition-colors"
                            title="إعادة تعيين كلمة المرور للمستخدم"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف المستخدم"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-gold" />
                <span>إضافة مستخدم جديد للنظام</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: المهندس أحمد سالم"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-gold outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">رقم الهاتف / واتساب</label>
                  <input
                    type="tel"
                    placeholder="777360681"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-gold outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">كلمة المرور الأولية *</label>
                <input
                  type="password"
                  required
                  placeholder="أدخل كلمة مرور قوية (8 أحرف على الأقل)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-gold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">صلاحية المستخدم (Role) *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-gold outline-none"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label} - {r.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-gold rounded border-stone-300 focus:ring-gold"
                />
                <label htmlFor="isActive" className="text-stone-700 font-medium">
                  تفعيل الحساب فوراً وتمكينه من الدخول
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-gold hover:bg-gold-dark text-stone-950 font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  حفظ وإنشاء الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {resetUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-gold" />
                <span>إعادة تعيين كلمة المرور</span>
              </h2>
              <button
                onClick={() => setResetUser(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              أنت على وشك تعيين كلمة مرور جديدة للمستخدم:{' '}
              <strong className="text-stone-900 font-bold">{resetUser.name}</strong> (
              <span className="font-mono text-gold">{resetUser.email}</span>)
            </p>

            <form onSubmit={handleAdminResetPassword} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">كلمة المرور الجديدة *</label>
                <input
                  type="password"
                  required
                  placeholder="أدخل كلمة المرور الجديدة (6 خانات على الأقل)"
                  value={newResetPassword}
                  onChange={(e) => setNewResetPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-gold outline-none font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setResetUser(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="bg-stone-900 hover:bg-gold hover:text-stone-950 text-gold font-bold px-5 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Key className="w-4 h-4" />
                  <span>{isResetting ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
