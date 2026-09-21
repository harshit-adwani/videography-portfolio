import React, { useEffect, useState } from 'react';
import { storage } from './services/storage';
import { UserProfile, VideoProject } from './types';
import { CameraCanvas } from './components/3d/CameraCanvas';
import { ViewfinderHUD } from './components/3d/ViewfinderHUD';
import { ViewfinderTransition } from './components/3d/ViewfinderTransition';
import { HeroSection } from './components/hero/HeroSection';
import { GallerySection } from './components/gallery/GallerySection';
import { ProfileTrigger } from './components/profile/ProfileTrigger';
import { ProfileModal } from './components/profile/ProfileModal';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export const App: React.FC = () => {
  const [profile] = useState<UserProfile>(() => storage.getProfile());
  const [projects, setProjects] = useState<VideoProject[]>(() => storage.getProjects());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => storage.isAuthenticated());

  // Fixed scroll progress (0 to 1) based on a generous, dedicated zoom distance
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse parallax for subtle 3D tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track global scroll smoothly
  // Generous distance (~1300px) allows:
  // 1. Simultaneous rotation & continuous zoom (0 - 0.45)
  // 2. Accelerated zoom into rear preview screen (0.45 - 0.78)
  // 3. Optical flash transition into video archive (0.78 - 1.00)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const zoomDistance = Math.min(1300, window.innerHeight * 1.5);
      const progress = Math.max(0, Math.min(1, scrollY / zoomDistance));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProjectsUpdated = () => {
    setProjects(storage.getProjects());
  };

  const handleOpenAdmin = () => {
    if (storage.isAuthenticated()) {
      setIsAdminAuthenticated(true);
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const handleScrollToGallery = () => {
    const el = document.getElementById('gallery');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Gallery is active once the camera preview screen zoom completes
  const isGalleryActive = scrollProgress >= 0.78;

  // Background spotlight fade: light studio during camera phase, deep dark obsidian when in gallery
  const studioBackdropOpacity = Math.max(0, 1 - scrollProgress * 1.3);

  return (
    <div className="min-h-screen bg-obsidian-950 text-neutral-100 flex flex-col relative selection:bg-cinema-amber/30 selection:text-white">
      {/* --- 1. LIGHT STUDIO SPOTLIGHT BACKDROP (For high camera visibility) --- */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-200"
        style={{
          background: 'radial-gradient(ellipse at 50% 46%, #3a4055 0%, #222634 45%, #13151e 75%, #08080c 100%)',
          opacity: studioBackdropOpacity,
        }}
      />

      {/* --- 2. 3D CAMERA VIEWPORT (z-0) --- */}
      {/* Continuous zoom while rotating, deep preview screen zoom, crossfades at 0.78 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <CameraCanvas scrollProgress={scrollProgress} mousePos={mousePos} />
      </div>

      {/* --- 3. OPTICAL SHUTTER FLASH & IRIS TRANSITION (z-40) --- */}
      {/* Fires optical flash breakthrough between preview screen and video list */}
      <ViewfinderTransition progress={scrollProgress} />

      {/* --- 4. STATIC VIEWFINDER OVERLAY & HUD (z-30) --- */}
      {/* Frames the viewport with optical vignette, framing brackets, and camera telemetry */}
      <ViewfinderHUD progress={scrollProgress} isGalleryActive={isGalleryActive} />

      {/* --- 5. TOP FIXED NAVIGATION & PROFILE TRIGGER (z-50) --- */}
      <ProfileTrigger
        profile={profile}
        isOpen={isProfileOpen}
        onClick={() => setIsProfileOpen(!isProfileOpen)}
      />

      <Navbar
        isAdmin={isAdminAuthenticated}
        onOpenAdmin={handleOpenAdmin}
        onScrollToGallery={handleScrollToGallery}
      />

      {/* --- 6. HERO SCROLL TRACK (h-[160vh]) --- */}
      {/* Clean uninterrupted scroll distance for simultaneous rotation and preview screen zoom */}
      <div className="relative h-[160vh] w-full pointer-events-none">
        <HeroSection
          scrollProgress={scrollProgress}
          onScrollToGallery={handleScrollToGallery}
        />
      </div>

      {/* --- 7. CINEMATIC ARCHIVE (GALLERY) (z-10) --- */}
      {/* Seamlessly revealed following the optical breakthrough flash! */}
      <main className="relative z-10 flex-1 bg-gradient-to-b from-transparent via-obsidian-950 to-obsidian-950">
        <GallerySection projects={projects} />
      </main>

      {/* Footer */}
      <div className="relative z-10 bg-obsidian-950">
        <Footer profile={profile} />
      </div>

      {/* --- 8. POPUP DIALOGS & MODALS (z-50) --- */}
      <ProfileModal
        profile={profile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => {
          setIsAdminDashboardOpen(false);
          setIsAdminAuthenticated(storage.isAuthenticated());
        }}
        onProjectsUpdated={handleProjectsUpdated}
      />
    </div>
  );
};

export default App;
