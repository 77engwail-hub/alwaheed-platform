'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  FileText,
  CheckCircle,
  Clock,
  Tag,
  Send,
  ExternalLink,
  ChevronDown,
  Filter,
  Image as ImageIcon,
  Play,
  Bookmark,
} from 'lucide-react';
import { Post, PostComment, PostType } from '@al-waheed/types';

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'عرض خاص: تخفيض 15% على توريد ونحت حجر البيج المأربي للقصور والفلل 🏛️',
    slug: 'special-offer-marib-beige-stone',
    postType: 'OFFER',
    authorName: 'مؤسسة الوحيد للزخرفة المعمارية',
    authorRole: 'الإدارة العامة والمبيعات',
    authorAvatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=200&q=80',
    isVerifiedAuthor: true,
    content: `يسر مؤسسة الوحيد أن تعلن لعملائنا الكرام في صنعاء وكافة المحافظات عن بدء موسم العروض الحصرية على توريد وقص الحجر البيج المأربي الملكي من مقالع مأرب مباشرة!

🔹 مميزات العرض:
• حجر بيج مأربي صلب مقاوم للرطوبة والعوامل الجوية.
• تشطيبات متعددة: بوشارد ناعم، طبزة، مجلي، وقص منشار دقيق.
• خصم 15% عند التعاقد على واجهات الفلل بمساحة تتجاوز 300 متر مربع.
• فحص ومعاينة مجانية للمخططات الهندسية وجداول الكميات.

سارع بحجز كميتك لمشروعك الآن عبر الرابط أدناه أو التواصل المباشر مع إدارة المبيعات.`,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=85',
    ],
    tags: ['عروض_حصرية', 'حجر_بيج_مأربي', 'واجهات_فلل', 'صنعاء_حده'],
    likesCount: 42,
    commentsCount: 3,
    isPinned: true,
    isPublished: true,
    hasRfqAction: true,
    rfqActionTitle: 'طلب تسعير لهذا العرض الخاص (خصم 15%)',
    rfqStoneType: 'حجر بيج مأربي (عرض خاص)',
    createdAt: 'منذ ساعتين',
    updatedAt: 'منذ ساعتين',
    comments: [
      {
        id: 'c1',
        postId: 'post-1',
        authorName: 'المهندس صادق الحميري',
        authorRole: 'استشاري معماري',
        content: 'ما شاء الله تبارك الله، خامة الحجر البيج المأربي عندكم من أنقى المحاجر وصلابته ممتازة جداً في الواجهات.',
        createdAt: 'منذ ساعة',
      },
      {
        id: 'c2',
        postId: 'post-1',
        authorName: 'أبو محمد اليافعي',
        authorRole: 'عميل',
        content: 'السلام عليكم، هل يشمل العرض التوصيل والتركيب في صنعاء - بيت بوس؟',
        createdAt: 'منذ 45 دقيقة',
      },
      {
        id: 'c3',
        postId: 'post-1',
        authorName: 'مؤسسة الوحيد (الإدارة)',
        authorRole: 'صاحب المنشور',
        content: 'وعليكم السلام أخي الكريم أبو محمد، نعم التوريد يشمل كافة مناطق صنعاء والمحافظات مع خيار التركيب وضمان الجودة.',
        createdAt: 'منذ 30 دقيقة',
      },
    ],
  },
  {
    id: 'post-2',
    title: 'مقال تخصصي: فن دمج حجر الحبش الأسود مع الحجر البيج لإبراز فخامة المداخل الملكية',
    slug: 'habash-black-stone-design-article',
    postType: 'ARTICLE',
    authorName: 'قسم التصميم والنحت المعماري',
    authorRole: 'فريق النحاتين والمهندسين',
    authorAvatar: 'https://images.unsplash.com/photo-1584467741267-b6e0b06869b9?auto=format&fit=crop&w=200&q=80',
    isVerifiedAuthor: true,
    content: `يعتبر التباين اللوني في العمارة الحجرية من أهم أسرار الفخامة التي اعتمدها المعماريون عبر التاريخ.

عند دمج حجر الحبش الأسود البازلتي (في القواعد السفلية والأحزمة الحجرية المحيطة بالأقواس) مع الحجر البيج المأربي في المسطحات العلوية:
1️⃣ يعطي المبنى ثباتاً وهيبة بصرية استثنائية.
2️⃣ يحمي أسفل الواجهة من التآكل والأتربة بفضل مقاومة البازلت العالية.
3️⃣ يبرز تفاصيل النحت في التيجان والكرانيش بدقة متناهية.

نوفر في ورشنا بفج عطان كافة مقاسات حجر الحبش الأسود بقص ليزري متقن وتشكيل ونحت بمكائن CNC والمخارط الحديثة.`,
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    ],
    tags: ['مقالات_معمارية', 'حجر_حبش_أسود', 'أسرار_النحت', 'فخامة_الواجهات'],
    likesCount: 38,
    commentsCount: 2,
    isPinned: false,
    isPublished: true,
    hasRfqAction: true,
    rfqActionTitle: 'طلب تسعير تصميم مدمج (حبش + بيج)',
    rfqStoneType: 'حجر حبش أسود + بيج مأربي',
    createdAt: 'منذ يوم',
    updatedAt: 'منذ يوم',
    comments: [
      {
        id: 'c4',
        postId: 'post-2',
        authorName: 'د. طارق السقاف',
        authorRole: 'مهتم بالعمارة التراثية',
        content: 'مقال قيّم جداً، الدمج بين الحبش والبيج يعطي طابع يماني ملكي أصيل لا يبهت مع الزمن.',
        createdAt: 'منذ 18 ساعة',
      },
      {
        id: 'c5',
        postId: 'post-2',
        authorName: 'المقاول ياسر العريقي',
        authorRole: 'مقاولات عامة',
        content: 'ما هي السماكة الموصى بها لأحجار القواعد البازلتية في المباني المرتفعة؟',
        createdAt: 'منذ 12 ساعة',
      },
    ],
  },
  {
    id: 'post-3',
    title: 'توثيق إنجاز: اكتمال نحت تيجان كورنثية ضخمة وأعمدة مبرومة لقصر سكني بحدة 🏰',
    slug: 'project-showcase-corinthian-columns',
    postType: 'PROJECT_SHOWCASE',
    authorName: 'مؤسسة الوحيد للزخرفة المعمارية',
    authorRole: 'إدارة المشاريع والتنفيذ',
    authorAvatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=200&q=80',
    isVerifiedAuthor: true,
    content: `بحمد الله وفضله، تم الانتهاء من تشكيل ونحت 8 تيجان رومانية كورنثية كلاسيكية مع أعمدة حجرية مبرومة بطول 4.5 متر، لمدخل قصر سكني فاخر في منطقة حده، صنعاء.

تم النحت والتشكيل باستخدام أحدث مكائن النحت الآلية CNC ومخارط الحجر والرخام المتقدمة في ورشنا باستخدام حجر أبيض سيلاني نقي، مع مراعاة أدق تفاصيل الأوراق النباتية الكورنثية المتدرجة بأعلى دقة هندسية.

نستقبل طلبات تشكيل التيجان والأعمدة المخصصة حسب المقاسات والمخططات الهندسية.`,
    images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    ],
    tags: ['تيجان_رومانية', 'نحت_آلي_CNC', 'مخارط_حجرية', 'مشاريع_صنعاء', 'أعمدة_حجرية'],
    likesCount: 56,
    commentsCount: 1,
    isPinned: false,
    isPublished: true,
    hasRfqAction: true,
    rfqActionTitle: 'طلب تفصيل ونحت تيجان وأعمدة ملكية',
    rfqStoneType: 'تيجان وأعمدة منحوتة',
    createdAt: 'منذ 3 أيام',
    updatedAt: 'منذ 3 أيام',
    comments: [
      {
        id: 'c6',
        postId: 'post-3',
        authorName: 'فواز الشميري',
        authorRole: 'عميل',
        content: 'إبداع ودقة تفاصيل تفوق الوصف، سلمت أيادي المعلمين!',
        createdAt: 'منذ يومين',
      },
    ],
  },
];

