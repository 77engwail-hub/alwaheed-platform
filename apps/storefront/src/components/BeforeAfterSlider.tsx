'use client';

import React, { useState } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'قبل التكسية والنحت',
  afterLabel = 'بعد الإنجاز والتشطيب الحجري',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className={`relative w-full aspect-[16/10] overflow-hidden rounded-2xl select-none shadow-stone-lg ${className}`}>
      {/* After Image (Full background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <span className="absolute top-4 left-4 bg-emerald-700/90 backdrop-blur-md text-white text-xs px-3 py-1 rounded-md font-bold shadow-md z-10">
        {afterLabel}
      </span>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
          style={{ width: '100%', height: '100%' }}
        />
        <span className="absolute top-4 right-4 bg-stone-900/90 backdrop-blur-md text-stone-200 text-xs px-3 py-1 rounded-md font-bold shadow-md z-10">
          {beforeLabel}
        </span>
      </div>

      {/* Divider Bar & Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-gold cursor-ew-resize z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-stone-950 border-2 border-gold shadow-gold-glow flex items-center justify-center text-gold text-xs font-bold">
          ⇄
        </div>
      </div>

      {/* Hidden Range Input */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderMove}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        aria-label="مقارنة قبل وبعد"
      />
    </div>
  );
};
