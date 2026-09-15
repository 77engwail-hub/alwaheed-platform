import React from 'react';
import Link from 'next/link';
import type { Project } from '@al-waheed/types';
import { MapPin, Calendar, ArrowLeft, Layers } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 hover:border-gold/50 shadow-stone-md hover:shadow-gold-glow transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-950">
          <img
            src={project.coverImageUrl}
            alt={project.titleAr}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />

          {/* Location Badge */}
          {project.locationCity && (
            <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md text-stone-200 text-xs px-2.5 py-1 rounded-md border border-stone-700 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gold" />
              <span>{project.locationCity}</span>
            </div>
          )}

          {project.completionYear && (
            <div className="absolute top-3 left-3 bg-stone-900/80 text-gold text-xs px-2 py-0.5 rounded font-mono border border-gold/30">
              {project.completionYear} م
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-4.5 space-y-2.5">
          <h3 className="text-sm sm:text-[15px] font-bold text-stone-100 group-hover:text-gold transition-colors line-clamp-2 leading-snug">
            <Link href={`/projects/${project.slug}`}>{project.titleAr}</Link>
          </h3>

          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
            {project.shortDescAr || 'تنفيذ واجهات وأعمال نحت وزخرفة معمارية بأعلى معايير الحرفية.'}
          </p>

          {/* Materials Used */}
          {project.materialsUsed && project.materialsUsed.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {project.materialsUsed.slice(0, 3).map((m: any, idx: number) => (
                <span
                  key={idx}
                  className="text-[10px] sm:text-[11px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700 flex items-center gap-1"
                >
                  <Layers className="w-2.5 h-2.5 text-gold" />
                  <span>{m.nameAr || m}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 sm:p-4.5 pt-0 border-t border-stone-800/80 mt-1">
        <Link
          href={`/projects/${project.slug}`}
          className="w-full mt-2.5 bg-stone-800 hover:bg-gold hover:text-stone-950 text-stone-200 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-between transition-all"
        >
          <span>استعراض تفاصيل المشروع</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
