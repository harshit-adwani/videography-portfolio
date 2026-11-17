import { UserProfile, VideoProject } from '../types';

export const initialProfile: UserProfile = {
  name: "HARSHIT ADWANI",
  title: "Visual Artist",
  tagline: "Find what you love and let it kill you",
  bio: "19 year old visual artist based in Jaipur working with cameras and editing software to create visual experiences. Covering events, creative edits, and reels.",
  location: "Jaipur",
  avatarUrl: "",
  equipment: [
    {
      category: "Cameras",
      items: ["Sony ZV-E10", "iPhone 15 Pro"]
    },
    {
      category: "Lens & Setup",
      items: ["Sony 16-50mm Kit Lens", "Handheld Setup"]
    },
    {
      category: "Focus",
      items: ["Event Coverage", "Creative Edits & Reels"]
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
    { label: "Focus", value: "Events & Reels" },
    { label: "Style", value: "Creative" }
  ],
  showBrandsAndLogos: true
};

// High-quality projects and reels organized topicwise
export const initialProjects: VideoProject[] = [
  {
    id: "proj-alive-cafe-promo",
    title: "Alive Café Commercial Promo",
    slug: "alive-cafe-commercial-promo",
    category: "Commercial",
    categoryId: "brand-alive-cafe",
    client: "Alive Café & Restro",
    year: "2026",
    runtime: "00:45",
    aspectRatio: "9:16",
    roles: ["Director", "Videographer", "Editor"],
    videoUrl: "https://www.instagram.com/reel/DCk3kVuhg0n/",
    previewUrl: "https://www.instagram.com/reel/DCk3kVuhg0n/",
    posterUrl: "/brands/alive-cafe.jpg",
    description: "Shot promotional commercial ads, aesthetic ambiance showcases, and social media reels for Alive Café & Restro in Mansarovar, Jaipur.",
    links: [
      {
        label: "Watch on Instagram",
        url: "https://instagram.com/topper.mp4"
      }
    ],
    featured: true,
    isPublished: true,
    order: 1,
    createdAt: "2026-11-15"
  },
  {
    id: "proj-1792740403122",
    title: "Jecrc Campus Edit",
    slug: "jecrc-campus-edit",
    category: "Social Reel",
    categoryId: "brand-jecrc-socialz",
    client: "JECRC Socialz",
    year: "2026",
    runtime: "01:30",
    aspectRatio: "9:16",
    roles: ["Editor"],
    videoUrl: "https://www.instagram.com/p/DeHWYQuspRc/",
    previewUrl: "https://www.instagram.com/p/DeHWYQuspRc/",
    posterUrl: "/uploads/posters/screenshot_2026-10-23_125521-1792740401364-9077.png",
    description: "Campus lifestyle highlights and youth culture reel created for JECRC Socialz.",
    links: [
      {
        label: "Watch on Instagram",
        url: "https://www.instagram.com/p/DeHWYQuspRc/"
      }
    ],
    featured: false,
    isPublished: true,
    order: 2,
    createdAt: "2026-10-23"
  },
  {
    id: "proj-1792740096757",
    title: "Picklefest Ad 3",
    slug: "picklefest-ad-3",
    category: "Social Reel",
    categoryId: "brand-picklefest",
    client: "Picklefest Tournament",
    year: "2026",
    runtime: "01:30",
    aspectRatio: "9:16",
    roles: ["Videographer", "Editor"],
    videoUrl: "https://www.instagram.com/p/Daj8epJzN0r/",
    previewUrl: "https://www.instagram.com/p/Daj8epJzN0r/",
    posterUrl: "/uploads/posters/whatsapp_image_2026-10-23_at_12_52_55_pm-1792740216570-5042.jpeg",
    description: "Ideation, screenwriting, shooting, and editing for Picklefest sports tournament in Ajmer.",
    links: [
      {
        label: "Watch on Instagram",
        url: "https://www.instagram.com/p/Daj8epJzN0r/"
      }
    ],
    featured: false,
    isPublished: true,
    order: 3,
    createdAt: "2026-10-23"
  },
  {
    id: "proj-1792755834382",
    title: "Let's Play BTS Edit",
    slug: "let-s-play-bts-edit",
    category: "Social Reel",
    categoryId: "brand-lets-play",
    client: "Let's Play",
    year: "2026",
    runtime: "00:45",
    aspectRatio: "9:16",
    roles: ["Director", "Editor", "Visual Artist"],
    videoUrl: "https://www.instagram.com/p/Dck3kVuhg0n/",
    previewUrl: "https://www.instagram.com/p/Dck3kVuhg0n/",
    posterUrl: "/uploads/posters/screenshot_2026-10-23_171343-1792755832361-5132.png",
    description: "Vertical BTS Reel capturing dynamic movement and behind-the-scenes energy.",
    links: [
      {
        label: "Watch on Instagram",
        url: "https://www.instagram.com/p/Dck3kVuhg0n/"
      }
    ],
    featured: false,
    isPublished: true,
    order: 4,
    createdAt: "2026-10-23"
  },
  {
    id: "proj-1791998946763",
    title: "PickleFest Advertisement",
    slug: "picklefest-advertisement",
    category: "Commercial",
    categoryId: "brand-picklefest",
    client: "Picklefest Tournament",
    year: "2026",
    runtime: "01:30",
    aspectRatio: "9:16",
    roles: ["Director", "Editor"],
    videoUrl: "https://youtube.com/shorts/dWv07VWOYTg?si=6QKeqhxViwVv-Jzb",
    previewUrl: "https://youtube.com/shorts/dWv07VWOYTg?si=6QKeqhxViwVv-Jzb",
    posterUrl: "https://img.youtube.com/vi/dWv07VWOYTg/maxresdefault.jpg",
    description: "High-intensity vertical commercial reel shot courtside at the Picklefest tournament in Ajmer. Fast-paced rally cuts, dynamic paddle action, and hype sound design.",
    links: [
      {
        label: "Watch on YouTube",
        url: "https://youtube.com/shorts/dWv07VWOYTg?si=6QKeqhxViwVv-Jzb"
      }
    ],
    featured: false,
    isPublished: true,
    order: 5,
    createdAt: "2026-10-14"
  },
  {
    id: "proj-1792756108247",
    title: "If i could make days last forever",
    slug: "if-i-could-make-days-last-forever",
    category: "Commercial",
    categoryId: "brand-creative-visuals",
    client: "Cinematic & Personal Visuals",
    year: "2026",
    runtime: "01:30",
    aspectRatio: "9:16",
    roles: ["Director", "Editor"],
    videoUrl: "https://www.youtube.com/shorts/DFaXxwbmRE0",
    previewUrl: "https://www.youtube.com/shorts/DFaXxwbmRE0",
    posterUrl: "https://img.youtube.com/vi/DFaXxwbmRE0/maxresdefault.jpg",
    description: "Cinematic aesthetic reel capturing fleeting moments and poetic pacing.",
    links: [
      {
        label: "Watch on YouTube",
        url: "https://www.youtube.com/shorts/DFaXxwbmRE0"
      }
    ],
    featured: false,
    isPublished: true,
    order: 6,
    createdAt: "2026-10-23"
  },
  {
    id: "proj-1792000278502",
    title: "Picklefest Ad 2",
    slug: "picklefest-ad-2",
    category: "Commercial",
    categoryId: "brand-picklefest",
    client: "Picklefest Tournament",
    year: "2026",
    runtime: "01:30",
    aspectRatio: "9:16",
    roles: ["Director", "Editor"],
    videoUrl: "https://youtu.be/Gw2_lWmVKXo",
    previewUrl: "https://youtu.be/Gw2_lWmVKXo",
    posterUrl: "https://img.youtube.com/vi/Gw2_lWmVKXo/maxresdefault.jpg",
    description: "Official tournament promo reel and commercial ad for Picklefest. Emphasizing player intensity, championship atmosphere, and courtside energy.",
    links: [
      {
        label: "Watch on YouTube",
        url: "https://youtu.be/Gw2_lWmVKXo"
      }
    ],
    featured: false,
    isPublished: true,
    order: 7,
    createdAt: "2026-10-14"
  },
  {
    id: "proj-1791997502071",
    title: "A Temple on a hill",
    slug: "a-temple-on-a-hill",
    category: "Social Reel",
    categoryId: "brand-creative-visuals",
    client: "Cinematic & Personal Visuals",
    year: "2026",
    runtime: "01:30",
    aspectRatio: "16:9",
    roles: ["Director", "Editor"],
    videoUrl: "https://youtube.com/shorts/UBd1uiS8OvU?si=x3hFWb8In2rj6XXR",
    previewUrl: "https://youtube.com/shorts/UBd1uiS8OvU?si=x3hFWb8In2rj6XXR",
    posterUrl: "https://img.youtube.com/vi/UBd1uiS8OvU/maxresdefault.jpg",
    description: "Cinematic visual exploration of heritage and architecture.",
    links: [
      {
        label: "Watch on YouTube",
        url: "https://youtube.com/shorts/UBd1uiS8OvU?si=x3hFWb8In2rj6XXR"
      }
    ],
    featured: false,
    isPublished: true,
    order: 8,
    createdAt: "2026-10-14"
  },
  {
    id: "proj-1790441388608",
    title: "JECRC Campus Collab Edit",
    slug: "jecrc-campus-collab-edit",
    category: "Social Reel",
    categoryId: "brand-jecrc-socialz",
    client: "JECRC Socialz",
    year: "2026",
    runtime: "01:30",
    aspectRatio: "16:9",
    roles: ["Videographer", "Editor"],
    videoUrl: "/uploads/videos/socialz_edit_1_9-1790441374536-4380.mp4",
    previewUrl: "/uploads/videos/socialz_edit_1_9-1790441374536-4380.mp4",
    posterUrl: "/uploads/posters/screenshot_2026-09-21_211239-1790441385233-7949.png",
    description: "Campus collaborative coverage and full-length edit for collegiate event.",
    links: [],
    featured: false,
    isPublished: true,
    order: 9,
    createdAt: "2026-09-26"
  }
];
