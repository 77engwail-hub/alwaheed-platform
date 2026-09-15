'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Globe,
  Layers,
  Compass,
  Maximize2,
  Minimize2,
  Navigation,
  Phone,
  RotateCcw,
  Sparkles,
  Target,
  X,
  ExternalLink,
  MessageSquare,
  MapPin,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface InteractiveSatelliteMapProps {
  initialFullscreen?: boolean;
  onCloseFullscreen?: () => void;
  autoFlyOnMount?: boolean;
}

export const InteractiveSatelliteMap: React.FC<InteractiveSatelliteMapProps> = ({
  initialFullscreen = false,
  onCloseFullscreen,
  autoFlyOnMount = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Exact coordinates for Al-Waheed (Faj Attan - Hadda, Sana'a)
  const targetLat = 15.3189667;
  const targetLng = 44.1804919;
  const googleMapsUrl = 'https://maps.app.goo.gl/Z3fP7feMjhyEeH7J9';

  // State
  const [mapLayer, setMapLayer] = useState<'hybrid' | 'satellite' | 'street'>('hybrid');
  const [isFullscreen, setIsFullscreen] = useState(initialFullscreen);
  const [isFlying, setIsFlying] = useState(false);
  const [altitudeText, setAltitudeText] = useState('10,000 كم (مدار فضائي)');
  const [flyProgress, setFlyProgress] = useState(0);

  // Layer Tile URLs
  const tileUrls = {
    // Google Satellite Hybrid (High-res imagery with roads and labels)
    hybrid: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    // Esri World Imagery (Natural satellite photos)
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    // OpenStreetMap Standard Road Map
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = await import('leaflet');

      if (!isMounted || !mapContainerRef.current) return;

      // Start at Orbit Level (zoom 4) over Arabian Peninsula
      const startZoom = autoFlyOnMount ? 4 : 18;
      const startLat = autoFlyOnMount ? 18.5 : targetLat;
      const startLng = autoFlyOnMount ? 45.0 : targetLng;

      const map = L.map(mapContainerRef.current, {
        center: [startLat, startLng],
        zoom: startZoom,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Add Tile Layer
      const initialTile = L.tileLayer(tileUrls[mapLayer], {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(map);

      tileLayerRef.current = initialTile;

      // Custom Glowing Gold Marker
      const customIcon = L.divIcon({
        className: 'custom-satellite-pin',
        html: `
          <div class="relative flex items-center justify-center -top-6 -left-6">
            <span class="absolute w-14 h-14 rounded-full bg-amber-400/30 animate-ping pointer-events-none"></span>
            <span class="absolute w-9 h-9 rounded-full bg-amber-500/40 animate-pulse pointer-events-none"></span>
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-stone-950 to-stone-900 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([targetLat, targetLng], { icon: customIcon }).addTo(map);
      markerRef.current = marker;

      // Auto-fly if requested
      if (autoFlyOnMount) {
        setTimeout(() => {
          triggerSmoothDescent();
        }, 600);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Layer Change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      if (tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }
      const newLayer = L.tileLayer(tileUrls[mapLayer], {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(mapInstanceRef.current);

      tileLayerRef.current = newLayer;
    });
  }, [mapLayer]);

  // Handle Fullscreen Resize Invalidation
  useEffect(() => {
    if (mapInstanceRef.current) {
      const timer1 = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 100);
      const timer2 = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 300);
      const timer3 = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 600);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isFullscreen]);

  // Native fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNative = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(isNative);
      if (mapInstanceRef.current) {
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150);
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 400);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Listen to custom global trigger
  useEffect(() => {
    const handleTriggerEvent = () => {
      triggerSmoothDescent();
    };
    window.addEventListener('trigger-satellite-zoom', handleTriggerEvent);
    return () => window.removeEventListener('trigger-satellite-zoom', handleTriggerEvent);
  }, [isFlying]);

  // Smooth Continuous Descent from Space to Ground (60fps Leaflet flyTo)
  const triggerSmoothDescent = () => {
    if (!mapInstanceRef.current || isFlying) return;

    setIsFlying(true);
    setFlyProgress(0);

    // 1. Reset map to high altitude orbit view (zoom 4) over region
    mapInstanceRef.current.setView([18.5, 45.0], 4, { animate: false });
    setAltitudeText('🛰️ الارتفاع: 10,000 كم (المدار الفضائي)');

    // 2. Telemetry Altitude Countdown Simulation during flight
    const startTime = Date.now();
    const durationMs = 4500; // 4.5 seconds smooth uninterrupted flight

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      setFlyProgress(Math.round(progress * 100));

      if (progress < 0.25) {
        setAltitudeText('🛰️ الارتفاع: 8,500 كم — الاقتراب من سماء الجزيرة العربية');
      } else if (progress < 0.5) {
        setAltitudeText('🇾🇪 الارتفاع: 850 كم — دخول أجواء الجمهورية اليمنية');
      } else if (progress < 0.75) {
        setAltitudeText('📍 الارتفاع: 45 كم — تحديد العاصمة صنعاء ومنطقة فج عطان');
      } else if (progress < 0.95) {
        setAltitudeText('🔍 الارتفاع: 1,200 م — تثبيت المعارض والورش بدقة 4K');
      } else {
        setAltitudeText('🎯 تم التثبيت: مؤسسة الوحيد للزخرفة المعمارية والنحت');
      }

      if (progress >= 1) {
        clearInterval(interval);
        setIsFlying(false);
      }
    }, 150);

    // 3. Leaflet Native flyTo: Smooth mathematical glide with ease curve
    mapInstanceRef.current.flyTo([targetLat, targetLng], 18, {
      duration: 4.5,
      easeLinearity: 0.2,
      noMoveStart: true,
    });
  };

  const rootContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = async () => {
    const container = rootContainerRef.current;
    if (!isFullscreen) {
      if (container?.requestFullscreen) {
        try {
          await container.requestFullscreen();
          setIsFullscreen(true);
          return;
        } catch (err) {
          console.warn('Native fullscreen request failed, falling back to CSS fixed overlay:', err);
        }
      } else if ((container as any)?.webkitRequestFullscreen) {
        try {
          await (container as any).webkitRequestFullscreen();
          setIsFullscreen(true);
          return;
        } catch (err) {
          console.warn('WebKit fullscreen failed:', err);
        }
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
        try {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen();
          }
        } catch (err) {
          console.warn('Error exiting fullscreen:', err);
        }
      }
      setIsFullscreen(false);
      if (onCloseFullscreen) {
        onCloseFullscreen();
      }
    }
  };

  return (
    <div
      ref={rootContainerRef}
      className={
        isFullscreen
          ? 'fixed inset-0 z-[999999] w-screen h-screen bg-stone-950 flex flex-col overflow-hidden m-0 p-0'
          : 'relative w-full h-full min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] rounded-3xl border border-stone-800 shadow-2xl bg-stone-950 overflow-hidden flex flex-col'
      }
    >
      {/* Prominent Floating Close / Return Button in Fullscreen Mode */}
      {isFullscreen && (
        <button
          type="button"
          onClick={toggleFullscreen}
          className="fixed top-4 left-4 z-[9999999] bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-2xl border-2 border-white/40 transition-all cursor-pointer pointer-events-auto hover:scale-105 active:scale-95 animate-in fade-in zoom-in-95 duration-200"
          title="العودة للوضع السابق (Esc)"
        >
          <X className="w-5 h-5 text-white stroke-[2.5]" />
          <span>العودة للوضع السابق ✕</span>
        </button>
      )}

      {/* Top Floating HUD Bar */}
      <div className="absolute top-3 right-3 left-3 z-[1000] flex items-center justify-between gap-2 pointer-events-none flex-wrap">
        {/* Telemetry Stage & Descent Altitude Badge */}
        <div className="bg-stone-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gold/50 text-gold text-xs font-bold flex items-center gap-2 shadow-2xl pointer-events-auto">
          <Target className={`w-4 h-4 text-gold ${isFlying ? 'animate-spin' : 'animate-pulse'}`} />
          <span>{altitudeText}</span>
          {isFlying && (
            <span className="font-mono text-[11px] bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/40">
              {flyProgress}%
            </span>
          )}
        </div>

        {/* Layer Switcher & Fullscreen Controls */}
        <div className="flex items-center gap-1.5 bg-stone-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-800 shadow-2xl pointer-events-auto">
          <button
            type="button"
            onClick={() => setMapLayer('hybrid')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
              mapLayer === 'hybrid'
                ? 'bg-gold text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            }`}
            title="قمر صناعي + أسماء الشوارع والمعالم"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>هجين HD</span>
          </button>

          <button
            type="button"
            onClick={() => setMapLayer('satellite')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
              mapLayer === 'satellite'
                ? 'bg-gold text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            }`}
            title="صور القمر الصناعي الطبيعية"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>طبيعي</span>
          </button>

          <button
            type="button"
            onClick={() => setMapLayer('street')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
              mapLayer === 'street'
                ? 'bg-gold text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            }`}
            title="خريطة الشوارع"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>شوارع</span>
          </button>

          <div className="w-[1px] h-5 bg-stone-800 mx-1" />

          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 text-xs font-bold ${
              isFullscreen
                ? 'bg-rose-600 hover:bg-rose-500 text-white ring-2 ring-rose-400/50'
                : 'bg-stone-800 hover:bg-stone-700 text-gold hover:text-white'
            }`}
            title={isFullscreen ? 'العودة للوضع السابق (Esc)' : 'تكبير الخريطة ملء الشاشة'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-white" />
                <span className="font-extrabold">العودة للوضع السابق ✕</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-gold" />
                <span className="hidden sm:inline">ملء الشاشة</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0 bg-stone-950 cursor-grab active:cursor-grabbing" />

      {/* Prominent Overlay Identity & Contact Card */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-stone-950/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-gold/40 shadow-2xl max-w-sm text-right space-y-3 pointer-events-auto">
        <div className="space-y-1 border-b border-stone-800/80 pb-2.5">
          <div className="inline-flex items-center gap-1.5 text-gold text-[11px] font-extrabold bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>المقر الرئيسي وورش النحت والمعارض</span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
            مؤسسة الوحيد للزخرفة المعمارية والنحت
          </h3>
          <p className="text-[11px] text-stone-300 leading-relaxed">
            صنعاء — حده - فج عطان جوار شيلان البهلوان
          </p>
        </div>

        {/* Contact Info & Action Buttons */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-stone-900 rounded-xl border border-stone-800">
            <span className="text-stone-400 text-[11px]">هاتف المبيعات والاستفسار:</span>
            <a
              href="tel:+967777360681"
              className="font-mono font-extrabold text-gold text-xs hover:underline flex items-center gap-1"
              dir="ltr"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+967 777 360 681</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="https://wa.me/967777360681?text=السلام%20عليكم،%20أود%20زيارة%20مقر%20مؤسسة%20الوحيد%20في%20فج%20عطان"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>واتساب مباشر</span>
            </a>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold hover:bg-gold-dark text-stone-950 font-extrabold text-[11px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Google Maps ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Left Quick Action: Re-trigger Descent FlyTo */}
      <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={triggerSmoothDescent}
          disabled={isFlying}
          className="bg-stone-900/95 hover:bg-gold text-gold hover:text-stone-950 border border-gold/50 hover:border-gold font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-xl backdrop-blur-md disabled:opacity-50"
        >
          <RotateCcw className={`w-4 h-4 ${isFlying ? 'animate-spin' : ''}`} />
          <span>إعادة حركة الهبوط الانسيابية 🛰️</span>
        </button>
      </div>
    </div>
  );
};
