import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* Palette mirrors the FoodBridge eco-tech identity */
const CARBON = '#050807'
const FOREST = '#103C2D'
const LEMON = '#D9FF45'
const LIME = '#B7D96A'
const TEXT = '#F4F6EF'

interface DriftProps {
  position: [number, number, number]
  sway?: number
  lift?: number
  spin?: number
  slow?: number
  children: React.ReactNode
}

/* Small organic bobbing wrapper — one useFrame per item, cheap math only */
function Drift({ position, sway = 0.09, lift = 0.14, spin = 0.25, slow = 1, children }: DriftProps) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }, delta) => {
    if (!ref.current) return
    const t = clock.elapsedTime * slow
    ref.current.position.y = position[1] + Math.sin(t * 0.9) * lift
    ref.current.position.x = position[0] + Math.cos(t * 0.55) * sway
    ref.current.rotation.z = Math.sin(t * 0.7) * 0.06
    ref.current.rotation.y += delta * 0.35 * spin
  })
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  )
}

function WickerBasket() {
  return (
    <group position={[0, -0.62, 0]}>
      {/* woven shell */}
      <mesh castShadow>
        <cylinderGeometry args={[1.24, 0.88, 0.78, 40, 1, true]} />
        <meshStandardMaterial color="#7A5A38" roughness={0.85} metalness={0.04} side={THREE.DoubleSide} />
      </mesh>
      {/* rim */}
      <mesh position={[0, 0.39, 0]} castShadow>
        <torusGeometry args={[1.24, 0.075, 14, 44]} />
        <meshStandardMaterial color="#8A683F" roughness={0.8} />
      </mesh>
      {/* interior */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[1.18, 0.86, 0.1, 40, 1, false]} />
        <meshStandardMaterial color="#3E2C18" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* woven accent band deep green */}
      <mesh position={[0, -0.02, 0]}>
        <torusGeometry args={[1.06, 0.038, 10, 44]} />
        <meshStandardMaterial color={FOREST} roughness={0.7} />
      </mesh>
    </group>
  )
}

function Produce() {
  return (
    <group>
      {/* apple */}
      <Drift position={[-0.42, 0.34, 0.12]} lift={0.1}>
        <mesh castShadow>
          <sphereGeometry args={[0.3, 28, 28]} />
          <meshStandardMaterial color="#E1523F" roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.31, 0]}>
          <cylinderGeometry args={[0.022, 0.03, 0.14, 8]} />
          <meshStandardMaterial color="#5C4327" />
        </mesh>
        <mesh position={[0.08, 0.36, 0.02]} rotation={[0, 0, 0.7]}>
          <coneGeometry args={[0.045, 0.14, 4]} />
          <meshStandardMaterial color="#6FA35C" />
        </mesh>
      </Drift>

      {/* orange */}
      <Drift position={[0.4, 0.4, -0.05]} lift={0.16} slow={1.25}>
        <mesh castShadow>
          <sphereGeometry args={[0.27, 26, 26]} />
          <meshStandardMaterial color="#F6A94C" roughness={0.5} />
        </mesh>
      </Drift>

      {/* lemon */}
      <Drift position={[0.02, 0.55, -0.4]} lift={0.2} slow={0.85}>
        <mesh castShadow scale={[1.25, 0.82, 0.95]} rotation={[0, 0.4, 0.55]}>
          <sphereGeometry args={[0.2, 22, 22]} />
          <meshStandardMaterial color="#EFE45C" roughness={0.38} />
        </mesh>
      </Drift>

      {/* bread loaf */}
      <Drift position={[0.95, 0.85, 0.4]} lift={0.2} slow={1.1}>
        <mesh castShadow rotation={[0, -0.5, 0]}>
          <boxGeometry args={[0.52, 0.26, 0.34]} />
          <meshStandardMaterial color="#C98E4F" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.17, 0]} rotation={[0, -0.5, 0]}>
          <boxGeometry args={[0.44, 0.1, 0.26]} />
          <meshStandardMaterial color="#DDB06A" roughness={0.6} />
        </mesh>
      </Drift>

      {/* tomato */}
      <Drift position={[-0.95, 0.9, 0.35]} lift={0.22} slow={0.95}>
        <mesh castShadow scale={[1, 0.9, 1]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color="#F06B5B" roughness={0.28} />
        </mesh>
      </Drift>

      {/* leafy greens */}
      <Drift position={[-0.6, 0.28, -0.3]} lift={0.12} slow={1.2}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.24, 1]} />
          <meshStandardMaterial color="#5E9460" roughness={0.85} flatShading />
        </mesh>
      </Drift>
      <Drift position={[0.55, 0.26, 0.32]} lift={0.12} slow={0.9}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.2, 1]} />
          <meshStandardMaterial color="#7FB069" roughness={0.85} flatShading />
        </mesh>
      </Drift>
    </group>
  )
}

