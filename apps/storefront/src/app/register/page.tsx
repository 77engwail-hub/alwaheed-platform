'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, Phone, User, CheckCircle2, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import SocialAuthButtons from '@/components/SocialAuthButtons';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    if (formData.password.length < 6) {
      setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = `${apiUrl}/api/v1/auth/register`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'فشل تسجيل الحساب');
      }

      // Save customer session
      if (data?.data?.token) {
        localStorage.setItem('alwaheed_customer_token', data.data.token);
        localStorage.setItem('alwaheed_customer_user', JSON.stringify(data.data.user));
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-stone-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-gold flex items-center justify-center mx-auto shadow-gold-glow">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">إنشاء حساب عميل جديد</h1>
          <p className="text-xs text-stone-500">
            سجل حسابك لمتابعة عروض أسعار مشاريعك وواجهات الحجر وحفظ تفاصيل طلباتك.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>تم إنشاء حسابك بنجاح! جاري تحويلك لحسابك...</span>
          </div>
        )}

        {/* Social / OAuth 1-Click Fast Register */}
        <SocialAuthButtons mode="register" />

        <div className="relative flex items-center justify-center pt-2">
          <div className="border-t border-stone-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-medium text-stone-400 shrink-0">
            أو التسجيل اليدوي بالبيانات
          </span>
          <div className="border-t border-stone-200 w-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-stone-700">الاسم الكامل *</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="مثال: عبد الله ناصر"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-stone-900"
              />
              <User className="w-4 h-4 text-stone-400 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">البريد الإلكتروني *</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-stone-900"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">رقم الهاتف / واتساب</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="777360681"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-stone-900"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">كلمة المرور *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-stone-900"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute top-3.5 right-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3.5 left-3.5 text-stone-400 hover:text-stone-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">تأكيد كلمة المرور *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-stone-900"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-gold hover:bg-gold-dark text-stone-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
          >
            <span>{isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب الآن'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
          <span>لديك حساب بالفعل؟ </span>
          <Link href="/login" className="text-gold-dark font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
