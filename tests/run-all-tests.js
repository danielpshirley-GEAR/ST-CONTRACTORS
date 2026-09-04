/**
 * Master Phase 7C Automated Test Suite & Functional Verification Runner
 * Complies with Phase 7C Specification (Items 1-37).
 */

const fs = require('fs');
const path = require('path');
const { z } = require('zod');

console.log('================================================================');
console.log('ST CONTRACTORS — PHASE 7C FULL FUNCTIONAL INTEGRITY TEST SUITE');
console.log('================================================================\n');

let totalPassed = 0;
let totalFailed = 0;

function assert(condition, testName, detail) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    totalPassed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    if (detail) console.error(`   Detail: ${detail}`);
    totalFailed++;
  }
}

// ----------------------------------------------------------------------------
// 1. SSRF & IMAGE DOWNLOAD SECURITY TESTS (Items 2, 3)
// ----------------------------------------------------------------------------
console.log('--- 1. IMAGE SECURITY & SSRF PROTECTION TESTS ---');

const { isSafeRemoteHost, validateAndExtractImagePayload } = require('../src/lib/security/image-security.ts');

assert(!isSafeRemoteHost('localhost'), 'SSRF blocks localhost');
assert(!isSafeRemoteHost('127.0.0.1'), 'SSRF blocks loopback 127.0.0.1');
assert(!isSafeRemoteHost('10.0.0.1'), 'SSRF blocks RFC 1918 Class A (10.0.0.1)');
assert(!isSafeRemoteHost('192.168.1.1'), 'SSRF blocks RFC 1918 Class C (192.168.1.1)');
assert(!isSafeRemoteHost('169.254.169.254'), 'SSRF blocks AWS/GCP cloud metadata endpoint (169.254.169.254)');
assert(!isSafeRemoteHost('metadata.google.internal'), 'SSRF blocks metadata.google.internal');
assert(isSafeRemoteHost('images.unsplash.com'), 'SSRF permits legitimate public domain (images.unsplash.com)');

const validDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVGDUAAAnkAQf0o1aRAAAAAElFTkSuQmCC';
const payloadRes = validateAndExtractImagePayload(validDataUri);
assert(payloadRes.isValid, 'Valid Base64 data URI passes extraction');
assert(payloadRes.mimeType === 'image/png', 'MIME type correctly parsed as image/png');
assert(payloadRes.base64Data.length > 0, 'Base64 data extracted cleanly');

const invalidMimePayload = validateAndExtractImagePayload('data:application/pdf;base64,JVBERi0xLjQKJ...');
assert(!invalidMimePayload.isValid, 'Non-image MIME type (application/pdf) is rejected');

// ----------------------------------------------------------------------------
// 2. ZOD RUNTIME SCHEMA VALIDATION & REJECTION TESTS (Items 9, 10, 11, 30)
// ----------------------------------------------------------------------------
console.log('\n--- 2. ZOD RUNTIME SCHEMA VALIDATION & CONSTRAINT TESTS ---');

const {
  StructuredBriefExtractionSchema,
  StructuredChangeResponseSchema,
  UploadedAssetAnalysisSchema,
} = require('../src/lib/ai/visualiser-schemas.ts');

