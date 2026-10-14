import React, { useEffect, useState } from 'react';
import { Check, Instagram, Loader2, Play, Plus, Sparkles, Trash2, Upload, Video, X, Youtube } from 'lucide-react';
import { ProjectCategory, ProjectLink, VideoProject } from '../../types';
import { api } from '../../services/api';
import { CinemaPlayer } from '../gallery/CinemaPlayer';
import { getYouTubeThumbnail, parseInstagramId, parseYouTubeId } from '../../utils/videoEmbed';

interface VideoEditModalProps {
  project?: VideoProject | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<VideoProject> & { title: string }) => void;
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
  '16:9',
  '9:16',
  '2.39:1',
  '4:3',
];

export const VideoEditModal: React.FC<VideoEditModalProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Commercial');
  const [client, setClient] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [runtime, setRuntime] = useState('01:30');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '2.39:1' | '4:3'>('16:9');
  const [rolesStr, setRolesStr] = useState('Director, Editor');
  const [cameraGear, setCameraGear] = useState('Sony FX6 + Cine Primes');
  const [editingSoftware, setEditingSoftware] = useState('DaVinci Resolve Studio & Premiere Pro');
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

  // Critical State Synchronization: Reset or populate form whenever project or modal visibility changes
  useEffect(() => {
    if (isOpen) {
      if (project) {
        // Editing existing project
        setTitle(project.title || '');
        setCategory(project.category || 'Commercial');
        setClient(project.client || '');
        setYear(project.year || new Date().getFullYear().toString());
        setRuntime(project.runtime || '01:30');
        setAspectRatio(project.aspectRatio || '16:9');
        setRolesStr(project.roles ? project.roles.join(', ') : 'Director, Editor');
        setCameraGear(project.cameraGear || 'Sony FX6 + Cine Primes');
        setEditingSoftware(project.editingSoftware || 'DaVinci Resolve Studio & Premiere Pro');
        setVideoUrl(project.videoUrl || '');
        setPosterUrl(project.posterUrl || '');
        setDescription(project.description || '');
        setLinks(project.links ? [...project.links] : [{ label: 'Watch 4K Release', url: 'https://vimeo.com' }]);
        setIsPublished(project.isPublished ?? true);
        setFeatured(project.featured ?? false);
      } else {
        // Adding new project
        setTitle('');
        setCategory('Commercial');
        setClient('');
        setYear(new Date().getFullYear().toString());
        setRuntime('01:30');
        setAspectRatio('16:9');
        setRolesStr('Director, Editor');
        setCameraGear('Sony FX6 + Cine Primes');
        setEditingSoftware('DaVinci Resolve Studio & Premiere Pro');
        setVideoUrl('');
        setPosterUrl('');
        setDescription('');
        setLinks([{ label: 'Watch 4K Release', url: 'https://vimeo.com' }]);
        setIsPublished(true);
        setFeatured(false);
      }
      setIsVideoUploading(false);
      setVideoUploadProgress(0);
      setIsPosterUploading(false);
      setStatusMessage('');
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

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
      setStatusMessage('✓ Video uploaded and saved to disk!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Video upload failed. Check server connection.');
    } finally {
      setIsVideoUploading(false);
    }
  };

  // Real backend poster image upload
  const handlePosterFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsPosterUploading(true);
      setStatusMessage('Uploading poster image...');

      const permanentUrl = await api.uploadPosterFile(file);
      setPosterUrl(permanentUrl);
      setStatusMessage('✓ Poster image saved to disk!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Poster upload failed. Check server connection.');
    } finally {
      setIsPosterUploading(false);
    }
  };

  const addLink = () => {
    setLinks([...links, { label: 'New Link', url: '' }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    const next = [...links];
    next[index][field] = value;
    setLinks(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: project?.id,
      title: title.trim(),
      category,
      client: client.trim(),
      year: year.trim(),
      runtime: runtime.trim(),
      aspectRatio,
      roles: rolesStr.split(',').map((r) => r.trim()).filter(Boolean),
      cameraGear: cameraGear.trim(),
      editingSoftware: editingSoftware.trim(),
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
          <span>{project ? `EDIT PROJECT: ${project.title}` : 'ADD NEW VIDEO PROJECT'}</span>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-cinema-amber/15 border border-cinema-amber/30 text-cinema-amber text-xs font-mono flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                PROJECT TITLE *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SOLARIS: ECHOES OF SILENCE"
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                CATEGORY
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">CLIENT</label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Porsche, Nike"
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber"
              />
            </div>
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
                placeholder="02:30"
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
                    {ar}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* VIDEO ASSET & YOUTUBE / STREAM CONNECTOR */}
          <div className="glass-panel-subtle p-4 rounded-xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-cinema-amber font-semibold flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                VIDEO STREAM / YOUTUBE / INSTAGRAM / MP4
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
                  // If Instagram Reel, suggest 9:16 vertical and Social Reel category
                  const ig = parseInstagramId(val);
                  if (ig) {
                    if (aspectRatio === '16:9') setAspectRatio('9:16');
                    if (category === 'Commercial') setCategory('Social Reel');
                  }
                }}
                placeholder="Paste YouTube link (watch, youtu.be, shorts), Instagram Reel, Vimeo, or MP4"
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
                  Instagram Reel: <code className="text-white font-bold">{parseInstagramId(videoUrl)}</code>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAspectRatio('9:16');
                    setCategory('Social Reel');
                  }}
                  className="text-[11px] bg-pink-500/20 hover:bg-pink-500/30 text-white px-2.5 py-1 rounded border border-pink-500/30 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-cinema-amber" />
                  Set 9:16 Vertical Reel Mode
                </button>
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
                placeholder="Poster image URL (Unsplash, CDN, or /uploads/...)"
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
              <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-white/10 bg-black">
                <img src={posterUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                CAMERA GEAR &amp; LENSES
              </label>
              <input
                type="text"
                value={cameraGear}
                onChange={(e) => setCameraGear(e.target.value)}
                placeholder="e.g. RED V-Raptor 8K + Atlas Orion 40mm"
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                EDITING &amp; COLOR PIPELINE
              </label>
              <input
                type="text"
                value={editingSoftware}
                onChange={(e) => setEditingSoftware(e.target.value)}
                placeholder="e.g. DaVinci Resolve Studio &amp; Premiere"
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-300 mb-1">
              ROLES (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={rolesStr}
              onChange={(e) => setRolesStr(e.target.value)}
              placeholder="Director, Cinematographer, Lead Editor"
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-300 mb-1">
              SYNOPSIS &amp; CREATIVE DIRECTION
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the aesthetic, lighting philosophy, pacing, and storytelling behind this project..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber resize-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-neutral-300">
                EXTERNAL LINKS (VIMEO, YOUTUBE, CASE STUDY)
              </label>
              <button
                type="button"
                onClick={addLink}
                className="text-xs font-mono text-cinema-amber hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>
            <div className="space-y-2">
              {links.map((link, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateLink(i, 'label', e.target.value)}
                    placeholder="Link Label (e.g. Watch on Vimeo)"
                    className="w-1/3 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs font-mono"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateLink(i, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="p-2 text-neutral-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-white/10 font-mono text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-white">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded bg-black border-white/20 accent-cinema-amber"
              />
              <span>PUBLISH TO PUBLIC GALLERY</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-white">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded bg-black border-white/20 accent-cinema-amber"
              />
              <span>FEATURED HEADLINE</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white font-mono text-xs"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isVideoUploading || isPosterUploading}
              className="px-6 py-2.5 rounded-xl bg-cinema-amber hover:bg-amber-400 text-obsidian-950 font-bold font-mono text-xs transition-all shadow-lg shadow-cinema-amber/20 disabled:opacity-50"
            >
              SAVE PROJECT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
