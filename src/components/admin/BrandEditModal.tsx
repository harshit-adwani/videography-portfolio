import React, { useEffect, useState } from 'react';
import { 
  Award, 
  Building2, 
  Camera, 
  Check, 
  GraduationCap, 
  Plus, 
  Sparkles, 
  Trophy, 
  Upload, 
  Video, 
  X 
} from 'lucide-react';
import { BrandCollaborator, BrandIconType } from '../../types';
import { api } from '../../services/api';

interface BrandEditModalProps {
  brand?: BrandCollaborator | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (brandData: Partial<BrandCollaborator> & { name: string }) => void;
}

const ICON_OPTIONS: { type: BrandIconType; label: string; icon: React.ReactNode }[] = [
  { type: 'trophy', label: 'Trophy / Tournament', icon: <Trophy className="w-4 h-4 text-cinema-amber" /> },
  { type: 'graduation-cap', label: 'Campus / Academic', icon: <GraduationCap className="w-4 h-4 text-cinema-amber" /> },
  { type: 'sparkles', label: 'Creator / Dynamic', icon: <Sparkles className="w-4 h-4 text-cinema-teal" /> },
  { type: 'video', label: 'Video / Cinema', icon: <Video className="w-4 h-4 text-cinema-red" /> },
  { type: 'building', label: 'Brand / Corporate', icon: <Building2 className="w-4 h-4 text-indigo-400" /> },
  { type: 'camera', label: 'Camera / Gear', icon: <Camera className="w-4 h-4 text-emerald-400" /> },
  { type: 'award', label: 'Award / Badge', icon: <Award className="w-4 h-4 text-amber-400" /> },
];

