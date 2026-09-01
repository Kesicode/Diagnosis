/**
 * AeroPulse Diagnostics — Audio Engine Service
 * =============================================
 * Asynchronous acoustic analysis pipeline.
 *
 * Accepts:
 *   - audioBlob : Blob | File — the captured or uploaded audio
 *   - metadata  : { category, type, brand, soundSignature } — appliance context
 *
 * Returns a DiagnosticResult object containing the matched failure entry
 * (or the fallback entry) enriched with runtime metadata.
 *
 * Processing includes a 2.8-second simulated inference delay to mirror
 * the latency of a real remote acoustic-analysis service.
 */

import {
  FAILURE_DATABASE,
  FALLBACK_DIAGNOSIS,
} from '../data/failureDatabase'

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

/** Simulated inference latency in milliseconds */
const INFERENCE_LATENCY_MS = 2800

/** Minimum confidence threshold for a strong match (%) */
const HIGH_CONFIDENCE_THRESHOLD = 80

/** Minimum confidence threshold for a weak match (%) */
const LOW_CONFIDENCE_THRESHOLD = 50

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/**
 * Returns a promise that resolves after the given delay.
 * Used to simulate the processing latency of a real ML inference pipeline.
 * @param {number} ms
 */
function simulateInferenceLatency(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Derives a numeric "audio fingerprint" from the blob size and timestamp.
 * In a real system this would be an FFT-based spectral analysis.
 * Here it deterministically varies the confidence within ±8% of the seeded value.
 *
 * @param {Blob|File} audioBlob
 * @param {number}    baseConfidence
 * @returns {number}
 */
function computeSimulatedConfidenceDelta(audioBlob, baseConfidence) {
  const sizeBytes = audioBlob?.size ?? 0
  const fingerprint = (sizeBytes % 17) - 8          // range: -8 to +8
  const adjusted = Math.min(99, Math.max(30, baseConfidence + fingerprint))
  return adjusted
}

/**
 * Calculates a human-readable audio duration estimate from file size.
 * Assumes an average encoded bitrate of ~96 kbps for recorded audio.
 *
 * @param {Blob|File} audioBlob
 * @returns {string}
 */
function estimateAudioDuration(audioBlob) {
  if (!audioBlob || audioBlob.size === 0) return '0s'
  const avgBitrateKbps = 96
  const seconds = Math.round((audioBlob.size * 8) / (avgBitrateKbps * 1000))
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

/**
 * Returns a severity label with color context.
 * @param {'high'|'medium'|'low'} severity
 */
function getSeverityContext(severity) {
  switch (severity) {
    case 'high':   return { label: 'HIGH RISK',   color: '#EF4444' }
    case 'medium': return { label: 'MODERATE',    color: '#F97316' }
    case 'low':    return { label: 'LOW RISK',    color: '#22C55E' }
    default:       return { label: 'UNKNOWN',     color: '#6B7280' }
  }
}

/**
 * Returns a confidence tier label based on percentage.
 * @param {number} confidence
 */
function getConfidenceTier(confidence) {
  if (confidence >= HIGH_CONFIDENCE_THRESHOLD) return 'Strong Match'
  if (confidence >= LOW_CONFIDENCE_THRESHOLD)  return 'Partial Match'
  return 'Weak Signal'
}

// ─── CORE ANALYSIS FUNCTION ───────────────────────────────────────────────────

/**
 * analyzeAudio
 * ─────────────
 * Primary entry point for the AeroPulse acoustic analysis pipeline.
 *
 * @param {Blob|File} audioBlob         — Raw audio data captured/uploaded by the user
 * @param {Object}    metadata          — Appliance context from ApplianceForm
 * @param {string}    metadata.category — e.g., 'washing_machine'
 * @param {string}    metadata.type     — e.g., 'Front Load'
 * @param {string}    metadata.brand    — e.g., 'Samsung'
 * @param {string}    metadata.soundSignature — e.g., 'grinding'
 *
 * @returns {Promise<DiagnosticResult>}
 */
export async function analyzeAudio(audioBlob, metadata) {
  // ── 1. Validate inputs ──────────────────────────────────────────────────────
  if (!metadata?.category) {
    throw new Error('AeroPulse Engine: appliance category is required for analysis.')
  }

  // ── 2. Simulate ML inference latency ────────────────────────────────────────
  await simulateInferenceLatency(INFERENCE_LATENCY_MS)

  // ── 3. Resolve diagnostic entry ─────────────────────────────────────────────
  const { category, type, brand, soundSignature } = metadata

  const categoryDB = FAILURE_DATABASE[category]
  let matchedEntry   = null
  let isSeededMatch  = false

  if (categoryDB) {
    // Exact sound-signature match
    if (soundSignature && categoryDB[soundSignature]) {
      matchedEntry  = categoryDB[soundSignature]
      isSeededMatch = true
    } else {
      // Partial match: pick first available entry in this category
      const availableKeys = Object.keys(categoryDB)
      if (availableKeys.length > 0) {
        matchedEntry  = categoryDB[availableKeys[0]]
        isSeededMatch = true
      }
    }
  }

  // Fall back to generic diagnosis if no entry found
  if (!matchedEntry) {
    matchedEntry  = FALLBACK_DIAGNOSIS
    isSeededMatch = false
  }

  // ── 4. Compute dynamic confidence & audio metadata ──────────────────────────
  const adjustedConfidence = computeSimulatedConfidenceDelta(
    audioBlob,
    matchedEntry.confidence
  )
  const audioFilename  = audioBlob?.name ?? 'recorded_audio.webm'
  const audioSizeKB    = audioBlob ? Math.round(audioBlob.size / 1024) : 0
  const audioDuration  = estimateAudioDuration(audioBlob)
  const severityCtx    = getSeverityContext(matchedEntry.severity)
  const confidenceTier = getConfidenceTier(adjustedConfidence)

  // ── 5. Build and return the DiagnosticResult ─────────────────────────────────
  /** @type {DiagnosticResult} */
  const result = {
    // ── Match metadata ────────────────────────────────────────────────────────
    matchedAt:      new Date().toISOString(),
    isSeededMatch,
    confidence:     adjustedConfidence,
    confidenceTier,
    severityContext: severityCtx,

    // ── Appliance context ─────────────────────────────────────────────────────
    appliance: {
      category,
      type:  type  ?? 'Unspecified',
      brand: brand ?? 'Unspecified',
      soundSignature: soundSignature ?? 'unclassified',
    },

    // ── Audio metadata ────────────────────────────────────────────────────────
    audio: {
      filename:   audioFilename,
      sizeKB:     audioSizeKB,
      duration:   audioDuration,
      mimeType:   audioBlob?.type ?? 'audio/webm',
    },

    // ── Diagnostic data (spread from matched entry) ───────────────────────────
    severity:         matchedEntry.severity,
    title:            matchedEntry.title,
    component:        matchedEntry.component,
    diagnosis:        matchedEntry.diagnosis,
    diySteps:         matchedEntry.diySteps,
    partsRequired:    matchedEntry.partsRequired,
    safetyNotes:      matchedEntry.safetyNotes,
    estimatedCost:    matchedEntry.estimatedCost,
    professionalNote: matchedEntry.professionalNote,

    // ── Engine metadata ───────────────────────────────────────────────────────
    engineVersion: '1.4.2',
    modelId:       'aeropulse-acoustic-v1',
    processingMs:  INFERENCE_LATENCY_MS,
  }

  return result
}

// ─── TYPE DEFINITIONS (JSDoc) ─────────────────────────────────────────────────
/**
 * @typedef {Object} DiagnosticResult
 * @property {string}  matchedAt
 * @property {boolean} isSeededMatch
 * @property {number}  confidence
 * @property {string}  confidenceTier
 * @property {{label: string, color: string}} severityContext
 * @property {{category: string, type: string, brand: string, soundSignature: string}} appliance
 * @property {{filename: string, sizeKB: number, duration: string, mimeType: string}} audio
 * @property {string}   severity
 * @property {string}   title
 * @property {string}   component
 * @property {string}   diagnosis
 * @property {string[]} diySteps
 * @property {string[]} partsRequired
 * @property {string[]} safetyNotes
 * @property {string}   estimatedCost
 * @property {string}   professionalNote
 * @property {string}   engineVersion
 * @property {string}   modelId
 * @property {number}   processingMs
 */
