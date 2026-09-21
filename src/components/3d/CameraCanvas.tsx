import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import { CinemaCamera } from './CinemaCamera';

interface CameraCanvasProps {
  scrollProgress: number; // 0 to 1
  mousePos: { x: number; y: number };
}

export const CameraCanvas: React.FC<CameraCanvasProps> = ({ scrollProgress, mousePos }) => {
  const p = Math.max(0, Math.min(1, scrollProgress));

  // --- 1. CONTINUOUS ROTATION (0.00 to 0.45) ---
  // Rotates 180° around Y so the rear preview screen faces the user
  const turnProgress = Math.min(1, p / 0.45);
  // Uses smooth ease-in-out for the turnaround
  const easedTurn = turnProgress < 0.5 
    ? 2 * turnProgress * turnProgress 
    : 1 - Math.pow(-2 * turnProgress + 2, 2) / 2;
  const targetRotY = 0.35 + easedTurn * (Math.PI - 0.35);

  // Mouse tilt influence dampens as we zoom in
  const mouseInfluence = Math.max(0, 1 - p * 1.5);
  const finalRotY = targetRotY + mousePos.x * 0.12 * mouseInfluence;
  const finalRotX = 0.08 - mousePos.y * 0.08 * mouseInfluence;

  // --- 2. CONTINUOUS ZOOM (Starts immediately at p=0 and accelerates all the way through) ---
  // Starts zooming while rotating, and continues zooming deep into the preview screen after rotating!
  // posZ moves forward from 0 up to 3.52 along Z towards the camera's preview screen
  const posZ = Math.pow(p, 1.22) * 3.52;

  // Scale: starts at compact 0.75 and continuously grows to 2.8 to fully envelop the screen
  const scale = 0.75 + Math.pow(p, 1.15) * 2.05;

  // --- 3. SEAMLESS TRANSITION (0.78 to 0.88) ---
  // Cross-fades as the preview screen edges pass beyond the viewport and the optical flash fires
  const canvasOpacity = p < 0.76 ? 1 : Math.max(0, 1 - (p - 0.76) / 0.09);

  // Smoothly center the rear preview screen into the viewport as camera turns to its back
  const screenOffsetX = easedTurn * 0.30;
  const screenOffsetY = easedTurn * 0.20;

  return (
    <div 
      className="w-full h-full relative pointer-events-none transition-opacity duration-100"
      style={{ opacity: canvasOpacity }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Enhanced Studio Lighting for high visibility against the light backdrop */}
          <ambientLight intensity={1.1} />
          <hemisphereLight args={['#ffffff', '#1e2029', 1.2]} />

          {/* Strong Key Light from front-top */}
          <directionalLight
            position={[5, 7, 4]}
            intensity={3.2}
            color="#ffffff"
            castShadow
          />

          {/* Cyan Rim Light for metallic edges */}
          <directionalLight
            position={[-6, 4, -4]}
            intensity={4.0}
            color="#38bdf8"
          />

          {/* Warm Amber Fill Light */}
          <directionalLight
            position={[4, -2, 3]}
            intensity={2.0}
            color="#fbbf24"
          />

          {/* Top Specular Fill */}
          <directionalLight
            position={[0, 6, 0]}
            intensity={1.8}
            color="#e0f2fe"
          />

          {/* Lens Specular Point Light */}
          <pointLight
            position={[0, 0, 2.5]}
            intensity={1.5}
            color="#ffffff"
            distance={5}
          />

          {/* Floating Camera Rig */}
          <Float speed={p > 0.25 ? 0 : 1.2} rotationIntensity={0.06} floatIntensity={0.12}>
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

          {/* Floor Shadow */}
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={Math.max(0, 0.45 * (1 - p * 1.5))}
            scale={7}
            blur={2.5}
            far={4}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
