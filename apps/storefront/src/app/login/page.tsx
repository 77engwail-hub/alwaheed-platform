'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import SocialAuthButtons from '@/components/SocialAuthButtons';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = `${apiUrl}/api/v1/auth/login`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }

      localStorage.setItem('alwaheed_customer_token', data.data.token);
      localStorage.setItem('alwaheed_customer_user', JSON.stringify(data.data.user));

      router.push('/profile');
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-stone-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-gold flex items-center justify-center mx-auto shadow-gold-glow">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">تسجيل دخول العملاء</h1>
          <p className="text-xs text-stone-500">
            أدخل بريدك الإلكتروني، رقم هاتفك، أو اسم المستخدم للدخول إلى حسابك.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-stone-700">البريد الإلكتروني / رقم الهاتف / اسم المستخدم</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="778667923 أو name@example.com أو اسم المستخدم"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-stone-900 text-xs"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-stone-700">كلمة المرور</label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-stone-900 text-xs"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold hover:bg-gold-dark text-stone-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
          >
            <span>{isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>

        {/* Social / OAuth 1-Click Login */}
        <SocialAuthButtons mode="login" />

        <div className="text-center pt-4 border-t border-stone-100 text-xs text-stone-500">
          <span>ليس لديك حساب بعد؟ </span>
          <Link href="/register" className="text-gold-dark font-bold hover:underline">
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </div>
  );
}
