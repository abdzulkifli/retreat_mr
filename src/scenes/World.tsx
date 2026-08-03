import { Html, Line, RoundedBox, Torus } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { chapters, type ChapterId } from '../story/chapters';
import { Idea31, type IdeaMood } from '../characters/Idea31';

const navy = '#10233F';
const blue = '#28558D';
const teal = '#4B9B9A';
const ivory = '#F4EFE5';
const stone = '#D8D5CD';
const gold = '#C6A15B';
const coral = '#DF745F';
const green = '#66A67A';

function Label({ children, position, size = .18, color = navy }: { children: string; position: [number, number, number]; size?: number; color?: string }) {
  const fontSize = Math.max(9, Math.round(size * 58));
  return (
    <Html position={position} center transform distanceFactor={8} style={{ pointerEvents: 'none' }}>
      <span className="scene-label" style={{ color, fontSize }}>{children}</span>
    </Html>
  );
}

function Retreat({ progress }: { progress: number }) {
  const ideas = ['AI', 'CLOUD', 'CX', 'DATA', 'ESG', 'HR', 'APP'];
  return <group>
    <RoundedBox args={[7.8, .42, 4.7]} radius={.25} position={[0, -.88, 0]} receiveShadow><meshStandardMaterial color={stone} roughness={.86} /></RoundedBox>
    <RoundedBox args={[4.8, .18, 2.1]} radius={.18} position={[0, .05, -.2]} castShadow><meshStandardMaterial color="#b99d75" roughness={.72} /></RoundedBox>
    {ideas.map((idea, i) => {
      const angle = i / ideas.length * Math.PI * 2;
      const awake = progress >= (i + 1) * (100 / ideas.length);
      return <group key={idea} position={[Math.cos(angle) * 2.8, awake ? .55 + Math.sin(i) * .25 : -.25, Math.sin(angle) * 1.5]} rotation={[0, -angle, awake ? Math.sin(i) * .08 : -.6]}>
        <RoundedBox args={[1.05, .72, .08]} radius={.08} castShadow><meshStandardMaterial color={awake ? (i % 2 ? gold : coral) : '#bbb7ae'} roughness={.82} /></RoundedBox>
        <Label position={[0, 0, .07]} size={.16}>{idea}</Label>
      </group>;
    })}
    <Idea31 mood="bold" progress={progress} position={[0, .95, .5]} />
  </group>;
}

function Scanner({ progress }: { progress: number }) {
  const scans = ['IDENTITY', 'ACCOUNTABILITY', 'DELIVERY', 'GOVERNANCE'];
  const ring = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (ring.current) ring.current.rotation.y = clock.elapsedTime * .45; });
  return <group>
    <RoundedBox args={[7.8, .42, 4.7]} radius={.25} position={[0, -.88, 0]} receiveShadow><meshStandardMaterial color="#c8d5d4" /></RoundedBox>
    <group ref={ring}>
      <Torus args={[1.35, .08, 12, 60]} rotation={[Math.PI / 2, 0, 0]} position={[0, .55, 0]}><meshStandardMaterial color={teal} emissive={teal} emissiveIntensity={.35} /></Torus>
      <Torus args={[1.05, .045, 10, 60]} rotation={[0, 0, 0]} position={[0, .55, 0]}><meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={.25} /></Torus>
    </group>
    <RoundedBox args={[2.8, 2.8, 2.2]} radius={.34} position={[0, .55, 0]} castShadow><meshPhysicalMaterial color="#dff5f3" transparent opacity={.25} roughness={.2} transmission={.45} /></RoundedBox>
    {scans.map((s, i) => {
      const lit = progress >= (i + 1) * 25;
      return <group key={s} position={[-3 + i * 2, 1.95, -.3]}>
        <RoundedBox args={[1.45, .58, .14]} radius={.1}><meshStandardMaterial color={lit ? teal : '#8e9ba2'} emissive={lit ? teal : '#000'} emissiveIntensity={.25} /></RoundedBox>
        <Label position={[0, 0, .1]} size={.11} color={ivory}>{s}</Label>
      </group>;
    })}
    <Idea31 mood="curious" progress={progress} position={[0, .58, .2]} />
  </group>;
}

