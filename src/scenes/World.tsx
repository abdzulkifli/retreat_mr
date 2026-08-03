import { Html, Line, RoundedBox, Sparkles, Torus } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { chapters, type ChapterId } from '../story/chapters';
import { Idea31 } from '../characters/Idea31';

const navy = '#10233F';
const blue = '#28558D';
const teal = '#4B9B9A';
const ivory = '#F4EFE5';
const stone = '#D8D5CD';
const gold = '#C6A15B';
const coral = '#DF745F';
const green = '#66A67A';
const inactive = '#9CA5A0';

type Point3 = [number, number, number];

function Label({ children, position, size = .18, color = navy, pill = false }: {
  children: string;
  position: Point3;
  size?: number;
  color?: string;
  pill?: boolean;
}) {
  const fontSize = Math.max(9, Math.round(size * 58));
  return (
    <Html position={position} center transform distanceFactor={8} style={{ pointerEvents: 'none' }}>
      <span className={pill ? 'scene-label scene-label-pill' : 'scene-label'} style={{ color, fontSize }}>{children}</span>
    </Html>
  );
}

function nextStep(progress: number, steps: number) {
  if (progress >= 99.5) return steps;
  return Math.min(steps - 1, Math.floor((progress + .001) / (100 / steps)));
}

function InteractiveBlock({
  position,
  size,
  label,
  ready,
  complete,
  color,
  completeColor = green,
  labelColor = navy,
  radius = .15,
  rotation = [0, 0, 0],
  onActivate
}: {
  position: Point3;
  size: Point3;
  label: string;
  ready: boolean;
  complete: boolean;
  color: string;
  completeColor?: string;
  labelColor?: string;
  radius?: number;
  rotation?: Point3;
  onActivate: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const pulse = ready ? 1 + Math.sin(clock.elapsedTime * 4.5) * .045 : 1;
    const target = hovered && ready ? 1.08 : pulse;
    const scale = THREE.MathUtils.damp(group.current.scale.x, target, 8, delta);
    group.current.scale.setScalar(scale);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, rotation[1] + (hovered ? .1 : 0), 7, delta);
  });

  const setCursor = (value: boolean) => {
    setHovered(value);
    if (ready) document.body.style.cursor = value ? 'pointer' : 'default';
  };

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      onPointerOver={(event) => { event.stopPropagation(); setCursor(true); }}
      onPointerOut={() => setCursor(false)}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (ready) onActivate();
      }}
    >
      <RoundedBox args={size} radius={radius} castShadow receiveShadow>
        <meshStandardMaterial
          color={complete ? completeColor : ready ? color : inactive}
          emissive={complete ? completeColor : ready ? color : '#000000'}
          emissiveIntensity={complete ? .22 : ready ? .18 : 0}
          roughness={.58}
        />
      </RoundedBox>
      <Label position={[0, 0, size[2] / 2 + .055]} size={.12} color={complete || ready ? labelColor : navy}>{label}</Label>
      {ready && (
        <Torus args={[Math.max(size[0], size[1]) * .62, .026, 8, 48]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, size[2] / 2 + .04]}>
          <meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={.8} transparent opacity={.72} />
        </Torus>
      )}
    </group>
  );
}

function ScenePlatform({ color = stone, width = 8.2, depth = 4.8 }: { color?: string; width?: number; depth?: number }) {
  return (
    <RoundedBox args={[width, .4, depth]} radius={.24} position={[0, -.92, 0]} receiveShadow>
      <meshStandardMaterial color={color} roughness={.82} />
    </RoundedBox>
  );
}

function SceneHeader({ title }: { title: string }) {
  return <Label position={[0, 3.12, -1.65]} size={.3} pill>{title}</Label>;
}

