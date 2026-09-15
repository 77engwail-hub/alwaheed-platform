'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Lock,
  Key,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Laptop,
  Globe,
  Bell,
  Palette,
  Sliders,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ArrowLeft,
  FileText,
  ShoppingBag,
  Clock,
  Eye,
  EyeOff,
  Trash2,
  Check,
  Building,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { fetchApi } from '../../lib/api-client';
import { useTranslation } from '../../context/I18nContext';

export default function CustomerProfilePage() {
  const router = useRouter();
  const { language, setLanguage, t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'activity'>(
    'profile'
  );

  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('صنعاء');
  const [address, setAddress] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);

  // Preferences State
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedFontSize, setSelectedFontSize] = useState('standard');
  const [selectedCurrency, setSelectedCurrency] = useState('YER');
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifySms, setNotifySms] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifyOffers, setNotifyOffers] = useState(true);

  // Status & Feedback State
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const avatarColors = [
    'from-gold to-amber-700 text-stone-950',
    'from-blue-600 to-indigo-800 text-white',
    'from-emerald-600 to-teal-800 text-white',
    'from-purple-600 to-pink-800 text-white',
    'from-stone-700 to-stone-900 text-gold',
  ];

  useEffect(() => {
    const rawUser = localStorage.getItem('alwaheed_customer_user');
    const storedToken = localStorage.getItem('alwaheed_customer_token');

    if (!storedToken || !rawUser) {
      router.push('/login');
      return;
    }

    setToken(storedToken);
    try {
      const parsedUser = JSON.parse(rawUser);
      setUser(parsedUser);
      setName(parsedUser.name || '');
      setEmail(parsedUser.email || '');
      setPhone(parsedUser.phone || '');

      // Load saved preferences
      const savedPrefs = localStorage.getItem('alwaheed_user_prefs');
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        if (prefs.city) setCity(prefs.city);
        if (prefs.address) setAddress(prefs.address);
        if (prefs.companyName) setCompanyName(prefs.companyName);
        if (prefs.avatarIndex !== undefined) setAvatarIndex(prefs.avatarIndex);
        if (prefs.selectedTheme) setSelectedTheme(prefs.selectedTheme);
        if (prefs.selectedFontSize) setSelectedFontSize(prefs.selectedFontSize);
        if (prefs.selectedCurrency) setSelectedCurrency(prefs.selectedCurrency);
        if (prefs.twoFactorEnabled !== undefined) setTwoFactorEnabled(prefs.twoFactorEnabled);
        if (prefs.notifyWhatsapp !== undefined) setNotifyWhatsapp(prefs.notifyWhatsapp);
        if (prefs.notifySms !== undefined) setNotifySms(prefs.notifySms);
        if (prefs.notifyEmail !== undefined) setNotifyEmail(prefs.notifyEmail);
        if (prefs.notifyOffers !== undefined) setNotifyOffers(prefs.notifyOffers);
      }

      // Fetch fresh profile & security overview from API
      loadRemoteProfile(storedToken);
    } catch {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const loadRemoteProfile = async (authToken: string) => {
    try {
      const res = await fetchApi('/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res) {
        setUser((prev: any) => ({ ...prev, ...res }));
        if (res.name) setName(res.name);
        if (res.email) setEmail(res.email);
        if (res.phone) setPhone(res.phone);
      }

      const secRes = await fetchApi('/auth/security-overview', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (secRes?.securityLogs) {
        setSecurityLogs(secRes.securityLogs);
      }
    } catch (e) {
      console.log('Remote profile sync fallback to local cache:', e);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      if (token) {
        await fetchApi('/auth/profile', {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name, phone, email }),
        });
      }

      // Update Local Storage
      const updatedUser = { ...user, name, phone, email };
      setUser(updatedUser);
      localStorage.setItem('alwaheed_customer_user', JSON.stringify(updatedUser));

      const updatedPrefs = {
        city,
        address,
        companyName,
        avatarIndex,
        selectedTheme,
        selectedFontSize,
        selectedCurrency,
        twoFactorEnabled,
        notifyWhatsapp,
        notifySms,
        notifyEmail,
        notifyOffers,
      };
      localStorage.setItem('alwaheed_user_prefs', JSON.stringify(updatedPrefs));

      setFeedback({ type: 'success', message: 'تم حفظ وتحديث بيانات الملف الشخصي بنجاح!' });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'حدث خطأ أثناء حفظ التعديلات',
      });
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
      if (token) {
        await fetchApi('/auth/change-password', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFeedback({ type: 'success', message: 'تم تغيير وتأمين كلمة المرور بنجاح!' });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'فشل تغيير كلمة المرور، يرجى التأكد من كلمة المرور الحالية',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = () => {
    setIsSaving(true);
    setFeedback(null);

    const updatedPrefs = {
      city,
      address,
      companyName,
      avatarIndex,
      selectedTheme,
      selectedFontSize,
      selectedCurrency,
      twoFactorEnabled,
      notifyWhatsapp,
      notifySms,
      notifyEmail,
      notifyOffers,
    };
    localStorage.setItem('alwaheed_user_prefs', JSON.stringify(updatedPrefs));

    setTimeout(() => {
      setIsSaving(false);
      setFeedback({ type: 'success', message: 'تم حفظ تفضيلات المظهر والإشعارات بنجاح!' });
    }, 400);
  };

  const handleLogout = () => {
    localStorage.removeItem('alwaheed_customer_token');
    localStorage.removeItem('alwaheed_customer_user');
    router.push('/');
  };

  const handleDeactivate = async () => {
    if (
      !confirm(
        'هل أنت متأكد من رغبتك في تعطيل حسابك؟ لن تتمكن من متابعة عروض الأسعار والطلبات حتى يتم إعادة التفعيل.'
      )
    )
      return;

    try {
      if (token) {
        await fetchApi('/auth/deactivate', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      handleLogout();
    } catch (err: any) {
      alert(err.message || 'فشل تعطيل الحساب');
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-gold animate-spin mx-auto" />
        <p className="text-stone-400 text-xs">جاري تحميل الملف الشخصي وإعدادات الأمان...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-arabic text-right">
      {/* 1. Header Profile Banner */}
      <div className="bg-stone-900 dark:bg-stone-950 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Interactive Avatar */}
            <div
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${avatarColors[avatarIndex]} border-2 border-gold/50 flex items-center justify-center font-extrabold text-2xl shadow-gold-glow shrink-0`}
            >
              {name ? name.slice(0, 2) : 'U'}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-stone-100">{name || 'عميل الوحيد'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gold/20 text-gold border border-gold/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{user?.role === 'ADMIN' ? 'مدير نظام' : 'عميل مميز معتمد'}</span>
                </span>
              </div>

              <p className="text-xs text-stone-400 font-mono flex items-center gap-1.5" dir="ltr">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <span>{email}</span>
              </p>

              {phone && (
                <p className="text-xs text-stone-400 font-mono flex items-center gap-1.5" dir="ltr">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  <span>{phone}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link
              href="/rfq"
              className="bg-gold hover:bg-gold-dark text-stone-950 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>طلب عرض سعر RFQ</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Feedback Alert Message */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          )}
          <span className="font-bold">{feedback.message}</span>
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            setActiveTab('profile');
            setFeedback(null);
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-gold text-stone-950 shadow-sm font-extrabold'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>الملف الشخصي والبيانات</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('security');
            setFeedback(null);
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-gold text-stone-950 shadow-sm font-extrabold'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>الحماية والأمان وكلمة المرور</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('preferences');
            setFeedback(null);
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'preferences'
              ? 'bg-gold text-stone-950 shadow-sm font-extrabold'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>التخصيص والمظهر والإشعارات</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('activity');
            setFeedback(null);
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'activity'
              ? 'bg-gold text-stone-950 shadow-sm font-extrabold'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>طلباتي وسجل النشاط</span>
        </button>
      </div>

      {/* 4. Tab 1: Profile & Personal Info Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-stone-sm space-y-6">
            <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <User className="w-5 h-5 text-gold" />
                <span>المعلومات الأساسية وبيانات الاتصال</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                تُستخدم هذه البيانات في ترويسة عروض الأسعار الهندسية والفواتير وموقع تسليم الأحجار والزخارف.
              </p>
            </div>

            {/* Avatar Color Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                اختر لون وهوية الأفاتار المفضل لحسابك:
              </label>
              <div className="flex items-center gap-3">
                {avatarColors.map((colorClass, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarIndex(idx)}
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${colorClass} flex items-center justify-center font-bold text-xs transition-all ${
                      avatarIndex === idx
                        ? 'ring-4 ring-gold/50 scale-110 shadow-gold-glow'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {avatarIndex === idx ? <Check className="w-4 h-4" /> : idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-stone-600 dark:text-stone-400 font-bold block mb-1">
                  الاسم الكامل / اسم العميل:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: م. وائل الشرجبي"
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-3 text-stone-900 dark:text-stone-100 font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-stone-600 dark:text-stone-400 font-bold block mb-1">
                  البريد الإلكتروني:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-3 text-stone-900 dark:text-stone-100 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-stone-600 dark:text-stone-400 font-bold block mb-1">
                  رقم الهاتف للتواصل والواتساب:
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثال: 777360681"
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-3 text-stone-900 dark:text-stone-100 font-mono font-bold"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-stone-600 dark:text-stone-400 font-bold block mb-1">
                  اسم المكتب الهندسي / المؤسسة / الشركة (اختياري):
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="مثال: مكتب إعمار للهندسة والمقاولات"
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-3 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="text-stone-600 dark:text-stone-400 font-bold block mb-1">
                  المدينة الافتراضية للتوريد:
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-3 text-stone-900 dark:text-stone-100 font-bold"
                >
                  <option value="صنعاء">صنعاء وأمانة العاصمة</option>
                  <option value="عدن">عدن</option>
                  <option value="تعز">تعز</option>
                  <option value="إب">إب</option>
                  <option value="حضرموت (المكلا / سيئون)">حضرموت (المكلا / سيئون)</option>
                  <option value="مأرب">مأرب</option>
                  <option value="الحديدة">الحديدة</option>
                  <option value="ذمار">ذمار</option>
                  <option value="شبوة">شبوة</option>
                  <option value="أخرى">مدينة / محافظة أخرى</option>
                </select>
              </div>

              <div>
                <label className="text-stone-600 dark:text-stone-400 font-bold block mb-1">
                  العنوان التفصيلي وموقع المشروع:
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: حده - بالقرب من جولة الرويشان"
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-3 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-gold hover:bg-gold-dark text-stone-950 font-extrabold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'جاري الحفظ...' : 'حفظ بيانات الملف الشخصي'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 5. Tab 2: Security & Protection Controls */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Change Password Card */}
          <form
            onSubmit={handleChangePassword}
            className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-stone-sm space-y-6"
          >
            <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gold" />
                <span>تحديث وتغيير كلمة المرور</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                احرص على استخدام كلمة مرور قوية تحتوي على أرقام وحروف لتأمين عروض أسعارك ومعاملاتك المالية.
              </p>
            </div>

            <div className="space-y-4 text-xs max-w-lg">
              <div>
                <label className="text-stone-600 dark:text-stone-400 font-bold block mb-1">
                  كلمة المرور الحالية:
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-3 pr-10 font-mono"
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
                  <label className="text-stone-600 dark:text-stone-400 font-bold block mb-1">
                    كلمة المرور الجديدة:
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="6 أحرف أو أرقام على الأقل"
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-3 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-stone-600 dark:text-stone-400 font-bold block mb-1">
                    تأكيد كلمة المرور الجديدة:
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="إعادة كتابة كلمة المرور"
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-3 font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-stone-900 hover:bg-gold hover:text-stone-950 text-gold font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
              >
                <Key className="w-4 h-4" />
                <span>{isSaving ? 'جاري التحديث...' : 'تحديث كلمة المرور'}</span>
              </button>
            </div>
          </form>

          {/* Two-Factor Authentication & Active Sessions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2FA Card */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-stone-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-gold" />
                  <span>المصادقة الثنائية (2FA)</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  {twoFactorEnabled ? 'مفعلة' : 'معطلة'}
                </span>
              </div>

              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                إرسال رمز تحقق سري (OTP) لرقم هاتفك عبر الواتساب عند تسجيل الدخول من جهاز غير معروف لزيادة الأمان.
              </p>

              <label className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => {
                    setTwoFactorEnabled(e.target.checked);
                    handleSavePreferences();
                  }}
                  className="w-4 h-4 rounded text-gold focus:ring-gold"
                />
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  تفعيل التحقق بخطوتين عبر الواتساب والهاتف
                </span>
              </label>
            </div>

            {/* Active Sessions Card */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-stone-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-gold" />
                  <span>الجلسة الحالية والأجهزة النشطة</span>
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">الجهاز الحالي:</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    متصفح الويب (الجهاز الحالي)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">حالة الجلسة:</span>
                  <span className="text-emerald-500 font-bold">نشطة وموثوقة</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 p-2 rounded-xl bg-stone-100 dark:bg-stone-800 transition-colors"
              >
                تسجيل الخروج من جميع الجلسات
              </button>
            </div>
          </div>

          {/* Security Logs Audit */}
          {securityLogs.length > 0 && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-stone-sm space-y-3">
              <h3 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                <span>سجل النشاط والأمان الأخير</span>
              </h3>
              <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {securityLogs.map((log) => (
                  <div key={log.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-stone-800 dark:text-stone-200 block">
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
                      <span className="font-mono text-[10px] text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                        IP: {log.ipAddress}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-rose-500/10 rounded-3xl p-6 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-extrabold text-rose-500">منطقة الأمان المتقدم</h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                تعطيل الحساب مؤقتاً أو إيقاف تسجيل الدخول به.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDeactivate}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all self-start sm:self-auto"
            >
              تعطيل حسابي
            </button>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Customization & Preferences */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-stone-sm space-y-6">
            <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Palette className="w-5 h-5 text-gold" />
                <span>تخصيص المظهر وتجربة الاستخدام</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                تحديد الثيم الافتراضي، حجم الخط، والعملة المفضلة لعرض تسعيرات وتفاصيل واجهات الحجر.
              </p>
            </div>

            {/* Theme, Font, Currency & Language Customization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="space-y-2">
                <label className="text-stone-700 dark:text-stone-300 font-bold block">
                  لغة الواجهة (Language):
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'ar', label: '🇾🇪 العربية (Default)', name: 'Arabic' },
                    { id: 'en', label: '🇺🇸 English', name: 'English' },
                    { id: 'tr', label: '🇹🇷 Türkçe', name: 'Turkish' },
                    { id: 'zh', label: '🇨🇳 中文', name: 'Chinese' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        setLanguage(l.id as any);
                        handleSavePreferences();
                      }}
                      className={`w-full p-2.5 rounded-xl border text-right font-bold transition-all ${
                        language === l.id
                          ? 'border-gold bg-gold/15 text-gold'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-stone-700 dark:text-stone-300 font-bold block">
                  الثيم المفضل للمتجر:
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'dark', label: 'الوضع الداكن الفاخر 🌙' },
                    { id: 'gold', label: 'الملكي الذهبي ✨' },
                    { id: 'light', label: 'الفاتح الرخامي ☀️' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedTheme(t.id);
                        handleSavePreferences();
                      }}
                      className={`w-full p-2.5 rounded-xl border text-right font-bold transition-all ${
                        selectedTheme === t.id
                          ? 'border-gold bg-gold/15 text-gold'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-stone-700 dark:text-stone-300 font-bold block">
                  حجم الخط المفضل:
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'small', label: 'صغير ومضغوط' },
                    { id: 'standard', label: 'قياسي ومتناسق (موصى به)' },
                    { id: 'large', label: 'كبير ومقروء بوضوح' },
                  ].map((fs) => (
                    <button
                      key={fs.id}
                      type="button"
                      onClick={() => {
                        setSelectedFontSize(fs.id);
                        handleSavePreferences();
                      }}
                      className={`w-full p-2.5 rounded-xl border text-right font-bold transition-all ${
                        selectedFontSize === fs.id
                          ? 'border-gold bg-gold/15 text-gold'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {fs.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-stone-700 dark:text-stone-300 font-bold block">
                  العملة المفضلة للتسعير:
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'YER', label: 'ريال يمني (YER)' },
                    { id: 'SAR', label: 'ريال سعودي (SAR)' },
                    { id: 'USD', label: 'دولار أمريكي (USD)' },
                  ].map((curr) => (
                    <button
                      key={curr.id}
                      type="button"
                      onClick={() => {
                        setSelectedCurrency(curr.id);
                        handleSavePreferences();
                      }}
                      className={`w-full p-2.5 rounded-xl border text-right font-bold transition-all ${
                        selectedCurrency === curr.id
                          ? 'border-gold bg-gold/15 text-gold'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {curr.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notification Channels */}
            <div className="border-t border-stone-100 dark:border-stone-800 pt-5 space-y-4">
              <h3 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Bell className="w-4 h-4 text-gold" />
                <span>قنوات التنبيهات وإشعارات الطلبات</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyWhatsapp}
                    onChange={(e) => {
                      setNotifyWhatsapp(e.target.checked);
                      handleSavePreferences();
                    }}
                    className="w-4 h-4 rounded text-gold focus:ring-gold"
                  />
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200 block">
                      إشعارات الواتساب الفورية
                    </span>
                    <span className="text-[10px] text-stone-400">
                      استلام إشعار فور اعتماد المهندس لعرض السعر ومطابقة الدفع.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifySms}
                    onChange={(e) => {
                      setNotifySms(e.target.checked);
                      handleSavePreferences();
                    }}
                    className="w-4 h-4 rounded text-gold focus:ring-gold"
                  />
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200 block">
                      رسائل SMS النصية
                    </span>
                    <span className="text-[10px] text-stone-400">
                      تأكيد استلام الدفعات المالية وبدء تجهيز أحجار الواجهات.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => {
                      setNotifyEmail(e.target.checked);
                      handleSavePreferences();
                    }}
                    className="w-4 h-4 rounded text-gold focus:ring-gold"
                  />
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200 block">
                      البريد الإلكتروني
                    </span>
                    <span className="text-[10px] text-stone-400">
                      إرسال نسخ PDF من عروض الأسعار والمخططات الهندسية.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyOffers}
                    onChange={(e) => {
                      setNotifyOffers(e.target.checked);
                      handleSavePreferences();
                    }}
                    className="w-4 h-4 rounded text-gold focus:ring-gold"
                  />
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200 block">
                      عروض وخصومات الأحجار والنحت
                    </span>
                    <span className="text-[10px] text-stone-400">
                      إشعارات بالعروض الحصرية على الأحجار الطبيعية والزخارف.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Activities & Orders Quick Access */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/rfq"
              className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 hover:border-gold/60 shadow-stone-sm transition-all group flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                  <FileText className="w-4 h-4 text-gold" />
                  <span>طلب عرض سعر جديد (RFQ)</span>
                </div>
                <p className="text-xs text-stone-500">
                  ارفع مخططاً هندسياً أو اطلب تسعير واجهة حجرية أو نقش خاص.
                </p>
              </div>
              <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-gold group-hover:-translate-x-1 transition-all" />
            </Link>

            <Link
              href="/rfq/track"
              className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 hover:border-gold/60 shadow-stone-sm transition-all group flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>تتبع حالة عروض الأسعار والمعاملات</span>
                </div>
                <p className="text-xs text-stone-500">
                  أدخل رقم المعاملة للاطلاع على السعر المعتمد والمخططات الفنية.
                </p>
              </div>
              <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-gold group-hover:-translate-x-1 transition-all" />
            </Link>

            <Link
              href="/checkout"
              className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 hover:border-gold/60 shadow-stone-sm transition-all group flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                  <ShoppingBag className="w-4 h-4 text-gold" />
                  <span>سداد دفعات المحافظ الإلكترونية</span>
                </div>
                <p className="text-xs text-stone-500">
                  الدفع عبر ون كاش، فلوسك، جوالي، مسح رمز الـ QR ورفع إشعار التحويل.
                </p>
              </div>
              <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-gold group-hover:-translate-x-1 transition-all" />
            </Link>

            <Link
              href="/products"
              className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 hover:border-gold/60 shadow-stone-sm transition-all group flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                  <Building className="w-4 h-4 text-gold" />
                  <span>تصفح كتالوج الأحجار والزخارف</span>
                </div>
                <p className="text-xs text-stone-500">
                  استعراض أحجار الحبش، البلق، المشقف، وتيجان الأعمدة المنحوتة.
                </p>
              </div>
              <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-gold group-hover:-translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
