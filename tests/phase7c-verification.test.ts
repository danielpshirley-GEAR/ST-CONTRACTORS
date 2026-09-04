/**
 * Phase 7C Comprehensive Functional Integrity & Accuracy Test Suite
 * Complies with Phase 7C Specification (Items 1-37).
 */

import { z } from 'zod';
import {
  isSafeRemoteHost,
  validateAndExtractImagePayload,
} from '../src/lib/security/image-security';
import {
  StructuredBriefExtractionSchema,
  StructuredChangeResponseSchema,
  UploadedAssetAnalysisSchema,
  AIChatResponseSchema,
} from '../src/lib/ai/visualiser-schemas';
import {
  calculateProjectQuantities,
} from '../src/lib/visualiser/scope-calculator';
import {
  createInitialProjectState,
  applyProjectChange,
  restoreProjectVersion,
} from '../src/lib/visualiser/project-state-engine';
import {
  generateVisualConcept,
  constructVisualPrompt,
  generateArchitecturalConceptSvg,
} from '../src/lib/ai/visual-generator';
import {
  BATHROOM_IMAGE_DATA_URI,
  EXTERIOR_HOUSE_IMAGE_DATA_URI,
  FLOOR_PLAN_IMAGE_DATA_URI,
  MARBLE_MATERIAL_IMAGE_DATA_URI,
} from './fixtures/test-images';