function Retreat({ progress, active, onAct }: { progress: number; active: boolean; onAct: () => void }) {
  const ideas = ['AI', 'CLOUD', 'CX', 'DATA', 'ESG', 'HR', 'APP'];
  const current = nextStep(progress, ideas.length);
  return (
    <group>
      <ScenePlatform color="#D7D0C4" />
      <RoundedBox args={[4.8, .18, 2.1]} radius={.18} position={[0, .02, -.15]} castShadow>
        <meshStandardMaterial color="#B99D75" roughness={.72} />
      </RoundedBox>
      {ideas.map((idea, i) => {
        const angle = i / ideas.length * Math.PI * 2;
        const awake = i < current || progress >= 99.5;
        const position: Point3 = [Math.cos(angle) * 2.8, awake ? .58 + Math.sin(i) * .2 : -.18, Math.sin(angle) * 1.52];
        return (
          <InteractiveBlock
            key={idea}
            position={position}
            size={[1.05, .72, .12]}
            rotation={[0, -angle, awake ? Math.sin(i) * .06 : -.58]}
            label={idea}
            ready={active && i === current}
            complete={awake}
            color={i % 2 ? gold : coral}
            completeColor={i % 2 ? gold : coral}
            labelColor={navy}
            radius={.08}
            onActivate={onAct}
          />
        );
      })}
      <Idea31 mood={progress >= 99.5 ? 'curious' : 'bold'} progress={progress} position={[0, .95, .52]} />
      {active && current < ideas.length && <Label position={[0, 2.05, .7]} size={.13} color={coral} pill>Tap the glowing proposal</Label>}
    </group>
  );
}

function Scanner({ progress, active, onAct }: { progress: number; active: boolean; onAct: () => void }) {
  const scans = ['IDENTITY', 'ACCOUNTABILITY', 'DELIVERY', 'GOVERNANCE'];
  const ring = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Mesh>(null);
  const current = nextStep(progress, scans.length);

  useFrame(({ clock }, delta) => {
    if (ring.current) ring.current.rotation.y += delta * .55;
    if (beam.current) {
      beam.current.position.y = .55 + Math.sin(clock.elapsedTime * 2.2) * 1.02;
      beam.current.scale.x = 1 + Math.sin(clock.elapsedTime * 4) * .08;
    }
  });

  return (
    <group>
      <ScenePlatform color="#C8D5D4" />
      <group ref={ring}>
        <Torus args={[1.36, .075, 12, 60]} rotation={[Math.PI / 2, 0, 0]} position={[0, .55, 0]}><meshStandardMaterial color={teal} emissive={teal} emissiveIntensity={.45} /></Torus>
        <Torus args={[1.05, .04, 10, 60]} position={[0, .55, 0]}><meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={.35} /></Torus>
      </group>
      <RoundedBox args={[2.8, 2.8, 2.2]} radius={.34} position={[0, .55, 0]} castShadow>
        <meshPhysicalMaterial color="#DFF5F3" transparent opacity={.25} roughness={.2} transmission={.42} />
      </RoundedBox>
      <mesh ref={beam} position={[0, .55, .9]}>
        <boxGeometry args={[2.45, .05, .04]} />
        <meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={1.2} transparent opacity={current < scans.length ? .8 : 0} />
      </mesh>
      {scans.map((scan, i) => (
        <InteractiveBlock
          key={scan}
          position={[-3 + i * 2, 2.03, -.3]}
          size={[1.52, .62, .16]}
          label={scan}
          ready={active && i === current}
          complete={i < current || progress >= 99.5}
          color={teal}
          completeColor={teal}
          labelColor={ivory}
          radius={.1}
          onActivate={onAct}
        />
      ))}
      <Idea31 mood={progress >= 99.5 ? 'proud' : current === 2 ? 'panic' : 'curious'} progress={progress} position={[0, .58, .22]} />
      {active && current < scans.length && <Label position={[0, -1.35, 1]} size={.13} color={teal} pill>Activate scan {current + 1} of 4</Label>}
    </group>
  );
}

