import React from 'react';
import { ArrowUpRight, Camera, Mail, MapPin } from 'lucide-react';
import { UserProfile } from '../../types';

interface FooterProps {
  profile: UserProfile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  return (
    <footer id="contact" className="relative z-20 border-t border-white/10 bg-obsidian-950/90 backdrop-blur-xl py-20 px-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
        {/* Left Col */}
        <div className="space-y-4 max-w-md">
          <div className="flex items-center gap-2 text-cinema-amber font-mono text-xs uppercase tracking-widest">
            <Camera className="w-4 h-4" />
            <span>DIRECTOR &amp; EDITORIAL BOOKING</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
            LET&apos;S CREATE THE NEXT MASTERPIECE.
          </h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Available for worldwide commercial shoots, music videos, narrative films, and remote post-production color grading.
          </p>
          <div className="pt-2">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cinema-amber hover:bg-amber-400 text-obsidian-950 font-bold font-mono text-sm transition-all shadow-lg shadow-cinema-amber/20"
            >
              <Mail className="w-4 h-4" />
              <span>{profile.email}</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

        {/* Right Col: Quick Links and Equipment */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm font-mono">
          <div>
            <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-3">
              CONNECT
            </span>
            <ul className="space-y-2">
              {profile.socials.map((soc, i) => (
                <li key={i}>
                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-300 hover:text-cinema-amber transition-colors flex items-center gap-1 text-xs"
                  >
                    <span>{soc.platform}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-3">
              BASE
            </span>
            <p className="text-xs text-neutral-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cinema-amber shrink-0" />
              {profile.location}
            </p>
            <p className="text-[11px] text-neutral-500 mt-2">
              Valid passport &amp; drone pilot license for global deployment.
            </p>
          </div>

          <div>
            <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-3">
              SYSTEM
            </span>
            <p className="text-xs text-neutral-400">
              3D WebGL • Three.js • React • Tailwind
            </p>
            <p className="text-[10px] text-neutral-600 mt-2">
              &copy; {new Date().getFullYear()} {profile.name}. All footage rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
