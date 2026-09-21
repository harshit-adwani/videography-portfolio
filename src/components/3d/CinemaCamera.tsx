import React, { Component, ErrorInfo, ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';

interface CinemaCameraProps {
  rotationY?: number;
  rotationX?: number;
  positionZ?: number;
  positionY?: number;
  zoomProgress?: number; // 0 to 1
}

// Preload assets for instantaneous rendering
useGLTF.preload('/models/camera.glb');
useTexture.preload([
  '/models/20131125021751311225.jpg',
  '/models/20131125021751312630.jpg',
  '/models/2013112502175131295.jpg',
]);

// Safe Error Boundary to prevent any external model issues
class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Could not load external model, using procedural camera:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const ExternalCameraModel: React.FC<{ modelUrl: string }> = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);
  const [diffuseTexture, portNormal, leatherNormal] = useTexture([
    '/models/20131125021751311225.jpg',
    '/models/20131125021751312630.jpg',
    '/models/2013112502175131295.jpg',
  ]);

  const normalizedModel = React.useMemo(() => {
    // Configure textures
    diffuseTexture.flipY = false;
    diffuseTexture.colorSpace = THREE.SRGBColorSpace;
    diffuseTexture.needsUpdate = true;

    portNormal.flipY = false;
    portNormal.needsUpdate = true;

    leatherNormal.flipY = false;
    leatherNormal.wrapS = THREE.RepeatWrapping;
    leatherNormal.wrapT = THREE.RepeatWrapping;
    leatherNormal.needsUpdate = true;

    // Materials
    const opticalGlassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x38bdf8),
      transmission: 0.95,
      opacity: 1,
      transparent: true,
      roughness: 0.02,
      ior: 1.55,
      reflectivity: 0.95,
      clearcoat: 1.0,
    });

    const clearGlassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf1f5f9),
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.03,
      ior: 1.5,
      clearcoat: 0.8,
    });

    const brushedMetalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd4d4d8),
      roughness: 0.2,
      metalness: 0.95,
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x27272a),
      roughness: 0.35,
      metalness: 0.85,
    });

    const leatherGripMat = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      normalMap: leatherNormal,
      normalScale: new THREE.Vector2(1.6, 1.6),
      roughness: 0.86,
      metalness: 0.06,
      color: new THREE.Color(0xffffff),
    });

    const zoomRingMat = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      normalMap: portNormal,
      normalScale: new THREE.Vector2(2.5, 2.5),
      roughness: 0.82,
      metalness: 0.06,
      color: new THREE.Color(0xffffff),
    });

    const portRubberMat = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      normalMap: portNormal,
      roughness: 0.7,
      metalness: 0.12,
      color: new THREE.Color(0xffffff),
    });

    const rearScreenMat = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      roughness: 0.06,
      metalness: 0.15,
      emissive: new THREE.Color(0x0a1626),
      emissiveIntensity: 0.65,
      color: new THREE.Color(0xffffff),
    });

    const topScreenMat = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      roughness: 0.12,
      metalness: 0.1,
      emissive: new THREE.Color(0x072812),
      emissiveIntensity: 0.45,
      color: new THREE.Color(0xffffff),
    });

    const redTallyMat = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      color: new THREE.Color(0xffffff),
      emissive: new THREE.Color(0xef4444),
      emissiveIntensity: 1.0,
    });

    const eyecupRubberMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x121215),
      roughness: 0.94,
      metalness: 0.04,
    });

    const chassisMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x18181c),
      roughness: 0.35,
      metalness: 0.7,
    });

    const cameraBodyMat = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      roughness: 0.38,
      metalness: 0.16,
      color: new THREE.Color(0xffffff),
    });

    const clone = scene.clone();

    // Traverse and assign materials per component
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const name = mesh.name || '';

        if (name.includes('24') || name.includes('25')) {
          // Front optical lens glass elements
          mesh.material = opticalGlassMat;
        } else if (name.includes('09') || name.includes('16') || name.includes('05') || name.includes('27')) {
          // Viewfinder glass, LCD screen protector glass
          mesh.material = clearGlassMat;
        } else if (name.includes('10') || name.includes('02') || name.includes('03')) {
          // Hot shoe rails, strap eyelets, silver shutter button
          mesh.material = brushedMetalMat;
        } else if (name.includes('30') || name.includes('31')) {
          // Textured leatherette rubber grips
          mesh.material = leatherGripMat;
        } else if (name.includes('06')) {
          // Ribbed lens zoom ring
          mesh.material = zoomRingMat;
        } else if (name.includes('17') || name.includes('18')) {
          // Rubber side flaps and CF card door
          mesh.material = portRubberMat;
        } else if (name.includes('26')) {
          // Rear LCD preview monitor
          mesh.material = rearScreenMat;
        } else if (name.includes('15')) {
          // Top LCD status readout
          mesh.material = topScreenMat;
        } else if (name.includes('07')) {
          // Front red tally LED
          mesh.material = redTallyMat;
        } else if (name.includes('34')) {
          // Viewfinder rubber eyecup
          mesh.material = eyecupRubberMat;
        } else if (name.includes('13') || name.includes('21') || name.includes('29') || name.includes('32')) {
          // Dark metal dials, latches, collars
          mesh.material = darkMetalMat;
        } else if (name.includes('11') || name.includes('19')) {
          // Dark chassis and mount interior
          mesh.material = chassisMat;
        } else {
          // Camera body, lens barrel, badges, mode dial, rear buttons
          mesh.material = cameraBodyMat;
        }
      }
    });

    // Compute bounding box and center model at (0, 0, 0)
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = maxDim > 0 ? 2.4 / maxDim : 1;

    const wrapper = new THREE.Group();
    clone.position.set(-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor);
    clone.scale.setScalar(scaleFactor);
    wrapper.add(clone);
    return wrapper;
  }, [scene, diffuseTexture, portNormal, leatherNormal]);

  return <primitive object={normalizedModel} />;
};

