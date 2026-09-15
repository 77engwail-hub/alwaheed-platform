'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ThemeMode,
  FontSizeScale,
  FontFamilyOption,
  CurrencyCode,
  UserAppearancePreferences,
} from '@al-waheed/types';

interface ThemeContextType {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // Font Size
  fontSize: FontSizeScale;
  setFontSize: (size: FontSizeScale) => void;

  // Font Family
  fontFamily: FontFamilyOption;
  setFontFamily: (font: FontFamilyOption) => void;

  // Accessibility & Visual Effects
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;

  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;

  stonePattern: boolean;
  setStonePattern: (enabled: boolean) => void;

  // Currency
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;

  // Quick Reset
  resetPreferences: () => void;
}

export const THEMES: { id: ThemeMode; nameAr: string; icon: string; desc: string; previewColor: string }[] = [
  { id: 'dark', nameAr: 'الملكي الأسود والذهب', icon: '👑', desc: 'حجر بازلتي فاخر مع وهج الذهب', previewColor: '#0c0a09' },
  { id: 'light', nameAr: 'الرخام الإمبراطوري الأبيض', icon: '🏛️', desc: 'رخام أبيض نقي ولمسات حجرية أنيقة', previewColor: '#faf8f5' },
  { id: 'heritage', nameAr: 'التراث الصنعاني العريق', icon: '🏺', desc: 'حجر رملي دافئ ونقوش تراثية يمنية', previewColor: '#1a1412' },
  { id: 'emerald', nameAr: 'الزمردي المعماري الفاخر', icon: '💎', desc: 'حجر الزمرد الأخضر مع تفاصيل ذهبية', previewColor: '#061a14' },
  { id: 'sapphire', nameAr: 'اللازوردي الكريستالي', icon: '🌌', desc: 'حجر سليت أزرق ملكي عصري', previewColor: '#091224' },
  { id: 'sandstone', nameAr: 'الحجر الرملي الصحراوي', icon: '🏜️', desc: 'بيج صحراوي دافئ ومريح للعين', previewColor: '#fdf6ec' },
];

export const FONT_SIZES: { id: FontSizeScale; labelAr: string; scaleText: string }[] = [
  { id: 'small', labelAr: 'صغير', scaleText: '85%' },
  { id: 'medium', labelAr: 'افتراضي', scaleText: '100%' },
  { id: 'large', labelAr: 'كبير', scaleText: '115%' },
  { id: 'xlarge', labelAr: 'كبير جداً', scaleText: '130%' },
];

export const FONT_FAMILIES: { id: FontFamilyOption; nameAr: string; previewText: string }[] = [
  { id: 'tajawal', nameAr: 'خط تجوال (Tajawal)', previewText: 'أحجار بناء ونحت وزخرفة معمارية' },
  { id: 'alexandria', nameAr: 'خط الإسكندرية (Alexandria)', previewText: 'أحجار بناء ونحت وزخرفة معمارية' },
  { id: 'almarai', nameAr: 'خط المراعي (Almarai)', previewText: 'أحجار بناء ونحت وزخرفة معمارية' },
  { id: 'cairo', nameAr: 'خط القاهرة (Cairo)', previewText: 'أحجار بناء ونحت وزخرفة معمارية' },
];

