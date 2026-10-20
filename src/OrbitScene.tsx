
import { useEffect, useRef } from "react"
import * as THREE from "three"

const PLANETS = [
  {
    texture: "/textures/earth.jpg",
    radius: 0.27,
    orbit: 2.15,
    speed: 0.22,
    angle: 0.6,
  },
  {
    texture: "/textures/mars.jpg",
    radius: 0.19,
    orbit: 2.95,
    speed: -0.15,
    angle: 2.8,
  },
  {
    texture: "/textures/jupiter.jpg",
    radius: 0.38,
    orbit: 3.75,
    speed: 0.1,
    angle: 4.6,
  },
]

export default function OrbitScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      38,
      1,
      0.1,
      100
    )

    camera.position.set(0, 1.2, 10.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.5)
    )

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    )

    renderer.outputColorSpace = THREE.SRGBColorSpace

    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(
      0x8799c7,
      1.1
    )

    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(
      0xffffff,
      3
    )

    keyLight.position.set(-4, 5, 6)
    scene.add(keyLight)

    const violetLight = new THREE.PointLight(
      0x8b5cf6,
      18,
      12
    )

    violetLight.position.set(0, 0, 1)
    scene.add(violetLight)

    // Starfield
    const starPositions: number[] = []

    for (let i = 0; i < 900; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 15,
        -2 - Math.random() * 10
      )
    }

    const starGeometry = new THREE.BufferGeometry()

    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        starPositions,
        3
      )
    )

    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0xcbd5ff,
        size: 0.018,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
      })
    )

    scene.add(stars)

    // Central energy core
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x30205c,
      emissive: 0x6d28d9,
      emissiveIntensity: 1.8,
      roughness: 0.35,
      metalness: 0.3,
    })

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.72, 48, 48),
      coreMaterial
    )

    scene.add(core)

    const coreAtmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.84, 48, 48),
      new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.09,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )

    scene.add(coreAtmosphere)

    // Planetary orbits
    const orbitColors = [
      0x67e8f9,
      0xa78bfa,
      0xffffff,
    ]

    const pivots: THREE.Group[] = []
    const planetMeshes: THREE.Mesh[] = []

    const textureLoader = new THREE.TextureLoader()

    PLANETS.forEach((planet, index) => {
      // Orbit ring
      const orbitGeometry = new THREE.TorusGeometry(
        planet.orbit,
        0.003,
        4,
        180
      )

      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: orbitColors[index],
        transparent: true,
        opacity: 0.19,
        depthWrite: false,
      })

      const orbitRing = new THREE.Mesh(
        orbitGeometry,
        orbitMaterial
      )

      orbitRing.rotation.x = 0.12 + index * 0.12
      orbitRing.rotation.y = index * 0.18

      scene.add(orbitRing)

      // Orbital pivot
      const pivot = new THREE.Group()

      pivot.rotation.x = 0.12 + index * 0.12
      pivot.rotation.y = index * 0.18

      scene.add(pivot)
      pivots.push(pivot)

      // Planet material
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.92,
        metalness: 0,
      })

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(
          planet.radius,
          48,
          48
        ),
        material
      )

      sphere.position.set(
        Math.cos(planet.angle) * planet.orbit,
        Math.sin(planet.angle) * planet.orbit,
        0.04 + index * 0.08
      )

      pivot.add(sphere)
      planetMeshes.push(sphere)

      // Load planetary texture
      textureLoader.load(
        planet.texture,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace
          material.map = texture
          material.needsUpdate = true
        },
        undefined,
        () => {
          material.color.set(orbitColors[index])
        }
      )
    })

    // Pointer interaction
    const canUsePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const targetRotation = new THREE.Vector2(0, 0)

    let targetGlow = 1.8
    let targetLight = 18

    const handlePointerMove = (event: PointerEvent) => {
      if (!canUsePointer || reducedMotion) return

      const rect = container.getBoundingClientRect()

      if (!rect.width || !rect.height) return

      const mouseX =
        ((event.clientX - rect.left) / rect.width) * 2 - 1

      const mouseY =
        -(((event.clientY - rect.top) / rect.height) * 2 - 1)

      targetRotation.x = mouseY * 0.045
      targetRotation.y = mouseX * 0.07

      const distance = Math.sqrt(
        mouseX * mouseX + mouseY * mouseY
      )

      const proximity = Math.max(
        0,
        1 - distance / 1.4
      )

      targetGlow = 1.8 + proximity * 1.2
      targetLight = 18 + proximity * 10
    }

    const handlePointerLeave = () => {
      targetRotation.set(0, 0)
      targetGlow = 1.8
      targetLight = 18
    }

    container.addEventListener(
      "pointermove",
      handlePointerMove
    )

    container.addEventListener(
      "pointerleave",
      handlePointerLeave
    )

    // Animation
    let animationId = 0

    const clock = new THREE.Clock()

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      const delta = Math.min(clock.getDelta(), 0.04)

      if (!reducedMotion) {
        // Orbiting planets
        pivots.forEach((pivot, index) => {
          pivot.rotation.z +=
            delta * PLANETS[index].speed
        })

        // Planet rotation
        planetMeshes.forEach((planet, index) => {
          planet.rotation.y +=
            delta * (0.18 + index * 0.08)
        })

        // Core animation
        core.rotation.y += delta * 0.08
        coreAtmosphere.rotation.y -= delta * 0.04

        // Subtle starfield movement
        stars.rotation.z += delta * 0.0015

        // Smooth cursor response
        const smoothing = 1 - Math.exp(-delta * 3)

        scene.rotation.x +=
          (targetRotation.x - scene.rotation.x) *
          smoothing

        scene.rotation.y +=
          (targetRotation.y - scene.rotation.y) *
          smoothing

        // Reactive core glow
        coreMaterial.emissiveIntensity +=
          (targetGlow - coreMaterial.emissiveIntensity) *
          smoothing

        violetLight.intensity +=
          (targetLight - violetLight.intensity) *
          smoothing
      }

      renderer.render(scene, camera)
    }

    // Responsive rendering
    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth
      const height = container.clientHeight

      if (!width || !height) return

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
    })

    resizeObserver.observe(container)

    if (container.clientWidth && container.clientHeight) {
      animate()
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      resizeObserver.disconnect()

      container.removeEventListener(
        "pointermove",
        handlePointerMove
      )

      container.removeEventListener(
        "pointerleave",
        handlePointerLeave
      )

      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Points
        ) {
          object.geometry.dispose()

          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material]

          materials.forEach((material) => {
            if ("map" in material && material.map) {
              material.map.dispose()
            }

            material.dispose()
          })
        }
      })

      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      aria-label="Animated 3D planetary system"
      role="img"
    />
  )
}
