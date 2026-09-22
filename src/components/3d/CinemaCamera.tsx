import React, { Component, ErrorInfo, ReactNode, Suspense, useRef } from 'react';
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

function createCinemaScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 680;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Cinematic gradient background (atmospheric midnight blues & anamorphic horizon sweep)
  const bgGrad = ctx.createRadialGradient(512, 340, 50, 512, 340, 500);
  bgGrad.addColorStop(0, '#1a2744');
  bgGrad.addColorStop(0.4, '#0f172a');
  bgGrad.addColorStop(0.8, '#080c14');
  bgGrad.addColorStop(1, '#030509');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 680);

  // Anamorphic horizontal flare streak
  const flareGrad = ctx.createLinearGradient(0, 340, 1024, 340);
  flareGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
  flareGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.15)');
  flareGrad.addColorStop(0.5, 'rgba(125, 211, 252, 0.55)');
  flareGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.15)');
  flareGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = flareGrad;
  ctx.fillRect(0, 335, 1024, 10);

  // Subtle warm amber ground reflection
  const warmGrad = ctx.createRadialGradient(512, 460, 20, 512, 460, 300);
  warmGrad.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
  warmGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = warmGrad;
  ctx.fillRect(0, 340, 1024, 340);

  // 2. 2.39:1 Anamorphic Scope Letterbox
  const scopeHeight = 1024 / 2.39; // ~428px
  const letterboxTop = (680 - scopeHeight) / 2; // ~126px
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(0, 0, 1024, letterboxTop);
  ctx.fillRect(0, 680 - letterboxTop, 1024, letterboxTop);

  // Safe frame border
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, letterboxTop + 10, 964, scopeHeight - 20);

  // Rule of thirds grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 6]);
  // Vertical lines
  ctx.beginPath();
  ctx.moveTo(1024 / 3, letterboxTop);
  ctx.lineTo(1024 / 3, 680 - letterboxTop);
  ctx.moveTo((1024 / 3) * 2, letterboxTop);
  ctx.lineTo((1024 / 3) * 2, 680 - letterboxTop);
  // Horizontal lines
  ctx.moveTo(30, letterboxTop + (scopeHeight - 20) / 3);
  ctx.lineTo(994, letterboxTop + (scopeHeight - 20) / 3);
  ctx.moveTo(30, letterboxTop + ((scopeHeight - 20) / 3) * 2);
  ctx.lineTo(994, letterboxTop + ((scopeHeight - 20) / 3) * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Center Crosshair
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(502, 340);
  ctx.lineTo(522, 340);
  ctx.moveTo(512, 330);
  ctx.lineTo(512, 350);
  ctx.stroke();

  // 3. Monitor Telemetry Overlay
  // Top left: REC indicator + timecode
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(60, letterboxTop + 35, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 22px monospace';
  ctx.fillText('REC', 78, letterboxTop + 43);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('01:14:28:12', 150, letterboxTop + 43);

  // Top center: 4K RAW
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('VIEWFINDER 4K DCI', 410, letterboxTop + 43);

  // Top right: Battery & Media
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('98% [BAT]', 880, letterboxTop + 43);

  // Bottom left: Exposure
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('T 1.5   1/48   ISO 800   5600K', 60, 680 - letterboxTop - 25);

  // Bottom right: LUT & FPS
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('23.98 FPS • KODAK 2383', 750, 680 - letterboxTop - 25);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createViewfinderEyepieceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Deep cinematic optical prism view
  const bgGrad = ctx.createRadialGradient(384, 256, 30, 384, 256, 400);
  bgGrad.addColorStop(0, '#1e293b');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(0.85, '#090d16');
  bgGrad.addColorStop(1, '#020408');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 768, 512);

  // Anamorphic flare streak through the optical glass
  const flareGrad = ctx.createLinearGradient(0, 256, 768, 256);
  flareGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
  flareGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.25)');
  flareGrad.addColorStop(0.5, 'rgba(125, 211, 252, 0.7)');
  flareGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.25)');
  flareGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = flareGrad;
  ctx.fillRect(0, 250, 768, 12);

  // Warm golden ground reflection
  const warmGrad = ctx.createRadialGradient(384, 380, 20, 384, 380, 260);
  warmGrad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
  warmGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = warmGrad;
  ctx.fillRect(0, 256, 768, 256);

  // 2. 2.39:1 Cinema Framing Lines
  const scopeHeight = 768 / 2.39; // ~321px
  const letterboxTop = (512 - scopeHeight) / 2; // ~95px
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, letterboxTop + 8, 696, scopeHeight - 16);

  // 3. 9-Point Autofocus Array & Center Reticle (Canon 5D Style)
  ctx.strokeStyle = '#ef4444';
  ctx.fillStyle = '#ef4444';
  ctx.lineWidth = 1.8;

  // Center AF bracket
  ctx.strokeRect(364, 236, 40, 40);
  ctx.beginPath();
  ctx.arc(384, 256, 3, 0, Math.PI * 2);
  ctx.fill();

  // Surrounding AF points
  const afPoints = [
    [260, 256], [508, 256], // Left, Right
    [384, 170], [384, 342], // Top, Bottom
    [290, 195], [478, 195], // Top-Left, Top-Right
    [290, 317], [478, 317], // Bottom-Left, Bottom-Right
  ];
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
  afPoints.forEach(([x, y]) => {
    ctx.strokeRect(x - 8, y - 8, 16, 16);
  });

  // 4. Optical Viewfinder Top Status Readout
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(56, letterboxTop + 24, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('REC', 68, letterboxTop + 29);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('VIEWFINDER 4K DCI', 315, letterboxTop + 29);

  // 5. Authentic Bottom Optical 7-Segment Green LCD Bar
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('1/500   F 2.8   [●]   +1.3   ISO 800   ( 428 )', 140, 512 - letterboxTop - 18);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const ExternalCameraModel: React.FC<{ modelUrl: string }> = ({ modelUrl }) => {
  console.log('[ExternalCameraModel] Loading model and textures...');
  const { scene } = useGLTF(modelUrl);
  const [diffuseTexture, portNormal, leatherNormal] = useTexture([
    '/models/20131125021751311225.jpg',
    '/models/20131125021751312630.jpg',
    '/models/2013112502175131295.jpg',
  ]);
  console.log('[ExternalCameraModel] Scene and textures ready! Meshes:', scene.children.length);

  const screenTexture = React.useMemo(() => createCinemaScreenTexture(), []);
  const viewfinderTexture = React.useMemo(() => createViewfinderEyepieceTexture(), []);

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

    // Illuminated rear cinema monitor
    const liveScreenMat = new THREE.MeshStandardMaterial({
      map: screenTexture,
      emissiveMap: screenTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 1.15,
      roughness: 0.15,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // Illuminated optical viewfinder eyepiece portal
    const viewfinderEyepieceMat = new THREE.MeshStandardMaterial({
      map: viewfinderTexture,
      emissiveMap: viewfinderTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 1.25,
      roughness: 0.1,
      metalness: 0.05,
      side: THREE.DoubleSide,
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

    // Realistic matte polycarbonate DSLR body casing
    const cameraBodyMat = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      roughness: 0.68,
      metalness: 0.03,
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

        if (name.includes('09')) {
          // Optical viewfinder eyepiece glass: Generate exact normalized UVs from vertex 3D positions
          const geom = mesh.geometry.clone();
          const posAttr = geom.attributes.position;
          if (posAttr) {
            const pos = posAttr.array as Float32Array;
            const count = posAttr.count;
            const newUvs = new Float32Array(count * 2);
            // Mesh 09 bounds from camera.glb: minX = 7.726, maxX = 23.204, minY = 73.961, maxY = 83.913
            const xMin = 7.726, xMax = 23.204;
            const yMin = 73.961, yMax = 83.913;
            for (let i = 0; i < count; i++) {
              const px = pos[i * 3];
              const py = pos[i * 3 + 1];
              // Facing camera back: xMax is viewfinder left (u=0), xMin is viewfinder right (u=1)
              newUvs[i * 2] = (xMax - px) / (xMax - xMin);
              // yMin is viewfinder bottom (v=0), yMax is viewfinder top (v=1)
              newUvs[i * 2 + 1] = (py - yMin) / (yMax - yMin);
            }
            geom.setAttribute('uv', new THREE.BufferAttribute(newUvs, 2));
          }
          mesh.geometry = geom;
          mesh.material = viewfinderEyepieceMat;
        } else if (name.includes('26') || name.includes('27')) {
          // Rear LCD preview monitor: Generate exact normalized UVs from vertex 3D positions
          const geom = mesh.geometry.clone();
          const posAttr = geom.attributes.position;
          if (posAttr) {
            const pos = posAttr.array as Float32Array;
            const count = posAttr.count;
            const newUvs = new Float32Array(count * 2);
            const xMin = -9.3764, xMax = 56.3058;
            const yMin = 11.408, yMax = 64.2878;
            for (let i = 0; i < count; i++) {
              const px = pos[i * 3];
              const py = pos[i * 3 + 1];
              // Facing camera back: xMax is screen left (u=0), xMin is screen right (u=1)
              newUvs[i * 2] = (xMax - px) / (xMax - xMin);
              // yMin is screen bottom (v=0), yMax is screen top (v=1)
              newUvs[i * 2 + 1] = (py - yMin) / (yMax - yMin);
            }
            geom.setAttribute('uv', new THREE.BufferAttribute(newUvs, 2));
          }
          mesh.geometry = geom;
          mesh.material = liveScreenMat;
        } else if (name.includes('24') || name.includes('25')) {
          // Front optical lens glass elements
          mesh.material = opticalGlassMat;
        } else if (name.includes('16') || name.includes('05')) {
          // Top status screen glass
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
        } else if (name.includes('15')) {
          // Top LCD status readout
          mesh.material = topScreenMat;
        } else if (name.includes('07')) {
          // Front red tally LED
          mesh.material = redTallyMat;
        } else if (name.includes('34')) {
          // Viewfinder rubber eyecup
          mesh.material = eyecupRubberMat;
        } else if (name.includes('13') || name.includes('29') || name.includes('32')) {
          // Dark metal dials, latches, collars (Mesh 21 retained in cameraBodyMat for 5D badge)
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
      <ModelErrorBoundary fallback={proceduralCameraContent}>
        <Suspense fallback={proceduralCameraContent}>
          <ExternalCameraModel modelUrl="/models/camera.glb" />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
};
