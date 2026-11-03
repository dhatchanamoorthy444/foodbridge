import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = buffer
        this.onloadend?.()
      })
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = `data:${blob.type};base64,${Buffer.from(buffer).toString('base64')}`
        this.onloadend?.()
      })
    }
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = resolve(__dirname, '../public/models/foodbridge.glb')

const palette = {
  deck: 0x8a5a2b,
  deckDark: 0x6b441f,
  tower: 0x2d5a3c,
  towerLight: 0x3f7a52,
  cable: 0xc9d3cf,
  crate: 0xa1662f,
  crateEdge: 0x7a4a1f,
  apple: 0xef4444,
  orange: 0xf97316,
  leaf: 0x22c55e,
  grain: 0xfbbf24,
  sign: 0xeab308,
}

const material = (color, options = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.1, ...options })

const meshes = {
  deck: material(palette.deck),
  deckDark: material(palette.deckDark),
  tower: material(palette.tower, { roughness: 0.7 }),
  towerLight: material(palette.towerLight, { roughness: 0.6 }),
  cable: material(palette.cable, { roughness: 0.3, metalness: 0.6 }),
  crate: material(palette.crate, { roughness: 0.8 }),
  crateEdge: material(palette.crateEdge, { roughness: 0.85 }),
  apple: material(palette.apple, { roughness: 0.35 }),
  orange: material(palette.orange, { roughness: 0.4 }),
  leaf: material(palette.leaf, { roughness: 0.5, emissive: palette.leaf, emissiveIntensity: 0.08 }),
  grain: material(palette.grain, { roughness: 0.6 }),
  sign: material(palette.sign, { roughness: 0.4, emissive: palette.sign, emissiveIntensity: 0.12 }),
}

const box = (name, size, position, mat) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat)
  mesh.name = name
  mesh.position.set(...position)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

const bridge = new THREE.Group()
bridge.name = 'FoodBridge'

const deckLength = 9
const deckWidth = 2.4
const deckY = 0

bridge.add(box('Deck', [deckLength, 0.32, deckWidth], [0, deckY, 0], meshes.deck))

for (let i = -4; i <= 4; i += 1) {
  bridge.add(box(`Plank_${i + 4}`, [0.92, 0.06, deckWidth + 0.08], [i, deckY + 0.18, 0], meshes.deckDark))
}

for (const side of [-1, 1]) {
  bridge.add(box(`Rail_${side}`, [deckLength, 0.12, 0.12], [0, deckY + 0.95, side * (deckWidth / 2 - 0.08)], meshes.towerLight))
  for (let i = -4; i <= 4; i += 1) {
    bridge.add(box(`Post_${side}_${i + 4}`, [0.1, 0.85, 0.1], [i, deckY + 0.55, side * (deckWidth / 2 - 0.08)], meshes.tower))
  }
}

for (const x of [-2.6, 2.6]) {
  for (const z of [-1, 1]) {
    bridge.add(box(`TowerLeg_${x}_${z}`, [0.34, 3.4, 0.34], [x, 1.55, z * (deckWidth / 2)], meshes.tower))
  }
  bridge.add(box(`TowerBeam_${x}`, [0.5, 0.28, deckWidth + 0.3], [x, 3.25, 0], meshes.towerLight))
  bridge.add(box(`TowerFoot_${x}`, [0.7, 0.3, deckWidth + 0.4], [x, deckY - 0.02, 0], meshes.tower))
}