export const CURRENCIES: { id: CurrencyCode; nameAr: string; symbol: string }[] = [
  { id: 'YER', nameAr: 'ريال يمني (صنعاء)', symbol: 'ر.ي' },
  { id: 'YER_ADEN', nameAr: 'ريال يمني (عدن)', symbol: 'ر.ي' },
  { id: 'SAR', nameAr: 'ريال سعودي', symbol: 'ر.س' },
  { id: 'USD', nameAr: 'دولار أمريكي', symbol: '$' },
];

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  fontFamily: 'tajawal',
  setFontFamily: () => {},
  reducedMotion: false,
  setReducedMotion: () => {},
  highContrast: false,
  setHighContrast: () => {},
  stonePattern: true,
  setStonePattern: () => {},
  currency: 'YER',
  setCurrency: () => {},
  resetPreferences: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [fontSize, setFontSizeState] = useState<FontSizeScale>('medium');
  const [fontFamily, setFontFamilyState] = useState<FontFamilyOption>('tajawal');
  const [reducedMotion, setReducedMotionState] = useState<boolean>(false);
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [stonePattern, setStonePatternState] = useState<boolean>(true);
  const [currency, setCurrencyState] = useState<CurrencyCode>('YER');

  useEffect(() => {
    // 1. Load Theme
    const savedTheme = localStorage.getItem('al_waheed_theme') as ThemeMode;
    if (savedTheme && THEMES.some((t) => t.id === savedTheme)) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // 2. Load Font Size
    const savedFontSize = localStorage.getItem('al_waheed_font_size') as FontSizeScale;
    if (savedFontSize && FONT_SIZES.some((f) => f.id === savedFontSize)) {
      setFontSizeState(savedFontSize);
      document.documentElement.setAttribute('data-font-size', savedFontSize);
    } else {
      document.documentElement.setAttribute('data-font-size', 'medium');
    }

    // 3. Load Font Family
    const savedFontFamily = localStorage.getItem('al_waheed_font_family') as FontFamilyOption;
    if (savedFontFamily && FONT_FAMILIES.some((f) => f.id === savedFontFamily)) {
      setFontFamilyState(savedFontFamily);
      document.documentElement.setAttribute('data-font-family', savedFontFamily);
    } else {
      document.documentElement.setAttribute('data-font-family', 'tajawal');
    }

    // 4. Load Visual Settings
    const savedReducedMotion = localStorage.getItem('al_waheed_reduced_motion') === 'true';
    setReducedMotionState(savedReducedMotion);
    document.documentElement.setAttribute('data-reduced-motion', String(savedReducedMotion));

    const savedHighContrast = localStorage.getItem('al_waheed_high_contrast') === 'true';
    setHighContrastState(savedHighContrast);
    document.documentElement.setAttribute('data-high-contrast', String(savedHighContrast));

    const savedStonePattern = localStorage.getItem('al_waheed_stone_pattern') !== 'false';
    setStonePatternState(savedStonePattern);
    document.documentElement.setAttribute('data-stone-pattern', String(savedStonePattern));

    // 5. Load Currency
    const savedCurrency = localStorage.getItem('al_waheed_currency') as CurrencyCode;
    if (savedCurrency && CURRENCIES.some((c) => c.id === savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('al_waheed_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setFontSize = (newSize: FontSizeScale) => {
    setFontSizeState(newSize);
    localStorage.setItem('al_waheed_font_size', newSize);
    document.documentElement.setAttribute('data-font-size', newSize);
  };

  const setFontFamily = (newFont: FontFamilyOption) => {
    setFontFamilyState(newFont);
    localStorage.setItem('al_waheed_font_family', newFont);
    document.documentElement.setAttribute('data-font-family', newFont);
  };

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
    localStorage.setItem('al_waheed_reduced_motion', String(enabled));
    document.documentElement.setAttribute('data-reduced-motion', String(enabled));
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    localStorage.setItem('al_waheed_high_contrast', String(enabled));
    document.documentElement.setAttribute('data-high-contrast', String(enabled));
  };

  const setStonePattern = (enabled: boolean) => {
    setStonePatternState(enabled);
    localStorage.setItem('al_waheed_stone_pattern', String(enabled));
    document.documentElement.setAttribute('data-stone-pattern', String(enabled));
  };

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    localStorage.setItem('al_waheed_currency', curr);
  };

  const resetPreferences = () => {
    setTheme('dark');
    setFontSize('medium');
    setFontFamily('tajawal');
    setReducedMotion(false);
    setHighContrast(false);
    setStonePattern(true);
    setCurrency('YER');
  };

  const toggleTheme = () => {
    const themeOrder: ThemeMode[] = ['dark', 'light', 'heritage', 'emerald', 'sapphire', 'sandstone'];
    const nextIndex = (themeOrder.indexOf(theme) + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
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
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