function Duplicates({ progress, active, onAct }: { progress: number; active: boolean; onAct: () => void }) {
  const names = ['AI ASSISTANT', 'AI KNOWLEDGE', 'SUPER-AGENT', 'SMART SUPPORT'];
  const current = nextStep(progress, names.length);
  const merged = progress >= 99.5;
  return (
    <group>
      <ScenePlatform color="#E0D6BD" />
      {names.map((name, i) => {
        const angle = i / names.length * Math.PI * 2;
        const absorbed = i < current || merged;
        const radius = absorbed ? .55 : 2.45;
        const position: Point3 = [Math.cos(angle) * radius, .5 + Math.sin(i) * .18, Math.sin(angle) * radius * .55];
        return (
          <InteractiveBlock
            key={name}
            position={position}
            size={[1.55, .95, .8]}
            label={name}
            ready={active && i === current}
            complete={absorbed}
            color={[gold, coral, teal, blue][i]}
            completeColor={green}
            labelColor={ivory}
            radius={.22}
            onActivate={onAct}
          />
        );
      })}
      {merged && (
        <group position={[0, .45, -.65]}>
          <RoundedBox args={[3.8, 1.5, .72]} radius={.3} castShadow><meshStandardMaterial color={green} emissive={green} emissiveIntensity={.3} /></RoundedBox>
          <Label position={[0, .08, .42]} size={.2} color={ivory}>CONNECTED CUSTOMER CAPABILITY</Label>
          <Sparkles count={26} scale={[4.6, 2.5, 2]} size={3} speed={.45} color={gold} />
        </group>
      )}
      <Idea31 mood={merged ? 'curious' : 'shocked'} progress={progress} position={[0, 1.25, 1.28]} />
      {active && !merged && <Label position={[0, 2.35, .5]} size={.13} color={gold} pill>Bring the shared capability home</Label>}
    </group>
  );
}

function Dependencies({ progress, active, onAct }: { progress: number; active: boolean; onAct: () => void }) {
  const nodes = ['FINANCE', 'ICT', 'DATA', 'HR', 'RISK', 'OWNER'];
  const current = nextStep(progress, nodes.length);
  const points = useMemo(() => nodes.map((_, i) => new THREE.Vector3(-3 + i * 1.2, i % 2 ? .18 : .82, 0)), []);
  return (
    <group>
      <ScenePlatform color="#B9C6CA" width={8.5} />
      {nodes.map((node, i) => {
        const complete = i < current || progress >= 99.5;
        return (
          <group key={node} position={points[i]}>
            <InteractiveBlock
              position={[0, 0, 0]}
              size={[1.02, .46, 1.02]}
              label={node}
              ready={active && i === current}
              complete={complete}
              color={blue}
              completeColor={teal}
              labelColor={ivory}
              radius={.22}
              onActivate={onAct}
            />
          </group>
        );
      })}
      {points.slice(0, -1).map((point, i) => {
        const built = i < current - 1 || progress >= 99.5;
        return built ? (
          <Line key={i} points={[point.clone().add(new THREE.Vector3(.5, .25, 0)), points[i + 1].clone().add(new THREE.Vector3(-.5, .25, 0))]} color={gold} lineWidth={7} />
        ) : null;
      })}
      <group position={[0, -.22, -1.4]} rotation={[0, 0, progress > 0 ? -.05 : 0]}>
        <RoundedBox args={[2.9, .48, .42]} radius={.12}><meshStandardMaterial color={coral} /></RoundedBox>
        <Label position={[0, 0, .25]} size={.12} color={ivory}>FAST TRACK: NO OWNER / NO BUDGET</Label>
      </group>
      <Idea31 mood={progress >= 99.5 ? 'determined' : 'panic'} progress={progress} position={[-3.25 + Math.min(progress / 100, 1) * 6.2, 1.25, .58]} />
      {active && current < nodes.length && <Label position={[0, 2.35, .3]} size={.13} color={blue} pill>Build the route one condition at a time</Label>}
    </group>
  );
}

