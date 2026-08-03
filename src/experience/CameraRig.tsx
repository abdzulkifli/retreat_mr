import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { chapters } from '../story/chapters';

export function CameraRig({ index, reducedMotion }: { index: number; reducedMotion: boolean }) {
  const { camera } = useThree();
  const target = new THREE.Vector3();
  const look = new THREE.Vector3();
  useFrame(() => {
    const c = chapters[index];
    target.set(...c.camera);
    look.set(...c.position).add(new THREE.Vector3(0, 0.5, 0));
    camera.position.lerp(target, reducedMotion ? 0.18 : 0.045);
    const dir = look.clone().sub(camera.position).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, -1), dir);
    camera.quaternion.slerp(quaternion, reducedMotion ? 0.22 : 0.055);
  });
  return null;
}