export const CinemaCamera: React.FC<CinemaCameraProps> = ({
  rotationY = 0,
  rotationX = 0,
  positionZ = 0,
  positionY = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hasExternalModel, setHasExternalModel] = useState(false);

  useEffect(() => {
    fetch('/models/camera.glb', { method: 'HEAD' })
      .then((res) => {
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && !contentType.includes('text/html')) {
          setHasExternalModel(true);
        } else {
          setHasExternalModel(false);
        }
      })
      .catch(() => setHasExternalModel(false));
  }, []);

  // Subtle floating idle motion
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Dampen idle float as camera zooms in close
      const dampener = Math.max(0, 1 - Math.abs(positionZ) * 0.3);
      groupRef.current.position.y = positionY + Math.sin(t * 1.5) * 0.03 * dampener;
      groupRef.current.position.x = Math.cos(t * 1.2) * 0.015 * dampener;
    }
  });

  // Cinema Materials
  const metalBodyMat = new THREE.MeshStandardMaterial({
    color: 0x141418,
    roughness: 0.28,
    metalness: 0.88,
  });

  const gripMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.9,
    metalness: 0.1,
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    roughness: 0.2,
    metalness: 0.95,
  });

  const redRecMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.15,
    metalness: 0.2,
    emissive: 0xef4444,
    emissiveIntensity: 0.8,
  });

  const frontGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transmission: 0.92,
    opacity: 1,
    transparent: true,
    roughness: 0.02,
    ior: 1.55,
    reflectivity: 0.95,
    clearcoat: 1,
  });

  // Dedicated Cinema Viewfinder Screen Materials (Facing -Z, dead-centered at [0, 0, -0.71])
  const viewfinderBezelMat = new THREE.MeshStandardMaterial({
    color: 0x0d0d12,
    roughness: 0.2,
    metalness: 0.9,
  });

  const viewfinderScreenMat = new THREE.MeshStandardMaterial({
    color: 0x030712,
    roughness: 0.08,
    metalness: 0.4,
    emissive: 0x064e3b,
    emissiveIntensity: 0.35,
  });

  const proceduralCameraContent = (
    <group>
      {/* --- CAMERA CHASSIS --- */}
      <mesh material={metalBodyMat} castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.25, 1.4]} />
      </mesh>

      {/* Right Ergonomic Grip */}
      <mesh material={gripMat} position={[0.82, -0.05, 0.1]}>
        <boxGeometry args={[0.22, 1.05, 1.05]} />
      </mesh>

      {/* Top Status Plate */}
      <mesh material={metalBodyMat} position={[0, 0.63, 0]}>
        <boxGeometry args={[1.2, 0.04, 1.1]} />
      </mesh>

      {/* REC Button (Glowing red) */}
      <mesh material={redRecMat} position={[0.62, 0.66, 0.45]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 32]} />
      </mesh>

      {/* Gold Cine Dial */}
      <mesh material={goldAccentMat} position={[-0.45, 0.66, -0.2]}>
        <cylinderGeometry args={[0.13, 0.13, 0.08, 32]} />
      </mesh>

      {/* --- CINE LENS RIG (Facing +Z) --- */}
      <group position={[0, 0, 0.7]}>
        <mesh material={goldAccentMat} position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.1, 48]} />
        </mesh>
        <mesh material={metalBodyMat} position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.44, 0.46, 0.4, 48]} />
        </mesh>
        <mesh material={gripMat} position={[0, 0, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.47, 0.47, 0.12, 48]} />
        </mesh>
        <mesh material={gripMat} position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.22, 48]} />
        </mesh>
        <mesh material={metalBodyMat} position={[0, 0, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.52, 0.47, 0.35, 48]} />
        </mesh>
        <mesh material={frontGlassMat} position={[0, 0, 1.01]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.46, 0.46, 0.04, 48]} />
        </mesh>
        <mesh material={gripMat} position={[0, 0, 1.15]}>
          <boxGeometry args={[1.35, 1.05, 0.25]} />
        </mesh>
        <mesh material={metalBodyMat} position={[0, 0.62, 1.25]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[1.45, 0.03, 0.55]} />
        </mesh>
      </group>

      {/* --- TOP HANDLE RIG --- */}
      <group position={[0, 0.68, 0]}>
        <mesh material={metalBodyMat} position={[0, 0.22, 0.4]}>
          <boxGeometry args={[0.16, 0.44, 0.16]} />
        </mesh>
        <mesh material={metalBodyMat} position={[0, 0.22, -0.4]}>
          <boxGeometry args={[0.16, 0.44, 0.16]} />
        </mesh>
        <mesh material={gripMat} position={[0, 0.44, 0]}>
          <boxGeometry args={[0.18, 0.14, 1.2]} />
        </mesh>
        <mesh material={goldAccentMat} position={[0, 0.54, 0.2]}>
          <boxGeometry args={[0.12, 0.06, 0.12]} />
        </mesh>
      </group>

      {/* --- 15MM RAILS --- */}
      <group position={[0, -0.7, 0.25]}>
        <mesh material={metalBodyMat} position={[0, 0.05, -0.05]}>
          <boxGeometry args={[1.35, 0.16, 0.95]} />
        </mesh>
        <mesh material={gripMat} position={[-0.35, -0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 1.8, 24]} />
        </mesh>
        <mesh material={gripMat} position={[0.35, -0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 1.8, 24]} />
        </mesh>
      </group>

      {/* --- DEDICATED REAR VIEWFINDER MONITOR (Facing -Z, Centered at x=0, y=0) --- */}
      {/* This is the primary target that covers the screen when zoomed into! */}
      <group position={[0, 0, -0.71]} name="viewfinder">
        {/* Outer Monitor Chassis & Sunhood Frame */}
        <mesh material={viewfinderBezelMat} position={[0, 0, 0]}>
          <boxGeometry args={[1.34, 0.96, 0.08]} />
        </mesh>

        {/* Viewfinder Screen Bezel Rim */}
        <mesh material={metalBodyMat} position={[0, 0, -0.042]}>
          <boxGeometry args={[1.26, 0.88, 0.02]} />
        </mesh>

        {/* The Viewfinder Screen Glass Display Surface */}
        <mesh material={viewfinderScreenMat} position={[0, 0, -0.055]}>
          <planeGeometry args={[1.2, 0.82]} />
        </mesh>

        {/* Four Gold Corner Framing Markers on the Viewfinder Bezel */}
        <mesh material={goldAccentMat} position={[-0.58, 0.38, -0.058]}>
          <boxGeometry args={[0.08, 0.02, 0.01]} />
        </mesh>
        <mesh material={goldAccentMat} position={[0.58, 0.38, -0.058]}>
          <boxGeometry args={[0.08, 0.02, 0.01]} />
        </mesh>
        <mesh material={goldAccentMat} position={[-0.58, -0.38, -0.058]}>
          <boxGeometry args={[0.08, 0.02, 0.01]} />
        </mesh>
        <mesh material={goldAccentMat} position={[0.58, -0.38, -0.058]}>
          <boxGeometry args={[0.08, 0.02, 0.01]} />
        </mesh>
      </group>

      {/* Rear Battery Pack Below the Monitor */}
      <mesh material={gripMat} position={[0, -0.38, -0.85]}>
        <boxGeometry args={[0.8, 0.32, 0.24]} />
      </mesh>
    </group>
  );

  return (
    <group
      ref={groupRef}
      rotation={[rotationX, rotationY, 0]}
      position={[0, positionY, positionZ]}
    >
      {hasExternalModel ? (
        <ModelErrorBoundary fallback={proceduralCameraContent}>
          <Suspense fallback={proceduralCameraContent}>
            <ExternalCameraModel modelUrl="/models/camera.glb" />
          </Suspense>
        </ModelErrorBoundary>
      ) : (
        proceduralCameraContent
      )}
    </group>
  );
};
