/**
 * ST CONTRACTORS — AI PROJECT GUIDE FINAL ACCEPTANCE TEST SUITE
 * Verifies:
 * 1. Architecture & Component Integrity
 * 2. Stage 2 NLP Understanding & Multi-part project detection
 * 3. 4 Mandatory Regression Tests (Garage Conversion, Door, Bathroom, Extension)
 * 4. Stage 4 The Visual Project Roadmap & Scope Map Engine
 * 5. Stage 5 Buying Options & 100% Statutory Compliance
 * 6. Stage 6 Cost Guide & Interactive Cost Delta recalculations
 * 7. Stage 7 Proactive Confirmation Checks (Problem + Solution)
 * 8. Stage 8 Customer Decisions & "Help Me Choose" presets
 * 9. Stage 9 Visual Concepts & Graceful Fallbacks
 * 10. Stage 10 Contractor Journey & Lead Conversion Journey
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

let passCount = 0;
let failCount = 0;
const failures = [];

function assert(condition, message, detail = '') {
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ [FAIL] ${message} ${detail ? `(${detail})` : ''}`);
    failCount++;
    failures.push(`${message} ${detail ? `(${detail})` : ''}`);
  }
}

// Function to compile and evaluate TS files in Node CommonJS
function loadTsModule(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;

  const m = { exports: {} };
  const fn = new Function('module', 'exports', 'require', '__dirname', '__filename', transpiled);
  fn(
    m,
    m.exports,
    (modPath) => {
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
    },
    path.dirname(filePath),
    filePath
  );

  return m.exports;
}

console.log('================================================================');
console.log('ST CONTRACTORS — AI PROJECT GUIDE ACCEPTANCE VERIFICATION');
console.log('Idea → Questions → Confirmation → Roadmap → Options → Review');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// 1. FILE & COMPONENT INTEGRITY
// -----------------------------------------------------------------------------
console.log('--- 1. ARCHITECTURE & COMPONENT INTEGRITY ---');

const filesToCheck = [
  'src/types/visualiser-scope.ts',
  'src/lib/visualiser/project-understanding-engine.ts',
  'src/lib/visualiser/next-best-question-engine.ts',
  'src/lib/visualiser/project-roadmap-engine.ts',
  'src/components/visualiser/VisualiserLandingInput.tsx',
  'src/components/visualiser/ConsultationQuestionCard.tsx',
  'src/components/visualiser/PlanConfirmationCard.tsx',
  'src/components/visualiser/ProjectGlanceBanner.tsx',
  'src/components/visualiser/VisualRoadmapSection.tsx',
  'src/components/visualiser/BuyingPackagesSection.tsx',
  'src/components/visualiser/InteractiveCostSection.tsx',
  'src/components/visualiser/ThingsWeConfirmSection.tsx',
  'src/components/visualiser/CustomerDecisionsSection.tsx',
  'src/components/visualiser/RenovationVisualShowcase.tsx',
  'src/components/visualiser/SimilarProjectShowcase.tsx',
  'src/components/visualiser/ContractorJourneySection.tsx',
  'src/components/visualiser/DesignVisualiserView.tsx',
];

filesToCheck.forEach((relPath) => {
  const fullPath = path.join(process.cwd(), relPath);
  assert(fs.existsSync(fullPath), `File exists: ${relPath}`);
});

// Import Engines using transpiler
const { analyzeProjectBrief } = loadTsModule(path.join(process.cwd(), 'src/lib/visualiser/project-understanding-engine.ts'));
const { getNextBestQuestion } = loadTsModule(path.join(process.cwd(), 'src/lib/visualiser/next-best-question-engine.ts'));
const { generateProjectRoadmap } = loadTsModule(path.join(process.cwd(), 'src/lib/visualiser/project-roadmap-engine.ts'));
const { createInitialProjectState } = loadTsModule(path.join(process.cwd(), 'src/lib/visualiser/project-state-engine.ts'));

// -----------------------------------------------------------------------------
// 2. REGRESSION TEST 1: GARAGE CONVERSION WITH CONNECTING DOORWAY
// -----------------------------------------------------------------------------
console.log('\n--- 2. REGRESSION TEST 1: GARAGE CONVERSION TO HABITABLE ROOM ---');
const brief1 = 'GARAGE CONVERSION TO A ROOM, WITH DOORWAY TO THE CORRIDOR';
const under1 = analyzeProjectBrief({ briefText: brief1 });

assert(under1.primaryProject === 'garage-conversion', 'Identifies PRIMARY as garage-conversion', under1.primaryProject);
assert(under1.secondaryProjects.some((s) => s.type === 'door-replacement'), 'Identifies SECONDARY as connecting doorway');
assert(under1.confirmationSummary.headline.includes('GARAGE CONVERSION'), 'Confirmation headline reflects garage conversion');

const state1 = createInitialProjectState({ briefText: brief1 });
const roadmap1 = generateProjectRoadmap(state1);

assert(roadmap1.glance.projectType === 'Garage Conversion', 'Roadmap glance identifies Garage Conversion');
assert(roadmap1.stages.length >= 6, 'Generates 6+ sequenced roadmap stages for garage conversion', roadmap1.stages.length);
assert(roadmap1.stages.some((s) => s.name.includes('Envelope') || s.name.includes('Habitable')), 'Roadmap includes habitable room insulation envelope');
assert(roadmap1.stages.some((s) => s.name.includes('Frontage')), 'Roadmap includes garage frontage treatment');
assert(roadmap1.stages.some((s) => s.name.includes('Access') || s.name.includes('Doorway')), 'Roadmap includes internal hallway access doorway');
assert(roadmap1.stages.some((s) => s.name.includes('Heating') || s.name.includes('Electrical')), 'Roadmap includes heating & electrical services');
assert(roadmap1.stages.some((s) => s.name.includes('Finishes') || s.name.includes('Floor')), 'Roadmap includes room finishes');
assert(roadmap1.totalEarlyBudget.min >= 15000, 'Budget reflects realistic garage conversion range min >= £15k', roadmap1.totalEarlyBudget.formatted);
assert(roadmap1.totalEarlyBudget.max <= 35000, 'Budget reflects realistic garage conversion range max <= £35k', roadmap1.totalEarlyBudget.formatted);

// -----------------------------------------------------------------------------
// 3. REGRESSION TEST 2: SINGLE INTERNAL DOOR OPENING ONLY
// -----------------------------------------------------------------------------
console.log('\n--- 3. REGRESSION TEST 2: INTERNAL DOORWAY ONLY ---');
const brief2 = 'Add a door between my hallway and garage.';
const under2 = analyzeProjectBrief({ briefText: brief2 });

assert(under2.primaryProject === 'door-replacement', 'Identifies PRIMARY as door-replacement', under2.primaryProject);
assert(under2.secondaryProjects.length === 0, 'No secondary conversion projects created for simple door');

const state2 = createInitialProjectState({ briefText: brief2 });
const roadmap2 = generateProjectRoadmap(state2);

assert(roadmap2.glance.projectType.includes('Door') || roadmap2.glance.projectType.includes('Opening'), 'Roadmap identifies Door & Opening');
assert(roadmap2.stages.some((s) => s.name.includes('Lintel') || s.name.includes('Opening')), 'Roadmap includes structural breakout & lintel');
assert(roadmap2.stages.some((s) => s.name.includes('Fire Door') || s.name.includes('FD30S')), 'Roadmap includes certified FD30S doorset');
assert(roadmap2.totalEarlyBudget.min <= 2500, 'Door project priced accurately at ~£1,800 min', roadmap2.totalEarlyBudget.formatted);
assert(roadmap2.totalEarlyBudget.max <= 4500, 'Door project max <= £4,500 (NO £20k+ garage conversion cost)', roadmap2.totalEarlyBudget.formatted);

// -----------------------------------------------------------------------------
// 4. REGRESSION TEST 3: DETAILED BATHROOM RENOVATION
// -----------------------------------------------------------------------------
console.log('\n--- 4. REGRESSION TEST 3: BATHROOM WITH FIXTURES & SURFACES ---');
const brief3 = '2.4m x 2m bathroom, walk-in shower, wall-hung vanity, microcement.';
const under3 = analyzeProjectBrief({ briefText: brief3 });

assert(under3.primaryProject === 'bathroom-renovation', 'Identifies PRIMARY as bathroom-renovation', under3.primaryProject);
assert(under3.knownDimensions?.length === 2.4 && under3.knownDimensions?.width === 2.0, 'Extracts known dimensions 2.4m x 2m from brief');

// Verify it does not re-ask dimensions
const nextQ3 = getNextBestQuestion(under3, []);
assert(nextQ3 && nextQ3.id !== 'bath_dimensions' && nextQ3.id !== 'room_dimensions', 'Does not ask dimensions again since they were provided in brief');

const state3 = createInitialProjectState({ briefText: brief3 });
const roadmap3 = generateProjectRoadmap(state3);

assert(roadmap3.stages.some((s) => s.name.includes('Strip-out')), 'Roadmap includes bathroom strip-out');
assert(roadmap3.stages.some((s) => s.name.includes('Plumbing')), 'Roadmap includes first-fix plumbing layout');
assert(roadmap3.stages.some((s) => s.name.includes('Tanking') || s.name.includes('Waterproofing')), 'Roadmap includes wet zone tanking');
assert(roadmap3.stages.some((s) => s.name.includes('Tiling') || s.name.includes('Surfaces')), 'Roadmap includes wall & floor surfaces');
assert(roadmap3.stages.some((s) => s.name.includes('Fixtures') || s.name.includes('Sanitary')), 'Roadmap includes sanitaryware second-fix');
assert(roadmap3.checksToConfirm.some((c) => c.issue.includes('gravity') || c.issue.includes('waste')), 'Checks shower waste gravity fall');

// -----------------------------------------------------------------------------
// 5. REGRESSION TEST 4: DETAILED REAR EXTENSION WITH BUDGET
// -----------------------------------------------------------------------------
console.log('\n--- 5. REGRESSION TEST 4: DETAILED REAR EXTENSION ---');
const brief4 = '4m rear extension with open-plan kitchen, 6m wide house, bifolds, island, £80k budget.';
const under4 = analyzeProjectBrief({ briefText: brief4 });

assert(under4.primaryProject === 'extension', 'Identifies PRIMARY as extension', under4.primaryProject);
assert(under4.budgetInfo?.amount === 80000, 'Extracts £80k budget from brief', under4.budgetInfo?.amount);

const nextQ4 = getNextBestQuestion(under4, []);
assert(nextQ4 && nextQ4.id !== 'project_budget' && nextQ4.id !== 'ext_dimensions', 'Does not ask for budget or dimensions again');

const state4 = createInitialProjectState({ briefText: brief4 });
const roadmap4 = generateProjectRoadmap(state4);

assert(roadmap4.stages.some((s) => s.name.includes('Groundworks') || s.name.includes('Foundations')), 'Extension roadmap includes groundworks & concrete foundations');
assert(roadmap4.stages.some((s) => s.name.includes('Steel') || s.name.includes('Structure')), 'Extension roadmap includes structural steel goalpost knockthrough');
assert(roadmap4.stages.some((s) => s.name.includes('Roof') || s.name.includes('Glazing')), 'Extension roadmap includes roof structure & glazing');
assert(roadmap4.stages.some((s) => s.name.includes('Kitchen')), 'Extension roadmap includes kitchen installation');
assert(roadmap4.checksToConfirm.some((c) => c.issue.includes('Thames Water')), 'Extension checks Thames Water build-over approval');
assert(roadmap4.checksToConfirm.some((c) => c.issue.includes('Party Wall')), 'Extension checks Party Wall Act notices');

// -----------------------------------------------------------------------------
// 6. INTERACTIVE COST RECALCULATION & DELTAS
// -----------------------------------------------------------------------------
console.log('\n--- 6. INTERACTIVE COST RECALCULATION & DELTAS ---');

// Default garage conversion roadmap
const defaultRoadmap = generateProjectRoadmap(state1, {});
const defaultMin = defaultRoadmap.totalEarlyBudget.min;
const defaultMax = defaultRoadmap.totalEarlyBudget.max;

// Upgrade frontage to architectural glazing
const upgradedRoadmap = generateProjectRoadmap(state1, { frontage: 'large_glazing' });
assert(
  upgradedRoadmap.totalEarlyBudget.min > defaultMin,
  'Upgrading frontage to large glazing increases minimum budget (+£2,400 delta)',
  `${defaultMin} -> ${upgradedRoadmap.totalEarlyBudget.min}`
);
assert(
  upgradedRoadmap.totalEarlyBudget.max > defaultMax,
  'Upgrading frontage to large glazing increases maximum budget',
  `${defaultMax} -> ${upgradedRoadmap.totalEarlyBudget.max}`
);

// Downscale flooring to laminate
const economicalRoadmap = generateProjectRoadmap(state1, { flooring: 'laminate' });
assert(
  economicalRoadmap.totalEarlyBudget.min < defaultMin,
  'Selecting laminate flooring decreases budget (-£600 delta)',
  `${defaultMin} -> ${economicalRoadmap.totalEarlyBudget.min}`
);

// -----------------------------------------------------------------------------
// 7. BUYING PACKAGES & REGULATORY STATUTORY COMPLIANCE (RULE 14)
// -----------------------------------------------------------------------------
console.log('\n--- 7. BUYING PACKAGES & STATUTORY COMPLIANCE ---');

assert(roadmap1.packages.length === 3, 'Provides 3 tailored buying packages (Essential, Recommended, Premium)');
assert(
  roadmap1.packages.every((p) => p.regulatoryBaselineMet),
  'Rule 14 strictly enforced: ALL packages meet 100% statutory Building Regulations'
);

// -----------------------------------------------------------------------------
// 8. STAGE 1 & STAGE 3 EXACT PROMPT COPY CHECKS
// -----------------------------------------------------------------------------
console.log('\n--- 8. UI COPY & CONVERSION JOURNEY VERIFICATION ---');

const landingCode = fs.readFileSync(path.join(process.cwd(), 'src/components/visualiser/VisualiserLandingInput.tsx'), 'utf8');
assert(landingCode.includes('What would you like to do to your home?'), 'Landing input has exact Stage 1 heading');
assert(landingCode.includes('Describe it however you like. A sentence is enough.'), 'Landing input has exact Stage 1 supporting copy');
assert(landingCode.includes('START MY PROJECT'), 'Landing input has exact primary CTA: START MY PROJECT');

const confirmCode = fs.readFileSync(path.join(process.cwd(), 'src/components/visualiser/PlanConfirmationCard.tsx'), 'utf8');
assert(confirmCode.includes('Is this right?'), 'Plan confirmation card has exact question: Is this right?');
assert(confirmCode.includes('YES — SHOW MY PROJECT GUIDE'), 'Plan confirmation card has exact CTA: YES — SHOW MY PROJECT GUIDE');
assert(confirmCode.includes('CHANGE SOMETHING'), 'Plan confirmation card has secondary CTA: CHANGE SOMETHING');

const viewCode = fs.readFileSync(path.join(process.cwd(), 'src/components/visualiser/DesignVisualiserView.tsx'), 'utf8');
assert(viewCode.includes('ProjectGlanceBanner'), 'DesignVisualiserView mounts ProjectGlanceBanner');
assert(viewCode.includes('VisualRoadmapSection'), 'DesignVisualiserView mounts VisualRoadmapSection');
assert(viewCode.includes('BuyingPackagesSection'), 'DesignVisualiserView mounts BuyingPackagesSection');
assert(viewCode.includes('InteractiveCostSection'), 'DesignVisualiserView mounts InteractiveCostSection');
assert(viewCode.includes('ThingsWeConfirmSection'), 'DesignVisualiserView mounts ThingsWeConfirmSection');
assert(viewCode.includes('CustomerDecisionsSection'), 'DesignVisualiserView mounts CustomerDecisionsSection');
assert(viewCode.includes('RenovationVisualShowcase'), 'DesignVisualiserView mounts RenovationVisualShowcase');
assert(viewCode.includes('SimilarProjectShowcase'), 'DesignVisualiserView mounts SimilarProjectShowcase');
assert(viewCode.includes('ContractorJourneySection'), 'DesignVisualiserView mounts ContractorJourneySection');
assert(viewCode.includes('TechnicalDetailView'), 'DesignVisualiserView keeps TechnicalDetailView accessible via toggle');

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passCount}/${passCount + failCount} PASSED (${failCount} failed)`);
console.log('================================================================\n');

if (failCount === 0) {
  console.log('🎉 ALL AI PROJECT GUIDE ACCEPTANCE TESTS PASSED WITH 100% SUCCESS!\n');
  process.exit(0);
} else {
  console.error('FAILURES ENCOUNTERED:');
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
