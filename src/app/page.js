'use client'

/**
 * page.js — AeroPulse Diagnostics
 * ─────────────────────────────────
 * Central orchestrator managing the 4-step diagnostic workflow:
 *
 *   Step 1: ApplianceForm    — Select category / type / brand / sound
 *   Step 2: AudioRecorder    — Record live mic or upload audio file
 *   Step 3: Analyzing        — Loading state during audioEngine processing
 *   Step 4: DiagnosticReport — Full result dashboard
 *
 * State is held entirely in this component and passed down via props.
 * No external state management library is required.
 */

import { useState, useCallback } from 'react'
import ApplianceForm    from '../components/ApplianceForm'
import AudioRecorder    from '../components/AudioRecorder'
import DiagnosticReport from '../components/DiagnosticReport'
import { analyzeAudio } from '../services/audioEngine'
import { APPLIANCE_CATEGORIES } from '../data/failureDatabase'

// ─── STEP CONSTANTS ───────────────────────────────────────────────────────────
const STEP = {
  FORM:      1,
  RECORD:    2,
  ANALYZING: 3,
  RESULT:    4,
}

// ─── INITIAL FORM STATE ───────────────────────────────────────────────────────
const INITIAL_FORM = {
  category:       '',
  type:           '',
  brand:          '',
  soundSignature: '',
}

