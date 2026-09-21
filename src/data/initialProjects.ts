import { UserProfile, VideoProject } from '../types';

export const initialProfile: UserProfile = {
  name: "ALEXANDER VANCE",
  title: "Cinematographer & Lead Editor",
  tagline: "Sculpting light, rhythm, and emotion into timeless visual narratives.",
  bio: "Specializing in high-end commercial cinema, narrative music videos, and dynamic fashion reels. Bridging technical mastery with visceral storytelling across an 8-year journey of capturing frames across 14 countries.",
  location: "Los Angeles / Worldwide",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  equipment: [
    {
      category: "Camera Bodies",
      items: ["RED V-Raptor 8K VV", "Sony FX6 Cinema Line", "Blackmagic Cinema 6K Full Frame"]
    },
    {
      category: "Glass & Optics",
      items: ["Cooke Anamorphic /i Full Frame Plus", "Atlas Orion Silver Anamorphic Set", "Canon K35 Vintage Primes"]
    },
    {
      category: "Support & Aerial",
      items: ["DJI Inspire 3 (X9-8K Air)", "DJI Ronin 2 Professional Gimbal", "EasyRig Vario 5 with Cinema Gimbal Rig"]
    }
  ],
  software: [
    "DaVinci Resolve Studio (Advanced Color Grading)",
    "Adobe Premiere Pro (Offline Narrative Cuts)",
    "Adobe After Effects (VFX & Motion Graphics)",
    "Remotion (Programmatic Motion Video Code)"
  ],
  socials: [
    { platform: "Vimeo", url: "https://vimeo.com", handle: "vimeo.com/alexvance" },
    { platform: "YouTube", url: "https://youtube.com", handle: "youtube.com/@alexvancecinema" },
    { platform: "Instagram", url: "https://instagram.com", handle: "@alexvance.cine" },
    { platform: "Behance", url: "https://behance.net", handle: "behance.net/alexvance" }
  ],
  email: "alex@vancecinema.com",
  stats: [
    { label: "Commercials Directed", value: "48+" },
    { label: "Global Festival Selections", value: "12" },
    { label: "Total Views Delivered", value: "35M+" },
    { label: "Years Behind the Lens", value: "8" }
  ]
};

// High-quality demo video streams and posters
export const initialProjects: VideoProject[] = [
  {
    id: "proj-1",
    title: "NEO TOKYO: DRIFT IN CHROMIUM",
    slug: "neo-tokyo-drift-in-chromium",
    category: "Commercial",
    client: "Porsche Motorsport / Apex",
    year: "2026",
    runtime: "02:14",
    aspectRatio: "2.39:1",
    roles: ["Director of Photography", "Lead Colorist"],
    cameraGear: "RED V-Raptor 8K + Atlas Orion Anamorphic 40mm T2",
    editingSoftware: "DaVinci Resolve Studio & Premiere Pro",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    posterUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    description: "An adrenaline-fueled, anamorphic night tour through the rainy elevated expressways of Shinjuku and Daikoku Futo. Captured in native 8K RAW with practical sodium vapor backlighting, pushed through custom film-emulation Kodak 2383 print LUTs.",
    links: [
      { label: "Watch on Vimeo 4K", url: "https://vimeo.com" },
      { label: "Porsche Campaign Case Study", url: "https://behance.net" },
      { label: "BTS Breakdown (YouTube)", url: "https://youtube.com" }
    ],
    featured: true,
    isPublished: true,
    order: 1,
    beforeAfterGrade: {
      beforeUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&sat=-80&contrast=-30&q=80",
      afterUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
    },
    createdAt: "2026-08-15"
  },
  {
    id: "proj-2",
    title: "SOLARIS: ECHOES OF SILENCE",
    slug: "solaris-echoes-of-silence",
    category: "Music Video",
    client: "Astralwerks / M83 Collaborators",
    year: "2026",
    runtime: "03:45",
    aspectRatio: "16:9",
    roles: ["Director", "Editor"],
    cameraGear: "Sony FX6 + Cooke SF 50mm Prime",
    editingSoftware: "Adobe Premiere Pro & After Effects",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    description: "A surreal, ambient sci-fi narrative music video shot across the salt flats of Uyuni and volcanic black sands of Iceland. Combining high-speed 120fps cinematography with seamless in-camera match cuts and ethereal pacing.",
    links: [
      { label: "Official Music Video (YouTube)", url: "https://youtube.com" },
      { label: "Director's Cut on Vimeo", url: "https://vimeo.com" }
    ],
    featured: true,
    isPublished: true,
    order: 2,
    createdAt: "2026-07-02"
  },
  {
    id: "proj-3",
    title: "KINETIC HARVEST: ATELIER NOIR",
    slug: "kinetic-harvest-atelier-noir",
    category: "Social Reel",
    client: "Balenciaga / Highsnobiety",
    year: "2026",
    runtime: "00:45",
    aspectRatio: "9:16",
    roles: ["Solo Videographer & Editor"],
    cameraGear: "Sony FX3 Rigged Vertical + Sony GM 24-70mm f/2.8 II",
    editingSoftware: "Premiere Pro & Remotion Motion Graphics",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    posterUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    description: "A fast-paced, high-impact vertical runway reel combining speed-ramped whip pans, rhythmic bass-drop cuts, and custom typographic motion titles built specifically for Instagram Reels and TikTok viral curation.",
    links: [
      { label: "View on Instagram Reels", url: "https://instagram.com" },
      { label: "TikTok Audio Sync", url: "https://tiktok.com" }
    ],
    featured: false,
    isPublished: true,
    order: 3,
    createdAt: "2026-06-11"
  },
  {
    id: "proj-4",
    title: "VALLEY OF ASHES: CHAPTER IV",
    slug: "valley-of-ashes-chapter-iv",
    category: "Short Film",
    client: "Tribeca Film Institute Selection",
    year: "2025",
    runtime: "11:20",
    aspectRatio: "2.39:1",
    roles: ["Cinematographer"],
    cameraGear: "ARRI Alexa Mini LF + Canon K35 Vintage Set",
    editingSoftware: "DaVinci Resolve Studio",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    posterUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80",
    description: "A psychological period drama shot exclusively with natural candlelight and early-morning dusk blue hour. Emphasizes organic micro-contrast, halation on specular highlights, and deep shadow detail.",
    links: [
      { label: "Festival Screening Info", url: "https://tribecafilm.com" },
      { label: "Cinematography Essay", url: "https://theasc.com" }
    ],
    featured: true,
    isPublished: true,
    order: 4,
    createdAt: "2025-11-20"
  },
  {
    id: "proj-5",
    title: "CHROMATIC SHIFT: COMMERCIAL GRADE REEL",
    slug: "chromatic-shift-commercial-grade-reel",
    category: "Color Grading",
    client: "Nike, Apple, Spotify Campaigns",
    year: "2026",
    runtime: "01:30",
    aspectRatio: "16:9",
    roles: ["Senior Colorist"],
    cameraGear: "DaVinci Advanced Panel + Flanders Scientific XMP310",
    editingSoftware: "DaVinci Resolve Studio 19",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    posterUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    description: "A showreel demonstrating ACES color pipeline transformations from raw sensor flat log (Arri LogC4, RED IPP2, Sony S-Log3) to rich commercial print grades with custom spectral split-toning.",
    links: [
      { label: "LUT Pack & PowerGrades", url: "https://gumroad.com" },
      { label: "Color Grading Masterclass", url: "https://youtube.com" }
    ],
    featured: false,
    isPublished: true,
    order: 5,
    createdAt: "2026-05-18"
  }
];
