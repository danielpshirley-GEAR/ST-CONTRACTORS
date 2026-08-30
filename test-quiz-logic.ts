/**
 * Automated Verification Script for Project Quiz Logic
 * Tests every project path for strict isolation, conditional logic, and scope generation.
 */

import {
  ProjectType,
  PROJECT_TYPE_OPTIONS,
  MASTER_QUIZ_QUESTIONS,
  getQuestionsForProject,
} from './src/lib/planner/quiz-engine';
import {
  generateRoomByRoomScope,
  generateContextualRecommendations,
  interpretProjectDescription,
} from './src/lib/ai/planner';
import { ComprehensivePlannerInput } from './src/lib/ai/types';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
  }
}

console.log('====================================================');
console.log('STARTING AUTOMATED PROJECT QUIZ VERIFICATION TESTS');
console.log('====================================================\n');

// 1. TEST BATHROOM PATH
console.log('--- TEST 1: BATHROOM ISOLATION & LOGIC ---');
const bathroomQuestions = getQuestionsForProject('bathroom', { bathroom_layout_change: 'keep_same' });
assert(bathroomQuestions.length >= 5 && bathroomQuestions.length <= 10, 'Bathroom question count is within optimal 5-10 range', `Got ${bathroomQuestions.length}`);

const hasKitchenInBathroom = bathroomQuestions.some((q) =>
  q.title.toLowerCase().includes('kitchen') ||
  q.title.toLowerCase().includes('worktop') ||
  q.title.toLowerCase().includes('garden') ||
  q.title.toLowerCase().includes('driveway') ||
  q.title.toLowerCase().includes('loft')
);
assert(!hasKitchenInBathroom, 'Bathroom questions contain ZERO references to kitchen, garden, driveway or loft');

// Test Bathroom conditional layout question
const bathroomQuestionsWithLayoutChange = getQuestionsForProject('bathroom', { bathroom_layout_change: 'change_layout' });
assert(
  bathroomQuestionsWithLayoutChange.some((q) => q.id === 'bathroom_moved_fixtures'),
  'Bathroom shows "Which fixtures are you planning to move?" when layout change is selected'
);
assert(
  !bathroomQuestions.some((q) => q.id === 'bathroom_moved_fixtures'),
  'Bathroom hides "Which fixtures are you planning to move?" when layout stays the same'
);

// Test Bathroom Scope Generation
const bathroomInput: ComprehensivePlannerInput = {
  projectType: 'bathroom',
  customerGoals: ['Modernise bathroom'],
  propertyType: 'terraced',
  propertyAge: 'pre_1900',
  postcode: 'SW13 9AA',
  selectedAreas: [{ id: 'a1', name: 'Bathroom', sizeCategory: 'medium' }],
  finishLevel: 'premium',
  projectStatus: 'starting_to_plan',
  timeline: '1_3_months',
  budgetRange: 'under_25k',
};
const bathroomScope = generateRoomByRoomScope(bathroomInput, {
  bathroom_features: ['walkin_shower', 'toilet', 'vanity_sink', 'full_tiling', 'underfloor_heating'],
});
const hasKitchenInBathroomScope = bathroomScope.some((i) =>
  i.name.toLowerCase().includes('kitchen') ||
  i.name.toLowerCase().includes('bifold') ||
  i.name.toLowerCase().includes('dormer') ||
  i.name.toLowerCase().includes('tarmac')
);
assert(!hasKitchenInBathroomScope, 'Bathroom scope items contain ZERO cross-project items');
const bathroomRecs = generateContextualRecommendations(bathroomInput);
assert(
  bathroomRecs.every((r) => r.areaName === 'Bathroom' || r.category === 'Electrical & Lighting' || r.category === 'Plumbing & Heating'),
  'Bathroom recommendations are strictly bathroom relevant (extractor fan)'
);

