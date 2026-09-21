# 🎥 Cinematic Videography & Video Editing Portfolio
## Master Production Plan & Engineering Roadmap (v2.0)

This document is the master blueprint and live production roadmap for the personal 3D Videography & Video Editing Portfolio. It incorporates the signature **3D camera viewfinder hero**, the **frosted glass gallery with information sidebars**, the **top-left translucent profile modal**, the **expanded cinema player**, and the **authenticated admin dashboard** for public production deployment.

---

## 1. Core Experience & Visual Design System

### A. The 3D Camera Hero & Stationary Viewfinder ("Through the Lens")
1. **Launch / Landing View**:
   - 3D cinema camera floating in an ambient dark studio setting.
   - Micro-interactions: Subtle mouse parallax tilt, lens reflections, and ambient floating motion.
   - Minimalist prompt: *"Scroll to Peek Through the Viewfinder"*.
2. **Scroll Choreography & Viewfinder Alignment**:
   - As the visitor scrolls down, the 3D camera smoothly rotates 180° so the rear optical viewfinder / monitor turns directly toward the screen.
   - The camera dollies forward in 3D space, closing the gap until the viewfinder frames the entire screen.
3. **Stationary Viewfinder & Camera Playback Mode**:
   - **Viewfinder & UI Stay Stationary**: The camera frame and live camera HUD telemetry (ISO 800, Shutter 180°, 23.98 FPS, blinking REC/PLAY dot, battery, audio meters, framing guides) remain **fixed and stationary** on screen.
   - **Internal Gallery Scroll**: The video showcase gallery scrolls smoothly *inside* the camera viewfinder, acting as the camera's master recorded playback roll / media library.
   - As the user scrolls through projects, the viewfinder HUD live-updates (e.g. `CLIP 01/05`, timecodes, audio channels).

### B. High-Quality 3D Camera Model Integration
- Built-in support for any photorealistic external `.glb` / `.gltf` model placed in `public/models/camera.glb` (e.g. Sony FX3, RED V-Raptor, ARRI Alexa Mini, or Leica M-series).
- Automatic asynchronous model loader (`useGLTF`) with smooth geometry fallback.

### C. Audio & Sound FX (SFX) Pipeline (Planned)
- Mechanical camera shutter snap when peering into the viewfinder.
- Subtle rotary dial clicks when hovering and selecting project categories.
- Vintage film / tape motor ambient whir during scroll transitions.
- Master Mute / Unmute audio toggle in the navigation bar.

### D. Translucent Profile Dialogue (Top-Left Corner)
- **Trigger**: Minimalist floating glass profile avatar fixed in top-left.
- **Backdrop Dismiss**: Clicking anywhere outside the dialog smoothly dismisses it with a fade-out animation.
- Contains bio, director statement, gear locker, editing pipeline, and booking links.

### C. The Translucent Modern Glass Gallery
- **Aesthetic**: Deep obsidian backdrop, floating translucent cards with layered blurs, subtle neon amber/red highlights, buttery-smooth scrolling.
- **Card + Sidebar Architecture**:
  - Each video item is paired with an **Information Sidebar**:
    - Project title, category badge (Commercial, Music Video, Narrative, Reel, Color Grading).
    - Client name, release year, aspect ratio (16:9, 9:16, 2.39:1 anamorphic), runtime.
    - Role tags (Director, Cinematographer, Lead Editor, Colorist).
    - Quick-scrub video preview on hover (moving cursor across scrubs frames).
- **Infinite Scalability & Customizability**:
  - Designed to support anywhere from 3 to 100+ videos without layout breakage or performance degradation (virtualized or lazy-loaded video previews).

### D. Expanded Cinema Player (Full-Quality View)
- When any video in the gallery is clicked:
  - Opens a distraction-free, full-screen cinema overlay.
  - Plays the **full-quality** master video file (or high-res embed).
  - Accompanied by an **expanded translucent sidebar**:
    - Comprehensive project breakdown and storytelling behind the cut.
    - Full technical specifications (camera rig, lens choice, color grade LUT notes).
    - Placeholders for external links (Client Website, YouTube 4K, Vimeo Staff Pick, Behance case study, Instagram reel).
    - Minimal, sleek playback controls (Mute/Unmute, Timeline scrubber, Quality toggle, Close).

---

## 2. Authenticated Admin Dashboard (For Public Deployment)

To allow effortless management of projects without redeploying code, the website features a secure, lightweight, and modern **Admin Suite** at `/admin`.

### A. Authentication & Security
- Secure admin login screen with password/credential authentication (JWT session tokens with HttpOnly cookies or Supabase Auth).
- Protected route middleware guarding `/admin/*`.
- Rate-limiting / protection against brute-force logins.

