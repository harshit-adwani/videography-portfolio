import React from 'react';
import { UserProfile } from '../../types';

interface FooterProps {
  profile: UserProfile;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenAdmin }) => {
  return (
    <footer id="colophon" className="relative z-20 border-t border-white/10 bg-obsidian-950 py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
        <div>
          <span>&copy; {new Date().getFullYear()} {profile.name}. All cinematic reel rights reserved.</span>
        </div>
        <div className="flex items-center gap-3">
          <span>3D WEBGL • REACT • VITE</span>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-[10px] text-neutral-700 hover:text-cinema-amber transition-colors flex items-center gap-1 cursor-default hover:cursor-pointer"
              title="Director Console"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 hover:bg-cinema-amber" />
              <span>CORE</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
