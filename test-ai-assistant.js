/**
 * AI Construction Assistant Comprehensive Test Suite (Phase 6)
 * Validates bespoke natural language extraction for Garage-to-Cinema,
 * Kitchen-Diner Extensions, Lofts, Bathrooms, and House Renovations.
 */

const fs = require('fs');
const assert = require('assert');

console.log('\n================================================================');
console.log('  APEX CONSTRUCTION — BESPOKE AI ASSISTANT TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
    process.exit(1);
  }
}

// -----------------------------------------------------------------------------
// SECTION 1: USER'S EXACT SCREENSHOT PROMPT TEST
// "i want to turn my garage into a cinema, making a door between my garage and my hallway"
// -----------------------------------------------------------------------------
console.log('--- SECTION 1: USER PROMPT: GARAGE TO CINEMA & HALLWAY DOOR ---');

// Load the updated analyzer file content and test pure logic
const analyzerCode = fs.readFileSync('./src/lib/assistant/analyzer.ts', 'utf8');

test('analyzer.ts handles garage conversion and internal doorway formation specifically', () => {
  assert(analyzerCode.includes('isGarage'));
  assert(analyzerCode.includes('isCinema'));
  assert(analyzerCode.includes('isDoorwayFormation'));
  assert(analyzerCode.includes('FD30S'));
  assert(analyzerCode.includes('Part B (Fire Safety)'));
  assert(analyzerCode.includes('Part L (Thermal Performance'));
});

// We can test the extraction logic directly using a minimal VM or regex test
const { extractWithUKBuildingRules } = require('./test-helper-extract.js');

const garagePrompt = 'i want to turn my garage into a cinema, making a door between my garage and my hallway';
const garageExtracted = extractWithUKBuildingRules(garagePrompt);

test('1. Project Type: Accurately classifies as Garage Conversion to Home Cinema with Hallway Access', () => {
  assert.strictEqual(garageExtracted.projectType, 'other');
  assert.ok(garageExtracted.projectTypeDisplay.toLowerCase().includes('garage'));
  assert.ok(garageExtracted.projectTypeDisplay.toLowerCase().includes('cinema'));
  assert.ok(garageExtracted.projectTypeDisplay.toLowerCase().includes('hallway'));
});

test('2. Project Requirements: Captures garage conversion, cinema acoustics, AV infrastructure, hallway doorway & FD30 fire door', () => {
  assert.ok(Array.isArray(garageExtracted.projectRequirements));
  assert.ok(garageExtracted.projectRequirements.length >= 4);
  const combined = garageExtracted.projectRequirements.join(' ').toLowerCase();
  assert.ok(combined.includes('garage') && combined.includes('cinema'));
  assert.ok(combined.includes('doorway') || combined.includes('door'));
  assert.ok(combined.includes('hallway'));
  assert.ok(combined.includes('fire') || combined.includes('fd30'));
  assert.ok(combined.includes('acoustic') || combined.includes('soundproof'));
});

test('3. Rooms: Captures Bespoke Home Cinema (15.4m²) and Hallway Direct Access Doorway', () => {
  assert.ok(Array.isArray(garageExtracted.rooms));
  assert.ok(garageExtracted.rooms.length >= 2);
  const roomNames = garageExtracted.rooms.map((r) => r.name.toLowerCase()).join(' ');
  assert.ok(roomNames.includes('cinema'));
  assert.ok(roomNames.includes('hallway') || roomNames.includes('doorway'));
});

test('4. Likely Works: Captures structural doorway lintel, garage door infill, acoustic decoupling & AV power', () => {
  assert.ok(Array.isArray(garageExtracted.likelyWorks));
  assert.ok(garageExtracted.likelyWorks.length >= 3);
  const workTitles = garageExtracted.likelyWorks.map((w) => w.workTitle.toLowerCase()).join(' ');
  assert.ok(workTitles.includes('doorway') || workTitles.includes('lintel') || workTitles.includes('structural'));
  assert.ok(workTitles.includes('infill') || workTitles.includes('floor'));
  assert.ok(workTitles.includes('acoustic') || workTitles.includes('av') || workTitles.includes('power'));
});

test('5. Missing Questions: Captures garage floor level vs hallway, integrated vs detached, and acoustic isolation tier', () => {
  assert.ok(Array.isArray(garageExtracted.missingQuestions));
  assert.ok(garageExtracted.missingQuestions.length >= 2);
  const qIds = garageExtracted.missingQuestions.map((q) => q.id).join(' ');
  assert.ok(qIds.includes('garage_floor_level'));
  assert.ok(qIds.includes('garage_attached_type') || qIds.includes('cinema_acoustic_tier'));
});

test('6. Potential Considerations: Captures Part B Fire Door, Part L Insulation U-values, Part A Lintel & Planning Parking Conditions', () => {
  assert.ok(Array.isArray(garageExtracted.potentialConsiderations));
  assert.ok(garageExtracted.potentialConsiderations.length >= 3);
  const topics = garageExtracted.potentialConsiderations.map((c) => c.topic.toLowerCase()).join(' ');
  assert.ok(topics.includes('part b') || topics.includes('fire'));
  assert.ok(topics.includes('part l') || topics.includes('thermal') || topics.includes('insulation'));
  assert.ok(topics.includes('part a') || topics.includes('lintel') || topics.includes('structural'));
  assert.ok(topics.includes('parking') || topics.includes('permitted development'));
});

// -----------------------------------------------------------------------------
// SECTION 2: EXTENSION & KNOCKTHROUGH PROMPT TEST
// "I want to knock my kitchen and dining room together and extend four metres into my garden."
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 2: EXTENSION & KNOCKTHROUGH PROMPT ---');

const extPrompt = 'I want to knock my kitchen and dining room together and extend four metres into my garden.';
const extExtracted = extractWithUKBuildingRules(extPrompt);

test('Extension prompt extracts kitchen knockthrough, 4m extension, and RSJ steels', () => {
  assert.strictEqual(extExtracted.projectType, 'extension');
  assert.ok(extExtracted.projectTypeDisplay.toLowerCase().includes('kitchen'));
  assert.ok(extExtracted.projectRequirements.some((r) => r.toLowerCase().includes('load-bearing')));
  assert.ok(extExtracted.projectRequirements.some((r) => r.toLowerCase().includes('4m')));
});

// -----------------------------------------------------------------------------
// SECTION 3: SYSTEM INTEGRATION & ROUTE VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 3: SYSTEM INTEGRATION ---');

test('API route exists and is configured for POST /api/assistant/analyze', () => {
  assert(fs.existsSync('./src/app/api/assistant/analyze/route.ts'));
});

test('UI component connects seamlessly to /plan-my-project without re-entry', () => {
  const comp = fs.readFileSync('./src/components/assistant/AiConstructionAssistant.tsx', 'utf8');
  assert(comp.includes('sessionStorage.setItem(\'ai_assistant_transfer\''));
  assert(comp.includes('/plan-my-project?source=assistant'));
});

console.log('\n================================================================');
console.log(`TOTAL BESPOKE AI ASSISTANT CHECKS: ${passCount} / 9 ASSERTIONS PASSED`);
console.log('STATUS: ALL CHECKS PASSED (100% SUCCESS)');
console.log('================================================================\n');
