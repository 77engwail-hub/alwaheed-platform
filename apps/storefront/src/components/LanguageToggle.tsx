'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation, LANGUAGES, LanguageOption } from '../context/I18nContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, currentLanguageOption } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: LanguageOption) => {
    setLanguage(lang.code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-right" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-stone-800/80 hover:bg-stone-800 text-stone-200 hover:text-gold border border-stone-700/60 transition-all shadow-sm group"
        title="تغيير اللغة / Change Language"
        aria-label="تغيير اللغة"
      >
        <span className="text-sm">{currentLanguageOption.flag}</span>
        <span className="hidden sm:inline font-sans text-[11px] font-bold">
          {currentLanguageOption.nameNative}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone-400 group-hover:text-gold transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:right-auto sm:left-0 mt-2 w-44 rounded-2xl bg-stone-900 border border-gold/40 shadow-2xl z-50 p-1.5 animate-in fade-in zoom-in-95 text-xs">
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-stone-400 border-b border-stone-800 mb-1 flex items-center justify-between">
            <span>اختر اللغة / Language</span>
            <Globe className="w-3 h-3 text-gold" />
          </div>

          <div className="space-y-0.5">
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-right font-medium transition-all ${
                    isSelected
                      ? 'bg-gold/20 text-gold font-bold border border-gold/40'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <div>
                      <span className="block font-bold text-xs">{lang.nameNative}</span>
                      <span className="block text-[9px] text-stone-400 font-mono">{lang.nameEn}</span>
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
  );
};
