'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float, Html, Environment, Stars, ContactShadows, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// Custom shaders for food glow effect
const foodVertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const foodFragmentShader = `
  uniform vec3 glowColor;
  uniform float time;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    vec3 glow = glowColor * intensity * (1.0 + sin(time * 2.0) * 0.2);
    gl_FragColor = vec4(glow, 1.0);
  }
`

// Food Item Component
interface FoodItem3DProps {
  position: [number, number, number]
  type: 'apple' | 'carrot' | 'bread' | 'milk' | 'meat' | 'can'
  scale?: number
  delay?: number
}

function FoodItem3D({ position, type, scale = 1, delay = 0 }: FoodItem3DProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.15
    }
  })

  const getColor = () => {
    switch (type) {
      case 'apple': return '#ef4444'
      case 'carrot': return '#f97316'
      case 'bread': return '#fbbf24'
      case 'milk': return '#ffffff'
      case 'meat': return '#dc2626'
      case 'can': return '#3b82f6'
      default: return '#22c55e'
    }
  }

  const getGeometry = () => {
    switch (type) {
      case 'apple':
        return <sphereGeometry args={[0.6, 32, 32]} />
      case 'carrot':
        return <coneGeometry args={[0.3, 1.5, 32]} />
      case 'bread':
        return <boxGeometry args={[1.2, 0.6, 0.8]} />
      case 'milk':
        return <cylinderGeometry args={[0.5, 0.4, 1.2, 32]} />
      case 'meat':
        return <sphereGeometry args={[0.5, 24, 24]} />
      case 'can':
        return <cylinderGeometry args={[0.4, 0.4, 1, 32]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.3}
      floatIntensity={0.3}
      initialPosition={position}
    >
      <group
        ref={meshRef}
        scale={scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh
          castShadow
          receiveShadow
          scale={hovered ? 1.1 : 1}
        >
          {getGeometry()}
          <meshStandardMaterial
            color={getColor()}
            metalness={0.1}
            roughness={0.6}
            emissive={getColor()}
            emissiveIntensity={hovered ? 0.2 : 0.05}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Floating Particles
function Particles({ count = 80 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * viewport.width * 0.8
    positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 0.8
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5

    const color = new THREE.Color()
    color.setHSL(0.3 + Math.random() * 0.2, 0.6, 0.5)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 3 + 1
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Glowing Ring
function GlowingRing({ position, radius = 3 }: { position: [number, number, number]; radius?: number }) {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.3
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.2
      ringRef.current.material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <mesh ref={ringRef} position={position}>
      <torusGeometry args={[radius, 0.08, 16, 100]} />
      <meshBasicMaterial
        color="#22c55e"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Scene Component
function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 7]} intensity={1.5} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={1} color="#22c55e" />
      <pointLight position={[5, -5, 5]} intensity={0.8} color="#f97316" />

      {/* Food items floating */}
      <FoodItem3D position={[-3, 0.5, -1]} type="apple" delay={0} />
      <FoodItem3D position={[2.5, 1, 1]} type="carrot" scale={1.2} delay={1} />
      <FoodItem3D position={[-1, -1.5, 2]} type="bread" delay={2} />
      <FoodItem3D position={[3, -0.5, -2]} type="milk" delay={3} />
      <FoodItem3D position={[-2, 1.5, 1]} type="meat" delay={4} />
      <FoodItem3D position={[1, -2, -1]} type="can" delay={5} />

      <GlowingRing position={[0, 0, 0]} radius={3.5} />
      <Particles count={100} />

      <ContactShadows opacity={0.15} scale={10} blur={2} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.05}
      />
      <Environment
        preset="city"
        background={false}
        ground={false}
      />
    </>
  )
}

// Cursor position hook
function useCursorPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return position
}

// Camera controller for cursor parallax
function CameraController() {
  const { camera } = useThree()
  const cursor = useCursorPosition()

  useFrame(() => {
    const x = (cursor.x / window.innerWidth - 0.5) * 0.5
    const y = (cursor.y / window.innerHeight - 0.5) * 0.5

    camera.position.x += (x - camera.position.x) * 0.05
    camera.position.y += (-y - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default function ThreeJSHero() {
  return (
    <div className="relative w-full h-full min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <Suspense fallback={null}>
          <HeroScene />
          <CameraController />
        </Suspense>
      </Canvas>

      {/* Fallback for reduced motion */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
    </div>
  )
}

// Separate component for landing page to avoid SSR issues
export function ThreeJSHeroLanding() {
  return (
    <div className="relative w-full h-full min-h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <Suspense fallback={null}>
          <HeroScene />
          <CameraController />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
    </div>
  )
}