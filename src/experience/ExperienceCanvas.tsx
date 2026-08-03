import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import { CameraRig } from './CameraRig';
import { World } from '../scenes/World';
import type { ChapterId } from '../story/chapters';

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
      canvas.getContext('webgl')
    );
  } catch {
    return false;
  }
}

export function ExperienceCanvas({
  index,
  progress,
  reducedMotion,
  quality
}: {
  index: number;
  progress: Record<ChapterId, number>;
  reducedMotion: boolean;
  quality: 'high' | 'medium' | 'low';
}) {
  const webglSupported = useMemo(() => typeof window === 'undefined' || supportsWebGL(), []);

  if (!webglSupported) {
    return (
      <div className="webgl-fallback" role="img" aria-label="HOME31 journey illustration fallback">
        <div className="fallback-orbit" aria-hidden="true"><span>31</span></div>
        <strong>3D mode is unavailable on this browser.</strong>
        <span>The HOME31 story and controls remain available.</span>
      </div>
    );
  }

  return (
    <Canvas
      shadows={quality !== 'low'}
      dpr={quality === 'high' ? [1, 1.6] : 1}
      camera={{ position: [0, 2.4, 7.8], fov: 42 }}
      gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#F4EFE5']} />
      <fog attach="fog" args={['#F4EFE5', 10, 24]} />
      <ambientLight intensity={1.55} />
      <hemisphereLight args={['#F4EFE5', '#10233F', 0.9]} />
      <directionalLight position={[4, 9, 5]} intensity={2.2} castShadow={quality !== 'low'} />
      <pointLight position={[-4, 3, 4]} intensity={1.2} color="#4B9B9A" />
      <Suspense fallback={null}>
        <World activeIndex={index} progress={progress} />
        <ContactShadows position={[0, -0.79, 0]} opacity={0.2} scale={120} blur={2.6} far={12} />
      </Suspense>
      <CameraRig index={index} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
