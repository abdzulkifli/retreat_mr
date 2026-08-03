import { Html, Sparkles, Torus } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const gold = '#C6A15B';

export type IdeaMood = 'bold' | 'curious' | 'shocked' | 'panic' | 'determined' | 'humble' | 'proud';

const moodShape: Record<IdeaMood, { mouthY: number; mouthX: number; brow: number; glow: string; symbol: string }> = {
  bold: { mouthY: .15, mouthX: .35, brow: -.08, glow: '#C6A15B', symbol: '!' },
  curious: { mouthY: .12, mouthX: .22, brow: .08, glow: '#4B9B9A', symbol: '?' },
  shocked: { mouthY: .35, mouthX: .22, brow: .18, glow: '#DF745F', symbol: '?!' },
  panic: { mouthY: .28, mouthX: .18, brow: .24, glow: '#DF745F', symbol: '!!' },
  determined: { mouthY: .08, mouthX: .3, brow: -.18, glow: '#C6A15B', symbol: '→' },
  humble: { mouthY: .11, mouthX: .24, brow: .02, glow: '#66A67A', symbol: '✓' },
  proud: { mouthY: .12, mouthX: .36, brow: -.05, glow: '#66A67A', symbol: '★' }
};

export function Idea31({
  active = true,
  mood = 'bold',
  position = [0, .8, 0] as [number, number, number],
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
  const antenna = useRef<THREE.Group>(null);
  const aura = useRef<THREE.Group>(null);
  const shape = moodShape[mood];
  const seed = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock, pointer }, delta) => {
    if (!root.current || !body.current) return;
    const time = clock.elapsedTime + seed;
    const energy = active ? 1 : .25;
    const run = mood === 'determined' ? 1 : 0;
    const panic = mood === 'panic' ? 1 : 0;
    const celebrate = mood === 'proud' && progress >= 99.5 ? 1 : 0;
    const shock = mood === 'shocked' ? 1 : 0;

    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, pointer.x * .32, 5, delta);
    root.current.rotation.z = Math.sin(time * 2.4) * .026 * energy + Math.sin(time * 19) * .03 * panic;
    root.current.position.y = position[1] + Math.sin(time * 2.15) * .065 * energy + Math.abs(Math.sin(time * 4.2)) * .14 * celebrate;
    root.current.position.x = position[0] + Math.sin(time * 16) * .018 * shock;
    body.current.scale.y = 1 + Math.sin(time * 2.15) * .03 * energy - panic * .02;
    body.current.scale.x = 1 - Math.sin(time * 2.15) * .014 * energy + shock * .04;

    if (leftArm.current && rightArm.current) {
      leftArm.current.rotation.z = .35 + Math.sin(time * (2.5 + run * 3.5)) * (.18 + run * .28) + celebrate * .95;
      rightArm.current.rotation.z = -.35 - Math.sin(time * (2.5 + run * 3.5)) * (.18 + run * .28) - celebrate * .95;
      if (panic) {
        leftArm.current.rotation.x = Math.sin(time * 15) * .16;
        rightArm.current.rotation.x = -Math.sin(time * 15) * .16;
      }
    }
    if (leftLeg.current && rightLeg.current) {
      leftLeg.current.rotation.z = Math.sin(time * (3 + run * 4.5)) * (.08 + run * .3);
      rightLeg.current.rotation.z = -Math.sin(time * (3 + run * 4.5)) * (.08 + run * .3);
    }
    if (eyes.current) {
      eyes.current.rotation.y = THREE.MathUtils.damp(eyes.current.rotation.y, pointer.x * .16, 6, delta);
      eyes.current.rotation.x = THREE.MathUtils.damp(eyes.current.rotation.x, -pointer.y * .1, 6, delta);
    }
    if (antenna.current) antenna.current.rotation.z = .18 + Math.sin(time * 3.3) * .12;
    if (aura.current) {
      aura.current.rotation.y += delta * (celebrate ? 2.2 : .6);
      const auraScale = 1 + Math.sin(time * 3) * .06;
      aura.current.scale.setScalar(auraScale);
    }
  });

  return (
    <group ref={root} position={position}>
      <group ref={aura}>
        <Torus args={[.92, .022, 8, 52]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={shape.glow} emissive={shape.glow} emissiveIntensity={.8} transparent opacity={.34} />
        </Torus>
        <Torus args={[1.04, .012, 8, 52]} rotation={[Math.PI / 2, .6, 0]}>
          <meshStandardMaterial color={shape.glow} emissive={shape.glow} emissiveIntensity={.5} transparent opacity={.2} />
        </Torus>
      </group>

      <group scale={active ? 1 : .82}>
        <mesh ref={body} castShadow>
          <capsuleGeometry args={[.56, .82, 14, 28]} />
          <meshStandardMaterial color="#F4EFE5" roughness={.56} metalness={.02} />
        </mesh>

        <mesh position={[0, .08, .48]}>
          <sphereGeometry args={[.39, 28, 28]} />
          <meshStandardMaterial color={shape.glow} emissive={shape.glow} emissiveIntensity={active ? .55 : .12} transparent opacity={.22} />
        </mesh>

        <group ref={eyes} position={[0, .34, .54]}>
          {[-.22, .22].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <mesh><sphereGeometry args={[.095, 20, 20]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
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

        <Html position={[0, -.45, .59]} center transform distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <span className="idea-number">31</span>
        </Html>

        <Html position={[.78, .86, .12]} center transform distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <span className="idea-symbol" style={{ color: shape.glow }}>{shape.symbol}</span>
        </Html>

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

        <group ref={antenna} position={[0, .92, -.04]} rotation={[0, 0, .18]}>
          <mesh position={[0, .18, 0]}><capsuleGeometry args={[.035, .28, 6, 12]} /><meshStandardMaterial color="#10233F" /></mesh>
          <mesh position={[0, .39, 0]}><sphereGeometry args={[.11, 18, 18]} /><meshStandardMaterial color={shape.glow} emissive={shape.glow} emissiveIntensity={.8} /></mesh>
        </group>

        {mood === 'determined' && (
          <group position={[0, -.28, -.55]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh><coneGeometry args={[.2, .62, 18]} /><meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={1} transparent opacity={.82} /></mesh>
          </group>
        )}
      </group>

      {(mood === 'proud' || mood === 'shocked') && <Sparkles count={mood === 'proud' ? 22 : 10} scale={[2.3, 2.6, 1.6]} size={3} speed={.55} color={shape.glow} />}
    </group>
  );
}
