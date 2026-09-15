'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';

export const SatelliteLocationFloatingButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // If not already on a page with #satellite-map, smooth scroll or dispatch
    const mapElement = document.getElementById('satellite-map');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.dispatchEvent(new CustomEvent('trigger-satellite-zoom'));
    } else {
      // If on another route, navigate to home #satellite-map
      window.location.href = '/#satellite-map';
    }
  };

  return (
    <div className="fixed bottom-24 left-5 z-40 flex items-center">
      {/* Tooltip on Hover */}
      {isHovered && (
        <div className="absolute left-12 whitespace-nowrap bg-stone-950 text-gold text-[10px] font-bold py-1 px-2.5 rounded-lg border border-gold/40 shadow-lg animate-fadeIn pointer-events-none">
          🛰️ موقعنا بالقمر الصناعي
        </div>
      )}

      {/* Small, Sleek & Expressive Floating Satellite Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-stone-900/95 hover:bg-gold text-gold hover:text-stone-950 border border-gold/50 hover:border-gold flex items-center justify-center shadow-lg hover:shadow-gold-glow transition-all duration-300 hover:scale-110 backdrop-blur-md"
        title="عرض الموقع الجغرافي بالقمر الصناعي (مباشر)"
        aria-label="عرض الموقع الجغرافي بالقمر الصناعي"
      >
        {/* Subtle Pulse Ring */}
        <span className="absolute -inset-0.5 rounded-full bg-gold/30 animate-ping pointer-events-none" />

        <Globe className="w-4 h-4 sm:w-5 sm:h-5 animate-spin-slow shrink-0" />
      </button>
    </div>
  );
};
