<template>
  <div ref="host" class="drill3d"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

function logoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 168
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.fillStyle = '#0e0e11'
  ctx.fillRect(0, 0, 512, 168)
  ctx.strokeStyle = '#ff7a12'
  ctx.lineWidth = 12
  ctx.strokeRect(6, 6, 500, 156)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 82px Arial, Helvetica, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('PITTOOLS', 256, 92)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function buildDrill(): THREE.Group {
  const drill = new THREE.Group()

  const orange = new THREE.MeshStandardMaterial({ color: 0xff7a12, roughness: 0.42, metalness: 0.12 })
  const black = new THREE.MeshStandardMaterial({ color: 0x25252a, roughness: 0.72, metalness: 0.08 })
  const rubber = new THREE.MeshStandardMaterial({ color: 0x151518, roughness: 0.95, metalness: 0.03 })
  const metal = new THREE.MeshStandardMaterial({ color: 0x4d4d56, roughness: 0.33, metalness: 0.92 })
  const gold = new THREE.MeshStandardMaterial({ color: 0xc9a25a, roughness: 0.26, metalness: 0.95 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b1b1f, roughness: 0.55, metalness: 0.25 })

  const put = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number,
    rotateZ = 0
  ) => {
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(x, y, z)
    mesh.rotation.z = rotateZ
    drill.add(mesh)
    return mesh
  }

  // motor housing and rear cap
  put(new RoundedBoxGeometry(1.9, 1, 0.92, 5, 0.18), orange, 0.9, 0.62, 0)
  put(new RoundedBoxGeometry(0.32, 0.84, 0.8, 3, 0.14), black, -0.14, 0.62, 0)

  // torque ring, chuck and drill bit
  put(new THREE.CylinderGeometry(0.44, 0.44, 0.18, 48), dark, -0.06, 0.62, 0, Math.PI / 2)
  put(new THREE.CylinderGeometry(0.3, 0.37, 0.52, 48), metal, -0.4, 0.62, 0, Math.PI / 2)
  put(new THREE.CylinderGeometry(0.24, 0.28, 0.16, 48), dark, -0.69, 0.62, 0, Math.PI / 2)
  put(new THREE.CylinderGeometry(0.052, 0.052, 1.05, 20), gold, -1.3, 0.62, 0, Math.PI / 2)
  put(new THREE.ConeGeometry(0.052, 0.18, 20), gold, -1.91, 0.62, 0, Math.PI / 2)

  // grip, trigger and battery pack
  const grip = put(new RoundedBoxGeometry(0.54, 1.02, 0.7, 4, 0.2), black, 1.38, -0.12, 0)
  grip.rotation.z = 0.12
  put(new RoundedBoxGeometry(0.18, 0.32, 0.26, 3, 0.08), dark, 1.08, 0.16, 0)
  put(new RoundedBoxGeometry(0.94, 0.46, 0.78, 4, 0.14), black, 1.44, -0.86, 0)
  put(new RoundedBoxGeometry(0.96, 0.09, 0.8, 3, 0.04), orange, 1.44, -0.72, 0)
  put(new THREE.BoxGeometry(0.9, 0.07, 0.74), rubber, 1.44, -1.1, 0)

  // PITTOOLS plates on both sides
  const plateMat = new THREE.MeshStandardMaterial({ map: logoTexture(), roughness: 0.5, metalness: 0.15 })
  const bodyPlate = new THREE.PlaneGeometry(0.66, 0.216)
  const bodyFront = put(bodyPlate, plateMat, 0.95, 0.68, 0.462)
  const bodyBack = put(bodyPlate, plateMat, 0.95, 0.68, -0.462)
  bodyBack.rotation.y = Math.PI

  const batteryPlate = new THREE.PlaneGeometry(0.5, 0.164)
  const batteryFront = put(batteryPlate, plateMat, 1.44, -0.86, 0.392)
  const batteryBack = put(batteryPlate, plateMat, 1.44, -0.86, -0.392)
  batteryBack.rotation.y = Math.PI

  bodyFront.rotation.z = 0
  return drill
}

