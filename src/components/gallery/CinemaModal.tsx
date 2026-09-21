import React, { useEffect, useRef, useState } from 'react';
import { 
  Camera, 
  ExternalLink, 
  Pause, 
  Play, 
  Sliders, 
  Tag, 
  Volume2, 
  VolumeX, 
  X 
} from 'lucide-react';
import { VideoProject } from '../../types';

interface CinemaModalProps {
  project: VideoProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CinemaModal: React.FC<CinemaModalProps> = ({ project, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showGradeSlider, setShowGradeSlider] = useState(false);
  const [gradeSplit, setGradeSplit] = useState(50); // 0 to 100

  // Reset states when opening new project
  useEffect(() => {
    if (isOpen && videoRef.current) {
      setIsPlaying(true);
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsMuted(true);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [isOpen, project]);

  // Keyboard shortcuts (Escape, Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying]);

  if (!isOpen || !project) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 bg-black/85 backdrop-blur-2xl transition-all duration-300 animate-in fade-in"
    >
      {/* Modal Card (Stops propagation so clicks inside do not trigger onClose) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-7xl h-[94vh] glass-panel-elevated rounded-2xl overflow-hidden border border-white/15 flex flex-col lg:flex-row shadow-2xl transition-all duration-300 animate-in zoom-in-95"
        role="dialog"
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-white/20 text-white border border-white/10 transition-colors backdrop-blur-md"
          aria-label="Close cinema player"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- LEFT / MAIN CINEMA PLAYER VIEWPORT --- */}
        <div className="relative flex-1 bg-black flex flex-col justify-between overflow-hidden">
          {/* Top Bar Indicators */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-cinema-amber text-obsidian-950 uppercase tracking-wider">
              {project.category}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-black/60 backdrop-blur-md text-neutral-300 border border-white/10">
              {project.aspectRatio} CINEMA
            </span>
            {project.beforeAfterGrade && (
              <button
                onClick={() => setShowGradeSlider(!showGradeSlider)}
                className={`px-3 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 transition-colors border ${
                  showGradeSlider
                    ? 'bg-cinema-teal text-obsidian-950 border-cinema-teal font-semibold'
                    : 'bg-black/60 text-white border-white/10 hover:border-cinema-teal/60'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                {showGradeSlider ? 'EXIT GRADE COMPARISON' : 'COMPARE RAW / GRADE'}
              </button>
            )}
          </div>

          {/* Video or Color Grade Comparison View */}
          <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black">
            {!showGradeSlider ? (
              <video
                ref={videoRef}
                src={project.videoUrl}
                poster={project.posterUrl}
                playsInline
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
                className="w-full h-full object-contain cursor-pointer"
              />
            ) : (
              /* Before/After Split Comparison View */
              <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
                <img
                  src={project.beforeAfterGrade?.afterUrl}
                  alt="After Grade"
                  className="w-full h-full object-contain"
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${gradeSplit}%` }}
                >
                  <img
                    src={project.beforeAfterGrade?.beforeUrl}
                    alt="Before Log"
                    className="w-full h-full object-contain filter saturate-50"
                  />
                  <div className="absolute top-6 left-6 px-2.5 py-1 bg-black/70 rounded text-[11px] font-mono text-neutral-400 border border-white/10">
                    RAW / LOG
                  </div>
                </div>
                <div className="absolute top-6 right-6 px-2.5 py-1 bg-black/70 rounded text-[11px] font-mono text-cinema-amber border border-white/10">
                  FINAL PRINT GRADE
                </div>

                {/* Slider divider line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-cinema-amber cursor-ew-resize flex items-center justify-center"
                  style={{ left: `${gradeSplit}%` }}
                >
                  <div className="w-6 h-6 rounded-full bg-cinema-amber text-obsidian-950 text-[10px] font-bold flex items-center justify-center shadow-lg">
                    ⇄
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gradeSplit}
                  onChange={(e) => setGradeSplit(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                />
              </div>
            )}
          </div>

          {/* Bottom Minimalist Video Controls Bar */}
          {!showGradeSlider && (
            <div className="relative z-20 px-6 py-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
              {/* Scrub Timeline */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cinema-amber"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between font-mono text-xs text-neutral-300">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span>
                    {formatTime(currentTime)} / {formatTime(duration || 0)}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-neutral-400">
                  <span className="hidden sm:inline">SPACEBAR: PLAY/PAUSE</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] text-white">4K MASTER</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT / LARGER DETAILED INFORMATION SIDEBAR --- */}
        <div className="lg:w-[420px] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/10 bg-neutral-950/70 backdrop-blur-xl">
          <div className="space-y-6">
            {/* Title and Metadata */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-cinema-amber">
                <span>{project.year}</span>
                <span>•</span>
                <span>{project.runtime}</span>
                <span>•</span>
                <span>{project.aspectRatio}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
                {project.title}
              </h2>
              {project.client && (
                <p className="text-sm font-mono text-neutral-300">
                  Client: <span className="text-white font-medium">{project.client}</span>
                </p>
              )}
            </div>

            {/* Story / Concept Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                SYNOPSIS &amp; CREATIVE DIRECTION
              </h4>
              <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                {project.description}
              </p>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                PRODUCTION SPECS &amp; RIG
              </h4>
              <div className="glass-panel-subtle rounded-xl p-4 border border-white/5 space-y-2.5 font-mono text-xs">
                <div className="flex items-start gap-2">
                  <Camera className="w-4 h-4 text-cinema-amber shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-400 block text-[10px]">CAMERA &amp; GLASS</span>
                    <span className="text-neutral-200">{project.cameraGear}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-white/5">
                  <Tag className="w-4 h-4 text-cinema-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-400 block text-[10px]">POST &amp; COLOR SUITE</span>
                    <span className="text-neutral-200">{project.editingSoftware}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roles */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                CREDITED ROLES
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.roles.map((r, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-3 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-200"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Dynamic External Links */}
            {project.links && project.links.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  PROJECT LINKS &amp; RELEASES
                </h4>
                <div className="flex flex-col gap-2">
                  {project.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl glass-panel hover:glass-panel-elevated hover:border-cinema-amber/40 text-xs font-mono text-neutral-200 hover:text-white flex items-center justify-between transition-all group"
                    >
                      <span className="font-semibold tracking-wide">{link.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-cinema-amber group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action */}
          <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-500">
              ID: {project.id}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
            >
              CLOSE PLAYER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
