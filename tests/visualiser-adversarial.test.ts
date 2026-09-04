/**
 * Automated Adversarial Test Suite for AI Project Design & Scope Builder
 * Complies with Phase 7B Specification (Items 37, 38, 39, 40, 41).
 */

import {
  extractBriefDeterministically,
  interpretHomeownerBriefWithAI,
} from '../src/lib/ai/visualiser-ai';
import {
  calculateProjectQuantities,
} from '../src/lib/visualiser/scope-calculator';
import {
  createInitialProjectState,
  applyProjectChange,
  restoreProjectVersion,
} from '../src/lib/visualiser/project-state-engine';

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING VISUALISER ADVERSARIAL & REGRESSION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      if (detail) console.error(`   Detail: ${detail}`);
      failed++;
    }
  }

  // --------------------------------------------------------------------------
  // TEST 1: Adversarial Brief — Baby's Bedroom Decorating
  // --------------------------------------------------------------------------
  const t1 = extractBriefDeterministically({
    briefText: "I want to decorate my baby's bedroom.",
  });
  assert(
    t1.projectTypes.includes('bedroom') || t1.projectTypes.includes('decorating'),
    'Baby bedroom brief classified as bedroom/decorating',
    `Classified as: ${JSON.stringify(t1.projectTypes)}`
  );
  assert(
    !t1.projectTypes.includes('kitchen-renovation'),
    'Baby bedroom brief does NOT fall back to kitchen renovation'
  );

  // --------------------------------------------------------------------------
  // TEST 2: Adversarial Brief — Driveway Paving
  // --------------------------------------------------------------------------
  const t2 = extractBriefDeterministically({
    briefText: 'I want to replace my driveway with block paving.',
  });
  assert(
    t2.projectTypes.includes('driveway'),
    'Driveway brief correctly classified as driveway',
    `Classified as: ${JSON.stringify(t2.projectTypes)}`
  );
  assert(
    !t2.projectTypes.includes('kitchen-renovation') && !t2.projectTypes.includes('extension'),
    'Driveway brief has no kitchen or extension contamination'
  );

  // --------------------------------------------------------------------------
  // TEST 3: Adversarial Brief — Fitted Wardrobes
  // --------------------------------------------------------------------------
  const t3 = extractBriefDeterministically({
    briefText: 'I want to build some fitted wardrobes in the master bedroom.',
  });
  assert(
    t3.projectTypes.includes('joinery'),
    'Fitted wardrobes classified as joinery',
    `Classified as: ${JSON.stringify(t3.projectTypes)}`
  );
  assert(
    !t3.projectTypes.includes('extension'),
    'Fitted wardrobes does not inject extension'
  );

  // --------------------------------------------------------------------------
  // TEST 4: Adversarial Brief — Vague Living Room Makeover
  // --------------------------------------------------------------------------
  const t4 = extractBriefDeterministically({
    briefText: 'I want to make my living room nicer.',
  });
  assert(
    t4.projectTypes.includes('living-room') || t4.projectTypes.includes('unknown'),
    'Vague brief classified as living-room or unknown with follow-up clarification',
    `Classified as: ${JSON.stringify(t4.projectTypes)}`
  );
  assert(
    !t4.projectTypes.includes('kitchen-renovation'),
    'Vague brief does NOT invent a kitchen renovation'
  );

  // --------------------------------------------------------------------------
  // TEST 5: Adversarial Brief — Front Door Replacement
  // --------------------------------------------------------------------------
  const t5 = extractBriefDeterministically({
    briefText: 'I want a new front door.',
  });
  assert(
    t5.projectTypes.includes('door-replacement'),
    'Front door replacement classified as door-replacement',
    `Classified as: ${JSON.stringify(t5.projectTypes)}`
  );

  // --------------------------------------------------------------------------
  // TEST 6: Structural Steel Safeguard (Item 19)
  // --------------------------------------------------------------------------
  const extState = createInitialProjectState({
    briefText: 'Rear extension with 4m knockthrough and bifold doors',
    dimensions: { length: 5.0, width: 4.0 },
  });
  const steelQty = extState.calculatedQuantities.find((q) => q.materialCategory === 'steel');
  assert(
    steelQty?.confidence === 'ENGINEERING_REQUIRED',
    'Unengineered structural opening returns confidence ENGINEERING_REQUIRED',
    `Got confidence: ${steelQty?.confidence}`
  );
  assert(
    steelQty?.totalWithWaste === 0,
    'Unengineered steel does not guess fake tonnage without engineer calculations'
  );

  // --------------------------------------------------------------------------
  // TEST 7: Foundation Concrete Safeguard (Item 20)
  // --------------------------------------------------------------------------
  const foundationQty = extState.calculatedQuantities.find((q) => q.materialCategory === 'concrete');
  assert(
    foundationQty?.confidence === 'ENGINEERING_REQUIRED',
    'Foundation concrete volume returns ENGINEERING_REQUIRED / PRELIMINARY RANGE',
    `Got confidence: ${foundationQty?.confidence}`
  );

  // --------------------------------------------------------------------------
  // TEST 8: Flooring Material-Specific Waste Factors (Item 21)
  // --------------------------------------------------------------------------
  const standardPlankQty = calculateProjectQuantities(
    extState.spaces,
    extState.projectTypes,
    false,
    { flooringMaterial: 'straight_plank' }
  ).find((q) => q.id === 'qty-flooring');

  const herringboneQty = calculateProjectQuantities(
    extState.spaces,
    extState.projectTypes,
    false,
    { flooringMaterial: 'herringbone_engineered_oak' }
  ).find((q) => q.id === 'qty-flooring');

  assert(
    standardPlankQty?.wastePercent === 10,
    'Straight plank flooring uses 10% waste allowance',
    `Got: ${standardPlankQty?.wastePercent}%`
  );
  assert(
    herringboneQty?.wastePercent === 15,
    'Herringbone parquet flooring uses 15% waste allowance',
    `Got: ${herringboneQty?.wastePercent}%`
  );

  // --------------------------------------------------------------------------
  // TEST 9: Change Dependency Engine & Non-Forced Structural State (Item 16 & 40)
  // --------------------------------------------------------------------------
  const nonStructuralInitial = createInitialProjectState({
    briefText: 'Kitchen refurbishment with new cabinets and herringbone floor',
    dimensions: { length: 5.0, width: 4.0 },
  });
  assert(
    !nonStructuralInitial.calculatedQuantities.some((q) => q.id === 'qty-steel-engineering-required'),
    'Initial non-structural project does not have structural steel'
  );

  // Modify dimension: 5x4m -> 6x4m
  const modifiedState = applyProjectChange(nonStructuralInitial, [
    {
      operationType: 'UPDATE_DIMENSION',
      targetSpace: 'primary',
      dimensionField: 'length',
      dimensionValue: 6.0,
      description: 'Made room 6m long',
    },
  ]);

  assert(
    modifiedState.spaces[0].lengthM.value === 6.0,
    'Primary space length updated to 6.0m',
    `Got length: ${modifiedState.spaces[0].lengthM.value}`
  );
  assert(
    modifiedState.spaces[0].areaM2.value === 24.0,
    'Primary space area recalculated to 24.0 m²',
    `Got area: ${modifiedState.spaces[0].areaM2.value}`
  );
  assert(
    !modifiedState.calculatedQuantities.some((q) => q.id === 'qty-steel-engineering-required'),
    'Structural steel was NOT injected by a dimension change (No forced structural bug)'
  );

  // --------------------------------------------------------------------------
  // TEST 10: Immutable Version Restore (Item 17)
  // --------------------------------------------------------------------------
  assert(
    modifiedState.versions.length === 2,
    'Version history stack incremented to 2 versions',
    `Versions count: ${modifiedState.versions.length}`
  );

  const restoredState = restoreProjectVersion(modifiedState, 1);
  assert(
    restoredState.spaces[0].lengthM.value === 5.0,
    'Restoring Version 1 cleanly restored length to 5.0m',
    `Restored length: ${restoredState.spaces[0].lengthM.value}`
  );
  assert(
    restoredState.spaces[0].areaM2.value === 20.0,
    'Restoring Version 1 cleanly restored area to 20.0 m²',
    `Restored area: ${restoredState.spaces[0].areaM2.value}`
  );

  // --------------------------------------------------------------------------
  // TEST 11: Unknown Property Era / Type Preserved (Item 3)
  // --------------------------------------------------------------------------
  const unstatedPropertyState = createInitialProjectState({
    briefText: 'I want a modern kitchen renovation',
  });
  assert(
    unstatedPropertyState.property.era.value === 'not_provided',
    'Unstated property era preserved as not_provided rather than defaulting to Victorian',
    `Got era: ${unstatedPropertyState.property.era.value}`
  );
  assert(
    unstatedPropertyState.property.type.value === 'not_provided',
    'Unstated building type preserved as not_provided rather than defaulting to Terraced',
    `Got type: ${unstatedPropertyState.property.type.value}`
  );

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
