import React, { useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Film, 
  Play, 
  Sparkles, 
  Trophy, 
  Video, 
  GraduationCap, 
  X 
} from 'lucide-react';
import { BrandCollaborator, VideoProject } from '../../types';

interface CategoryTopicModalProps {
  category: BrandCollaborator | null;
  videos: VideoProject[];
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo: (video: VideoProject) => void;
}

export const CategoryTopicModal: React.FC<CategoryTopicModalProps> = ({
  category,
  videos,
  isOpen,
  onClose,
  onSelectVideo,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !category) return null;

  const renderIcon = (type?: string) => {
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
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[75] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto transition-all duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl glass-panel-elevated rounded-2xl sm:rounded-3xl border border-white/15 my-auto max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-all duration-300 animate-in zoom-in-95"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-white/20 text-white border border-white/15 transition-colors backdrop-blur-md shadow-lg"
          aria-label="Close topic modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header: Topic/Client Details with Logo */}
        <div className="p-6 sm:p-8 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            {/* Client Logo */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/80 border border-white/15 flex items-center justify-center p-2.5 shrink-0 shadow-xl overflow-hidden group">
              <div className="absolute inset-0 bg-cinema-amber/10 rounded-2xl blur-lg pointer-events-none" />
              {category.logoUrl ? (
                <img
                  src={category.logoUrl}
                  alt={`${category.name} Logo`}
                  className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                />
              ) : (
                <div className="relative z-10 flex items-center justify-center">
                  {renderIcon(category.iconType)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {category.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider bg-cinema-amber/15 border border-cinema-amber/30 text-cinema-amber">
                    {category.badge}
                  </span>
                )}
                {category.role && (
                  <span className="text-[11px] font-mono text-neutral-400">
                    Role: <span className="text-neutral-200">{category.role}</span>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 border border-white/10 text-neutral-300">
                  {videos.length} {videos.length === 1 ? 'Video' : 'Videos'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans uppercase">
                {category.name}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl leading-relaxed">
                {category.description}
              </p>

              {/* Deliverables / Tags */}
              {category.deliverables && category.deliverables.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {category.deliverables.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-neutral-300 text-[11px] font-mono"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body: Videos for this Topic/Client */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2 text-cinema-amber font-mono text-xs uppercase tracking-wider">
              <Film className="w-4 h-4" />
              <span>COLLECTION REELS &amp; COMMERCIALS ({videos.length})</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
              Click any video to launch 4K cinema master
            </span>
          </div>

          {videos.length === 0 ? (
            <div className="glass-panel p-10 rounded-2xl text-center space-y-2 text-neutral-400 font-mono text-xs">
              <p>No video reels have been published under this category yet.</p>
              <p className="text-neutral-500 text-[11px]">
                Add videos to this topic from the Director Control Room.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => onSelectVideo(video)}
                  className="group cursor-pointer rounded-2xl glass-panel hover:glass-panel-elevated hover:border-cinema-amber/50 transition-all duration-300 overflow-hidden flex flex-col shadow-lg hover:shadow-2xl hover:shadow-cinema-amber/10 border border-white/10"
                >
                  {/* Poster & Play Overlay */}
                  <div className={`relative w-full bg-black overflow-hidden ${
                    video.aspectRatio === '9:16' ? 'aspect-[9/14] sm:aspect-[9/13]' : 'aspect-video'
                  }`}>
                    <img
                      src={video.posterUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-cinema-amber text-obsidian-950 flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 shadow-black/50">
                        <Play className="w-5 h-5 fill-obsidian-950 ml-0.5" />
                      </div>
                    </div>

                    {/* Badges on poster */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 backdrop-blur-sm text-cinema-amber border border-cinema-amber/30 uppercase">
                        {video.aspectRatio}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 pointer-events-none">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 backdrop-blur-sm text-neutral-300 border border-white/10 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cinema-amber" />
                        {video.runtime}
                      </span>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {video.year}
                        </span>
                        <span className="text-cinema-amber truncate max-w-[120px]">
                          {video.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-cinema-amber transition-colors font-sans line-clamp-1">
                        {video.title}
                      </h3>

                      {video.description && (
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                          {video.description}
                        </p>
                      )}
                    </div>

                    {/* Roles & Click Prompt */}
                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {video.roles.slice(0, 2).map((role, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300"
                          >
                            {role}
                          </span>
                        ))}
                      </div>

                      <span className="text-xs font-mono text-cinema-amber flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                        WATCH <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