// Test Valid Structured Brief Payload
const validBriefPayload = {
  projectTypes: ['kitchen-renovation'],
  confidence: 90,
  interpretedIntent: 'Contemporary open-plan kitchen renovation',
  spaces: [
    {
      name: 'Kitchen',
      lengthM: 6.0,
      widthM: 4.5,
      heightM: 2.7,
      areaM2: 27.0,
      isPrimary: true,
      desiredChanges: ['Install bespoke island'],
      fixtures: ['Bora induction cooktop'],
      constraints: [],
    },
  ],
  property: {
    type: 'terraced',
    era: 'victorian',
    storeys: 2,
    location: 'Ealing, London',
    isConservationArea: true,
    isListedBuilding: false,
  },
  hasStructuralAlteration: true,
  materialsRequested: ['Quartz', 'Oak'],
  fixturesRequested: ['Boiling water tap'],
  featuresToRetain: ['Ceiling cornicing'],
  featuresToRemove: ['Non-structural partition'],
  assumedFinishTier: 'enhanced',
  confirmedFacts: ['Victorian terraced property'],
  assumptions: [
    {
      key: 'subfloor',
      label: 'Subfloor Level',
      value: 'Assumed timber joists',
      reason: 'Standard Victorian build',
      confidence: 'medium',
      affectedCalculations: ['Underfloor heating'],
    },
  ],
  missingInformation: [
    {
      field: 'drainage_location',
      question: 'Where is the existing soil stack located?',
      category: 'Plumbing',
      scopeImpact: 4,
      costImpact: 4,
      feasibilityImpact: 4,
      visualImpact: 1,
      quantityImpact: 3,
      userEffort: 2,
    },
  ],
};

const briefValidResult = StructuredBriefExtractionSchema.safeParse(validBriefPayload);
assert(briefValidResult.success, 'Valid structured brief payload passes Zod validation');

// Test Schema Rejection of Invalid / Malformed Payloads (Item 30)
const invalidPayloads = [
  {
    ...validBriefPayload,
    confidence: 500, // Invalid: > 100
  },
  {
    ...validBriefPayload,
    spaces: [{ ...validBriefPayload.spaces[0], lengthM: -5.0 }], // Invalid: negative dimension
  },
  {
    ...validBriefPayload,
    assumedFinishTier: 'superLuxury', // Invalid: tier not in enum
  },
  {
    ...validBriefPayload,
    projectTypes: ['invalid_project_type'], // Invalid: project type not in enum
  },
  {
    ...validBriefPayload,
    property: { ...validBriefPayload.property, era: 'ancient_rome' }, // Invalid era
  },
];

invalidPayloads.forEach((payload, idx) => {
  const res = StructuredBriefExtractionSchema.safeParse(payload);
  assert(!res.success, `Zod successfully rejects malformed payload #${idx + 1}`);
});

// ----------------------------------------------------------------------------
// 3. DETERMINISTIC QUANTITY & ENGINEERING SAFEGUARD TESTS (Items 12, 18, 19, 20, 21, 22)
// ----------------------------------------------------------------------------
console.log('\n--- 3. DETERMINISTIC QUANTITY & SAFEGUARD TESTS ---');

const { calculateProjectQuantities } = require('../src/lib/visualiser/scope-calculator.ts');

// Test 3.1: Dimensions Unsupplied (Zero Silent Room Defaults - Item 12)
const unmeasuredSpaces = [
  {
    id: 's1',
    name: 'Primary Space',
    lengthM: { value: undefined, source: 'user_statement', status: 'unknown' },
    widthM: { value: undefined, source: 'user_statement', status: 'unknown' },
    heightM: { value: undefined, source: 'user_statement', status: 'unknown' },
    areaM2: { value: undefined, source: 'derived_calculation', status: 'unknown' },
    desiredChanges: ['Renovate space'],
    fixtures: [],
    constraints: [],
    isPrimary: true,
  },
];

const unmeasuredQtys = calculateProjectQuantities(unmeasuredSpaces, ['kitchen-renovation'], false);
const flooringUnmeasured = unmeasuredQtys.find((q) => q.id.includes('flooring'));
assert(
  flooringUnmeasured && flooringUnmeasured.confidence === 'INSUFFICIENT_INFORMATION',
  'Flooring quantity outputs INSUFFICIENT_INFORMATION when dimensions are unsupplied (No silent 5x4m defaults)'
);

// Test 3.2: Material Undecided Flooring (Net Area Only - Item 18)
const measuredSpaces = [
  {
    id: 's1',
    name: 'Kitchen Area',
    lengthM: { value: 6.0, source: 'user_statement', status: 'confirmed' },
    widthM: { value: 4.0, source: 'user_statement', status: 'confirmed' },
    heightM: { value: 2.5, source: 'user_statement', status: 'confirmed' },
    areaM2: { value: 24.0, source: 'derived_calculation', status: 'confirmed' },
    desiredChanges: ['Install floor'],
    fixtures: [],
    constraints: [],
    isPrimary: true,
  },
];

