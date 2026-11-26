import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, useGLTF } from '@react-three/drei'
import type * as THREE from 'three'

interface FoodBridgeModelProps {
  position?: [number, number, number]
  scale?: number
  rotationSpeed?: number
}

useGLTF.preload('/models/foodbridge.glb')

export default function FoodBridgeModel({
  position = [0, -0.4, 0],
  scale = 0.55,
  rotationSpeed = 0.12,
}: FoodBridgeModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/foodbridge.glb')

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.3}>
      <group ref={groupRef} position={position} scale={scale}>
        <primitive object={scene} />
      </group>
    </Float>
  )
}