export const BrandEditModal: React.FC<BrandEditModalProps> = ({
  brand,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [role, setRole] = useState('Lead Videographer & Editor');
  const [badge, setBadge] = useState('Featured Partner');
  const [logoUrl, setLogoUrl] = useState('');
  const [iconType, setIconType] = useState<BrandIconType>('building');
  const [description, setDescription] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Upload state
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (brand) {
        setName(brand.name || '');
        setCategory(brand.category || '');
        setRole(brand.role || 'Lead Videographer & Editor');
        setBadge(brand.badge || 'Featured Partner');
        setLogoUrl(brand.logoUrl || '');
        setIconType(brand.iconType || 'building');
        setDescription(brand.description || '');
        setDeliverables(brand.deliverables ? [...brand.deliverables] : []);
        setWebsiteUrl(brand.websiteUrl || '');
        setFeatured(brand.featured ?? false);
        setIsPublished(brand.isPublished ?? true);
      } else {
        setName('');
        setCategory('Sports & Tournament Media');
        setRole('Lead Videographer & Editor');
        setBadge('Championship Partner');
        setLogoUrl('');
        setIconType('trophy');
        setDescription('');
        setDeliverables(['Tournament Ads', 'Social Reels', 'High-Speed Highlights']);
        setWebsiteUrl('');
        setFeatured(false);
        setIsPublished(true);
      }
      setIsLogoUploading(false);
      setStatusMessage('');
      setNewDeliverable('');
    }
  }, [brand, isOpen]);

  if (!isOpen) return null;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLogoUploading(true);
      setStatusMessage('Uploading brand logo to disk...');
      const url = await api.uploadBrandLogoFile(file);
      setLogoUrl(url);
      setStatusMessage('✓ Logo uploaded and saved!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Logo upload failed. You can also paste an image URL.');
    } finally {
      setIsLogoUploading(false);
    }
  };

  const handleAddDeliverable = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newDeliverable.trim();
    if (!trimmed) return;
    if (!deliverables.includes(trimmed)) {
      setDeliverables([...deliverables, trimmed]);
    }
    setNewDeliverable('');
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...(brand?.id ? { id: brand.id } : {}),
      name: name.trim(),
      category: category.trim() || 'Brand Collaborator',
      role: role.trim() || 'Videographer & Editor',
      badge: badge.trim() || 'Partner',
      logoUrl: logoUrl.trim(),
      iconType,
      description: description.trim(),
      deliverables,
      websiteUrl: websiteUrl.trim(),
      featured,
      isPublished,
    });

    onClose();
  };

  const renderEmblemIcon = (type: BrandIconType) => {
    switch (type) {
      case 'trophy': return <Trophy className="w-7 h-7 text-cinema-amber" />;
      case 'graduation-cap': return <GraduationCap className="w-7 h-7 text-cinema-amber" />;
      case 'sparkles': return <Sparkles className="w-7 h-7 text-cinema-teal" />;
      case 'video': return <Video className="w-7 h-7 text-cinema-red" />;
      case 'camera': return <Camera className="w-7 h-7 text-emerald-400" />;
      case 'award': return <Award className="w-7 h-7 text-amber-400" />;
      case 'building':
      default:
        return <Building2 className="w-7 h-7 text-indigo-400" />;
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl glass-panel-elevated rounded-2xl p-5 sm:p-8 border border-white/15 my-auto max-h-[92vh] flex flex-col shadow-2xl transition-all animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cinema-amber animate-pulse" />
              <h2 className="text-lg sm:text-xl font-bold text-white font-sans">
                {brand ? 'EDIT BRAND / CREATOR COLLABORATION' : 'ADD NEW BRAND / CREATOR'}
              </h2>
            </div>
            <p className="text-xs font-mono text-neutral-400 mt-0.5">
              Configure partner profile, transparent logo, tournament details, and deliverables
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
          {/* Top Grid: Name, Category, Role, Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                BRAND / CREATOR NAME *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Picklefest Tournament"
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber font-sans font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                CATEGORY / SECTOR *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Sports & Tournament Media"
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                YOUR ROLE *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead Videographer & Editor"
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                BADGE / PARTNERSHIP TYPE
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Championship Partner, Campus Media"
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono text-neutral-300 mb-1">
              COLLABORATION DESCRIPTION &amp; HIGHLIGHTS *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Courtside high-velocity coverage, fast-turnaround vertical social reels, and promotional commercial ads for Rajasthan’s premier pickleball tournament."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cinema-amber resize-none leading-relaxed"
            />
          </div>

          {/* Brand Logo Upload & Emblem Selector */}
          <div className="glass-panel-subtle p-4 rounded-xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono text-cinema-amber font-semibold uppercase">
                BRAND LOGO (TRANSPARENT PNG / IMAGE)
              </label>
              <span className="text-[10px] font-mono text-neutral-400">
                Recommended: Transparent PNG
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Logo Preview Frame */}
              <div className="relative w-28 h-20 rounded-xl bg-black/80 border border-white/15 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-inner">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
                    onError={() => {}}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-neutral-500">
                    {renderEmblemIcon(iconType)}
                    <span className="text-[9px] font-mono mt-1 text-neutral-400">Emblem Mode</span>
                  </div>
                )}
              </div>

              {/* URL or Upload Input */}
              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Paste transparent logo URL (e.g. /brands/picklefest.png)"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cinema-amber"
                />

                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer flex items-center gap-1.5 border border-white/15 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-cinema-amber" />
                    <span>Upload Logo Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isLogoUploading}
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl('')}
                      className="text-xs font-mono text-neutral-400 hover:text-red-400 transition-colors"
                    >
                      Clear Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Fallback Icon Selector */}
            <div className="pt-2 border-t border-white/5">
              <span className="block text-[11px] font-mono text-neutral-400 mb-2">
                Fallback Emblem Icon (used when no logo image is attached):
              </span>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setIconType(opt.type)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
                      iconType === opt.type
                        ? 'bg-cinema-amber/20 border-cinema-amber/50 text-white shadow-sm'
                        : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Key Deliverables Tag Manager */}
          <div>
            <label className="block text-xs font-mono text-neutral-300 mb-1">
              KEY DELIVERABLES (TAG PILLS)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {deliverables.map((del, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-200 text-xs font-mono"
                >
                  <span>{del}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDeliverable(idx)}
                    className="hover:text-red-400 text-neutral-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDeliverable}
                onChange={(e) => setNewDeliverable(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDeliverable();
                  }
                }}
                placeholder="Type deliverable (e.g. 'Match Highlights', '9:16 Social Ads') and hit enter"
                className="flex-1 px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cinema-amber"
              />
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1 border border-white/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Tag
              </button>
            </div>
          </div>

          {/* Website / Instagram Link */}
          <div>
            <label className="block text-xs font-mono text-neutral-300 mb-1">
              WEBSITE OR SOCIAL URL (OPTIONAL)
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://instagram.com/brand or https://brand.com"
              className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cinema-amber"
            />
          </div>

          {/* Featured & Published Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-cinema-amber focus:ring-cinema-amber bg-black border-white/20"
              />
              <div>
                <span className="text-xs font-bold text-white block">Featured Brand Partner</span>
                <span className="text-[10px] text-neutral-400 font-mono">Emphasized with amber glow and card gradient</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-400 focus:ring-emerald-400 bg-black border-white/20"
              />
              <div>
                <span className="text-xs font-bold text-white block">Publicly Visible</span>
                <span className="text-[10px] text-neutral-400 font-mono">Displayed in portfolio Brands &amp; Creators section</span>
              </div>
            </label>
          </div>

          {/* Live Card Preview Box */}
          <div className="pt-2 border-t border-white/10">
            <span className="block text-xs font-mono text-cinema-amber font-semibold uppercase mb-2">
              LIVE CARD PREVIEW
            </span>
            <div className={`rounded-xl sm:rounded-2xl p-5 border ${
              featured
                ? 'bg-gradient-to-br from-white/[0.05] via-obsidian-950/80 to-black border-cinema-amber/40 shadow-lg'
                : 'glass-panel border-white/10'
            }`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="h-12 flex items-center justify-center p-2 rounded-xl bg-black/50 border border-white/10">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Preview" className="max-h-full max-w-[130px] object-contain" />
                  ) : (
                    <div className="w-9 h-9 flex items-center justify-center">
                      {renderEmblemIcon(iconType)}
                    </div>
                  )}
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border border-white/15 bg-white/5 text-neutral-300">
                  {badge || 'Partner'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-cinema-amber tracking-wider uppercase block">
                  {category || 'Category'}
                </span>
                <h4 className="text-base font-bold text-white font-sans mt-0.5">
                  {name || 'Brand / Creator Name'}
                </h4>
                <div className="my-1.5">
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
                    Role: <strong className="text-white">{role || 'Role'}</strong>
                  </span>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {description || 'Description will appear here...'}
                </p>
              </div>

              {deliverables.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1">
                  {deliverables.map((del, idx) => (
                    <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
                      {del}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 rounded-xl bg-cinema-amber/15 border border-cinema-amber/30 text-cinema-amber text-xs font-mono">
              {statusMessage}
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-neutral-300 font-mono text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cinema-amber hover:bg-amber-400 text-obsidian-950 font-bold font-mono text-xs transition-all shadow-lg shadow-cinema-amber/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>SAVE BRAND &amp; PARTNER</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
