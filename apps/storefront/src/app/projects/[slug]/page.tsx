import React from 'react';
import { notFound } from 'next/navigation';
import { fetchApi } from '../../../lib/api-client';
import { buildWhatsAppInquiryUrl } from '@al-waheed/ui';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Layers,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ProjectDetailPageProps {
  params: { slug: string };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  let project: any = null;

  try {
    project = await fetchApi(`/projects/${params.slug}`);
  } catch (e) {
    console.error('Failed to load project:', e);
    notFound();
  }

  if (!project) notFound();

  const whatsAppUrl = buildWhatsAppInquiryUrl({
    phone: '967770663641',
    projectTitle: project.titleAr,
    url: `http://localhost:3000/projects/${project.slug}`,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/projects" className="hover:text-stone-900">
          المشاريع والأعمال
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-bold line-clamp-1">{project.titleAr}</span>
      </nav>

      {/* Project Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-950 text-white min-h-[400px] flex items-end p-8 sm:p-12 border border-stone-800 shadow-stone-lg">
        <img
          src={project.coverImageUrl}
          alt={project.titleAr}
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {project.locationCity && (
              <span className="bg-stone-900/90 text-stone-200 text-xs px-3 py-1 rounded-md border border-stone-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span>{project.locationCity}</span>
              </span>
            )}
            {project.completionYear && (
              <span className="bg-stone-900/90 text-gold text-xs px-3 py-1 rounded-md border border-gold/40 font-mono">
                إنجاز عام {project.completionYear} م
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            {project.titleAr}
          </h1>

          <p className="text-sm text-stone-300 leading-relaxed max-w-2xl">
            {project.fullDescAr || project.shortDescAr}
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      {project.images && project.images.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-stone-900 border-r-4 border-gold pr-3">
            معرض صور وتفاصيل المشروع
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.images.map((img: any, idx: number) => (
              <div
                key={idx}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-stone-sm"
              >
                <img
                  src={img.url}
                  alt={img.captionAr || project.titleAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {img.captionAr && (
                  <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 backdrop-blur-sm text-stone-200 p-3 text-xs">
                    {img.captionAr}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materials and Engineering Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-stone-200/80 shadow-stone-sm space-y-6">
          <h2 className="text-lg font-bold text-stone-900 border-r-4 border-gold pr-3">
            المواصفات ومواد البناء المنفذة
          </h2>

          <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
            <p>
              تم تنفيذ هذا المشروع المعماري وفق أعلى المعايير الهندسية والحرفية، بدءاً من دراسة المخططات المعمارية، قص وتشكيل الكتل الحجرية في ورش مؤسسة الوحيد، ونحت التيجان والأقواس بدقة متناهية، وصولاً إلى التثبيت والتسليم النهائي.
            </p>

            {project.materialsUsed && project.materialsUsed.length > 0 && (
              <div className="pt-3">
                <span className="text-xs font-bold text-stone-500 block mb-2">الأحجار المعتمدة في المشروع:</span>
                <div className="flex flex-wrap gap-2">
                  {project.materialsUsed.map((m: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-stone-100 text-stone-800 rounded-lg text-xs font-bold border border-stone-200 flex items-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-gold-dark" />
                      <span>{m.nameAr || m}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Sidebar */}
        <div className="lg:col-span-4 bg-stone-900 text-white rounded-3xl p-8 border border-stone-800 shadow-stone-md space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold text-gold tracking-widest uppercase block">
              ترغب في تنفيذ عمل مماثل؟
            </span>
            <h3 className="text-lg font-bold text-white leading-snug">
              اطلب دراسة وتكلفة تقديرية لواجهتك المعمارية
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              فريقنا الهندسي مستعد لمراجعة مخططاتك وتزويدك بجدول كميات وعرض سعر تفصيلي.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href={`/rfq?projectType=${project.projectType}&notes=${encodeURIComponent(
                `استفسار عن عمل مشابه لمشروع: ${project.titleAr}`
              )}`}
              className="w-full bg-gold hover:bg-gold-dark text-stone-950 font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>اطلب عرض سعر لمشروع مماثل</span>
            </Link>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>استفسر عبر واتساب</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
