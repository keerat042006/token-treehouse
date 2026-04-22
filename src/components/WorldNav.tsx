import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useWorldNav } from './WorldNavContext';

// Page definitions
const PAGES = [
  { path: '/', label: 'Dashboard', emoji: '📊', color: '#3B8BEB' },
  { path: '/sell', label: 'Sell Waste', emoji: '♻️', color: '#00e5a0' },
  { path: '/pickup', label: 'Pickup', emoji: '🚚', color: '#f59e0b' },
  { path: '/marketplace', label: 'Marketplace', emoji: '🎁', color: '#10b981' },
  { path: '/arcade', label: 'Arcade', emoji: '🎮', color: '#3b8beb' },
  { path: '/wallet', label: 'Wallet', emoji: '💰', color: '#f59e0b' },
  { path: '/leaderboard', label: 'Leaderboard', emoji: '🏆', color: '#ff6b35' },
  { path: '/history', label: 'History', emoji: '📜', color: '#00c2ff' },
  { path: '/map', label: 'Eco Map', emoji: '🗺️', color: '#10b981' },
  { path: '/about', label: 'About', emoji: 'ℹ️', color: '#00e5a0' },
];

// Single floating panel
const FloatingPanel = ({
  page,
  index,
  total,
  onNavigate,
  isActive,
}: {
  page: typeof PAGES[0];
  index: number;
  total: number;
  onNavigate: () => void;
  isActive: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Arrange panels in an arc
  const angle = ((index - total / 2) / total) * Math.PI * 1.2;
  const radius = 8;
  const baseX = Math.sin(angle) * radius;
  const baseZ = Math.cos(angle) * radius - 5;
  const baseY = Math.sin(index * 0.5) * 0.3;

  // Idle floating animation
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.position.y = baseY + Math.sin(t * 0.5 + index * 0.8) * 0.3;
    meshRef.current.rotation.y = angle + Math.sin(t * 0.3 + index) * 0.05;
    
    // Hover scale
    const targetScale = hovered ? 1.05 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  // Fly-in animation on mount
  useEffect(() => {
    if (!meshRef.current) return;
    const startPos = new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      -20
    );
    meshRef.current.position.copy(startPos);
    
    const animate = () => {
      if (!meshRef.current) return;
      meshRef.current.position.lerp(new THREE.Vector3(baseX, baseY, baseZ), 0.08);
      if (meshRef.current.position.distanceTo(new THREE.Vector3(baseX, baseY, baseZ)) > 0.1) {
        requestAnimationFrame(animate);
      }
    };
    setTimeout(() => animate(), index * 100);
  }, []);

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[baseX, baseY, baseZ]}
        onClick={onNavigate}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Panel body with thickness */}
        <boxGeometry args={[3, 2, 0.05]} />
        <meshStandardMaterial
          color={isActive ? page.color : '#1a1d24'}
          emissive={page.color}
          emissiveIntensity={hovered ? 0.4 : 0.1}
          metalness={0.8}
          roughness={0.2}
        />
        
        {/* Glowing edges */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(3, 2, 0.05)]} />
          <lineBasicMaterial color="#00e5a0" opacity={hovered ? 0.9 : 0.4} transparent />
        </lineSegments>

        {/* Label floating above */}
        {hovered && (
          <Html position={[0, 1.3, 0]} center>
            <div
              style={{
                background: 'rgba(0, 229, 160, 0.95)',
                color: '#000',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0, 229, 160, 0.5)',
                pointerEvents: 'none',
              }}
            >
              {page.emoji} {page.label}
            </div>
          </Html>
        )}
      </mesh>

      {/* Pulsing glow */}
      <pointLight
        position={[baseX, baseY, baseZ + 0.5]}
        color={page.color}
        intensity={hovered ? 2 : 0.5}
        distance={3}
      />
    </group>
  );
};

// Camera controller for smooth fly-in/out
const CameraController = ({ targetPage }: { targetPage: string | null }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 15));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (targetPage) {
      // Fly into the selected panel
      const pageIndex = PAGES.findIndex(p => p.path === targetPage);
      if (pageIndex !== -1) {
        const angle = ((pageIndex - PAGES.length / 2) / PAGES.length) * Math.PI * 1.2;
        const radius = 8;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - 5;
        targetPos.current.set(x, 0, z + 3);
        targetLookAt.current.set(x, 0, z);
      }
    } else {
      // Pull back to world view
      targetPos.current.set(0, 2, 15);
      targetLookAt.current.set(0, 0, 0);
    }
  }, [targetPage]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.08);
    const lookTarget = new THREE.Vector3();
    lookTarget.lerp(targetLookAt.current, 0.08);
    camera.lookAt(lookTarget);
  });

  return null;
};

// Main 3D scene
const Scene = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const location = useLocation();
  const [activePage, setActivePage] = useState<string | null>(null);

  const handlePanelClick = (path: string) => {
    setActivePage(path);
    setTimeout(() => {
      onNavigate(path);
    }, 800);
  };

  return (
    <>
      <CameraController targetPage={activePage} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
        minDistance={10}
        maxDistance={25}
        enableDamping
        dampingFactor={0.05}
      />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00e5a0" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#00c2ff" />

      {PAGES.map((page, i) => (
        <FloatingPanel
          key={page.path}
          page={page}
          index={i}
          total={PAGES.length}
          onNavigate={() => handlePanelClick(page.path)}
          isActive={location.pathname === page.path}
        />
      ))}

      {/* Scanline overlay plane */}
      <mesh position={[0, 0, -10]} rotation={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial
          color="#000"
          transparent
          opacity={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

// Radial blur overlay during camera movement
const RadialBlur = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9995,
          pointerEvents: 'none',
          background: 'radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.8) 100%)',
          backdropFilter: 'blur(4px)',
        }}
      />
    )}
  </AnimatePresence>
);

// Main component
export const WorldNav = () => {
  const navigate = useNavigate();
  const { worldMode, exitWorld } = useWorldNav();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigate = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
      exitWorld();
      setIsNavigating(false);
    }, 800);
  };

  if (!worldMode) return null;

  return (
    <>
      <RadialBlur active={isNavigating} />
      
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9990,
          cursor: 'grab',
        }}
      >
        <Canvas
          camera={{ position: [0, 2, 15], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Scene onNavigate={handleNavigate} />
        </Canvas>
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
        onClick={exitWorld}
        style={{
          position: 'fixed',
          bottom: 32,
          left: 32,
          zIndex: 9999,
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #00e5a0, #00c2ff)',
          color: '#000',
          border: 'none',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0, 229, 160, 0.4)',
        }}
      >
        ← Back to World
      </motion.button>
    </>
  );
};
