'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  MessageSquare,
  FileText,
  Search,
  Menu,
  X,
  Compass,
  Layers,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all duration-200">
      {/* Top Bar for Verified Contact */}
      <div className="bg-stone-950/80 px-4 py-1.5 text-xs text-stone-300 border-b border-stone-800/60">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gold">
              <Compass className="w-3.5 h-3.5" />
              <span>صنعاء: حده - فج عطان | ورش التشكيل والنحت والمعارض</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+967770663641"
              className="flex items-center gap-1 hover:text-gold transition-colors font-mono"
              dir="ltr"
            >
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>+967 770663641</span>
            </a>
            <a
              href="https://wa.me/967770663641"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>واتساب المبيعات</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-lg bg-stone-800 border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow group-hover:border-gold transition-all">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-100 group-hover:text-gold transition-colors">
                الوحيد للزخرفة المعمارية
              </span>
              <span className="text-xs text-gold/80 font-medium tracking-wide">
                نحت الأحجار الطبيعية والرخام والمقاولات
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-200">
            <Link href="/" className="hover:text-gold transition-colors">
              الرئيسية
            </Link>
            <Link href="/products" className="hover:text-gold transition-colors">
              أحجار البناء والمنتجات
            </Link>
            <Link href="/projects" className="hover:text-gold transition-colors">
              المشاريع والأعمال
            </Link>
            <Link href="/services" className="hover:text-gold transition-colors">
              خدماتنا
            </Link>
            <Link href="/about" className="hover:text-gold transition-colors">
              عن المؤسسة
            </Link>
            <Link href="/contact" className="hover:text-gold transition-colors">
              تواصل معنا
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/rfq/track"
              className="text-xs text-stone-300 hover:text-gold flex items-center gap-1 py-2 px-3 rounded-md hover:bg-stone-800/80 transition-all border border-stone-700/60"
            >
              <span>تتبع طلب السعر</span>
            </Link>
            <Link
              href="/rfq"
              className="bg-gold hover:bg-gold-dark text-stone-950 font-bold text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:shadow-gold-glow transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>اطلب عرض سعر</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-300 hover:text-white hover:bg-stone-800"
              aria-label="قائمة التصفح"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-200 hover:text-gold border-b border-stone-800/60"
          >
            الرئيسية
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-200 hover:text-gold border-b border-stone-800/60"
          >
            أحجار البناء والمنتجات
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-200 hover:text-gold border-b border-stone-800/60"
          >
            المشاريع والأعمال
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-200 hover:text-gold border-b border-stone-800/60"
          >
            خدماتنا
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-200 hover:text-gold border-b border-stone-800/60"
          >
            عن المؤسسة
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-200 hover:text-gold border-b border-stone-800/60"
          >
            تواصل معنا
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/rfq"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-gold text-stone-950 font-bold text-center py-2.5 rounded-lg"
            >
              اطلب عرض سعر لمشروعك
            </Link>
            <Link
              href="/rfq/track"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-stone-800 text-stone-200 text-center py-2 rounded-lg border border-stone-700 text-xs"
            >
              تتبع حالة عرض السعر
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