### B. Project Management Operations (CRUD)
- **Project List View**:
  - Visual list/grid of all videos currently in the portfolio.
  - Drag-and-drop reordering to prioritize featured projects.
  - Quick toggles: *Publish / Draft*, *Featured in Hero*, *Category Filter*.
  - Instant Edit and Delete actions.
- **Add / Edit Video Modal & Form**:
  - **Title & Slug**: Automated URL slug generation.
  - **Category**: Commercial, Music Video, Short Film, Social Reel, Color Grading, Documentary.
  - **Video Source Flexibility**:
    1. *Cloud Upload*: Direct upload to cloud storage (Supabase Storage, Cloudinary, or AWS S3).
    2. *External Stream*: Paste direct Vimeo, YouTube, or MP4/WebM CDN stream link.
    3. *Local File Reference*: Link to locally placed high-res files in the public directory (e.g. `/videos/my-reel.mp4`).
  - **Thumbnail / Poster Image**: Upload or URL.
  - **Metadata Fields**: Client, Year, Runtime, Aspect Ratio, Role.
  - **Detailed Story / Description**: Rich text or markdown summary.
  - **External Links**: Dynamic list of links (Label + URL, e.g., "Watch on Vimeo", "Client Site").
  - **Color Grading Comparison**: Optional "Before (Log) vs. After (Graded)" asset URLs for the interactive split slider.

---

## 3. Technology Stack & Public Deployment Architecture