export default defineComponent({
  name: 'Drill3D',
  props: {
    progress: { type: Number, default: 0 },
  },
  emits: ['angle'],
  setup(props, { emit }) {
    const host = ref<HTMLDivElement | null>(null)

    let renderer: THREE.WebGLRenderer | null = null
    let scene: THREE.Scene | null = null
    let camera: THREE.PerspectiveCamera | null = null
    let drill: THREE.Group | null = null
    let pmrem: THREE.PMREMGenerator | null = null
    let clock: THREE.Clock | null = null
    let frame = 0
    let resizeObserver: ResizeObserver | null = null
    let visibilityObserver: IntersectionObserver | null = null
    let idleAngle = 0
    let currentAngle = 0
    let lastEmit = 0
    let lastScrollAt = 0
    let inView = true

    const animate = () => {
      frame = window.requestAnimationFrame(animate)
      if (!renderer || !scene || !camera || !drill || !clock || !inView) return

      const delta = Math.min(clock.getDelta(), 0.05)
      const now = performance.now()

      // the drill keeps turning on its own, like a product video,
      // until the visitor scrolls and takes over
      if (now - lastScrollAt > 1400) idleAngle -= delta * 0.5

      const target = idleAngle - props.progress * Math.PI * 2
      currentAngle += (target - currentAngle) * Math.min(1, delta * 6)
      drill.rotation.x = currentAngle

      renderer.render(scene, camera)

      if (now - lastEmit > 120) {
        lastEmit = now
        emit('angle', (currentAngle * 180) / Math.PI)
      }
    }

    // keeps the whole drill inside the frame at any aspect ratio
    const fitCamera = () => {
      if (!camera) return
      const halfFov = Math.tan((camera.fov * Math.PI) / 360)
      const forHeight = 1.28 / halfFov
      const forWidth = 2.1 / (halfFov * camera.aspect)
      camera.position.z = Math.max(forHeight, forWidth) * 1.06
      camera.updateProjectionMatrix()
    }

    const init = () => {
      const el = host.value
      if (!el) return

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(el.clientWidth || 1, el.clientHeight || 1)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.15
      el.appendChild(renderer.domElement)

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(32, (el.clientWidth || 1) / (el.clientHeight || 1), 0.1, 100)
      camera.position.set(0, 0.25, 5.2)
      camera.lookAt(0, 0, 0)
      fitCamera()

      pmrem = new THREE.PMREMGenerator(renderer)
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

      const key = new THREE.DirectionalLight(0xffffff, 2.4)
      key.position.set(4, 6, 6)
      scene.add(key)

      const rim = new THREE.DirectionalLight(0xffb070, 1.5)
      rim.position.set(-6, -2, -4)
      scene.add(rim)

      const fill = new THREE.DirectionalLight(0x9fc4ff, 0.7)
      fill.position.set(-3, 3, 5)
      scene.add(fill)

      scene.add(new THREE.HemisphereLight(0xffffff, 0x221a14, 0.55))

      drill = buildDrill()
      scene.add(drill)

      clock = new THREE.Clock()

      resizeObserver = new ResizeObserver(() => {
        if (!renderer || !camera) return
        const width = el.clientWidth
        const height = el.clientHeight
        if (!width || !height) return
        renderer.setSize(width, height)
        camera.aspect = width / height
        fitCamera()
      })
      resizeObserver.observe(el)

      visibilityObserver = new IntersectionObserver(
        (entries) => {
          inView = entries[0].isIntersecting
        },
        { threshold: 0 }
      )
      visibilityObserver.observe(el)

      animate()
    }

    watch(
      () => props.progress,
      () => {
        lastScrollAt = performance.now()
      }
    )

    onMounted(init)

    onBeforeUnmount(() => {
      window.cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      visibilityObserver?.disconnect()

      if (scene) {
        scene.traverse((child) => {
          const mesh = child as THREE.Mesh
          if (mesh.geometry) mesh.geometry.dispose()
          const material = mesh.material as THREE.Material | THREE.Material[] | undefined
          if (Array.isArray(material)) material.forEach((item) => item.dispose())
          else if (material) material.dispose()
        })
      }

      pmrem?.dispose()
      if (renderer) {
        renderer.dispose()
        renderer.domElement.remove()
      }
    })

    return { host }
  },
})
</script>

<style scoped>
.drill3d {
  position: absolute;
  inset: 0;
}

.drill3d :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
