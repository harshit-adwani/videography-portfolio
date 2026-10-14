import React, { useEffect, useRef, useState, useCallback } from 'react';
import { api } from './services/api';
import { UserProfile, VideoProject } from './types';
import { initialProjects } from './data/initialProjects';
import { ANIMATION_CONFIG } from './config/animationConfig';
import { CameraCanvas } from './components/3d/CameraCanvas';
import { ViewfinderHUD } from './components/3d/ViewfinderHUD';
import { ViewfinderTransition } from './components/3d/ViewfinderTransition';
import { HeroSection } from './components/hero/HeroSection';
import { TimelineIntroSection } from './components/timeline/TimelineIntroSection';
import { GallerySection } from './components/gallery/GallerySection';
import { MasterpieceOutroSection } from './components/outro/MasterpieceOutroSection';
import { ProfileTrigger } from './components/profile/ProfileTrigger';
import { ProfileModal } from './components/profile/ProfileModal';
import { Navbar } from './components/ui/Navbar';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CinemaModal } from './components/gallery/CinemaModal';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => ({
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
  }));

  const [projects, setProjects] = useState<VideoProject[]>(() => initialProjects);
  const [activeProject, setActiveProject] = useState<VideoProject | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Fixed scroll progress (0 to 1) based on a generous, dedicated zoom distance
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollProgressRef = useRef(0);

  // Load initial projects & profile from persistent backend
  useEffect(() => {
    const fetchData = async () => {
      const p = await api.getProjects();
      setProjects(p);
      const prof = await api.getProfile();
      setProfile(prof);
    };
    fetchData();
  }, []);

  // --- STEALTH ADMIN ACCESS TRIGGERS ---
  // 1. Direct URL Hash: http://localhost:5173/#admin or #/admin
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
        if (api.isAuthenticated()) {
          setIsAdminDashboardOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // 2. Global Keyboard Shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        if (api.isAuthenticated()) {
          setIsAdminDashboardOpen((prev) => !prev);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Gate State: 'hero' (camera turn/zoom), 'locked' (hard stop at intro screen), 'unlocked' (free scroll)
  type GateState = 'hero' | 'locked' | 'unlocked';

  const [gateState, setGateState] = useState<GateState>(() => {
    if (typeof window !== 'undefined') {
      const { minZoomDistance, maxZoomDistance, zoomDistanceFactor } = ANIMATION_CONFIG.timeline;
      const distance = Math.min(maxZoomDistance, Math.max(minZoomDistance, window.innerHeight * zoomDistanceFactor));
      const transOffset = Math.ceil(distance * ANIMATION_CONFIG.timeline.breakthroughProgress);
      if (window.scrollY >= transOffset) {
        return 'unlocked';
      }
    }
    return 'hero';
  });

  // Authoritative real-time ref to eliminate React state race conditions during rapid events
  const gateStateRef = useRef<GateState>(gateState);
  const canUnlockRef = useRef<boolean>(false);
  const lockedAtRef = useRef<number>(0);
  const idleTimerRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number>(0);

  // Synchronized state updater
  const updateGateState = useCallback((next: GateState) => {
    if (gateStateRef.current !== next) {
      gateStateRef.current = next;
      setGateState(next);
    }
  }, []);

  // Central breakthrough progress threshold from configuration
  const BREAKTHROUGH_PROGRESS = ANIMATION_CONFIG.timeline.breakthroughProgress;

  const computeZoomDistance = useCallback(() => {
    if (typeof window === 'undefined') return 1100;
    const { minZoomDistance, maxZoomDistance, zoomDistanceFactor } = ANIMATION_CONFIG.timeline;
    return Math.min(maxZoomDistance, Math.max(minZoomDistance, window.innerHeight * zoomDistanceFactor));
  }, []);

  const [zoomDistance, setZoomDistance] = useState<number>(computeZoomDistance);
  const zoomDistanceRef = useRef(zoomDistance);
  zoomDistanceRef.current = zoomDistance;

  // Scroll offset where the optical breakthrough completes and the timeline/gallery docks
  const transitionOffset = Math.ceil(zoomDistance * BREAKTHROUGH_PROGRESS);
  const transitionOffsetRef = useRef(transitionOffset);
  transitionOffsetRef.current = transitionOffset;

  // --- RESET SCROLL MOMENTUM EVENT ---
  // Triggered at the exact moment the intro card is shown.
  // 1. Dispatches custom events ('introCardShown' and 'resetScrollMomentum').
  // 2. Kills desktop inertial wheel momentum while preserving native mobile touch stability.
  // 3. Clamps viewport rigidly at transitionOffset.
  // 4. Arms gate only once entry scroll has completely ceased.
  const resetScrollMomentum = useCallback((offset: number) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('introCardShown', { detail: { offset } }));
      window.dispatchEvent(new CustomEvent('resetScrollMomentum', { detail: { offset } }));
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (!isTouch) {
        document.body.style.overflow = 'hidden';
      }
      window.scrollTo({ top: offset, behavior: 'instant' });
    }
    updateGateState('locked');
    canUnlockRef.current = false;
    lockedAtRef.current = Date.now();
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      canUnlockRef.current = true;
    }, ANIMATION_CONFIG.gate.cooldownMs);
    scrollProgressRef.current = BREAKTHROUGH_PROGRESS;
    setScrollProgress(BREAKTHROUGH_PROGRESS);
  }, [BREAKTHROUGH_PROGRESS, updateGateState]);

  const restoreScrollMomentum = useCallback(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }
  }, []);

  // Ensure body overflow is restored on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Track global scroll smoothly with requestAnimationFrame throttle
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const distance = computeZoomDistance();
      setZoomDistance(distance);
      zoomDistanceRef.current = distance;
      const currentTransitionOffset = Math.ceil(distance * BREAKTHROUGH_PROGRESS);
      transitionOffsetRef.current = currentTransitionOffset;
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const scrollY = window.scrollY;
        const distance = zoomDistanceRef.current;
        const currentTransitionOffset = transitionOffsetRef.current;

        // Gate monitoring during scroll
        if (ANIMATION_CONFIG.gate.enabled) {
          // Breakthrough reached from hero track: Trigger resetScrollMomentum event!
          if (gateStateRef.current === 'hero' && scrollY >= currentTransitionOffset) {
            resetScrollMomentum(currentTransitionOffset);
            return;
          }

          if (gateStateRef.current === 'locked') {
            if (scrollY > currentTransitionOffset) {
              window.scrollTo({ top: currentTransitionOffset, behavior: 'instant' });
              if (scrollProgressRef.current !== BREAKTHROUGH_PROGRESS) {
                scrollProgressRef.current = BREAKTHROUGH_PROGRESS;
                setScrollProgress(BREAKTHROUGH_PROGRESS);
              }
              return;
            } else if (scrollY < currentTransitionOffset - 30) {
              // User scrolled back up into camera hero territory
              restoreScrollMomentum();
              updateGateState('hero');
              canUnlockRef.current = false;
              if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
                idleTimerRef.current = null;
              }
            }
          } else if (gateStateRef.current === 'unlocked') {
            // If user scrolls back up into camera hero territory, re-arm gate
            if (scrollY < currentTransitionOffset - 40) {
              updateGateState('hero');
              canUnlockRef.current = false;
              if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
                idleTimerRef.current = null;
              }
            }
          }
        }

        // Progress calculation:
        // Clamped at BREAKTHROUGH_PROGRESS once in the walkthrough to avoid re-rendering
        // the entire React tree on every scroll pixel during gallery browsing!
        if (scrollY >= currentTransitionOffset) {
          if (scrollProgressRef.current !== BREAKTHROUGH_PROGRESS) {
            scrollProgressRef.current = BREAKTHROUGH_PROGRESS;
            setScrollProgress(BREAKTHROUGH_PROGRESS);
          }
        } else {
          const progress = Math.max(0, Math.min(1, scrollY / distance));
          if (Math.abs(scrollProgressRef.current - progress) > 0.001) {
            scrollProgressRef.current = progress;
            setScrollProgress(progress);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [BREAKTHROUGH_PROGRESS, computeZoomDistance, updateGateState, resetScrollMomentum, restoreScrollMomentum]);

  // --- SCROLL GATE INERTIA INTERCEPTOR & EVENT BLOCKER ---
  useEffect(() => {
    if (!ANIMATION_CONFIG.gate.enabled || gateState === 'unlocked') return;

    // 1. Wheel event interceptor (mouse wheel & trackpad momentum)
    const handleWheel = (e: WheelEvent) => {
      const transOffset = transitionOffsetRef.current;
      const scrollY = window.scrollY;

      if (e.deltaY > 0) {
        if (gateStateRef.current === 'hero') {
          if (scrollY + e.deltaY >= transOffset) {
            e.preventDefault();
            resetScrollMomentum(transOffset);
          }
        } else if (gateStateRef.current === 'locked') {
          const now = Date.now();
          const elapsedSinceLock = now - lockedAtRef.current;
          const ceilingExceeded = elapsedSinceLock >= ANIMATION_CONFIG.gate.maxLockDurationMs;

          if (!canUnlockRef.current && !ceilingExceeded) {
            e.preventDefault();
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            idleTimerRef.current = window.setTimeout(() => {
              canUnlockRef.current = true;
            }, ANIMATION_CONFIG.gate.cooldownMs);
          } else {
            restoreScrollMomentum();
            updateGateState('unlocked');
            if (idleTimerRef.current) {
              clearTimeout(idleTimerRef.current);
              idleTimerRef.current = null;
            }
            window.scrollBy({ top: e.deltaY, behavior: 'instant' });
          }
        }
      } else if (e.deltaY < 0) {
        if (gateStateRef.current === 'locked' && scrollY <= transOffset) {
          restoreScrollMomentum();
          updateGateState('hero');
          canUnlockRef.current = false;
          if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
          }
        }
      }
    };

    // 2. Touch event interceptor (smartphones & tablets)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
      if (gateStateRef.current === 'locked') {
        canUnlockRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - currentY;
      const transOffset = transitionOffsetRef.current;
      const scrollY = window.scrollY;

      if (deltaY > 2) {
        if (gateStateRef.current === 'hero') {
          if (scrollY + deltaY >= transOffset) {
            e.preventDefault();
            resetScrollMomentum(transOffset);
          }
        } else if (gateStateRef.current === 'locked') {
          const now = Date.now();
          const elapsedSinceLock = now - lockedAtRef.current;
          const ceilingExceeded = elapsedSinceLock >= ANIMATION_CONFIG.gate.maxLockDurationMs;

          if (!canUnlockRef.current && !ceilingExceeded) {
            e.preventDefault();
          } else {
            restoreScrollMomentum();
            updateGateState('unlocked');
          }
        }
      }
    };

    const handleTouchEnd = () => {
      if (gateStateRef.current === 'locked') {
        canUnlockRef.current = true;
        if (idleTimerRef.current) {
          clearTimeout(idleTimerRef.current);
          idleTimerRef.current = null;
        }
      }
    };

    // 3. Keyboard navigation interceptor
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gateStateRef.current === 'locked') {
        if (['ArrowDown', 'PageDown', ' ', 'End'].includes(e.key)) {
          if (!canUnlockRef.current) {
            e.preventDefault();
          } else {
            restoreScrollMomentum();
            updateGateState('unlocked');
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [gateState, updateGateState, resetScrollMomentum, restoreScrollMomentum]);

  const handleProjectsUpdated = async () => {
    const updated = await api.getProjects();
    setProjects(updated);
  };

  const handleProfileUpdated = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const handleOpenAdmin = () => {
    if (api.isAuthenticated()) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
  };

  // Smooth scroll helpers
  const handleScrollToGallery = () => {
    restoreScrollMomentum();
    canUnlockRef.current = true;
    updateGateState('unlocked');
    scrollProgressRef.current = BREAKTHROUGH_PROGRESS;
    setScrollProgress(BREAKTHROUGH_PROGRESS);
    setIsWalkthroughActive(true);
    const el = document.getElementById('gallery');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: transitionOffset + window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollToContact = () => {
    restoreScrollMomentum();
    canUnlockRef.current = true;
    updateGateState('unlocked');
    scrollProgressRef.current = BREAKTHROUGH_PROGRESS;
    setScrollProgress(BREAKTHROUGH_PROGRESS);
    setIsWalkthroughActive(true);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    restoreScrollMomentum();
    canUnlockRef.current = false;
    updateGateState('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Support direct section hash navigation (#gallery, #contact, #intro-timeline)
  useEffect(() => {
    const handleHashNav = () => {
      const hash = window.location.hash;
      if (hash === '#gallery') {
        restoreScrollMomentum();
        canUnlockRef.current = true;
        updateGateState('unlocked');
        scrollProgressRef.current = BREAKTHROUGH_PROGRESS;
        setScrollProgress(BREAKTHROUGH_PROGRESS);
        setIsWalkthroughActive(true);
        const el = document.getElementById('gallery');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      } else if (hash === '#contact') {
        restoreScrollMomentum();
        canUnlockRef.current = true;
        updateGateState('unlocked');
        scrollProgressRef.current = BREAKTHROUGH_PROGRESS;
        setScrollProgress(BREAKTHROUGH_PROGRESS);
        setIsWalkthroughActive(true);
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      } else if (hash === '#intro-timeline') {
        restoreScrollMomentum();
        updateGateState('locked');
        scrollProgressRef.current = BREAKTHROUGH_PROGRESS;
        setScrollProgress(BREAKTHROUGH_PROGRESS);
        setIsWalkthroughActive(true);
        window.scrollTo({ top: transitionOffsetRef.current, behavior: 'instant' });
      }
    };
    const t = setTimeout(handleHashNav, 200);
    window.addEventListener('hashchange', handleHashNav);
    return () => {
      clearTimeout(t);
      window.removeEventListener('hashchange', handleHashNav);
    };
  }, [BREAKTHROUGH_PROGRESS, restoreScrollMomentum, updateGateState]);

  // Walkthrough phases active once camera zoom completes
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(() => {
    if (typeof window !== 'undefined') {
      const { minZoomDistance, maxZoomDistance, zoomDistanceFactor } = ANIMATION_CONFIG.timeline;
      const distance = Math.min(maxZoomDistance, Math.max(minZoomDistance, window.innerHeight * zoomDistanceFactor));
      const transOffset = Math.ceil(distance * ANIMATION_CONFIG.timeline.breakthroughProgress);
      return window.scrollY >= transOffset;
    }
    return false;
  });

  useEffect(() => {
    const isPast = scrollProgress >= BREAKTHROUGH_PROGRESS || (typeof window !== 'undefined' && window.scrollY >= transitionOffset);
    if (isPast && !isWalkthroughActive) {
      setIsWalkthroughActive(true);
    } else if (!isPast && isWalkthroughActive) {
      setIsWalkthroughActive(false);
    }
  }, [scrollProgress, isWalkthroughActive, BREAKTHROUGH_PROGRESS, transitionOffset]);

  // Background spotlight fade: light studio during camera phase, deep dark obsidian when in walkthrough
  const studioBackdropOpacity = Math.max(0, 1 - scrollProgress * ANIMATION_CONFIG.studioBackdrop.fadeSpeed);

  return (
    <div className="min-h-screen bg-obsidian-950 text-neutral-100 flex flex-col relative selection:bg-cinema-amber/30 selection:text-white w-full max-w-full overflow-x-clip">
      {/* --- 1. LIGHT STUDIO SPOTLIGHT BACKDROP --- */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-200"
        style={{
          background: 'radial-gradient(ellipse at 50% 46%, #3a4055 0%, #222634 45%, #13151e 75%, #08080c 100%)',
          opacity: studioBackdropOpacity,
        }}
      />

      {/* --- 2. 3D CAMERA VIEWPORT (z-0) --- */}
      {/* Continuous zoom while rotating, deep preview screen zoom, vanishes at breakthrough */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <CameraCanvas scrollProgress={scrollProgress} />
      </div>

      {/* --- 3. OPTICAL SHUTTER FLASH & IRIS TRANSITION (z-40) --- */}
      <ViewfinderTransition progress={scrollProgress} />

      {/* --- 4. VIEWFINDER HUD (z-30) --- */}
      <ViewfinderHUD 
        progress={scrollProgress} 
        isGalleryActive={isWalkthroughActive} 
        onOpenAdmin={handleOpenAdmin}
      />

      {/* --- 5. TOP FIXED NAVIGATION & PROFILE TRIGGER (z-50) --- */}
      <ProfileTrigger
        profile={profile}
        isOpen={isProfileOpen}
        onClick={() => setIsProfileOpen(!isProfileOpen)}
      />

      <Navbar
        onScrollToGallery={handleScrollToGallery}
        onScrollToContact={handleScrollToContact}
      />

      {/* --- 6. ACT 1: HERO SCROLL TRACK (Sized to match transitionOffset) --- */}
      {/* Provides clean uninterrupted scroll distance for camera rotation and viewfinder zoom */}
      <div 
        className="relative w-full pointer-events-none"
        style={{ height: `${transitionOffset}px` }}
      >
        <HeroSection
          scrollProgress={scrollProgress}
          onScrollToGallery={handleScrollToGallery}
          profile={profile}
        />
      </div>

      {/* --- 7. THE CREATIVE DIRECTOR WALKTHROUGH (Acts 2, 3 & 4) --- */}
      <main 
        className={`relative z-10 flex-1 flex flex-col transition-opacity w-full max-w-full min-w-0 ${
          isWalkthroughActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ transitionDuration: `${ANIMATION_CONFIG.gallery.mainFadeDurationMs}ms` }}
      >
        {/* ACT 2: POST-PRODUCTION (Full-Page NLE Editing Timeline Intro) */}
        <TimelineIntroSection
          profile={profile}
          onScrollToWorks={handleScrollToGallery}
          isLocked={gateState === 'locked'}
        />

        {/* ACT 3: THE WORKS (Portfolio Video Gallery) */}
        <GallerySection 
          projects={projects} 
          onSelectProject={setActiveProject} 
          isViewfinderActive={isWalkthroughActive} 
        />

        {/* ACT 4: THE CLIMAX (Full-Page "Let's create the next masterpiece" Outro) */}
        <MasterpieceOutroSection
          profile={profile}
          onScrollToTop={handleScrollToTop}
        />
      </main>

      {/* --- 8. POPUP DIALOGS & MODALS (z-[70]) --- */}
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
        onClose={() => setIsAdminDashboardOpen(false)}
        onProjectsUpdated={handleProjectsUpdated}
        onProfileUpdated={handleProfileUpdated}
      />

      <CinemaModal
        project={activeProject}
        isOpen={Boolean(activeProject)}
        onClose={() => setActiveProject(null)}
      />
    </div>
  );
};

export default App;
