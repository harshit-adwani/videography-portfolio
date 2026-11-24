import React, { useEffect, useState } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  Award,
  Building2, 
  Camera,
  Check, 
  ChevronDown, 
  ChevronUp, 
  Download,
  Eye, 
  EyeOff, 
  Film, 
  FolderGit2, 
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
  const [activeTab, setActiveTab] = useState<'categories' | 'all_videos' | 'profile'>('categories');
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [editingProject, setEditingProject] = useState<VideoProject | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [targetCategoryIdForNewVideo, setTargetCategoryIdForNewVideo] = useState<string>('');

  // Categories / Clients State
  const [brands, setBrands] = useState<BrandCollaborator[]>([]);
  const [editingBrand, setEditingBrand] = useState<BrandCollaborator | null>(null);
  const [isBrandEditModalOpen, setIsBrandEditModalOpen] = useState(false);

  // Expanded categories map (all expanded by default)
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const [showPasscodeChange, setShowPasscodeChange] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [passMessage, setPassMessage] = useState('');

  // Profile Form State
  const [profile, setProfile] = useState<UserProfile>(() => initialProfileProp || storage.getProfile());
  const [profileSavedMsg, setProfileSavedMsg] = useState('');
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  // Quick Media Connect State
  const [connectProvider, setConnectProvider] = useState<'youtube' | 'instagram'>('youtube');
  const [quickMediaUrl, setQuickMediaUrl] = useState('');
  const [quickMediaCategory, setQuickMediaCategory] = useState<string>('');
  const [quickMediaError, setQuickMediaError] = useState('');

  useEffect(() => {
    if (initialProfileProp) {
      setProfile(initialProfileProp);
    }
  }, [initialProfileProp]);

  useEffect(() => {
    if (brands.length > 0 && !quickMediaCategory) {
      setQuickMediaCategory(brands[0].id);
    }
  }, [brands, quickMediaCategory]);

  const loadData = async () => {
    const p = await api.getProjects(true);
    setProjects(p);
    const b = await api.getBrands(true);
    setBrands(b);
    const prof = await api.getProfile();
    if (prof) setProfile(prof);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const refreshList = async () => {
    const list = await api.getProjects(true);
    setProjects(list);
    onProjectsUpdated();
  };

  const refreshBrandsList = async () => {
    const list = await api.getBrands(true);
    setBrands(list);
    if (onBrandsUpdated) onBrandsUpdated();
  };

  // Associate videos to category
  const getVideosForCategory = (brand: BrandCollaborator): VideoProject[] => {
    const bName = brand.name.toLowerCase();
    const bId = brand.id.toLowerCase();

    return projects.filter((p) => {
      if (p.categoryId && p.categoryId.toLowerCase() === bId) return true;
      if (p.client) {
        const clientLower = p.client.toLowerCase();
        if (clientLower === bName || bName.includes(clientLower) || clientLower.includes(bName)) {
          return true;
        }
      }
      if (bId.includes('picklefest') && (p.title.toLowerCase().includes('picklefest') || p.slug.includes('picklefest'))) {
        return true;
      }
      if (bId.includes('alive-cafe') && (p.title.toLowerCase().includes('alive') || p.slug.includes('alive'))) {
        return true;
      }
      if (bId.includes('jecrc') && (p.title.toLowerCase().includes('jecrc') || p.slug.includes('jecrc') || p.client?.toLowerCase().includes('socialz'))) {
        return true;
      }
      if (bId.includes('lets-play') && (p.title.toLowerCase().includes('play') || p.client?.toLowerCase().includes('play'))) {
        return true;
      }
      if (bId.includes('creative') && (p.client?.toLowerCase().includes('personal') || !p.client)) {
        return true;
      }
      return false;
    });
  };

  const toggleCategoryCollapse = (id: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleQuickConnect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setQuickMediaError('');
    const trimmed = quickMediaUrl.trim();
    if (!trimmed) return;

    const igId = parseInstagramId(trimmed);
    const ytId = parseYouTubeId(trimmed);

    const targetBrand = brands.find(b => b.id === quickMediaCategory) || brands[0];
    const targetBrandName = targetBrand?.name || 'Client Project';

    // Instagram Reel
    if (igId || (connectProvider === 'instagram' && !ytId)) {
      if (!igId) {
        setQuickMediaError('Please enter a valid Instagram Reel link (e.g. https://www.instagram.com/reel/CODE/)');
        return;
      }

      const newProjDraft: Partial<VideoProject> & { title: string } = {
        title: `${targetBrandName} • Vertical Reel`,
        category: 'Social Reel',
        categoryId: targetBrand?.id || '',
        client: targetBrandName,
        year: new Date().getFullYear().toString(),
        runtime: '00:45',
        aspectRatio: '9:16',
        roles: ['Director', 'Editor'],
        videoUrl: trimmed,
        posterUrl: targetBrand?.logoUrl || '',
        description: `Vertical commercial reel created for ${targetBrandName}.`,
        links: [{ label: 'Watch on Instagram', url: trimmed }],
        isPublished: true,
        featured: false,
      };

      setQuickMediaUrl('');
      setTargetCategoryIdForNewVideo(targetBrand?.id || '');
      setEditingProject(newProjDraft as VideoProject);
      setIsEditModalOpen(true);
      return;
    }

    // YouTube
    if (ytId || (connectProvider === 'youtube' && !igId)) {
      if (!ytId) {
        setQuickMediaError('Please enter a valid YouTube link (e.g. https://youtu.be/... or watch?v=...)');
        return;
      }

      const poster = getYouTubeThumbnail(ytId);
      const newProjDraft: Partial<VideoProject> & { title: string } = {
        title: `${targetBrandName} • Showcase Video`,
        category: 'Commercial',
        categoryId: targetBrand?.id || '',
        client: targetBrandName,
        year: new Date().getFullYear().toString(),
        runtime: '01:30',
        aspectRatio: '16:9',
        roles: ['Director', 'Editor'],
        videoUrl: trimmed,
        posterUrl: poster || targetBrand?.logoUrl || '',
        description: `Cinematic showcase created for ${targetBrandName}.`,
        links: [{ label: 'Watch on YouTube', url: trimmed }],
        isPublished: true,
        featured: false,
      };

      setQuickMediaUrl('');
      setTargetCategoryIdForNewVideo(targetBrand?.id || '');
      setEditingProject(newProjDraft as VideoProject);
      setIsEditModalOpen(true);
      return;
    }

    setQuickMediaError('Please paste a valid YouTube or Instagram Reel link.');
  };

  const handleSaveProject = async (data: Partial<VideoProject> & { title: string }) => {
    const saved = await api.saveProject(data);
    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [...prev, saved];
    });
    refreshList();
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this video reel?")) {
      setProjects(prev => prev.filter(p => p.id !== id));
      await api.deleteProject(id);
      refreshList();
    }
  };

  const handleTogglePublishProject = async (project: VideoProject) => {
    const nextPublished = !project.isPublished;
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, isPublished: nextPublished } : p));
    await api.saveProject({
      ...project,
      isPublished: nextPublished,
    });
    refreshList();
  };

  const handleSaveBrand = async (data: Partial<BrandCollaborator> & { name: string }) => {
    const saved = await api.saveBrand(data);
    setBrands(prev => {
      const idx = prev.findIndex(b => b.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [...prev, saved];
    });
    refreshBrandsList();
  };

  const handleDeleteBrand = async (id: string) => {
    if (confirm("Are you sure you want to remove this client category? The videos inside will remain saved.")) {
      setBrands(prev => prev.filter(b => b.id !== id));
      await api.deleteBrand(id);
      refreshBrandsList();
    }
  };

  const handleTogglePublishBrand = async (brandItem: BrandCollaborator) => {
    const nextPublished = brandItem.isPublished === false ? true : false;
    setBrands(prev => prev.map(b => b.id === brandItem.id ? { ...b, isPublished: nextPublished } : b));
    await api.saveBrand({
      ...brandItem,
      isPublished: nextPublished,
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

  const handleMoveProject = async (index: number, direction: 'up' | 'down') => {
    const next = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;

    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;

    setProjects(next);
    await api.reorderProjects(next);
    refreshList();
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all categories and video projects to clean portfolio defaults?")) {
      storage.resetToDefaults();
      refreshList();
      refreshBrandsList();
      const defProf = storage.getProfile();
      setProfile(defProf);
      if (onProfileUpdated) onProfileUpdated(defProf);
    }
  };

  const handleExportData = () => {
    const data = storage.exportAllData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    setProfileSavedMsg('✓ Profile settings saved to disk!');
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  const handleToggleCameraHero = async () => {
    const nextVal = profile.showCameraHero === false;
    const updated: UserProfile = { ...profile, showCameraHero: nextVal };
    setProfile(updated);
    await api.saveProfile(updated);
    if (onProfileUpdated) onProfileUpdated(updated);
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
        return <Building2 className="w-5 h-5 text-cinema-amber" />;
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto transition-all duration-300 animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl glass-panel-elevated rounded-2xl p-5 sm:p-8 border border-white/15 my-auto max-h-[92vh] flex flex-col shadow-2xl transition-all duration-300 animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-sans uppercase">
                DIRECTOR CONTROL ROOM
              </h2>
            </div>
            <p className="text-xs font-mono text-neutral-400 mt-0.5">
              Topicwise portfolio manager • Client showcases &amp; video reels
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setEditingBrand(null);
                setIsBrandEditModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-cinema-amber hover:bg-amber-400 text-obsidian-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md shadow-cinema-amber/20"
            >
              <Plus className="w-4 h-4" />
              ADD NEW CATEGORY / CLIENT
            </button>

            <button
              onClick={() => {
                setTargetCategoryIdForNewVideo(brands[0]?.id || '');
                setEditingProject(null);
                setIsEditModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-2 transition-colors border border-white/15"
            >
              <Video className="w-3.5 h-3.5 text-cinema-amber" />
              ADD VIDEO
            </button>

            <button
              type="button"
              onClick={handleToggleCameraHero}
              className={`px-3 py-2 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-colors border ${
                profile.showCameraHero !== false
                  ? 'bg-cinema-amber/15 text-cinema-amber border-cinema-amber/30 hover:bg-cinema-amber/25'
                  : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:bg-white/10'
              }`}
              title={profile.showCameraHero !== false ? "3D Camera Hero is ON (Click to remove)" : "3D Camera Hero is REMOVED (Click to restore)"}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Hero: <strong className={profile.showCameraHero !== false ? 'text-cinema-amber' : 'text-neutral-300'}>{profile.showCameraHero !== false ? 'ON' : 'OFF'}</strong></span>
            </button>

            <button
              onClick={() => setShowPasscodeChange(!showPasscodeChange)}
              className="px-3 py-2 rounded-xl glass-panel hover:bg-white/10 text-neutral-300 font-mono text-xs flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <KeyRound className="w-3.5 h-3.5 text-cinema-amber" />
              Passcode
            </button>

            <button
              onClick={handleExportData}
              className="px-3 py-2 rounded-xl glass-panel hover:bg-white/10 text-cinema-teal hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors border border-white/10"
              title="Download backup JSON with your projects, categories, and profile"
            >
              <Download className="w-3.5 h-3.5" />
              Backup
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-3 py-2 rounded-xl glass-panel hover:bg-white/10 text-neutral-400 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors border border-white/10"
              title="Reset to default demo items"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs flex items-center gap-1.5 transition-colors border border-red-500/20"
              title="Lock & Exit Control Room"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Change Passcode Slide-Down Form */}
        {showPasscodeChange && (
          <form
            onSubmit={handleChangePassword}
            className="my-3 p-4 rounded-xl glass-panel border border-cinema-amber/30 flex items-center gap-3 flex-wrap"
          >
            <span className="text-xs font-mono text-neutral-300">Set New Passcode:</span>
            <input
              type="password"
              placeholder="Min 4 chars"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cinema-amber"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-cinema-amber text-obsidian-950 font-bold font-mono text-xs"
            >
              Update Passcode
            </button>
            {passMessage && (
              <span className="text-xs font-mono text-emerald-400">{passMessage}</span>
            )}
          </form>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 my-4 border-b border-white/10 pb-2 flex-wrap shrink-0">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'categories'
                ? 'bg-cinema-amber text-obsidian-950 shadow-md shadow-cinema-amber/20'
                : 'text-neutral-400 hover:text-white glass-panel'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>CATEGORIES &amp; CLIENTS ({brands.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all_videos')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'all_videos'
                ? 'bg-cinema-amber text-obsidian-950 shadow-md shadow-cinema-amber/20'
                : 'text-neutral-400 hover:text-white glass-panel'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>ALL VIDEOS STREAM ({projects.length})</span>
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
            <span>PROFILE &amp; BRANDING</span>
          </button>
        </div>

        {/* --- TAB 1: TOPICWISE CATEGORIES & CLIENTS (PRIMARY) --- */}
        {activeTab === 'categories' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Quick-Connect Bar with Target Category Selector */}
            <form 
              onSubmit={handleQuickConnect}
              className={`glass-panel p-3.5 sm:p-4 rounded-xl border mb-4 shadow-xl shrink-0 transition-all ${
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
                      {connectProvider === 'instagram' ? 'QUICK-CONNECT INSTAGRAM REEL' : 'QUICK-CONNECT YOUTUBE VIDEO'}
                    </h3>
                    <p className="text-[11px] font-mono text-neutral-400">
                      Paste a video or reel link and choose which client category it belongs to
                    </p>
                  </div>
                </div>

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

              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                {/* Category dropdown */}
                <select
                  value={quickMediaCategory}
                  onChange={(e) => setQuickMediaCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/80 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-cinema-amber shrink-0 md:w-60"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id} className="bg-neutral-900">
                      Target: {b.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={quickMediaUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuickMediaUrl(val);
                    if (quickMediaError) setQuickMediaError('');
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
                  Connect to Category
                </button>
              </div>
            </form>
            {quickMediaError && (
              <div className="text-xs font-mono text-red-400 -mt-2 mb-3 px-1 shrink-0">
                {quickMediaError}
              </div>
            )}

            {/* Categories & their Videos Tree List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {brands.length === 0 ? (
                <div className="glass-panel p-8 text-center text-neutral-400 font-mono text-xs rounded-xl space-y-2">
                  <p>No categories or clients configured yet.</p>
                  <button
                    onClick={() => {
                      setEditingBrand(null);
                      setIsBrandEditModalOpen(true);
                    }}
                    className="text-cinema-amber hover:underline text-xs"
                  >
                    Click here to add your first category (e.g. Alive Café)
                  </button>
                </div>
              ) : (
                brands.map((brandItem, bIdx) => {
                  const categoryVideos = getVideosForCategory(brandItem);
                  const isCollapsed = Boolean(collapsedCategories[brandItem.id]);

                  return (
                    <div
                      key={brandItem.id}
                      className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl"
                    >
                      {/* Category Header */}
                      <div className="p-4 sm:p-5 bg-gradient-to-r from-white/[0.03] to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5">
                        {/* Left: Logo & Category Info */}
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          {/* Logo Emblem Box */}
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-black/80 border border-white/15 flex items-center justify-center p-1.5 shadow-md">
                            {brandItem.logoUrl ? (
                              <img
                                src={brandItem.logoUrl}
                                alt={brandItem.name}
                                className="max-h-full max-w-full object-contain filter drop-shadow"
                              />
                            ) : (
                              renderBrandIcon(brandItem.iconType)
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-bold text-white truncate font-sans uppercase">
                                {brandItem.name}
                              </h4>
                              {brandItem.badge && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cinema-amber/15 text-cinema-amber border border-cinema-amber/30 font-bold uppercase">
                                  {brandItem.badge}
                                </span>
                              )}
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10">
                                {categoryVideos.length} {categoryVideos.length === 1 ? 'Video' : 'Videos'}
                              </span>
                            </div>

                            <p className="text-xs text-neutral-400 mt-1 line-clamp-1 font-sans">
                              {brandItem.description}
                            </p>
                          </div>
                        </div>

                        {/* Right: Controls & Actions on Category */}
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0 flex-wrap">
                          {/* + Add Video to this Category */}
                          <button
                            onClick={() => {
                              setTargetCategoryIdForNewVideo(brandItem.id);
                              setEditingProject(null);
                              setIsEditModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-cinema-amber/20 hover:bg-cinema-amber text-cinema-amber hover:text-obsidian-950 font-bold font-mono text-xs flex items-center gap-1.5 border border-cinema-amber/30 transition-all"
                            title="Add a video to this client category"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Video</span>
                          </button>

                          {/* Reorder Category */}
                          <div className="flex items-center bg-black/40 rounded-lg border border-white/10 p-0.5">
                            <button
                              disabled={bIdx === 0}
                              onClick={() => handleMoveBrand(bIdx, 'up')}
                              className="p-1 text-neutral-400 hover:text-white disabled:opacity-30"
                              title="Move Category Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              disabled={bIdx === brands.length - 1}
                              onClick={() => handleMoveBrand(bIdx, 'down')}
                              className="p-1 text-neutral-400 hover:text-white disabled:opacity-30"
                              title="Move Category Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Toggle Category Publish */}
                          <button
                            onClick={() => handleTogglePublishBrand(brandItem)}
                            className={`p-1.5 rounded-lg text-xs font-mono border transition-colors ${
                              brandItem.isPublished !== false
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-neutral-800 text-neutral-400 border-white/10'
                            }`}
                            title={brandItem.isPublished !== false ? "Category live on site" : "Category hidden"}
                          >
                            {brandItem.isPublished !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          {/* Edit Category */}
                          <button
                            onClick={() => {
                              setEditingBrand(brandItem);
                              setIsBrandEditModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-200 border border-white/10 transition-colors"
                            title="Edit Category Details (Logo, Description, Badge)"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Category */}
                          <button
                            onClick={() => handleDeleteBrand(brandItem.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Expand/Collapse Chevron */}
                          <button
                            onClick={() => toggleCategoryCollapse(brandItem.id)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                            title={isCollapsed ? "Expand Videos" : "Collapse Videos"}
                          >
                            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Inside the Category: Videos List */}
                      {!isCollapsed && (
                        <div className="p-3 sm:p-4 space-y-2.5 bg-black/30">
                          {categoryVideos.length === 0 ? (
                            <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-neutral-400 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                              <span>No videos in this category yet.</span>
                              <button
                                onClick={() => {
                                  setTargetCategoryIdForNewVideo(brandItem.id);
                                  setEditingProject(null);
                                  setIsEditModalOpen(true);
                                }}
                                className="text-cinema-amber hover:underline flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add first video to {brandItem.name}
                              </button>
                            </div>
                          ) : (
                            categoryVideos.map((proj) => {
                              const globalIndex = projects.findIndex(p => p.id === proj.id);

                              return (
                                <div
                                  key={proj.id}
                                  className="p-3 rounded-xl bg-black/60 border border-white/5 hover:border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                                >
                                  {/* Left: Thumbnail & Video Info */}
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-black border border-white/10">
                                      <img
                                        src={proj.posterUrl}
                                        alt={proj.title}
                                        className="w-full h-full object-cover"
                                      />
                                      <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono bg-black/90 px-1 rounded text-neutral-300">
                                        {proj.runtime}
                                      </span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <h5 className="text-xs font-bold text-white truncate font-sans">
                                          {proj.title}
                                        </h5>
                                        <span className="text-[9px] font-mono px-1 rounded bg-black/80 text-cinema-amber border border-cinema-amber/30 uppercase">
                                          {proj.aspectRatio}
                                        </span>
                                        {proj.featured && (
                                          <span className="text-[8px] font-mono px-1 rounded bg-cinema-amber/20 text-cinema-amber">
                                            FEATURED
                                          </span>
                                        )}
                                      </div>

                                      <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                                        {proj.description || 'No description provided'}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Right: Controls */}
                                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                    <div className="flex items-center bg-black/40 rounded border border-white/10 p-0.5">
                                      <button
                                        disabled={globalIndex <= 0}
                                        onClick={() => handleMoveProject(globalIndex, 'up')}
                                        className="p-1 text-neutral-400 hover:text-white disabled:opacity-30"
                                        title="Move Up"
                                      >
                                        <ArrowUp className="w-3 h-3" />
                                      </button>
                                      <button
                                        disabled={globalIndex >= projects.length - 1}
                                        onClick={() => handleMoveProject(globalIndex, 'down')}
                                        className="p-1 text-neutral-400 hover:text-white disabled:opacity-30"
                                        title="Move Down"
                                      >
                                        <ArrowDown className="w-3 h-3" />
                                      </button>
                                    </div>

                                    <button
                                      onClick={() => handleTogglePublishProject(proj)}
                                      className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 border transition-colors ${
                                        proj.isPublished
                                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                          : 'bg-neutral-800 text-neutral-400 border-white/10'
                                      }`}
                                      title={proj.isPublished ? "Live on site" : "Draft (Hidden)"}
                                    >
                                      {proj.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                      <span>{proj.isPublished ? "Live" : "Draft"}</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        setTargetCategoryIdForNewVideo(brandItem.id);
                                        setEditingProject(proj);
                                        setIsEditModalOpen(true);
                                      }}
                                      className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-neutral-200 border border-white/10 transition-colors"
                                      title="Edit Video"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteProject(proj.id)}
                                      className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 transition-colors"
                                      title="Delete Video"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* --- TAB 2: FLAT ALL VIDEOS ARCHIVE --- */}
        {activeTab === 'all_videos' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <span className="text-xs font-mono text-neutral-400">
                All {projects.length} videos across all categories
              </span>
              <button
                onClick={() => {
                  setTargetCategoryIdForNewVideo(brands[0]?.id || '');
                  setEditingProject(null);
                  setIsEditModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-cinema-amber text-obsidian-950 font-bold font-mono text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Video
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="glass-panel p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-white/5 hover:border-white/15"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-black border border-white/10">
                      <img src={proj.posterUrl} alt={proj.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono bg-black/90 px-1 rounded text-neutral-300">
                        {proj.runtime}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate font-sans">
                          {proj.title}
                        </h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cinema-amber/15 text-cinema-amber border border-cinema-amber/30">
                          {proj.client || proj.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                        {proj.description || 'No description'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleTogglePublishProject(proj)}
                      className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 border ${
                        proj.isPublished
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400 border-white/10'
                      }`}
                    >
                      {proj.isPublished ? 'Published' : 'Draft'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingProject(proj);
                        setIsEditModalOpen(true);
                      }}
                      className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-neutral-200 border border-white/10"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 3: PROFILE & PERSONALIZATION --- */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto space-y-5 pr-1">
            {profileSavedMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                {profileSavedMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">ARTIST NAME</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">CREATIVE TITLE</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">BIO / STATEMENT</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">LOCATION</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">CONTACT EMAIL</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber"
                />
              </div>
            </div>

            {/* Avatar upload */}
            <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-white/20" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-neutral-400">
                    <User className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase">PROFILE AVATAR</h4>
                  <p className="text-[11px] font-mono text-neutral-400">Upload your portrait photo</p>
                </div>
              </div>
              <label className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs cursor-pointer flex items-center gap-1.5 transition-colors border border-white/15">
                <Upload className="w-3.5 h-3.5" />
                <span>{isAvatarUploading ? 'Uploading...' : 'Upload Avatar'}</span>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>

            {/* 3D Camera Hero Screen Toggle */}
            <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cinema-amber" />
                  <h4 className="text-xs font-mono font-bold text-white uppercase">ORIGINAL 3D CAMERA HERO SCREEN</h4>
                </div>
                <p className="text-xs font-mono text-neutral-400 max-w-xl">
                  {profile.showCameraHero !== false
                    ? "Active: Website begins with the interactive 3D studio camera hero and zooms through the optical viewfinder."
                    : "Removed: Website begins directly at the post-production timeline screen that appears after the camera."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleCameraHero}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 border transition-all shrink-0 ${
                  profile.showCameraHero !== false
                    ? 'bg-cinema-amber text-obsidian-950 border-cinema-amber shadow-lg shadow-cinema-amber/20 hover:bg-amber-400'
                    : 'bg-white/10 text-neutral-300 border-white/15 hover:bg-white/15 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{profile.showCameraHero !== false ? 'CAMERA HERO: ON (CLICK TO REMOVE)' : 'CAMERA HERO: OFF (CLICK TO RESTORE)'}</span>
              </button>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cinema-amber hover:bg-amber-400 text-obsidian-950 font-bold font-mono text-xs flex items-center gap-2 shadow-lg shadow-cinema-amber/20 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* Video Edit Modal */}
        <VideoEditModal
          project={editingProject}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProject}
          brands={brands}
          defaultCategoryId={targetCategoryIdForNewVideo}
        />

        {/* Category Edit Modal */}
        <BrandEditModal
          brand={editingBrand}
          isOpen={isBrandEditModalOpen}
          onClose={() => setIsBrandEditModalOpen(false)}
          onSave={handleSaveBrand}
        />
      </div>
    </div>
  );
};