const POST_TYPES: { key: string; label: string }[] = [
  { key: 'ALL', label: 'كافة المنشورات' },
  { key: 'OFFER', label: 'عروض حصرية 🏷️' },
  { key: 'ARTICLE', label: 'مقالات ونقوش 📜' },
  { key: 'PROJECT_SHOWCASE', label: 'سابقة إنجاز 🏰' },
];

export default function PostsFeedPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, { name: string; text: string }>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const handleToggleLike = (postId: string) => {
    const isCurrentlyLiked = !!likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: !isCurrentlyLiked }));
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likesCount: isCurrentlyLiked ? p.likesCount - 1 : p.likesCount + 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const input = commentInputs[postId];
    if (!input || !input.text.trim()) return;

    const newComment: PostComment = {
      id: `c_${Date.now()}`,
      postId,
      authorName: input.name.trim() || 'زائر الموقع',
      authorRole: 'مشارك',
      content: input.text.trim(),
      createdAt: 'الآن',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...(p.comments || [])],
          };
        }
        return p;
      })
    );

    setCommentInputs((prev) => ({
      ...prev,
      [postId]: { name: '', text: '' },
    }));
  };

  const handleShare = (post: Post) => {
    const shareText = `🏛️ ${post.title}\n\n${post.content.slice(0, 150)}...\n\nمؤسسة الوحيد للزخرفة المعمارية - صنعاء: ${window.location.origin}/posts`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/posts#${postId}`);
    setCopiedPostId(postId);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const filteredPosts =
    selectedFilter === 'ALL'
      ? posts
      : posts.filter((p) => p.postType === selectedFilter);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white p-6 sm:p-8 border border-gold/30 shadow-2xl overflow-hidden space-y-3 text-right">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-bold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-gold animate-spin-slow" />
          <span>منصة المنشورات والمقالات والعروض المعمارية</span>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
          منشورات وأخبار مؤسسة الوحيد 🏛️
        </h1>

        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
          تابع أحدث العروض الحصرية على توريد أحجار البناء، مقالات متخصصة في فن النحت والزخرفة، وتوثيق المشاريع والواجهات الملكية المنفذة في صنعاء ومختلف المحافظات.
        </p>

        {/* Filter Tabs */}
        <div className="pt-1 flex flex-wrap gap-1.5">
          {POST_TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setSelectedFilter(t.key)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                selectedFilter === t.key
                  ? 'bg-gold text-stone-950 shadow-gold-glow scale-105'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed Stream */}
      <div className="space-y-8">
        {filteredPosts.map((post) => {
          const isLiked = !!likedPosts[post.id];
          const isCommentsOpen = activeCommentsPostId === post.id;
          const currentCommentInput = commentInputs[post.id] || { name: '', text: '' };

          return (
            <article
              key={post.id}
              id={post.id}
              className="bg-stone-900/90 rounded-3xl border border-stone-800 shadow-xl overflow-hidden text-stone-100 transition-all duration-300 hover:border-stone-700 space-y-4"
            >
              {/* Post Header (Author Info + Type Tag) */}
              <div className="p-5 sm:p-6 pb-2 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar || 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=200&q=80'}
                    alt={post.authorName}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover border border-gold/40 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-xs sm:text-sm text-white">
                        {post.authorName}
                      </h3>
                      {post.isVerifiedAuthor && (
                        <span title="موثق رسمياً">
                          <CheckCircle className="w-3.5 h-3.5 text-gold fill-gold/20" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-stone-400">
                      <span>{post.authorRole}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>{post.createdAt as string}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Type Badge */}
                <div className="shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      post.postType === 'OFFER'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        : post.postType === 'ARTICLE'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {post.postType === 'OFFER'
                      ? 'عرض حصري 🏷️'
                      : post.postType === 'ARTICLE'
                      ? 'مقال هندسي 📜'
                      : 'مشروع منجز 🏰'}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-5 sm:px-6 space-y-3">
                <h2 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs sm:text-[13px] text-stone-300 leading-relaxed whitespace-pre-line font-normal">
                  {post.content}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] text-gold/80 hover:text-gold bg-stone-950/60 px-2.5 py-1 rounded-lg border border-stone-800 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Image Gallery Grid */}
                {post.images && post.images.length > 0 && (
                  <div
                    className={`grid gap-3 pt-2 rounded-2xl overflow-hidden ${
                      post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                    }`}
                  >
                    {post.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-stone-950 border border-stone-800 group"
                      >
                        <img
                          src={img}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Direct RFQ Action Banner on Post */}
                {post.hasRfqAction && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-gold/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/40 text-gold flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xs text-white block">
                          مهتم بهذا المنشور أو العرض؟
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          اطلب دراسة كميات وتسعير فوري لمخططك الهندسي
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/rfq?preferredStone=${encodeURIComponent(post.rfqStoneType || 'عرض المنشور')}`}
                      className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-gold-glow transition-all"
                    >
                      <span>{post.rfqActionTitle || 'اطلب تسعير لهذا العرض'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Engagement Bar (Likes, Comments, Share, RFQ) */}
              <div className="px-6 py-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                {/* Likes Button */}
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                    isLiked
                      ? 'text-rose-400 bg-rose-950/40 border border-rose-800/60 font-bold'
                      : 'hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 transition-transform ${
                      isLiked ? 'fill-rose-500 scale-125' : ''
                    }`}
                  />
                  <span>{post.likesCount} إعجاب</span>
                </button>

                {/* Comments Toggle */}
                <button
                  onClick={() =>
                    setActiveCommentsPostId(isCommentsOpen ? null : post.id)
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                    isCommentsOpen
                      ? 'text-gold bg-stone-950 border border-gold/40'
                      : 'hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-gold" />
                  <span>{post.commentsCount} تعليق</span>
                </button>

                {/* Share Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-xl hover:bg-emerald-950/40 transition-colors"
                    title="مشاركة عبر واتساب"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">واتساب</span>
                  </button>

                  <button
                    onClick={() => handleCopyLink(post.id)}
                    className="text-[11px] text-stone-400 hover:text-gold px-2.5 py-1.5 rounded-xl hover:bg-stone-800 transition-colors"
                    title="نسخ رابط المنشور"
                  >
                    {copiedPostId === post.id ? 'تم النسخ ✓' : 'نسخ الرابط'}
                  </button>
                </div>
              </div>

              {/* Comments Section Drawer */}
              {isCommentsOpen && (
                <div className="px-6 py-5 bg-stone-950/80 border-t border-stone-800 space-y-4 animate-in fade-in duration-200">
                  {/* Add New Comment Form */}
                  <form
                    onSubmit={(e) => handleAddComment(post.id, e)}
                    className="space-y-3 bg-stone-900 p-4 rounded-2xl border border-stone-800"
                  >
                    <span className="text-xs font-bold text-gold block">أضف تعليقك أو استفسارك:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="اسمك الكريم (اختياري)"
                        value={currentCommentInput.name}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: {
                              ...currentCommentInput,
                              name: e.target.value,
                            },
                          }))
                        }
                        className="text-xs bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white placeholder-stone-500 focus:outline-none focus:border-gold"
                      />
                      <input
                        type="text"
                        required
                        placeholder="اكتب تعليقك هنا..."
                        value={currentCommentInput.text}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: {
                              ...currentCommentInput,
                              text: e.target.value,
                            },
                          }))
                        }
                        className="sm:col-span-2 text-xs bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white placeholder-stone-500 focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!currentCommentInput.text.trim()}
                        className="bg-gold hover:bg-gold-dark disabled:opacity-40 text-stone-950 font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>نشر التعليق</span>
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-3 pt-2">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1 text-right"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <span>{comment.authorName}</span>
                              {comment.authorRole && (
                                <span className="text-[10px] text-gold font-normal px-2 py-0.5 rounded-full bg-gold/10 border border-gold/30">
                                  {comment.authorRole}
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {comment.createdAt as string}
                            </span>
                          </div>
                          <p className="text-xs text-stone-300 leading-relaxed pt-0.5">
                            {comment.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-500 text-center py-2">
                        لا توجد تعليقات بعد. كن أول من يعلّق!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
