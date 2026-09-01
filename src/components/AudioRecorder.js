'use client'

/**
 * AudioRecorder.js
 * ─────────────────
 * Step 2 of the AeroPulse workflow.
 * Provides two audio input methods:
 *   A) Live microphone recording via navigator.mediaDevices.getUserMedia
 *      — 10-second automatic cutoff with countdown timer
 *   B) File upload via drag-and-drop or click-to-browse
 *      — Accepts .wav, .mp3, .m4a, .webm, .ogg
 *
 * Props:
 *   - onAudioReady : (blob: Blob | File) => void  — callback when audio is ready
 *   - onBack       : () => void                   — callback to go back to Step 1
 *   - applianceLabel : string                     — display name for selected appliance
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import WaveformVisual from './WaveformVisual'

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
const MAX_RECORD_SECONDS   = 10
const ACCEPTED_MIME_TYPES  = [
  'audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/m4a',
  'audio/webm', 'audio/ogg', 'audio/x-wav',
]
const ACCEPTED_EXTENSIONS  = '.wav,.mp3,.m4a,.webm,.ogg,.aac'

// ─── ICONS ────────────────────────────────────────────────────────────────────
function MicIcon({ className = '' }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24"
      fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor"
        strokeWidth="1.75" />
      <path d="M5 10a7 7 0 0014 0" stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" />
      <path d="M12 19v3M9 22h6" stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" />
    </svg>
  )
}

function StopIcon({ className = '' }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24"
      fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor"
        strokeWidth="1.75" />
    </svg>
  )
}

function UploadIcon({ className = '' }) {
  return (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32"
      fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 22V10M10 16l6-6 6 6" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 24h20" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon({ className = '' }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20"
      fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10l5 5 7-9" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── TAB SELECTOR ─────────────────────────────────────────────────────────────
function TabSelector({ activeTab, onSelect }) {
  return (
    <div className="flex border border-[#E5E7EB] divide-x divide-[#E5E7EB]">
      {[
        { id: 'record', label: '⚫ Record Live' },
        { id: 'upload', label: '📁 Upload File' },
      ].map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={[
            'flex-1 py-3 text-sm font-bold tracking-wide transition-colors duration-150 focus:outline-none',
            activeTab === id
              ? 'bg-[#0F0F11] text-[#FFD100]'
              : 'bg-white text-[#6B7280] hover:bg-gray-50 hover:text-[#111111]',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function AudioRecorder({ onAudioReady, onBack, applianceLabel }) {
  const [activeTab,       setActiveTab]       = useState('record')
  const [isRecording,     setIsRecording]     = useState(false)
  const [countdown,       setCountdown]       = useState(MAX_RECORD_SECONDS)
  const [micStream,       setMicStream]       = useState(null)
  const [audioBlob,       setAudioBlob]       = useState(null)
  const [audioFile,       setAudioFile]       = useState(null)
  const [isDragOver,      setIsDragOver]      = useState(false)
  const [micError,        setMicError]        = useState(null)
  const [permissionState, setPermissionState] = useState('idle') // idle | requesting | granted | denied

  const mediaRecorderRef = useRef(null)
  const chunksRef        = useRef([])
  const countdownRef     = useRef(null)
  const fileInputRef     = useRef(null)

  // Determine what audio is ready
  const readyAudio = activeTab === 'record' ? audioBlob : audioFile
  const hasAudio   = Boolean(readyAudio)

  // ── Clean up on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopAllTracks()
      clearInterval(countdownRef.current)
    }
  }, [])

  function stopAllTracks() {
    if (micStream) {
      micStream.getTracks().forEach((t) => t.stop())
    }
  }

  // ── Start recording ────────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    setMicError(null)
    setAudioBlob(null)
    setPermissionState('requesting')

    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    } catch (err) {
      setMicError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Microphone access was denied. Please allow microphone permission in your browser settings and try again.'
          : 'Microphone access failed. Please ensure a microphone is connected and try again.'
      )
      setPermissionState('denied')
      return
    }

    setPermissionState('granted')
    setMicStream(stream)
    chunksRef.current = []

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm'

    const recorder = new MediaRecorder(stream, { mimeType })
    mediaRecorderRef.current = recorder

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType })
      setAudioBlob(blob)
      stream.getTracks().forEach((t) => t.stop())
      setMicStream(null)
    }

    recorder.start(200) // collect chunks every 200ms
    setIsRecording(true)
    setCountdown(MAX_RECORD_SECONDS)

    // ── 10-second countdown ──────────────────────────────────────────────────
    let remaining = MAX_RECORD_SECONDS
    countdownRef.current = setInterval(() => {
      remaining -= 1
      setCountdown(remaining)
      if (remaining <= 0) {
        clearInterval(countdownRef.current)
        stopRecording(recorder)
      }
    }, 1000)
  }, [micStream])

  // ── Stop recording ─────────────────────────────────────────────────────────
  const stopRecording = useCallback((recorderOverride) => {
    clearInterval(countdownRef.current)
    const recorder = recorderOverride ?? mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }
    setIsRecording(false)
    setCountdown(MAX_RECORD_SECONDS)
  }, [])

  // ── File handling ──────────────────────────────────────────────────────────
  function handleFile(file) {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    const validExts = ['wav', 'mp3', 'm4a', 'webm', 'ogg', 'aac']
    if (!validExts.includes(ext) && !ACCEPTED_MIME_TYPES.includes(file.type)) {
      setMicError(`Unsupported file type ".${ext}". Please use .wav, .mp3, .m4a, or .webm.`)
      return
    }
    setMicError(null)
    setAudioFile(file)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleFileInputChange(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  // ── Timer ring calculation ─────────────────────────────────────────────────
  const timerProgress = ((MAX_RECORD_SECONDS - countdown) / MAX_RECORD_SECONDS) * 100

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-slide-up">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <p className="section-label">Step 2 of 4</p>
        <h2 className="text-2xl font-bold text-iqoo-jet mt-1">
          Capture Acoustic Signal
        </h2>
        <span className="accent-bar" />
        <div className="flex items-center gap-2">
          <span className="chip">
            <span className="text-iqoo-yellow">▲</span>
            {applianceLabel}
          </span>
          <p className="text-sm text-iqoo-muted">
            Record or upload a 5–10 second audio sample of the sound.
          </p>
        </div>
      </div>

      {/* ── Tab Selector ───────────────────────────────────────────────────── */}
      <TabSelector activeTab={activeTab} onSelect={(tab) => {
        setActiveTab(tab)
        setMicError(null)
        setAudioBlob(null)
        setAudioFile(null)
        if (isRecording) stopRecording()
      }} />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* RECORD TAB                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'record' && (
        <div className="space-y-6">

          {/* Waveform Canvas */}
          <WaveformVisual
            stream={micStream}
            isActive={isRecording}
            isSimulating={false}
            height={160}
          />

          {/* Timer + Controls Row */}
          <div className="flex items-center justify-between gap-4">

            {/* Countdown indicator */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none"
                    stroke="#E5E7EB" strokeWidth="3" />
                  <circle
                    cx="24" cy="24" r="20" fill="none"
                    stroke={isRecording ? '#EF4444' : '#E5E7EB'}
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - timerProgress / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.9s linear' }}
                  />
                </svg>
                <span className={[
                  'text-xs font-bold font-mono z-10',
                  isRecording ? 'text-[#EF4444]' : 'text-[#6B7280]',
                ].join(' ')}>
                  {countdown}s
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#111111]">
                  {isRecording ? `Recording… auto-stops at ${MAX_RECORD_SECONDS}s` : 'Microphone Ready'}
                </p>
                <p className="text-xs text-iqoo-muted">
                  {isRecording ? 'Hold steady — capturing acoustic data' : 'Press Record to start capture'}
                </p>
              </div>
            </div>

            {/* Record / Stop button */}
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                disabled={Boolean(audioBlob)}
                className={[
                  'flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all duration-150',
                  audioBlob
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#EF4444] text-white hover:bg-red-600 active:scale-95',
                ].join(' ')}
              >
                <MicIcon />
                {audioBlob ? 'Recorded' : 'Record'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => stopRecording()}
                className="flex items-center gap-2 px-5 py-3 text-sm font-bold bg-[#0F0F11] text-white hover:bg-[#1A1A1F] active:scale-95 transition-all duration-150"
              >
                <StopIcon />
                Stop
              </button>
            )}
          </div>

          {/* Recorded audio preview */}
          {audioBlob && (
            <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="chip-success">
                  <CheckIcon />
                  Audio Captured
                </span>
                <span className="text-xs text-iqoo-muted">
                  {(audioBlob.size / 1024).toFixed(1)} KB · webm
                </span>
              </div>
              <audio
                controls
                src={URL.createObjectURL(audioBlob)}
                className="w-full h-8"
              />
              <button
                type="button"
                onClick={() => { setAudioBlob(null); setPermissionState('idle') }}
                className="text-xs text-[#EF4444] hover:underline"
              >
                ✕ Discard & Re-record
              </button>
            </div>
          )}

          {/* Permission grant hint */}
          {permissionState === 'idle' && !audioBlob && (
            <p className="text-xs text-iqoo-muted">
              🎙️ Your browser will request microphone permission when you press Record.
              No audio is transmitted — all processing is local.
            </p>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* UPLOAD TAB                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div
            className={['drop-zone p-10 flex flex-col items-center justify-center gap-4 cursor-pointer text-center',
              isDragOver ? 'drag-over' : '',
            ].join(' ')}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            aria-label="Click or drag to upload an audio file"
          >
            <UploadIcon className={isDragOver ? 'text-[#FFD100]' : 'text-[#9CA3AF]'} />
            <div>
              <p className="font-bold text-sm text-[#111111]">
                {isDragOver ? 'Drop to upload' : 'Drag & drop audio file here'}
              </p>
              <p className="text-xs text-iqoo-muted mt-1">
                or click to browse — accepts .wav · .mp3 · .m4a · .webm · .ogg
              </p>
            </div>
            <span className="text-xs font-semibold text-[#FFD100] bg-[#0F0F11] px-3 py-1">
              SELECT FILE
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={handleFileInputChange}
            className="hidden"
            aria-hidden="true"
          />

          {/* File preview */}
          {audioFile && (
            <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="chip-success">
                  <CheckIcon />
                  File Ready
                </span>
                <span className="chip">{audioFile.name}</span>
                <span className="text-xs text-iqoo-muted">
                  {(audioFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <audio
                controls
                src={URL.createObjectURL(audioFile)}
                className="w-full h-8"
              />
              <button
                type="button"
                onClick={() => setAudioFile(null)}
                className="text-xs text-[#EF4444] hover:underline"
              >
                ✕ Remove file
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Error message ──────────────────────────────────────────────────── */}
      {micError && (
        <div className="p-3 bg-red-50 border border-red-200 flex items-start gap-2 animate-fade-in">
          <span className="text-red-500 mt-0.5 text-sm">⚠</span>
          <p className="text-xs text-red-700 leading-relaxed">{micError}</p>
        </div>
      )}

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-2">
        <button type="button" onClick={onBack} className="btn-ghost gap-2">
          <ChevronLeft />
          Back
        </button>

        <button
          type="button"
          onClick={() => onAudioReady(readyAudio)}
          disabled={!hasAudio}
          className="btn-iqoo gap-2"
        >
          Analyze Acoustic Data
          <ArrowRight />
        </button>
      </div>
    </div>
  )
}