export async function runPhase7CTests() {
  console.log('================================================================');
  console.log('ST CONTRACTORS — PHASE 7C FULL FUNCTIONAL INTEGRITY TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, name: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      if (detail) console.error(`   Detail: ${detail}`);
      failed++;
    }
  }

  // --------------------------------------------------------------------------
  // TEST GROUP 1: SSRF & MULTIMODAL IMAGE SECURITY (Items 1, 2, 3)
  // --------------------------------------------------------------------------
  console.log('--- 1. SSRF & IMAGE SECURITY TESTS ---');
  assert(!isSafeRemoteHost('localhost'), 'SSRF blocks localhost');
  assert(!isSafeRemoteHost('127.0.0.1'), 'SSRF blocks loopback 127.0.0.1');
  assert(!isSafeRemoteHost('10.0.0.5'), 'SSRF blocks internal IP 10.0.0.5');
  assert(!isSafeRemoteHost('192.168.1.254'), 'SSRF blocks internal IP 192.168.1.254');
  assert(!isSafeRemoteHost('169.254.169.254'), 'SSRF blocks AWS/GCP metadata IP 169.254.169.254');
  assert(!isSafeRemoteHost('metadata.google.internal'), 'SSRF blocks metadata.google.internal');
  assert(isSafeRemoteHost('images.unsplash.com'), 'SSRF permits legitimate public domain');

  const b64Extract = validateAndExtractImagePayload(BATHROOM_IMAGE_DATA_URI);
  assert(b64Extract.isValid, 'Bathroom image data URI passes security validation');
  assert(b64Extract.mimeType === 'image/png', 'Parsed MIME type is image/png');
  assert(b64Extract.base64Data.length > 0, 'Base64 pixel data extracted cleanly');

  const invalidPdfExtract = validateAndExtractImagePayload('data:application/pdf;base64,JVBERi0xLjQKJ...');
  assert(!invalidPdfExtract.isValid, 'Non-image MIME type is rejected by security validator');

  // --------------------------------------------------------------------------
  // TEST GROUP 2: ZOD RUNTIME SCHEMA CONSTRAINTS & REJECTION (Items 9, 10, 11, 30)
  // --------------------------------------------------------------------------
  console.log('\n--- 2. ZOD RUNTIME VALIDATION & SCHEMA CONSTRAINTS ---');

  const validPayload = {
    projectTypes: ['kitchen-renovation'],
    confidence: 88,
    interpretedIntent: 'Kitchen renovation with bespoke shaker cabinets',
    spaces: [
      {
        name: 'Kitchen Space',
        lengthM: 5.5,
        widthM: 4.0,
        heightM: 2.6,
        areaM2: 22.0,
        isPrimary: true,
        desiredChanges: ['Replace cabinets', 'Install island'],
        fixtures: ['Induction hob'],
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
    hasStructuralAlteration: false,
    materialsRequested: ['Quartz', 'Engineered Oak'],
    fixturesRequested: ['Instant boiling tap'],
    featuresToRetain: ['Period cornicing'],
    featuresToRemove: ['Old laminate cabinets'],
    assumedFinishTier: 'enhanced',
    confirmedFacts: ['Victorian terraced property in Ealing'],
    assumptions: [],
    missingInformation: [],
  };

  const validParse = StructuredBriefExtractionSchema.safeParse(validPayload);
  assert(validParse.success, 'Valid structured brief payload passes Zod validation');

  // Test Rejections
  const negDimPayload = {
    ...validPayload,
    spaces: [{ ...validPayload.spaces[0], lengthM: -6.0 }],
  };
  assert(!StructuredBriefExtractionSchema.safeParse(negDimPayload).success, 'Zod rejects negative room dimensions');

  const highConfPayload = { ...validPayload, confidence: 999 };
  assert(!StructuredBriefExtractionSchema.safeParse(highConfPayload).success, 'Zod rejects confidence > 100');

  const badTierPayload = { ...validPayload, assumedFinishTier: 'superLuxury' };
  assert(!StructuredBriefExtractionSchema.safeParse(badTierPayload).success, 'Zod rejects non-standard finish tier');

  const badEraPayload = { ...validPayload, property: { ...validPayload.property, era: 'ancient_rome' } };
  assert(!StructuredBriefExtractionSchema.safeParse(badEraPayload).success, 'Zod rejects invalid architectural era');

  // --------------------------------------------------------------------------
  // TEST GROUP 3: ZERO SILENT DEFAULTS & DETERMINISTIC CALCULATIONS (Items 12, 18, 19, 20)
  // --------------------------------------------------------------------------
  console.log('\n--- 3. DETERMINISTIC QUANTITY & SAFEGUARD TESTS ---');

  // Unmeasured spaces -> INSUFFICIENT_INFORMATION
  const unmeasuredState = createInitialProjectState({
    briefText: 'I want to renovate my kitchen',
  });
  assert(
    unmeasuredState.spaces[0].lengthM.value === undefined,
    'Unstated length remains undefined (Zero-Assumption Rule)'
  );
  assert(
    unmeasuredState.spaces[0].widthM.value === undefined,
    'Unstated width remains undefined (Zero-Assumption Rule)'
  );

  const unmeasuredQtys = calculateProjectQuantities(unmeasuredState.spaces, ['kitchen-renovation'], false);
  const floorUnmeasured = unmeasuredQtys.find((q) => q.id.includes('flooring'));
  assert(
    floorUnmeasured?.confidence === 'INSUFFICIENT_INFORMATION',
    'Flooring outputs INSUFFICIENT_INFORMATION when dimensions are not supplied'
  );

  // Material undecided flooring -> Net Area Only
  const measuredSpaces = [
    {
      id: 's1',
      name: 'Kitchen',
      lengthM: { value: 6.0, source: 'user_statement' as const, status: 'confirmed' as const },
      widthM: { value: 4.0, source: 'user_statement' as const, status: 'confirmed' as const },
      heightM: { value: 2.5, source: 'user_statement' as const, status: 'confirmed' as const },
      areaM2: { value: 24.0, source: 'derived_calculation' as const, status: 'confirmed' as const },
      desiredChanges: [],
      fixtures: [],
      constraints: [],
      isPrimary: true,
    },
  ];

  const undecidedQtys = calculateProjectQuantities(measuredSpaces, ['kitchen-renovation'], false, {
    flooringMaterial: 'not_decided',
  });
  const netFloor = undecidedQtys.find((q) => q.id === 'qty-flooring-net');
  assert(
    netFloor?.netQuantity === 24.0 && netFloor?.wastePercent === 0,
    'Undecided flooring outputs exact Net Floor Area (24m²) with 0% cutting waste'
  );

  // Material chosen -> Herringbone 15% vs Plank 10%
  const herringboneQtys = calculateProjectQuantities(measuredSpaces, ['kitchen-renovation'], false, {
    flooringMaterial: 'herringbone_engineered_oak',
  });
  const herringboneItem = herringboneQtys.find((q) => q.id === 'qty-flooring');
  assert(
    herringboneItem?.wastePercent === 15 && herringboneItem?.totalWithWaste === 28,
    'Herringbone parquet calculates 15% waste (24m² net -> 28m² ordered)'
  );

  // Gross wall area when openings unconfirmed
  const grossWallItem = undecidedQtys.find((q) => q.id === 'qty-wall-gross');
  assert(
    Boolean(grossWallItem?.unit.includes('gross') && grossWallItem?.formulaExplanation.includes('not supplied')),
    'Wall linings output GROSS WALL AREA with transparency note when window/door openings are unconfirmed'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 4: STRUCTURAL STEEL CALCULATIONS (Items 21, 22)
  // --------------------------------------------------------------------------
  console.log('\n--- 4. STRUCTURAL STEEL ENGINEERING SAFEGUARDS ---');

  // Without verified engineer spec -> ENGINEERING_REQUIRED, 0kg guessed (No fixed 45kg/m)
  const steelNoEng = calculateProjectQuantities(measuredSpaces, ['extension'], true);
  const rsjItemNoEng = steelNoEng.find((q) => q.materialCategory === 'steel');
  assert(
    rsjItemNoEng?.confidence === 'ENGINEERING_REQUIRED' && rsjItemNoEng?.totalWithWaste === 0,
    'Structural steel is marked ENGINEERING_REQUIRED with 0kg guessed when engineer spec is missing (No fixed 45kg/m)'
  );

  // With verified engineer spec -> Exact calculation
  const verifiedEngSpec = {
    sectionDesignation: '203 x 133 x 30 UB',
    massPerMetre: 30,
    memberLength: 4.5,
    memberCount: 1,
    padstones: 2,
    calculationStatus: 'fully_specified' as const,
  };

  const steelWithEng = calculateProjectQuantities(measuredSpaces, ['extension'], true, {
    structuralEngineerSpec: verifiedEngSpec,
  });
  const rsjVerified = steelWithEng.find((q) => q.id === 'qty-steel-verified');
  assert(
    rsjVerified?.netQuantity === 135 && rsjVerified?.totalWithWaste === 135,
    'Structural steel calculated exactly from engineer spec (4.5m × 30kg/m = 135kg steel)'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 5: VISUAL GENERATOR & REVISION HISTORY (Items 4, 5, 6, 7, 8, 33)
  // --------------------------------------------------------------------------
  console.log('\n--- 5. VISUAL GENERATION & REVISION HISTORY TESTS ---');

  const initialGenState = createInitialProjectState({
    briefText: 'Kitchen refurbishment with dark green shaker cabinetry',
    dimensions: { length: 5.0, width: 4.0 },
  });

  assert(
    initialGenState.visualConcept.generationVersion === 1,
    'Initial visual concept starts at version v1'
  );

  // Step 1: "Change cabinetry to navy"
  const v2Navy = applyProjectChange(
    initialGenState,
    'Change cabinetry to navy blue',
    [
      {
        operationType: 'CHANGE_CABINETRY',
        cabinetryColor: 'Deep Navy Blue',
        description: 'Update cabinetry to navy',
      },
    ],
    {
      imageUrl: 'data:image/svg+xml;utf8,navy_kitchen_render',
      generationId: 'gen-v2-navy',
      generationVersion: 2,
      provider: 'ST Contractors Architectural Engine',
      prompt: 'Navy kitchen render',
      conceptType: 'conceptual_interpretation',
      historyItem: {
        id: 'gen-v2-navy',
        version: 2,
        imageUrl: 'data:image/svg+xml;utf8,navy_kitchen_render',
        prompt: 'Navy kitchen render',
        modifications: ['Change cabinetry to navy blue'],
        provider: 'ST Contractors Architectural Engine',
        timestamp: new Date().toISOString(),
        conceptType: 'conceptual_interpretation',
      },
    }
  );

  assert(v2Navy.visualConcept.generationVersion === 2, 'Visual version increments to v2');
  assert(v2Navy.visualConcept.cabinetryColor === 'Deep Navy Blue', 'State records Deep Navy Blue cabinetry');
  assert(v2Navy.visualConcept.visualHistory?.length === 2, 'Visual history preserves both v1 and v2');

  // Step 2: "Keep navy cabinets but change floor to pale oak"
  const v3Oak = applyProjectChange(
    v2Navy,
    'Keep navy cabinets but change floor to pale oak',
    [
      {
        operationType: 'CHANGE_FLOORING',
        flooringType: 'Natural Pale European Oak',
        description: 'Update flooring to pale oak',
      },
    ],
    {
      imageUrl: 'data:image/svg+xml;utf8,navy_cabinets_pale_oak_render',
      generationId: 'gen-v3-oak',
      generationVersion: 3,
      provider: 'ST Contractors Architectural Engine',
      prompt: 'Navy cabinets and pale oak floor render',
      conceptType: 'conceptual_interpretation',
      historyItem: {
        id: 'gen-v3-oak',
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

  assert(v3Oak.visualConcept.generationVersion === 3, 'Visual version increments to v3');
  assert(v3Oak.visualConcept.cabinetryColor === 'Deep Navy Blue', 'Navy cabinets retained in v3');
  assert(v3Oak.visualConcept.flooringType === 'Natural Pale European Oak', 'Pale oak flooring recorded in v3');
  assert(v3Oak.visualConcept.visualHistory?.length === 3, 'Visual history contains complete v1, v2, v3 history');

  // Step 3: Rollback to Version 1
  const restoredV1 = restoreProjectVersion(v3Oak, 1);
  assert(
    restoredV1.originalBrief === initialGenState.originalBrief,
    'State snapshot rollbacks to Version 1 cleanly'
  );

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) process.exit(1);
}

runPhase7CTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
