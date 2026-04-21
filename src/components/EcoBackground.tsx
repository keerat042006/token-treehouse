import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 60;
const RAY_COUNT = 8;

const Particles = () => {
  const groupRef = useRef<THREE.Group>(null);
  const data = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * 14,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 8 - 2,
      size: 0.05 + Math.random() * 0.25,
      speed: 0.002 + Math.random() * 0.006,
      rot: Math.random() * Math.PI,
      color: Math.random() > 0.5 ? '#00e5a0' : '#00c2ff',
    }));
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((mesh, i) => {
      const d = data[i];
      mesh.position.y += d.speed;
      mesh.rotation.x += 0.003;
      mesh.rotation.y += 0.004;
      if (mesh.position.y > 6) mesh.position.y = -6;
    });
  });

  return (
    <group ref={groupRef}>
      {data.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]} rotation={[d.rot, d.rot, 0]}>
          <icosahedronGeometry args={[d.size, 0]} />
          <meshBasicMaterial color={d.color} transparent opacity={0.55} wireframe />
        </mesh>
      ))}
    </group>
  );
};

const LightRays = () => {
  const groupRef = useRef<THREE.Group>(null);
  const rays = useMemo(
    () => Array.from({ length: RAY_COUNT }).map((_, i) => ({
      x: -6 + (i / (RAY_COUNT - 1)) * 12,
      phase: i * 0.7,
    })),
    [],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((mesh, i) => {
      const r = rays[i];
      mesh.rotation.z = Math.sin(clock.elapsedTime * 0.4 + r.phase) * 0.15;
    });
  });

  return (
    <group ref={groupRef} position={[0, 4, -3]}>
      {rays.map((r, i) => (
        <mesh key={i} position={[r.x, 0, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.6, 8, 24, 1, true]} />
          <meshBasicMaterial color="#00e5a0" transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

const TorusBackdrop = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.001;
    ref.current.rotation.y += 0.0015;
  });
  return (
    <mesh ref={ref} position={[0, 0, -4]}>
      <torusKnotGeometry args={[2.5, 0.4, 128, 16]} />
      <meshBasicMaterial color="#00e5a0" wireframe transparent opacity={0.06} />
    </mesh>
  );
};

const SceneFog = () => {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x050d0a, 0.035);
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  return null;
};

const ParallaxCamera = () => {
  const { camera } = useThree();
  useEffect(() => {
    const onScroll = () => {
      camera.position.y = -window.scrollY * 0.002;
      camera.lookAt(0, 0, 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [camera]);
  return null;
};

export const EcoBackground = () => {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneFog />
        <ParallaxCamera />
        <ambientLight intensity={0.4} />
        <TorusBackdrop />
        <LightRays />
        <Particles />
      </Canvas>
    </div>
  );
};
