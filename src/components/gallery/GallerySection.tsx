import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Film, 
  Filter, 
  FolderGit2, 
  GraduationCap, 
  LayoutGrid, 
  Play, 
  Sparkles, 
  Trophy, 
  Video 
} from 'lucide-react';
import { BrandCollaborator, VideoProject } from '../../types';
import { VideoCard } from './VideoCard';
import { CategoryTopicModal } from './CategoryTopicModal';
import { ANIMATION_CONFIG } from '../../config/animationConfig';

interface GallerySectionProps {
  projects: VideoProject[];
  brands?: BrandCollaborator[];
  onSelectProject: (project: VideoProject) => void;
  isViewfinderActive?: boolean;
  showBrandsAndLogos?: boolean;
}

export const GallerySection: React.FC<GallerySectionProps> = React.memo(({ 
  projects, 
  brands = [],
  onSelectProject,
  isViewfinderActive = false,
}) => {
  // Active view: 'topics' (default portfolio buttons) or 'all' (all videos stream)
  const [viewMode, setViewMode] = useState<'topics' | 'all'>('topics');
  const [selectedTopic, setSelectedTopic] = useState<BrandCollaborator | null>(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  // Filter only published items
  const publishedProjects = useMemo(() => {
    return projects.filter(p => p.isPublished !== false);
  }, [projects]);

  const publishedBrands = useMemo(() => {
    const list = brands.filter(b => b.isPublished !== false);
    return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [brands]);

  // Associate videos to their respective category
  const getVideosForBrand = (brand: BrandCollaborator): VideoProject[] => {
    const bName = brand.name.toLowerCase();
    const bId = brand.id.toLowerCase();

    return publishedProjects.filter((p) => {
      // 1. Exact or id match
      if (p.categoryId && p.categoryId.toLowerCase() === bId) return true;
      
      // 2. Client match
      if (p.client) {
        const clientLower = p.client.toLowerCase();
        if (clientLower === bName || bName.includes(clientLower) || clientLower.includes(bName)) {
          return true;
        }
      }

      // 3. Fallback name keywords
      if (bId.includes('picklefest') && (p.title.toLowerCase().includes('picklefest') || p.slug.includes('picklefest'))) {
        return true;
      }
      if (bId.includes('alive-cafe') && (p.title.toLowerCase().includes('alive') || p.slug.includes('alive'))) {
        return true;
      }
      if (bId.includes('jecrc') && (p.title.toLowerCase().includes('jecrc') || p.slug.includes('jecrc') || p.client?.toLowerCase().includes('socialz'))) {
        return true;
      }
      if (bId.includes('lets-play') && (p.title.toLowerCase().includes('play') || p.client?.toLowerCase().includes('play'))) {
        return true;
      }
      if (bId.includes('creative') && (p.client?.toLowerCase().includes('personal') || !p.client)) {
        return true;
      }

      return false;
    });
  };

  const handleOpenTopic = (brand: BrandCollaborator) => {
    setSelectedTopic(brand);
    setIsTopicModalOpen(true);
  };

  const renderBrandIcon = (type?: string) => {
    switch (type) {
      case 'trophy': return <Trophy className="w-8 h-8 text-cinema-amber" />;
      case 'graduation-cap': return <GraduationCap className="w-8 h-8 text-cinema-amber" />;
      case 'sparkles': return <Sparkles className="w-8 h-8 text-cinema-teal" />;
      case 'video': return <Video className="w-8 h-8 text-cinema-red" />;
      case 'building':
      default:
        return <Building2 className="w-8 h-8 text-cinema-amber" />;
    }
  };

  return (
    <section 
      id="gallery" 
      className="relative z-20 pt-6 sm:pt-20 pb-16 sm:pb-36 px-4 sm:px-8 md:px-14 max-w-7xl mx-auto scroll-mt-20 sm:scroll-mt-24 w-full max-w-full min-w-0"
    >
      {/* Gallery Header Bar (Cleanly docked under top HUD) */}
      <div 
        className={`flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-12 pb-5 sm:pb-6 border border-white/15 glass-panel-elevated p-5 sm:p-8 rounded-xl sm:rounded-2xl transition-all ease-out w-full max-w-full min-w-0 ${
          isViewfinderActive 
            ? 'scale-100 opacity-100 translate-y-0 shadow-[0_0_60px_rgba(245,158,11,0.12)]' 
            : 'scale-[0.96] opacity-0 translate-y-4'
        }`}
        style={{ transitionDuration: `${ANIMATION_CONFIG.gallery.headerAnimationDurationMs}ms` }}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-cinema-amber font-mono text-[11px] sm:text-xs uppercase tracking-widest mb-1.5 sm:mb-2">
            <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>PORTFOLIO</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans break-words uppercase">
            HERE'S MY WORK
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 sm:mt-2 max-w-xl leading-relaxed">
            Click on any client or event to view its video showcase, or switch to view all reels.
          </p>
        </div>

        {/* View Switcher: Simplified */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 shrink-0 self-start md:self-end">
          <button
            onClick={() => setViewMode('topics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              viewMode === 'topics'
                ? 'bg-cinema-amber text-obsidian-950 font-bold shadow-md shadow-cinema-amber/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>By Client</span>
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              viewMode === 'all'
                ? 'bg-cinema-amber text-obsidian-950 font-bold shadow-md shadow-cinema-amber/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Videos</span>
          </button>
        </div>
      </div>

      {/* --- VIEW 1: TOPICWISE PORTFOLIO CLICKABLE BUTTONS / CARDS WITH LOGOS --- */}
      {viewMode === 'topics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-full min-w-0">
          {publishedBrands.map((brand) => {
            const brandVideos = getVideosForBrand(brand);

            return (
              <div
                key={brand.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenTopic(brand)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenTopic(brand);
                  }
                }}
                className="group relative cursor-pointer rounded-2xl glass-panel hover:glass-panel-elevated hover:border-cinema-amber/50 transition-all duration-500 overflow-hidden flex flex-col justify-between p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-cinema-amber/10 border border-white/10 select-none text-left focus:outline-none focus:ring-2 focus:ring-cinema-amber"
              >
                {/* Subtle Amber Glow in Background on Hover */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-cinema-amber/5 rounded-full blur-3xl group-hover:bg-cinema-amber/15 transition-all duration-700 pointer-events-none" />

                <div>
                  {/* Top Bar: Logo & Badge */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    {/* Logo Emblem Box */}
                    <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-black/70 border border-white/15 flex items-center justify-center p-2.5 shrink-0 shadow-lg group-hover:border-cinema-amber/40 group-hover:scale-105 transition-all duration-300">
                      <div className="absolute inset-0 bg-cinema-amber/10 rounded-2xl blur-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                      {brand.logoUrl ? (
                        <img
                          src={brand.logoUrl}
                          alt={`${brand.name} Logo`}
                          className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="relative z-10 flex items-center justify-center">
                          {renderBrandIcon(brand.iconType)}
                        </div>
                      )}
                    </div>

                    {/* Badge Pill */}
                    {brand.badge && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider bg-cinema-amber/10 border border-cinema-amber/30 text-cinema-amber shrink-0">
                        {brand.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Role */}
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-cinema-amber transition-colors font-sans uppercase line-clamp-1">
                    {brand.name}
                  </h3>

                  {brand.role && (
                    <p className="text-xs font-mono text-neutral-400 mt-1">
                      Role: <span className="text-neutral-200">{brand.role}</span>
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-300 mt-3 line-clamp-3 leading-relaxed font-sans">
                    {brand.description}
                  </p>
                </div>

                {/* Bottom Bar: Video Count & CTA Button */}
                <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                    <Video className="w-3.5 h-3.5 text-cinema-amber" />
                    <span>
                      {brandVideos.length} {brandVideos.length === 1 ? 'Video' : 'Videos'}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-cinema-amber font-semibold group-hover:bg-cinema-amber group-hover:text-obsidian-950 group-hover:border-cinema-amber transition-all duration-300 shadow-sm">
                    <span>OPEN REELS</span>
                    <Play className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- VIEW 2: FLAT STREAM OF ALL PUBLISHED VIDEOS --- */}
      {viewMode === 'all' && (
        <div className="space-y-6 sm:space-y-10 w-full max-w-full min-w-0">
          {publishedProjects.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 sm:p-16 text-center text-neutral-400 font-mono text-sm space-y-3 w-full">
              <Filter className="w-8 h-8 mx-auto text-neutral-600" />
              <p>No video footage currently available.</p>
            </div>
          ) : (
            publishedProjects.map((project) => (
              <VideoCard
                key={project.id}
                project={project}
                onClick={() => onSelectProject(project)}
              />
            ))
          )}
        </div>
      )}

      {/* --- POPUP MODAL FOR SELECTED TOPIC / CLIENT VIDEOS --- */}
      <CategoryTopicModal
        category={selectedTopic}
        videos={selectedTopic ? getVideosForBrand(selectedTopic) : []}
        isOpen={isTopicModalOpen}
        onClose={() => {
          setIsTopicModalOpen(false);
          setSelectedTopic(null);
        }}
        onSelectVideo={(video) => {
          setIsTopicModalOpen(false);
          onSelectProject(video);
        }}
      />
    </section>
  );
});
