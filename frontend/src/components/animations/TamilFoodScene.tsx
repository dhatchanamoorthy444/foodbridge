import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

const C = {
  idli: '#FBF4E2',
  rice: '#F7EFD8',
  sambar: '#C96A1E',
  chutney: '#5C8A3C',
  dosa: '#C57B2B',
  vada: '#B5651D',
  coffee: '#5B3A29',
  leaf: '#2E7D4F',
  tomato: '#FF5A36',
  carrot: '#FF9F1C',
  brinjal: '#6B3FA0',
  drumstick: '#4F7D36',
  banana: '#F2C94C',
  coconut: '#6B4A2E',
  steel: '#C9CDD2',
}

function Spin({
  children,
  speed = 0.25,
  wobble = 0.08,
}: {
  children: React.ReactNode
  speed?: number
  wobble?: number
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.y = Math.sin(t * speed) * wobble * 4
    ref.current.rotation.z = Math.sin(t * speed * 0.8) * wobble
  })
  return <group ref={ref}>{children}</group>
}

function Steam({ count = 6, height = 1 }: { count?: number; height?: number }) {
  const ref = useRef<THREE.Group>(null)
  const seeds = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ offset: i / count, sway: Math.random() * Math.PI * 2 })),
    [count]
  )

  useFrame(({ clock }) => {
    const group = ref.current
    if (!group) return
    group.children.forEach((child, i) => {
      const seed = seeds[i]
      const t = (clock.elapsedTime * 0.35 + seed.offset) % 1
      child.position.y = t * height
      child.position.x = Math.sin(t * Math.PI * 2 + seed.sway) * 0.12
      const mesh = child as THREE.Mesh
      const material = mesh.material as THREE.MeshStandardMaterial
      material.opacity = 0.32 * (1 - t)
      mesh.scale.setScalar(0.07 + t * 0.14)
    })
  })

  return (
    <group ref={ref} position={[0, 0.25, 0]}>
      {seeds.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#FFF8E7" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Idli({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.19, 0]} scale={[0.58, 0.24, 0.58]} castShadow>
          <sphereGeometry args={[1, 32, 16]} />
          <meshStandardMaterial color={C.idli} roughness={0.85} />
        </mesh>
      ))}
      <Steam count={4} height={0.9} />
    </group>
  )
}

function Vada({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <torusGeometry args={[0.3, 0.15, 16, 36]} />
        <meshStandardMaterial color={C.vada} roughness={0.6} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i / 6) * Math.PI * 2) * 0.3, Math.sin((i / 6) * Math.PI * 2) * 0.3, 0.06]}
          scale={0.035}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#2B2B2B" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function DosaRoll({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2.4]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.22, 1.25, 28]} />
        <meshStandardMaterial color={C.dosa} roughness={0.55} />
      </mesh>
      <mesh position={[0.42, 0.04, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.13, 0.17, 0.9, 24]} />
        <meshStandardMaterial color="#D28B3E" roughness={0.55} />
      </mesh>
    </group>
  )
}

function FilterCoffee({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.38, 0.18, 32]} />
        <meshStandardMaterial color={C.steel} metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.23, 0.2, 0.5, 28]} />
        <meshStandardMaterial color={C.steel} metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.22, 0.23, 0.04, 28]} />
        <meshStandardMaterial color={C.coffee} roughness={0.4} />
      </mesh>
      <Steam count={4} height={0.75} />
    </group>
  )
}

function CoconutChutney({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.26, 0.22, 0.14, 28]} />
        <meshStandardMaterial color={C.steel} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.03, 28]} />
        <meshStandardMaterial color={C.chutney} roughness={0.6} />
      </mesh>
    </group>
  )
}

function SambarBowl({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.28, 0.23, 0.16, 28]} />
        <meshStandardMaterial color={C.steel} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.03, 28]} />
        <meshStandardMaterial color={C.sambar} roughness={0.4} />
      </mesh>
    </group>
  )
}

function BananaLeafMeal() {
  return (
    <group rotation={[0, 0.2, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1.55, 1, 1]} receiveShadow>
        <circleGeometry args={[1.35, 56]} />
        <meshStandardMaterial color={C.leaf} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.45, 1, 1]}>
        <circleGeometry args={[1.3, 56]} />
        <meshStandardMaterial color="#3B8C58" roughness={0.65} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.35, 0.2, 0.25]} scale={[0.48, 0.16, 0.48]} castShadow>
        <sphereGeometry args={[1, 28, 14]} />
        <meshStandardMaterial color={C.rice} roughness={0.9} />
      </mesh>
      <SambarBowl position={[0.55, 0.18, 0.5]} />
      <CoconutChutney position={[0.78, 0.18, -0.18]} />
      <Vada position={[-0.75, 0.22, -0.4]} />
    </group>
  )
}

