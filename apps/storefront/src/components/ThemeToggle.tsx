'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { Palette, Check, ChevronDown, Sliders, Type } from 'lucide-react';
import { AppearanceSettingsDrawer } from './AppearanceSettingsDrawer';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 hover:border-gold/60 text-xs transition-all duration-200 shadow-sm"
          title="تغيير الثيم وتخصيص المظهر"
          aria-label="تغيير الثيم وتخصيص المظهر"
        >
          <span className="text-sm">{currentTheme.icon}</span>
          <span className="hidden md:inline font-bold text-[11px]">الثيمات</span>
          <ChevronDown className="w-3 h-3 text-gold transition-transform duration-200" />
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-stone-950 border border-gold/30 shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            <div className="px-3 py-1.5 text-[11px] font-bold text-gold border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>الثيمات المعمارية</span>
              </div>
              <span className="text-[10px] text-stone-400 font-normal">6 ألوان فاخرة</span>
            </div>

            {THEMES.map((t) => {
              const isSelected = t.id === theme;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-right transition-all text-xs ${
                    isSelected
                      ? 'bg-gold/15 text-gold border border-gold/40 font-bold'
                      : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-lg border border-stone-700 flex items-center justify-center text-xs shrink-0"
                      style={{ backgroundColor: t.previewColor }}
                    >
                      {t.icon}
                    </div>
                    <div>
                      <span className="block font-medium text-xs">{t.nameAr}</span>
                      <span className="text-[9px] text-stone-400 block">{t.desc}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-gold shrink-0" />}
                </button>
              );
            })}

            {/* Link to Full Appearance Customizer */}
            <div className="pt-2 border-t border-stone-800">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsDrawerOpen(true);
                }}
                className="w-full bg-gold/10 hover:bg-gold text-gold hover:text-stone-950 font-bold text-xs p-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-gold/30"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>التحكم بالخطوط وحجمها والمظهر ⚙️</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full Customizer Drawer */}
      <AppearanceSettingsDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};
