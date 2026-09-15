'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Wallet,
  Building,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  QrCode,
  Lock,
  ArrowRight,
  Sparkles,
  Save,
  HelpCircle,
  UploadCloud,
  Image as ImageIcon,
  X,
  Eye,
  Camera,
} from 'lucide-react';
import { adminFetch } from '../../../lib/admin-api';

export default function PaymentProvidersSettingsPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit State
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Create State
  const [showCreateModal, setShowCreateModal] = useState(false);

  // QR Preview Modal State
  const [previewQrModal, setPreviewQrModal] = useState<{ url: string; name: string } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingQr, setIsUploadingQr] = useState(false);

  // Form State (Shared for Create / Edit)
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [entityIssuer, setEntityIssuer] = useState('');
  const [code, setCode] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [walletNumber, setWalletNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [instructionsAr, setInstructionsAr] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch('/payments/admin/providers');
      if (res && Array.isArray(res)) {
        setProviders(res);
      }
    } catch (e) {
      console.error(e);
      // Fallback verified list
      setProviders([
        {
          id: 'p-kuraimi',
          code: 'KURAIMI_BANK',
          nameAr: 'بنك الكريمي الإسلامي (كريمي جوال / الحساب المميز)',
          nameEn: 'Al-Kuraimi Islamic Bank',
          entityIssuer: 'بنك الكريمي للتمويل الأصغر الإسلامي',
          isActive: true,
          displayOrder: 1,
          isAiVerificationEnabled: true,
          instructionsAr: 'التحويل عبر تطبيق كريمي جوال إلى رقم الحساب المميز أو رقم الهاتف المعتمد.',
          accounts: [
            {
              id: 'acc-k1',
              accountNumber: '12089456',
              walletNumber: '777360681',
              accountHolderName: 'مؤسسة الوحيد للزخرفة والنحت',
              qrCodeUrl: '',
            },
          ],
        },
        {
          id: 'p-one',
          code: 'ONE_CASH',
          nameAr: 'ون كاش (ONE Cash)',
          nameEn: 'ONE Cash',
          entityIssuer: 'مجموعة هائل سعيد أنعم وشركاه (HSA Group)',
          isActive: true,
          displayOrder: 2,
          isAiVerificationEnabled: true,
          instructionsAr: 'يرجى الدفع عبر تطبيق ون كاش إلى رقم خدمة المشتريات / النقطة أو رقم المشترك.',
          accounts: [
            {
              id: 'acc-1',
              merchantId: '889201',
              walletNumber: '777360681',
              accountHolderName: 'مؤسسة الوحيد للزخرفة المعمارية',
              qrCodeUrl: '',
            },
          ],
        },
        {
          id: 'p-floosak',
          code: 'FLOOSAK',
          nameAr: 'فلوسك (Floosak)',
          nameEn: 'Floosak Wallet',
          entityIssuer: 'شركة الأكوع موني / بنك اليمن والكويت',
          isActive: true,
          displayOrder: 3,
          isAiVerificationEnabled: true,
          instructionsAr: 'التحويل عبر تطبيق فلوسك إلى رقم النقطة / التاجر أو رقم المشترك.',
          accounts: [
            {
              id: 'acc-2',
              merchantId: '662019',
              walletNumber: '777360681',
              accountHolderName: 'مؤسسة الوحيد للزخرفة والنحت',
              qrCodeUrl: '',
            },
          ],
        },
        {
          id: 'p-jawali',
          code: 'JAWALI',
          nameAr: 'جوالي (Jawali)',
          nameEn: 'Jawali (WeCash)',
          entityIssuer: 'شركة وي كاش لخدمات وأنظمة الدفع الإلكتروني',
          isActive: true,
          displayOrder: 4,
          isAiVerificationEnabled: true,
          instructionsAr: 'الدفع لمشتريات جوالي أو التحويل لرقم المشترك.',
          accounts: [
            {
              id: 'acc-3',
              merchantId: '450912',
              walletNumber: '777360681',
              accountHolderName: 'مؤسسة الوحيد للأحجار',
              qrCodeUrl: '',
            },
          ],
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleQrFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingQr(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'PAYMENT_QR');
      formData.append('altTextAr', `رمز QR لمحفظة ${nameAr || 'المتجر'}`);

      const token = typeof window !== 'undefined' ? localStorage.getItem('alwaheed_admin_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiUrl}/media/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();
      if (data?.data?.url) {
        setQrCodeUrl(data.data.url);
      } else {
        // Instant Base64 preview fallback
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setQrCodeUrl(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('QR upload failed, using FileReader fallback:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setQrCodeUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingQr(false);
    }
  };

  const handleOpenCreate = () => {
    setNameAr('');
    setNameEn('');
    setEntityIssuer('');
    setCode('CUSTOM_' + Math.floor(1000 + Math.random() * 9000));
    setMerchantId('');
    setWalletNumber('777360681');
    setAccountHolderName('مؤسسة الوحيد للزخرفة المعمارية');
    setQrCodeUrl('');
    setIsActive(true);
    setIsAiEnabled(true);
    setInstructionsAr('يرجى الدفع لرقم النقطة أو مسح رمز الـ QR أو التحويل لرقم المحفظة وإرفاق صورة الإشعار.');
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const newProvider = await adminFetch('/payments/admin/providers', {
        method: 'POST',
        body: JSON.stringify({
          code: code.trim().toUpperCase().replace(/\s+/g, '_'),
          nameAr: nameAr.trim(),
          nameEn: nameEn.trim(),
          entityIssuer: entityIssuer.trim() || undefined,
          isActive,
          displayOrder: providers.length + 1,
          supportedMethods: ['MANUAL_RECEIPT', 'MERCHANT_PAYMENT', 'WALLET_TRANSFER', 'QR_PAYMENT'],
          defaultCurrency: 'YER',
          instructionsAr: instructionsAr.trim(),
          isAiVerificationEnabled: isAiEnabled,
          isApiVerificationEnabled: false,
          isWebhookEnabled: false,
        }),
      });

      if (newProvider?.id) {
        // Save initial account with merchant point and QR code
        await adminFetch('/payments/admin/accounts', {
          method: 'POST',
          body: JSON.stringify({
            providerId: newProvider.id,
            accountName: `حساب ${nameAr} المعتمد`,
            merchantId: merchantId.trim() || null,
            merchantPaymentNumber: merchantId.trim() || null,
            walletNumber: walletNumber.trim() || null,
            qrCodeUrl: qrCodeUrl.trim() || null,
            accountHolderName: accountHolderName.trim() || 'مؤسسة الوحيد',
            currency: 'YER',
            isActive: true,
            isDefault: true,
          }),
        });
      }

      setShowCreateModal(false);
      await loadProviders();
    } catch (err: any) {
      alert('خطأ في إضافة المحفظة: ' + (err.message || err));
    }
    setIsSaving(false);
  };

  const handleOpenEdit = (p: any) => {
    setSelectedProvider(p);
    setNameAr(p.nameAr || '');
    setNameEn(p.nameEn || '');
    setEntityIssuer(p.entityIssuer || '');
    setCode(p.code || '');
    const acc = p.accounts?.[0];
    setMerchantId(acc?.merchantId || acc?.merchantPaymentNumber || '');
    setWalletNumber(acc?.walletNumber || acc?.accountNumber || '');
    setAccountHolderName(acc?.accountHolderName || 'مؤسسة الوحيد');
    setQrCodeUrl(acc?.qrCodeUrl || '');
    setIsActive(p.isActive ?? true);
    setIsAiEnabled(p.isAiVerificationEnabled ?? true);
    setInstructionsAr(p.instructionsAr || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;

    setIsSaving(true);
    try {
      await adminFetch(`/payments/admin/providers/${selectedProvider.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nameAr: nameAr.trim(),
          nameEn: nameEn.trim(),
          entityIssuer: entityIssuer.trim() || undefined,
          isActive,
          displayOrder: selectedProvider.displayOrder || 1,
          supportedMethods: ['MANUAL_RECEIPT', 'MERCHANT_PAYMENT', 'WALLET_TRANSFER', 'QR_PAYMENT'],
          defaultCurrency: 'YER',
          instructionsAr: instructionsAr.trim(),
          isAiVerificationEnabled: isAiEnabled,
          isApiVerificationEnabled: false,
          isWebhookEnabled: false,
        }),
      });

      // Save Account details with QR code and Point Number
      await adminFetch('/payments/admin/accounts', {
        method: 'POST',
        body: JSON.stringify({
          providerId: selectedProvider.id,
          accountName: `حساب ${nameAr} المعتمد`,
          merchantId: merchantId.trim() || null,
          merchantPaymentNumber: merchantId.trim() || null,
          walletNumber: walletNumber.trim() || null,
          qrCodeUrl: qrCodeUrl.trim() || null,
          accountHolderName: accountHolderName.trim() || 'مؤسسة الوحيد',
          currency: 'YER',
          isActive: true,
          isDefault: true,
        }),
      });

      setShowEditModal(false);
      await loadProviders();
    } catch (err: any) {
      alert('خطأ في حفظ البيانات: ' + (err.message || err));
    }
    setIsSaving(false);
  };

  const handleDeleteProvider = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف محفظة / بنك "${name}" نهائياً؟`)) return;

    try {
      await adminFetch(`/payments/admin/providers/${id}`, {
        method: 'DELETE',
      });
      await loadProviders();
    } catch (err: any) {
      alert('خطأ في حذف المحفظة: ' + (err.message || err));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs text-gold font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>إعدادات بوابات الدفع الإلكتروني</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            إدارة المحافظ وأرقام النقاط ورموز QR
          </h1>
          <p className="text-xs text-stone-500">
            تعديل أرقام نقاط البيع (POS / Merchant ID)، إرفاق وتحديث صور رمز QR كود، وإدارة أسماء وحسابات المحافظ اليمنية.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleOpenCreate}
            className="bg-gold hover:bg-gold-dark text-stone-950 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة محفظة / بنك جديد</span>
          </button>

          <Link
            href="/payments"
            className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>مركز التحقق</span>
          </Link>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
        <div className="text-xs text-stone-700 space-y-1">
          <p className="font-bold text-stone-900">إمكانية إضافة صور رموز QR كود وأرقام النقاط والمحافظ:</p>
          <p className="text-stone-600 leading-relaxed">
            يمكنك رفع <strong>صورة باركود QR كود</strong> الخاصة بنقطة البيع لكل محفظة، وتحديد <strong>رقم النقطة / التاجر</strong> و<strong>رقم المحفظة</strong> ليتمكن العميل من مسح الكود مباشرة عبر تطبيق محفظته أو نسخ رقم النقطة بنقرة واحدة.
          </p>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-12 text-center text-xs text-stone-400">
            جاري تحميل إعدادات المحافظ...
          </div>
        ) : (
          providers.map((p) => {
            const acc = p.accounts?.[0];
            return (
              <div
                key={p.id || p.code}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-stone-sm space-y-4 flex flex-col justify-between hover:border-gold/60 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-gold/30 flex items-center justify-center text-gold shadow-inner font-bold">
                      {p.code?.includes('BANK') ? (
                        <Building className="w-6 h-6" />
                      ) : (
                        <Wallet className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border border-stone-200'
                      }`}
                    >
                      {p.isActive ? 'مفعلة بالمتجر' : 'معطلة'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-stone-900">{p.nameAr}</h3>
                    <p className="text-[11px] text-stone-400 font-mono">{p.nameEn}</p>

                    {p.entityIssuer && (
                      <div className="mt-1.5 inline-block bg-stone-100 px-2 py-0.5 rounded-md text-[10px] font-bold text-stone-600 border border-stone-200">
                        الجهة: {p.entityIssuer}
                      </div>
                    )}
                  </div>

                  {/* Account & Point Metadata */}
                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100 space-y-2 text-xs">
                    {acc?.merchantId && (
                      <div className="flex justify-between items-center">
                        <span className="text-stone-500">رقم النقطة / التاجر:</span>
                        <span className="font-mono font-extrabold text-stone-900 bg-stone-200/70 px-2 py-0.5 rounded-md">
                          {acc.merchantId}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">رقم المشترك / المحفظة:</span>
                      <span className="font-mono font-bold text-gold">
                        {acc?.walletNumber || acc?.accountNumber || '777360681'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">اسم المستفيد:</span>
                      <span className="font-bold text-stone-800 truncate max-w-[150px]">
                        {acc?.accountHolderName || 'مؤسسة الوحيد'}
                      </span>
                    </div>

                    {/* QR Code Status & Preview Badge */}
                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                      <span className="text-stone-500 text-[11px] flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5 text-gold" />
                        <span>رمز QR كود:</span>
                      </span>
                      {acc?.qrCodeUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewQrModal({ url: acc.qrCodeUrl, name: p.nameAr })}
                          className="inline-flex items-center gap-1 text-[10px] font-bold bg-gold/15 text-gold border border-gold/30 px-2 py-0.5 rounded-md hover:bg-gold hover:text-stone-950 transition-all cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>معاينة الرمز</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-stone-400">لم يرفع رمز QR بعد</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>فحص AI {p.isAiVerificationEnabled ? 'مفعل' : 'معطل'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="bg-stone-900 hover:bg-gold hover:text-stone-950 text-gold font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    {p.id && (
                      <button
                        onClick={() => handleDeleteProvider(p.id, p.nameAr)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-xl transition-all"
                        title="حذف المحفظة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* QR Code Quick Preview Modal */}
      {previewQrModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-gold" />
                <span>رمز QR كود — {previewQrModal.name}</span>
              </h3>
              <button
                onClick={() => setPreviewQrModal(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-center">
              <img
                src={previewQrModal.url}
                alt="QR Code"
                className="w-56 h-56 object-contain rounded-xl shadow-sm"
              />
            </div>

            <button
              onClick={() => setPreviewQrModal(null)}
              className="w-full bg-stone-900 text-gold font-bold text-xs py-2.5 rounded-xl hover:bg-stone-800 transition-all"
            >
              إغلاق المعاينة
            </button>
          </div>
        </div>
      )}

      {/* Create Provider Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-stone-md space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-gold" />
                <span>إضافة محفظة أو حساب بنكي جديد</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-600 block mb-1 font-bold">اسم المحفظة / البنك (عربي):</label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: محفظة جيب (Jeeb)"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-bold">الاسم بالإنجليزية:</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="مثال: Jeeb Wallet"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-600 block mb-1 font-bold">الجهة المالكة والمشغلة / البنك:</label>
                  <input
                    type="text"
                    value={entityIssuer}
                    onChange={(e) => setEntityIssuer(e.target.value)}
                    placeholder="مثال: بنك التضامن الإسلامي الدولي"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-bold">الكود التعريفي (رمز فريد):</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="مثال: JEEB_WALLET"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-600 block mb-1 font-bold">رقم نقطة البيع / رقم التاجر (Point ID):</label>
                  <input
                    type="text"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    placeholder="مثال: 889201 أو رقم النقطة"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-bold">رقم المحفظة / هاتف المشترك:</label>
                  <input
                    type="text"
                    value={walletNumber}
                    onChange={(e) => setWalletNumber(e.target.value)}
                    placeholder="مثال: 777360681"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-600 block mb-1 font-bold">اسم صاحب الحساب الرسمي:</label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              {/* QR Code Upload & Input Section */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2.5">
                <label className="text-stone-700 block font-extrabold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-gold" />
                    <span>صورة رمز الاستجابة السريعة (QR Code) للنقطة / المحفظة:</span>
                  </span>
                  {qrCodeUrl && (
                    <button
                      type="button"
                      onClick={() => setQrCodeUrl('')}
                      className="text-rose-600 text-[10px] hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>إزالة الصورة</span>
                    </button>
                  )}
                </label>

                {qrCodeUrl ? (
                  <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-stone-200">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code Preview"
                      className="w-16 h-16 object-contain rounded-lg border border-stone-200 p-1 bg-stone-50"
                    />
                    <div className="flex-1 space-y-1">
                      <span className="font-bold text-emerald-700 text-xs block flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تم تحديد صورة رمز الـ QR بنجاح</span>
                      </span>
                      <input
                        type="text"
                        value={qrCodeUrl}
                        onChange={(e) => setQrCodeUrl(e.target.value)}
                        placeholder="رابط الصورة"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-[10px] font-mono text-stone-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleQrFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingQr}
                        className="bg-stone-900 hover:bg-gold hover:text-stone-950 text-gold font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm text-xs"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{isUploadingQr ? 'جاري الرفع...' : 'رفع صورة الـ QR من جهازك'}</span>
                      </button>
                      <span className="text-[10px] text-stone-400">أو الصق رابط الصورة مباشرة بالأسفل:</span>
                    </div>

                    <input
                      type="text"
                      value={qrCodeUrl}
                      onChange={(e) => setQrCodeUrl(e.target.value)}
                      placeholder="https://example.com/qr-code.png أو رابط صورة الكيوار"
                      className="w-full bg-white border border-stone-200 rounded-xl p-2 font-mono text-xs"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-stone-600 block mb-1 font-bold">تعليمات الدفع والتحويل للعميل:</label>
                <textarea
                  value={instructionsAr}
                  onChange={(e) => setInstructionsAr(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-gold focus:ring-gold"
                  />
                  <span className="font-bold text-stone-800">تفعيل المحفظة بالمتجر فوراً</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAiEnabled}
                    onChange={(e) => setIsAiEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-gold focus:ring-gold"
                  />
                  <span className="font-bold text-stone-800">تفعيل فحص الإشعار بالـ AI</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-gold hover:bg-gold-dark text-stone-950 font-extrabold text-xs px-5 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة المحفظة الآن</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Provider Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-stone-md space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">
                تعديل إعدادات {selectedProvider?.nameAr}
              </h3>
              <span className="text-xs text-gold font-mono font-bold">{selectedProvider?.code}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-600 block mb-1 font-bold">الاسم بالعربية:</label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-bold">الاسم بالإنجليزية:</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-600 block mb-1 font-bold">الجهة المالكة والمشغلة / البنك المصدر:</label>
                <input
                  type="text"
                  value={entityIssuer}
                  onChange={(e) => setEntityIssuer(e.target.value)}
                  placeholder="مثال: شركة الأكوع موني / بنك اليمن والكويت"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-600 block mb-1 font-bold">رقم نقطة البيع / رقم التاجر (Point ID):</label>
                  <input
                    type="text"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    placeholder="مثال: 889201"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-bold">رقم المحفظة / هاتف المشترك:</label>
                  <input
                    type="text"
                    value={walletNumber}
                    onChange={(e) => setWalletNumber(e.target.value)}
                    placeholder="مثال: 777360681"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-600 block mb-1 font-bold">اسم صاحب الحساب الرسمي:</label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              {/* QR Code Upload & Input Section */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2.5">
                <label className="text-stone-700 block font-extrabold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-gold" />
                    <span>صورة رمز الاستجابة السريعة (QR Code) للنقطة / المحفظة:</span>
                  </span>
                  {qrCodeUrl && (
                    <button
                      type="button"
                      onClick={() => setQrCodeUrl('')}
                      className="text-rose-600 text-[10px] hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>إزالة الصورة</span>
                    </button>
                  )}
                </label>

                {qrCodeUrl ? (
                  <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-stone-200">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code Preview"
                      className="w-16 h-16 object-contain rounded-lg border border-stone-200 p-1 bg-stone-50"
                    />
                    <div className="flex-1 space-y-1">
                      <span className="font-bold text-emerald-700 text-xs block flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تم تحديد صورة رمز الـ QR بنجاح</span>
                      </span>
                      <input
                        type="text"
                        value={qrCodeUrl}
                        onChange={(e) => setQrCodeUrl(e.target.value)}
                        placeholder="رابط الصورة"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-[10px] font-mono text-stone-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleQrFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingQr}
                        className="bg-stone-900 hover:bg-gold hover:text-stone-950 text-gold font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm text-xs"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{isUploadingQr ? 'جاري الرفع...' : 'رفع صورة الـ QR من جهازك'}</span>
                      </button>
                      <span className="text-[10px] text-stone-400">أو الصق رابط الصورة مباشرة:</span>
                    </div>

                    <input
                      type="text"
                      value={qrCodeUrl}
                      onChange={(e) => setQrCodeUrl(e.target.value)}
                      placeholder="https://example.com/qr-code.png أو رابط صورة الكيوار"
                      className="w-full bg-white border border-stone-200 rounded-xl p-2 font-mono text-xs"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-stone-600 block mb-1 font-bold">تعليمات الدفع التي تظهر للعميل:</label>
                <textarea
                  value={instructionsAr}
                  onChange={(e) => setInstructionsAr(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-gold focus:ring-gold"
                  />
                  <span className="font-bold text-stone-800">تفعيل المحفظة في المتجر</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAiEnabled}
                    onChange={(e) => setIsAiEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-gold focus:ring-gold"
                  />
                  <span className="font-bold text-stone-800">تفعيل التحقق الذكي بالـ AI</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-gold hover:bg-gold-dark text-stone-950 font-bold text-xs px-5 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