| Layer | Recommended Choice | Rationale for Public Deployment |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14/15 (App Router)** or **Vite + React + Express/Supabase** | Next.js App Router provides both the client-side 3D/GSAP canvas and the server-side API routes for authentication and database management in a single deployable repository (e.g. Vercel, Railway, or VPS). |
| **Database & Auth** | **Supabase (PostgreSQL + Auth)** OR **SQLite / Prisma + JWT** | Supabase offers zero-config Postgres database, built-in Auth, and file storage bucket for video/images, perfect for public deployment. Alternatively, a lightweight SQLite/JSON database with JWT for a zero-cost self-hosted setup. |
| **Media Storage** | **Cloudinary / Supabase Storage / S3 + Local Public Fallback** | Allows high-bitrate video streaming without overloading server bandwidth, while retaining support for local files. |
| **3D Engine** | **Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei`** | Industry standard for WebGL in React. Lightweight procedural camera with `.glb` drop-in capability. |
| **Animation Engine** | **GSAP + ScrollTrigger + Lenis** | Unrivaled precision for scrubbed 3D scroll timelines and momentum scrolling. |
| **Styling** | **Tailwind CSS + Glassmorphism plugin** | Custom theme tokens for translucent frosted glass (`backdrop-blur`, borders, subtle ambient glow). |
| **Icons** | **Lucide React** | Sleek, modern icons for camera HUD, dashboard controls, and playback. |

---

## 4. Detailed Component & Route Structure

```
videography-portfolio/
├── public/
│   ├── models/             # Custom 3D camera .glb (optional drop-in)
│   ├── videos/             # Locally hosted video files
│   └── posters/            # Project poster images
├── src/ (or app/)
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── CameraCanvas.tsx     # R3F Canvas container with studio lighting
│   │   │   ├── CinemaCamera.tsx     # Procedural 3D Cinema Camera model + GLTF loader
│   │   │   ├── ViewfinderHUD.tsx    # Live camera telemetry HUD overlay
│   │   │   └── ViewfinderIris.tsx   # Aperture opening breakthrough transition
│   │   ├── gallery/
│   │   │   ├── GalleryView.tsx      # Main glassmorphism video feed
│   │   │   ├── VideoCard.tsx        # Video card with hover-to-scrub
│   │   │   ├── VideoSidebar.tsx     # Attached translucent info sidebar
│   │   │   └── CinemaModal.tsx      # Expanded full-quality video player + large sidebar
│   │   ├── profile/
│   │   │   ├── ProfileTrigger.tsx   # Top-left floating glass profile button
│   │   │   └── ProfileModal.tsx     # Translucent profile dialogue (bio, gear, socials)
│   │   ├── admin/
│   │   │   ├── AdminLogin.tsx       # Secure admin login interface
│   │   │   ├── AdminDashboard.tsx   # Video management dashboard
│   │   │   ├── VideoFormModal.tsx   # Add/Edit video modal with link builder
│   │   │   └── VideoTable.tsx       # Reorderable, filterable list of uploaded items
│   │   └── ui/                      # Glass buttons, input fields, badges, toasts
│   ├── lib/
│   │   ├── db.ts                    # Database client / data access layer
│   │   ├── auth.ts                  # Authentication verification & session handling
│   │   └── storage.ts               # File upload & URL resolution helper
│   ├── data/
│   │   └── defaultProjects.ts       # Initial showcase projects (cinematography, commercials)
│   └── types/
│       └── project.ts               # TypeScript interfaces for VideoProject, Links, Gear
├── plan.md                          # This master roadmap document
```

---

## 5. Master Roadmap & Production Phases

### Phase 1: Foundation & Scaffold
- [ ] Initialize full-stack modern React project with TypeScript & Tailwind CSS.
- [ ] Configure custom cinema design tokens: Obsidian `#08080a`, Frosted Glass (`rgba(255,255,255,0.03)`, `backdrop-blur-xl`), Cinema Amber, Record Red.
- [ ] Install 3D, animation, and UI dependencies (`three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `lenis`, `lucide-react`).
- [ ] Set up data layer schema and default starter cinematography projects.

### Phase 2: 3D Camera Scene & Viewfinder Breakthrough
- [ ] Build the R3F Canvas with ACESFilmic tone mapping, ambient/rim studio lighting, and contact shadows.
- [ ] Create the high-fidelity 3D Cinema Camera (matte box, cinema lens with glass shaders, LCD screen, top handle, optical eyepiece).
- [ ] Wire GSAP ScrollTrigger + Lenis for the 180° camera turnaround and dolly-in sequence.
- [ ] Build the camera HUD (Timecode, Battery 98%, ISO 800, Shutter 1/48, 23.98 FPS, blinking REC dot).
- [ ] Build the aperture shutter iris zoom effect that transitions from viewfinder into the gallery.

### Phase 3: Top-Left Profile Dialogue
- [ ] Create the fixed top-left translucent profile button with smooth hover glow.
- [ ] Build the frosted glass profile modal with spring open/close animations.
- [ ] Display Bio, Director statement, Equipment Locker, Editing Software list, and direct contact/social links.

### Phase 4: Translucent Glass Gallery & Video Sidebars
- [ ] Build the smooth-scrolling modern glass gallery feed.
- [ ] Implement the **Video Card + Information Sidebar** component:
  - Video preview with **hover-to-scrub** (scrub playback cursor-tracked).
  - Translucent info sidebar: Category, client, runtime, role badges, camera specs.
- [ ] Add category filter pills (All, Commercials, Music Videos, Narrative, Reels, Color Grade).

### Phase 5: Expanded Cinema Player Modal
- [ ] Build the full-quality video player modal with custom glass controls.
- [ ] Implement the **Large Extended Sidebar**:
  - Title, rich story/concept description.
  - Complete credits list (Director, Cinematographer, Colorist, Sound Designer).
  - Interactive link slots (YouTube 4K, Vimeo, Client Website, Instagram).
  - Optional interactive "Before / After Color Grade" split comparison slider.

### Phase 6: Authenticated Admin Dashboard (`/admin`)
- [ ] Build the `/admin/login` page with secure password authentication.
- [ ] Create the `/admin` dashboard overview with project stats and published/draft statuses.
- [ ] Implement the **Add / Edit Video Modal**:
  - Source selection: Direct cloud upload, external streaming URL, or local `/videos/...` file path.
  - Dynamic link builder (add custom label + URL pairs).
  - Drag-and-drop reordering of gallery items.
- [ ] Implement backend persistence (Supabase / local persistent JSON or SQLite) ready for public deployment.

### Phase 7: Public Deployment Readiness & Performance QA
- [ ] Ensure all API routes, authentication keys, and storage uploads work in production.
- [ ] Mobile responsive layout: touch-friendly cards, mobile viewfinder transition, responsive sidebars.
- [ ] Performance audit: 60 FPS 3D canvas rendering, lazy video loading, asset preloading.

---

## 6. Progress Tracking Log
*This section will track development status across each phase.*

- [x] **Milestone 0**: Master Project Architecture, Gallery & Admin System planned (`plan.md` v2.0 updated).
- [x] **Milestone 1**: Project scaffolded with Tailwind glassmorphism tokens & TypeScript.
- [x] **Milestone 2**: 3D Camera turnaround & viewfinder breakthrough transition built (`CameraCanvas.tsx`, `CinemaCamera.tsx`, `ViewfinderHUD.tsx`, `ViewfinderTransition.tsx`).
- [x] **Milestone 3**: Top-left translucent profile dialogue built (`ProfileTrigger.tsx`, `ProfileModal.tsx`).
- [x] **Milestone 4**: Translucent glass gallery with attached info sidebars & hover-scrubbing (`GallerySection.tsx`, `VideoCard.tsx`).
- [x] **Milestone 5**: Expanded full-quality cinema player with large detailed sidebar & links (`CinemaModal.tsx`).
- [x] **Milestone 6**: Authenticated Admin Dashboard with video CRUD, link manager & upload support (`AdminDashboard.tsx`, `VideoEditModal.tsx`, `AdminLoginModal.tsx`, `storage.ts`).
- [x] **Milestone 7**: Public deployment setup, documentation & build configuration ready (`README.md`, `package.json`, `vite.config.ts`).
