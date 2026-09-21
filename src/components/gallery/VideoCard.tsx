import React, { useRef, useState } from 'react';
import { Calendar, Camera, Clock, ExternalLink, Play, Tag } from 'lucide-react';
import { VideoProject } from '../../types';

interface VideoCardProps {
  project: VideoProject;
  onClick: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ project, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [scrubProgress, setScrubProgress] = useState(0); // 0 to 1
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hover-to-scrub handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const progress = x / rect.width;
    setScrubProgress(progress);

    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = progress * videoRef.current.duration;
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl glass-panel hover:glass-panel-elevated hover:border-cinema-amber/40 transition-all duration-500 overflow-hidden flex flex-col lg:flex-row shadow-xl hover:shadow-2xl hover:shadow-cinema-amber/10"
    >
      {/* --- VIDEO PREVIEW CONTAINER (WITH HOVER-SCRUB) --- */}
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="relative flex-1 bg-black overflow-hidden min-h-[260px] sm:min-h-[320px] lg:min-h-[360px]"
      >
        {/* Poster Image */}
        <img
          src={project.posterUrl}
          alt={project.title}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            isHovering ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Video preview element */}
        <video
          ref={videoRef}
          src={project.previewUrl || project.videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Floating Play Icon Badge */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-cinema-amber/90 text-obsidian-950 flex items-center justify-center shadow-lg shadow-black/50 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-cinema-amber">
            <Play className="w-6 h-6 fill-obsidian-950 ml-0.5" />
          </div>
        </div>

        {/* Aspect Ratio Badge & Category Tag (Overlay) */}
        <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-black/60 backdrop-blur-md text-cinema-amber border border-cinema-amber/30 uppercase tracking-wider">
            {project.category}
          </span>
          <span className="px-2 py-1 rounded-md text-[10px] font-mono bg-black/50 backdrop-blur-md text-neutral-300 border border-white/10">
            {project.aspectRatio}
          </span>
        </div>

        {/* Scrubbing Timeline Progress Bar */}
        {isHovering && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 pointer-events-none">
            <div
              className="h-full bg-cinema-amber transition-all duration-75"
              style={{ width: `${scrubProgress * 100}%` }}
            />
          </div>
        )}

        {/* Quick Scrub Hint */}
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-neutral-400 bg-black/60 px-2 py-1 rounded backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          HOVER TO SCRUB PREVIEW
        </div>
      </div>

      {/* --- ATTACHED INFORMATION SIDEBAR --- */}
      <div className="lg:w-80 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 bg-white/[0.01]">
        {/* Top Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {project.year}
            </span>
            <span className="flex items-center gap-1 text-cinema-amber">
              <Clock className="w-3.5 h-3.5" />
              {project.runtime}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-cinema-amber transition-colors font-sans">
              {project.title}
            </h3>
            {project.client && (
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Client: <span className="text-neutral-200">{project.client}</span>
              </p>
            )}
          </div>

          <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
            {project.description}
          </p>

          {/* Technical Specs Tags */}
          <div className="pt-2 space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center gap-2 text-neutral-400">
              <Camera className="w-3.5 h-3.5 text-cinema-amber shrink-0" />
              <span className="truncate text-neutral-300">{project.cameraGear}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Tag className="w-3.5 h-3.5 text-cinema-teal shrink-0" />
              <span className="truncate text-neutral-300">{project.editingSoftware}</span>
            </div>
          </div>
        </div>

        {/* Bottom Roles and Click Prompt */}
        <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {project.roles.slice(0, 2).map((role, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300"
              >
                {role}
              </span>
            ))}
          </div>

          <span className="text-xs font-mono text-cinema-amber flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            VIEW CINEMA <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
