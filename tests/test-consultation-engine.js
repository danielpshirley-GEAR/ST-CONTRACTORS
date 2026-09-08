/**
 * ST CONTRACTORS — FINAL MASTER REBUILD TEST SUITE
 * Verifies AI Project Consultation → Buying Report → Lead Conversion
 * Covers Regression Tests 1, 2, 3, 4, Confirmation Gate, and Buying Report Integrity.
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message, detail = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ [FAIL] ${message} ${detail ? `(Details: ${detail})` : ''}`);
  }
}

// Function to compile and evaluate TS files in Node CommonJS
function loadTsModule(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  // Strip relative import/export statements that node CommonJS might choke on
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;

  const m = { exports: {} };
  const fn = new Function('module', 'exports', 'require', '__dirname', '__filename', transpiled);
  fn(m, m.exports, (modPath) => {
    if (modPath.startsWith('@/') || modPath.startsWith('./') || modPath.startsWith('../')) {
      const resolved = modPath.startsWith('@/')
        ? path.join(__dirname, '..', 'src', modPath.slice(2))
        : path.resolve(path.dirname(filePath), modPath);
      const possibleExtensions = ['.ts', '.tsx', '/index.ts', ''];
      for (const ext of possibleExtensions) {
        const full = resolved + ext;
        if (fs.existsSync(full)) {
          return loadTsModule(full);
        }
      }
      return {};
    }
    return require(modPath);
  }, path.dirname(filePath), filePath);

  return m.exports;
}

console.log('================================================================');
console.log('ST CONTRACTORS — FINAL MASTER REBUILD VERIFICATION');
console.log('AI Consultation → Confirmation Gate → Buying Report');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// 1. FILE & ARCHITECTURE INTEGRITY
// -----------------------------------------------------------------------------
console.log('--- 1. FILE & COMPONENT INTEGRITY ---');

const REQUIRED_FILES = [
  'src/types/visualiser-scope.ts',
  'src/lib/visualiser/project-understanding-engine.ts',
  'src/lib/visualiser/next-best-question-engine.ts',
  'src/lib/visualiser/project-state-engine.ts',
  'src/components/visualiser/VisualiserLandingInput.tsx',
  'src/components/visualiser/ConsultationQuestionCard.tsx',
  'src/components/visualiser/PlanConfirmationCard.tsx',
  'src/components/visualiser/WhatCouldBeIncludedSection.tsx',
  'src/components/visualiser/DecisionsToMakeSection.tsx',
  'src/components/visualiser/ProjectConfiguratorSection.tsx',
  'src/components/visualiser/StickyProjectSummaryPanel.tsx',
  'src/components/visualiser/DesignVisualiserView.tsx',
];

REQUIRED_FILES.forEach((relPath) => {
  const fullPath = path.join(__dirname, '..', relPath);
  assert(fs.existsSync(fullPath), `File exists: ${relPath}`);
});

// Load modules dynamically
const understandingEngine = loadTsModule(path.join(__dirname, '../src/lib/visualiser/project-understanding-engine.ts'));
const questionEngine = loadTsModule(path.join(__dirname, '../src/lib/visualiser/next-best-question-engine.ts'));
const stateEngine = loadTsModule(path.join(__dirname, '../src/lib/visualiser/project-state-engine.ts'));

const { analyzeProjectBrief } = understandingEngine;
const { getNextBestQuestion } = questionEngine;
const { createInitialProjectState, evaluateReportDepth } = stateEngine;

// -----------------------------------------------------------------------------
// 2. REGRESSION TEST 1: GARAGE CONVERSION WITH DOORWAY
// -----------------------------------------------------------------------------
console.log('\n--- 2. REGRESSION TEST 1: GARAGE CONVERSION WITH DOORWAY ---');
const brief1 = 'GARAGE CONVERSION TO A ROOM, WITH DOORWAY TO THE CORRIDOR';
const under1 = analyzeProjectBrief({ briefText: brief1 });

assert(under1.primaryProject === 'garage-conversion', 'Identifies PRIMARY as garage-conversion (NOT door-replacement)', under1.primaryProject);
assert(under1.secondaryProjects.length > 0 && under1.secondaryProjects[0].type === 'door-replacement', 'Identifies SECONDARY as connecting doorway', JSON.stringify(under1.secondaryProjects));
assert(!under1.primaryProjectTitle.toLowerCase().includes('door replacement'), 'Primary title reflects garage conversion', under1.primaryProjectTitle);

// Verify Question Progression for Garage Conversion
const q1_1 = getNextBestQuestion(under1, []);
assert(q1_1 !== null, 'Generates first probing question for garage conversion');
assert(q1_1 && q1_1.id === 'garage_room_use', 'First question asks intended room use', q1_1 ? q1_1.id : 'null');
assert(q1_1 && q1_1.options.length >= 4, 'Provides 4+ room use options (office, gym, bedroom, playroom)', q1_1 ? q1_1.options.length : 0);

// Answer Q1 with Home Office
const answered1 = [
  { questionId: 'garage_room_use', questionText: q1_1.question, answerValue: 'office', answerLabel: 'Home Office / Studio' },
];
const under1_step2 = analyzeProjectBrief({ briefText: brief1, answeredQuestions: answered1 });
const q1_2 = getNextBestQuestion(under1_step2, answered1);

assert(q1_2 !== null, 'Generates second probing question for garage conversion');
assert(q1_2 && q1_2.id === 'garage_frontage', 'Second question asks garage frontage treatment', q1_2 ? q1_2.id : 'null');

// Pricing verification for Garage Conversion
const state1 = createInitialProjectState({ briefText: brief1 });
assert(state1.budgetAlignment.indicativeCostRange.min >= 15000, 'Budget reflects realistic garage conversion range (min >= £15k, NOT £1.8k)', state1.budgetAlignment.indicativeCostRange.formatted);
assert(state1.budgetAlignment.indicativeCostRange.max <= 35000, 'Budget max is within realistic conversion range (max <= £35k)', state1.budgetAlignment.indicativeCostRange.formatted);
assert(state1.reportDepth === 'moderate', 'Garage conversion report depth is "moderate" (NOT simple)', state1.reportDepth);

// -----------------------------------------------------------------------------
// 3. REGRESSION TEST 2: GARAGE ACCESS DOOR ONLY
// -----------------------------------------------------------------------------
console.log('\n--- 3. REGRESSION TEST 2: GARAGE ACCESS DOOR ONLY ---');
const brief2 = 'I want a new door between the hallway and garage.';
const under2 = analyzeProjectBrief({ briefText: brief2 });

assert(under2.primaryProject === 'door-replacement', 'Identifies PRIMARY as door-replacement', under2.primaryProject);
assert(under2.secondaryProjects.length === 0, 'No secondary conversion projects created for simple door', JSON.stringify(under2.secondaryProjects));

const q2_1 = getNextBestQuestion(under2, []);
assert(q2_1 !== null && q2_1.id === 'door_wall_type', 'First door question asks dividing wall construction', q2_1 ? q2_1.id : 'null');

// Pricing verification for Door
const state2 = createInitialProjectState({ briefText: brief2 });
assert(state2.budgetAlignment.indicativeCostRange.min === 1800, 'Garage door accurately priced at £1,800 min', state2.budgetAlignment.indicativeCostRange.formatted);
assert(state2.budgetAlignment.indicativeCostRange.max === 3500, 'Garage door accurately priced at £3,500 max', state2.budgetAlignment.indicativeCostRange.formatted);
assert(state2.reportDepth === 'simple', 'Door report depth evaluates to "simple"', state2.reportDepth);

// -----------------------------------------------------------------------------
// 4. REGRESSION TEST 3: BATHROOM WITH DIMENSIONS & FIXTURES
// -----------------------------------------------------------------------------
console.log('\n--- 4. REGRESSION TEST 3: BATHROOM WITH DIMENSIONS & FIXTURES ---');
const brief3 = 'I want to renovate my 2.4m x 2m bathroom with a walk-in shower, wall-hung vanity and microcement walls.';
const under3 = analyzeProjectBrief({ briefText: brief3 });

assert(under3.primaryProject === 'bathroom-renovation', 'Identifies PRIMARY as bathroom-renovation', under3.primaryProject);
assert(under3.knownDimensions !== undefined && under3.knownDimensions.length === 2.4 && under3.knownDimensions.width === 2, 'Extracts known dimensions 2.4m x 2m from brief', JSON.stringify(under3.knownDimensions));
assert(under3.requestedChanges.some((c) => c.toLowerCase().includes('walk-in shower')), 'Extracts walk-in shower fixture', JSON.stringify(under3.requestedChanges));
assert(under3.requestedChanges.some((c) => c.toLowerCase().includes('microcement')), 'Extracts microcement finish', JSON.stringify(under3.requestedChanges));

// Verify Question Engine does NOT ask dimensions again (Part 14)
const q3_1 = getNextBestQuestion(under3, []);
assert(q3_1 !== null && q3_1.id !== 'bath_dimensions', 'Does NOT ask for dimensions again since they were provided in the brief', q3_1 ? q3_1.id : 'null');
assert(q3_1 && q3_1.id === 'bath_subfloor', 'Directly probes high-impact subfloor rigidity for microcement', q3_1 ? q3_1.id : 'null');

// -----------------------------------------------------------------------------
// 5. REGRESSION TEST 4: DETAILED REAR EXTENSION BRIEF
// -----------------------------------------------------------------------------
console.log('\n--- 5. REGRESSION TEST 4: DETAILED REAR EXTENSION BRIEF ---');
const brief4 = '5m x 3.8m rear extension on a Victorian terraced house with open-plan kitchen, 3m quartz island, aluminium bifold doors and £80k budget';
const under4 = analyzeProjectBrief({ briefText: brief4 });

assert(under4.primaryProject === 'extension', 'Identifies PRIMARY as extension', under4.primaryProject);
assert(under4.knownDimensions !== undefined && under4.knownDimensions.length === 5 && under4.knownDimensions.width === 3.8, 'Extracts 5m x 3.8m dimensions', JSON.stringify(under4.knownDimensions));
assert(under4.budgetInfo !== undefined && under4.budgetInfo.amount === 80000, 'Extracts £80k budget from brief', JSON.stringify(under4.budgetInfo));

// Question engine does not ask dimensions or budget again
const q4_1 = getNextBestQuestion(under4, []);
assert(q4_1 !== null && q4_1.id !== 'ext_dimensions' && q4_1.id !== 'project_budget', 'Does not ask dimensions or budget again', q4_1 ? q4_1.id : 'null');

// -----------------------------------------------------------------------------
// 6. CONFIRMATION GATE & BUYING REPORT RULES
// -----------------------------------------------------------------------------
console.log('\n--- 6. CONFIRMATION GATE & BUYING REPORT RULES ---');

// Part 21 Confirmation Summary Structure
assert(under1.confirmationSummary.headline.includes('GARAGE CONVERSION'), 'Confirmation card displays clear headline', under1.confirmationSummary.headline);
assert(under1.confirmationSummary.mainRequirements.length >= 4, 'Confirmation summary lists key trade requirements', under1.confirmationSummary.mainRequirements.length);

// Rule 14 & Baseline Safety across Finish Tiers
const stateExt = createInitialProjectState({ briefText: brief4 });
assert(stateExt.finishTiers.every((t) => t.regulatoryBaselineMet), 'Rule 14 enforced: All finish tiers meet 100% statutory compliance');

// Dynamic Question labels
assert(q1_1.stageLabel === 'UNDERSTANDING YOUR PROJECT', 'Dynamic stage label 1 is informative');

// DesignVisualiserView has all 4 stages and gate check
const viewCode = fs.readFileSync(path.join(__dirname, '../src/components/visualiser/DesignVisualiserView.tsx'), 'utf8');
assert(viewCode.includes("consultationStage === 'input'"), 'DesignVisualiserView supports input stage');
assert(viewCode.includes("consultationStage === 'consultation'"), 'DesignVisualiserView supports consultation stage');
assert(viewCode.includes("consultationStage === 'confirmation'"), 'DesignVisualiserView supports confirmation stage');
assert(viewCode.includes("consultationStage === 'report'"), 'DesignVisualiserView supports report stage');
assert(viewCode.includes("PlanConfirmationCard"), 'PlanConfirmationCard wired as mandatory gate');
assert(viewCode.includes("StickyProjectSummaryPanel"), 'StickyProjectSummaryPanel wired in DesignVisualiserView');
assert(viewCode.includes("WhatCouldBeIncludedSection"), 'WhatCouldBeIncludedSection wired in DesignVisualiserView');
assert(viewCode.includes("DecisionsToMakeSection"), 'DecisionsToMakeSection wired in DesignVisualiserView');
assert(viewCode.includes("ProjectConfiguratorSection"), 'ProjectConfiguratorSection wired in DesignVisualiserView');

console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} PASSED (${failedTests} failed)`);
console.log('================================================================\n');

if (failedTests === 0) {
  console.log('ALL MASTER REBUILD CONSULTATION & BUYING TESTS PASSED WITH 100% SUCCESS!\n');
  process.exit(0);
} else {
  console.error(`FAILED: ${failedTests} assertions did not meet the Master Rebuild specification.\n`);
  process.exit(1);
}
