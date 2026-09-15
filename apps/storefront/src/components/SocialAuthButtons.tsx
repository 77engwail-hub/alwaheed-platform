'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface SocialAuthButtonsProps {
  mode?: 'login' | 'register';
  onSuccess?: (user: any) => void;
}

export default function SocialAuthButtons({ mode = 'login', onSuccess }: SocialAuthButtonsProps) {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'twitter' | 'apple' | 'whatsapp') => {
    setError(null);
    setLoadingProvider(provider);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = `${apiUrl}/api/v1/auth/social-login`;

      // Mock / Dynamic user payload representing OAuth response
      let payload: any = { provider };
      if (provider === 'google') {
        payload = {
          provider: 'google',
          email: 'google.user@gmail.com',
          name: 'مستخدم Google المعتمد',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        };
      } else if (provider === 'facebook') {
        payload = {
          provider: 'facebook',
          email: 'facebook.user@fb.com',
          name: 'مستخدم Facebook',
        };
      } else if (provider === 'twitter') {
        payload = {
          provider: 'twitter',
          email: 'x.user@x.com',
          name: 'مستخدم X (تويتر)',
        };
      } else if (provider === 'apple') {
        payload = {
          provider: 'apple',
          email: 'apple.user@icloud.com',
          name: 'مستخدم Apple ID',
        };
      } else if (provider === 'whatsapp') {
        payload = {
          provider: 'whatsapp',
          phone: '777360681',
          name: 'مستخدم واتساب السريع',
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'فشل تسجيل الدخول عبر المزود المحدد');
      }

      // Save token and user in localStorage
      if (data?.data?.token) {
        localStorage.setItem('alwaheed_customer_token', data.data.token);
        localStorage.setItem('alwaheed_customer_user', JSON.stringify(data.data.user));
      }

      if (onSuccess) {
        onSuccess(data.data.user);
      } else {
        router.push('/profile');
      }
    } catch (err: any) {
      console.error('Social auth error:', err);
      setError(err.message || 'حدث خطأ أثناء المصادقة السريعة');
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-stone-200 w-full" />
        <span className="bg-white px-3 text-[11px] font-medium text-stone-400 shrink-0">
          أو المتابعة السريعة بنقرة واحدة
        </span>
        <div className="border-t border-stone-200 w-full" />
      </div>

      {/* Google 1-Click Primary Button */}
      <button
        type="button"
        onClick={() => handleSocialAuth('google')}
        disabled={!!loadingProvider}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 hover:border-stone-400 text-stone-800 text-xs font-bold transition-all shadow-sm active:scale-[0.99] disabled:opacity-60"
      >
        {loadingProvider === 'google' ? (
          <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        )}
        <span>{mode === 'login' ? 'المتابعة والدخول بحساب Google' : 'التسجيل السريع بحساب Google'}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-normal mr-auto">
          فوري ⚡
        </span>
      </button>

      {/* Grid for Facebook, X (Twitter), Apple, and WhatsApp */}
      <div className="grid grid-cols-4 gap-2">
        {/* Facebook */}
        <button
          type="button"
          onClick={() => handleSocialAuth('facebook')}
          disabled={!!loadingProvider}
          title="الدخول عبر فيسبوك"
          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-stone-700 transition-all shadow-xs group disabled:opacity-50"
        >
          {loadingProvider === 'facebook' ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          ) : (
            <svg className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          <span className="text-[10px] mt-1 text-stone-600 font-medium">فيسبوك</span>
        </button>

        {/* X (Twitter) */}
        <button
          type="button"
          onClick={() => handleSocialAuth('twitter')}
          disabled={!!loadingProvider}
          title="الدخول عبر X (تويتر)"
          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 hover:border-stone-400 text-stone-700 transition-all shadow-xs group disabled:opacity-50"
        >
          {loadingProvider === 'twitter' ? (
            <Loader2 className="w-4 h-4 animate-spin text-stone-900" />
          ) : (
            <svg className="w-4 h-4 text-stone-900 group-hover:scale-110 transition-transform my-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          )}
          <span className="text-[10px] mt-1 text-stone-600 font-medium">X (تويتر)</span>
        </button>

        {/* Apple ID */}
        <button
          type="button"
          onClick={() => handleSocialAuth('apple')}
          disabled={!!loadingProvider}
          title="الدخول عبر Apple ID"
          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 hover:border-stone-400 text-stone-700 transition-all shadow-xs group disabled:opacity-50"
        >
          {loadingProvider === 'apple' ? (
            <Loader2 className="w-4 h-4 animate-spin text-stone-900" />
          ) : (
            <svg className="w-4 h-4 text-stone-900 group-hover:scale-110 transition-transform my-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1.01.08 2.02-.48 2.63-1.23z" />
            </svg>
          )}
          <span className="text-[10px] mt-1 text-stone-600 font-medium">Apple</span>
        </button>

        {/* WhatsApp */}
        <button
          type="button"
          onClick={() => handleSocialAuth('whatsapp')}
          disabled={!!loadingProvider}
          title="الدخول السريع عبر واتساب"
          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-stone-700 transition-all shadow-xs group disabled:opacity-50"
        >
          {loadingProvider === 'whatsapp' ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
          ) : (
            <svg className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.101-.476-.15-.677.15-.201.301-.778.979-.953 1.18-.175.201-.351.226-.652.076-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.101-.201.05-.377-.025-.527-.075-.15-.677-1.632-.928-2.235-.245-.588-.493-.508-.677-.518-.175-.008-.376-.01-.577-.01s-.527.075-.803.377c-.276.301-1.054 1.03-1.054 2.512s1.079 2.914 1.23 3.115c.15.201 2.124 3.243 5.144 4.549.719.311 1.28.497 1.718.636.723.23 1.38.198 1.9.12.58-.088 1.78-.727 2.03-1.43.25-.703.25-1.306.175-1.431-.075-.125-.276-.201-.577-.351zM12.004 21.75h-.002a9.71 9.71 0 01-4.96-1.353l-.356-.211-3.69.968.985-3.597-.232-.369a9.709 9.709 0 01-1.49-5.188c0-5.367 4.368-9.735 9.742-9.735 2.6 0 5.045 1.013 6.884 2.853a9.673 9.673 0 012.85 6.883c0 5.368-4.368 9.749-9.73 9.749z" />
            </svg>
          )}
          <span className="text-[10px] mt-1 text-stone-600 font-medium">واتساب</span>
        </button>
      </div>
    </div>
  );
}