function Priority({ progress, active, onAct }: { progress: number; active: boolean; onAct: () => void }) {
  const gates = ['WHY', 'VALUE', 'FEASIBILITY', 'READINESS', 'CONFIDENCE'];
  const current = nextStep(progress, gates.length);
  return (
    <group>
      <ScenePlatform color="#D4C8AD" width={8.5} />
      {gates.map((gate, i) => (
        <InteractiveBlock
          key={gate}
          position={[-3 + i * 1.5, -.42 + i * .52, 0]}
          size={[1.25, .46 + i * .18, 1.55]}
          label={gate}
          ready={active && i === current}
          complete={i < current || progress >= 99.5}
          color={gold}
          completeColor={gold}
          labelColor={navy}
          radius={.16}
          onActivate={onAct}
        />
      ))}
      <mesh position={[3.3, 2.3, -.55]} castShadow><coneGeometry args={[1.12, 2.65, 5]} /><meshStandardMaterial color={blue} roughness={.78} /></mesh>
      <Idea31 mood={progress >= 99.5 ? 'proud' : 'determined'} progress={progress} position={[-3.15 + Math.min(progress / 100, 1) * 6.1, .15 + Math.min(progress / 100, 1) * 2.3, .92]} />
      {active && current < gates.length && <Label position={[0, 2.75, .3]} size={.13} color={gold} pill>Pass gate {current + 1} of 5</Label>}
    </group>
  );
}

function Ownership({ progress, active, onAct }: { progress: number; active: boolean; onAct: () => void }) {
  const responsibilities = ['ALIGN', 'SEQUENCE', 'DELIVER', 'OUTCOME'];
  const current = nextStep(progress, responsibilities.length);
  const done = progress >= 99.5;
  return (
    <group>
      <ScenePlatform color="#C9D7D6" width={8.5} />
      <group position={[-2.35, .2, 0]}>
        <mesh castShadow><cylinderGeometry args={[.72, .84, 1.25, 24]} /><meshStandardMaterial color={blue} /></mesh>
        <Label position={[0, 1.08, 0]} size={.16} pill>CPS</Label>
      </group>
      <group position={[2.35, .2, 0]}>
        <mesh castShadow><cylinderGeometry args={[.72, .84, 1.25, 24]} /><meshStandardMaterial color={green} /></mesh>
        <Label position={[0, 1.08, 0]} size={.16} pill>BUSINESS OWNER</Label>
      </group>
      <Line points={[[-1.4, .45, 0], [1.4, .45, 0]]} color={done ? green : stone} lineWidth={8} dashed={!done} />
      {responsibilities.map((item, i) => {
        const transferred = i < current || done;
        return (
          <InteractiveBlock
            key={item}
            position={[transferred ? 1.45 + (i % 2) * .65 : -1.75 + (i % 2) * .65, 1.35 + Math.floor(i / 2) * .62, -.15]}
            size={[.58, .48, .18]}
            label={item}
            ready={active && i === current}
            complete={transferred}
            color={gold}
            completeColor={i < 2 ? teal : green}
            labelColor={i < 2 ? ivory : navy}
            radius={.08}
            onActivate={onAct}
          />
        );
      })}
      <Idea31 mood={done ? 'humble' : 'curious'} progress={progress} position={[done ? 1.25 : -.85, .92, .82]} />
      {active && !done && <Label position={[0, 2.55, .4]} size={.13} color={green} pill>Move accountability to where delivery lives</Label>}
    </group>
  );
}

