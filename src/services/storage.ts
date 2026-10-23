import { initialProfile, initialProjects } from '../data/initialProjects';
import { initialBrands } from '../data/initialBrands';
import { BrandCollaborator, UserProfile, VideoProject } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'cine_portfolio_projects_v1',
  BRANDS: 'cine_portfolio_brands_v1',
  PROFILE: 'cine_portfolio_profile_v1',
  ADMIN_AUTH: 'cine_portfolio_admin_auth',
  ADMIN_PASS: 'cine_portfolio_admin_pass',
};

// Default admin passcode for demo (can be modified in settings)
const DEFAULT_ADMIN_PASS = 'cinema2026';

class StorageService {
  // --- AUTHENTICATION ---
  public login(password: string): boolean {
    const savedPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || DEFAULT_ADMIN_PASS;
    if (password === savedPass) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  }

  public logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }

  public isAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  }

  public changePassword(newPass: string): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, newPass);
  }

  // --- PROJECTS CRUD ---
  public getProjects(includeDrafts = false): VideoProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (!data) {
        // Initialize with default demo projects
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
        return includeDrafts ? initialProjects : initialProjects.filter(p => p.isPublished);
      }
      const projects: VideoProject[] = JSON.parse(data);
      const sorted = projects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return includeDrafts ? sorted : sorted.filter(p => p.isPublished);
    } catch (e) {
      console.error("Failed to load projects from storage", e);
      return initialProjects;
    }
  }

  public getProjectById(id: string): VideoProject | undefined {
    const all = this.getProjects(true);
    return all.find(p => p.id === id);
  }

  public saveProject(project: Partial<VideoProject> & { title: string }): VideoProject {
    const current = this.getProjects(true);
    const existingIndex = current.findIndex(p => p.id === project.id);

    let savedProject: VideoProject;

    if (existingIndex >= 0) {
      // Update
      savedProject = {
        ...current[existingIndex],
        ...project,
        slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      } as VideoProject;
      current[existingIndex] = savedProject;
    } else {
      // Create new
      const id = project.id || `proj-${Date.now()}`;
      savedProject = {
        id,
        title: project.title,
        slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        category: project.category || 'Commercial',
        client: project.client || '',
        year: project.year || new Date().getFullYear().toString(),
        runtime: project.runtime || '01:00',
        aspectRatio: project.aspectRatio || '16:9',
        roles: project.roles?.length ? project.roles : ['Cinematographer', 'Editor'],
        cameraGear: project.cameraGear || 'Cinema Camera Rig',
        editingSoftware: project.editingSoftware || 'DaVinci Resolve Studio',
        videoUrl: project.videoUrl || '',
        previewUrl: project.previewUrl || project.videoUrl || '',
        posterUrl: project.posterUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        description: project.description || '',
        links: project.links || [],
        featured: project.featured ?? false,
        isPublished: project.isPublished ?? true,
        order: current.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      current.push(savedProject);
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(current));
    return savedProject;
  }

  public deleteProject(id: string): boolean {
    const current = this.getProjects(true);
    const filtered = current.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
    return filtered.length !== current.length;
  }

  public reorderProjects(newOrder: VideoProject[]): void {
    const reordered = newOrder.map((p, idx) => ({ ...p, order: idx + 1 }));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(reordered));
  }

  public resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(initialBrands));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initialProfile));
  }

  // --- BRANDS & CREATORS ---
  public getBrands(includeDrafts = false): BrandCollaborator[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BRANDS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(initialBrands));
        return includeDrafts ? initialBrands : initialBrands.filter(b => b.isPublished !== false);
      }
      const brands: BrandCollaborator[] = JSON.parse(data);
      const sorted = brands.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return includeDrafts ? sorted : sorted.filter(b => b.isPublished !== false);
    } catch (e) {
      console.error("Failed to load brands from storage", e);
      return initialBrands;
    }
  }

  public saveBrand(brand: Partial<BrandCollaborator> & { name: string }): BrandCollaborator {
    const current = this.getBrands(true);
    const existingIndex = current.findIndex(b => b.id === brand.id);
    let savedBrand: BrandCollaborator;

    if (existingIndex >= 0) {
      savedBrand = {
        ...current[existingIndex],
        ...brand,
      } as BrandCollaborator;
      current[existingIndex] = savedBrand;
    } else {
      const id = brand.id || `brand-${Date.now()}`;
      savedBrand = {
        id,
        name: brand.name,
        category: brand.category || 'Brand Partner',
        role: brand.role || 'Videographer & Editor',
        badge: brand.badge || 'Collaborator',
        logoUrl: brand.logoUrl || '',
        iconType: brand.iconType || 'building',
        description: brand.description || '',
        deliverables: brand.deliverables || [],
        websiteUrl: brand.websiteUrl || '',
        featured: brand.featured ?? false,
        isPublished: brand.isPublished ?? true,
        order: current.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      current.push(savedBrand);
    }

    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(current));
    return savedBrand;
  }

  public deleteBrand(id: string): boolean {
    const current = this.getBrands(true);
    const filtered = current.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(filtered));
    return filtered.length !== current.length;
  }

  public reorderBrands(newOrder: BrandCollaborator[]): void {
    const reordered = newOrder.map((b, idx) => ({ ...b, order: idx + 1 }));
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(reordered));
  }

  // --- USER PROFILE ---
  public getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initialProfile));
        return initialProfile;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to load profile", e);
      return initialProfile;
    }
  }

  public saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }
}

export const storage = new StorageService();
