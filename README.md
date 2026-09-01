# AeroPulse Diagnostics

> Universal acoustic electronics appliance diagnostic web tool — built with **Next.js 14** and the **iQOO design system**.

![iQOO Brand Yellow Banner](https://placehold.co/900x140/FFD100/0F0F11?text=AeroPulse+Diagnostics)

---

## What It Does

**AeroPulse Diagnostics** allows users to track household mechanical systems (ACs, Washers, Fridges, Microwaves) by recording audio or uploading audio files. A local algorithmic engine processes the sound data and maps it against a curated failure database to return high-fidelity DIY repair instructions.

---

## Workflow

| Step | Screen | Action |
|------|--------|--------|
| 1 | **Appliance Form** | Select category, type, and manufacturer brand |
| 2 | **Audio Capture** | Record via microphone (10s auto-cutoff) or upload audio |
| 3 | **Analyzing** | AeroPulse AI automatically detects problem signature & frequencies |
| 4 | **Diagnostic Report** | Full fault diagnosis, telemetry, DIY steps, parts, cost |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router, Client Components)
- **Styling**: Tailwind CSS 3 + custom iQOO design tokens
- **Audio**: Web MediaStream API + Web Audio API AnalyserNode
- **Canvas**: HTML5 Canvas real-time waveform oscilloscope
- **State**: React `useState` / `useCallback` — no external state library

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary Accent | `#FFD100` | Buttons, waveform, active states |
| Background Dark | `#0F0F11` | Header panels, canvas background |
| Base Background | `#FFFFFF` | Page surface |
| Border | `#E5E7EB` | Cards, inputs, dividers |
| Text Primary | `#111111` | Body copy |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

---

## Project Structure

```
/
├── package.json
├── tailwind.config.js
├── next.config.js
└── src/
    ├── app/
    │   ├── layout.js           # Global metadata, fonts, body
    │   └── page.js             # 4-step workflow orchestrator
    ├── components/
    │   ├── ApplianceForm.js    # Category / type / brand selector
    │   ├── AudioRecorder.js    # Mic + file upload + 10s timer
    │   ├── WaveformVisual.js   # Canvas oscilloscope (iQOO yellow)
    │   └── DiagnosticReport.js # Full diagnostic dashboard
    ├── data/
    │   └── failureDatabase.js  # 6 appliance categories, 25+ fault entries
    ├── services/
    │   └── audioEngine.js      # Async analysis engine (2.8s latency)
    └── styles/
        └── globals.css         # Tailwind + iQOO component classes
```

---

## Supported Appliances & Faults

| Appliance | Sound Signature | Diagnosed Fault |
|-----------|-----------------|-----------------|
| Washing Machine | Grinding | Worn Drum Bearings |
| Washing Machine | Thumping | Broken Shock Absorbers |
| Refrigerator | Clicking | Failed Compressor Start Relay |
| Split AC | Rattling | Misaligned Blower Assembly |
| Microwave | Humming | Faulty Magnetron Module |
| + 20 more entries | — | — |

---

*AeroPulse Diagnostics · All acoustic analysis performed locally in-browser · No data transmitted.*
