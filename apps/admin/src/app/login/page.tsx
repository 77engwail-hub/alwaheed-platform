'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { setAdminToken } from '../../lib/admin-api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'فشل تسجيل الدخول');

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
    <div className="fixed inset-0 z-50 bg-stone-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-stone-950 border border-gold/40 flex items-center justify-center text-gold mx-auto shadow-gold-glow">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white">تسجيل الدخول إلى لوحة التحكم</h1>
          <p className="text-xs text-stone-400">مؤسسة الوحيد للزخرفة المعمارية ونحت والمقاولات</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-300">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-stone-100 px-4 py-3 pr-10 rounded-xl text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none font-mono placeholder:text-stone-600"
              />
              <Mail className="w-4 h-4 text-stone-500 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-300">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-stone-100 px-4 py-3 pr-10 rounded-xl text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none placeholder:text-stone-600"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold hover:bg-gold-dark text-stone-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'جاري التحقق...' : 'دخول لوحة الإدارة'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
