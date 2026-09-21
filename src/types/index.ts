export type ProjectCategory = 
  | 'Commercial' 
  | 'Music Video' 
  | 'Short Film' 
  | 'Social Reel' 
  | 'Color Grading' 
  | 'Documentary';

export interface ProjectLink {
  id?: string;
  label: string;
  url: string;
}

export interface VideoProject {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  client?: string;
  year: string;
  runtime: string;
  aspectRatio: '16:9' | '9:16' | '2.39:1' | '4:3';
  roles: string[];
  cameraGear: string;
  editingSoftware: string;
  videoUrl: string;
  previewUrl?: string; // Optional short clip for hover-scrubbing
  posterUrl: string;
  description: string;
  links: ProjectLink[];
  featured?: boolean;
  isPublished: boolean;
  order?: number;
  beforeAfterGrade?: {
    beforeUrl: string;
    afterUrl: string;
  };
  createdAt: string;
}

export interface UserProfile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  avatarUrl: string;
  equipment: {
    category: string;
    items: string[];
  }[];
  software: string[];
  socials: {
    platform: string;
    url: string;
    handle: string;
  }[];
  email: string;
  stats: {
    label: string;
    value: string;
  }[];
}
