'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Navigation,
  Globe,
  X,
  Phone,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

const InteractiveSatelliteMap = dynamic(
  () =>
    import('./InteractiveSatelliteMap').then((mod) => mod.InteractiveSatelliteMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-stone-950 flex flex-col items-center justify-center space-y-3 rounded-3xl text-gold">
        <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        <p className="text-xs text-stone-400 font-mono">جاري تحميل خريطة القمر الصناعي...</p>
      </div>
    ),
  }
);

interface SatelliteMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SatelliteMapModal: React.FC<SatelliteMapModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border-gold/40">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/40 text-gold flex items-center justify-center shadow-gold-glow animate-pulse">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>الموقع الجغرافي الدقيق بالقمر الصناعي</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40">
                  انسيابي دقيق 4K
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                مؤسسة الوحيد للزخرفة المعمارية والنحت — صنعاء، حده - فج عطان (هاتف: 777360681)
              </p>
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

        {/* Map View Frame */}
        <div className="relative flex-1 min-h-[420px] sm:min-h-[500px] bg-stone-950">
          <InteractiveSatelliteMap autoFlyOnMount={true} />
        </div>
      </div>
    </div>
  );
};
