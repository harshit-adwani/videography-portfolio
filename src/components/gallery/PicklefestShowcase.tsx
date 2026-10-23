import React from 'react';
import { Play, Trophy, Camera, Sparkles, ExternalLink, Film, CheckCircle2, Zap, Clock } from 'lucide-react';
import { VideoProject } from '../../types';

interface PicklefestShowcaseProps {
  projects: VideoProject[];
  onSelectProject: (project: VideoProject) => void;
}

export const PicklefestShowcase: React.FC<PicklefestShowcaseProps> = React.memo(({
  projects,
  onSelectProject,
}) => {
  // Extract all Picklefest projects or provide robust defaults
  const picklefestProjects = projects.filter(
    (p) =>
      p.client?.toLowerCase().includes('picklefest') ||
      p.title.toLowerCase().includes('picklefest')
  );

  // Fallback data in case external API had not yet synced
  const displayProjects = picklefestProjects.length > 0
    ? picklefestProjects
    : [
        {
          id: "proj-1791998946763",
          title: "PickleFest Advertisement",
          slug: "picklefest-advertisement",
          category: "Commercial" as const,
          client: "Picklefest",
          year: "2026",
          runtime: "01:30",
          aspectRatio: "9:16" as const,
          roles: ["Director", "Editor"],
          cameraGear: "Sony ZV-E10 / Cinema Rig",
          editingSoftware: "Premiere Pro",
          videoUrl: "https://youtube.com/shorts/dWv07VWOYTg?si=6QKeqhxViwVv-Jzb",
          previewUrl: "https://youtube.com/shorts/dWv07VWOYTg?si=6QKeqhxViwVv-Jzb",
          posterUrl: "https://img.youtube.com/vi/dWv07VWOYTg/hqdefault.jpg",
          description: "High-intensity vertical commercial reel shot courtside at the Picklefest tournament in Ajmer.",
          links: [{ label: "Watch on YouTube", url: "https://youtube.com/shorts/dWv07VWOYTg?si=6QKeqhxViwVv-Jzb" }],
          featured: true,
          isPublished: true,
          order: 1,
          createdAt: "2026-10-14",
        },
        {
          id: "proj-1792000278502",
          title: "Picklefest Ad 2",
          slug: "picklefest-ad-2",
          category: "Commercial" as const,
          client: "Picklefest",
          year: "2026",
          runtime: "01:30",
          aspectRatio: "9:16" as const,
          roles: ["Director", "Editor"],
          cameraGear: "Sony ZV-E10 / Cinema Rig",
          editingSoftware: "Premiere Pro & After Effects",
          videoUrl: "https://youtu.be/Gw2_lWmVKXo",
          previewUrl: "https://youtu.be/Gw2_lWmVKXo",
          posterUrl: "https://img.youtube.com/vi/Gw2_lWmVKXo/hqdefault.jpg",
          description: "Official tournament promo reel highlighting player intensity, championship atmosphere, and crowd energy.",
          links: [{ label: "Watch on YouTube", url: "https://youtu.be/Gw2_lWmVKXo" }],
          featured: true,
          isPublished: true,
          order: 2,
          createdAt: "2026-10-14",
        },
      ];

  return (
    <div 
      id="picklefest"
      className="mt-16 sm:mt-28 relative rounded-2xl sm:rounded-3xl border border-white/10 glass-panel overflow-hidden p-5 sm:p-10 md:p-12 w-full max-w-full min-w-0 shadow-2xl"
    >
      {/* Ambient Sports Tournament Lighting Effect */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full pointer-events-none -z-0 opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #f59e0b 0%, #06b6d4 50%, transparent 80%)',
        }}
      />
      <div 
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none -z-0 opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
        }}
      />

      {/* --- HEADER: TOURNAMENT SHOWCASE & LOGO --- */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 pb-8 sm:pb-10 border-b border-white/10">
        <div className="flex-1 min-w-0">
          {/* Sub-badge */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cinema-amber/15 border border-cinema-amber/40 text-cinema-amber font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              TOURNAMENT SHOWCASE
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-mono text-[10px] sm:text-[11px]">
              <Sparkles className="w-3 h-3 text-cinema-teal" />
              FEATURED CLIENT WORK
            </span>
          </div>

          <h3 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans uppercase">
            PICKLEFEST TOURNAMENT
          </h3>

          <p className="text-xs sm:text-sm md:text-base text-neutral-300 mt-2 sm:mt-3 max-w-2xl leading-relaxed">
            Shot & edited courtside for the premier pickleball championship in Ajmer. High-intensity sports coverage, rapid rally cuts, and high-energy vertical reels optimized for social engagement and sponsor visibility.
          </p>

          {/* Quick specs chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] font-mono text-neutral-400">
            <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-neutral-300 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cinema-amber" />
              Sony ZV-E10 • Handheld & Gimbal
            </span>
            <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-neutral-300 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-cinema-teal" />
              Premiere Pro & After Effects
            </span>
            <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-neutral-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Fast Turnaround Deliverables
            </span>
          </div>
        </div>

        {/* --- OFFICIAL PICKLEFEST TRANSPARENT LOGO BADGE --- */}
        <div className="shrink-0 relative group self-center lg:self-auto">
          <div className="relative p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-black/60 border border-white/15 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center min-w-[200px] sm:min-w-[240px]">
            {/* Logo backlight glow */}
            <div className="absolute inset-0 bg-cinema-amber/10 rounded-2xl blur-xl group-hover:bg-cinema-amber/20 transition-all duration-500 pointer-events-none" />

            <img
              src="/brands/picklefest.png"
              alt="Picklefest Tournament Official Logo"
              className="relative z-10 h-16 sm:h-20 md:h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
              loading="lazy"
            />
            <div className="relative z-10 mt-3 pt-2 border-t border-white/10 text-center w-full">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cinema-amber font-semibold block">
                OFFICIAL TOURNAMENT
              </span>
              <span className="text-[11px] text-neutral-400 font-sans block mt-0.5">
                Videography & Editing Partner
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEPARATE SECTION FOR PICKLEFEST VIDEOS --- */}
      <div className="relative z-10 mt-8 sm:mt-10">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cinema-amber animate-pulse" />
            <h4 className="text-sm sm:text-base font-bold font-mono tracking-wider text-neutral-200 uppercase">
              TOURNAMENT REELS & ADVERTISEMENTS ({displayProjects.length} VIDEOS)
            </h4>
          </div>
          <span className="text-[11px] font-mono text-cinema-amber hidden sm:inline-block">
            CLICK ANY REEL TO LAUNCH IN 4K CINEMA
          </span>
        </div>

        {/* Vertical Reel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 w-full">
          {displayProjects.map((project, idx) => (
            <div
              key={project.id || idx}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer rounded-xl sm:rounded-2xl border border-white/15 bg-obsidian-950/80 hover:bg-obsidian-950 hover:border-cinema-amber/50 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cinema-amber/15 flex flex-col"
            >
              {/* Media Container (Tailored 9:16 reel frame presentation) */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-black overflow-hidden">
                {/* Poster image with error fallback */}
                <img
                  src={project.posterUrl || "https://img.youtube.com/vi/dWv07VWOYTg/hqdefault.jpg"}
                  alt={project.title}
                  onError={(e) => {
                    // Fallback to hqdefault if maxresdefault 404s
                    const target = e.currentTarget;
                    if (target.src.includes('maxresdefault')) {
                      target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/30 to-black/40 pointer-events-none" />

                {/* Badge tags overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-cinema-amber/40 text-cinema-amber text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Film className="w-3 h-3" />
                    REEL #{idx + 1} • {project.aspectRatio}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-neutral-300 text-[10px] font-mono">
                    {project.runtime}
                  </span>
                </div>

                {/* Center Big Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-cinema-amber/95 text-obsidian-950 flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-cinema-amber">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-obsidian-950 ml-1" />
                  </div>
                </div>

                {/* Hover Play Hint */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px] font-mono text-neutral-300">
                  <span className="bg-black/60 px-2 py-1 rounded backdrop-blur-sm text-cinema-amber flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cinema-amber" />
                    CLICK TO WATCH FULL REEL
                  </span>
                </div>
              </div>

              {/* Card Meta Description */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h5 className="text-base sm:text-lg font-bold text-white group-hover:text-cinema-amber transition-colors font-sans">
                      {project.title}
                    </h5>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cinema-amber/10 border border-cinema-amber/30 text-cinema-amber shrink-0 font-semibold">
                      OFFICIAL AD
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Technical specs & actions */}
                <div className="pt-3 sm:pt-4 mt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                    <span className="text-neutral-300">{project.cameraGear}</span>
                    <span>•</span>
                    <span className="text-neutral-300">{project.editingSoftware}</span>
                  </div>

                  {project.links && project.links[0] && (
                    <a
                      href={project.links[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-mono text-neutral-400 hover:text-cinema-amber flex items-center gap-1 transition-colors"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- KEY DELIVERABLES CALLOUT BAR --- */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs font-mono">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-cinema-amber shrink-0 mt-0.5" />
            <div>
              <span className="text-white font-semibold block">Courtside Action Tracking</span>
              <span className="text-neutral-400 text-[11px]">Dynamic low-angles & fast rally framing.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-cinema-teal shrink-0 mt-0.5" />
            <div>
              <span className="text-white font-semibold block">24-Hour Social Turnaround</span>
              <span className="text-neutral-400 text-[11px]">Fast edits delivered for immediate posting.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-white font-semibold block">Vertical First (9:16)</span>
              <span className="text-neutral-400 text-[11px]">Tuned for maximum mobile retention.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