function City({ progress, active, onAct, quality }: { progress: number; active: boolean; onAct: () => void; quality: 'high' | 'medium' | 'low' }) {
  const districts = ['FINANCE', 'CUSTOMER', 'DIGITAL', 'GOVERNANCE', 'WORKFORCE', 'EXECUTION'];
  const colors = [green, teal, blue, gold, coral, navy];
  const current = nextStep(progress, districts.length);
  const completeAll = progress >= 99.5;
  return (
    <group>
      <ScenePlatform color="#CDD8D2" width={9} depth={5.2} />
      {districts.map((district, i) => {
        const angle = i / districts.length * Math.PI * 2;
        const on = i < current || completeAll;
        const buildingHeight = 1.15 + (i % 3) * .42;
        const x = Math.cos(angle) * 2.72;
        const z = Math.sin(angle) * 1.62;
        return (
          <group key={district} position={[x, -.2, z]}>
            <InteractiveBlock
              position={[0, 0, 0]}
              size={[1.28, buildingHeight, 1.18]}
              label={district}
              ready={active && i === current}
              complete={on}
              color={colors[i]}
              completeColor={colors[i]}
              labelColor={i === 3 ? navy : ivory}
              radius={.18}
              onActivate={onAct}
            />
            {on && <Line points={[[0, .2, 0], [-x * .76, .42, -z * .76]]} color={gold} lineWidth={3} />}
          </group>
        );
      })}
      <group position={[0, .3, 0]}>
        <mesh castShadow><sphereGeometry args={[.8, 32, 32]} /><meshStandardMaterial color={completeAll ? gold : stone} emissive={completeAll ? gold : '#000'} emissiveIntensity={completeAll ? .5 : 0} /></mesh>
        <Label position={[0, 0, .82]} size={.2}>HOME31</Label>
        {completeAll && quality !== 'low' && <Sparkles count={quality === 'high' ? 70 : 36} scale={[7, 5, 4]} size={3.5} speed={.55} color={gold} />}
      </group>
      <Idea31 mood="proud" progress={progress} position={[0, 1.72, 1.28]} />
      {active && current < districts.length && <Label position={[0, 3.05, .35]} size={.13} color={teal} pill>Light district {current + 1} of 6</Label>}
    </group>
  );
}

function Scene({
  chapter,
  visible,
  active,
  progress,
  onAct,
  quality
}: {
  chapter: ChapterId;
  visible: boolean;
  active: boolean;
  progress: number;
  onAct: () => void;
  quality: 'high' | 'medium' | 'low';
}) {
  const chapterData = chapters.find((item) => item.id === chapter)!;
  return (
    <group position={chapterData.position} visible={visible}>
      <SceneHeader title={chapterData.title} />
      {chapter === 'retreat' && <Retreat progress={progress} active={active} onAct={onAct} />}
      {chapter === 'scanner' && <Scanner progress={progress} active={active} onAct={onAct} />}
      {chapter === 'duplicates' && <Duplicates progress={progress} active={active} onAct={onAct} />}
      {chapter === 'dependencies' && <Dependencies progress={progress} active={active} onAct={onAct} />}
      {chapter === 'priority' && <Priority progress={progress} active={active} onAct={onAct} />}
      {chapter === 'ownership' && <Ownership progress={progress} active={active} onAct={onAct} />}
      {chapter === 'city' && <City progress={progress} active={active} onAct={onAct} quality={quality} />}
    </group>
  );
}

function JourneyRail({ activeIndex }: { activeIndex: number }) {
  const points = chapters.map((chapter) => new THREE.Vector3(chapter.position[0], chapter.position[1] - .65, chapter.position[2] - 1.9));
  const completedPoints = points.slice(0, activeIndex + 1);
  return (
    <group>
      <Line points={points} color="#B6B0A5" lineWidth={2} dashed dashScale={2} />
      {completedPoints.length > 1 && <Line points={completedPoints} color={gold} lineWidth={4} />}
    </group>
  );
}

export function World({
  activeIndex,
  progress,
  onAct,
  quality
}: {
  activeIndex: number;
  progress: Record<ChapterId, number>;
  onAct: () => void;
  quality: 'high' | 'medium' | 'low';
  reducedMotion: boolean;
}) {
  return (
    <group>
      <JourneyRail activeIndex={activeIndex} />
      {quality !== 'low' && <Sparkles count={quality === 'high' ? 90 : 48} scale={[82, 7, 8]} position={[36, 2.2, 0]} size={1.8} speed={.18} color={ivory} opacity={.5} />}
      {chapters.map((chapter, index) => (
        <Scene
          key={chapter.id}
          chapter={chapter.id}
          visible={Math.abs(index - activeIndex) <= 1}
          active={index === activeIndex}
          progress={progress[chapter.id]}
          onAct={onAct}
          quality={quality}
        />
      ))}
    </group>
  );
}
