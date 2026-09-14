'use client';

import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../lib/admin-api';
import { Building, Plus, CheckCircle2, AlertCircle, MapPin, X } from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProject, setNewProject] = useState({
    titleAr: '',
    titleEn: '',
    slug: '',
    projectType: 'VILLA_FACADE',
    locationCity: 'صنعاء، اليمن',
    completionYear: 2025,
    shortDescAr: '',
    fullDescAr: '',
    coverImageUrl: '',
    isFeatured: true,
    isActive: true,
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        adminFetch('/projects?limit=50'),
        adminFetch('/projects/categories'),
      ]);
      setProjects(pRes || []);
      setCategories(cRes || []);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      await adminFetch('/projects/admin', {
        method: 'POST',
        body: JSON.stringify(newProject),
      });

      setFeedback({ type: 'success', message: 'تم إضافة المشروع المعماري بنجاح!' });
      setIsModalOpen(false);
      loadProjects();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">إدارة سابقة الأعمال والمشاريع</h1>
          <p className="text-xs text-stone-500">إضافة وتوثيق الواجهات والمشاريع المنفذة ومعارض الصور</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-stone-900 hover:bg-stone-800 text-gold font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مشروع جديد</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Projects List */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-stone-sm">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-400">جاري تحميل المشاريع...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((prj) => (
              <div
                key={prj.id}
                className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 space-y-3 p-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-stone-200">
                    <img src={prj.coverImageUrl} alt={prj.titleAr} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm leading-snug">{prj.titleAr}</h3>
                  <div className="flex justify-between items-center text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gold-dark" />
                      <span>{prj.locationCity || 'اليمن'}</span>
                    </span>
                    <span className="font-mono">{prj.completionYear} م</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h2 className="text-lg font-bold text-stone-900">إضافة مشروع وسابقة أعمال جديدة</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">عنوان المشروع بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={newProject.titleAr}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        titleAr: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    placeholder="مثال: واجهة قصر السعادة - حده"
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">العنوان بالإنجليزية *</label>
                  <input
                    type="text"
                    required
                    value={newProject.titleEn}
                    onChange={(e) => setNewProject({ ...newProject, titleEn: e.target.value })}
                    placeholder="e.g. Haddah Palace Facade"
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">الموقع / المدينة *</label>
                  <input
                    type="text"
                    required
                    value={newProject.locationCity}
                    onChange={(e) => setNewProject({ ...newProject, locationCity: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">سنة الإنجاز</label>
                  <input
                    type="number"
                    value={newProject.completionYear}
                    onChange={(e) =>
                      setNewProject({ ...newProject, completionYear: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">رابط صورة الغلاف الرئيسية *</label>
                <input
                  type="url"
                  required
                  value={newProject.coverImageUrl}
                  onChange={(e) => setNewProject({ ...newProject, coverImageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 outline-none font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">الوصف المعماري والتفاصيل</label>
                <textarea
                  rows={3}
                  value={newProject.fullDescAr}
                  onChange={(e) => setNewProject({ ...newProject, fullDescAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-stone-800 text-gold font-bold py-3 rounded-xl transition-all"
              >
                حفظ وإضافة المشروع
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
