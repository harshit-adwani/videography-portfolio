import React, { useState } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  Eye, 
  EyeOff, 
  KeyRound, 
  LogOut, 
  Pencil, 
  Plus, 
  RotateCcw, 
  Trash2, 
  X 
} from 'lucide-react';
import { VideoProject } from '../../types';
import { storage } from '../../services/storage';
import { VideoEditModal } from './VideoEditModal';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectsUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onProjectsUpdated,
}) => {
  const [projects, setProjects] = useState<VideoProject[]>(() => storage.getProjects(true));
  const [editingProject, setEditingProject] = useState<VideoProject | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPasscodeChange, setShowPasscodeChange] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [passMessage, setPassMessage] = useState('');

  if (!isOpen) return null;

  const refreshList = () => {
    const list = storage.getProjects(true);
    setProjects(list);
    onProjectsUpdated();
  };

  const handleSaveProject = (data: Partial<VideoProject> & { title: string }) => {
    storage.saveProject(data);
    refreshList();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      storage.deleteProject(id);
      refreshList();
    }
  };

  const handleTogglePublish = (project: VideoProject) => {
    storage.saveProject({
      ...project,
      isPublished: !project.isPublished,
    });
    refreshList();
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const next = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;

    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;

    storage.reorderProjects(next);
    refreshList();
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all projects to factory demo items? Any custom projects will be cleared.")) {
      storage.resetToDefaults();
      refreshList();
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 4) {
      setPassMessage("Password must be at least 4 characters.");
      return;
    }
    storage.changePassword(newPass);
    setPassMessage("Passcode updated successfully!");
    setTimeout(() => {
      setShowPasscodeChange(false);
      setPassMessage('');
      setNewPass('');
    }, 1500);
  };

  const handleLogout = () => {
    storage.logout();
    onClose();
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
              Manage your live portfolio projects, uploads, and video links
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
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
              Reset Demo
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

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
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

      {/* Add / Edit Video Modal */}
      <VideoEditModal
        project={editingProject}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProject}
      />
    </div>
  );
};