function Duplicates({ progress }: { progress: number }) {
  const names = ['AI ASSISTANT', 'AI KNOWLEDGE', 'SUPER-AGENT', 'SMART SUPPORT'];
  const merged = progress >= 100;
  return <group>
    <RoundedBox args={[7.8, .42, 4.7]} radius={.25} position={[0, -.88, 0]} receiveShadow><meshStandardMaterial color="#e0d6bd" /></RoundedBox>
    {names.map((n, i) => {
      const a = i / names.length * Math.PI * 2;
      const r = merged ? .7 : 2.45;
      return <group key={n} position={[Math.cos(a) * r, .5 + Math.sin(i) * .18, Math.sin(a) * r * .55]}>
        <RoundedBox args={[1.55, .95, .8]} radius={.22} castShadow><meshStandardMaterial color={[gold, coral, teal, blue][i]} roughness={.55} emissive={merged ? green : '#000'} emissiveIntensity={merged ? .22 : 0} /></RoundedBox>
        <Label position={[0, 0, .45]} size={.11} color={ivory}>{n}</Label>
      </group>;
    })}
    {merged && <group position={[0, .5, -.6]}><RoundedBox args={[3.6, 1.4, .7]} radius={.28}><meshStandardMaterial color={green} emissive={green} emissiveIntensity={.22} /></RoundedBox><Label position={[0, 0, .4]} size={.22} color={ivory}>CONNECTED CUSTOMER CAPABILITY</Label></group>}
    <Idea31 mood={merged ? 'curious' : 'shocked'} progress={progress} position={[0, 1.1, 1.2]} />
  </group>;
}

function Dependencies({ progress }: { progress: number }) {
  const nodes = ['FINANCE', 'ICT', 'DATA', 'HR', 'RISK', 'OWNER'];
  const lit = Math.floor(progress / (100 / nodes.length));
  const points = nodes.map((_, i) => {
    const x = -3 + i * 1.2;
    const y = i % 2 ? .2 : .8;
    return new THREE.Vector3(x, y, 0);
  });
  return <group>
    <RoundedBox args={[8.2, .35, 4.7]} radius={.2} position={[0, -1, 0]}><meshStandardMaterial color="#b9c6ca" /></RoundedBox>
    {nodes.map((n, i) => <group key={n} position={points[i]}>
      <mesh castShadow><cylinderGeometry args={[.58, .72, .42, 20]} /><meshStandardMaterial color={i < lit ? teal : '#7f8b93'} emissive={i < lit ? teal : '#000'} emissiveIntensity={.24} /></mesh>
      <Label position={[0, .55, 0]} size={.13}>{n}</Label>
    </group>)}
    {points.slice(0, -1).map((p, i) => i < lit - 1 && <Line key={i} points={[p.clone().add(new THREE.Vector3(.4, .25, 0)), points[i + 1].clone().add(new THREE.Vector3(-.4, .25, 0))]} color={gold} lineWidth={6} />)}
    <group position={[0, -.25, -1.35]}><RoundedBox args={[2.7, .45, .4]} radius={.12}><meshStandardMaterial color={coral} /></RoundedBox><Label position={[0, 0, .24]} size={.12} color={ivory}>FAST TRACK: NO OWNER / NO BUDGET</Label></group>
    <Idea31 mood={progress >= 100 ? 'determined' : 'panic'} progress={progress} position={[-3.25 + Math.min(progress / 100, 1) * 6.2, 1.2, .55]} />
  </group>;
}

function Priority({ progress }: { progress: number }) {
  const gates = ['WHY', 'VALUE', 'FEASIBILITY', 'READINESS', 'CONFIDENCE'];
  const reached = Math.floor(progress / 20);
  return <group>
    <RoundedBox args={[8.2, .35, 4.7]} radius={.2} position={[0, -1, 0]}><meshStandardMaterial color="#d4c8ad" /></RoundedBox>
    {gates.map((g, i) => <group key={g} position={[-3 + i * 1.5, -.45 + i * .52, 0]}>
      <RoundedBox args={[1.25, .44 + i * .18, 1.55]} radius={.16} castShadow><meshStandardMaterial color={i < reached ? gold : '#a7a39a'} emissive={i < reached ? gold : '#000'} emissiveIntensity={.2} /></RoundedBox>
      <Label position={[0, .62 + i * .1, .82]} size={.12}>{g}</Label>
    </group>)}
    <mesh position={[3.25, 2.25, -.5]}><coneGeometry args={[1.1, 2.6, 5]} /><meshStandardMaterial color={blue} roughness={.78} /></mesh>
    <Idea31 mood="determined" progress={progress} position={[-3.15 + Math.min(progress / 100, 1) * 6.1, .15 + Math.min(progress / 100, 1) * 2.25, .9]} />
  </group>;
}

