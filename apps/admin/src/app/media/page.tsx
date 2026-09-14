'use client';

import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../lib/admin-api';
import { Image as ImageIcon, Upload, CheckCircle2, AlertCircle, Copy, ExternalLink } from 'lucide-react';

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch('/media/all?limit=50');
      setMediaItems(res || []);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setFeedback(null);

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'STONES');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const token = localStorage.getItem('alwaheed_admin_token');

      const res = await fetch(`${apiUrl}/media/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'فشل رفع الملف');

      setFeedback({ type: 'success', message: 'تم رفع الصورة وحفظها في مكتبة الوسائط بنجاح!' });
      loadMedia();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'حدث خطأ أثناء الرفع' });
    } finally {
      setIsUploading(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setFeedback({ type: 'success', message: 'تم نسخ رابط الصورة إلى الحافظة' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">مكتبة الوسائط والصور</h1>
          <p className="text-xs text-stone-500">رفع وإدارة صور الأحجار الطبيعية، المشاريع، والمخططات</p>
        </div>

        <label className="bg-stone-900 hover:bg-stone-800 text-gold font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'جاري الرفع...' : 'رفع صورة جديدة'}</span>
          <input
            type="file"
            disabled={isUploading}
            accept=".jpg,.jpeg,.png,.webp,.svg"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
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

      {/* Media Grid */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-stone-sm">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-400">جاري تحميل الوسائط...</div>
        ) : mediaItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">لا توجد وسائط مرفوعة بعد</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden aspect-square border border-stone-200 bg-stone-50 shadow-sm"
              >
                <img
                  src={item.fileUrl}
                  alt={item.altTextAr || item.originalName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-[10px] text-stone-200">
                  <span className="line-clamp-1">{item.originalName}</span>
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => copyUrl(item.fileUrl)}
                      className="p-1 bg-stone-800 hover:bg-gold hover:text-stone-950 rounded text-stone-100 transition-colors"
                      title="نسخ الرابط"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 bg-stone-800 hover:bg-gold hover:text-stone-950 rounded text-stone-100 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
