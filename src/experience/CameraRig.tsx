import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { chapters } from '../story/chapters';

export function CameraRig({ index, reducedMotion }: { index: number; reducedMotion: boolean }) {
  const { camera, pointer, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const forward = useMemo(() => new THREE.Vector3(0, 0, -1), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);

  useFrame((_, delta) => {
    const chapter = chapters[index];
    const desktopShift = size.width > 900 ? -1.05 : 0;
    const parallaxX = reducedMotion ? 0 : pointer.x * .18;
    const parallaxY = reducedMotion ? 0 : pointer.y * .12;

    target.set(...chapter.camera).add(new THREE.Vector3(parallaxX, parallaxY, 0));
    look.set(...chapter.position).add(new THREE.Vector3(desktopShift, .55 + parallaxY * .2, 0));

    const speed = reducedMotion ? 8 : 2.3;
    const alpha = 1 - Math.exp(-delta * speed);
    camera.position.lerp(target, alpha);
    direction.copy(look).sub(camera.position).normalize();
    quaternion.setFromUnitVectors(forward, direction);
    camera.quaternion.slerp(quaternion, alpha * 1.15);
  });

  return null;
}
