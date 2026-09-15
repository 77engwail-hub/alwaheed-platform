'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  FileText,
  Eye,
} from 'lucide-react';

interface ReceiptUploaderProps {
  onFileSelected: (fileData: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    fileObject?: File;
  }) => void;
  disabled?: boolean;
}

export const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({
  onFileSelected,
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('يرجى رفع صورة (PNG, JPG, JPEG, WEBP) أو ملف PDF للإشعار.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('حجم الملف كبير جداً، الحد الأقصى المسموح 15 ميجابايت.');
      return;
    }

    setIsUploading(true);
    setFileName(file.name);
    setFileSizeStr(formatBytes(file.size));

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      setIsUploading(false);

      onFileSelected({
        fileUrl: dataUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        fileObject: file,
      });
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('حدث خطأ أثناء قراءة الملف، يرجى المحاولة مرة أخرى.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setFileName(null);
    setFileSizeStr(null);
    if (inputRef.current) inputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {!previewUrl ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
            dragActive
              ? 'border-gold bg-gold/10'
              : 'border-stone-700/80 bg-stone-900/60 hover:border-gold/60'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
            onChange={handleChange}
            disabled={disabled || isUploading}
            className="hidden"
            id="receipt-file-upload"
          />

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            disabled={disabled || isUploading}
            className="hidden"
            id="receipt-camera-capture"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-stone-800/80 border border-stone-700/80 flex items-center justify-center text-gold shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-stone-100">
                اسحب وأفلت صورة إشعار أو سكرين شوت الدفع هنا
              </h4>
              <p className="text-xs text-stone-400">
                يدعم JPG, PNG, WEBP, PDF بحد أقصى 15 ميجابايت
              </p>
            </div>

            {/* Selection Options Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled || isUploading}
                className="bg-gold hover:bg-gold-dark text-stone-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ImageIcon className="w-4 h-4" />
                <span>اختر صورة من الجهاز</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-stone-700 flex items-center gap-1.5 transition-all sm:hidden"
              >
                <Camera className="w-4 h-4 text-gold" />
                <span>التقاط بالكاميرا</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Preview Card */
        <div className="bg-stone-900 border border-stone-700/80 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم اختيار الإشعار بنجاح وجاهز للتحقق</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              disabled={disabled}
              className="text-stone-400 hover:text-rose-400 text-xs flex items-center gap-1 font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>استبدال الإشعار</span>
            </button>
          </div>

          <div className="flex items-center gap-4 bg-stone-950/60 p-3 rounded-xl border border-stone-800">
            {previewUrl.startsWith('data:image') ? (
              <div
                onClick={() => setShowLightbox(true)}
                className="w-16 h-16 rounded-lg overflow-hidden border border-stone-700 shrink-0 cursor-pointer relative group bg-stone-900"
              >
                <img
                  src={previewUrl}
                  alt="Receipt Preview"
                  className="w-full h-full object-cover group-hover:scale-110 transition-all"
                />
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center text-gold shrink-0">
                <FileText className="w-8 h-8" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-stone-200 truncate">{fileName}</p>
              <p className="text-[11px] text-stone-400 font-mono mt-0.5">{fileSizeStr}</p>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {showLightbox && previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-stone-900 p-2 rounded-2xl border border-stone-700">
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-gold text-stone-950 rounded-full flex items-center justify-center font-bold shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewUrl}
              alt="Receipt Lightbox"
              className="max-h-[80vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
