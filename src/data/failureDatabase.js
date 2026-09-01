/**
 * AeroPulse Diagnostics — Failure Database
 * ==========================================
 * Structured appliance knowledge base mapping category → type → brand → failure patterns.
 * Each failure entry contains:
 *   - soundSignature : acoustic pattern key matched by the audio engine
 *   - severity       : 'high' | 'medium' | 'low'
 *   - title          : human-readable fault headline
 *   - component      : the specific sub-system component implicated
 *   - confidence     : algorithm confidence percentage (simulated)
 *   - diagnosis      : detailed technical description of the failure
 *   - diySteps       : ordered array of DIY repair instructions
 *   - partsRequired  : list of spare parts / tools needed
 *   - safetyNotes    : safety warnings before attempting repair
 *   - estimatedCost  : cost range string for parts (₹ / USD)
 *   - professionalNote : guidance on when to escalate to a technician
 */

// ─── APPLIANCE CATEGORIES ────────────────────────────────────────────────────
export const APPLIANCE_CATEGORIES = [
  { id: 'washing_machine', label: 'Washing Machine', icon: '🫧' },
  { id: 'refrigerator',    label: 'Refrigerator / Fridge', icon: '❄️' },
  { id: 'split_ac',        label: 'Split Air Conditioner', icon: '🌬️' },
  { id: 'microwave',       label: 'Microwave Oven', icon: '📡' },
  { id: 'dishwasher',      label: 'Dishwasher', icon: '🍽️' },
  { id: 'dryer',           label: 'Clothes Dryer', icon: '💨' },
]

// ─── APPLIANCE TYPES PER CATEGORY ────────────────────────────────────────────
export const APPLIANCE_TYPES = {
  washing_machine: [
    'Front Load',
    'Top Load',
    'Semi-Automatic',
    'Fully Automatic',
    'Twin Tub',
  ],
  refrigerator: [
    'Single Door',
    'Double Door',
    'Side-by-Side',
    'French Door',
    'Mini Bar',
  ],
  split_ac: [
    'Standard Inverter',
    'Dual Inverter',
    'Window Unit',
    'Cassette Unit',
    'Tower / Floor Standing',
  ],
  microwave: [
    'Solo',
    'Grill',
    'Convection',
    'OTG Combo',
    'Built-In',
  ],
  dishwasher: [
    'Freestanding',
    'Semi-Integrated',
    'Fully Integrated',
    'Countertop',
    'Drawer',
  ],
  dryer: [
    'Vented',
    'Condenser',
    'Heat Pump',
    'Washer-Dryer Combo',
  ],
}

// ─── APPLIANCE BRANDS ─────────────────────────────────────────────────────────
export const APPLIANCE_BRANDS = [
  'Samsung',
  'LG',
  'Haier',
  'Bosch',
  'Whirlpool',
  'IFB',
  'Godrej',
  'Panasonic',
  'Voltas',
  'Daikin',
  'Carrier',
  'Blue Star',
  'Electrolux',
  'Siemens',
  'Hitachi',
]

// ─── SOUND SIGNATURE OPTIONS ──────────────────────────────────────────────────
export const SOUND_SIGNATURES = [
  { id: 'grinding',   label: 'Grinding / Scraping' },
  { id: 'thumping',   label: 'Thumping / Banging' },
  { id: 'clicking',   label: 'Rhythmic Clicking' },
  { id: 'rattling',   label: 'Loud Rattling / Vibration' },
  { id: 'humming',    label: 'Deep Hum / Buzzing' },
  { id: 'squealing',  label: 'High-pitched Squealing' },
  { id: 'gurgling',   label: 'Gurgling / Bubbling' },
  { id: 'whistling',  label: 'Whistling / Hissing' },
  { id: 'knocking',   label: 'Knocking / Popping' },
  { id: 'silent',     label: 'Completely Silent (No Start)' },
]

