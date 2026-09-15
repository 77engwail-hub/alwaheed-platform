'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Award, Gem, Users, Sparkles, ShieldCheck } from 'lucide-react';

const STATS = [
  {
    id: 1,
    target: 500,
    prefix: '+',
    suffix: '',
    label: 'واجهة وقصر تم تنفيذها',
    desc: 'صروح معمارية فاخرة في صنعاء وكافة المحافظات',
    icon: <Building2 className="w-6 h-6 text-gold" />,
  },
  {
    id: 2,
    target: 25,
    prefix: '+',
    suffix: ' عاماً',
    label: 'خبرة متوارثة في فن النحت',
    desc: 'أصالة وحرفية هندسية بأيدي أمهر النحاتين والمعلمين',
    icon: <Award className="w-6 h-6 text-gold" />,
  },
  {
    id: 3,
    target: 20,
    prefix: '+',
    suffix: ' صنفاً',
    label: 'أصناف وتشكيلات أحجار طبيعية',
    desc: 'حبش، بيج مأربي، سيلاني، ورخام وجرانيت طبيعي',
    icon: <Gem className="w-6 h-6 text-gold" />,
  },
  {
    id: 4,
    target: 100,
    prefix: '%',
    suffix: '',
    label: 'دقة واحترافية في التركيب',
    desc: 'مطابقة تامة للمخططات الهندسية وجداول الكميات',
    icon: <ShieldCheck className="w-6 h-6 text-gold" />,
  },
];

export const AnimatedStatistics: React.FC = () => {
  const [counts, setCounts] = useState<number[]>(STATS.map(() => 0));

  useEffect(() => {
    const duration = 2000;
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts(
        STATS.map((s) => Math.min(s.target, Math.floor(s.target * progress)))
      );
      if (step >= steps) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-10 sm:py-12 bg-stone-950 border-y border-stone-800 text-stone-100 relative overflow-hidden">
      {/* Subtle Pattern Grid */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, idx) => (
            <div
              key={stat.id}
              className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800/80 hover:border-gold/40 transition-all duration-300 shadow-md group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {stat.icon}
                </div>
                <Sparkles className="w-3.5 h-3.5 text-gold/30 group-hover:text-gold transition-colors" />
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-1">
                  <span>{stat.prefix}</span>
                  <span>{counts[idx]}</span>
                  <span className="text-sm text-gold font-bold font-arabic">{stat.suffix}</span>
                </div>
                <h3 className="text-xs sm:text-[13px] font-bold text-stone-100 mt-1">{stat.label}</h3>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
