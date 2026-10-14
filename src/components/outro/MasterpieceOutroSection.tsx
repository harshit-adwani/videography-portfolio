import React from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { UserProfile } from '../../types';

interface MasterpieceOutroSectionProps {
  profile: UserProfile;
  onScrollToTop?: () => void;
}

export const MasterpieceOutroSection: React.FC<MasterpieceOutroSectionProps> = React.memo(({
  profile,
}) => {
  return (
    <section 
      id="contact" 
      className="relative min-h-[100dvh] w-full flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 safe-section-pt safe-outro-pb bg-obsidian-950 scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Background Cinematic Spotlight & Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,rgba(245,158,11,0.08)_0%,rgba(0,0,0,0)_65%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cinema-amber/40 to-transparent" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center space-y-5 sm:space-y-10 my-auto">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-mono tracking-widest uppercase shadow-lg shadow-emerald-500/5">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ACCEPTING NEW COMMISSIONS &amp; DIRECTION</span>
        </div>

        {/* Grand Headline: LET'S CREATE THE NEXT MASTERPIECE */}
        <div className="space-y-3 sm:space-y-6 max-w-4xl">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white font-sans leading-[1.08] sm:leading-[1.1]">
            LET&apos;S CREATE THE NEXT MASTERPIECE.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-2xl mx-auto font-sans leading-relaxed">
            From the initial storyboard and camera rig to the final color grade and sound mix. Available worldwide for commercial direction, narrative cinema, and brand campaigns.
          </p>
        </div>

        {/* Primary Contact Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-md pt-2">
          <a
            href={`mailto:${profile.email}?subject=Project%20Inquiry%20-%20Masterpiece`}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-cinema-amber hover:bg-amber-400 text-obsidian-950 font-bold font-mono text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 sm:gap-3 transition-all shadow-xl shadow-cinema-amber/25 hover:scale-105 active:scale-95"
          >
            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>START A PROJECT</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>

          <a
            href={`mailto:${profile.email}`}
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl glass-panel hover:bg-white/10 text-neutral-300 font-mono text-[11px] sm:text-xs tracking-wider border border-white/15 flex items-center justify-center gap-2 transition-all hover:text-white"
          >
            <span className="truncate">{profile.email}</span>
          </a>
        </div>
      </div>
    </section>
  );
});
