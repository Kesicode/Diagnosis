'use client'

/**
 * DiagnosticReport.js
 * ─────────────────────
 * Step 4 of the AeroPulse workflow.
 * Renders the full acoustic diagnosis result as a structured dashboard.
 *
 * Props:
 *   - result  : DiagnosticResult object from audioEngine.js
 *   - onReset : () => void — callback to return to Step 1
 */

// ─── ICONS ────────────────────────────────────────────────────────────────────
function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2L3 5v5c0 4.1 3 7.9 7 9 4-1.1 7-4.9 7-9V5l-7-3z"
        stroke="currentColor" strokeWidth="1.5" fill="none"
        strokeLinejoin="round" />
    </svg>
  )
}

function WrenchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M14.5 2.5a3.5 3.5 0 00-4.87 4.87L2.5 14.5a1.41 1.41 0 002 2l7.13-7.13A3.5 3.5 0 0014.5 2.5z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        strokeLinejoin="round" />
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="16" height="11" rx="1" stroke="currentColor"
        strokeWidth="1.5" />
      <path d="M2 7l8-5 8 5" stroke="currentColor" strokeWidth="1.5"
        strokeLinejoin="round" />
      <path d="M10 7v11" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2L2 17h16L10 2z" stroke="currentColor" strokeWidth="1.5"
        strokeLinejoin="round" />
      <path d="M10 8v4M10 14h.01" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8v5M9 6h.01" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2v4h-4" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 14v-4h4" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 6A6 6 0 108 2" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" />
      <path d="M2 10a6 6 0 008 5.83" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" />
    </svg>
  )
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function SeverityBar({ severity }) {
  const barClass = {
    high:   'severity-bar-high',
    medium: 'severity-bar-medium',
    low:    'severity-bar-low',
  }[severity] ?? 'bg-gray-200'

  return (
    <div className="h-1.5 w-full bg-[#F3F4F6] overflow-hidden">
      <div className={`h-full w-full ${barClass}`} />
    </div>
  )
}

function ConfidenceBar({ confidence }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#111111]">Confidence Score</span>
        <span className="text-sm font-extrabold text-[#FFD100] font-mono">
          {confidence}%
        </span>
      </div>
      <div className="h-2 w-full bg-[#1E1E25] overflow-hidden">
        <div
          className="h-full bg-[#FFD100] transition-all duration-700"
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  )
}

