import React, { useState } from 'react';
import { Film, Filter } from 'lucide-react';
import { ProjectCategory, VideoProject } from '../../types';
import { VideoCard } from './VideoCard';
import { PicklefestShowcase } from './PicklefestShowcase';
import { BrandsSection } from './BrandsSection';
import { ANIMATION_CONFIG } from '../../config/animationConfig';

interface GallerySectionProps {
  projects: VideoProject[];
  onSelectProject: (project: VideoProject) => void;
  isViewfinderActive?: boolean;
  showBrandsAndLogos?: boolean;
}

const CATEGORIES: (ProjectCategory | 'All')[] = [
  'All',
  'Commercial',
  'Music Video',
  'Short Film',
  'Social Reel',
  'Color Grading',
];

export const GallerySection: React.FC<GallerySectionProps> = React.memo(({ 
  projects, 
  onSelectProject,
  isViewfinderActive = false,
  showBrandsAndLogos = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section 
      id="gallery" 
      className="relative z-20 pt-6 sm:pt-20 pb-16 sm:pb-36 px-4 sm:px-8 md:px-14 max-w-7xl mx-auto scroll-mt-20 sm:scroll-mt-24 w-full max-w-full min-w-0"
    >
      {/* Gallery Header Bar (Cleanly docked under top HUD) */}
      <div 
        className={`flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-6 sm:mb-10 pb-5 sm:pb-6 border border-white/15 glass-panel-elevated p-4 sm:p-8 rounded-xl sm:rounded-2xl transition-all ease-out w-full max-w-full min-w-0 ${
          isViewfinderActive 
            ? 'scale-100 opacity-100 translate-y-0 shadow-[0_0_60px_rgba(245,158,11,0.12)]' 
            : 'scale-[0.96] opacity-0 translate-y-4'
        }`}
        style={{ transitionDuration: `${ANIMATION_CONFIG.gallery.headerAnimationDurationMs}ms` }}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-cinema-amber font-mono text-[11px] sm:text-xs uppercase tracking-widest mb-1.5 sm:mb-2">
            <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>SELECTED REELS • {filteredProjects.length} WORKS</span>
            <span className="px-2 py-0.5 rounded-full bg-cinema-amber/10 border border-cinema-amber/30 text-[9px] sm:text-[10px] text-cinema-amber font-bold">
              PORTFOLIO ARCHIVE
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans break-words">
            HERE ARE SOME OF MY WORKS
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 sm:mt-2 max-w-xl leading-relaxed">
            Selected commercial films, music videos, narrative shorts, and color grading reels. Hover or tap to scrub timeline frames; click to launch the master cinema player.
          </p>
        </div>

        {/* Category Filter Pills - wraps naturally into neat rows on mobile */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto min-w-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono transition-all duration-200 border whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cinema-amber text-obsidian-950 border-cinema-amber font-bold shadow-md shadow-cinema-amber/20'
                  : 'glass-panel text-neutral-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Cards Stream */}
      {filteredProjects.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 sm:p-16 text-center text-neutral-400 font-mono text-sm space-y-3 w-full">
          <Filter className="w-8 h-8 mx-auto text-neutral-600" />
          <p>No recorded footage in this category.</p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-xs text-cinema-amber hover:underline"
          >
            Reset filter to All
          </button>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-10 w-full max-w-full min-w-0">
          {filteredProjects.map((project) => (
            <VideoCard
              key={project.id}
              project={project}
              onClick={() => onSelectProject(project)}
            />
          ))}
        </div>
      )}

      {/* --- RECENT BRANDS & LOGOS SECTIONS (CONTROLLED VIA ADMIN TOGGLE) --- */}
      {showBrandsAndLogos && (
        <>
          {/* --- ACT 3.1: DEDICATED PICKLEFEST TOURNAMENT SHOWCASE --- */}
          <PicklefestShowcase
            projects={projects}
            onSelectProject={onSelectProject}
          />

          {/* --- ACT 3.2: BRANDS & CREATORS PORTFOLIO SECTION --- */}
          <BrandsSection />
        </>
      )}
    </section>
  );
});
