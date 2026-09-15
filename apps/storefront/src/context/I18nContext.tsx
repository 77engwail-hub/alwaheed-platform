'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { LanguageCode } from '@al-waheed/types';

export interface LanguageOption {
  code: LanguageCode;
  nameNative: string;
  nameEn: string;
  flag: string;
  dir: 'rtl' | 'ltr';
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'ar', nameNative: 'العربية', nameEn: 'Arabic', flag: '🇾🇪', dir: 'rtl' },
  { code: 'en', nameNative: 'English', nameEn: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'tr', nameNative: 'Türkçe', nameEn: 'Turkish', flag: '🇹🇷', dir: 'ltr' },
  { code: 'zh', nameNative: '中文', nameEn: 'Chinese', flag: '🇨🇳', dir: 'ltr' },
];

export const DICTIONARY: Record<LanguageCode, Record<string, string>> = {
  ar: {
    // Brand & Header
    'brand.name': 'مؤسسة الوحيد للزخرفة والأحجار',
    'brand.shortName': 'الوحيد للزخرفة',
    'brand.tagline': 'للنحت والمعمار',
    'brand.location': 'صنعاء - فج عطان',
    'brand.phone': '+967 777 360 681',
    'brand.whatsapp': 'واتساب',

    // Navigation
    'nav.home': 'الرئيسية',
    'nav.posts': 'المنشورات',
    'nav.products': 'الأحجار',
    'nav.projects': 'المشاريع',
    'nav.services': 'الخدمات',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.rfq': 'طلب تسعير',
    'nav.track': 'التتبع',
    'nav.account': 'حسابي',
    'nav.satellite': 'الخريطة',
    'nav.themes': 'الثيمات',
    'nav.language': 'اللغة',

    // Hero & Home
    'hero.badge': 'رواد النحت الحجري والمعمار بالمكائن الآلية الحديثة CNC',
    'hero.title': 'فخامة الحجر الطبيعي ونقوش معمارية خالدة',
    'hero.subtitle': 'واجهات حجرية يمنية ملكية، تيجان أعمدة، ونحت بالمكائن الآلية الحديثة CNC والمخارط المتقدمة يجمع بين أصالة التراث ودقة المعمار الحديث.',
    'hero.cta.rfq': 'اطلب عرض سعر هندسي ↗',
    'hero.cta.catalog': 'استكشف كتالوج الأحجار',
    'hero.stats.projects': '+500 مشروع منجز',
    'hero.stats.experience': '+25 عاماً من الخبرة',
    'hero.stats.types': '+40 نوع حجر طبيعي',

    // Checkout & Payment
    'checkout.title': 'مركز السداد والمدفوعات الإلكترونية',
    'checkout.subtitle': 'الدفع عبر المحافظ اليمنية والبنوك المعتمدة',
    'checkout.pointPay': 'دفع مشتريات (رقم النقطة)',
    'checkout.walletTransfer': 'تحويل لرقم المشترك / المحفظة',
    'checkout.qrPay': 'مسح رمز QR كود 📱',
    'checkout.uploadReceipt': 'رفع إشعار التحويل',
    'checkout.confirm': 'تأكيد السداد',

    // Profile & Settings
    'profile.title': 'الملف الشخصي والحماية',
    'profile.tab.personal': 'الملف الشخصي والبيانات',
    'profile.tab.security': 'الحماية والأمان وكلمة المرور',
    'profile.tab.preferences': 'التخصيص والمظهر والإشعارات',
    'profile.tab.activity': 'طلباتي وسجل النشاط',
    'profile.save': 'حفظ التعديلات',
    'profile.logout': 'تسجيل الخروج',

    // Common & Actions
    'common.copy': 'نسخ',
    'common.copied': 'تم النسخ!',
    'common.loading': 'جاري التحميل...',
    'common.search': 'بحث...',
    'common.close': 'إغلاق',
    'common.currency': 'العملة',
  },

  en: {
    // Brand & Header
    'brand.name': 'Al-Waheed Stone & Architectural Carving',
    'brand.shortName': 'Al-Waheed Stone',
    'brand.tagline': 'Architectural Carving, CNC Machining & Masonry',
    'brand.location': "Sana'a - Faj Attan",
    'brand.phone': '+967 777 360 681',
    'brand.whatsapp': 'WhatsApp',

    // Navigation
    'nav.home': 'Home',
    'nav.posts': 'Posts & News',
    'nav.products': 'Stones & Catalog',
    'nav.projects': 'Projects',
    'nav.services': 'Services',
    'nav.about': 'About Us',
    'nav.contact': 'Contact Us',
    'nav.rfq': 'Get Quote',
    'nav.track': 'Track RFQ',
    'nav.account': 'My Account',
    'nav.satellite': 'Map',
    'nav.themes': 'Themes',
    'nav.language': 'Language',

    // Hero & Home
    'hero.badge': 'Pioneers in Architectural Stone CNC Carving & Natural Masonry',
    'hero.title': 'Luxury Natural Stone & Timeless CNC Carving Artistry',
    'hero.subtitle': 'Royal Yemeni stone facades, column capitals carved with advanced automated CNC machinery & lathes, combining authentic history with modern architectural precision.',
    'hero.cta.rfq': 'Request Architectural Quote ↗',
    'hero.cta.catalog': 'Explore Stone Catalog',
    'hero.stats.projects': '500+ Completed Projects',
    'hero.stats.experience': '25+ Years Experience',
    'hero.stats.types': '40+ Natural Stone Types',

    // Checkout & Payment
    'checkout.title': 'Electronic Payment & Checkout Hub',
    'checkout.subtitle': 'Pay via Yemeni digital wallets and verified bank accounts',
    'checkout.pointPay': 'Merchant Point Payment (POS)',
    'checkout.walletTransfer': 'Direct Wallet Transfer',
    'checkout.qrPay': 'Scan QR Code 📱',
    'checkout.uploadReceipt': 'Upload Payment Receipt',
    'checkout.confirm': 'Submit & Verify Payment',

    // Profile & Settings
    'profile.title': 'User Profile & Security',
    'profile.tab.personal': 'Personal Data & Profile',
    'profile.tab.security': 'Security, Password & 2FA',
    'profile.tab.preferences': 'Customization & Notifications',
    'profile.tab.activity': 'My RFQs & Orders',
    'profile.save': 'Save Changes',
    'profile.logout': 'Logout',

    // Common & Actions
    'common.copy': 'Copy',
    'common.copied': 'Copied!',
    'common.loading': 'Loading...',
    'common.search': 'Search...',
    'common.close': 'Close',
    'common.currency': 'Currency',
  },

  tr: {
    // Brand & Header
    'brand.name': 'Al-Waheed Mimari Taş ve CNC Oyma Sanatı',
    'brand.shortName': 'Al-Waheed Taş',
    'brand.tagline': 'Mimari CNC Oyma ve Taş İşçiliği',
    'brand.location': "Sana'a - Faj Attan",
    'brand.phone': '+967 777 360 681',
    'brand.whatsapp': 'WhatsApp',

    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.posts': 'Yazılar',
    'nav.products': 'Doğal Taşlar',
    'nav.projects': 'Projeler',
    'nav.services': 'Hizmetler',
    'nav.about': 'Hakkımızda',
    'nav.contact': 'İletişim',
    'nav.rfq': 'Teklif Al',
    'nav.track': 'Teklif Takibi',
    'nav.account': 'Hesabım',
    'nav.satellite': 'Harita',
    'nav.themes': 'Temalar',
    'nav.language': 'Dil',

    // Hero & Home
    'hero.badge': 'Mimari Taş CNC Oymacılığı ve Doğal Taş Duvarcılığında Öncü',
    'hero.title': 'Lüks Doğal Taş ve Zamansız Mimari CNC Oyma Sanatı',
    'hero.subtitle': 'Kraliyet Yemen taş cepheleri, modern CNC makineleri ve torna tezgahlarıyla oyulmuş sütun başlıkları ve tarihi miras ile modern mimari hassasiyetini birleştiren süslemeler.',
    'hero.cta.rfq': 'Mimari Teklif İsteyin ↗',
    'hero.cta.catalog': 'Taş Kataloğunu İncele',
    'hero.stats.projects': '500+ Tamamlanan Proje',
    'hero.stats.experience': '25+ Yıl Deneyim',
    'hero.stats.types': '40+ Doğal Taş Çeşidi',

    // Checkout & Payment
    'checkout.title': 'Elektronik Ödeme ve İşlem Merkezi',
    'checkout.subtitle': 'Yemen dijital cüzdanları ve onaylı banka hesaplarıyla güvenli ödeme',
    'checkout.pointPay': 'Nokta / POS Ödemesi',
    'checkout.walletTransfer': 'Cüzdan Transferi',
    'checkout.qrPay': 'QR Kod Tara 📱',
    'checkout.uploadReceipt': 'Ödeme Dekontu Yükle',
    'checkout.confirm': 'Ödemeyi Onayla',

    // Profile & Settings
    'profile.title': 'Kullanıcı Profili ve Güvenlik',
    'profile.tab.personal': 'Kişisel Bilgiler ve Profil',
    'profile.tab.security': 'Güvenlik ve Şifre',
    'profile.tab.preferences': 'Görünüm ve Bildirimler',
    'profile.tab.activity': 'Taleplerim ve İşlemlerim',
    'profile.save': 'Değişiklikleri Kaydet',
    'profile.logout': 'Çıkış Yap',

    // Common & Actions
    'common.copy': 'Kopyala',
    'common.copied': 'Kopyalandı!',
    'common.loading': 'Yükleniyor...',
    'common.search': 'Ara...',
    'common.close': 'Kapat',
    'common.currency': 'Para Birimi',
  },

  zh: {
    // Brand & Header
    'brand.name': 'Al-Waheed 建筑石材与CNC数控雕刻工坊',
    'brand.shortName': 'Al-Waheed 石材',
    'brand.tagline': '建筑数控雕刻与石雕艺术',
    'brand.location': '也门萨那 - 法吉阿坦 (Faj Attan)',
    'brand.phone': '+967 777 360 681',
    'brand.whatsapp': 'WhatsApp 联系',

    // Navigation
    'nav.home': '首页',
    'nav.posts': '动态资讯',
    'nav.products': '石材与目录',
    'nav.projects': '精品工程',
    'nav.services': '专业服务',
    'nav.about': '关于我们',
    'nav.contact': '联系我们',
    'nav.rfq': '获取报价',
    'nav.track': '查询订单',
    'nav.account': '我的账户',
    'nav.satellite': '卫星地图',
    'nav.themes': '主题设置',
    'nav.language': '语言',

    // Hero & Home
    'hero.badge': '建筑石雕与也门天然石材数控加工领军品牌',
    'hero.title': '尊贵天然石材与永恒建筑数控雕刻艺术',
    'hero.subtitle': '顶级也门石材外墙、现代CNC数控机床与精密车床石雕、罗马柱与柱头，融合千年历史遗产与现代建筑精工。',
    'hero.cta.rfq': '获取工程设计报价 ↗',
    'hero.cta.catalog': '浏览石材样本库',
    'hero.stats.projects': '500+ 已交付工程',
    'hero.stats.experience': '25+ 年行业经验',
    'hero.stats.types': '40+ 种精选天然石材',

    // Checkout & Payment
    'checkout.title': '电子支付与结算中心',
    'checkout.subtitle': '支持也门主流电子钱包与认证银行账户支付',
    'checkout.pointPay': '商户点号 (POS) 支付',
    'checkout.walletTransfer': '电子钱包直转',
    'checkout.qrPay': '扫码支付 📱',
    'checkout.uploadReceipt': '上传付款凭证回单',
    'checkout.confirm': '确认并提交付款',

    // Profile & Settings
    'profile.title': '个人中心与账户安全',
    'profile.tab.personal': '个人资料与联系方式',
    'profile.tab.security': '安全设置与修改密码',
    'profile.tab.preferences': '偏好与通知设置',
    'profile.tab.activity': '我的报价与订单记录',
    'profile.save': '保存修改',
    'profile.logout': '退出登录',

    // Common & Actions
    'common.copy': '复制',
    'common.copied': '已复制!',
    'common.loading': '加载中...',
    'common.search': '搜索...',
    'common.close': '关闭',
    'common.currency': '币种',
  },
};

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  dir: 'rtl' | 'ltr';
  t: (key: string, fallback?: string) => string;
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const I18nContext = createContext<I18nContextType>({
  language: 'ar',
  setLanguage: () => {},
  dir: 'rtl',
  t: (key: string, fallback?: string) => fallback || key,
  languages: LANGUAGES,
  currentLanguageOption: LANGUAGES[0],
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('al_waheed_lang') as LanguageCode;
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLanguageState(saved);
      applyLanguageAttributes(saved);
    } else {
      applyLanguageAttributes('ar');
    }
  }, []);

  const applyLanguageAttributes = (langCode: LanguageCode) => {
    const opt = LANGUAGES.find((l) => l.code === langCode) || LANGUAGES[0];
    document.documentElement.lang = opt.code;
    document.documentElement.dir = opt.dir;
    document.body.dir = opt.dir;
    if (opt.dir === 'rtl') {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  };

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    localStorage.setItem('al_waheed_lang', newLang);
    applyLanguageAttributes(newLang);
  };

  const currentOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const t = (key: string, fallback?: string): string => {
    const dict = DICTIONARY[language] || DICTIONARY['ar'];
    if (dict[key]) return dict[key];
    if (DICTIONARY['ar'][key]) return DICTIONARY['ar'][key];
    return fallback || key;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        dir: currentOption.dir,
        t,
        languages: LANGUAGES,
        currentLanguageOption: currentOption,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
export const useTranslation = () => {
  const { t, language, dir, setLanguage, languages, currentLanguageOption } = useI18n();
  return { t, language, dir, setLanguage, languages, currentLanguageOption };
};
