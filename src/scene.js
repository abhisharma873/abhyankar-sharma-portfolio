import * as THREE from 'three'

// Premium floating environment: translucent glass panels + particle field,
// with smooth mouse parallax. Returns a cleanup function.
export function initScene(container) {
  const W = () => container.clientWidth
  const H = () => container.clientHeight
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 100)
  camera.position.set(0, 0, 14)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(W(), H())
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  container.appendChild(renderer.domElement)

  // ---- environment for glass reflections ----
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envScene = new THREE.Scene()
  // simple gradient env via large sphere
  const envGeo = new THREE.SphereGeometry(40, 32, 32)
  const envMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide })
  const c1 = new THREE.Color(0x2a3550)
  const c2 = new THREE.Color(0x0a0d14)
  const colors = []
  const posAttr = envGeo.attributes.position
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i) / 40
    const col = c2.clone().lerp(c1, (y + 1) / 2)
    colors.push(col.r, col.g, col.b)
  }
  envGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  envMat.vertexColors = true
  const envMesh = new THREE.Mesh(envGeo, envMat)
  envScene.add(envMesh)
  // accent lights in env for specular streaks
  const envLight1 = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 16), new THREE.MeshBasicMaterial({ color: 0x4a7bd0 }))
  envLight1.position.set(12, 8, 6)
  envScene.add(envLight1)
  const envLight2 = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 16), new THREE.MeshBasicMaterial({ color: 0x8fb4f0 }))
  envLight2.position.set(-10, -4, 8)
  envScene.add(envLight2)
  const envTex = pmrem.fromScene(envScene).texture
  scene.environment = envTex

  // ---------------------------------------------------------------
  // FLOATING GLASS PANELS
  // ---------------------------------------------------------------
  const group = new THREE.Group()
  scene.add(group)

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x223049,
    metalness: 0,
    roughness: 0.15,
    transmission: 1.0,
    thickness: 0.6,
    ior: 1.4,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    transparent: true,
    opacity: 0.4,
    reflectivity: 0.6,
    envMapIntensity: 1.8,
    attenuationColor: new THREE.Color(0x6f8bbf),
    attenuationDistance: 2.5,
  })
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x8aa6d8, transparent: true, opacity: 0.7 })
  const edgeMatBright = new THREE.LineBasicMaterial({ color: 0xc4d6f5, transparent: true, opacity: 0.95 })

  const panels = []
  const defs = [
    { w: 4.0, h: 5.0, x: 1.4, y: 0.1, z: -1.2, ry: -0.22, bright: true },
    { w: 2.6, h: 3.2, x: -4.6, y: 1.4, z: -3.0, ry: 0.3, bright: false },
    { w: 3.0, h: 2.0, x: 5.0, y: -1.8, z: -2.2, ry: -0.42, bright: false },
    { w: 2.0, h: 2.6, x: 4.6, y: 2.6, z: -4.0, ry: -0.28, bright: false },
    { w: 2.2, h: 1.5, x: -4.2, y: -2.6, z: -2.6, ry: 0.38, bright: false },
    { w: 1.5, h: 1.9, x: -1.6, y: 3.2, z: -5.0, ry: 0.16, bright: false },
  ]
  defs.forEach((d, i) => {
    const geo = new THREE.BoxGeometry(d.w, d.h, 0.12, 1, 1, 1)
    const mesh = new THREE.Mesh(geo, glassMat)
    mesh.position.set(d.x, d.y, d.z)
    mesh.rotation.y = d.ry
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), d.bright ? edgeMatBright : edgeMat)
    mesh.add(edges)
    mesh.userData = { baseY: d.y, phase: i * 1.3, amp: 0.12 + i * 0.02 }
    group.add(mesh)
    panels.push(mesh)
  })

  // small accent cube + ring for visual interest (subtle)
  const ringGeo = new THREE.TorusGeometry(0.7, 0.02, 12, 60)
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x9bb8ec, metalness: 0.6, roughness: 0.2, emissive: 0x223a66, emissiveIntensity: 0.5 })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.position.set(-2.2, -1.2, 1.2)
  group.add(ring)

  // ---------------------------------------------------------------
  // PARTICLE FIELD
  // ---------------------------------------------------------------
  const N = 340
  const pGeo = new THREE.BufferGeometry()
  const pos = new Float32Array(N * 3)
  const seed = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 34
    pos[i * 3 + 1] = (Math.random() - 0.5) * 22
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4
    seed[i] = Math.random() * 6.28
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const pMat = new THREE.PointsMaterial({ color: 0x9fb6dd, size: 0.045, transparent: true, opacity: 0.55, depthWrite: false })
  const particles = new THREE.Points(pGeo, pMat)
  scene.add(particles)

  // ---------------------------------------------------------------
  // LIGHTS
  // ---------------------------------------------------------------
  scene.add(new THREE.AmbientLight(0x404a60, 0.7))
  const key = new THREE.DirectionalLight(0xcfe0ff, 1.3)
  key.position.set(6, 8, 10)
  scene.add(key)
  const blue = new THREE.PointLight(0x4f7bd6, 2.0, 40)
  blue.position.set(-8, 2, 6)
  scene.add(blue)
  const cool = new THREE.PointLight(0x9fc0ff, 1.2, 40)
  cool.position.set(8, -4, 4)
  scene.add(cool)

  // ---------------------------------------------------------------
  // MOUSE PARALLAX (smooth inertia)
  // ---------------------------------------------------------------
  let targetX = 0, targetY = 0
  let curX = 0, curY = 0
  function onMove(e) {
    const rect = container.getBoundingClientRect()
    targetX = ((e.clientX - rect.left) / rect.width - 0.5)
    targetY = ((e.clientY - rect.top) / rect.height - 0.5)
  }
  window.addEventListener('pointermove', onMove)

  // gyroscope on mobile (optional, gentle)
  function onOrient(e) {
    if (e.gamma == null) return
    targetX = Math.max(-0.5, Math.min(0.5, e.gamma / 60))
    targetY = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 90))
  }
  window.addEventListener('deviceorientation', onOrient)

  const clock = new THREE.Clock()
  let raf
  function animate() {
    const t = clock.getElapsedTime()
    curX += (targetX - curX) * 0.045
    curY += (targetY - curY) * 0.045

    if (!reduceMotion) {
      panels.forEach((p) => {
        p.position.y = p.userData.baseY + Math.sin(t * 0.6 + p.userData.phase) * p.userData.amp
      })
      ring.rotation.x = t * 0.25
      ring.rotation.y = t * 0.35
      particles.rotation.y = t * 0.012
    }

    // parallax: move group opposite to cursor for depth
    group.rotation.y = curX * 0.32
    group.rotation.x = curY * 0.22
    group.position.x = -curX * 0.8
    group.position.y = curY * 0.5
    camera.position.x = curX * 1.4
    camera.position.y = -curY * 1.0
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)
    raf = requestAnimationFrame(animate)
  }
  animate()

  function onResize() {
    camera.aspect = W() / H()
    camera.updateProjectionMatrix()
    renderer.setSize(W(), H())
  }
  window.addEventListener('resize', onResize)

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('deviceorientation', onOrient)
    pmrem.dispose()
    renderer.dispose()
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
}
