import React from 'react';
import { Camera, Clapperboard, Globe, Mail, MapPin, X } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-xl transition-all duration-300 animate-in fade-in"
    >
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl glass-panel-elevated rounded-2xl overflow-hidden border border-white/15 my-auto max-h-[90vh] flex flex-col shadow-2xl transition-all duration-300 animate-in zoom-in-95"
        role="dialog"
      >
        {/* Top Header with Close (Pinned) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cinema-amber" />
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider">
              DIRECTOR / EDITOR DOSSIER
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close dossier profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 sm:space-y-8 flex-1 min-h-0">
          {/* Bio & Intro Section */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-cinema-amber/40 shrink-0 shadow-lg shadow-black">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
                  {profile.name}
                </h2>
                <span className="flex items-center gap-1 text-xs text-cinema-amber bg-cinema-amber/10 px-2.5 py-1 rounded-full border border-cinema-amber/20 font-mono">
                  <MapPin className="w-3 h-3" />
                  {profile.location}
                </span>
              </div>
              <p className="text-sm text-neutral-300 font-medium">
                {profile.title}
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed pt-1">
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profile.stats.map((stat, i) => (
              <div key={i} className="glass-panel-subtle rounded-xl p-3 text-center border border-white/5">
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">{stat.value}</div>
                <div className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Equipment Rig & Camera Locker */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white tracking-wider font-mono">
              <Camera className="w-4 h-4 text-cinema-amber" />
              CINEMA GEAR LOCKER
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {profile.equipment.map((eq, i) => (
                <div key={i} className="glass-panel-subtle p-3.5 rounded-xl border border-white/5 space-y-2">
                  <div className="text-xs font-semibold text-cinema-amber font-mono">{eq.category}</div>
                  <ul className="space-y-1">
                    {eq.items.map((item, j) => (
                      <li key={j} className="text-xs text-neutral-300 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-neutral-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Post-Production Software */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white tracking-wider font-mono">
              <Clapperboard className="w-4 h-4 text-cinema-teal" />
              EDITING & COLOR PIPELINE
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.software.map((sw, i) => (
                <span 
                  key={i} 
                  className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-200"
                >
                  {sw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Connect & Socials (Pinned Footer - Always Visible) */}
        <div className="px-5 sm:px-8 py-4 border-t border-white/10 bg-neutral-950/85 backdrop-blur-md shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {profile.socials.map((soc, i) => (
              <a
                key={i}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-neutral-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 border border-white/5"
              >
                <Globe className="w-3.5 h-3.5" />
                {soc.platform}
              </a>
            ))}
          </div>

          <a
            href={`mailto:${profile.email}`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cinema-amber to-amber-600 hover:from-amber-400 hover:to-amber-500 text-obsidian-950 font-bold font-mono text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cinema-amber/20"
          >
            <Mail className="w-4 h-4" />
            Book Project / Inquire
          </a>
        </div>
      </div>
    </div>
  );
};
