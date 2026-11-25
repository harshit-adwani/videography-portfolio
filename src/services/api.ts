import { BrandCollaborator, UserProfile, VideoProject } from '../types';
import { storage } from './storage';
import { fileToOptimizedDataUrl } from '../utils/imageUpload';

const API_BASE = '/api';

class ApiService {
  private isOnline = true;
  private storageMode: 'redis' | 'static' | 'unknown' = 'unknown';

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public getStorageMode(): 'redis' | 'static' | 'unknown' {
    return this.storageMode;
  }

  private updateStorageMode(res: Response): void {
    const mode = res.headers.get('X-Storage-Mode');
    if (mode === 'redis' || mode === 'static') {
      this.storageMode = mode;
    }
  }

  public async syncLocalToCloud(): Promise<boolean> {
    try {
      const localProjects = storage.getProjects(true);
      const localBrands = storage.getBrands(true);
      const localProfile = storage.getProfile();

      const [pRes, bRes, profRes] = await Promise.all([
        fetch(`${API_BASE}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ syncAll: localProjects }),
        }),
        fetch(`${API_BASE}/brands`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ syncAll: localBrands }),
        }),
        fetch(`${API_BASE}/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(localProfile),
        }),
      ]);

      if (pRes.ok && bRes.ok && profRes.ok) {
        this.updateStorageMode(pRes);
        if (this.storageMode === 'redis') {
          storage.clearCustomEditsFlag();
          return true;
        }
      }
    } catch (err) {
      console.warn('[ApiService] Failed to sync local edits to cloud:', err);
    }
    return false;
  }

  // --- PROJECTS API ---
  public async getProjects(includeDrafts = true): Promise<VideoProject[]> {
    try {
      const res = await fetch(`${API_BASE}/projects`, { cache: 'no-store' });
      if (res.ok) {
        this.updateStorageMode(res);
        const data = await res.json();
        this.isOnline = true;
        if (this.storageMode === 'redis' && !storage.hasCustomEdits()) {
          if (Array.isArray(data) && data.length > 0) {
            localStorage.setItem('cine_portfolio_projects_v1', JSON.stringify(data));
            const sorted = data.sort((a: VideoProject, b: VideoProject) => (a.order ?? 0) - (b.order ?? 0));
            return includeDrafts ? sorted : sorted.filter((p: VideoProject) => p.isPublished);
          }
        } else if (!storage.hasCustomEdits() && Array.isArray(data) && data.length > 0) {
          localStorage.setItem('cine_portfolio_projects_v1', JSON.stringify(data));
          return includeDrafts ? data : data.filter((p: VideoProject) => p.isPublished);
        }
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable for projects, using local cache:', err);
      this.isOnline = false;
    }

    return storage.getProjects(includeDrafts);
  }

  public async saveProject(project: Partial<VideoProject> & { title: string }): Promise<VideoProject> {
    // 1. Synchronously persist to local store
    const saved = storage.saveProject(project);

    // 2. Write to backend server (Redis / local file)
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saved),
      });
      if (res.ok) {
        this.isOnline = true;
        this.updateStorageMode(res);
        if (this.storageMode === 'redis') {
          storage.clearCustomEditsFlag();
        }
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable for saveProject:', err);
      this.isOnline = false;
    }

    return saved;
  }

  public async deleteProject(id: string): Promise<boolean> {
    // 1. Synchronously delete from local store
    const success = storage.deleteProject(id);

    // 2. Delete from backend server
    try {
      const res = await fetch(`${API_BASE}/projects/${id}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        this.isOnline = true;
        this.updateStorageMode(res);
        if (this.storageMode === 'redis') {
          storage.clearCustomEditsFlag();
        }
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable for deleteProject:', err);
      this.isOnline = false;
    }

    return success;
  }

  public async reorderProjects(orderedProjects: VideoProject[]): Promise<void> {
    // 1. Synchronously reorder in local store
    storage.reorderProjects(orderedProjects);

    // 2. Reorder on backend server
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedProjects }),
      });
      if (res.ok) {
        this.updateStorageMode(res);
        if (this.storageMode === 'redis') {
          storage.clearCustomEditsFlag();
        }
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable for project reorder:', err);
    }
  }

  // --- BRANDS & CATEGORIES API ---
  public async getBrands(includeDrafts = true): Promise<BrandCollaborator[]> {
    try {
      const res = await fetch(`${API_BASE}/brands`, { cache: 'no-store' });
      if (res.ok) {
        this.updateStorageMode(res);
        const data = await res.json();
        this.isOnline = true;
        if (this.storageMode === 'redis' && !storage.hasCustomEdits()) {
          if (Array.isArray(data) && data.length > 0) {
            localStorage.setItem('cine_portfolio_brands_v1', JSON.stringify(data));
            const sorted = data.sort((a: BrandCollaborator, b: BrandCollaborator) => (a.order ?? 0) - (b.order ?? 0));
            return includeDrafts ? sorted : sorted.filter((b: BrandCollaborator) => b.isPublished !== false);
          }
        } else if (!storage.hasCustomEdits() && Array.isArray(data) && data.length > 0) {
          localStorage.setItem('cine_portfolio_brands_v1', JSON.stringify(data));
          return includeDrafts ? data : data.filter((b: BrandCollaborator) => b.isPublished !== false);
        }
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable for brands, using local cache:', err);
      this.isOnline = false;
    }

    return storage.getBrands(includeDrafts);
  }

  public async saveBrand(brand: Partial<BrandCollaborator> & { name: string }): Promise<BrandCollaborator> {
    // 1. Synchronously persist to local store
    const saved = storage.saveBrand(brand);

    // 2. Write to backend server
    try {
      const res = await fetch(`${API_BASE}/brands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saved),
      });
      if (res.ok) {
        this.isOnline = true;
        this.updateStorageMode(res);
        if (this.storageMode === 'redis') {
          storage.clearCustomEditsFlag();
        }
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable for brand save:', err);
      this.isOnline = false;
    }

    return saved;
  }

  public async deleteBrand(id: string): Promise<boolean> {
    // 1. Synchronously delete from local store
    const success = storage.deleteBrand(id);

    // 2. Delete from backend server
    try {
      const res = await fetch(`${API_BASE}/brands/${id}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        this.isOnline = true;
        this.updateStorageMode(res);
        if (this.storageMode === 'redis') {
          storage.clearCustomEditsFlag();
        }
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable for brand delete:', err);
      this.isOnline = false;
    }

    return success;
  }

  public async reorderBrands(orderedBrands: BrandCollaborator[]): Promise<void> {
    // 1. Synchronously reorder in local store
    storage.reorderBrands(orderedBrands);

    // 2. Reorder on backend server
    try {
      const res = await fetch(`${API_BASE}/brands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedBrands }),
      });
      if (res.ok) {
        this.updateStorageMode(res);
        if (this.storageMode === 'redis') {
          storage.clearCustomEditsFlag();
        }
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable for brand reorder:', err);
    }
  }

  public async uploadBrandLogoFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const res = await fetch(`${API_BASE}/upload/brand-logo`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (data && data.url) return data.url;
        } catch (_) {
          // If response is not JSON (e.g. index.html SPA fallback on Vercel), continue to data URL fallback
        }
      }
    } catch (err) {
      console.warn('[ApiService] Server upload failed, using optimized Data URL fallback:', err);
    }

    // High-performance fallback: Convert image directly to optimized transparent Data URL
    return fileToOptimizedDataUrl(file, 512, 512);
  }

  // --- PROFILE API ---
  public async getProfile(): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/profile`, { cache: 'no-store' });
      if (res.ok) {
        this.updateStorageMode(res);
        const data = await res.json();
        if (data && data.name && !storage.hasCustomEdits()) {
          localStorage.setItem('cine_portfolio_profile_v1', JSON.stringify(data));
          return data;
        }
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable for profile, using local cache:', err);
    }

    return storage.getProfile();
  }

  public async saveProfile(profile: UserProfile): Promise<UserProfile> {
    // 1. Synchronously persist to local store
    storage.saveProfile(profile);

    // 2. Write to backend server
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        this.isOnline = true;
        this.updateStorageMode(res);
        if (this.storageMode === 'redis') {
          storage.clearCustomEditsFlag();
        }
      }
    } catch (err) {
      console.warn('[ApiService] Server unreachable for profile save:', err);
    }

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
    try {
      const formData = new FormData();
      formData.append('poster', file);

      const res = await fetch(`${API_BASE}/upload/poster`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (data && data.url) return data.url;
        } catch (_) {}
      }
    } catch (err) {
      console.warn('[ApiService] Server upload failed for poster, using data URL fallback:', err);
    }

    return fileToOptimizedDataUrl(file, 1280, 720, 0.85);
  }

  public async uploadAvatarFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch(`${API_BASE}/upload/avatar`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (data && data.url) return data.url;
        } catch (_) {}
      }
    } catch (err) {
      console.warn('[ApiService] Server upload failed for avatar, using data URL fallback:', err);
    }

    return fileToOptimizedDataUrl(file, 400, 400, 0.9);
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
