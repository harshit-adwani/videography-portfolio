import React from 'react';
import { 
  Award, 
  Building2, 
  Camera, 
  ExternalLink, 
  Flame, 
  GraduationCap, 
  Sparkles, 
  Trophy, 
  Video, 
  Zap 
} from 'lucide-react';
import { BrandCollaborator } from '../../types';
import { initialBrands } from '../../data/initialBrands';

interface BrandsSectionProps {
  brands?: BrandCollaborator[];
}

export const BrandsSection: React.FC<BrandsSectionProps> = React.memo(({ brands }) => {
  const displayBrands = brands && brands.length > 0
    ? brands.filter(b => b.isPublished !== false)
    : initialBrands.filter(b => b.isPublished !== false);

  const renderIcon = (type?: string) => {
    switch (type) {
      case 'trophy': return <Trophy className="w-8 h-8 text-cinema-amber" />;
      case 'graduation-cap': return <GraduationCap className="w-8 h-8 text-cinema-amber" />;
      case 'sparkles': return <Sparkles className="w-8 h-8 text-cinema-teal" />;
      case 'video': return <Video className="w-8 h-8 text-cinema-red" />;
      case 'camera': return <Camera className="w-8 h-8 text-emerald-400" />;
      case 'award': return <Award className="w-8 h-8 text-amber-400" />;
      case 'building':
      default:
        return <Building2 className="w-8 h-8 text-indigo-400" />;
    }
  };

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
            CLIENTS &amp; CREATORS
          </span>
        </div>

        <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
          BRANDS &amp; CREATORS I’VE WORKED WITH
        </h3>

        <p className="text-xs sm:text-sm md:text-base text-neutral-400 mt-2 sm:mt-3 leading-relaxed">
          From sports championships and university campuses to digital creators and commercial campaigns — bringing ideas to life with high frame rates, quick turnarounds, and cinematic storytelling.
        </p>
      </div>

      {/* --- COLLABORATORS GRID --- */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
        {displayBrands.map((collab) => (
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
                  {collab.logoUrl ? (
                    <img
                      src={collab.logoUrl}
                      alt={`${collab.name} Logo`}
                      className="max-h-full max-w-[140px] sm:max-w-[160px] object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center">
                      {renderIcon(collab.iconType)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {collab.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border border-white/15 bg-white/5 text-neutral-300">
                      {collab.badge}
                    </span>
                  )}
                  {collab.websiteUrl && (
                    <a
                      href={collab.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-full text-neutral-400 hover:text-cinema-amber transition-colors"
                      title="Visit partner website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
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
            {collab.deliverables && collab.deliverables.length > 0 && (
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
            )}
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
          <span className="text-[10px] text-neutral-400 font-mono">ProRes &amp; Cine profiles</span>
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
