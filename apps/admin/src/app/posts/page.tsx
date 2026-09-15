'use client';

import React, { useState } from 'react';
import {
  Rss,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Pin,
  Tag,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  FileText,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Post, PostType } from '@al-waheed/types';

const INITIAL_ADMIN_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'عرض خاص: تخفيض 15% على توريد ونحت حجر البيج المأربي للقصور والفلل 🏛️',
    slug: 'special-offer-marib-beige-stone',
    postType: 'OFFER',
    authorName: 'مؤسسة الوحيد للزخرفة المعمارية',
    authorRole: 'الإدارة العامة والمبيعات',
    authorAvatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=200&q=80',
    isVerifiedAuthor: true,
    content: 'يسر مؤسسة الوحيد أن تعلن لعملائنا الكرام في صنعاء عن بدء موسم العروض الحصرية على توريد وقص الحجر البيج المأربي الملكي من مقالع مأرب مباشرة بخصم 15% للواجهات الكبيرة.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    ],
    tags: ['عروض_حصرية', 'حجر_بيج_مأربي', 'واجهات_فلل'],
    likesCount: 42,
    commentsCount: 3,
    isPinned: true,
    isPublished: true,
    hasRfqAction: true,
    rfqActionTitle: 'طلب تسعير لهذا العرض الخاص (خصم 15%)',
    rfqStoneType: 'حجر بيج مأربي (عرض خاص)',
    createdAt: '2026-09-14',
    updatedAt: '2026-09-14',
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
    content: 'يعتبر التباين اللوني في العمارة الحجرية من أهم أسرار الفخامة التي اعتمدها المعماريون عبر التاريخ. نوفر في ورشنا بفج عطان كافة مقاسات حجر الحبش الأسود.',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    ],
    tags: ['مقالات_معمارية', 'حجر_حبش_أسود', 'أسرار_النحت'],
    likesCount: 38,
    commentsCount: 2,
    isPinned: false,
    isPublished: true,
    hasRfqAction: true,
    rfqActionTitle: 'طلب تسعير تصميم مدمج (حبش + بيج)',
    rfqStoneType: 'حجر حبش أسود + بيج مأربي',
    createdAt: '2026-09-13',
    updatedAt: '2026-09-13',
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
    content: 'تم بحمد الله وفضله الانتهاء من تشكيل ونحت 8 تيجان رومانية كورنثية كلاسيكية مع أعمدة حجرية مبرومة بطول 4.5 متر لمدخل قصر سكني فاخر بحدة.',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=85',
    ],
    tags: ['تيجان_رومانية', 'نحت_يدوي', 'مشاريع_صنعاء'],
    likesCount: 56,
    commentsCount: 1,
    isPinned: false,
    isPublished: true,
    hasRfqAction: true,
    rfqActionTitle: 'طلب تفصيل ونحت تيجان وأعمدة ملكية',
    rfqStoneType: 'تيجان وأعمدة منحوتة',
    createdAt: '2026-09-11',
    updatedAt: '2026-09-11',
  },
];

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_ADMIN_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [form, setForm] = useState<{
    title: string;
    postType: PostType;
    authorName: string;
    authorRole: string;
    content: string;
    imageUrls: string;
    videoUrl: string;
    tags: string;
    hasRfqAction: boolean;
    rfqActionTitle: string;
    rfqStoneType: string;
    isPinned: boolean;
    isPublished: boolean;
  }>({
    title: '',
    postType: 'OFFER',
    authorName: 'مؤسسة الوحيد للزخرفة المعمارية',
    authorRole: 'الإدارة العامة والمبيعات',
    content: '',
    imageUrls: '',
    videoUrl: '',
    tags: '',
    hasRfqAction: true,
    rfqActionTitle: 'اطلب تسعير لهذا العرض المباشر',
    rfqStoneType: 'أحجار واجهات طبيعية',
    isPinned: false,
    isPublished: true,
  });

  const handleOpenCreateModal = () => {
    setEditingPostId(null);
    setForm({
      title: '',
      postType: 'OFFER',
      authorName: 'مؤسسة الوحيد للزخرفة المعمارية',
      authorRole: 'الإدارة العامة والمبيعات',
      content: '',
      imageUrls: '',
      videoUrl: '',
      tags: '',
      hasRfqAction: true,
      rfqActionTitle: 'اطلب تسعير لهذا العرض المباشر',
      rfqStoneType: 'أحجار واجهات طبيعية',
      isPinned: false,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: Post) => {
    setEditingPostId(post.id);
    setForm({
      title: post.title,
      postType: post.postType,
      authorName: post.authorName,
      authorRole: post.authorRole,
      content: post.content,
      imageUrls: (post.images || []).join('\n'),
      videoUrl: post.videoUrl || '',
      tags: (post.tags || []).join(', '),
      hasRfqAction: !!post.hasRfqAction,
      rfqActionTitle: post.rfqActionTitle || '',
      rfqStoneType: post.rfqStoneType || '',
      isPinned: !!post.isPinned,
      isPublished: post.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedImages = form.imageUrls
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const parsedTags = form.tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    if (editingPostId) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingPostId
            ? {
                ...p,
                title: form.title,
                postType: form.postType,
                authorName: form.authorName,
                authorRole: form.authorRole,
                content: form.content,
                images: parsedImages,
                videoUrl: form.videoUrl || undefined,
                tags: parsedTags,
                hasRfqAction: form.hasRfqAction,
                rfqActionTitle: form.rfqActionTitle,
                rfqStoneType: form.rfqStoneType,
                isPinned: form.isPinned,
                isPublished: form.isPublished,
                updatedAt: 'الآن',
              }
            : p
        )
      );
      setNotification({ type: 'success', message: 'تم تحديث المنشور بنجاح ✓' });
    } else {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        title: form.title,
        slug: `post-${Date.now()}`,
        postType: form.postType,
        authorName: form.authorName,
        authorRole: form.authorRole,
        isVerifiedAuthor: true,
        content: form.content,
        images: parsedImages,
        videoUrl: form.videoUrl || undefined,
        tags: parsedTags,
        likesCount: 0,
        commentsCount: 0,
        comments: [],
        hasRfqAction: form.hasRfqAction,
        rfqActionTitle: form.rfqActionTitle,
        rfqStoneType: form.rfqStoneType,
        isPinned: form.isPinned,
        isPublished: form.isPublished,
        createdAt: 'الآن',
        updatedAt: 'الآن',
      };
      setPosts([newPost, ...posts]);
      setNotification({ type: 'success', message: 'تم نشر المنشور وظهوره في الموقع بنجاح ✓' });
    }

    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
      setPosts(posts.filter((p) => p.id !== id));
      setNotification({ type: 'success', message: 'تم حذف المنشور بنجاح.' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleTogglePublish = (id: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === id) {
          const nextState = !p.isPublished;
          setNotification({
            type: 'success',
            message: nextState ? 'تم تفعيل نشر المنشور في الموقع' : 'تم إيقاف ظهور المنشور مؤقتاً',
          });
          setTimeout(() => setNotification(null), 3000);
          return { ...p, isPublished: nextState };
        }
        return p;
      })
    );
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
            <Rss className="w-6 h-6 text-gold" />
            <span>إدارة المنشورات والعروض والمقالات</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            نشر وتعديل وتثبيت المقالات الهندسية، العروض الترويجية، وتوثيق مشاريع الواجهات في الموقع العام
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="http://localhost:3000/posts"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4 text-gold" />
            <span>معاينة صفحة المنشورات في الموقع ↗</span>
          </a>

          <button
            onClick={handleOpenCreateModal}
            className="bg-gold hover:bg-gold-dark text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء منشور / عرض جديد</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
            notification.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="البحث في المنشورات والعروض بالعنوان أو الكلمات المفتاحية..."
          className="bg-transparent border-none text-xs text-white placeholder-stone-500 focus:outline-none w-full"
        />
      </div>

      {/* Posts Table */}
      <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-stone-300">
            <thead className="bg-stone-950 text-stone-400 border-b border-stone-800 text-[11px] font-bold uppercase">
              <tr>
                <th className="p-4">المنشور / العنوان</th>
                <th className="p-4">النوع</th>
                <th className="p-4">الناشر</th>
                <th className="p-4">التفاعل</th>
                <th className="p-4">حالة النشر</th>
                <th className="p-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      {post.images && post.images.length > 0 ? (
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-800 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center text-stone-500 shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          {post.isPinned && (
                            <span title="منشور مثبت في الأعلى">
                              <Pin className="w-3.5 h-3.5 text-gold shrink-0 fill-gold" />
                            </span>
                          )}
                          <span className="font-bold text-white block line-clamp-1">{post.title}</span>
                        </div>
                        <span className="text-[10px] text-stone-500 block line-clamp-1 mt-0.5">
                          {post.content}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        post.postType === 'OFFER'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                          : post.postType === 'ARTICLE'
                          ? 'bg-blue-500/15 text-blue-300 border-blue-500/40'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {post.postType === 'OFFER'
                        ? 'عرض 🏷️'
                        : post.postType === 'ARTICLE'
                        ? 'مقال 📜'
                        : 'إنجاز 🏰'}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-medium text-stone-200 block">{post.authorName}</span>
                    <span className="text-[10px] text-stone-500 block">{post.authorRole}</span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3 text-stone-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        <span>{post.likesCount}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-gold" />
                        <span>{post.commentsCount}</span>
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(post.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        post.isPublished
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                          : 'bg-stone-800 text-stone-400 border border-stone-700'
                      }`}
                    >
                      {post.isPublished ? 'منشور نشط ✓' : 'مسودة مخفية'}
                    </button>
                  </td>

                  <td className="p-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(post)}
                        className="p-1.5 bg-stone-800 hover:bg-gold hover:text-stone-950 rounded-lg text-stone-300 transition-colors"
                        title="تعديل المنشور"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 bg-stone-800 hover:bg-rose-900 hover:text-white rounded-lg text-stone-400 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-gold/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl text-stone-100">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <span>{editingPostId ? 'تعديل المنشور أو العرض' : 'إنشاء ونشر بوست / عرض جديد'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-300">عنوان المنشور / العرض *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="مثال: خصم 15% على واجهات الحجر البيج المأربي"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">نوع المنشور *</label>
                  <select
                    value={form.postType}
                    onChange={(e) => setForm({ ...form, postType: e.target.value as PostType })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="OFFER">عرض ترويجي خاص 🏷️</option>
                    <option value="ARTICLE">مقال ومعلومات هندسية 📜</option>
                    <option value="PROJECT_SHOWCASE">توثيق مشروع منجز 🏰</option>
                    <option value="TIP">نصيحة معمارية 💡</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-300">اسم الناشر *</label>
                  <input
                    type="text"
                    required
                    value={form.authorName}
                    onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">محتوى وتفاصيل المنشور *</label>
                <textarea
                  required
                  rows={5}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="اكتب نص المنشور أو تفاصيل العرض والمميزات..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">روابط الصور (رابط في كل سطر)</label>
                <textarea
                  rows={2}
                  value={form.imageUrls}
                  onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white placeholder-stone-500 focus:outline-none focus:border-gold font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">الوسوم والهاشتاجات (مفصولة بفواصل)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="عروض_حصرية, حجر_حبش, واجهات_فلل"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Direct RFQ Trigger Options */}
              <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hasRfqAction}
                    onChange={(e) => setForm({ ...form, hasRfqAction: e.target.checked })}
                    className="w-4 h-4 rounded text-gold focus:ring-gold"
                  />
                  <span className="font-bold text-stone-200">إضافة زر طلب تسعير فوري مباشر (RFQ CTA) أسفل المنشور</span>
                </label>

                {form.hasRfqAction && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-[11px] text-stone-400 block mb-1">نص الزر:</span>
                      <input
                        type="text"
                        value={form.rfqActionTitle}
                        onChange={(e) => setForm({ ...form, rfqActionTitle: e.target.value })}
                        placeholder="طلب تسعير لهذا العرض"
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-400 block mb-1">نوع الحجر المحدد تلقائياً:</span>
                      <input
                        type="text"
                        value={form.rfqStoneType}
                        onChange={(e) => setForm({ ...form, rfqStoneType: e.target.value })}
                        placeholder="حجر بيج مأربي"
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPinned}
                    onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                    className="w-4 h-4 rounded text-gold focus:ring-gold"
                  />
                  <span className="text-stone-300">تثبيت المنشور في أعلى الصفحة 📌</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-gold focus:ring-gold"
                  />
                  <span className="text-stone-300">نشر فوري في الموقع العام ✓</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gold hover:bg-gold-dark text-stone-950 font-bold shadow-md"
                >
                  {editingPostId ? 'حفظ التعديلات' : 'نشر المنشور الآن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
