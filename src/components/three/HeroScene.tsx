import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ACCENT = '#c8f542';
const INK = '#f2f2ef';

/**
 * A multi-agent network: nodes scattered on a flattened shell, linked when
 * close — a literal render of "many models reasoning together". Slow drift,
 * pointer parallax, and an FPS governor that drops resolution before frames.
 */
function Network({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const setDpr = useThree((s) => s.setDpr);
  const fps = useRef({ frames: 0, last: 0, degraded: false });

  const { positions, linePositions } = useMemo(() => {
    // Seeded PRNG (mulberry32) — pure, and the constellation is stable across renders
    let seed = 0x52b5; // "RB"
    const rand = () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 2.1 + rand() * 1.5;
      const v = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
      v.y *= 0.55; // flatten into a galaxy-like disc
      pts.push(v);
    }
    const positions = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => p.toArray(positions, i * 3));

    const linePts: number[] = [];
    const maxDist = 1.05;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < maxDist) {
          linePts.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }
    return { positions, linePositions: new Float32Array(linePts) };
  }, [count]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    g.rotation.y += delta * 0.05;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.16, 0.04);
    g.position.x = THREE.MathUtils.lerp(g.position.x, state.pointer.x * 0.4, 0.04);

    // FPS governor: if we can't hold ~45fps, drop to 1x pixel ratio once
    const f = fps.current;
    f.frames++;
    const now = state.clock.elapsedTime;
    if (now - f.last >= 2) {
      const avg = f.frames / (now - f.last);
      if (!f.degraded && f.last > 0 && avg < 45) {
        setDpr(1);
        f.degraded = true;
      }
      f.frames = 0;
      f.last = now;
    }
  });

  return (
    <group ref={group} rotation={[0.35, 0, -0.12]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color={ACCENT}
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={INK} transparent opacity={0.1} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export default function HeroScene() {
  // Scale node count to the device: fewer agents on small/weak hardware
  const count = useMemo(() => {
    const small = window.innerWidth < 768;
    const weak =
      (navigator.hardwareConcurrency ?? 8) <= 4 ||
      ((navigator as { deviceMemory?: number }).deviceMemory ?? 8) <= 4;
    if (small || weak) return 90;
    return 170;
  }, []);

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 5], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <Network count={count} />
    </Canvas>
  );
}
