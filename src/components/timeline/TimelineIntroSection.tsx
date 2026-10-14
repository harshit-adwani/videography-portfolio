import React from 'react';
import { ChevronDown, Film, Layers, Music, Sliders, Sparkles, Volume2 } from 'lucide-react';
import { UserProfile } from '../../types';

interface TimelineIntroSectionProps {
  profile: UserProfile;
  onScrollToWorks: () => void;
  isLocked?: boolean;
}

export const TimelineIntroSection: React.FC<TimelineIntroSectionProps> = React.memo(({
  profile,
  onScrollToWorks,
  isLocked = false,
}) => {
  return (
    <section 
      id="intro-timeline"
      className="relative min-h-[calc(100dvh-3rem)] sm:min-h-screen w-full flex flex-col justify-between sm:justify-center items-center px-4 sm:px-8 safe-section-pt pb-8 sm:py-20 overflow-hidden bg-obsidian-950 scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Background Subtle Grid & Horizon Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_40%,rgba(245,158,11,0.06)_0%,rgba(0,0,0,0)_70%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-12">
        {/* --- 1. HERO TYPOGRAPHY: THE DIRECTOR PHILOSOPHY --- */}
        <div className="space-y-2.5 sm:space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-cinema-amber/10 border border-cinema-amber/30 text-cinema-amber text-[10px] sm:text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
            <span>POST-PRODUCTION &amp; DIRECTION</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white font-sans leading-tight sm:leading-[1.15]">
            I create, direct and shape visual experiences.
          </h1>

          <p className="text-xs sm:text-base md:text-xl font-mono text-neutral-400 tracking-wide font-medium">
            Film <span className="text-cinema-amber">·</span> Content <span className="text-cinema-amber">·</span> Motion <span className="text-cinema-amber">·</span> Creative Direction
          </p>

          {profile.tagline && (
            <p className="text-[11px] sm:text-sm font-sans text-neutral-500 italic max-w-xl mx-auto hidden sm:block">
              &ldquo;{profile.tagline}&rdquo;
            </p>
          )}
        </div>

        {/* --- 2. ABSTRACT NLE EDITING TIMELINE INTERFACE --- */}
        <div className="w-full glass-panel-elevated rounded-xl sm:rounded-2xl border border-white/10 p-2.5 sm:p-6 shadow-2xl overflow-hidden text-left font-mono">
          {/* Timeline Header Bar */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 sm:pb-3 sm:mb-3 border-b border-white/10 text-xs text-neutral-400">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1.5 text-cinema-amber font-semibold text-[11px] sm:text-xs">
                <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                TIMELINE 01
              </span>
              <span className="hidden sm:inline text-neutral-500">•</span>
              <span className="hidden sm:inline text-neutral-400">4K DCI MASTER SEQUENCE</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px]">
              <span className="text-neutral-500 hidden md:inline">23.976 FPS</span>
              <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-emerald-400 font-bold">
                00:01:24:18
              </span>
            </div>
          </div>

          {/* Timecode Ruler */}
          <div className="relative w-full h-5 sm:h-6 border-b border-white/10 flex items-end justify-between px-2 text-[8px] sm:text-[9px] text-neutral-500 select-none pb-1">
            <span>00:00:00:00</span>
            <span className="hidden sm:inline">00:00:30:00</span>
            <span>00:01:00:00</span>
            <span className="hidden sm:inline">00:01:30:00</span>
            <span>00:02:00:00</span>
            {/* Playhead marker indicator */}
            <div className="absolute top-0 left-1/3 sm:left-[45%] -translate-x-1/2 flex flex-col items-center z-20">
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-cinema-amber rotate-45 -mb-1 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              <div className="w-[2px] h-36 sm:h-52 bg-cinema-amber shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            </div>
          </div>

          {/* Timeline Tracks */}
          <div className="relative py-2 space-y-1.5 sm:space-y-2 select-none overflow-x-hidden">
            {/* V2: COLOR GRADE & LUT TRACK */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-14 sm:w-24 shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] text-neutral-400 font-semibold">
                <Layers className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-sky-400" />
                <span>V2 GFX</span>
              </div>
              <div className="flex-1 flex gap-1.5 sm:gap-2 h-6 sm:h-8">
                <div className="w-1/4 rounded-md sm:rounded-lg bg-sky-950/70 border border-sky-500/30 flex items-center px-1.5 sm:px-2 text-[8px] sm:text-[10px] text-sky-300 truncate">
                  ACEScg • GRAIN
                </div>
                <div className="flex-1 rounded-md sm:rounded-lg bg-indigo-950/70 border border-indigo-500/30 flex items-center px-1.5 sm:px-2 text-[8px] sm:text-[10px] text-indigo-300 truncate">
                  KODAK 2383 PRINT LUT
                </div>
              </div>
            </div>

            {/* V1: A-ROLL CINEMA FOOTAGE */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-14 sm:w-24 shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] text-neutral-300 font-semibold">
                <Film className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cinema-amber" />
                <span>V1 VIDEO</span>
              </div>
              <div className="flex-1 flex gap-1.5 sm:gap-2 h-7 sm:h-10">
                <div className="w-1/3 rounded-md sm:rounded-lg bg-amber-950/60 border border-cinema-amber/40 flex items-center justify-between px-1.5 sm:px-2 text-[8px] sm:text-[10px] text-amber-200">
                  <span className="truncate">SCENE 01</span>
                  <span className="text-[8px] opacity-60 hidden sm:inline">8K RAW</span>
                </div>
                <div className="w-1/4 rounded-md sm:rounded-lg bg-amber-900/50 border border-cinema-amber/30 flex items-center justify-between px-1.5 sm:px-2 text-[8px] sm:text-[10px] text-amber-200">
                  <span className="truncate">HERO DRIFT</span>
                  <span className="text-[8px] opacity-60 hidden sm:inline">ANAMORPHIC</span>
                </div>
                <div className="flex-1 rounded-md sm:rounded-lg bg-amber-950/60 border border-cinema-amber/40 flex items-center justify-between px-1.5 sm:px-2 text-[8px] sm:text-[10px] text-amber-200">
                  <span className="truncate">CLOSE-UP 120FPS</span>
                  <span className="text-[8px] opacity-60 hidden sm:inline">SLOW-MO</span>
                </div>
              </div>
            </div>

            {/* A1: DIALOGUE & ATMOSPHERE */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-14 sm:w-24 shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] text-neutral-400 font-semibold">
                <Volume2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                <span>A1 AUDIO</span>
              </div>
              <div className="flex-1 flex gap-1.5 sm:gap-2 h-5 sm:h-7">
                <div className="flex-1 rounded-md sm:rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center px-1.5 sm:px-2 text-[8px] sm:text-[10px] text-emerald-300">
                  <div className="w-full flex items-center justify-between">
                    <span className="truncate">DIALOGUE • 32-BIT</span>
                    {/* Abstract audio waveform */}
                    <div className="hidden sm:flex items-center gap-0.5 opacity-60">
                      {[3, 6, 9, 4, 8, 12, 16, 10, 5, 8, 14, 7, 3, 9, 15, 11, 4].map((h, i) => (
                        <div key={i} className="w-0.5 bg-emerald-400 rounded-full" style={{ height: `${h}px` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* A2: SCORE & SOUND DESIGN */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-14 sm:w-24 shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] text-neutral-400 font-semibold">
                <Music className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" />
                <span>A2 SCORE</span>
              </div>
              <div className="flex-1 flex gap-1.5 sm:gap-2 h-5 sm:h-7">
                <div className="w-2/5 rounded-md sm:rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center px-1.5 sm:px-2 text-[8px] sm:text-[10px] text-purple-300 truncate">
                  SYNTH SCORE
                </div>
                <div className="flex-1 rounded-md sm:rounded-lg bg-purple-900/40 border border-purple-500/20 flex items-center px-1.5 sm:px-2 text-[8px] sm:text-[10px] text-purple-300 truncate">
                  ANAMORPHIC RISER &amp; IMPACT
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 3. SCROLL DOWN TO WORKS INVITATION --- */}
        <div className="pt-2 sm:pt-4">
          <button
            onClick={onScrollToWorks}
            className="group flex flex-col items-center gap-1.5 sm:gap-2 text-xs font-mono text-neutral-400 hover:text-cinema-amber transition-colors"
          >
            <span className={`tracking-widest uppercase text-[10px] sm:text-[11px] font-semibold transition-all ${
              isLocked ? 'text-cinema-amber animate-pulse' : 'text-neutral-400'
            }`}>
              {isLocked ? 'Scroll Again to Proceed to Gallery' : 'Explore Selected Works'}
            </span>
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all ${
              isLocked 
                ? 'border-cinema-amber/50 bg-cinema-amber/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                : 'border-white/10 group-hover:border-cinema-amber/40'
            }`}>
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cinema-amber animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
});
