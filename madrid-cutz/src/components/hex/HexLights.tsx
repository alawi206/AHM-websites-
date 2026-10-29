import { useEffect, useRef, useState } from 'react'
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shader'

type Mode = 'tunnel' | 'overhead'

type Props = {
  mode?: Mode
  className?: string
  /** Play the fluorescent power-on sequence when first visible. */
  powerOn?: boolean
  /** Subtle camera drift following the pointer (desktop only). */
  interactive?: boolean
  /** Brightness multiplier. */
  exposure?: number
  /** Render a single, fully lit frame (used to bake static art). */
  still?: boolean
  /** Override the default camera framing. */
  shot?: Partial<Shot>
  onReady?: () => void
}

export type Shot = { pitch: number; yaw: number; roll: number; focal: number; halfW: number; floor: number }

const MAX_PIXELS = 2_600_000

function shotFor(mode: Mode, aspect: number): Shot {
  if (mode === 'overhead') {
    return { pitch: Math.PI / 2, yaw: 0, roll: 0.35, focal: aspect < 1 ? 0.3 : 0.42, halfW: 400, floor: 0 }
  }
  // Portrait screens look further up so the honeycomb fills the frame.
  const portrait = aspect < 0.85
  return {
    pitch: portrait ? 0.2 : 0.12,
    yaw: 0,
    roll: 0,
    focal: portrait ? 0.62 : aspect > 2 ? 1.05 : 0.88,
    halfW: portrait ? 2.6 : 3.4,
    floor: 1,
  }
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(log ?? 'shader compile failed')
  }
  return shader
}

function createProgram(gl: WebGL2RenderingContext) {
  const program = gl.createProgram()!
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER))
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER))
  gl.bindAttribLocation(program, 0, 'aPos')
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed')
  }
  return program
}

export function HexLights({
  mode = 'tunnel',
  className = '',
  powerOn = true,
  interactive = false,
  exposure = 1.25,
  still = false,
  shot: shotOverride,
  onReady,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'default',
    })
    if (!gl) {
      setFailed(true)
      return
    }

    let program: WebGLProgram
    try {
      program = createProgram(gl)
    } catch (err) {
      console.warn('[HexLights] falling back to static backdrop:', err)
      setFailed(true)
      return
    }

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.useProgram(program)

    const loc = (name: string) => gl.getUniformLocation(program, name)
    const u = {
      res: loc('uRes'),
      time: loc('uTime'),
      power: loc('uPower'),
      cam: loc('uCam'),
      focal: loc('uFocal'),
      travel: loc('uTravel'),
      halfW: loc('uHalfW'),
      floor: loc('uFloor'),
      exposure: loc('uExposure'),
      vignette: loc('uVignette'),
    }

    const reduceMotion = still || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches

    const frame = (aspect: number) => ({ ...shotFor(mode, aspect), ...shotOverride })
    let shot = frame(16 / 9)
    let raf = 0
    let running = false
    let visible = false
    let readyFired = false
    // Wall-clock start of the power-on sequence: null = waiting, -1 = always on.
    let powerStart: number | null = reduceMotion || !powerOn ? -1 : null
    let last = performance.now()
    let elapsed = 0
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      let dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const pixels = rect.width * rect.height * dpr * dpr
      if (pixels > MAX_PIXELS) dpr *= Math.sqrt(MAX_PIXELS / pixels)
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      shot = frame(rect.width / rect.height)
      if (!running) draw(performance.now())
    }

    const scrollProgress = () => {
      const rect = canvas.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // -1 when the element is below the fold, 0 centered, 1 when scrolled past.
      return Math.max(-1, Math.min(1, (vh / 2 - (rect.top + rect.height / 2)) / ((vh + rect.height) / 2)))
    }

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      if (running) elapsed += dt
      if (powerStart === null && visible) powerStart = now
      const power = powerStart === -1 ? 100 : powerStart === null ? 0 : (now - powerStart) / 1000

      pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 2.5)
      pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 2.5)

      const progress = scrollProgress()
      let pitch = shot.pitch
      let yaw = shot.yaw
      let roll = shot.roll
      let travel = reduceMotion ? 0 : elapsed * 0.32

      if (mode === 'tunnel') {
        pitch += Math.max(0, progress) * 0.12 - pointer.sy * 0.035
        yaw += pointer.sx * 0.05
        roll += pointer.sx * -0.01
      } else {
        roll += reduceMotion ? 0 : elapsed * 0.025 + progress * 0.35
        travel = reduceMotion ? 0 : elapsed * 0.12
      }

      gl.uniform2f(u.res, canvas.width, canvas.height)
      gl.uniform1f(u.time, elapsed)
      gl.uniform1f(u.power, power)
      gl.uniform3f(u.cam, pitch, yaw, roll)
      gl.uniform1f(u.focal, shot.focal)
      gl.uniform1f(u.travel, travel)
      gl.uniform1f(u.halfW, shot.halfW)
      gl.uniform1f(u.floor, shot.floor)
      gl.uniform1f(u.exposure, exposure)
      gl.uniform1f(u.vignette, mode === 'overhead' ? 0.75 : 0.6)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      if (!readyFired) {
        readyFired = true
        onReadyRef.current?.()
      }
    }

    const loop = (now: number) => {
      draw(now)
      raf = requestAnimationFrame(loop)
    }

    const play = () => {
      if (running || reduceMotion) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    const pause = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !document.hidden) play()
        else pause()
        if (visible && reduceMotion) draw(performance.now())
      },
      { rootMargin: '120px 0px' },
    )
    io.observe(canvas)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const onVisibility = () => {
      if (document.hidden) pause()
      else if (visible) play()
    }
    document.addEventListener('visibilitychange', onVisibility)

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    if (interactive && finePointer && !reduceMotion) window.addEventListener('pointermove', onPointer, { passive: true })

    const onLost = (e: Event) => {
      e.preventDefault()
      pause()
      setFailed(true)
    }
    canvas.addEventListener('webglcontextlost', onLost)

    return () => {
      pause()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('webglcontextlost', onLost)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [mode, powerOn, interactive, exposure, still, JSON.stringify(shotOverride)])

  return (
    <div className={`absolute inset-0 overflow-hidden bg-ink ${className}`} aria-hidden="true">
      {failed ? (
        <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(246,245,242,0.10),transparent_60%)]" />
      ) : (
        <canvas ref={canvasRef} className="block h-full w-full" />
      )}
    </div>
  )
}
