import React from 'react';
import { Film, Lock, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdmin: boolean;
  onScrollToGallery: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  isAdmin,
  onScrollToGallery,
}) => {
  return (
    <header className="fixed top-5 right-5 sm:top-7 sm:right-7 z-50 flex items-center gap-3">
      {/* Quick Nav Bar */}
      <nav className="glass-panel hover:glass-panel-elevated rounded-full px-4 py-2 flex items-center gap-4 text-xs font-mono transition-all duration-300">
        <button
          onClick={onScrollToGallery}
          className="text-neutral-300 hover:text-cinema-amber transition-colors flex items-center gap-1.5"
        >
          <Film className="w-3.5 h-3.5 text-cinema-amber" />
          <span className="hidden sm:inline">GALLERY</span>
        </button>

        <a
          href="#contact"
          className="text-neutral-400 hover:text-white transition-colors hidden sm:inline"
        >
          BOOKING
        </a>

        <div className="w-[1px] h-3 bg-white/15" />

        {/* Admin Suite Trigger */}
        <button
          onClick={onOpenAdmin}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
            isAdmin
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-neutral-400 hover:text-cinema-amber hover:bg-white/5'
          }`}
          title={isAdmin ? "Director Control Room (Unlocked)" : "Admin Login"}
        >
          {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          <span className="text-[11px] font-semibold">{isAdmin ? "ADMIN" : "PORTAL"}</span>
        </button>
      </nav>
    </header>
  );
};
