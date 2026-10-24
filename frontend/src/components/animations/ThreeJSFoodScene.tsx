'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'
import { FoodItem } from '../../types'

interface ThreeJSFoodSceneProps {
  items: Array<FoodItem & { position: [number, number, number] }>
  className?: string
  showControls?: boolean
}

const foodModels = {
  fruits: {
    geometry: <sphereGeometry args={[0.6, 32, 32]} />,
    color: '#ef4444',
    emissive: '#ef4444',
  },
  vegetables: {
    geometry: <coneGeometry args={[0.3, 1.5, 32]} />,
    color: '#f97316',
    emissive: '#f97316',
  },
  dairy: {
    geometry: <cylinderGeometry args={[0.5, 0.4, 1.2, 32]} />,
    color: '#ffffff',
    emissive: '#fbbf24',
  },
  meat: {
    geometry: <sphereGeometry args={[0.5, 24, 24]} />,
    color: '#dc2626',
    emissive: '#dc2626',
  },
  grains: {
    geometry: <boxGeometry args={[0.8, 0.4, 0.8]} />,
    color: '#fbbf24',
    emissive: '#fbbf24',
  },
  canned_goods: {
    geometry: <cylinderGeometry args={[0.4, 0.4, 1, 32]} />,
    color: '#3b82f6',
    emissive: '#3b82f6',
  },
  baked_goods: {
    geometry: <boxGeometry args={[1.2, 0.6, 0.8]} />,
    color: '#fbbf24',
    emissive: '#fbbf24',
  },
  beverages: {
    geometry: <cylinderGeometry args={[0.3, 0.3, 1.5, 32]} />,
    color: '#06b6d4',
    emissive: '#06b6d4',
  },
  prepared_food: {
    geometry: <boxGeometry args={[1, 0.5, 0.7]} />,
    color: '#a855f7',
    emissive: '#a855f7',
  },
  other: {
    geometry: <boxGeometry args={[1, 1, 1]} />,
    color: '#64748b',
    emissive: '#64748b',
  },
}

function FoodItemMesh({ item, index }: { item: FoodItem & { position: [number, number, number] }; index: number }) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.position.y = item.position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1
    }
  })

  const model = foodModels[item.category as keyof typeof foodModels] || foodModels.other

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2} initialPosition={item.position}>
      <group
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.15 : 1}
      >
        <mesh castShadow receiveShadow>
          {model.geometry}
          <meshStandardMaterial
            color={model.color}
            metalness={0.1}
            roughness={0.5}
            emissive={model.emissive}
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
        </mesh>
      </group>
    </Float>
  )
}

function Scene({ items }: { items: Array<FoodItem & { position: [number, number, number] }> }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={1} castShadow />
      <pointLight position={[-3, 5, -3]} intensity={0.8} color="#22c55e" />
      <pointLight position={[3, -5, 3]} intensity={0.6} color="#f97316" />

      {items.map((item, index) => (
        <FoodItemMesh key={item.id} item={item} index={index} />
      ))}

      <ContactShadows opacity={0.1} scale={8} blur={2} />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        autoRotate={false}
        enableDamping
        dampingFactor={0.05}
        minZoom={0.5}
        maxZoom={3}
      />
      <Environment preset="warehouse" background={false} ground={false} />
    </>
  )
}

export default function ThreeJSFoodScene({ items = [], className = '', showControls = true }: ThreeJSFoodSceneProps) {
  const [hasWebGL, setHasWebGL] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setHasWebGL(!!gl)
    } catch {
      setHasWebGL(false)
    }

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener?.('change', handler)
    return () => mediaQuery.removeEventListener?.('change', handler)
  }, [])

  // Generate positions for items
  const positionedItems = items.map((item, index) => ({
    ...item,
    position: [
      (index % 5 - 2) * 2.5,
      Math.floor(index / 5) * 2 - 2,
      (index % 3 - 1) * 2,
    ] as [number, number, number],
  }))

  if (!hasWebGL || prefersReducedMotion) {
    return (
      <div className={className} style={{ minHeight: '300px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-slate-400">3D view unavailable</p>
            <p className="text-sm text-slate-500 mt-1">WebGL not supported or reduced motion enabled</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className} style={{ minHeight: '400px' }}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <Suspense fallback={null}>
          <Scene items={positionedItems} />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Separate component for inventory view
export function Inventory3DView({ items = [] }: { items: Array<FoodItem & { position: [number, number, number] }> }) {
  const [hasWebGL, setHasWebGL] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setHasWebGL(!!gl)
    } catch {
      setHasWebGL(false)
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener?.('change', handler)
    return () => mediaQuery.removeEventListener?.('change', handler)
  }, [])

  if (!hasWebGL || prefersReducedMotion) {
    return null
  }

  return (
    <div className="w-full h-[400px]">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <Suspense fallback={null}>
          <Scene items={items} />
        </Suspense>
      </Canvas>
    </div>
  )
}