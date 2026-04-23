import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useWorldNav } from './WorldNavContext';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

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

// Single floating panel in the 3D scene
const FloatingPanel = ({
  page,
  index,
  total,
  focusedIndex,
  onNavigate,
  isActive,
}: {
  page: typeof PAGES[0];
  index: number;
  total: number;
  focusedIndex: number;
  onNavigate: () => void;
  isActive: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const isFocused = index === focusedIndex;

  // Arc layout
  const angle = ((index - total / 2) / total) * Math.PI * 1.4;
  const radius = 9;
  const baseX = Math.sin(angle) * radius;
  const baseZ = Math.cos(angle) * radius - 6;
  const baseY = Math.sin(index * 0.6) * 0.4;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.position.y = baseY + Math.sin(t * 0.5 + index * 0.8) * 0.25;
    meshRef.current.rotation.y = angle * 0.6 + Math.sin(t * 0.25 + index) * 0.04;
    const targetScale = isFocused ? 1.12 : hovered ? 1.06 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  // Fly-in on mount
  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.position.set(
      (Math.random() - 0.5) * 24,
      (Math.random() - 0.5) * 16,
      -25
    );
    let frame: number;
    const settle = () => {
      if (!meshRef.current) return;
      meshRef.current.position.lerp(new THREE.Vector3(baseX, baseY, baseZ), 0.07);
      if (meshRef.current.position.distanceTo(new THREE.Vector3(baseX, baseY, baseZ)) > 0.05) {
        frame = requestAnimationFrame(settle);
      }
    };
    const timer = setTimeout(() => { frame = requestAnimationFrame(settle); }, index * 80);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); };
  }, []);

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[baseX, baseY, baseZ]}
        onClick={onNavigate}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'grab'; }}
      >
        <boxGeometry args={[3.2, 2.1, 0.06]} />
        <meshStandardMaterial
          color={isActive ? page.color : isFocused ? '#1e2a3a' : '#141820'}
          emissive={page.color}
          emissiveIntensity={isFocused ? 0.5 : hovered ? 0.35 : 0.08}
          metalness={0.7}
          roughness={0.25}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(3.2, 2.1, 0.06)]} />
          <lineBasicMaterial
            color={isFocused ? '#00e5a0' : '#00e5a0'}
            opacity={isFocused ? 1 : hovered ? 0.8 : 0.3}
            transparent
          />
        </lineSegments>

        {/* Always-visible label on panel face */}
        <Html position={[0, 0, 0.04]} center distanceFactor={6}>
          <div
            style={{
              textAlign: 'center',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div style={{ fontSize: 28, lineHeight: 1 }}>{page.emoji}</div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: isFocused ? '#00e5a0' : '#fff',
                marginTop: 6,
                letterSpacing: '0.05em',
                textShadow: isFocused ? '0 0 8px #00e5a0' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {page.label}
            </div>
          </div>
        </Html>
      </mesh>

      <pointLight
        position={[baseX, baseY, baseZ + 1]}
        color={page.color}
        intensity={isFocused ? 3 : hovered ? 1.5 : 0.4}
        distance={4}
      />
    </group>
  );
};

// Camera smoothly follows focused panel
const CameraController = ({
  focusedIndex,
  flyingTo,
}: {
  focusedIndex: number;
  flyingTo: number | null;
}) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 2, 16));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const idx = flyingTo !== null ? flyingTo : focusedIndex;
    const angle = ((idx - PAGES.length / 2) / PAGES.length) * Math.PI * 1.4;
    const radius = 9;
    const px = Math.sin(angle) * radius;
    const pz = Math.cos(angle) * radius - 6;

    if (flyingTo !== null) {
      // Fly into panel
      targetPos.current.set(px, 0, pz + 2.5);
      targetLook.current.set(px, 0, pz);
    } else {
      // Orbit view — pull back and center on focused panel
      const cx = px * 0.35;
      const cz = pz * 0.2 + 14;
      targetPos.current.set(cx, 1.5, cz);
      targetLook.current.set(px * 0.5, 0, pz * 0.3);
    }
  }, [focusedIndex, flyingTo]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, flyingTo !== null ? 0.1 : 0.06);
    const lk = new THREE.Vector3().copy(camera.position).lerp(targetLook.current, 0.08);
    camera.lookAt(targetLook.current);
  });

  return null;
};

// Radial blur during fly-in
const RadialBlur = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.55, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9995, pointerEvents: 'none',
          background: 'radial-gradient(circle, transparent 25%, rgba(0,0,0,0.85) 100%)',
          backdropFilter: 'blur(3px)',
        }}
      />
    )}
  </AnimatePresence>
);