// ─── STEP PROGRESS BAR ────────────────────────────────────────────────────────
function StepProgressBar({ currentStep }) {
  const steps = [
    { id: 1, label: 'Identify' },
    { id: 2, label: 'Capture' },
    { id: 3, label: 'Analyze' },
    { id: 4, label: 'Report' },
  ]

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, idx) => {
        const isDone    = currentStep > step.id
        const isActive  = currentStep === step.id
        const isUpcoming = currentStep < step.id

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Step node */}
            <div className="flex flex-col items-center gap-1 min-w-[48px]">
              <div className={[
                'w-7 h-7 flex items-center justify-center text-xs font-bold transition-all duration-300',
                isDone    ? 'bg-[#22C55E] text-white'         : '',
                isActive  ? 'bg-[#FFD100] text-[#0F0F11]'     : '',
                isUpcoming ? 'bg-[#E5E7EB] text-[#9CA3AF]'   : '',
              ].join(' ')}>
                {isDone ? '✓' : step.id}
              </div>
              <span className={[
                'text-[9px] font-bold uppercase tracking-widest hidden sm:block',
                isDone    ? 'text-[#22C55E]' : '',
                isActive  ? 'text-[#FFD100]' : '',
                isUpcoming ? 'text-[#9CA3AF]' : '',
              ].join(' ')}>
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {idx < steps.length - 1 && (
              <div className={[
                'flex-1 h-[2px] mx-1 transition-all duration-500',
                currentStep > step.id ? 'bg-[#22C55E]' : 'bg-[#E5E7EB]',
              ].join(' ')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── ANALYZING SCREEN ─────────────────────────────────────────────────────────
function AnalyzingScreen({ applianceName }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-fade-in">

      {/* Animated logo/icon block */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-[#FFD100] opacity-20 animate-ping-slow" />
        {/* Middle ring */}
        <div className="absolute inset-3 rounded-full border-2 border-[#FFD100] opacity-40 animate-spin-slow" />
        {/* Center icon */}
        <div className="w-12 h-12 bg-[#FFD100] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12h4M8 6l1.5 1.5M12 2v4M16 6l-1.5 1.5M22 12h-4M16 18l-1.5-1.5M12 22v-4M8 18l1.5-1.5"
              stroke="#0F0F11" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="text-xl font-bold text-[#111111]">
          AeroPulse AI analyzing acoustic frequencies…
        </h2>
        <p className="text-sm text-iqoo-muted max-w-sm mx-auto leading-relaxed">
          Processing audio sample for{' '}
          <span className="font-semibold text-[#111111]">{applianceName}</span>.
          Running spectral decomposition against the failure pattern database.
        </p>
      </div>

      {/* Loading dots */}
      <div className="flex gap-2 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="loading-dot w-2.5 h-2.5 rounded-full bg-[#FFD100]"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      {/* Pipeline steps */}
      <div className="w-full max-w-sm space-y-2">
        {[
          'Decoding audio bitstream…',
          'Running FFT spectral decomposition…',
          'Matching against 2,400+ failure signatures…',
          'Assembling diagnostic report…',
        ].map((step, i) => (
          <div key={i}
            className="flex items-center gap-3 p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] animate-fade-in"
            style={{ animationDelay: `${i * 0.35 + 0.2}s`, animationFillMode: 'both' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100] animate-pulse-yellow flex-none" />
            <span className="text-xs text-[#374151] font-medium font-mono">{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function AppHeader({ currentStep, onReset }) {
  return (
    <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-none">
            <div className="w-7 h-7 bg-[#FFD100] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M7 1L1 4.5v5L7 13l6-3.5v-5L7 1z" stroke="#0F0F11"
                  strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="7" cy="7" r="2" fill="#0F0F11" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-extrabold text-[#111111] tracking-tight">
                AeroPulse
              </span>
              <span className="text-xs text-iqoo-muted ml-1 hidden sm:inline">
                Diagnostics
              </span>
            </div>
          </div>

          {/* Step progress */}
          <div className="flex-1 max-w-xs hidden sm:block">
            <StepProgressBar currentStep={currentStep} />
          </div>

          {/* Version chip + reset */}
          <div className="flex items-center gap-2 flex-none">
            <span className="chip hidden md:flex">v1.4.2</span>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={onReset}
                className="text-xs text-iqoo-muted hover:text-[#EF4444] transition-colors font-semibold"
              >
                ✕ Reset
              </button>
            )}
          </div>
        </div>

        {/* Mobile step bar */}
        <div className="sm:hidden pb-2">
          <StepProgressBar currentStep={currentStep} />
        </div>
      </div>
    </header>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function AppFooter() {
  return (
    <footer className="border-t border-[#E5E7EB] mt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#FFD100]" />
            <span className="text-xs font-bold text-[#111111]">AeroPulse Diagnostics</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-iqoo-muted">
            <span>Local Analysis — No Data Transmitted</span>
            <span>·</span>
            <span>iQOO Design System</span>
            <span>·</span>
            <span>Next.js 14</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────────────────────
export default function Page() {
  const [step,          setStep]          = useState(STEP.FORM)
  const [formData,      setFormData]      = useState(INITIAL_FORM)
  const [diagnosticResult, setDiagnosticResult] = useState(null)
  const [analysisError, setAnalysisError] = useState(null)

  // ── Derive appliance display label ─────────────────────────────────────────
  const applianceLabel = (() => {
    if (!formData.category) return 'Selected Appliance'
    const cat = APPLIANCE_CATEGORIES.find((c) => c.id === formData.category)
    const parts = [
      formData.brand,
      cat?.label ?? formData.category,
      formData.type,
    ].filter(Boolean)
    return parts.join(' · ')
  })()

  // ── Form field change handler ──────────────────────────────────────────────
  const handleFormChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // ── Step 1 → 2 ────────────────────────────────────────────────────────────
  const handleFormSubmit = useCallback(() => {
    setStep(STEP.RECORD)
  }, [])

  // ── Step 2 → 3 → 4 ────────────────────────────────────────────────────────
  const handleAudioReady = useCallback(async (audioBlob) => {
    setAnalysisError(null)
    setStep(STEP.ANALYZING)

    try {
      const result = await analyzeAudio(audioBlob, formData)
      setDiagnosticResult(result)
      setStep(STEP.RESULT)
    } catch (err) {
      console.error('AeroPulse analysis error:', err)
      setAnalysisError(err.message ?? 'An unexpected error occurred during analysis.')
      setStep(STEP.RECORD)  // Return to recording step with error shown
    }
  }, [formData])

  // ── Reset all state ────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setStep(STEP.FORM)
    setFormData(INITIAL_FORM)
    setDiagnosticResult(null)
    setAnalysisError(null)
  }, [])

  // ── Back from record to form ───────────────────────────────────────────────
  const handleBack = useCallback(() => {
    setStep(STEP.FORM)
  }, [])

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader currentStep={step} onReset={handleReset} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">

        {/* ── Analysis error banner ─────────────────────────────────────── */}
        {analysisError && step === STEP.RECORD && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3 animate-fade-in">
            <span className="text-red-500 text-lg flex-none">⚠</span>
            <div>
              <p className="text-sm font-bold text-red-800">Analysis Failed</p>
              <p className="text-xs text-red-700 mt-0.5">{analysisError}</p>
            </div>
            <button
              onClick={() => setAnalysisError(null)}
              className="ml-auto text-red-400 hover:text-red-600 flex-none"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Step 1: Appliance Form ─────────────────────────────────────── */}
        {step === STEP.FORM && (
          <ApplianceForm
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
          />
        )}

        {/* ── Step 2: Audio Recorder ─────────────────────────────────────── */}
        {step === STEP.RECORD && (
          <AudioRecorder
            onAudioReady={handleAudioReady}
            onBack={handleBack}
            applianceLabel={applianceLabel}
          />
        )}

        {/* ── Step 3: Analyzing ─────────────────────────────────────────── */}
        {step === STEP.ANALYZING && (
          <AnalyzingScreen applianceName={applianceLabel} />
        )}

        {/* ── Step 4: Diagnostic Report ─────────────────────────────────── */}
        {step === STEP.RESULT && diagnosticResult && (
          <DiagnosticReport
            result={diagnosticResult}
            onReset={handleReset}
          />
        )}
      </main>

      <AppFooter />
    </div>
  )
}
