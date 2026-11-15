import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Check, 
  Instagram, 
  Loader2, 
  Play, 
  Plus, 
  Sparkles, 
  Trash2, 
  Upload, 
  Video, 
  X, 
  Youtube 
} from 'lucide-react';
import { BrandCollaborator, ProjectCategory, ProjectLink, VideoProject } from '../../types';
import { api } from '../../services/api';
import { CinemaPlayer } from '../gallery/CinemaPlayer';
import { getYouTubeThumbnail, parseInstagramId, parseYouTubeId } from '../../utils/videoEmbed';

interface VideoEditModalProps {
  project?: VideoProject | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<VideoProject> & { title: string }) => void;
  brands?: BrandCollaborator[];
  defaultCategoryId?: string;
}

const CATEGORIES: ProjectCategory[] = [
  'Commercial',
  'Music Video',
  'Short Film',
  'Social Reel',
  'Color Grading',
  'Documentary',
];

const ASPECT_RATIOS: ('16:9' | '9:16' | '2.39:1' | '4:3')[] = [
  '9:16',
  '16:9',
  '2.39:1',
  '4:3',
];

export const VideoEditModal: React.FC<VideoEditModalProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
  brands = [],
  defaultCategoryId,
}) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Commercial');
  const [client, setClient] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [runtime, setRuntime] = useState('01:30');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '2.39:1' | '4:3'>('9:16');
  const [rolesStr, setRolesStr] = useState('Director, Editor');
  const [videoUrl, setVideoUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState<ProjectLink[]>([]);
  const [isPublished, setIsPublished] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Upload States
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [isPosterUploading, setIsPosterUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Critical State Synchronization
  useEffect(() => {
    if (isOpen) {
      if (project) {
        setTitle(project.title || '');
        setCategoryId(project.categoryId || defaultCategoryId || '');
        setCategory((project.category as ProjectCategory) || 'Commercial');
        setClient(project.client || '');
        setYear(project.year || new Date().getFullYear().toString());
        setRuntime(project.runtime || '01:30');
        setAspectRatio(project.aspectRatio || '9:16');
        setRolesStr(project.roles ? project.roles.join(', ') : 'Director, Editor');
        setVideoUrl(project.videoUrl || '');
        setPosterUrl(project.posterUrl || '');
        setDescription(project.description || '');
        setLinks(project.links ? [...project.links] : [{ label: 'Watch Reel', url: '' }]);
        setIsPublished(project.isPublished ?? true);
        setFeatured(project.featured ?? false);
      } else {
        const initialCatId = defaultCategoryId || brands[0]?.id || '';
        const initialBrand = brands.find(b => b.id === initialCatId);
        setTitle('');
        setCategoryId(initialCatId);
        setCategory('Commercial');
        setClient(initialBrand?.name || '');
        setYear(new Date().getFullYear().toString());
        setRuntime('00:45');
        setAspectRatio('9:16');
        setRolesStr('Director, Editor');
        setVideoUrl('');
        setPosterUrl(initialBrand?.logoUrl || '');
        setDescription('');
        setLinks([{ label: 'Watch on Instagram', url: '' }]);
        setIsPublished(true);
        setFeatured(false);
      }
      setIsVideoUploading(false);
      setVideoUploadProgress(0);
      setIsPosterUploading(false);
      setStatusMessage('');
    }
  }, [project, isOpen, defaultCategoryId, brands]);

  if (!isOpen) return null;

  // Handle Category selection change
  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setCategoryId(selectedId);
    const matchedBrand = brands.find(b => b.id === selectedId);
    if (matchedBrand) {
      setClient(matchedBrand.name);
      if (!posterUrl && matchedBrand.logoUrl) {
        setPosterUrl(matchedBrand.logoUrl);
      }
    }
  };

  // Real backend video upload with progress
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsVideoUploading(true);
      setVideoUploadProgress(0);
      setStatusMessage(`Uploading video (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);

      const permanentUrl = await api.uploadVideoFile(file, (percent) => {
        setVideoUploadProgress(percent);
      });

      setVideoUrl(permanentUrl);
      setStatusMessage('✓ Video file uploaded to server disk!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Video upload failed. Server may be in demo mode.');
    } finally {
      setIsVideoUploading(false);
    }
  };

  // Real backend poster upload
  const handlePosterFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsPosterUploading(true);
      setStatusMessage('Uploading thumbnail poster...');
      const permanentUrl = await api.uploadPosterFile(file);
      setPosterUrl(permanentUrl);
      setStatusMessage('✓ Poster saved to server disk!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Poster upload failed.');
    } finally {
      setIsPosterUploading(false);
    }
  };

  const addLink = () => {
    setLinks([...links, { label: 'Watch on Instagram', url: '' }]);
  };

  const updateLink = (index: number, field: keyof ProjectLink, value: string) => {
    const next = [...links];
    next[index] = { ...next[index], [field]: value };
    setLinks(next);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: project?.id,
      title: title.trim(),
      category,
      categoryId: categoryId || undefined,
      client: client.trim(),
      year: year.trim(),
      runtime: runtime.trim(),
      aspectRatio,
      roles: rolesStr.split(',').map((r) => r.trim()).filter(Boolean),
      videoUrl: videoUrl.trim(),
      previewUrl: videoUrl.trim(),
      posterUrl:
        posterUrl.trim() ||
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      description: description.trim(),
      links: links.filter((l) => l.url.trim()),
      isPublished,
      featured,
    });
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto transition-all duration-300 animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-white/15 my-auto max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-300 animate-in zoom-in-95"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6 text-cinema-amber font-mono text-xs uppercase tracking-wider">
          <Video className="w-4 h-4" />
          <span>{project ? `EDIT VIDEO: ${project.title}` : 'ADD NEW VIDEO REEL'}</span>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-cinema-amber/15 border border-cinema-amber/30 text-cinema-amber text-xs font-mono flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CATEGORY / CLIENT ASSIGNMENT */}
          <div className="p-4 rounded-xl bg-black/50 border border-cinema-amber/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cinema-amber font-semibold">
              <Building2 className="w-4 h-4" />
              <span>ASSIGN TO CLIENT / EVENT CATEGORY</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">
                  PORTFOLIO TOPIC / CATEGORY *
                </label>
                <select
                  value={categoryId}
                  onChange={handleCategorySelectChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/80 border border-white/20 text-white text-sm focus:outline-none focus:border-cinema-amber font-mono"
                >
                  <option value="" disabled>-- Select a Client Category --</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id} className="bg-neutral-900">
                      {b.name} ({b.badge || 'Client'})
                    </option>
                  ))}
                  <option value="" className="bg-neutral-900">Other / Uncategorized</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">
                  CLIENT / TOPIC DISPLAY NAME
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Alive Café & Restro"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                VIDEO TITLE *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Alive Café Promo Reel"
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                GENRE / FORMAT
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber font-mono"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-neutral-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">YEAR</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cinema-amber"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">RUNTIME</label>
              <input
                type="text"
                value={runtime}
                onChange={(e) => setRuntime(e.target.value)}
                placeholder="00:45"
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cinema-amber"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">ASPECT RATIO</label>
              <select
                value={aspectRatio}
                onChange={(e) =>
                  setAspectRatio(e.target.value as '16:9' | '9:16' | '2.39:1' | '4:3')
                }
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cinema-amber"
              >
                {ASPECT_RATIOS.map((ar) => (
                  <option key={ar} value={ar} className="bg-neutral-900">
                    {ar} {ar === '9:16' ? '(Vertical Reel)' : '(Widescreen)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* VIDEO ASSET & YOUTUBE / INSTAGRAM CONNECTOR */}
          <div className="glass-panel-subtle p-4 rounded-xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-cinema-amber font-semibold flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                VIDEO LINK / INSTAGRAM REEL / YOUTUBE / MP4
              </label>
              {videoUrl && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <Play className="w-3 h-3" /> Ready
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => {
                  const val = e.target.value;
                  setVideoUrl(val);
                  // Auto-suggest YouTube thumbnail if poster is empty
                  const yt = parseYouTubeId(val);
                  if (yt && !posterUrl) {
                    setPosterUrl(getYouTubeThumbnail(yt));
                  }
                  // If Instagram Reel, suggest 9:16 vertical
                  const ig = parseInstagramId(val);
                  if (ig) {
                    setAspectRatio('9:16');
                  }
                }}
                placeholder="Paste Instagram Reel link, YouTube link, or MP4 URL"
                className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cinema-amber"
              />
              <label className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer flex items-center justify-center gap-2 border border-white/15 shrink-0 transition-colors disabled:opacity-50">
                {isVideoUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-cinema-amber" />
                    <span>{videoUploadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Video File</span>
                  </>
                )}
                <input
                  type="file"
                  accept="video/*"
                  disabled={isVideoUploading}
                  onChange={handleVideoFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* YouTube Auto-Thumbnail helper badge */}
            {parseYouTubeId(videoUrl) && (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg text-neutral-300">
                <span className="flex items-center gap-1.5 text-red-400 text-[11px]">
                  <Youtube className="w-3.5 h-3.5" />
                  YouTube ID: <code className="text-white font-bold">{parseYouTubeId(videoUrl)}</code>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const yt = parseYouTubeId(videoUrl);
                    if (yt) setPosterUrl(getYouTubeThumbnail(yt));
                  }}
                  className="text-[11px] bg-red-500/20 hover:bg-red-500/30 text-white px-2.5 py-1 rounded border border-red-500/30 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-cinema-amber" />
                  Auto-Set YouTube Poster
                </button>
              </div>
            )}

            {/* Instagram Reel Helper Badge */}
            {parseInstagramId(videoUrl) && (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent border border-pink-500/20 px-3 py-2 rounded-lg text-neutral-300">
                <span className="flex items-center gap-1.5 text-pink-400 text-[11px]">
                  <Instagram className="w-3.5 h-3.5" />
                  Instagram Reel Connected
                </span>
                <span className="text-[11px] text-neutral-300">
                  Configured for 9:16 Vertical Reel Player
                </span>
              </div>
            )}

            {/* Video Upload Progress Bar */}
            {isVideoUploading && (
              <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-cinema-amber h-full transition-all duration-200"
                  style={{ width: `${videoUploadProgress}%` }}
                />
              </div>
            )}

            {/* In-Modal Video Player Verification */}
            {videoUrl && (
              <div className="mt-3 rounded-lg overflow-hidden border border-white/10 bg-black aspect-video max-h-56">
                <CinemaPlayer
                  videoUrl={videoUrl}
                  posterUrl={posterUrl}
                  title={title || 'Preview'}
                  aspectRatio={aspectRatio}
                  autoPlay={false}
                />
              </div>
            )}
          </div>

          {/* POSTER / THUMBNAIL IMAGE */}
          <div className="glass-panel-subtle p-4 rounded-xl border border-white/10 space-y-3">
            <label className="block text-xs font-mono text-neutral-300">
              POSTER / THUMBNAIL IMAGE
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="Poster image URL or client logo (e.g. /brands/alive-cafe.jpg)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cinema-amber"
              />
              <label className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer flex items-center justify-center gap-2 border border-white/15 shrink-0 transition-colors">
                {isPosterUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cinema-amber" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isPosterUploading}
                  onChange={handlePosterFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Poster Preview */}
            {posterUrl && (
              <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                <img src={posterUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-300 mb-1">
              ROLES (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={rolesStr}
              onChange={(e) => setRolesStr(e.target.value)}
              placeholder="Videographer, Editor"
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-300 mb-1">
              DESCRIPTION / NOTES
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what was shot and edited for this project..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber resize-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-neutral-300">
                EXTERNAL LINKS (INSTAGRAM, YOUTUBE, RELEASES)
              </label>
              <button
                type="button"
                onClick={addLink}
                className="text-xs font-mono text-cinema-amber hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>
            {links.map((link, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Link Label (e.g. Watch on Instagram)"
                  value={link.label}
                  onChange={(e) => updateLink(idx, 'label', e.target.value)}
                  className="w-1/3 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs font-mono"
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => updateLink(idx, 'url', e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
                  className="p-1.5 text-neutral-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded border-white/15 bg-black/60 text-cinema-amber focus:ring-cinema-amber"
              />
              <span className="text-xs font-mono text-neutral-300">Published (Visible on site)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-white/15 bg-black/60 text-cinema-amber focus:ring-cinema-amber"
              />
              <span className="text-xs font-mono text-neutral-300">Featured Highlight</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white font-mono text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cinema-amber hover:bg-amber-400 text-obsidian-950 font-bold font-mono text-xs flex items-center gap-2 shadow-lg shadow-cinema-amber/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{project ? 'Save Changes' : 'Create Video'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
