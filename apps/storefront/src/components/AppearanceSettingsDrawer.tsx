'use client';

import React, { useState } from 'react';
import {
  useTheme,
  THEMES,
  FONT_SIZES,
  FONT_FAMILIES,
  CURRENCIES,
} from '../context/ThemeContext';
import { useTranslation, LANGUAGES } from '../context/I18nContext';
import {
  Palette,
  Type,
  Eye,
  Sliders,
  Sparkles,
  RotateCcw,
  Check,
  X,
  Zap,
  Layers,
  Coins,
  ShieldCheck,
  Globe,
} from 'lucide-react';

interface AppearanceSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppearanceSettingsDrawer: React.FC<AppearanceSettingsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
    stonePattern,
    setStonePattern,
    currency,
    setCurrency,
    resetPreferences,
  } = useTheme();

  const { language, setLanguage, t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'themes' | 'fonts' | 'effects' | 'currency' | 'language'>('themes');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex justify-end animate-fadeIn">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-md bg-stone-900 text-stone-100 border-r border-stone-800 shadow-2xl h-full flex flex-col justify-between overflow-hidden animate-slideLeft border-gold/30">
        {/* Drawer Header */}
        <div className="p-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/40 text-gold flex items-center justify-center shadow-gold-glow">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">تخصيص الواجهة والإعدادات</h2>
              <p className="text-[11px] text-stone-400">تحكم بالثيمات، اللغات، أحجام الخطوط، والمؤثرات</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-stone-950/70 p-2 border-b border-stone-800 flex items-center gap-1 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('themes')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'themes'
                ? 'bg-gold text-stone-950 shadow-sm font-extrabold'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>الثيمات</span>
          </button>
          <button
            onClick={() => setActiveTab('language')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'language'
                ? 'bg-gold text-stone-950 shadow-sm font-extrabold'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>اللغة</span>
          </button>
          <button
            onClick={() => setActiveTab('fonts')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'fonts'
                ? 'bg-gold text-stone-950 shadow-sm font-extrabold'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>الخط</span>
          </button>
          <button
            onClick={() => setActiveTab('effects')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'effects'
                ? 'bg-gold text-stone-950 shadow-sm font-extrabold'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>المؤثرات</span>
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'currency'
                ? 'bg-gold text-stone-950 shadow-sm font-extrabold'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>العملة</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {/* TAB 1: THEMES */}
          {activeTab === 'themes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-300">اختر الثيم المعماري الفاخر:</span>
                <span className="text-[10px] text-gold font-bold">{THEMES.length} ثيمات حصرية</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {THEMES.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'border-gold bg-gold/10 text-white shadow-md'
                          : 'border-stone-800 bg-stone-950/60 hover:border-gold/50 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl border border-stone-700 flex items-center justify-center text-base shrink-0 shadow-inner"
                          style={{ backgroundColor: t.previewColor }}
                        >
                          {t.icon}
                        </div>
                        <div>
                          <span className="text-xs font-bold block">{t.nameAr}</span>
                          <span className="text-[10px] text-stone-400 block">{t.desc}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-gold shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 1.5: LANGUAGE */}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-300">اختر لغة الموقع (Language):</span>
                <span className="text-[10px] text-gold font-bold">{LANGUAGES.length} لغات عالمية</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'border-gold bg-gold/10 text-white shadow-md'
                          : 'border-stone-800 bg-stone-950/60 hover:border-gold/50 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl shrink-0">{lang.flag}</span>
                        <div>
                          <span className="text-xs font-bold block text-white">{lang.nameNative}</span>
                          <span className="text-[10px] text-stone-400 font-mono block">
                            {lang.nameEn} ({lang.dir.toUpperCase()})
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-gold shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: FONT SIZE & FAMILY */}
          {activeTab === 'fonts' && (
            <div className="space-y-6">
              {/* Font Size Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-300 block">
                  1. حجم الخط في كامل الموقع:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FONT_SIZES.map((f) => {
                    const isSelected = fontSize === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFontSize(f.id)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-gold bg-gold/10 text-gold font-bold shadow-sm'
                            : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <span className="text-xs block font-bold">{f.labelAr}</span>
                        <span className="text-[10px] text-stone-400 font-mono block">
                          {f.scaleText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Family Selector */}
              <div className="space-y-3 pt-2 border-t border-stone-800">
                <label className="text-xs font-bold text-stone-300 block">
                  2. نوع الخط العربي المستخدم:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {FONT_FAMILIES.map((font) => {
                    const isSelected = fontFamily === font.id;
                    return (
                      <button
                        key={font.id}
                        onClick={() => setFontFamily(font.id)}
                        className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-gold bg-gold/10 text-gold font-bold shadow-sm'
                            : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold block">{font.nameAr}</span>
                          <span className="text-[10px] text-stone-400 block font-sans">
                            {font.previewText}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-gold shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VISUAL EFFECTS & ACCESSIBILITY */}
          {activeTab === 'effects' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-stone-300 block">
                تخصيص المؤثرات والراحة البصرية:
              </span>

              {/* Stone Texture Pattern Toggle */}
              <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    نقوش وزخارف الحجر في الخلفية
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    إظهار نسيج هندسي ناعم يعكس طابع الحجر الطبيعي
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stonePattern}
                    onChange={(e) => setStonePattern(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
                </label>
              </div>

              {/* High Contrast Mode */}
              <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    وضع التباين العالي (High Contrast)
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    زيادة وضوح وقراءة النصوص والأرقام المعمارية
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
                </label>
              </div>

              {/* Reduced Motion Mode */}
              <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    تقليل الحركات والانتقالات
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    تسريع الاستجابة وتوفير طاقة البطارية للأجهزة
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: CURRENCY */}
          {activeTab === 'currency' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-stone-300 block">
                اختر عملة التسعير وعرض أسعار المنتجات:
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                {CURRENCIES.map((curr) => {
                  const isSelected = currency === curr.id;
                  return (
                    <button
                      key={curr.id}
                      onClick={() => setCurrency(curr.id)}
                      className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-gold bg-gold/10 text-gold font-bold shadow-sm'
                          : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-stone-800 text-gold flex items-center justify-center text-xs font-mono font-bold">
                          {curr.symbol}
                        </span>
                        <div>
                          <span className="text-xs font-bold block">{curr.nameAr}</span>
                          <span className="text-[10px] text-stone-400 font-mono block">
                            {curr.id}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-gold shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3">
          <button
            onClick={resetPreferences}
            className="text-stone-400 hover:text-gold text-xs font-bold flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-stone-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الإعدادات الافتراضية</span>
          </button>

          <button
            onClick={onClose}
            className="bg-gold hover:bg-gold-dark text-stone-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            تم والحفظ
          </button>
        </div>
      </div>
    </div>
  );
};
