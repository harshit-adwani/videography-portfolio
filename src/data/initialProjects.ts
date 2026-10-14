import { UserProfile, VideoProject } from '../types';

export const initialProfile: UserProfile = {
  name: "HARSHIT ADWANI",
  title: "Visual Artist",
  tagline: "Find what you love and let it kill you",
  bio: "19 year old visual artist based in jaipur working with Cameras and Editing Softwares to create visual experiences, Covering events, quick deliverables and a pinch of creativity",
  location: "Jaipur",
  avatarUrl: "",
  equipment: [
    {
      category: "Camera Bodies & Capture",
      items: ["Sony ZV-E10", "iPhone 15 Pro (ProRes Log)"]
    },
    {
      category: "Glass & Mobile Rig",
      items: ["Sony E-Mount Lenses", "Gimbal & Handheld Rig"]
    },
    {
      category: "Focus & Delivery",
      items: ["Event Coverage", "Quick Deliverables & Creative Edits"]
    }
  ],
  software: [
    "Adobe Premiere Pro",
    "Adobe After Effects"
  ],
  socials: [
    { platform: "Instagram", url: "https://instagram.com/topper.mp4", handle: "@topper.mp4" }
  ],
  email: "harshitadwani2007@gmail.com",
  stats: [
    { label: "Age", value: "19" },
    { label: "Based In", value: "Jaipur" },
    { label: "Creative Focus", value: "Events & Reels" },
    { label: "Workflow", value: "Fast Turnaround" }
  ]
};

// High-quality projects and reels
export const initialProjects: VideoProject[] = [
  {
    id: "proj-1791998946763",
    title: "PickleFest Advertisement",
    slug: "picklefest-advertisement",
    category: "Commercial",
    client: "Picklefest",
    year: "2026",
    runtime: "01:30",
    aspectRatio: "9:16",
    roles: ["Director", "Editor"],
    cameraGear: "Sony ZV-E10 / Cinema Rig",
    editingSoftware: "Premiere Pro",
    videoUrl: "https://youtube.com/shorts/dWv07VWOYTg?si=6QKeqhxViwVv-Jzb",
    previewUrl: "https://youtube.com/shorts/dWv07VWOYTg?si=6QKeqhxViwVv-Jzb",
    posterUrl: "https://img.youtube.com/vi/dWv07VWOYTg/maxresdefault.jpg",
    description: "Cinematic reel embedded via YouTube 4K feed.",
    links: [
      {
        label: "Watch on YouTube",
        url: "https://youtube.com/shorts/dWv07VWOYTg?si=6QKeqhxViwVv-Jzb"
      }
    ],
    featured: false,
    isPublished: true,
    order: 1,
    createdAt: "2026-10-14"
  },
  {
    id: "proj-1791997502071",
    title: "A Temple on a hill",
    slug: "a-temple-on-a-hill",
    category: "Social Reel",
    client: "Personal",
    year: "2026",
    runtime: "01:30",
    aspectRatio: "16:9",
    roles: ["Director", "Editor"],
    cameraGear: "Sony ZV-E10",
    editingSoftware: "Premiere Pro",
    videoUrl: "https://youtube.com/shorts/UBd1uiS8OvU?si=x3hFWb8In2rj6XXR",
    previewUrl: "https://youtube.com/shorts/UBd1uiS8OvU?si=x3hFWb8In2rj6XXR",
    posterUrl: "https://img.youtube.com/vi/UBd1uiS8OvU/maxresdefault.jpg",
    description: "Cinematic reel embedded via YouTube 4K feed.",
    links: [
      {
        label: "Watch on YouTube",
        url: "https://youtube.com/shorts/UBd1uiS8OvU?si=x3hFWb8In2rj6XXR"
      }
    ],
    featured: false,
    isPublished: true,
    order: 2,
    createdAt: "2026-10-14"
  },
  {
    id: "proj-1792000278502",
    title: "Picklefest Ad 2",
    slug: "picklefest-ad-2",
    category: "Commercial",
    client: "Picklefest",
    year: "2026",
    runtime: "01:30",
    aspectRatio: "9:16",
    roles: ["Director"],
    cameraGear: "Sony ZV-E10 / Cinema Rig",
    editingSoftware: "Premiere Pro & After Effects",
    videoUrl: "https://youtu.be/Gw2_lWmVKXo",
    previewUrl: "https://youtu.be/Gw2_lWmVKXo",
    posterUrl: "https://img.youtube.com/vi/Gw2_lWmVKXo/maxresdefault.jpg",
    description: "Cinematic reel embedded via YouTube 4K feed.",
    links: [
      {
        label: "Watch on YouTube",
        url: "https://youtu.be/Gw2_lWmVKXo"
      }
    ],
    featured: false,
    isPublished: true,
    order: 3,
    createdAt: "2026-10-14"
  },
  {
    id: "proj-1790441388608",
    title: "JECRC SOCIALZ CAMPUS",
    slug: "jecrc-socialz-campus",
    category: "Commercial",
    client: "",
    year: "2026",
    runtime: "01:30",
    aspectRatio: "16:9",
    roles: ["Director", "Editor"],
    cameraGear: "Sony FX6 + Cine Primes",
    editingSoftware: "DaVinci Resolve Studio & Premiere Pro",
    videoUrl: "/uploads/videos/socialz_edit_1_9-1790441374536-4380.mp4",
    previewUrl: "/uploads/videos/socialz_edit_1_9-1790441374536-4380.mp4",
    posterUrl: "/uploads/posters/screenshot_2026-09-21_211239-1790441385233-7949.png",
    description: "",
    links: [
      {
        label: "Watch 4K Release",
        url: "https://vimeo.com"
      }
    ],
    featured: false,
    isPublished: true,
    order: 4,
    createdAt: "2026-09-26"
  }
];
