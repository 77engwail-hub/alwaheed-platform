'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, Mail, AlertCircle, ArrowLeft, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { setAdminToken, removeAdminToken } from '../../lib/admin-api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'بيانات الدخول (اسم المستخدم أو كلمة المرور) غير صحيحة');
      }

      if (!data?.data?.token) {
        throw new Error('فشل استلام رمز المصادقة من الخادم');
      }

      const user = data.data.user;
      if (user && user.role === 'CUSTOMER') {
        removeAdminToken();
        throw new Error('عذراً، هذا الحساب مخصص للمتجر فقط وليس لديه صلاحية الدخول للوحة التحكم الإدارية.');
      }

      setAdminToken(data.data.token);
      localStorage.setItem('alwaheed_admin_user', JSON.stringify(data.data.user));

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-950 flex flex-col items-center justify-center p-4 sm:p-6 py-8 sm:py-12 overflow-y-auto">
      {/* Container Card */}
      <div className="max-w-md w-full my-auto bg-stone-900/90 backdrop-blur-xl border border-stone-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Brand & Title */}
        <div className="text-center space-y-2.5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-stone-950 border border-gold/40 flex items-center justify-center text-gold mx-auto shadow-gold-glow">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">تسجيل الدخول إلى لوحة التحكم</h1>
            <p className="text-[11px] sm:text-xs text-gold/90 font-medium mt-0.5">
              مؤسسة الوحيد للزخرفة المعمارية ونحت والمقاولات
            </p>
          </div>
          <p className="text-[11px] text-stone-400">
            النظام الإداري لإدارة الكتالوج، طلبات التسعير، والمشاريع
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-2xl text-xs flex items-start gap-2.5 animate-in fade-in zoom-in-95">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300 block">
              اسم المستخدم / البريد الإلكتروني / رقم الهاتف
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="username"
                autoCapitalize="none"
                placeholder="admin@alwaheed-stone.com أو 777360681"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-stone-100 px-4 py-3 sm:py-3.5 pr-10 rounded-xl text-xs sm:text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none placeholder:text-stone-600 transition-all font-sans"
              />
              <Mail className="w-4 h-4 text-stone-500 absolute top-3.5 sm:top-4 right-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-300">كلمة المرور</label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-stone-100 px-4 py-3 sm:py-3.5 pr-10 pl-11 rounded-xl text-xs sm:text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none placeholder:text-stone-600 transition-all"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute top-3.5 sm:top-4 right-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3.5 sm:top-4 left-3.5 text-stone-500 hover:text-stone-300 focus:outline-none p-0.5"
                title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold hover:bg-gold-dark text-stone-950 font-bold py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحقق من قاعدة البيانات...</span>
              </>
            ) : (
              <>
                <span>دخول لوحة الإدارة</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security badge note */}
        <div className="pt-2 border-t border-stone-800/60 flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-gold/70 shrink-0" />
          <span>نظام محمي ومشفر بالكامل - مؤسسة الوحيد 2026</span>
        </div>
      </div>
    </div>
  );
}