// ─── FAILURE DATABASE ─────────────────────────────────────────────────────────
export const FAILURE_DATABASE = {

  // ═══════════════════════════════════════════════════════
  // WASHING MACHINE
  // ═══════════════════════════════════════════════════════
  washing_machine: {
    grinding: {
      severity: 'high',
      title: 'Worn-out Drum Bearing Assembly',
      component: 'Main Drum Bearings / Rear Shaft Seal',
      confidence: 92,
      diagnosis:
        'Severe grinding during spin cycles is a hallmark indicator of compromised main drum bearings. The rear shaft seal has likely failed, allowing water ingress into the bearing housing, causing accelerated corrosion and metal-on-metal grinding. Left unaddressed, this will lead to complete drum shaft seizure and motor burnout.',
      diySteps: [
        'Unplug the washing machine from mains power. Turn off the water supply valves.',
        'Pull the machine away from the wall to access the rear panel. Have towels ready for residual water.',
        'Remove the rear panel by unscrewing the 4–6 Phillips screws around its perimeter.',
        'Locate the large plastic outer drum tub. Note the drive belt connecting the motor to the drum pulley.',
        'Release the belt tension and slip the belt off the pulley. Set aside.',
        'Disconnect the drum counterweight brackets (front and rear) by removing their bolts.',
        'Carefully tilt the inner drum and outer tub assembly to access the rear bearing housing.',
        'Using a bearing puller or socket set, press out the old bearings and shaft seal.',
        'Inspect the bearing housing bore for scoring or corrosion. Clean thoroughly with a lint-free cloth.',
        'Press new bearings into the housing using a bearing press or a suitable socket slightly smaller than the bearing outer race.',
        'Install the new rear shaft seal with the lip facing inward. Apply a thin film of waterproof grease.',
        'Reassemble all components in reverse order. Reconnect the drive belt and tension it correctly.',
        'Run an empty short cycle to test for vibration and noise before loading laundry.',
      ],
      partsRequired: [
        'Drum bearing kit (6205ZZ × 2, or model-specific pair)',
        'Rear shaft seal / lip seal',
        'Waterproof lithium grease',
        'Replacement drive belt (if worn)',
      ],
      safetyNotes: [
        '⚡ Always disconnect from mains power before starting any internal work.',
        '💧 Ensure all water lines are disconnected and drained to prevent flooding.',
        '🔩 Bearings require a press-fit — do not hammer directly onto the bearing race; use a proper socket as a drift.',
      ],
      estimatedCost: '₹600 – ₹1,800 (parts only) | $8 – $25 USD',
      professionalNote:
        'If the drum shaft shows visible scoring or the bearing housing is corroded through, replacement of the full outer tub assembly is required — a professional repair is strongly recommended in that case.',
    },

    thumping: {
      severity: 'high',
      title: 'Broken Drum Shock Absorbers',
      component: 'Drum Shock Absorber Struts / Suspension Springs',
      confidence: 89,
      diagnosis:
        'Rhythmic thumping or banging during the spin cycle, especially with unbalanced or heavy loads, indicates one or more shock absorber struts have failed. The absorbers dampen drum movement; when broken, the drum oscillates violently, striking the cabinet walls and potentially damaging the spider arm.',
      diySteps: [
        'Unplug the machine. Remove the top panel by sliding it backward after unscrewing the rear screws.',
        'For front-loaders: remove the door seal gasket clamp, the door, and then the front panel.',
        'Locate the two or four shock absorber struts connecting the outer tub to the base frame.',
        'Inspect for oil leakage, bent pistons, or broken plastic end caps — these indicate failure.',
        'Unclip or unscrew the lower mounting pin from the base frame and the upper pin from the tub.',
        'Slide the old strut free. Compare length and diameter with the new replacement strut.',
        'Insert the new strut, pin both ends, and secure the retaining clips.',
        'Check the suspension springs at the top of the tub — replace any that are stretched or broken.',
        'Reassemble the cabinet panels and run a spin-only cycle with a small load to confirm resolution.',
      ],
      partsRequired: [
        'Shock absorber strut set (model-specific, typically sold in pairs)',
        'Suspension spring set (if also worn)',
        'Retaining clips (if plastic originals snapped)',
      ],
      safetyNotes: [
        '⚡ Disconnect power before any disassembly.',
        '🪛 Use correct torque when reinstalling tub mounting bolts — over-tightening cracks plastic tub mounts.',
      ],
      estimatedCost: '₹400 – ₹1,200 | $6 – $18 USD',
      professionalNote:
        'If thumping persists after absorber replacement, the drum spider arm may be cracked — inspect carefully and consult a technician if fractures are found.',
    },

    squealing: {
      severity: 'medium',
      title: 'Worn Drive Belt / Pulley Misalignment',
      component: 'Drive Belt & Motor Pulley',
      confidence: 85,
      diagnosis:
        'A high-pitched squealing or screeching during agitation or spin cycles typically indicates a worn, fraying, or slipping drive belt. The belt may be misaligned on its pulleys, causing edge wear and noise. If the pulley bearings are also dry, they contribute to the squeal.',
      diySteps: [
        'Unplug the machine and access the rear panel.',
        'Inspect the drive belt visually — check for cracks, glazing, fraying, or stretched sections.',
        'Check belt tension: you should feel moderate resistance when twisting it 90°. If it flops loosely, it is worn.',
        'Mark the belt routing direction before removal (arrows usually indicate correct orientation).',
        'Remove the old belt and clean the motor and drum pulleys with a dry cloth.',
        'Check both pulleys for wobble — spin them by hand to detect rough bearing feel.',
        'Fit the new belt, starting on the motor pulley and rolling it onto the drum pulley while rotating it by hand.',
        'Ensure the belt sits centrally in the pulley grooves. Run the machine briefly to verify alignment.',
      ],
      partsRequired: [
        'Replacement drive belt (match dimensions from old belt or model number)',
        'Pulley bearing set (if pulleys feel rough)',
      ],
      safetyNotes: [
        '⚡ Disconnect mains power before accessing the rear panel.',
      ],
      estimatedCost: '₹200 – ₹700 | $3 – $10 USD',
      professionalNote:
        'If the motor pulley is seized or wobbling, motor bearing replacement is needed — contact a certified technician.',
    },

    humming: {
      severity: 'medium',
      title: 'Motor Start Capacitor Degradation',
      component: 'Motor Run/Start Capacitor',
      confidence: 81,
      diagnosis:
        'A deep hum with no drum rotation, or slow start-up followed by humming, typically indicates a failed or weak motor capacitor. The capacitor provides the phase-shift needed to start the induction motor. When it fails, the motor hums but cannot develop starting torque.',
      diySteps: [
        'Unplug the machine. Access the motor via the rear or bottom panel.',
        'Locate the cylindrical motor capacitor connected to the motor terminals with spade connectors.',
        'Discharge the capacitor safely: bridge the two terminals with a 20kΩ resistor for 10 seconds.',
        'Note the capacitance (µF) and voltage rating printed on the capacitor body.',
        'Pull the spade connectors off and unscrew the capacitor mounting clamp.',
        'Install the new capacitor of identical rating. Reconnect the spade terminals securely.',
        'Reassemble the panel and run a short wash cycle to confirm normal motor start-up.',
      ],
      partsRequired: [
        'Motor run/start capacitor (match µF and VAC rating exactly)',
        '20kΩ resistor for safe discharge (can use insulated screwdriver with caution)',
      ],
      safetyNotes: [
        '⚡ Capacitors store lethal charge even when the machine is unplugged — always discharge before touching terminals.',
        '🔴 Do not use a screwdriver directly to short capacitor terminals — use a resistor for controlled discharge.',
      ],
      estimatedCost: '₹150 – ₹500 | $2 – $7 USD',
      professionalNote:
        'If the motor windings smell burnt or the motor body is very hot, the motor itself has failed — do not attempt DIY motor rewinding; contact a service technician.',
    },
  },

  // ═══════════════════════════════════════════════════════
  // REFRIGERATOR
  // ═══════════════════════════════════════════════════════
  refrigerator: {
    clicking: {
      severity: 'high',
      title: 'Failed Compressor Start Relay',
      component: 'PTC Start Relay / Overload Protector',
      confidence: 94,
      diagnosis:
        'A rhythmic clicking sound from the rear lower section of the fridge (typically every 2–5 minutes) is a textbook signature of a faulty PTC (Positive Temperature Coefficient) start relay. The relay attempts to start the compressor, fails, trips the overload protector, and the cycle repeats. This means the compressor is not running, so the fridge will progressively warm up.',
      diySteps: [
        'Unplug the refrigerator from the wall outlet. Pull it out to access the rear compressor compartment.',
        'Locate the compressor — a black, rounded metal component at the bottom rear.',
        'Find the start relay: a small plastic plug-in component clipped onto the compressor\'s side terminals.',
        'Grip the relay firmly and pull it straight out from the compressor terminals.',
        'Shake the relay next to your ear — a rattling sound inside confirms it has failed (broken pellet).',
        'Note the relay model number printed on its body. Order an exact replacement.',
        'Plug the new relay into the compressor terminals in the same orientation.',
        'Plug the refrigerator back in. The compressor should start within 5 minutes and run continuously.',
        'Monitor the fridge temperature over 2–3 hours to confirm normal cooling has resumed.',
      ],
      partsRequired: [
        'PTC Start Relay (model-specific — Supco RCO or generic equivalent)',
        'Compressor overload protector (replace if also faulty)',
      ],
      safetyNotes: [
        '⚡ Always unplug before accessing compressor components.',
        '🧊 Relay failure means the fridge has been warm — discard any perishable food that has been at room temperature for 4+ hours.',
      ],
      estimatedCost: '₹200 – ₹800 | $3 – $12 USD',
      professionalNote:
        'If replacing the relay does not stop the clicking, the compressor windings may be shorted or open — compressor replacement requires a licensed refrigeration technician with brazing equipment.',
    },

    humming: {
      severity: 'medium',
      title: 'Evaporator Fan Motor Failure',
      component: 'Evaporator Fan Motor / Fan Blade',
      confidence: 87,
      diagnosis:
        'Loud humming from inside the fridge cabinet (often behind the rear wall panel of the freezer compartment) indicates a failing evaporator fan motor. The motor may be seized, or ice buildup may be jamming the fan blade. This results in poor air circulation and uneven cooling.',
      diySteps: [
        'Unplug the fridge. Empty the freezer compartment completely.',
        'Remove the rear freezer wall panel — typically held by 2–4 screws under the shelving.',
        'You will find the evaporator coils and the fan motor assembly.',
        'If heavy ice is present around the fan, defrost the compartment with a hair dryer on low heat for 15–20 minutes, collecting melt water with towels.',
        'Attempt to spin the fan blade by hand — resistance or complete seizure indicates a failed motor bearing.',
        'Disconnect the two or three wire connector leading to the fan motor.',
        'Unscrew the motor mounting bracket and remove the blade from the motor shaft.',
        'Install the new motor and blade, reconnect the wiring, and secure the bracket.',
        'Reinstall the freezer panel, reload the compartment, and plug in.',
      ],
      partsRequired: [
        'Evaporator fan motor (match RPM and shaft diameter to original)',
        'Fan blade (if cracked or warped)',
      ],
      safetyNotes: [
        '⚡ Unplug before disassembling internal panels.',
        '💧 Have towels ready to absorb defrost water.',
      ],
      estimatedCost: '₹400 – ₹1,200 | $6 – $17 USD',
      professionalNote:
        'If defrost cycles are not running correctly and ice keeps building up rapidly, the defrost heater or thermostat may also need replacement.',
    },

    rattling: {
      severity: 'low',
      title: 'Loose Compressor Mounting / Drain Pan Vibration',
      component: 'Compressor Anti-Vibration Feet / Drain Pan',
      confidence: 78,
      diagnosis:
        'Rattling sounds from the bottom rear of the refrigerator, particularly during compressor run cycles, commonly indicate loose compressor mounting grommets or a drain pan that has shifted out of its retaining clips. This is typically a non-critical issue but can worsen if mounting rubber degrades further.',
      diySteps: [
        'Unplug the fridge and pull it away from the wall.',
        'Locate the drain pan (drip tray) beneath the compressor compartment — slide it out and check for cracks or misalignment.',
        'If the drain pan was out of position, snap it firmly back into its retention clips.',
        'Examine the three or four rubber mounting grommets that hold the compressor to the base plate.',
        'Grommets that are hardened, cracked, or completely collapsed must be replaced.',
        'Order grommet sets specific to your compressor model. Use a screwdriver and pliers to swap them out while the compressor is supported.',
        'Re-secure the compressor bolts to finger-tight only — over-tightening defeats the vibration isolation.',
        'Plug in and verify the rattling has stopped.',
      ],
      partsRequired: [
        'Compressor anti-vibration rubber grommet set',
        'Drain pan (if cracked)',
      ],
      safetyNotes: [
        '⚡ Unplug before any work on the compressor compartment.',
      ],
      estimatedCost: '₹100 – ₹400 | $1.50 – $6 USD',
      professionalNote:
        'This is one of the most accessible refrigerator repairs and can typically be completed in under 30 minutes.',
    },
  },

  // ═══════════════════════════════════════════════════════
  // SPLIT AC
  // ═══════════════════════════════════════════════════════
  split_ac: {
    rattling: {
      severity: 'high',
      title: 'Misaligned Blower Assembly / Loose Housing',
      component: 'Indoor Unit Blower Wheel / Front Panel / Housing Clips',
      confidence: 91,
      diagnosis:
        'Loud rattling or vibration noise from the indoor unit during operation strongly indicates a dislodged blower wheel (squirrel cage fan) or loose plastic housing clips. The blower wheel may have shifted axially on its shaft, causing blade-to-housing contact. Loose front panels also resonate at specific fan speeds.',
      diySteps: [
        'Switch off the AC via the remote control, then cut power at the circuit breaker.',
        'Remove the indoor unit\'s front panel by lifting it up and unclipping the hinges. Set aside.',
        'Remove the air filter panels (usually two — slide out downward).',
        'Locate the cylindrical blower wheel behind the evaporator coil.',
        'With a torch, look for any plastic debris, leaves, or insects jammed in the blower wheel fins.',
        'Attempt to wobble the blower wheel left/right — if it moves on the shaft, the set-screw has loosened.',
        'Use a long Phillips screwdriver to tighten the blower wheel set-screw (usually accessible through the left-side of the unit).',
        'Check all plastic housing clips and screws around the indoor unit body — press each panel section to find the one that resonates.',
        'Use a small strip of foam weatherstripping tape between loose panel joints to eliminate vibration resonance.',
        'Reinstall filters and front panel. Restore power and test at all fan speeds.',
      ],
      partsRequired: [
        'Foam weatherstrip tape (3mm self-adhesive)',
        'M4 set-screw (if original is stripped)',
        'Blower wheel (if fins are cracked or bent)',
      ],
      safetyNotes: [
        '⚡ Cut power at the breaker — do not rely on the remote alone; capacitors inside the unit retain charge.',
        '🧊 The evaporator coil fins are extremely sharp — handle with gloves.',
        '❄️ If refrigerant smell is detected, do not proceed — contact a licensed AC technician immediately.',
      ],
      estimatedCost: '₹0 – ₹1,500 | $0 – $22 USD (depends on whether blower wheel needs replacement)',
      professionalNote:
        'If the blower motor shaft itself is bent or the motor bearing is seized, the motor assembly must be replaced by a qualified technician.',
    },

    humming: {
      severity: 'medium',
      title: 'Outdoor Unit Fan Motor Bearing Wear',
      component: 'Outdoor Condenser Fan Motor',
      confidence: 83,
      diagnosis:
        'A deep humming or droning from the outdoor unit, especially at startup, indicates worn bearings in the condenser fan motor. The motor may start intermittently or run hotter than normal. This reduces cooling efficiency as the condenser cannot dissipate heat effectively.',
      diySteps: [
        'Switch off the AC and isolate the outdoor unit at the isolator switch on the wall.',
        'Remove the outdoor unit\'s top grille (typically 4–6 screws).',
        'Carefully lift the fan blade off the motor shaft — note the blade pitch direction for reassembly.',
        'Attempt to spin the motor shaft by hand — gritty resistance or intermittent binding indicates bearing failure.',
        'Disconnect the motor wiring harness (note wire colors / positions).',
        'Unscrew the motor from its mounting bracket.',
        'Install a replacement motor of identical specifications (RPM, wattage, shaft diameter, rotation direction).',
        'Reconnect wiring, reinstall blade and grille.',
        'Restore power and verify the fan runs quietly at full speed.',
      ],
      partsRequired: [
        'Outdoor fan motor (exact match to OEM spec)',
        'Fan blade (if blades are bent)',
      ],
      safetyNotes: [
        '⚡ Capacitors in the outdoor unit store charge — discharge before touching terminals.',
        '☀️ Working on outdoor units in peak summer heat: work during cooler morning hours; stay hydrated.',
      ],
      estimatedCost: '₹800 – ₹2,500 | $11 – $36 USD',
      professionalNote:
        'Ensure the replacement motor has the same rotation direction (CW or CCW) as the original, or the blade will run in reverse and provide no airflow.',
    },

    whistling: {
      severity: 'low',
      title: 'Air Filter Obstruction / Dirty Evaporator Coil',
      component: 'Air Filter Mesh / Evaporator Coil',
      confidence: 76,
      diagnosis:
        'Whistling or hissing from the indoor unit is most commonly caused by heavily clogged air filters forcing air through tiny gaps at high velocity. A dirty evaporator coil has the same effect. This is the most frequent AC complaint and the easiest to resolve.',
      diySteps: [
        'Open the front panel and remove both air filter meshes.',
        'Wash the filters under a gentle running tap until the water runs clear. Allow to dry completely before reinstalling.',
        'With filters removed, inspect the evaporator coil fins for dust buildup — they appear as a silver/grey accordion of thin metal fins.',
        'Use an AC coil cleaning foam spray (available at hardware stores) — apply, let foam activate for 10–15 minutes, then rinse with a gentle water spray.',
        'Reinstall dry filters and close the panel.',
        'Run the AC on a high fan speed for 5 minutes to dry the coil.',
      ],
      partsRequired: [
        'AC coil cleaning foam spray',
        'Replacement air filter mesh (if original is torn or permanently clogged)',
      ],
      safetyNotes: [
        '🧤 Wear gloves when handling coil cleaning spray — it can cause skin irritation.',
        '💧 Do not spray water directly into the electronic control board area.',
      ],
      estimatedCost: '₹100 – ₹300 | $1.50 – $4.50 USD',
      professionalNote:
        'Annual professional AC servicing (deep coil clean + gas pressure check) is recommended every 12 months.',
    },
  },

  // ═══════════════════════════════════════════════════════
  // MICROWAVE
  // ═══════════════════════════════════════════════════════
  microwave: {
    humming: {
      severity: 'high',
      title: 'Faulty High-Voltage Magnetron Module',
      component: 'Magnetron Tube / High-Voltage Capacitor / Diode',
      confidence: 90,
      diagnosis:
        'An unusually loud, deep hum or buzz during operation — especially when the microwave runs but produces no or reduced heating — is the primary acoustic signature of a failing magnetron tube. The magnetron converts high-voltage electricity into microwave radiation. When the magnetron is degraded, it draws excessive current, producing a pronounced hum and overloading the HV transformer. The HV capacitor or rectifier diode may also be implicated.',
      diySteps: [
        '⚠️ CRITICAL SAFETY FIRST: Microwave high-voltage circuits can store lethal charge (up to 6,000V / 1µF) even when unplugged. Do not attempt to work inside the microwave housing unless you have confirmed capacitor discharge.',
        'Unplug the microwave from the wall outlet. Wait a minimum of 2 minutes.',
        'DISCHARGE THE HV CAPACITOR: Use a high-voltage capacitor discharge probe (an insulated screwdriver with a 20kΩ/10W resistor soldered across its tip). Bridge the probe across both capacitor terminals and then from each terminal to the chassis ground.',
        'Remove the outer metal cabinet — typically secured with 4–6 screws on the rear and sides.',
        'Locate the magnetron — a cylindrical copper/grey metal component with two antenna pins protruding into a waveguide box, and large heat-sink fins.',
        'Inspect the magnetron mounting for cracks, burn marks, or a melted waveguide cover (clear plastic or mica plate inside the cavity).',
        'Test the magnetron filament with a multimeter in resistance mode: place probes on the two antenna/filament terminals. You should read near 0Ω (a direct short). An open reading (infinite resistance) confirms a blown filament.',
        'Test the HV diode: in diode mode, it should conduct in one direction only. A shorted diode (conducting both ways) causes the loud hum.',
        'Test the HV capacitor with a capacitance meter — compare to rated µF on the label.',
        'Replace the faulty component (magnetron, diode, or capacitor) with an exact part-number match.',
        'Reassemble, plug in, and test with a cup of water on the turntable for 30 seconds.',
      ],
      partsRequired: [
        'Magnetron tube (model-specific — match cavity resonance frequency)',
        'HV diode (0.85A / 12kV standard)',
        'HV capacitor (0.91µF / 2100VAC typical)',
        'Mica waveguide cover (if burnt or pitted)',
      ],
      safetyNotes: [
        '☠️ LETHAL VOLTAGE: The HV capacitor stores enough charge to be fatal. Never skip the discharge step.',
        '📵 Do not run the microwave empty after reassembly — always use a glass of water as a load.',
        '☢️ A damaged magnetron can leak microwave radiation — do not operate if the door seal or waveguide cover is damaged.',
        '🔴 If you are not experienced with high-voltage electronics, stop here and call a certified service center. This is one repair where professional involvement is strongly advised.',
      ],
      estimatedCost: '₹1,200 – ₹3,500 | $17 – $50 USD (magnetron) | ₹100 – ₹300 for diode/capacitor',
      professionalNote:
        'Given the lethal voltage hazard, microwave magnetron replacement is best left to a licensed appliance technician unless you have confirmed high-voltage electronics experience and proper discharge tools.',
    },

    rattling: {
      severity: 'low',
      title: 'Loose Turntable / Waveguide Cover Damage',
      component: 'Turntable Ring Guide / Glass Tray / Waveguide Cover',
      confidence: 88,
      diagnosis:
        'Rattling during operation is most commonly caused by the glass turntable tray not sitting correctly on its roller ring, or by a warped/cracked roller ring. A damaged waveguide cover (the rectangular plastic or mica plate on the interior wall) can also detach and create noise.',
      diySteps: [
        'Unplug the microwave.',
        'Remove the glass turntable tray and the plastic/metal roller ring from the cavity floor.',
        'Inspect the roller ring wheels — they should spin freely. Flat spots or cracked wheels require ring replacement.',
        'Clean the circular track groove on the cavity floor where the ring rides.',
        'Reinstall the ring and tray — ensure the tray coupling (the 3-arm plastic coupling at the center) is seated in the drive shaft properly.',
        'Inspect the waveguide cover on the interior right wall for burn marks, holes, or detachment. A damaged cover must be replaced before further use.',
      ],
      partsRequired: [
        'Roller ring / turntable ring guide (if wheels are broken)',
        'Glass turntable tray (if cracked)',
        'Mica waveguide cover / microwave safe cover sheet (if burnt)',
      ],
      safetyNotes: [
        '⚠️ Do not operate the microwave with a cracked turntable or damaged waveguide cover.',
      ],
      estimatedCost: '₹150 – ₹600 | $2 – $9 USD',
      professionalNote:
        'Turntable components are universally compatible by size — measure cavity diameter for correct sizing.',
    },

    clicking: {
      severity: 'medium',
      title: 'Defective Door Interlock Microswitches',
      component: 'Door Interlock Microswitch Assembly (Primary / Secondary / Monitor)',
      confidence: 86,
      diagnosis:
        'A clicking or snapping sound when the microwave door is closed, or repeated clicking during operation without consistent heating, indicates one or more door interlock microswitches are worn or misaligned. Modern microwaves have 2–3 interlock switches as a safety mechanism — failure causes erratic operation or blown fuse.',
      diySteps: [
        'Unplug the microwave.',
        'DISCHARGE the HV capacitor as described in the magnetron repair procedure above.',
        'Remove the outer cabinet.',
        'Locate the door latch mechanism — typically a plastic block near the door hinges with 2–3 microswitches.',
        'Each microswitch has two or three terminals and a small lever actuated by the door latch hooks.',
        'Test each switch with a multimeter in continuity mode: the primary switch should be closed (continuity) when the door is shut.',
        'Remove and replace any switch that fails continuity testing. Microswitches for microwaves are standardized (16A 250V lever type).',
        'Ensure the door latch hooks are not cracked or bent — replace the door latch assembly if hooks are damaged.',
        'Reassemble and test with water inside the cavity.',
      ],
      partsRequired: [
        'Door interlock microswitch set (16A 250VAC lever, pack of 3)',
        'Door latch hook assembly (if hooks are broken)',
        '15A or 20A ceramic fuse (replace if it blew due to monitor switch failure)',
      ],
      safetyNotes: [
        '☠️ Discharge the HV capacitor first — same procedure as magnetron work.',
        '🔴 If the monitor switch (third switch) has shorted, it will have blown the fuse. Replace the fuse AND the switch together — never bypass either.',
      ],
      estimatedCost: '₹100 – ₹400 | $1.50 – $6 USD',
      professionalNote:
        'Always replace all three interlock switches as a set — they wear at similar rates.',
    },
  },

  // ═══════════════════════════════════════════════════════
  // DISHWASHER
  // ═══════════════════════════════════════════════════════
  dishwasher: {
    humming: {
      severity: 'medium',
      title: 'Wash Pump Motor Bearing Failure',
      component: 'Main Wash Pump / Circulation Pump Motor',
      confidence: 84,
      diagnosis:
        'A continuous humming with reduced water pressure from the spray arms indicates the wash pump motor bearings are wearing. The impeller may also be clogged with food debris, causing the motor to labor under load.',
      diySteps: [
        'Disconnect power and water supply.',
        'Remove the lower dish rack and the spray arm (twist counter-clockwise to remove).',
        'Remove the filter assembly from the sump — twist the cylindrical filter and lift it out.',
        'Clean all debris from the sump area thoroughly.',
        'Access the pump housing under the sump. Unscrew and remove the pump cover.',
        'Check the impeller for cracked blades, jamming debris, or wobble on the shaft.',
        'If the impeller is clear but the motor still hums, the motor bearings are worn — replace the pump motor assembly.',
      ],
      partsRequired: [
        'Wash pump motor assembly (match to model)',
        'Pump housing gasket/O-ring',
      ],
      safetyNotes: ['⚡ Disconnect power and water before any pump work.'],
      estimatedCost: '₹800 – ₹2,500 | $11 – $36 USD',
      professionalNote:
        'Dishwasher pump replacement varies greatly by brand — Bosch units in particular have complex sump designs that benefit from professional service.',
    },

    rattling: {
      severity: 'low',
      title: 'Loose Spray Arm / Cutlery Contact',
      component: 'Spray Arm Assembly / Dish Rack Loading',
      confidence: 82,
      diagnosis:
        'Rattling during a cycle is most often caused by a loose or cracked spray arm spinning freely and striking dish handles or rack tines, or by cutlery items protruding through the basket and contacting the spray arm.',
      diySteps: [
        'Open the door mid-cycle (paused) and inspect how dishes are loaded.',
        'Ensure no long-handled utensils extend below the lower basket.',
        'Remove and reattach the lower spray arm — it should click firmly onto its center post.',
        'Spin the arm by hand to verify it rotates freely without wobble.',
        'Check the upper spray arm for cracks or blocked water jets (use a toothpick to clear blocked holes).',
      ],
      partsRequired: ['Spray arm (if cracked)', 'Spray arm center post bearing (if worn)'],
      safetyNotes: [],
      estimatedCost: '₹200 – ₹600 | $3 – $9 USD',
      professionalNote: 'Usually a user-serviceable issue resolved by correct dish loading.',
    },
  },

  // ═══════════════════════════════════════════════════════
  // DRYER
  // ═══════════════════════════════════════════════════════
  dryer: {
    squealing: {
      severity: 'medium',
      title: 'Drum Felt Seal / Idler Pulley Wear',
      component: 'Drum Support Felt Seal / Idler Pulley Bearing',
      confidence: 87,
      diagnosis:
        'High-pitched squealing from a dryer during tumbling is almost always caused by a worn drum support felt seal rubbing on the drum surface, or a worn idler pulley bearing creating a squealing rotation sound. Both are consumable items that wear over time.',
      diySteps: [
        'Unplug the dryer. Remove the back panel or front panel depending on model.',
        'Release the drive belt tension from the idler pulley.',
        'Spin the idler pulley by hand — rough, gritty, or squealing rotation confirms bearing failure.',
        'Inspect the drum front and rear felt seals — if they have worn through to bare metal backing, replace them.',
        'Order a dryer maintenance kit for your model — these typically include the belt, felt seals, and idler pulley as a set.',
        'Install all components from the kit, reassemble, and run a short cycle.',
      ],
      partsRequired: ['Dryer maintenance kit (belt + idler pulley + drum felt seals)'],
      safetyNotes: ['⚡ Disconnect power before opening the cabinet.'],
      estimatedCost: '₹600 – ₹1,500 | $9 – $22 USD',
      professionalNote: 'Dryer maintenance kits are cost-effective and extend appliance life significantly.',
    },

    thumping: {
      severity: 'medium',
      title: 'Worn Drum Support Rollers',
      component: 'Rear Drum Support Rollers',
      confidence: 85,
      diagnosis:
        'Rhythmic thumping from a dryer — one thump per drum revolution — indicates flat spots or worn axle bearings on the drum support rollers. These rollers hold the rear of the drum and allow it to tumble smoothly.',
      diySteps: [
        'Unplug the dryer and access the drum by removing the front or rear panel.',
        'The drum rests on two or four rollers mounted on a rear bulkhead or front support.',
        'Remove the drive belt and lift the drum out of the cabinet.',
        'Spin each roller by hand — wobble, flat spots, or grinding indicate roller/axle failure.',
        'Remove the roller mounting screws and swap in new rollers. Apply a drop of machine oil to the axle.',
        'Reinstall drum and belt. Test run.',
      ],
      partsRequired: ['Drum support roller set (2 or 4 depending on model)'],
      safetyNotes: ['⚡ Disconnect power.'],
      estimatedCost: '₹400 – ₹900 | $6 – $13 USD',
      professionalNote:
        'Replace all rollers as a set even if only one is visibly worn — the others will fail shortly after.',
    },
  },
}

