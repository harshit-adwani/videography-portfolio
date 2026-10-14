import React from 'react';
import { Film, Mail } from 'lucide-react';

interface NavbarProps {
  onScrollToGallery: () => void;
  onScrollToContact?: () => void;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({
  onScrollToGallery,
  onScrollToContact,
}) => {
  return (
    <header className="fixed safe-nav-top right-4 sm:top-7 sm:right-7 z-50 flex items-center gap-2 sm:gap-3 max-w-[calc(100vw-5rem)]">
      {/* Quick Nav Bar - Clean, Minimalist Public Interface */}
      <nav className="glass-panel hover:glass-panel-elevated rounded-full px-2.5 py-1 sm:px-4 sm:py-2 flex items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-mono transition-all duration-300 shrink-0">
        <button
          onClick={onScrollToGallery}
          className="text-neutral-300 hover:text-cinema-amber transition-colors flex items-center gap-1.5 font-medium"
        >
          <Film className="w-3.5 h-3.5 text-cinema-amber" />
          <span>GALLERY</span>
        </button>

        <a
          href="#contact"
          onClick={(e) => {
            if (onScrollToContact) {
              e.preventDefault();
              onScrollToContact();
            }
          }}
          className="text-neutral-400 hover:text-cinema-amber transition-colors flex items-center gap-1.5 font-medium"
        >
          <Mail className="w-3.5 h-3.5 text-neutral-400 hover:text-cinema-amber" />
          <span>CONTACT</span>
        </a>
      </nav>
    </header>
  );
});
