import React from 'react';
import { ChevronDown, Eye, Film } from 'lucide-react';
import { ANIMATION_CONFIG } from '../../config/animationConfig';

interface HeroSectionProps {
  scrollProgress: number; // 0 to 1
  onScrollToGallery: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ scrollProgress, onScrollToGallery }) => {
  // Fade side details out quickly as soon as the user starts scrolling to turn the camera
  const sideOpacity = Math.max(0, 1 - scrollProgress * ANIMATION_CONFIG.heroText.fadeSpeed);

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* --- LEFT SIDE: MINIMALIST DOSSIER BADGE (Desktop only) --- */}
      <div 
        className="hidden sm:flex fixed left-6 lg:left-10 top-1/2 -translate-y-1/2 z-20 flex-col gap-3 max-w-xs transition-opacity duration-200"
        style={{ opacity: sideOpacity }}
      >
        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1 pointer-events-auto backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cinema-amber animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-cinema-amber font-semibold">
              CINEMATOGRAPHY
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white font-sans tracking-wide">
            ALEXANDER VANCE
          </h2>
          <p className="text-[11px] font-mono text-neutral-400">
            Director of Photography &amp; Lead Editor
          </p>
          <div className="pt-2 flex flex-wrap gap-1">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-neutral-300">
              8K RAW
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-neutral-300">
              ANAMORPHIC
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-neutral-300">
              ACES COLOR
            </span>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: MINIMALIST SCROLL PROMPT (Desktop only) --- */}
      <div 
        className="hidden sm:flex fixed right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 flex-col items-end gap-3 transition-opacity duration-200"
        style={{ opacity: sideOpacity }}
      >
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col items-end text-right pointer-events-auto backdrop-blur-xl shadow-2xl">
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-semibold">
            OPTICAL EVF 01
          </span>
          <button
            onClick={onScrollToGallery}
            className="flex items-center gap-2 text-xs font-mono text-cinema-amber hover:text-white transition-colors mt-1 font-semibold group"
          >
            <span>SCROLL TO TURN CAMERA</span>
            <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          </button>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 mt-2">
            <span>PEEK INTO VIEWFINDER</span>
            <ChevronDown className="w-3.5 h-3.5 text-cinema-amber animate-bounce" />
          </div>
        </div>
      </div>

      {/* --- MOBILE CENTERED SCROLL PROMPT --- */}
      <div 
        className="flex sm:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2 transition-opacity duration-200 pointer-events-auto"
        style={{ opacity: sideOpacity }}
      >
        <button
          onClick={onScrollToGallery}
          className="glass-panel px-4 py-2 rounded-full border border-cinema-amber/30 flex items-center gap-2 backdrop-blur-xl shadow-2xl"
        >
          <span className="text-[11px] font-mono text-cinema-amber font-semibold tracking-wider">
            SCROLL TO ROTATE
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-cinema-amber animate-bounce" />
        </button>
      </div>

      {/* --- BOTTOM: SKIP INTRO BUTTON --- */}
      <button
        onClick={onScrollToGallery}
        style={{ opacity: sideOpacity }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 pointer-events-auto z-20 px-4 py-2 rounded-full glass-panel hover:glass-panel-elevated hover:border-cinema-amber/40 text-[11px] font-mono text-neutral-300 hover:text-white transition-all flex items-center gap-2 shadow-lg whitespace-nowrap"
      >
        <Film className="w-3.5 h-3.5 text-cinema-amber" />
        <span>Skip to Archive</span>
      </button>
    </div>
  );
};
