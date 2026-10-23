import React from 'react';
import { Award, Building2, Flame, GraduationCap, Sparkles, Video, Zap } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  category: string;
  role: string;
  badge: string;
  logoSrc?: string;
  icon?: React.ReactNode;
  description: string;
  deliverables: string[];
  featured?: boolean;
}

const COLLABORATORS: Collaborator[] = [
  {
    id: 'picklefest',
    name: 'Picklefest Tournament',
    category: 'Sports & Tournament Media',
    role: 'Lead Videographer & Editor',
    badge: 'Championship Partner',
    logoSrc: '/brands/picklefest.png',
    description: 'Courtside high-velocity coverage, fast-turnaround vertical social reels, and promotional commercial ads for Rajasthan’s premier pickleball tournament.',
    deliverables: ['Tournament Ads', 'Courtside Highlights', '9:16 Vertical Reels'],
    featured: true,
  },
  {
    id: 'jecrc-socialz',
    name: 'JECRC Socialz',
    category: 'Campus & Collegiate Media',
    role: 'Cinematographer & Video Editor',
    badge: 'University Media Partner',
    icon: <GraduationCap className="w-8 h-8 text-cinema-amber" />,
    description: 'Campus collaborative videos, student lifestyle recaps, youth culture promos, and dynamic event coverage tailored for the campus community.',
    deliverables: ['Campus Collabs', 'Event Recaps', 'Viral Campus Reels'],
    featured: true,
  },
  {
    id: 'digital-creators',
    name: 'Digital Creators & Artists',
    category: 'Influencer & Personal Brands',
    role: 'Visual Director & Post-Production',
    badge: 'Creative Network',
    icon: <Sparkles className="w-8 h-8 text-cinema-teal" />,
    description: 'Engaging vertical content with hook-driven pacing, rhythmic sound design, subtitle motion typography, and cinematic color palettes.',
    deliverables: ['Viral Reels & Shorts', 'Artist Showcases', 'Dynamic Captions & Sound FX'],
  },
  {
    id: 'commercial-events',
    name: 'Commercial & Live Events',
    category: 'Brand Activations & Experiences',
    role: 'Full-Cycle Videographer',
    badge: 'Commercial Production',
    icon: <Video className="w-8 h-8 text-cinema-red" />,
    description: 'High-energy aftermovies, brand launch teasers, and rapid same-day deliverables for event organizers, businesses, and private celebrations.',
    deliverables: ['Aftermovies', 'Brand Teasers', 'Same-Day Event Cuts'],
  },
];

export const BrandsSection: React.FC = React.memo(() => {
  return (
    <div 
      id="brands"
      className="mt-16 sm:mt-24 relative rounded-2xl sm:rounded-3xl border border-white/10 glass-panel-elevated p-6 sm:p-10 md:p-12 w-full max-w-full min-w-0 overflow-hidden"
    >
      {/* Decorative Glow Accents */}
      <div 
        className="absolute top-1/2 -left-20 w-72 h-72 rounded-full pointer-events-none -z-0 opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)',
        }}
      />
      <div 
        className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none -z-0 opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
        }}
      />

      {/* --- SECTION HEADER --- */}
      <div className="relative z-10 max-w-3xl mb-8 sm:mb-12">
        <div className="flex items-center gap-2 text-cinema-amber font-mono text-[11px] sm:text-xs uppercase tracking-widest mb-2">
          <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cinema-amber" />
          <span>COLLABORATIVE NETWORK</span>
          <span className="px-2 py-0.5 rounded-full bg-cinema-amber/10 border border-cinema-amber/30 text-[9px] sm:text-[10px] font-bold">
            CLIENTS & CREATORS
          </span>
        </div>

        <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
          BRANDS & CREATORS I’VE WORKED WITH
        </h3>

        <p className="text-xs sm:text-sm md:text-base text-neutral-400 mt-2 sm:mt-3 leading-relaxed">
          From sports championships and university campuses to digital creators and commercial campaigns — bringing ideas to life with high frame rates, quick turnarounds, and cinematic storytelling.
        </p>
      </div>

      {/* --- COLLABORATORS GRID --- */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
        {COLLABORATORS.map((collab) => (
          <div
            key={collab.id}
            className={`group relative rounded-xl sm:rounded-2xl p-5 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
              collab.featured
                ? 'bg-gradient-to-br from-white/[0.05] via-obsidian-950/80 to-black border-cinema-amber/30 hover:border-cinema-amber/60 shadow-lg hover:shadow-cinema-amber/10'
                : 'glass-panel hover:glass-panel-elevated border-white/10 hover:border-white/20'
            }`}
          >
            {/* Header: Logo / Icon + Badge */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                {/* Logo Image or Modern Emblem */}
                <div className="h-14 sm:h-16 flex items-center justify-center p-2 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md">
                  {collab.logoSrc ? (
                    <img
                      src={collab.logoSrc}
                      alt={`${collab.name} Logo`}
                      className="max-h-full max-w-[140px] sm:max-w-[160px] object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center">
                      {collab.icon}
                    </div>
                  )}
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border border-white/15 bg-white/5 text-neutral-300">
                  {collab.badge}
                </span>
              </div>

              {/* Title & Category */}
              <div className="mb-2">
                <span className="text-[11px] font-mono text-cinema-amber tracking-wider uppercase block">
                  {collab.category}
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-white group-hover:text-cinema-amber transition-colors font-sans mt-0.5">
                  {collab.name}
                </h4>
              </div>

              {/* Role tag */}
              <div className="mb-3">
                <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
                  Role: <strong className="text-white">{collab.role}</strong>
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {collab.description}
              </p>
            </div>

            {/* Deliverables tags */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-2">
                Key Deliverables
              </span>
              <div className="flex flex-wrap gap-1.5">
                {collab.deliverables.map((del, i) => (
                  <span
                    key={i}
                    className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/10 text-neutral-300 group-hover:border-cinema-amber/30 transition-colors"
                  >
                    {del}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- VALUE PILLARS TICKER BAR --- */}
      <div className="relative z-10 mt-10 pt-6 sm:pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
        <div className="p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <Zap className="w-4 h-4 text-cinema-amber mx-auto mb-1.5" />
          <span className="text-xs font-bold text-white block">24-48h Delivery</span>
          <span className="text-[10px] text-neutral-400 font-mono">Rapid event turnarounds</span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <Flame className="w-4 h-4 text-cinema-teal mx-auto mb-1.5" />
          <span className="text-xs font-bold text-white block">9:16 Social First</span>
          <span className="text-[10px] text-neutral-400 font-mono">Tuned for viral retention</span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <Award className="w-4 h-4 text-cinema-red mx-auto mb-1.5" />
          <span className="text-xs font-bold text-white block">Sony Sensor Rig</span>
          <span className="text-[10px] text-neutral-400 font-mono">ProRes & Cine profiles</span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <Sparkles className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
          <span className="text-xs font-bold text-white block">Full Pipeline</span>
          <span className="text-[10px] text-neutral-400 font-mono">Director to colorist</span>
        </div>
      </div>
    </div>
  );
});