function Tomato({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh scale={[0.38, 0.34, 0.38]} castShadow>
        <sphereGeometry args={[1, 28, 22]} />
        <meshStandardMaterial color={C.tomato} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.32, 0]} scale={[0.18, 0.08, 0.18]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color="#2E7D4F" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
        <meshStandardMaterial color="#1F5A37" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Carrot({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale} rotation={[0, 0, Math.PI / 3.4]}>
      <mesh castShadow>
        <coneGeometry args={[0.2, 0.95, 22]} />
        <meshStandardMaterial color={C.carrot} roughness={0.45} />
      </mesh>
      {[-0.12, 0, 0.12].map((x, i) => (
        <mesh key={i} position={[x, 0.58 + Math.abs(x), 0]} rotation={[0, 0, x * 3]} scale={0.05}>
          <coneGeometry args={[1, 3.2, 8]} />
          <meshStandardMaterial color="#3F8A45" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function Brinjal({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh scale={[0.28, 0.55, 0.28]} castShadow>
        <sphereGeometry args={[1, 26, 22]} />
        <meshStandardMaterial color={C.brinjal} roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.18, 8]} />
        <meshStandardMaterial color="#2E7D4F" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.68, 0]} scale={[0.16, 0.04, 0.16]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color="#2E7D4F" roughness={0.7} />
      </mesh>
    </group>
  )
}

function Drumstick({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0.2, 0.4, Math.PI / 2.6]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.09, 1.25, 16]} />
        <meshStandardMaterial color={C.drumstick} roughness={0.55} />
      </mesh>
      {[-0.35, 0, 0.35].map((y) => (
        <mesh key={y} position={[0, y, 0]} scale={[0.12, 0.12, 0.12]}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial color="#3F6B2C" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Banana({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0.4, -0.5, -0.3]}>
      <mesh castShadow>
        <torusGeometry args={[0.42, 0.11, 16, 32, Math.PI * 1.25]} />
        <meshStandardMaterial color={C.banana} roughness={0.4} />
      </mesh>
      <mesh position={[0.43, -0.12, 0]} scale={0.07}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#6B4A2E" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Coconut({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh scale={[0.4, 0.42, 0.4]} castShadow>
        <sphereGeometry args={[1, 24, 20]} />
        <meshStandardMaterial color={C.coconut} roughness={0.8} />
      </mesh>
      {[-0.08, 0.04, 0.12].map((x, i) => (
        <mesh key={i} position={[x, 0.16 + (i % 2) * 0.05, -0.3]} scale={0.05}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#24170F" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function SceneContent() {
  const group = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.22
    }
  })

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 8, 6]} intensity={1.7} castShadow />
      <pointLight position={[-5, 3, -2]} intensity={0.7} color="#E0FF00" />
      <pointLight position={[5, 2, 3]} intensity={0.5} color="#FF9F1C" />

      <group ref={group} position={[0, -0.15, 0]}>
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.35}>
          <Spin speed={0.2} wobble={0.04}>
            <BananaLeafMeal />
            <Idli position={[-0.1, 0.3, -0.2]} />
            <DosaRoll position={[-0.45, 0.22, 0.72]} />
            <FilterCoffee position={[0.82, 0.24, 0.38]} />
          </Spin>
        </Float>
      </group>

      <Float speed={2.2} rotationIntensity={0.7} floatIntensity={0.9}>
        <Spin speed={0.5} wobble={0.12}>
          <Tomato position={[-2.6, 1.5, 1.2]} scale={1.05} />
        </Spin>
      </Float>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
        <Spin speed={0.4} wobble={0.1}>
          <Carrot position={[2.55, 1.75, 0.8]} scale={1.1} />
        </Spin>
      </Float>
      <Float speed={2.4} rotationIntensity={0.7} floatIntensity={0.9}>
        <Spin speed={0.35} wobble={0.14}>
          <Brinjal position={[-2.35, -0.75, 0.9]} scale={1.15} />
        </Spin>
      </Float>
      <Float speed={2.1} rotationIntensity={0.6} floatIntensity={0.8}>
        <Spin speed={0.45} wobble={0.1}>
          <Drumstick position={[2.4, -0.7, 1.1]} />
        </Spin>
      </Float>
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.7}>
        <Spin speed={0.3} wobble={0.12}>
          <Banana position={[-2.2, 2.55, -1]} />
        </Spin>
      </Float>
      <Float speed={1.9} rotationIntensity={0.5} floatIntensity={0.7}>
        <Spin speed={0.33} wobble={0.1}>
          <Coconut position={[2.4, 2.45, -1.2]} />
        </Spin>
      </Float>

      <ContactShadows position={[0, -2.2, 0]} opacity={0.35} scale={14} blur={2.4} />
      <Environment preset="city" />
    </>
  )
}

export function TamilFoodScene() {
  return <SceneContent />
}

export function TamilFoodAnimation({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 1.6, 7.4], fov: 42 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <TamilFoodScene />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default TamilFoodAnimation