const cableMaterial = meshes.cable
for (const side of [-1, 1]) {
  const z = side * (deckWidth / 2 - 0.05)
  const points = [
    new THREE.Vector3(-deckLength / 2, deckY + 0.2, z),
    new THREE.Vector3(-2.6, 3.45, z),
    new THREE.Vector3(0, 2.0, z),
    new THREE.Vector3(2.6, 3.45, z),
    new THREE.Vector3(deckLength / 2, deckY + 0.2, z),
  ]
  const curve = new THREE.CatmullRomCurve3(points)
  const cable = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.045, 8, false), cableMaterial)
  cable.name = `MainCable_${side}`
  cable.castShadow = true
  bridge.add(cable)

  for (const [x, y] of [[-3.6, 1.45], [-1.7, 2.85], [0, 2.0], [1.7, 2.85], [3.6, 1.45]]) {
    const hanger = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, Math.max(y - (deckY + 0.2), 0.1), 6), cableMaterial)
    hanger.name = `Hanger_${side}_${x}`
    hanger.position.set(x, (y + deckY + 0.2) / 2, z)
    bridge.add(hanger)
  }
}

const crate = (name, position, contents) => {
  const group = new THREE.Group()
  group.name = name
  group.position.set(...position)

  const body = box(`${name}_Body`, [1.1, 0.55, 0.9], [0, 0.28, 0], meshes.crate)
  group.add(body)

  for (const y of [0.08, 0.48]) {
    group.add(box(`${name}_Band_${y}`, [1.16, 0.07, 0.96], [0, y, 0], meshes.crateEdge))
  }

  if (contents === 'produce') {
    const fruit = [
      [-0.25, 0.62, -0.14, meshes.apple, 0.19],
      [0.22, 0.6, 0.1, meshes.orange, 0.18],
      [0.02, 0.78, -0.18, meshes.apple, 0.16],
      [0.42, 0.78, -0.2, meshes.grain, 0.13],
    ]
    for (const [x, y, z, mat, r] of fruit) {
      const fruitMesh = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 20), mat)
      fruitMesh.name = `${name}_Produce`
      fruitMesh.position.set(x, y, z)
      fruitMesh.castShadow = true
      group.add(fruitMesh)
    }
  } else {
    for (let i = 0; i < 5; i += 1) {
      const loaf = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.34, 4, 8), i % 2 ? meshes.grain : meshes.crateEdge)
      loaf.name = `${name}_Grain`
      loaf.rotation.z = Math.PI / 2
      loaf.position.set(-0.35 + i * 0.17, 0.66, 0)
      loaf.castShadow = true
      group.add(loaf)
    }
  }

  return group
}

bridge.add(crate('CrateLeft', [-1.9, deckY + 0.21, 0.35], 'produce'))
bridge.add(crate('CrateRight', [1.8, deckY + 0.21, -0.3], 'grain'))
bridge.add(crate('CrateCenter', [0, deckY + 0.21, 0.55], 'produce'))

const leafGroup = new THREE.Group()
leafGroup.name = 'LeafMarker'
leafGroup.position.set(0, 4.1, 0)
const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), meshes.leaf)
leaf.scale.set(0.55, 1, 0.18)
leaf.name = 'Leaf'
leafGroup.add(leaf)
const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 8), meshes.leaf)
stem.name = 'LeafStem'
stem.position.y = -0.42
leafGroup.add(stem)
bridge.add(leafGroup)

const sign = box('Sign', [2.2, 0.5, 0.08], [0, deckY + 0.75, deckWidth / 2 + 0.02], meshes.sign)
bridge.add(sign)

bridge.position.y = -1.2

bridge.traverse((object) => {
  if (object.isMesh) {
    object.castShadow = true
    object.receiveShadow = true
  }
})

const exporter = new GLTFExporter()
const glb = await new Promise((resolveExport, rejectExport) => {
  exporter.parse(
    bridge,
    (result) => resolveExport(result),
    (error) => rejectExport(error),
    { binary: true, onlyVisible: true, truncateDrawRange: true },
  )
})

await mkdir(dirname(outPath), { recursive: true })
await writeFile(outPath, Buffer.from(glb))

const box3 = new THREE.Box3().setFromObject(bridge)
const size = box3.getSize(new THREE.Vector3())
console.log(`Wrote ${outPath} (${Buffer.from(glb).byteLength} bytes)`)
console.log(`Bounds: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`)