// 2. TEST KITCHEN PATH
console.log('\n--- TEST 2: KITCHEN ISOLATION & LOGIC ---');
const kitchenQuestions = getQuestionsForProject('kitchen', { kitchen_wall_removal: 'no_walls' });
assert(kitchenQuestions.length >= 5 && kitchenQuestions.length <= 10, 'Kitchen question count is within optimal 5-10 range', `Got ${kitchenQuestions.length}`);

const hasBathroomInKitchen = kitchenQuestions.some((q) =>
  q.title.toLowerCase().includes('bathroom') ||
  q.title.toLowerCase().includes('bath ') ||
  q.title.toLowerCase().includes('toilet') ||
  q.title.toLowerCase().includes('driveway') ||
  q.title.toLowerCase().includes('loft')
);
assert(!hasBathroomInKitchen, 'Kitchen questions contain ZERO references to bathroom, driveway or loft');

// Test Kitchen conditional flush steel
const kitchenWithWallRemoval = getQuestionsForProject('kitchen', { kitchen_wall_removal: 'remove_wall' });
assert(
  kitchenWithWallRemoval.some((q) => q.id === 'kitchen_flush_steel'),
  'Kitchen shows "Do you want a hidden flush-ceiling steel beam?" when wall removal is selected'
);
assert(
  !kitchenQuestions.some((q) => q.id === 'kitchen_flush_steel'),
  'Kitchen hides flush steel question when wall removal is not selected'
);

// Test Kitchen Scope Generation
const kitchenInput: ComprehensivePlannerInput = {
  projectType: 'kitchen',
  customerGoals: ['Open plan kitchen'],
  propertyType: 'semi-detached',
  propertyAge: '1930_1960',
  postcode: 'W5 2UP',
  selectedAreas: [{ id: 'a1', name: 'Kitchen & Dining', sizeCategory: 'large' }],
  finishLevel: 'premium',
  projectStatus: 'starting_to_plan',
  timeline: '1_3_months',
  budgetRange: '50k_100k',
};
const kitchenScope = generateRoomByRoomScope(kitchenInput, {
  kitchen_wall_removal: 'remove_wall',
  kitchen_flush_steel: 'flush_steel',
  kitchen_features: ['kitchen_island', 'quartz_worktops', 'integrated_appliances', 'underfloor_heating'],
});
const hasBathroomInKitchenScope = kitchenScope.some((i) =>
  i.name.toLowerCase().includes('bathtub') ||
  i.name.toLowerCase().includes('freestanding bath') ||
  i.name.toLowerCase().includes('dormer')
);
assert(!hasBathroomInKitchenScope, 'Kitchen scope items contain ZERO bathroom fixtures');

// 3. TEST GARDEN PATH
console.log('\n--- TEST 3: GARDEN & LANDSCAPING ISOLATION & LOGIC ---');
const gardenQuestions = getQuestionsForProject('garden', {});
assert(gardenQuestions.length >= 5 && gardenQuestions.length <= 10, 'Garden question count is within optimal 5-10 range', `Got ${gardenQuestions.length}`);

const hasInternalInGarden = gardenQuestions.some((q) =>
  q.title.toLowerCase().includes('kitchen') ||
  q.title.toLowerCase().includes('bathroom') ||
  q.title.toLowerCase().includes('toilet') ||
  q.title.toLowerCase().includes('loft')
);
assert(!hasInternalInGarden, 'Garden questions contain ZERO internal kitchen or bathroom questions');

const gardenInput: ComprehensivePlannerInput = {
  projectType: 'garden',
  customerGoals: ['New porcelain patio'],
  propertyType: 'detached',
  propertyAge: '1960_1990',
  postcode: 'TW9 2LL',
  selectedAreas: [{ id: 'a1', name: 'Garden & Patio', sizeCategory: 'large' }],
  finishLevel: 'standard',
  projectStatus: 'starting_to_plan',
  timeline: '3_6_months',
  budgetRange: '25k_50k',
};
const gardenScope = generateRoomByRoomScope(gardenInput, {
  garden_scope: ['porcelain_patio', 'new_lawn', 'fencing_screens', 'garden_drainage'],
});
const hasKitchenInGardenScope = gardenScope.some((i) =>
  i.name.toLowerCase().includes('kitchen') ||
  i.name.toLowerCase().includes('bath') ||
  i.name.toLowerCase().includes('rewire')
);
assert(!hasKitchenInGardenScope, 'Garden scope contains ZERO kitchen or bathroom items');