function Ownership({ progress }: { progress: number }) {
  const done = progress >= 100;
  return <group>
    <RoundedBox args={[8.2, .35, 4.7]} radius={.2} position={[0, -1, 0]}><meshStandardMaterial color="#c9d7d6" /></RoundedBox>
    <group position={[-2.3, .2, 0]}><mesh><cylinderGeometry args={[.7, .82, 1.2, 24]} /><meshStandardMaterial color={blue} /></mesh><Label position={[0, 1.05, 0]} size={.16}>CPS</Label></group>
    <group position={[2.3, .2, 0]}><mesh><cylinderGeometry args={[.7, .82, 1.2, 24]} /><meshStandardMaterial color={green} /></mesh><Label position={[0, 1.05, 0]} size={.16}>BUSINESS OWNER</Label></group>
    <Line points={[[-1.4, .45, 0], [1.4, .45, 0]]} color={done ? green : stone} lineWidth={8} dashed={!done} />
    {['MAP', 'SEQUENCE', 'MONITOR'].map((x, i) => <group key={x} position={[-1.55 + i * .55, 1.55, -.2]}><RoundedBox args={[.45, .5, .12]} radius={.07}><meshStandardMaterial color={teal} /></RoundedBox><Label position={[0, 0, .08]} size={.07} color={ivory}>{x}</Label></group>)}
    {['KEY', 'TOOLKIT', 'OUTCOME'].map((x, i) => <group key={x} position={[1.2 + i * .55, 1.55, -.2]}><RoundedBox args={[.45, .5, .12]} radius={.07}><meshStandardMaterial color={gold} /></RoundedBox><Label position={[0, 0, .08]} size={.07}>{x}</Label></group>)}
    <Idea31 mood={done ? 'humble' : 'curious'} progress={progress} position={[done ? 1.35 : -.8, .9, .8]} />
  </group>;
}

function City({ progress }: { progress: number }) {
  const districts = ['FINANCE', 'CUSTOMER', 'DIGITAL', 'GOVERNANCE', 'WORKFORCE', 'EXECUTION'];
  const lit = Math.floor(progress / (100 / districts.length));
  return <group>
    <RoundedBox args={[8.8, .35, 5]} radius={.22} position={[0, -1, 0]}><meshStandardMaterial color="#cdd8d2" /></RoundedBox>
    {districts.map((d, i) => {
      const a = i / districts.length * Math.PI * 2;
      const on = i < lit;
      return <group key={d} position={[Math.cos(a) * 2.65, -.2, Math.sin(a) * 1.55]}>
        <RoundedBox args={[1.25, 1.15 + (i % 3) * .4, 1.15]} radius={.18} castShadow><meshStandardMaterial color={on ? [green, teal, blue, gold, coral, navy][i] : '#9ca5a0'} emissive={on ? [green, teal, blue, gold, coral, navy][i] : '#000'} emissiveIntensity={on ? .22 : 0} /></RoundedBox>
        <Label position={[0, 1.05 + (i % 3) * .2, .65]} size={.11} color={on && i !== 3 ? ivory : navy}>{d}</Label>
        {on && <Line points={[[0, .2, 0], [-Math.cos(a) * 2.05, .4, -Math.sin(a) * 1.15]]} color={gold} lineWidth={3} />}
      </group>;
    })}
    <group position={[0, .25, 0]}><mesh><sphereGeometry args={[.78, 32, 32]} /><meshStandardMaterial color={progress >= 100 ? gold : stone} emissive={progress >= 100 ? gold : '#000'} emissiveIntensity={.35} /></mesh><Label position={[0, 0, .8]} size={.2}>HOME31</Label></group>
    <Idea31 mood="proud" progress={progress} position={[0, 1.65, 1.2]} />
  </group>;
}

function Scene({ chapter, visible, progress }: { chapter: ChapterId; visible: boolean; progress: number }) {
  const c = chapters.find(x => x.id === chapter)!;
  return <group position={c.position} visible={visible}>
    <Label position={[0, 3.1, -1.6]} size={.3}>{c.title}</Label>
    {chapter === 'retreat' && <Retreat progress={progress} />}
    {chapter === 'scanner' && <Scanner progress={progress} />}
    {chapter === 'duplicates' && <Duplicates progress={progress} />}
    {chapter === 'dependencies' && <Dependencies progress={progress} />}
    {chapter === 'priority' && <Priority progress={progress} />}
    {chapter === 'ownership' && <Ownership progress={progress} />}
    {chapter === 'city' && <City progress={progress} />}
  </group>;
}

export function World({ activeIndex, progress }: { activeIndex: number; progress: Record<ChapterId, number> }) {
  return (
    <group>
      {chapters.map((c, i) => (
        <Scene
          key={c.id}
          chapter={c.id}
          visible={Math.abs(i - activeIndex) <= 1}
          progress={progress[c.id]}
        />
      ))}
    </group>
  );
}
