'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Phone,
  FileText,
  MapPin,
  ExternalLink,
  ChevronLeft,
  RotateCcw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  cta?: {
    type: 'rfq' | 'whatsapp' | 'location' | 'products';
    label: string;
    url: string;
  };
}

const QUICK_SUGGESTIONS = [
  'ما هو أفضل حجر للواجهات الملكية؟',
  'ما الفرق بين حجر الحبش والحجر البيج المأربي؟',
  'كيف أطلب دراسة كميات وعرض سعر (RFQ) لمخططي؟',
  'أين موقع معرض وورش المؤسسة في صنعاء؟',
  'ما هي أنواع القصات والتشطيبات المتوفرة؟',
];

export const StoneConsultantChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'مرحباً بك في مؤسسة الوحيد للزخرفة المعمارية ونحت الأحجار! 🏛️\nأنا «مستشارك المعماري الذكي»، كيف يمكنني مساعدتك اليوم في اختيار أحجار مشروعك أو دراسة المخططات؟',
      timestamp: 'الآن',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // AI Consultant Knowledge Matching Engine
    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse: ChatMessage;

      if (lower.includes('بيج') || lower.includes('مأرب') || lower.includes('مأربي')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'الحجر البيج المأربي هو الخيار الملكي الأول للواجهات والقصور في اليمن! 👑\nيتميز بصلابته الفائقة ومقاومته للرطوبة والعوامل الجوية ولونه الرملي الدافئ.\nيتوفر لدينا بتشطيبات: (بوشارد ناعم، طبزة يدوية، مجلي، وقص منشار).',
          timestamp: 'الآن',
          cta: {
            type: 'rfq',
            label: 'طلب تسعير للحجر البيج المأربي',
            url: '/rfq?preferredStone=حجر%20بيج%20مأربي',
          },
        };
      } else if (lower.includes('حبش') || lower.includes('اسود') || lower.includes('أسود') || lower.includes('بركاني')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'حجر الحبش الأسود هو صخر بازلتي بركاني طبيعي شديد الكثافة والصلابة (كثافة 2.90 جم/سم³).\nيُستخدم بشكل رائع في القواعد السفلية للواجهات، الأحزمة الزخرفية، وإطارات المداخل لمنح تباين معماري فاخر عند دمجه مع الحجر البيج.',
          timestamp: 'الآن',
          cta: {
            type: 'rfq',
            label: 'طلب تسعير حجر حبش أسود',
            url: '/rfq?preferredStone=حجر%20حبش%20أسود',
          },
        };
      } else if (lower.includes('موقع') || lower.includes('عنوان') || lower.includes('خريطة') || lower.includes('وين') || lower.includes('فين') || lower.includes('صنعاء')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'مقرنا الرئيسي ومعارضنا وورش النحت تقع في:\n📍 صنعاء - حده - فج عطان، بالقرب من المعالم الرئيسية.\nنستقبلكم من السبت إلى الخميس: 8:00 صباحاً حتى 8:00 مساءً.',
          timestamp: 'الآن',
          cta: {
            type: 'location',
            label: 'فتح الموقع في Google Maps ↗',
            url: 'https://maps.app.goo.gl/Z3fP7feMjhyEeH7J9',
          },
        };
      } else if (lower.includes('سعر') || lower.includes('تكلفة') || lower.includes('تسعير') || lower.includes('متر') || lower.includes('مخطط') || lower.includes('rfq')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'نقدم دراسة هندسية دقيقة للمخططات وجداول الكميات مجاناً! 📐\nتختلف الأسعار حسب نوع الحجر (حبش/بيج/سيلاني)، وسماكة القص ونوع النقش.\nيمكنك رفع مخططك مباشرة وسنقوم بتسعيره خلال 24 ساعة.',
          timestamp: 'الآن',
          cta: {
            type: 'rfq',
            label: 'رفع مخططك وطلب تسعير مجاني (RFQ)',
            url: '/rfq',
          },
        };
      } else if (lower.includes('نحت') || lower.includes('تاج') || lower.includes('تيجان') || lower.includes('عمود') || lower.includes('أعمدة') || lower.includes('قوس') || lower.includes('مشربية')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'نفتخر بفريق من أمهر معلمي النحت اليدوي والقص الآلي المتقدم 🏛️\nنقوم بنحت التيجان الكورنثية والإسلامية، الأعمدة المبرومة والمضلعة، المشربيات المفرغة، وإطارات الشبابيك المقوسة بأعلى درجات الدقة.',
          timestamp: 'الآن',
          cta: {
            type: 'products',
            label: 'استعراض كتالوج التيجان والنقوش',
            url: '/products?category=columns-capitals',
          },
        };
      } else if (lower.includes('واتساب') || lower.includes('رقم') || lower.includes('تواصل') || lower.includes('هاتف') || lower.includes('اتصال')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'يسعدنا تواصلك المباشر مع إدارة المبيعات والمهندسين:\n📞 هاتف: +967 777 360 681\n💬 واتساب متاح على مدار الساعة لاستقبال استفساراتك ومخططاتك.',
          timestamp: 'الآن',
          cta: {
            type: 'whatsapp',
            label: 'محادثة عبر واتساب الآن',
            url: 'https://wa.me/967777360681?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20أعمال%20الحجر%20والمقاولات',
          },
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'شكراً لاستفسارك! نحن متخصصون في توريد ونحت وزخرفة أحجار البناء (حبش، بيج مأربي، سيلاني، ورخام) وتنفيذ واجهات الفلل والقصور.\nيمكنك طلب تسعير فوري لمخططك أو التحدث مع مهندس المبيعات مباشرة عبر واتساب.',
          timestamp: 'الآن',
          cta: {
            type: 'whatsapp',
            label: 'تحدث مع المهندس عبر واتساب',
            url: 'https://wa.me/967777360681',
          },
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: 'مرحباً بك مجدداً! كيف يمكنني مساعدتك في مشروعك الحجري؟ 🏛️',
        timestamp: 'الآن',
      },
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
          <div className="hidden sm:block bg-stone-900 text-stone-100 text-xs px-3.5 py-2 rounded-2xl border border-gold/40 shadow-xl backdrop-blur-md animate-bounce">
            <span className="text-gold font-bold">مستشار الوحيد الذكي 🤖</span>
            <span className="block text-[10px] text-stone-400">انقر لاستشارة فورية عن الحجر</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-gold-dark via-gold to-gold-light text-stone-950 flex items-center justify-center shadow-gold-glow hover:scale-110 active:scale-95 transition-all duration-300 relative group"
            aria-label="فتح المستشار المعماري الذكي"
          >
            <Bot className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-stone-900" />
          </button>
        </div>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 w-[calc(100vw-32px)] sm:w-[400px] h-[580px] max-h-[85vh] bg-stone-950 rounded-3xl border border-gold/40 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/20 border border-gold/50 flex items-center justify-center text-gold shadow-gold-glow">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>مستشار الوحيد الذكي</span>
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>متصل - استشارات معمارية وتوريد</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                title="إعادة بدء المحادثة"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-950/95 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 text-gold flex items-center justify-center text-xs shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 shadow ${
                    msg.sender === 'user'
                      ? 'bg-gold text-stone-950 font-medium rounded-br-none'
                      : 'bg-stone-900 text-stone-200 border border-stone-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* CTA Action Button inside Bot Message */}
                  {msg.cta && (
                    <div className="pt-2">
                      {msg.cta.url.startsWith('http') ? (
                        <a
                          href={msg.cta.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-stone-950/80 hover:bg-stone-950 text-gold border border-gold/40 font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-[11px]"
                        >
                          <span>{msg.cta.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link
                          href={msg.cta.url}
                          onClick={() => setIsOpen(false)}
                          className="w-full bg-stone-950/80 hover:bg-stone-950 text-gold border border-gold/40 font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-[11px]"
                        >
                          <span>{msg.cta.label}</span>
                          <ChevronLeft className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] pt-0.5 text-right ${
                      msg.sender === 'user' ? 'text-stone-800' : 'text-stone-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-stone-800 border border-stone-700 text-stone-300 flex items-center justify-center text-xs shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-stone-400 text-xs py-1">
                <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 text-gold flex items-center justify-center text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-stone-900 rounded-2xl rounded-bl-none border border-stone-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce delay-300" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-stone-900/80 border-t border-stone-800/80 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {QUICK_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                className="px-2.5 py-1 rounded-full bg-stone-950 border border-stone-700 hover:border-gold/60 text-stone-300 hover:text-gold text-[10px] transition-all shrink-0"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-stone-900 border-t border-stone-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="اكتب سؤالك عن الحجر أو التسعير..."
              className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl bg-gold hover:bg-gold-dark disabled:opacity-40 text-stone-950 font-bold transition-all shadow-md"
              aria-label="إرسال"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
