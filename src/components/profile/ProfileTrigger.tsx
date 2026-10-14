import React from 'react';
import { User } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileTriggerProps {
  profile: UserProfile;
  onClick: () => void;
  isOpen: boolean;
}

export const ProfileTrigger: React.FC<ProfileTriggerProps> = React.memo(({ profile, onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open Profile and Bio"
      className={`fixed safe-nav-top left-4 sm:top-7 sm:left-7 z-50 group flex items-center gap-2.5 sm:gap-3 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full transition-all duration-300 ${
        isOpen
          ? 'bg-cinema-amber text-obsidian-950 font-semibold shadow-lg shadow-cinema-amber/20 scale-105'
          : 'glass-panel hover:glass-panel-elevated hover:border-cinema-amber/40 hover:scale-105'
      }`}
    >
      {/* Avatar Image with subtle glowing ring */}
      <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-white/20 group-hover:border-cinema-amber/80 transition-colors">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <User className="w-4 h-4 text-neutral-400" />
          </div>
        )}
      </div>

      {/* Profile Label */}
      <div className="hidden sm:flex flex-col text-left">
        <span className={`text-xs font-semibold tracking-wider ${isOpen ? 'text-obsidian-950' : 'text-white'}`}>
          {profile.name}
        </span>
        <span className={`text-[10px] tracking-wide font-mono ${isOpen ? 'text-obsidian-950/80' : 'text-neutral-400'}`}>
          PROFILE & RIG
        </span>
      </div>
    </button>
  );
});
