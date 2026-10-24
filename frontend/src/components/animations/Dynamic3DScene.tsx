import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

interface Dynamic3DSceneProps {
  sceneType: 'dashboard' | 'inventory' | 'matching' | 'pickups' | 'analytics'
  className?: string
}

// 1. Dashboard Scene: Floating Harvest Crate
function DashboardScene() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Crate Base */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[2, 0.4, 2]} />
          <meshStandardMaterial color="#2d5a3c" roughness={0.7} />
        </mesh>
        {/* Produce Spheres (Apples / Oranges) */}
        {[-0.5, 0.5].map((x, i) =>
          [-0.5, 0.5].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.2 + (i+j)*0.1, z]} castShadow>
              <sphereGeometry args={[0.4, 24, 24]} />
              <meshStandardMaterial color={i === 0 ? '#ef4444' : '#f97316'} roughness={0.3} metalness={0.2} />
            </mesh>
          ))
        )}
      </Float>
    </group>
  )
}

// 2. Inventory Scene: Stacked Temperature Crates
function InventoryScene() {
  return (
    <group>
      {[-1.5, 0, 1.5].map((x, idx) => (
        <Float key={x} speed={1.5 + idx * 0.2} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh position={[x, idx * 0.8 - 0.8, 0]} castShadow>
            <boxGeometry args={[1.2, 0.7, 1.2]} />
            <meshStandardMaterial
              color={idx === 0 ? '#3b82f6' : idx === 1 ? '#22c55e' : '#f59e0b'}
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// 3. Matching Scene: Network Redistribution Nodes
function MatchingScene() {
  const lineRef = useRef<THREE.Line>(null)
  const points = [new THREE.Vector3(-2, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(2, 0, 0)]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <group>
      <line geometry={geometry}>
        <lineBasicMaterial color="#4ade80" linewidth={3} />
      </line>
      <mesh position={[-2, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

// 4. Pickups Scene: Logistics Route Node
function PickupsScene() {
  const wheelRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z = state.clock.elapsedTime * 4
    }
  })

  return (
    <group>
      <Float speed={3} floatIntensity={0.4}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2, 1, 1]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.4} />
        </mesh>
        <mesh ref={wheelRef} position={[-0.6, -0.6, 0.5]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.6, -0.6, 0.5]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </Float>
    </group>
  )
}

// 5. Analytics Scene: Rising Impact Columns
function AnalyticsScene() {
  return (
    <group>
      {[-1.2, -0.4, 0.4, 1.2].map((x, idx) => {
        const height = 0.8 + idx * 0.5
        return (
          <mesh key={x} position={[x, height / 2 - 1, 0]} castShadow>
            <boxGeometry args={[0.6, height, 0.6]} />
            <meshStandardMaterial
              color={idx === 3 ? '#22c55e' : '#4b8c65'}
              metalness={0.2}
              roughness={0.4}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export function Dynamic3DScene({ sceneType, className = '' }: Dynamic3DSceneProps) {
  const [hasWebGL, setHasWebGL] = useState(true)

  return (
    <div className={className} style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
          <pointLight position={[-5, -5, -5]} intensity={0.4} color="#f97316" />

          {sceneType === 'dashboard' && <DashboardScene />}
          {sceneType === 'inventory' && <InventoryScene />}
          {sceneType === 'matching' && <MatchingScene />}
          {sceneType === 'pickups' && <PickupsScene />}
          {sceneType === 'analytics' && <AnalyticsScene />}

          <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={10} blur={2} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
