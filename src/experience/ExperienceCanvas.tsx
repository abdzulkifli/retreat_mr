import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { World } from '../scenes/World';
import { chapters, type ChapterId } from '../story/chapters';

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function Atmosphere({ index, quality }: { index: number; quality: 'high' | 'medium' | 'low' }) {
  const { scene } = useThree();
  const target = useRef(new THREE.Color(chapters[index].atmosphere));
  const light = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    target.current.set(chapters[index].atmosphere);
    const background = scene.background instanceof THREE.Color ? scene.background : new THREE.Color('#F4EFE5');
    background.lerp(target.current, 1 - Math.exp(-delta * 2.2));
    scene.background = background;
    if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(background);
    if (light.current) {
      const chapter = chapters[index];
      light.current.position.x = THREE.MathUtils.damp(light.current.position.x, chapter.position[0] - 2, 3, delta);
      light.current.position.y = THREE.MathUtils.damp(light.current.position.y, chapter.position[1] + 4, 3, delta);
      light.current.position.z = THREE.MathUtils.damp(light.current.position.z, chapter.position[2] + 4, 3, delta);
      light.current.color.lerp(new THREE.Color(chapter.accent), 1 - Math.exp(-delta * 3));
    }
  });

  return <pointLight ref={light} intensity={quality === 'low' ? .6 : 1.35} distance={18} decay={1.8} />;
}

export function ExperienceCanvas({
  index,
  progress,
  reducedMotion,
  quality,
  onAct
}: {
  index: number;
  progress: Record<ChapterId, number>;
  reducedMotion: boolean;
  quality: 'high' | 'medium' | 'low';
  onAct: () => void;
}) {
  const webglSupported = useMemo(() => typeof window === 'undefined' || supportsWebGL(), []);
  const active = chapters[index];

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
      dpr={quality === 'high' ? [1, 1.65] : quality === 'medium' ? [1, 1.25] : 1}
      camera={{ position: [0, 2.5, 8.4], fov: 42 }}
      gl={{ antialias: quality !== 'low', powerPreference: 'high-performance', alpha: false }}
    >
      <color attach="background" args={['#F4EFE5']} />
      <fog attach="fog" args={['#F4EFE5', 11, 27]} />
      <ambientLight intensity={quality === 'low' ? 1.45 : 1.75} />
      <hemisphereLight args={['#F4EFE5', '#10233F', quality === 'low' ? .65 : .95]} />
      <directionalLight position={[4, 10, 6]} intensity={2.1} castShadow={quality !== 'low'} shadow-mapSize-width={quality === 'high' ? 2048 : 1024} shadow-mapSize-height={quality === 'high' ? 2048 : 1024} />
      <Atmosphere index={index} quality={quality} />
      <Suspense fallback={null}>
        <World activeIndex={index} progress={progress} onAct={onAct} quality={quality} reducedMotion={reducedMotion} />
        {quality !== 'low' && (
          <ContactShadows
            position={[active.position[0], active.position[1] - .78, active.position[2]]}
            opacity={.23}
            scale={12}
            blur={2.8}
            far={9}
          />
        )}
      </Suspense>
      <CameraRig index={index} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