// ─── FALLBACK DIAGNOSIS ──────────────────────────────────────────────────────
export const FALLBACK_DIAGNOSIS = {
  severity: 'low',
  title: 'Acoustic Pattern Unclassified',
  component: 'General System — Requires Manual Inspection',
  confidence: 42,
  diagnosis:
    'The recorded acoustic signature did not match any entries in the AeroPulse failure database for this appliance configuration. This may be due to a novel fault combination, unusual operating conditions, or an acoustic signature that falls outside the current training set. A general inspection is recommended.',
  diySteps: [
    'Ensure the appliance is operating under normal load conditions (avoid overloading or running empty).',
    'Check and clean all accessible filters, vents, and drain paths — many noise issues stem from partial blockages.',
    'Inspect all visible fasteners, panels, and housing clips for looseness.',
    'Listen carefully to narrow down the sound source: is it mechanical (metal-on-metal), electrical (hum/buzz), or air-related (whistle/rush)?',
    'Photograph any visible damage, burn marks, or unusual wear patterns.',
    'Consult the appliance\'s user manual troubleshooting section.',
    'Contact the manufacturer\'s service helpline with the model number and a video recording of the noise.',
  ],
  partsRequired: ['No specific parts identified — professional diagnostic required'],
  safetyNotes: [
    '⚡ Always disconnect power before opening any appliance panel.',
    '🔧 If the appliance is under warranty, do not open it — contact the manufacturer directly.',
  ],
  estimatedCost: 'Diagnosis cost: ₹300 – ₹800 service visit | $5 – $12 USD',
  professionalNote:
    'For unclassified faults, a professional diagnostic visit is recommended. A technician can use measurement instruments (clamp meters, refrigerant gauges, motor analyzers) to pinpoint faults that acoustic analysis alone cannot isolate.',
}
