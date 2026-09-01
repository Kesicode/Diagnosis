'use client'

/**
 * WaveformVisual.js
 * ──────────────────
 * HTML5 Canvas real-time audio oscilloscope.
 *
 * Props:
 *   - stream         : MediaStream | null  — live mic stream (from getUserMedia)
 *   - isActive       : boolean             — whether to render the live waveform
 *   - isSimulating   : boolean             — render a placeholder animation (no real stream)
 *   - height         : number              — canvas pixel height (default 160)
 *
 * Rendering:
 *   - iQOO Brand Yellow (#FFD100) waveform tracks on Deep Obsidian (#0F0F11) background
 *   - Uses Web Audio API AnalyserNode when a live stream is provided
 *   - Falls back to a sinusoidal simulation animation when isSimulating = true
 */

import { useEffect, useRef, useCallback } from 'react'

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
const WAVEFORM_COLOR     = '#FFD100'   // iQOO Brand Yellow
const BACKGROUND_COLOR   = '#0F0F11'   // Deep Obsidian Black
const GRID_COLOR         = '#1E1E25'   // Subtle grid lines
const LINE_WIDTH         = 2.5
const FFT_SIZE           = 2048
const SMOOTHING          = 0.75

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function WaveformVisual({
  stream      = null,
  isActive    = false,
  isSimulating = false,
  height      = 160,
}) {
  const canvasRef     = useRef(null)
  const rafRef        = useRef(null)           // requestAnimationFrame ID
  const analyserRef   = useRef(null)           // Web Audio AnalyserNode
  const audioCtxRef   = useRef(null)           // AudioContext
  const sourceRef     = useRef(null)           // MediaStreamAudioSourceNode
  const simPhaseRef   = useRef(0)              // Simulation animation phase

  // ── Draw background + grid ─────────────────────────────────────────────────
  const drawBackground = useCallback((ctx, W, H) => {
    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, W, H)

    // Horizontal center line
    ctx.strokeStyle = GRID_COLOR
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, H / 2)
    ctx.lineTo(W, H / 2)
    ctx.stroke()

    // Vertical grid lines every 10%
    for (let i = 1; i < 10; i++) {
      const x = (W * i) / 10
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, H)
      ctx.stroke()
    }
  }, [])

  // ── Draw idle flat-line state ──────────────────────────────────────────────
  const drawIdle = useCallback((ctx, W, H) => {
    drawBackground(ctx, W, H)
    ctx.strokeStyle = '#2A2A35'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(0, H / 2)
    ctx.lineTo(W, H / 2)
    ctx.stroke()

    // Idle label
    ctx.fillStyle = '#3A3A45'
    ctx.font = 'bold 11px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('— AWAITING SIGNAL —', W / 2, H / 2 - 12)
  }, [drawBackground])

  // ── Draw live waveform from AnalyserNode data ──────────────────────────────
  const drawLiveWaveform = useCallback((ctx, W, H, dataArray) => {
    drawBackground(ctx, W, H)

    const bufferLength  = dataArray.length
    const sliceWidth    = W / bufferLength

    // Glow effect: shadow for the iQOO yellow line
    ctx.shadowColor  = WAVEFORM_COLOR
    ctx.shadowBlur   = 6

    ctx.strokeStyle  = WAVEFORM_COLOR
    ctx.lineWidth    = LINE_WIDTH
    ctx.lineJoin     = 'round'
    ctx.lineCap      = 'round'
    ctx.beginPath()

    let x = 0
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0   // normalize to [0, 2]
      const y = (v / 2) * H            // map to canvas height

      if (i === 0) ctx.moveTo(x, y)
      else         ctx.lineTo(x, y)

      x += sliceWidth
    }

    ctx.lineTo(W, H / 2)
    ctx.stroke()
    ctx.shadowBlur = 0
  }, [drawBackground])

  // ── Draw simulated sinusoidal waveform ────────────────────────────────────
  const drawSimulatedWaveform = useCallback((ctx, W, H, phase) => {
    drawBackground(ctx, W, H)

    ctx.shadowColor = WAVEFORM_COLOR
    ctx.shadowBlur  = 8
    ctx.strokeStyle = WAVEFORM_COLOR
    ctx.lineWidth   = LINE_WIDTH
    ctx.lineJoin    = 'round'
    ctx.beginPath()

    const numPoints = W
    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints
      // Multi-harmonic simulated waveform
      const amp1 = Math.sin(t * Math.PI * 12 + phase) * 0.38
      const amp2 = Math.sin(t * Math.PI * 24 + phase * 1.3) * 0.12
      const amp3 = Math.sin(t * Math.PI * 6  + phase * 0.7) * 0.18
      const noise = (Math.random() - 0.5) * 0.05
      const combined = amp1 + amp2 + amp3 + noise

      const y = H / 2 + combined * H * 0.42

      if (i === 0) ctx.moveTo(i, y)
      else         ctx.lineTo(i, y)
    }

    ctx.stroke()
    ctx.shadowBlur = 0

    // "SIMULATED" badge
    ctx.fillStyle  = '#FFD100'
    ctx.font       = 'bold 9px "JetBrains Mono", monospace'
    ctx.textAlign  = 'left'
    ctx.globalAlpha = 0.55
    ctx.fillText('◉ LIVE SIMULATION', 12, H - 12)
    ctx.globalAlpha = 1
  }, [drawBackground])

  // ── Set up Web Audio AnalyserNode when stream is provided ──────────────────
  useEffect(() => {
    if (!stream || !isActive) return

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const source   = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()

      analyser.fftSize            = FFT_SIZE
      analyser.smoothingTimeConstant = SMOOTHING
      source.connect(analyser)

      audioCtxRef.current  = audioCtx
      sourceRef.current    = source
      analyserRef.current  = analyser
    } catch (err) {
      console.warn('AeroPulse WaveformVisual: Web Audio API unavailable:', err)
    }

    return () => {
      // Cleanup
      try {
        sourceRef.current?.disconnect()
        audioCtxRef.current?.close()
      } catch (_) { /* ignore */ }
      analyserRef.current = null
      audioCtxRef.current = null
      sourceRef.current   = null
    }
  }, [stream, isActive])

  // ── Animation loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const W   = canvas.width
    const H   = canvas.height

    // Cancel any existing loop
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    if (!isActive && !isSimulating) {
      drawIdle(ctx, W, H)
      return
    }

    let frameCount = 0

    function tick() {
      frameCount++

      if (isActive && analyserRef.current) {
        // ── Live mode ──────────────────────────────────────────────────────
        const bufferLength = analyserRef.current.frequencyBinCount
        const dataArray    = new Uint8Array(bufferLength)
        analyserRef.current.getByteTimeDomainData(dataArray)
        drawLiveWaveform(ctx, W, H, dataArray)
      } else if (isSimulating) {
        // ── Simulation mode ────────────────────────────────────────────────
        simPhaseRef.current += 0.06
        drawSimulatedWaveform(ctx, W, H, simPhaseRef.current)
      } else {
        // ── Idle ───────────────────────────────────────────────────────────
        drawIdle(ctx, W, H)
        return  // no need to keep looping when idle
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isActive, isSimulating, drawIdle, drawLiveWaveform, drawSimulatedWaveform])

  // ── Resize canvas to match DPR for crisp rendering ─────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr  = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width  = rect.width * dpr
    canvas.height = rect.height * dpr

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    // Initial render
    const W = rect.width
    const H = rect.height
    const renderCtx = canvas.getContext('2d')
    renderCtx.fillStyle = BACKGROUND_COLOR
    renderCtx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="waveform-container border border-[#2A2A30]" style={{ height }}>
      {/* Status indicator */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        {isActive ? (
          <>
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping-slow" />
            <span className="text-[10px] font-bold text-[#EF4444] tracking-widest">
              REC
            </span>
          </>
        ) : isSimulating ? (
          <>
            <span className="w-2 h-2 rounded-full bg-[#FFD100] animate-pulse-yellow" />
            <span className="text-[10px] font-bold text-[#FFD100] tracking-widest">
              SIM
            </span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-[#2A2A35]" />
            <span className="text-[10px] font-bold text-[#3A3A45] tracking-widest">
              IDLE
            </span>
          </>
        )}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        aria-label="AeroPulse real-time acoustic waveform visualizer"
      />
    </div>
  )
}
