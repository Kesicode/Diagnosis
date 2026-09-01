'use client'

/**
 * ApplianceForm.js
 * ─────────────────
 * Step 1 of the AeroPulse workflow.
 * Renders a streamlined selection form for:
 *   1. Appliance Category (e.g., Washing Machine)
 *   2. Appliance Type     (e.g., Front Load)
 *   3. Manufacturer Brand (e.g., Samsung)
 *
 * Note: Acoustic problem signature detection is 100% automated by the
 * AeroPulse AI audio engine in Step 3 — no manual sound selection required.
 *
 * Props:
 *   - formData   : { category, type, brand }
 *   - onChange   : (field: string, value: string) => void
 *   - onSubmit   : () => void
 */

import {
  APPLIANCE_CATEGORIES,
  APPLIANCE_TYPES,
  APPLIANCE_BRANDS,
} from '../data/failureDatabase'

// ─── ICONS (inline SVG helpers) ───────────────────────────────────────────────

function ChevronDown() {
  return (
    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-iqoo-muted"
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
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

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M7 0L8.5 4.5L13 6L8.5 7.5L7 12L5.5 7.5L1 6L5.5 4.5L7 0Z"
        fill="currentColor" />
    </svg>
  )
}

// ─── FIELD WRAPPER ─────────────────────────────────────────────────────────────
function FormField({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="section-label">{label}</label>
        {hint && <span className="text-xs text-iqoo-muted">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

// ─── SELECT WRAPPER ────────────────────────────────────────────────────────────
function SelectField({ id, value, onChange, disabled, children, placeholder }) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="input-field pr-10 cursor-pointer disabled:bg-gray-50 disabled:text-iqoo-muted disabled:cursor-not-allowed"
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <ChevronDown />
    </div>
  )
}

// ─── CATEGORY GRID ─────────────────────────────────────────────────────────────
function CategoryGrid({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {APPLIANCE_CATEGORIES.map((cat) => {
        const isSelected = value === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={[
              'flex flex-col items-center justify-center gap-1.5 p-4 border text-center',
              'transition-all duration-150 focus:outline-none',
              isSelected
                ? 'bg-[#0F0F11] border-[#FFD100] text-white shadow-iqoo'
                : 'bg-white border-[#E5E7EB] text-[#374151] hover:border-[#0F0F11] hover:bg-gray-50',
            ].join(' ')}
          >
            <span className="text-2xl leading-none">{cat.icon}</span>
            <span className="text-xs font-semibold leading-tight">{cat.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function ApplianceForm({ formData, onChange, onSubmit }) {
  const { category, type, brand } = formData

  const availableTypes = category ? (APPLIANCE_TYPES[category] ?? []) : []
  const isValid = Boolean(category && type && brand)

  function handleSubmit(e) {
    e.preventDefault()
    if (isValid) onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <p className="section-label">Step 1 of 4</p>
        <h2 className="text-2xl font-bold text-iqoo-jet mt-1">
          Identify Your Appliance
        </h2>
        <span className="accent-bar" />
        <p className="text-sm text-iqoo-muted leading-relaxed">
          Select your appliance category, model type, and manufacturer brand.
          AeroPulse will automatically analyze the audio recording to isolate
          acoustic problem frequencies and diagnose the root failure.
        </p>
      </div>

      {/* ── 1. Category ────────────────────────────────────────────────────── */}
      <FormField label="Appliance Category" hint="Required">
        <CategoryGrid value={category} onChange={(val) => {
          onChange('category', val)
          onChange('type', '')  // reset type on category change
        }} />
      </FormField>

      {/* ── 2. Appliance Type & Brand in Responsive Grid ───────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Appliance Type" hint={!category ? 'Select category first' : 'Required'}>
          <SelectField
            id="appliance-type"
            value={type}
            onChange={(val) => onChange('type', val)}
            disabled={!category}
            placeholder="— Select Type —"
          >
            {availableTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </SelectField>
        </FormField>

        <FormField label="Manufacturer / Brand" hint="Required">
          <SelectField
            id="appliance-brand"
            value={brand}
            onChange={(val) => onChange('brand', val)}
            placeholder="— Select Brand —"
          >
            {APPLIANCE_BRANDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </SelectField>
        </FormField>
      </div>

      {/* ── Automated Detection Notice ─────────────────────────────────────── */}
      <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] flex items-start gap-3">
        <div className="p-1.5 bg-[#FFD100] text-[#0F0F11] flex-none mt-0.5">
          <SparklesIcon />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
            Automated Acoustic Diagnosis
          </h4>
          <p className="text-xs text-iqoo-muted mt-1 leading-relaxed">
            No need to identify or classify the sound yourself. In the next step,
            record or upload an audio sample. AeroPulse AI algorithms will decompose
            frequency harmonics, detect abnormal sound signatures, and determine the exact mechanical failure.
          </p>
        </div>
      </div>

      {/* ── Validation hint ────────────────────────────────────────────────── */}
      {!isValid && (
        <p className="text-xs text-iqoo-muted flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-iqoo-muted inline-block" />
          Select an appliance category, type, and brand to proceed.
        </p>
      )}

      {/* ── Submit ─────────────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={!isValid}
        className="btn-iqoo w-full sm:w-auto gap-3"
      >
        Proceed to Audio Capture
        <ArrowRight />
      </button>
    </form>
  )
}
