import React, { useEffect, useState } from 'react';
import { BatteryCharging, Clapperboard, Disc3, Eye, Volume2 } from 'lucide-react';
import { ANIMATION_CONFIG } from '../../config/animationConfig';

interface ViewfinderHUDProps {
  progress: number; // 0 to 1
  isGalleryActive?: boolean;
}

export const ViewfinderHUD: React.FC<ViewfinderHUDProps> = ({ progress, isGalleryActive = false }) => {
  const [timecode, setTimecode] = useState("01:14:28:12");

  // Live timecode counter simulation (24 FPS)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const f = String(Math.floor((now.getMilliseconds() / 1000) * 24)).padStart(2, '0');
      setTimecode(`${h}:${m}:${s}:${f}`);
    }, 1000 / 24);
    return () => clearInterval(interval);
  }, []);

  // Opacity:
  // Dynamically computed based on ANIMATION_CONFIG.hud
  const { fadeInStart, fadeInRange } = ANIMATION_CONFIG.hud;
  const hudOpacity = isGalleryActive
    ? 1
    : progress < fadeInStart
    ? 0
    : Math.min(1, (progress - fadeInStart) / fadeInRange);

  if (hudOpacity <= 0.02) return null;

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-4 sm:p-7 font-mono text-xs text-neutral-300 transition-opacity duration-200 select-none overflow-hidden"
      style={{ opacity: hudOpacity }}
    >
      {/* Optical Vignette & Bezel */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />

      {/* Viewfinder Safe Frame Marks & Corner Brackets */}
      <div className="absolute inset-3 sm:inset-7 rounded-2xl border border-white/10 pointer-events-none">
        {/* Amber Corner Brackets */}
        <div className="absolute -top-1 -left-1 w-4 sm:w-6 h-4 sm:h-6 border-t-2 border-l-2 border-cinema-amber" />
        <div className="absolute -top-1 -right-1 w-4 sm:w-6 h-4 sm:h-6 border-t-2 border-r-2 border-cinema-amber" />
        <div className="absolute -bottom-1 -left-1 w-4 sm:w-6 h-4 sm:h-6 border-b-2 border-l-2 border-cinema-amber" />
        <div className="absolute -bottom-1 -right-1 w-4 sm:w-6 h-4 sm:h-6 border-b-2 border-r-2 border-cinema-amber" />

        {/* Viewfinder Frame Info */}
        <div className="absolute top-4 left-6 text-[10px] text-white/30 tracking-widest uppercase hidden lg:block">
          OPTICAL EVF • 2.39:1 SAFE AREA
        </div>
        <div className="absolute top-4 right-6 text-[10px] text-white/30 tracking-widest uppercase hidden lg:block">
          LUT: KODAK 2383 PRINT
        </div>
      </div>

      {/* --- TOP HUD BAR (Centered to avoid ProfileTrigger on left & Navbar on right) --- */}
      <div className="relative z-10 w-full flex items-center justify-center pointer-events-none pt-1">
        {/* Mobile: Sleek compact status badge centered between left avatar & right navbar */}
        <div className={`sm:hidden items-center gap-1.5 bg-black/85 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-xl shadow-xl text-[10px] ${
          isGalleryActive ? 'hidden' : 'flex'
        }`}>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-rec-blink" />
          <span className="text-red-500 font-bold tracking-wider text-[9px]">REC</span>
          <span className="text-white font-mono tracking-wider font-semibold text-[10px]">{timecode}</span>
        </div>

        {/* Desktop / Tablet: Centered cinema telemetry ribbon with plenty of room on both sides */}
        <div className="hidden sm:flex items-center gap-3 md:gap-5 bg-black/85 px-5 py-2 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl text-xs">
          {/* Rec indicator */}
          <div className="flex items-center gap-2 text-red-500 font-bold tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-rec-blink" />
            <span>{isGalleryActive ? 'PLAYBACK' : 'REC'}</span>
            <span className="text-white tracking-widest font-semibold ml-1">{timecode}</span>
          </div>

          <div className="h-3.5 w-[1px] bg-white/15" />

          {/* Mode */}
          <div className="flex items-center gap-3">
            <span className="text-cinema-amber font-semibold flex items-center gap-1.5">
              <Clapperboard className="w-3.5 h-3.5" />
              VIEWFINDER MONITOR
            </span>
            <span className="text-neutral-400 hidden md:inline">4K DCI 23.98 FPS</span>
            <span className="text-emerald-400 hidden lg:inline">RAW 16-BIT</span>
          </div>

          <div className="h-3.5 w-[1px] bg-white/15" />

          {/* Media & Battery */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <BatteryCharging className="w-4 h-4" />
              <span>98%</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Disc3 className="w-4 h-4 text-cinema-amber animate-spin" style={{ animationDuration: '6s' }} />
              <span>CF-B 412GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM HUD BAR --- */}
      <div 
        className={`relative z-10 flex items-center justify-between pointer-events-none transition-all duration-300 ${
          isGalleryActive 
            ? 'hidden sm:flex sm:opacity-50 sm:hover:opacity-100' 
            : 'flex opacity-100'
        }`}
      >
        {/* Exposure telemetry */}
        <div className="flex items-center gap-3 sm:gap-4 bg-black/80 px-3.5 sm:px-4 py-1.5 rounded-xl border border-white/10 backdrop-blur-xl shadow-xl text-xs">
          <div className="flex flex-col">
            <span className="text-[9px] text-neutral-400">SHUTTER</span>
            <span className="font-bold text-white">180.0°</span>
          </div>
          <div className="flex flex-col border-l border-white/10 pl-2.5 sm:pl-3">
            <span className="text-[9px] text-neutral-400">IRIS</span>
            <span className="font-bold text-cinema-amber">T 1.5</span>
          </div>
          <div className="flex flex-col border-l border-white/10 pl-2.5 sm:pl-3">
            <span className="text-[9px] text-neutral-400">ISO</span>
            <span className="font-bold text-white">800</span>
          </div>
          <div className="flex flex-col border-l border-white/10 pl-2.5 sm:pl-3 hidden sm:flex">
            <span className="text-[9px] text-neutral-400">WB</span>
            <span className="font-bold text-white">5600K</span>
          </div>
        </div>

        {/* Center: Audio VU Meters */}
        <div className="hidden lg:flex items-center gap-3 bg-black/80 px-4 py-1.5 rounded-xl border border-white/10 backdrop-blur-xl shadow-xl text-xs">
          <Volume2 className="w-4 h-4 text-neutral-400" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-neutral-400 w-3">CH1</span>
              <div className="w-24 h-1.5 bg-neutral-800 rounded-sm overflow-hidden flex">
                <div className="w-3/4 bg-emerald-500" />
                <div className="w-1/6 bg-amber-400" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-neutral-400 w-3">CH2</span>
              <div className="w-24 h-1.5 bg-neutral-800 rounded-sm overflow-hidden flex">
                <div className="w-2/3 bg-emerald-500" />
                <div className="w-1/6 bg-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Camera Roll Status */}
        <div className="bg-black/80 px-3.5 sm:px-4 py-1.5 rounded-xl border border-cinema-amber/30 backdrop-blur-xl shadow-xl text-right text-xs">
          <div className="text-[10px] text-cinema-amber uppercase tracking-wider font-semibold flex items-center justify-end gap-1.5">
            <Eye className="w-3 h-3" />
            <span>RECORDED REEL</span>
          </div>
          <div className="text-white text-xs font-mono">
            {isGalleryActive ? 'ARCHIVE REEL ACTIVE' : 'LOCKING VIEWFINDER...'}
          </div>
        </div>
      </div>
    </div>
  );
};
