import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export type IdeaMood = 'bold' | 'curious' | 'shocked' | 'panic' | 'determined' | 'humble' | 'proud';

const moodShape: Record<IdeaMood, { mouthY: number; mouthX: number; brow: number; glow: string }> = {
  bold: { mouthY: .16, mouthX: .34, brow: -.08, glow: '#C6A15B' },
  curious: { mouthY: .12, mouthX: .22, brow: .08, glow: '#4B9B9A' },
  shocked: { mouthY: .34, mouthX: .22, brow: .18, glow: '#DF745F' },
  panic: { mouthY: .28, mouthX: .18, brow: .24, glow: '#DF745F' },
  determined: { mouthY: .08, mouthX: .3, brow: -.18, glow: '#C6A15B' },
  humble: { mouthY: .11, mouthX: .24, brow: .02, glow: '#66A67A' },
  proud: { mouthY: .12, mouthX: .36, brow: -.05, glow: '#66A67A' }
};

export function Idea31({
  active = true,
  mood = 'bold',
  position = [0, 0.8, 0] as [number, number, number],
  progress = 0
}: {
  active?: boolean;
  mood?: IdeaMood;
  position?: [number, number, number];
  progress?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const shape = moodShape[mood];
  const seed = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock, pointer }, delta) => {
    if (!root.current || !body.current) return;
    const t = clock.elapsedTime + seed;
    const energy = active ? 1 : .25;
    const run = mood === 'determined' ? 1 : 0;
    const shake = mood === 'panic' ? Math.sin(t * 18) * .035 : 0;
    const celebrate = mood === 'proud' && progress >= 100 ? 1 : 0;

    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, pointer.x * .3, 5, delta);
    root.current.rotation.z = Math.sin(t * 2.3) * .025 * energy + shake;
    root.current.position.y = position[1] + Math.sin(t * 2.1) * .06 * energy + (celebrate ? Math.abs(Math.sin(t * 4)) * .12 : 0);
    body.current.scale.y = 1 + Math.sin(t * 2.1) * .025 * energy;
    body.current.scale.x = 1 - Math.sin(t * 2.1) * .012 * energy;

    if (leftArm.current && rightArm.current) {
      leftArm.current.rotation.z = .35 + Math.sin(t * (2.5 + run * 3)) * (.18 + run * .25) + celebrate * .9;
      rightArm.current.rotation.z = -.35 - Math.sin(t * (2.5 + run * 3)) * (.18 + run * .25) - celebrate * .9;
    }
    if (leftLeg.current && rightLeg.current) {
      leftLeg.current.rotation.z = Math.sin(t * (3 + run * 4)) * (.08 + run * .28);
      rightLeg.current.rotation.z = -Math.sin(t * (3 + run * 4)) * (.08 + run * .28);
    }
    if (eyes.current) {
      eyes.current.rotation.y = THREE.MathUtils.damp(eyes.current.rotation.y, pointer.x * .16, 6, delta);
      eyes.current.rotation.x = THREE.MathUtils.damp(eyes.current.rotation.x, -pointer.y * .1, 6, delta);
    }
  });

  return (
    <group ref={root} position={position}>
      <group scale={active ? 1 : .82}>
        <mesh ref={body} castShadow>
          <capsuleGeometry args={[0.56, 0.82, 14, 28]} />
          <meshStandardMaterial color="#F4EFE5" roughness={0.58} metalness={0.02} />
        </mesh>

        <mesh position={[0, .08, .48]}>
          <sphereGeometry args={[.39, 28, 28]} />
          <meshStandardMaterial color={shape.glow} emissive={shape.glow} emissiveIntensity={active ? .48 : .12} transparent opacity={.2} />
        </mesh>

        <group ref={eyes} position={[0, .34, .54]}>
          {[-.22, .22].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <mesh><sphereGeometry args={[.095, 20, 20]} /><meshStandardMaterial color="#ffffff" /></mesh>
              <mesh position={[0, -.01, .075]}><sphereGeometry args={[.046, 16, 16]} /><meshStandardMaterial color="#10233F" /></mesh>
              <mesh position={[0, .14 + shape.brow, .015]} rotation={[0, 0, x < 0 ? -.18 - shape.brow : .18 + shape.brow]}>
                <capsuleGeometry args={[.025, .17, 6, 12]} /><meshStandardMaterial color="#10233F" />
              </mesh>
            </group>
          ))}
        </group>

        <mesh position={[0, .03, .59]} scale={[shape.mouthX, shape.mouthY, .08]}>
          <sphereGeometry args={[.34, 22, 22]} /><meshStandardMaterial color="#DF745F" />
        </mesh>

        <Html position={[0, -.45, .59]} center transform distanceFactor={8} style={{ pointerEvents: 'none' }}><span className="idea-number">31</span></Html>

        <group ref={leftArm} position={[-.56, .04, 0]}>
          <mesh position={[-.28, -.03, 0]} rotation={[0, 0, .85]}><capsuleGeometry args={[.075, .42, 7, 14]} /><meshStandardMaterial color="#28558D" /></mesh>
          <mesh position={[-.53, -.29, 0]}><sphereGeometry args={[.1, 14, 14]} /><meshStandardMaterial color="#F4EFE5" /></mesh>
        </group>
        <group ref={rightArm} position={[.56, .04, 0]}>
          <mesh position={[.28, -.03, 0]} rotation={[0, 0, -.85]}><capsuleGeometry args={[.075, .42, 7, 14]} /><meshStandardMaterial color="#28558D" /></mesh>
          <mesh position={[.53, -.29, 0]}><sphereGeometry args={[.1, 14, 14]} /><meshStandardMaterial color="#F4EFE5" /></mesh>
        </group>

        <group ref={leftLeg} position={[-.25, -.69, 0]}>
          <mesh position={[0, -.28, 0]}><capsuleGeometry args={[.085, .38, 7, 14]} /><meshStandardMaterial color="#10233F" /></mesh>
          <mesh position={[-.04, -.51, .08]} scale={[1.3, .55, 1.5]}><sphereGeometry args={[.13, 14, 14]} /><meshStandardMaterial color="#28558D" /></mesh>
        </group>
        <group ref={rightLeg} position={[.25, -.69, 0]}>
          <mesh position={[0, -.28, 0]}><capsuleGeometry args={[.085, .38, 7, 14]} /><meshStandardMaterial color="#10233F" /></mesh>
          <mesh position={[.04, -.51, .08]} scale={[1.3, .55, 1.5]}><sphereGeometry args={[.13, 14, 14]} /><meshStandardMaterial color="#28558D" /></mesh>
        </group>

        <mesh position={[0, .96, -.04]} rotation={[0, 0, .18]}>
          <coneGeometry args={[.14, .42, 16]} />
          <meshStandardMaterial color={shape.glow} emissive={shape.glow} emissiveIntensity={.32} />
        </mesh>
      </group>
    </group>
  );
}
