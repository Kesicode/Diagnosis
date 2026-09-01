'use client'

/**
 * ApplianceForm.js
 * ─────────────────
 * Step 1 of the AeroPulse workflow.
 * Renders a multi-field form for selecting:
 *   1. Appliance Category (e.g., Washing Machine)
 *   2. Appliance Type     (e.g., Front Load)
 *   3. Brand              (e.g., Samsung)
 *   4. Sound Signature    (e.g., Grinding / Scraping)
 *
 * Props:
 *   - formData   : { category, type, brand, soundSignature }
 *   - onChange   : (field: string, value: string) => void
 *   - onSubmit   : () => void
 */

import {
  APPLIANCE_CATEGORIES,
  APPLIANCE_TYPES,
  APPLIANCE_BRANDS,
  SOUND_SIGNATURES,
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

// ─── SOUND SIGNATURE GRID ──────────────────────────────────────────────────────
function SoundGrid({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {SOUND_SIGNATURES.map((sig) => {
        const isSelected = value === sig.id
        return (
          <button
            key={sig.id}
            type="button"
            onClick={() => onChange(sig.id)}
            className={[
              'text-left text-xs font-semibold px-3 py-2.5 border transition-all duration-150',
              'focus:outline-none',
              isSelected
                ? 'bg-[#FFD100] border-[#FFD100] text-[#0F0F11] shadow-iqoo'
                : 'bg-white border-[#E5E7EB] text-[#374151] hover:border-[#FFD100] hover:text-[#0F0F11]',
            ].join(' ')}
          >
            {sig.label}
          </button>
        )
      })}
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
  const { category, type, brand, soundSignature } = formData

  const availableTypes = category ? (APPLIANCE_TYPES[category] ?? []) : []

  const isValid = category && type && brand && soundSignature

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
          Select the appliance category, model type, manufacturer, and describe
          the sound you are hearing. This data calibrates the acoustic analysis engine.
        </p>
      </div>

      {/* ── 1. Category ────────────────────────────────────────────────────── */}
      <FormField label="Appliance Category" hint="Required">
        <CategoryGrid value={category} onChange={(val) => {
          onChange('category', val)
          onChange('type', '')  // reset type on category change
        }} />
      </FormField>

      {/* ── 2. Appliance Type ──────────────────────────────────────────────── */}
      <FormField label="Appliance Type" hint={!category ? 'Select a category first' : ''}>
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

      {/* ── 3. Brand ───────────────────────────────────────────────────────── */}
      <FormField label="Manufacturer / Brand">
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

      {/* ── 4. Sound Signature ─────────────────────────────────────────────── */}
      <FormField
        label="Acoustic Problem Signature"
        hint="Select the closest match to what you hear"
      >
        <SoundGrid value={soundSignature} onChange={(val) => onChange('soundSignature', val)} />
      </FormField>

      {/* ── Validation hint ────────────────────────────────────────────────── */}
      {!isValid && (
        <p className="text-xs text-iqoo-muted flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-iqoo-muted inline-block" />
          Complete all four fields to proceed to audio capture.
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