// 4. TEST DRIVEWAY PATH
console.log('\n--- TEST 4: DRIVEWAY ISOLATION & LOGIC ---');
const drivewayQuestions = getQuestionsForProject('driveway', {});
assert(drivewayQuestions.length >= 5 && drivewayQuestions.length <= 10, 'Driveway question count is within optimal 5-10 range', `Got ${drivewayQuestions.length}`);

const drivewayInput: ComprehensivePlannerInput = {
  projectType: 'driveway',
  customerGoals: ['Resin driveway'],
  propertyType: 'semi-detached',
  propertyAge: '1930_1960',
  postcode: 'W4 1PR',
  selectedAreas: [{ id: 'a1', name: 'Driveway', sizeCategory: 'medium' }],
  finishLevel: 'premium',
  projectStatus: 'starting_to_plan',
  timeline: '1_3_months',
  budgetRange: '25k_50k',
};
const drivewayScope = generateRoomByRoomScope(drivewayInput, {
  driveway_surface: 'resin_bound',
  driveway_features: ['dropped_kerb', 'drainage_channel', 'ev_charger'],
});
assert(
  drivewayScope.some((i) => i.name.toLowerCase().includes('resin')),
  'Driveway scope correctly includes resin-bound surface'
);
assert(
  drivewayScope.some((i) => i.name.toLowerCase().includes('dropped kerb')),
  'Driveway scope correctly includes council dropped kerb'
);

// 5. TEST EXTENSION PATH
console.log('\n--- TEST 5: EXTENSION ISOLATION & LOGIC ---');
const extensionQuestions = getQuestionsForProject('extension', {});
assert(extensionQuestions.length >= 6 && extensionQuestions.length <= 12, 'Extension question count is balanced', `Got ${extensionQuestions.length}`);

// 6. TEST LOFT PATH
console.log('\n--- TEST 6: LOFT CONVERSION ISOLATION & LOGIC ---');
const loftQuestions = getQuestionsForProject('loft', {});
assert(loftQuestions.length >= 5 && loftQuestions.length <= 10, 'Loft question count is within optimal 5-10 range', `Got ${loftQuestions.length}`);

// 7. TEST FULL RENOVATION PATH
console.log('\n--- TEST 7: FULL RENOVATION ISOLATION & LOGIC ---');
const renoQuestions = getQuestionsForProject('full-renovation', {});
assert(renoQuestions.length >= 5 && renoQuestions.length <= 10, 'Full renovation question count is within optimal 5-10 range', `Got ${renoQuestions.length}`);

// 8. TEST NATURAL LANGUAGE INTERPRETATION
console.log('\n--- TEST 8: NATURAL LANGUAGE AI PROJECT DETECTION ---');
const interpBathroom = interpretProjectDescription("I'd like a walk-in shower instead of the bath and better storage.");
assert(interpBathroom.suggestedProjectType === 'bathroom', 'Correctly detects "bathroom" from shower/bath text');

const interpKitchen = interpretProjectDescription("We want to knock through the kitchen wall and add a quartz island.");
assert(interpKitchen.suggestedProjectType === 'kitchen', 'Correctly detects "kitchen" from kitchen island text');

const interpGarden = interpretProjectDescription("Need a new porcelain patio, composite decking and lawn.");
assert(interpGarden.suggestedProjectType === 'garden', 'Correctly detects "garden" from patio/decking text');

console.log('\n====================================================');
console.log(`ALL TESTS COMPLETED: ${passedTests}/${totalTests} PASSED (${failedTests} failures)`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
