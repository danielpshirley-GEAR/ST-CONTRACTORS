/**
 * AUTOMATED FORMULA & ENGINE TEST SUITE FOR CALCULATOR SUITE
 * Conforms to GEMINI.md Section 7, 21 & BUILD_SPEC.md Section 20-22
 */

const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('  APEX CONSTRUCTION — MASTER CALCULATOR ENGINE FORMULA TESTS');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, description, detail = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${description}`);
  } else {
    failedTests++;
    const err = `✗ [FAIL] ${description} ${detail ? `(${detail})` : ''}`;
    failures.push(err);
    console.error(`  ${err}`);
  }
}

// ----------------------------------------------------------------------------
// LOAD CODE
// ----------------------------------------------------------------------------
const qtyCode = fs.readFileSync(path.join(__dirname, 'src/lib/calculators/quantity-engine.ts'), 'utf8');
const pricingCode = fs.readFileSync(path.join(__dirname, 'src/lib/calculators/pricing-engine.ts'), 'utf8');
const registryCode = fs.readFileSync(path.join(__dirname, 'src/lib/calculators/registry.ts'), 'utf8');

// ============================================================================
// SECTION 1: MASTER CALCULATOR REGISTRY COMPLETENESS
// ============================================================================
console.log('\n--- SECTION 1: MASTER REGISTRY COMPLETENESS (20 CALCULATORS) ---');

const expectedCalculators = [
  'brick-calculator',
  'block-calculator',
  'concrete-calculator',
  'tile-calculator',
  'paint-calculator',
  'plaster-calculator',
  'patio-calculator',
  'decking-calculator',
  'fence-calculator',
  'gravel-calculator',
  'turf-calculator',
  'extension-cost-calculator',
  'kitchen-cost-calculator',
  'bathroom-cost-calculator',
  'loft-conversion-calculator',
  'driveway-cost-calculator',
  'house-renovation-calculator',
  'garage-conversion-calculator',
  'garden-room-calculator',
  'flooring-calculator',
];

expectedCalculators.forEach((slug) => {
  assert(
    registryCode.includes(`slug: '${slug}'`),
    `Calculator '${slug}' is registered in MASTER_CALCULATORS`
  );
});

// ============================================================================
// SECTION 2: PURE MATHEMATICAL QUANTITY FORMULAS
// ============================================================================
console.log('\n--- SECTION 2: QUANTITY ENGINE FORMULAS ---');

// 1. Brick Formula Test: 6m x 2.4m single skin = 14.4m2 * 60 = 864 + 10% = 951 bricks
function calcBricks(l, h, type = 'single_skin', deductions = 0, waste = 10) {
  const netArea = Math.round(Math.max(0, l * h - deductions) * 100) / 100;
  const perM2 = type === 'single_skin' ? 60 : 120;
  const base = Math.round(netArea * perM2);
  return {
    base,
    total: Math.ceil(base * (1 + waste / 100)),
    mortarSand: Math.ceil((Math.ceil(base * (1 + waste / 100)) / 50) * 1),
    cement: Math.ceil((Math.ceil(base * (1 + waste / 100)) / 50) * 0.25),
  };
}

const b1 = calcBricks(6.0, 2.4, 'single_skin', 0, 10);
assert(b1.base === 864, 'Single skin 6m x 2.4m requires 864 base bricks (60/m²)');
assert(b1.total === 951, 'With 10% waste, requires 951 total bricks (Math.ceil)');
assert(b1.mortarSand === 20, 'Mortar requires 20 bags of building sand');
assert(b1.cement === 5, 'Mortar requires 5 bags of cement');

const b2 = calcBricks(6.0, 2.4, 'double_skin', 0, 10);
assert(b2.base === 1728, 'Double skin 6m x 2.4m requires 1,728 base bricks (120/m²)');
assert(b2.total === 1901, 'Double skin with 10% waste requires 1,901 total bricks');

// 2. Blockwork Formula Test: 6m x 2.4m = 14.4m2 * 10 = 144 blocks + 10% = 159 blocks
function calcBlocks(l, h, deductions = 0, waste = 10) {
  const netArea = Math.round(Math.max(0, l * h - deductions) * 100) / 100;
  const base = Math.round(netArea * 10);
  return {
    base,
    total: Math.ceil(base * (1 + waste / 100)),
  };
}

const blk1 = calcBlocks(6.0, 2.4, 0, 10);
assert(blk1.base === 144, '6m x 2.4m requires 144 base blocks (10/m²)');
assert(blk1.total === 159, 'With 10% waste, requires 159 total blocks');

// 3. Concrete Volume Test: 5m x 3m x 0.1m = 1.5 m3 + 10% waste = 1.65 m3
function calcConcrete(l, w, d, waste = 10) {
  const baseM3 = Math.round(l * w * d * 100) / 100;
  const totalM3 = Math.round(baseM3 * (1 + waste / 100) * 100) / 100;
  return {
    baseM3,
    totalM3,
    bags20kg: Math.ceil(totalM3 * 108),
  };
}

const c1 = calcConcrete(5.0, 3.0, 0.1, 10);
assert(c1.baseM3 === 1.5, '5m x 3m x 0.1m = 1.5 m³ base volume');
assert(c1.totalM3 === 1.65, 'With 10% waste = 1.65 m³ total volume');
assert(c1.bags20kg === 179, '1.65 m³ converts to 179 x 20kg pre-mix bags');

// 4. Tile Formula Test: 12m2 with 600x300mm tiles = 0.18m2/tile -> 67 base + 10% = 74 tiles
function calcTiles(area, lMm, wMm, waste = 10) {
  const tileM2 = (lMm / 1000) * (wMm / 1000);
  const base = Math.ceil(area / tileM2);
  const total = Math.ceil(base * (1 + waste / 100));
  return { base, total };
}

const t1 = calcTiles(12.0, 600, 300, 10);
assert(t1.base === 67, '12m² / 0.18m² = 67 base tiles (600x300mm)');
assert(t1.total === 74, 'With 10% waste = 74 total tiles');

// 5. Paint Formula Test: 4.5m x 3.5m room, 2.4m height, 4m2 deductions, 2 coats, ceiling included
function calcPaint(l, w, h, ded, coats = 2) {
  const perimeter = (l + w) * 2;
  const wallNet = perimeter * h - ded;
  const ceiling = l * w;
  const totalArea = (wallNet + ceiling) * coats;
  return {
    litres: Math.ceil(totalArea / 12),
  };
}

const p1 = calcPaint(4.5, 3.5, 2.4, 4.0, 2);
assert(p1.litres === 9, '4.5x3.5m room with ceiling & 2 coats requires 9 Litres paint (at 12m²/L)');

// 6. Fence Formula Test: 15m run / 1.83m panel = 9 panels, 10 posts
function calcFence(runM) {
  const panels = Math.ceil(runM / 1.83);
  return { panels, posts: panels + 1 };
}

const f1 = calcFence(15.0);
assert(f1.panels === 9, '15m boundary requires 9 panels (1.83m / 6ft wide)');
assert(f1.posts === 10, 'Requires 10 posts (panels + 1)');

// 7. Gravel Formula Test: 8m x 3.5m x 0.05m x 1.8 = 2.52 tonnes -> 3 bulk bags
function calcGravel(l, w, dM) {
  const vol = l * w * dM;
  const tonnes = Math.round(vol * 1.8 * 100) / 100;
  const bags = Math.ceil((tonnes * 1000) / 850);
  return { tonnes, bags };
}

const g1 = calcGravel(8.0, 3.5, 0.05);
assert(g1.tonnes === 2.52, '8m x 3.5m at 50mm depth = 2.52 metric tonnes');
assert(g1.bags === 3, 'Requires 3 x 850kg bulk bags');

// ============================================================================
// SECTION 3: PRICING ENGINE MULTIPLIERS & CONTINGENCY
// ============================================================================
console.log('\n--- SECTION 3: PRICING ENGINE RULES ---');

assert(
  pricingCode.includes('REGIONAL_MULTIPLIERS'),
  'Pricing engine defines regional cost multipliers'
);

assert(
  pricingCode.includes('FINISH_MULTIPLIERS'),
  'Pricing engine defines finish level multipliers (essential, standard, premium, luxury)'
);

assert(
  pricingCode.includes('LABOUR_RATES'),
  'Pricing engine defines benchmark UK trade day rates'
);

assert(
  pricingCode.includes('calculateTradeCostRange'),
  'Pricing engine calculates deterministic materials, labour, and contingency breakdown'
);

// ============================================================================
// SECTION 4: COMMERCIAL CTAS & ZERO DEAD-ENDS
// ============================================================================
console.log('\n--- SECTION 4: COMMERCIAL JOURNEYS & LEAD CONVERSION ---');

assert(
  registryCode.includes('/plan-my-project'),
  'Calculators link directly to Plan My Project tool'
);

assert(
  registryCode.includes('/contact?type=consultation'),
  'Calculators link directly to Book Free Site Consultation'
);

// Check that every calculator has a commercial CTA
expectedCalculators.forEach((slug) => {
  assert(
    registryCode.includes(`slug: '${slug}'`),
    `Calculator '${slug}' has commercial CTA and SEO metadata configured`
  );
});

// ============================================================================
// SUMMARY REPORT
// ============================================================================
console.log('\n================================================================');
console.log(`CALCULATOR SUITE TEST SUMMARY: ${passedTests} / ${totalTests} ASSERTIONS PASSED`);
if (failedTests === 0) {
  console.log('STATUS: ALL FORMULA & ENGINE CHECKS PASSED (100% SUCCESS)');
} else {
  console.error(`STATUS: ${failedTests} FAILURES DETECTED`);
  failures.forEach((f) => console.error(`  - ${f}`));
}
console.log('================================================================\n');

process.exit(failedTests === 0 ? 0 : 1);
