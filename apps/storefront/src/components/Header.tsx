'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  MessageSquare,
  FileText,
  Menu,
  X,
  Sparkles,
  User,
  Rss,
  Globe,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useTranslation } from '../context/I18nContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const handleNavigateToSatellite = () => {
    const mapElement = document.getElementById('satellite-map');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.dispatchEvent(new CustomEvent('trigger-satellite-zoom'));
    } else {
      window.location.href = '/#satellite-map';
    }
  };

  const navLinks = [
    { href: '/', label: t('nav.home', 'الرئيسية') },
    { href: '/posts', label: t('nav.posts', 'المنشورات'), icon: Rss },
    { href: '/products', label: t('nav.products', 'الأحجار') },
    { href: '/projects', label: t('nav.projects', 'المشاريع') },
    { href: '/services', label: t('nav.services', 'الخدمات') },
    { href: '/about', label: t('nav.about', 'من نحن') },
    { href: '/contact', label: t('nav.contact', 'اتصل بنا') },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all duration-200">
      {/* Top Contact Bar */}
      <div className="bg-stone-950/80 px-4 py-1 text-xs text-stone-300 border-b border-stone-800/60">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-gold font-bold">مؤسسة الوحيد للزخرفة والأحجار</span>
            <span className="hidden sm:inline text-stone-500">|</span>
            <span className="hidden sm:inline text-stone-400">صنعاء - فج عطان</span>
            <button
              onClick={handleNavigateToSatellite}
              className="inline-flex items-center gap-1 text-[11px] text-gold hover:text-white bg-gold/10 hover:bg-gold/20 px-2.5 py-0.5 rounded-full border border-gold/30 transition-all cursor-pointer mr-1.5"
              title="عرض الموقع بالقمر الصناعي"
            >
              <Globe className="w-3 h-3 text-gold" />
              <span>🛰️ الخريطة</span>
            </button>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="tel:+967777360681"
              className="flex items-center gap-1 hover:text-gold transition-colors font-mono text-xs"
              dir="ltr"
            >
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>+967 777 360 681</span>
            </a>
            <a
              href="https://wa.me/967777360681"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors text-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo (Far Right in RTL) */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-stone-950 border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-stone-100 block group-hover:text-gold transition-colors leading-tight">
                الوحيد للزخرفة
              </span>
              <span className="text-[10px] text-stone-400 font-medium block">
                للنحت والمعمار
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Tabs - Strictly Single Line & Persistent Active Route Indicator */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-nowrap whitespace-nowrap">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-[13px] font-bold transition-all duration-200 ${
                    active
                      ? 'bg-gold/15 text-gold border border-gold/40 shadow-sm font-extrabold ring-1 ring-gold/25'
                      : 'text-stone-300 hover:text-gold hover:bg-stone-800/60 border border-transparent'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${active ? 'text-gold' : 'text-stone-400'}`} />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs & Language/Theme Toggles (Far Left in RTL) */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/rfq"
              className="bg-gold hover:bg-gold-dark text-stone-950 font-extrabold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md hover:shadow-gold-glow transition-all whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('nav.rfq', 'طلب تسعير')}</span>
            </Link>
            <Link
              href="/rfq/track"
              className="text-xs text-stone-300 hover:text-gold flex items-center gap-1 py-1.5 px-2.5 rounded-md hover:bg-stone-800/80 transition-all border border-stone-700/60 whitespace-nowrap"
            >
              <span>{t('nav.track', 'التتبع')}</span>
            </Link>
            <Link
              href="/profile"
              className="text-xs text-stone-300 hover:text-gold flex items-center gap-1 py-1.5 px-2.5 rounded-lg hover:bg-stone-800/80 transition-all border border-stone-700/60 whitespace-nowrap"
              title="دخول حساب العميل"
            >
              <User className="w-3.5 h-3.5 text-gold" />
              <span>{t('nav.account', 'حسابي')}</span>
            </Link>
            <button
              onClick={handleNavigateToSatellite}
              className="text-xs text-gold hover:text-stone-950 bg-stone-800/80 hover:bg-gold flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg transition-all border border-gold/40 shadow-sm whitespace-nowrap"
              title="عرض الموقع بالقمر الصناعي"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{t('nav.satellite', 'الموقع')}</span>
            </button>
            <div className="shrink-0">
              <LanguageToggle />
            </div>
            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile buttons (Language & Theme on far-left) */}
          <div className="lg:hidden flex items-center gap-1.5">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-300 hover:text-white hover:bg-stone-800"
              aria-label="قائمة التصفح"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              onClick={handleNavigateToSatellite}
              className="p-2 rounded-md text-gold hover:text-white hover:bg-stone-800"
              title="خريطة القمر الصناعي"
            >
              <Globe className="w-5 h-5" />
            </button>
            <div className="shrink-0">
              <LanguageToggle />
            </div>
            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
                  active
                    ? 'bg-gold/15 text-gold border-gold/40 font-extrabold'
                    : 'text-stone-200 hover:text-gold border-stone-800/60 hover:bg-stone-800/40'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleNavigateToSatellite();
            }}
            className="w-full text-right py-2 px-3 text-gold font-bold border border-gold/20 bg-gold/5 rounded-xl flex items-center gap-2 text-xs"
          >
            <Globe className="w-4 h-4" />
            <span>{t('nav.satellite', 'الموقع بالقمر الصناعي')}</span>
          </button>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/rfq"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-gold text-stone-950 font-extrabold text-center py-2.5 rounded-lg text-xs"
            >
              {t('nav.rfq', 'طلب تسعير')}
            </Link>
            <Link
              href="/rfq/track"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-stone-800 text-stone-200 text-center py-2 rounded-lg border border-stone-700 text-xs"
            >
              {t('nav.track', 'تتبع الطلب')}
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-stone-800 text-gold text-center py-2 rounded-lg border border-stone-700 text-xs flex items-center justify-center gap-1.5 font-bold"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('nav.account', 'حسابي والملف الشخصي')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

