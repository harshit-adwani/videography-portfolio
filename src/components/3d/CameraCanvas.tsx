import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import { CinemaCamera } from './CinemaCamera';
import { ANIMATION_CONFIG } from '../../config/animationConfig';

interface CameraCanvasProps {
  scrollProgress: number; // 0 to 1
  mousePos?: { x: number; y: number };
}

// Canvas Error Boundary to catch any WebGL failure, context loss, or GPU issue gracefully
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Canvas WebGL encountered an issue, displaying graceful fallback:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <div className="w-64 h-48 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-cinema-amber/40 flex items-center justify-center text-cinema-amber">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 tracking-wider">3D CINEMA RIG READY</span>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const CameraCanvas: React.FC<CameraCanvasProps> = ({ scrollProgress, mousePos }) => {
  const p = Math.max(0, Math.min(1, scrollProgress));
  const { rotation, zoom, timeline, transition } = ANIMATION_CONFIG;

  // Track responsive screen dimensions for vertical phone layouts
  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 || window.innerHeight > window.innerWidth;
    }
    return false;
  });

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640 || window.innerHeight > window.innerWidth);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Internal throttled mouse parallax tracking so parent App component never re-renders on mousemove
  const [internalMousePos, setInternalMousePos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (isMobile || p >= timeline.breakthroughProgress) return;
    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        setInternalMousePos({ x, y });
        rafId = null;
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isMobile, p, timeline.breakthroughProgress]);

  const activeMousePos = mousePos || internalMousePos;

  // --- 1. CONTINUOUS ROTATION ---
  // Rotates 180° around Y so the optical viewfinder eyepiece faces the user
  const turnProgress = Math.min(1, p / rotation.turnAroundEndProgress);
  // Smooth ease-in-out curve for the turnaround
  const easedTurn = turnProgress < 0.5 
    ? 2 * turnProgress * turnProgress 
    : 1 - Math.pow(-2 * turnProgress + 2, 2) / 2;
  const targetRotY = rotation.initialRotY + easedTurn * (rotation.targetRotY - rotation.initialRotY);

  // Mouse tilt influence dampens as we zoom in (disabled on touch devices for performance)
  const mouseInfluence = isMobile ? 0 : Math.max(0, 1 - p * rotation.mouseInfluenceDampenSpeed);
  const finalRotY = targetRotY + activeMousePos.x * rotation.mouseXFactor * mouseInfluence;
  const finalRotX = rotation.initialRotX - activeMousePos.y * rotation.mouseYFactor * mouseInfluence;

  // --- 2. CONTINUOUS ZOOM & RESPONSIVE VERTICAL SIZING ---
  // Starts gently while turning, and accelerates straight into the optical viewfinder window
  const zoomFactor = Math.min(1, p / timeline.breakthroughProgress);
  const posZ = Math.pow(zoomFactor, zoom.posZExponent) * zoom.posZMultiplier;

  // Use calibrated mobile scale so the full camera rig, handles, and matte box fit vertically on phones
  const baseScale = isMobile ? zoom.mobileInitialScale : zoom.initialScale;
  const scaleMult = isMobile ? zoom.mobileScaleMultiplier : zoom.scaleMultiplier;
  const cameraZ = isMobile ? zoom.mobileCameraPositionZ : zoom.cameraPositionZ;
  const scale = baseScale + Math.pow(zoomFactor, zoom.scaleExponent) * scaleMult;

  // --- 3. CINEMATIC BLACKOUT SYNCHRONIZED DISAPPEARANCE ---
  // Camera stays visible during the zoom into the viewfinder window, and cleanly vanishes behind the black fade
  const isCanvasVisible = p < timeline.breakthroughProgress;
  const canvasOpacity = isCanvasVisible ? 1 : 0;

  // Precise mathematical centering for the Optical Viewfinder:
  // Fine-tuned to place the optical viewfinder eyepiece at exact 50% horizontal and 50% vertical dead-center
  const screenOffsetX = easedTurn * (zoom.vfTargetX * scale);
  const screenOffsetY = easedTurn * (zoom.initialOffsetY + zoom.vfTargetY * scale);

  return (
    <div 
      className="w-full h-full relative pointer-events-none transition-opacity"
      style={{ 
        opacity: canvasOpacity, 
        display: isCanvasVisible ? 'block' : 'none',
        transitionDuration: `${transition.cameraFadeDurationMs}ms` 
      }}
    >
      <CanvasErrorBoundary>
        <Canvas
          frameloop={isCanvasVisible ? 'always' : 'demand'}
          camera={{ 
            position: [0, 0, cameraZ], 
            fov: isMobile ? 42 : zoom.cameraFov, 
            near: zoom.cameraNear 
          }}
          className="w-full h-full"
          dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, isMobile ? 1.25 : 2)]}
          gl={{ 
            antialias: !isMobile, 
            alpha: true, 
            powerPreference: 'high-performance' 
          }}
        >
          <Suspense fallback={null}>
            {/* Balanced Studio Lighting for authentic camera matte finish */}
            <ambientLight intensity={0.65} color="#ffffff" />
            <hemisphereLight args={['#f8fafc', '#0f172a', 0.5]} />

            {/* Key Light from front-top-right: soft, neutral white */}
            <directionalLight
              position={[3.5, 4.5, 4.5]}
              intensity={1.3}
              color="#ffffff"
              castShadow={!isMobile}
            />

            {/* Fill Light from left: soft neutral fill */}
            <directionalLight
              position={[-4, 2, 4]}
              intensity={0.7}
              color="#e2e8f0"
            />

            {/* Subtle Rim / Edge Light from top-back */}
            <directionalLight
              position={[0, 6, -4]}
              intensity={1.1}
              color="#ffffff"
            />

            {/* Front Lens Accent Light - offset so it accents optical glass without glaring into the rear screen */}
            <pointLight
              position={[1.5, 1.2, 3.5]}
              intensity={0.35}
              color="#93c5fd"
              distance={6}
            />

            {/* Floating Camera Rig (paused on mobile scroll for maximum touch performance) */}
            <Float 
              speed={p > 0.25 || isMobile ? 0 : 1.2} 
              rotationIntensity={isMobile ? 0 : 0.06} 
              floatIntensity={isMobile ? 0 : 0.12}
            >
              <group position={[screenOffsetX, -0.05 + screenOffsetY, 0]} scale={scale}>
                <CinemaCamera
                  rotationY={finalRotY}
                  rotationX={finalRotX}
                  positionZ={posZ}
                  positionY={0}
                  zoomProgress={p}
                />
              </group>
            </Float>

            {/* Floor Shadow (optimized frames on mobile) */}
            <ContactShadows
              position={[0, -1.8, 0]}
              opacity={Math.max(0, 0.45 * (1 - p * 1.5))}
              scale={7}
              blur={2.5}
              far={4}
              resolution={isMobile ? 256 : 512}
              frames={isMobile ? 1 : Infinity}
              color="#000000"
            />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};
