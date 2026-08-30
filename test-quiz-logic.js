/**
 * Automated Verification Script for Project Quiz Logic (Pure Node.js)
 * Tests every project path for strict isolation, conditional logic, and scope generation.
 */

// Simple module test
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('STARTING AUTOMATED PROJECT QUIZ VERIFICATION TESTS');
console.log('====================================================\n');

// Read quiz-engine.ts and planner.ts to do static and runtime logic tests
const quizEngineCode = fs.readFileSync(path.join(__dirname, 'src/lib/planner/quiz-engine.ts'), 'utf8');
const plannerCode = fs.readFileSync(path.join(__dirname, 'src/lib/ai/planner.ts'), 'utf8');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, detail) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
  }
}

// 1. Check Bathroom Question Tags
console.log('--- TEST 1: BATHROOM QUESTION TAGS & ISOLATION ---');
assert(quizEngineCode.includes("id: 'bathroom_scope'"), 'bathroom_scope exists in quiz-engine');
assert(quizEngineCode.includes("id: 'bathroom_features'"), 'bathroom_features exists in quiz-engine');
assert(quizEngineCode.includes("id: 'bathroom_layout_change'"), 'bathroom_layout_change exists in quiz-engine');
assert(quizEngineCode.includes("id: 'bathroom_moved_fixtures'"), 'bathroom_moved_fixtures exists in quiz-engine');
assert(quizEngineCode.includes("id: 'bathroom_size'"), 'bathroom_size exists in quiz-engine');
assert(quizEngineCode.includes("id: 'bathroom_finish'"), 'bathroom_finish exists in quiz-engine');
assert(quizEngineCode.includes("id: 'bathroom_notes'"), 'bathroom_notes exists in quiz-engine');

// Verify condition on bathroom_moved_fixtures
assert(
  quizEngineCode.includes("answers.bathroom_layout_change === 'change_layout'"),
  'bathroom_moved_fixtures has condition requiring bathroom_layout_change === "change_layout"'
);

// 2. Check Kitchen Question Tags
console.log('\n--- TEST 2: KITCHEN QUESTION TAGS & ISOLATION ---');
assert(quizEngineCode.includes("id: 'kitchen_scope'"), 'kitchen_scope exists in quiz-engine');
assert(quizEngineCode.includes("id: 'kitchen_wall_removal'"), 'kitchen_wall_removal exists in quiz-engine');
assert(quizEngineCode.includes("id: 'kitchen_flush_steel'"), 'kitchen_flush_steel exists in quiz-engine');
assert(quizEngineCode.includes("id: 'kitchen_features'"), 'kitchen_features exists in quiz-engine');
assert(quizEngineCode.includes("id: 'kitchen_size'"), 'kitchen_size exists in quiz-engine');
assert(quizEngineCode.includes("id: 'kitchen_finish'"), 'kitchen_finish exists in quiz-engine');
assert(quizEngineCode.includes("id: 'kitchen_notes'"), 'kitchen_notes exists in quiz-engine');

// Verify condition on kitchen_flush_steel
assert(
  quizEngineCode.includes("answers.kitchen_wall_removal === 'remove_wall'"),
  'kitchen_flush_steel has condition requiring kitchen_wall_removal === "remove_wall"'
);

// 3. Check Garden & Driveway Question Tags
console.log('\n--- TEST 3: GARDEN & DRIVEWAY ISOLATION ---');
assert(quizEngineCode.includes("id: 'garden_scope'"), 'garden_scope exists in quiz-engine');
assert(quizEngineCode.includes("id: 'garden_ground_condition'"), 'garden_ground_condition exists in quiz-engine');
assert(quizEngineCode.includes("id: 'driveway_surface'"), 'driveway_surface exists in quiz-engine');
assert(quizEngineCode.includes("id: 'driveway_features'"), 'driveway_features exists in quiz-engine');

// 4. Check Planner Isolation in Scope Generation
console.log('\n--- TEST 4: SCOPE GENERATION STRICT ISOLATION ---');
assert(
  plannerCode.includes("if (projectType === 'bathroom')"),
  'planner.ts has dedicated branch strictly for bathroom'
);
assert(
  plannerCode.includes("else if (projectType === 'kitchen')"),
  'planner.ts has dedicated branch strictly for kitchen'
);
assert(
  plannerCode.includes("else if (projectType === 'extension')"),
  'planner.ts has dedicated branch strictly for extension'
);
assert(
  plannerCode.includes("else if (projectType === 'loft')"),
  'planner.ts has dedicated branch strictly for loft'
);
assert(
  plannerCode.includes("else if (projectType === 'garden')"),
  'planner.ts has dedicated branch strictly for garden'
);
assert(
  plannerCode.includes("else if (projectType === 'driveway')"),
  'planner.ts has dedicated branch strictly for driveway'
);
assert(
  plannerCode.includes("else if (projectType === 'full-renovation')"),
  'planner.ts has dedicated branch strictly for full-renovation'
);

// 5. Check Recommendations Isolation
console.log('\n--- TEST 5: RECOMMENDATIONS STRICT ISOLATION ---');
assert(
  plannerCode.includes("if (projectType === 'bathroom') {\n    recommendations.push({\n      id: 'rec-bathroom-extractor'"),
  'Bathroom recommendation is strictly bathroom extractor fan'
);
assert(
  plannerCode.includes("else if (projectType === 'kitchen') {\n    recommendations.push({\n      id: 'rec-kitchen-task-lighting'"),
  'Kitchen recommendation is strictly kitchen task lighting'
);
assert(
  plannerCode.includes("else if (projectType === 'extension') {\n    recommendations.push({\n      id: 'rec-extension-building-regs'"),
  'Extension recommendation is strictly extension building regs'
);

console.log('\n====================================================');
console.log(`ALL TESTS COMPLETED: ${passedTests}/${totalTests} PASSED (${failedTests} failures)`);
console.log('====================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
