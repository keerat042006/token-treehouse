import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CountUp } from '@/components/CountUp';

// Rotating wireframe globe
const Globe = ({ hovered }: { hovered: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const speed = hovered ? 0.008 : 0.002;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="#050d0a" transparent opacity={0.95} />
    </mesh>
  );
};

// Wireframe overlay
const GlobeWireframe = ({ hovered }: { hovered: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const speed = hovered ? 0.008 : 0.002;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.01, 24, 16]} />
      <meshBasicMaterial color="#00e5a0" wireframe transparent opacity={hovered ? 0.55 : 0.35} />
    </mesh>
  );
};

// Latitude/longitude grid lines
const GlobeGrid = ({ hovered }: { hovered: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const speed = hovered ? 0.008 : 0.002;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += speed;
    }
  });

  const lines = useMemo(() => {
    const result: THREE.BufferGeometry[] = [];
    // Latitude lines
    for (let lat = -75; lat <= 75; lat += 25) {
      const points: THREE.Vector3[] = [];
      const r = 2.03;
      const phi = (lat * Math.PI) / 180;
      for (let lng = 0; lng <= 360; lng += 5) {
        const theta = (lng * Math.PI) / 180;
        points.push(new THREE.Vector3(
          r * Math.cos(phi) * Math.cos(theta),
          r * Math.sin(phi),
          r * Math.cos(phi) * Math.sin(theta),
        ));
      }
      result.push(new THREE.BufferGeometry().setFromPoints(points));
    }
    // Longitude lines
    for (let lng = 0; lng < 360; lng += 30) {
      const points: THREE.Vector3[] = [];
      const r = 2.03;
      const theta = (lng * Math.PI) / 180;
      for (let lat = -90; lat <= 90; lat += 5) {
        const phi = (lat * Math.PI) / 180;
        points.push(new THREE.Vector3(
          r * Math.cos(phi) * Math.cos(theta),
          r * Math.sin(phi),
          r * Math.cos(phi) * Math.sin(theta),
        ));
      }
      result.push(new THREE.BufferGeometry().setFromPoints(points));
    }
    return result;
  }, []);

  return (
    <group ref={groupRef}>
      {lines.map((geo, i) => (
        <line key={i}>
          <primitive object={geo} attach="geometry" />
          <lineBasicMaterial color="#00e5a0" transparent opacity={0.15} />
        </line>
      ))}
    </group>
  );
};

// Pulsing hotspot dots
const HotspotDots = ({ hovered }: { hovered: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const speed = hovered ? 0.008 : 0.002;

  const dots = useMemo(() =>
    Array.from({ length: 18 }).map(() => {
      const phi = (Math.random() * 160 - 80) * (Math.PI / 180);
      const theta = Math.random() * Math.PI * 2;
      const r = 2.08;
      return {
        x: r * Math.cos(phi) * Math.cos(theta),
        y: r * Math.sin(phi),
        z: r * Math.cos(phi) * Math.sin(theta),
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? '#00e5a0' : '#00ff88',
      };
    }), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += speed;
    groupRef.current.children.forEach((mesh, i) => {
      const d = dots[i];
      const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * (hovered ? 4 : 2) + d.phase);
      (mesh as THREE.Mesh).scale.setScalar(0.5 + pulse * 0.8);
      ((mesh as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.4 + pulse * 0.6;
    });
  });

  return (
    <group ref={groupRef}>
      {dots.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={d.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};

// Outer glow ring
const GlowRing = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 0.8);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.04 + pulse * 0.06;
    }
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.3, 32, 32]} />
      <meshBasicMaterial color="#00e5a0" transparent opacity={0.06} side={THREE.BackSide} />
    </mesh>
  );
};

export const EcoGlobe = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative"
        style={{ width: 280, height: 280 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,229,160,0.12) 0%, transparent 70%)',
            filter: 'blur(20px)',
            transform: 'scale(1.2)',
          }}
        />
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 40 }}
          style={{ borderRadius: '50%', background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#00e5a0" />
          <Globe hovered={hovered} />
          <GlobeWireframe hovered={hovered} />
          <GlobeGrid hovered={hovered} />
          <HotspotDots hovered={hovered} />
          <GlowRing />
        </Canvas>
      </div>

      {/* Counter below globe */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground-2 mb-1">🌍 Eco actions worldwide today</p>
        <p
          className="text-2xl font-extrabold"
          style={{
            color: '#00e5a0',
            textShadow: '0 0 10px #00e5a0, 0 0 20px #00e5a0, 0 0 40px #00ff88',
          }}
        >
          <CountUp end={2847} duration={2.5} />
        </p>
      </div>
    </div>
  );
};
