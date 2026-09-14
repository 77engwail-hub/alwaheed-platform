'use client';

import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../lib/admin-api';
import { formatPrice, formatPricingMode, formatUnit } from '@al-waheed/ui';
import {
  Boxes,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [finishes, setFinishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    titleAr: '',
    titleEn: '',
    slug: '',
    sku: '',
    shortDescAr: '',
    fullDescAr: '',
    categoryId: '',
    pricingMode: 'FIXED_PRICE',
    unit: 'PIECE',
    basePrice: 0,
    currency: 'YER',
    isFeatured: false,
    isActive: true,
    materialIds: [] as string[],
    finishIds: [] as string[],
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pRes, cRes, mRes, fRes] = await Promise.all([
        adminFetch('/catalog/products?limit=50'),
        adminFetch('/catalog/categories'),
        adminFetch('/catalog/materials'),
        adminFetch('/catalog/finishes'),
      ]);
      setProducts(pRes || []);
      setCategories(cRes || []);
      setMaterials(mRes || []);
      setFinishes(fRes || []);
      if (cRes && cRes.length > 0) {
        setNewProduct((prev) => ({ ...prev, categoryId: cRes[0].id }));
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      const created = await adminFetch('/catalog/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          ...newProduct,
          basePrice: Number(newProduct.basePrice) || undefined,
        }),
      });

      setFeedback({ type: 'success', message: 'تم إضافة المنتج الحجري بنجاح!' });
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في تعطيل هذا المنتج؟')) return;
    try {
      await adminFetch(`/catalog/admin/products/${id}`, { method: 'DELETE' });
      setFeedback({ type: 'success', message: 'تم تعطيل المنتج بنجاح' });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">إدارة المنتجات والأحجار المعمارية</h1>
          <p className="text-xs text-stone-500">إضافة وتعديل الأحجار الطبيعية، التيجان، النقوش، والتشكيلات المعمارية</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-stone-900 hover:bg-stone-800 text-gold font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-stone-sm">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-400">جاري تحميل المنتجات...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="p-3">المنتج</th>
                  <th className="p-3">الرمز (SKU)</th>
                  <th className="p-3">القسم</th>
                  <th className="p-3">طريقة التسعير</th>
                  <th className="p-3">السعر الافتراضي</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/50">
                    <td className="p-3 font-bold text-stone-900">{p.titleAr}</td>
                    <td className="p-3 font-mono text-stone-500">{p.sku}</td>
                    <td className="p-3 text-stone-600">{p.category?.nameAr || '-'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-mono">
                        {formatPricingMode(p.pricingMode)}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-stone-900">
                      {formatPrice(p.basePrice, p.currency, p.pricingMode)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.isActive ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                        title="تعطيل المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h2 className="text-lg font-bold text-stone-900">إضافة منتج حجري جديد</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">الاسم بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.titleAr}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        titleAr: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    placeholder="مثال: حجر حبش رمادي"
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">الاسم بالإنجليزية *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.titleEn}
                    onChange={(e) => setNewProduct({ ...newProduct, titleEn: e.target.value })}
                    placeholder="e.g. Grey Habash Stone"
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">الرابط الدائم (Slug) *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">الرمز (SKU) *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="e.g. HAB-GR-001"
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">القسم *</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">طريقة التسعير *</label>
                  <select
                    value={newProduct.pricingMode}
                    onChange={(e) => setNewProduct({ ...newProduct, pricingMode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none bg-white"
                  >
                    <option value="FIXED_PRICE">سعر محدد للقطعة</option>
                    <option value="PER_SQUARE_METER">بالمتر المربع (m²)</option>
                    <option value="STARTING_FROM">يبدأ من</option>
                    <option value="CUSTOM_QUOTE">تسعير مخصص / RFQ</option>
                    <option value="CONTACT_FOR_PRICE">السعر عند التواصل</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">السعر (ريال يمني)</label>
                  <input
                    type="number"
                    value={newProduct.basePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">الوصف الموجز</label>
                <textarea
                  rows={2}
                  value={newProduct.shortDescAr}
                  onChange={(e) => setNewProduct({ ...newProduct, shortDescAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-stone-800 text-gold font-bold py-3 rounded-xl transition-all"
              >
                حفظ وإضافة المنتج للكتالوج
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
