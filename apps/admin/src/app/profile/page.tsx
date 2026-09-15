'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Lock,
  Key,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Laptop,
  Clock,
  LogOut,
  Sparkles,
  ArrowRight,
  Activity,
  Layers,
  Users,
} from 'lucide-react';
import { adminFetch, getAdminToken, removeAdminToken } from '../../lib/admin-api';

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'audit'>('profile');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Security Overview
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);

  // Feedback & Saving State
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('alwaheed_admin_user');
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        setName(u.name || '');
        setEmail(u.email || '');
        setPhone(u.phone || '');
      }

      // Fetch from API
      const profileRes = await adminFetch('/auth/me');
      if (profileRes) {
        setUser(profileRes);
        setName(profileRes.name || '');
        setEmail(profileRes.email || '');
        setPhone(profileRes.phone || '');
      }

      const secRes = await adminFetch('/auth/security-overview');
      if (secRes?.securityLogs) {
        setSecurityLogs(secRes.securityLogs);
      }
    } catch (e) {
      console.log('Error loading admin profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const updated = await adminFetch('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name, email, phone }),
      });

      const updatedUser = { ...user, name, email, phone };
      setUser(updatedUser);
      localStorage.setItem('alwaheed_admin_user', JSON.stringify(updatedUser));

      setFeedback({ type: 'success', message: 'تم حفظ وتحديث بيانات حساب الإدارة بنجاح!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'فشل تحديث البيانات' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'كلمة المرور الجديدة وتأكيدها غير متطابقين' });
      return;
    }
    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'كلمة المرور يجب أن تتكون من 6 خانات على الأقل' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      await adminFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFeedback({ type: 'success', message: 'تم تغيير وتأمين كلمة مرور حساب الإدارة بنجاح!' });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'فشل تغيير كلمة المرور، يرجى التأكد من كلمة المرور الحالية',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    removeAdminToken();
    window.location.href = '/login';
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200/60 sm:border-none">
        <div>
          <div className="inline-flex items-center gap-2 text-xs text-gold font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>إعدادات حساب الإدارة والأمان</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">الملف الشخصي والحماية الإدارية</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            تعديل بيانات المسؤول، تغيير كلمة المرور، مراجعة سجلات تسجيل الدخول، والتحكم في جلسات الأمان.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/users"
            className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Users className="w-4 h-4" />
            <span>إدارة جميع المستخدمين</span>
          </Link>
        </div>
      </div>

      {/* Admin Card */}
      <div className="bg-stone-950 text-stone-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-stone-900 border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow text-lg font-bold shrink-0">
            {user?.name ? user.name.slice(0, 2) : 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">{name || 'مدير النظام'}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold border border-gold/40">
                {user?.role || 'SUPER_ADMIN'}
              </span>
            </div>
            <span className="text-xs text-stone-400 font-mono block mt-0.5">{email}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-auto flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3.5 py-2 rounded-xl border border-rose-900/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span className="font-bold">{feedback.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => {
            setActiveTab('profile');
            setFeedback(null);
          }}
          className={`flex-1 sm:flex-none justify-center px-3 sm:px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 sm:gap-2 transition-all ${
            activeTab === 'profile'
              ? 'bg-gold text-stone-950 font-extrabold shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>بيانات الحساب</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('security');
            setFeedback(null);
          }}
          className={`flex-1 sm:flex-none justify-center px-3 sm:px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 sm:gap-2 transition-all ${
            activeTab === 'security'
              ? 'bg-gold text-stone-950 font-extrabold shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>كلمة المرور والأمان</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('audit');
            setFeedback(null);
          }}
          className={`flex-1 sm:flex-none justify-center px-3 sm:px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 sm:gap-2 transition-all ${
            activeTab === 'audit'
              ? 'bg-gold text-stone-950 font-extrabold shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>سجل نشاط الإدارة الأخير</span>
        </button>
      </div>

      {/* Tab 1: Profile Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-stone-sm space-y-6 text-xs">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-sm font-extrabold text-stone-900">تعديل بيانات الحساب الإداري</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-stone-600 font-bold block mb-1">الاسم الكامل للمسؤول:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 font-bold text-stone-900"
                required
              />
            </div>

            <div>
              <label className="text-stone-600 font-bold block mb-1">البريد الإلكتروني للإدارة:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 font-mono text-stone-900"
                required
              />
            </div>

            <div>
              <label className="text-stone-600 font-bold block mb-1">رقم الهاتف:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="777360681"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 font-mono text-stone-900"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-stone-600 font-bold block mb-1">مستوى الصلاحية:</label>
              <input
                type="text"
                value={user?.role || 'SUPER_ADMIN'}
                disabled
                className="w-full bg-stone-100 border border-stone-200 rounded-xl p-3 font-mono text-stone-500 font-bold cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-stone-100">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-gold hover:bg-gold-dark text-stone-950 font-extrabold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-stone-sm space-y-6 text-xs">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gold" />
              <span>تغيير كلمة مرور الإدارة</span>
            </h3>
          </div>

          <div className="space-y-4 max-w-lg">
            <div>
              <label className="text-stone-600 font-bold block mb-1">كلمة المرور الحالية:</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 pr-10 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-stone-600 font-bold block mb-1">كلمة المرور الجديدة:</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="6 أحرف أو أرقام على الأقل"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-stone-600 font-bold block mb-1">تأكيد كلمة المرور:</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="إعادة كتابة كلمة المرور"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-stone-100">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-stone-900 hover:bg-gold hover:text-stone-950 text-gold font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
            >
              <Key className="w-4 h-4" />
              <span>{isSaving ? 'جاري التحديث...' : 'تحديث كلمة المرور'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Security & Audit Activity */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-stone-sm space-y-4">
          <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            <span>سجل النشاط والأمان لحسابك</span>
          </h3>

          {securityLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              لا توجد سجلات أمان مسجلة مؤخراً.
            </div>
          ) : (
            <div className="divide-y divide-stone-100 text-xs">
              {securityLogs.map((log) => (
                <div key={log.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-stone-800 block">
                      {log.action === 'LOGIN_SUCCESS' && 'تسجيل دخول ناجح'}
                      {log.action === 'UPDATE_PROFILE' && 'تحديث الملف الشخصي'}
                      {log.action === 'CHANGE_PASSWORD' && 'تغيير كلمة المرور'}
                      {log.action !== 'LOGIN_SUCCESS' &&
                        log.action !== 'UPDATE_PROFILE' &&
                        log.action !== 'CHANGE_PASSWORD' &&
                        log.action}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(log.createdAt).toLocaleString('ar-YE')}
                    </span>
                  </div>
                  {log.ipAddress && (
                    <span className="font-mono text-[10px] text-stone-600 bg-stone-100 px-2 py-1 rounded-md">
                      IP: {log.ipAddress}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