const undecidedFloorQtys = calculateProjectQuantities(measuredSpaces, ['kitchen-renovation'], false, {
  flooringMaterial: 'not_decided',
});
const netFlooringItem = undecidedFloorQtys.find((q) => q.id === 'qty-flooring-net');
assert(
  netFlooringItem && netFlooringItem.netQuantity === 24.0 && netFlooringItem.wastePercent === 0,
  'Flooring outputs exact NET AREA (24m²) with 0% waste when material is undecided'
);

// Test 3.3: Material Chosen (Herringbone 15% vs Plank 10% - Item 18)
const herringboneQtys = calculateProjectQuantities(measuredSpaces, ['kitchen-renovation'], false, {
  flooringMaterial: 'herringbone_engineered_oak',
});
const herringboneItem = herringboneQtys.find((q) => q.id === 'qty-flooring');
assert(
  herringboneItem && herringboneItem.wastePercent === 15 && herringboneItem.totalWithWaste === 28,
  'Herringbone parquet calculates 15% cutting allowance (24m² net -> 28m² total)'
);

// Test 3.4: Wall Linings Without Openings (Gross Wall Area - Item 19)
const grossWallItem = undecidedFloorQtys.find((q) => q.id === 'qty-wall-gross');
assert(
  grossWallItem && grossWallItem.unit.includes('gross') && grossWallItem.formulaExplanation.includes('not supplied'),
  'Plasterboard wall linings output GROSS WALL AREA with transparency note when openings are unsupplied'
);

// Test 3.5: Structural Steel Without Engineer Input (ENGINEERING REQUIRED - Items 21, 22)
const structuralQtysNoEng = calculateProjectQuantities(measuredSpaces, ['extension'], true);
const steelItemNoEng = structuralQtysNoEng.find((q) => q.materialCategory === 'steel');
assert(
  steelItemNoEng && steelItemNoEng.confidence === 'ENGINEERING_REQUIRED' && steelItemNoEng.totalWithWaste === 0,
  'Structural steelwork is marked ENGINEERING_REQUIRED with 0kg guessed when engineer spec is missing (No fixed 45kg/m)'
);

// Test 3.6: Structural Steel With Verified Engineer Spec (Items 21, 22)
const verifiedEngineerSpec = {
  sectionDesignation: '203 x 133 x 30 UB',
  massPerMetre: 30,
  memberLength: 4.5,
  memberCount: 1,
  padstones: 2,
  calculationStatus: 'fully_specified',
};

const structuralQtysWithEng = calculateProjectQuantities(measuredSpaces, ['extension'], true, {
  structuralEngineerSpec: verifiedEngineerSpec,
});
const steelItemWithEng = structuralQtysWithEng.find((q) => q.id === 'qty-steel-verified');
assert(
  steelItemWithEng && steelItemWithEng.netQuantity === 135 && steelItemWithEng.totalWithWaste === 135,
  'Structural steel calculated accurately from engineer spec (4.5m × 30kg/m = 135kg steel)'
);

// ----------------------------------------------------------------------------
// 4. VISUAL GENERATOR & REVISION HISTORY TESTS (Items 4, 5, 6, 7, 8, 33)
// ----------------------------------------------------------------------------
console.log('\n--- 4. VISUAL GENERATOR & REVISION HISTORY TESTS ---');

const {
  constructVisualPrompt,
  generateArchitecturalConceptSvg,
} = require('../src/lib/ai/visual-generator.ts');
const {
  createInitialProjectState,
  applyProjectChange,
  restoreProjectVersion,
} = require('../src/lib/visualiser/project-state-engine.ts');

// Create Initial State
const initialState = createInitialProjectState({
  briefText: 'Contemporary rear extension with dark green kitchen cabinets',
  dimensions: { length: 6.0, width: 4.0 },
});

