import React, { useEffect, useState } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  Award,
  Building2,
  Check, 
  Eye, 
  EyeOff, 
  Film, 
  GraduationCap,
  Instagram,
  KeyRound, 
  Link2,
  LogOut, 
  Pencil, 
  Plus, 
  RotateCcw, 
  Sparkles,
  Trash2, 
  Trophy,
  Upload, 
  User, 
  Video,
  X,
  Youtube 
} from 'lucide-react';
import { BrandCollaborator, UserProfile, VideoProject } from '../../types';
import { api } from '../../services/api';
import { storage } from '../../services/storage';
import { VideoEditModal } from './VideoEditModal';
import { BrandEditModal } from './BrandEditModal';
import { getYouTubeThumbnail, parseInstagramId, parseYouTubeId } from '../../utils/videoEmbed';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectsUpdated: () => void;
  onProfileUpdated?: (profile: UserProfile) => void;
  onBrandsUpdated?: () => void;
  profile?: UserProfile;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onProjectsUpdated,
  onBrandsUpdated,
  onProfileUpdated,
  profile: initialProfileProp,
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'brands' | 'profile'>('projects');
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [editingProject, setEditingProject] = useState<VideoProject | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Brands & Creators State
  const [brands, setBrands] = useState<BrandCollaborator[]>([]);
  const [editingBrand, setEditingBrand] = useState<BrandCollaborator | null>(null);
  const [isBrandEditModalOpen, setIsBrandEditModalOpen] = useState(false);

  const [showPasscodeChange, setShowPasscodeChange] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [passMessage, setPassMessage] = useState('');

  // Profile Form State
  const [profile, setProfile] = useState<UserProfile>(() => initialProfileProp || storage.getProfile());
  const [profileSavedMsg, setProfileSavedMsg] = useState('');
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  useEffect(() => {
    if (initialProfileProp) {
      setProfile(initialProfileProp);
    }
  }, [initialProfileProp]);

  const isBrandsEnabled = profile.showBrandsAndLogos !== false;

  const handleToggleBrandsAndLogos = async (enabled: boolean) => {
    const updatedProfile: UserProfile = {
      ...profile,
      showBrandsAndLogos: enabled,
    };
    setProfile(updatedProfile);
    storage.saveProfile(updatedProfile);
    const saved = await api.saveProfile(updatedProfile);
    if (onProfileUpdated) {
      onProfileUpdated(saved || updatedProfile);
    }
    setProfileSavedMsg(
      enabled
        ? '✓ Brands & tournament showcase enabled on website!'
        : '✓ Brands & tournament showcase disabled — website returned to previous layout.'
    );
    setTimeout(() => setProfileSavedMsg(''), 4000);
  };

  // Quick Media Connect State (YouTube + Instagram)
  const [connectProvider, setConnectProvider] = useState<'youtube' | 'instagram'>('youtube');
  const [quickMediaUrl, setQuickMediaUrl] = useState('');
  const [quickMediaError, setQuickMediaError] = useState('');

  const handleQuickConnect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setQuickMediaError('');
    const trimmed = quickMediaUrl.trim();
    if (!trimmed) return;

    const igId = parseInstagramId(trimmed);
    const ytId = parseYouTubeId(trimmed);

    // If Instagram link or on Instagram tab
    if (igId || (connectProvider === 'instagram' && !ytId)) {
      if (!igId) {
        setQuickMediaError('Please enter a valid Instagram Reel link (e.g. https://www.instagram.com/reel/CODE/ or /p/CODE/)');
        return;
      }

      const newProjDraft: Partial<VideoProject> & { title: string } = {
        title: 'Instagram Reel • Visual Experience',
        category: 'Social Reel',
        year: new Date().getFullYear().toString(),
        runtime: '00:45',
        aspectRatio: '9:16',
        roles: ['Director', 'Editor', 'Visual Artist'],
        cameraGear: 'iPhone 15 Pro (ProRes Log) / Sony ZV-E10',
        editingSoftware: 'Premiere Pro & After Effects',
        videoUrl: trimmed,
        posterUrl: '',
        description: 'Vertical cinema reel embedded via Instagram Reel Player.',
        links: [{ label: 'Watch on Instagram', url: trimmed }],
        isPublished: true,
        featured: false,
      };

      setQuickMediaUrl('');
      setEditingProject(newProjDraft as VideoProject);
      setIsEditModalOpen(true);
      return;
    }

    // If YouTube link or on YouTube tab
    if (ytId || (connectProvider === 'youtube' && !igId)) {
      if (!ytId) {
        setQuickMediaError('Please enter a valid YouTube link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)');
        return;
      }

      const poster = getYouTubeThumbnail(ytId);
      const newProjDraft: Partial<VideoProject> & { title: string } = {
        title: 'New YouTube Cinema Reel',
        category: 'Commercial',
        year: new Date().getFullYear().toString(),
        runtime: '01:30',
        aspectRatio: '16:9',
        roles: ['Director', 'Editor'],
        cameraGear: 'Sony ZV-E10 / Cinema Rig',
        editingSoftware: 'Premiere Pro & After Effects',
        videoUrl: trimmed,
        posterUrl: poster,
        description: 'Cinematic reel embedded via YouTube 4K feed.',
        links: [{ label: 'Watch on YouTube', url: trimmed }],
        isPublished: true,
        featured: false,
      };

      setQuickMediaUrl('');
      setEditingProject(newProjDraft as VideoProject);
      setIsEditModalOpen(true);
      return;
    }

    setQuickMediaError('Please paste a valid YouTube or Instagram Reel link.');
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    const list = await api.getProjects();
    setProjects(list);
    const bList = await api.getBrands();
    setBrands(bList);
    const prof = await api.getProfile();
    setProfile(prof || initialProfileProp);
  };

  if (!isOpen) return null;

  const refreshList = async () => {
    const list = await api.getProjects();
    setProjects(list);
    onProjectsUpdated();
  };

  const refreshBrandsList = async () => {
    const list = await api.getBrands();
    setBrands(list);
    if (onBrandsUpdated) onBrandsUpdated();
  };

  const handleSaveProject = async (data: Partial<VideoProject> & { title: string }) => {
    await api.saveProject(data);
    refreshList();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await api.deleteProject(id);
      refreshList();
    }
  };

  const handleTogglePublish = async (project: VideoProject) => {
    await api.saveProject({
      ...project,
      isPublished: !project.isPublished,
    });
    refreshList();
  };

  const handleSaveBrand = async (data: Partial<BrandCollaborator> & { name: string }) => {
    await api.saveBrand(data);
    refreshBrandsList();
  };

  const handleDeleteBrand = async (id: string) => {
    if (confirm("Are you sure you want to remove this brand / creator?")) {
      await api.deleteBrand(id);
      refreshBrandsList();
    }
  };

  const handleTogglePublishBrand = async (brandItem: BrandCollaborator) => {
    await api.saveBrand({
      ...brandItem,
      isPublished: brandItem.isPublished === false ? true : false,
    });
    refreshBrandsList();
  };

  const handleMoveBrand = async (index: number, direction: 'up' | 'down') => {
    const next = [...brands];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;

    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;

    setBrands(next);
    await api.reorderBrands(next);
    if (onBrandsUpdated) onBrandsUpdated();
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const next = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;

    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;

    await api.reorderProjects(next);
    refreshList();
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all projects and brand partners to factory demo items?")) {
      storage.resetToDefaults();
      refreshList();
      refreshBrandsList();
      setProfile(storage.getProfile());
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 4) {
      setPassMessage("Password must be at least 4 characters.");
      return;
    }
    await api.changePassword(newPass);
    setPassMessage("Passcode updated successfully!");
    setTimeout(() => {
      setShowPasscodeChange(false);
      setPassMessage('');
      setNewPass('');
    }, 1500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const saved = await api.saveProfile(profile);
    setProfile(saved);
    if (onProfileUpdated) onProfileUpdated(saved);
    setProfileSavedMsg('✓ Profile and brand settings saved to disk!');
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsAvatarUploading(true);
      const url = await api.uploadAvatarFile(file);
      setProfile((prev) => ({ ...prev, avatarUrl: url }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    onClose();
  };

  const renderBrandIcon = (type?: string) => {
    switch (type) {
      case 'trophy': return <Trophy className="w-5 h-5 text-cinema-amber" />;
      case 'graduation-cap': return <GraduationCap className="w-5 h-5 text-cinema-amber" />;
      case 'sparkles': return <Sparkles className="w-5 h-5 text-cinema-teal" />;
      case 'video': return <Video className="w-5 h-5 text-cinema-red" />;
      case 'award': return <Award className="w-5 h-5 text-amber-400" />;
      case 'building':
      default:
        return <Building2 className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto transition-all duration-300 animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-white/15 my-auto max-h-[92vh] flex flex-col shadow-2xl transition-all duration-300 animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">
                DIRECTOR CONTROL ROOM
              </h2>
            </div>
            <p className="text-xs font-mono text-neutral-400 mt-0.5">
              Persistent studio backend • Real file uploads to disk
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {activeTab === 'projects' && (
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsEditModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-cinema-amber hover:bg-amber-400 text-obsidian-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md shadow-cinema-amber/20"
              >
                <Plus className="w-4 h-4" />
                ADD NEW VIDEO
              </button>
            )}

            {activeTab === 'brands' && (
              <button
                onClick={() => {
                  setEditingBrand(null);
                  setIsBrandEditModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-cinema-amber hover:bg-amber-400 text-obsidian-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md shadow-cinema-amber/20"
              >
                <Plus className="w-4 h-4" />
                ADD NEW BRAND / CREATOR
              </button>
            )}

            <button
              onClick={() => setShowPasscodeChange(!showPasscodeChange)}
              className="px-3 py-2 rounded-xl glass-panel hover:bg-white/10 text-neutral-300 font-mono text-xs flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <KeyRound className="w-3.5 h-3.5 text-cinema-amber" />
              Passcode
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-3 py-2 rounded-xl glass-panel hover:bg-white/10 text-neutral-400 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors border border-white/10"
              title="Reset to default demo projects"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Exit
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Change Passcode Drawer */}
        {showPasscodeChange && (
          <form onSubmit={handleChangePassword} className="my-4 p-4 rounded-xl glass-panel-subtle border border-cinema-amber/30 flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-neutral-300">New Admin Passcode:</span>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Enter new secret"
              className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cinema-amber"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-cinema-amber text-obsidian-950 font-bold font-mono text-xs hover:bg-amber-400"
            >
              Save Passcode
            </button>
            {passMessage && (
              <span className="text-xs font-mono text-emerald-400">{passMessage}</span>
            )}
          </form>
        )}

        {/* --- BRANDS & LOGOS MASTER TOGGLE CONTROL --- */}
        <div className="my-3 p-3.5 sm:p-4 rounded-xl border border-white/10 glass-panel bg-gradient-to-r from-obsidian-950 via-white/[0.02] to-black flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
              isBrandsEnabled
                ? 'bg-cinema-amber/15 border-cinema-amber/40 text-cinema-amber shadow-md shadow-cinema-amber/10'
                : 'bg-white/5 border-white/10 text-neutral-500'
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xs font-mono font-bold text-white tracking-wider uppercase truncate">
                  BRANDS &amp; TOURNAMENT LOGOS SHOWCASE
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase border transition-all ${
                  isBrandsEnabled
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                }`}>
                  {isBrandsEnabled ? 'ACTIVE • SHOWN' : 'DISABLED • PREVIOUS LAYOUT'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-neutral-400 mt-0.5 leading-snug">
                {isBrandsEnabled
                  ? 'Picklefest Tournament showcase, transparent logo, and Brands & Creators section are live on the portfolio.'
                  : 'Turned off. Website is returned to before (standard selected works only, no brands or tournament showcase).'}
              </p>
            </div>
          </div>

          {/* Interactive Switch */}
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 hidden md:inline">
              {isBrandsEnabled ? 'Return to before:' : 'Turn on brands & logo:'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isBrandsEnabled}
              onClick={() => handleToggleBrandsAndLogos(!isBrandsEnabled)}
              className={`relative inline-flex h-7 w-13 sm:w-14 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cinema-amber ${
                isBrandsEnabled
                  ? 'bg-cinema-amber border-cinema-amber shadow-md shadow-cinema-amber/30'
                  : 'bg-neutral-800 border-neutral-700'
              }`}
            >
              <span className="sr-only">Toggle brands and logos showcase</span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out mt-0.5 ${
                  isBrandsEnabled ? 'translate-x-6 sm:translate-x-7 bg-obsidian-950' : 'translate-x-1 bg-neutral-400'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 my-4 border-b border-white/10 pb-2 flex-wrap">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'projects'
                ? 'bg-cinema-amber text-obsidian-950 shadow-md shadow-cinema-amber/20'
                : 'text-neutral-400 hover:text-white glass-panel'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>PORTFOLIO REELS ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'brands'
                ? 'bg-cinema-amber text-obsidian-950 shadow-md shadow-cinema-amber/20'
                : 'text-neutral-400 hover:text-white glass-panel'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>BRANDS &amp; CREATORS ({brands.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'bg-cinema-amber text-obsidian-950 shadow-md shadow-cinema-amber/20'
                : 'text-neutral-400 hover:text-white glass-panel'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>BRAND &amp; PERSONALIZATION</span>
          </button>
        </div>

        {/* --- TAB 1: PROJECTS REELS --- */}
        {activeTab === 'projects' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Quick-Connect Social/Video Reel Bar */}
            <form 
              onSubmit={handleQuickConnect}
              className={`glass-panel p-3.5 sm:p-4 rounded-xl border mb-4 shadow-xl transition-all ${
                connectProvider === 'instagram'
                  ? 'border-pink-500/30 bg-gradient-to-r from-pink-950/20 via-purple-950/20 to-transparent'
                  : 'border-red-500/30 bg-gradient-to-r from-red-950/20 via-black/40 to-transparent'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-lg ${
                    connectProvider === 'instagram'
                      ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 border-pink-400/40 text-white shadow-pink-500/20'
                      : 'bg-red-600/20 border-red-500/30 text-red-500 shadow-red-500/10'
                  }`}>
                    {connectProvider === 'instagram' ? <Instagram className="w-5 h-5" /> : <Youtube className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      {connectProvider === 'instagram' ? 'CONNECT INSTAGRAM REEL' : 'CONNECT YOUTUBE VIDEO'}
                      <span className="text-[10px] font-mono text-cinema-amber bg-cinema-amber/10 border border-cinema-amber/20 px-1.5 py-0.2 rounded font-normal">
                        {connectProvider === 'instagram' ? '9:16 Vertical Reel' : 'Auto-Thumbnail'}
                      </span>
                    </h3>
                    <p className="text-[11px] font-mono text-neutral-400">
                      {connectProvider === 'instagram'
                        ? 'Paste any Instagram Reel or Post link to embed into your portfolio'
                        : 'Paste any YouTube, Shorts, or youtu.be link to connect instantly'}
                    </p>
                  </div>
                </div>

                {/* Provider switcher tabs */}
                <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-lg border border-white/10 shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setConnectProvider('youtube');
                      setQuickMediaError('');
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors ${
                      connectProvider === 'youtube'
                        ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    YouTube
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConnectProvider('instagram');
                      setQuickMediaError('');
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors ${
                      connectProvider === 'instagram'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-md shadow-pink-500/30'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    Instagram Reel
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={quickMediaUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuickMediaUrl(val);
                    if (quickMediaError) setQuickMediaError('');
                    // Auto-detect link and switch tab
                    if (parseInstagramId(val) && connectProvider !== 'instagram') {
                      setConnectProvider('instagram');
                    } else if (parseYouTubeId(val) && connectProvider !== 'youtube') {
                      setConnectProvider('youtube');
                    }
                  }}
                  placeholder={
                    connectProvider === 'instagram'
                      ? 'https://www.instagram.com/reel/C.../ or /p/...'
                      : 'https://www.youtube.com/watch?v=... or youtu.be/...'
                  }
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/70 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cinema-amber transition-colors"
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 whitespace-nowrap transition-all shadow-md ${
                    connectProvider === 'instagram'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-pink-500/20'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  Connect {connectProvider === 'instagram' ? 'Reel' : 'Video'}
                </button>
              </div>
            </form>
            {quickMediaError && (
              <div className="text-xs font-mono text-red-400 -mt-2 mb-3 px-1">
                {quickMediaError}
              </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="glass-panel-subtle p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Total Items</span>
                <div className="text-xl font-bold font-mono text-white mt-0.5">{projects.length}</div>
              </div>
              <div className="glass-panel-subtle p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Publicly Live</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  {projects.filter(p => p.isPublished).length}
                </div>
              </div>
              <div className="glass-panel-subtle p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Drafts</span>
                <div className="text-xl font-bold font-mono text-neutral-400 mt-0.5">
                  {projects.filter(p => !p.isPublished).length}
                </div>
              </div>
              <div className="glass-panel-subtle p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Featured</span>
                <div className="text-xl font-bold font-mono text-cinema-amber mt-0.5">
                  {projects.filter(p => p.featured).length}
                </div>
              </div>
            </div>

            {/* Projects List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white/5 hover:border-white/15 transition-colors"
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-black border border-white/10">
                      <img
                        src={proj.posterUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/80 px-1 rounded text-neutral-300">
                        {proj.runtime}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate font-sans">
                          {proj.title}
                        </h4>
                        {proj.featured && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cinema-amber/20 text-cinema-amber border border-cinema-amber/30">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mt-1">
                        <span className="text-cinema-amber">{proj.category}</span>
                        <span>•</span>
                        <span>{proj.year}</span>
                        {proj.client && (
                          <>
                            <span>•</span>
                            <span className="truncate text-neutral-300">{proj.client}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Controls */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <div className="flex items-center bg-black/40 rounded-lg border border-white/10 p-0.5">
                      <button
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, 'up')}
                        className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === projects.length - 1}
                        onClick={() => handleMove(idx, 'down')}
                        className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleTogglePublish(proj)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-colors ${
                        proj.isPublished
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-neutral-800 text-neutral-400 border-white/10 hover:text-white'
                      }`}
                      title={proj.isPublished ? "Live on site" : "Draft (Hidden)"}
                    >
                      {proj.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{proj.isPublished ? "Published" : "Draft"}</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingProject(proj);
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-200 hover:text-white transition-colors border border-white/10"
                      title="Edit Project"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 2: BRANDS & CREATORS DIRECTORY --- */}
        {activeTab === 'brands' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Top Prompt / Info Card */}
            <div className="glass-panel p-3.5 sm:p-4 rounded-xl border border-white/10 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cinema-amber/10 border border-cinema-amber/30 text-cinema-amber flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    COLLABORATIVE PARTNERS &amp; TOURNAMENT CLIENTS
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400">
                    Upload transparent logos, configure client deliverables, and edit tournament details shown on your public site.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingBrand(null);
                  setIsBrandEditModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-cinema-amber hover:bg-amber-400 text-obsidian-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cinema-amber/20 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD NEW BRAND</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="glass-panel-subtle p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Total Collaborators</span>
                <div className="text-xl font-bold font-mono text-white mt-0.5">{brands.length}</div>
              </div>
              <div className="glass-panel-subtle p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Publicly Live</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  {brands.filter(b => b.isPublished !== false).length}
                </div>
              </div>
              <div className="glass-panel-subtle p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Drafts (Hidden)</span>
                <div className="text-xl font-bold font-mono text-neutral-400 mt-0.5">
                  {brands.filter(b => b.isPublished === false).length}
                </div>
              </div>
              <div className="glass-panel-subtle p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Featured</span>
                <div className="text-xl font-bold font-mono text-cinema-amber mt-0.5">
                  {brands.filter(b => b.featured).length}
                </div>
              </div>
            </div>

            {/* Brands List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {brands.length === 0 ? (
                <div className="glass-panel p-8 text-center text-neutral-400 font-mono text-xs rounded-xl space-y-2">
                  <p>No brands or creators recorded yet.</p>
                  <button
                    onClick={() => {
                      setEditingBrand(null);
                      setIsBrandEditModalOpen(true);
                    }}
                    className="text-cinema-amber hover:underline text-xs"
                  >
                    Click here to add your first brand or creator
                  </button>
                </div>
              ) : (
                brands.map((brandItem, idx) => (
                  <div
                    key={brandItem.id}
                    className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white/5 hover:border-white/15 transition-colors"
                  >
                    {/* Left: Logo/Icon & Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-black/80 border border-white/10 flex items-center justify-center p-1.5">
                        {brandItem.logoUrl ? (
                          <img
                            src={brandItem.logoUrl}
                            alt={brandItem.name}
                            className="max-h-full max-w-full object-contain filter drop-shadow"
                          />
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center">
                            {renderBrandIcon(brandItem.iconType)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white truncate font-sans">
                            {brandItem.name}
                          </h4>
                          {brandItem.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10">
                              {brandItem.badge}
                            </span>
                          )}
                          {brandItem.featured && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cinema-amber/20 text-cinema-amber border border-cinema-amber/30">
                              FEATURED
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mt-1 flex-wrap">
                          <span className="text-cinema-amber">{brandItem.category}</span>
                          <span>•</span>
                          <span className="text-neutral-300">Role: {brandItem.role}</span>
                        </div>

                        <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                          {brandItem.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <div className="flex items-center bg-black/40 rounded-lg border border-white/10 p-0.5">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveBrand(idx, 'up')}
                          className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === brands.length - 1}
                          onClick={() => handleMoveBrand(idx, 'down')}
                          className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleTogglePublishBrand(brandItem)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-colors ${
                          brandItem.isPublished !== false
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-400 border-white/10 hover:text-white'
                        }`}
                        title={brandItem.isPublished !== false ? "Live on site" : "Draft (Hidden)"}
                      >
                        {brandItem.isPublished !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{brandItem.isPublished !== false ? "Published" : "Draft"}</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingBrand(brandItem);
                          setIsBrandEditModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-200 hover:text-white transition-colors border border-white/10"
                        title="Edit Brand / Creator"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteBrand(brandItem.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 transition-colors"
                        title="Delete Brand / Creator"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* --- TAB 3: BRAND & PROFILE PERSONALIZATION --- */}
        {activeTab === 'profile' && (
          <div className="flex-1 overflow-y-auto pr-1">
            {profileSavedMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <Check className="w-3.5 h-3.5" />
                <span>{profileSavedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    CREATOR / STUDIO NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="e.g. HARSHIT ADWANI"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber font-sans font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    PRIMARY PROFESSIONAL TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    placeholder="e.g. Visual Artist"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    CONTACT EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="director@studio.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    BASE / LOCATION
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="e.g. Los Angeles / Worldwide"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">
                  HERO TAGLINE
                </label>
                <input
                  type="text"
                  value={profile.tagline}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  placeholder="Sculpting light, rhythm, and emotion into timeless visual narratives."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">
                  DIRECTOR DOSSIER BIO
                </label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Detailed biography visible inside the dossier modal..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber resize-none"
                />
              </div>

              {/* Headshot / Avatar Upload */}
              <div className="glass-panel-subtle p-4 rounded-xl border border-white/10 space-y-3">
                <label className="block text-xs font-mono text-cinema-amber font-semibold">
                  PROFILE AVATAR / HEADSHOT
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-black border border-white/15 shrink-0">
                    <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={profile.avatarUrl}
                    onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono"
                    placeholder="Avatar image URL or upload local file"
                  />
                  <label className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer flex items-center gap-2 border border-white/15 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Headshot</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isAvatarUploading}
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Brands & Tournament Showcase Visibility Switch */}
              <div className="glass-panel-subtle p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="block text-xs font-mono text-cinema-amber font-semibold uppercase">
                      PORTFOLIO SECTIONS: BRANDS &amp; TOURNAMENT LOGOS
                    </label>
                    <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                      Toggle the Picklefest Tournament Showcase, logo display, and Brands &amp; Creators section.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isBrandsEnabled}
                    onClick={() => handleToggleBrandsAndLogos(!isBrandsEnabled)}
                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cinema-amber ${
                      isBrandsEnabled
                        ? 'bg-cinema-amber border-cinema-amber shadow-md shadow-cinema-amber/30'
                        : 'bg-neutral-800 border-neutral-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out mt-0.5 ${
                        isBrandsEnabled ? 'translate-x-7 bg-obsidian-950' : 'translate-x-1 bg-neutral-400'
                      }`}
                    />
                  </button>
                </div>
                <div className="text-[10px] font-mono text-neutral-400">
                  Current status: <strong className={isBrandsEnabled ? 'text-emerald-400' : 'text-neutral-300'}>{isBrandsEnabled ? 'Enabled (Full Brands & Picklefest Showcase Visible)' : 'Disabled (Website Returned to Previous Gallery Layout)'}</strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cinema-amber hover:bg-amber-400 text-obsidian-950 font-bold font-mono text-xs transition-all shadow-lg shadow-cinema-amber/20"
                >
                  SAVE BRAND SETTINGS
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Add / Edit Video Modal */}
      <VideoEditModal
        project={editingProject}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProject}
      />

      {/* Add / Edit Brand & Creator Modal */}
      <BrandEditModal
        brand={editingBrand}
        isOpen={isBrandEditModalOpen}
        onClose={() => setIsBrandEditModalOpen(false)}
        onSave={handleSaveBrand}
      />
    </div>
  );
};