export const WorldNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { worldMode, exitWorld } = useWorldNav();
  const [focusedIndex, setFocusedIndex] = useState(() => {
    const i = PAGES.findIndex(p => p.path === location.pathname);
    return i >= 0 ? i : 0;
  });
  const [flyingTo, setFlyingTo] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((idx: number) => {
    setFocusedIndex(Math.max(0, Math.min(PAGES.length - 1, idx)));
  }, []);

  const prev = () => goTo(focusedIndex - 1);
  const next = () => goTo(focusedIndex + 1);

  const handleNavigate = (idx: number) => {
    setFlyingTo(idx);
    setTimeout(() => {
      navigate(PAGES[idx].path);
      exitWorld();
      setFlyingTo(null);
    }, 850);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Enter') handleNavigate(focusedIndex);
      if (e.key === 'Escape') exitWorld();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedIndex]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  if (!worldMode) return null;

  const current = PAGES[focusedIndex];

  return (
    <>
      <RadialBlur active={flyingTo !== null} />

      {/* 3D canvas */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9980, cursor: 'grab' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Canvas
          camera={{ position: [0, 1.5, 16], fov: 58 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <CameraController focusedIndex={focusedIndex} flyingTo={flyingTo} />
          <ambientLight intensity={0.25} />
          <pointLight position={[0, 8, 8]} intensity={0.6} color="#00e5a0" />
          <pointLight position={[0, -8, -8]} intensity={0.3} color="#00c2ff" />
          {PAGES.map((page, i) => (
            <FloatingPanel
              key={page.path}
              page={page}
              index={i}
              total={PAGES.length}
              focusedIndex={focusedIndex}
              onNavigate={() => handleNavigate(i)}
              isActive={location.pathname === page.path}
            />
          ))}
        </Canvas>
      </div>

      {/* ── TOP: section label ── */}
      <div
        style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0,229,160,0.3)', borderRadius: 40,
          padding: '8px 20px',
        }}
      >
        <span style={{ fontSize: 18 }}>{current.emoji}</span>
        <span style={{ color: '#00e5a0', fontWeight: 700, fontSize: 14, letterSpacing: '0.06em' }}>
          {current.label}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
          {focusedIndex + 1} / {PAGES.length}
        </span>
      </div>

      {/* ── CLOSE button top-right ── */}
      <button
        onClick={exitWorld}
        style={{
          position: 'fixed', top: 20, right: 24, zIndex: 9999,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="Close World View"
      >
        <X size={18} />
      </button>

      {/* ── LEFT arrow ── */}
      <button
        onClick={prev}
        disabled={focusedIndex === 0}
        style={{
          position: 'fixed', left: 20, top: '50%', transform: 'translateY(-50%)',
          zIndex: 9999, width: 52, height: 52, borderRadius: '50%',
          background: focusedIndex === 0 ? 'rgba(0,0,0,0.3)' : 'rgba(0,229,160,0.15)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${focusedIndex === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(0,229,160,0.5)'}`,
          color: focusedIndex === 0 ? 'rgba(255,255,255,0.3)' : '#00e5a0',
          cursor: focusedIndex === 0 ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: focusedIndex === 0 ? 'none' : '0 0 16px rgba(0,229,160,0.3)',
          transition: 'all 0.2s ease',
        }}
        title="Previous"
      >
        <ChevronLeft size={24} />
      </button>

      {/* ── RIGHT arrow ── */}
      <button
        onClick={next}
        disabled={focusedIndex === PAGES.length - 1}
        style={{
          position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)',
          zIndex: 9999, width: 52, height: 52, borderRadius: '50%',
          background: focusedIndex === PAGES.length - 1 ? 'rgba(0,0,0,0.3)' : 'rgba(0,229,160,0.15)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${focusedIndex === PAGES.length - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(0,229,160,0.5)'}`,
          color: focusedIndex === PAGES.length - 1 ? 'rgba(255,255,255,0.3)' : '#00e5a0',
          cursor: focusedIndex === PAGES.length - 1 ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: focusedIndex === PAGES.length - 1 ? 'none' : '0 0 16px rgba(0,229,160,0.3)',
          transition: 'all 0.2s ease',
        }}
        title="Next"
      >
        <ChevronRight size={24} />
      </button>

      {/* ── BOTTOM: dot indicators + navigate button ── */}
      <div
        style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        }}
      >
        {/* Dots */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {PAGES.map((p, i) => (
            <button
              key={p.path}
              onClick={() => goTo(i)}
              title={p.label}
              style={{
                width: i === focusedIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === focusedIndex ? '#00e5a0' : 'rgba(255,255,255,0.25)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.25s ease',
                boxShadow: i === focusedIndex ? '0 0 8px rgba(0,229,160,0.7)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Navigate button */}
        <button
          onClick={() => handleNavigate(focusedIndex)}
          style={{
            padding: '11px 28px',
            background: 'linear-gradient(135deg, #00e5a0, #00c2ff)',
            color: '#000',
            border: 'none',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0,229,160,0.45)',
            letterSpacing: '0.03em',
          }}
        >
          Go to {current.label} →
        </button>
      </div>
    </>
  );
};
