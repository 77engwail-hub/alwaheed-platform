import React from 'react';
import { fetchApi } from '../../lib/api-client';
import { ProjectCard } from '../../components/ProjectCard';
import Link from 'next/link';
import { Sparkles, Building, MapPin, Layers } from 'lucide-react';

interface ProjectsPageProps {
  searchParams: {
    category?: string;
    type?: string;
    search?: string;
  };
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  let projects: any[] = [];
  let categories: any[] = [];

  try {
    const [prjRes, catRes] = await Promise.all([
      fetchApi('/projects?limit=24'),
      fetchApi('/projects/categories'),
    ]);
    projects = prjRes.items || prjRes || [];
    categories = catRes || [];
  } catch (e) {
    console.error('Failed to fetch projects portfolio:', e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-stone-md text-center max-w-4xl mx-auto space-y-4">
        <span className="text-xs font-bold text-gold tracking-widest uppercase inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>معرض الأعمال والمشاريع المنفذة</span>
        </span>
        <h1 className="text-2xl sm:text-5xl font-extrabold text-white leading-tight">
          صروح معمارية تروي قصة الإتقان الحجري
        </h1>
        <p className="text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
          استكشف مجموعة من أبرز مشاريع الواجهات الحجرية للفلل والقصور، المداخل الملكية، والتيجان المنحوتة التي أشرفت مؤسسة الوحيد على تشكيلها وتنفيذها في صنعاء وعموم اليمن.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