// ─── SECTION CARD ──────────────────────────────────────────────────────────────
function SectionCard({ icon, title, children, className = '' }) {
  return (
    <div className={`border border-[#E5E7EB] ${className}`}>
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#E5E7EB] bg-[#F9FAFB]">
        <span className="text-[#FFD100] bg-[#0F0F11] p-1.5">{icon}</span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#374151]">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ─── STEP ITEM ─────────────────────────────────────────────────────────────────
function DIYStep({ index, text }) {
  const isWarning = text.startsWith('⚠️') || text.startsWith('🔴') || text.startsWith('☠️')
  return (
    <div className={[
      'flex gap-3 p-3',
      isWarning ? 'bg-red-50 border border-red-100' : 'hover:bg-gray-50',
    ].join(' ')}>
      <span className={[
        'flex-none w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5',
        isWarning
          ? 'bg-red-500 text-white'
          : 'bg-[#FFD100] text-[#0F0F11]',
      ].join(' ')}>
        {isWarning ? '!' : index}
      </span>
      <p className={[
        'text-sm leading-relaxed',
        isWarning ? 'text-red-800 font-medium' : 'text-[#374151]',
      ].join(' ')}>
        {text}
      </p>
    </div>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function DiagnosticReport({ result, onReset }) {
  if (!result) return null

  const {
    confidence, confidenceTier, severity, severityContext,
    title, component, diagnosis,
    diySteps, partsRequired, safetyNotes, estimatedCost, professionalNote,
    appliance, audio, matchedAt, engineVersion, modelId, processingMs,
    isSeededMatch, detectedSignatureLabel, acousticProfile,
  } = result

  const matchedDate = new Date(matchedAt).toLocaleString('en-IN', {
    dateStyle: 'medium', timeStyle: 'short'
  })

  // Label maps
  const CATEGORY_LABELS = {
    washing_machine: 'Washing Machine',
    refrigerator: 'Refrigerator',
    split_ac: 'Split AC',
    microwave: 'Microwave Oven',
    dishwasher: 'Dishwasher',
    dryer: 'Clothes Dryer',
  }
  const categoryLabel = CATEGORY_LABELS[appliance.category] ?? appliance.category
  const soundLabel = detectedSignatureLabel || appliance.detectedSignatureLabel || 'Acoustic Anomaly'

  return (
    <div className="space-y-6 animate-slide-up">

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* REPORT HEADER                                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#0F0F11] text-white p-6">
        <SeverityBar severity={severity} />

        <div className="mt-5 flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="section-label text-[#6B7280]">Step 4 of 4</span>
              <span className="text-xs bg-[#FFD100] text-[#0F0F11] font-extrabold px-2 py-0.5 tracking-wider">
                AUTO-DIAGNOSED
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {title}
            </h2>
            <p className="text-xs text-[#9CA3AF]">{component}</p>
          </div>

          {/* Severity badge */}
          <div
            className="px-4 py-2 text-xs font-extrabold tracking-widest border-2 flex-none"
            style={{ color: severityContext.color, borderColor: severityContext.color }}
          >
            {severityContext.label}
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-5 pt-4 border-t border-[#2A2A30] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Appliance</p>
            <p className="text-sm font-semibold text-white mt-0.5">{categoryLabel}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Brand · Type</p>
            <p className="text-sm font-semibold text-white mt-0.5">{appliance.brand} · {appliance.type}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Auto-Detected Sound</p>
            <p className="text-sm font-semibold text-[#FFD100] mt-0.5 truncate" title={soundLabel}>
              {soundLabel}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Analyzed At</p>
            <p className="text-sm font-semibold text-white mt-0.5">{matchedDate}</p>
          </div>
        </div>
      </div>

      {/* ── Confidence & Acoustic Telemetry panel ─────────────────────────── */}
      <div className="card-dark p-5 space-y-4">
        <ConfidenceBar confidence={confidence} />
        <div className="flex items-center gap-3 flex-wrap">
          <span className={[
            'chip text-xs font-bold',
            confidence >= 80
              ? 'border-yellow-400 text-yellow-600 bg-yellow-50'
              : confidence >= 50
              ? 'border-orange-300 text-orange-700 bg-orange-50'
              : 'border-gray-300 text-gray-600 bg-gray-50',
          ].join(' ')}>
            {confidenceTier}
          </span>

          {isSeededMatch ? (
            <span className="chip-success">✓ Auto-Matched Failure Model</span>
          ) : (
            <span className="chip-warn">⚠ Fallback Diagnosis — Manual Inspection Advised</span>
          )}

          <span className="text-xs text-[#9CA3AF] font-mono ml-auto">
            {engineVersion} · {processingMs}ms
          </span>
        </div>

        {/* Telemetry Breakdown */}
        {acousticProfile && (
          <div className="pt-3 border-t border-[#2A2A30] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#1A1A1F] p-2.5 border border-[#2A2A30]">
              <p className="text-[10px] uppercase font-bold text-[#6B7280]">Identified Sound</p>
              <p className="font-semibold text-white mt-0.5 truncate">{acousticProfile.label || soundLabel}</p>
            </div>
            <div className="bg-[#1A1A1F] p-2.5 border border-[#2A2A30]">
              <p className="text-[10px] uppercase font-bold text-[#6B7280]">Dominant Freq</p>
              <p className="font-semibold text-[#FFD100] mt-0.5">{acousticProfile.dominantFreq}</p>
            </div>
            <div className="bg-[#1A1A1F] p-2.5 border border-[#2A2A30]">
              <p className="text-[10px] uppercase font-bold text-[#6B7280]">Spectral Pattern</p>
              <p className="font-semibold text-white mt-0.5 truncate" title={acousticProfile.pattern}>
                {acousticProfile.pattern}
              </p>
            </div>
            <div className="bg-[#1A1A1F] p-2.5 border border-[#2A2A30]">
              <p className="text-[10px] uppercase font-bold text-[#6B7280]">Signal-to-Noise</p>
              <p className="font-semibold text-[#22C55E] mt-0.5">{acousticProfile.snr}</p>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DIAGNOSIS                                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <SectionCard icon={<InfoIcon />} title="Technical Diagnosis">
        <p className="text-sm text-[#374151] leading-relaxed">{diagnosis}</p>
      </SectionCard>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SAFETY WARNINGS                                                   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {safetyNotes?.length > 0 && (
        <SectionCard
          icon={<AlertIcon />}
          title="Safety Warnings — Read Before Starting"
          className="border-red-200"
        >
          <div className="space-y-2">
            {safetyNotes.map((note, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 bg-red-50 border-l-2 border-red-400">
                <span className="text-red-500 flex-none text-sm mt-0.5">●</span>
                <p className="text-sm text-red-800 font-medium leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DIY REPAIR STEPS                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <SectionCard icon={<WrenchIcon />} title="DIY Repair Procedure">
        <div className="space-y-1 divide-y divide-[#F3F4F6]">
          {diySteps.map((step, i) => (
            <DIYStep key={i} index={i + 1} text={step} />
          ))}
        </div>
      </SectionCard>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PARTS + COST                                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Parts Required */}
        <SectionCard icon={<BoxIcon />} title="Parts Required">
          <ul className="space-y-2">
            {partsRequired.map((part, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100] flex-none mt-2" />
                <span className="text-sm text-[#374151]">{part}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Cost Estimate */}
        <div className="border border-[#E5E7EB]">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#E5E7EB] bg-[#0F0F11]">
            <span className="text-[#FFD100]">₹</span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">
              Estimated Repair Cost
            </h3>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-base font-bold text-[#111111]">{estimatedCost}</p>
            <p className="text-xs text-iqoo-muted leading-relaxed">
              Parts-only cost estimate. Labor charges not included. Prices vary by
              region and supplier.
            </p>

            {/* Audio metadata */}
            <div className="pt-3 border-t border-[#F3F4F6] grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] uppercase font-bold text-iqoo-muted">File Size</p>
                <p className="text-sm font-semibold">{audio.sizeKB} KB</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-iqoo-muted">Duration</p>
                <p className="text-sm font-semibold">{audio.duration}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-iqoo-muted">Format</p>
                <p className="text-sm font-semibold">{audio.mimeType.split('/').pop().toUpperCase()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-iqoo-muted">Engine Model</p>
                <p className="text-sm font-semibold font-mono">{modelId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PROFESSIONAL NOTE                                                 */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {professionalNote && (
        <div className="p-4 bg-[#F9FAFB] border-l-4 border-[#FFD100] flex gap-3">
          <span className="text-[#FFD100] flex-none mt-0.5"><InfoIcon /></span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#374151] mb-1">
              Professional Guidance
            </p>
            <p className="text-sm text-[#374151] leading-relaxed">{professionalNote}</p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* FOOTER ACTIONS                                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 pt-2 pb-8 flex-wrap">
        <button
          type="button"
          onClick={onReset}
          className="btn-reset gap-2"
        >
          <RefreshIcon />
          Reset Dashboard
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="btn-ghost"
        >
          🖨 Print Report
        </button>

        <p className="text-xs text-iqoo-muted ml-auto hidden sm:block">
          AeroPulse Diagnostics · {engineVersion} · All analysis performed locally.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DISCLAIMER                                                        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB]">
        <p className="text-[11px] text-iqoo-muted leading-relaxed">
          <strong className="text-[#374151]">Disclaimer:</strong> AeroPulse Diagnostics
          provides algorithmic guidance based on acoustic pattern matching. Results are
          advisory only and not a substitute for professional appliance inspection. Always
          follow your appliance manufacturer&apos;s safety guidelines. The developers accept
          no liability for damage arising from DIY repair attempts.
        </p>
      </div>
    </div>
  )
}
