/**
 * ==============================================================================
 * 🎬 MASTER ANIMATION & CAMERA CONTROL CONFIGURATION
 * ==============================================================================
 * 
 * You can tweak ANY variable below to adjust camera choreography, zoom physics,
 * event triggers, and animation timings.
 * 
 * ⚡ LIVE UPDATES:
 * As soon as you edit and save this file, Vite will INSTANTLY update the web app
 * live in your browser without requiring a manual reload!
 */

export const ANIMATION_CONFIG = {
  // ----------------------------------------------------------------------------
  // 1. SCROLL & BREAKTHROUGH TIMELINE TRIGGERS
  // ----------------------------------------------------------------------------
  timeline: {
    /** 
     * Global breakthrough point (0.0 to 1.0) where the camera transition completes
     * and the cinematic archive gallery activates.
     * Default: 0.73
     */
    breakthroughProgress: 0.73,

    /** 
     * Progress threshold (0.0 to 1.0) below which the transition re-arms
     * when scrolling back up.
     * Default: 0.60
     */
    rearmProgress: 0.60,

    /** 
     * Minimum scroll distance in pixels to complete the camera animation.
     * Default: 900
     */
    minZoomDistance: 900,

    /** 
     * Maximum scroll distance in pixels to complete the camera animation.
     * Default: 1200
     */
    maxZoomDistance: 1200,

    /** 
     * Scroll distance multiplier relative to the window height (e.g. 1.25 = 125% of viewport height).
     * Higher value = longer, slower scroll; Lower value = quicker scroll.
     * Default: 1.25
     */
    zoomDistanceFactor: 1.25,
  },

  // ----------------------------------------------------------------------------
  // 2. 3D CAMERA ROTATION & TURNAROUND (Phase 1)
  // ----------------------------------------------------------------------------
  rotation: {
    /** 
     * Scroll progress (0.0 to 1.0) at which the 180° camera turnaround completes.
     * After this point, the camera faces backwards and begins zooming into the viewfinder.
     * Default: 0.45
     */
    turnAroundEndProgress: 0.45,

    /** 
     * Initial camera Y rotation in radians (front-facing cinematic studio angle).
     * Default: 0.35
     */
    initialRotY: 0.35,

    /** 
     * Target Y rotation after turnaround (Math.PI = 180°, facing rear viewfinder directly to user).
     * Default: Math.PI
     */
    targetRotY: Math.PI,

    /** 
     * Initial camera X tilt in radians.
     * Default: 0.08
     */
    initialRotX: 0.08,

    /** 
     * Mouse parallax sensitivity (X-axis tilt factor).
     * Default: 0.12
     */
    mouseXFactor: 0.12,

    /** 
     * Mouse parallax sensitivity (Y-axis tilt factor).
     * Default: 0.08
     */
    mouseYFactor: 0.08,

    /** 
     * Rate at which mouse parallax tilt dampens as the camera zooms into the viewfinder.
     * Higher value = mouse tilt disappears faster when zooming in.
     * Default: 1.5
     */
    mouseInfluenceDampenSpeed: 1.5,
  },

  // ----------------------------------------------------------------------------
  // 3. 3D CAMERA ZOOM & VIEWPORT CENTERING (Phase 2)
  // ----------------------------------------------------------------------------
  zoom: {
    /** 
     * Initial camera scale at hero landing.
     * Default: 0.85
     */
    initialScale: 0.75,

    /** 
     * Maximum scale expansion as camera zooms into the optical viewfinder.
     * Default: 1.25 (expands up to initialScale + scaleMultiplier = 2.10)
     */
    scaleMultiplier: 1.25,

    /** 
     * Exponent for scale easing (higher = stays smaller longer, then accelerates into viewfinder).
     * Default: 1.25
     */
    scaleExponent: 1.25,

    /** 
     * Maximum Z-axis dolly distance (pushes the camera forward towards the viewport).
     * Default: 0.92
     */
    posZMultiplier: 0.92,

    /** 
     * Exponent for Z-axis dolly easing curve.
     * Default: 1.35
     */
    posZExponent: 1.35,

    /** 
     * Optical Viewfinder Eyepiece Centering Target X offset.
     * Fine-tuned to place the optical viewfinder eyepiece at exact 50% horizontal dead-center.
     * Default: 0.29
     */
    vfTargetX: 0.22,

    /** 
     * Optical Viewfinder Eyepiece Centering Target Y offset.
     * Fine-tuned to place the optical viewfinder eyepiece at exact 50% vertical dead-center.
     * Default: -0.25
     */
    vfTargetY: -0.23,

    /** 
     * Baseline Y offset for the camera rig.
     * Default: 0.05
     */
    initialOffsetY: 0.05,

    /** 
     * Three.js Perspective Camera Z position.
     * Default: 4.2
     */
    cameraPositionZ: 4.2,

    /** 
     * Three.js Field of View (FOV).
     * Default: 40
     */
    cameraFov: 40,

    /** 
     * Three.js near clipping plane (prevents clipping through viewfinder eyepiece glass).
     * Default: 0.01
     */
    cameraNear: 0.01,
  },

  // ----------------------------------------------------------------------------
  // 4. TRANSITIONS & EVENT TRIGGERS (Phase 3)
  // ----------------------------------------------------------------------------
  transition: {
    /** 
     * Total duration of the cinematic dip-to-black fade out and reveal (in milliseconds).
     * Default: 700
     */
    blackoutDurationMs: 0,

    /** 
     * Camera canvas fade-out duration (ms) when disappearing behind the black fade.
     * Default: 200
     */
    cameraFadeDurationMs: 200,

    /** 
     * Shutter flash duration (ms) if strobe effect is triggered.
     * Default: 450
     */
    flashDurationMs: 450,

    /** 
     * Whether an optical shutter strobe flash triggers simultaneously with the blackout.
     * Default: false (pure cinematic dip-to-black fade out)
     */
    enableFlash: false,
  },

  // ----------------------------------------------------------------------------
  // 5. VIEWFINDER HUD, HERO BADGES & STUDIO SPOTLIGHT
  // ----------------------------------------------------------------------------
  hud: {
    /** 
     * Progress (0.0 to 1.0) where the optical Viewfinder HUD begins fading in.
     * Default: 0.40
     */
    fadeInStart: 0.40,

    /** 
     * Progress range over which the HUD reaches full 1.0 opacity.
     * Default: 0.28 (fades in from 0.40 to 0.68)
     */
    fadeInRange: 0.28,
  },

  studioBackdrop: {
    /** 
     * Fade speed multiplier for the radial spotlight backdrop (fades from light studio to deep obsidian).
     * Default: 1.3
     */
    fadeSpeed: 1.3,
  },

  heroText: {
    /** 
     * Fade speed multiplier for the hero side badges ("Alexander Vance", "Scroll to Turn").
     * Higher = disappears earlier as rotation begins.
     * Default: 3.5
     */
    fadeSpeed: 3.5,
  },

  // ----------------------------------------------------------------------------
  // 6. CINEMATIC ARCHIVE (GALLERY) APPEARANCE
  // ----------------------------------------------------------------------------
  gallery: {
    /** 
     * Main gallery container fade-in transition duration (ms).
     * Default: 300
     */
    mainFadeDurationMs: 300,

    /** 
     * Header plate entrance animation duration (ms).
     * Default: 700
     */
    headerAnimationDurationMs: 700,
  },
} as const;

export type AnimationConfig = typeof ANIMATION_CONFIG;
