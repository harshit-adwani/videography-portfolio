import { initialProfile, initialProjects } from '../data/initialProjects';
import { UserProfile, VideoProject } from '../types';

const API_BASE = '/api';

class ApiService {
  private isOnline = true;

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  // --- PROJECTS API ---
  public async getProjects(): Promise<VideoProject[]> {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) {
        const data = await res.json();
        this.isOnline = true;
        // Also update local cache for instant offline fallback
        localStorage.setItem('cine_portfolio_projects_v1', JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable, using local cache:', err);
      this.isOnline = false;
    }

    // Fallback to localStorage or initial
    try {
      const local = localStorage.getItem('cine_portfolio_projects_v1');
      if (local) return JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
    return initialProjects;
  }

  public async saveProject(project: Partial<VideoProject> & { title: string }): Promise<VideoProject> {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (res.ok) {
        const saved = await res.json();
        return saved;
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable for save, fallback to local:', err);
    }

    // Local fallback
    const local = localStorage.getItem('cine_portfolio_projects_v1');
    const projects: VideoProject[] = local ? JSON.parse(local) : [...initialProjects];
    const idx = projects.findIndex((p) => p.id === project.id);
    let saved: VideoProject;
    if (idx >= 0) {
      saved = { ...projects[idx], ...project } as VideoProject;
      projects[idx] = saved;
    } else {
      saved = {
        ...project,
        id: project.id || `proj-${Date.now()}`,
        order: projects.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
      } as VideoProject;
      projects.push(saved);
    }
    localStorage.setItem('cine_portfolio_projects_v1', JSON.stringify(projects));
    return saved;
  }

  public async deleteProject(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (err) {
      console.warn('[ApiService] Server unreachable for delete, fallback to local:', err);
    }

    const local = localStorage.getItem('cine_portfolio_projects_v1');
    if (local) {
      const projects: VideoProject[] = JSON.parse(local);
      const filtered = projects.filter((p) => p.id !== id);
      localStorage.setItem('cine_portfolio_projects_v1', JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  public async reorderProjects(orderedProjects: VideoProject[]): Promise<void> {
    try {
      await fetch(`${API_BASE}/projects/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedProjects }),
      });
    } catch (err) {
      console.warn('[ApiService] Server unreachable for reorder:', err);
    }
    localStorage.setItem('cine_portfolio_projects_v1', JSON.stringify(orderedProjects));
  }

  // --- PROFILE API ---
  public async getProfile(): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/profile`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.name) {
          localStorage.setItem('cine_portfolio_profile_v1', JSON.stringify(data));
          return data;
        }
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable for profile:', err);
    }

    try {
      const local = localStorage.getItem('cine_portfolio_profile_v1');
      if (local) return JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
    return initialProfile;
  }

  public async saveProfile(profile: UserProfile): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        const saved = await res.json();
        localStorage.setItem('cine_portfolio_profile_v1', JSON.stringify(saved));
        return saved;
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable for profile save:', err);
    }
    localStorage.setItem('cine_portfolio_profile_v1', JSON.stringify(profile));
    return profile;
  }

  // --- FILE UPLOADS WITH PROGRESS & PERMANENT URLS ---
  public async uploadVideoFile(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('video', file);

      xhr.open('POST', `${API_BASE}/upload/video`);

      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            resolve(res.url);
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during video upload'));
      xhr.send(formData);
    });
  }

  public async uploadPosterFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('poster', file);

    const res = await fetch(`${API_BASE}/upload/poster`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Poster upload failed');
    const data = await res.json();
    return data.url;
  }

  public async uploadAvatarFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch(`${API_BASE}/upload/avatar`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Avatar upload failed');
    const data = await res.json();
    return data.url;
  }

  // --- AUTH ---
  public async login(password: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        localStorage.setItem('cine_portfolio_admin_auth', 'true');
        return true;
      }
    } catch (err) {
      console.warn('[ApiService] Server offline for auth, check local fallback:', err);
    }

    const savedPass = localStorage.getItem('cine_portfolio_admin_pass') || 'cinema2026';
    if (password === savedPass) {
      localStorage.setItem('cine_portfolio_admin_auth', 'true');
      return true;
    }
    return false;
  }

  public logout(): void {
    localStorage.removeItem('cine_portfolio_admin_auth');
  }

  public isAuthenticated(): boolean {
    return localStorage.getItem('cine_portfolio_admin_auth') === 'true';
  }

  public async changePassword(newPass: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPass }),
      });
      if (res.ok) {
        localStorage.setItem('cine_portfolio_admin_pass', newPass);
        return true;
      }
    } catch (err) {
      console.warn('[ApiService] Server offline for password change:', err);
    }
    localStorage.setItem('cine_portfolio_admin_pass', newPass);
    return true;
  }
}

export const api = new ApiService();