function FloatingLeaves() {
  const leaves = useMemo(
    () => [
      { pos: [-2.1, 1.5, -1.2] as [number, number, number], scale: 1, tone: LIME },
      { pos: [2.15, 1.1, -1.5] as [number, number, number], scale: 0.8, tone: '#6FA35C' },
      { pos: [-1.7, -0.6, 0.9] as [number, number, number], scale: 0.65, tone: LEMON },
      { pos: [1.75, -0.9, 0.6] as [number, number, number], scale: 0.72, tone: '#6FA35C' },
      { pos: [0.35, 1.95, -1.1] as [number, number, number], scale: 0.6, tone: LIME },
    ],
    []
  )
  return (
    <group>
      {leaves.map((l, i) => (
        <Drift key={i} position={l.pos} sway={0.14} lift={0.22} spin={1.4} slow={0.8 + i * 0.14}>
          <mesh scale={l.scale} castShadow>
            <coneGeometry args={[0.13, 0.55, 4]} />
            <meshStandardMaterial color={l.tone} roughness={0.6} flatShading />
          </mesh>
        </Drift>
      ))}
    </group>
  )
}

/* Pointer-aware rig: gentle parallax instead of camera controls */
function PointerRig({
  children,
  reduced,
}: {
  children: React.ReactNode
  reduced: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const { pointer } = useThree()
  useFrame((_, delta) => {
    if (!group.current) return
    const tx = reduced ? 0 : pointer.y * 0.12
    const ty = reduced ? 0 : -pointer.x * 0.3
    group.current.rotation.x += (tx - group.current.rotation.x) * Math.min(1, delta * 2.2)
    group.current.rotation.y += (ty - group.current.rotation.y) * Math.min(1, delta * 2.2)
    group.current.rotation.y += reduced ? 0 : delta * 0.05
  })
  return <group ref={group}>{children}</group>
}

/* static offline-friendly ground blob texture */
function useGroundTexture() {
  return useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size / 2, 8, size / 2, size / 2, size / 2)
      g.addColorStop(0, 'rgba(5, 8, 7, 0.55)')
      g.addColorStop(1, 'rgba(5, 8, 7, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, size, size)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

function Ground() {
  const tex = useGroundTexture()
  return (
    <group position={[0, -1.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <planeGeometry args={[5.4, 5.4]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}

export default function FoodEcosystem({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.75, 6.4], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.4 }}
      style={{ background: 'transparent' }}
      aria-label="3D illustration of a harvest basket of fresh produce"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3.2, 4.2, 2.4]} intensity={1.15} color="#FFF6DE" />
      <directionalLight position={[-4, 1.6, -3]} intensity={0.4} color={LEMON} />
      <directionalLight position={[2, -2, 3]} intensity={0.22} color={FOREST} />
      <hemisphereLight args={[FOREST, CARBON, 0.5]} />
      <PointerRig reduced={reduced}>
        <WickerBasket />
        <Produce />
        <FloatingLeaves />
        <Ground />
      </PointerRig>
    </Canvas>
  )
}

export { CARBON, FOREST, LEMON, LIME, TEXT }
