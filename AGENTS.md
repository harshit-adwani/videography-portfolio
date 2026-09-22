# AGENTS.md — Videography & Video Editing Portfolio

## 1. Project Overview & Purpose
This is a personal creative portfolio website for a high-end Cinematographer, Director of Photography, and Lead Video Editor (Alexander Vance).
The website is designed around the core concept of **"Through the Lens"**:
- An interactive, studio-lit 3D cinema camera acts as the hero centerpiece.
- As the visitor scrolls, the camera turns 180° and continuously zooms into the camera's rear preview monitor.
- An autonomous one-shot optical shutter flash triggers at ~74% scroll, transitioning seamlessly into a stationary optical viewfinder overlay (HUD telemetry).
- The video showcase gallery scrolls smoothly behind/inside the stationary viewfinder framing.
- Visitors can hover over preview cards to scrub timeline frames, click to open full-quality 4K cinema master playback with an interactive raw/graded color comparison slider, view the director's dossier/gear locker in a translucent modal, and manage projects via an authenticated admin dashboard.

---

## 2. Visual & Design Language
- **Palette**:
  - Background: Deep Obsidian (`#050507`, `#09090d`, `#0f0f15`) with subtle studio spotlight gradients (`#3a4055` to `#13151e`) during the camera hero phase.
  - Primary Accent: Cinema Amber (`#f59e0b`, `#fbbf24`) symbolizing camera status lights, focus markers, and primary interactive highlights.
  - Secondary Accent: Cinema Teal (`#06b6d4`) for editing/post-production badges and comparison controls.
  - Recording/Alert: Red (`#ef4444`) for recording indicators, tally LEDs, and mute states.
- **Glassmorphism**:
  - `glass-panel` (`rgba(15, 15, 21, 0.65)`, `backdrop-blur-xl`, `border-white/10`).
  - `glass-panel-elevated` (`rgba(20, 20, 29, 0.82)`, `backdrop-blur-2xl`, `border-white/15`).
  - Smooth 300ms–500ms transitions on hover and active states.
- **Typography**:
  - Sans-serif: `Inter`, system-ui, sans-serif for titles, headers, and long-form descriptions.
  - Monospace: `JetBrains Mono`, `Fira Code`, monospace for technical metadata, camera telemetry, timecodes, aspect ratios, and tags.
- **Negative Space & Hierarchy**:
  - Spacious viewport margins, prominent visual weight for video previews, minimalist HUD indicators.

---

## 3. Motion & Animation Principles
- **Camera Scroll Choreography**:
  - Continuous zoom starts immediately at `scrollY = 0` (`p = 0`) and accelerates all the way through `p = 0.78`.
  - Turnaround occurs over `p = 0.00` to `p = 0.45` (180° rotation around Y).
  - Dynamic screen offset tracking guides the rear LCD monitor towards viewport center.
- **Autonomous Strobe Flash**:
  - Fires as a one-shot 450ms optical flash bloom when passing the 74% scroll threshold.
  - Does **NOT** lock to or scrub with scroll position; it plays once autonomously and re-arms when scrolling back above 50%.
- **Viewfinder HUD**:
  - Stationed, fixed HUD frame with safe-area guides (2.39:1 / 16:9), live timecode, recording status, and battery telemetry.
- **Video Scrubbing**:
  - Fast, responsive hover scrubbing on video cards that updates playback position proportionally to mouse X position.

---

## 4. Key Architecture & Component Tree
- `src/App.tsx`: Central coordinator managing scroll progress, mouse tilt, modal states, and layer ordering.
  - `src/components/3d/CameraCanvas.tsx`: Three.js Canvas with dynamic lighting, float rig, and scroll synchronization.
  - `src/components/3d/CinemaCamera.tsx`: Textured GLTF camera loader with Three.js PBR shaders (physical transmission glass, leatherette normal maps, glowing LCD screen).
  - `src/components/3d/ViewfinderHUD.tsx`: Fixed optical viewfinder overlay with framing brackets and telemetry.
  - `src/components/3d/ViewfinderTransition.tsx`: Autonomous one-shot shutter strobe flash.
  - `src/components/hero/HeroSection.tsx`: Minimalist side dossier and scroll prompts (fades out as camera turns).
  - `src/components/gallery/GallerySection.tsx`: Category-filtered stream of video projects.
  - `src/components/gallery/VideoCard.tsx`: Hover-to-scrub video card with attached information sidebar.
  - `src/components/gallery/CinemaModal.tsx`: Fullscreen master player with color grading comparison slider and expanded metadata.
  - `src/components/profile/ProfileTrigger.tsx` & `ProfileModal.tsx`: Translucent dossier modal.
  - `src/components/admin/AdminDashboard.tsx` & `VideoEditModal.tsx`: Authenticated video project management.
  - `src/services/storage.ts`: LocalStorage data store with pre-seeded demo video projects.

---

## 5. Intentional Behaviors (DO NOT CHANGE)
- **Do NOT touch video playback implementation**: Preserve clean native HTML5 video playback without interfering overlays or hacks.
- **Do NOT lock flash to scroll**: Flash must remain an autonomous timer-based strobe trigger.
- **Do NOT add large obstructive titles over camera hero**: The camera hero must remain clear and unobstructed with side metadata only.
- **Camera model textures**: The camera model in `public/models/camera.glb` relies on `20131125021751311225.jpg` (diffuse), `20131125021751312630.jpg` (port normal), and `2013112502175131295.jpg` (leatherette bump) loaded via Drei `useTexture` with `flipY = false` and `sRGBColorSpace`.

---

## 6. Development & Verification Commands
- `npm run dev`: Starts Vite dev server (default port `5173`).
- `npx.cmd tsc --noEmit`: Runs TypeScript strict type-checking.
- `npm run build`: Compiles production bundle to `dist/`.
