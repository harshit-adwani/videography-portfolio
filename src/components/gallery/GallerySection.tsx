import React, { useState } from 'react';
import { Film, Filter } from 'lucide-react';
import { ProjectCategory, VideoProject } from '../../types';
import { VideoCard } from './VideoCard';
import { CinemaModal } from './CinemaModal';

interface GallerySectionProps {
  projects: VideoProject[];
}

const CATEGORIES: (ProjectCategory | 'All')[] = [
  'All',
  'Commercial',
  'Music Video',
  'Short Film',
  'Social Reel',
  'Color Grading',
];

export const GallerySection: React.FC<GallerySectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');
  const [activeProject, setActiveProject] = useState<VideoProject | null>(null);

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section 
      id="gallery" 
      className="relative z-20 pt-28 pb-36 px-4 sm:px-8 md:px-14 max-w-7xl mx-auto"
    >
      {/* Gallery Header Bar (Inside Camera Viewfinder Safe Area) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/10 glass-panel p-6 sm:p-8 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-cinema-amber font-mono text-xs uppercase tracking-widest mb-2">
            <Film className="w-4 h-4" />
            <span>RECORDED CAMERA REELS • {filteredProjects.length} CLIPS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            CINEMATIC ARCHIVE
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-xl">
            Viewing through the camera viewfinder monitor. Hover over clips to scrub timeline frames; click to launch the 4K master player and technical case study.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 border ${
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
        <div className="glass-panel rounded-2xl p-16 text-center text-neutral-400 font-mono text-sm space-y-3">
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
        <div className="space-y-10">
          {filteredProjects.map((project) => (
            <VideoCard
              key={project.id}
              project={project}
              onClick={() => setActiveProject(project)}
            />
          ))}
        </div>
      )}

      {/* Expanded Cinema Modal */}
      <CinemaModal
        project={activeProject}
        isOpen={Boolean(activeProject)}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
};