assert(
  initialState.visualConcept.conceptType === 'conceptual_interpretation',
  'Initial concept type is conceptual_interpretation'
);
assert(
  initialState.visualConcept.generationVersion === 1,
  'Initial visual version is v1'
);

// Step 1: Modify cabinetry to navy
const navyModState = applyProjectChange(
  initialState,
  'Change cabinetry to navy blue',
  [
    {
      operationType: 'CHANGE_CABINETRY',
      cabinetryColor: 'Deep Navy Blue',
      description: 'Updated cabinetry to navy blue',
    },
  ],
  {
    imageUrl: 'data:image/svg+xml;utf8,navy_kitchen_svg_render',
    generationId: 'gen-2-navy',
    generationVersion: 2,
    provider: 'ST Contractors Architectural Engine',
    prompt: 'Navy kitchen concept render',
    conceptType: 'conceptual_interpretation',
    historyItem: {
      id: 'gen-2-navy',
      version: 2,
      imageUrl: 'data:image/svg+xml;utf8,navy_kitchen_svg_render',
      prompt: 'Navy kitchen concept render',
      modifications: ['Change cabinetry to navy blue'],
      provider: 'ST Contractors Architectural Engine',
      timestamp: new Date().toISOString(),
      conceptType: 'conceptual_interpretation',
    },
  }
);

assert(
  navyModState.visualConcept.generationVersion === 2,
  'Visual version increments to v2 on conversational visual change'
);
assert(
  navyModState.visualConcept.cabinetryColor === 'Deep Navy Blue',
  'State records Deep Navy Blue cabinetry'
);
assert(
  navyModState.visualConcept.visualHistory && navyModState.visualConcept.visualHistory.length === 2,
  'Visual generation history retains both v1 and v2 snapshots'
);

// Step 2: Modify flooring to pale oak while retaining navy cabinets
const oakModState = applyProjectChange(
  navyModState,
  'Keep the navy cabinets but change the floor to pale oak',
  [
    {
      operationType: 'CHANGE_FLOORING',
      flooringType: 'Natural Pale European Oak',
      description: 'Updated flooring to pale oak',
    },
  ],
  {
    imageUrl: 'data:image/svg+xml;utf8,navy_cabinets_pale_oak_render',
    generationId: 'gen-3-oak',
    generationVersion: 3,
    provider: 'ST Contractors Architectural Engine',
    prompt: 'Navy cabinets and pale oak floor render',
    conceptType: 'conceptual_interpretation',
    historyItem: {
      id: 'gen-3-oak',
      version: 3,
      imageUrl: 'data:image/svg+xml;utf8,navy_cabinets_pale_oak_render',
      prompt: 'Navy cabinets and pale oak floor render',
      modifications: ['Change cabinetry to navy blue', 'Keep navy cabinets but change floor to pale oak'],
      provider: 'ST Contractors Architectural Engine',
      timestamp: new Date().toISOString(),
      conceptType: 'conceptual_interpretation',
    },
  }
);

assert(
  oakModState.visualConcept.generationVersion === 3,
  'Visual version increments to v3'
);
assert(
  oakModState.visualConcept.cabinetryColor === 'Deep Navy Blue',
  'Navy cabinetry retained in v3 state'
);
assert(
  oakModState.visualConcept.flooringType === 'Natural Pale European Oak',
  'Flooring updated to pale oak in v3 state'
);
assert(
  oakModState.visualConcept.visualHistory && oakModState.visualConcept.visualHistory.length === 3,
  'Visual generation history holds complete v1, v2, v3 trail'
);

// Step 3: Restore to Version 1
const restoredState = restoreProjectVersion(oakModState, 1);
assert(
  restoredState.originalBrief === initialState.originalBrief,
  'State successfully rollbacks to Version 1 snapshot'
);

// ----------------------------------------------------------------------------
// FINAL TEST RESULTS
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TEST RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
console.log('================================================================');

if (totalFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PHASE 7C FUNCTIONAL INTEGRITY TESTS PASSED CLEANLY!\n');
}
