# 🎥 CINEFRAME // 3D Videography & Video Editing Portfolio

An award-caliber, modern personal portfolio website built specifically for **Cinematographers, Videographers, and Video Editors**.

---

## ✨ Key Features

1. **3D Camera Hero ("Through the Lens")**:
   - High-fidelity 3D cinema camera built with **Three.js** and **React Three Fiber**.
   - Interactive mouse parallax tilt with studio key and rim lighting.
   - **Scroll Turnaround & Zoom**: As the visitor scrolls down, the 3D camera smoothly rotates 180° so the optical viewfinder / monitor faces the viewer, dollies in close, and aligns with the viewport.
   - **Viewfinder Telemetry HUD**: Live timecode counter, ISO 800, 180° shutter, 23.98 FPS, audio meters, and a blinking red `● REC` indicator.
   - **Aperture Iris Breakthrough**: The viewfinder lens opens up to transition smoothly into the portfolio gallery.

2. **Translucent Profile Dialogue (Top-Left)**:
   - Fixed, frosted-glass profile avatar in the top-left corner.
   - Opens a translucent modal with bio, director statement, equipment locker (cameras, lenses, gimbals), editing & color grading suite, accolades, and booking links.

3. **Modern Translucent Glass Gallery & Info Sidebars**:
   - Deep obsidian background with frosted glass cards (`backdrop-blur-xl`, `border-white/10`).
   - **Attached Information Sidebar**: Every video card has its own persistent sidebar detailing project title, client, runtime, aspect ratio, camera gear, and editing software.
   - **Hover-to-Scrub**: Hovering over a video preview scrubs through the footage as you move your mouse horizontally.
   - Category filtering (Commercials, Music Videos, Short Films, Social Reels, Color Grading).

4. **Expanded Cinema Player (Full-Quality View)**:
   - Click any video in the gallery to open the full-screen cinema player.
   - Plays full-quality master video with custom minimalist playback controls.
   - **Larger Sidebar**: Full project storyline, creative breakdown, complete crew credits, and dynamic external links (Vimeo 4K, YouTube, Client Website, Instagram).
   - **Interactive Color Grade Slider**: Compare flat Log footage against the final print grade with an interactive split-screen slider.

5. **Authenticated Admin Dashboard (`/admin`)**:
   - Access via the **PORTAL / ADMIN** button in the top-right navbar.
   - Default master passcode: `cinema2026` (can be updated anytime in the dashboard).
   - Add new projects with a flexible video source selector (direct cloud URL, YouTube/Vimeo stream, or local file upload).
   - Dynamic link builder (custom labels + URLs).
   - Reorder videos (Move Up / Move Down).
   - Toggle publish/draft and featured statuses.

---

## 🚀 Getting Started

### 1. Installation
In the project directory, run:
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Public Production
```bash
npm run build
```
This produces an optimized production bundle in `dist/`.

---

## 🌐 Public Deployment Guide

You can deploy this website to **Vercel**, **Netlify**, or **Cloudflare Pages** in minutes:

### Deploy to Vercel
1. Push this project folder to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository. Framework preset will automatically detect **Vite**.
4. Click **Deploy**.

---

## 🔐 Admin Credentials

- **Default Passcode**: `cinema2026`
- Once logged in, you can add or edit videos directly through the UI. Any uploaded files or custom links persist in browser storage.
