import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useSynthStore } from '../store/synthStore'
import './AudioVisualizer.css'

function AudioVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number>(0)
  const { isPlaying } = useSynthStore()

  const initAudio = useCallback(async () => {
    if (analyserRef.current) return
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      
      // 创建测试音频源
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      gainNode.gain.value = 0
      
      oscillator.connect(gainNode)
      gainNode.connect(analyser)
      analyser.connect(audioContext.destination)
      oscillator.start()
      
      analyserRef.current = analyser
    } catch (e) {
      console.log('Audio init pending...')
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 30

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Particles - 更密集的粒子系统
    const particleCount = 3000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // 球形分布
      const radius = 15 + Math.random() * 15
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
      
      // 颜色 - 渐变
      const hue = 0.5 + Math.random() * 0.3 // 青色到紫色
      const color = new THREE.Color()
      color.setHSL(hue, 0.8, 0.6)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
      
      // 随机速度
      velocities[i3] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02
      
      sizes[i] = Math.random() * 2 + 0.5
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    // 发光材质
    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)
    particlesRef.current = particles

    // 中心发光球
    const coreGeometry = new THREE.SphereGeometry(3, 32, 32)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.3
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    scene.add(core)

    // 环
    const ringGeometry = new THREE.TorusGeometry(6, 0.1, 16, 100)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00aa,
      transparent: true,
      opacity: 0.5
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    scene.add(ring)

    // Animation with audio reactivity
    const dataArray = new Uint8Array(128)
    
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      // 获取音频数据
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray)
      }
      
      // 计算平均音量
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
      const intensity = avg / 255

      // 粒子运动
      if (particlesRef.current) {
        const posAttr = particlesRef.current.geometry.attributes.position
        const positions = posAttr.array as Float32Array
        
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          
          // 基础旋转
          positions[i3] += velocities[i3] * (1 + intensity * 2)
          positions[i3 + 1] += velocities[i3 + 1] * (1 + intensity * 2)
          positions[i3 + 2] += velocities[i3 + 2] * (1 + intensity * 2)
          
          // 边界检测 - 保持在球形区域内
          const dist = Math.sqrt(
            positions[i3] ** 2 + 
            positions[i3 + 1] ** 2 + 
            positions[i3 + 2] ** 2
          )
          
          if (dist > 35 || dist < 5) {
            velocities[i3] *= -1
            velocities[i3 + 1] *= -1
            velocities[i3 + 2] *= -1
          }
        }
        
        posAttr.needsUpdate = true
        
        // 粒子系统整体旋转
        particlesRef.current.rotation.x += 0.001
        particlesRef.current.rotation.y += 0.002
        
        // 音频响应 - 缩放
        const scale = 1 + intensity * 0.3
        particlesRef.current.scale.setScalar(scale)
      }

      // 核心球脉动
      core.scale.setScalar(1 + Math.sin(Date.now() * 0.003) * 0.1 * (1 + intensity))
      coreMaterial.opacity = 0.2 + intensity * 0.4
      
      // 环旋转
      ring.rotation.z += 0.01 * (1 + intensity * 2)
      ring.scale.setScalar(1 + intensity * 0.2)

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return
      
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationRef.current)
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [initAudio, isPlaying])

  return (
    <div className="audio-visualizer">
      <div className="visualizer-header">
        <h2>◈ Audio Visualizer</h2>
        <span className="visualizer-status">Audio Reactive</span>
      </div>
      <div className="visualizer-container" ref={containerRef}></div>
    </div>
  )
}

export default AudioVisualizer
